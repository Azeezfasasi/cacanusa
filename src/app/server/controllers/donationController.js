import Donation from '../models/Donation';
import { NextResponse } from 'next/server';
import { sendEmail } from '../services/emailService';

// Create a new donation
export async function createDonation(req) {
  try {
    const body = await req.json();
    
    const {
      donorName,
      donorEmail,
      donorPhone,
      donorMessage,
      amount,
      currency,
      donationType,
      paymentMethod,
      referenceNumber,
    } = body;

    // Validate required fields
    if (!donorName || !donorEmail || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transaction ID
    const transactionId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const donation = new Donation({
      donorName,
      donorEmail,
      donorPhone,
      donorMessage,
      amount,
      currency,
      donationType,
      paymentMethod,
      transactionId,
      referenceNumber,
    });

    await donation.save();

    // Send confirmation email to donor
    try {
      await sendEmail({
        to: donorEmail,
        subject: 'Donation Confirmation - CANAN USA',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Donation Received</h2>
            <p>Dear ${donorName},</p>
            <p>Thank you for your generous donation to CANAN USA. Your contribution means a lot to us.</p>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
              <p><strong>Amount:</strong> ${currency} ${amount}</p>
              <p><strong>Type:</strong> ${donationType}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>A receipt will be sent to you once your donation has been confirmed by our team.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>God bless you!</p>
            <p>CANAN USA Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the donation creation if email fails
    }

    return NextResponse.json(
      {
        message: 'Donation received successfully',
        donation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Donation creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating donation' },
      { status: 500 }
    );
  }
}

// Get all donations (admin only)
export async function getAllDonations(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const donationType = searchParams.get('donationType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = {};

    if (status) query.status = status;
    if (donationType) query.donationType = donationType;

    const skip = (page - 1) * limit;

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('processedBy', 'firstName lastName email');

    const total = await Donation.countDocuments(query);

    return NextResponse.json(
      {
        donations,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching donations' },
      { status: 500 }
    );
  }
}

// Get donation by ID
export async function getDonationById(id) {
  try {
    const donation = await Donation.findById(id).populate(
      'processedBy',
      'firstName lastName email'
    );

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(donation, { status: 200 });
  } catch (error) {
    console.error('Get donation error:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching donation' },
      { status: 500 }
    );
  }
}

// Update donation status
export async function updateDonationStatus(body, donationId) {
  try {
    const { status, notes } = body;

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        status,
        notes,
        processedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(donation, { status: 200 });
  } catch (error) {
    console.error('Update donation error:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating donation' },
      { status: 500 }
    );
  }
}

// Send receipt email
export async function sendReceiptEmail(donationId) {
  try {
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    const receiptNumber = `RECEIPT-${donation._id.toString().slice(-8).toUpperCase()}`;

    await sendEmail({
      to: donation.donorEmail,
      subject: `Donation Receipt #${receiptNumber} - CANAN USA`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Official Donation Receipt</h2>
          <p>Dear ${donation.donorName},</p>
          <p>Thank you for your generous donation to CANAN USA.</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Donation Details</h3>
            <p><strong>Receipt Number:</strong> ${receiptNumber}</p>
            <p><strong>Transaction ID:</strong> ${donation.transactionId}</p>
            <p><strong>Amount:</strong> ${donation.currency} ${donation.amount}</p>
            <p><strong>Donation Type:</strong> ${donation.donationType}</p>
            <p><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
          </div>
          <p>This receipt is for your tax records. CANAN USA is a registered non-profit organization.</p>
          <p>Your generous support enables us to continue our mission of serving the community.</p>
          <p>God bless you!</p>
          <p><strong>CANAN USA Team</strong></p>
        </div>
      `,
    });

    // Update donation record
    donation.receiptSent = true;
    donation.receiptSentAt = new Date();
    await donation.save();

    return NextResponse.json(
      { message: 'Receipt email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send receipt error:', error);
    return NextResponse.json(
      { error: error.message || 'Error sending receipt' },
      { status: 500 }
    );
  }
}

// Get donation statistics
export async function getDonationStats() {
  try {
    const stats = await Donation.aggregate([
      {
        $facet: {
          totalDonations: [
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
          ],
          byType: [
            { $match: { status: 'confirmed' } },
            { $group: { _id: '$donationType', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          ],
          byCurrency: [
            { $match: { status: 'confirmed' } },
            { $group: { _id: '$currency', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          ],
          monthlyTrend: [
            { $match: { status: 'confirmed' } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                total: { $sum: '$amount' },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 12 },
          ],
        },
      },
    ]);

    return NextResponse.json(stats[0], { status: 200 });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching statistics' },
      { status: 500 }
    );
  }
}

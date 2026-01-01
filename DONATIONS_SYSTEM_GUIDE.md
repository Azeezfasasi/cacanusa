# Donation Management System - Complete Guide

## Overview

A professional, fully-featured donation management system for CANAN USA that allows users to make donations and administrators to manage them effectively.

## Features

### For Donors (Users)

- **Professional Donation Form**: Beautiful, mobile-responsive form with multiple donation types
- **Multiple Payment Methods**: Bank transfer, check, cash, and other options
- **Multi-Currency Support**: USD, CAD, EUR, GBP, NGN
- **Bank Account Details Display**: Secure display of banking information
- **Automatic Confirmation**: Email confirmation sent immediately after submission
- **Donation Messages**: Optional personal messages with donations
- **Form Validation**: Real-time validation and helpful error messages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### For Administrators

- **Donation Dashboard**: Comprehensive view of all donations
- **Real-time Statistics**: Total donations, donor count, average donation, trends
- **Advanced Filtering**: Filter by status, donation type, and search by donor details
- **Donation Management**: Mark donations as confirmed or cancelled
- **Receipt Management**: Send official receipts to donors via email
- **CSV Export**: Download donation records for reporting
- **Pagination**: Navigate through large donation lists efficiently
- **Detailed View**: Modal for viewing complete donation information

## System Architecture

### Database Schema (MongoDB)

#### Donation Model

```javascript
{
  // Donor Information
  donorName: String (required)
  donorEmail: String (required, unique)
  donorPhone: String
  donorMessage: String (max 1000 chars)

  // Donation Details
  amount: Number (required, min: 1)
  currency: String (USD, CAD, EUR, GBP, NGN)
  donationType: String (general, building-fund, scholarship, community-outreach, other)

  // Payment Information
  paymentMethod: String (bank-transfer, check, cash, other)
  transactionId: String (auto-generated)
  referenceNumber: String

  // Status
  status: String (pending, confirmed, cancelled)
  notes: String (admin notes)

  // Admin Fields
  processedBy: ObjectId (ref: User)
  processedAt: Date
  receiptSent: Boolean
  receiptSentAt: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### POST /api/donations

Create a new donation

```javascript
{
  donorName: "John Doe",
  donorEmail: "john@example.com",
  donorPhone: "+1-555-123-4567",
  amount: 100,
  currency: "USD",
  donationType: "general",
  paymentMethod: "bank-transfer",
  referenceNumber: "CHK-12345",
  donorMessage: "God bless"
}
```

**Response**:

```javascript
{
  message: "Donation received successfully",
  donation: { ...donation details... }
}
```

### GET /api/donations

Get all donations (admin only) with filters and pagination

```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- status: string (pending, confirmed, cancelled)
- donationType: string
- stats: boolean (true to get statistics only)
```

**Response**:

```javascript
{
  donations: [...],
  pagination: {
    total: number,
    page: number,
    pages: number,
    limit: number
  }
}
```

### GET /api/donations/[id]

Get donation details by ID

### PATCH /api/donations/[id]

Update donation status or send receipt

```javascript
// Update status
{
  status: "confirmed",
  notes: "Donation confirmed and processed"
}

// Send receipt
{
  action: "send-receipt"
}
```

## Environment Variables Required

Add these to your `.env.local` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Email Configuration (for Nodemailer)
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@cananusa.org

# Cloudinary (optional, for future image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── donations/
│   │       ├── route.js (POST, GET)
│   │       └── [id]/
│   │           └── route.js (GET, PATCH)
│   ├── donate/
│   │   └── page.js (Public donation page)
│   ├── dashboard/
│   │   └── all-donations/
│   │       └── page.js (Admin donations management)
│   └── server/
│       ├── models/
│       │   └── Donation.js
│       └── controllers/
│           └── donationController.js
├── components/
│   ├── DonationForm.js (User-facing donation form)
│   └── dashboard-component/
│       └── ManageDonations.js (Admin dashboard)
└── config/
    └── donationConfig.js (Configuration file)
```

## Configuration

### Account Details Configuration

Edit `src/config/donationConfig.js` to update:

- Bank name
- Account name
- Account number
- Routing number
- SWIFT code
- Address and contact information

### Donation Types

Customize donation types in `src/config/donationConfig.js`:

- General Fund
- Building Fund
- Scholarship Program
- Community Outreach
- Other (custom)

## Usage

### For Users

1. Navigate to `/donate`
2. Fill in the donation form with their information
3. Select donation amount, type, and payment method
4. Submit the form
5. Receive confirmation email with transaction ID

### For Admins

1. Navigate to `/dashboard/all-donations`
2. View all donations with statistics
3. Use filters to find specific donations
4. Click on donation to view full details
5. Update donation status (pending → confirmed → send receipt)
6. Export data as CSV for reporting

## Email Notifications

### To Donor (Automatic)

- **Confirmation Email**: Sent immediately when donation is received
- **Receipt Email**: Sent when admin marks donation as confirmed and sends receipt

### Email Content

Emails are professionally formatted HTML emails that include:

- Donation amount and currency
- Donation type
- Transaction ID
- Date and reference number
- Tax deduction information
- Contact details for inquiries

## Security Considerations

1. **Email Validation**: All email addresses are validated
2. **Amount Validation**: Amounts must be positive numbers
3. **Database Indexes**: Indexed fields for efficient querying
4. **Transaction IDs**: Auto-generated unique transaction IDs for tracking
5. **Admin Operations**: Only admins can update status and send receipts
6. **Data Protection**: Sensitive data is properly validated and sanitized

## Features to Add (Future Enhancements)

1. **Online Payment Integration**: Stripe, PayPal, or Square integration
2. **Recurring Donations**: Monthly/annual recurring donations
3. **Donation Campaigns**: Create and track specific campaigns
4. **Donor Recognition**: Public recognition wall with donor names
5. **Tax Reports**: Generate tax receipts and reports
6. **Mobile App**: Native mobile app for donations
7. **QR Codes**: Dynamic QR codes for quick donations
8. **Analytics**: Advanced analytics and reporting
9. **Bulk Email**: Send updates to all donors
10. **Notification Webhooks**: Real-time donation notifications

## Troubleshooting

### Emails not sending

- Check email configuration in `.env.local`
- Verify SMTP credentials are correct
- Check firewall/network restrictions
- Enable "Less secure apps" if using Gmail

### Donations not appearing in admin dashboard

- Verify MongoDB connection is working
- Check database permissions
- Clear browser cache and refresh
- Check for JavaScript console errors

### Form validation failing

- Check all required fields are filled
- Verify email format is correct
- Ensure amount is a positive number
- Check for special characters in text fields

## Support and Contact

For issues or questions, contact:

- Email: donations@cananusa.org
- Phone: (555) 123-4567
- Website: www.cananusa.org

## License

© 2026 CANAN USA. All rights reserved.

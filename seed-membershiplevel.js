const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cananusa';

const membershipLevelSchema = new mongoose.Schema({});

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const MembershipLevel = mongoose.model('MembershipLevel', membershipLevelSchema);

    // Check if data already exists
    const existing = await MembershipLevel.findOne({});
    if (existing) {
      console.log('Membership levels data already exists');
      process.exit(0);
    }

    const defaultData = {
      levels: [
        {
          id: 1,
          title: 'Individual Member',
          description: 'For Christians committed to advocacy and mission.',
          iconName: 'Users',
          color: 'from-blue-500 to-blue-600',
          badge: 'Popular',
          highlighted: false,
        },
        {
          id: 2,
          title: 'Family Member',
          description: 'Engage as a household in prayer, service, and giving.',
          iconName: 'Heart',
          color: 'from-red-500 to-pink-600',
          badge: null,
          highlighted: true,
        },
        {
          id: 3,
          title: 'Church/Ministry Partner',
          description: 'For congregations supporting global Christian protection.',
          iconName: 'Church',
          color: 'from-purple-500 to-purple-600',
          badge: null,
          highlighted: false,
        },
        {
          id: 4,
          title: 'Youth & Young Adult Member',
          description: 'For emerging leaders and advocates.',
          iconName: 'Zap',
          color: 'from-yellow-500 to-orange-600',
          badge: null,
          highlighted: false,
        },
        {
          id: 5,
          title: 'Lifetime Member',
          description: 'For long-term champions of CANAN\'s work.',
          iconName: 'Crown',
          color: 'from-amber-600 to-yellow-600',
          badge: 'Premium',
          highlighted: false,
        },
      ],
      benefits: [
        { text: 'Access to updates' },
        { text: 'Events & gatherings' },
        { text: 'Advocacy actions' },
        { text: 'National briefings' },
        { text: 'Volunteer opportunities' },
      ],
      ctaSection: {
        title: 'Ready to Make a Difference?',
        description: 'Join our growing community of advocates and champions dedicated to Christian protection globally.',
        primaryButton: { label: 'Choose Your Membership', link: '#membership' },
        secondaryButton: { label: 'Learn More', link: '#' }
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await MembershipLevel.create(defaultData);
    console.log('✅ Membership levels data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

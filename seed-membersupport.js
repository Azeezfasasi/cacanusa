const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cananusa';

const memberSupportSchema = new mongoose.Schema({
  sectionTitle: String,
  sectionDescription: String,
  supportItems: [{
    title: String,
    text: String,
    iconName: String,
    color: String,
    lightBg: String
  }],
  ctaSection: {
    title: String,
    description: String,
    buttonLabel: String,
    buttonLink: String
  },
  statsSection: [{
    number: String,
    title: String,
    description: String,
    color: String
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const MemberSupport = mongoose.model('MemberSupport', memberSupportSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existing = await MemberSupport.findOne({});
    if (existing) {
      console.log('Member support data already exists');
      process.exit(0);
    }

    const defaultData = {
      sectionTitle: 'What Members Support',
      sectionDescription: 'Your membership fuels impactful initiatives that advance advocacy, faith, and community development across the globe.',
      supportItems: [
        {
          title: 'Congressional Engagement',
          text: 'Congressional engagement and policy advocacy',
          iconName: 'FaBuilding',
          color: 'from-blue-500 to-blue-600',
          lightBg: 'bg-blue-50'
        },
        {
          title: 'Awareness Campaigns',
          text: 'Awareness campaigns on Christian persecution',
          iconName: 'FaBuilding',
          color: 'from-red-500 to-red-600',
          lightBg: 'bg-red-50'
        },
        {
          title: 'Humanitarian Support',
          text: 'Missions and humanitarian support in crisis regions',
          iconName: 'FaHandshake',
          color: 'from-green-500 to-green-600',
          lightBg: 'bg-green-50'
        },
        {
          title: 'Legal Interventions',
          text: 'Legal and diplomatic interventions',
          iconName: 'FaBalanceScale',
          color: 'from-purple-500 to-purple-600',
          lightBg: 'bg-purple-50'
        },
        {
          title: 'Prayer Mobilizations',
          text: 'National prayer mobilizations',
          iconName: 'FaFolderOpen',
          color: 'from-pink-500 to-pink-600',
          lightBg: 'bg-pink-50'
        },
        {
          title: 'Leadership Development',
          text: 'Leadership development for Nigerian Americans',
          iconName: 'FaGraduationCap',
          color: 'from-amber-500 to-amber-600',
          lightBg: 'bg-amber-50'
        },
        {
          title: 'Community Events',
          text: 'Community events, summits, and training programs',
          iconName: 'FaGlobe',
          color: 'from-teal-500 to-teal-600',
          lightBg: 'bg-teal-50'
        }
      ],
      ctaSection: {
        title: 'Your Partnership Strengthens the Global Church',
        description: 'Join thousands of advocates committed to protecting persecuted Christians worldwide.',
        buttonLabel: 'Become a Member Today',
        buttonLink: '/join-us'
      },
      statsSection: [
        {
          number: '7+',
          title: 'Core Impact Areas',
          description: 'Comprehensive support across advocacy, faith, and community',
          color: 'blue'
        },
        {
          number: 'Global',
          title: 'Worldwide Reach',
          description: 'Supporting persecuted Christians in crisis regions',
          color: 'purple'
        },
        {
          number: 'Unified',
          title: 'Collective Impact',
          description: 'Your membership creates lasting change',
          color: 'green'
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await MemberSupport.create(defaultData);
    console.log('✅ Member support data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

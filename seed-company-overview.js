const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const CoreValueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a value name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a value description'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  iconType: {
    type: String,
    default: 'circle'
  },
  colorClass: {
    type: String,
    enum: ['blue-900', 'amber-600', 'green-700', 'red-600', 'purple-600'],
    default: 'blue-900'
  }
}, { _id: true });

const CompanyOverviewSchema = new mongoose.Schema(
  {
    whoWeAre: {
      title: {
        type: String,
        default: 'Who We Are',
        maxlength: [100, 'Title cannot exceed 100 characters']
      },
      paragraphs: [
        {
          type: String,
          maxlength: [500, 'Each paragraph cannot exceed 500 characters']
        }
      ]
    },

    vision: {
      title: {
        type: String,
        default: 'Our Vision',
        maxlength: [100, 'Title cannot exceed 100 characters']
      },
      description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
      }
    },

    mission: {
      title: {
        type: String,
        default: 'Our Mission',
        maxlength: [100, 'Title cannot exceed 100 characters']
      },
      description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
      }
    },

    coreValues: {
      title: {
        type: String,
        default: 'Our Core Values',
        maxlength: [100, 'Title cannot exceed 100 characters']
      },
      values: [CoreValueSchema]
    },

    image: {
      url: {
        type: String,
        default: '/images/placeholder.png'
      },
      alt: {
        type: String,
        default: 'Rayob Engineering Overview',
        maxlength: [200, 'Alt text cannot exceed 200 characters']
      }
    },

    isPublished: {
      type: Boolean,
      default: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'company_overview' }
);

const CompanyOverview = mongoose.model('CompanyOverview', CompanyOverviewSchema);

const seedCompanyOverview = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing company overview
    await CompanyOverview.deleteMany({});
    console.log('Cleared existing company overview');

    // Seed company overview
    const overview = {
      whoWeAre: {
        title: 'Who We Are',
        paragraphs: [
          'The Christian Association of Nigerian-Americans (CANAN USA) is a national Christian advocacy organization dedicated to defending religious freedom, protecting persecuted Christians, and strengthening Nigerian-American communities across the United States.',
          'We collaborate with churches, civic leaders, human rights organizations, and U.S. policymakers to ensure that the cry of persecuted believers is heard, addressed, and acted upon.'
        ]
      },
      vision: {
        title: 'Our Vision',
        description: 'A world where Nigerian Christians live in safety, dignity, and freedom and where Nigerian Americans thrive as a united, empowered Christian community in the U.S.'
      },
      mission: {
        title: 'Our Mission',
        description: 'To mobilize Christians, influence policy, and provide humanitarian support to protect persecuted Christians in Nigeria and uplift Nigerian American communities.'
      },
      coreValues: {
        title: 'Our Core Values',
        values: [
          {
            name: 'Faith & Spirituality',
            description: 'Rooted in Christian principles and values that guide our mission.',
            iconType: 'circle',
            colorClass: 'blue-900'
          },
          {
            name: 'Justice & Advocacy',
            description: 'Defending religious freedom and protecting persecuted believers.',
            iconType: 'circle',
            colorClass: 'amber-600'
          },
          {
            name: 'Community & Unity',
            description: 'Strengthening bonds among Nigerian-Americans and building collective strength.',
            iconType: 'circle',
            colorClass: 'green-700'
          },
          {
            name: 'Compassion & Humanity',
            description: 'Supporting and uplifting vulnerable Christians with humanitarian aid.',
            iconType: 'circle',
            colorClass: 'red-600'
          },
          {
            name: 'Empowerment',
            description: 'Enabling Nigerian-Americans to thrive professionally, socially, and spiritually.',
            iconType: 'circle',
            colorClass: 'purple-600'
          }
        ]
      },
      image: {
        url: '/images/placeholder.png',
        alt: 'Rayob Engineering Overview'
      },
      isPublished: true
    };

    const result = await CompanyOverview.create(overview);
    console.log('Successfully seeded company overview');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding company overview:', error);
    process.exit(1);
  }
};

seedCompanyOverview();

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define Team schema inline (matching src/app/server/models/Team.js)
const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a team member name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    position: {
      type: String,
      required: [true, 'Please add a position'],
      trim: true,
      maxlength: [150, 'Position cannot exceed 150 characters']
    },
    photo: {
      url: {
        type: String,
        required: [true, 'Please add a photo URL']
      },
      alt: {
        type: String,
        maxlength: [200, 'Alt text cannot exceed 200 characters'],
        default: 'Team member photo'
      }
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
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
  { collection: 'team' }
);

TeamSchema.index({ order: 1, isActive: 1 });
TeamSchema.index({ createdAt: -1 });

const Team = mongoose.model('Team', TeamSchema);

const seedTeamMembers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing team members
    await Team.deleteMany({});
    console.log('Cleared existing team members');

    // Default team members
    const defaultTeamMembers = [
      {
        name: 'John Smith',
        position: 'Lead Engineer',
        photo: {
          url: '/images/placeholder.png',
          alt: 'John Smith - Lead Engineer'
        },
        bio: 'Senior engineer with 15+ years of experience in software development.',
        order: 0,
        isActive: true
      },
      {
        name: 'Sarah Johnson',
        position: 'Project Manager',
        photo: {
          url: '/images/placeholder.png',
          alt: 'Sarah Johnson - Project Manager'
        },
        bio: 'Experienced project manager specializing in agile methodologies.',
        order: 1,
        isActive: true
      },
      {
        name: 'Michael Brown',
        position: 'Full Stack Developer',
        photo: {
          url: '/images/placeholder.png',
          alt: 'Michael Brown - Full Stack Developer'
        },
        bio: 'Expert in modern web technologies and cloud architecture.',
        order: 2,
        isActive: true
      },
      {
        name: 'Emily Davis',
        position: 'UI/UX Designer',
        photo: {
          url: '/images/placeholder.png',
          alt: 'Emily Davis - UI/UX Designer'
        },
        bio: 'Creative designer focused on user-centered design principles.',
        order: 3,
        isActive: true
      }
    ];

    // Insert team members
    const result = await Team.insertMany(defaultTeamMembers);
    console.log(`Successfully seeded ${result.length} team members`);

    // Display created members
    console.log('\nTeam Members Created:');
    result.forEach((member) => {
      console.log(`  - ${member.name} (${member.position})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding team members:', error.message);
    process.exit(1);
  }
};

seedTeamMembers();

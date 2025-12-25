const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    position: {
      type: String,
      required: [true, 'Please add a position/title'],
      trim: true,
      maxlength: [150, 'Position cannot exceed 150 characters']
    },
    message: {
      type: String,
      required: [true, 'Please add a testimonial message'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 5
    },
    image: {
      url: {
        type: String,
        default: null
      },
      alt: {
        type: String,
        default: null
      }
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
  { collection: 'testimonials' }
);

TestimonialSchema.index({ order: 1, isActive: 1 });
TestimonialSchema.index({ createdAt: -1 });

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

const seedTestimonials = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('Cleared existing testimonials');

    // Seed default testimonials
    const testimonials = [
      {
        name: "Chisom Obi",
        position: "Community Member & Youth Leader",
        message: "CANAN USA has transformed my faith journey and connected me with an incredible community. Through their youth programs and advocacy work, I've found purpose and meaningful ways to serve others while celebrating my Nigerian heritage.",
        rating: 5,
        order: 0,
        isActive: true
      },
      {
        name: "Dr. Ngozi Uwazie",
        position: "Education & Scholarship Advocate",
        message: "The organization's commitment to education and empowerment is remarkable. I've witnessed firsthand how CANAN USA is making a real difference in the lives of Nigerian-American students and families across the country.",
        rating: 5,
        order: 1,
        isActive: true
      },
      {
        name: "Pastor Emeka Nwosu",
        position: "Religious Leader & Community Partner",
        message: "CANAN USA's faith-centered approach to advocacy and community service is inspiring. Their dedication to defending persecuted Christians and strengthening our communities demonstrates the true spirit of Christian service and justice.",
        rating: 5,
        order: 2,
        isActive: true
      }
    ];

    const result = await Testimonial.insertMany(testimonials);
    console.log(`Successfully seeded ${result.length} testimonials`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
};

seedTestimonials();

import mongoose from 'mongoose';
import { connectDB } from './src/utils/db.js';
import Department from './src/app/server/models/Department.js';

const defaultDepartments = [
  {
    name: 'Executive Team',
    slug: 'executive-team',
    description: 'Senior leadership team driving the organization vision',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Board Members',
    slug: 'board-members',
    description: 'Board of directors providing strategic governance',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Committee Leads',
    slug: 'committee-leads',
    description: 'Committee leaders managing specific initiatives',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Advisors',
    slug: 'advisors',
    description: 'External advisors providing expert guidance',
    displayOrder: 4,
    isActive: true,
  },
];

async function seedDepartments() {
  try {
    await connectDB();

    // Check if departments already exist
    const existingCount = await Department.countDocuments();
    if (existingCount > 0) {
      console.log('Departments already exist. Skipping seed.');
      process.exit(0);
    }

    // Create departments
    const created = await Department.insertMany(defaultDepartments);
    console.log(`✓ Successfully seeded ${created.length} departments`);
    
    // Log the created departments with their IDs
    created.forEach(dept => {
      console.log(`  - ${dept.name} (ID: ${dept._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding departments:', error);
    process.exit(1);
  }
}

seedDepartments();

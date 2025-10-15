/*
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  ALL_PRIVILEGES,
  PRIVILEGE_CATEGORIES,
} from '../constants/privileges.constant.js';
import Privilege from './models/Privilege.model.js';
import connectDB from '../config/database.config.js';

// Load environment variables
dotenv.config();

// Seed function
async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to database for seeding.');

    console.log('Seeding privileges...');
    for (const privilege of Object.values(ALL_PRIVILEGES)) {
      const existingPrivilege = await Privilege.findOne({ privilegeCode: privilege.code });
      if (!existingPrivilege) {
        await Privilege.create({
          privilegeCode: privilege.code,
          privilegeName: privilege.name,
          description: privilege.description,
          category: privilege.category,
        });
        console.log(`Created privilege: ${privilege.code}`);
      } else {
        console.log(`Privilege ${privilege.code} already exists.`);
      }
    }

    console.log('Privilege seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the seed function
seedDatabase();

*/
import mongoose from 'mongoose';
import { randomUUID } from "crypto";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {
  ROLE_CODES,
} from '../../constants/roles.constant.js';
import User from '../models/User.model.js';
import Role from '../models/Role.model.js';
import connectDB from '../../config/database.config.js';

dotenv.config();

const usersSeedData = [
  {
    email: 'admin@example.com',
    fullName: 'System Administrator',
    identityNumber: 'ADMIN001',
    gender: 'male',
    age: 35,
    dateOfBirth: new Date('1989-01-15'),
    password: 'admin123',
    role: ROLE_CODES.ADMIN,
  },
  {
    email: 'manager@example.com',
    fullName: 'Department Manager',
    identityNumber: 'MGR001',
    gender: 'female',
    age: 42,
    dateOfBirth: new Date('1982-03-20'),
    password: 'manager123',
    role: ROLE_CODES.MANAGER,
  },
  {
    email: 'service@example.com',
    fullName: 'Service Technician',
    identityNumber: 'SVC001',
    gender: 'male',
    age: 28,
    dateOfBirth: new Date('1996-07-10'),
    password: 'service123',
    role: ROLE_CODES.SERVICE,
  },
  {
    email: 'labuser@example.com',
    fullName: 'Laboratory User',
    identityNumber: 'LAB001',
    gender: 'female',
    age: 31,
    dateOfBirth: new Date('1993-11-05'),
    password: 'labuser123',
    role: ROLE_CODES.LAB_USER,
  },
  {
    email: 'user1@example.com',
    fullName: 'Regular User One',
    identityNumber: 'USER001',
    gender: 'male',
    age: 25,
    dateOfBirth: new Date('1999-05-12'),
    password: 'user123',
    role: ROLE_CODES.USER,
  },
  {
    email: 'user2@example.com',
    fullName: 'Regular User Two',
    identityNumber: 'USER002',
    gender: 'female',
    age: 29,
    dateOfBirth: new Date('1995-09-18'),
    password: 'user123',
    role: ROLE_CODES.USER,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to database for user seeding.');

    // Fetch all roles first
    const roles = await Role.find({ isSystemRole: true });
    const roleMap = new Map(roles.map(role => [role.roleCode, role._id]));

    if (roles.length === 0) {
      console.error('❌ No roles found! Please run 001_roles.seed.ts first.');
      return;
    }

    console.log(`Found ${roles.length} system roles`);
    console.log('Seeding users...');
    for (const userData of usersSeedData) {
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { identityNumber: userData.identityNumber }
        ]
      });

      if (!existingUser) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const roleId = roleMap.get(userData.role);

        if (!roleId) {
          console.error(`❌ Role ${userData.role} not found for user ${userData.email}`);
          continue;
        }

        await User.create({
          _id: randomUUID(),
          email: userData.email,
          fullName: userData.fullName,
          identityNumber: userData.identityNumber,
          gender: userData.gender,
          age: userData.age,
          dateOfBirth: userData.dateOfBirth,
          passwordHash: hashedPassword,
          role: [roleId], // Store as array of role IDs
          isActive: true,
          isDeleted: false,
        });
        console.log(`✓ Created user: ${userData.email} with role: ${userData.role}`);
      } else {
        console.log(`⚠ User with email ${userData.email} or identity number ${userData.identityNumber} already exists.`);
      }
    }

    console.log('\n✅ User seeding completed successfully!');
    console.log('\nUser Summary:');
    const users = await User.find({}).populate('role');
    users.forEach(user => {
      const roleNames = (user.role as any[]).map((r: any) => r?.roleCode || 'Unknown').join(', ');
      console.log(`  - ${user.email}: ${roleNames}`);
    });
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();
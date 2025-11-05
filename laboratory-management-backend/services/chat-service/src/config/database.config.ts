import { MongoClient, Db } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    console.log(process.env.MONGODB_URI);
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    // Using the test database
    db = client.db('patientService');
    await db.command({ ping: 1 });

    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

export const getClient = (): MongoClient => {
  if (!client) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return client;
};

export const closeDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};

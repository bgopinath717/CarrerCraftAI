import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careercraft_ai';

async function checkDatabase() {
  console.log('='.repeat(60));
  console.log(' 🔍 CareerCraft AI - MongoDB Health & Data Checker');
  console.log('='.repeat(60));
  console.log(`Connecting to: ${mongoUri} ...`);

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connection Successful!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database Name: ${conn.connection.name}`);
    console.log('-'.repeat(60));

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log(`📁 Collections in "${conn.connection.name}": (${collections.length} total)`);
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   • ${col.name.padEnd(20)} : ${count} documents`);
    }

    console.log('-'.repeat(60));

    // Sample user preview
    const usersCol = db.collection('users');
    const sampleUser = await usersCol.findOne({}, { projection: { password: 0 } });
    if (sampleUser) {
      console.log('👤 Registered User Sample:');
      console.log(`   • Name  : ${sampleUser.name}`);
      console.log(`   • Email : ${sampleUser.email}`);
      console.log(`   • Role  : ${sampleUser.role || 'N/A'}`);
    } else {
      console.log('ℹ️  No users found in "users" collection.');
    }

    console.log('='.repeat(60));
    console.log('🎉 Everything looks healthy and connected!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Database Connection Failed: ${error.message}`);
    console.log('\nTips:');
    console.log(' 1. Make sure MongoDB service is running (e.g. net start MongoDB on Windows).');
    console.log(' 2. Check MONGODB_URI in server/.env file.');
    process.exit(1);
  }
}

checkDatabase();

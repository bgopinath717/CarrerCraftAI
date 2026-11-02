import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careercraft_ai';

async function inspectDb() {
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  for (const c of collections) {
    const docs = await db.collection(c.name).find({}).toArray();
    console.log(`Collection [${c.name}] (${docs.length} docs):`);
    docs.forEach((doc, idx) => {
      console.log(`  [${idx}] _id: ${doc._id}, user: ${doc.userId || doc.email || doc.name || 'N/A'}, title: ${doc.title || doc.slug || doc.role || ''}`);
    });
  }
  process.exit(0);
}

inspectDb().catch(err => {
  console.error(err);
  process.exit(1);
});


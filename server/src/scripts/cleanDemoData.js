import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careercraft_ai';

async function cleanDemoData() {
  console.log('='.repeat(60));
  console.log(' 🧹 CareerCraft AI - Clean Demo Data Script');
  console.log('='.repeat(60));
  console.log(`Connecting to: ${mongoUri} ...`);

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    const db = mongoose.connection.db;

    // Identify confirmed demo user(s)
    const demoUsers = await db.collection('users').find({
      email: { $in: ['gopinath.mern@example.com', 'gopinath@example.com'] }
    }).toArray();

    console.log(`Found ${demoUsers.length} confirmed demo user(s).`);

    for (const demoUser of demoUsers) {
      const demoUserId = demoUser._id;
      console.log(`Removing data for demo user: ${demoUser.email} (ID: ${demoUserId})...`);

      const deletedResumes = await db.collection('resumes').deleteMany({ userId: demoUserId });
      console.log(`  • Deleted ${deletedResumes.deletedCount} demo resumes.`);

      const deletedCoverLetters = await db.collection('coverletters').deleteMany({ userId: demoUserId });
      console.log(`  • Deleted ${deletedCoverLetters.deletedCount} demo cover letters.`);

      const deletedProfiles = await db.collection('profiles').deleteMany({ userId: demoUserId });
      console.log(`  • Deleted ${deletedProfiles.deletedCount} demo profiles.`);

      const deletedPortfolios = await db.collection('portfolios').deleteMany({ userId: demoUserId });
      console.log(`  • Deleted ${deletedPortfolios.deletedCount} demo portfolios.`);

      // Also clean any demo ATS analyses or career guidance if existing
      if ((await db.listCollections({ name: 'atsanalyses' }).toArray()).length > 0) {
        const deletedATS = await db.collection('atsanalyses').deleteMany({ userId: demoUserId });
        console.log(`  • Deleted ${deletedATS.deletedCount} demo ATS analyses.`);
      }

      const deletedUser = await db.collection('users').deleteOne({ _id: demoUserId });
      console.log(`  • Deleted demo user record: ${deletedUser.deletedCount}`);
    }

    // Also clean orphaned usersettings
    if ((await db.listCollections({ name: 'usersettings' }).toArray()).length > 0) {
      const activeUserIds = (await db.collection('users').find({}).toArray()).map(u => u._id);
      const deletedSettings = await db.collection('usersettings').deleteMany({ userId: { $nin: activeUserIds } });
      if (deletedSettings.deletedCount > 0) {
        console.log(`  • Deleted ${deletedSettings.deletedCount} orphaned user settings.`);
      }
    }

    console.log('='.repeat(60));
    console.log('✨ Demo data cleanup completed successfully. Legitimate users are preserved!');
    console.log('='.repeat(60));
    process.exit(0);
  } catch (error) {
    console.error(`❌ Cleanup failed: ${error.message}`);
    process.exit(1);
  }
}

cleanDemoData();

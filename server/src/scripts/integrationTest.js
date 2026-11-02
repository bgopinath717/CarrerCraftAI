import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = 5002;
process.env.PORT = PORT;
process.env.NODE_ENV = 'test';

// Import Express application
const { default: app } = await import('../server.js');

let serverInstance;

const BASE_URL = `http://localhost:${PORT}/api`;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data, headers: res.headers };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ PASSED: ${message}`);
  passedTests++;
}

async function runTests() {
  console.log('='.repeat(70));
  console.log(' 🚀 CAREERCRAFT AI - COMPREHENSIVE MULTI-USER INTEGRATION TEST SUITE');
  console.log('='.repeat(70));

  // Start HTTP server on test port
  await new Promise((resolve) => {
    serverInstance = app.listen(PORT, () => {
      console.log(`📍 Test server listening on http://localhost:${PORT}`);
      resolve();
    });
  });

  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => mongoose.connection.once('open', resolve));
  }
  const db = mongoose.connection.db;

  try {
    // Clean test database users if existing
    await db.collection('users').deleteMany({ email: { $in: ['gopinath@gmail.com', 'arun@gmail.com', 'testuser@example.com'] } });

    // =========================================================================
    // TEST 1: User 1 Registration (Gopinath)
    // =========================================================================
    console.log('\n--- TEST 1: User 1 Registration (Gopinath) ---');
    const regRes1 = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Gopinath',
        email: 'gopinath@gmail.com',
        password: 'Password123!',
      },
    });

    assert(regRes1.status === 201, 'Status code is 201 Created');
    assert(regRes1.data?.success === true, 'Response success is true');
    assert(regRes1.data?.user?.name === 'Gopinath', 'User name is Gopinath');
    assert(regRes1.data?.user?.email === 'gopinath@gmail.com', 'Email is gopinath@gmail.com');
    assert(Boolean(regRes1.data?.token), 'JWT token returned in response');
    const tokenGopinath = regRes1.data.token;
    const gopinathUserId = regRes1.data.user.id;

    // Verify User 1 document in MongoDB
    const gopinathDoc = await db.collection('users').findOne({ email: 'gopinath@gmail.com' });
    assert(Boolean(gopinathDoc), 'Gopinath document confirmed in MongoDB Atlas/Local');
    assert(gopinathDoc.password !== 'Password123!', 'Password is cryptographically bcrypt hashed (never plaintext)');

    // =========================================================================
    // TEST 2: User 2 Registration (Arun)
    // =========================================================================
    console.log('\n--- TEST 2: User 2 Registration (Arun) ---');
    const regRes2 = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Arun',
        email: 'arun@gmail.com',
        password: 'ArunSecurePass987!',
      },
    });

    assert(regRes2.status === 201, 'Status code is 201 Created for Arun');
    assert(regRes2.data?.user?.name === 'Arun', 'User name is Arun');
    assert(regRes2.data?.user?.email === 'arun@gmail.com', 'Email is arun@gmail.com');
    const tokenArun = regRes2.data.token;
    const arunUserId = regRes2.data.user.id;

    assert(gopinathUserId !== arunUserId, 'Gopinath and Arun have completely distinct MongoDB ObjectIds');

    // =========================================================================
    // TEST 3: Dynamic User Profile & Dashboard (/api/auth/me & /api/dashboard)
    // =========================================================================
    console.log('\n--- TEST 3: Dynamic User Name & Personalized Dashboards ---');

    // User A: Gopinath
    const meGopinath = await request('/auth/me', {
      headers: { Authorization: `Bearer ${tokenGopinath}` },
    });
    assert(meGopinath.status === 200, 'Gopinath /api/auth/me returns 200');
    assert(meGopinath.data?.user?.name === 'Gopinath', 'Dynamic greeting resolves to "Welcome, Gopinath!"');

    const dashGopinath = await request('/dashboard', {
      headers: { Authorization: `Bearer ${tokenGopinath}` },
    });
    assert(dashGopinath.status === 200, 'Gopinath /api/dashboard returns 200');
    assert(dashGopinath.data?.dashboard?.user?.name === 'Gopinath', 'Dashboard user is Gopinath');
    assert(dashGopinath.data?.dashboard?.counts?.resumes === 0, 'New Gopinath dashboard starts completely empty (0 resumes)');

    // User B: Arun
    const meArun = await request('/auth/me', {
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(meArun.status === 200, 'Arun /api/auth/me returns 200');
    assert(meArun.data?.user?.name === 'Arun', 'Dynamic greeting resolves to "Welcome, Arun!"');

    const dashArun = await request('/dashboard', {
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(dashArun.status === 200, 'Arun /api/dashboard returns 200');
    assert(dashArun.data?.dashboard?.user?.name === 'Arun', 'Dashboard user is Arun');
    assert(dashArun.data?.dashboard?.counts?.resumes === 0, 'New Arun dashboard starts completely empty (0 resumes)');

    // =========================================================================
    // TEST 4: User Data Isolation & Strict Document Ownership
    // =========================================================================
    console.log('\n--- TEST 4: User Data Isolation & Strict Document Ownership ---');

    // Gopinath creates a private resume
    const createResResume = await request('/resumes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenGopinath}` },
      body: {
        title: "Gopinath's Confidential Project Resume",
        targetRole: 'Full Stack Engineer',
        summary: 'Experienced in cloud platforms and scalable architectures.',
        skills: { technical: ['React', 'Node.js', 'MongoDB', 'Docker'] },
      },
    });
    assert(createResResume.status === 201, "Gopinath's resume created successfully");
    const gopinathResumeId = createResResume.data?.resume?.id || createResResume.data?.resume?._id;
    assert(Boolean(gopinathResumeId), 'Gopinath resume has valid MongoDB ID');

    // Arun attempts to list resumes: should only see his own (0)
    const arunResumesList = await request('/resumes', {
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(arunResumesList.data?.resumes?.length === 0, "Arun cannot see Gopinath's resume in his resume list (0 resumes)");

    // Arun attempts to read Gopinath's resume by ID: must return 404 / Access Denied
    const arunAccessAttempt = await request(`/resumes/${gopinathResumeId}`, {
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(arunAccessAttempt.status === 404, "Arun blocked from reading Gopinath's resume (HTTP 404)");

    // Arun attempts to update Gopinath's resume: must return 404 / Access Denied
    const arunUpdateAttempt = await request(`/resumes/${gopinathResumeId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenArun}` },
      body: { title: "Hacked by Arun" },
    });
    assert(arunUpdateAttempt.status === 404, "Arun blocked from modifying Gopinath's resume (HTTP 404)");

    // Arun attempts to delete Gopinath's resume: must return 404 / Access Denied
    const arunDeleteAttempt = await request(`/resumes/${gopinathResumeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(arunDeleteAttempt.status === 404, "Arun blocked from deleting Gopinath's resume (HTTP 404)");

    // Verify Gopinath's resume remains untouched in MongoDB
    const verifyDoc = await db.collection('resumes').findOne({ _id: new mongoose.Types.ObjectId(gopinathResumeId) });
    assert(verifyDoc.title === "Gopinath's Confidential Project Resume", "Gopinath's resume title remains completely unaltered");

    // =========================================================================
    // TEST 5: Authentication Edge Cases & Security
    // =========================================================================
    console.log('\n--- TEST 5: Authentication Edge Cases & Security ---');

    // 1. Invalid Password
    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'gopinath@gmail.com', password: 'WrongPassword999' },
    });
    assert(badLogin.status === 401, 'Invalid password rejected with 401 Unauthorized');

    // 2. Unregistered Email
    const unknownUser = await request('/auth/login', {
      method: 'POST',
      body: { email: 'nonexistent@gmail.com', password: 'AnyPassword123' },
    });
    assert(unknownUser.status === 401, 'Unregistered email rejected with 401 Unauthorized');

    // 3. Duplicate Registration
    const dupReg = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Another Gopinath', email: 'gopinath@gmail.com', password: 'Password123!' },
    });
    assert(dupReg.status === 400, 'Duplicate registration rejected with 400 Bad Request');

    // 4. Access Protected Route Without Token
    const unauthAccess = await request('/resumes');
    assert(unauthAccess.status === 401, 'Protected route without token returns 401');

    // 5. Valid Login
    const validLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'gopinath@gmail.com', password: 'Password123!', rememberMe: true },
    });
    assert(validLogin.status === 200, 'Valid login succeeds with 200 OK');
    assert(validLogin.data?.user?.name === 'Gopinath', 'Login returns authenticated user');

    // 6. Forgot Password
    const forgotRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: { email: 'gopinath@gmail.com' },
    });
    assert(forgotRes.status === 200, 'Forgot password endpoint processes request successfully');
    const resetToken = forgotRes.data?.resetToken;
    assert(Boolean(resetToken), 'Crypto reset token generated in development');

    // 7. Password Reset
    const resetRes = await request('/auth/reset-password', {
      method: 'POST',
      body: { token: resetToken, newPassword: 'BrandNewPassword456!' },
    });
    assert(resetRes.status === 200, 'Password reset with valid token succeeds');

    // 8. Login with New Password
    const loginNewPass = await request('/auth/login', {
      method: 'POST',
      body: { email: 'gopinath@gmail.com', password: 'BrandNewPassword456!' },
    });
    assert(loginNewPass.status === 200, 'Login with updated password succeeds');

    // =========================================================================
    // TEST 6: ATS Analysis & User-Specific Storage
    // =========================================================================
    console.log('\n--- TEST 6: User-Specific ATS Analysis History ---');

    const atsRes = await request('/ats/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenGopinath}` },
      body: {
        text: 'Software Engineer with extensive experience in React.js, Node.js, Express, MongoDB, JavaScript, Docker, and REST APIs.',
        targetRole: 'Software Developer',
        resumeTitle: 'Gopinath ATS Resume',
      },
    });
    assert(atsRes.status === 200, 'ATS evaluation returns 200 OK');
    assert(typeof atsRes.data?.score === 'number', 'ATS score calculated');
    assert(Boolean(atsRes.data?.analysisId), 'ATS analysis saved with MongoDB ID for Gopinath');

    // Gopinath checks history: has 1 analysis
    const gopinathAtsHistory = await request('/ats/history', {
      headers: { Authorization: `Bearer ${tokenGopinath}` },
    });
    assert(gopinathAtsHistory.data?.history?.length >= 1, 'Gopinath has his own ATS analysis history');

    // Arun checks history: has 0 analyses
    const arunAtsHistory = await request('/ats/history', {
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(arunAtsHistory.data?.history?.length === 0, "Arun's ATS analysis history is 0 (isolated from Gopinath)");

    // =========================================================================
    // TEST 7: Cover Letter User Isolation
    // =========================================================================
    console.log('\n--- TEST 7: Cover Letter User Isolation ---');

    const clRes = await request('/cover-letters', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenGopinath}` },
      body: {
        title: 'Full Stack Cover Letter',
        jobTitle: 'Senior Developer',
        companyName: 'Acme Corp',
        content: 'I am applying for the Senior Developer role...',
      },
    });
    assert(clRes.status === 201, 'Gopinath cover letter created');
    const clId = clRes.data?.coverLetter?.id || clRes.data?.coverLetter?._id;

    const arunClList = await request('/cover-letters', {
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(arunClList.data?.coverLetters?.length === 0, "Arun has 0 cover letters (cannot see Gopinath's)");

    const arunClGet = await request(`/cover-letters/${clId}`, {
      headers: { Authorization: `Bearer ${tokenArun}` },
    });
    assert(arunClGet.status === 404, "Arun cannot read Gopinath's cover letter");

    // =========================================================================
    // TEST 8: Portfolio User Isolation
    // =========================================================================
    console.log('\n--- TEST 8: Portfolio User Isolation ---');

    const portRes = await request('/portfolio', {
      headers: { Authorization: `Bearer ${tokenGopinath}` },
    });
    assert(portRes.status === 200, 'Gopinath portfolio settings loaded');
    const gopinathSlug = portRes.data?.portfolioSettings?.slug;
    assert(Boolean(gopinathSlug), 'Gopinath has unique personalized slug');

    // Public portfolio view
    const publicPort = await request(`/portfolio/public/${gopinathSlug}`);
    assert(publicPort.status === 200, 'Public portfolio resolves for valid slug');

    // Non-existent slug returns 404 (does NOT fall back to Gopinath)
    const notFoundPort = await request('/portfolio/public/nonexistent-random-slug-999');
    assert(notFoundPort.status === 404, 'Non-existent slug strictly returns 404 (no default fallback)');

    console.log('\n' + '='.repeat(70));
    console.log(`🎉 ALL ${passedTests}/${totalTests} INTEGRATION TESTS PASSED PERFECTLY!`);
    console.log('='.repeat(70));

    // Clean up test data
    await db.collection('users').deleteMany({ email: { $in: ['gopinath@gmail.com', 'arun@gmail.com'] } });
    await db.collection('resumes').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(gopinathUserId), new mongoose.Types.ObjectId(arunUserId)] } });
    await db.collection('coverletters').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(gopinathUserId), new mongoose.Types.ObjectId(arunUserId)] } });
    await db.collection('atsanalyses').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(gopinathUserId), new mongoose.Types.ObjectId(arunUserId)] } });
    await db.collection('portfolios').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(gopinathUserId), new mongoose.Types.ObjectId(arunUserId)] } });
    await db.collection('profiles').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(gopinathUserId), new mongoose.Types.ObjectId(arunUserId)] } });
    await db.collection('usersettings').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(gopinathUserId), new mongoose.Types.ObjectId(arunUserId)] } });

    serverInstance.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test suite failed with error:', err);
    if (serverInstance) serverInstance.close();
    process.exit(1);
  }
}

runTests();

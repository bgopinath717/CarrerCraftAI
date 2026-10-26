import fs from 'fs';

async function testUpload() {
  const fileContent = fs.readFileSync('scratch/test_upload_resume.txt');
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'test_resume.txt');
  formData.append('jobDescription', 'Looking for a Senior React and Node developer with MongoDB and Express experience.');

  try {
    const response = await fetch('http://localhost:5001/api/ai/job-match', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUpload();

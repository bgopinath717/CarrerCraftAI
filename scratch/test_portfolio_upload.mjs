import fs from 'fs';

async function testPortfolioUpload() {
  const fileContent = fs.readFileSync('scratch/test_upload_resume.txt');
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'test_resume.txt');

  try {
    const response = await fetch('http://localhost:5001/api/portfolio/generate-from-resume', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testPortfolioUpload();

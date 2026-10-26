import fs from 'fs';

const envContent = fs.readFileSync('server/.env', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

import { callGemini } from '../server/src/services/aiService.js';

async function test() {
  console.log('Testing Gemini API key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
  const res = await callGemini('Say "Hello CareerCraft AI"', 'You are a helpful assistant', { timeout: 8000 });
  console.log('Gemini Response:', res);
}

test();

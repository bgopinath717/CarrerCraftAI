import fs from 'fs';

const envContent = fs.readFileSync('server/.env', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

import { callGemini } from '../server/src/services/aiService.js';
import { getRoleById } from '../server/src/data/jobRolesData.js';

const SAMPLE_RESUME = `B. Gopinath
Senior Full Stack MERN Developer | Chennai, India
Email: gopinath@example.com | Phone: +91 98765 43210
LinkedIn: https://linkedin.com/in/gopinath-mern | GitHub: https://github.com/gopinath-dev

PROFESSIONAL SUMMARY
Senior MERN Stack Engineer with 4+ years of hands-on expertise building enterprise web applications, RESTful microservices, and reactive user interfaces using React, Node.js, Express, and MongoDB.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
- Frontend: React.js, Redux Toolkit, Next.js, Tailwind CSS
- Backend: Node.js, Express.js, RESTful APIs, Microservices, JWT Authentication
- Databases: MongoDB, Mongoose, Redis, Schema Design & Indexing
- DevOps & Tools: Git, GitHub, Docker, AWS (EC2, S3), Jest, CI/CD, VS Code, Postman

PROFESSIONAL EXPERIENCE
Senior Full Stack Engineer | CloudTech Solutions (2022 - Present)
- Engineered scalable RESTful microservices with Node.js and Express, processing over 100,000 daily API transactions.
- Designed and optimized MongoDB aggregation pipelines and compound indexes, cutting query latency by 45%.
- Implemented secure JWT role-based access control and OAuth2 flows.
- Built responsive user dashboards in React.js with Redux state management.

Frontend Developer | WebCraft Digital (2020 - 2022)
- Developed interactive web portals with React, JavaScript, HTML5, and Tailwind CSS.
- Automated testing with Jest and integrated third-party RESTful APIs.

FEATURED PROJECTS
CareerCraft AI Platform
- Full-stack SaaS application for ATS-friendly resume generation, automated keyword scoring, cover letter creation, and AI career guidance.
- Technologies: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, JWT.

EDUCATION
Bachelor of Engineering in Computer Science | Anna University (2016 - 2020)
Grade: First Class with Distinction
`;

async function testATS() {
  const targetRole = getRoleById('mern-developer');
  const prompt = `You are an elite Applicant Tracking System (ATS) evaluator and technical recruiter.
Analyze this resume for target role: ${targetRole.name}.
Required skills: ${targetRole.requiredSkills.join(', ')}

RESUME:
"""
${SAMPLE_RESUME}
"""

Return ONLY a valid JSON object matching this schema:
{
  "score": <0-100 overall score>,
  "targetRole": "${targetRole.name}",
  "interpretation": "<concise ATS assessment>",
  "categories": [
    { "id": "formatting", "name": "ATS Formatting & Parseability", "earned": <0-20>, "max": 20, "explanation": "<text>", "issues": [] },
    { "id": "skills", "name": "Role-Specific Skills & Keywords", "earned": <0-25>, "max": 25, "explanation": "<text>", "issues": [] },
    { "id": "experience", "name": "Experience & Technical Depth", "earned": <0-20>, "max": 20, "explanation": "<text>", "issues": [] },
    { "id": "education", "name": "Education & Certifications", "earned": <0-10>, "max": 10, "explanation": "<text>", "issues": [] },
    { "id": "achievements", "name": "Achievements & Measurable Impact", "earned": <0-15>, "max": 15, "explanation": "<text>", "issues": [] },
    { "id": "readability", "name": "Completeness & Readability", "earned": <0-10>, "max": 10, "explanation": "<text>", "issues": [] }
  ],
  "matchedKeywords": [<strings>],
  "missingKeywords": [<strings>],
  "strengths": [<strings>],
  "recommendations": [
    {
      "issue": "<issue>",
      "whyItMatters": "<why it matters>",
      "section": "<section>",
      "suggestedImprovement": "<how to fix>",
      "example": "<before / after example>"
    }
  ]
}`;

  console.log('Sending request to Gemini API...');
  const start = Date.now();
  const rawResponse = await callGemini(
    prompt,
    'You are a senior ATS algorithms expert. Return ONLY pure valid JSON with no markdown backticks, no explanations, no wrappers.',
    { maxTokens: 3500, timeout: 12000, temperature: 0.1 }
  );
  console.log(`Gemini responded in ${Date.now() - start}ms`);

  let cleaned = (rawResponse || '').trim();
  if (!cleaned) {
    console.error('Failed to get a response from Gemini API.');
    return;
  }
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const parsed = JSON.parse(cleaned);
  console.log('Score:', parsed.score);
  console.log('Interpretation:', parsed.interpretation);
  console.log('Categories Count:', parsed.categories?.length || 0);
  console.log('Missing Keywords:', parsed.missingKeywords);
  console.log('Recommendations Count:', parsed.recommendations?.length || 0);
  console.log('Sample Recommendation:', parsed.recommendations?.[0]);
}

testATS();

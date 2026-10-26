import fs from 'fs';

async function testGeneralATS() {
  const resumeText = `
B. Gopinath
Email: gopinath@example.com | Phone: +91 9876543210 | Location: Chennai, India | LinkedIn: linkedin.com/in/gopinath

PROFESSIONAL SUMMARY
Results-driven software professional with 3+ years of experience engineering scalable web platforms. Proven track record of spearheading system design, enhancing query performance by 35%, and collaborating across cross-functional engineering teams.

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, SQL
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS
Tools & Databases: Git, MongoDB, Docker, VS Code, Agile / Scrum
Core Competencies: Problem Solving, Project Management, Team Collaboration, Process Improvement

WORK EXPERIENCE
Software Developer | Tech Innovations Inc. | June 2023 - Present
• Spearheaded architecture optimization for core web platforms, reducing page load latency by 42% across 50,000 active users.
• Engineered RESTful APIs and managed secure JWT authentication protocols, cutting unauthorized access attempts by 99%.
• Coordinated weekly agile sprints with 6 developers, delivering feature milestones 4 days ahead of scheduled timeline.

PROJECTS
CareerCraft AI Platform
• Built full-stack SaaS resume and career evaluation platform supporting 10,000+ monthly user interactions.
• Implemented automated PDF vector parsing and real-time algorithmic scoring pipelines.

EDUCATION
Bachelor of Technology in Computer Science & Engineering | Anna University | 2019 - 2023 | 8.8 CGPA
`;

  try {
    const res = await fetch('http://localhost:5001/api/ai/analyze-ats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: resumeText,
        targetRole: 'general'
      })
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Target Role:', data.targetRole);
    console.log('Overall Score:', data.score);
    console.log('Engine:', data.engine);
    console.log('Interpretation:', data.interpretation);
    console.log('Categories:', data.categories?.map(c => `${c.name}: ${c.earned}/${c.max}`));
    console.log('Matched Keywords:', data.matchedKeywords);
    console.log('Missing Keywords:', data.missingKeywords);
    console.log('Recommendations:', data.recommendations);
  } catch (err) {
    console.error('Error:', err);
  }
}

testGeneralATS();

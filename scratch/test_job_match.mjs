import { evaluateJobMatch } from '../client/src/services/jobMatchEngine.js';

// Sample resume representing B. Gopinath (MERN Developer)
const sampleMernResume = {
  id: 'resume-1',
  title: 'B. Gopinath - Full Stack MERN Developer',
  personalInfo: {
    fullName: 'B. Gopinath',
    title: 'Full Stack MERN Developer',
    email: 'gopinath@example.com',
    location: 'Chennai, India',
    summary: 'Senior Full Stack Developer specializing in MongoDB, Express, React, and Node.js with 4+ years of hands-on software development building scalable web platforms and REST APIs.'
  },
  skills: [
    'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'Redux', 'Tailwind CSS', 'HTML5', 'CSS3', 'REST APIs', 'Git', 'JWT Authentication'
  ],
  experience: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior MERN Stack Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected and deployed microservices using Node.js and Express.js, handling over 100,000 daily API requests.',
        'Engineered responsive React frontends with state management via Redux Toolkit and optimized bundle size by 35%.',
        'Implemented secure JWT authentication and role-based access control across multiple client portals.',
        'Designed MongoDB aggregation pipelines and indexing strategies that reduced query latency by 45%.'
      ]
    },
    {
      company: 'WebCraft Studio',
      position: 'Frontend React Developer',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      bullets: [
        'Developed interactive user dashboards with React.js, HTML5, and CSS3.',
        'Integrated third-party RESTful APIs and collaborated using Git version control.'
      ]
    }
  ],
  education: [
    {
      institution: 'Anna University',
      degree: 'Bachelor of Engineering in Computer Science',
      startDate: '2016',
      endDate: '2020'
    }
  ],
  projects: [
    {
      name: 'CareerCraft AI Platform',
      technologies: 'React, Node.js, Express, MongoDB, Tailwind CSS',
      bullets: [
        'Built full-stack AI career platform with resume builders, job match analyzers, and ATS scanners.',
        'Created RESTful endpoints in Node.js and Express with MongoDB persistence and JWT security.'
      ]
    },
    {
      name: 'E-Commerce Marketplace',
      technologies: 'React, Redux, Node.js, Stripe, MongoDB',
      bullets: [
        'Created high-conversion e-commerce storefront with real-time cart state and Stripe payment gateway.'
      ]
    }
  ],
  certifications: [
    {
      name: 'MongoDB Certified Developer Associate'
    }
  ]
};

// Test 1: Strong Match JD
const strongMernJD = `
Job Title: Senior MERN Stack Developer
Company: CloudScale Tech
Requirements:
- Strong experience with React, Node.js, Express, and MongoDB.
- Solid understanding of JavaScript, TypeScript, and modern frontend frameworks.
- Demonstrated experience building and designing RESTful APIs and microservices.
- Familiarity with Git, state management (Redux), and authentication mechanisms (JWT).
- Bachelor's degree in Computer Science or related technical discipline.
`;

// Test 2: Partial Match JD (Needs Docker, AWS, Postgres, Kubernetes)
const partialDevOpsBackendJD = `
Job Title: Backend Cloud & Infrastructure Engineer
Company: CloudOps
Requirements:
- Deep experience with Node.js and backend API architectures.
- Experience with PostgreSQL and relational database modeling.
- Hands-on experience with Docker containerization, Kubernetes clusters, and AWS deployment.
- CI/CD pipeline automation and Git workflows.
`;

// Test 3: Poor Match JD (Python/Data Science/PyTorch)
const poorMatchPythonJD = `
Job Title: Machine Learning & Deep Learning Specialist
Company: NeuralLab AI
Requirements:
- 5+ years of experience in Python, PyTorch, TensorFlow, and Scikit-Learn.
- Experience training Convolutional Neural Networks and Natural Language Processing transformer models.
- Deep expertise in Linear Algebra, Calculus, and statistical modeling.
- Master's or Ph.D. in Machine Learning or Artificial Intelligence.
`;

console.log('====================================================');
console.log('CAREERCRAFT AI — JOB MATCH ANALYZER TEST SUITE');
console.log('====================================================\n');// 1. DETERMINISM TEST
console.log('--- TEST 1: Determinism & Repeatability ---');
const runA = evaluateJobMatch(sampleMernResume, strongMernJD);
const runB = evaluateJobMatch(sampleMernResume, strongMernJD);

const isDeterministic = (
  runA.matchScore === runB.matchScore &&
  runA.scoringFormula.technicalSkills.score === runB.scoringFormula.technicalSkills.score &&
  runA.scoringFormula.experience.score === runB.scoringFormula.experience.score &&
  runA.scoringFormula.projects.score === runB.scoringFormula.projects.score &&
  runA.scoringFormula.education.score === runB.scoringFormula.education.score &&
  runA.scoringFormula.keywordCoverage.score === runB.scoringFormula.keywordCoverage.score &&
  runA.matchedSkills.length === runB.matchedSkills.length &&
  runA.partiallyMatchedSkills.length === runB.partiallyMatchedSkills.length &&
  runA.missingSkills.length === runB.missingSkills.length
);

console.log(`Deterministic Run A Score: ${runA.matchScore}%`);
console.log(`Deterministic Run B Score: ${runB.matchScore}%`);
console.log(`Test 1 Result: ${isDeterministic ? 'PASS' : 'FAIL'}\n`);

// 2. STRONG MATCH TEST
console.log('--- TEST 2: Strong Match (MERN Developer vs MERN JD) ---');
console.log(`Score: ${runA.matchScore}% (${runA.scoreInterpretation})`);
console.log(`Breakdown:`, {
  tech: runA.scoringFormula.technicalSkills.score,
  exp: runA.scoringFormula.experience.score,
  proj: runA.scoringFormula.projects.score,
  edu: runA.scoringFormula.education.score,
  kw: runA.scoringFormula.keywordCoverage.score
});
console.log(`Matched Skills (${runA.matchedSkills.length}):`, runA.matchedSkills.map(s => s.name).join(', '));
console.log(`Partially Matched Skills (${runA.partiallyMatchedSkills.length}):`, runA.partiallyMatchedSkills.map(s => s.name).join(', '));
console.log(`Missing Skills (${runA.missingSkills.length}):`, runA.missingSkills.map(s => s.name).join(', '));
console.log(`Evidence Rows: ${runA.requirementAlignments.length}`);
console.log(`Recommendations Count: ${runA.prioritizedRecommendations.length}`);
const test2Pass = runA.matchScore >= 80 && runA.matchedSkills.length >= 4;
console.log(`Test 2 Result: ${test2Pass ? 'PASS' : 'FAIL'}\n`);

// 3. PARTIAL MATCH TEST (Node matched, Postgres/Docker/AWS partial or missing)
console.log('--- TEST 3: Partial Match (MERN vs Node/Postgres/Docker/AWS JD) ---');
const runPartial = evaluateJobMatch(sampleMernResume, partialDevOpsBackendJD);
console.log(`Score: ${runPartial.matchScore}% (${runPartial.scoreInterpretation})`);
console.log(`Breakdown:`, {
  tech: runPartial.scoringFormula.technicalSkills.score,
  exp: runPartial.scoringFormula.experience.score,
  proj: runPartial.scoringFormula.projects.score,
  edu: runPartial.scoringFormula.education.score,
  kw: runPartial.scoringFormula.keywordCoverage.score
});
console.log(`Matched Skills:`, runPartial.matchedSkills.map(s => `${s.name} (evidence: "${s.evidence?.[0]?.quote?.substring(0, 40) || ''}...")`));
console.log(`Partially Matched Skills:`, runPartial.partiallyMatchedSkills.map(s => `${s.name} (has ${s.adjacentSkillFound}, gap: ${s.gapReason})`));
console.log(`Missing Skills:`, runPartial.missingSkills.map(s => `${s.name} (${s.impact} impact)`));
const test3Pass = runPartial.matchScore >= 45 && runPartial.matchScore <= 82 && runPartial.missingSkills.length > 0;
console.log(`Test 3 Result: ${test3Pass ? 'PASS' : 'FAIL'}\n`);

// 4. POOR MATCH TEST (MERN vs Python ML JD)
console.log('--- TEST 4: Poor Match (MERN Developer vs Python ML JD) ---');
const runPoor = evaluateJobMatch(sampleMernResume, poorMatchPythonJD);
console.log(`Score: ${runPoor.matchScore}% (${runPoor.scoreInterpretation})`);
console.log(`Breakdown:`, {
  tech: runPoor.scoringFormula.technicalSkills.score,
  exp: runPoor.scoringFormula.experience.score,
  proj: runPoor.scoringFormula.projects.score,
  edu: runPoor.scoringFormula.education.score,
  kw: runPoor.scoringFormula.keywordCoverage.score
});
console.log(`Matched Skills:`, runPoor.matchedSkills.map(s => s.name));
console.log(`Missing Skills:`, runPoor.missingSkills.map(s => s.name));
const test4Pass = runPoor.matchScore < 50;
console.log(`Test 4 Result: ${test4Pass ? 'PASS' : 'FAIL'}\n`);

// 5. EQUIVALENT TERMINOLOGY TEST
console.log('--- TEST 5: Equivalent Terminology Recognition ---');
const jdWithAliases = `
Requirements:
- Proficient in ReactJS or React.js
- NodeJS backend development
- Mongo database indexing
- Containerization or Container tech
`;
const runAliases = evaluateJobMatch(sampleMernResume, jdWithAliases);
const matchedNames = runAliases.matchedSkills.map(s => s.name.toLowerCase());
console.log('Matched skills with aliases:', matchedNames);
const aliasPass = matchedNames.some(n => n.includes('react')) && matchedNames.some(n => n.includes('node')) && matchedNames.some(n => n.includes('mongo'));
console.log(`Test 5 Result: ${aliasPass ? 'PASS' : 'FAIL'}\n`);

// 6. EMPTY & MALFORMED RESUME TEXT TEST
console.log('--- TEST 6: Empty & Malformed Resume Handling ---');
const emptyResume = { id: 'empty-1', title: 'Blank Resume', personalInfo: {}, skills: [], experience: [], projects: [] };
const runEmptyResume = evaluateJobMatch(emptyResume, strongMernJD);
console.log(`Score for empty resume: ${runEmptyResume.matchScore}%`);
const test6Pass = runEmptyResume.matchScore === 0 && !isNaN(runEmptyResume.matchScore);
console.log(`Test 6 Result: ${test6Pass ? 'PASS' : 'FAIL'}\n`);

// 7. EMPTY JOB DESCRIPTION TEST
console.log('--- TEST 7: Empty Job Description Handling ---');
const runEmptyJD = evaluateJobMatch(sampleMernResume, '');
console.log(`Score for empty JD: ${runEmptyJD.matchScore}%`);
const test7Pass = runEmptyJD.matchScore === 0 && !isNaN(runEmptyJD.matchScore);
console.log(`Test 7 Result: ${test7Pass ? 'PASS' : 'FAIL'}\n`);

// 8. EVIDENCE INTEGRITY & HONEST RECOMMENDATIONS
console.log('--- TEST 8: Recommendation & Evidence Integrity ---');
console.log('Sample Prioritized Recommendations from Partial Match:');
runPartial.prioritizedRecommendations.slice(0, 3).forEach((rec, idx) => {
  console.log(` [${idx + 1}] Priority: ${rec.priority} | Title: ${rec.title}`);
  console.log(`     Action: ${rec.actionType}`);
  console.log(`     Section: ${rec.section} | Desc: ${rec.description.substring(0, 80)}...`);
});
const recsPass = runPartial.prioritizedRecommendations.every(r => r.priority && r.title && r.section && r.description);
console.log(`Test 8 Result: ${recsPass ? 'PASS' : 'FAIL'}\n`);

const allPass = isDeterministic && test2Pass && test3Pass && test4Pass && aliasPass && test6Pass && test7Pass && recsPass;
console.log('====================================================');
console.log(`FINAL TEST STATUS: ${allPass ? 'ALL TESTS PASSED SUCCESSFULLY' : 'SOME TESTS FAILED'}`);
console.log('====================================================');

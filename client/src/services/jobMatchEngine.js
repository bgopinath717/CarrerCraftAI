// Deterministic & Explainable Job Match Analysis Engine for CareerCraft AI Client
// Evaluates candidate resume evidence against job descriptions with transparent weighted scoring.

/**
 * Standardized Technical Skill Catalog with Aliases and Related/Adjacent Competencies
 */
const escapeRegex = (str) => (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Tests whether an alias matches a single discrete token (e.g. from skills array or technologies array)
 * Uses strict equality first, then whole-token boundary regex.
 * NEVER matches substrings of unrelated words (e.g. 's3' will never match 'CSS3').
 */
export const matchAliasInToken = (alias, token) => {
  if (!alias || !token) return false;
  const a = String(alias).trim().toLowerCase();
  const t = String(token).trim().toLowerCase();
  if (!a || !t) return false;
  if (t === a) return true;
  const escaped = escapeRegex(a);
  const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
  return regex.test(token);
};

/**
 * Tests whether an alias matches within a larger text passage or sentence
 * Uses word boundaries so that short aliases do not trigger on substrings of longer words.
 */
export const matchAliasInText = (alias, text) => {
  if (!alias || !text) return false;
  const a = String(alias).trim();
  if (!a) return false;
  const escaped = escapeRegex(a);
  const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
  return regex.test(text);
};

/**
 * Standardized Technical Skill Catalog with Aliases and Related/Adjacent Competencies
 */
export const SKILL_CATALOG = [
  // Frontend
  { name: 'React.js', category: 'Frontend', aliases: ['react', 'react.js', 'reactjs', 'react native'], related: ['JavaScript (ES6+)', 'Redux Toolkit', 'Next.js', 'HTML5 & CSS3'] },
  { name: 'JavaScript (ES6+)', category: 'Frontend', aliases: ['javascript', 'js', 'es6', 'es6+', 'ecmascript', 'modern javascript'], related: ['TypeScript', 'React.js', 'Node.js'] },
  { name: 'TypeScript', category: 'Frontend', aliases: ['typescript', 'ts'], related: ['JavaScript (ES6+)', 'React.js', 'Node.js'] },
  { name: 'HTML5 & CSS3', category: 'Frontend', aliases: ['html', 'html5', 'css', 'css3'], related: ['Tailwind CSS', 'Bootstrap', 'Responsive Design'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwind css', 'tailwindcss'], related: ['HTML5 & CSS3', 'Bootstrap'] },
  { name: 'Redux Toolkit', category: 'Frontend', aliases: ['redux', 'redux toolkit', 'rtk', 'state management'], related: ['React.js', 'JavaScript (ES6+)'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['next.js', 'nextjs', 'next js', 'next.js app router'], related: ['React.js', 'Node.js', 'TypeScript'] },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vue.js', 'vuejs'], related: ['JavaScript (ES6+)', 'React.js'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angular', 'angularjs'], related: ['TypeScript', 'JavaScript (ES6+)'] },
  { name: 'Bootstrap', category: 'Frontend', aliases: ['bootstrap'], related: ['HTML5 & CSS3', 'Tailwind CSS'] },

  // Backend & APIs
  { name: 'Node.js', category: 'Backend', aliases: ['node', 'node.js', 'nodejs', 'node js'], related: ['Express.js', 'JavaScript (ES6+)', 'RESTful APIs'] },
  { name: 'Express.js', category: 'Backend', aliases: ['express', 'express.js', 'expressjs', 'express js'], related: ['Node.js', 'RESTful APIs', 'JWT Authentication'] },
  { name: 'RESTful APIs', category: 'Backend', aliases: ['rest', 'restful', 'rest api', 'rest apis', 'restful api', 'api integration', 'apis'], related: ['Express.js', 'Node.js', 'Postman'] },
  { name: 'GraphQL', category: 'Backend', aliases: ['graphql', 'apollo'], related: ['RESTful APIs', 'Node.js'] },
  { name: 'JWT Authentication', category: 'Backend', aliases: ['jwt', 'json web token', 'json web tokens', 'json web tokens (jwt)', 'authentication', 'auth', 'oauth', 'jwt auth'], related: ['Express.js', 'Node.js', 'Security'] },
  { name: 'Python', category: 'Backend', aliases: ['python', 'django', 'flask', 'fastapi'], related: ['Backend', 'SQL'] },
  { name: 'Java / Spring Boot', category: 'Backend', aliases: ['java', 'spring', 'spring boot'], related: ['Backend', 'SQL'] },

  // Databases
  { name: 'MongoDB', category: 'Databases', aliases: ['mongodb', 'mongo', 'mongoose', 'nosql'], related: ['PostgreSQL', 'MySQL', 'Node.js', 'Express.js'] },
  { name: 'PostgreSQL', category: 'Databases', aliases: ['postgresql', 'postgres', 'psql'], related: ['SQL', 'MySQL', 'MongoDB'] },
  { name: 'MySQL', category: 'Databases', aliases: ['mysql'], related: ['SQL', 'PostgreSQL', 'Relational Databases'] },
  { name: 'SQL', category: 'Databases', aliases: ['sql', 'mysql', 'postgresql', 'postgres', 'relational database', 'rdbms', 'sqlite', 'queries'], related: ['PostgreSQL', 'MySQL', 'MongoDB'] },
  { name: 'Redis', category: 'Databases', aliases: ['redis', 'caching', 'cache'], related: ['Backend', 'Node.js'] },

  // DevOps & Cloud
  { name: 'Git & Version Control', category: 'DevOps & Tools', aliases: ['git', 'github', 'gitlab', 'version control'], related: ['CI/CD Pipelines', 'Development Workflow'] },
  { name: 'Docker', category: 'DevOps & Tools', aliases: ['docker', 'container', 'containerization', 'dockerfile', 'docker-compose'], related: ['Kubernetes', 'AWS (Amazon Web Services)', 'CI/CD Pipelines'] },
  { name: 'Kubernetes', category: 'DevOps & Tools', aliases: ['kubernetes', 'k8s'], related: ['Docker', 'Cloud Infrastructure'] },
  { name: 'AWS (Amazon Web Services)', category: 'Cloud', aliases: ['aws', 'amazon web services', 'amazon s3', 'aws s3', 's3', 'ec2', 'aws lambda', 'lambda', 'dynamodb', 'cloudfront', 'cloudwatch'], related: ['Azure', 'GCP (Google Cloud)', 'Docker'] },
  { name: 'Azure', category: 'Cloud', aliases: ['azure', 'microsoft azure', 'azure devops'], related: ['AWS (Amazon Web Services)', 'Cloud'] },
  { name: 'GCP (Google Cloud)', category: 'Cloud', aliases: ['gcp', 'google cloud', 'google cloud platform', 'bigquery'], related: ['AWS (Amazon Web Services)', 'Cloud'] },
  { name: 'CI/CD Pipelines', category: 'DevOps & Tools', aliases: ['ci/cd', 'ci cd', 'continuous integration', 'github actions', 'jenkins', 'pipeline'], related: ['Git & Version Control', 'Docker'] },
  { name: 'Linux', category: 'DevOps & Tools', aliases: ['linux', 'bash', 'shell', 'unix'], related: ['DevOps & Tools'] },

  // Quality & Architecture
  { name: 'Unit Testing & Jest', category: 'Quality Assurance', aliases: ['jest', 'unit testing', 'testing', 'mocha', 'cypress', 'test-driven'], related: ['JavaScript (ES6+)', 'React.js'] },
  { name: 'Postman', category: 'DevOps & Tools', aliases: ['postman', 'api testing'], related: ['RESTful APIs'] },
  { name: 'Agile & Scrum', category: 'Methodologies', aliases: ['agile', 'scrum', 'kanban', 'sprint'], related: ['Team Collaboration'] },
  { name: 'Full Stack Architecture', category: 'Architecture', aliases: ['full stack', 'fullstack', 'mern', 'mean', 'system design', 'scalable architecture'], related: ['React.js', 'Node.js', 'MongoDB'] }
];

const RESPONSIBILITY_PATTERNS = [
  { id: 'api_dev', name: 'API Design & Backend Integration', pattern: /api|backend|endpoint|restful|microservice|service/i },
  { id: 'frontend_ui', name: 'Responsive Frontend Interface Engineering', pattern: /ui|frontend|component|responsive|user interface|client-side/i },
  { id: 'database_design', name: 'Database Modeling & Query Optimization', pattern: /database|schema|modeling|query|nosql|sql|mongodb|aggregation/i },
  { id: 'auth_security', name: 'Authentication, Authorization & Security', pattern: /auth|security|jwt|session|protect|permission|token/i },
  { id: 'deployment_devops', name: 'Containerization, Deployment & DevOps', pattern: /deploy|docker|container|cloud|aws|ci\/cd|pipeline|hosting/i },
  { id: 'collaboration', name: 'Agile Collaboration & Version Control', pattern: /git|team|collaborat|agile|scrum|code review|sprint/i },
  { id: 'testing_perf', name: 'Testing, Quality Assurance & Performance Tuning', pattern: /test|perf|optim|debug|maintain|scalable|refactor/i }
];

export const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim().length > 0) {
    return val.split(/[,;\n|]+/).map(s => s.trim()).filter(Boolean);
  }
  return [];
};

export const ensureBullets = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim().length > 0) return [val.trim()];
  return [];
};

export const parseResumeText = (rawText) => {
  const text = (rawText || '').trim();
  if (!text) {
    return {
      fullName: 'Candidate',
      title: 'Applicant',
      summary: '',
      skills: [],
      experience: [],
      projects: [],
      education: [],
      certifications: [],
      rawText: ''
    };
  }

  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);

  let fullName = 'Candidate';
  let title = 'Applicant';
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/[|•\-,].*$/, '').trim();
    if (firstLine.length > 2 && firstLine.length < 50 && !/summary|skills|experience|education|curriculum|resume/i.test(firstLine)) {
      fullName = firstLine;
    }
  }
  if (lines.length > 1) {
    const secondLine = lines[1].trim();
    if (secondLine.length > 3 && secondLine.length < 70 && !/summary|skills|experience|education|email|phone|http/i.test(secondLine)) {
      title = secondLine;
    }
  }

  const sections = {
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    general: []
  };

  let currentSection = 'general';
  const headerMap = [
    { regex: /^(?:professional\s+)?summary|profile|about\s+me|objective/i, key: 'summary' },
    { regex: /^(?:technical\s+|core\s+)?skills|competencies|technologies|tech\s+stack/i, key: 'skills' },
    { regex: /^(?:work\s+|professional\s+)?experience|employment|work\s+history/i, key: 'experience' },
    { regex: /^(?:key\s+|featured\s+|personal\s+)?projects|technical\s+projects/i, key: 'projects' },
    { regex: /^education|academic\s+background|qualifications/i, key: 'education' },
    { regex: /^certifications|certificates|licenses|courses/i, key: 'certifications' }
  ];

  for (const line of lines) {
    const matchedHeader = headerMap.find(h => h.regex.test(line.replace(/[:\-–—#*]+$/, '').trim()));
    if (matchedHeader && line.length < 40) {
      currentSection = matchedHeader.key;
    } else {
      sections[currentSection].push(line);
    }
  }

  const extractedSkills = new Set();
  sections.skills.forEach(line => {
    line.split(/[,;|•·\t\n]+/).forEach(s => {
      const clean = s.trim();
      if (clean.length > 1 && clean.length < 40) {
        extractedSkills.add(clean);
      }
    });
  });

  SKILL_CATALOG.forEach(item => {
    if (item.aliases.some(alias => matchAliasInText(alias, text))) {
      extractedSkills.add(item.name);
    }
  });

  const experienceItems = [];
  let currentExp = null;
  const expLines = sections.experience.length > 0 ? sections.experience : lines;

  expLines.forEach(line => {
    const isJobTitle = /engineer|developer|architect|consultant|manager|lead|intern|analyst|specialist/i.test(line) && line.length < 80;
    const isDateLine = /\b(?:19|20)\d{2}\b|\bpresent\b|\bcurrent\b/i.test(line);

    if (isJobTitle || (isDateLine && !currentExp)) {
      if (currentExp) experienceItems.push(currentExp);
      currentExp = {
        position: line,
        company: 'Company',
        description: '',
        bullets: []
      };
    } else if (currentExp) {
      if (/^[•\-\*·]\s*/.test(line) || line.length > 30) {
        currentExp.bullets.push(line.replace(/^[•\-\*·]\s*/, '').trim());
      } else {
        currentExp.description += ' ' + line;
      }
    }
  });
  if (currentExp) experienceItems.push(currentExp);

  if (experienceItems.length === 0) {
    const dutyBullets = lines.filter(l => /^[•\-\*·]\s*/.test(l) && l.length > 25);
    if (dutyBullets.length > 0) {
      experienceItems.push({
        position: 'Software Engineering Experience',
        company: 'Professional Background',
        description: 'Demonstrated software development experience across multiple projects and roles.',
        bullets: dutyBullets.map(b => b.replace(/^[•\-\*·]\s*/, '').trim())
      });
    }
  }

  const projectItems = [];
  let currentProj = null;
  sections.projects.forEach(line => {
    const isProjHeader = line.length < 60 && !/^[•\-\*·]/.test(line);
    if (isProjHeader) {
      if (currentProj) projectItems.push(currentProj);
      currentProj = {
        name: line,
        technologies: [],
        description: '',
        bullets: []
      };
    } else if (currentProj) {
      if (/^[•\-\*·]\s*/.test(line)) {
        currentProj.bullets.push(line.replace(/^[•\-\*·]\s*/, '').trim());
      } else {
        currentProj.description += ' ' + line;
      }
    }
  });
  if (currentProj) projectItems.push(currentProj);

  if (projectItems.length === 0) {
    const projMentionLines = lines.filter(l => /\bproject\b|\bplatform\b|\bapplication\b|\bsystem\b/i.test(l) && l.length > 20);
    if (projMentionLines.length > 0) {
      projectItems.push({
        name: 'Technical Project Portfolio',
        technologies: Array.from(extractedSkills).slice(0, 5),
        description: projMentionLines.slice(0, 2).join(' '),
        bullets: projMentionLines.slice(0, 4)
      });
    }
  }

  const educationItems = [];
  const eduLines = sections.education.length > 0 ? sections.education : lines;
  eduLines.forEach(line => {
    if (/bachelor|master|b\.e|b\.tech|bca|mca|b\.s|m\.s|diploma|phd|degree|university|institute|college/i.test(line) && line.length < 100) {
      educationItems.push({
        degree: line,
        institution: 'University / Institution'
      });
    }
  });

  return {
    fullName,
    title,
    summary: sections.summary.join(' ') || '',
    skills: Array.from(extractedSkills),
    experience: experienceItems,
    projects: projectItems,
    education: educationItems,
    certifications: sections.certifications,
    rawText: text
  };
};

export const normalizeResumeData = (resumeInput) => {
  if (!resumeInput) {
    return {
      fullName: '',
      title: '',
      summary: '',
      skills: [],
      experience: [],
      projects: [],
      education: [],
      certifications: [],
      rawText: ''
    };
  }

  if (typeof resumeInput === 'string') {
    return parseResumeText(resumeInput);
  }

  const pInfo = resumeInput.personalInfo || {};
  let flatSkills = [];
  if (Array.isArray(resumeInput.skills)) {
    flatSkills = resumeInput.skills.map(s => typeof s === 'string' ? s : (s.name || s.title || '')).filter(Boolean);
  } else if (resumeInput.skills && typeof resumeInput.skills === 'object') {
    const skillsObj = resumeInput.skills;
    flatSkills = [
      ...ensureArray(skillsObj.technical),
      ...ensureArray(skillsObj.frameworks),
      ...ensureArray(skillsObj.tools),
      ...ensureArray(skillsObj.databases),
      ...ensureArray(skillsObj.languages),
      ...ensureArray(skillsObj.soft)
    ];
  }

  const experience = Array.isArray(resumeInput.experience) ? resumeInput.experience : [];
  const projects = Array.isArray(resumeInput.projects) ? resumeInput.projects : [];
  const education = Array.isArray(resumeInput.education) ? resumeInput.education : [];
  const certifications = Array.isArray(resumeInput.certifications) ? resumeInput.certifications : [];

  const textSegments = [
    pInfo.fullName,
    pInfo.title,
    pInfo.summary || resumeInput.summary,
    flatSkills.join(', '),
    experience.map(e => `${e.position || e.title || ''} at ${e.company || ''}: ${e.description || ''} ${ensureBullets(e.bullets).join(' ')}`).join('\n'),
    projects.map(p => `${p.name || p.title || ''}: ${p.description || ''} ${ensureArray(p.technologies).join(', ')} ${ensureBullets(p.bullets).join(' ')}`).join('\n'),
    education.map(ed => `${ed.degree || ''} ${ed.institution || ''} ${ed.fieldOfStudy || ''}`).join('\n'),
    certifications.map(c => typeof c === 'string' ? c : `${c.name || ''} ${c.issuer || ''}`).join('\n')
  ];

  return {
    fullName: pInfo.fullName || 'Candidate',
    title: pInfo.title || 'Developer',
    summary: pInfo.summary || resumeInput.summary || '',
    skills: flatSkills,
    experience,
    projects,
    education,
    certifications,
    rawText: textSegments.filter(Boolean).join('\n')
  };
};

const findEvidenceInResume = (catalogItem, resume) => {
  const aliases = catalogItem.aliases;
  const quotes = [];

  // Check Skills section using discrete token matching (never loose substring)
  const matchedSkillTag = (resume.skills || []).find(sk =>
    aliases.some(alias => matchAliasInToken(alias, sk))
  );
  if (matchedSkillTag) {
    quotes.push({ section: 'Technical Skills', quote: `Listed as "${matchedSkillTag}" in Skills section.` });
  }

  // Check Projects
  (resume.projects || []).forEach(proj => {
    const projName = proj.name || proj.title || 'Project';
    const techArray = ensureArray(proj.technologies);
    const techMatch = techArray.find(t =>
      aliases.some(alias => matchAliasInToken(alias, t))
    );
    if (techMatch) {
      quotes.push({ section: 'Projects', quote: `Applied in project "${projName}" (${techMatch}).` });
    }
    const bullets = ensureBullets(proj.bullets);
    const bulletMatch = bullets.find(b =>
      aliases.some(alias => matchAliasInText(alias, b))
    );
    if (bulletMatch) {
      quotes.push({ section: 'Projects', quote: `"${projName}": ${bulletMatch}` });
    }
  });

  // Check Work Experience
  (resume.experience || []).forEach(exp => {
    const roleTitle = `${exp.position || exp.title || 'Role'} at ${exp.company || 'Company'}`;
    const desc = exp.description || '';
    const hasInDesc = aliases.some(alias => matchAliasInText(alias, desc));
    if (hasInDesc) {
      quotes.push({ section: 'Work Experience', quote: `${roleTitle}: ${desc.slice(0, 120)}...` });
    }
    ensureBullets(exp.bullets).forEach(b => {
      const hasInBullet = aliases.some(alias => matchAliasInText(alias, b));
      if (hasInBullet) {
        quotes.push({ section: 'Work Experience', quote: `${roleTitle}: ${b}` });
      }
    });
  });

  // Check Summary
  if (resume.summary) {
    const hasInSummary = aliases.some(alias => matchAliasInText(alias, resume.summary));
    if (hasInSummary) {
      quotes.push({ section: 'Professional Summary', quote: `Mentioned in summary: "${resume.summary.slice(0, 100)}..."` });
    }
  }

  // Also search rawText for direct evidence lines
  if (quotes.length === 0 && resume.rawText) {
    const lines = resume.rawText.split(/[\r\n]+/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 15 && aliases.some(alias => matchAliasInText(alias, trimmed))) {
        quotes.push({ section: 'Resume Text', quote: trimmed.length > 130 ? trimmed.slice(0, 130) + '...' : trimmed });
        if (quotes.length >= 2) break;
      }
    }
  }

  return quotes;
};

const findPartialEvidenceInResume = (catalogItem, resume) => {
  const relatedList = catalogItem.related || [];
  const adjacentFindings = [];

  relatedList.forEach(relName => {
    const relatedItem = SKILL_CATALOG.find(c => c.name.toLowerCase() === relName.toLowerCase());
    if (relatedItem) {
      const quotes = findEvidenceInResume(relatedItem, resume);
      if (quotes.length > 0) {
        adjacentFindings.push({
          relatedSkill: relatedItem.name,
          evidence: quotes[0].quote
        });
      }
    }
  });

  return adjacentFindings;
};

export const evaluateJobMatch = (resumeInput, jobDescriptionText) => {
  const normJD = (jobDescriptionText || '').trim();
  const resume = normalizeResumeData(resumeInput);
  const normResumeText = resume.rawText.trim().toLowerCase();

  if (!normJD || normJD.length < 10) {
    return {
      matchScore: 0,
      scoreInterpretation: 'No Analysis — Job description is empty or insufficient.',
      scoringFormula: {
        technicalSkills: { weight: '40%', score: 0 },
        experience: { weight: '25%', score: 0 },
        projects: { weight: '20%', score: 0 },
        education: { weight: '10%', score: 0 },
        keywordCoverage: { weight: '5%', score: 0 },
        formulaExplanation: 'Overall Score = (Technical Skills × 40%) + (Experience × 25%) + (Projects × 20%) + (Education × 10%) + (Keyword Coverage × 5%)'
      },
      matchedSkills: [],
      partiallyMatchedSkills: [],
      missingSkills: [],
      requiredSkills: [],
      requirementAlignments: [],
      sectionAlignments: {
        projects: [],
        experience: { totalRoles: 0, rolesSummary: 'No work experience found', responsibilitiesEvaluated: [] },
        education: { degrees: [], certifications: [], status: 'No education records found' }
      },
      recommendations: ['Please paste a complete job description with technical requirements and responsibilities to analyze alignment.'],
      prioritizedRecommendations: [{
        priority: 'High',
        title: 'Provide Job Requirements',
        section: 'Job Description Input',
        actionType: 'Input Job Description',
        description: 'Paste the target job description containing responsibilities and required skills to evaluate match score.'
      }],
      disclaimer: 'Job Match Score is an algorithmic alignment estimate based on resume evidence vs. posted requirements.'
    };
  }

  if (!normResumeText || normResumeText.length < 10) {
    return {
      matchScore: 0,
      scoreInterpretation: 'No Analysis — Resume contains insufficient or unreadable text.',
      scoringFormula: {
        technicalSkills: { weight: '40%', score: 0 },
        experience: { weight: '25%', score: 0 },
        projects: { weight: '20%', score: 0 },
        education: { weight: '10%', score: 0 },
        keywordCoverage: { weight: '5%', score: 0 },
        formulaExplanation: 'Overall Score = (Technical Skills × 40%) + (Experience × 25%) + (Projects × 20%) + (Education × 10%) + (Keyword Coverage × 5%)'
      },
      matchedSkills: [],
      partiallyMatchedSkills: [],
      missingSkills: [],
      requiredSkills: [],
      requirementAlignments: [],
      sectionAlignments: {
        projects: [],
        experience: { totalRoles: 0, rolesSummary: 'No work experience found', responsibilitiesEvaluated: [] },
        education: { degrees: [], certifications: [], status: 'No education records found' }
      },
      recommendations: ['Select or upload a resume with readable text, skills, and experience to analyze alignment.'],
      prioritizedRecommendations: [{
        priority: 'High',
        title: 'Complete Resume Content',
        section: 'Resume Profile',
        actionType: 'Update Resume',
        description: 'Ensure your resume includes skills, experience, and education details before analyzing against a job.'
      }],
      disclaimer: 'Job Match Score is an algorithmic alignment estimate based on resume evidence vs. posted requirements.'
    };
  }

  const detectedSkills = [];
  SKILL_CATALOG.forEach(item => {
    const isMentioned = item.aliases.some(alias => matchAliasInText(alias, normJD));
    if (isMentioned) {
      detectedSkills.push(item);
    }
  });

  if (detectedSkills.length < 3 && normJD.length > 20) {
    const words = normJD.split(/[\s,;:\n\r()\[\]\/•\-*]+/).filter(w => w.length > 3);
    const stopWords = new Set(['position', 'company', 'requirements', 'experience', 'strong', 'looking', 'developer', 'engineer', 'solutions', 'technologies', 'responsibilities', 'qualifications', 'with', 'from', 'this', 'that', 'have', 'must', 'plus', 'able', 'will', 'team', 'work']);
    const customKws = [];
    words.forEach(w => {
      const low = w.toLowerCase();
      if (!stopWords.has(low) && !customKws.includes(low)) {
        customKws.push(low);
      }
    });
    customKws.slice(0, 5).forEach(kw => {
      const name = kw.charAt(0).toUpperCase() + kw.slice(1);
      detectedSkills.push({
        name,
        category: 'Target Requirement',
        aliases: [kw],
        related: []
      });
    });
  }

  const matchedSkills = [];
  const partiallyMatchedSkills = [];
  const missingSkills = [];
  const requirementAlignments = [];

  detectedSkills.forEach(item => {
    const directEvidence = findEvidenceInResume(item, resume);

    if (directEvidence.length > 0) {
      const matchedObj = {
        name: item.name,
        category: item.category,
        evidence: directEvidence[0].quote,
        section: directEvidence[0].section,
        allQuotes: directEvidence
      };
      matchedSkills.push(matchedObj);

      requirementAlignments.push({
        requirement: item.name,
        category: item.category,
        status: 'Matched',
        evidenceFound: directEvidence[0].quote,
        actionableAdvice: `Strong match. Keep this prominently visible in your ${directEvidence[0].section} section.`
      });
    } else {
      const partialEvidence = findPartialEvidenceInResume(item, resume);

      if (partialEvidence.length > 0) {
        const partialObj = {
          name: item.name,
          category: item.category,
          adjacentSkillFound: partialEvidence[0].relatedSkill,
          evidence: partialEvidence[0].evidence,
          gapExplanation: `You possess demonstrated competencies in ${partialEvidence.map(p => p.relatedSkill).join(', ')}, which provides a solid foundational base for ${item.name}.`
        };
        partiallyMatchedSkills.push(partialObj);

        requirementAlignments.push({
          requirement: item.name,
          category: item.category,
          status: 'Partially Matched',
          evidenceFound: `Adjacent background in ${partialEvidence[0].relatedSkill}: "${partialEvidence[0].evidence.slice(0, 100)}..."`,
          actionableAdvice: `Demonstrate how your experience with ${partialEvidence[0].relatedSkill} translates to ${item.name}. Highlight transferable architecture concepts.`
        });
      } else {
        const missingObj = {
          name: item.name,
          category: item.category,
          importance: 'Core Requirement',
          recommendation: `Add explicit practical evidence or project application of ${item.name} if you have working knowledge.`,
          distinction: 'Missing from resume text (not evidence of inability)'
        };
        missingSkills.push(missingObj);

        requirementAlignments.push({
          requirement: item.name,
          category: item.category,
          status: 'Not Found',
          evidenceFound: 'No explicit keyword or project application found in resume text.',
          actionableAdvice: `If you possess experience with ${item.name}, describe a project or module where you applied it. If new to it, complete a focused tutorial or proof-of-concept project.`
        });
      }
    }
  });

  const responsibilityAlignments = [];
  RESPONSIBILITY_PATTERNS.forEach(pat => {
    if (pat.pattern.test(normJD)) {
      const matchesResume = pat.pattern.test(normResumeText);
      responsibilityAlignments.push({
        name: pat.name,
        demandedInJD: true,
        demonstratedInResume: matchesResume,
        status: matchesResume ? 'Aligned' : 'Opportunity to Highlight'
      });
    }
  });

  const totalRequiredSkills = Math.max(1, detectedSkills.length);
  const earnedSkillPoints = (matchedSkills.length * 1.0) + (partiallyMatchedSkills.length * 0.5);
  const technicalSkillsScore = Math.min(100, Math.round((earnedSkillPoints / totalRequiredSkills) * 100));

  let experienceScore = 0;
  const hasWorkExp = (resume.experience || []).length > 0 || /\b(?:experience|engineer|developer|architect|lead|analyst|worked|years)\b/i.test(normResumeText);
  if (hasWorkExp) {
    const alignedDuties = responsibilityAlignments.filter(r => r.demonstratedInResume).length;
    const totalDemanded = responsibilityAlignments.length;
    if (totalDemanded > 0) {
      experienceScore = Math.round((alignedDuties / totalDemanded) * 100);
    } else {
      experienceScore = Math.min(100, Math.round(20 + (technicalSkillsScore * 0.8)));
    }
  } else if ((resume.projects || []).length >= 2) {
    experienceScore = Math.min(100, Math.round(technicalSkillsScore * 0.6));
  }

  let projectsScore = 0;
  const projectCount = (resume.projects || []).length;
  let techOverlapCount = 0;
  if (projectCount > 0) {
    (resume.projects || []).forEach(p => {
      const pTechList = ensureArray(p.technologies);
      const pBullets = ensureBullets(p.bullets).join(' ');
      const pDesc = `${p.description || ''} ${pBullets}`;
      detectedSkills.forEach(s => {
        const matchesTech = s.aliases.some(a => pTechList.some(t => matchAliasInToken(a, t)));
        const matchesDesc = s.aliases.some(a => matchAliasInText(a, pDesc));
        if (matchesTech || matchesDesc) {
          techOverlapCount++;
        }
      });
    });
  } else {
    detectedSkills.forEach(s => {
      if (s.aliases.some(a => matchAliasInText(a, normResumeText))) {
        techOverlapCount++;
      }
    });
  }

  if (projectCount > 0 || /\b(?:project|built|developed|created|implemented|system|platform|app)\b/i.test(normResumeText)) {
    projectsScore = Math.min(100, Math.round((techOverlapCount / Math.max(1, detectedSkills.length)) * 100));
    if (projectsScore === 0) {
      projectsScore = Math.min(40, Math.round(15 + (technicalSkillsScore * 0.25)));
    }
  }

  let educationScore = 0;
  const hasEdu = (resume.education || []).length > 0 || /bachelor|master|b\.e|b\.tech|bca|mca|b\.s|m\.s|degree|university|college|diploma|phd/i.test(normResumeText);
  if (hasEdu) {
    const eduText = ((resume.education || []).map(e => `${e.degree || ''} ${e.fieldOfStudy || ''}`).join(' ') + ' ' + normResumeText).toLowerCase();
    if (/computer|technology|engineering|software|information|b\.tech|b\.e|bca|mca/i.test(eduText)) {
      educationScore = 95;
    } else {
      educationScore = 75;
    }
    if ((resume.certifications || []).length > 0 || /certified|certification|certificate/i.test(normResumeText)) {
      educationScore = Math.min(100, educationScore + 5);
    }
  }

  let keywordScore = 0;
  if (matchedSkills.length > 0) {
    keywordScore = Math.min(100, Math.round((matchedSkills.length / totalRequiredSkills) * 100));
  }

  const weightedOverall = Math.round(
    (technicalSkillsScore * 0.40) +
    (experienceScore * 0.25) +
    (projectsScore * 0.20) +
    (educationScore * 0.10) +
    (keywordScore * 0.05)
  );

  const matchScore = Math.min(99, Math.max(0, weightedOverall));

  const relevantProjects = (resume.projects || []).map(p => {
    const pTechList = ensureArray(p.technologies);
    const pBulletList = ensureBullets(p.bullets);
    const pCombined = `${p.description || ''} ${pBulletList.join(' ')}`;
    const overlappingTech = detectedSkills
      .filter(s => s.aliases.some(a => pTechList.some(t => matchAliasInToken(a, t)) || matchAliasInText(a, pCombined)))
      .map(s => s.name);
    return {
      name: p.name || p.title || 'Project',
      description: p.description || '',
      overlappingTech,
      alignmentLevel: overlappingTech.length >= 2 ? 'Strong Alignment' : overlappingTech.length === 1 ? 'Moderate Alignment' : 'Supplemental Project'
    };
  });

  const experienceAlignment = {
    totalRoles: (resume.experience || []).length,
    rolesSummary: (resume.experience || []).map(e => `${e.position || 'Role'} at ${e.company || 'Company'}`).join(', ') || 'Project-based engineering focus',
    responsibilitiesEvaluated: responsibilityAlignments
  };

  const educationAlignment = {
    degrees: (resume.education || []).map(ed => `${ed.degree || 'Degree'} from ${ed.institution || 'University'}`),
    certifications: (resume.certifications || []).map(c => typeof c === 'string' ? c : c.name),
    status: educationScore >= 90 ? 'Meets Technical Degree Requirements' : 'Relevant Academic & Training Background'
  };

  const prioritizedRecommendations = [];

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3).map(m => m.name).join(', ');
    prioritizedRecommendations.push({
      priority: 'High',
      title: `Address Core Missing Keywords (${topMissing})`,
      section: 'Technical Skills & Projects',
      actionType: 'Clarify Framing / Add Evidence',
      description: `The job posting explicitly highlights ${topMissing}. If you have practical familiarity with these tools, add them with genuine context under your Technical Skills and describe how you used them in your project bullets. If you are new to them, consider building a quick mini-project rather than keyword stuffing.`
    });
  }

  if (partiallyMatchedSkills.length > 0) {
    const partialNames = partiallyMatchedSkills.slice(0, 2).map(p => `${p.name} (via ${p.adjacentSkillFound})`).join(', ');
    prioritizedRecommendations.push({
      priority: 'Medium',
      title: `Highlight Transferable Competencies (${partialNames})`,
      section: 'Projects & Work Experience',
      actionType: 'Highlight Transferable Skill',
      description: `You have strong adjacent experience with ${partiallyMatchedSkills.map(p => p.adjacentSkillFound).join(', ')}. In your project descriptions, emphasize architectural principles (e.g. database query design, REST API security, state management) to demonstrate your readiness for ${partiallyMatchedSkills.map(p => p.name).join(', ')}.`
    });
  }

  prioritizedRecommendations.push({
    priority: 'Medium',
    title: 'Quantify Engineering Impact in Resume Bullets',
    section: 'Projects & Experience Bullets',
    actionType: 'Add Metrics',
    description: 'Ensure each bullet follows the "Action Verb + Technical Tool + Measurable Outcome" structure (e.g., "Engineered REST APIs with Express and MongoDB, reducing latency by 25% and supporting 1,000+ daily requests"). Recruiters and ATS parsers rank quantified bullets higher.'
  });

  const topMatched = matchedSkills.slice(0, 3).map(m => m.name).join(', ');
  prioritizedRecommendations.push({
    priority: 'Low',
    title: 'Align Professional Summary with Target Role',
    section: 'Professional Summary',
    actionType: 'Tailor Intro',
    description: `Tailor your opening summary to explicitly mention your strongest overlapping competencies: ${topMatched || 'Full Stack development'}. Position your core strengths within the first 3 lines of your resume.`
  });

  return {
    candidateName: resume.fullName || 'Candidate',
    matchScore,
    scoreInterpretation: matchScore >= 80 ? 'Strong Fit — High alignment with core requirements' : matchScore >= 60 ? 'Moderate Fit — Solid foundation with target enhancement opportunities' : 'Growth Fit — Key technical requirements need further resume evidence',
    scoringFormula: {
      technicalSkills: { weight: '40%', score: technicalSkillsScore },
      experience: { weight: '25%', score: experienceScore },
      projects: { weight: '20%', score: projectsScore },
      education: { weight: '10%', score: educationScore },
      keywordCoverage: { weight: '5%', score: keywordScore },
      formulaExplanation: 'Overall Score = (Technical Skills × 40%) + (Experience × 25%) + (Projects × 20%) + (Education × 10%) + (Keyword Coverage × 5%)'
    },
    matchedSkills,
    partiallyMatchedSkills,
    missingSkills,
    requiredSkills: detectedSkills.map(s => s.name),
    requirementAlignments,
    sectionAlignments: {
      projects: relevantProjects,
      experience: experienceAlignment,
      education: educationAlignment
    },
    recommendations: prioritizedRecommendations.map(r => `${r.title}: ${r.description}`),
    prioritizedRecommendations,
    disclaimer: 'Job Match Score is an algorithmic alignment estimate based on resume evidence vs. posted requirements. It assesses semantic relevance and does not constitute a guarantee of recruiter review or interview selection.'
  };
};

export default {
  evaluateJobMatch,
  SKILL_CATALOG,
  normalizeResumeData
};

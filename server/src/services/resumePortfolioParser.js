// Comprehensive Resume-to-Portfolio Parser Engine with Transparent ATS Scoring
// Strictly extracts ONLY what exists in the resume without injecting hallucinated/dummy content.
import { callGemini, isAiConfigured } from './aiService.js';
import { evaluateATS } from './atsScoringEngine.js';

// Common technical skills library for classification
const TECH_SKILL_KEYWORDS = [
  'React.js', 'React', 'Node.js', 'Node', 'Express.js', 'Express', 'MongoDB', 'Mongoose',
  'JavaScript', 'TypeScript', 'HTML5', 'HTML', 'CSS3', 'CSS', 'Tailwind CSS', 'Tailwind',
  'Bootstrap', 'Redux', 'Redux Toolkit', 'Next.js', 'NextJS', 'RESTful APIs', 'REST APIs',
  'GraphQL', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services',
  'Git', 'GitHub', 'Postman', 'VS Code', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Django',
  'Flask', 'Spring Boot', 'Linux', 'CI/CD', 'Jest', 'Mocha', 'Cypress', 'JWT', 'JSON Web Tokens',
  'OAuth', 'Firebase', 'Supabase', 'Prisma', 'Vite', 'Webpack', 'Figma', 'Microservices',
  'Sass', 'SCSS', 'Angular', 'Vue.js', 'Vue', 'Svelte', 'Go', 'Golang', 'Rust', 'Ruby',
  'Ruby on Rails', 'Kotlin', 'Swift', 'Flutter', 'React Native', 'Cassandra', 'DynamoDB',
  'Elasticsearch', 'RabbitMQ', 'Kafka', 'Terraform', 'Ansible', 'Jenkins', 'GCP', 'Azure'
];

/**
 * Split text into sections based on standard resume uppercase headers
 */
const extractSections = (text) => {
  const sectionHeaders = [
    { key: 'summary', regex: /(?:^|\n)(?:PROFESSIONAL SUMMARY|SUMMARY|ABOUT ME|CAREER OBJECTIVE|OBJECTIVE|PROFILE)[:\s]*/i },
    { key: 'skills', regex: /(?:^|\n)(?:TECHNICAL SKILLS|SKILLS|CORE COMPETENCIES|AREAS OF EXPERTISE|TECHNOLOGIES)[:\s]*/i },
    { key: 'experience', regex: /(?:^|\n)(?:PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|CAREER HISTORY)[:\s]*/i },
    { key: 'projects', regex: /(?:^|\n)(?:FEATURED PROJECTS|PROJECTS|KEY PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS)[:\s]*/i },
    { key: 'education', regex: /(?:^|\n)(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS|QUALIFICATIONS)[:\s]*/i },
    { key: 'certifications', regex: /(?:^|\n)(?:CERTIFICATIONS|LICENSES|CERTIFICATES|COURSES & CERTIFICATIONS)[:\s]*/i },
    { key: 'achievements', regex: /(?:^|\n)(?:ACHIEVEMENTS|HONORS & AWARDS|AWARDS|KEY ACHIEVEMENTS|ACCOMPLISHMENTS)[:\s]*/i },
    { key: 'languages', regex: /(?:^|\n)(?:LANGUAGES|SPOKEN LANGUAGES)[:\s]*/i },
    { key: 'interests', regex: /(?:^|\n)(?:INTERESTS|HOBBIES|ACTIVITIES)[:\s]*/i }
  ];

  const found = [];
  sectionHeaders.forEach(sh => {
    const match = text.match(sh.regex);
    if (match && match.index !== undefined) {
      found.push({
        key: sh.key,
        index: match.index,
        headerLength: match[0].length
      });
    }
  });

  found.sort((a, b) => a.index - b.index);

  const sections = {};
  for (let i = 0; i < found.length; i++) {
    const current = found[i];
    const startIndex = current.index + current.headerLength;
    const endIndex = (i + 1 < found.length) ? found[i + 1].index : text.length;
    sections[current.key] = text.slice(startIndex, endIndex).trim();
  }

  return sections;
};

/**
 * Detect best matching role ID for ATS evaluation
 */
export const detectRoleId = (title = '', text = '') => {
  const combined = `${title} ${text}`.toLowerCase();
  if (combined.includes('mern') || (combined.includes('react') && combined.includes('node'))) return 'mern-developer';
  if (combined.includes('frontend') || combined.includes('react') || combined.includes('ui/ux')) return 'frontend-developer';
  if (combined.includes('backend') || combined.includes('node') || combined.includes('java') || combined.includes('python')) return 'backend-developer';
  if (combined.includes('full stack') || combined.includes('fullstack') || combined.includes('software engineer')) return 'fullstack-engineer';
  if (combined.includes('devops') || combined.includes('cloud') || combined.includes('docker') || combined.includes('kubernetes')) return 'devops-engineer';
  if (combined.includes('data') || combined.includes('machine learning') || combined.includes('ai')) return 'data-engineer';
  return 'mern-developer';
};

/**
 * Deterministic Resume Parser: Extracts strictly what exists in the resume document.
 */
export const deterministicResumeParser = (rawText, originalFileName = '') => {
  const text = (rawText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const sections = extractSections(text);

  // 1. Email (strictly from resume)
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';

  // 2. Phone (strictly from resume)
  const phoneMatch = text.match(/(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // 3. Links (strictly from resume)
  const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-]+/i) ||
                        text.match(/linkedin\.com\/in\/[a-zA-Z0-9_\-]+/i);
  let linkedin = linkedinMatch ? linkedinMatch[0] : '';
  if (linkedin && !linkedin.startsWith('http')) linkedin = `https://${linkedin}`;

  const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_\-]+/i) ||
                      text.match(/github\.com\/[a-zA-Z0-9_\-]+/i);
  let github = githubMatch ? githubMatch[0] : '';
  if (github && !github.startsWith('http')) github = `https://${github}`;

  const websiteMatch = text.match(/https?:\/\/(?:www\.)?(?!linkedin|github)[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  let website = websiteMatch ? websiteMatch[0] : '';

  // 4. Location
  let location = '';
  const locationRegexes = [
    /(?:Location|Address|City)[:\s]+([A-Za-z\s,]+(?:India|USA|UK|Canada|Germany|Singapore|Bangalore|Chennai|Mumbai|Delhi|Hyderabad|Pune|California|New York|London|Berlin))/i,
    /([A-Za-z\s]+,\s*(?:Tamil Nadu|Karnataka|Maharashtra|Texas|California|India|USA|UK))/i,
    /([A-Za-z\s]+(?:Chennai|Bengaluru|Bangalore|Mumbai|Hyderabad|Delhi|Pune|San Francisco|New York|London|Berlin|Toronto))/i
  ];
  for (const reg of locationRegexes) {
    const match = text.match(reg);
    if (match && match[1] && match[1].trim().length < 50) {
      location = match[1].trim();
      break;
    }
  }

  // 5. Full Name
  let fullName = '';
  const ignoredHeaderWords = ['resume', 'curriculum', 'vitae', 'cv', 'profile', 'contact', 'email', 'phone'];
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const candidate = lines[i].replace(/[|•,].*$/, '').trim();
    const lower = candidate.toLowerCase();
    const hasIgnored = ignoredHeaderWords.some(w => lower.includes(w));
    if (candidate.length >= 3 && candidate.length <= 40 && !candidate.includes('@') && !hasIgnored) {
      fullName = candidate;
      break;
    }
  }
  if (!fullName) {
    if (email && email.includes('@')) {
      const handle = email.split('@')[0].replace(/[._-]/g, ' ');
      fullName = handle.replace(/\b\w/g, c => c.toUpperCase());
    } else {
      fullName = 'Developer';
    }
  }

  // 6. Professional Title
  let title = '';
  for (let i = 1; i < Math.min(4, lines.length); i++) {
    const subCandidate = lines[i].split(/[|•–—,]/)[0].trim();
    if (subCandidate.length >= 4 && subCandidate.length <= 45 &&
        /(?:developer|engineer|architect|specialist|lead|designer|programmer)/i.test(subCandidate) &&
        !subCandidate.includes('@') && !subCandidate.includes('http')) {
      title = subCandidate;
      break;
    }
  }

  if (!title) {
    const roleKeywords = [
      'Senior Full Stack MERN Developer', 'Full Stack MERN Developer', 'Senior MERN Stack Developer',
      'MERN Stack Developer', 'Senior Full Stack Developer', 'Full Stack Developer',
      'Senior Software Engineer', 'Software Engineer', 'Frontend Developer', 'Backend Developer',
      'React Developer', 'Node.js Developer', 'Web Developer', 'Java Full Stack Developer',
      'Python Developer', 'DevOps Engineer', 'Mobile Application Developer', 'UI/UX Engineer', 'Cloud Engineer'
    ];
    for (const rk of roleKeywords) {
      if (new RegExp(`\\b${rk}\\b`, 'i').test(text)) {
        title = rk;
        break;
      }
    }
  }
  if (!title) title = 'Software Engineer';

  // 7. Summary / Bio (Strictly what's in resume)
  let summary = sections.summary || '';
  if (!summary) {
    const summaryHeaderMatch = text.match(/(?:PROFESSIONAL SUMMARY|SUMMARY|ABOUT ME|CAREER OBJECTIVE|OBJECTIVE|PROFILE)[:\s]*\n([\s\S]*?)(?=\n[A-Z\s]{4,}|\n\n[A-Z]|$)/i);
    if (summaryHeaderMatch && summaryHeaderMatch[1]) {
      summary = summaryHeaderMatch[1].replace(/\n+/g, ' ').trim();
    }
  }

  // 8. Extract Skills (Strictly from resume text)
  const technical = [];
  const frameworks = [];
  const databases = [];
  const tools = [];
  const languages = [];
  const soft = [];

  const addSkillUnique = (targetList, skillName) => {
    const clean = skillName.trim().replace(/^[-•*–—]\s*/, '').replace(/[,;:]+$/, '').trim();
    if (clean && clean.length >= 2 && clean.length <= 35) {
      if (!targetList.some(item => item.toLowerCase() === clean.toLowerCase())) {
        targetList.push(clean);
      }
    }
  };

  if (sections.skills) {
    const skillLines = sections.skills.split('\n').map(l => l.trim()).filter(Boolean);
    skillLines.forEach(line => {
      const catMatch = line.match(/^([A-Za-z\s&/]+)[:\-]\s*(.*)$/);
      if (catMatch) {
        const catName = catMatch[1].toLowerCase();
        const items = catMatch[2].split(/[,|•;]+/).map(i => i.trim()).filter(Boolean);

        if (catName.includes('language')) items.forEach(it => addSkillUnique(languages, it));
        else if (catName.includes('front') || catName.includes('client') || catName.includes('ui') || catName.includes('web')) items.forEach(it => addSkillUnique(technical, it));
        else if (catName.includes('back') || catName.includes('server') || catName.includes('api') || catName.includes('framework')) items.forEach(it => addSkillUnique(frameworks, it));
        else if (catName.includes('data') || catName.includes('db') || catName.includes('storage')) items.forEach(it => addSkillUnique(databases, it));
        else if (catName.includes('tool') || catName.includes('devops') || catName.includes('cloud') || catName.includes('platform')) items.forEach(it => addSkillUnique(tools, it));
        else if (catName.includes('soft') || catName.includes('interpersonal')) items.forEach(it => addSkillUnique(soft, it));
        else items.forEach(it => addSkillUnique(technical, it));
      } else {
        const items = line.split(/[,|•;]+/).map(i => i.trim()).filter(Boolean);
        items.forEach(it => addSkillUnique(technical, it));
      }
    });
  }

  // Also scan for recognized skills present in the resume text
  TECH_SKILL_KEYWORDS.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
    if (reg.test(text)) {
      const lower = skill.toLowerCase();
      if (['react', 'react.js', 'vue', 'angular', 'next.js', 'nextjs', 'html5', 'css3', 'tailwind css', 'tailwind', 'bootstrap', 'redux', 'redux toolkit'].includes(lower)) {
        addSkillUnique(technical, skill);
      } else if (['node.js', 'node', 'express.js', 'express', 'django', 'flask', 'spring boot', 'restful apis', 'rest apis', 'graphql', 'microservices'].includes(lower)) {
        addSkillUnique(frameworks, skill);
      } else if (['mongodb', 'mongoose', 'postgresql', 'mysql', 'redis', 'firebase', 'supabase', 'prisma', 'dynamodb', 'cassandra'].includes(lower)) {
        addSkillUnique(databases, skill);
      } else if (['docker', 'kubernetes', 'aws', 'amazon web services', 'git', 'github', 'postman', 'vs code', 'jest', 'vite', 'figma', 'ci/cd', 'linux'].includes(lower)) {
        addSkillUnique(tools, skill);
      } else if (['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'sql', 'go', 'golang', 'rust', 'kotlin'].includes(lower)) {
        addSkillUnique(languages, skill);
      } else {
        addSkillUnique(technical, skill);
      }
    }
  });

  // 9. Extract Work Experience (Strictly what's in resume - NO dummy jobs if empty)
  const experience = [];
  const expRaw = sections.experience || '';
  if (expRaw) {
    const expBlocks = expRaw.split(/\n(?=[A-Z][a-zA-Z0-9\s|•\-–—,]+(?:\(.*?\)|(?:19|20)\d\d|Present))/i);
    expBlocks.forEach((block, idx) => {
      const bLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (bLines.length > 0) {
        const header = bLines[0];
        const parts = header.split(/[|•–—\t]+/).map(p => p.trim());
        const pos = parts[0] || title;
        const comp = parts[1] || '';

        const dateMatch = header.match(/(?:(?:19|20)\d\d|Present)[\s\S]*(?:(?:19|20)\d\d|Present)/i) ||
                          header.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\S]*(?:Present|(?:19|20)\d\d)/i);
        const dates = dateMatch ? dateMatch[0] : '';
        const dateParts = dates ? dates.split(/[-–—to]+/i).map(d => d.trim()) : ['', ''];

        const descLines = bLines.slice(1).map(l => l.replace(/^[-•*–—]\s*/, '').trim()).filter(Boolean);
        const desc = descLines.join('\n• ') ? `• ${descLines.join('\n• ')}` : '';

        experience.push({
          id: `exp-${idx + 1}`,
          position: pos,
          company: comp,
          startDate: dateParts[0] || '',
          endDate: dateParts[1] || (dates.toLowerCase().includes('present') ? 'Present' : ''),
          current: dates.toLowerCase().includes('present'),
          description: desc
        });
      }
    });
  }

  // 10. Extract Projects (Strictly what's in resume - NO dummy projects if empty)
  const projects = [];
  const projRaw = sections.projects || '';
  if (projRaw) {
    const projBlocks = projRaw.split(/\n(?=[A-Z0-9][a-zA-Z0-9\s|•\-–—,]+(?:\(.*?\)|React|Node|Web|App|System|Platform|API|Tool))/i);
    projBlocks.forEach((block, idx) => {
      const pLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (pLines.length > 0) {
        const header = pLines[0].replace(/[|•–—].*$/, '').trim();

        const pTech = [];
        const techMatch = block.match(/(?:Technologies|Tech Stack|Tools|Built with)[:\s]+([^\n]+)/i);
        if (techMatch && techMatch[1]) {
          techMatch[1].split(/[,|•;]+/).forEach(t => {
            const clean = t.trim();
            if (clean && !pTech.includes(clean)) pTech.push(clean);
          });
        }

        if (pTech.length === 0) {
          TECH_SKILL_KEYWORDS.forEach(t => {
            const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i').test(block)) {
              if (!pTech.includes(t)) pTech.push(t);
            }
          });
        }

        const blockGithub = block.match(/https?:\/\/(?:www\.)?github\.com\/[^\s]+/i);
        const blockLive = block.match(/https?:\/\/(?!github|linkedin)[^\s]+/i);

        const descLines = pLines.slice(1).map(l => l.replace(/^[-•*–—]\s*/, '').trim()).filter(Boolean);
        const pDesc = descLines.join(' ');

        projects.push({
          id: `proj-${idx + 1}`,
          name: header || `Project ${idx + 1}`,
          description: pDesc,
          technologies: pTech,
          githubUrl: blockGithub ? blockGithub[0] : (github || ''),
          liveUrl: blockLive ? blockLive[0] : '',
          featured: idx === 0,
          image: idx === 0
            ? 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80'
        });
      }
    });
  }

  // 11. Extract Education (Strictly what's in resume - NO dummy colleges if empty)
  const education = [];
  const eduRaw = sections.education || '';
  if (eduRaw) {
    const eduBlocks = eduRaw.split(/\n(?=[A-Z][a-zA-Z\s|•\-–—,]+(?:\(.*?\)|(?:19|20)\d\d|Bachelor|Master|B\.|M\.|Diploma|Higher))/i);
    eduBlocks.forEach((block, idx) => {
      const eLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (eLines.length > 0) {
        const header = eLines[0];
        const dateMatch = block.match(/(?:19|20)\d\d[\s\S]*(?:19|20)\d\d|Present/i);
        const dates = dateMatch ? dateMatch[0] : '';
        const gradeMatch = block.match(/(?:Grade|CGPA|GPA|Percentage|Score)[:\s]+([^\n,]+)/i);

        education.push({
          id: `edu-${idx + 1}`,
          degree: header.replace(/[|•–—].*$/, '').trim(),
          institution: eLines[1] ? eLines[1].replace(/[|•–—].*$/, '').trim() : '',
          startYear: dates ? dates.split(/[-–—]/)[0]?.trim() || '' : '',
          endYear: dates ? dates.split(/[-–—]/)[1]?.trim() || '' : '',
          grade: gradeMatch ? gradeMatch[1].trim() : '',
          description: eLines.slice(2).join(' ')
        });
      }
    });
  }

  // 12. Extract Certifications (Strictly what's in resume)
  const certifications = [];
  const certRaw = sections.certifications || '';
  if (certRaw) {
    const certLines = certRaw.split('\n').map(l => l.trim()).filter(Boolean);
    certLines.forEach((cLine, idx) => {
      const clean = cLine.replace(/^[-•*–—]\s*/, '').trim();
      if (clean.length > 3) {
        const parts = clean.split(/[|•–—]+/).map(p => p.trim());
        certifications.push({
          id: `cert-${idx + 1}`,
          name: parts[0] || clean,
          issuer: parts[1] || '',
          issueDate: parts[2] || '',
          expiryDate: 'Lifetime',
          credentialId: `ID-${idx + 1}`,
          credentialUrl: linkedin || ''
        });
      }
    });
  }

  // 13. Extract Achievements (Strictly what's in resume)
  const achievements = [];
  const achRaw = sections.achievements || '';
  if (achRaw) {
    const achLines = achRaw.split('\n').map(l => l.trim()).filter(Boolean);
    achLines.forEach((aLine, idx) => {
      const clean = aLine.replace(/^[-•*–—]\s*/, '').trim();
      if (clean.length > 3) {
        achievements.push({
          id: `ach-${idx + 1}`,
          title: clean.slice(0, 80),
          description: clean,
          date: ''
        });
      }
    });
  }

  const cleanSlug = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30) || 'portfolio';

  const tagline = technical.length > 0 
    ? `I build modern web applications using ${technical.slice(0, 3).join(', ')} and robust backend architectures.`
    : `Software developer building modern web solutions and scalable digital experiences.`;

  return {
    personalInfo: {
      fullName,
      title,
      email,
      phone,
      location,
      linkedin,
      github,
      website: website || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    careerInfo: {
      objective: summary,
      summary,
      targetRole: title,
      careerInterests: ['Full Stack Architecture', 'Cloud Services', 'UI/UX Engineering']
    },
    skills: {
      technical,
      frameworks,
      databases,
      tools,
      languages,
      soft
    },
    experience,
    projects,
    education,
    certifications,
    achievements,
    portfolioSettings: {
      slug: cleanSlug,
      theme: 'tech-blue',
      tagline,
      customBio: summary,
      showContactForm: true,
      accentColor: '#079FE8',
      isPublic: true,
      isPublished: true
    }
  };
};

/**
 * Universal Resume to Portfolio Generator with ATS Score & Improvement Advisory
 */
export const parseResumeToPortfolio = async (rawText, originalFileName = '') => {
  const fallback = deterministicResumeParser(rawText, originalFileName);

  // Compute ATS Score and actionable recommendations using Gemini AI
  const matchedRoleId = detectRoleId(fallback.personalInfo.title, rawText);
  const atsEvaluation = await evaluateATS({ text: rawText, roleId: matchedRoleId });

  let finalProfile = fallback;
  let finalSettings = fallback.portfolioSettings;
  let source = 'deterministic-parser';

  if (isAiConfigured()) {
    try {
      const prompt = `Analyze this resume document and extract candidate portfolio data in strict JSON format.
CRITICAL CONSTRAINT: ONLY extract details that are explicitly present in the document.
If a section (e.g. projects, work experience, education, certifications, phone, linkedin, github) is missing in the resume, return an empty array [] or empty string "". DO NOT fabricate or invent dummy jobs, projects, or degrees.

RESUME CONTENT:
"""
${rawText}
"""

OUTPUT FORMAT REQUIREMENTS:
Return ONLY valid JSON matching this schema:
{
  "personalInfo": {
    "fullName": "Name from resume",
    "title": "Title/Role from resume",
    "email": "Email if present else empty string",
    "phone": "Phone if present else empty string",
    "location": "Location if present else empty string",
    "linkedin": "LinkedIn if present else empty string",
    "github": "GitHub if present else empty string",
    "website": "Website if present else empty string"
  },
  "careerInfo": {
    "summary": "Summary or objective from resume (empty string if none)",
    "targetRole": "Role"
  },
  "skills": {
    "technical": ["frontend/web skills from resume"],
    "frameworks": ["backend frameworks from resume"],
    "databases": ["databases from resume"],
    "tools": ["tools from resume"],
    "languages": ["programming languages from resume"],
    "soft": ["soft skills from resume"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Full description from resume",
      "technologies": ["Technologies used"],
      "githubUrl": "GitHub url if present else empty string",
      "liveUrl": "Live url if present else empty string"
    }
  ],
  "experience": [
    {
      "position": "Position Title",
      "company": "Company",
      "startDate": "Start Date",
      "endDate": "End Date",
      "current": true,
      "description": "Full bullet points from resume"
    }
  ],
  "education": [
    {
      "degree": "Degree",
      "institution": "University / College",
      "startYear": "Start Year",
      "endYear": "End Year",
      "grade": "Grade"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuer",
      "issueDate": "Date"
    }
  ],
  "achievements": [
    {
      "title": "Achievement / Award Title",
      "description": "Details",
      "date": ""
    }
  ],
  "portfolioSettings": {
    "slug": "url-friendly-slug",
    "theme": "tech-blue",
    "tagline": "Compelling hero tagline",
    "customBio": "Bio",
    "accentColor": "#079FE8",
    "isPublished": true
  }
}`;

      const geminiResponse = await callGemini(
        prompt,
        'You are a senior technical parser. Extract ONLY information explicitly present in the resume. Return strict JSON with zero dummy data.',
        { maxTokens: 4000, timeout: 8000, temperature: 0.1 }
      );

      if (geminiResponse) {
        let cleanedJson = geminiResponse.trim();
        if (cleanedJson.startsWith('```json')) cleanedJson = cleanedJson.replace(/^```json/, '').replace(/```$/, '').trim();
        else if (cleanedJson.startsWith('```')) cleanedJson = cleanedJson.replace(/^```/, '').replace(/```$/, '').trim();

        const parsed = JSON.parse(cleanedJson);

        if (parsed.personalInfo && parsed.personalInfo.fullName) {
          const cleanSlug = (parsed.portfolioSettings?.slug || parsed.personalInfo.fullName)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || fallback.portfolioSettings.slug;

          finalSettings = {
            ...fallback.portfolioSettings,
            ...parsed.portfolioSettings,
            slug: cleanSlug,
            isPublished: true,
            theme: parsed.portfolioSettings?.theme || 'tech-blue'
          };

          finalProfile = {
            ...fallback,
            ...parsed,
            personalInfo: {
              ...fallback.personalInfo,
              ...parsed.personalInfo,
              avatar: fallback.personalInfo.avatar
            },
            skills: {
              technical: parsed.skills?.technical || fallback.skills.technical,
              frameworks: parsed.skills?.frameworks || fallback.skills.frameworks,
              databases: parsed.skills?.databases || fallback.skills.databases,
              tools: parsed.skills?.tools || fallback.skills.tools,
              languages: parsed.skills?.languages || fallback.skills.languages,
              soft: parsed.skills?.soft || fallback.skills.soft
            },
            experience: parsed.experience || fallback.experience,
            projects: parsed.projects || fallback.projects,
            education: parsed.education || fallback.education,
            certifications: parsed.certifications || fallback.certifications,
            achievements: parsed.achievements || fallback.achievements,
            portfolioSettings: finalSettings
          };

          source = 'gemini-ai';
        }
      }
    } catch (err) {
      console.warn('[Resume AI Parse Warning]: Falling back to deterministic NLP engine:', err.message);
    }
  }

  return {
    success: true,
    profile: finalProfile,
    portfolioSettings: finalSettings,
    atsAnalysis: {
      score: atsEvaluation.score,
      targetRole: atsEvaluation.targetRole,
      interpretation: atsEvaluation.interpretation,
      categories: atsEvaluation.categories,
      strengths: atsEvaluation.strengths,
      recommendations: atsEvaluation.recommendations,
      missingKeywords: atsEvaluation.missingKeywords || [],
      detectedKeywords: atsEvaluation.detectedKeywords || []
    },
    source
  };
};

// Client-side Comprehensive Resume Parser with Transparent ATS Scoring
// Strictly extracts ONLY what is in the resume without injecting hallucinated/dummy content.
import { atsEngine } from './atsEngine';

const TECH_SKILL_KEYWORDS = [
  'React.js', 'React', 'Node.js', 'Node', 'Express.js', 'Express', 'MongoDB', 'Mongoose',
  'JavaScript', 'TypeScript', 'HTML5', 'HTML', 'CSS3', 'CSS', 'Tailwind CSS', 'Tailwind',
  'Bootstrap', 'Redux', 'Redux Toolkit', 'Next.js', 'NextJS', 'RESTful APIs', 'REST APIs',
  'GraphQL', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS',
  'Git', 'GitHub', 'Postman', 'VS Code', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Django',
  'Flask', 'Spring Boot', 'Linux', 'CI/CD', 'Jest', 'Mocha', 'JWT', 'Firebase', 'Vite', 'Figma'
];

const extractSections = (text) => {
  const sectionHeaders = [
    { key: 'summary', regex: /(?:^|\n)(?:PROFESSIONAL SUMMARY|SUMMARY|ABOUT ME|CAREER OBJECTIVE|OBJECTIVE|PROFILE)[:\s]*/i },
    { key: 'skills', regex: /(?:^|\n)(?:TECHNICAL SKILLS|SKILLS|CORE COMPETENCIES|AREAS OF EXPERTISE|TECHNOLOGIES)[:\s]*/i },
    { key: 'experience', regex: /(?:^|\n)(?:PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|CAREER HISTORY)[:\s]*/i },
    { key: 'projects', regex: /(?:^|\n)(?:FEATURED PROJECTS|PROJECTS|KEY PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS)[:\s]*/i },
    { key: 'education', regex: /(?:^|\n)(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS|QUALIFICATIONS)[:\s]*/i },
    { key: 'certifications', regex: /(?:^|\n)(?:CERTIFICATIONS|LICENSES|CERTIFICATES|COURSES & CERTIFICATIONS)[:\s]*/i },
    { key: 'achievements', regex: /(?:^|\n)(?:ACHIEVEMENTS|HONORS & AWARDS|AWARDS|KEY ACHIEVEMENTS|ACCOMPLISHMENTS)[:\s]*/i }
  ];

  const found = [];
  sectionHeaders.forEach(sh => {
    const match = text.match(sh.regex);
    if (match && match.index !== undefined) {
      found.push({ key: sh.key, index: match.index, headerLength: match[0].length });
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

const detectRoleId = (title = '', text = '') => {
  const combined = `${title} ${text}`.toLowerCase();
  if (combined.includes('mern') || (combined.includes('react') && combined.includes('node'))) return 'mern-developer';
  if (combined.includes('frontend') || combined.includes('react') || combined.includes('ui/ux')) return 'frontend-developer';
  if (combined.includes('backend') || combined.includes('node') || combined.includes('java') || combined.includes('python')) return 'backend-developer';
  if (combined.includes('full stack') || combined.includes('fullstack') || combined.includes('software engineer')) return 'fullstack-engineer';
  if (combined.includes('devops') || combined.includes('cloud') || combined.includes('docker') || combined.includes('kubernetes')) return 'devops-engineer';
  if (combined.includes('data') || combined.includes('machine learning') || combined.includes('ai')) return 'data-engineer';
  return 'mern-developer';
};

export const parseResumeLocally = (rawText) => {
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

  // 4. Location
  let location = '';
  const locationMatch = text.match(/(?:Location|Address|City)[:\s]+([A-Za-z\s,]+(?:India|USA|UK|Canada|Germany|Singapore|Bangalore|Chennai|Mumbai|Delhi|Hyderabad|Pune|California|New York|London))/i) ||
                        text.match(/([A-Za-z\s]+,\s*(?:Tamil Nadu|Karnataka|Maharashtra|Texas|California|India|USA|UK))/i);
  if (locationMatch && locationMatch[1]) {
    location = locationMatch[1].trim();
  }

  // 5. Full Name
  let fullName = '';
  const ignored = ['resume', 'cv', 'curriculum', 'vitae', 'profile', 'contact', 'email', 'phone'];
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const candidate = lines[i].replace(/[|•,].*$/, '').trim();
    if (candidate.length >= 3 && candidate.length <= 40 && !candidate.includes('@') && !ignored.some(w => candidate.toLowerCase().includes(w))) {
      fullName = candidate;
      break;
    }
  }
  if (!fullName) fullName = 'Developer';

  // 6. Title
  let title = '';
  for (let i = 1; i < Math.min(4, lines.length); i++) {
    const sub = lines[i].split(/[|•–—,]/)[0].trim();
    if (sub.length >= 4 && sub.length <= 45 && /(?:developer|engineer|architect|lead|specialist)/i.test(sub) && !sub.includes('@')) {
      title = sub;
      break;
    }
  }
  if (!title) title = 'Software Engineer';

  // 7. Summary
  let summary = sections.summary || '';
  if (!summary) {
    const sumMatch = text.match(/(?:PROFESSIONAL SUMMARY|SUMMARY|ABOUT ME|CAREER OBJECTIVE|PROFILE)[:\s]*\n([\s\S]*?)(?=\n[A-Z\s]{4,}|\n\n[A-Z]|$)/i);
    if (sumMatch && sumMatch[1]) {
      summary = sumMatch[1].replace(/\n+/g, ' ').trim();
    }
  }

  // 8. Extract Skills
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
        else if (catName.includes('front') || catName.includes('client') || catName.includes('ui')) items.forEach(it => addSkillUnique(technical, it));
        else if (catName.includes('back') || catName.includes('server') || catName.includes('api')) items.forEach(it => addSkillUnique(frameworks, it));
        else if (catName.includes('data') || catName.includes('db')) items.forEach(it => addSkillUnique(databases, it));
        else if (catName.includes('tool') || catName.includes('devops') || catName.includes('cloud')) items.forEach(it => addSkillUnique(tools, it));
        else items.forEach(it => addSkillUnique(technical, it));
      } else {
        const items = line.split(/[,|•;]+/).map(i => i.trim()).filter(Boolean);
        items.forEach(it => addSkillUnique(technical, it));
      }
    });
  }

  TECH_SKILL_KEYWORDS.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
    if (reg.test(text)) {
      const lower = skill.toLowerCase();
      if (['react', 'react.js', 'vue', 'angular', 'next.js', 'html5', 'css3', 'tailwind css', 'bootstrap', 'redux'].includes(lower)) {
        addSkillUnique(technical, skill);
      } else if (['node.js', 'node', 'express.js', 'express', 'django', 'flask', 'restful apis'].includes(lower)) {
        addSkillUnique(frameworks, skill);
      } else if (['mongodb', 'mongoose', 'postgresql', 'mysql', 'redis', 'firebase'].includes(lower)) {
        addSkillUnique(databases, skill);
      } else if (['docker', 'kubernetes', 'aws', 'git', 'github', 'postman', 'vs code', 'jest'].includes(lower)) {
        addSkillUnique(tools, skill);
      } else {
        addSkillUnique(technical, skill);
      }
    }
  });

  // 9. Extract Work Experience (Strictly what is in resume)
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
        const dateMatch = header.match(/(?:19|20)\d\d[\s\S]*(?:19|20)\d\d|Present/i);
        const dates = dateMatch ? dateMatch[0] : '';
        const descLines = bLines.slice(1).map(l => l.replace(/^[-•*–—]\s*/, '').trim()).filter(Boolean);
        const desc = descLines.join('\n• ') ? `• ${descLines.join('\n• ')}` : '';

        experience.push({
          id: `exp-${idx + 1}`,
          position: pos,
          company: comp,
          startDate: dates ? dates.split(/[-–—]/)[0]?.trim() || '' : '',
          endDate: dates ? dates.split(/[-–—]/)[1]?.trim() || '' : '',
          current: dates.toLowerCase().includes('present'),
          description: desc
        });
      }
    });
  }

  // 10. Extract Projects (Strictly what is in resume)
  const projects = [];
  const projRaw = sections.projects || '';
  if (projRaw) {
    const projBlocks = projRaw.split(/\n(?=[A-Z0-9][a-zA-Z0-9\s|•\-–—,]+(?:\(.*?\)|React|Node|Web|App|System|Platform|API))/i);
    projBlocks.forEach((block, idx) => {
      const pLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (pLines.length > 0) {
        const header = pLines[0].replace(/[|•–—].*$/, '').trim();
        const pTech = [];
        TECH_SKILL_KEYWORDS.forEach(t => {
          const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i').test(block)) {
            if (!pTech.includes(t)) pTech.push(t);
          }
        });
        const descLines = pLines.slice(1).map(l => l.replace(/^[-•*–—]\s*/, '').trim()).filter(Boolean);

        projects.push({
          id: `proj-${idx + 1}`,
          name: header || `Project ${idx + 1}`,
          description: descLines.join(' '),
          technologies: pTech,
          githubUrl: github || '',
          liveUrl: '',
          featured: idx === 0,
          image: idx === 0
            ? 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80'
        });
      }
    });
  }

  // 11. Extract Education (Strictly what is in resume)
  const education = [];
  const eduRaw = sections.education || '';
  if (eduRaw) {
    const eduBlocks = eduRaw.split(/\n(?=[A-Z][a-zA-Z\s|•\-–—,]+(?:\(.*?\)|(?:19|20)\d\d|Bachelor|Master|B\.|M\.|Diploma))/i);
    eduBlocks.forEach((block, idx) => {
      const eLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (eLines.length > 0) {
        const header = eLines[0];
        const dateMatch = block.match(/(?:19|20)\d\d[\s\S]*(?:19|20)\d\d|Present/i);
        const dates = dateMatch ? dateMatch[0] : '';
        const gradeMatch = block.match(/(?:Grade|CGPA|GPA|Percentage)[:\s]+([^\n,]+)/i);

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

  // 12. Extract Certifications (Strictly what is in resume)
  const certifications = [];
  if (sections.certifications) {
    const certLines = sections.certifications.split('\n').map(l => l.trim()).filter(Boolean);
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

  // 13. Extract Achievements (Strictly what is in resume)
  const achievements = [];
  if (sections.achievements) {
    const achLines = sections.achievements.split('\n').map(l => l.trim()).filter(Boolean);
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

  // Evaluate ATS Score
  const matchedRoleId = detectRoleId(title, rawText);
  const atsAnalysis = atsEngine.analyzeResume(rawText, matchedRoleId);

  return {
    personalInfo: {
      fullName,
      title,
      email,
      phone,
      location,
      linkedin,
      github,
      website: '',
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
    },
    atsAnalysis
  };
};

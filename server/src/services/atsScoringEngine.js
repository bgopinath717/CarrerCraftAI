// AI-Powered ATS Scoring & Comprehensive Recruitment Advisory Engine for CareerCraft AI
// Powered by Google Gemini API (gemini-flash-latest) with deterministic 100-point formula fallback.
import { JOB_ROLES, getRoleById } from '../data/jobRolesData.js';
import { callGemini } from './aiService.js';

/**
 * AI-Powered ATS Evaluation using Google Gemini API
 */
export const evaluateATSWithGemini = async ({ text = '', roleId = 'general', jobDescription = '', structuredData = null }) => {
  const isGeneral = !roleId || roleId === 'general' || roleId === 'without-role' || roleId === 'none' || roleId === 'no-role';
  const targetRole = isGeneral ? getRoleById('general') : getRoleById(roleId);
  const roleTitle = isGeneral ? 'Without Specific Role (General Resume Evaluation)' : (targetRole?.title || targetRole?.name || 'Software Engineer');

  const rolePromptBlock = isGeneral
    ? `EVALUATION MODE: GENERAL RESUME CONTENT EVALUATION (WITHOUT SPECIFIC ROLE)
The user has chosen to evaluate their resume WITHOUT targeting a specific role or framework stack.
Do NOT penalize the candidate for missing niche technologies, specialized frameworks, or languages (unless specifically requested in an optional job description below).
Instead, perform a rigorous general content evaluation based on universal ATS and recruiting excellence:
1. Structural formatting and clear section headers (Contact Info, Professional Summary, Experience, Education, Skills, Projects).
2. Contact details completeness (Email, Phone, Location, Portfolio/LinkedIn).
3. Experience description depth and clarity of work done.
4. Active voice and strong action verbs (Led, Engineered, Spearheaded, Developed, Delivered, Managed, Designed) vs passive phrasing.
5. Quantified impact and measurable outcomes (percentages, numbers, scale, efficiency improvements).
6. Transferable professional & technical skills (Problem Solving, Collaboration, Project Management, Documentation, Git, Analysis).
7. Readability, word count density (300-800 words), and consistent bullet points.`
    : `TARGET ROLE: ${roleTitle}
TARGET ROLE REQUIRED COMPETENCIES: ${(targetRole?.requiredSkills || []).join(', ')}
${targetRole?.preferredSkills?.length ? `TARGET ROLE PREFERRED SKILLS: ${targetRole.preferredSkills.join(', ')}` : ''}`;

  const prompt = `You are an elite Applicant Tracking System (ATS) evaluator and senior technical recruiter specializing in modern ATS engines (Workday, Greenhouse, Lever, Taleo, iCIMS).

${rolePromptBlock}
${jobDescription && jobDescription.trim().length > 20 ? `JOB DESCRIPTION REQUIREMENTS:\n${jobDescription.slice(0, 1500)}` : ''}

CANDIDATE RESUME TEXT:
"""
${(text || '').slice(0, 6000)}
"""

Carefully evaluate this resume against modern ATS algorithmic filters and recruiter screening standards.
Calculate an ATS score (0 to 100) and evaluate all 6 core categories.
Provide specific, actionable improvement recommendations with domain-tailored Before vs After examples.

Return ONLY a valid JSON object matching this schema without markdown code fences:
{
  "score": <overall integer score 0-100>,
  "targetRole": "${isGeneral ? 'Without Specific Role (General Resume Evaluation)' : roleTitle}",
  "interpretation": "<authoritative 1-2 sentence assessment of ATS pass probability and resume content quality>",
  "categories": [
    {
      "id": "formatting",
      "name": "ATS Formatting & Parseability",
      "earned": <integer 0-20>,
      "max": 20,
      "explanation": "<evaluation of section headers, contact readability, text extractability>",
      "issues": [<strings of specific formatting or layout flaws identified>]
    },
    {
      "id": "skills",
      "name": "${isGeneral ? 'Skills, Tools & Professional Competencies' : 'Role-Specific Skills & Keywords'}",
      "earned": <integer 0-25>,
      "max": 25,
      "explanation": "<evaluation of candidate's skills, tools, and transferable competencies>",
      "issues": [<strings of skills presentation or competency gaps>]
    },
    {
      "id": "experience",
      "name": "Experience & Content Depth",
      "earned": <integer 0-20>,
      "max": 20,
      "explanation": "<evaluation of past responsibilities, action-oriented descriptions, and project depth>",
      "issues": [<strings of experience depth gaps>]
    },
    {
      "id": "education",
      "name": "Education & Certifications",
      "earned": <integer 0-10>,
      "max": 10,
      "explanation": "<evaluation of academic degree, institution credibility, industry certifications>",
      "issues": [<strings>]
    },
    {
      "id": "achievements",
      "name": "Achievements & Measurable Impact",
      "earned": <integer 0-15>,
      "max": 15,
      "explanation": "<evaluation of quantifiable metrics (%, speed, latency, users, scale) and active verbs>",
      "issues": [<strings of lacking metrics or passive descriptions>]
    },
    {
      "id": "readability",
      "name": "Completeness & Readability",
      "earned": <integer 0-10>,
      "max": 10,
      "explanation": "<evaluation of word count density, bullet length, summary presence>",
      "issues": [<strings>]
    }
  ],
  "matchedKeywords": [<strings of detected skills, tools, and competencies in resume>],
  "missingKeywords": [<strings of 2 to 4 recommended transferable skills, tools, or resume enhancements if absent>],
  "strengths": [<3-5 bullet strings of what the resume does well for ATS>],
  "recommendations": [
    {
      "issue": "<concise problem statement>",
      "whyItMatters": "<why ATS parsers and hiring managers flag this>",
      "section": "<Work Experience | Skills & Tools | Formatting & Layout | Measurable Impact>",
      "suggestedImprovement": "<actionable step-by-step guidance>",
      "example": "<concrete Before vs After example tailored to candidate's background>"
    }
  ]
}`;

  const raw = await callGemini(
    prompt,
    'You are a senior ATS algorithms expert and technical recruiter. Output ONLY valid JSON matching the requested schema with no surrounding markdown or explanation.',
    { maxTokens: 3500, timeout: 12000, temperature: 0.1 }
  );

  if (!raw) return null;

  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();

  const parsed = JSON.parse(cleaned);
  if (!parsed || typeof parsed.score !== 'number') return null;

  // Validate bounds
  parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
  parsed.engine = 'gemini-ai';
  parsed.targetRole = parsed.targetRole || (isGeneral ? 'Without Specific Role (General Resume Evaluation)' : targetRole.title);

  return parsed;
};

/**
 * Deterministic Fallback 100-Point Rule Engine
 */
export const evaluateATSFallback = ({ text = '', roleId = 'general', jobDescription = '', structuredData = null }) => {
  const isGeneral = !roleId || roleId === 'general' || roleId === 'without-role' || roleId === 'none' || roleId === 'no-role';
  const targetRole = isGeneral ? getRoleById('general') : getRoleById(roleId);
  const roleTitle = isGeneral ? 'Without Specific Role (General Resume Evaluation)' : (targetRole?.title || targetRole?.name || 'Software Engineer');
  const normalizedText = (text || '').toLowerCase();
  const rawText = text || '';

  // Extract custom job description requirements if supplied
  let customKeywords = [];
  if (jobDescription && jobDescription.trim().length > 20) {
    const jdLower = jobDescription.toLowerCase();
    const tokens = jdLower.split(/[\s,;:\n\r()\[\]\/]+/).filter(t => t.length > 2);
    const stopWords = new Set(['and', 'the', 'for', 'with', 'you', 'will', 'are', 'our', 'have', 'from', 'that', 'this', 'team', 'work', 'experience', 'years', 'looking', 'role', 'must', 'plus', 'able', 'skill', 'skills', 'good', 'strong']);
    const freq = {};
    for (const t of tokens) {
      if (!stopWords.has(t) && !/^\d+$/.test(t)) {
        freq[t] = (freq[t] || 0) + 1;
      }
    }
    customKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);
  }

  // 1. FORMATTING & PARSEABILITY (20 pts)
  let formattingScore = 20;
  const formattingIssues = [];

  const hasExperience = /experience|employment|work history|internship/i.test(normalizedText);
  const hasEducation = /education|academic|college|university|degree/i.test(normalizedText);
  const hasSkills = /skills|technical skills|technologies|competencies/i.test(normalizedText);
  const hasProjects = /projects|project experience|technical projects/i.test(normalizedText);

  if (!hasExperience) { formattingScore -= 3; formattingIssues.push('Missing explicit "Work Experience" or "Internship" section header'); }
  if (!hasEducation) { formattingScore -= 3; formattingIssues.push('Missing explicit "Education" section header'); }
  if (!hasSkills) { formattingScore -= 3; formattingIssues.push('Missing explicit "Technical Skills" section header'); }
  if (!hasProjects) { formattingScore -= 2; formattingIssues.push('Missing explicit "Projects" section header'); }

  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/i.test(rawText);
  const hasPhone = /(\+?\d{1,4}?[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}/.test(rawText);

  if (!hasEmail) { formattingScore -= 3; formattingIssues.push('Email address not detected or unparseable'); }
  if (!hasPhone) { formattingScore -= 2; formattingIssues.push('Phone number not detected or formatted inconsistently'); }

  if (rawText.length < 150) {
    formattingScore -= 4;
    formattingIssues.push('Document text density is very low; text extraction might be incomplete');
  }

  formattingScore = Math.max(0, Math.min(20, Math.round(formattingScore)));

  // 2. SKILLS & KEYWORDS (25 pts)
  const detectedKeywords = [];
  const semanticMatches = [];
  const missingKeywords = [];

  // Universal skill bank for general evaluation
  const universalSkills = [
    'Problem Solving', 'Communication', 'Teamwork', 'Project Management',
    'Critical Thinking', 'Time Management', 'Analytical Thinking', 'Leadership',
    'Documentation', 'Agile / Scrum', 'Git', 'Quality Assurance',
    'JavaScript', 'Python', 'React', 'Node.js', 'Express', 'SQL', 'MongoDB',
    'REST APIs', 'Docker', 'AWS', 'Linux', 'Excel', 'Figma'
  ];

  const skillsToCheck = customKeywords.length > 0
    ? customKeywords
    : (isGeneral ? universalSkills : [...targetRole.requiredSkills, ...targetRole.preferredSkills]);

  skillsToCheck.forEach(rawSkill => {
    const sLower = rawSkill.toLowerCase();
    const displayName = typeof rawSkill === 'string' ? rawSkill : String(rawSkill);
    if (normalizedText.includes(sLower)) {
      if (!detectedKeywords.some(d => d.skill.toLowerCase() === sLower)) {
        detectedKeywords.push({ skill: displayName, matchType: 'Exact Match' });
      }
    } else {
      let isSemantic = false;
      if (sLower === 'react.js' && normalizedText.includes('react')) isSemantic = true;
      if (sLower === 'node.js' && normalizedText.includes('node')) isSemantic = true;
      if (sLower === 'express.js' && normalizedText.includes('express')) isSemantic = true;
      if (sLower === 'rest apis' && (normalizedText.includes('restful') || normalizedText.includes('api'))) isSemantic = true;
      if (sLower === 'teamwork' && (normalizedText.includes('team') || normalizedText.includes('collaboration'))) isSemantic = true;
      if (sLower === 'git' && normalizedText.includes('github')) isSemantic = true;

      if (isSemantic) {
        if (!semanticMatches.some(s => s.skill.toLowerCase() === sLower)) {
          semanticMatches.push({ skill: displayName, matchType: 'Semantic Match' });
        }
      } else if (!isGeneral) {
        missingKeywords.push(displayName);
      }
    }
  });

  let skillsScore = 20;
  if (isGeneral) {
    const totalFound = detectedKeywords.length + semanticMatches.length;
    if (totalFound >= 6) skillsScore = 25;
    else if (totalFound >= 4) skillsScore = 22;
    else if (totalFound >= 2) skillsScore = 19;
    else if (totalFound >= 1) skillsScore = 16;
    else skillsScore = 13;

    if (totalFound < 4) {
      missingKeywords.push('Agile / Scrum', 'Process Improvement', 'Quantifiable Metrics');
    }
  } else {
    const totalKeywordsFound = detectedKeywords.length + (semanticMatches.length * 0.85);
    const targetRequiredCount = Math.max(1, targetRole.requiredSkills.length);
    const matchRatio = Math.min(1, totalKeywordsFound / targetRequiredCount);
    skillsScore = Math.max(5, Math.min(25, Math.round(matchRatio * 25)));
  }

  // 3. EXPERIENCE & PROJECT RELEVANCE (20 pts)
  let experienceScore = 14;
  const experienceIssues = [];

  if (isGeneral) {
    const wordsInText = rawText.split(/\s+/).length;
    if (wordsInText >= 250 && hasExperience) {
      experienceScore += 4;
    } else if (wordsInText >= 150) {
      experienceScore += 2;
    } else {
      experienceIssues.push('Experience descriptions are brief; expand on key responsibilities, tools used, and team scope.');
    }
  } else {
    const techMatchesInProjects = targetRole.requiredSkills.filter(s => normalizedText.includes(s.toLowerCase()));
    if (techMatchesInProjects.length >= 4) {
      experienceScore += 4;
    } else if (techMatchesInProjects.length >= 2) {
      experienceScore += 2;
    } else {
      experienceIssues.push('Core technical skills are not clearly tied to demonstrated project experiences');
    }
  }

  const roleKeywords = ['developed', 'engineered', 'built', 'implemented', 'designed', 'maintained', 'architected', 'optimized', 'managed', 'led', 'spearheaded', 'coordinated', 'delivered'];
  const actionVerbsFound = roleKeywords.filter(v => normalizedText.includes(v));
  if (actionVerbsFound.length >= 4) {
    experienceScore += 2;
  } else {
    experienceScore -= 2;
    experienceIssues.push('Limited action verbs; describe contributions using active verbs (e.g., Spearheaded, Engineered, Coordinated, Delivered)');
  }

  experienceScore = Math.max(0, Math.min(20, Math.round(experienceScore)));

  // 4. EDUCATION & CERTIFICATIONS (10 pts)
  let educationScore = 10;
  const educationIssues = [];

  const hasDegree = /(bachelor|master|b\.e|b\.tech|m\.s|m\.tech|b\.sc|m\.sc|ph\.d|associate|diploma)/i.test(normalizedText);
  const hasUniversity = /(university|college|institute|polytechnic|academy)/i.test(normalizedText);

  if (!hasDegree) { educationScore -= 4; educationIssues.push('No recognized academic degree detected (e.g. B.E., B.Tech, Bachelor of Science)'); }
  if (!hasUniversity) { educationScore -= 3; educationIssues.push('University or institution name is not explicitly identified'); }

  const hasCertifications = /(certified|certification|aws|azure|gcp|meta|udemy|coursera|oracle|kubernetes)/i.test(normalizedText);
  if (!hasCertifications && educationScore > 4) {
    educationScore -= 1;
    educationIssues.push('Adding verified industry certifications boosts candidate profile credibility');
  }

  educationScore = Math.max(0, Math.min(10, Math.round(educationScore)));

  // 5. ACHIEVEMENTS & MEASURABLE IMPACT (15 pts)
  let achievementScore = 7;
  const achievementIssues = [];

  const metricMatches = rawText.match(/\b(?:\d+%\s*|\$\d+[\d,.]*|\d+\s*(?:users|clients|transactions|req\/s|ms|seconds|minutes|hours|days|x|fold))\b/gi) || [];
  if (metricMatches.length >= 3) {
    achievementScore = 15;
  } else if (metricMatches.length >= 1) {
    achievementScore = 11;
    achievementIssues.push('Only limited quantified metrics found. Increase measurable outcomes in bullet points.');
  } else {
    achievementScore = 6;
    achievementIssues.push('Lack of quantified outcomes (e.g., % improvement, load time reduction, volume handled) in project bullets.');
  }

  // 6. COMPLETENESS & READABILITY (10 pts)
  let completenessScore = 10;
  const completenessIssues = [];

  const words = rawText.trim().split(/\s+/).length;
  if (words < 120) {
    completenessScore -= 4;
    completenessIssues.push('Resume length is brief. A comprehensive 1-page ATS technical resume should typically contain 300–600 words.');
  } else if (words > 1200) {
    completenessScore -= 2;
    completenessIssues.push('Resume length is very dense (>1200 words). Aim for a focused 1–2 page format.');
  }

  const hasSummary = /summary|profile|about me|objective/i.test(normalizedText);
  if (!hasSummary) {
    completenessScore -= 2;
    completenessIssues.push('Consider adding a concise 2–3 line professional summary emphasizing your core competencies.');
  }

  completenessScore = Math.max(0, Math.min(10, Math.round(completenessScore)));

  // TOTAL SCORE
  const totalScore = Math.max(0, Math.min(100, formattingScore + skillsScore + experienceScore + educationScore + achievementScore + completenessScore));

  let interpretation = '';
  if (isGeneral) {
    if (totalScore >= 85) {
      interpretation = 'Outstanding General ATS Compatibility. Resume exhibits strong structural clarity, clear contact info, rich action verbs, and solid section completeness.';
    } else if (totalScore >= 70) {
      interpretation = 'Good General ATS Readiness. Strong baseline content; adding more quantified bullet metrics and power action verbs will further strengthen ranking.';
    } else if (totalScore >= 55) {
      interpretation = 'Moderate General Resume Alignment. Passes baseline parsing, but lacks sufficient measurable outcomes and action-oriented bullet descriptions.';
    } else {
      interpretation = 'Needs General Content Optimization. Resume requires structural polish, standard headings, and expanded bullet points to pass automated screening filters.';
    }
  } else {
    if (totalScore >= 85) {
      interpretation = 'Outstanding ATS Compatibility. Resume matches recruitment algorithms with high keyword alignment.';
    } else if (totalScore >= 70) {
      interpretation = 'Good ATS Compatibility. Strong potential; adding high-priority keywords and measurable metrics will elevate your candidate ranking.';
    } else if (totalScore >= 55) {
      interpretation = 'Moderate ATS Match. Candidate passes baseline parsing, but missing role-specific keywords and impact metrics will reduce interview callback probability.';
    } else {
      interpretation = 'Low ATS Match. Resume requires structural optimization, clearer section headings, and targeted keywords to pass screening filters.';
    }
  }

  const recommendations = [];
  if (isGeneral) {
    recommendations.push({
      issue: 'Quantify achievements with measurable metrics (XYZ formula)',
      whyItMatters: 'Recruiters and ATS algorithms highly reward bullets that demonstrate concrete scale, time savings, or performance gains.',
      section: 'Work Experience / Projects',
      suggestedImprovement: 'Format bullets as: "Accomplished [X], as measured by [Y], by doing [Z]" to prove impact.',
      example: 'Before: "Assisted with team project deliveries." → After: "Spearheaded project delivery schedules across 4 team members, reducing sprint cycle delay by 25%."'
    });
    if (formattingIssues.length > 0) {
      recommendations.push({
        issue: formattingIssues[0],
        whyItMatters: 'Standard headings allow ATS parsers to accurately extract candidate details into applicant profiles.',
        section: 'Formatting & Layout',
        suggestedImprovement: 'Ensure standard headers (WORK EXPERIENCE, EDUCATION, SKILLS, PROJECTS) are clearly distinguishable.',
        example: 'Use distinct uppercase section dividers and place contact info at the top of page 1.'
      });
    }
    recommendations.push({
      issue: 'Lead every bullet with strong action verbs',
      whyItMatters: 'Passive phrases (e.g. "Responsible for", "Helped with") dilute resume authority and score lower on recruiter scans.',
      section: 'Bullet Phrasing',
      suggestedImprovement: 'Begin all bullets with verbs like Spearheaded, Engineered, Directed, Optimized, Implemented, or Coordinated.',
      example: 'Before: "Was responsible for code reviews." → After: "Conducted weekly peer code reviews, cutting production defect rates by 18%."'
    });
  } else {
    if (missingKeywords.length > 0) {
      recommendations.push({
        issue: `Missing high-priority keywords for ${roleTitle}`,
        whyItMatters: 'Recruiter ATS filters filter out applicants who do not explicitly mention core industry competencies in their resume text.',
        section: 'Technical Skills & Projects',
        suggestedImprovement: `Integrate missing target keywords where applicable to your practical experience: ${missingKeywords.slice(0, 4).join(', ')}.`,
        example: `Example: In your project description, add "Architected using ${missingKeywords[0] || 'modern frameworks'} and modular components to enhance maintainability."`
      });
    }

    if (achievementIssues.length > 0) {
      recommendations.push({
        issue: 'Unquantified project & experience bullet points',
        whyItMatters: 'ATS parsers and senior hiring managers look for quantifiable metrics that prove real business impact rather than basic task lists.',
        section: 'Work Experience / Projects',
        suggestedImprovement: 'Incorporate measurable metrics such as percentage performance improvement, query latency reductions, or user adoption scale.',
        example: 'Before: "Worked on frontend components." → After: "Engineered 12+ modular React components, cutting render times by 32% and enhancing mobile responsiveness."'
      });
    }

    if (formattingIssues.length > 0) {
      recommendations.push({
        issue: formattingIssues[0],
        whyItMatters: 'Non-standard headings or disorganized contact placement can cause automated ATS parsers to misclassify key resume sections.',
        section: 'Formatting & Layout',
        suggestedImprovement: 'Use standard, recognizable uppercase section titles like "TECHNICAL SKILLS", "WORK EXPERIENCE", and "EDUCATION".',
        example: 'Ensure your name, contact phone, email, and LinkedIn are in clean, unformatted text at the top of page 1.'
      });
    }
  }

  const strengths = [];
  if (skillsScore >= 18) strengths.push(isGeneral ? 'Solid presence of core competencies and practical skills in resume.' : `Solid presence of core ${roleTitle} technical keywords.`);
  if (experienceScore >= 16) strengths.push('Effective use of strong action verbs across experience and projects.');
  if (educationScore >= 8) strengths.push('Clear educational credentials with degree and institution cleanly formatted.');
  if (formattingScore >= 16) strengths.push('Standard, parseable section structure favorable for automated document ingestion.');

  return {
    score: totalScore,
    targetRole: isGeneral ? 'Without Specific Role (General Resume Evaluation)' : roleTitle,
    interpretation,
    engine: 'deterministic-fallback',
    categories: [
      {
        id: 'formatting',
        name: 'ATS Formatting & Parseability',
        earned: formattingScore,
        max: 20,
        explanation: 'Evaluates standard section headings, extractability, text hierarchy, and contact readability.',
        issues: formattingIssues
      },
      {
        id: 'skills',
        name: isGeneral ? 'Skills, Tools & Professional Competencies' : 'Role-Specific Skills & Keywords',
        earned: skillsScore,
        max: 25,
        explanation: isGeneral
          ? 'Audits presence of universal professional competencies, digital tools, and practical skills without role bias.'
          : `Matches technical skills, programming languages, databases, and frameworks against ${roleTitle} requirements.`,
        issues: missingKeywords.length > 0 ? (isGeneral ? [`Consider highlighting: ${missingKeywords.slice(0, 3).join(', ')}`] : [`Missing ${missingKeywords.length} target role keywords`]) : []
      },
      {
        id: 'experience',
        name: isGeneral ? 'Experience & Content Depth' : 'Experience & Project Relevance',
        earned: experienceScore,
        max: 20,
        explanation: isGeneral
          ? 'Examines depth of responsibilities, action-oriented descriptions, and project work.'
          : 'Examines technical depth, demonstrated technologies in projects, and role responsibilities.',
        issues: experienceIssues
      },
      {
        id: 'education',
        name: 'Education & Certifications',
        earned: educationScore,
        max: 10,
        explanation: 'Audits academic degrees, institutions, coursework, and recognized industry certifications.',
        issues: educationIssues
      },
      {
        id: 'achievements',
        name: 'Achievements & Measurable Impact',
        earned: achievementScore,
        max: 15,
        explanation: 'Checks for strong action verbs, quantifiable metrics (%, numbers, scale), and concrete outcomes.',
        issues: achievementIssues
      },
      {
        id: 'readability',
        name: 'Completeness & Readability',
        earned: completenessScore,
        max: 10,
        explanation: 'Audits word count balance, professional summary presence, and bullet structure.',
        issues: completenessIssues
      }
    ],
    matchedKeywords: detectedKeywords.map(d => d.skill),
    semanticMatches: semanticMatches.map(s => s.skill),
    missingKeywords: missingKeywords.slice(0, 8),
    strengths,
    recommendations
  };
};

/**
 * Universal ATS Evaluator: Tries Gemini API first, falls back to deterministic rule engine
 */
export const evaluateATS = async ({ text = '', roleId = 'general', jobDescription = '', structuredData = null }) => {
  try {
    const aiResult = await evaluateATSWithGemini({ text, roleId, jobDescription, structuredData });
    if (aiResult && typeof aiResult.score === 'number') {
      return aiResult;
    }
  } catch (err) {
    console.warn('[Gemini ATS Evaluation Notice]: Falling back to deterministic engine:', err.message);
  }

  return evaluateATSFallback({ text, roleId, jobDescription, structuredData });
};

export const evaluateATSSync = ({ text = '', roleId = 'general', jobDescription = '', structuredData = null }) => {
  return evaluateATSFallback({ text, roleId, jobDescription, structuredData });
};

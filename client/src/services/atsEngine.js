// Comprehensive ATS Evaluation Engine (Transparent 100-Point Formula)
import { JOB_ROLES, getRoleById } from '../data/jobRolesData';
import { evaluateJobMatch } from './jobMatchEngine';

export const atsEngine = {
  getAvailableRoles() {
    return JOB_ROLES;
  },

  // Analyze complete resume object, raw text, or structured resume
  analyzeResume(resumeInput, roleId = 'general', jobDescription = '') {
    const isGeneral = !roleId || roleId === 'general' || roleId === 'without-role' || roleId === 'none' || roleId === 'no-role';
    const targetRole = isGeneral ? getRoleById('general') : getRoleById(roleId);
    let rawText = '';

    if (typeof resumeInput === 'string') {
      rawText = resumeInput;
    } else if (resumeInput) {
      // Extract text from structured resume
      const personal = `${resumeInput.personalInfo?.fullName || ''} ${resumeInput.personalInfo?.email || ''} ${resumeInput.personalInfo?.phone || ''} ${resumeInput.personalInfo?.location || ''} ${resumeInput.personalInfo?.linkedin || ''} ${resumeInput.personalInfo?.github || ''}`;
      const summary = resumeInput.summary || '';
      const skills = [
        ...(resumeInput.skills?.technical || []),
        ...(resumeInput.skills?.soft || []),
        ...(resumeInput.skills?.tools || []),
        ...(resumeInput.skills?.frameworks || []),
        ...(resumeInput.skills?.databases || []),
        ...(resumeInput.skills?.languages || [])
      ].join(' ');
      const exp = (resumeInput.experience || []).map(e => `${e.position || e.title || ''} ${e.company || ''} ${e.description || ''} ${(e.bullets || []).join(' ')}`).join(' ');
      const proj = (resumeInput.projects || []).map(p => `${p.name || p.title || ''} ${p.description || ''} ${(p.technologies || []).join(' ')} ${(p.bullets || []).join(' ')}`).join(' ');
      const edu = (resumeInput.education || []).map(ed => `${ed.degree || ''} ${ed.institution || ''} ${ed.grade || ''} ${ed.description || ''}`).join(' ');
      const certs = (resumeInput.certifications || []).map(c => typeof c === 'string' ? c : `${c.name || ''} ${c.issuer || ''}`).join(' ');
      const ach = (resumeInput.achievements || []).map(a => typeof a === 'string' ? a : `${a.title || ''} ${a.description || ''}`).join(' ');
      
      rawText = `${personal} \n ${summary} \n ${skills} \n ${exp} \n ${proj} \n ${edu} \n ${certs} \n ${ach}`;
    }

    const normalizedText = (rawText || '').toLowerCase();

    // 1. Check custom job description if present
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
      customKeywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([w]) => w);
    }

    // ========================================================
    // CATEGORY 1: ATS Formatting & Parseability (Max: 20 pts)
    // ========================================================
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

    if (!hasEmail) { formattingScore -= 3; formattingIssues.push('Email address not detected in contact header'); }
    if (!hasPhone) { formattingScore -= 2; formattingIssues.push('Phone number not detected or formatted inconsistently'); }

    if (rawText.length < 150) {
      formattingScore -= 4;
      formattingIssues.push('Document text density is low; ensure content is complete and extractable');
    }

    formattingScore = Math.max(0, Math.min(20, Math.round(formattingScore)));

    // ========================================================
    // CATEGORY 2: Skills & Competencies (Max: 25 pts)
    // ========================================================
    const detectedKeywords = [];
    const semanticMatches = [];
    const missingKeywords = [];

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
      const matchRatio = Math.min(1, totalKeywordsFound / Math.max(1, targetRole.requiredSkills.length));
      skillsScore = Math.max(5, Math.min(25, Math.round(matchRatio * 25)));
    }

    const keywordMatchPercentage = isGeneral
      ? Math.min(100, Math.max(65, Math.round((detectedKeywords.length / 8) * 100)))
      : Math.round(((detectedKeywords.length + (semanticMatches.length * 0.85)) / Math.max(1, targetRole.requiredSkills.length + targetRole.preferredSkills.length)) * 100);

    // ========================================================
    // CATEGORY 3: Experience & Project Relevance (Max: 20 pts)
    // ========================================================
    let experienceScore = 14;
    const experienceIssues = [];

    if (isGeneral) {
      const wordsInText = rawText.split(/\s+/).length;
      if (wordsInText >= 250 && hasExperience) {
        experienceScore += 4;
      } else if (wordsInText >= 150) {
        experienceScore += 2;
      } else {
        experienceIssues.push('Experience descriptions are brief; expand on key responsibilities and tools utilized.');
      }
    } else {
      const techMatchesInProjects = targetRole.requiredSkills.filter(s => normalizedText.includes(s.toLowerCase()));
      if (techMatchesInProjects.length >= 5) {
        experienceScore += 4;
      } else if (techMatchesInProjects.length >= 3) {
        experienceScore += 2;
      } else {
        experienceIssues.push(`Few core ${targetRole.title} technologies demonstrated directly within projects or experience.`);
      }
    }

    const bulletCount = (rawText.match(/[•\-\*]\s+/g) || []).length;
    if (bulletCount >= 6) {
      experienceScore += 2;
    } else if (bulletCount < 3) {
      experienceScore -= 3;
      experienceIssues.push('Bullet points are sparse; expand on project architecture, responsibilities, and team impact.');
    }

    experienceScore = Math.max(0, Math.min(20, Math.round(experienceScore)));

    // ========================================================
    // CATEGORY 4: Education & Certifications (Max: 10 pts)
    // ========================================================
    let educationScore = 6;
    const educationIssues = [];

    const hasDegree = /(b\.tech|bachelor|b\.e|b\.s|m\.tech|master|m\.s|diploma|computer science|information technology|engineering)/i.test(normalizedText);
    const hasCertifications = /(certified|certification|certifications|nptel|google|aws|coursera|tata|hackathon)/i.test(normalizedText);

    if (hasDegree) educationScore += 2;
    else educationIssues.push('Technical engineering or degree credentials not explicitly parsed.');

    if (hasCertifications) educationScore += 2;
    else educationIssues.push('No recognized industry certifications or verified technical credentials detected.');

    educationScore = Math.max(0, Math.min(10, Math.round(educationScore)));

    // ========================================================
    // CATEGORY 5: Achievements & Measurable Impact (Max: 15 pts)
    // ========================================================
    let achievementScore = 7;
    const achievementIssues = [];

    const actionVerbsList = [
      'architected', 'engineered', 'developed', 'deployed', 'implemented', 'optimized',
      'automated', 'built', 'spearheaded', 'designed', 'accelerated', 'reduced', 'scaled', 'created',
      'managed', 'led', 'coordinated', 'delivered'
    ];
    const detectedVerbs = actionVerbsList.filter(v => normalizedText.includes(v));

    if (detectedVerbs.length >= 4) achievementScore += 4;
    else if (detectedVerbs.length >= 2) achievementScore += 2;
    else achievementIssues.push('Passive phrasing detected. Begin bullet points with strong action verbs (e.g., Spearheaded, Engineered, Coordinated).');

    const metricMatches = rawText.match(/\b(\d+%\b|\d+\s*(ms|sec|x|users|records|queries|projects|cgpa|points))\b/gi) || [];
    if (metricMatches.length >= 3) achievementScore += 4;
    else if (metricMatches.length >= 1) achievementScore += 2;
    else achievementIssues.push('Lack of quantified outcomes (e.g., % improvement, load time reduction, volume handled) in project bullets.');

    achievementScore = Math.max(0, Math.min(15, Math.round(achievementScore)));

    // ========================================================
    // CATEGORY 6: Completeness & Readability (Max: 10 pts)
    // ========================================================
    let completenessScore = 8;
    const completenessIssues = [];

    const words = rawText.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 250 && words.length <= 850) {
      completenessScore += 2;
    } else if (words.length < 200) {
      completenessScore -= 2;
      completenessIssues.push('Resume length is brief. A comprehensive 1-page ATS technical resume should typically contain 300–600 words.');
    }

    const hasSummary = /summary|profile|objective|overview/i.test(normalizedText);
    if (!hasSummary) {
      completenessScore -= 1;
      completenessIssues.push('Missing a concise 2–3 line Professional Summary.');
    }

    completenessScore = Math.max(0, Math.min(10, Math.round(completenessScore)));

    // STRICT SUM
    const overallScore = formattingScore + skillsScore + experienceScore + educationScore + achievementScore + completenessScore;

    // Strengths
    const strengths = [];
    if (detectedKeywords.length >= 4) {
      strengths.push(isGeneral ? `Solid presence of core professional competencies including ${detectedKeywords.slice(0, 4).map(d => d.skill).join(', ')}.` : `Solid presence of core ${targetRole.title} technical keywords including ${detectedKeywords.slice(0, 4).map(d => d.skill).join(', ')}.`);
    }
    if (hasEmail && hasPhone) {
      strengths.push('Contact information (email, phone, location) is structured for seamless ATS parser extraction.');
    }
    if (detectedVerbs.length >= 3) {
      strengths.push(`Effective use of strong action verbs (${detectedVerbs.slice(0, 3).join(', ')}).`);
    }
    if (hasDegree) {
      strengths.push('Clear educational credentials with degree and institution cleanly formatted.');
    }
    if (hasCertifications) {
      strengths.push('Relevant certifications and verified credentials add credibility to candidate profile.');
    }

    // Recommendations
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
          issue: `Missing high-priority keywords for ${targetRole.title}`,
          whyItMatters: 'Recruiter ATS filters filter out applicants who do not explicitly mention core industry competencies in their resume text.',
          section: 'Technical Skills & Projects',
          suggestedImprovement: `Integrate missing target keywords where applicable to your practical experience: ${missingKeywords.slice(0, 5).join(', ')}.`,
          example: `Example: In your project description, add "Architected using ${missingKeywords[0] || 'TypeScript'} and modular components to enhance maintainability."`
        });
      }

      if (metricMatches.length < 2) {
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

    return {
      success: true,
      targetRole: isGeneral ? 'Without Specific Role (General Resume Evaluation)' : targetRole.title,
      analysisDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      score: overallScore,
      interpretation: isGeneral
        ? (overallScore >= 85
          ? 'Outstanding General ATS Compatibility. Resume exhibits strong structural clarity, clear contact info, rich action verbs, and solid section completeness.'
          : overallScore >= 70
          ? 'Good General ATS Readiness. Strong baseline content; adding more quantified bullet metrics and power action verbs will further strengthen ranking.'
          : 'Moderate General Resume Alignment. Passes baseline parsing, but lacks sufficient measurable outcomes and action-oriented bullet descriptions.')
        : (overallScore >= 85 
          ? 'Outstanding ATS Compatibility. Resume matches recruitment algorithms with high keyword alignment.' 
          : overallScore >= 70 
          ? 'Good ATS Compatibility. Strong foundation with minor keyword and metric optimization recommended.' 
          : 'Moderate ATS Compatibility. Needs targeted skill alignment and formatting refinements before submitting.'),
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
            : `Matches technical skills, programming languages, databases, and frameworks against ${targetRole.title} requirements.`,
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
      missingKeywords: missingKeywords.slice(0, 10),
      matchPercentage: keywordMatchPercentage,
      issues: [...formattingIssues, ...experienceIssues, ...educationIssues, ...achievementIssues, ...completenessIssues],
      keywordStats: {
        matchPercentage: keywordMatchPercentage,
        totalDetected: detectedKeywords.length,
        totalSemantic: semanticMatches.length,
        totalMissing: missingKeywords.length,
        detectedKeywords: detectedKeywords.map(d => d.skill),
        semanticMatches: semanticMatches.map(s => s.skill),
        missingKeywords: missingKeywords.slice(0, 8)
      },
      strengths,
      formattingIssues,
      recommendations,
      limitations: 'Note: ATS score is an analytical estimate based on common parsing standards and does not guarantee interview selection with proprietary recruiter screening systems.'
    };
  },

  /**
   * Compares a candidate resume against a recruiter job description
   * Extracts required tech competencies, matches against resume, and generates score & advice
   */
  compareJobDescription(resumeInput, jobDescriptionText = '') {
    return evaluateJobMatch(resumeInput, jobDescriptionText);
  }
};

export default atsEngine;

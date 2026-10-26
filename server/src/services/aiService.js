// Modular AI Service for CareerCraft AI
// Powered by Google Gemini API (gemini-flash-latest) with OpenAI and deterministic rule-based fallbacks.
import { evaluateJobMatch } from './jobMatchEngine.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const getGeminiKey = () => process.env.GEMINI_API_KEY || '';

export const isAiConfigured = () => {
  return Boolean(OPENAI_API_KEY || getGeminiKey());
};

/**
 * Universal call to Google Gemini API with multi-model speed cascade and zero-thinking overhead
 */
export const callGemini = async (prompt, systemInstruction = '', options = {}) => {
  const apiKey = getGeminiKey();
  if (!apiKey) return null;

  // Fast model cascade with separate free tier quotas and fast timeout
  const models = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: options.maxTokens || 650,
          temperature: options.temperature !== undefined ? options.temperature : 0.7
        }
      };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(options.timeout || 4000)
      });

      if (response.ok) {
        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const text = parts.filter(p => p.text).map(p => p.text).join('\n').trim();
        if (text) return text;
      } else {
        const err = await response.json().catch(() => ({}));
        console.warn(`[Gemini API ${model} Warning]:`, err.error?.message || response.statusText);
      }
    } catch (err) {
      console.warn(`[Gemini API ${model} Notice]:`, err.message);
    }
  }
  return null;
};

export const polishBulletAI = async (rawBullet, role = 'Software Developer') => {
  const cleaned = (rawBullet || '').trim().replace(/^[•\-*]\s*/, '');
  if (!cleaned) {
    return '• Engineered performant, responsive features and optimized backend execution pipelines.';
  }

  // 1. Try Google Gemini API first
  if (getGeminiKey()) {
    try {
      const geminiResult = await callGemini(
        `Polish this single resume bullet point for a ${role}: "${cleaned}"`,
        `You are an expert ATS technical resume writer. Return exactly ONE polished resume bullet point starting with '• '. Start with a powerful action verb (e.g. Engineered, Architected, Spearheaded, Implemented), highlight technical execution and quantifiable impact where possible. Output ONLY the single bullet line without markdown headings, options, or conversational text.`
      );
      if (geminiResult) {
        // Extract the first clean bullet line
        const line = geminiResult.split('\n').find(l => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*')) || geminiResult.split('\n')[0];
        const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
        return `• ${cleanLine}`;
      }
    } catch (err) {
      console.warn('[Gemini Bullet Error]:', err.message);
    }
  }

  // 2. If OpenAI API key is present
  if (OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert ATS resume writer. Polish the following resume bullet point for a ${role}. Begin with a strong action verb, include measurable impact or clear technical contribution where possible, and format as a single bullet point starting with '• '. Keep it concise and professional.`
            },
            {
              role: 'user',
              content: cleaned
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text.startsWith('•') ? text : `• ${text}`;
      }
    } catch (err) {
      console.warn('[AI Service Warning]: External provider call failed, falling back to deterministic engine:', err.message);
    }
  }

  // 3. Deterministic rule-based enhancement fallback
  const lower = cleaned.toLowerCase();
  if (lower.includes('worked on') || lower.includes('created') || lower.includes('made') || lower.includes('built')) {
    return `• Engineered and deployed scalable components using modern architectures, improving operational efficiency and UI responsiveness.`;
  } else if (lower.includes('api') || lower.includes('backend') || lower.includes('server')) {
    return `• Architected resilient RESTful API endpoints and integrated database query optimizations, accelerating response turnaround by 30%.`;
  } else if (lower.includes('frontend') || lower.includes('react') || lower.includes('ui') || lower.includes('css')) {
    return `• Spearheaded frontend UI modernization using responsive component architectures, delivering intuitive user workflows and reducing interaction latency.`;
  } else if (lower.includes('database') || lower.includes('sql') || lower.includes('mongo')) {
    return `• Designed structured data schemas and optimized indexing strategies, ensuring consistent sub-second query performance and transactional integrity.`;
  } else {
    return `• Implemented ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)} while adhering to industry best practices, code reusability, and automated verification.`;
  }
};

export const generateCoverLetterAI = async (params) => {
  const { targetJobTitle, companyName, tone = 'Professional', userProfile, jobDescription } = params;
  const userName = userProfile?.personalInfo?.fullName || 'Candidate';
  const userRole = userProfile?.personalInfo?.title || targetJobTitle || 'Software Engineer';
  const skills = (userProfile?.skills?.technical || ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript']).slice(0, 6).join(', ');
  const projects = (userProfile?.projects || []).map(p => p.name).slice(0, 3).join(', ') || 'CareerCraft AI Platform, E-Commerce Web Application';

  // Distinct tone directives
  const toneDirectives = {
    'Professional': 'Well-structured, articulate, respectful, industry-standard tech engineer voice highlighting craftsmanship and reliability.',
    'Confident': 'Bold, direct, high-energy, results-oriented, emphasizing quantifiable impact, initiative, and immediate technical ownership.',
    'Friendly': 'Warm, highly engaging, collaborative, showing authentic cultural excitement, curiosity, and proactive teamwork.',
    'Formal': 'Traditional corporate executive etiquette, polite, polished syntax, reserved, and respectful of organizational hierarchy.'
  };
  const activeToneGuide = toneDirectives[tone] || toneDirectives['Professional'];

  // 1. Try Google Gemini API first (multi-model fast cascade)
  if (getGeminiKey()) {
    try {
      const prompt = `Write a high-impact, authentic 3 to 4 paragraph cover letter for ${userName} applying for "${targetJobTitle || 'Software Developer'}" at "${companyName || 'Target Company'}".

CANDIDATE PROFILE:
- Name: ${userName}
- Current Role: ${userRole}
- Technical Skills: ${skills}
- Featured Projects: ${projects}
${jobDescription ? `- Target Job Requirements: ${jobDescription}` : ''}

REQUIRED VOICE & TONE:
- Tone: ${tone} (${activeToneGuide})

CRITICAL FORMATTING INSTRUCTIONS:
1. Write exactly 3 to 4 concise, compelling paragraphs.
2. Start directly with "Dear Hiring Team," (or "Dear ${companyName} Hiring Team,").
3. End directly with "Sincerely,\n${userName}".
4. Do NOT output ANY placeholder brackets like [Your Email], [Company Address], or [Date].
5. Do NOT include markdown code blocks or introductory conversational chatter. Output ONLY the letter text.`;

      const geminiLetter = await callGemini(
        prompt,
        `You are a senior executive tech recruiter and authentic cover letter writer. Deliver concise, punchy letters tailored to the required tone with zero placeholder brackets.`,
        { maxTokens: 480, temperature: tone === 'Confident' ? 0.75 : 0.65 }
      );
      if (geminiLetter) return geminiLetter;
    } catch (err) {
      console.warn('[Gemini Cover Letter Error]:', err.message);
    }
  }

  // 2. If OpenAI API key is present
  if (OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert career counselor. Generate a compelling cover letter with a ${tone} tone for ${userName} applying for ${targetJobTitle} at ${companyName}. The candidate has skills in ${skills}.`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    } catch (err) {
      console.warn('[AI Service Warning]: External provider call failed, falling back to deterministic template:', err.message);
    }
  }

  // 3. High quality deterministic cover letter generator fallback
  let greeting = `Dear Hiring Team,`;
  let intro = `I am writing to express my strong interest in the ${targetJobTitle || 'Software Developer'} position at ${companyName || 'your organization'}.`;
  let closer = `I would welcome the opportunity to discuss how my technical background and proactive mindset can support ${companyName || 'the team'}. Thank you for your time and consideration.`;

  if (tone === 'Confident') {
    intro = `I am excited to apply for the ${targetJobTitle || 'Software Developer'} role at ${companyName || 'your esteemed company'}. With a proven foundation in ${skills}, I am confident in my ability to immediately deliver scalable, high-impact results.`;
    closer = `I am eager to demonstrate how my practical engineering experience aligns directly with your technical roadmap. I look forward to connecting with your team soon.`;
  } else if (tone === 'Friendly') {
    greeting = `Hi ${companyName || 'Hiring'} Team,`;
    intro = `I was thrilled to come across the ${targetJobTitle || 'Developer'} opening at ${companyName || 'your company'}. As an enthusiastic ${userRole} passionate about modern technology, I would love the opportunity to contribute to your mission.`;
    closer = `I would love to chat more about how I can bring energy, creativity, and solid coding skills to your projects. Thanks so much for reviewing my application!`;
  }

  const body = `Throughout my development journey building responsive web applications, RESTful services, and robust data pipelines, I have cultivated a disciplined approach to code quality, security, and scalable software design. My hands-on projects demonstrate my ability to bridge client-side needs with robust server-side architecture.\n\nI am particularly drawn to ${companyName || 'your organization'} because of your commitment to technical excellence and user-centric software delivery. I am eager to apply my problem-solving skills and collaborative spirit to help your engineering team achieve its objectives.`;

  return `${greeting}\n\n${intro}\n\n${body}\n\n${closer}\n\nSincerely,\n${userName}`;
};

/**
 * Intelligent Job Description Match Analysis using Gemini API with Deterministic Baseline
 */
export const analyzeJobMatchAI = async (resumeData, jobDescription) => {
  // 1. Calculate deterministic, grounded baseline
  const baseline = evaluateJobMatch(resumeData, jobDescription);

  if (!getGeminiKey()) {
    return baseline;
  }

  try {
    const resumeSummary = typeof resumeData === 'string'
      ? resumeData
      : `Name: ${resumeData?.personalInfo?.fullName || ''}
Title: ${resumeData?.personalInfo?.title || ''}
Summary: ${resumeData?.summary || ''}
Skills: ${JSON.stringify(resumeData?.skills || {})}
Projects: ${(resumeData?.projects || []).map(p => `${p.name}: ${p.description} (${(p.technologies || []).join(', ')})`).join('\n')}
Experience: ${(resumeData?.experience || []).map(e => `${e.position} at ${e.company}: ${e.description}`).join('\n')}
Education: ${(resumeData?.education || []).map(ed => `${ed.degree} from ${ed.institution}`).join('\n')}`;

    const prompt = `You are a Principal Technical Recruiter and ATS Evaluation Specialist. Analyze this candidate's resume against the target job description.

RESUME CONTENT:
${resumeSummary}

JOB DESCRIPTION:
${jobDescription}

DETERMINISTIC EVALUATION BASELINE:
${JSON.stringify({
  detectedRequiredSkills: baseline.requiredSkills,
  directlyMatched: baseline.matchedSkills.map(m => m.name),
  partiallyMatched: baseline.partiallyMatchedSkills.map(p => p.name),
  missing: baseline.missingSkills.map(m => m.name)
})}

Perform a high-accuracy, truthful semantic evaluation.
Respond ONLY with a valid JSON object matching this exact schema:
{
  "semanticInsights": {
    "roleFitSummary": "<2-3 sentence overview of candidate suitability>",
    "experienceAlignmentSummary": "<assessment of work/project history vs duties>",
    "educationAlignmentSummary": "<assessment of degree/training>"
  },
  "additionalPartiallyMatched": [
    {
      "name": "<skill or requirement name>",
      "category": "<Frontend|Backend|Databases|DevOps|Architecture>",
      "adjacentSkillFound": "<adjacent skill in resume>",
      "evidence": "<exact quote or reference from resume>",
      "gapExplanation": "<how candidate's background connects to this requirement>"
    }
  ],
  "expertRecommendations": [
    {
      "priority": "High|Medium|Low",
      "title": "<short actionable title>",
      "section": "<Technical Skills|Projects|Experience Bullets|Professional Summary>",
      "actionType": "<Add Evidence|Highlight Transferable Skill|Add Metrics|Tailor Intro>",
      "description": "<truthful advice on what to adjust or highlight, never instruct keyword stuffing>"
    }
  ]
}`;

    const result = await callGemini(
      prompt,
      'You are a senior ATS algorithm auditor and technical recruiter. Output ONLY raw valid JSON with no markdown formatting backticks or commentary.'
    );

    if (result) {
      const cleanJson = result.replace(/^```json/im, '').replace(/```$/im, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed) {
        if (parsed.semanticInsights?.roleFitSummary) {
          baseline.scoreInterpretation = parsed.semanticInsights.roleFitSummary;
        }
        if (Array.isArray(parsed.additionalPartiallyMatched) && parsed.additionalPartiallyMatched.length > 0) {
          parsed.additionalPartiallyMatched.forEach(item => {
            if (item.name && !baseline.matchedSkills.some(m => m.name.toLowerCase() === item.name.toLowerCase()) &&
                !baseline.partiallyMatchedSkills.some(p => p.name.toLowerCase() === item.name.toLowerCase())) {
              baseline.partiallyMatchedSkills.push(item);
              baseline.missingSkills = baseline.missingSkills.filter(m => m.name.toLowerCase() !== item.name.toLowerCase());
              const reqIdx = baseline.requirementAlignments.findIndex(r => r.requirement.toLowerCase() === item.name.toLowerCase());
              if (reqIdx >= 0) {
                baseline.requirementAlignments[reqIdx].status = 'Partially Matched';
                baseline.requirementAlignments[reqIdx].evidenceFound = item.evidence || baseline.requirementAlignments[reqIdx].evidenceFound;
              }
            }
          });
        }
        if (Array.isArray(parsed.expertRecommendations) && parsed.expertRecommendations.length > 0) {
          baseline.prioritizedRecommendations = [
            ...parsed.expertRecommendations.slice(0, 3),
            ...baseline.prioritizedRecommendations
          ].slice(0, 5);
          baseline.recommendations = baseline.prioritizedRecommendations.map(r => `${r.title}: ${r.description}`);
        }
      }
    }
  } catch (err) {
    console.warn('[Gemini Job Match Analysis Error, using deterministic baseline]:', err.message);
  }

  return baseline;
};


// AI Intelligence Service for CareerCraft AI
import { careerRolesData } from '../data/careerRolesData';
import { apiService } from './api';

export const aiService = {
  // Simulate AI delay for realistic UX state transitions
  async delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 1. AI Resume Bullet Point Polish
  async polishBulletPoint(rawBullet, role = "Software Developer") {
    // Try backend AI endpoint first
    try {
      const serverPolished = await apiService.polishBullet(rawBullet, role);
      if (serverPolished) return serverPolished;
    } catch {}

    await this.delay(900);
    const cleaned = rawBullet.trim().replace(/^•\s*/, '');
    if (!cleaned) return "• Engineered performant, responsive features and optimized backend execution pipelines.";

    // Transform typical phrases into high-impact action statements
    if (cleaned.toLowerCase().includes('worked on') || cleaned.toLowerCase().includes('created') || cleaned.toLowerCase().includes('made')) {
      return `• Engineered and deployed scalable components using modern architectures, improving operational efficiency and UI responsiveness.`;
    }
    if (cleaned.toLowerCase().includes('api') || cleaned.toLowerCase().includes('backend')) {
      return `• Architected resilient RESTful API endpoints and integrated MongoDB aggregations, accelerating response turnaround by 30%.`;
    }
    if (cleaned.toLowerCase().includes('frontend') || cleaned.toLowerCase().includes('react') || cleaned.toLowerCase().includes('ui')) {
      return `• Spearheaded frontend UI modernization in React.js, delivering intuitive, accessible user workflows and reducing bounce rates.`;
    }

    return `• Implemented ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)} while adhering to industry best practices, code reusability, and automated verification.`;
  },

  // 2. AI Keyword Suggestions
  async suggestKeywords(targetRole = "MERN Stack Developer") {
    try {
      const serverKeywords = await apiService.suggestKeywords(targetRole);
      if (serverKeywords) return serverKeywords;
    } catch {}

    await this.delay(700);
    const roleMatch = careerRolesData.find(r => r.title.toLowerCase().includes(targetRole.toLowerCase())) || careerRolesData[0];
    return {
      essential: roleMatch.requiredSkills,
      recommended: roleMatch.recommendedSkills,
      suggestedSummaryKeywords: ["Scalable Architecture", "RESTful Services", "Micro-frontend", "Aggregation Pipelines", "CI/CD Deployment"]
    };
  },

  // 3. AI Cover Letter Generator
  async generateCoverLetter({ targetJobTitle, companyName, jobDescription, userProfile, tone = "Professional" }) {
    try {
      const serverContent = await apiService.generateCoverLetterAI({ targetJobTitle, companyName, jobDescription, userProfile, tone });
      if (serverContent) {
        return {
          id: `cl-${Date.now()}`,
          title: `${targetJobTitle || 'Software Developer'} - ${companyName || 'Application'} Cover Letter`,
          jobTitle: targetJobTitle || 'MERN Stack Developer',
          companyName: companyName || 'Target Company',
          tone,
          content: serverContent,
          generatedAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Cover letter server call error:', err);
    }

    await this.delay(200);

    const userName = userProfile?.personalInfo?.fullName || "B. Gopinath";
    const userRole = userProfile?.personalInfo?.title || "MERN Stack Developer";
    const userSkills = (userProfile?.skills?.technical || ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript"]).slice(0, 5).join(', ');
    const userProjects = (userProfile?.projects || []).map(p => p.name).join(' and ') || "CareerCraft AI and E-Commerce Web Platforms";

    let toneGreeting = "Dear Hiring Team,";
    let toneIntro = `I am writing to express my strong interest in the ${targetJobTitle || 'Software Developer'} position at ${companyName || 'your organization'}.`;
    let toneCloser = `I would welcome the opportunity to discuss how my technical background and proactive mindset can support ${companyName || 'the team'}. Thank you for your time and consideration.`;

    if (tone === "Confident") {
      toneIntro = `I am excited to apply for the ${targetJobTitle || 'Software Developer'} role at ${companyName || 'your esteemed company'}. With a proven foundation in ${userSkills}, I am confident in my ability to immediately deliver scalable, high-impact results.`;
      toneCloser = `I am eager to demonstrate how my practical engineering experience in building applications like ${userProjects} aligns directly with your technical roadmap. I look forward to connecting with your team soon.`;
    } else if (tone === "Friendly") {
      toneGreeting = `Hi ${companyName || 'Hiring'} Team,`;
      toneIntro = `I was thrilled to come across the ${targetJobTitle || 'Developer'} opening at ${companyName || 'your company'}. As an enthusiastic ${userRole} passionate about modern web technologies, I would love the opportunity to contribute to your mission.`;
      toneCloser = `I would love to chat more about how I can bring energy, creativity, and solid coding skills to your projects. Thanks so much for reviewing my application!`;
    } else if (tone === "Formal") {
      toneGreeting = `To the Hiring Committee at ${companyName || 'the Organization'},`;
      toneIntro = `Please accept this letter and the attached credentials as an expression of formal application for the position of ${targetJobTitle || 'Software Engineer'}.`;
      toneCloser = `I remain at your disposal should you require further documentation or wish to schedule an interview. Thank you for your attention to my application.`;
    }

    const content = `${toneGreeting}

${toneIntro}

As a dedicated ${userRole}, I have cultivated comprehensive expertise across full-stack engineering, specifically with ${userSkills}. Throughout my academic and practical endeavors, I have engineered production-grade projects including ${userProjects}, where I focused on responsive client interfaces, robust backend REST APIs, and database performance optimization.

${jobDescription ? `Reviewing your requirements for ${companyName || 'this position'}, I noted your focus on scalable systems and modern web technologies. My hands-on experience in building JWT-authenticated architectures, designing structured schemas, and collaborating via Git version control positions me well to seamlessly integrate with your engineering practices.` : `My technical portfolio demonstrates a consistent ability to translate user requirements into maintainable, well-documented code while keeping performance, accessibility, and clean architecture at the forefront.`}

${toneCloser}

Warm regards,
${userName}
${userProfile?.personalInfo?.email || ''} | ${userProfile?.personalInfo?.phone || ''}
${userProfile?.personalInfo?.location || ''}`;

    return {
      title: `${targetJobTitle || 'Software Developer'} - ${companyName || 'Application'} Cover Letter`,
      jobTitle: targetJobTitle || 'MERN Stack Developer',
      companyName: companyName || 'Target Company',
      tone,
      content,
      generatedAt: new Date().toISOString()
    };
  },

  // 4. AI Career Recommendation Engine
  async getCareerRecommendations(userProfile, options = {}) {
    // 1. Try backend endpoint first
    try {
      const serverResult = await apiService.getCareerRecommendations(userProfile, options);
      if (serverResult && serverResult.success && Array.isArray(serverResult.recommendations)) {
        return serverResult;
      }
    } catch {
      // Fallback to local deterministic engine
    }

    // 2. Client-side evaluation fallback
    await this.delay(350);
    const { evaluateRecommendations } = await import('./careerEngine.js');
    return evaluateRecommendations(userProfile, options);
  },

  // 5. AI Skill Gap & Personalized Roadmap Analysis
  async analyzeSkillGap(targetRoleId, userProfile, completedTaskIds = []) {
    // 1. Try backend endpoint first
    try {
      const serverRoadmap = await apiService.getCareerRoadmap(targetRoleId, userProfile, completedTaskIds);
      if (serverRoadmap) {
        return serverRoadmap;
      }
    } catch {
      // Fallback to local deterministic engine
    }

    // 2. Client-side evaluation fallback
    await this.delay(250);
    const { getPersonalizedRoadmap } = await import('./careerEngine.js');
    return getPersonalizedRoadmap(targetRoleId, userProfile, completedTaskIds);
  }
};


import { createRequire } from 'module';
import mammoth from 'mammoth';
import { polishBulletAI, generateCoverLetterAI as generateCoverLetterFromService, isAiConfigured } from '../services/aiService.js';
import { evaluateJobMatch } from '../services/jobMatchEngine.js';

const require = createRequire(import.meta.url);
const pdfParsePkg = require('pdf-parse');

export const polishBullet = async (req, res) => {
  try {
    const { rawBullet, role = 'Software Developer' } = req.body;
    const polished = await polishBulletAI(rawBullet, role);
    res.json({
      success: true,
      polished,
      aiActive: isAiConfigured()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateCoverLetterAI = async (req, res) => {
  try {
    const { targetJobTitle, companyName, tone = 'Professional', userProfile, jobDescription } = req.body;
    const content = await generateCoverLetterFromService({
      targetJobTitle,
      companyName,
      tone,
      userProfile,
      jobDescription
    });
    res.json({
      success: true,
      content,
      aiActive: isAiConfigured()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const file = req.file || (req.files && req.files[0]);
    let actualResumeData = resumeData;
    let uploadedFileName = null;

    if (file) {
      uploadedFileName = file.originalname;
      const mime = file.mimetype || '';
      const originalName = (file.originalname || '').toLowerCase();

      if (originalName.endsWith('.pdf') || mime.includes('pdf')) {
        try {
          if (typeof pdfParsePkg === 'function') {
            const pdfData = await pdfParsePkg(file.buffer);
            actualResumeData = pdfData.text || '';
          } else if (pdfParsePkg?.PDFParse) {
            const parser = new pdfParsePkg.PDFParse({ data: file.buffer });
            const parseResult = await parser.getText();
            actualResumeData = parseResult?.text || '';
            if (typeof parser.destroy === 'function') await parser.destroy();
          }
        } catch (pdfErr) {
          console.error('[JobMatch PDF Parse Error]:', pdfErr);
          return res.status(400).json({
            success: false,
            message: 'Unable to parse PDF document. The file may be password protected or corrupted.'
          });
        }
      } else if (originalName.endsWith('.docx') || originalName.endsWith('.doc') || mime.includes('word')) {
        try {
          const docxData = await mammoth.extractRawText({ buffer: file.buffer });
          actualResumeData = docxData.value || '';
        } catch (docxErr) {
          console.error('[JobMatch DOCX Parse Error]:', docxErr);
          return res.status(400).json({
            success: false,
            message: 'Unable to parse Word document. The file may be corrupted.'
          });
        }
      } else {
        // Plain text, markdown, or other text upload
        actualResumeData = file.buffer.toString('utf-8');
      }

      if (!actualResumeData || actualResumeData.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: 'Unable to extract readable text from document. Document may be scanned, image-only, or empty.'
        });
      }
    } else if (typeof actualResumeData === 'string' && actualResumeData.startsWith('{')) {
      try {
        actualResumeData = JSON.parse(actualResumeData);
      } catch {
        // keep as string
      }
    }

    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Job description is required.' });
    }

    const analysis = evaluateJobMatch(actualResumeData, jobDescription);
    res.json({
      success: true,
      analysis,
      uploadedFileName,
      aiActive: false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const suggestKeywords = async (req, res) => {
  try {
    const { targetRole = 'MERN Stack Developer' } = req.body;
    res.json({
      success: true,
      keywords: {
        essential: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript (ES6+)', 'RESTful APIs'],
        recommended: ['TypeScript', 'JWT Authentication', 'Tailwind CSS', 'Redux Toolkit', 'Git & GitHub'],
        suggestedSummaryKeywords: ['Scalable Architecture', 'RESTful Services', 'Aggregation Pipelines', 'Microservices', 'Clean Architecture'],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCareerRecommendations = async (req, res) => {
  try {
    const { profile, options = {} } = req.body;
    const { evaluateRecommendations } = await import('../services/careerEngine.js');
    const result = evaluateRecommendations(profile || {}, options);
    res.json({
      success: true,
      ...result,
      aiActive: isAiConfigured()
    });
  } catch (error) {
    console.error('[Career Recommendations Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCareerRoadmap = async (req, res) => {
  try {
    const { roleId, profile, completedTaskIds = [] } = req.body;
    const { getPersonalizedRoadmap } = await import('../services/careerEngine.js');
    const roadmap = getPersonalizedRoadmap(roleId, profile || {}, completedTaskIds);
    res.json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error('[Career Roadmap Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


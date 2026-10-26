import { createRequire } from 'module';
import mammoth from 'mammoth';
import { Portfolio } from '../models/Portfolio.js';
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
import { parseResumeToPortfolio } from '../services/resumePortfolioParser.js';

const require = createRequire(import.meta.url);
const pdfParsePkg = require('pdf-parse');

export const getPublicPortfolio = async (req, res) => {
  try {
    const { slug } = req.params;
    const cleanSlug = (slug || 'gopinath').toLowerCase().trim();

    let portfolio = await Portfolio.findOne({ slug: cleanSlug });

    // If not found by exact slug, try finding any portfolio or default
    if (!portfolio) {
      portfolio = await Portfolio.findOne();
    }

    let profile = null;
    if (portfolio) {
      profile = await Profile.findOne({ userId: portfolio.userId });
    }

    if (!profile) {
      profile = await Profile.findOne();
    }

    res.json({
      success: true,
      portfolioSettings: portfolio || {
        slug: 'gopinath',
        theme: 'tech-dark',
        tagline: 'I build modern web applications using MongoDB, Express.js, React.js and Node.js.',
        customBio: '',
        showContactForm: true,
        accentColor: '#6366f1',
      },
      profile: profile || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolioSettings = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: req.user._id,
        slug: 'gopinath',
      });
    }
    res.json({ success: true, portfolioSettings: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePortfolioSettings = async (req, res) => {
  try {
    const updateData = req.body;
    let portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ success: true, portfolioSettings: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upload resume document, extract credentials & generate full portfolio website
 */
export const generatePortfolioFromResume = async (req, res) => {
  try {
    let extractedText = '';
    const file = req.file || (req.files && req.files[0]);
    let originalName = 'resume.txt';

    if (file) {
      originalName = (file.originalname || '').toLowerCase();
      const mime = file.mimetype || '';

      if (originalName.endsWith('.pdf') || mime.includes('pdf')) {
        try {
          if (typeof pdfParsePkg === 'function') {
            const pdfData = await pdfParsePkg(file.buffer);
            extractedText = pdfData.text || '';
          } else if (pdfParsePkg?.PDFParse) {
            const parser = new pdfParsePkg.PDFParse({ data: file.buffer });
            const parseResult = await parser.getText();
            extractedText = parseResult?.text || '';
            if (typeof parser.destroy === 'function') await parser.destroy();
          }
        } catch (pdfErr) {
          console.error('[Portfolio PDF Parse Error]:', pdfErr);
          return res.status(400).json({
            success: false,
            message: 'Unable to parse PDF document. Please check the file is not corrupted or password protected.'
          });
        }
      } else if (originalName.endsWith('.docx') || originalName.endsWith('.doc') || mime.includes('word')) {
        try {
          const docxData = await mammoth.extractRawText({ buffer: file.buffer });
          extractedText = docxData.value || '';
        } catch (docxErr) {
          console.error('[Portfolio DOCX Parse Error]:', docxErr);
          return res.status(400).json({
            success: false,
            message: 'Unable to parse Word document.'
          });
        }
      } else {
        // Plain text, markdown, or other text upload
        extractedText = file.buffer.toString('utf-8');
      }
    } else if (req.body.text) {
      extractedText = req.body.text;
    } else if (req.body.resumeData) {
      extractedText = typeof req.body.resumeData === 'string'
        ? req.body.resumeData
        : JSON.stringify(req.body.resumeData);
    }

    if (!extractedText || extractedText.trim().length < 25) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract text from document. Please upload a readable PDF, DOCX, or text resume.'
      });
    }

    // Call parsing & generation engine
    const parsedResult = await parseResumeToPortfolio(extractedText, originalName);
    const { profile: generatedProfile, portfolioSettings: generatedSettings } = parsedResult;

    // Resolve active user (authenticated user or fallback to demo user in DB)
    let targetUser = req.user;
    if (!targetUser) {
      targetUser = await User.findOne({ email: 'gopinath.mern@example.com' });
      if (!targetUser) targetUser = await User.findOne();
    }

    // Persist to MongoDB if user exists
    if (targetUser) {
      // 1. Update Profile
      await Profile.findOneAndUpdate(
        { userId: targetUser._id },
        {
          $set: {
            userId: targetUser._id,
            personalInfo: generatedProfile.personalInfo,
            careerInfo: generatedProfile.careerInfo,
            education: generatedProfile.education,
            skills: generatedProfile.skills,
            experience: generatedProfile.experience,
            projects: generatedProfile.projects,
            certifications: generatedProfile.certifications || [],
            achievements: generatedProfile.achievements || []
          }
        },
        { upsert: true, new: true }
      );

      // 2. Update Portfolio
      await Portfolio.findOneAndUpdate(
        { userId: targetUser._id },
        {
          $set: {
            userId: targetUser._id,
            slug: generatedSettings.slug,
            theme: generatedSettings.theme || 'tech-blue',
            tagline: generatedSettings.tagline,
            customBio: generatedSettings.customBio || generatedProfile.careerInfo.summary,
            showContactForm: true,
            accentColor: generatedSettings.accentColor || '#079FE8',
            isPublic: true
          }
        },
        { upsert: true, new: true }
      );
    }

    const totalSkills = (generatedProfile.skills?.technical?.length || 0) +
                        (generatedProfile.skills?.frameworks?.length || 0) +
                        (generatedProfile.skills?.databases?.length || 0) +
                        (generatedProfile.skills?.tools?.length || 0) +
                        (generatedProfile.skills?.languages?.length || 0);

    res.json({
      success: true,
      profile: generatedProfile,
      portfolioSettings: generatedSettings,
      atsAnalysis: parsedResult.atsAnalysis || null,
      stats: {
        skillsCount: totalSkills,
        projectsCount: generatedProfile.projects?.length || 0,
        experienceCount: generatedProfile.experience?.length || 0,
        educationCount: generatedProfile.education?.length || 0,
        certificationsCount: generatedProfile.certifications?.length || 0,
        achievementsCount: generatedProfile.achievements?.length || 0
      },
      source: parsedResult.source,
      message: `Successfully analyzed resume! Generated developer portfolio website for ${generatedProfile.personalInfo.fullName}.`
    });

  } catch (error) {
    console.error('[Portfolio Generator Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error generating portfolio from resume.'
    });
  }
};

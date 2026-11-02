import { createRequire } from 'module';
import mammoth from 'mammoth';
import { Portfolio } from '../models/Portfolio.js';
import { Profile } from '../models/Profile.js';
import { parseResumeToPortfolio } from '../services/resumePortfolioParser.js';

const require = createRequire(import.meta.url);
const pdfParsePkg = require('pdf-parse');

export const getPublicPortfolio = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(404).json({ success: false, message: 'Portfolio slug not specified' });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const portfolio = await Portfolio.findOne({ slug: cleanSlug });

    if (!portfolio || !portfolio.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or is currently set to private.',
      });
    }

    const profile = await Profile.findOne({ userId: portfolio.userId });

    res.json({
      success: true,
      portfolioSettings: portfolio,
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
      const baseSlug = req.user.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'developer';
      const slugSuffix = req.user._id.toString().slice(-4);
      const slug = `${baseSlug}-${slugSuffix}`;

      portfolio = await Portfolio.create({
        userId: req.user._id,
        slug,
        portfolioTitle: `${req.user.name}'s Portfolio`,
        theme: 'tech-dark',
        tagline: 'Professional Software Developer',
        customBio: '',
        showContactForm: true,
        accentColor: '#2196D3',
        isPublic: true,
      });
    }

    res.json({ success: true, portfolioSettings: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePortfolioSettings = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;
    delete updateData.userId; // Enforce user isolation

    // If slug is being updated, ensure uniqueness
    if (updateData.slug) {
      const cleanSlug = updateData.slug.toLowerCase().trim();
      const existingSlug = await Portfolio.findOne({
        slug: cleanSlug,
        userId: { $ne: req.user._id },
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: 'This portfolio URL slug is already taken. Please choose another.',
        });
      }
      updateData.slug = cleanSlug;
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, portfolioSettings: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const deleted = await Portfolio.findOneAndDelete({ userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    res.json({ success: true, message: 'Portfolio deleted successfully' });
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
            message: 'Unable to parse PDF document. Please check the file is not corrupted or password protected.',
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
            message: 'Unable to parse Word document.',
          });
        }
      } else {
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
        message: 'Unable to extract text from document. Please upload a readable PDF, DOCX, or text resume.',
      });
    }

    // Call parsing & generation engine
    const parsedResult = await parseResumeToPortfolio(extractedText, originalName);
    const { profile: generatedProfile, portfolioSettings: generatedSettings } = parsedResult;

    // Persist to MongoDB if user is authenticated
    if (req.user) {
      await Profile.findOneAndUpdate(
        { userId: req.user._id },
        {
          $set: {
            userId: req.user._id,
            personalInfo: generatedProfile.personalInfo,
            careerInfo: generatedProfile.careerInfo,
            education: generatedProfile.education,
            skills: generatedProfile.skills,
            experience: generatedProfile.experience,
            projects: generatedProfile.projects,
            certifications: generatedProfile.certifications || [],
            achievements: generatedProfile.achievements || [],
          },
        },
        { upsert: true, new: true }
      );

      await Portfolio.findOneAndUpdate(
        { userId: req.user._id },
        {
          $set: {
            userId: req.user._id,
            slug: generatedSettings.slug,
            theme: generatedSettings.theme || 'tech-blue',
            tagline: generatedSettings.tagline,
            customBio: generatedSettings.customBio || generatedProfile.careerInfo.summary,
            showContactForm: true,
            accentColor: generatedSettings.accentColor || '#2196D3',
            isPublic: true,
          },
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
        achievementsCount: generatedProfile.achievements?.length || 0,
      },
      source: parsedResult.source,
      message: `Successfully analyzed resume! Generated developer portfolio website for ${generatedProfile.personalInfo.fullName}.`,
    });
  } catch (error) {
    console.error('[Portfolio Generator Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error generating portfolio from resume.',
    });
  }
};

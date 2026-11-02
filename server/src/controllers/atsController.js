import { createRequire } from 'module';
import mongoose from 'mongoose';
import mammoth from 'mammoth';
import { evaluateATS } from '../services/atsScoringEngine.js';
import { ATSAnalysis } from '../models/ATSAnalysis.js';
import { Resume } from '../models/Resume.js';

const require = createRequire(import.meta.url);
const pdfParsePkg = require('pdf-parse');

export const analyzeUploadedATS = async (req, res) => {
  try {
    let extractedText = '';
    const { targetRole = 'general', jobDescription = '', resumeId = null, resumeTitle = 'Uploaded Resume' } = req.body;
    const file = req.file || (req.files && req.files[0]);

    if (file) {
      const mime = file.mimetype || '';
      const originalName = (file.originalname || '').toLowerCase();

      if (originalName.endsWith('.pdf') || mime.includes('pdf')) {
        try {
          let pdfText = '';
          if (typeof pdfParsePkg === 'function') {
            const pdfData = await pdfParsePkg(file.buffer);
            pdfText = pdfData.text || '';
          } else if (pdfParsePkg?.PDFParse) {
            const parser = new pdfParsePkg.PDFParse({ data: file.buffer });
            const parseResult = await parser.getText();
            pdfText = parseResult?.text || '';
            if (typeof parser.destroy === 'function') {
              await parser.destroy();
            }
          }
          extractedText = pdfText;
        } catch (pdfErr) {
          console.error('[PDF Parse Error]:', pdfErr);
          return res.status(400).json({
            success: false,
            message: 'Unable to parse PDF document. The file may be password protected or corrupted.',
          });
        }
      } else if (originalName.endsWith('.docx') || originalName.endsWith('.doc') || mime.includes('word')) {
        try {
          const docxData = await mammoth.extractRawText({ buffer: file.buffer });
          extractedText = docxData.value || '';
        } catch (docxErr) {
          console.error('[DOCX Parse Error]:', docxErr);
          return res.status(400).json({
            success: false,
            message: 'Unable to parse Word document. The file may be corrupted.',
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).',
        });
      }
    } else if (req.body.resumeData) {
      let parsedData = req.body.resumeData;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch {
          extractedText = parsedData;
        }
      }

      if (typeof parsedData === 'object' && parsedData !== null) {
        const p = parsedData;
        const personal = `${p.personalInfo?.fullName || ''} ${p.personalInfo?.email || ''} ${p.personalInfo?.phone || ''} ${p.personalInfo?.location || ''} ${p.personalInfo?.linkedin || ''} ${p.personalInfo?.github || ''}`;
        const summary = p.summary || p.professionalSummary || '';
        const skills = [
          ...(p.skills?.technical || []),
          ...(p.skills?.tools || []),
          ...(p.skills?.frameworks || []),
          ...(p.skills?.databases || []),
          ...(p.skills?.languages || []),
        ].join(' ');
        const exp = (p.experience || []).map((e) => `${e.position || e.title || ''} ${e.company || ''} ${e.description || ''} ${(e.bullets || []).join(' ')}`).join(' ');
        const proj = (p.projects || []).map((pr) => `${pr.name || pr.title || ''} ${pr.description || ''} ${(pr.technologies || []).join(' ')} ${(pr.bullets || []).join(' ')}`).join(' ');
        const edu = (p.education || []).map((ed) => `${ed.degree || ''} ${ed.institution || ''} ${ed.grade || ''}`).join(' ');
        const certs = (p.certifications || []).map((c) => (typeof c === 'string' ? c : `${c.name || ''} ${c.issuer || ''}`)).join(' ');
        extractedText = `${personal}\n${summary}\n${skills}\n${exp}\n${proj}\n${edu}\n${certs}`;
      }
    } else if (req.body.text) {
      extractedText = req.body.text;
    }

    const trimmed = (extractedText || '').trim();
    if (!trimmed || trimmed.length < 40) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract readable text from document. Document may be scanned, image-only, or empty. Please upload an ATS-readable text PDF or DOCX.',
      });
    }

    // Execute ATS evaluation
    const result = await evaluateATS({
      text: extractedText,
      roleId: targetRole,
      jobDescription,
    });

    let savedAnalysis = null;
    // If user is authenticated, save analysis history in MongoDB
    if (req.user) {
      let resolvedResumeId = null;
      if (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
        resolvedResumeId = resumeId;
        // Optionally update the resume's atsScore
        await Resume.findOneAndUpdate(
          { _id: resumeId, userId: req.user._id },
          { $set: { atsScore: result.score } }
        );
      }

      savedAnalysis = await ATSAnalysis.create({
        userId: req.user._id,
        resumeId: resolvedResumeId,
        resumeTitle: file ? file.originalname : resumeTitle,
        targetRole,
        jobDescription,
        score: result.score || 0,
        keywords: result.foundKeywords || [],
        foundKeywords: result.foundKeywords || [],
        missingKeywords: result.missingTopKeywords || [],
        suggestions: result.suggestions || [],
        formattingIssues: result.formattingIssues || [],
        breakdown: result.breakdown || {},
      });
    }

    res.json({
      success: true,
      analysisId: savedAnalysis ? savedAnalysis._id.toString() : null,
      ...result,
    });
  } catch (error) {
    console.error('[ATS Analysis Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error evaluating resume ATS score.',
    });
  }
};

export const getAtsHistory = async (req, res) => {
  try {
    const history = await ATSAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAtsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid analysis ID' });
    }

    const analysis = await ATSAnalysis.findOne({ _id: id, userId: req.user._id });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'ATS analysis record not found or access denied',
      });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

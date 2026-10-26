import { createRequire } from 'module';
import mammoth from 'mammoth';
import { evaluateATS } from '../services/atsScoringEngine.js';

const require = createRequire(import.meta.url);
const pdfParsePkg = require('pdf-parse');

export const analyzeUploadedATS = async (req, res) => {
  try {
    let extractedText = '';
    const { targetRole = 'general', jobDescription = '' } = req.body;
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
            message: 'Unable to parse PDF document. The file may be password protected or corrupted.'
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
            message: 'Unable to parse Word document. The file may be corrupted.'
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).'
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
        const summary = p.summary || '';
        const skills = [
          ...(p.skills?.technical || []),
          ...(p.skills?.tools || []),
          ...(p.skills?.frameworks || []),
          ...(p.skills?.databases || []),
          ...(p.skills?.languages || [])
        ].join(' ');
        const exp = (p.experience || []).map(e => `${e.position || e.title || ''} ${e.company || ''} ${e.description || ''} ${(e.bullets || []).join(' ')}`).join(' ');
        const proj = (p.projects || []).map(pr => `${pr.name || pr.title || ''} ${pr.description || ''} ${(pr.technologies || []).join(' ')} ${(pr.bullets || []).join(' ')}`).join(' ');
        const edu = (p.education || []).map(ed => `${ed.degree || ''} ${ed.institution || ''} ${ed.grade || ''}`).join(' ');
        const certs = (p.certifications || []).map(c => typeof c === 'string' ? c : `${c.name || ''} ${c.issuer || ''}`).join(' ');
        extractedText = `${personal}\n${summary}\n${skills}\n${exp}\n${proj}\n${edu}\n${certs}`;
      }
    } else if (req.body.text) {
      extractedText = req.body.text;
    }

    // Validation: Clean text length check
    const trimmed = (extractedText || '').trim();
    if (!trimmed || trimmed.length < 40) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract readable text from document. Document may be scanned, image-only, or empty. Please upload an ATS-readable text PDF or DOCX.'
      });
    }

    // Execute Gemini AI-powered ATS evaluation
    const result = await evaluateATS({
      text: extractedText,
      roleId: targetRole,
      jobDescription
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[ATS Analysis Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error evaluating resume ATS score.'
    });
  }
};

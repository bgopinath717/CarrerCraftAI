import { jsPDF } from 'jspdf';

/**
 * High-Fidelity PDF Generation Service for CareerCraft AI
 * Produces authentic, selectable, searchable, multi-page vector PDFs
 */
export const pdfService = {
  /**
   * Generates a professional ATS-compliant Resume PDF matching the CareerCraft Classic ATS layout
   */
  generateResumePDF(resume, template = 'classic-ats') {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 16;

    const checkPageBreak = (neededHeight = 8) => {
      if (currentY + neededHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 4;
      }
    };

    // STRICTLY Times New Roman for ALL templates ("CareerCraft Classic ATS", "Modern ATS", "Tech Pro", "Minimal Classic", "Executive")
    const fontPrimary = 'times';

    // Template specific configurations (colors and divider lines while all using Times New Roman)
    const isClassic = template === 'classic-ats';
    const isMinimal = template === 'minimal';
    const isTechPro = template === 'tech-pro';
    const isExecutive = template === 'executive';
    const isCentered = isClassic || isMinimal;

    // Executive top accent bar
    if (isExecutive) {
      doc.setFillColor(7, 159, 232); // #079FE8
      doc.rect(margin, 8, contentWidth, 2, 'F');
      currentY = 18;
    }

    // 1. Header (Centered for Classic ATS / Minimal, aligned for others)
    const fullName = resume.personalInfo?.fullName || 'B Gopinath';
    doc.setFont(fontPrimary, 'bold');
    doc.setFontSize(isClassic ? 21 : 19);

    if (isClassic) {
      doc.setTextColor(0, 0, 0);
    } else if (isTechPro) {
      doc.setTextColor(7, 59, 104); // #073B68
    } else if (isExecutive) {
      doc.setTextColor(6, 43, 79); // #062B4F
    } else if (isMinimal) {
      doc.setTextColor(17, 24, 39);
    } else {
      doc.setTextColor(11, 58, 91); // #0B3A5B Modern ATS
    }

    const nameWidth = doc.getTextWidth(fullName);
    const headerX = isCentered ? (pageWidth - nameWidth) / 2 : margin;
    doc.text(fullName, headerX, currentY);
    currentY += 5.5;

    // Title if not classic and available
    if (!isClassic && resume.personalInfo?.title) {
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(10.5);
      if (isTechPro) {
        doc.setTextColor(7, 59, 104);
      } else if (isExecutive) {
        doc.setTextColor(7, 159, 232);
      } else if (isMinimal) {
        doc.setTextColor(75, 85, 99);
      } else {
        doc.setTextColor(33, 150, 211);
      }
      const titleWidth = doc.getTextWidth(resume.personalInfo.title);
      const titleX = isCentered ? (pageWidth - titleWidth) / 2 : margin;
      doc.text(resume.personalInfo.title, titleX, currentY);
      currentY += 4.5;
    }

    // Contact Details Line
    const contactParts = [];
    if (resume.personalInfo?.phone) contactParts.push(resume.personalInfo.phone);
    if (resume.personalInfo?.email) contactParts.push(resume.personalInfo.email);
    if (resume.personalInfo?.location) contactParts.push(resume.personalInfo.location);

    if (contactParts.length > 0) {
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(55, 65, 81);
      const contactText = contactParts.join('  |  ');
      const contactWidth = doc.getTextWidth(contactText);
      const contactX = isCentered ? (pageWidth - contactWidth) / 2 : margin;
      doc.text(contactText, contactX, currentY);
      currentY += 4.5;
    }

    // Links Line (LinkedIn, GitHub, Portfolio)
    const linksParts = [];
    if (resume.personalInfo?.linkedin) linksParts.push(resume.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, ''));
    if (resume.personalInfo?.github) linksParts.push(resume.personalInfo.github.replace(/^https?:\/\/(www\.)?/, ''));
    if (resume.personalInfo?.website) linksParts.push(resume.personalInfo.website.replace(/^https?:\/\/(www\.)?/, ''));

    if (linksParts.length > 0) {
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(9);
      if (isClassic) {
        doc.setTextColor(11, 58, 91);
      } else if (isTechPro) {
        doc.setTextColor(7, 59, 104);
      } else if (isExecutive) {
        doc.setTextColor(6, 43, 79);
      } else if (isMinimal) {
        doc.setTextColor(55, 65, 81);
      } else {
        doc.setTextColor(33, 150, 211);
      }
      const linksText = linksParts.join('  |  ');
      const linksWidth = doc.getTextWidth(linksText);
      const linksX = isCentered ? (pageWidth - linksWidth) / 2 : margin;
      doc.text(linksText, linksX, currentY);
      currentY += 5.5;
    } else {
      currentY += 2;
    }

    const drawSectionHeader = (title) => {
      checkPageBreak(12);
      currentY += 2;
      doc.setFont(fontPrimary, 'bold');
      doc.setFontSize(isClassic ? 11 : 10.5);

      if (isClassic) {
        doc.setTextColor(0, 0, 0);
      } else if (isTechPro) {
        doc.setTextColor(7, 59, 104); // #073B68
      } else if (isExecutive) {
        doc.setTextColor(6, 43, 79); // #062B4F
      } else if (isMinimal) {
        doc.setTextColor(31, 41, 55);
      } else {
        doc.setTextColor(11, 58, 91); // #0B3A5B Modern ATS
      }

      doc.text(isClassic || isMinimal ? title : title.toUpperCase(), margin, currentY);
      currentY += 1.5;

      if (isClassic) {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.35);
      } else if (isMinimal) {
        doc.setDrawColor(113, 128, 150); // #718096
        doc.setLineWidth(0.25);
      } else if (isTechPro) {
        doc.setDrawColor(7, 59, 104);
        doc.setLineWidth(0.4);
      } else if (isExecutive) {
        doc.setDrawColor(7, 159, 232); // #079FE8
        doc.setLineWidth(0.4);
      } else {
        doc.setDrawColor(33, 150, 211); // #2196D3 underline
        doc.setLineWidth(0.4);
      }
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 4.5;
    };

    // 2. Professional Summary
    if (resume.summary) {
      drawSectionHeader('Professional Summary');
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(31, 41, 55);
      const summaryLines = doc.splitTextToSize(resume.summary, contentWidth);
      summaryLines.forEach(line => {
        checkPageBreak(5);
        doc.text(line, margin, currentY);
        currentY += 4.2;
      });
      currentY += 1.5;
    }

    // 3. Technical Skills
    const skills = resume.skills || {};
    const hasAnySkills = skills.technical?.length || skills.frameworks?.length || skills.tools?.length || skills.languages?.length || skills.databases?.length || skills.soft?.length;
    if (hasAnySkills) {
      drawSectionHeader('Technical Skills');
      doc.setFontSize(9.5);

      const renderSkillCategory = (label, list) => {
        if (!list || list.length === 0) return;
        checkPageBreak(5);
        doc.setFont(fontPrimary, 'bold');
        doc.setTextColor(0, 0, 0);
        const prefix = `${label}: `;
        doc.text(prefix, margin, currentY);
        const prefixWidth = doc.getTextWidth(prefix);

        doc.setFont(fontPrimary, 'normal');
        doc.setTextColor(31, 41, 55);
        const items = Array.isArray(list) ? list.join(', ') : String(list);
        const skillLines = doc.splitTextToSize(items, contentWidth - prefixWidth);
        
        doc.text(skillLines[0], margin + prefixWidth, currentY);
        currentY += 4.2;
        for (let i = 1; i < skillLines.length; i++) {
          checkPageBreak(4.2);
          doc.text(skillLines[i], margin + prefixWidth, currentY);
          currentY += 4.2;
        }
      };

      if (skills.languages?.length) renderSkillCategory('Programming Languages', skills.languages);
      if (skills.technical?.length) renderSkillCategory('Web Technologies', skills.technical);
      if (skills.frameworks?.length) renderSkillCategory('Frameworks & Libraries', skills.frameworks);
      if (skills.databases?.length) renderSkillCategory('Database', skills.databases);
      if (skills.tools?.length) renderSkillCategory('Platforms & Tools', skills.tools);
      if (skills.soft?.length) renderSkillCategory('Core Concepts', skills.soft);
      currentY += 1.5;
    }

    // 4. Projects
    if (resume.projects && resume.projects.length > 0) {
      drawSectionHeader('Projects');
      resume.projects.forEach(proj => {
        checkPageBreak(12);
        // Project Title
        doc.setFont(fontPrimary, 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const pTitle = proj.name || proj.title || 'Technical Project';
        doc.text(pTitle, margin, currentY);

        if (proj.liveUrl) {
          doc.setFont(fontPrimary, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(33, 150, 211);
          const linkStr = proj.liveUrl.replace(/^https?:\/\//, '');
          const linkWidth = doc.getTextWidth(linkStr);
          doc.text(linkStr, pageWidth - margin - linkWidth, currentY);
        }
        currentY += 4;

        if (proj.technologies && proj.technologies.length > 0) {
          doc.setFont(fontPrimary, 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(75, 85, 99);
          const techStr = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : String(proj.technologies);
          doc.text(techStr, margin, currentY);
          currentY += 3.8;
        }

        // Bullets or description
        doc.setFont(fontPrimary, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);

        const bullets = (proj.bullets && proj.bullets.length > 0)
          ? proj.bullets
          : (proj.description ? proj.description.split('\n').filter(Boolean) : []);

        bullets.forEach(b => {
          if (!b) return;
          const cleanB = b.replace(/^[•\-*]\s*/, '');
          const bLines = doc.splitTextToSize(`•  ${cleanB}`, contentWidth - 4);
          bLines.forEach((line, idx) => {
            checkPageBreak(4.2);
            doc.text(line, margin + (idx === 0 ? 0 : 3.5), currentY);
            currentY += 3.8;
          });
        });
        currentY += 1.8;
      });
    }

    // 5. Work Experience / Internships
    if (resume.experience && resume.experience.length > 0) {
      drawSectionHeader('Internship & Experience');
      resume.experience.forEach(exp => {
        checkPageBreak(12);
        doc.setFont(fontPrimary, 'bold');
        doc.setFontSize(9.8);
        doc.setTextColor(0, 0, 0);
        const roleComp = `${exp.position || exp.title || 'Role'}${exp.company ? ' – ' + exp.company : ''}`;
        doc.text(roleComp, margin, currentY);

        const dateRange = `${exp.startDate || exp.startYear || ''} – ${exp.current ? 'Present' : (exp.endDate || exp.endYear || '')}`;
        if (dateRange.trim() !== '–') {
          doc.setFont(fontPrimary, 'bold');
          doc.setFontSize(9);
          doc.setTextColor(55, 65, 81);
          const dateWidth = doc.getTextWidth(dateRange);
          doc.text(dateRange, pageWidth - margin - dateWidth, currentY);
        }
        currentY += 4;

        doc.setFont(fontPrimary, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);

        const expBullets = (exp.bullets && exp.bullets.length > 0)
          ? exp.bullets
          : (exp.description ? exp.description.split('\n').filter(Boolean) : []);

        expBullets.forEach(b => {
          if (!b) return;
          const cleanB = b.replace(/^[•\-*]\s*/, '');
          const bLines = doc.splitTextToSize(`•  ${cleanB}`, contentWidth - 4);
          bLines.forEach((line, idx) => {
            checkPageBreak(4.2);
            doc.text(line, margin + (idx === 0 ? 0 : 3.5), currentY);
            currentY += 3.8;
          });
        });
        currentY += 1.8;
      });
    }

    // 6. Education
    if (resume.education && resume.education.length > 0) {
      drawSectionHeader('Education');
      resume.education.forEach(edu => {
        checkPageBreak(10);
        doc.setFont(fontPrimary, 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(17, 24, 39);
        doc.text(edu.institution || 'University', margin, currentY);

        const years = `${edu.startYear || ''} – ${edu.endYear || ''}`;
        if (years.trim() !== '–') {
          const yWidth = doc.getTextWidth(years);
          doc.text(years, pageWidth - margin - yWidth, currentY);
        }
        currentY += 4;

        doc.setFont(fontPrimary, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        const degree = edu.degree || 'Degree';
        doc.text(degree, margin, currentY);

        if (edu.grade) {
          const gradeStr = `CGPA / Grade: ${edu.grade}`;
          const gWidth = doc.getTextWidth(gradeStr);
          doc.text(gradeStr, pageWidth - margin - gWidth, currentY);
        }
        currentY += 4.5;
      });
    }

    // 7. Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      drawSectionHeader('Certifications');
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      resume.certifications.forEach(c => {
        const cText = typeof c === 'string' ? c : `${c.name || ''} — ${c.issuer || c.organization || ''}`;
        if (!cText.trim()) return;
        const cLines = doc.splitTextToSize(`•  ${cText}`, contentWidth - 4);
        cLines.forEach(line => {
          checkPageBreak(4.2);
          doc.text(line, margin, currentY);
          currentY += 4;
        });
      });
      currentY += 1.5;
    }

    // 8. Achievements
    if (resume.achievements && resume.achievements.length > 0) {
      drawSectionHeader('Achievements');
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      resume.achievements.forEach(a => {
        const aText = typeof a === 'string' ? a : `${a.title || ''}${a.description ? ': ' + a.description : ''}`;
        if (!aText.trim()) return;
        const aLines = doc.splitTextToSize(`•  ${aText}`, contentWidth - 4);
        aLines.forEach(line => {
          checkPageBreak(4.2);
          doc.text(line, margin, currentY);
          currentY += 4;
        });
      });
      currentY += 1.5;
    }

    // 9. Languages
    if (resume.languages && resume.languages.length > 0) {
      drawSectionHeader('Languages');
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      const langStr = resume.languages.map(l => typeof l === 'string' ? l : l.name || l.language).join(', ');
      doc.text(langStr, margin, currentY);
      currentY += 4;
    }

    // Filename generation
    const rawName = resume.personalInfo?.fullName || 'Gopinath';
    const safeName = rawName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const filename = `${safeName || 'Candidate'}_Resume.pdf`;

    doc.save(filename);
    return filename;
  },

  /**
   * Generates a clean PDF Report of the ATS Analysis
   */
  generateATSReportPDF(analysis) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 18;

    const checkPageBreak = (needed = 10) => {
      if (currentY + needed > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 4;
      }
    };

    // Header Title
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(11, 58, 91); // #0B3A5B
    doc.text('CareerCraft AI — ATS Audit Report', margin, currentY);
    currentY += 6;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Target Role: ${analysis.targetRole || 'Full Stack Developer'}  |  Date: ${analysis.analysisDate || new Date().toLocaleDateString()}`, margin, currentY);
    currentY += 7;

    // Overall Score Box
    doc.setFillColor(243, 250, 254); // #F3FAFE
    doc.setDrawColor(207, 226, 243);
    doc.roundedRect(margin, currentY, contentWidth, 24, 3, 3, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    const scoreColor = analysis.score >= 80 ? [22, 163, 74] : analysis.score >= 65 ? [245, 158, 11] : [239, 68, 68];
    doc.setTextColor(...scoreColor);
    doc.text(`${analysis.score} / 100`, margin + 6, currentY + 12);

    doc.setFontSize(11);
    doc.setTextColor(11, 58, 91);
    doc.text(`ATS Compatibility: ${analysis.score >= 80 ? 'Optimized' : analysis.score >= 65 ? 'Moderate' : 'Action Required'}`, margin + 48, currentY + 10);

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(analysis.interpretation || 'Evaluated against industry recruitment algorithm standards.', margin + 48, currentY + 16);
    currentY += 30;

    // Category Breakdown (6 Categories)
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(11, 58, 91);
    doc.text('Category Breakdown (100 Points Total)', margin, currentY);
    currentY += 6;

    if (analysis.categories) {
      analysis.categories.forEach(cat => {
        checkPageBreak(9);
        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(17, 24, 39);
        doc.text(cat.name, margin, currentY);

        const scoreStr = `${cat.earned} / ${cat.max} pts`;
        const sWidth = doc.getTextWidth(scoreStr);
        doc.text(scoreStr, pageWidth - margin - sWidth, currentY);
        currentY += 3.5;

        // Progress bar line
        const barWidth = contentWidth;
        const progressWidth = (cat.earned / cat.max) * barWidth;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(2.5);
        doc.line(margin, currentY, margin + barWidth, currentY);

        doc.setDrawColor(33, 150, 211);
        doc.line(margin, currentY, margin + progressWidth, currentY);
        currentY += 5;
      });
      currentY += 4;
    }

    // Matched Keywords
    checkPageBreak(20);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(11, 58, 91);
    doc.text('Keyword Matching Highlights', margin, currentY);
    currentY += 6;

    const detected = analysis.matchedKeywords || analysis.keywordStats?.detectedKeywords || [];
    const missing = analysis.missingKeywords || analysis.keywordStats?.missingKeywords || [];

    if (detected.length > 0) {
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(22, 163, 74);
      doc.text(`✓ Detected Keywords (${detected.length}): `, margin, currentY);
      currentY += 4;
      doc.setFont('times', 'normal');
      doc.setTextColor(55, 65, 81);
      const dLines = doc.splitTextToSize(detected.join(', '), contentWidth);
      dLines.forEach(l => { doc.text(l, margin, currentY); currentY += 4; });
      currentY += 2;
    }

    if (missing.length > 0) {
      checkPageBreak(12);
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(217, 119, 6);
      doc.text(`! Missing Recommended Keywords (${missing.length}): `, margin, currentY);
      currentY += 4;
      doc.setFont('times', 'normal');
      doc.setTextColor(55, 65, 81);
      const mLines = doc.splitTextToSize(missing.join(', '), contentWidth);
      mLines.forEach(l => { doc.text(l, margin, currentY); currentY += 4; });
      currentY += 4;
    }

    // Top Recommendations
    if (analysis.recommendations && analysis.recommendations.length > 0) {
      checkPageBreak(25);
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(11, 58, 91);
      doc.text('Key Improvement Recommendations', margin, currentY);
      currentY += 6;

      analysis.recommendations.forEach((rec, idx) => {
        checkPageBreak(18);
        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(17, 24, 39);
        doc.text(`${idx + 1}. ${rec.issue}`, margin, currentY);
        currentY += 4;

        doc.setFont('times', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(75, 85, 99);
        const impLines = doc.splitTextToSize(`Action: ${rec.suggestedImprovement}`, contentWidth - 4);
        impLines.forEach(l => { doc.text(l, margin + 4, currentY); currentY += 3.8; });

        if (rec.example) {
          doc.setTextColor(33, 150, 211);
          const exLines = doc.splitTextToSize(rec.example, contentWidth - 4);
          exLines.forEach(l => { doc.text(l, margin + 4, currentY); currentY += 3.8; });
        }
        currentY += 2;
      });
    }

    // Disclaimer footer
    checkPageBreak(10);
    currentY += 4;
    doc.setFont('times', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('CareerCraft AI is an automated resume audit tool. Score calculations are analytical estimates and do not guarantee hiring outcomes.', margin, currentY);

    const filename = `CareerCraft_ATS_Report_${(analysis.targetRole || 'Audit').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);
    return filename;
  },

  /**
   * Generates a professional ATS-compliant Cover Letter PDF strictly in Times New Roman
   */
  generateCoverLetterPDF({ candidateName = 'B. Gopinath', jobTitle = 'MERN Stack Developer', companyName = 'Company', content = '', email = '', phone = '', location = '' }) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 22;

    const checkPageBreak = (neededHeight = 8) => {
      if (currentY + neededHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 4;
      }
    };

    // STRICTLY Times New Roman
    const fontPrimary = 'times';

    // 1. Header: Candidate Name
    doc.setFont(fontPrimary, 'bold');
    doc.setFontSize(20);
    doc.setTextColor(17, 24, 39);
    doc.text(candidateName, margin, currentY);
    currentY += 6;

    // Subtitle / Role
    if (jobTitle) {
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(11);
      doc.setTextColor(75, 85, 99);
      doc.text(jobTitle, margin, currentY);
      currentY += 5;
    }

    // Contact Details
    const contactParts = [];
    if (email) contactParts.push(email);
    if (phone) contactParts.push(phone);
    if (location) contactParts.push(location);
    if (contactParts.length > 0) {
      doc.setFont(fontPrimary, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(contactParts.join('  |  '), margin, currentY);
      currentY += 5;
    }

    // Divider Line
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    // Date
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFont(fontPrimary, 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(55, 65, 81);
    doc.text(today, margin, currentY);
    currentY += 8;

    // Body Paragraphs
    const paragraphs = content.split('\n\n');
    doc.setFont(fontPrimary, 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(31, 41, 55);

    paragraphs.forEach(para => {
      const cleanPara = para.trim();
      if (!cleanPara) return;

      const lines = doc.splitTextToSize(cleanPara, contentWidth);
      const blockHeight = lines.length * 5;
      checkPageBreak(blockHeight + 4);

      lines.forEach(line => {
        doc.text(line, margin, currentY);
        currentY += 5;
      });
      currentY += 4;
    });

    const filename = `Cover_Letter_${(companyName || 'Application').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);
    return filename;
  },

  /**
   * Generates a comprehensive Job Match Alignment Audit Report PDF
   */
  generateJobMatchReportPDF({ analysis, resumeTitle = 'Resume', candidateName = 'Candidate', jobTitle = 'Target Role' }) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    doc.setFont('times', 'normal');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 16;

    const checkPageBreak = (neededHeight = 8) => {
      if (currentY + neededHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 4;
      }
    };

    // 1. Header Banner
    doc.setFillColor(7, 59, 104); // #073B68
    doc.rect(margin, currentY, contentWidth, 22, 'F');

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('CareerCraft AI  |  Job Match Alignment Report', margin + 6, currentY + 9);

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(224, 242, 254);
    doc.text(`Candidate: ${candidateName}  •  Resume: ${resumeTitle}  •  Date: ${new Date().toLocaleDateString()}`, margin + 6, currentY + 16);

    currentY += 28;

    // 2. Score Summary Card
    const scoreColor = analysis.matchScore >= 80 ? [22, 163, 74] : analysis.matchScore >= 60 ? [217, 119, 6] : [220, 38, 38];
    doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setLineWidth(0.6);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${analysis.matchScore}%`, margin + 6, currentY + 14);

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Overall Job Match Score', margin + 34, currentY + 9);

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(analysis.scoreInterpretation || 'Calculated from weighted technical skills, experience, projects & education alignment.', margin + 34, currentY + 16);

    currentY += 28;

    // 3. Scoring Breakdown
    if (analysis.scoringFormula) {
      checkPageBreak(25);
      doc.setFont('times', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(7, 59, 104);
      doc.text('Transparent Weighted Score Breakdown', margin, currentY);
      currentY += 6;

      const sf = analysis.scoringFormula;
      const dims = [
        { label: 'Technical Skills (40%)', score: sf.technicalSkills?.score || 0 },
        { label: 'Experience (25%)', score: sf.experience?.score || 0 },
        { label: 'Projects (20%)', score: sf.projects?.score || 0 },
        { label: 'Education (10%)', score: sf.education?.score || 0 },
        { label: 'Keyword Coverage (5%)', score: sf.keywordCoverage?.score || 0 }
      ];

      dims.forEach(d => {
        checkPageBreak(6);
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        doc.text(d.label, margin, currentY);

        doc.setFont('times', 'bold');
        doc.text(`${d.score}/100`, pageWidth - margin - 20, currentY);

        // mini bar
        doc.setFillColor(226, 232, 240);
        doc.rect(margin + 70, currentY - 3, 50, 3.5, 'F');
        doc.setFillColor(7, 159, 232);
        doc.rect(margin + 70, currentY - 3, (d.score / 100) * 50, 3.5, 'F');

        currentY += 5.5;
      });
      currentY += 4;
    }

    // 4. Skills Breakdown
    checkPageBreak(30);
    doc.setFont('times', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(7, 59, 104);
    doc.text('Skills Classification Summary', margin, currentY);
    currentY += 6;

    // Matched
    if (analysis.matchedSkills && analysis.matchedSkills.length > 0) {
      checkPageBreak(12);
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(22, 163, 74);
      doc.text(`[Matched Skills (${analysis.matchedSkills.length})]:`, margin, currentY);
      currentY += 4.5;
      doc.setFont('times', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const matchedNames = analysis.matchedSkills.map(m => typeof m === 'string' ? m : m.name).join(', ');
      const mLines = doc.splitTextToSize(matchedNames, contentWidth);
      mLines.forEach(l => { doc.text(l, margin, currentY); currentY += 4; });
      currentY += 2;
    }

    // Partially Matched
    if (analysis.partiallyMatchedSkills && analysis.partiallyMatchedSkills.length > 0) {
      checkPageBreak(12);
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(217, 119, 6);
      doc.text(`[Partially Matched Skills (${analysis.partiallyMatchedSkills.length})]:`, margin, currentY);
      currentY += 4.5;
      doc.setFont('times', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const partialNames = analysis.partiallyMatchedSkills.map(p => `${p.name} (via ${p.adjacentSkillFound || 'adjacent background'})`).join(', ');
      const pLines = doc.splitTextToSize(partialNames, contentWidth);
      pLines.forEach(l => { doc.text(l, margin, currentY); currentY += 4; });
      currentY += 2;
    }

    // Missing
    if (analysis.missingSkills && analysis.missingSkills.length > 0) {
      checkPageBreak(12);
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(220, 38, 38);
      doc.text(`[Missing From Resume Text (${analysis.missingSkills.length})]:`, margin, currentY);
      currentY += 4.5;
      doc.setFont('times', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const missingNames = analysis.missingSkills.map(m => typeof m === 'string' ? m : m.name).join(', ');
      const misLines = doc.splitTextToSize(`${missingNames} (Note: Does not mean candidate lacks skill; add evidence if proficient)`, contentWidth);
      misLines.forEach(l => { doc.text(l, margin, currentY); currentY += 4; });
      currentY += 4;
    }

    // 5. Prioritized Recommendations
    const recs = analysis.prioritizedRecommendations || (analysis.recommendations || []).map(r => ({ title: 'Recommendation', description: r, priority: 'Medium', section: 'General' }));
    if (recs.length > 0) {
      checkPageBreak(25);
      doc.setFont('times', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(7, 59, 104);
      doc.text('Prioritized Resume Improvement Recommendations', margin, currentY);
      currentY += 6;

      recs.forEach((rec, idx) => {
        checkPageBreak(16);
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        const prioTag = rec.priority ? `[${rec.priority} Priority] ` : '';
        doc.text(`${idx + 1}. ${prioTag}${rec.title}`, margin, currentY);
        currentY += 4;

        if (rec.section) {
          doc.setFont('times', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(7, 159, 232);
          doc.text(`Target Section: ${rec.section}`, margin + 4, currentY);
          currentY += 3.5;
        }

        doc.setFont('times', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        const descLines = doc.splitTextToSize(rec.description || '', contentWidth - 4);
        descLines.forEach(l => { doc.text(l, margin + 4, currentY); currentY += 3.6; });
        currentY += 2;
      });
    }

    // 6. Disclaimer
    checkPageBreak(12);
    currentY += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 4;
    doc.setFont('times', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    const discLines = doc.splitTextToSize(analysis.disclaimer || 'Job Match Score is an algorithmic alignment estimate based on resume evidence vs. posted requirements. It assesses semantic relevance and does not constitute a guarantee of recruiter review or interview selection.', contentWidth);
    discLines.forEach(l => { doc.text(l, margin, currentY); currentY += 3.2; });

    const filename = `CareerCraft_Job_Match_${candidateName.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    return filename;
  }
};

export default pdfService;

import { Resume } from '../models/Resume.js';
import { CoverLetter } from '../models/CoverLetter.js';
import { Portfolio } from '../models/Portfolio.js';
import { ATSAnalysis } from '../models/ATSAnalysis.js';
import { Profile } from '../models/Profile.js';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      resumesCount,
      completedResumesCount,
      draftResumesCount,
      coverLettersCount,
      atsAnalysesCount,
      portfolio,
      latestAtsDoc,
      recentResumes,
      recentCoverLetters,
      profile,
    ] = await Promise.all([
      Resume.countDocuments({ userId }),
      Resume.countDocuments({ userId, status: 'Completed' }),
      Resume.countDocuments({ userId, status: { $ne: 'Completed' } }),
      CoverLetter.countDocuments({ userId }),
      ATSAnalysis.countDocuments({ userId }),
      Portfolio.findOne({ userId }),
      ATSAnalysis.findOne({ userId }).sort({ createdAt: -1 }),
      Resume.find({ userId }).sort({ updatedAt: -1 }).limit(3),
      CoverLetter.find({ userId }).sort({ updatedAt: -1 }).limit(3),
      Profile.findOne({ userId }),
    ]);

    // Compute latest ATS score from either latest ATS analysis or latest resume
    let latestAtsScore = null;
    if (latestAtsDoc && typeof latestAtsDoc.score === 'number') {
      latestAtsScore = latestAtsDoc.score;
    } else if (recentResumes.length > 0 && recentResumes[0].atsScore > 0) {
      latestAtsScore = recentResumes[0].atsScore;
    }

    res.json({
      success: true,
      dashboard: {
        user: {
          id: req.user._id.toString(),
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
        counts: {
          resumes: resumesCount,
          completedResumes: completedResumesCount,
          draftResumes: draftResumesCount,
          coverLetters: coverLettersCount,
          atsAnalyses: atsAnalysesCount,
        },
        latestAtsScore,
        portfolio: portfolio ? {
          id: portfolio._id.toString(),
          slug: portfolio.slug,
          theme: portfolio.theme,
          isPublic: portfolio.isPublic,
        } : null,
        recentResumes,
        recentCoverLetters,
        profile: profile || null,
      },
    });
  } catch (error) {
    console.error('[Dashboard Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

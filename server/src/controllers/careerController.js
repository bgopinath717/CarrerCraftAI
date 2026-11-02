import { CareerGuidance } from '../models/CareerGuidance.js';

export const getCareerHistory = async (req, res) => {
  try {
    const history = await CareerGuidance.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveCareerGuidance = async (req, res) => {
  try {
    const { targetRole, recommendations, roadmap, skillGap } = req.body;
    const doc = await CareerGuidance.create({
      userId: req.user._id,
      targetRole: targetRole || 'Software Developer',
      recommendations: recommendations || [],
      roadmap: roadmap || {},
      skillGap: skillGap || {},
    });
    res.status(201).json({ success: true, guidance: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


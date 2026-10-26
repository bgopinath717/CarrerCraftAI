import { Profile } from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      // Auto-create profile if missing
      profile = await Profile.create({
        userId: req.user._id,
        personalInfo: {
          fullName: req.user.name || 'B. Gopinath',
          email: req.user.email || 'gopinath.mern@example.com',
          title: 'MERN Stack Developer',
        },
      });
    }
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updateData = req.body;
    let profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { UserSettings } from '../models/UserSettings.js';
import { User } from '../models/User.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = await UserSettings.create({
        userId: req.user._id,
        darkMode: false,
        emailNotifications: true,
        publicPortfolio: true,
        profileVisibility: 'public',
      });
    }

    res.json({
      success: true,
      settings,
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { darkMode, emailNotifications, publicPortfolio, profileVisibility, name, email, password } = req.body;

    // Update settings document
    const updateData = {};
    if (typeof darkMode === 'boolean') updateData.darkMode = darkMode;
    if (typeof emailNotifications === 'boolean') updateData.emailNotifications = emailNotifications;
    if (typeof publicPortfolio === 'boolean') updateData.publicPortfolio = publicPortfolio;
    if (profileVisibility) updateData.profileVisibility = profileVisibility;

    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // If name or email or password updated on account
    const user = await User.findById(req.user._id);
    if (user) {
      let userModified = false;
      if (name && name.trim() && name !== user.name) {
        user.name = name.trim();
        userModified = true;
      }
      if (email && email.trim() && email.toLowerCase() !== user.email) {
        const cleanEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
        if (existing) {
          return res.status(400).json({ success: false, message: 'Email address is already in use by another account' });
        }
        user.email = cleanEmail;
        userModified = true;
      }
      if (password && password.length >= 6 && password !== '••••••••') {
        user.password = password; // pre-save hook will hash
        userModified = true;
      }
      if (userModified) {
        await user.save();
      }
    }

    res.json({
      success: true,
      settings,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Account settings and preferences updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


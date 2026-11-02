import mongoose from 'mongoose';
import { CoverLetter } from '../models/CoverLetter.js';

export const getCoverLetters = async (req, res) => {
  try {
    const letters = await CoverLetter.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, coverLetters: letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoverLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid cover letter ID' });
    }

    const letter = await CoverLetter.findOne({ _id: id, userId: req.user._id });
    if (!letter) {
      return res.status(404).json({
        success: false,
        message: 'Cover letter not found or you do not have permission to access it',
      });
    }

    res.json({ success: true, coverLetter: letter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoverLetter = async (req, res) => {
  try {
    const letterData = { ...req.body };
    delete letterData._id;
    delete letterData.id;
    letterData.userId = req.user._id;

    if (!letterData.title) letterData.title = 'Job Application Cover Letter';
    if (!letterData.content) {
      return res.status(400).json({ success: false, message: 'Cover letter content is required' });
    }

    const letter = await CoverLetter.create(letterData);
    res.status(201).json({ success: true, coverLetter: letter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;
    delete updateData.userId; // Prevent transferring ownership

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const created = await CoverLetter.create({ ...updateData, userId: req.user._id });
      return res.status(201).json({ success: true, coverLetter: created });
    }

    const updated = await CoverLetter.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Cover letter not found or you do not have permission to update it',
      });
    }

    res.json({ success: true, coverLetter: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid cover letter ID' });
    }

    const deleted = await CoverLetter.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Cover letter not found or you do not have permission to delete it',
      });
    }

    res.json({ success: true, message: 'Cover letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

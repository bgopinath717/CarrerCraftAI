import { CoverLetter } from '../models/CoverLetter.js';
import mongoose from 'mongoose';

export const getCoverLetters = async (req, res) => {
  try {
    const letters = await CoverLetter.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, coverLetters: letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoverLetter = async (req, res) => {
  try {
    const letterData = { ...req.body, userId: req.user._id };
    delete letterData._id;
    delete letterData.id;

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

    let filter = { userId: req.user._id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter._id = id;
    } else {
      const created = await CoverLetter.create({ ...req.body, userId: req.user._id });
      return res.json({ success: true, coverLetter: created });
    }

    const updated = await CoverLetter.findOneAndUpdate(filter, { $set: updateData }, { new: true });
    if (!updated) {
      const created = await CoverLetter.create({ ...updateData, userId: req.user._id });
      return res.json({ success: true, coverLetter: created });
    }

    res.json({ success: true, coverLetter: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    let filter = { userId: req.user._id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter._id = id;
    }

    await CoverLetter.findOneAndDelete(filter);
    res.json({ success: true, message: 'Cover letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

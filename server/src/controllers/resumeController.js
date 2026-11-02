import mongoose from 'mongoose';
import { Resume } from '../models/Resume.js';

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid resume ID format' });
    }

    const resume = await Resume.findOne({ _id: id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to access it',
      });
    }
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createResume = async (req, res) => {
  try {
    const resumeData = { ...req.body };
    delete resumeData._id;
    delete resumeData.id;
    resumeData.userId = req.user._id;

    // Default template and target role if empty
    if (!resumeData.template) resumeData.template = 'classic-ats';
    if (!resumeData.targetRole) resumeData.targetRole = 'Software Developer';

    const resume = await Resume.create(resumeData);
    res.status(201).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;
    delete updateData.userId; // Enforce user isolation - user cannot reassign ownership

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // If client sent a new temporary ID, create a new resume
      const newResume = await Resume.create({ ...updateData, userId: req.user._id });
      return res.status(201).json({ success: true, resume: newResume });
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to update it',
      });
    }

    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid resume ID' });
    }

    const deleted = await Resume.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to delete it',
      });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid resume ID' });
    }

    const target = await Resume.findOne({ _id: id, userId: req.user._id });
    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to duplicate it',
      });
    }

    const targetObj = target.toObject();
    delete targetObj._id;
    delete targetObj.createdAt;
    delete targetObj.updatedAt;
    targetObj.title = `${targetObj.title || 'Resume'} (Copy)`;
    targetObj.resumeTitle = targetObj.title;
    targetObj.userId = req.user._id;

    const duplicated = await Resume.create(targetObj);
    res.status(201).json({ success: true, resume: duplicated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

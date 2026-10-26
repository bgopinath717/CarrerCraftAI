import { Resume } from '../models/Resume.js';
import mongoose from 'mongoose';

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
    let query = { userId: req.user._id };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query._id = id;
    }

    const resume = await Resume.findOne(query);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createResume = async (req, res) => {
  try {
    const resumeData = { ...req.body, userId: req.user._id };
    delete resumeData._id;
    delete resumeData.id;

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
    delete updateData.userId;

    let filter = { userId: req.user._id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter._id = id;
    } else {
      // If it's a client-generated mock ID, try to find by title or create new
      const created = await Resume.create({ ...req.body, userId: req.user._id });
      return res.json({ success: true, resume: created });
    }

    const resume = await Resume.findOneAndUpdate(filter, { $set: updateData }, { new: true });
    if (!resume) {
      // If not found, create as new
      const created = await Resume.create({ ...updateData, userId: req.user._id });
      return res.json({ success: true, resume: created });
    }

    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    let filter = { userId: req.user._id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter._id = id;
    }

    await Resume.findOneAndDelete(filter);
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Resume.findOne({ _id: id, userId: req.user._id });
    if (!target) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const targetObj = target.toObject();
    delete targetObj._id;
    targetObj.title = `${targetObj.title} (Copy)`;

    const duplicated = await Resume.create(targetObj);
    res.status(201).json({ success: true, resume: duplicated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

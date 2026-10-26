import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'MERN Stack Developer Resume',
    },
    template: {
      type: String,
      default: 'classic-ats',
    },
    targetRole: {
      type: String,
      default: 'MERN Stack Developer',
    },
    personalInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    summary: {
      type: String,
      default: '',
    },
    education: {
      type: Array,
      default: [],
    },
    experience: {
      type: Array,
      default: [],
    },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    projects: {
      type: Array,
      default: [],
    },
    certifications: {
      type: Array,
      default: [],
    },
    achievements: {
      type: Array,
      default: [],
    },
    languages: {
      type: Array,
      default: [],
    },
    interests: {
      type: Array,
      default: [],
    },
    atsScore: {
      type: Number,
      default: 85,
    },
    status: {
      type: String,
      enum: ['Draft', 'Completed', 'Reviewing'],
      default: 'Completed',
    },
  },
  {
    timestamps: true,
  }
);

// Format output object so id is string representation of _id or custom id
resumeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const Resume = mongoose.model('Resume', resumeSchema);

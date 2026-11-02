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
      default: 'My Resume',
      trim: true,
    },
    resumeTitle: {
      type: String,
      trim: true,
    },
    template: {
      type: String,
      default: 'classic-ats',
    },
    targetRole: {
      type: String,
      default: 'Software Developer',
    },
    personalInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    personalDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    summary: {
      type: String,
      default: '',
    },
    professionalSummary: {
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
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Completed', 'Reviewing'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

// Keep both field name conventions synchronized
resumeSchema.pre('save', function (next) {
  if (this.title && !this.resumeTitle) {
    this.resumeTitle = this.title;
  } else if (this.resumeTitle && !this.title) {
    this.title = this.resumeTitle;
  }

  if (this.personalInfo && Object.keys(this.personalInfo).length > 0 && (!this.personalDetails || Object.keys(this.personalDetails).length === 0)) {
    this.personalDetails = this.personalInfo;
  } else if (this.personalDetails && Object.keys(this.personalDetails).length > 0 && (!this.personalInfo || Object.keys(this.personalInfo).length === 0)) {
    this.personalInfo = this.personalDetails;
  }

  if (this.summary && !this.professionalSummary) {
    this.professionalSummary = this.summary;
  } else if (this.professionalSummary && !this.summary) {
    this.summary = this.professionalSummary;
  }

  next();
});

resumeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    // Guarantee title and personalInfo are present for client UI
    ret.title = ret.title || ret.resumeTitle || 'My Resume';
    ret.personalInfo = ret.personalInfo || ret.personalDetails || {};
    ret.summary = ret.summary || ret.professionalSummary || '';
    return ret;
  },
});

export const Resume = mongoose.model('Resume', resumeSchema);

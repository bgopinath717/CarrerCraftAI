import mongoose from 'mongoose';

const atsAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
    resumeTitle: {
      type: String,
      default: 'Uploaded Resume',
    },
    targetRole: {
      type: String,
      default: 'Software Developer',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    keywords: {
      type: Array,
      default: [],
    },
    foundKeywords: {
      type: Array,
      default: [],
    },
    missingKeywords: {
      type: Array,
      default: [],
    },
    suggestions: {
      type: Array,
      default: [],
    },
    formattingIssues: {
      type: Array,
      default: [],
    },
    breakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

atsAnalysisSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const ATSAnalysis = mongoose.model('ATSAnalysis', atsAnalysisSchema);

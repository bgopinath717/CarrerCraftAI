import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema(
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
      default: 'Full Stack Developer Cover Letter',
    },
    jobTitle: {
      type: String,
      default: 'MERN Stack Developer',
    },
    companyName: {
      type: String,
      default: 'Tech Innovations Inc.',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    tone: {
      type: String,
      enum: ['Professional', 'Confident', 'Friendly', 'Formal'],
      default: 'Professional',
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

coverLetterSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);

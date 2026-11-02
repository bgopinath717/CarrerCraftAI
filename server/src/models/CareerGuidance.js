import mongoose from 'mongoose';

const careerGuidanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      default: 'Software Developer',
    },
    recommendations: {
      type: Array,
      default: [],
    },
    roadmap: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    skillGap: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

careerGuidanceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const CareerGuidance = mongoose.model('CareerGuidance', careerGuidanceSchema);

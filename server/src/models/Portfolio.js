import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    portfolioTitle: {
      type: String,
      default: 'My Professional Portfolio',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    theme: {
      type: String,
      default: 'tech-dark',
    },
    tagline: {
      type: String,
      default: 'Passionate developer building modern scalable applications.',
    },
    customBio: {
      type: String,
      default: '',
    },
    showContactForm: {
      type: Boolean,
      default: true,
    },
    accentColor: {
      type: String,
      default: '#2196D3',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    personalDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    projects: {
      type: Array,
      default: [],
    },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    experience: {
      type: Array,
      default: [],
    },
    education: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);

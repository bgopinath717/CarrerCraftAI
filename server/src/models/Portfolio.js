import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      default: 'gopinath',
    },
    theme: {
      type: String,
      default: 'tech-dark',
    },
    tagline: {
      type: String,
      default: 'I build modern web applications using MongoDB, Express.js, React.js and Node.js.',
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
      default: '#6366f1',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);

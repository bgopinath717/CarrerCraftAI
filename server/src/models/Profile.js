import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      title: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
    careerInfo: {
      objective: { type: String, default: '' },
      summary: { type: String, default: '' },
      targetRole: { type: String, default: '' },
      careerInterests: { type: [String], default: [] },
    },
    education: {
      type: [
        {
          id: String,
          degree: String,
          institution: String,
          startYear: String,
          endYear: String,
          grade: String,
          description: String,
        },
      ],
      default: [],
    },
    skills: {
      technical: { type: [String], default: [] },
      soft: { type: [String], default: [] },
      tools: { type: [String], default: [] },
      languages: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      databases: { type: [String], default: [] },
    },
    experience: {
      type: [
        {
          id: String,
          company: String,
          position: String,
          startDate: String,
          endDate: String,
          current: Boolean,
          description: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          id: String,
          name: String,
          description: String,
          technologies: [String],
          githubUrl: String,
          liveUrl: String,
          featured: Boolean,
          image: String,
        },
      ],
      default: [],
    },
    certifications: {
      type: [
        {
          id: String,
          name: String,
          issuer: String,
          issueDate: String,
          expiryDate: String,
          credentialId: String,
          credentialUrl: String,
        },
      ],
      default: [],
    },
    achievements: {
      type: [
        {
          id: String,
          title: String,
          description: String,
          date: String,
        },
      ],
      default: [],
    },
    languages: {
      type: [
        {
          name: String,
          proficiency: String,
        },
      ],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const Profile = mongoose.model('Profile', profileSchema);

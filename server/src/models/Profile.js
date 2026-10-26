import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    personalInfo: {
      fullName: { type: String, default: 'B. Gopinath' },
      title: { type: String, default: 'MERN Stack Developer' },
      email: { type: String, default: 'gopinath.mern@example.com' },
      phone: { type: String, default: '+91 98765 43210' },
      location: { type: String, default: 'Chennai, Tamil Nadu, India' },
      linkedin: { type: String, default: 'https://linkedin.com/in/gopinath-mern' },
      github: { type: String, default: 'https://github.com/gopinath-dev' },
      website: { type: String, default: 'https://careercraft-ai.dev/portfolio/gopinath' },
      avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
    },
    careerInfo: {
      objective: { type: String, default: '' },
      summary: { type: String, default: '' },
      targetRole: { type: String, default: 'MERN Stack Developer' },
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

export const Profile = mongoose.model('Profile', profileSchema);

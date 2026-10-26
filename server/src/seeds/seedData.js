import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Resume } from '../models/Resume.js';
import { Portfolio } from '../models/Portfolio.js';
import { CoverLetter } from '../models/CoverLetter.js';

dotenv.config();

const sampleUserData = {
  personalInfo: {
    fullName: "B. Gopinath",
    title: "MERN Stack Developer",
    email: "gopinath.mern@example.com",
    phone: "+91 98765 43210",
    location: "Chennai, Tamil Nadu, India",
    linkedin: "https://linkedin.com/in/gopinath-mern",
    github: "https://github.com/gopinath-dev",
    website: "https://careercraft-ai.dev/portfolio/gopinath",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  careerInfo: {
    objective: "Passionate and detail-oriented MERN Stack Developer seeking an entry-level software engineering role to leverage proficiency in React.js, Node.js, Express.js, and MongoDB in building scalable web applications.",
    summary: "Dedicated MERN Stack Developer with hands-on experience building full-stack responsive web applications, RESTful APIs, and JWT-authenticated systems. Proficient in React.js, Node.js, Express, MongoDB, JavaScript (ES6+), and modern UI frameworks. Strong foundation in software design, problem-solving, and building high-performance web solutions.",
    targetRole: "MERN Stack Developer",
    careerInterests: ["Full Stack Development", "Cloud Architecture", "System Design", "AI Integration", "Modern Web Platforms"],
  },
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      institution: "Anna University Affiliated Engineering College",
      startYear: "2021",
      endYear: "2025",
      grade: "8.6 CGPA",
      description: "Relevant Coursework: Data Structures & Algorithms, Database Management Systems, Object-Oriented Programming, Web Technologies, Computer Networks."
    },
    {
      id: "edu-2",
      degree: "Higher Secondary Certificate (HSC) - Computer Science",
      institution: "Government Higher Secondary School",
      startYear: "2019",
      endYear: "2021",
      grade: "92%",
      description: "Major in Mathematics, Physics, Chemistry, and Computer Science."
    }
  ],
  skills: {
    technical: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript (ES6+)", "RESTful APIs", "HTML5", "CSS3", "JSON Web Tokens (JWT)", "Redux Toolkit", "Git & GitHub", "Tailwind CSS"],
    soft: ["Problem Solving", "Team Collaboration", "Agile Methodologies", "Communication", "Time Management", "Analytical Thinking"],
    tools: ["VS Code", "Postman", "Git", "MongoDB Compass", "Vite", "Figma", "npm"],
    languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
    frameworks: ["React.js", "Express.js", "Tailwind CSS", "Bootstrap"],
    databases: ["MongoDB", "MySQL", "PostgreSQL", "Redis"]
  },
  experience: [
    {
      id: "exp-1",
      company: "CodeCraft Technologies",
      position: "MERN Stack Developer Intern",
      startDate: "June 2024",
      endDate: "August 2024",
      current: false,
      description: "• Engineered 5+ responsive React frontend components and integrated with RESTful Express micro-endpoints.\n• Designed and optimized MongoDB aggregation pipelines, boosting query execution performance by 25%.\n• Implemented secure JWT authentication and role-based access control (RBAC) across internal portals."
    },
    {
      id: "exp-2",
      company: "Open Source Contributor",
      position: "Web Developer Contributor",
      startDate: "January 2024",
      endDate: "Present",
      current: true,
      description: "• Contributed feature enhancements and bug fixes to popular open-source React and Node.js repositories.\n• Collaborated with global developer communities to review pull requests, write technical documentation, and adhere to CI/CD pipelines."
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "CareerCraft AI Platform",
      description: "Full-stack SaaS application for ATS-friendly resume generation, automated keyword scoring, cover letter creation, and AI career guidance with modern responsive dashboard.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT", "REST APIs"],
      githubUrl: "https://github.com/gopinath-dev/careercraft-ai",
      liveUrl: "https://careercraft-ai.dev",
      featured: true,
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "proj-2",
      name: "E-Commerce Web Application",
      description: "Scalable multi-vendor e-commerce platform with product filtering, shopping cart state management, Stripe payment gateway, and administrative sales dashboard.",
      technologies: ["React.js", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Stripe API"],
      githubUrl: "https://github.com/gopinath-dev/ecommerce-platform",
      liveUrl: "https://mern-shop-demo.vercel.app",
      featured: true,
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "proj-3",
      name: "Student Management System",
      description: "University student records management system featuring course enrollments, attendance tracking, grade calculations, and automated report generation.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Chart.js"],
      githubUrl: "https://github.com/gopinath-dev/student-management",
      liveUrl: "https://student-portal-demo.vercel.app",
      featured: false,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Full Stack Web Development with MERN",
      issuer: "Udemy / Angela Yu",
      issueDate: "July 2024",
      expiryDate: "Lifetime",
      credentialId: "UC-MERN-2024-9912",
      credentialUrl: "https://udemy.com/certificate/UC-MERN-2024-9912"
    },
    {
      id: "cert-2",
      name: "Node.js, Express, MongoDB & More: The Complete Bootcamp",
      issuer: "Jonas Schmedtmann Academy",
      issueDate: "May 2024",
      expiryDate: "Lifetime",
      credentialId: "JS-NODE-88231",
      credentialUrl: "https://udemy.com/certificate/JS-NODE-88231"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Place Winner - Inter-College Hackathon 2024",
      description: "Built an AI-driven student career assistant within 24 hours, recognized for best system design and responsive user interface.",
      date: "September 2024"
    },
    {
      id: "ach-2",
      title: "Top 5% Rank - LeetCode JavaScript Challenge",
      description: "Solved 250+ data structures & algorithm problems in JavaScript.",
      date: "August 2024"
    }
  ],
  languages: [
    { name: "English", proficiency: "Professional Working Proficiency" },
    { name: "Tamil", proficiency: "Native / Bilingual" }
  ],
  interests: ["Open Source Development", "UI/UX Micro-Interactions", "Distributed Databases", "Chess", "Tech Blogging"]
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careercraft_ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB at', mongoUri);

    // 1. Upsert Demo User
    let user = await User.findOne({ email: 'gopinath.mern@example.com' });
    if (!user) {
      user = await User.create({
        name: 'B. Gopinath',
        email: 'gopinath.mern@example.com',
        password: 'password123',
        role: 'MERN Stack Developer',
      });
      console.log('[Seed] Created User:', user.name, user.email);
    } else {
      console.log('[Seed] Found existing User:', user.name, user.email);
    }

    // 2. Upsert Profile
    await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          personalInfo: sampleUserData.personalInfo,
          careerInfo: sampleUserData.careerInfo,
          education: sampleUserData.education,
          skills: sampleUserData.skills,
          experience: sampleUserData.experience,
          projects: sampleUserData.projects,
          certifications: sampleUserData.certifications,
          achievements: sampleUserData.achievements,
          languages: sampleUserData.languages,
          interests: sampleUserData.interests,
        },
      },
      { upsert: true, new: true }
    );
    console.log('[Seed] Profile created/updated successfully');

    // 3. Upsert Portfolio Settings
    await Portfolio.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          slug: 'gopinath',
          theme: 'tech-dark',
          tagline: 'I build modern web applications using MongoDB, Express.js, React.js and Node.js.',
          customBio: sampleUserData.careerInfo.summary,
          showContactForm: true,
          accentColor: '#6366f1',
          isPublic: true,
        },
      },
      { upsert: true, new: true }
    );
    console.log('[Seed] Portfolio created/updated for slug: /portfolio/gopinath');

    // 4. Create default Resume if none exists
    const existingResumes = await Resume.find({ userId: user._id });
    if (existingResumes.length === 0) {
      await Resume.create({
        userId: user._id,
        title: 'MERN Stack Developer Resume',
        template: 'modern',
        targetRole: 'MERN Stack Developer',
        personalInfo: sampleUserData.personalInfo,
        summary: sampleUserData.careerInfo.summary,
        education: sampleUserData.education,
        experience: sampleUserData.experience,
        skills: sampleUserData.skills,
        projects: sampleUserData.projects,
        certifications: sampleUserData.certifications,
        achievements: sampleUserData.achievements,
        languages: sampleUserData.languages,
        interests: sampleUserData.interests,
        atsScore: 88,
        status: 'Completed',
      });
      console.log('[Seed] Created default ATS Resume');
    }

    // 5. Create default Cover Letter if none exists
    const existingCoverLetters = await CoverLetter.find({ userId: user._id });
    if (existingCoverLetters.length === 0) {
      await CoverLetter.create({
        userId: user._id,
        title: 'Full Stack Developer Cover Letter',
        jobTitle: 'MERN Stack Developer',
        companyName: 'Tech Innovations Inc.',
        jobDescription: 'Looking for a MERN Stack Developer proficient in React, Node.js, Express, MongoDB and REST APIs.',
        tone: 'Professional',
        content: `Dear Hiring Team,\n\nI am writing to express my enthusiastic interest in the MERN Stack Developer position at Tech Innovations Inc. With strong practical experience in React.js, Node.js, Express.js, and MongoDB, alongside a proven track record of building production-grade full-stack web platforms such as CareerCraft AI, I am eager to contribute effectively to your engineering initiatives.\n\nSincerely,\nB. Gopinath`,
      });
      console.log('[Seed] Created default Cover Letter');
    }

    console.log('✅ [Seed Completed Successfully]');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Error]:', error);
    process.exit(1);
  }
};

seed();

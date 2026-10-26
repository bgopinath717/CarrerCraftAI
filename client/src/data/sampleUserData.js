// Default realistic sample data for B. Gopinath (MERN Stack Developer)

export const sampleUserData = {
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
      name: "Meta Front-End Developer Professional Certificate",
      organization: "Meta / Coursera",
      date: "2024",
      url: "https://coursera.org/verify/professional-cert/DEMO123"
    },
    {
      id: "cert-2",
      name: "Full Stack Web Development with Node.js & MongoDB",
      organization: "freeCodeCamp",
      date: "2023",
      url: "https://freecodecamp.org/certification/gopinath/back-end-development-and-apis"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Place - Smart India Internal Hackathon 2024",
      description: "Developed an AI-driven student career roadmap portal within a 36-hour continuous hackathon."
    },
    {
      id: "ach-2",
      title: "Solved 350+ Problems on LeetCode & GeeksforGeeks",
      description: "Consistently practiced Data Structures & Algorithms, achieving a 50-day streak in JavaScript & Java problem solving."
    }
  ],
  languages: [
    { name: "English", proficiency: "Professional Working Proficiency" },
    { name: "Tamil", proficiency: "Native / Bilingual" }
  ],
  interests: ["Cloud Computing", "AI & Machine Learning", "Open Source", "UI/UX Design", "Competitive Programming"],
  portfolioSettings: {
    slug: "gopinath",
    theme: "tech-dark",
    isPublished: true,
    tagline: "Building scalable full-stack web experiences with MongoDB, Express.js, React.js, and Node.js.",
    customBio: "Hello! I'm B. Gopinath, a passionate MERN Stack Developer who loves crafting robust web applications with modern architecture, clean UI, and scalable backend services."
  }
};

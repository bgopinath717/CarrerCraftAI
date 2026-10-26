// Comprehensive Career Roles Dataset for CareerCraft AI
// Verified IT career benchmarks with multi-regional salary ranges and market growth outlooks.

export const CAREER_ROLES = [
  {
    id: "mern-developer",
    title: "Full Stack MERN Developer",
    category: "Full Stack Web",
    domain: "Full Stack",
    description: "Architects and maintains end-to-end web applications utilizing MongoDB, Express.js, React.js, and Node.js with RESTful APIs and modern cloud architectures.",
    experienceLevel: "Entry-Level / Junior",
    entryLevelEligible: true,
    minYearsExp: 0,
    remoteFriendly: true,
    requiredSkills: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript (ES6+)",
      "RESTful APIs",
      "Git & GitHub",
      "HTML5 & CSS3",
      "JWT Authentication"
    ],
    recommendedSkills: [
      "Redux Toolkit",
      "TypeScript",
      "Tailwind CSS",
      "Docker",
      "Next.js",
      "Redis",
      "AWS (EC2/S3)",
      "Jest"
    ],
    preferredSkills: [
      "GraphQL",
      "CI/CD Pipelines",
      "Microservices",
      "Mongoose Schema Indexing"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 6,
        max: 18,
        formatted: "₹6 - ₹18 LPA",
        source: "NASSCOM IT Workforce & Tech Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 75000,
        max: 130000,
        formatted: "$75,000 - $130,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 42000,
        max: 78000,
        formatted: "£42,000 - £78,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 48000,
        max: 85000,
        formatted: "€48,000 - €85,000 /yr",
        source: "Eurostat & Honeypot Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 70000,
        max: 125000,
        formatted: "$70,000 - $125,000 /yr",
        source: "Global Remote Tech Talent Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+22%",
      label: "Very High Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics & NASSCOM",
      details: "Strong enterprise demand driven by rapid cloud migration, microservices, and reactive single-page SaaS architectures."
    },
    certificationsRecommended: [
      "Meta Front-End Developer Professional Certificate",
      "MongoDB Certified Developer Associate",
      "AWS Certified Developer - Associate"
    ],
    coursesRecommended: [
      { title: "Full Stack Open: Deep Dive into Modern Web Development", provider: "University of Helsinki" },
      { title: "Node.js, Express & MongoDB Bootcamp", provider: "Coursera / Udemy" },
      { title: "Epic React with Kent C. Dodds", provider: "EpicReact.dev" }
    ],
    milestones: [
      {
        id: "mern-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (Foundations & Core Gaps)",
        objective: "Solidify JavaScript ES6+, asynchronous programming, and RESTful CRUD API mechanics.",
        tasks: [
          { id: "mern-t1", title: "Master JavaScript ES6+ (Async/Await, Closures, Event Loop, Destructuring)", priority: "Critical", estimatedHours: 12, completed: false },
          { id: "mern-t2", title: "Build robust Express.js REST API with middleware & error handling", priority: "Critical", estimatedHours: 10, completed: false },
          { id: "mern-t3", title: "Design MongoDB schemas with Mongoose and compound index optimization", priority: "Critical", estimatedHours: 8, completed: false },
          { id: "mern-t4", title: "Implement secure JWT authentication and password hashing (Bcrypt)", priority: "Critical", estimatedHours: 8, completed: false }
        ],
        projectDeliverable: "Full-Stack Task & Note Management API with JWT Auth and MongoDB persistence."
      },
      {
        id: "mern-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (Client-Side State & Microservices)",
        objective: "Build high-performance React UI with global state management and Tailwind CSS styling.",
        tasks: [
          { id: "mern-t5", title: "Implement React 19 / Redux Toolkit or Zustand for scalable client state", priority: "Important", estimatedHours: 14, completed: false },
          { id: "mern-t6", title: "Integrate TypeScript for type-safe frontend and backend contracts", priority: "Important", estimatedHours: 12, completed: false },
          { id: "mern-t7", title: "Build responsive, accessible interfaces with Tailwind CSS & Lucide Icons", priority: "Important", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Interactive E-Commerce / SaaS Dashboard with live cart, filters, and payment checkout simulation."
      },
      {
        id: "mern-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Production Scale, Testing & Cloud)",
        objective: "Containerize services, implement Redis caching, and deploy to cloud with CI/CD.",
        tasks: [
          { id: "mern-t8", title: "Containerize multi-container MERN application with Docker and Docker Compose", priority: "Recommended", estimatedHours: 12, completed: false },
          { id: "mern-t9", title: "Configure Redis caching for frequent database query endpoints", priority: "Recommended", estimatedHours: 8, completed: false },
          { id: "mern-t10", title: "Deploy to AWS (EC2/S3) or Render with GitHub Actions CI/CD pipeline", priority: "Recommended", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Production-ready Full-Stack SaaS deployed on AWS with automated CI/CD and Redis caching."
      }
    ]
  },
  {
    id: "frontend-developer",
    title: "Frontend Engineer / React Developer",
    category: "Frontend Web",
    domain: "Frontend",
    description: "Specializes in building responsive, accessible, high-performance web interfaces with exceptional UI/UX and client-side architecture.",
    experienceLevel: "Entry-Level / Junior",
    entryLevelEligible: true,
    minYearsExp: 0,
    remoteFriendly: true,
    requiredSkills: [
      "React.js",
      "JavaScript (ES6+)",
      "HTML5 & CSS3",
      "Tailwind CSS",
      "Responsive Design",
      "Git & GitHub",
      "RESTful APIs"
    ],
    recommendedSkills: [
      "TypeScript",
      "Next.js",
      "Redux Toolkit",
      "Web Performance (Core Web Vitals)",
      "Jest & React Testing Library",
      "Figma to Code"
    ],
    preferredSkills: [
      "Web Accessibility (a11y)",
      "GraphQL",
      "Storybook",
      "Micro-Frontends"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 5.5,
        max: 16,
        formatted: "₹5.5 - ₹16 LPA",
        source: "NASSCOM IT Workforce Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 70000,
        max: 125000,
        formatted: "$70,000 - $125,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 40000,
        max: 72000,
        formatted: "£40,000 - £72,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 45000,
        max: 80000,
        formatted: "€45,000 - €80,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 68000,
        max: 120000,
        formatted: "$68,000 - $120,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+19%",
      label: "High Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics",
      details: "High continuous demand for digital experiences, web apps, and design system engineering."
    },
    certificationsRecommended: [
      "Meta Front-End Developer Certificate",
      "W3Cx Front-End Web Developer Professional"
    ],
    coursesRecommended: [
      { title: "Advanced React and Component Design", provider: "Frontend Masters" },
      { title: "Testing JavaScript with Kent C. Dodds", provider: "TestingJavaScript.com" }
    ],
    milestones: [
      {
        id: "fe-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (Component Architecture)",
        objective: "Deep-dive into React lifecycle, hooks, and responsive Tailwind styling.",
        tasks: [
          { id: "fe-t1", title: "Master custom React hooks (useCallback, useMemo, custom hooks)", priority: "Critical", estimatedHours: 10, completed: false },
          { id: "fe-t2", title: "Implement semantic HTML5 and WCAG 2.1 accessibility standards", priority: "Critical", estimatedHours: 8, completed: false },
          { id: "fe-t3", title: "Build responsive layouts using CSS Grid, Flexbox and Tailwind CSS", priority: "Critical", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Accessible, keyboard-navigable Component Design System in React."
      },
      {
        id: "fe-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (TypeScript & State Management)",
        objective: "Adopt TypeScript for component props, types, and robust async state handling.",
        tasks: [
          { id: "fe-t4", title: "Refactor React components with strict TypeScript types and generics", priority: "Important", estimatedHours: 12, completed: false },
          { id: "fe-t5", title: "Implement optimistic UI updates and TanStack React Query caching", priority: "Important", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Real-time Crypto / Stock Analytics Dashboard with live graphs and TypeScript."
      },
      {
        id: "fe-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Next.js & Performance)",
        objective: "Master Next.js App Router, SSR, and Core Web Vitals optimization.",
        tasks: [
          { id: "fe-t6", title: "Build SEO-optimized multi-page application with Next.js App Router", priority: "Recommended", estimatedHours: 14, completed: false },
          { id: "fe-t7", title: "Audit and achieve 95+ Google Lighthouse scores across desktop and mobile", priority: "Recommended", estimatedHours: 8, completed: false }
        ],
        projectDeliverable: "High-performance Server-Rendered Content Platform with 98+ Lighthouse score."
      }
    ]
  },
  {
    id: "backend-developer",
    title: "Backend Engineer (Node.js & Express)",
    category: "Backend Systems",
    domain: "Backend",
    description: "Focuses on building scalable API microservices, distributed server logic, database query optimizations, and secure authentication.",
    experienceLevel: "Entry-Level / Junior",
    entryLevelEligible: true,
    minYearsExp: 0,
    remoteFriendly: true,
    requiredSkills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "SQL",
      "RESTful APIs",
      "JWT Authentication",
      "Git & GitHub"
    ],
    recommendedSkills: [
      "PostgreSQL",
      "Redis",
      "Docker",
      "System Design",
      "TypeScript",
      "API Security & Rate Limiting",
      "Microservices"
    ],
    preferredSkills: [
      "Kafka / RabbitMQ",
      "AWS Lambda & S3",
      "GraphQL",
      "Database Profiling"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 6.5,
        max: 20,
        formatted: "₹6.5 - ₹20 LPA",
        source: "NASSCOM IT Workforce Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 80000,
        max: 140000,
        formatted: "$80,000 - $140,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 45000,
        max: 82000,
        formatted: "£45,000 - £82,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 50000,
        max: 88000,
        formatted: "€50,000 - €88,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 75000,
        max: 135000,
        formatted: "$75,000 - $135,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+21%",
      label: "Very High Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics",
      details: "Rising enterprise reliance on cloud-native APIs, data synchronization, and secure backend microservices."
    },
    certificationsRecommended: [
      "Node.js Application Developer (JSNAD) - Linux Foundation",
      "MongoDB Certified Developer Associate"
    ],
    coursesRecommended: [
      { title: "Node.js Microservices: Clean Architecture", provider: "Udemy" },
      { title: "Designing Data-Intensive Applications Study", provider: "O'Reilly" }
    ],
    milestones: [
      {
        id: "be-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (API Architecture & Security)",
        objective: "Build resilient REST services with role-based access control and validation.",
        tasks: [
          { id: "be-t1", title: "Build modular Express.js routers with Zod/Joi request validation", priority: "Critical", estimatedHours: 10, completed: false },
          { id: "be-t2", title: "Implement RBAC (Role-Based Access Control) with JWT tokens and refresh cycles", priority: "Critical", estimatedHours: 12, completed: false }
        ],
        projectDeliverable: "Enterprise Authentication & Multi-Tenant User Management Microservice."
      },
      {
        id: "be-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (Database Modeling & Caching)",
        objective: "Design scalable MongoDB aggregation pipelines and PostgreSQL relational schemas.",
        tasks: [
          { id: "be-t3", title: "Write complex MongoDB $lookup, $group, and $unwind aggregations", priority: "Important", estimatedHours: 12, completed: false },
          { id: "be-t4", title: "Set up Redis caching layer with invalidation strategies", priority: "Important", estimatedHours: 8, completed: false }
        ],
        projectDeliverable: "High-Throughput Analytics Ingestion Pipeline with Redis caching."
      },
      {
        id: "be-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Docker, Queues & System Design)",
        objective: "Containerize APIs and integrate message queues for async tasks.",
        tasks: [
          { id: "be-t5", title: "Implement BullMQ / RabbitMQ background worker for email & PDF generation", priority: "Recommended", estimatedHours: 10, completed: false },
          { id: "be-t6", title: "Containerize with multi-stage Dockerfile and docker-compose", priority: "Recommended", estimatedHours: 8, completed: false }
        ],
        projectDeliverable: "Scalable Event-Driven Background Processing System in Docker."
      }
    ]
  },
  {
    id: "fullstack-developer",
    title: "Full Stack Software Engineer",
    category: "Full Stack Web",
    domain: "Full Stack",
    description: "Versatile engineer capable of handling database architecture, business logic, client interface, and cloud infrastructure.",
    experienceLevel: "Mid-Level",
    entryLevelEligible: true,
    minYearsExp: 1,
    remoteFriendly: true,
    requiredSkills: [
      "JavaScript (ES6+)",
      "React.js",
      "Node.js",
      "Express.js",
      "SQL",
      "MongoDB",
      "RESTful APIs",
      "Git & GitHub"
    ],
    recommendedSkills: [
      "TypeScript",
      "Docker",
      "Tailwind CSS",
      "Next.js",
      "AWS (EC2/S3)",
      "System Design",
      "Unit & Integration Testing"
    ],
    preferredSkills: [
      "CI/CD Workflows",
      "Microservices",
      "PostgreSQL",
      "Kubernetes"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 7,
        max: 22,
        formatted: "₹7 - ₹22 LPA",
        source: "NASSCOM IT Workforce Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 82000,
        max: 145000,
        formatted: "$82,000 - $145,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 46000,
        max: 85000,
        formatted: "£46,000 - £85,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 52000,
        max: 92000,
        formatted: "€52,000 - €92,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 78000,
        max: 138000,
        formatted: "$78,000 - $138,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+25%",
      label: "Extremely High Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics",
      details: "Premier role in high demand at startups, scale-ups, and global tech enterprises for versatile end-to-end delivery."
    },
    certificationsRecommended: [
      "AWS Certified Solutions Architect - Associate",
      "Meta Full-Stack Engineer Certificate"
    ],
    coursesRecommended: [
      { title: "System Design for Software Engineers", provider: "Educative.io" },
      { title: "Full Stack TypeScript Mastery", provider: "Frontend Masters" }
    ],
    milestones: [
      {
        id: "fs-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (End-to-End TypeScript)",
        objective: "Unify frontend and backend under shared TypeScript interfaces.",
        tasks: [
          { id: "fs-t1", title: "Set up TypeScript monorepo with shared types between client and server", priority: "Critical", estimatedHours: 12, completed: false },
          { id: "fs-t2", title: "Implement relational SQL schemas alongside MongoDB document storage", priority: "Critical", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Full-Stack TypeScript Monorepo with dual database support."
      },
      {
        id: "fs-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (Architectural Patterns)",
        objective: "Implement Clean Architecture, repository patterns, and end-to-end automated tests.",
        tasks: [
          { id: "fs-t3", title: "Automate API tests with Jest & Supertest and UI tests with Playwright", priority: "Important", estimatedHours: 12, completed: false },
          { id: "fs-t4", title: "Implement rate limiting, helmet security headers, and CORS whitelist", priority: "Important", estimatedHours: 6, completed: false }
        ],
        projectDeliverable: "Secure, fully tested multi-user SaaS platform."
      },
      {
        id: "fs-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Cloud Deployment & CI/CD)",
        objective: "Deploy full stack to AWS with containerized CI/CD workflow.",
        tasks: [
          { id: "fs-t5", title: "Configure GitHub Actions pipeline for automated testing and deployment", priority: "Recommended", estimatedHours: 8, completed: false },
          { id: "fs-t6", title: "Deploy backend on AWS ECS/EC2 and frontend on Vercel/CloudFront", priority: "Recommended", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Live Cloud-Hosted Production Application with automated CI/CD pipeline."
      }
    ]
  },
  {
    id: "devops-engineer",
    title: "Cloud & DevOps Engineer",
    category: "Infrastructure & Cloud",
    domain: "Cloud & DevOps",
    description: "Automates CI/CD deployment pipelines, provisions Infrastructure as Code (IaC), and manages cloud container clusters.",
    experienceLevel: "Mid-Level",
    entryLevelEligible: false,
    minYearsExp: 1,
    remoteFriendly: true,
    requiredSkills: [
      "Linux",
      "Git & GitHub",
      "Docker",
      "CI/CD Pipelines",
      "AWS (Amazon Web Services)",
      "Bash / Shell Scripting"
    ],
    recommendedSkills: [
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "Prometheus & Grafana",
      "Networking & DNS",
      "Python"
    ],
    preferredSkills: [
      "Ansible",
      "Helm",
      "Security & DevSecOps",
      "ArgoCD"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 8,
        max: 25,
        formatted: "₹8 - ₹25 LPA",
        source: "NASSCOM IT Workforce Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 90000,
        max: 155000,
        formatted: "$90,000 - $155,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 50000,
        max: 92000,
        formatted: "£50,000 - £92,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 55000,
        max: 98000,
        formatted: "€55,000 - €98,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 85000,
        max: 150000,
        formatted: "$85,000 - $150,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+28%",
      label: "Explosive Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics",
      details: "Top growth sector driven by universal adoption of cloud-native infrastructure, Kubernetes, and automated release cycles."
    },
    certificationsRecommended: [
      "AWS Certified Solutions Architect - Associate",
      "Certified Kubernetes Administrator (CKA)",
      "HashiCorp Certified: Terraform Associate"
    ],
    coursesRecommended: [
      { title: "Docker & Kubernetes: The Complete Guide", provider: "Udemy" },
      { title: "Terraform on AWS with IaC", provider: "Coursera" }
    ],
    milestones: [
      {
        id: "do-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (Linux & Containers)",
        objective: "Master Linux system administration and multi-container Docker environments.",
        tasks: [
          { id: "do-t1", title: "Master Linux terminal, bash scripting, file permissions, and systemd", priority: "Critical", estimatedHours: 12, completed: false },
          { id: "do-t2", title: "Build optimized multi-stage Dockerfiles and docker-compose configurations", priority: "Critical", estimatedHours: 12, completed: false }
        ],
        projectDeliverable: "Automated Bash Environment Provisioner and Multi-Container Docker Stack."
      },
      {
        id: "do-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (CI/CD & Cloud Infrastructure)",
        objective: "Build GitHub Actions CI/CD workflows and deploy to AWS.",
        tasks: [
          { id: "do-t3", title: "Create GitHub Actions pipelines for automated linting, test, and container build", priority: "Important", estimatedHours: 10, completed: false },
          { id: "do-t4", title: "Deploy scalable application to AWS EC2 with Nginx reverse proxy and SSL", priority: "Important", estimatedHours: 12, completed: false }
        ],
        projectDeliverable: "Zero-Downtime Automated CI/CD Pipeline deploying to AWS."
      },
      {
        id: "do-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Kubernetes & Terraform)",
        objective: "Orchestrate containers with Kubernetes and provision infrastructure with Terraform.",
        tasks: [
          { id: "do-t5", title: "Write Terraform IaC scripts to provision AWS VPC, subnets, and EC2 instances", priority: "Recommended", estimatedHours: 14, completed: false },
          { id: "do-t6", title: "Deploy Kubernetes pods, services, ingress controllers, and auto-scaling", priority: "Recommended", estimatedHours: 16, completed: false }
        ],
        projectDeliverable: "Fully automated Terraform-provisioned Kubernetes cluster with Prometheus monitoring."
      }
    ]
  },
  {
    id: "data-analyst",
    title: "Data Analyst / BI Specialist",
    category: "Data & AI",
    domain: "Data & AI",
    description: "Analyzes business metrics, extracts insights from structured datasets, models queries with SQL, and designs visual executive dashboards.",
    experienceLevel: "Entry-Level / Junior",
    entryLevelEligible: true,
    minYearsExp: 0,
    remoteFriendly: true,
    requiredSkills: [
      "SQL",
      "Python",
      "Data Visualization",
      "Excel",
      "Git & GitHub"
    ],
    recommendedSkills: [
      "Tableau",
      "Power BI",
      "Pandas & NumPy",
      "Exploratory Data Analysis (EDA)",
      "Statistics",
      "ETL Pipelines"
    ],
    preferredSkills: [
      "PostgreSQL",
      "A/B Testing",
      "Data Warehousing",
      "Google BigQuery"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 5,
        max: 15,
        formatted: "₹5 - ₹15 LPA",
        source: "NASSCOM IT Workforce Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 68000,
        max: 115000,
        formatted: "$68,000 - $115,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 38000,
        max: 68000,
        formatted: "£38,000 - £68,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 44000,
        max: 75000,
        formatted: "€44,000 - €75,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 65000,
        max: 110000,
        formatted: "$65,000 - $110,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+23%",
      label: "Very High Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics",
      details: "Continuous surge in demand as companies prioritize data-driven product decisions and executive business intelligence."
    },
    certificationsRecommended: [
      "Google Data Analytics Professional Certificate",
      "Microsoft Power BI Data Analyst Associate (PL-300)"
    ],
    coursesRecommended: [
      { title: "Applied Data Science with Python Specialization", provider: "University of Michigan / Coursera" },
      { title: "Advanced SQL for Data Scientists", provider: "Mode Analytics" }
    ],
    milestones: [
      {
        id: "da-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (Advanced SQL & Relational Analysis)",
        objective: "Master complex SQL window functions, CTEs, and relational joins.",
        tasks: [
          { id: "da-t1", title: "Master SQL window functions (ROW_NUMBER, RANK, LAG/LEAD)", priority: "Critical", estimatedHours: 12, completed: false },
          { id: "da-t2", title: "Clean and transform raw data using Python (Pandas dataframes)", priority: "Critical", estimatedHours: 12, completed: false }
        ],
        projectDeliverable: "Customer Cohort Retention & Churn Analysis using SQL and Pandas."
      },
      {
        id: "da-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (Interactive Dashboards)",
        objective: "Build interactive visual reports in Power BI or Tableau with dynamic drill-downs.",
        tasks: [
          { id: "da-t3", title: "Design interactive Power BI / Tableau dashboard with KPI cards and filters", priority: "Important", estimatedHours: 10, completed: false },
          { id: "da-t4", title: "Perform exploratory statistical analysis (correlation, distribution tests)", priority: "Important", estimatedHours: 8, completed: false }
        ],
        projectDeliverable: "Executive Sales & Revenue KPI Dashboard with live parameter filters."
      },
      {
        id: "da-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Automated ETL & Cloud)",
        objective: "Automate reporting pipelines using Python and cloud database connections.",
        tasks: [
          { id: "da-t5", title: "Build scheduled Python script to extract, transform, and load data to PostgreSQL", priority: "Recommended", estimatedHours: 10, completed: false },
          { id: "da-t6", title: "Present actionable business findings with clear narrative storytelling", priority: "Recommended", estimatedHours: 6, completed: false }
        ],
        projectDeliverable: "End-to-End Automated Business Intelligence ETL & Reporting System."
      }
    ]
  },
  {
    id: "ai-engineer",
    title: "AI & LLM Application Engineer",
    category: "Data & AI",
    domain: "Data & AI",
    description: "Develops production Generative AI applications, integrates large language models, designs vector database RAG architectures, and builds agentic workflows.",
    experienceLevel: "Mid-Level",
    entryLevelEligible: false,
    minYearsExp: 1,
    remoteFriendly: true,
    requiredSkills: [
      "Python",
      "JavaScript (ES6+)",
      "RESTful APIs",
      "Git & GitHub",
      "Prompt Engineering"
    ],
    recommendedSkills: [
      "LangChain",
      "Vector Databases (Pinecone/Chroma)",
      "OpenAI / Gemini API Integration",
      "RAG (Retrieval-Augmented Generation)",
      "Docker",
      "FastAPI"
    ],
    preferredSkills: [
      "PyTorch",
      "Fine-Tuning",
      "LlamaIndex",
      "Agentic Frameworks",
      "Model Evaluation"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 9,
        max: 28,
        formatted: "₹9 - ₹28 LPA",
        source: "NASSCOM AI Talent Report",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 105000,
        max: 175000,
        formatted: "$105,000 - $175,000 /yr",
        source: "U.S. Bureau of Labor Statistics & AI Tech Survey",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 55000,
        max: 105000,
        formatted: "£55,000 - £105,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 62000,
        max: 110000,
        formatted: "€62,000 - €110,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 95000,
        max: 165000,
        formatted: "$95,000 - $165,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+36%",
      label: "Hyper-Growth",
      period: "2024-2032",
      source: "Gartner & World Economic Forum Tech Report",
      details: "Fastest growing technology discipline globally, driven by enterprise adoption of custom AI assistants, automated copilots, and multi-agent systems."
    },
    certificationsRecommended: [
      "DeepLearning.AI LangChain & Generative AI Certificate",
      "AWS Certified Machine Learning - Specialty"
    ],
    coursesRecommended: [
      { title: "Generative AI with Large Language Models", provider: "DeepLearning.AI / Coursera" },
      { title: "Building Applications with Vector Databases", provider: "DeepLearning.AI" }
    ],
    milestones: [
      {
        id: "ai-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (LLM APIs & Prompt Architecture)",
        objective: "Integrate modern LLM APIs (Gemini, Claude, OpenAI) with structured schema validation.",
        tasks: [
          { id: "ai-t1", title: "Master structured output generation (JSON mode, function calling) with Gemini and OpenAI APIs", priority: "Critical", estimatedHours: 12, completed: false },
          { id: "ai-t2", title: "Implement token management, rate limit backoff, and streaming responses (SSE)", priority: "Critical", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Interactive AI Content Assistant with streaming responses and JSON extraction."
      },
      {
        id: "ai-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (RAG & Vector Embeddings)",
        objective: "Build Retrieval-Augmented Generation (RAG) systems over private knowledge bases.",
        tasks: [
          { id: "ai-t3", title: "Generate text embeddings and store in Pinecone / Chroma vector database", priority: "Important", estimatedHours: 14, completed: false },
          { id: "ai-t4", title: "Implement chunking strategies, hybrid search, and semantic similarity reranking", priority: "Important", estimatedHours: 12, completed: false }
        ],
        projectDeliverable: "Private Document Q&A RAG System with source citation and hallucination checks."
      },
      {
        id: "ai-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Multi-Agent Systems & Production)",
        objective: "Deploy autonomous tool-calling agents with observability and guardrails.",
        tasks: [
          { id: "ai-t5", title: "Build multi-step agentic workflows with LangGraph / CrewAI", priority: "Recommended", estimatedHours: 16, completed: false },
          { id: "ai-t6", title: "Deploy FastAPI backend in Docker with LLM evaluation benchmarks", priority: "Recommended", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Autonomous Multi-Agent Market Research & Synthesis Copilot deployed in Docker."
      }
    ]
  },
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer / SDET",
    category: "Quality Assurance",
    domain: "Quality Assurance",
    description: "Designs automated end-to-end and API testing suites, integrates quality gates into CI/CD pipelines, and ensures platform reliability.",
    experienceLevel: "Entry-Level / Junior",
    entryLevelEligible: true,
    minYearsExp: 0,
    remoteFriendly: true,
    requiredSkills: [
      "JavaScript (ES6+)",
      "Git & GitHub",
      "RESTful APIs",
      "Manual & Automated Testing",
      "HTML5 & CSS3"
    ],
    recommendedSkills: [
      "Playwright",
      "Cypress",
      "Jest",
      "Postman",
      "CI/CD Integration",
      "Python or Java"
    ],
    preferredSkills: [
      "Selenium",
      "Performance Testing (k6 / JMeter)",
      "Docker",
      "Page Object Model (POM)"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 5,
        max: 16,
        formatted: "₹5 - ₹16 LPA",
        source: "NASSCOM IT Workforce Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 72000,
        max: 120000,
        formatted: "$72,000 - $120,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 40000,
        max: 70000,
        formatted: "£40,000 - £70,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 45000,
        max: 78000,
        formatted: "€45,000 - €78,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 68000,
        max: 115000,
        formatted: "$68,000 - $115,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+18%",
      label: "High Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics",
      details: "High demand driven by continuous release schedules where automated regression tests are required to prevent outages."
    },
    certificationsRecommended: [
      "ISTQB Certified Tester Foundation Level (CTFL)",
      "Playwright Automation Specialist"
    ],
    coursesRecommended: [
      { title: "Automated Web Testing with Playwright", provider: "Udemy / TestAutomationU" },
      { title: "API Testing with Postman & Newman", provider: "Coursera" }
    ],
    milestones: [
      {
        id: "qa-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (API Testing & Assertions)",
        objective: "Write automated test collections for RESTful API endpoints.",
        tasks: [
          { id: "qa-t1", title: "Build automated Postman test suites with environment variables and assertions", priority: "Critical", estimatedHours: 10, completed: false },
          { id: "qa-t2", title: "Write backend integration tests with Supertest and Jest", priority: "Critical", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Automated REST API Test Suite with 100% endpoint coverage."
      },
      {
        id: "qa-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (Browser End-to-End Automation)",
        objective: "Implement resilient browser automation using Playwright or Cypress.",
        tasks: [
          { id: "qa-t3", title: "Implement Page Object Model (POM) pattern in Playwright", priority: "Important", estimatedHours: 12, completed: false },
          { id: "qa-t4", title: "Automate user login, form validation, and checkout flows", priority: "Important", estimatedHours: 12, completed: false }
        ],
        projectDeliverable: "Cross-Browser End-to-End Regression Suite with visual screenshot comparison."
      },
      {
        id: "qa-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (CI/CD Quality Gates & Load Testing)",
        objective: "Integrate tests into GitHub Actions and perform API load testing with k6.",
        tasks: [
          { id: "qa-t5", title: "Configure GitHub Actions to run test suite on every pull request", priority: "Recommended", estimatedHours: 8, completed: false },
          { id: "qa-t6", title: "Run load and stress tests with k6 to detect latency bottlenecks", priority: "Recommended", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Complete Automated CI/CD Quality Pipeline with Performance Benchmarks."
      }
    ]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "Security & Infrastructure",
    domain: "Cybersecurity",
    description: "Protects enterprise systems, networks, and cloud infrastructure from threats, monitors security incidents, conducts vulnerability assessments, and implements defense protocols.",
    experienceLevel: "Entry-Level / Junior",
    entryLevelEligible: true,
    minYearsExp: 0,
    remoteFriendly: true,
    requiredSkills: [
      "Network Security",
      "Linux",
      "Vulnerability Assessment",
      "Wireshark",
      "Python",
      "SIEM Tools (Splunk)",
      "Firewalls & VPNs",
      "Incident Response",
      "Cryptography"
    ],
    recommendedSkills: [
      "Docker",
      "Bash Scripting",
      "Nmap",
      "Cloud Security (AWS/Azure)",
      "OWASP Top 10",
      "Burp Suite",
      "Identity & Access Management (IAM)"
    ],
    preferredSkills: [
      "Penetration Testing",
      "Kubernetes Security",
      "Zero Trust Architecture",
      "ISO 27001 / SOC 2 Compliance"
    ],
    salaryByRegion: {
      IN: {
        currency: "₹",
        min: 6,
        max: 20,
        formatted: "₹6 - ₹20 LPA",
        source: "NASSCOM & DSCI Security Workforce Benchmark",
        updated: "Q1 2026"
      },
      US: {
        currency: "$",
        min: 80000,
        max: 140000,
        formatted: "$80,000 - $140,000 /yr",
        source: "U.S. Bureau of Labor Statistics (BLS)",
        updated: "Q1 2026"
      },
      UK: {
        currency: "£",
        min: 45000,
        max: 85000,
        formatted: "£45,000 - £85,000 /yr",
        source: "UK Tech Nation Salary Survey",
        updated: "Q1 2026"
      },
      EU: {
        currency: "€",
        min: 50000,
        max: 90000,
        formatted: "€50,000 - €90,000 /yr",
        source: "Eurostat Tech Benchmark",
        updated: "Q1 2026"
      },
      REMOTE: {
        currency: "$",
        min: 75000,
        max: 135000,
        formatted: "$75,000 - $135,000 /yr",
        source: "Global Remote Tech Index",
        updated: "Q1 2026"
      }
    },
    growthOutlook: {
      rate: "+32%",
      label: "Very High Growth",
      period: "2024-2032",
      source: "U.S. Bureau of Labor Statistics",
      details: "One of the fastest growing fields globally driven by cloud adoption, compliance mandates, and advanced cyber threat prevention."
    },
    certificationsRecommended: [
      "CompTIA Security+",
      "Certified Information Systems Security Professional (CISSP)",
      "Certified Ethical Hacker (CEH)"
    ],
    coursesRecommended: [
      { title: "Google Cybersecurity Professional Certificate", provider: "Coursera / Google" },
      { title: "Network Security & Ethical Hacking", provider: "Udemy" },
      { title: "Practical Incident Response & SIEM Fundamentals", provider: "Cybrary" }
    ],
    milestones: [
      {
        id: "sec-m1",
        stage: "Stage 1",
        timeframe: "Weeks 1-4 (Foundations & Core Gaps)",
        objective: "Solidify networking protocols (TCP/IP, DNS, OSI model) and Linux command-line security tools.",
        tasks: [
          { id: "sec-t1", title: "Master TCP/IP networking, packet structures, and port analysis with Wireshark", priority: "Critical", estimatedHours: 12, completed: false },
          { id: "sec-t2", title: "Configure Linux firewall (iptables/UFW) and review audit system logs", priority: "Critical", estimatedHours: 10, completed: false },
          { id: "sec-t3", title: "Perform network vulnerability scanning using Nmap and Nessus", priority: "Critical", estimatedHours: 10, completed: false }
        ],
        projectDeliverable: "Network Security Audit & Vulnerability Assessment Report with remediation guidelines."
      },
      {
        id: "sec-m2",
        stage: "Stage 2",
        timeframe: "Weeks 5-8 (Incident Response & SIEM Analysis)",
        objective: "Configure SIEM tools, analyze threat telemetry, and automate detection rules.",
        tasks: [
          { id: "sec-t4", title: "Deploy and configure Splunk or ELK stack for centralized log aggregation", priority: "Important", estimatedHours: 14, completed: false },
          { id: "sec-t5", title: "Write custom detection queries and alerting rules for brute-force attacks", priority: "Important", estimatedHours: 10, completed: false },
          { id: "sec-t6", title: "Audit web applications against OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF)", priority: "Important", estimatedHours: 12, completed: false }
        ],
        projectDeliverable: "Automated SIEM SOC Monitoring Dashboard with real-time threat detection alerts."
      },
      {
        id: "sec-m3",
        stage: "Stage 3",
        timeframe: "Weeks 9-12 (Cloud Security & Hardening)",
        objective: "Implement Cloud Security Posture Management, IAM least privilege, and container security.",
        tasks: [
          { id: "sec-t7", title: "Configure AWS IAM least-privilege policies, MFA, and Security Groups", priority: "Recommended", estimatedHours: 10, completed: false },
          { id: "sec-t8", title: "Automate security scanning in CI/CD pipeline using Trivy and Bandit", priority: "Recommended", estimatedHours: 8, completed: false }
        ],
        projectDeliverable: "Hardened Multi-Cloud Infrastructure Template with Automated DevSecOps Compliance."
      }
    ]
  }
];

// Helper functions
export const getRoleById = (id) => {
  return CAREER_ROLES.find(r => r.id === id || r.title.toLowerCase() === id?.toLowerCase()) || CAREER_ROLES[0];
};

export const getDomainsList = () => {
  const domains = new Set(CAREER_ROLES.map(r => r.domain));
  return ["All", ...Array.from(domains)];
};

export const careerRolesData = CAREER_ROLES;
export default CAREER_ROLES;

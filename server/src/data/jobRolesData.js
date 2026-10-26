// Predefined IT Job Roles & Universal Evaluation Profiles for CareerCraft AI
export const JOB_ROLES = [
  {
    id: 'general',
    title: 'Without Specific Role',
    category: 'General Resume Evaluation',
    requiredSkills: [
      'Problem Solving',
      'Communication',
      'Team Collaboration',
      'Project Management',
      'Critical Thinking',
      'Time Management',
      'Analytical Skills',
      'Documentation'
    ],
    preferredSkills: [
      'Agile / Scrum',
      'Leadership',
      'Process Improvement',
      'Git / Version Control',
      'Research & Analysis',
      'Adaptability',
      'Quality Assurance',
      'Strategic Planning'
    ],
    coreConcepts: [
      'Professional Experience',
      'Quantified Achievements',
      'Structured Section Headers',
      'ATS Parseability',
      'Action-Oriented Phrasing',
      'Content Clarity & Hierarchy'
    ],
    actionVerbs: [
      'Led', 'Managed', 'Engineered', 'Developed', 'Spearheaded', 'Optimized',
      'Implemented', 'Coordinated', 'Delivered', 'Designed', 'Streamlined', 'Created'
    ],
    commonKeywords: [
      'Projects', 'Experience', 'Leadership', 'Results', 'Management', 'Achievement',
      'Initiative', 'Collaboration', 'Performance', 'Strategy'
    ]
  },
  {
    id: 'mern-developer',
    title: 'Full Stack MERN Developer',
    category: 'Full Stack',
    requiredSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs', 'HTML5', 'CSS3', 'Git'],
    preferredSkills: ['Redux Toolkit', 'TypeScript', 'Next.js', 'JWT', 'Mongoose', 'Tailwind CSS', 'Docker', 'GraphQL', 'Jest'],
    coreConcepts: ['State Management', 'Component Lifecycle', 'Asynchronous Programming', 'CRUD Operations', 'API Integration', 'Full Stack Architecture', 'Responsive Design'],
    actionVerbs: ['Architected', 'Engineered', 'Developed', 'Deployed', 'Integrated', 'Optimized', 'Built', 'Implemented'],
    commonKeywords: ['MERN', 'Full Stack', 'RESTful', 'SPA', 'Authentication', 'Middleware', 'Schema Design', 'Frontend', 'Backend']
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Frontend',
    requiredSkills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Design', 'Git', 'REST APIs', 'UI/UX'],
    preferredSkills: ['TypeScript', 'Next.js', 'Redux', 'Tailwind CSS', 'Vue.js', 'Webpack', 'Vite', 'Jest', 'Figma', 'Sass'],
    coreConcepts: ['DOM Manipulation', 'Web Performance', 'Cross-Browser Compatibility', 'Accessibility (a11y)', 'Component Architecture'],
    actionVerbs: ['Designed', 'Engineered', 'Created', 'Crafted', 'Modernized', 'Optimized', 'Revamped'],
    commonKeywords: ['Frontend', 'UI', 'UX', 'Responsive', 'Client-side', 'Single Page Application', 'Web Standards']
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Backend',
    requiredSkills: ['Node.js', 'Express.js', 'REST APIs', 'SQL', 'MongoDB', 'Database Design', 'Git', 'Authentication'],
    preferredSkills: ['PostgreSQL', 'Redis', 'Docker', 'Microservices', 'GraphQL', 'AWS', 'Kafka', 'System Design', 'TypeScript'],
    coreConcepts: ['Server Architecture', 'Database Optimization', 'Caching', 'Data Modeling', 'API Security', 'Concurrency'],
    actionVerbs: ['Architected', 'Built', 'Implemented', 'Secured', 'Scaled', 'Engineered', 'Optimized'],
    commonKeywords: ['Backend', 'Server-side', 'API', 'Microservices', 'ORM', 'Relational Database', 'Query Optimization']
  },
  {
    id: 'python-developer',
    title: 'Python Developer',
    category: 'Software Engineering',
    requiredSkills: ['Python', 'Django', 'Flask', 'SQL', 'REST APIs', 'Git', 'Object-Oriented Programming (OOP)'],
    preferredSkills: ['FastAPI', 'PostgreSQL', 'Docker', 'Celery', 'Redis', 'Pandas', 'NumPy', 'AWS', 'Linux'],
    coreConcepts: ['Data Structures', 'Algorithms', 'Web Scraping', 'Multithreading', 'Asynchronous I/O', 'Database Migrations'],
    actionVerbs: ['Engineered', 'Developed', 'Automated', 'Built', 'Implemented', 'Refactored'],
    commonKeywords: ['Pythonic', 'Scripting', 'Backend', 'Virtualenv', 'Pip', 'ORM', 'RESTful Services']
  },
  {
    id: 'java-developer',
    title: 'Java Developer',
    category: 'Software Engineering',
    requiredSkills: ['Java', 'Spring Boot', 'OOP', 'SQL', 'REST APIs', 'Git', 'Maven', 'Hibernate'],
    preferredSkills: ['Microservices', 'Docker', 'Kubernetes', 'JPA', 'MySQL', 'PostgreSQL', 'Kafka', 'JUnit', 'AWS'],
    coreConcepts: ['Multithreading', 'Design Patterns', 'JVM Internals', 'Dependency Injection', 'Enterprise Architecture'],
    actionVerbs: ['Architected', 'Engineered', 'Developed', 'Maintained', 'Designed', 'Refactored'],
    commonKeywords: ['Spring MVC', 'Spring Cloud', 'Enterprise', 'Multithreaded', 'ORM', 'Unit Testing']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data',
    requiredSkills: ['SQL', 'Excel', 'Python', 'Data Visualization', 'Tableau', 'Power BI', 'Statistics'],
    preferredSkills: ['Pandas', 'NumPy', 'R', 'Data Cleaning', 'ETL', 'Google Analytics', 'A/B Testing', 'Business Intelligence'],
    coreConcepts: ['Data Modeling', 'Exploratory Data Analysis (EDA)', 'Key Performance Indicators (KPIs)', 'Statistical Analysis', 'Dashboarding'],
    actionVerbs: ['Analyzed', 'Visualized', 'Reported', 'Extracted', 'Modeled', 'Synthesized', 'Identified'],
    commonKeywords: ['Dashboards', 'Metrics', 'Reporting', 'Insights', 'Data Quality', 'Stakeholders', 'Trends']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data Science & AI',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'NumPy', 'Scikit-Learn', 'Data Visualization'],
    preferredSkills: ['R', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Big Data', 'Spark', 'Feature Engineering'],
    coreConcepts: ['Supervised Learning', 'Unsupervised Learning', 'Hypothesis Testing', 'Regression', 'Classification', 'Model Evaluation'],
    actionVerbs: ['Built', 'Modeled', 'Predicted', 'Trained', 'Evaluated', 'Optimized', 'Spearheaded'],
    commonKeywords: ['Predictive Modeling', 'Algorithms', 'Cross-Validation', 'Data Wrangling', 'Precision', 'Recall']
  },
  {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    category: 'Data Science & AI',
    requiredSkills: ['Python', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Data Structures', 'Model Deployment', 'Git', 'SQL'],
    preferredSkills: ['MLOps', 'Docker', 'Kubernetes', 'FastAPI', 'CUDA', 'Feature Engineering', 'AWS SageMaker', 'Hugging Face'],
    coreConcepts: ['Neural Networks', 'Model Optimization', 'Pipelines', 'Inference Latency', 'Hyperparameter Tuning'],
    actionVerbs: ['Deployed', 'Trained', 'Engineered', 'Optimized', 'Scaled', 'Architected'],
    commonKeywords: ['Deep Learning', 'ML Pipeline', 'Model Serving', 'Loss Function', 'Embeddings', 'GPU']
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'Data Science & AI',
    requiredSkills: ['Python', 'LLMs', 'Prompt Engineering', 'LangChain', 'APIs', 'Git', 'Vector Databases'],
    preferredSkills: ['OpenAI API', 'RAG (Retrieval-Augmented Generation)', 'PyTorch', 'Fine-tuning', 'LlamaIndex', 'Pinecone', 'Docker'],
    coreConcepts: ['Generative AI', 'Embeddings', 'Context Window', 'Semantic Search', 'Agentic Workflows', 'Model Evaluation'],
    actionVerbs: ['Integrated', 'Engineered', 'Developed', 'Fine-tuned', 'Architected', 'Implemented'],
    commonKeywords: ['Generative AI', 'LLM', 'RAG', 'Transformers', 'Chatbots', 'Hallucination Mitigation', 'Tokens']
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    category: 'Data',
    requiredSkills: ['SQL', 'Python', 'ETL / ELT', 'Data Warehousing', 'Data Modeling', 'Git', 'Linux'],
    preferredSkills: ['Apache Spark', 'Kafka', 'Airflow', 'Snowflake', 'PostgreSQL', 'AWS Redshift', 'dbt', 'Docker'],
    coreConcepts: ['Data Pipelines', 'Batch Processing', 'Stream Processing', 'Data Lake', 'Schema On Read / Write'],
    actionVerbs: ['Engineered', 'Orchestrated', 'Built', 'Optimized', 'Migrated', 'Automated'],
    commonKeywords: ['Pipelines', 'Big Data', 'Data Architecture', 'Ingestion', 'Distributed Systems', 'Throughput']
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Infrastructure',
    requiredSkills: ['Linux', 'Docker', 'CI/CD', 'Git', 'Bash / Shell Scripting', 'Cloud Platforms (AWS/GCP/Azure)'],
    preferredSkills: ['Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana', 'Security'],
    coreConcepts: ['Infrastructure as Code (IaC)', 'Container Orchestration', 'Automated Deployment', 'Monitoring & Alerting'],
    actionVerbs: ['Automated', 'Configured', 'Deployed', 'Containerized', 'Provisioned', 'Streamlined'],
    commonKeywords: ['DevOps', 'Continuous Integration', 'Continuous Deployment', 'High Availability', 'Site Reliability']
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Infrastructure',
    requiredSkills: ['AWS', 'Cloud Architecture', 'Linux', 'Networking', 'Security', 'Git', 'Python or Bash'],
    preferredSkills: ['Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes', 'Serverless (Lambda)', 'IAM', 'CloudFormation'],
    coreConcepts: ['Cloud Security', 'VPC', 'Disaster Recovery', 'Cost Optimization', 'High Availability', 'Load Balancing'],
    actionVerbs: ['Architected', 'Migrated', 'Provisioned', 'Configured', 'Optimized', 'Managed'],
    commonKeywords: ['Cloud Native', 'Virtual Private Cloud', 'SaaS', 'PaaS', 'IaaS', 'Compliance', 'Fault Tolerance']
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    requiredSkills: ['Network Security', 'Vulnerability Assessment', 'Linux', 'SIEM', 'Firewalls', 'Incident Response'],
    preferredSkills: ['Wireshark', 'Splunk', 'Metasploit', 'Nmap', 'Penetration Testing', 'Python', 'CISSP / CompTIA Security+'],
    coreConcepts: ['Threat Modeling', 'OWASP Top 10', 'Risk Mitigation', 'Zero Trust', 'Encryption', 'Access Control (RBAC)'],
    actionVerbs: ['Monitored', 'Mitigated', 'Audited', 'Investigated', 'Defended', 'Secured'],
    commonKeywords: ['Cybersecurity', 'Threat Detection', 'Vulnerability', 'Intrusion Detection', 'Penetration Testing', 'Forensics']
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Software Engineering',
    requiredSkills: ['Data Structures & Algorithms', 'OOP', 'Git', 'Problem Solving', 'SQL', 'Testing & Debugging'],
    preferredSkills: ['Java or C++ or Python or TypeScript', 'System Design', 'CI/CD', 'Docker', 'Agile / Scrum', 'Design Patterns'],
    coreConcepts: ['Time & Space Complexity', 'Code Quality', 'Clean Code', 'Modularity', 'Refactoring', 'Unit Testing'],
    actionVerbs: ['Architected', 'Engineered', 'Developed', 'Implemented', 'Refactored', 'Collaborated'],
    commonKeywords: ['Software Development Life Cycle (SDLC)', 'Agile', 'Code Review', 'Scalability', 'Reliability']
  },
  {
    id: 'qa-automation-engineer',
    title: 'QA Automation Engineer',
    category: 'Quality Assurance',
    requiredSkills: ['Test Automation', 'Selenium', 'Java or Python or JavaScript', 'Manual Testing', 'Git', 'Bug Tracking (Jira)'],
    preferredSkills: ['Cypress', 'Playwright', 'Postman', 'API Testing', 'CI/CD Integration', 'TestNG', 'Cucumber / BDD'],
    coreConcepts: ['Test Plans & Cases', 'Regression Testing', 'Continuous Testing', 'Performance Testing', 'Page Object Model (POM)'],
    actionVerbs: ['Automated', 'Tested', 'Identified', 'Validated', 'Executed', 'Authored'],
    commonKeywords: ['QA', 'Automation Framework', 'Test Coverage', 'Defect Lifecycle', 'End-to-End Testing', 'Assertion']
  }
];

export const getRoleById = (id) => {
  if (!id || id === 'general' || id === 'without-role' || id === 'none' || id === 'no-role') {
    return JOB_ROLES.find(r => r.id === 'general') || JOB_ROLES[0];
  }
  return JOB_ROLES.find(r => r.id === id || r.title.toLowerCase() === id?.toLowerCase()) || JOB_ROLES[0];
};

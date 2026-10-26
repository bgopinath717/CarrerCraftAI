// Complete Standalone Portfolio ZIP Exporter for CareerCraft AI
// Generates an independent, responsive, production-ready portfolio website in a ZIP archive.

import JSZip from 'jszip';

const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const getInitials = (name) => {
  if (!name || !name.trim()) return 'DEV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Builds the standalone index.html content
 */
export const buildPortfolioHtml = (profile, settings = {}) => {
  const pInfo = profile?.personalInfo || {};
  const cInfo = profile?.careerInfo || {};
  const skills = profile?.skills || {};
  const projects = profile?.projects || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const certifications = profile?.certifications || [];
  const achievements = profile?.achievements || [];

  const fullName = pInfo.fullName || 'Software Developer';
  const title = pInfo.title || cInfo.targetRole || 'Full Stack Developer';
  const initials = getInitials(fullName);
  const tagline = settings.tagline || cInfo.tagline || 'Building scalable, user-centric web applications and modern digital products.';
  const bio = settings.customBio || cInfo.summary || cInfo.objective || pInfo.summary || 'Passionate software engineer with hands-on experience developing modern web platforms, solving complex technical challenges, and delivering clean, maintainable code.';
  const email = pInfo.email || '';
  const phone = pInfo.phone || '';
  const location = pInfo.location || '';
  const github = pInfo.github || '';
  const linkedin = pInfo.linkedin || '';
  const website = pInfo.website || '';

  // Extract skills by categories
  const techSkills = Array.isArray(skills.technical) ? skills.technical : [];
  const frameworkSkills = Array.isArray(skills.frameworks) ? skills.frameworks : [];
  const databaseSkills = Array.isArray(skills.databases) ? skills.databases : [];
  const toolSkills = Array.isArray(skills.tools) ? skills.tools : [];
  const languageSkills = Array.isArray(skills.languages) ? skills.languages : [];
  const softSkills = Array.isArray(skills.soft) ? skills.soft : [];

  const hasAnySkills = techSkills.length > 0 || frameworkSkills.length > 0 || databaseSkills.length > 0 || toolSkills.length > 0 || languageSkills.length > 0 || softSkills.length > 0;
  const hasProjects = projects.length > 0;
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasCertifications = certifications.length > 0;
  const hasAchievements = achievements.length > 0;

  return `<!DOCTYPE html>
<html lang="en" data-theme="${escapeHtml(settings.theme || 'tech-blue')}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(fullName)} - ${escapeHtml(title)}. ${escapeHtml(tagline)}">
  <meta name="author" content="${escapeHtml(fullName)}">
  <title>${escapeHtml(fullName)} | ${escapeHtml(title)}</title>
  
  <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Navigation Bar -->
  <header class="navbar" id="navbar">
    <div class="nav-container">
      <a href="#hero" class="nav-brand">
        <span class="brand-monogram">${escapeHtml(initials)}</span>
        <span class="brand-name">${escapeHtml(fullName)}</span>
      </a>

      <nav class="nav-links" id="nav-links">
        <a href="#about" class="nav-link">About</a>
        ${hasAnySkills ? '<a href="#skills" class="nav-link">Skills</a>' : ''}
        ${hasProjects ? '<a href="#projects" class="nav-link">Projects</a>' : ''}
        ${hasExperience ? '<a href="#experience" class="nav-link">Experience</a>' : ''}
        ${hasEducation ? '<a href="#education" class="nav-link">Education</a>' : ''}
        ${hasCertifications || hasAchievements ? '<a href="#credentials" class="nav-link">Credentials</a>' : ''}
        <a href="#contact" class="nav-link">Contact</a>
      </nav>

      <div class="nav-actions">
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark/light mode" title="Toggle theme">
          <span class="theme-icon sun-icon">☀️</span>
          <span class="theme-icon moon-icon">🌙</span>
        </button>
        ${email ? `<a href="mailto:${escapeHtml(email)}" class="btn btn-primary btn-sm nav-cta">Get In Touch</a>` : ''}
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero-section" id="hero">
      <div class="container hero-container">
        <div class="hero-badge">
          <span class="status-indicator"></span>
          <span>Available for New Opportunities</span>
        </div>

        <div class="hero-avatar-wrapper">
          <div class="hero-avatar">
            <span>${escapeHtml(initials)}</span>
          </div>
        </div>

        <h1 class="hero-title">
          Hi, I'm <span class="gradient-text">${escapeHtml(fullName)}</span>
        </h1>
        
        <div class="hero-role">${escapeHtml(title)}</div>
        
        <p class="hero-tagline">${escapeHtml(tagline)}</p>

        <div class="hero-buttons">
          ${hasProjects ? '<a href="#projects" class="btn btn-primary">View Featured Projects</a>' : ''}
          <a href="#contact" class="btn btn-outline">Contact Me</a>
          <button class="btn btn-ghost" onclick="window.print()">Print / Save PDF</button>
        </div>

        <!-- Social & Quick Links -->
        <div class="social-links">
          ${github ? `<a href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer" class="social-icon" title="GitHub Profile">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>` : ''}
          ${linkedin ? `<a href="${escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" class="social-icon" title="LinkedIn Profile">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span>LinkedIn</span>
          </a>` : ''}
          ${email ? `<a href="mailto:${escapeHtml(email)}" class="social-icon" title="Send Email">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>${escapeHtml(email)}</span>
          </a>` : ''}
          ${phone ? `<a href="tel:${escapeHtml(phone)}" class="social-icon" title="Phone">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${escapeHtml(phone)}</span>
          </a>` : ''}
          ${location ? `<span class="social-icon location-badge" title="Location">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${escapeHtml(location)}</span>
          </span>` : ''}
        </div>
      </div>
    </section>

    <!-- About Me Section -->
    <section class="section about-section" id="about">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Background</span>
          <h2 class="section-title">About Me</h2>
          <div class="section-line"></div>
        </div>

        <div class="about-grid">
          <div class="about-card main-bio-card">
            <h3 class="about-subtitle">Professional Profile</h3>
            <p class="about-text">${escapeHtml(bio).replace(/\n/g, '<br>')}</p>
          </div>

          <div class="about-card quick-facts-card">
            <h3 class="about-subtitle">Quick Overview</h3>
            <ul class="facts-list">
              <li>
                <span class="fact-label">Primary Role</span>
                <span class="fact-value">${escapeHtml(title)}</span>
              </li>
              ${location ? `<li>
                <span class="fact-label">Location</span>
                <span class="fact-value">${escapeHtml(location)}</span>
              </li>` : ''}
              ${experience.length > 0 ? `<li>
                <span class="fact-label">Experience</span>
                <span class="fact-value">${experience.length}+ Professional Roles</span>
              </li>` : ''}
              ${projects.length > 0 ? `<li>
                <span class="fact-label">Portfolio</span>
                <span class="fact-value">${projects.length} Featured Projects</span>
              </li>` : ''}
              ${email ? `<li>
                <span class="fact-label">Direct Contact</span>
                <span class="fact-value">${escapeHtml(email)}</span>
              </li>` : ''}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Competencies & Skills -->
    ${hasAnySkills ? `
    <section class="section skills-section" id="skills">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Expertise</span>
          <h2 class="section-title">Technical Competencies</h2>
          <div class="section-line"></div>
        </div>

        <div class="skills-grid">
          ${techSkills.length > 0 ? `
          <div class="skill-category-card">
            <div class="skill-cat-header">
              <span class="skill-cat-icon">⚡</span>
              <h3>Languages & Core Technologies</h3>
            </div>
            <div class="skill-tags">
              ${techSkills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>` : ''}

          ${frameworkSkills.length > 0 ? `
          <div class="skill-category-card">
            <div class="skill-cat-header">
              <span class="skill-cat-icon">⚛️</span>
              <h3>Frameworks & Libraries</h3>
            </div>
            <div class="skill-tags">
              ${frameworkSkills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>` : ''}

          ${databaseSkills.length > 0 ? `
          <div class="skill-category-card">
            <div class="skill-cat-header">
              <span class="skill-cat-icon">🗄️</span>
              <h3>Databases & Storage</h3>
            </div>
            <div class="skill-tags">
              ${databaseSkills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>` : ''}

          ${toolSkills.length > 0 ? `
          <div class="skill-category-card">
            <div class="skill-cat-header">
              <span class="skill-cat-icon">🛠️</span>
              <h3>DevOps, Cloud & Tools</h3>
            </div>
            <div class="skill-tags">
              ${toolSkills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>` : ''}

          ${softSkills.length > 0 ? `
          <div class="skill-category-card">
            <div class="skill-cat-header">
              <span class="skill-cat-icon">🤝</span>
              <h3>Professional & Soft Skills</h3>
            </div>
            <div class="skill-tags">
              ${softSkills.map(s => `<span class="skill-tag skill-tag-soft">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>` : ''}
        </div>
      </div>
    </section>` : ''}

    <!-- Featured Projects -->
    ${hasProjects ? `
    <section class="section projects-section" id="projects">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Portfolio</span>
          <h2 class="section-title">Featured Projects</h2>
          <div class="section-line"></div>
        </div>

        <div class="projects-grid">
          ${projects.map((proj, idx) => {
            const pName = proj.name || proj.title || `Project #${idx + 1}`;
            const pDesc = proj.description || '';
            const pTechs = Array.isArray(proj.technologies) ? proj.technologies : (typeof proj.technologies === 'string' ? proj.technologies.split(/[,;]+/).map(t => t.trim()) : []);
            const pLive = proj.link || proj.liveUrl || proj.demoUrl || '';
            const pGithub = proj.github || proj.repoUrl || '';
            const pBullets = Array.isArray(proj.bullets) ? proj.bullets : [];

            return `
            <div class="project-card">
              <div class="project-card-header">
                <div class="project-folder-icon">📁</div>
                <div class="project-links">
                  ${pGithub ? `<a href="${escapeHtml(pGithub)}" target="_blank" rel="noopener noreferrer" class="project-icon-btn" title="View Source Code">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  </a>` : ''}
                  ${pLive ? `<a href="${escapeHtml(pLive)}" target="_blank" rel="noopener noreferrer" class="project-icon-btn" title="Open Live Site">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>` : ''}
                </div>
              </div>

              <h3 class="project-title">${escapeHtml(pName)}</h3>
              
              <p class="project-desc">${escapeHtml(pDesc)}</p>

              ${pBullets.length > 0 ? `
              <ul class="project-bullets">
                ${pBullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
              </ul>` : ''}

              ${pTechs.length > 0 ? `
              <div class="project-tech-list">
                ${pTechs.map(t => `<span class="project-tech-badge">${escapeHtml(t)}</span>`).join('')}
              </div>` : ''}
            </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>` : ''}

    <!-- Experience & Internships -->
    ${hasExperience ? `
    <section class="section experience-section" id="experience">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Career Journey</span>
          <h2 class="section-title">Work Experience</h2>
          <div class="section-line"></div>
        </div>

        <div class="timeline">
          ${experience.map((exp, idx) => {
            const role = exp.position || exp.title || 'Software Developer';
            const company = exp.company || 'Company';
            const duration = exp.duration || (exp.startDate ? `${exp.startDate} - ${exp.endDate || 'Present'}` : 'Professional Role');
            const desc = exp.description || '';
            const bullets = Array.isArray(exp.bullets) ? exp.bullets : [];

            return `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <div>
                    <h3 class="timeline-role">${escapeHtml(role)}</h3>
                    <div class="timeline-company">${escapeHtml(company)}</div>
                  </div>
                  <span class="timeline-badge">${escapeHtml(duration)}</span>
                </div>

                ${desc ? `<p class="timeline-desc">${escapeHtml(desc)}</p>` : ''}

                ${bullets.length > 0 ? `
                <ul class="timeline-bullets">
                  ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>` : ''}
              </div>
            </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>` : ''}

    <!-- Education Section -->
    ${hasEducation ? `
    <section class="section education-section" id="education">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Academics</span>
          <h2 class="section-title">Education Background</h2>
          <div class="section-line"></div>
        </div>

        <div class="education-grid">
          ${education.map(edu => {
            const degree = edu.degree || 'Degree';
            const institution = edu.institution || edu.school || 'University / Institution';
            const year = edu.year || edu.duration || (edu.startDate ? `${edu.startDate} - ${edu.endDate || 'Present'}` : '');
            const score = edu.score || edu.grade || '';

            return `
            <div class="education-card">
              <div class="edu-icon">🎓</div>
              <div class="edu-content">
                <h3 class="edu-degree">${escapeHtml(degree)}</h3>
                <div class="edu-institution">${escapeHtml(institution)}</div>
                <div class="edu-meta">
                  ${year ? `<span class="edu-year">${escapeHtml(year)}</span>` : ''}
                  ${score ? `<span class="edu-score">${escapeHtml(score)}</span>` : ''}
                </div>
              </div>
            </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>` : ''}

    <!-- Credentials & Achievements Section -->
    ${(hasCertifications || hasAchievements) ? `
    <section class="section credentials-section" id="credentials">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Milestones</span>
          <h2 class="section-title">Certifications & Achievements</h2>
          <div class="section-line"></div>
        </div>

        <div class="credentials-grid">
          ${hasCertifications ? `
          <div class="credentials-col">
            <h3 class="credentials-col-title">Certifications</h3>
            <div class="credentials-list">
              ${certifications.map(c => {
                const cName = typeof c === 'string' ? c : (c.name || 'Certification');
                const cIssuer = typeof c === 'object' ? (c.issuer || c.authority || '') : '';
                const cDate = typeof c === 'object' ? (c.date || c.year || '') : '';
                return `
                <div class="cert-item">
                  <div class="cert-badge">🏅</div>
                  <div>
                    <h4 class="cert-name">${escapeHtml(cName)}</h4>
                    ${cIssuer ? `<div class="cert-issuer">${escapeHtml(cIssuer)}${cDate ? ` • ${escapeHtml(cDate)}` : ''}</div>` : ''}
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>` : ''}

          ${hasAchievements ? `
          <div class="credentials-col">
            <h3 class="credentials-col-title">Honors & Achievements</h3>
            <div class="credentials-list">
              ${achievements.map(a => {
                const aText = typeof a === 'string' ? a : (a.title || a.description || 'Achievement');
                return `
                <div class="cert-item">
                  <div class="cert-badge">🏆</div>
                  <div>
                    <p class="cert-name">${escapeHtml(aText)}</p>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>` : ''}
        </div>
      </div>
    </section>` : ''}

    <!-- Contact Section -->
    <section class="section contact-section" id="contact">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Get In Touch</span>
          <h2 class="section-title">Let's Connect</h2>
          <div class="section-line"></div>
        </div>

        <div class="contact-grid">
          <div class="contact-info-card">
            <h3>Ready to collaborate?</h3>
            <p>I'm always open to discussing new opportunities, full-time engineering roles, high-impact projects, or technical consulting.</p>

            <div class="contact-methods">
              ${email ? `
              <div class="contact-method-item">
                <span class="contact-icon">✉️</span>
                <div>
                  <div class="contact-method-label">Email Address</div>
                  <a href="mailto:${escapeHtml(email)}" class="contact-method-link">${escapeHtml(email)}</a>
                </div>
                <button class="copy-btn" onclick="copyToClipboard('${escapeHtml(email)}', this)" title="Copy email">Copy</button>
              </div>` : ''}

              ${phone ? `
              <div class="contact-method-item">
                <span class="contact-icon">📞</span>
                <div>
                  <div class="contact-method-label">Phone / WhatsApp</div>
                  <a href="tel:${escapeHtml(phone)}" class="contact-method-link">${escapeHtml(phone)}</a>
                </div>
              </div>` : ''}

              ${location ? `
              <div class="contact-method-item">
                <span class="contact-icon">📍</span>
                <div>
                  <div class="contact-method-label">Current Location</div>
                  <span class="contact-method-link">${escapeHtml(location)}</span>
                </div>
              </div>` : ''}
            </div>
          </div>

          <!-- Interactive Contact Form -->
          <div class="contact-form-card">
            <h3>Send a Message</h3>
            <form id="portfolio-contact-form" onsubmit="handleContactSubmit(event, '${escapeHtml(email)}')">
              <div class="form-group">
                <label for="form-name">Your Name</label>
                <input type="text" id="form-name" required placeholder="Jane Doe" class="form-input">
              </div>

              <div class="form-group">
                <label for="form-email">Your Email</label>
                <input type="email" id="form-email" required placeholder="jane@example.com" class="form-input">
              </div>

              <div class="form-group">
                <label for="form-subject">Subject</label>
                <input type="text" id="form-subject" required placeholder="Exciting Opportunity / Project Inquiry" class="form-input">
              </div>

              <div class="form-group">
                <label for="form-message">Message</label>
                <textarea id="form-message" rows="4" required placeholder="Write your message here..." class="form-input"></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block">Send Message</button>
              <div id="form-status" class="form-status"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-left">
        <span class="footer-brand">${escapeHtml(fullName)}</span>
        <span class="footer-copy">© <span id="current-year"></span> All rights reserved.</span>
      </div>
      <div class="footer-right">
        <span>Portfolio Website generated with <strong>CareerCraft AI</strong></span>
        <a href="#hero" class="back-to-top" title="Back to top">↑</a>
      </div>
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>`;
};

/**
 * Builds the standalone css/style.css content
 */
export const buildPortfolioCss = (themeId = 'tech-blue') => {
  return `/* CareerCraft AI - Standalone Portfolio Design System */
:root {
  --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Theme color tokens default (Tech Blue Modern) */
  --color-primary: #079FE8;
  --color-primary-dark: #073B68;
  --color-primary-light: #38C5F5;
  --color-accent: #079FE8;

  /* Light Theme */
  --bg-body: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: #F1F5F9;
  --bg-surface-elevated: #FFFFFF;
  --border-color: #E2E8F0;
  --border-subtle: #EDF2F7;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Dark Theme Overrides */
[data-theme="dark"],
[data-theme="tech-dark"],
[data-theme="navy-pro"] {
  --bg-body: #0B0F19;
  --bg-surface: #111827;
  --bg-surface-subtle: #1F2937;
  --bg-surface-elevated: #182234;
  --border-color: #2D3748;
  --border-subtle: #1F2937;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.6);
}

[data-theme="navy-pro"] {
  --bg-body: #051329;
  --bg-surface: #0B1E38;
  --bg-surface-subtle: #102A4E;
  --color-primary: #38C5F5;
  --color-primary-dark: #079FE8;
}

[data-theme="royal-azure"] {
  --bg-body: #071F38;
  --bg-surface: #0B2D52;
  --bg-surface-subtle: #123C6A;
  --color-primary: #38BDF8;
  --color-primary-dark: #0284C7;
  --text-primary: #F0F9FF;
  --text-secondary: #BAE6FD;
}

/* Reset & Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-main);
  background-color: var(--bg-body);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Container */
.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Section Common */
.section {
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-tag {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.section-line {
  width: 50px;
  height: 4px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  margin: 0 auto;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

[data-theme="dark"] .navbar,
[data-theme="tech-dark"] .navbar,
[data-theme="navy-pro"] .navbar,
[data-theme="royal-azure"] .navbar {
  background: rgba(11, 15, 25, 0.85);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.brand-monogram {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.875rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: var(--transition);
}

.nav-link:hover, .nav-link.active {
  color: var(--color-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.theme-toggle {
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  width: 38px;
  height: 38px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: var(--transition);
}

.theme-toggle:hover {
  background: var(--border-color);
}

.sun-icon { display: none; }
.moon-icon { display: inline-block; }

[data-theme="dark"] .sun-icon,
[data-theme="tech-dark"] .sun-icon,
[data-theme="navy-pro"] .sun-icon,
[data-theme="royal-azure"] .sun-icon {
  display: inline-block;
}

[data-theme="dark"] .moon-icon,
[data-theme="tech-dark"] .moon-icon,
[data-theme="navy-pro"] .moon-icon,
[data-theme="royal-azure"] .moon-icon {
  display: none;
}

.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}

.mobile-menu-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background-color: var(--text-primary);
  border-radius: 2px;
  transition: var(--transition);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  box-shadow: 0 4px 14px rgba(7, 159, 232, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(7, 159, 232, 0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--border-color);
  color: var(--text-primary);
}

.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(7, 159, 232, 0.05);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}

.btn-ghost:hover {
  color: var(--text-primary);
}

.btn-sm {
  padding: 0.45rem 1rem;
  font-size: 0.8125rem;
}

.btn-block {
  width: 100%;
}

/* Hero Section */
.hero-section {
  padding: 5rem 0 4rem;
  text-align: center;
  background: radial-gradient(circle at 50% 20%, rgba(7, 159, 232, 0.12) 0%, transparent 60%);
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 820px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.875rem;
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(22, 163, 74, 0.25);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 700;
  color: #16A34A;
  margin-bottom: 2rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #16A34A;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.5); }
  70% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
}

.hero-avatar-wrapper {
  margin-bottom: 1.5rem;
}

.hero-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  font-weight: 800;
  box-shadow: 0 12px 28px rgba(7, 159, 232, 0.35);
  border: 4px solid var(--bg-surface);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  line-height: 1.15;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-role {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1.25rem;
}

.hero-tagline {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 640px;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  font-size: 0.84375rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.social-icon:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* About Grid */
.about-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 2rem;
}

.about-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2.25rem;
  box-shadow: var(--shadow-md);
}

.about-subtitle {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.about-text {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.facts-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.facts-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 0.9375rem;
}

.facts-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.fact-label {
  color: var(--text-muted);
  font-weight: 500;
}

.fact-value {
  color: var(--text-primary);
  font-weight: 700;
  text-align: right;
}

/* Skills */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.skill-category-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.skill-category-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(7, 159, 232, 0.4);
}

.skill-cat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.skill-cat-icon {
  font-size: 1.25rem;
}

.skill-cat-header h3 {
  font-size: 1.0625rem;
  font-weight: 700;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background: var(--bg-surface-subtle);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  transition: var(--transition);
}

.skill-tag:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.skill-tag-soft {
  background: rgba(7, 159, 232, 0.08);
  border-color: rgba(7, 159, 232, 0.25);
  color: var(--color-primary);
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.project-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.project-folder-icon {
  font-size: 1.75rem;
}

.project-links {
  display: flex;
  gap: 0.5rem;
}

.project-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition);
}

.project-icon-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(7, 159, 232, 0.08);
}

.project-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.project-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.project-bullets {
  list-style: none;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.project-bullets li {
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.project-bullets li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.project-tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.project-tech-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.55rem;
  background: var(--bg-surface-subtle);
  color: var(--text-muted);
  border-radius: var(--radius-sm);
}

/* Timeline (Experience) */
.timeline {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 7px;
  width: 2px;
  background: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 4px solid var(--color-primary);
  box-shadow: 0 0 0 4px rgba(7, 159, 232, 0.2);
}

.timeline-content {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.timeline-content:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(7, 159, 232, 0.3);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.timeline-role {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}

.timeline-company {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
}

.timeline-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-muted);
}

.timeline-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.timeline-bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.timeline-bullets li {
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.timeline-bullets li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

/* Education Grid */
.education-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.education-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  display: flex;
  gap: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.education-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.edu-icon {
  font-size: 2rem;
}

.edu-degree {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.edu-institution {
  font-size: 0.9375rem;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.edu-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Credentials (Certs & Achievements) */
.credentials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.credentials-col-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.credentials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cert-item {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}

.cert-badge {
  font-size: 1.5rem;
}

.cert-name {
  font-size: 0.9375rem;
  font-weight: 700;
}

.cert-issuer {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Contact */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.contact-info-card, .contact-form-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-md);
}

.contact-info-card h3, .contact-form-card h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.contact-info-card p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-method-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.contact-icon {
  font-size: 1.5rem;
}

.contact-method-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 700;
  letter-spacing: 0.05em;
}

.contact-method-link {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-primary);
}

.copy-btn {
  margin-left: auto;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
}

.copy-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* Form */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-surface-subtle);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.9375rem;
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(7, 159, 232, 0.2);
}

.form-status {
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

/* Footer */
.footer {
  border-top: 1px solid var(--border-color);
  background: var(--bg-surface);
  padding: 2.5rem 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-brand {
  font-weight: 800;
  color: var(--text-primary);
  margin-right: 0.75rem;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-to-top {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: var(--text-primary);
}

/* Responsive Media Queries */
@media (max-width: 868px) {
  .hero-title { font-size: 2.25rem; }
  .section-title { font-size: 1.875rem; }
  .about-grid, .contact-grid { grid-template-columns: 1fr; }
  
  .mobile-menu-btn { display: flex; }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border-color);
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    box-shadow: var(--shadow-lg);
  }

  .nav-links.open { display: flex; }
}
`;
};

/**
 * Builds the standalone js/script.js content
 */
export const buildPortfolioJs = () => {
  return `// CareerCraft AI - Interactive Portfolio Website Script

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close when clicking nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  
  // Restore saved theme if any
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const nextTheme = current === 'dark' || current === 'tech-dark' || current === 'navy-pro' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
    });
  }

  // Scrollspy active navigation highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
});

// Copy to clipboard helper
function copyToClipboard(text, btnElement) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.textContent;
    btnElement.textContent = 'Copied!';
    btnElement.style.color = '#16A34A';
    btnElement.style.borderColor = '#16A34A';
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.color = '';
      btnElement.style.borderColor = '';
    }, 2000);
  }).catch(() => {
    prompt('Copy email:', text);
  });
}

// Contact form submission
function handleContactSubmit(event, receiverEmail) {
  event.preventDefault();
  const name = document.getElementById('form-name')?.value || '';
  const email = document.getElementById('form-email')?.value || '';
  const subject = document.getElementById('form-subject')?.value || 'Portfolio Contact Inquiry';
  const message = document.getElementById('form-message')?.value || '';
  const statusEl = document.getElementById('form-status');

  const mailtoBody = encodeURIComponent(\`Name: \${name}\\nEmail: \${email}\\n\\nMessage:\\n\${message}\`);
  const mailtoUrl = \`mailto:\${receiverEmail}?subject=\${encodeURIComponent(subject)}&body=\${mailtoBody}\`;

  if (statusEl) {
    statusEl.innerHTML = '<span style="color:#16A34A; font-weight:700;">Opening your email client to send message...</span>';
  }

  window.location.href = mailtoUrl;

  setTimeout(() => {
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:#16A34A;">✓ Message prepared! Your email app has been opened.</span>';
    }
  }, 1000);
}
`;
};

/**
 * Builds the standalone README.md content
 */
export const buildPortfolioReadme = (profile) => {
  const name = profile?.personalInfo?.fullName || 'Developer';
  const title = profile?.personalInfo?.title || 'Software Developer';

  return `# ${name} - Developer Portfolio Website

Welcome to your standalone personal portfolio website, generated using **CareerCraft AI**.

This is a complete, self-contained, responsive website source code package. It does **not** require any backend server, database, or login session to run—it works completely out-of-the-box in any modern web browser!

---

## 🚀 Quick Start (Local Viewing)

### Method 1: Direct File Open (Easiest)
1. Extract the downloaded ZIP archive to a folder on your computer.
2. Double-click **\`index.html\`** to open it in Chrome, Firefox, Safari, Edge, or Brave.
3. Your personal portfolio is running!

### Method 2: Local Web Server (Recommended)
If you use VS Code or terminal tools:
- **VS Code**: Install the *"Live Server"* extension, right-click \`index.html\`, and choose **"Open with Live Server"**.
- **Python 3**: Open a terminal in this folder and run:
  \`\`\`bash
  python -m http.server 8000
  \`\`\`
  Then visit [http://localhost:8000](http://localhost:8000).
- **Node.js**: Run:
  \`\`\`bash
  npx serve .
  \`\`\`

---

## 🌐 Free 1-Click Deployment

You can publish this portfolio for free in less than 2 minutes on any hosting provider:

### Option A: Netlify Drop (No Terminal Needed)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this extracted folder into the browser window.
3. Netlify will give you an instant live URL (e.g. \`https://yourname.netlify.app\`).

### Option B: GitHub Pages
1. Create a new GitHub repository named \`your-username.github.io\`.
2. Push all files from this folder into the \`main\` branch.
3. Go to **Settings** > **Pages** in your repository and set the source to \`main\` / \`/root\`.
4. Your site will be live at \`https://your-username.github.io\`.

### Option C: Vercel
1. Install the Vercel CLI: \`npm i -g vercel\`.
2. Inside this directory, run: \`vercel\`.
3. Follow the prompts for an instant deployment.

---

## 📁 File Structure

\`\`\`
portfolio-website/
├── index.html           # Main semantic HTML5 portfolio page
├── css/
│   └── style.css        # Responsive CSS styling with light & dark theme support
├── js/
│   └── script.js        # Mobile navigation, theme switching, contact form handler
├── assets/
│   └── images/
│       ├── avatar.svg   # Custom monogram avatar badge
│       └── favicon.svg  # Browser tab icon
├── README.md            # This documentation file
└── .gitignore           # Git ignore list
\`\`\`

---

## ✏️ How to Customize Your Content
- **Text & Links**: Open \`index.html\` in any text editor (VS Code, Notepad, etc.) to update your bio, social links, or project descriptions.
- **Colors & Styles**: Modify \`css/style.css\` under the \`:root\` variables to adjust primary colors, background shades, or typography.

---

*Generated by [CareerCraft AI](https://careercraft.ai) — ATS-Friendly Resume, Portfolio & Career Platform.*
`;
};

/**
 * Builds the monogram SVG avatar
 */
export const buildAvatarSvg = (initials = 'DEV') => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#073B68"/>
      <stop offset="100%" stop-color="#079FE8"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="50" fill="url(#grad)"/>
  <text x="50" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${escapeHtml(initials)}</text>
</svg>`;
};

/**
 * Builds the favicon SVG
 */
export const buildFaviconSvg = (initials = 'CC') => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="8" fill="#079FE8"/>
  <text x="16" y="21" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeHtml(initials.slice(0, 2))}</text>
</svg>`;
};

/**
 * Builds standard .gitignore content
 */
export const buildGitignore = () => {
  return `# Operating System Files
.DS_Store
Thumbs.db
desktop.ini

# Editor & IDE configs
.vscode/
.idea/
*.swp
*.swo

# Temporary & Log files
*.log
npm-debug.log*
`;
};

/**
 * Main packaging and download function using JSZip
 */
export const downloadPortfolioZip = async (profile, settings = {}) => {
  const pInfo = profile?.personalInfo || {};
  const initials = getInitials(pInfo.fullName || 'Developer');
  const slug = (settings.slug || pInfo.fullName || 'developer')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio';

  const zip = new JSZip();
  const root = zip.folder(`${slug}-website`);

  // Generate files
  const htmlContent = buildPortfolioHtml(profile, settings);
  const cssContent = buildPortfolioCss(settings.theme || 'tech-blue');
  const jsContent = buildPortfolioJs();
  const readmeContent = buildPortfolioReadme(profile);
  const gitignoreContent = buildGitignore();
  const avatarSvg = buildAvatarSvg(initials);
  const faviconSvg = buildFaviconSvg(initials);

  // Add files to root
  root.file('index.html', htmlContent);
  root.file('README.md', readmeContent);
  root.file('.gitignore', gitignoreContent);

  // Add css folder
  const cssFolder = root.folder('css');
  cssFolder.file('style.css', cssContent);

  // Add js folder
  const jsFolder = root.folder('js');
  jsFolder.file('script.js', jsContent);

  // Add assets folder
  const assetsFolder = root.folder('assets');
  const imagesFolder = assetsFolder.folder('images');
  imagesFolder.file('avatar.svg', avatarSvg);
  imagesFolder.file('favicon.svg', faviconSvg);

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${slug}-portfolio-source.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up object URL after a short timeout
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 1000);

  return {
    success: true,
    fileName: `${slug}-portfolio-source.zip`,
    size: zipBlob.size
  };
};

export const portfolioZipService = {
  downloadPortfolioZip,
  buildPortfolioHtml,
  buildPortfolioCss,
  buildPortfolioJs,
  buildPortfolioReadme
};

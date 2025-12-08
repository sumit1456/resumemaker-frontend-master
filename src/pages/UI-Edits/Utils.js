// templateUtils.js - Utility functions for resume template

/**
 * Default resume data
 */
export const defaultResumeData = {
  resumeDetails: {
    name: "JOHN DOE",
    title: "Senior Software Engineer",
    summary: "Results-driven software engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Expertise in React, Node.js, and cloud architecture with a proven track record of delivering high-impact solutions that drive business growth.",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      location: "San Francisco, CA"
    }
  },
  
  skills: [
    "Languages - JavaScript, TypeScript, Python, Java, SQL",
    "Frontend - React, Vue.js, Next.js, HTML5, CSS3, Tailwind",
    "Backend - Node.js, Express, Django, REST APIs, GraphQL",
    "Database - PostgreSQL, MongoDB, Redis, MySQL",
    "Cloud & DevOps - AWS, Docker, Kubernetes, CI/CD, Terraform",
    "Tools - Git, JIRA, Figma, Postman"
  ],
  
  experiences: [
    {
      position: "Senior Software Engineer",
      company: "Tech Innovations Inc",
      location: "San Francisco, CA",
      duration: "Jan 2020 - Present",
      achievements: [
        "Led development of microservices architecture serving 2M+ users, reducing response time by 40%",
        "Architected and implemented real-time analytics dashboard using React and WebSocket, improving data visibility",
        "Mentored team of 5 junior developers and established code review best practices",
        "Reduced deployment time by 60% through implementation of automated CI/CD pipelines"
      ]
    },
    {
      position: "Software Engineer",
      company: "Digital Solutions Corp",
      location: "Austin, TX",
      duration: "Jun 2017 - Dec 2019",
      achievements: [
        "Built and maintained RESTful APIs handling 500K+ daily requests with 99.9% uptime",
        "Developed responsive web applications using React and Redux, improving user engagement by 35%",
        "Implemented automated testing suite, increasing code coverage from 45% to 85%",
        "Collaborated with product team to deliver features that increased customer retention by 25%"
      ]
    },
    {
      position: "Junior Software Developer",
      company: "StartUp Labs",
      location: "Boston, MA",
      duration: "Jul 2015 - May 2017",
      achievements: [
        "Developed full-stack features for SaaS platform using Node.js and Angular",
        "Optimized database queries reducing page load times by 50%",
        "Participated in agile development process and daily stand-ups"
      ]
    }
  ],
  
  projects: [
    {
      name: "E-Commerce Platform",
      duration: "2023",
      technologies: "React, Node.js, MongoDB, Stripe API, AWS",
      description: [
        "Built full-stack e-commerce platform with payment integration and inventory management",
        "Implemented secure authentication and authorization using JWT and OAuth 2.0",
        "Deployed on AWS with auto-scaling, serving 10K+ concurrent users"
      ]
    },
    {
      name: "Real-Time Chat Application",
      duration: "2022",
      technologies: "React, Socket.io, Redis, Docker",
      description: [
        "Developed real-time messaging application with typing indicators and read receipts",
        "Implemented Redis for session management and message caching",
        "Containerized application using Docker for consistent deployment"
      ]
    }
  ],
  
  educationList: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      year: "2011 - 2015",
      gpa: "3.8",
      location: "Berkeley, CA"
    }
  ],
  
  certifications: [
    "AWS Certified Solutions Architect - Associate (2022)",
    "Google Cloud Professional Developer (2021)",
    "MongoDB Certified Developer (2020)"
  ]
};

/**
 * Default style configuration
 */
export const defaultStyleConfig = {
  // Colors
  primaryColor: '#000000',
  textColor: '#000000',
  accentColor: '#000000',
  backgroundColor: '#FFFFFF',
  
  // Typography
  nameFontSize: 24,
  titleFontSize: 11,
  headerFontSize: 11,
  bodyFontSize: 10,
  smallFontSize: 9,
  lineHeight: 1.4,
  letterSpacing: 0.5,
  
  // Layout
  pageMargin: 40,
  headerMarginBottom: 20,
  columnGap: 15,
  leftColumnWidth: '35%',
  rightColumnWidth: '65%',
  sectionMarginTop: 12,
  sectionMarginBottom: 6,
  itemMarginBottom: 8,
  
  // Borders
  headerBorderWidth: 3,
  sectionBorderWidth: 1.5,
  columnBorderWidth: 2,
  
  // Style Options
  fontFamily: 'Helvetica',
  bulletStyle: '•',
  textTransform: 'uppercase',
};

/**
 * Style presets for different resume styles
 */
export const stylePresets = {
  classic: {
    ...defaultStyleConfig,
    primaryColor: '#000000',
    accentColor: '#000000',
    fontFamily: 'Helvetica',
  },
  
  modern: {
    ...defaultStyleConfig,
    primaryColor: '#2563eb',
    accentColor: '#3b82f6',
    textColor: '#1f2937',
    headerBorderWidth: 2,
    sectionBorderWidth: 1,
    bulletStyle: '▪',
  },
  
  creative: {
    ...defaultStyleConfig,
    primaryColor: '#7c3aed',
    accentColor: '#a78bfa',
    textColor: '#374151',
    nameFontSize: 28,
    bulletStyle: '→',
    letterSpacing: 1,
  },
  
  minimal: {
    ...defaultStyleConfig,
    primaryColor: '#4b5563',
    accentColor: '#9ca3af',
    textColor: '#374151',
    headerBorderWidth: 0,
    sectionBorderWidth: 0,
    columnBorderWidth: 1,
    bulletStyle: '-',
  },
  
  professional: {
    ...defaultStyleConfig,
    primaryColor: '#0f172a',
    accentColor: '#334155',
    textColor: '#1e293b',
    fontFamily: 'Times-Roman',
    nameFontSize: 22,
    headerFontSize: 10,
  }
};

/**
 * Group skills by category
 * @param {Array} skills - Array of skill strings
 * @returns {Object} - Object with grouped and ungrouped skills
 */
export const groupSkills = (skills) => {
  const groupedSkills = {};
  const ungroupedSkills = [];
  
  if (skills && Array.isArray(skills)) {
    skills.forEach(skill => {
      if (skill && skill.includes(' - ')) {
        const [category, values] = skill.split(' - ');
        groupedSkills[category.trim()] = values.trim();
      } else if (skill && skill.trim()) {
        ungroupedSkills.push(skill.trim());
      }
    });
  }
  
  return { groupedSkills, ungroupedSkills };
};

/**
 * Validate resume data structure
 * @param {Object} resumeData - Resume data object
 * @returns {Object} - Validation result with errors array
 */
export const validateResumeData = (resumeData) => {
  const errors = [];
  
  if (!resumeData.resumeDetails?.name) {
    errors.push('Name is required');
  }
  
  if (!resumeData.resumeDetails?.contact?.email) {
    errors.push('Email is required');
  }
  
  if (!resumeData.experiences || resumeData.experiences.length === 0) {
    errors.push('At least one experience is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate style configuration from UI settings
 * @param {Object} uiSettings - Settings from UI editor
 * @returns {Object} - Style configuration for template
 */
export const generateStyleConfig = (uiSettings) => {
  return {
    ...defaultStyleConfig,
    ...uiSettings
  };
};

/**
 * Export resume data as JSON
 * @param {Object} resumeData - Resume data to export
 * @returns {string} - JSON string
 */
export const exportResumeData = (resumeData) => {
  return JSON.stringify(resumeData, null, 2);
};

/**
 * Import resume data from JSON
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} - Parsed resume data or null if invalid
 */
export const importResumeData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    const validation = validateResumeData(data);
    
    if (!validation.isValid) {
      console.error('Invalid resume data:', validation.errors);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to parse resume data:', error);
    return null;
  }
};

/**
 * Calculate optimal font sizes based on content length
 * @param {Object} resumeData - Resume data
 * @returns {Object} - Recommended font size adjustments
 */
export const calculateOptimalFontSizes = (resumeData) => {
  const totalExperiences = resumeData.experiences?.length || 0;
  const totalProjects = resumeData.projects?.length || 0;
  const totalContent = totalExperiences + totalProjects;
  
  // Suggest smaller fonts for content-heavy resumes
  if (totalContent > 8) {
    return {
      bodyFontSize: 9,
      smallFontSize: 8,
      lineHeight: 1.3
    };
  } else if (totalContent > 5) {
    return {
      bodyFontSize: 9.5,
      smallFontSize: 8.5,
      lineHeight: 1.35
    };
  }
  
  return {
    bodyFontSize: 10,
    smallFontSize: 9,
    lineHeight: 1.4
  };
};

/**
 * Color utilities
 */
export const colorUtils = {
  // Convert hex to RGB
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  // Check if color is dark
  isDark: (hex) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return false;
    // Calculate luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5;
  },
  
  // Get contrasting color (black or white)
  getContrastColor: (hex) => {
    return colorUtils.isDark(hex) ? '#FFFFFF' : '#000000';
  }
};


export function mergeResumeData(currentResumeDetails = {}, resumeData = {}) {
  return {
    resumeDetails: {
      name: resumeData.resumeDetails?.name ?? currentResumeDetails.resumeDetails?.name ?? "",
      title: resumeData.resumeDetails?.title ?? currentResumeDetails.resumeDetails?.title ?? "",
      contact: {
        phone: resumeData.resumeDetails?.contact?.phone 
          ?? currentResumeDetails.resumeDetails?.contact?.phone 
          ?? "",
        email: resumeData.resumeDetails?.contact?.email 
          ?? currentResumeDetails.resumeDetails?.contact?.email 
          ?? ""
      },
      summary: resumeData.resumeDetails?.summary 
        ?? currentResumeDetails.resumeDetails?.summary 
        ?? ""
    },

    skills: resumeData.skills ?? currentResumeDetails.skills ?? [],

    experiences: resumeData.experiences ?? currentResumeDetails.experiences ?? [],

    projects: resumeData.projects ?? currentResumeDetails.projects ?? [],

    educationList: resumeData.educationList ?? currentResumeDetails.educationList ?? [],

    certifications: resumeData.certifications ?? currentResumeDetails.certifications ?? []
  };
}

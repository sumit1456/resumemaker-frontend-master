// templateUtils.js - Utility functions for resume template

/**
 * Default resume data
 * 
 */


export const defaultResumeData = {
  resumeDetails: {
    name: "SUMIT HATEKAR",
    title: "Full Stack Developer",
    contact: {
      phone: "+91 9876543210",
      email: "sumithatekar@gmail.com",
      linkedin: "linkedin.com/in/sumithatekar",
      github: "github.com/sumithatekar",
      location: "Pune, India",
    },
    summary: "Passionate Computer Applications student with a strong foundation in Java and Web technologies. I love building things for the web, from backend APIs with Spring Boot to interactive frontend experiences using React and PixiJS. Always curious to learn new technologies and apply them to solve real-world problems.",
  },

  skills: [
    "Programming Languages - Java, JavaScript (ES6+), SQL, HTML/CSS",
    "Databases - PostgreSQL, Oracle SQL, MongoDB, MySQL",
    "Frameworks & Libraries - React.js, Spring Boot, Hibernate",
    "Tools & Platforms - Git, GitHub, Postman, Docker, Maven, VS Code",
    "Soft Skills - Communication, Teamwork, Problem Solving, Agile"
  ],

  experiences: [
    {
      position: "Full Stack Developer (Intern/Project Lead)",
      company: "Technical Projects",
      location: "Pune, India",
      duration: "2023 - Present",
      achievements: [
        "Led the development of a high-performance resume builder platform",
        "Implemented real-time editing features and AI-driven content suggestions"
      ],
    },
  ],

  projects: [
    {
      name: "Resume Maker",
      duration: "September 2025 - December 2025",
      technologies: "React, Java Spring Boot, PostgreSQL, Pixi.js , WebGl, Matter.js, Canvas 2D API",
      description: [
        "Developed a real-time resume builder allowing for instant UI customization and live previews.",
        "Integrated Google Gemini AI to provide automated content optimization and formatting suggestions.",
        "Implemented a PDF data extraction feature to import information from existing resumes seamlessly.",
        "Built a synchronized state management system using React to handle complex layout updates.",
        "Optimized backend API performance using Java Spring Boot and MySQL for efficient data handling."
      ],
      link: "https://resume-maker-pro.netlify.app",
    },
    {
      name: "Find Issue Web Application",
      duration: "June 2023 - August 2023",
      technologies: "Java, Spring Boot, MySQL",
      description: [
        "Created an issue tracking platform to streamline bug reporting and management workflows.",
        "Developed robust RESTful APIs using Spring Boot to handle CRUD operations on software issues.",
        "Designed an intuitive dashboard for monitoring project status and issue life cycles.",
        "Implemented secure database schemas in MySQL for persistent and reliable data storage."
      ],
      link: "https://github.com/sumithatekar/find-issue-app",
    },
    {
      name: "Dom-Webgl Rederer",
      duration: "March 2024 - Present",
      technologies: "PixiJS, WebGL, Matter.js",
      description: [
        "Project lead in building a custom rendering engine using PixiJS and WebGL for high-performance graphics.",
        "Integrated Matter.js to add interactive physics animations, making UI components feel more dynamic.",
        "Developed a bridge between standard HTML elements and GPU-accelerated graphics for smoother visuals.",
        "Created smart snapping and layout guide algorithms to improve precision in UI design tools.",
        "Investigated rendering optimizations to ensure high-frame-rate performance during complex animations."
      ],
      link: "https://github.com/sumithatekar/ui-engine",
    }
  ],

  educationList: [
    {
      degree: "Master of Science in Computer Applications (MSc CA)",
      institution: "Savitribai Phule University",
      location: "Pune, India",
      year: "2025 (Expected)",
      gpa: "89.63% (First Sem)",
    },
    {
      degree: "BSc Chemistry",
      institution: "Shivaji University",
      location: "Koregaon Satara, India",
      year: "2021",
      gpa: "7.52 CGPA",
    },
    {
      degree: "HSC (Science)",
      institution: "Yashwantrao Chavan Institute of Science",
      location: "Satara, India",
      year: "2018",
      gpa: "84%",
    },
  ],

  certifications: [
    "Java Full Stack Development - QSpiders Wakad 2024",
    "Scrum Master Certified",
  ],

  sectionTitles: {
    summary: "Summary",
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    certifications: "Certifications"
  }
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
  globalBulletTop: 0,
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
          ?? "",
        linkedin: resumeData.resumeDetails?.contact?.linkedin
          ?? currentResumeDetails.resumeDetails?.contact?.linkedin
          ?? "",
        github: resumeData.resumeDetails?.contact?.github
          ?? currentResumeDetails.resumeDetails?.contact?.github
          ?? "",
        location: resumeData.resumeDetails?.contact?.location
          ?? currentResumeDetails.resumeDetails?.contact?.location
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












// layoutNormalizer.js
export const normalizeLayoutConfig = (config = {}) => {
  return {
    display: config.display,

    // backward compatibility
    direction: config.flexDirection ?? config.direction,
    align: config.alignItems ?? config.align,
    justify: config.justifyContent ?? config.justify,

    width: config.width,
    height: config.height,

    minWidth: config.minWidth,
    maxWidth: config.maxWidth,

    padding: config.padding,
    margin: config.margin,
    gap: config.gap,

    gridColumns: config.gridTemplateColumns,
    gridRows: config.gridTemplateRows,

    order: config.order,
    flex: config.flex,

    position: config.position,
    top: config.top,
    left: config.left,
  };
};


export const resolveLayoutStyles = (layout = {}) => {
  const isGrid = layout.display === "grid";

  return {
    /* core */
    display: layout.display || "flex",
    boxSizing: "border-box",

    /* flex */
    flexDirection: layout.direction || "row",
    alignItems: layout.align || "stretch",
    justifyContent: layout.justify || "flex-start",
    flexWrap: layout.wrap || "nowrap",

    /* sizing */
    width: layout.width,
    minWidth: layout.minWidth,
    maxWidth: layout.maxWidth,
    height: layout.height,
    minHeight: layout.minHeight,
    maxHeight: layout.maxHeight,

    /* spacing */
    padding: layout.padding,
    margin: layout.margin,
    gap: layout.gap,
    rowGap: layout.rowGap,
    columnGap: layout.columnGap,

    /* ordering */
    order: layout.order,
    flex: layout.flex,

    /* positioning */
    position: layout.position,
    top: layout.top,
    left: layout.left,
    right: layout.right,
    bottom: layout.bottom,

    /* grid */
    ...(isGrid && {
      gridTemplateColumns: layout.gridColumns,
      gridTemplateRows: layout.gridRows,
      gridAutoFlow: layout.gridAutoFlow,
    }),
  };
};


export const resolveZoneLayout = (defaults = {}, zoneConfig = {}) => {
  const merged = {
    ...defaults,
    ...zoneConfig,
  };

  const normalized = normalizeLayoutConfig(merged);
  return resolveLayoutStyles(normalized);
};




/**
 * Layout resolver
 * Converts abstract layout intent → DOM CSS
 * Canvas should read layout intent directly
 */
window.__LAYOUT_DEBUG__ = true;
export function resolveLayout(layout = {}, mode = "dom") {
  if (mode !== "dom") return {};

  const base = {
    display: "flex",
    boxSizing: "border-box",
  };

  const ALIGN_MAP = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };

  const JUSTIFY_MAP = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };

  let resolved = {};

  if (layout.type === "grid") {
    resolved = {
      display: "grid",
      boxSizing: "border-box",
      gridTemplateColumns: layout.columns,
      gridTemplateRows: layout.rows,
      gap: layout.gap || 0,
      rowGap: layout.rowGap,
      columnGap: layout.columnGap,
      alignItems: ALIGN_MAP[layout.align] || "stretch",
      justifyItems: ALIGN_MAP[layout.justify] || "stretch",
    };
  } else if (layout.type === "row") {
    resolved = {
      ...base,
      flexDirection: "row",
      alignItems: ALIGN_MAP[layout.align] || "flex-start",
      justifyContent: JUSTIFY_MAP[layout.justify] || "flex-start",
      gap: layout.gap || 0,
      flexWrap: layout.wrap ? "wrap" : "nowrap",
    };
  } else {
    // default: stack / column
    resolved = {
      ...base,
      flexDirection: "column",
      alignItems: ALIGN_MAP[layout.align] || "flex-start",
      justifyContent: JUSTIFY_MAP[layout.justify] || "flex-start",
      gap: layout.gap || 0,
    };
  }

  // 🔍 DOM debug
  if (window.__LAYOUT_DEBUG__) {
    console.log("resolveLayout output:", layout, resolved);
  }

  return resolved;
}


/**
 * Apply resume data to state setters
 * @param {Object} setters - Object containing state setter functions
 * @param {Object} data - Resume data to apply (defaults to defaultResumeData)
 */
export const applyResumeData = (setters, data = defaultResumeData) => {
  if (!setters) return;

  const {
    setResumeDetails,
    setSkills,
    setExperiences,
    setProjects,
    setEducationList,
    setCertifications,
    setSectionTitles
  } = setters;

  if (setResumeDetails && data.resumeDetails) {
    setResumeDetails(data.resumeDetails);
  }

  if (setSkills && data.skills) {
    setSkills(data.skills);
  }

  if (setExperiences && data.experiences) {
    setExperiences(data.experiences);
  }

  if (setProjects && data.projects) {
    setProjects(data.projects);
  }

  if (setEducationList && data.educationList) {
    setEducationList(data.educationList);
  }

  if (setCertifications && data.certifications) {
    setCertifications(data.certifications);
  }

  if (setSectionTitles && data.sectionTitles) {
    setSectionTitles(data.sectionTitles);
  }
};


export function resolveLayoutForCanvas(layout, containerWidth) {
  // Default values
  const defaultLayout = {
    type: 'stack', // 'stack' for column, 'row' for horizontal
    align: 'start', // vertical alignment for stack
    justify: 'start', // horizontal alignment for row
    gap: 0,
    wrap: false,
  };

  const resolved = { ...defaultLayout, ...layout };

  const alignmentMap = {
    start: 0,
    center: 0.5,
    end: 1,
  };

  const justifyMap = {
    start: 0,
    center: 0.5,
    end: 1,
    between: 'between', // special handling for 'between'
    around: 'around',
    evenly: 'evenly',
  };

  return {
    type: resolved.type,
    align: alignmentMap[resolved.align] !== undefined ? alignmentMap[resolved.align] : 0,
    justify: justifyMap[resolved.justify] || 0,
    gap: resolved.gap || 0,
    wrap: resolved.wrap || false,
    containerWidth: containerWidth,
  };
}



export const applyStyles = (baseStyle = {}, configStyle = {}) => {
  if (!configStyle) return baseStyle;

  const validCSSProps = new Set([
    'alignContent', 'alignItems', 'alignSelf', 'animation', 'animationDelay',
    'animationDirection', 'animationDuration', 'animationFillMode',
    'animationIterationCount', 'animationName', 'animationPlayState',
    'animationTimingFunction', 'backfaceVisibility', 'background',
    'backgroundAttachment', 'backgroundBlendMode', 'backgroundClip',
    'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition',
    'backgroundRepeat', 'backgroundSize', 'border', 'borderBottom',
    'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius',
    'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderColor',
    'borderImage', 'borderImageOutset', 'borderImageRepeat', 'borderImageSlice',
    'borderImageSource', 'borderImageWidth', 'borderLeft', 'borderLeftColor',
    'borderLeftStyle', 'borderLeftWidth', 'borderRadius', 'borderRight',
    'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderSpacing',
    'borderStyle', 'borderTop', 'borderTopColor', 'borderTopLeftRadius',
    'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth', 'borderWidth',
    'bottom', 'boxDecorationBreak', 'boxShadow', 'boxSizing', 'breakAfter',
    'breakBefore', 'breakInside', 'captionSide', 'caretColor', 'clear', 'clip',
    'clipPath', 'color', 'columnCount', 'columnFill', 'columnGap', 'columnRule',
    'columnRuleColor', 'columnRuleStyle', 'columnRuleWidth', 'columnSpan',
    'columnWidth', 'columns', 'content', 'counterIncrement', 'counterReset',
    'cursor', 'direction', 'display', 'emptyCells', 'filter', 'flex',
    'flexBasis', 'flexDirection', 'flexFlow', 'flexGrow', 'flexShrink',
    'flexWrap', 'float', 'font', 'fontFamily', 'fontFeatureSettings',
    'fontKerning', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle',
    'fontSynthesis', 'fontVariant', 'fontVariantCaps', 'fontVariantLigatures',
    'fontVariantNumeric', 'fontVariantPosition', 'fontWeight', 'gap', 'grid',
    'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridColumn',
    'gridColumnEnd', 'gridColumnGap', 'gridColumnStart', 'gridGap', 'gridRow',
    'gridRowEnd', 'gridRowGap', 'gridRowStart', 'gridTemplate', 'gridTemplateAreas',
    'gridTemplateColumns', 'gridTemplateRows', 'height', 'hyphens', 'imageRendering',
    'isolation', 'justifyContent', 'justifyItems', 'justifySelf', 'left',
    'letterSpacing', 'lineBreak', 'lineHeight', 'listStyle', 'listStyleImage',
    'listStylePosition', 'listStyleType', 'margin', 'marginBottom', 'marginLeft',
    'marginRight', 'marginTop', 'mask', 'maskClip', 'maskComposite', 'maskImage',
    'maskMode', 'maskOrigin', 'maskPosition', 'maskRepeat', 'maskSize', 'maskType',
    'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'mixBlendMode', 'objectFit',
    'objectPosition', 'opacity', 'order', 'orphans', 'outline', 'outlineColor',
    'outlineOffset', 'outlineStyle', 'outlineWidth', 'overflow', 'overflowWrap',
    'overflowX', 'overflowY', 'padding', 'paddingBottom', 'paddingLeft',
    'paddingRight', 'paddingTop', 'pageBreakAfter', 'pageBreakBefore',
    'pageBreakInside', 'perspective', 'perspectiveOrigin', 'placeContent', 'placeItems',
    'placeSelf', 'pointerEvents', 'position', 'quotes', 'resize', 'right', 'rowGap',
    'scrollBehavior', 'tabSize', 'tableLayout', 'textAlign', 'textAlignLast',
    'textCombineUpright', 'textDecoration', 'textDecorationColor', 'textDecorationLine',
    'textDecorationStyle', 'textIndent', 'textJustify', 'textOrientation', 'textOverflow',
    'textShadow', 'textTransform', 'textUnderlinePosition', 'top', 'transform',
    'transformOrigin', 'transformStyle', 'transition', 'transitionDelay',
    'transitionDuration', 'transitionProperty', 'transitionTimingFunction',
    'unicodeBidi', 'userSelect', 'verticalAlign', 'visibility', 'whiteSpace',
    'widows', 'width', 'willChange', 'wordBreak', 'wordSpacing', 'wordWrap',
    'writingMode', 'zIndex'
  ]);

  // Merge base + config first
  const merged = { ...baseStyle, ...configStyle };

  // Handle shorthand vs longhand conflicts
  const shorthandMap = {
    margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    border: ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'],
    borderWidth: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
    borderStyle: ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'],
    borderColor: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']
  };

  Object.keys(shorthandMap).forEach(shorthand => {
    const longhands = shorthandMap[shorthand];
    const hasLonghand = longhands.some(prop => merged[prop] !== undefined);
    if (hasLonghand && merged[shorthand] !== undefined) {
      delete merged[shorthand];
    }
  });

  // Filter only valid CSS properties
  Object.keys(merged).forEach(key => {
    if (!validCSSProps.has(key)) {
      delete merged[key];
    }
  });

  return merged;
};

// ==================== TWO COLUMN TEMPLATE ====================

export const TWO_COLUMN_TEMPLATE_CONFIG = {
  id: "two-column-professional",
  name: "Two Column Professional",

  // Default section positions for this template
  positions: {
    header: { x: 20, y: 20, scaleX: 1, scaleY: 1 },
    summary: { x: 273, y: 410, scaleX: 1, scaleY: 1 },
    skills: { x: 20, y: 200, scaleX: 1, scaleY: 1 },
    experience: { x: 273, y: 200, scaleX: 1, scaleY: 1 },
    projects: { x: 273, y: 520, scaleX: 1, scaleY: 1 },
    education: { x: 25, y: 450, scaleX: 1, scaleY: 1 },
    certifications: { x: 20, y: 750, scaleX: 1, scaleY: 1 }
  },

  // Default line positions for this template
  lines: [
    {
      id: 1,
      x1: 260,
      y1: 0,
      x2: 260,
      y2: 842,
      color: '#000000',
      thickness: 2,
      orientation: 'vertical',
      label: 'Column Divider'
    },
    {
      id: 2,
      x1: 20,
      y1: 180,
      x2: 240,
      y2: 180,
      color: '#000000',
      thickness: 1,
      orientation: 'horizontal',
      label: 'Left Header Divider'
    },
    {
      id: 3,
      x1: 273,
      y1: 100,
      x2: 560,
      y2: 100,
      color: '#000000',
      thickness: 1,
      orientation: 'horizontal',
      label: 'Right Header Divider'
    }
  ],

  // No shapes for TWO_COLUMN template
  shapes: [],

  // Page Configuration
  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
  },

  // Section Styles
  header: {
    container: {
      width: "730px",
      backgroundColor: "red",
      padding: "0"
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "8px" },
    nameSection: { display: "flex", flexDirection: "column", gap: "0" },
    nameStyle: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#000000",
      letterSpacing: "1px",
      lineHeight: "1.2"
    },
    titleStyle: {
      fontSize: "13px",
      fontWeight: "normal",
      color: "#000000",
      marginTop: "6px"
    },
    showTitle: true,
    showContact: true,
    contactLayout: {
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      marginTop: "10px"
    },
    contactOrder: ["phone", "email", "linkedin", "github", "location"],
    contactItemStyle: { fontSize: "9px", color: "#000000", lineHeight: "1.4" },
    showContactIcons: true,
    showDivider: true,
    dividerStyle: "2px solid #000000",
    dividerMarginTop: "10px",
    dividerMarginBottom: "0"
  },

  summary: {
    container: {
      width: "480px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      borderBottom: "2px solid #000000",
      marginBottom: "6px",
      paddingBottom: "0px",
      letterSpacing: "0.5px"
    },
    bodyStyle: {
      fontSize: "10px",
      color: "#000000",
      lineHeight: "1.6",
      textAlign: "justify"
    }
  },

  skills: {
    container: {
      width: "230px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      borderBottom: "2px solid #000000",
      marginBottom: "8px",
      paddingBottom: "0px",
      letterSpacing: "0.5px"
    },
    contentLayout: { display: "flex", flexDirection: "column", gap: "10px" },
    showCategories: true,
    categoryStyle: {
      fontSize: "10px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "4px"
    },
    valueStyle: {
      fontSize: "9px",
      color: "#000000",
      lineHeight: "1.5"
    },
    displayType: "inline",
    separator: ", ",
    itemMarginBottom: "6px"
  },

  experience: {
    container: {
      width: "480px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      borderBottom: "2px solid #000000",
      marginBottom: "8px",
      paddingBottom: "4px",
      letterSpacing: "0.5px"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "2px"
    },
    subHeaderLayout: {
      display: "flex",
      marginBottom: "6px"
    },
    positionFirst: true,
    positionStyle: {
      fontSize: "11px",
      fontWeight: "bold",
      color: "#000000"
    },
    companyStyle: {
      fontSize: "10px",
      color: "#000000",
      fontStyle: "italic"
    },
    durationStyle: {
      fontSize: "9px",
      fontStyle: "italic",
      color: "#000000",
      whiteSpace: "nowrap"
    },
    showLocation: true,
    showAchievements: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "3px"
    },
    itemMarginBottom: "10px",
    itemStyle: { padding: "0" }
  },

  projects: {
    container: {
      width: "480px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      borderBottom: "2px solid #000000",
      marginBottom: "8px",
      paddingBottom: "4px",
      letterSpacing: "0.5px"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "3px"
    },
    nameStyle: {
      fontSize: "11px",
      fontWeight: "bold",
      color: "#000000"
    },
    durationStyle: {
      fontSize: "9px",
      fontStyle: "italic",
      color: "#000000",
      whiteSpace: "nowrap"
    },
    techStyle: {
      fontSize: "9px",
      fontStyle: "italic",
      color: "#000000",
      marginBottom: "6px"
    },
    showDuration: true,
    showTechnologies: true,
    showDescription: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "3px"
    },
    itemMarginBottom: "10px",
    itemStyle: { padding: "0" }
  },

  education: {
    container: {
      width: "230px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      borderBottom: "2px solid #000000",
      marginBottom: "8px",
      paddingBottom: "4px",
      letterSpacing: "0.5px"
    },
    degreeStyle: {
      fontSize: "10px",
      fontWeight: "bold",
      color: "#000000",
      lineHeight: "1.5",
      marginBottom: "1px"
    },
    institutionStyle: {
      fontSize: "9px",
      color: "#000000",
      lineHeight: "1.5",
      fontStyle: "italic",
      marginBottom: "1px"
    },
    detailsLayout: {
      display: "flex",
      flexDirection: "column",
      gap: "2px"
    },
    detailsStyle: {
      fontSize: "9px",
      fontStyle: "italic",
      color: "#000000",
      lineHeight: "1.5"
    },
    showInstitution: true,
    showGpa: true,
    showLocation: true,
    gpaPrefix: "GPA: ",
    itemMarginBottom: "8px",
    itemStyle: { padding: "0" }
  },

  certifications: {
    container: {
      width: "230px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      borderBottom: "2px solid #000000",
      marginBottom: "8px",
      paddingBottom: "4px",
      letterSpacing: "0.5px"
    },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "5px"
    },
    itemStyle: {
      fontSize: "9px",
      color: "#000000",
      marginBottom: "5px"
    }
  }
};

// ==================== ATS TEMPLATE (SINGLE COLUMN) ====================

export const ATS_TEMPLATE_CONFIG = {
  id: "ats-optimized",
  name: "ATS Optimized",

  // Default section positions and heights for ATS template (user custom)
  positions: {
    header: { x: 7, y: 19, height: 64, scaleX: 1, scaleY: 1 },
    summary: { x: 7, y: 107, height: 117, scaleX: 1, scaleY: 1 },
    skills: { x: 7, y: 220, height: 132, scaleX: 1, scaleY: 1 },
    projects: { x: 7, y: 499, height: 290, scaleX: 1, scaleY: 1 },
    experience: { x: 7, y: 668, height: 120, scaleX: 1, scaleY: 1 },
    education: { x: 7, y: 858, height: 80, scaleX: 1, scaleY: 1 },
    certifications: { x: 7, y: 878, height: 80, scaleX: 1, scaleY: 1 }
  },
  // ...

  // Lines for ATS template (divider just below section title)
  lines: [

  ],

  // No shapes for ATS template
  shapes: [],

  // Page Configuration
  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
  },

  // Header Section
  header: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0"
    },

    mainLayout: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    nameSection: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center"
    },
    contactLayout: {
      display: "flex",
      flexDirection: "row",      // Split into left and right
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
      flexWrap: "nowrap",
      marginTop: "8px"
    },
    // Split contact into two groups
    contactLeftGroup: ["phone", "email"],  // Left side items
    contactRightGroup: ["linkedin", "github", "location"],  // Right side items

    nameStyle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#000000",
      textAlign: "center"
    },
    titleStyle: {
      fontSize: "14px",
      fontWeight: "normal",
      color: "#c53a3a",
      textAlign: "center"
    },
    showTitle: true,
    showContact: true,

    contactOrder: ["phone", "email", "linkedin", "location"],
    contactItemStyle: {
      fontSize: "9px",
      color: "#000000"
    },
    showContactIcons: true,
    showDivider: true,
    dividerStyle: "2px solid #000000",
    dividerMarginTop: "8px",
    dividerMarginBottom: "0"
  },





  summary: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "5px", paddingBottom: "0px" },
    bodyStyle: { fontSize: "10px", color: "#000000", lineHeight: "1.5", textAlign: "justify" }
  },

  skills: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "5px", paddingBottom: "0px" },
    contentLayout: { display: "flex", flexDirection: "column", gap: "1px" },
    showCategories: true,
    categoryStyle: { fontSize: "10px", fontWeight: "bold", color: "#000000" },
    valueStyle: { fontSize: "9px", color: "#000000", lineHeight: "1.4" },
    displayType: "inline",
    separator: ", ",
    itemMarginBottom: "2px"
  },

  experience: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "5px", paddingBottom: "0px" },
    headerLayout: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", marginBottom: "2px" },
    subHeaderLayout: { display: "flex", marginBottom: "4px" },
    positionFirst: true,
    positionStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    companyStyle: { fontSize: "10px", color: "#000000" },
    durationStyle: { fontSize: "9px", fontStyle: "italic", color: "#666666", whiteSpace: "nowrap" },
    showLocation: true,
    showAchievements: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "10px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.4",
      itemMarginBottom: "2px"
    },
    itemMarginBottom: "8px"
  },

  projects: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "5px", paddingBottom: "0px" },
    headerLayout: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", marginBottom: "2px" },
    nameStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    durationStyle: { fontSize: "9px", fontStyle: "italic", color: "#666666", whiteSpace: "nowrap" },
    techStyle: { fontSize: "9px", fontStyle: "italic", color: "#000000", marginBottom: "4px" },
    showDuration: true,
    showTechnologies: true,
    showDescription: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "10px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.4",
      itemMarginBottom: "2px"
    },
    itemMarginBottom: "7px",
    itemStyle: { padding: "0" }
  },

  education: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "5px", paddingBottom: "0px" },
    degreeStyle: { fontSize: "10px", fontWeight: "bold", color: "#000000", lineHeight: "1.4" },
    institutionStyle: { fontSize: "9px", color: "#000000", lineHeight: "1.4" },
    detailsLayout: { display: "flex", gap: "8px", flexWrap: "wrap" },
    detailsStyle: { fontSize: "9px", fontStyle: "italic", color: "#666666", lineHeight: "1.4" },
    showInstitution: true,
    showGpa: true,
    showLocation: false,
    gpaPrefix: "GPA: ",
    itemMarginBottom: "6px",
    itemStyle: { padding: "0" }
  },

  certifications: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "5px", paddingBottom: "0px" },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "10px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.4",
      itemMarginBottom: "2px"
    },
    itemStyle: { fontSize: "9px", color: "#000000", marginBottom: "2px" }
  }
};


// export const ATS_TEMPLATE_CONFIG = {
//   id: "ats-optimized",
//   name: "ATS Optimized",

//   /* ================= PAGE ================= */
//   page: {
//     width: 595,   // A4 @ 72dpi
//     height: 842,
//     backgroundColor: "#FFFFFF",
//     fontFamily: "Arial"
//   },

//   /* ================= POSITIONS ================= */
//   positions: {
//     header:        { x: 7, y: 19,  height: 64,  scaleX: 1, scaleY: 1 },
//     summary:       { x: 7, y: 107, height: 117, scaleX: 1, scaleY: 1 },
//     skills:        { x: 7, y: 200, height: 132, scaleX: 1, scaleY: 1 },
//     projects:      { x: 7, y: 355, height: 290, scaleX: 1, scaleY: 1 },
//     experience:    { x: 7, y: 668, height: 120, scaleX: 1, scaleY: 1 },
//     education:     { x: 7, y: 758, height: 80,  scaleX: 1, scaleY: 1 },
//     certifications:{ x: 7, y: 838, height: 80,  scaleX: 1, scaleY: 1 }
//   },

//   /* ================= LINES ================= */
//   lines: [
//     { id: 2, y: 99,  label: "Summary Divider" },
//     { id: 3, y: 200, label: "Skills Divider" },
//     { id: 4, y: 350, label: "Projects Divider" },
//     { id: 5, y: 648, label: "Experience Divider" },
//     { id: 6, y: 758, label: "Education Divider" },
//     { id: 7, y: 838, label: "Certifications Divider" }
//   ].map(l => ({
//     ...l,
//     x1: 18,
//     x2: 555,
//     thickness: 1.5,
//     color: "#000000",
//     orientation: "horizontal"
//   })),

//   shapes: [],

//   /* ================= HEADER ================= */
//   header: {
//     container: {
//       width: 500,
//       padding: 0
//     },

//     layout: {
//       type: "stack",
//       align: "center",
//       gap: 8
//     },

//     nameBlock: {
//       layout: {
//         type: "stack",
//         align: "center",
//         gap: 4
//       }
//     },

//     contactBlock: {
//       layout: {
//         type: "row",
//         align: "center",
//         justify: "center",
//         gap: 12,
//         wrap: false
//       }
//     },

//     nameStyle: {
//       fontSize: 24,
//       fontWeight: 700,
//       color: "#000000",
//       align: "center"
//     },

//     titleStyle: {
//       fontSize: 14,
//       fontWeight: 400,
//       color: "#c53a3a",
//       align: "center"
//     },

//     contactItemStyle: {
//       fontSize: 9,
//       color: "#000000"
//     },

//     contactOrder: ["email", "phone", "linkedin", "location"],

//     showTitle: true,
//     showContact: true,

//     divider: {
//       show: true,
//       thickness: 2,
//       color: "#000000",
//       marginTop: 8,
//       marginBottom: 0
//     }
//   },

//   /* ================= SUMMARY ================= */
//   summary: {
//     container: { width: 550 },

//     showTitle: true,

//     titleStyle: {
//       fontSize: 12,
//       fontWeight: 700
//     },

//     bodyStyle: {
//       fontSize: 10,
//       lineHeight: 1.5,
//       align: "justify"
//     }
//   },

//   /* ================= SKILLS ================= */
//   skills: {
//     container: { width: 550 },

//     showTitle: true,

//     titleStyle: {
//       fontSize: 12,
//       fontWeight: 700
//     },

//     contentLayout: {
//       type: "stack",
//       gap: 6
//     },

//     showCategories: true,

//     categoryStyle: {
//       fontSize: 10,
//       fontWeight: 700
//     },

//     valueStyle: {
//       fontSize: 9,
//       lineHeight: 1.4
//     },

//     displayType: "inline",
//     separator: ", ",
//     itemMarginBottom: 8
//   },

//   /* ================= EXPERIENCE ================= */
//   experience: {
//     container: { width: 550 },

//     showTitle: true,

//     titleStyle: {
//       fontSize: 12,
//       fontWeight: 700
//     },

//     headerLayout: {
//       type: "row",
//       justify: "space-between",
//       wrap: true,
//       gap: 4
//     },

//     subHeaderLayout: {
//       type: "row",
//       gap: 4
//     },

//     positionStyle: {
//       fontSize: 11,
//       fontWeight: 700
//     },

//     companyStyle: {
//       fontSize: 10
//     },

//     durationStyle: {
//       fontSize: 9,
//       italic: true,
//       noWrap: true
//     },

//     showLocation: true,

//     bullet: {
//       symbol: "•",
//       width: 10,
//       fontSize: 9,
//       lineHeight: 1.4,
//       color: "#000000",
//       marginBottom: 3
//     },

//     itemMarginBottom: 12
//   },

//   /* ================= PROJECTS ================= */
//   projects: {
//     container: { width: 550 },

//     showTitle: true,

//     titleStyle: {
//       fontSize: 12,
//       fontWeight: 700
//     },

//     headerLayout: {
//       type: "row",
//       justify: "space-between",
//       wrap: true,
//       gap: 4
//     },

//     nameStyle: {
//       fontSize: 11,
//       fontWeight: 700
//     },

//     durationStyle: {
//       fontSize: 9,
//       italic: true
//     },

//     techStyle: {
//       fontSize: 9,
//       italic: true
//     },

//     showTechnologies: true,

//     bullet: {
//       symbol: "•",
//       width: 10,
//       fontSize: 9,
//       lineHeight: 1.4,
//       marginBottom: 3
//     },

//     itemMarginBottom: 11
//   },

//   /* ================= EDUCATION ================= */
//   education: {
//     container: { width: 550 },

//     showTitle: true,

//     titleStyle: {
//       fontSize: 12,
//       fontWeight: 700
//     },

//     degreeStyle: {
//       fontSize: 10,
//       fontWeight: 700
//     },

//     institutionStyle: {
//       fontSize: 9
//     },

//     metaStyle: {
//       fontSize: 9,
//       italic: true
//     },

//     metaLayout: {
//       type: "row",
//       gap: 8,
//       wrap: true
//     },

//     showGpa: true,
//     showLocation: false,

//     itemMarginBottom: 10
//   },

//   /* ================= CERTIFICATIONS ================= */
//   certifications: {
//     container: { width: 550 },

//     showTitle: true,

//     titleStyle: {
//       fontSize: 12,
//       fontWeight: 700
//     },

//     bullet: {
//       symbol: "•",
//       width: 10,
//       fontSize: 9,
//       lineHeight: 1.4,
//       marginBottom: 4
//     },

//     itemStyle: {
//       fontSize: 9
//     }
//   }
// };


// ==================== MODERN TEMPLATE ====================


export const MODERN_TEMPLATE_CONFIG = {
  id: "modern-ats-two-column",
  name: "Modern ATS (Two Column)",

  // --- 1. Global Positions ---
  // Note: These positions are relative to the main resume container, 
  // not the canvas. They MUST be updated in the UIEditor to be relative 
  // to the respective column (or updated in the UIEditor logic to handle
  // two-column flow). For now, we'll place them logically.
  positions: {
    // Left Column Positions (on black background)
    header: { x: 46, y: 23, scaleX: 1, scaleY: 1 },
    contact: { x: 46, y: 180, scaleX: 1, scaleY: 1 },
    skills: { x: 46, y: 231, scaleX: 1, scaleY: 1 },
    education: { x: 46, y: 560, scaleX: 1, scaleY: 1 },

    // Right Column Positions (on white background)
    summary: { x: 305, y: 15, scaleX: 1, scaleY: 1 },
    experience: { x: 305, y: 194, scaleX: 1, scaleY: 1 },
    projects: { x: 305, y: 348, scaleX: 1, scaleY: 1 },
    certifications: { x: 46, y: 900, scaleX: 1, scaleY: 1 }
  },

  lines: [
    { id: 1, x1: 240, y1: 0, x2: 240, y2: 842, color: '#CCCCCC', thickness: 1, orientation: 'vertical', label: 'Divider' }
  ],

  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
  },


  shapes: [
    {
      id: 99,
      type: "rect",
      x: 0,
      y: 0,
      width: 260,      // Cover left column (approx)
      height: 842,     // Full page height
      color: "#1A1A1A", // Dark background color
      draggable: false,
      selectable: false
    }
  ],


  // --- 2. Left Column Styles (Black Sidebar Sections) ---

  header: {
    container: {
      // This section must span the entire top width or be split manually in the UI code
      width: "250px",
      backgroundColor: "transparent",
      padding: "0",
      color: "#FFFFFF",
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "2px" },
    nameSection: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
    nameStyle: { fontSize: "20px", fontWeight: "900", color: "#FFFFFF", textTransform: "uppercase" },
    titleStyle: { fontSize: "12px", fontWeight: "normal", color: "#F0F0F0", marginTop: "4px" },
    showTitle: true,
    showTitle: true,
    showContact: true,

    // Contact Configuration moved to header
    contactLayout: {
      display: "flex",
      flexDirection: "row",
      gap: "12px",
      marginTop: "8px",
      justifyContent: "flex-start",
      flexWrap: "wrap"
    },
    contactOrder: ["phone", "email", "linkedin", "location"],
    contactItemStyle: { fontSize: "px", color: "#FFFFFF" },
    showContactIcons: true,
    contactIconColor: "#FFFFFF",

    // Split layout support (optional defaults)
    contactLeftGroup: ["phone", "email"],
    contactRightGroup: ["linkedin", "location"],
  },

  // Contact section removed (now part of header)

  skills: {
    container: {
      width: "250px",
      backgroundColor: "transparent",
      padding: "0",
      color: "#FFFFFF",
    },
    showTitle: true,
    titleStyle: { fontSize: "14px", fontWeight: "bold", color: "#FFFFFF", marginBottom: "8px", textTransform: "uppercase" },
    contentLayout: { display: "flex", flexDirection: "column", gap: "6px" },
    showCategories: true,
    categoryStyle: { fontSize: "10px", fontWeight: "bold", color: "#FFFFFF" },
    valueStyle: { fontSize: "9px", color: "#F0F0F0", lineHeight: "1.4" },
    displayType: "inline", // Inline text within valueStyle
    separator: ", ",
    itemMarginBottom: "8px"
  },

  education: {
    container: {
      width: "300px",
      backgroundColor: "transparent",
      padding: "0",
      color: "#FFFFFF",
    },
    showTitle: true,
    titleStyle: { fontSize: "14px", fontWeight: "bold", color: "#FFFFFF", marginBottom: "8px", textTransform: "uppercase" },
    degreeStyle: { fontSize: "11px", fontWeight: "bold", color: "#FFFFFF", lineHeight: "1.4" },
    institutionStyle: { fontSize: "10px", color: "#F0F0F0", lineHeight: "1.4" },
    detailsLayout: { display: "flex", flexDirection: "column", gap: "2px" },
    detailsStyle: { fontSize: "9px", fontStyle: "normal", color: "#CCCCCC", lineHeight: "1.4" },
    showInstitution: true,
    showGpa: true,
    showLocation: true,
    gpaPrefix: "GPA: ",
    itemMarginBottom: "10px"
  },

  certifications: {
    container: {
      width: "400px", // Right column width
      backgroundColor: "transparent",
      padding: "0",
    },
    showTitle: true,
    titleStyle: { fontSize: "14px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "8px", paddingBottom: "3px" },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "15px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "4px"
    },
    itemStyle: { fontSize: "10px", color: "#000000", marginBottom: "4px" }
  },

  // --- 3. Right Column Styles (White Main Content) ---

  summary: {
    container: {
      width: "350px", // Main content width
      backgroundColor: "transparent",
      padding: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "8px",
      paddingBottom: "3px",
      letterSpacing: "1px",
      textTransform: "uppercase"
    },
    bodyStyle: { fontSize: "10px", color: "#000000", lineHeight: "1.5", textAlign: "left" }
  },

  experience: {
    container: {
      width: "400px",
      backgroundColor: "transparent",
      padding: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "8px",
      paddingBottom: "3px",
      letterSpacing: "1px",
      textTransform: "uppercase"
    },
    headerLayout: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", marginBottom: "2px" },
    subHeaderLayout: { display: "flex", marginBottom: "4px", fontStyle: "italic" },
    positionFirst: true,
    positionStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    companyStyle: { fontSize: "10px", color: "#444444" },
    durationStyle: { fontSize: "9px", fontStyle: "normal", color: "#444444", whiteSpace: "nowrap" },
    showLocation: true,
    showAchievements: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "15px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "3px"
    },
    itemMarginBottom: "12px"
  },

  projects: {
    container: {
      width: "400px",
      backgroundColor: "transparent",
      padding: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "8px",
      paddingBottom: "3px",
      letterSpacing: "1px",
      textTransform: "uppercase"
    },
    headerLayout: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", marginBottom: "2px" },
    nameStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    durationStyle: { fontSize: "9px", fontStyle: "normal", color: "#444444", whiteSpace: "nowrap" },
    techStyle: { fontSize: "9px", fontStyle: "italic", color: "#666666", marginBottom: "4px" },
    showDuration: true,
    showTechnologies: true,
    showDescription: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "15px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "3px"
    },
    itemMarginBottom: "12px"
  },
};

// export const TEMPLATE5_CONFIG = {
//   id: "modern-two-column-sidebar",
//   name: "Modern Two Column (Sidebar)",

//   // --- 1. Global Positions ---
//   positions: {
//     // Full width header
//     header: { x: 0, y: 0, scaleX: 1, scaleY: 1 },

//     // Left Column Positions (on gray background)
//     skills: { x: 40, y: 200, scaleX: 1, scaleY: 1 },
//     education: { x: 40, y: 400, scaleX: 1, scaleY: 1 },
//     certifications: { x: 40, y: 600, scaleX: 1, scaleY: 1 },

//     // Right Column Positions (on white background)
//     summary: { x: 320, y: 200, scaleX: 1, scaleY: 1 },
//     experience: { x: 320, y: 300, scaleX: 1, scaleY: 1 },
//     projects: { x: 320, y: 550, scaleX: 1, scaleY: 1 },
//   },

//   lines: [],

//   page: {
//     width: "210mm",
//     height: "297mm",
//     backgroundColor: "#FFFFFF",
//     fontFamily: "Helvetica, sans-serif",
//   },

//   shapes: [
//     {
//       id: 1,
//       type: "rect",
//       x: 595,      // Right edge decorative stripe
//       y: 0,
//       width: 8,
//       height: 180,  // Header height
//       color: "#E74C3C",
//       draggable: false,
//       selectable: false
//     },
//     {
//       id: 2,
//       type: "rect",
//       x: 0,
//       y: 180,      // After header
//       width: 227,   // Left column width (38% of 595)
//       height: 662,  // Remaining page height
//       color: "#ECF0F1", // Gray background
//       draggable: false,
//       selectable: false
//     }
//   ],

//   // --- 2. Header Section (Full Width, Dark Background) ---
//   header: {
//     container: { 
//       width: "595px",
//       backgroundColor: "#2C3E50",
//       padding: "40px 40px 30px 40px",
//       color: "#FFFFFF",
//       position: "relative",
//     },
//     mainLayout: { display: "flex", flexDirection: "column", gap: "8px" },
//     nameSection: { display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: "8px" },
//     nameStyle: { fontSize: "32px", fontWeight: "bold", color: "#FFFFFF", letterSpacing: "1px", marginBottom: "4px" },
//     titleStyle: { fontSize: "14px", fontWeight: "normal", color: "#E74C3C", letterSpacing: "2px", textTransform: "uppercase" },
//     showTitle: true,
//     showContact: true,
//     contactLayout: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "15px", marginTop: "20px" },
//     contactItemStyle: { fontSize: "9px", color: "#BDC3C7", display: "flex", flexDirection: "row", alignItems: "center", marginRight: "20px" },
//     contactOrder: ["phone", "email", "linkedin", "location"],
//     showContactIcons: true,
//     contactIconStyle: { width: "4px", height: "4px", backgroundColor: "#E74C3C", borderRadius: "2px", marginRight: "8px" },
//     showDivider: false,
//   },

//   // --- 3. Left Column Styles (Gray Sidebar Sections) ---

//   skills: {
//     container: { 
//       width: "227px",
//       backgroundColor: "transparent", 
//       padding: "30px",
//       paddingTop: "35px",
//       color: "#2C3E50",
//     },
//     showTitle: true,
//     titleStyle: { 
//       fontSize: "12px", 
//       fontWeight: "bold", 
//       color: "#2C3E50", 
//       marginBottom: "15px", 
//       paddingBottom: "8px",
//       borderBottom: "2px solid #E74C3C",
//       textTransform: "uppercase",
//       letterSpacing: "1.5px"
//     },
//     contentLayout: { display: "flex", flexDirection: "column", gap: "10px" },
//     showCategories: false,
//     displayType: "list",
//     valueStyle: { fontSize: "9px", color: "#2C3E50", lineHeight: "1.5" },
//     categoryStyle: { fontSize: "10px", fontWeight: "bold", color: "#2C3E50", marginBottom: "4px" },
//     bulletConfig: {
//       bulletStyle: "•",
//       bulletWidth: "10px",
//       bulletColor: "#E74C3C",
//       textSize: "9px",
//       textColor: "#34495E",
//       lineHeight: "1.5",
//       itemMarginBottom: "4px"
//     },
//     itemMarginBottom: "25px"
//   },

//   education: {
//     container: { 
//       width: "227px",
//       backgroundColor: "transparent",
//       padding: "0 30px",
//       color: "#2C3E50",
//     },
//     showTitle: true,
//     titleStyle: { 
//       fontSize: "12px", 
//       fontWeight: "bold", 
//       color: "#2C3E50", 
//       marginBottom: "15px", 
//       paddingBottom: "8px",
//       borderBottom: "2px solid #E74C3C",
//       textTransform: "uppercase",
//       letterSpacing: "1.5px"
//     },
//     degreeStyle: { fontSize: "10.5px", fontWeight: "bold", color: "#2C3E50", marginBottom: "3px", lineHeight: "1.3" },
//     institutionStyle: { fontSize: "9.5px", color: "#7F8C8D", marginBottom: "2px" },
//     detailsLayout: { display: "flex", flexDirection: "column", gap: "0px" },
//     detailsStyle: { fontSize: "8.5px", fontStyle: "italic", color: "#95A5A6" },
//     showInstitution: true,
//     showGpa: true,
//     showLocation: false,
//     gpaPrefix: "GPA: ",
//     itemMarginBottom: "16px",
//     itemStyle: {
//       marginBottom: "16px",
//       paddingLeft: "12px",
//       borderLeft: "2px solid #E74C3C"
//     }
//   },

//   certifications: {
//     container: { 
//       width: "227px",
//       backgroundColor: "transparent",
//       padding: "0 30px",
//     },
//     showTitle: true,
//     titleStyle: { 
//       fontSize: "12px", 
//       fontWeight: "bold", 
//       color: "#2C3E50", 
//       marginBottom: "15px", 
//       paddingBottom: "8px",
//       borderBottom: "2px solid #E74C3C",
//       textTransform: "uppercase",
//       letterSpacing: "1.5px"
//     },
//     displayType: "list",
//     bulletConfig: {
//       bulletStyle: "dot", // Circular dot
//       bulletWidth: "5px",
//       bulletHeight: "5px",
//       bulletColor: "#E74C3C",
//       bulletRadius: "2.5px",
//       bulletMarginRight: "10px",
//       bulletMarginTop: "4px",
//       textSize: "9px",
//       textColor: "#2C3E50",
//       lineHeight: "1.4",
//       itemMarginBottom: "8px"
//     },
//     itemStyle: { fontSize: "9px", color: "#2C3E50", marginBottom: "8px" }
//   },

//   // --- 4. Right Column Styles (White Main Content) ---

//   summary: {
//     container: { 
//       width: "368px", // 62% of page width
//       backgroundColor: "transparent",
//       padding: "35px",
//       paddingTop: "35px",
//     },
//     showTitle: true,
//     titleStyle: { 
//       fontSize: "13px", 
//       fontWeight: "bold", 
//       color: "#2C3E50", 
//       marginBottom: "16px", 
//       marginTop: "0px",
//       paddingLeft: "12px",
//       borderLeft: "4px solid #E74C3C",
//       textTransform: "uppercase",
//       letterSpacing: "1.5px"
//     },
//     bodyStyle: { fontSize: "10px", color: "#34495E", lineHeight: "1.7", textAlign: "justify" },
//     valueStyle: { fontSize: "10px", color: "#34495E", lineHeight: "1.7", textAlign: "justify" },
//     categoryStyle: { fontSize: "10px", color: "#2C3E50" },
//     bulletConfig: {
//       bulletStyle: "•",
//       bulletWidth: "10px",
//       bulletColor: "#E74C3C",
//       textSize: "9px",
//       textColor: "#34495E",
//       lineHeight: "1.5",
//       itemMarginBottom: "4px"
//     }
//   },

//   experience: {
//     container: { 
//       width: "368px",
//       backgroundColor: "transparent",
//       padding: "0 35px",
//     },
//     showTitle: true,
//     titleStyle: { 
//       fontSize: "13px", 
//       fontWeight: "bold", 
//       color: "#2C3E50", 
//       marginBottom: "16px", 
//       marginTop: "25px",
//       paddingLeft: "12px",
//       borderLeft: "4px solid #E74C3C",
//       textTransform: "uppercase",
//       letterSpacing: "1.5px"
//     },
//     headerLayout: { display: "flex", flexDirection: "column", gap: "3px", marginBottom: "6px" },
//     subHeaderLayout: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
//     positionFirst: true,
//     positionStyle: { fontSize: "11.5px", fontWeight: "bold", color: "#2C3E50", marginBottom: "3px" },
//     companyStyle: { fontSize: "10px", color: "#E74C3C", marginBottom: "2px" },
//     durationStyle: { fontSize: "9px", fontStyle: "italic", color: "#95A5A6" },
//     locationStyle: { fontSize: "9px", fontStyle: "italic", color: "#7F8C8D" },
//     showLocation: true,
//     showAchievements: true,
//     bulletConfig: {
//       bulletStyle: "▸",
//       bulletWidth: "12px",
//       bulletColor: "#E74C3C",
//       textSize: "9.5px",
//       textColor: "#34495E",
//       lineHeight: "1.6",
//       itemMarginBottom: "5px"
//     },
//     itemMarginBottom: "20px"
//   },

//   projects: {
//     container: { 
//       width: "368px",
//       backgroundColor: "transparent",
//       padding: "0 35px",
//     },
//     showTitle: true,
//     titleStyle: { 
//       fontSize: "13px", 
//       fontWeight: "bold", 
//       color: "#2C3E50", 
//       marginBottom: "16px", 
//       marginTop: "25px",
//       paddingLeft: "12px",
//       borderLeft: "4px solid #E74C3C",
//       textTransform: "uppercase",
//       letterSpacing: "1.5px"
//     },
//     headerLayout: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0px", marginBottom: "4px", alignItems: "flex-start" },
//     nameStyle: { fontSize: "11px", fontWeight: "bold", color: "#2C3E50", flex: "1" },
//     durationStyle: { fontSize: "8.5px", fontStyle: "italic", color: "#95A5A6" },
//     techStyle: { fontSize: "8.5px", fontStyle: "normal", fontWeight: "bold", color: "#E74C3C", marginBottom: "6px" },
//     linkStyle: { fontSize: "8px", color: "#3498DB", marginBottom: "6px" },
//     showDuration: true,
//     showTechnologies: true,
//     showDescription: true,
//     showLink: true,
//     bulletConfig: {
//       bulletStyle: "•",
//       bulletWidth: "10px",
//       bulletColor: "#E74C3C",
//       textSize: "9px",
//       textColor: "#34495E",
//       lineHeight: "1.5",
//       itemMarginBottom: "4px"
//     },
//     itemMarginBottom: "16px",
//     itemStyle: {
//       marginBottom: "16px",
//       backgroundColor: "#F8F9FA",
//       padding: "12px",
//       paddingLeft: "14px",
//       borderLeft: "4px solid #E74C3C"
//     }
//   },

//   // Custom sections (rendered in left column)
//   customSections: {
//     container: { 
//       width: "227px",
//       backgroundColor: "transparent",
//       padding: "0 30px",
//     },
//     showTitle: true,
//     titleStyle: { 
//       fontSize: "12px", 
//       fontWeight: "bold", 
//       color: "#2C3E50", 
//       marginBottom: "15px", 
//       paddingBottom: "8px",
//       borderBottom: "2px solid #E74C3C",
//       textTransform: "uppercase",
//       letterSpacing: "1.5px"
//     },
//     displayType: "list",
//     bulletConfig: {
//       bulletStyle: "dot",
//       bulletWidth: "5px",
//       bulletHeight: "5px",
//       bulletColor: "#E74C3C",
//       bulletRadius: "2.5px",
//       bulletMarginRight: "10px",
//       bulletMarginTop: "4px",
//       textSize: "9px",
//       textColor: "#2C3E50",
//       lineHeight: "1.4",
//       itemMarginBottom: "8px"
//     },
//     itemStyle: { fontSize: "9px", color: "#2C3E50", marginBottom: "8px" }
//   }
// };



export const TEMPLATE5_CONFIG = {
  id: "modern-two-column-sidebar",
  name: "Modern Two Column (Sidebar)",

  // --- 1. Global Positions ---
  positions: {
    // Full width header at top
    header: { x: 30, y: 28, scaleX: 1, scaleY: 1 },

    // Left Column Positions (on gray background)
    skills: { x: 52, y: 136, scaleX: 1, scaleY: 1 },
    education: { x: 52, y: 444, scaleX: 1, scaleY: 1 },
    certifications: { x: 52, y: 639, scaleX: 1, scaleY: 1 },

    // Right Column Positions (on white background)
    summary: { x: 272, y: 164, scaleX: 1, scaleY: 1 },
    experience: { x: 272, y: 336, scaleX: 1, scaleY: 1 },
    projects: { x: 272, y: 494, scaleX: 1, scaleY: 1 },
  },

  lines: [],

  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },

  shapes: [
    {
      id: 1,
      type: "rect",
      x: 0,
      y: 0,
      width: 595,
      height: 114,
      color: "#2C3E50",
      draggable: false,
      selectable: false
    },
    {
      id: 2,
      type: "rect",
      x: 0,
      y: 114,
      width: 210,
      height: 728,
      color: "#ECF0F1",
      draggable: false,
      selectable: false
    }
  ],

  // --- 2. Header Section (Full Width, Dark Background) ---
  header: {
    container: {
      width: "595px",
      height: "114px",
      backgroundColor: "#2C3E50",
      padding: "0",
      color: "#FFFFFF",
      position: "relative",
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "6px" },
    nameSection: { display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: "4px" },
    nameStyle: { fontSize: "28px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "2px", marginBottom: "2px", textTransform: "uppercase" },
    titleStyle: { fontSize: "11px", fontWeight: "400", color: "#E74C3C", letterSpacing: "3px", textTransform: "uppercase", marginTop: "2px" },
    showTitle: true,
    showContact: true,
    contactLayout: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", marginTop: "16px" },
    contactItemStyle: { fontSize: "8.5px", color: "#FFFFFF", display: "flex", flexDirection: "row", alignItems: "center" },
    contactOrder: ["phone", "email", "linkedin", "location"],
    showContactIcons: true,
    contactIconStyle: { width: "5px", height: "5px", backgroundColor: "#E74C3C", borderRadius: "50%", marginRight: "8px" },
    showDivider: false,
  },

  // --- 3. Left Column Styles (Gray Sidebar Sections) ---

  skills: {
    container: {
      width: "210px",
      backgroundColor: "transparent",
      padding: "0",
      paddingTop: "0",
      color: "#2C3E50",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "12px",
      paddingBottom: "6px",
      borderBottom: "3px solid #E74C3C",
      textTransform: "uppercase",
      letterSpacing: "1.5px"
    },
    contentLayout: { display: "flex", flexDirection: "column", gap: "16px" },
    showCategories: true,
    displayType: "text",
    categoryStyle: {
      fontSize: "9px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "6px",
      lineHeight: "1.3",
      borderLeft: "3px solid #E74C3C",
      paddingLeft: "8px"
    },
    valueStyle: {
      fontSize: "8.5px",
      color: "#2C3E50",
      lineHeight: "1.5",
      paddingLeft: "11px"
    },
    itemMarginBottom: "16px"
  },

  education: {
    container: {
      width: "210px",
      backgroundColor: "transparent",
      padding: "0",
      paddingTop: "0",
      color: "#2C3E50",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "12px",
      paddingBottom: "6px",
      borderBottom: "3px solid #E74C3C",
      textTransform: "uppercase",
      letterSpacing: "1.5px"
    },
    degreeStyle: {
      fontSize: "9.5px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "4px",
      lineHeight: "1.3",
      borderLeft: "3px solid #E74C3C",
      paddingLeft: "8px"
    },
    institutionStyle: {
      fontSize: "8.5px",
      color: "#7F8C8D",
      marginBottom: "2px",
      paddingLeft: "11px"
    },
    detailsLayout: { display: "flex", flexDirection: "column", gap: "2px" },
    detailsStyle: {
      fontSize: "8px",
      fontStyle: "italic",
      color: "#95A5A6",
      paddingLeft: "11px"
    },
    showInstitution: true,
    showGpa: true,
    showLocation: false,
    gpaPrefix: "GPA: ",
    itemMarginBottom: "18px"
  },

  certifications: {
    container: {
      width: "210px",
      backgroundColor: "transparent",
      padding: "0",
      paddingTop: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "12px",
      paddingBottom: "6px",
      borderBottom: "3px solid #E74C3C",
      textTransform: "uppercase",
      letterSpacing: "1.5px"
    },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#E74C3C",
      textSize: "8.5px",
      textColor: "#2C3E50",
      lineHeight: "1.5",
      itemMarginBottom: "8px"
    },
    itemStyle: {
      fontSize: "8.5px",
      color: "#2C3E50",
      marginBottom: "8px",
      lineHeight: "1.5"
    }
  },

  // --- 4. Right Column Styles (White Main Content) ---

  summary: {
    container: {
      width: "353px",
      backgroundColor: "transparent",
      padding: "0",
      paddingTop: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "14px",
      paddingLeft: "10px",
      borderLeft: "4px solid #E74C3C",
      textTransform: "uppercase",
      letterSpacing: "1.5px"
    },
    bodyStyle: {
      fontSize: "9px",
      color: "#34495E",
      lineHeight: "1.7",
      textAlign: "justify"
    },
    valueStyle: {
      fontSize: "9px",
      color: "#34495E",
      lineHeight: "1.7",
      textAlign: "justify"
    }
  },

  experience: {
    container: {
      width: "353px",
      backgroundColor: "transparent",
      padding: "0",
      paddingTop: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "14px",
      paddingLeft: "10px",
      borderLeft: "4px solid #E74C3C",
      textTransform: "uppercase",
      letterSpacing: "1.5px"
    },
    headerLayout: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      marginBottom: "6px"
    },
    subHeaderLayout: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "3px"
    },
    positionFirst: true,
    positionStyle: {
      fontSize: "10.5px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "2px"
    },
    companyStyle: {
      fontSize: "9px",
      color: "#E74C3C",
      fontWeight: "400"
    },
    durationStyle: {
      fontSize: "8px",
      fontStyle: "italic",
      color: "#95A5A6"
    },
    locationStyle: {
      fontSize: "8.5px",
      color: "#7F8C8D"
    },
    showLocation: true,
    showAchievements: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "10px",
      bulletColor: "#34495E",
      textSize: "9px",
      textColor: "#34495E",
      lineHeight: "1.6",
      itemMarginBottom: "5px"
    },
    itemMarginBottom: "15px"
  },

  projects: {
    container: {
      width: "353px",
      backgroundColor: "transparent",
      padding: "0",
      paddingTop: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "14px",
      paddingLeft: "10px",
      borderLeft: "4px solid #E74C3C",
      textTransform: "uppercase",
      letterSpacing: "1.5px"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "4px",
      marginBottom: "6px",
      alignItems: "flex-start"
    },
    nameStyle: {
      fontSize: "10px",
      fontWeight: "700",
      color: "#2C3E50",
      flex: "1"
    },
    durationStyle: {
      fontSize: "8px",
      fontStyle: "italic",
      color: "#95A5A6"
    },
    techStyle: {
      fontSize: "8.5px",
      fontWeight: "400",
      color: "#E74C3C",
      marginBottom: "6px"
    },
    linkStyle: {
      fontSize: "8px",
      color: "#3498DB",
      marginBottom: "6px"
    },
    showDuration: true,
    showTechnologies: true,
    showDescription: true,
    showLink: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "10px",
      bulletColor: "#34495E",
      textSize: "9px",
      textColor: "#34495E",
      lineHeight: "1.6",
      itemMarginBottom: "5px"
    },
    itemMarginBottom: "15px",
    itemStyle: {
      marginBottom: "15px",
      backgroundColor: "#F8F9FA",
      padding: "12px 14px",
      borderLeft: "4px solid #E74C3C"
    }
  },

  // Custom sections (rendered in left column)
  customSections: {
    container: {
      width: "210px",
      backgroundColor: "transparent",
      padding: "0",
      paddingTop: "0",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#2C3E50",
      marginBottom: "12px",
      paddingBottom: "6px",
      borderBottom: "3px solid #E74C3C",
      textTransform: "uppercase",
      letterSpacing: "1.5px"
    },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#E74C3C",
      textSize: "8.5px",
      textColor: "#2C3E50",
      lineHeight: "1.5",
      itemMarginBottom: "8px"
    },
    itemStyle: {
      fontSize: "8.5px",
      color: "#2C3E50",
      marginBottom: "8px",
      lineHeight: "1.5"
    }
  }
};

export const HEADER_LAYOUTS = {
  centered: {
    label: "Centered Stack",
    config: {
      nameAlign: "center",
      titleAlign: "center",
      mainLayout: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      nameSection: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      },
      contactLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        flexWrap: "nowrap",
        marginTop: "8px"
      },
      contactLeftGroup: ["phone", "email"],
      contactRightGroup: ["linkedin", "github", "location"],
      nameStyle: {
        textAlign: "center",
        alignSelf: "center",
        fontSize: "32px"
      },
      titleStyle: {
        textAlign: "center",
        alignSelf: "center",
        fontSize: "16px"
      }
    }
  },
  leftStack: {
    label: "Left Stack",
    config: {
      nameAlign: "flex-start",
      titleAlign: "flex-start",
      mainLayout: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      nameSection: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
      },
      contactLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        flexWrap: "nowrap",
        marginTop: "8px"
      },
      contactLeftGroup: ["phone", "email"],
      contactRightGroup: ["linkedin", "github", "location"],
      nameStyle: {
        textAlign: "left",
        alignSelf: "flex-start",
        fontSize: "28px"
      },
      titleStyle: {
        textAlign: "left",
        alignSelf: "flex-start",
        fontSize: "14px"
      }
    }
  },
  modernRow: {
    label: "Modern Row",
    config: {
      nameAlign: "flex-start",
      titleAlign: "flex-start",
      mainLayout: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      nameSection: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
      },
      contactLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        flexWrap: "nowrap",
        marginTop: "8px"
      },
      contactLeftGroup: ["phone", "email"],
      contactRightGroup: ["linkedin", "github", "location"],
      nameStyle: {
        textAlign: "left",
        alignSelf: "flex-start",
        fontSize: "36px"
      },
      titleStyle: {
        textAlign: "left",
        alignSelf: "flex-start",
        fontSize: "18px"
      }
    }
  },
  split: {
    label: "Split View",
    config: {
      mainLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px"
      },
      nameSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flex: 1
      },
      contactLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        flexWrap: "nowrap",
        marginTop: "8px"
      },
      contactLeftGroup: ["phone", "email"],
      contactRightGroup: ["linkedin", "github", "location"],
      nameStyle: {
        textAlign: "left",
        fontSize: "26px"
      },
      titleStyle: {
        textAlign: "left",
        fontSize: "13px"
      }
    }
  }
};

export const CONTACT_LAYOUTS = {
  split: {
    label: "Split (Default)",
    config: {
      contactLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        flexWrap: "nowrap",
        marginTop: "8px"
      },
      contactLeftGroup: ["phone", "email"],
      contactRightGroup: ["linkedin", "github", "location"]
    }
  },
  row: {
    label: "Single Row",
    config: {
      contactLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginTop: "8px"
      },
      contactLeftGroup: null,
      contactRightGroup: null
    }
  },
  column: {
    label: "Column Stack",
    config: {
      contactLayout: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px",
        marginTop: "8px"
      },
      contactLeftGroup: null,
      contactRightGroup: null
    }
  },
  grid: {
    label: "2x2 Grid",
    config: {
      contactLayout: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        marginTop: "8px"
      },
      contactLeftGroup: null,
      contactRightGroup: null
    }
  }
};

export const SKILLS_LAYOUTS = {
  stacked: {
    label: "Stacked",
    config: {
      displayMode: "categories",
      showCategories: true,
      categoryValueSeparator: "",
      categoryLayout: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        marginBottom: "8px"
      },
      categoryStyle: {
        fontWeight: "bold",
        fontSize: "10px",
        marginBottom: "2px"
      },
      valueStyle: {
        fontSize: "9px",
        lineHeight: "1.4"
      }
    }
  },
  sideBySide: {
    label: "Side-by-Side",
    config: {
      displayMode: "categories",
      showCategories: true,
      categoryValueSeparator: ": ",
      categoryLayout: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        gap: "6px",
        marginBottom: "6px",
        flexWrap: "wrap"
      },
      categoryStyle: {
        fontWeight: "bold",
        fontSize: "10px",
        whiteSpace: "nowrap"
      },
      valueStyle: {
        fontSize: "10px",
        lineHeight: "1.4",
        flex: 1
      }
    }
  }
};

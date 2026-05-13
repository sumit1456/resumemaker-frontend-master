// ==================== TWO COLUMN TEMPLATE ====================

export const BALANCED_HYBRID_CONFIG = {
  id: "balanced-hybrid",
  type: "multi-column",
  name: "Balanced Hybrid",

  positions: {
    header: { x: 24, y: 30, scaleX: 1, scaleY: 1 },
    summary: { x: 24, y: 130, scaleX: 1, scaleY: 1 },
    skills: { x: 24, y: 240, scaleX: 1, scaleY: 1 },
    experience: { x: 280, y: 240, scaleX: 1, scaleY: 1 },
    projects: { x: 280, y: 380, scaleX: 1, scaleY: 1 },
    education: { x: 24, y: 550, scaleX: 1, scaleY: 1 },
    certifications: { x: 24, y: 720, scaleX: 1, scaleY: 1 }
  },

  lines: [
    {
      id: 1,
      x1: 265,
      y1: 230,
      x2: 265,
      y2: 842,
      color: '#000000',
      thickness: 1,
      orientation: 'vertical',
      label: 'Column Divider'
    }
  ],

  shapes: [],

  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },

  header: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0",
      borderBottom: "1px solid #000000",
      textAlign: "center"
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "0px" },
    nameSection: { display: "flex", flexDirection: "column", alignItems: "center" },
    nameStyle: {
      fontSize: "24px",
      fontWeight: "900",
      color: "#000000",
      letterSpacing: "1px",
      lineHeight: "1.1",
      textAlign: "center",
      textTransform: "uppercase"
    },
    titleStyle: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#333",
      marginTop: "0px",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "1px"
    },
    showTitle: true,
    showContact: true,
    contactLayout: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: "0px",
      flexWrap: "wrap",
      marginTop: "0px"
    },
    contactOrder: ["email", "phone", "linkedin", "location"],
    contactItemStyle: { fontSize: "8.5px", color: "#000000" },
    showContactIcons: false,
    showDivider: true,
    dividerStyle: "none",
    dividerChar: " | "
  },

  summary: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0",
      marginTop: "0px"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      borderBottom: "1px solid #000",
      marginBottom: "0px",
      textTransform: "uppercase",
      letterSpacing: "1px"
    },
    bodyStyle: {
      fontSize: "10px",
      lineHeight: "1.5",
      textAlign: "justify",
      color: "#000000"
    }
  },

  skills: {
    container: { width: "220px" },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "0px",
      textTransform: "uppercase"
    },
    contentLayout: { display: "flex", flexDirection: "column", gap: "0px" },
    displayType: "inline",
    separator: ", ",
    showCategories: true,
    categoryStyle: { fontSize: "10px", fontWeight: "bold", color: "#000000" },
    valueStyle: { fontSize: "9px", color: "#000000", lineHeight: "1.4" },
    itemMarginBottom: "0px"
  },

  experience: {
    container: { width: "310px" },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      borderBottom: "1px solid #000",
      marginBottom: "0px",
      textTransform: "uppercase",
      letterSpacing: "1px"
    },
    showAchievements: true,
    showLocation: true,
    itemStyle: { marginBottom: "0px" },
    headerLayout: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0px", marginBottom: "0px" },
    positionStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    companyStyle: { fontSize: "10px", color: "#444444" },
    durationStyle: { fontSize: "9px", fontStyle: "normal", color: "#444444", whiteSpace: "nowrap" },
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "0px"
    }
  },

  projects: {
    container: { width: "310px" },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      borderBottom: "1px solid #000",
      marginBottom: "0px",
      textTransform: "uppercase",
      letterSpacing: "1px"
    },
    showDescription: true,
    showTechnologies: true,
    showDuration: true,
    showLink: true,
    itemStyle: { marginBottom: "0px" },
    nameStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    techStyle: { fontSize: "9px", fontStyle: "italic", color: "#666666", marginBottom: "0px" },
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "0px"
    }
  },

  education: {
    container: { width: "220px" },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "0px",
      textTransform: "uppercase"
    },
    degreeStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000", lineHeight: "1.4" },
    institutionStyle: { fontSize: "10px", color: "#333333", lineHeight: "1.4", fontStyle: "italic" },
    detailsStyle: { fontSize: "9px", color: "#444444", lineHeight: "1.4" },
    itemMarginBottom: "0px",
    showInstitution: true,
    showGpa: true,
    showLocation: true
  },

  certifications: {
    container: { width: "220px" },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "0px",
      textTransform: "uppercase"
    },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.5",
      itemMarginBottom: "0px"
    },
    itemStyle: { fontSize: "9px", marginBottom: "0px" }
  }
};

export const TWO_COLUMN_TEMPLATE_CONFIG = {
  id: "two-column-professional",
  type: "multi-column", // 🛡️ Explicit ID for Auto-Flow Logic
  name: "Two Column Professional",

  // Default section positions for this template
  positions: {
    header: { x: 24, y: 14, scaleX: 1, scaleY: 1 },
    summary: { x: 19, y: 114, scaleX: 1, scaleY: 1 },
    skills: { x: 24, y: 244, scaleX: 1, scaleY: 1 },
    experience: { x: 282, y: 245, scaleX: 1, scaleY: 1 },
    projects: { x: 282, y: 382, scaleX: 1, scaleY: 1 },
    education: { x: 26, y: 573, scaleX: 1, scaleY: 1 },
    certifications: { x: 285, y: 745, scaleX: 1, scaleY: 1 }
  },

  // Default line positions for this template
  lines: [
    {
      id: 1,
      x1: 260,
      y1: 250,
      x2: 260,
      y2: 842,
      color: '#000000',
      thickness: 2,
      orientation: 'vertical',
      label: 'Column Divider'
    },

  ],

  // No shapes for TWO_COLUMN template
  shapes: [],

  // Page Configuration
  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },

  // Section Styles
  header: {
    container: {
      width: "560px",
      backgroundColor: "transparent",
      padding: "0",
      borderBottom: "2px solid #000000"
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
      flexWrap: "nowrap",
      marginTop: "8px"
    },
    contactOrder: ["phone", "email", "linkedin", "github", "location"],
    contactItemStyle: { fontSize: "9px", color: "#000000", lineHeight: "1.4" },
    contactLeftGroup: ["phone", "email"],
    contactRightGroup: ["linkedin", "github", "location"],
    showContactIcons: false,
    showDivider: true,
    dividerStyle: "2px solid #000000",
    dividerMarginTop: "2px",
    dividerMarginBottom: "10px",
    sectionOrder: ["nameRow", "contact"],
    nameRowMarginBottom: "4px"
  },

  summary: {
    container: {
      width: "560px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "6px",
      paddingBottom: "1px",
      letterSpacing: "0.5px",
      textTransform: "uppercase"
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
      marginBottom: "8px",
      paddingBottom: "1px",
      letterSpacing: "0.5px",
      textTransform: "uppercase"
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
      marginBottom: "8px",
      paddingBottom: "1px",
      letterSpacing: "0.5px",
      textTransform: "uppercase"
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
      marginBottom: "8px",
      paddingBottom: "1px",
      letterSpacing: "0.5px",
      textTransform: "uppercase"
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
    showLink: true,
    linkStyle: {
      fontSize: "9px",
      color: "#3b82f6",
      textDecoration: "none",
      marginTop: "2px",
      display: "block"
    },
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
      marginBottom: "8px",
      paddingBottom: "1px",
      letterSpacing: "0.5px",
      textTransform: "uppercase"
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
      marginBottom: "8px",
      paddingBottom: "1px",
      letterSpacing: "0.5px",
      textTransform: "uppercase"
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
  type: "single-column", // 🛡️ Explicit ID for Auto-Flow Logic
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
    fontFamily: "Helvetica",
  },

  // Header Section
  header: {
    container: {
      width: "545px",
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
      color: "#4025efff",
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
      width: "545px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "5px", paddingBottom: "0px" },
    bodyStyle: { fontSize: "10px", color: "#000000", lineHeight: "1.5", textAlign: "justify" }
  },

  skills: {
    container: {
      width: "545px",
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
      width: "545px",
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
      width: "545px",
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
    showLink: true,
    linkStyle: {
      fontSize: "9px",
      color: "#3b82f6",
      textDecoration: "none",
      marginTop: "2px",
      display: "block"
    },
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
      width: "545px",
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
      width: "545px",
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

export const ATS_COMPACT_CONFIG = {
  id: "ats-compact",
  type: "single-column",
  name: "ATS Compact",

  positions: {
    header: { x: 24, y: 30, height: 100, scaleX: 1, scaleY: 1 },
    summary: { x: 24, y: 140, height: 90, scaleX: 1, scaleY: 1 },
    skills: { x: 24, y: 240, height: 120, scaleX: 1, scaleY: 1 },
    experience: { x: 24, y: 370, height: 150, scaleX: 1, scaleY: 1 },
    projects: { x: 24, y: 530, height: 280, scaleX: 1, scaleY: 1 },
    education: { x: 24, y: 820, height: 120, scaleX: 1, scaleY: 1 },
    certifications: { x: 24, y: 950, height: 60, scaleX: 1, scaleY: 1 }
  },

  lines: [],
  shapes: [],

  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Serif, 'Times New Roman', Times",
  },

  header: {
    container: {
      width: "550px",
      backgroundColor: "transparent",
      padding: "0",
      textAlign: "center"
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "2px" },
    nameSection: { display: "flex", flexDirection: "column", alignItems: "center" },
    nameStyle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1E3A8A",
      textAlign: "center",
      letterSpacing: "0.5px"
    },
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#000000",
      textAlign: "center",
      marginTop: "2px"
    },
    showTitle: true,
    showContact: true,
    contactLayout: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: "0px",
      flexWrap: "wrap",
      marginTop: "4px"
    },
    contactOrder: ["location", "email", "phone", "github", "linkedin"],
    contactItemStyle: { fontSize: "9px", color: "#374151" },
    showContactIcons: false,
    showDivider: true,
    dividerStyle: "none",
    dividerChar: "  •  ",
    locationStyle: { color: "#374151" }
  },

  summary: {
    container: { width: "550px", backgroundColor: "transparent", padding: "0" },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#1E3A8A",
      borderBottom: "0.5px solid #1E3A8A",
      marginBottom: "6px",
      paddingBottom: "2px",
      textTransform: "uppercase",
      fontVariant: "small-caps"
    },
    bodyStyle: {
      fontSize: "10px",
      color: "#000000",
      lineHeight: "1.4",
      textAlign: "justify"
    }
  },

  skills: {
    container: { width: "550px", backgroundColor: "transparent", padding: "0" },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#1E3A8A",
      borderBottom: "0.5px solid #1E3A8A",
      marginBottom: "6px",
      paddingBottom: "2px",
      textTransform: "uppercase",
      fontVariant: "small-caps"
    },
    contentLayout: { display: "flex", flexDirection: "column", gap: "4px" },
    showCategories: true,
    categoryStyle: { fontSize: "10px", fontWeight: "bold", color: "#000000" },
    valueStyle: { fontSize: "10px", color: "#000000", lineHeight: "1.3" },
    displayType: "inline",
    separator: ", ",
    itemMarginBottom: "4px"
  },

  experience: {
    container: { width: "550px", backgroundColor: "transparent", padding: "0" },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#1E3A8A",
      borderBottom: "0.5px solid #1E3A8A",
      marginBottom: "6px",
      paddingBottom: "2px",
      textTransform: "uppercase",
      fontVariant: "small-caps"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "2px"
    },
    subHeaderLayout: { display: "flex", marginBottom: "4px" },
    positionFirst: true,
    positionStyle: {
      fontSize: "11px",
      fontWeight: "bold",
      color: "#000000",
      fontVariant: "small-caps"
    },
    companyStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    durationStyle: { fontSize: "10px", fontStyle: "italic", color: "#000000", whiteSpace: "nowrap" },
    showLocation: false,
    showAchievements: true,
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.3",
      itemMarginBottom: "1px"
    },
    itemMarginBottom: "8px"
  },

  projects: {
    container: { width: "550px", backgroundColor: "transparent", padding: "0" },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#1E3A8A",
      borderBottom: "0.5px solid #1E3A8A",
      marginBottom: "6px",
      paddingBottom: "2px",
      textTransform: "uppercase",
      fontVariant: "small-caps"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "1px"
    },
    nameStyle: {
      fontSize: "11px",
      fontWeight: "bold",
      color: "#000000",
      fontVariant: "small-caps"
    },
    durationStyle: { fontSize: "10px", fontStyle: "italic", color: "#000000", whiteSpace: "nowrap" },
    techStyle: { fontSize: "9px", fontStyle: "italic", color: "#000000", marginBottom: "2px" },
    showDuration: true,
    showTechnologies: true,
    showDescription: true,
    showLink: true,
    linkStyle: { fontSize: "10px", color: "#1E3A8A", textDecoration: "none" },
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.3",
      itemMarginBottom: "1px"
    },
    itemMarginBottom: "10px",
    itemStyle: { padding: "0" }
  },

  education: {
    container: { width: "550px", backgroundColor: "transparent", padding: "0" },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#1E3A8A",
      borderBottom: "0.5px solid #1E3A8A",
      marginBottom: "6px",
      paddingBottom: "2px",
      textTransform: "uppercase",
      fontVariant: "small-caps"
    },
    degreeStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000", lineHeight: "1.3" },
    institutionStyle: { fontSize: "10px", color: "#000000", lineHeight: "1.3" },
    detailsLayout: { display: "flex", justifyContent: "space-between", gap: "6px", flexWrap: "wrap" },
    detailsStyle: { fontSize: "10px", fontStyle: "italic", color: "#000000", lineHeight: "1.3" },
    showInstitution: true,
    showGpa: true,
    showLocation: false,
    gpaPrefix: " — ",
    itemMarginBottom: "6px",
    itemStyle: { padding: "0" }
  },

  certifications: {
    container: { width: "550px", backgroundColor: "transparent", padding: "0" },
    showTitle: true,
    titleStyle: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#1E3A8A",
      borderBottom: "0.5px solid #1E3A8A",
      marginBottom: "6px",
      paddingBottom: "2px",
      textTransform: "uppercase",
      fontVariant: "small-caps"
    },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "12px",
      bulletColor: "#000000",
      textSize: "10px",
      textColor: "#000000",
      lineHeight: "1.3",
      itemMarginBottom: "1px"
    },
    itemStyle: { fontSize: "10px", color: "#000000", marginBottom: "2px" }
  }
};



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
//     container: { width: 545 },

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
//     container: { width: 545 },

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
  type: "multi-column",

  // --- 1. Global Positions ---
  positions: {
    // Left Column Positions (on light gray background)
    header: { x: 46, y: 23, scaleX: 1, scaleY: 1 },
    contact: { x: 46, y: 180, scaleX: 1, scaleY: 1 },
    skills: { x: 46, y: 350, scaleX: 1, scaleY: 1 },

    // Right Column Positions (on white background)
    summary: { x: 305, y: 15, scaleX: 1, scaleY: 1 },
    education: { x: 305, y: 200, scaleX: 1, scaleY: 1 },
    experience: { x: 305, y: 550, scaleX: 1, scaleY: 1 },
    projects: { x: 305, y: 750, scaleX: 1, scaleY: 1 },
    certifications: { x: 305, y: 850, scaleX: 1, scaleY: 1 }
  },

  lines: [
    { id: 1, x1: 280, y1: 0, x2: 280, y2: 842, color: '#EEEEEE', thickness: 1, orientation: 'vertical', label: 'Divider' }
  ],

  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },

  shapes: [
    {
      id: 99,
      type: "rect",
      x: 0,
      y: 0,
      width: 280,      // Cover left column
      height: 842,     // Full page height
      color: "#f3f4f6", // Light background color (Gray-100)
      draggable: false,
      selectable: false
    }
  ],


  // --- 2. Left Column Styles (Black Sidebar Sections) ---

  header: {
    container: {
      width: "220px",
      backgroundColor: "transparent",
      padding: "0",
      color: "#2C3E50",
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "2px" },
    nameSection: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
    nameStyle: { fontSize: "20px", fontWeight: "900", color: "#2C3E50", textTransform: "uppercase" },
    titleStyle: { fontSize: "12px", fontWeight: "normal", color: "#34495E", marginTop: "4px" },
    showTitle: true,
    showContact: true,

    // Contact Configuration moved to header
    contactLayout: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginTop: "8px",
      justifyContent: "flex-start",
      flexWrap: "wrap"
    },
    contactOrder: ["phone", "email", "linkedin", "location"],
    contactItemStyle: { fontSize: "8px", color: "#2C3E50" },
    showContactIcons: true,
    contactIconColor: "#2C3E50",

    // Split layout support (optional defaults)
    contactLeftGroup: ["phone", "email"],
    contactRightGroup: ["linkedin", "location"],
  },

  // Contact section removed (now part of header)

  skills: {
    container: {
      width: "250px",
      backgroundColor: "transparent",
      padding: "5px",
      color: "#2C3E50",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: "8px",
      textTransform: "uppercase",
      borderBottom: "1px solid #2C3E50"
    },
    contentLayout: { display: "flex", flexDirection: "column", gap: "6px" },
    showCategories: true,
    categoryStyle: { fontSize: "10px", fontWeight: "bold", color: "#2C3E50" },
    valueStyle: { fontSize: "9px", color: "#34495E", lineHeight: "1.4" },
    displayType: "inline", // Inline text within valueStyle
    separator: ", ",
    itemMarginBottom: "8px"
  },

  education: {
    container: {
      width: "300px",
      backgroundColor: "transparent",
      padding: "0",
      color: "#2C3E50",
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: "8px",
      textTransform: "uppercase",
      borderBottom: "1px solid #2C3E50"
    },
    degreeStyle: { fontSize: "11px", fontWeight: "bold", color: "#2C3E50", lineHeight: "1.4" },
    institutionStyle: { fontSize: "10px", color: "#34495E", lineHeight: "1.4" },
    detailsLayout: { display: "flex", flexDirection: "column", gap: "2px" },
    detailsStyle: { fontSize: "9px", fontStyle: "normal", color: "#7F8C8D", lineHeight: "1.4" },
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
      color: "#2C3E50"
    },
    showTitle: true,
    titleStyle: { fontSize: "14px", fontWeight: "bold", color: "#2C3E50", borderBottom: "1px solid #2C3E50", marginBottom: "8px", paddingBottom: "3px" },
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
      color: "#2C3E50"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: "8px",
      paddingBottom: "3px",
      letterSpacing: "1px",
      textTransform: "uppercase",
      borderBottom: "1px solid #2C3E50"
    },
    bodyStyle: { fontSize: "10px", color: "#000000", lineHeight: "1.5", textAlign: "left" }
  },

  experience: {
    container: {
      width: "400px",
      backgroundColor: "transparent",
      padding: "0",
      color: "#2C3E50"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: "8px",
      paddingBottom: "3px",
      letterSpacing: "1px",
      textTransform: "uppercase",
      borderBottom: "1px solid #2C3E50"
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
      color: "#2C3E50"
    },
    showTitle: true,
    titleStyle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: "8px",
      paddingBottom: "3px",
      letterSpacing: "1px",
      textTransform: "uppercase",
      borderBottom: "1px solid #2C3E50"
    },
    headerLayout: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", marginBottom: "2px" },
    nameStyle: { fontSize: "11px", fontWeight: "bold", color: "#000000" },
    durationStyle: { fontSize: "9px", fontStyle: "normal", color: "#444444", whiteSpace: "nowrap" },
    techStyle: { fontSize: "9px", fontStyle: "italic", color: "#666666", marginBottom: "4px" },
    showDuration: true,
    showTechnologies: true,
    showDescription: true,
    showLink: true,
    linkStyle: {
      fontSize: "9px",
      color: "#3b82f6",
      textDecoration: "none",
      marginTop: "2px",
      display: "block"
    },
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
//     projects: { x: 320, y: 545, scaleX: 1, scaleY: 1 },
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
    fontFamily: "Helvetica",
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
      fontSize: "8.5px",
      color: "#3b82f6",
      textDecoration: "none",
      marginTop: "2px",
      display: "block"
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
      nameStyle: {
        textAlign: "left",
        fontSize: "26px"
      },
      titleStyle: {
        textAlign: "left",
        fontSize: "13px"
      }
    }
  },
  splitWide: {
    label: "Split Wide",
    config: {
      layoutDisplay: "flex",
      layoutDirection: "column",
      sectionOrder: ["nameRow", "contact"],
      nameRowMarginBottom: "4px",
      nameStyle: {
        fontSize: "28px",
        fontWeight: "bold",
        textAlign: "left"
      },
      titleStyle: {
        fontSize: "13px",
        fontWeight: "bold",
        textAlign: "right",
        textTransform: "capitalize"
      },
      showContactIcons: false,
      showDivider: true,
      dividerStyle: "2px solid #000000",
      dividerMarginTop: "2px",
      dividerMarginBottom: "10px"
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



// ==================== TEMPLATE 8: NEW ATS FRIENDLY ====================
export const NEW_ATS_CONFIG = {
  id: "ats-edgy",
  type: "single-column",
  name: "ATS Edgy",

  // Default section positions and heights (mapping structure from ATS_TEMPLATE_CONFIG)
  positions: {
    header: { x: 30, y: 30, height: 80, scaleX: 1, scaleY: 1 },
    summary: { x: 30, y: 130, height: 100, scaleX: 1, scaleY: 1 },
    skills: { x: 30, y: 240, height: 120, scaleX: 1, scaleY: 1 },
    experience: { x: 30, y: 370, height: 250, scaleX: 1, scaleY: 1 },
    projects: { x: 30, y: 640, height: 120, scaleX: 1, scaleY: 1 },
    education: { x: 30, y: 780, height: 80, scaleX: 1, scaleY: 1 },
    certifications: { x: 30, y: 880, height: 60, scaleX: 1, scaleY: 1 }
  },

  lines: [],
  shapes: [],

  // Page Configuration matching Template8.jsx styles
  page: {
    width: "210mm",
    height: "297mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: "9px"
  },

  // Header Section matching Template8.jsx
  header: {
    container: {
      width: "535px",
      padding: "0",
      textAlign: "center",
      paddingBottom: "8px",
      borderBottom: "2px solid #000"
    },
    mainLayout: {
      display: "flex",
      flexDirection: "column",
      gap: "2px"
    },
    nameSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    nameStyle: {
      fontSize: "26px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "2px",
      textAlign: "center",
      letterSpacing: "2.5px",
      textTransform: "uppercase",
      fontFamily: "Times-Bold"
    },
    titleStyle: {
      fontSize: "10px",
      color: "#333333",
      marginBottom: "4px",
      textAlign: "center",
      letterSpacing: "0.8px",
      fontFamily: "Times-Italic"
    },
    showTitle: true,
    showContact: true,
    contactLayout: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: "6px"
    },
    contactOrder: ["phone", "email", "linkedin", "github", "location"],
    contactItemStyle: {
      fontSize: "8.5px",
      color: "#000000",
      fontFamily: "Helvetica"
    },
    showContactIcons: false,
    showDivider: true,
    dividerStyle: "none",
    dividerChar: "●"
  },

  // Section titles across all sections use the edgy style
  // (12px Times-Bold, uppercase, letterspacing 2, borderBottom 2px, borderLeft 4px)
  summary: {
    container: { width: "535px" },
    showTitle: true,
    titleStyle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#000000",
      marginTop: "8px",
      marginBottom: "4px",
      paddingBottom: "3px",
      borderBottom: "2px solid #000000",
      borderLeft: "4px solid #000000",
      paddingLeft: "8px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      fontFamily: "Times-Bold"
    },
    bodyStyle: {
      fontSize: "9px",
      lineHeight: "1.4",
      color: "#1a1a1a",
      textAlign: "justify",
      fontFamily: "Times-Roman"
    }
  },

  skills: {
    container: { width: "535px" },
    showTitle: true,
    titleStyle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#000000",
      marginTop: "8px",
      marginBottom: "4px",
      paddingBottom: "3px",
      borderBottom: "2px solid #000000",
      borderLeft: "4px solid #000000",
      paddingLeft: "8px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      fontFamily: "Times-Bold"
    },
    contentLayout: {
      display: "flex",
      flexDirection: "column",
      gap: "2.5px",
      padding: "6px",
      borderLeft: "2px solid #000",
      marginLeft: "0px"
    },
    showCategories: true,
    categoryStyle: {
      fontSize: "9px",
      fontWeight: "bold",
      width: "120px",
      fontFamily: "Helvetica-Bold",
      color: "#000"
    },
    valueStyle: {
      fontSize: "9px",
      flex: 1,
      fontFamily: "Times-Roman",
      color: "#1a1a1a",
      lineHeight: "1.3"
    },
    displayType: "inline",
    separator: ", ",
    itemMarginBottom: "2px"
  },

  experience: {
    container: { width: "535px" },
    showTitle: true,
    titleStyle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#000000",
      marginTop: "8px",
      marginBottom: "4px",
      paddingBottom: "3px",
      borderBottom: "2px solid #000000",
      borderLeft: "4px solid #000000",
      paddingLeft: "8px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      fontFamily: "Times-Bold"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1px",
      alignItems: "baseline"
    },
    subHeaderLayout: {
      display: "flex",
      marginBottom: "2px"
    },
    positionFirst: true,
    positionStyle: {
      fontSize: "10.5px",
      fontWeight: "bold",
      color: "#000000",
      letterSpacing: "0.3px",
      fontFamily: "Times-Bold"
    },
    companyStyle: {
      fontSize: "9px",
      fontFamily: "Times-Italic",
      color: "#1a1a1a",
      marginBottom: "2px"
    },
    durationStyle: {
      fontSize: "8.5px",
      color: "#333",
      fontFamily: "Helvetica-Bold",
      letterSpacing: "0.3px",
      whiteSpace: "nowrap"
    },
    showLocation: true,
    showAchievements: true,
    bulletConfig: {
      bulletStyle: "-",
      bulletWidth: "10px",
      bulletColor: "#000",
      textSize: "9px",
      textColor: "#1a1a1a",
      lineHeight: "1.35",
      itemMarginBottom: "2px",
      fontFamily: "Times-Roman"
    },
    itemStyle: {
      marginBottom: "6px",
      borderLeft: "2px solid #000",
      paddingLeft: "6px"
    },
    itemMarginBottom: "10px"
  },

  projects: {
    container: { width: "535px" },
    showTitle: true,
    titleStyle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#000000",
      marginTop: "8px",
      marginBottom: "4px",
      paddingBottom: "3px",
      borderBottom: "2px solid #000000",
      borderLeft: "4px solid #000000",
      paddingLeft: "8px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      fontFamily: "Times-Bold"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1px",
      alignItems: "baseline"
    },
    nameStyle: {
      fontSize: "10.5px",
      fontWeight: "bold",
      color: "#000000",
      letterSpacing: "0.3px",
      fontFamily: "Helvetica-Bold"
    },
    durationStyle: {
      fontSize: "8.5px",
      color: "#333",
      fontFamily: "Helvetica-Bold",
      letterSpacing: "0.3px",
      whiteSpace: "nowrap"
    },
    techStyle: {
      fontSize: "8.5px",
      fontFamily: "Helvetica-Oblique",
      color: "#333",
      marginBottom: "2px",
      letterSpacing: "0.2px"
    },
    showDuration: true,
    showTechnologies: true,
    showDescription: true,
    showLink: true,
    linkStyle: {
      fontSize: "8.5px",
      color: "#3b82f6",
      textDecoration: "none",
      marginTop: "2px",
      display: "block",
      fontFamily: "Helvetica"
    },
    bulletConfig: {
      bulletStyle: "-",
      bulletWidth: "10px",
      bulletColor: "#000",
      textSize: "9px",
      textColor: "#1a1a1a",
      lineHeight: "1.35",
      itemMarginBottom: "2px",
      fontFamily: "Times-Roman"
    },
    itemStyle: {
      marginBottom: "5px",
      borderLeft: "2px solid #000",
      paddingLeft: "6px"
    },
    itemMarginBottom: "10px"
  },

  education: {
    container: { width: "535px" },
    showTitle: true,
    titleStyle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#000000",
      marginTop: "8px",
      marginBottom: "4px",
      paddingBottom: "3px",
      borderBottom: "2px solid #000000",
      borderLeft: "4px solid #000000",
      paddingLeft: "8px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      fontFamily: "Times-Bold"
    },
    headerLayout: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1px",
      alignItems: "baseline"
    },
    degreeStyle: {
      fontSize: "10.5px",
      fontWeight: "bold",
      color: "#000000",
      letterSpacing: "0.3px",
      fontFamily: "Helvetica-Bold"
    },
    institutionStyle: {
      fontSize: "9px",
      color: "#1a1a1a",
      fontFamily: "Times-Roman"
    },
    durationStyle: {
      fontSize: "8.5px",
      color: "#333",
      fontFamily: "Helvetica-Bold",
      letterSpacing: "0.3px",
      whiteSpace: "nowrap"
    },
    detailsStyle: {
      fontSize: "8.5px",
      fontFamily: "Helvetica-Oblique",
      color: "#333",
      marginTop: "1px"
    },
    showInstitution: true,
    showGpa: true,
    showLocation: true,
    itemStyle: {
      marginBottom: "5px",
      borderLeft: "2px solid #000",
      paddingLeft: "6px"
    },
    itemMarginBottom: "10px"
  },

  certifications: {
    container: { width: "535px" },
    showTitle: true,
    titleStyle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#000000",
      marginTop: "8px",
      marginBottom: "4px",
      paddingBottom: "3px",
      borderBottom: "2px solid #000000",
      borderLeft: "4px solid #000000",
      paddingLeft: "8px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      fontFamily: "Times-Bold"
    },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "-",
      bulletWidth: "12px",
      bulletColor: "#000",
      textSize: "9px",
      textColor: "#1a1a1a",
      lineHeight: "1.35",
      itemMarginBottom: "2px",
      fontFamily: "Times-Roman"
    },
    itemStyle: {
      borderLeft: "2px solid #000",
      paddingLeft: "6px",
      marginBottom: "2px"
    }
  }
};


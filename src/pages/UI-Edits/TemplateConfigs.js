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
    education: { x: 20, y: 450, scaleX: 1, scaleY: 1 },
    certifications: { x: 20, y: 750, scaleX: 1, scaleY: 1 }
  },
  
  // Default line positions for this template
  lines: [
    { 
      id: 1, 
      x1: 260, 
      y1: 100, 
      x2: 260, 
      y2: 820, 
      color: '#000000', 
      thickness: 2, 
      orientation: 'vertical', 
      label: 'Column Divider' 
    }
  ],
  
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
    showContactIcons: false,
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
      marginBottom: "10px", 
      paddingBottom: "4px",
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
      marginBottom: "12px", 
      paddingBottom: "4px",
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
    itemMarginBottom: "10px"
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
      marginBottom: "12px", 
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
      itemMarginBottom: "4px"
    },
    itemMarginBottom: "16px"
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
      marginBottom: "12px", 
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
      itemMarginBottom: "4px"
    },
    itemMarginBottom: "16px"
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
      marginBottom: "12px", 
      paddingBottom: "4px",
      letterSpacing: "0.5px"
    },
    degreeStyle: { 
      fontSize: "10px", 
      fontWeight: "bold", 
      color: "#000000", 
      lineHeight: "1.5",
      marginBottom: "2px"
    },
    institutionStyle: { 
      fontSize: "9px", 
      color: "#000000", 
      lineHeight: "1.5",
      fontStyle: "italic",
      marginBottom: "2px"
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
    itemMarginBottom: "14px"
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
      marginBottom: "12px", 
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
  
  // Default section positions for ATS template
  // ...
positions: {
  header: { x: 40, y: 40, scaleX: 1, scaleY: 1 },
  summary: { x: 40, y: 150, scaleX: 1, scaleY: 1 },
  skills: { x: 40, y: 250, scaleX: 1, scaleY: 1 },
  experience: { x: 40, y: 850, scaleX: 1, scaleY: 1 }, // Pushed up 10px
  projects: { x: 40, y: 500, scaleX: 1, scaleY: 1 },    // Pushed up 100px
  education: { x: 40, y: 700, scaleX: 1, scaleY: 1 },   // Pushed up 120px
  certifications: { x: 40, y: 780, scaleX: 1, scaleY: 1 } // Pushed up 200px (to be on-page)
},
// ...
  
  // No lines for ATS template (clean, simple)
  lines: [],
  
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
      width: "600px",
      backgroundColor: "transparent",
      padding: "0"
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "8px" },
    nameSection: { display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    nameStyle: { fontSize: "24px", fontWeight: "bold", color: "#000000" },
    titleStyle: { fontSize: "14px", fontWeight: "normal", color: "#000000" },
    showTitle: true,
    showContact: true,
    contactLayout: { display: "flex", flexDirection: "row", gap: "12px", flexWrap: "wrap" },
    contactOrder: ["email", "phone", "linkedin", "location"],
    contactItemStyle: { fontSize: "9px", color: "#000000" },
    showContactIcons: false,
    showDivider: true,
    dividerStyle: "2px solid #000000",
    dividerMarginTop: "8px",
    dividerMarginBottom: "0"
  },
  
  summary: {
    container: { 
      width: "600px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "8px", paddingBottom: "3px" },
    bodyStyle: { fontSize: "10px", color: "#000000", lineHeight: "1.5", textAlign: "justify" }
  },
  
  skills: {
    container: { 
      width: "300px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "8px", paddingBottom: "3px" },
    contentLayout: { display: "flex", flexDirection: "column", gap: "6px" },
    showCategories: true,
    categoryStyle: { fontSize: "10px", fontWeight: "bold", color: "#000000" },
    valueStyle: { fontSize: "9px", color: "#000000", lineHeight: "1.4" },
    displayType: "inline",
    separator: ", ",
    itemMarginBottom: "8px"
  },
  
  experience: {
    container: { 
      width: "300px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "8px", paddingBottom: "3px" },
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
      itemMarginBottom: "3px"
    },
    itemMarginBottom: "12px"
  },
  
  projects: {
    container: { 
      width: "300px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "8px", paddingBottom: "3px" },
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
      itemMarginBottom: "3px"
    },
    itemMarginBottom: "11px"
  },
  
  education: {
    container: { 
      width: "300px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "8px", paddingBottom: "3px" },
    degreeStyle: { fontSize: "10px", fontWeight: "bold", color: "#000000", lineHeight: "1.4" },
    institutionStyle: { fontSize: "9px", color: "#000000", lineHeight: "1.4" },
    detailsLayout: { display: "flex", gap: "8px", flexWrap: "wrap" },
    detailsStyle: { fontSize: "9px", fontStyle: "italic", color: "#666666", lineHeight: "1.4" },
    showInstitution: true,
    showGpa: true,
    showLocation: false,
    gpaPrefix: "GPA: ",
    itemMarginBottom: "10px"
  },
  
  certifications: {
    container: { 
      width: "300px",
      backgroundColor: "transparent",
      padding: "0"
    },
    showTitle: true,
    titleStyle: { fontSize: "12px", fontWeight: "bold", color: "#000000", borderBottom: "1px solid #000", marginBottom: "8px", paddingBottom: "3px" },
    displayType: "list",
    bulletConfig: {
      bulletStyle: "•",
      bulletWidth: "10px",
      bulletColor: "#000000",
      textSize: "9px",
      textColor: "#000000",
      lineHeight: "1.4",
      itemMarginBottom: "4px"
    },
    itemStyle: { fontSize: "9px", color: "#000000", marginBottom: "4px" }
  }
};

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
    header: { x: 40, y: 30, scaleX: 1, scaleY: 1 },
    contact: { x: 40, y: 180, scaleX: 1, scaleY: 1 }, 
    skills: { x: 40, y: 380, scaleX: 1, scaleY: 1 },
    education: { x: 40, y: 650, scaleX: 1, scaleY: 1 },

    // Right Column Positions (on white background)
    summary: { x: 270, y: 150, scaleX: 1, scaleY: 1 },
    experience: { x: 270, y: 280, scaleX: 1, scaleY: 1 },
    projects: { x: 270, y: 500, scaleX: 1, scaleY: 1 },
    certifications: { x: 270, y: 800, scaleX: 1, scaleY: 1 }
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
  
  // --- 2. Left Column Styles (Black Sidebar Sections) ---
  
  header: {
    container: { 
      // This section must span the entire top width or be split manually in the UI code
      width: "600px", 
      backgroundColor: "transparent",
      padding: "20px 40px",
      color: "#FFFFFF",
    },
    mainLayout: { display: "flex", flexDirection: "column", gap: "2px" },
    nameSection: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
    nameStyle: { fontSize: "28px", fontWeight: "900", color: "#FFFFFF", textTransform: "uppercase" },
    titleStyle: { fontSize: "14px", fontWeight: "normal", color: "#F0F0F0", marginTop: "4px" },
    showTitle: true,
    showContact: false, // Contact section handled separately below
    showDivider: false, // Divider handled by column structure
  },

  // NEW SECTION: Contact (styled for the sidebar)
  contact: {
    container: { 
      width: "200px", // Match sidebar width
      backgroundColor: "transparent", 
      padding: "20px 20px 20px 40px", // Left padding for alignment
      color: "#FFFFFF",
    },
    showTitle: true,
    titleStyle: { fontSize: "14px", fontWeight: "bold", color: "#FFFFFF", marginBottom: "8px", textTransform: "uppercase" },
    contactLayout: { display: "flex", flexDirection: "column", gap: "6px" },
    contactOrder: ["phone", "email", "linkedin", "location"],
    contactItemStyle: { fontSize: "9px", color: "#F0F0F0" },
    showContactIcons: false,
  },
  
  skills: {
    container: { 
      width: "200px", 
      backgroundColor: "transparent", 
      padding: "20px 20px 20px 40px",
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
      width: "200px",
      backgroundColor: "transparent",
      padding: "20px 20px 20px 40px",
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
    showLocation: false,
    gpaPrefix: "GPA: ",
    itemMarginBottom: "10px"
  },
  
  certifications: {
    container: { 
      width: "400px", // Right column width
      backgroundColor: "transparent",
      padding: "0 40px 0 0",
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
      width: "400px", // Main content width
      backgroundColor: "transparent",
      padding: "0 40px 0 0",
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
      padding: "0 40px 0 0",
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
      padding: "0 40px 0 0",
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
    itemMarginBottom: "11px"
  },
};
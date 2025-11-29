// Template1.jsx - ATS-Optimized with Clean Two-Column Layout (Configurable)
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Template1 = ({ 
  resumeDetails, 
  skills, 
  experiences, 
  projects, 
  educationList, 
  certifications,
  showSummary = true,
  showSkills = true,
  showExperience = true,
  showProjects = true,
  showEducation = true,
  showCertifications = true,
  sectionTitles = {},
  customSections = [],
  styleConfig = null // NEW: Optional style configuration
}) => {
  // Default style configuration
  const defaultConfig = {
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

  // Merge provided config with defaults
  const config = { ...defaultConfig, ...styleConfig };

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: config.backgroundColor,
      padding: config.pageMargin,
      fontFamily: config.fontFamily,
      fontSize: config.bodyFontSize,
    },
    
    // Header - Clean & Professional
    header: {
      marginBottom: config.headerMarginBottom,
    },
    nameSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 6,
      paddingBottom: 8,
      borderBottomWidth: config.headerBorderWidth,
      borderBottomColor: config.primaryColor,
    },
    name: { 
      fontSize: config.nameFontSize, 
      fontWeight: 'bold', 
      color: config.primaryColor,
      letterSpacing: config.letterSpacing,
    },
    title: { 
      fontSize: config.titleFontSize, 
      color: config.primaryColor,
      fontWeight: 'bold',
    },
    contactGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      paddingTop: 6,
    },
    contactLeft: {
      flexDirection: 'column',
      gap: 3,
    },
    contactRight: {
      flexDirection: 'column',
      gap: 3,
      alignItems: 'flex-end',
    },
    contactItem: {
      fontSize: config.smallFontSize,
      color: config.textColor,
    },
    
    // Two Column Layout
    mainContent: {
      flexDirection: 'row',
      gap: config.columnGap,
    },
    leftColumn: {
      width: config.leftColumnWidth,
      paddingRight: 10,
    },
    rightColumn: {
      width: config.rightColumnWidth,
      paddingLeft: 10,
      borderLeftWidth: config.columnBorderWidth,
      borderLeftColor: config.accentColor,
    },
    
    // Section Headers - ATS Friendly
    sectionHeader: {
      fontSize: config.headerFontSize,
      fontWeight: 'bold',
      color: config.primaryColor,
      marginTop: config.sectionMarginTop,
      marginBottom: config.sectionMarginBottom,
      paddingBottom: 3,
      borderBottomWidth: config.sectionBorderWidth,
      borderBottomColor: config.accentColor,
      textTransform: config.textTransform,
      letterSpacing: config.letterSpacing,
    },
    
    sectionHeaderLeft: {
      fontSize: config.headerFontSize,
      fontWeight: 'bold',
      color: config.primaryColor,
      marginTop: config.sectionMarginTop,
      marginBottom: config.sectionMarginBottom,
      paddingBottom: 3,
      borderBottomWidth: config.sectionBorderWidth,
      borderBottomColor: config.accentColor,
      textTransform: config.textTransform,
      letterSpacing: config.letterSpacing,
    },
    
    // Skills - Clean List
    skillItem: {
      marginBottom: config.itemMarginBottom,
    },
    skillCategory: {
      fontSize: config.smallFontSize + 0.5,
      fontWeight: 'bold',
      color: config.textColor,
      marginBottom: 2,
    },
    skillValue: {
      fontSize: config.smallFontSize,
      color: config.textColor,
      lineHeight: config.lineHeight,
    },
    
    // Education - Compact Left Column
    educationItemCompact: {
      marginBottom: 10,
    },
    degreeNameCompact: {
      fontSize: config.bodyFontSize,
      fontWeight: 'bold',
      color: config.textColor,
      marginBottom: 2,
    },
    institutionCompact: {
      fontSize: config.smallFontSize,
      color: config.textColor,
      marginBottom: 2,
    },
    yearCompact: {
      fontSize: config.smallFontSize,
      color: config.textColor,
      fontStyle: 'italic',
    },
    
    // Certifications - Clean
    certItem: {
      fontSize: config.smallFontSize,
      color: config.textColor,
      marginBottom: 4,
      lineHeight: 1.3,
    },
    
    // Summary
    summaryText: {
      fontSize: config.bodyFontSize,
      lineHeight: 1.5,
      color: config.textColor,
      textAlign: 'justify',
      marginBottom: 8,
    },
    
    // Experience - Right Column
    experienceItem: {
      marginBottom: 12,
    },
    experienceHeader: {
      marginBottom: 3,
    },
    jobTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: config.headerFontSize,
      fontWeight: 'bold',
      color: config.textColor,
    },
    dateRange: {
      fontSize: config.smallFontSize,
      color: config.textColor,
      fontStyle: 'italic',
    },
    companyInfo: {
      fontSize: config.smallFontSize + 0.5,
      color: config.textColor,
      marginBottom: 4,
    },
    achievementItem: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    bullet: {
      width: 10,
      fontSize: config.smallFontSize,
      color: config.textColor,
    },
    achievementText: {
      flex: 1,
      fontSize: config.smallFontSize + 0.5,
      lineHeight: config.lineHeight,
      color: config.textColor,
    },
    
    // Projects
    projectItem: {
      marginBottom: 11,
    },
    projectTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    projectTitle: {
      fontSize: config.headerFontSize,
      fontWeight: 'bold',
      color: config.textColor,
    },
    projectTech: {
      fontSize: config.smallFontSize,
      color: config.textColor,
      marginBottom: 4,
      fontStyle: 'italic',
    },
  });

  // Group skills (utility function kept inline)
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{resumeDetails.name}</Text>
            <Text style={styles.title}>{resumeDetails.title}</Text>
          </View>
          
          <View style={styles.contactGrid}>
            <View style={styles.contactLeft}>
              {resumeDetails.contact?.phone && (
                <Text style={styles.contactItem}>{resumeDetails.contact.phone}</Text>
              )}
              {resumeDetails.contact?.email && (
                <Text style={styles.contactItem}>{resumeDetails.contact.email}</Text>
              )}
            </View>
            <View style={styles.contactRight}>
              {resumeDetails.contact?.linkedin && (
                <Text style={styles.contactItem}>{resumeDetails.contact.linkedin}</Text>
              )}
              {resumeDetails.contact?.github && (
                <Text style={styles.contactItem}>{resumeDetails.contact.github}</Text>
              )}
              {resumeDetails.contact?.location && (
                <Text style={styles.contactItem}>{resumeDetails.contact.location}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Summary - Full Width */}
        {showSummary && resumeDetails.summary && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.summary || "PROFESSIONAL SUMMARY"}
            </Text>
            <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
          </View>
        )}

        {/* Two Column Layout */}
        <View style={styles.mainContent}>
          
          {/* LEFT COLUMN - Skills, Education, Certifications */}
          <View style={styles.leftColumn}>
            
            {/* Skills */}
            {showSkills && skills && skills.length > 0 && (
              <View>
                <Text style={styles.sectionHeaderLeft}>
                  {sectionTitles.skills || "SKILLS"}
                </Text>
                <View>
                  {Object.entries(groupedSkills).map(([category, values], idx) => (
                    <View key={idx} style={styles.skillItem}>
                      <Text style={styles.skillCategory}>{category}</Text>
                      <Text style={styles.skillValue}>{values}</Text>
                    </View>
                  ))}
                  {ungroupedSkills.length > 0 && (
                    <View style={styles.skillItem}>
                      <Text style={styles.skillCategory}>Other</Text>
                      <Text style={styles.skillValue}>{ungroupedSkills.join(', ')}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Education */}
            {showEducation && educationList && educationList.length > 0 && (
              <View>
                <Text style={styles.sectionHeaderLeft}>
                  {sectionTitles.education || "EDUCATION"}
                </Text>
                {educationList.map((edu, idx) => (
                  <View key={idx} style={styles.educationItemCompact}>
                    <Text style={styles.degreeNameCompact}>{edu.degree}</Text>
                    {edu.institution && (
                      <Text style={styles.institutionCompact}>{edu.institution}</Text>
                    )}
                    <Text style={styles.yearCompact}>
                      {edu.year}
                      {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                    </Text>
                    {edu.location && (
                      <Text style={styles.yearCompact}>{edu.location}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {showCertifications && certifications && certifications.length > 0 && (
              <View>
                <Text style={styles.sectionHeaderLeft}>
                  {sectionTitles.certifications || "CERTIFICATIONS"}
                </Text>
                {certifications.filter(cert => cert && cert.trim()).map((cert, idx) => (
                  <Text key={idx} style={styles.certItem}>{config.bulletStyle} {cert}</Text>
                ))}
              </View>
            )}

          </View>

          {/* RIGHT COLUMN - Experience & Projects */}
          <View style={styles.rightColumn}>
            
            {/* Experience */}
            {showExperience && experiences && experiences.length > 0 && (
              <View>
                <Text style={styles.sectionHeader}>
                  {sectionTitles.experience || "EXPERIENCE"}
                </Text>
                {experiences.map((exp, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <View style={styles.jobTitleRow}>
                        <Text style={styles.jobTitle}>{exp.position}</Text>
                        <Text style={styles.dateRange}>{exp.duration}</Text>
                      </View>
                      <Text style={styles.companyInfo}>
                        {exp.company}{exp.location ? `, ${exp.location}` : ''}
                      </Text>
                    </View>
                    {exp.achievements && exp.achievements.map((ach, j) => (
                      ach && ach.trim() && (
                        <View key={j} style={styles.achievementItem}>
                          <Text style={styles.bullet}>{config.bulletStyle}</Text>
                          <Text style={styles.achievementText}>{ach}</Text>
                        </View>
                      )
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {showProjects && projects && projects.length > 0 && (
              <View>
                <Text style={styles.sectionHeader}>
                  {sectionTitles.projects || "PROJECTS"}
                </Text>
                {projects.map((proj, idx) => (
                  <View key={idx} style={styles.projectItem}>
                    <View style={styles.projectTitleRow}>
                      <Text style={styles.projectTitle}>{proj.name}</Text>
                      {proj.duration && <Text style={styles.dateRange}>{proj.duration}</Text>}
                    </View>
                    {proj.technologies && (
                      <Text style={styles.projectTech}>{proj.technologies}</Text>
                    )}
                    {proj.description && proj.description.map((desc, j) => (
                      desc && desc.trim() && (
                        <View key={j} style={styles.achievementItem}>
                          <Text style={styles.bullet}>{config.bulletStyle}</Text>
                          <Text style={styles.achievementText}>{desc}</Text>
                        </View>
                      )
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Custom Sections */}
            {customSections && customSections.length > 0 && customSections.map((section) => (
              section.title && section.title.trim() && (
                <View key={section.id}>
                  <Text style={styles.sectionHeader}>{section.title}</Text>
                  {section.items && section.items.filter(item => item && item.trim()).map((item, idx) => (
                    <View key={idx} style={styles.achievementItem}>
                      <Text style={styles.bullet}>{config.bulletStyle}</Text>
                      <Text style={styles.achievementText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )
            ))}

          </View>
        </View>

      </Page>
    </Document>
  );
};

export default Template1;
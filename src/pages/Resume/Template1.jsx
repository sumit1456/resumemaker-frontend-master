// Template4.jsx - ATS-Optimized with Clean Two-Column Layout
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
  customSections = []
}) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 40,
      fontFamily: 'Helvetica',
      fontSize: 10,
    },
    
    // Header - Clean & Professional
    header: {
      marginBottom: 20,
    },
    nameSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 6,
      paddingBottom: 8,
      borderBottomWidth: 3,
      borderBottomColor: '#000000',
    },
    name: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      color: '#000000',
      letterSpacing: 0.5,
    },
    title: { 
      fontSize: 11, 
      color: '#000000',
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
      fontSize: 9,
      color: '#000000',
    },
    
    // Two Column Layout
    mainContent: {
      flexDirection: 'row',
      gap: 15,
    },
    leftColumn: {
      width: '35%',
      paddingRight: 10,
    },
    rightColumn: {
      width: '65%',
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: '#000000',
    },
    
    // Section Headers - ATS Friendly
    sectionHeader: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
      marginTop: 12,
      marginBottom: 6,
      paddingBottom: 3,
      borderBottomWidth: 1.5,
      borderBottomColor: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    
    sectionHeaderLeft: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
      marginTop: 12,
      marginBottom: 6,
      paddingBottom: 3,
      borderBottomWidth: 1.5,
      borderBottomColor: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    
    // Skills - Clean List
    skillItem: {
      marginBottom: 8,
    },
    skillCategory: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 2,
    },
    skillValue: {
      fontSize: 9,
      color: '#000000',
      lineHeight: 1.4,
    },
    
    // Education - Compact Left Column
    educationItemCompact: {
      marginBottom: 10,
    },
    degreeNameCompact: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 2,
    },
    institutionCompact: {
      fontSize: 9,
      color: '#000000',
      marginBottom: 2,
    },
    yearCompact: {
      fontSize: 9,
      color: '#000000',
      fontStyle: 'italic',
    },
    
    // Certifications - Clean
    certItem: {
      fontSize: 9,
      color: '#000000',
      marginBottom: 4,
      lineHeight: 1.3,
    },
    
    // Summary
    summaryText: {
      fontSize: 10,
      lineHeight: 1.5,
      color: '#000000',
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
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
    },
    dateRange: {
      fontSize: 9,
      color: '#000000',
      fontStyle: 'italic',
    },
    companyInfo: {
      fontSize: 9.5,
      color: '#000000',
      marginBottom: 4,
    },
    achievementItem: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    bullet: {
      width: 10,
      fontSize: 9,
      color: '#000000',
    },
    achievementText: {
      flex: 1,
      fontSize: 9.5,
      lineHeight: 1.4,
      color: '#000000',
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
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
    },
    projectTech: {
      fontSize: 9,
      color: '#000000',
      marginBottom: 4,
      fontStyle: 'italic',
    },
  });

  // Group skills
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
                  <Text key={idx} style={styles.certItem}>• {cert}</Text>
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
                          <Text style={styles.bullet}>•</Text>
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
                          <Text style={styles.bullet}>•</Text>
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
                      <Text style={styles.bullet}>•</Text>
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
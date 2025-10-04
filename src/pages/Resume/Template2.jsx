// Template2.jsx - Modern Two-Column Resume (Improved)
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const ModernResumeDocument = ({ 
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
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Helvetica',
    },
    leftSidebar: {
      width: '35%',
      backgroundColor: '#1a1a1a',
      color: '#FFFFFF',
      padding: 25,
      paddingTop: 30,
    },
    rightMain: {
      width: '65%',
      padding: 30,
      paddingLeft: 35,
    },
    
    // Sidebar Styles
    profileSection: {
      marginBottom: 25,
      paddingBottom: 20,
      borderBottomWidth: 3,
      borderBottomColor: '#FFFFFF',
    },
    name: { 
      fontSize: 22, 
      fontWeight: 'bold', 
      color: '#FFFFFF', 
      marginBottom: 6,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    title: { 
      fontSize: 11, 
      color: '#E0E0E0', 
      marginTop: 6,
      lineHeight: 1.3,
    },
    
    sidebarSection: {
      marginBottom: 22,
    },
    sidebarTitle: { 
      fontSize: 11, 
      fontWeight: 'bold', 
      color: '#FFFFFF', 
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingBottom: 4,
      borderBottomWidth: 2,
      borderBottomColor: '#FFFFFF',
    },
    contactItem: { 
      fontSize: 9, 
      color: '#E0E0E0', 
      marginBottom: 6,
      lineHeight: 1.4,
    },
    contactLabel: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginRight: 4,
    },
    
    // Skills - improved grouping
    skillItem: {
      marginBottom: 8,
    },
    skillCategory: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 3,
    },
    skillValue: {
      fontSize: 9,
      color: '#E0E0E0',
      lineHeight: 1.4,
    },
    
    certificationItem: { 
      fontSize: 9, 
      color: '#E0E0E0', 
      marginBottom: 6,
      lineHeight: 1.4,
      paddingLeft: 8,
    },
    certBullet: {
      color: '#FFFFFF',
      marginRight: 6,
    },
    
    // Education in sidebar
    educationItemSidebar: {
      marginBottom: 14,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#404040',
    },
    eduDegree: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 3,
    },
    eduInstitution: {
      fontSize: 9,
      color: '#E0E0E0',
      marginBottom: 2,
    },
    eduDetails: {
      fontSize: 8.5,
      color: '#B0B0B0',
      fontStyle: 'italic',
    },
    
    // Main Content Styles
    mainSection: { 
      marginBottom: 24,
    },
    mainTitle: { 
      fontSize: 13, 
      fontWeight: 'bold', 
      color: '#000000', 
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingBottom: 6,
      borderBottomWidth: 3,
      borderBottomColor: '#000000',
    },
    summaryText: { 
      fontSize: 10, 
      lineHeight: 1.6, 
      color: '#2a2a2a',
      textAlign: 'justify',
    },
    
    // Experience Styles
    experienceItem: { 
      marginBottom: 18,
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
      alignItems: 'baseline',
    },
    position: { 
      fontSize: 11.5, 
      fontWeight: 'bold', 
      color: '#000000',
    },
    duration: {
      fontSize: 9.5,
      color: '#000000',
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
    companyInfo: {
      fontSize: 10,
      color: '#2a2a2a',
      marginBottom: 6,
    },
    bulletPoint: { 
      fontSize: 9.5, 
      color: '#2a2a2a', 
      marginLeft: 12, 
      marginBottom: 3,
      flexDirection: 'row',
      lineHeight: 1.45,
    },
    bullet: { 
      width: 12, 
      fontWeight: 'bold',
      color: '#000000',
      fontSize: 10,
    },
    bulletText: { 
      flex: 1,
    },
    
    // Project Styles
    projectItem: { 
      marginBottom: 16,
    },
    projectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
      alignItems: 'baseline',
    },
    projectName: { 
      fontSize: 11.5, 
      fontWeight: 'bold', 
      color: '#000000',
    },
    projectTech: { 
      fontSize: 9.5, 
      color: '#2a2a2a', 
      marginBottom: 6,
      fontStyle: 'italic',
    },
    projectLink: {
      fontSize: 8.5,
      color: '#666666',
      marginBottom: 6,
    },
  });

  // Group skills by category
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
        {/* Left Sidebar - Dark Theme */}
        <View style={styles.leftSidebar}>
          
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Text style={styles.name}>{resumeDetails.name}</Text>
            <Text style={styles.title}>{resumeDetails.title}</Text>
          </View>

          {/* Contact Information */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>CONTACT</Text>
            {resumeDetails.contact?.phone && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>Phone:</Text> {resumeDetails.contact.phone}
              </Text>
            )}
            {resumeDetails.contact?.email && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email:</Text> {resumeDetails.contact.email}
              </Text>
            )}
            {resumeDetails.contact?.linkedin && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>LinkedIn:</Text> {resumeDetails.contact.linkedin}
              </Text>
            )}
            {resumeDetails.contact?.github && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>GitHub:</Text> {resumeDetails.contact.github}
              </Text>
            )}
            {resumeDetails.contact?.location && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>Location:</Text> {resumeDetails.contact.location}
              </Text>
            )}
          </View>

          {/* Skills */}
          {showSkills && skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{sectionTitles.skills || 'SKILLS'}</Text>
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
          )}

          {/* Education */}
          {showEducation && educationList && educationList.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{sectionTitles.education || 'EDUCATION'}</Text>
              {educationList.map((edu, idx) => (
                <View key={idx} style={styles.educationItemSidebar}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  {edu.institution && (
                    <Text style={styles.eduInstitution}>{edu.institution}</Text>
                  )}
                  <Text style={styles.eduDetails}>
                    {edu.year}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </Text>
                  {edu.location && (
                    <Text style={styles.eduDetails}>{edu.location}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {showCertifications && certifications && certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{sectionTitles.certifications || 'CERTIFICATIONS'}</Text>
              {certifications.filter(cert => cert && cert.trim()).map((cert, idx) => (
                <Text key={idx} style={styles.certificationItem}>
                  <Text style={styles.certBullet}>•</Text> {cert}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Right Main Content - Light Theme */}
        <View style={styles.rightMain}>
          
          {/* Professional Summary */}
          {showSummary && resumeDetails.summary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{sectionTitles.summary || 'PROFESSIONAL SUMMARY'}</Text>
              <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
            </View>
          )}

          {/* Professional Experience */}
          {showExperience && experiences && experiences.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{sectionTitles.experience || 'EXPERIENCE'}</Text>
              {experiences.map((exp, idx) => (
                <View key={idx} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.position}>{exp.position}</Text>
                    <Text style={styles.duration}>{exp.duration}</Text>
                  </View>
                  <Text style={styles.companyInfo}>
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </Text>
                  {exp.achievements && exp.achievements.map((ach, j) => (
                    ach && ach.trim() && (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{ach}</Text>
                      </View>
                    )
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {showProjects && projects && projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{sectionTitles.projects || 'PROJECTS'}</Text>
              {projects.map((proj, idx) => (
                <View key={idx} style={styles.projectItem}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectName}>{proj.name}</Text>
                    {proj.duration && <Text style={styles.duration}>{proj.duration}</Text>}
                  </View>
                  {proj.technologies && (
                    <Text style={styles.projectTech}>Technologies: {proj.technologies}</Text>
                  )}
                  {proj.link && (
                    <Text style={styles.projectLink}>{proj.link}</Text>
                  )}
                  {proj.description && proj.description.map((desc, j) => (
                    desc && desc.trim() && (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{desc}</Text>
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
              <View key={section.id} style={styles.mainSection}>
                <Text style={styles.mainTitle}>{section.title}</Text>
                {section.items && section.items.filter(item => item && item.trim()).map((item, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ModernResumeDocument;
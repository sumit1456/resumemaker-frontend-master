import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";


const Template7 = ({
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
}) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      fontFamily: "Helvetica",
      fontSize: 10,
    },
    // Left Sidebar
    sidebar: {
      width: "35%",
      backgroundColor: "#2C3E50",
      padding: 20,
      color: "#FFFFFF",
    },
    sidebarName: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    sidebarTitle: {
      fontSize: 12,
      color: "#ECF0F1",
      marginBottom: 15,
      fontWeight: "bold",
    },
    sidebarSection: {
      marginBottom: 15,
    },
    sidebarSectionHeader: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#E74C3C",
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 2,
      borderBottomColor: "#E74C3C",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    contactItem: {
      fontSize: 9,
      color: "#ECF0F1",
      marginBottom: 4,
      lineHeight: 1.4,
    },
    skillItem: {
      fontSize: 9,
      color: "#ECF0F1",
      marginBottom: 5,
      lineHeight: 1.3,
    },
    certItem: {
      fontSize: 9,
      color: "#ECF0F1",
      marginBottom: 5,
      lineHeight: 1.3,
    },
    // Main Content Area
    mainContent: {
      width: "65%",
      padding: 25,
    },
    summarySection: {
      marginBottom: 15,
    },
    mainSectionHeader: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#E74C3C",
      marginBottom: 8,
      paddingBottom: 4,
      paddingLeft: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#E74C3C",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    summaryText: {
      fontSize: 10,
      lineHeight: 1.5,
      color: "#2C3E50",
      textAlign: "justify",
    },
    experienceItem: {
      marginBottom: 12,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#2C3E50",
    },
    dateRange: {
      fontSize: 9,
      color: "#E74C3C",
      fontWeight: "bold",
    },
    companyInfo: {
      fontSize: 10,
      color: "#7F8C8D",
      marginBottom: 4,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 3,
      marginLeft: 8,
    },
    bullet: {
      width: 10,
      fontSize: 10,
      marginRight: 5,
      color: "#E74C3C",
      fontWeight: "bold",
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 1.4,
      color: "#34495E",
    },
    projectItem: {
      marginBottom: 12,
    },
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    projectTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#2C3E50",
    },
    projectTech: {
      fontSize: 9,
      color: "#7F8C8D",
      marginBottom: 4,
      fontStyle: "italic",
    },
    educationItem: {
      marginBottom: 10,
    },
    educationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    degreeName: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#2C3E50",
    },
    institutionName: {
      fontSize: 10,
      color: "#7F8C8D",
    },
    educationDetails: {
      fontSize: 9,
      color: "#7F8C8D",
      marginTop: 1,
    },
  });

  // Group skills by category
  const groupedSkills = {};
  const ungroupedSkills = [];
  if (skills && Array.isArray(skills)) {
    skills.forEach((skill) => {
      if (skill.includes(" - ")) {
        const [category, values] = skill.split(" - ");
        groupedSkills[category.trim()] = values.trim();
      } else if (skill.trim()) {
        ungroupedSkills.push(skill.trim());
      }
    });
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {/* Name and Title */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sidebarName}>{resumeDetails.name}</Text>
            <Text style={styles.sidebarTitle}>{resumeDetails.title}</Text>
          </View>

          {/* Contact Information */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionHeader}>CONTACT</Text>
            {resumeDetails.contact?.phone && (
              <Text style={styles.contactItem}>📱 {resumeDetails.contact.phone}</Text>
            )}
            {resumeDetails.contact?.email && (
              <Text style={styles.contactItem}>✉ {resumeDetails.contact.email}</Text>
            )}
            {resumeDetails.contact?.location && (
              <Text style={styles.contactItem}>📍 {resumeDetails.contact.location}</Text>
            )}
            {resumeDetails.contact?.linkedin && (
              <Text style={styles.contactItem}>🔗 {resumeDetails.contact.linkedin}</Text>
            )}
            {resumeDetails.contact?.github && (
              <Text style={styles.contactItem}>💻 {resumeDetails.contact.github}</Text>
            )}
          </View>

          {/* Skills in Sidebar */}
          {showSkills && skills?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionHeader}>
                {sectionTitles.skills || "SKILLS"}
              </Text>
              {Object.entries(groupedSkills).map(([category, values], idx) => (
                <View key={idx} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: "#E74C3C", marginBottom: 2 }}>
                    {category}
                  </Text>
                  <Text style={styles.skillItem}>{values}</Text>
                </View>
              ))}
              {ungroupedSkills.map((skill, idx) => (
                <Text key={idx} style={styles.skillItem}>• {skill}</Text>
              ))}
            </View>
          )}

          {/* Certifications in Sidebar */}
          {showCertifications && certifications?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionHeader}>
                {sectionTitles.certifications || "CERTIFICATIONS"}
              </Text>
              {certifications
                .filter((c) => c.trim())
                .map((cert, idx) => (
                  <Text key={idx} style={styles.certItem}>• {cert}</Text>
                ))}
            </View>
          )}

          {/* Education in Sidebar */}
          {showEducation && educationList?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionHeader}>
                {sectionTitles.education || "EDUCATION"}
              </Text>
              {educationList.map((edu, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: "#ECF0F1", marginBottom: 1 }}>
                    {edu.degree}
                  </Text>
                  {edu.institution && (
                    <Text style={{ fontSize: 9, color: "#BDC3C7", marginBottom: 1 }}>
                      {edu.institution}
                    </Text>
                  )}
                  {edu.year && (
                    <Text style={{ fontSize: 9, color: "#95A5A6" }}>{edu.year}</Text>
                  )}
                  {edu.gpa && (
                    <Text style={{ fontSize: 9, color: "#95A5A6" }}>GPA: {edu.gpa}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {showSummary && resumeDetails.summary && (
            <View style={styles.summarySection}>
              <Text style={styles.mainSectionHeader}>
                {sectionTitles.summary || "PROFESSIONAL SUMMARY"}
              </Text>
              <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {showExperience && experiences?.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.mainSectionHeader}>
                {sectionTitles.experience || "EXPERIENCE"}
              </Text>
              {experiences.map((exp, idx) => (
                <View key={idx} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.dateRange}>{exp.duration}</Text>
                  </View>
                  <Text style={styles.companyInfo}>
                    {exp.company}
                    {exp.location ? ` | ${exp.location}` : ""}
                  </Text>
                  {exp.achievements?.map(
                    (ach, j) =>
                      ach.trim() && (
                        <View key={j} style={styles.bulletPoint}>
                          <Text style={styles.bullet}>▸</Text>
                          <Text style={styles.bulletText}>{ach}</Text>
                        </View>
                      )
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {showProjects && projects?.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.mainSectionHeader}>
                {sectionTitles.projects || "PROJECTS"}
              </Text>
              {projects.map((proj, idx) => (
                <View key={idx} style={styles.projectItem}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{proj.name}</Text>
                    {proj.duration && <Text style={styles.dateRange}>{proj.duration}</Text>}
                  </View>
                  {proj.technologies && (
                    <Text style={styles.projectTech}>{proj.technologies}</Text>
                  )}
                  {proj.description?.map(
                    (desc, j) =>
                      desc.trim() && (
                        <View key={j} style={styles.bulletPoint}>
                          <Text style={styles.bullet}>▸</Text>
                          <Text style={styles.bulletText}>{desc}</Text>
                        </View>
                      )
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Custom Sections */}
          {customSections?.map(
            (section) =>
              section.title.trim() && (
                <View key={section.id} style={{ marginBottom: 15 }}>
                  <Text style={styles.mainSectionHeader}>{section.title}</Text>
                  {section.items
                    .filter((item) => item.trim())
                    .map((item, idx) => (
                      <View key={idx} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>▸</Text>
                        <Text style={styles.bulletText}>{item}</Text>
                      </View>
                    ))}
                </View>
              )
          )}
        </View>
      </Page>
    </Document>
  );
};

export default Template7;
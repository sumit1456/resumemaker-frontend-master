import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Template4 = ({
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
    sidebar: {
      width: "35%",
      backgroundColor: "#1a1a1a",
      padding: 30,
      paddingTop: 40,
      color: "#FFFFFF",
    },
    mainContent: {
      width: "65%",
      padding: 40,
      paddingTop: 40,
    },
    sidebarName: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 8,
      lineHeight: 1.2,
    },
    sidebarTitle: {
      fontSize: 11,
      color: "#cccccc",
      marginBottom: 20,
      letterSpacing: 0.5,
      lineHeight: 1.3,
    },
    sidebarSection: {
      marginBottom: 24,
    },
    sidebarHeader: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 10,
      paddingBottom: 6,
      borderBottomWidth: 2,
      borderBottomColor: "#FFFFFF",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    contactItem: {
      fontSize: 9,
      color: "#cccccc",
      marginBottom: 8,
      lineHeight: 1.4,
    },
    contactLabel: {
      fontSize: 8,
      color: "#999999",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    skillItem: {
      fontSize: 9.5,
      color: "#e0e0e0",
      marginBottom: 6,
      paddingLeft: 10,
      lineHeight: 1.4,
    },
    skillBullet: {
      position: "absolute",
      left: 0,
      color: "#FFFFFF",
    },
    educationSidebarItem: {
      marginBottom: 14,
    },
    educationDegree: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 2,
    },
    educationInstitution: {
      fontSize: 9,
      color: "#cccccc",
      marginBottom: 2,
    },
    educationYear: {
      fontSize: 8.5,
      color: "#999999",
    },
    certSidebarItem: {
      fontSize: 9,
      color: "#e0e0e0",
      marginBottom: 8,
      paddingLeft: 10,
      lineHeight: 1.3,
    },
    mainHeader: {
      marginBottom: 8,
      paddingBottom: 3,
    },
    accentBar: {
      height: 4,
      backgroundColor: "#1a1a1a",
      marginBottom: 25,
      width: 80,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#1a1a1a",
      marginTop: 20,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 2,
      position: "relative",
    },
    sectionAccent: {
      position: "absolute",
      left: -15,
      top: 5,
      width: 4,
      height: 14,
      backgroundColor: "#1a1a1a",
    },
    summaryText: {
      fontSize: 10,
      lineHeight: 1.6,
      color: "#2a2a2a",
      marginBottom: 4,
      textAlign: "justify",
    },
    experienceItem: {
      marginBottom: 16,
      paddingLeft: 15,
      position: "relative",
    },
    experienceMarker: {
      position: "absolute",
      left: 0,
      top: 2,
      width: 6,
      height: 6,
      backgroundColor: "#1a1a1a",
      borderRadius: 3,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    jobTitle: {
      fontSize: 11.5,
      fontWeight: "bold",
      color: "#1a1a1a",
      flex: 1,
      lineHeight: 1.3,
    },
    dateRange: {
      fontSize: 9,
      color: "#666666",
      fontStyle: "italic",
      marginLeft: 10,
    },
    companyInfo: {
      fontSize: 10,
      color: "#444444",
      marginBottom: 6,
      fontStyle: "italic",
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 4,
      paddingLeft: 0,
    },
    bullet: {
      width: 10,
      fontSize: 8,
      marginRight: 8,
      color: "#1a1a1a",
      marginTop: 2,
    },
    bulletText: {
      flex: 1,
      fontSize: 9.5,
      lineHeight: 1.5,
      color: "#2a2a2a",
    },
    projectItem: {
      marginBottom: 14,
      paddingLeft: 15,
      position: "relative",
    },
    projectMarker: {
      position: "absolute",
      left: 0,
      top: 2,
      width: 6,
      height: 6,
      backgroundColor: "#1a1a1a",
      borderRadius: 3,
    },
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    projectTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#1a1a1a",
      flex: 1,
    },
    projectTech: {
      fontSize: 9,
      color: "#555555",
      marginBottom: 4,
    },
    projectLink: {
      fontSize: 8.5,
      color: "#0066cc",
      marginBottom: 4,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {/* Name & Title */}
          <View>
            <Text style={styles.sidebarName}>{resumeDetails.name}</Text>
            <Text style={styles.sidebarTitle}>{resumeDetails.title}</Text>
          </View>

          {/* Contact */}
          {(resumeDetails.contact?.phone || 
            resumeDetails.contact?.email || 
            resumeDetails.contact?.linkedin || 
            resumeDetails.contact?.location) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeader}>CONTACT</Text>
              {resumeDetails.contact?.phone && (
                <View>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactItem}>{resumeDetails.contact.phone}</Text>
                </View>
              )}
              {resumeDetails.contact?.email && (
                <View>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactItem}>{resumeDetails.contact.email}</Text>
                </View>
              )}
              {resumeDetails.contact?.linkedin && (
                <View>
                  <Text style={styles.contactLabel}>LinkedIn</Text>
                  <Text style={styles.contactItem}>{resumeDetails.contact.linkedin}</Text>
                </View>
              )}
              {resumeDetails.contact?.location && (
                <View>
                  <Text style={styles.contactLabel}>Location</Text>
                  <Text style={styles.contactItem}>{resumeDetails.contact.location}</Text>
                </View>
              )}
            </View>
          )}

          {/* Skills in Sidebar */}
          {showSkills && skills?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeader}>
                {sectionTitles.skills || "SKILLS"}
              </Text>
              {skills.map((skill, idx) => (
                <View key={idx} style={{ position: "relative" }}>
                  <Text style={styles.skillBullet}>▸</Text>
                  <Text style={styles.skillItem}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education in Sidebar */}
          {showEducation && educationList?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeader}>
                {sectionTitles.education || "EDUCATION"}
              </Text>
              {educationList.map((edu, idx) => (
                <View key={idx} style={styles.educationSidebarItem}>
                  <Text style={styles.educationDegree}>{edu.degree}</Text>
                  {edu.institution && (
                    <Text style={styles.educationInstitution}>{edu.institution}</Text>
                  )}
                  {edu.year && (
                    <Text style={styles.educationYear}>{edu.year}</Text>
                  )}
                  {edu.gpa && (
                    <Text style={styles.educationYear}>GPA: {edu.gpa}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Certifications in Sidebar */}
          {showCertifications && certifications?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeader}>
                {sectionTitles.certifications || "CERTIFICATIONS"}
              </Text>
              {certifications
                .filter((c) => c.trim())
                .map((cert, idx) => (
                  <View key={idx} style={{ position: "relative" }}>
                    <Text style={styles.skillBullet}>▸</Text>
                    <Text style={styles.certSidebarItem}>{cert}</Text>
                  </View>
                ))}
            </View>
          )}

          {/* Custom Sections in Sidebar */}
          {customSections?.map(
            (section) =>
              section.title.trim() && (
                <View key={section.id} style={styles.sidebarSection}>
                  <Text style={styles.sidebarHeader}>{section.title}</Text>
                  {section.items
                    .filter((item) => item.trim())
                    .map((item, idx) => (
                      <View key={idx} style={{ position: "relative" }}>
                        <Text style={styles.skillBullet}>▸</Text>
                        <Text style={styles.certSidebarItem}>{item}</Text>
                      </View>
                    ))}
                </View>
              )
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.mainHeader}>
            <View style={styles.accentBar} />
          </View>

          {/* Professional Summary */}
          {showSummary && resumeDetails.summary && (
            <View>
              <View style={{ position: "relative" }}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>
                  {sectionTitles.summary || "PROFILE"}
                </Text>
              </View>
              <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
            </View>
          )}

          {/* Professional Experience */}
          {showExperience && experiences?.length > 0 && (
            <View>
              <View style={{ position: "relative" }}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>
                  {sectionTitles.experience || "EXPERIENCE"}
                </Text>
              </View>
              {experiences.map((exp, idx) => (
                <View key={idx} style={styles.experienceItem}>
                  <View style={styles.experienceMarker} />
                  <View style={styles.experienceHeader}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.dateRange}>{exp.duration}</Text>
                  </View>
                  <Text style={styles.companyInfo}>
                    {exp.company}
                    {exp.location ? ` • ${exp.location}` : ""}
                  </Text>
                  {exp.achievements?.map(
                    (ach, j) =>
                      ach.trim() && (
                        <View key={j} style={styles.bulletPoint}>
                          <Text style={styles.bullet}>•</Text>
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
            <View>
              <View style={{ position: "relative" }}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>
                  {sectionTitles.projects || "PROJECTS"}
                </Text>
              </View>
              {projects.map((proj, idx) => (
                <View key={idx} style={styles.projectItem}>
                  <View style={styles.projectMarker} />
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{proj.name}</Text>
                    {proj.duration && <Text style={styles.dateRange}>{proj.duration}</Text>}
                  </View>
                  {proj.technologies && (
                    <Text style={styles.projectTech}>Tech: {proj.technologies}</Text>
                  )}
                  {proj.link && (
                    <Text style={styles.projectLink}>{proj.link}</Text>
                  )}
                  {proj.description?.map(
                    (desc, j) =>
                      desc.trim() && (
                        <View key={j} style={styles.bulletPoint}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.bulletText}>{desc}</Text>
                        </View>
                      )
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default Template4;
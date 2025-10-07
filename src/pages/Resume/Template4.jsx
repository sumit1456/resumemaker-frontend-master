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
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 40,
      fontFamily: "Helvetica",
      fontSize: 10,
    },
    header: {
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 2,
      borderBottomColor: "#1a1a1a",
    },
    name: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#1a1a1a",
      marginBottom: 4,
      letterSpacing: 1,
    },
    title: {
      fontSize: 14,
      color: "#4a4a4a",
      marginBottom: 8,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    contactRow: {
      fontSize: 9,
      flexDirection: "row",
      justifyContent: "flex-start",
      color: "#4a4a4a",
      gap: 12,
      flexWrap: "wrap",
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    divider: {
      marginHorizontal: 6,
      color: "#999",
    },
    sectionHeader: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#1a1a1a",
      marginTop: 16,
      marginBottom: 8,
      paddingLeft: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#1a1a1a",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    summaryText: {
      fontSize: 10,
      lineHeight: 1.5,
      color: "#2a2a2a",
      textAlign: "justify",
      marginBottom: 4,
      fontStyle: "italic",
    },
    skillsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 4,
    },
    skillChip: {
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 3,
      fontSize: 9,
      color: "#2a2a2a",
      borderWidth: 1,
      borderColor: "#e0e0e0",
    },
    experienceItem: {
      marginBottom: 12,
      paddingLeft: 8,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    jobTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#1a1a1a",
      flex: 1,
    },
    dateRange: {
      fontSize: 9,
      color: "#4a4a4a",
      fontWeight: "bold",
      fontStyle: "italic",
    },
    companyInfo: {
      fontSize: 10,
      color: "#4a4a4a",
      marginBottom: 4,
      fontWeight: "bold",
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 3,
      marginLeft: 12,
    },
    bullet: {
      width: 10,
      fontSize: 9,
      marginRight: 6,
      color: "#1a1a1a",
      fontWeight: "bold",
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 1.4,
      color: "#2a2a2a",
    },
    projectItem: {
      marginBottom: 10,
      paddingLeft: 8,
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
    },
    projectTech: {
      fontSize: 9,
      color: "#4a4a4a",
      marginBottom: 3,
      fontStyle: "italic",
    },
    educationItem: {
      marginBottom: 8,
      paddingLeft: 8,
    },
    educationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    degreeName: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#1a1a1a",
    },
    institutionName: {
      fontSize: 10,
      color: "#4a4a4a",
      fontWeight: "bold",
    },
    educationDetails: {
      fontSize: 9,
      color: "#4a4a4a",
      marginTop: 1,
    },
    certItem: {
      fontSize: 10,
      color: "#2a2a2a",
      marginBottom: 4,
      paddingLeft: 8,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resumeDetails.name}</Text>
          <Text style={styles.title}>{resumeDetails.title}</Text>
          <View style={styles.contactRow}>
            {resumeDetails.contact?.phone && <Text>{resumeDetails.contact.phone}</Text>}
            {resumeDetails.contact?.email && (
              <>
                <Text style={styles.divider}>•</Text>
                <Text>{resumeDetails.contact.email}</Text>
              </>
            )}
            {resumeDetails.contact?.linkedin && (
              <>
                <Text style={styles.divider}>•</Text>
                <Text>{resumeDetails.contact.linkedin}</Text>
              </>
            )}
            {resumeDetails.contact?.location && (
              <>
                <Text style={styles.divider}>•</Text>
                <Text>{resumeDetails.contact.location}</Text>
              </>
            )}
          </View>
        </View>

        {/* Executive Summary */}
        {showSummary && resumeDetails.summary && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.summary || "EXECUTIVE PROFILE"}
            </Text>
            <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
          </View>
        )}

        {/* Core Competencies */}
        {showSkills && skills?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.skills || "CORE COMPETENCIES"}
            </Text>
            <View style={styles.skillsGrid}>
              {skills.map((skill, idx) => (
                <Text key={idx} style={styles.skillChip}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Professional Experience */}
        {showExperience && experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.experience || "PROFESSIONAL EXPERIENCE"}
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

        {/* Key Projects */}
        {showProjects && projects?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.projects || "KEY INITIATIVES"}
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

        {/* Education */}
        {showEducation && educationList?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.education || "EDUCATION"}
            </Text>
            {educationList.map((edu, idx) => (
              <View key={idx} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.degreeName}>{edu.degree}</Text>
                  {edu.year && <Text style={styles.dateRange}>{edu.year}</Text>}
                </View>
                {edu.institution && (
                  <Text style={styles.institutionName}>{edu.institution}</Text>
                )}
                {(edu.location || edu.gpa) && (
                  <Text style={styles.educationDetails}>
                    {edu.location}
                    {edu.location && edu.gpa ? " | " : ""}
                    {edu.gpa && `GPA: ${edu.gpa}`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {showCertifications && certifications?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.certifications || "CERTIFICATIONS & AWARDS"}
            </Text>
            {certifications
              .filter((c) => c.trim())
              .map((cert, idx) => (
                <Text key={idx} style={styles.certItem}>
                  • {cert}
                </Text>
              ))}
          </View>
        )}

        {/* Custom Sections */}
        {customSections?.map(
          (section) =>
            section.title.trim() && (
              <View key={section.id}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
                {section.items
                  .filter((item) => item.trim())
                  .map((item, idx) => (
                    <Text key={idx} style={styles.certItem}>
                      • {item}
                    </Text>
                  ))}
              </View>
            )
        )}
      </Page>
    </Document>
  );
};

export default Template4;
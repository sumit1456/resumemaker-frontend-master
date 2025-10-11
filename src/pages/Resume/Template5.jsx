
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Template5 = ({
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
      backgroundColor: "#FFFFFF",
      fontFamily: "Helvetica",
      fontSize: 10,
    },
    header: {
      backgroundColor: "#2C3E50",
      padding: 40,
      paddingBottom: 30,
      position: "relative",
    },
    decorativeStripe: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 8,
      backgroundColor: "#E74C3C",
    },
    nameContainer: {
      marginBottom: 8,
    },
    name: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#FFFFFF",
      letterSpacing: 1,
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      color: "#E74C3C",
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    contactBar: {
      flexDirection: "row",
      marginTop: 20,
      flexWrap: "wrap",
      gap: 15,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20,
    },
    contactIcon: {
      width: 4,
      height: 4,
      backgroundColor: "#E74C3C",
      borderRadius: 2,
      marginRight: 8,
    },
    contactText: {
      fontSize: 9,
      color: "#BDC3C7",
    },
    contentContainer: {
      flexDirection: "row",
      padding: 0,
    },
    leftColumn: {
      width: "38%",
      backgroundColor: "#ECF0F1",
      padding: 30,
      paddingTop: 35,
    },
    rightColumn: {
      width: "62%",
      padding: 35,
      paddingTop: 35,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: 15,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: "#E74C3C",
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    sectionTitleRight: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: 16,
      marginTop: 25,
      paddingLeft: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#E74C3C",
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    leftSection: {
      marginBottom: 25,
    },
    summaryText: {
      fontSize: 10,
      lineHeight: 1.7,
      color: "#34495E",
      textAlign: "justify",
    },
    skillTag: {
      backgroundColor: "#FFFFFF",
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginBottom: 8,
      marginRight: 6,
      borderRadius: 3,
      borderLeftWidth: 3,
      borderLeftColor: "#E74C3C",
    },
    skillText: {
      fontSize: 9,
      color: "#2C3E50",
      fontWeight: "bold",
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    educationItem: {
      marginBottom: 16,
      paddingLeft: 12,
      borderLeftWidth: 2,
      borderLeftColor: "#E74C3C",
    },
    educationDegree: {
      fontSize: 10.5,
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: 3,
      lineHeight: 1.3,
    },
    educationInstitution: {
      fontSize: 9.5,
      color: "#7F8C8D",
      marginBottom: 2,
    },
    educationYear: {
      fontSize: 8.5,
      color: "#95A5A6",
      fontStyle: "italic",
    },
    certItem: {
      flexDirection: "row",
      marginBottom: 8,
      alignItems: "flex-start",
    },
    certDot: {
      width: 5,
      height: 5,
      backgroundColor: "#E74C3C",
      borderRadius: 2.5,
      marginRight: 10,
      marginTop: 4,
    },
    certText: {
      fontSize: 9,
      color: "#2C3E50",
      flex: 1,
      lineHeight: 1.4,
    },
    experienceItem: {
      marginBottom: 20,
      position: "relative",
    },
    experienceHeader: {
      marginBottom: 6,
    },
    experienceTitle: {
      fontSize: 11.5,
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: 3,
    },
    experienceCompany: {
      fontSize: 10,
      color: "#E74C3C",
      marginBottom: 2,
    },
    experienceMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    experienceLocation: {
      fontSize: 9,
      color: "#7F8C8D",
      fontStyle: "italic",
    },
    experienceDate: {
      fontSize: 9,
      color: "#95A5A6",
      fontStyle: "italic",
    },
    achievementItem: {
      flexDirection: "row",
      marginBottom: 5,
      paddingLeft: 4,
    },
    achievementBullet: {
      width: 12,
      fontSize: 10,
      color: "#E74C3C",
      marginRight: 8,
    },
    achievementText: {
      flex: 1,
      fontSize: 9.5,
      lineHeight: 1.6,
      color: "#34495E",
    },
    projectItem: {
      marginBottom: 18,
      backgroundColor: "#F8F9FA",
      padding: 14,
      borderRadius: 4,
      borderLeftWidth: 4,
      borderLeftColor: "#E74C3C",
    },
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
      alignItems: "flex-start",
    },
    projectName: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#2C3E50",
      flex: 1,
    },
    projectDate: {
      fontSize: 8.5,
      color: "#95A5A6",
      fontStyle: "italic",
    },
    projectTech: {
      fontSize: 8.5,
      color: "#E74C3C",
      marginBottom: 6,
      fontWeight: "bold",
    },
    projectLink: {
      fontSize: 8,
      color: "#3498DB",
      marginBottom: 6,
    },
    projectDesc: {
      fontSize: 9,
      lineHeight: 1.5,
      color: "#34495E",
      marginBottom: 3,
    },
    customSectionItem: {
      flexDirection: "row",
      marginBottom: 8,
      alignItems: "flex-start",
    },
    customDot: {
      width: 5,
      height: 5,
      backgroundColor: "#E74C3C",
      borderRadius: 2.5,
      marginRight: 10,
      marginTop: 4,
    },
    customText: {
      fontSize: 9,
      color: "#2C3E50",
      flex: 1,
      lineHeight: 1.4,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.decorativeStripe} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{resumeDetails.name}</Text>
            <Text style={styles.title}>{resumeDetails.title}</Text>
          </View>
          
          {/* Contact Bar */}
          <View style={styles.contactBar}>
            {resumeDetails.contact?.phone && (
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{resumeDetails.contact.phone}</Text>
              </View>
            )}
            {resumeDetails.contact?.email && (
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{resumeDetails.contact.email}</Text>
              </View>
            )}
            {resumeDetails.contact?.linkedin && (
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{resumeDetails.contact.linkedin}</Text>
              </View>
            )}
            {resumeDetails.contact?.location && (
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{resumeDetails.contact.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Two Column Content */}
        <View style={styles.contentContainer}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Skills */}
            {showSkills && skills?.length > 0 && (
              <View style={styles.leftSection}>
                <Text style={styles.sectionTitle}>
                  {sectionTitles.skills || "SKILLS"}
                </Text>
                <View style={styles.skillsContainer}>
                  {skills.map((skill, idx) => (
                    <View key={idx} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            {showEducation && educationList?.length > 0 && (
              <View style={styles.leftSection}>
                <Text style={styles.sectionTitle}>
                  {sectionTitles.education || "EDUCATION"}
                </Text>
                {educationList.map((edu, idx) => (
                  <View key={idx} style={styles.educationItem}>
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

            {/* Certifications */}
            {showCertifications && certifications?.length > 0 && (
              <View style={styles.leftSection}>
                <Text style={styles.sectionTitle}>
                  {sectionTitles.certifications || "CERTIFICATIONS"}
                </Text>
                {certifications
                  .filter((c) => c.trim())
                  .map((cert, idx) => (
                    <View key={idx} style={styles.certItem}>
                      <View style={styles.certDot} />
                      <Text style={styles.certText}>{cert}</Text>
                    </View>
                  ))}
              </View>
            )}

            {/* Custom Sections */}
            {customSections?.map(
              (section) =>
                section.title.trim() && (
                  <View key={section.id} style={styles.leftSection}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.items
                      .filter((item) => item.trim())
                      .map((item, idx) => (
                        <View key={idx} style={styles.customSectionItem}>
                          <View style={styles.customDot} />
                          <Text style={styles.customText}>{item}</Text>
                        </View>
                      ))}
                  </View>
                )
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Summary */}
            {showSummary && resumeDetails.summary && (
              <View>
                <Text style={styles.sectionTitleRight}>
                  {sectionTitles.summary || "PROFESSIONAL SUMMARY"}
                </Text>
                <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {showExperience && experiences?.length > 0 && (
              <View>
                <Text style={styles.sectionTitleRight}>
                  {sectionTitles.experience || "EXPERIENCE"}
                </Text>
                {experiences.map((exp, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceTitle}>{exp.position}</Text>
                      <Text style={styles.experienceCompany}>{exp.company}</Text>
                      <View style={styles.experienceMeta}>
                        {exp.location && (
                          <Text style={styles.experienceLocation}>{exp.location}</Text>
                        )}
                        <Text style={styles.experienceDate}>{exp.duration}</Text>
                      </View>
                    </View>
                    {exp.achievements?.map(
                      (ach, j) =>
                        ach.trim() && (
                          <View key={j} style={styles.achievementItem}>
                            <Text style={styles.achievementBullet}>▸</Text>
                            <Text style={styles.achievementText}>{ach}</Text>
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
                <Text style={styles.sectionTitleRight}>
                  {sectionTitles.projects || "PROJECTS"}
                </Text>
                {projects.map((proj, idx) => (
                  <View key={idx} style={styles.projectItem}>
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectName}>{proj.name}</Text>
                      {proj.duration && (
                        <Text style={styles.projectDate}>{proj.duration}</Text>
                      )}
                    </View>
                    {proj.technologies && (
                      <Text style={styles.projectTech}>
                        {proj.technologies}
                      </Text>
                    )}
                    {proj.link && (
                      <Text style={styles.projectLink}>{proj.link}</Text>
                    )}
                    {proj.description?.map(
                      (desc, j) =>
                        desc.trim() && (
                          <Text key={j} style={styles.projectDesc}>
                            • {desc}
                          </Text>
                        )
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Template5;
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
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 35,
      fontFamily: "Helvetica",
      fontSize: 9,
    },
    sidebar: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: "#00D9FF",
    },
    header: {
      marginBottom: 16,
      paddingLeft: 12,
    },
    name: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#0A0A0A",
      marginBottom: 3,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 12,
      color: "#00D9FF",
      marginBottom: 6,
      fontWeight: "bold",
    },
    contactRow: {
      fontSize: 8.5,
      flexDirection: "row",
      flexWrap: "wrap",
      color: "#4A4A4A",
      gap: 10,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    separator: {
      color: "#00D9FF",
      marginHorizontal: 4,
    },
    sectionHeader: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#0A0A0A",
      marginTop: 12,
      marginBottom: 6,
      paddingBottom: 3,
      borderBottomWidth: 2,
      borderBottomColor: "#00D9FF",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    summaryText: {
      fontSize: 9,
      lineHeight: 1.45,
      color: "#2A2A2A",
      textAlign: "justify",
      marginBottom: 3,
    },
    skillsSection: {
      marginBottom: 4,
    },
    skillCategory: {
      flexDirection: "row",
      marginBottom: 4,
    },
    skillLabel: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#00D9FF",
      width: 100,
    },
    skillValue: {
      fontSize: 9,
      color: "#2A2A2A",
      flex: 1,
      lineHeight: 1.3,
    },
    skillTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
      marginTop: 2,
    },
    skillTag: {
      backgroundColor: "#F0FBFF",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 2,
      fontSize: 8,
      color: "#0A0A0A",
      borderWidth: 0.5,
      borderColor: "#00D9FF",
    },
    experienceItem: {
      marginBottom: 10,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    jobTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#0A0A0A",
      flex: 1,
    },
    dateRange: {
      fontSize: 8.5,
      color: "#00D9FF",
      fontWeight: "bold",
    },
    companyInfo: {
      fontSize: 9,
      color: "#4A4A4A",
      marginBottom: 3,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 2.5,
      marginLeft: 10,
    },
    bullet: {
      width: 8,
      fontSize: 8,
      marginRight: 5,
      color: "#00D9FF",
      fontWeight: "bold",
    },
    bulletText: {
      flex: 1,
      fontSize: 9,
      lineHeight: 1.4,
      color: "#2A2A2A",
    },
    projectItem: {
      marginBottom: 9,
      paddingLeft: 6,
      borderLeftWidth: 2,
      borderLeftColor: "#E0E0E0",
    },
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    projectTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#0A0A0A",
    },
    projectTech: {
      fontSize: 8.5,
      color: "#00D9FF",
      marginBottom: 3,
      fontWeight: "bold",
    },
    educationItem: {
      marginBottom: 7,
    },
    educationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    degreeName: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#0A0A0A",
    },
    institutionName: {
      fontSize: 9,
      color: "#4A4A4A",
    },
    educationDetails: {
      fontSize: 8.5,
      color: "#4A4A4A",
      marginTop: 1,
    },
    certItem: {
      flexDirection: "row",
      marginBottom: 3,
    },
    certBullet: {
      width: 8,
      fontSize: 8,
      marginRight: 5,
      color: "#00D9FF",
      fontWeight: "bold",
    },
    certText: {
      flex: 1,
      fontSize: 9,
      color: "#2A2A2A",
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
        <View style={styles.sidebar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resumeDetails.name}</Text>
          <Text style={styles.title}>{resumeDetails.title}</Text>
          <View style={styles.contactRow}>
            {resumeDetails.contact?.email && <Text>{resumeDetails.contact.email}</Text>}
            {resumeDetails.contact?.phone && (
              <>
                <Text style={styles.separator}>●</Text>
                <Text>{resumeDetails.contact.phone}</Text>
              </>
            )}
            {resumeDetails.contact?.github && (
              <>
                <Text style={styles.separator}>●</Text>
                <Text>{resumeDetails.contact.github}</Text>
              </>
            )}
            {resumeDetails.contact?.linkedin && (
              <>
                <Text style={styles.separator}>●</Text>
                <Text>{resumeDetails.contact.linkedin}</Text>
              </>
            )}
            {resumeDetails.contact?.location && (
              <>
                <Text style={styles.separator}>●</Text>
                <Text>{resumeDetails.contact.location}</Text>
              </>
            )}
          </View>
        </View>

        {/* Summary */}
        {showSummary && resumeDetails.summary && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.summary || "ABOUT"}
            </Text>
            <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
          </View>
        )}

        {/* Technical Skills */}
        {showSkills && skills?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.skills || "TECH STACK"}
            </Text>
            <View style={styles.skillsSection}>
              {Object.entries(groupedSkills).map(([category, values], idx) => (
                <View key={idx} style={styles.skillCategory}>
                  <Text style={styles.skillLabel}>{category}:</Text>
                  <Text style={styles.skillValue}>{values}</Text>
                </View>
              ))}
              {ungroupedSkills.length > 0 && (
                <View style={styles.skillTags}>
                  {ungroupedSkills.map((skill, idx) => (
                    <Text key={idx} style={styles.skillTag}>
                      {skill}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Experience */}
        {showExperience && experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
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
                  {exp.location ? ` • ${exp.location}` : ""}
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
          <View>
            <Text style={styles.sectionHeader}>
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
                    {edu.location && edu.gpa ? " • " : ""}
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
              {sectionTitles.certifications || "CERTIFICATIONS"}
            </Text>
            {certifications
              .filter((c) => c.trim())
              .map((cert, idx) => (
                <View key={idx} style={styles.certItem}>
                  <Text style={styles.certBullet}>▸</Text>
                  <Text style={styles.certText}>{cert}</Text>
                </View>
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
                    <View key={idx} style={styles.certItem}>
                      <Text style={styles.certBullet}>▸</Text>
                      <Text style={styles.certText}>{item}</Text>
                    </View>
                  ))}
              </View>
            )
        )}
      </Page>
    </Document>
  );
};

export default Template5;
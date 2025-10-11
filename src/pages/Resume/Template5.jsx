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
      padding: 50,
      fontFamily: "Helvetica",
      fontSize: 10.5,
    },
    header: {
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 1.5,
      borderBottomColor: "#000000",
    },
    name: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#000000",
      marginBottom: 6,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 13,
      color: "#333333",
      marginBottom: 10,
      letterSpacing: 0.3,
    },
    contactRow: {
      fontSize: 9.5,
      flexDirection: "row",
      justifyContent: "flex-start",
      color: "#444444",
      gap: 3,
      flexWrap: "wrap",
    },
    contactItem: {
      flexDirection: "row",
    },
    divider: {
      marginHorizontal: 8,
      color: "#666666",
    },
    sectionHeader: {
      fontSize: 11.5,
      fontWeight: "bold",
      color: "#000000",
      marginTop: 18,
      marginBottom: 10,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: "#000000",
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    summaryText: {
      fontSize: 10.5,
      lineHeight: 1.6,
      color: "#1a1a1a",
      textAlign: "justify",
      marginBottom: 4,
    },
    skillsContainer: {
      marginBottom: 4,
    },
    skillsRow: {
      flexDirection: "row",
      marginBottom: 6,
    },
    skillCategory: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#000000",
      width: 110,
      marginRight: 10,
    },
    skillsList: {
      flex: 1,
      fontSize: 10,
      color: "#2a2a2a",
      lineHeight: 1.5,
    },
    experienceItem: {
      marginBottom: 14,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 3,
      alignItems: "flex-start",
    },
    jobTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#000000",
      flex: 1,
    },
    dateRange: {
      fontSize: 9.5,
      color: "#333333",
      fontStyle: "italic",
    },
    companyInfo: {
      fontSize: 10,
      color: "#333333",
      marginBottom: 5,
      fontStyle: "italic",
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 4,
      paddingLeft: 0,
    },
    bullet: {
      width: 12,
      fontSize: 8,
      marginRight: 8,
      color: "#000000",
      marginTop: 1,
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 1.5,
      color: "#1a1a1a",
    },
    projectItem: {
      marginBottom: 12,
    },
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 3,
    },
    projectTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#000000",
      flex: 1,
    },
    projectTech: {
      fontSize: 9.5,
      color: "#333333",
      marginBottom: 4,
      fontStyle: "italic",
    },
    projectLink: {
      fontSize: 9,
      color: "#0066cc",
      marginBottom: 4,
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
      color: "#000000",
      flex: 1,
    },
    institutionName: {
      fontSize: 10,
      color: "#333333",
      marginBottom: 2,
    },
    educationDetails: {
      fontSize: 9.5,
      color: "#444444",
    },
    certItem: {
      fontSize: 10,
      color: "#1a1a1a",
      marginBottom: 5,
      lineHeight: 1.4,
    },
    customSectionItem: {
      fontSize: 10,
      color: "#1a1a1a",
      marginBottom: 5,
      lineHeight: 1.4,
    },
  });

  // Group skills by category if they contain colons
  const renderSkills = () => {
    const hasCategories = skills.some((skill) => skill.includes(":"));

    if (hasCategories) {
      return (
        <View style={styles.skillsContainer}>
          {skills.map((skill, idx) => {
            if (skill.includes(":")) {
              const [category, items] = skill.split(":");
              return (
                <View key={idx} style={styles.skillsRow}>
                  <Text style={styles.skillCategory}>{category.trim()}:</Text>
                  <Text style={styles.skillsList}>{items.trim()}</Text>
                </View>
              );
            }
            return (
              <Text key={idx} style={styles.skillsList}>
                {skill}
              </Text>
            );
          })}
        </View>
      );
    }

    return (
      <Text style={styles.skillsList}>
        {skills.join(" • ")}
      </Text>
    );
  };

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
                <Text style={styles.divider}>|</Text>
                <Text>{resumeDetails.contact.email}</Text>
              </>
            )}
            {resumeDetails.contact?.linkedin && (
              <>
                <Text style={styles.divider}>|</Text>
                <Text>{resumeDetails.contact.linkedin}</Text>
              </>
            )}
            {resumeDetails.contact?.location && (
              <>
                <Text style={styles.divider}>|</Text>
                <Text>{resumeDetails.contact.location}</Text>
              </>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {showSummary && resumeDetails.summary && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.summary || "PROFESSIONAL SUMMARY"}
            </Text>
            <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {showSkills && skills?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.skills || "CORE COMPETENCIES"}
            </Text>
            {renderSkills()}
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
                  {exp.location ? ` — ${exp.location}` : ""}
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
            <Text style={styles.sectionHeader}>
              {sectionTitles.projects || "KEY PROJECTS"}
            </Text>
            {projects.map((proj, idx) => (
              <View key={idx} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{proj.name}</Text>
                  {proj.duration && <Text style={styles.dateRange}>{proj.duration}</Text>}
                </View>
                {proj.technologies && (
                  <Text style={styles.projectTech}>Technologies: {proj.technologies}</Text>
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
                    <Text key={idx} style={styles.customSectionItem}>
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
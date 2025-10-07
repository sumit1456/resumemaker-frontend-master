import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Template6 = ({
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
      padding: 45,
      fontFamily: "Times-Roman",
      fontSize: 10,
    },
    header: {
      textAlign: "center",
      marginBottom: 18,
      paddingBottom: 12,
      borderBottomWidth: 1.5,
      borderBottomColor: "#2C3E50",
    },
    name: {
      fontSize: 26,
      fontFamily: "Times-Bold",
      color: "#1a1a1a",
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 12,
      fontFamily: "Times-Italic",
      color: "#2C3E50",
      marginBottom: 6,
    },
    contactRow: {
      fontSize: 9,
      flexDirection: "row",
      justifyContent: "center",
      color: "#4a4a4a",
      gap: 10,
      flexWrap: "wrap",
      fontFamily: "Times-Roman",
    },
    divider: {
      marginHorizontal: 4,
      color: "#2C3E50",
    },
    sectionHeader: {
      fontSize: 12,
      fontFamily: "Times-Bold",
      color: "#2C3E50",
      marginTop: 14,
      marginBottom: 6,
      paddingBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: "#2C3E50",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    summaryText: {
      fontSize: 10,
      lineHeight: 1.5,
      color: "#2a2a2a",
      textAlign: "justify",
      marginBottom: 4,
      fontFamily: "Times-Roman",
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
      fontFamily: "Times-Bold",
      color: "#1a1a1a",
      flex: 1,
    },
    yearRange: {
      fontSize: 10,
      fontFamily: "Times-Italic",
      color: "#4a4a4a",
    },
    institutionName: {
      fontSize: 10,
      fontFamily: "Times-Italic",
      color: "#2C3E50",
      marginBottom: 2,
    },
    educationDetails: {
      fontSize: 9,
      color: "#4a4a4a",
      marginTop: 1,
      fontFamily: "Times-Roman",
    },
    experienceItem: {
      marginBottom: 10,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    position: {
      fontSize: 11,
      fontFamily: "Times-Bold",
      color: "#1a1a1a",
      flex: 1,
    },
    dateRange: {
      fontSize: 9.5,
      fontFamily: "Times-Italic",
      color: "#4a4a4a",
    },
    organization: {
      fontSize: 10,
      fontFamily: "Times-Italic",
      color: "#2C3E50",
      marginBottom: 3,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 3,
      marginLeft: 8,
    },
    bullet: {
      width: 10,
      fontSize: 9,
      marginRight: 5,
      color: "#2C3E50",
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 1.45,
      color: "#2a2a2a",
      fontFamily: "Times-Roman",
    },
    projectItem: {
      marginBottom: 9,
    },
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    projectTitle: {
      fontSize: 11,
      fontFamily: "Times-Bold",
      color: "#1a1a1a",
    },
    projectTech: {
      fontSize: 9.5,
      fontFamily: "Times-Italic",
      color: "#2C3E50",
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
      fontSize: 10,
      fontFamily: "Times-Bold",
      color: "#2C3E50",
      width: 120,
    },
    skillValue: {
      fontSize: 10,
      color: "#2a2a2a",
      flex: 1,
      lineHeight: 1.35,
      fontFamily: "Times-Roman",
    },
    certItem: {
      flexDirection: "row",
      marginBottom: 4,
      alignItems: "flex-start",
    },
    certBullet: {
      width: 10,
      fontSize: 9,
      marginRight: 5,
      color: "#2C3E50",
    },
    certText: {
      flex: 1,
      fontSize: 10,
      color: "#2a2a2a",
      fontFamily: "Times-Roman",
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resumeDetails.name}</Text>
          <Text style={styles.title}>{resumeDetails.title}</Text>
          <View style={styles.contactRow}>
            {resumeDetails.contact?.email && <Text>{resumeDetails.contact.email}</Text>}
            {resumeDetails.contact?.phone && (
              <>
                <Text style={styles.divider}>|</Text>
                <Text>{resumeDetails.contact.phone}</Text>
              </>
            )}
            {resumeDetails.contact?.location && (
              <>
                <Text style={styles.divider}>|</Text>
                <Text>{resumeDetails.contact.location}</Text>
              </>
            )}
            {resumeDetails.contact?.linkedin && (
              <>
                <Text style={styles.divider}>|</Text>
                <Text>{resumeDetails.contact.linkedin}</Text>
              </>
            )}
          </View>
        </View>

        {/* Summary */}
        {showSummary && resumeDetails.summary && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.summary || "RESEARCH INTERESTS"}
            </Text>
            <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
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
                  {edu.year && <Text style={styles.yearRange}>{edu.year}</Text>}
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

        {/* Experience / Research Experience */}
        {showExperience && experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.experience || "RESEARCH EXPERIENCE"}
            </Text>
            {experiences.map((exp, idx) => (
              <View key={idx} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.position}>{exp.position}</Text>
                  <Text style={styles.dateRange}>{exp.duration}</Text>
                </View>
                <Text style={styles.organization}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
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

        {/* Projects / Publications */}
        {showProjects && projects?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.projects || "PUBLICATIONS & PROJECTS"}
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
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{desc}</Text>
                      </View>
                    )
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills / Technical Proficiencies */}
        {showSkills && skills?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.skills || "TECHNICAL SKILLS"}
            </Text>
            <View style={styles.skillsSection}>
              {Object.entries(groupedSkills).map(([category, values], idx) => (
                <View key={idx} style={styles.skillCategory}>
                  <Text style={styles.skillLabel}>{category}:</Text>
                  <Text style={styles.skillValue}>{values}</Text>
                </View>
              ))}
              {ungroupedSkills.length > 0 && (
                <View style={styles.skillCategory}>
                  <Text style={styles.skillLabel}>Other:</Text>
                  <Text style={styles.skillValue}>{ungroupedSkills.join(", ")}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Certifications / Awards */}
        {showCertifications && certifications?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>
              {sectionTitles.certifications || "HONORS & AWARDS"}
            </Text>
            {certifications
              .filter((c) => c.trim())
              .map((cert, idx) => (
                <View key={idx} style={styles.certItem}>
                  <Text style={styles.certBullet}>•</Text>
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
                      <Text style={styles.certBullet}>•</Text>
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

export default Template6;
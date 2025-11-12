// Template3.jsx - Sleek & Edgy ATS-Friendly Design
import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const Template8 = ({
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
      padding: 30, 
      fontFamily: "Helvetica", 
      fontSize: 9 
    },
    header: { 
      marginBottom: 10, 
      textAlign: "center",
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: "#000",
      borderBottomStyle: "solid"
    },
    name: { 
      fontSize: 26, 
      fontFamily: "Times-Bold",
      color: "#000", 
      marginBottom: 2, 
      letterSpacing: 2.5,
      textTransform: "uppercase"
    },
    subtitle: { 
      fontSize: 10, 
      color: "#333", 
      marginBottom: 4,
      letterSpacing: 0.8,
      fontFamily: "Times-Italic"
    },
    contactRow: { 
      fontSize: 8.5, 
      flexDirection: "row", 
      justifyContent: "center", 
      color: "#000", 
      gap: 6,
      fontFamily: "Helvetica"
    },
    contactIcon: { 
      marginHorizontal: 3,
      color: "#666"
    },
    sectionHeader: {
      fontSize: 12,
      fontFamily: "Times-Bold",
      color: "#000",
      marginTop: 8,
      marginBottom: 4,
      paddingBottom: 3,
      paddingLeft: 2,
      borderBottomWidth: 2,
      borderBottomColor: "#000",
      textTransform: "uppercase",
      letterSpacing: 2,
      borderLeftWidth: 4,
      borderLeftColor: "#000",
      paddingLeft: 8
    },
    summaryText: { 
      fontSize: 9, 
      lineHeight: 1.4, 
      color: "#1a1a1a", 
      textAlign: "justify", 
      marginBottom: 2,
      fontFamily: "Helvetica"
    },
    skillsContainer: { 
      marginBottom: 2,
      backgroundColor: "#fafafa",
      padding: 6,
      borderLeftWidth: 2,
      borderLeftColor: "#000"
    },
    skillCategory: { 
      flexDirection: "row", 
      marginBottom: 2.5 
    },
    skillLabel: { 
      fontSize: 9, 
      fontFamily: "Helvetica-Bold",
      color: "#000", 
      width: 120 
    },
    skillValue: { 
      fontSize: 9, 
      color: "#1a1a1a", 
      flex: 1, 
      lineHeight: 1.3,
      fontFamily: "Helvetica"
    },
    experienceItem: { 
      marginBottom: 6,
      borderLeftWidth: 2,
      borderLeftColor: "#000",
      paddingLeft: 6
    },
    experienceHeader: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
      marginBottom: 1,
      alignItems: "baseline"
    },
    jobTitle: { 
      fontSize: 10.5, 
      fontFamily: "Times-Bold",
      color: "#000",
      letterSpacing: 0.3
    },
    dateRange: { 
      fontSize: 8.5, 
      color: "#333", 
      fontFamily: "Helvetica-Bold",
      letterSpacing: 0.3
    },
    companyInfo: { 
      fontSize: 9, 
      fontFamily: "Times-Italic",
      color: "#1a1a1a", 
      marginBottom: 2 
    },
    bulletPoint: { 
      flexDirection: "row", 
      marginBottom: 2, 
      marginLeft: 6 
    },
    bullet: { 
      width: 10, 
      fontSize: 9, 
      marginRight: 4, 
      color: "#000",
      fontFamily: "Helvetica-Bold"
    },
    bulletText: { 
      flex: 1, 
      fontSize: 9, 
      lineHeight: 1.35, 
      color: "#1a1a1a",
      fontFamily: "Helvetica"
    },
    projectItem: { 
      marginBottom: 5,
      borderLeftWidth: 2,
      borderLeftColor: "#000",
      paddingLeft: 6
    },
    projectHeader: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
      marginBottom: 1,
      alignItems: "baseline"
    },
    projectTitle: { 
      fontSize: 10.5, 
      fontFamily: "Helvetica-Bold",
      color: "#000",
      letterSpacing: 0.3
    },
    projectTech: { 
      fontSize: 8.5, 
      fontFamily: "Helvetica-Oblique",
      color: "#333", 
      marginBottom: 2,
      letterSpacing: 0.2
    },
    educationItem: { 
      marginBottom: 5,
      borderLeftWidth: 2,
      borderLeftColor: "#000",
      paddingLeft: 6
    },
    educationHeader: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
      marginBottom: 1,
      alignItems: "baseline"
    },
    degreeName: { 
      fontSize: 10.5, 
      fontFamily: "Helvetica-Bold",
      color: "#000",
      letterSpacing: 0.3
    },
    institutionName: { 
      fontSize: 9, 
      color: "#1a1a1a",
      fontFamily: "Helvetica"
    },
    educationDetails: { 
      fontSize: 8.5, 
      fontFamily: "Helvetica-Oblique",
      color: "#333", 
      marginTop: 1 
    },
    certificationBullet: {
      borderLeftWidth: 2,
      borderLeftColor: "#000",
      paddingLeft: 6,
      marginBottom: 2
    }
  });

  // Group skills by category if " - " exists
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
          <Text style={styles.subtitle}>{resumeDetails.title}</Text>
          <View style={styles.contactRow}>
            {resumeDetails.contact?.phone && <Text>{resumeDetails.contact.phone}</Text>}
            {resumeDetails.contact?.email && (
              <>
                <Text style={styles.contactIcon}>●</Text>
                <Text>{resumeDetails.contact.email}</Text>
              </>
            )}
            {resumeDetails.contact?.linkedin && (
              <>
                <Text style={styles.contactIcon}>●</Text>
                <Text>{resumeDetails.contact.linkedin}</Text>
              </>
            )}
            {resumeDetails.contact?.github && (
              <>
                <Text style={styles.contactIcon}>●</Text>
                <Text>{resumeDetails.contact.github}</Text>
              </>
            )}
            {resumeDetails.contact?.location && (
              <>
                <Text style={styles.contactIcon}>●</Text>
                <Text>{resumeDetails.contact.location}</Text>
              </>
            )}
          </View>
        </View>

        {/* Summary */}
        {showSummary && resumeDetails.summary && (
          <View>
            <Text style={styles.sectionHeader}>{sectionTitles.summary || "PROFESSIONAL SUMMARY"}</Text>
            <Text style={styles.summaryText}>{resumeDetails.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {showSkills && skills?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>{sectionTitles.skills || "TECHNICAL SKILLS"}</Text>
            <View style={styles.skillsContainer}>
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

        {/* Experience */}
        {showExperience && experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>{sectionTitles.experience || "EXPERIENCE"}</Text>
            {experiences.map((exp, idx) => (
              <View key={idx} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
                  <Text style={styles.dateRange}>{exp.duration}</Text>
                </View>
                <Text style={styles.companyInfo}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </Text>
                {exp.achievements?.map(
                  (ach, j) =>
                    ach.trim() && (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>▪</Text>
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
            <Text style={styles.sectionHeader}>{sectionTitles.projects || "PROJECTS"}</Text>
            {projects.map((proj, idx) => (
              <View key={idx} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{proj.name}</Text>
                  {proj.duration && <Text style={styles.dateRange}>{proj.duration}</Text>}
                </View>
                {proj.technologies && <Text style={styles.projectTech}>{proj.technologies}</Text>}
                {proj.description?.map(
                  (desc, j) =>
                    desc.trim() && (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>▪</Text>
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
            <Text style={styles.sectionHeader}>{sectionTitles.education || "EDUCATION"}</Text>
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
            <Text style={styles.sectionHeader}>{sectionTitles.certifications || "CERTIFICATIONS"}</Text>
            {certifications
              .filter((c) => c.trim())
              .map((cert, idx) => (
                <View key={idx} style={[styles.bulletPoint, styles.certificationBullet]}>
                  <Text style={styles.bullet}>▪</Text>
                  <Text style={styles.bulletText}>{cert}</Text>
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
                    <View key={idx} style={[styles.bulletPoint, styles.certificationBullet]}>
                      <Text style={styles.bullet}>▪</Text>
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))}
              </View>
            )
        )}
      </Page>
    </Document>
  );
};

export default Template8;
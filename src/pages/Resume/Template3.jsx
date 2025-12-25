// Template3.jsx - Fixed Education Section Display
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Template3 = ({
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
    page: { flexDirection: "column", backgroundColor: "#FFFFFF", padding: 30, fontFamily: "Helvetica", fontSize: 9 },
    header: { marginBottom: 12, textAlign: "center" },
    name: { fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 2, letterSpacing: 0.5 },
    subtitle: { fontSize: 10, color: "#333", marginBottom: 4 },
    contactRow: { fontSize: 8.5, flexDirection: "row", justifyContent: "center", color: "#000", gap: 8 },
    contactItem: { flexDirection: "row", alignItems: "center" },
    contactIcon: { marginHorizontal: 4 },
    sectionHeader: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#000",
      marginTop: 8,
      marginBottom: 4,
      paddingBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    summaryText: { fontSize: 9, lineHeight: 1.4, color: "#000", textAlign: "justify", marginBottom: 2 },
    skillsContainer: { marginBottom: 2 },
    skillCategory: { flexDirection: "row", marginBottom: 2 },
    skillLabel: { fontSize: 9, fontWeight: "bold", color: "#000", width: 120 },
    skillValue: { fontSize: 9, color: "#000", flex: 1, lineHeight: 1.3 },
    experienceItem: { marginBottom: 6 },
    experienceHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    jobTitle: { fontSize: 10, fontWeight: "bold", color: "#000" },
    dateRange: { fontSize: 9, color: "#000", fontWeight: "bold" },
    companyInfo: { fontSize: 9, fontStyle: "italic", color: "#000", marginBottom: 2 },
    bulletPoint: { flexDirection: "row", marginBottom: 2, marginLeft: 10 },
    bullet: { width: 8, fontSize: 8, marginRight: 4, color: "#000" },
    bulletText: { flex: 1, fontSize: 9, lineHeight: 1.35, color: "#000" },
    projectItem: { marginBottom: 5 },
    projectHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    projectTitle: { fontSize: 10, fontWeight: "bold", color: "#000" },
    projectTech: { fontSize: 9, fontStyle: "italic", color: "#000", marginBottom: 2 },
    educationItem: { marginBottom: 5 },
    educationHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    degreeName: { fontSize: 10, fontWeight: "bold", color: "#000" },
    institutionName: { fontSize: 9, color: "#000" },
    educationDetails: { fontSize: 9, fontStyle: "italic", color: "#000", marginTop: 1 },
    location: { fontSize: 9, color: "#000" },
    gpa: { fontSize: 9, color: "#000" },
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
                <Text style={styles.contactIcon}>|</Text>
                <Text>{resumeDetails.contact.email}</Text>
              </>
            )}
            {resumeDetails.contact?.linkedin && (
              <>
                <Text style={styles.contactIcon}>|</Text>
                <Text>{resumeDetails.contact.linkedin}</Text>
              </>
            )}
            {resumeDetails.contact?.github && (
              <>
                <Text style={styles.contactIcon}>|</Text>
                <Text>{resumeDetails.contact.github}</Text>
              </>
            )}
            {resumeDetails.contact?.location && (
              <>
                <Text style={styles.contactIcon}>|</Text>
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
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{desc}</Text>
                      </View>
                    )
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education - FIXED VERSION */}
        {showEducation && educationList?.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>{sectionTitles.education || "EDUCATION"}</Text>
            {educationList.map((edu, idx) => (
              <View key={idx} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  {/* Display degree as-is (no "Degree:" prefix) */}
                  <Text style={styles.degreeName}>{edu.degree}</Text>
                  {edu.year && <Text style={styles.dateRange}>{edu.year}</Text>}
                </View>

                {/* Institution name */}
                {edu.institution && (
                  <Text style={styles.institutionName}>{edu.institution}</Text>
                )}

                {/* Location and GPA on same line if both exist */}
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
              ?.filter((c) => c.trim())
              .map((cert, idx) => (
                <View key={idx} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
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
                {(section.items || [])
                  .filter((item) => item.trim())
                  .map((item, idx) => (
                    <View key={idx} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
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

export default Template3;
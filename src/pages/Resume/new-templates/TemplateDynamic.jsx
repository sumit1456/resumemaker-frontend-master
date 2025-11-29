// TemplateSections.jsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";

// ResumeDetails Section
export const ResumeDetailsSection = ({ resumeDetails, styles = {} }) => (
  <View style={styles.header}>
    <View style={styles.nameSection}>
      <Text style={styles.name}>{resumeDetails.name}</Text>
      <Text style={styles.title}>{resumeDetails.title}</Text>
    </View>

    <View style={styles.contactGrid}>
      <View style={styles.contactLeft}>
        {resumeDetails.contact?.phone && (
          <Text style={styles.contactItem}>{resumeDetails.contact.phone}</Text>
        )}
        {resumeDetails.contact?.email && (
          <Text style={styles.contactItem}>{resumeDetails.contact.email}</Text>
        )}
      </View>
      <View style={styles.contactRight}>
        {resumeDetails.contact?.linkedin && (
          <Text style={styles.contactItem}>{resumeDetails.contact.linkedin}</Text>
        )}
        {resumeDetails.contact?.github && (
          <Text style={styles.contactItem}>{resumeDetails.contact.github}</Text>
        )}
        {resumeDetails.contact?.location && (
          <Text style={styles.contactItem}>{resumeDetails.contact.location}</Text>
        )}
      </View>
    </View>
  </View>
);

// Summary Section
export const SummarySection = ({ summary, styles = {}, title = "PROFESSIONAL SUMMARY" }) => (
  <View>
    <Text style={styles.sectionHeader}>{title}</Text>
    <Text style={styles.summaryText}>{summary}</Text>
  </View>
);

// Skills Section
export const SkillsSection = ({ skills, styles = {}, title = "SKILLS" }) => {
  const groupedSkills = {};
  const ungroupedSkills = [];

  skills.forEach(skill => {
    if (skill && skill.includes(" - ")) {
      const [category, values] = skill.split(" - ");
      groupedSkills[category.trim()] = values.trim();
    } else if (skill && skill.trim()) ungroupedSkills.push(skill.trim());
  });

  return (
    <View>
      <Text style={styles.sectionHeaderLeft}>{title}</Text>
      {Object.entries(groupedSkills).map(([cat, val], idx) => (
        <View key={idx} style={styles.skillItem}>
          <Text style={styles.skillCategory}>{cat}</Text>
          <Text style={styles.skillValue}>{val}</Text>
        </View>
      ))}
      {ungroupedSkills.length > 0 && (
        <View style={styles.skillItem}>
          <Text style={styles.skillCategory}>Other</Text>
          <Text style={styles.skillValue}>{ungroupedSkills.join(", ")}</Text>
        </View>
      )}
    </View>
  );
};

// Education Section
export const EducationSection = ({ educationList, styles = {}, title = "EDUCATION" }) => (
  <View>
    <Text style={styles.sectionHeaderLeft}>{title}</Text>
    {educationList.map((edu, idx) => (
      <View key={idx} style={styles.educationItemCompact}>
        <Text style={styles.degreeNameCompact}>{edu.degree}</Text>
        {edu.institution && <Text style={styles.institutionCompact}>{edu.institution}</Text>}
        <Text style={styles.yearCompact}>
          {edu.year}
          {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
        </Text>
        {edu.location && <Text style={styles.yearCompact}>{edu.location}</Text>}
      </View>
    ))}
  </View>
);

// Certifications Section
export const CertificationsSection = ({ certifications, styles = {}, title = "CERTIFICATIONS" }) => (
  <View>
    <Text style={styles.sectionHeaderLeft}>{title}</Text>
    {certifications.filter(cert => cert && cert.trim()).map((cert, idx) => (
      <Text key={idx} style={styles.certItem}>• {cert}</Text>
    ))}
  </View>
);

// Experience Section
export const ExperienceSection = ({ experiences, styles = {}, title = "EXPERIENCE" }) => (
  <View>
    <Text style={styles.sectionHeader}>{title}</Text>
    {experiences.map((exp, idx) => (
      <View key={idx} style={styles.experienceItem}>
        <View style={styles.experienceHeader}>
          <View style={styles.jobTitleRow}>
            <Text style={styles.jobTitle}>{exp.position}</Text>
            <Text style={styles.dateRange}>{exp.duration}</Text>
          </View>
          <Text style={styles.companyInfo}>
            {exp.company}{exp.location ? `, ${exp.location}` : ""}
          </Text>
        </View>
        {exp.achievements?.map((ach, j) =>
          ach && ach.trim() ? (
            <View key={j} style={styles.achievementItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.achievementText}>{ach}</Text>
            </View>
          ) : null
        )}
      </View>
    ))}
  </View>
);

// Projects Section
export const ProjectSection = ({ projects, styles = {}, title = "PROJECTS" }) => (
  <View>
    <Text style={styles.sectionHeader}>{title}</Text>
    {projects.map((proj, idx) => (
      <View key={idx} style={styles.projectItem}>
        <View style={styles.projectTitleRow}>
          <Text style={styles.projectTitle}>{proj.name}</Text>
          {proj.duration && <Text style={styles.dateRange}>{proj.duration}</Text>}
        </View>
        {proj.technologies && <Text style={styles.projectTech}>{proj.technologies}</Text>}
        {proj.description?.map((desc, j) =>
          desc && desc.trim() ? (
            <View key={j} style={styles.achievementItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.achievementText}>{desc}</Text>
            </View>
          ) : null
        )}
      </View>
    ))}
  </View>
);

// Custom Section
export const CustomSection = ({ section, styles = {} }) => (
  <View>
    <Text style={styles.sectionHeader}>{section.title}</Text>
    {section.items?.filter(item => item && item.trim()).map((item, idx) => (
      <View key={idx} style={styles.achievementItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.achievementText}>{item}</Text>
      </View>
    ))}
  </View>
);

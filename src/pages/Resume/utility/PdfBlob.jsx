// pdfBlobGenerator.js
import { pdf, Document, Page } from "@react-pdf/renderer";

/**
 * Generate PDF blobs for ANY template (TemplateB, TemplateC, etc.)
 * @param {Object} resumeData - Full resume data
 * @param {Object} editorStyles - CSS overrides from editor
 * @param {ReactComponent} TemplateComponent - The template component to render
 * @param {Object} defaultStyles - Template default CSS objects
 */
export const generateSectionBlobs = async (
  resumeData,
  editorStyles = {},
  TemplateComponent,
  defaultStyles = {}
) => {
  if (!resumeData) return {};

  const blobs = {};
  const styles = { ...defaultStyles, ...editorStyles }; // merge default + editor style overrides

  // helper wrapper because react-pdf requires Document + Page
  const wrap = (component) => (
    <Document>
      <Page size="A4">{component}</Page>
    </Document>
  );

  try {
    // ----------------------------
    // 1️⃣ RESUME DETAILS
    // ----------------------------
    if (resumeData.resumeDetails) {
      const doc = wrap(
        <TemplateComponent
          resumeDetails={resumeData.resumeDetails}
          showSummary={false}
          showSkills={false}
          showExperience={false}
          showProjects={false}
          showEducation={false}
          showCertifications={false}
          customSections={[]}
          styles={styles}
        />
      );

      blobs.resumeDetails = await pdf(doc).toBlob();
    }

    // ----------------------------
    // 2️⃣ SUMMARY
    // ----------------------------
    if (resumeData.resumeDetails?.summary) {
      const doc = wrap(
        <TemplateComponent
          resumeDetails={{ summary: resumeData.resumeDetails.summary }}
          showSummary={true}
          showSkills={false}
          showExperience={false}
          showProjects={false}
          showEducation={false}
          showCertifications={false}
          customSections={[]}
          styles={styles}
        />
      );
      blobs.summary = await pdf(doc).toBlob();
    }

    // ----------------------------
    // 3️⃣ SKILLS
    // ----------------------------
    if (resumeData.skills?.length > 0) {
      const doc = wrap(
        <TemplateComponent
          skills={resumeData.skills}
          showSummary={false}
          showSkills={true}
          showExperience={false}
          showProjects={false}
          showEducation={false}
          showCertifications={false}
          customSections={[]}
          styles={styles}
        />
      );
      blobs.skills = await pdf(doc).toBlob();
    }

    // ----------------------------
    // 4️⃣ EXPERIENCE
    // ----------------------------
    if (resumeData.experiences?.length > 0) {
      const doc = wrap(
        <TemplateComponent
          experiences={resumeData.experiences}
          showSummary={false}
          showSkills={false}
          showExperience={true}
          showProjects={false}
          showEducation={false}
          showCertifications={false}
          customSections={[]}
          styles={styles}
        />
      );
      blobs.experience = await pdf(doc).toBlob();
    }

    // ----------------------------
    // 5️⃣ PROJECTS
    // ----------------------------
    if (resumeData.projects?.length > 0) {
      const doc = wrap(
        <TemplateComponent
          projects={resumeData.projects}
          showSummary={false}
          showSkills={false}
          showExperience={false}
          showProjects={true}
          showEducation={false}
          showCertifications={false}
          customSections={[]}
          styles={styles}
        />
      );
      blobs.projects = await pdf(doc).toBlob();
    }

    // ----------------------------
    // 6️⃣ EDUCATION
    // ----------------------------
    if (resumeData.educationList?.length > 0) {
      const doc = wrap(
        <TemplateComponent
          educationList={resumeData.educationList}
          showSummary={false}
          showSkills={false}
          showExperience={false}
          showProjects={false}
          showEducation={true}
          showCertifications={false}
          customSections={[]}
          styles={styles}
        />
      );
      blobs.education = await pdf(doc).toBlob();
    }

    // ----------------------------
    // 7️⃣ CERTIFICATIONS
    // ----------------------------
    if (resumeData.certifications?.length > 0) {
      const doc = wrap(
        <TemplateComponent
          certifications={resumeData.certifications}
          showSummary={false}
          showSkills={false}
          showExperience={false}
          showProjects={false}
          showEducation={false}
          showCertifications={true}
          customSections={[]}
          styles={styles}
        />
      );
      blobs.certifications = await pdf(doc).toBlob();
    }

    // ----------------------------
    // 8️⃣ CUSTOM SECTIONS (FULLY FIXED)
    // ----------------------------
    if (resumeData.customSections?.length > 0) {
      let index = 0;
      for (const section of resumeData.customSections) {
        const doc = wrap(
          <TemplateComponent
            customSections={[section]}
            showSummary={false}
            showSkills={false}
            showExperience={false}
            showProjects={false}
            showEducation={false}
            showCertifications={false}
            styles={styles}
          />
        );

        blobs[`custom_${index}`] = await pdf(doc).toBlob();
        index++;
      }
    }

    return blobs;
  } catch (err) {
    console.error("Blob generation error:", err);
    return blobs;
  }
};

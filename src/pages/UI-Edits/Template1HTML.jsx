// // Template1HTMLEditable.jsx - Fully UI controllable via props
// import React from "react";

// // ========== TEMPLATE COMPONENT ==========
// const Template1HTMLEditable = ({
//   resumeDetails = {},
//   skills = [],
//   experiences = [],
//   projects = [],
//   educationList = [],
//   certifications = [],
//   showSummary = true,
//   showSkills = true,
//   showExperience = true,
//   showProjects = true,
//   showEducation = true,
//   showCertifications = true,
//   sectionTitles = {},
//   customSections = [],
//   styleConfig = {}
// }) => {
//   const defaultConfig = {
//     primaryColor: "#000000",
//     textColor: "#000000",
//     accentColor: "#000000",
//     backgroundColor: "#FFFFFF",
//     fontFamily: "Helvetica",
//     nameFontSize: 24,
//     titleFontSize: 11,
//     headerFontSize: 11,
//     bodyFontSize: 10,
//     smallFontSize: 9,
//     lineHeight: 1.4,
//     letterSpacing: 0.5,
//     textTransform: "uppercase",
//     pageMargin: 40,
//     headerMarginBottom: 20,
//     columnGap: 15,
//     leftColumnWidth: "35%",
//     rightColumnWidth: "65%",
//     sectionMarginTop: 12,
//     sectionMarginBottom: 6,
//     itemMarginBottom: 8,
//     headerBorderWidth: 3,
//     sectionBorderWidth: 1.5,
//     columnBorderWidth: 2,
//     bulletStyle: "•"
//   };

//   const config = { ...defaultConfig, ...styleConfig };

//   const groupedSkills = {};
//   const ungroupedSkills = [];
//   if (skills && Array.isArray(skills)) {
//     skills.forEach(skill => {
//       if (skill && skill.includes(" - ")) {
//         const [cat, val] = skill.split(" - ");
//         groupedSkills[cat.trim()] = val.trim();
//       } else if (skill?.trim()) {
//         ungroupedSkills.push(skill.trim());
//       }
//     });
//   }

//   const pageStyle = {
//     padding: config.pageMargin,
//     backgroundColor: config.backgroundColor,
//     fontFamily: config.fontFamily,
//     color: config.textColor,
//     fontSize: config.bodyFontSize,
//     lineHeight: config.lineHeight,
//   };

//   const sectionHeaderStyle = {
//     fontSize: config.headerFontSize,
//     fontWeight: "bold",
//     color: config.primaryColor,
//     marginTop: config.sectionMarginTop,
//     marginBottom: config.sectionMarginBottom,
//     borderBottom: `${config.sectionBorderWidth}px solid ${config.accentColor}`,
//     textTransform: config.textTransform,
//     letterSpacing: config.letterSpacing,
//     paddingBottom: 3,
//   };

//   return (
//     <div style={pageStyle}>
//       {/* HEADER */}
//       <div style={{ marginBottom: config.headerMarginBottom }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "baseline",
//             marginBottom: 6,
//             paddingBottom: 8,
//             borderBottom: `${config.headerBorderWidth}px solid ${config.primaryColor}`,
//           }}
//         >
//           <div style={{ fontSize: config.nameFontSize, fontWeight: "bold", letterSpacing: config.letterSpacing, color: config.primaryColor }}>
//             {resumeDetails.name || "Your Name"}
//           </div>
//           <div style={{ fontSize: config.titleFontSize, fontWeight: "bold", color: config.primaryColor }}>
//             {resumeDetails.title || "Your Title"}
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 6 }}>
//           <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             {resumeDetails.contact?.phone && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.phone}</div>}
//             {resumeDetails.contact?.email && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.email}</div>}
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
//             {resumeDetails.contact?.linkedin && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.linkedin}</div>}
//             {resumeDetails.contact?.github && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.github}</div>}
//             {resumeDetails.contact?.location && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.location}</div>}
//           </div>
//         </div>
//       </div>

//       {/* SUMMARY */}
//       {showSummary && resumeDetails.summary && (
//         <div>
//           <div style={sectionHeaderStyle}>{sectionTitles.summary || "PROFESSIONAL SUMMARY"}</div>
//           <div style={{ marginBottom: 8, fontSize: config.bodyFontSize, textAlign: "justify" }}>{resumeDetails.summary}</div>
//         </div>
//       )}

//       {/* TWO COLUMNS */}
//       <div style={{ display: "flex", gap: config.columnGap }}>
//         {/* LEFT COLUMN */}
//         <div style={{ width: config.leftColumnWidth, paddingRight: 10 }}>
//           {/* SKILLS */}
//           {showSkills && skills?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.skills || "SKILLS"}</div>
//               {Object.entries(groupedSkills).map(([cat, val], idx) => (
//                 <div key={idx} style={{ marginBottom: config.itemMarginBottom }}>
//                   <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>{cat}</div>
//                   <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{val}</div>
//                 </div>
//               ))}
//               {ungroupedSkills.length > 0 && (
//                 <div style={{ marginBottom: config.itemMarginBottom }}>
//                   <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>Other</div>
//                   <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{ungroupedSkills.join(", ")}</div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* EDUCATION */}
//           {showEducation && educationList?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.education || "EDUCATION"}</div>
//               {educationList.map((edu, idx) => (
//                 <div key={idx} style={{ marginBottom: 10 }}>
//                   <div style={{ fontWeight: "bold", fontSize: config.bodyFontSize, color: config.textColor }}>{edu.degree}</div>
//                   {edu.institution && <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{edu.institution}</div>}
//                   <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>
//                     {edu.year}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
//                   </div>
//                   {edu.location && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{edu.location}</div>}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* CERTIFICATIONS */}
//           {showCertifications && certifications?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.certifications || "CERTIFICATIONS"}</div>
//               {certifications.filter(cert => cert?.trim()).map((cert, idx) => (
//                 <div key={idx} style={{ marginBottom: 4, color: config.textColor }}>
//                   {config.bulletStyle} {cert}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* RIGHT COLUMN */}
//         <div style={{ width: config.rightColumnWidth, paddingLeft: 10, borderLeft: `${config.columnBorderWidth}px solid ${config.accentColor}` }}>
//           {/* EXPERIENCE */}
//           {showExperience && experiences?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.experience || "EXPERIENCE"}</div>
//               {experiences.map((exp, idx) => (
//                 <div key={idx} style={{ marginBottom: 12 }}>
//                   <div style={{ marginBottom: 3 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
//                       <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{exp.position}</div>
//                       <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{exp.duration}</div>
//                     </div>
//                     <div style={{ fontSize: config.smallFontSize + 0.5, marginBottom: 4, color: config.textColor }}>
//                       {exp.company}{exp.location ? `, ${exp.location}` : ""}
//                     </div>
//                   </div>
//                   {exp.achievements?.filter(a => a?.trim()).map((ach, j) => (
//                     <div key={j} style={{ display: "flex", marginBottom: 3 }}>
//                       <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
//                       <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{ach}</div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* PROJECTS */}
//           {showProjects && projects?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.projects || "PROJECTS"}</div>
//               {projects.map((proj, idx) => (
//                 <div key={idx} style={{ marginBottom: 11 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
//                     <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{proj.name}</div>
//                     {proj.duration && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{proj.duration}</div>}
//                   </div>
//                   {proj.technologies && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", marginBottom: 4, color: config.textColor }}>{proj.technologies}</div>}
//                   {proj.description?.filter(d => d?.trim()).map((desc, j) => (
//                     <div key={j} style={{ display: "flex", marginBottom: 3 }}>
//                       <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
//                       <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{desc}</div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* CUSTOM SECTIONS */}
//           {customSections?.filter(s => s?.title?.trim()).map((section) => (
//             <div key={section.id}>
//               <div style={sectionHeaderStyle}>{section.title}</div>
//               {section.items?.filter(i => i?.trim()).map((item, idx) => (
//                 <div key={idx} style={{ display: "flex", marginBottom: 3, color: config.textColor }}>
//                   <div style={{ width: 10 }}>{config.bulletStyle}</div>
//                   <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight }}>{item}</div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Template1HTMLEditable;



import React from "react";

const Template1HTMLEditable = ({
  resumeDetails = {},
  skills = [],
  experiences = [],
  projects = [],
  educationList = [],
  certifications = [],
  showSummary = true,
  showSkills = true,
  showExperience = true,
  showProjects = true,
  showEducation = true,
  showCertifications = true,
  sectionTitles = {},
  customSections = [],
  styleConfig = {}
}) => {
  const defaultConfig = {
    primaryColor: "#000000",
    textColor: "#000000",
    accentColor: "#000000",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    nameFontSize: 24,
    titleFontSize: 11,
    headerFontSize: 11,
    bodyFontSize: 10,
    smallFontSize: 9,
    lineHeight: 1.4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    pageMargin: 40,
    headerMarginBottom: 20,
    columnGap: 15,
    leftColumnWidth: "35%",
    rightColumnWidth: "65%",
    sectionMarginTop: 12,
    sectionMarginBottom: 6,
    itemMarginBottom: 8,
    headerBorderWidth: 3,
    sectionBorderWidth: 1.5,
    columnBorderWidth: 2,
    bulletStyle: "•"
  };

  const config = { ...defaultConfig, ...styleConfig };

  const groupedSkills = {};
  const ungroupedSkills = [];
  if (skills && Array.isArray(skills)) {
    skills.forEach(skill => {
      if (skill && skill.includes(" - ")) {
        const [cat, val] = skill.split(" - ");
        groupedSkills[cat.trim()] = val.trim();
      } else if (skill?.trim()) {
        ungroupedSkills.push(skill.trim());
      }
    });
  }

  const pageStyle = {
    width: "210mm",
    minHeight: "297mm",
    padding: config.pageMargin,
    backgroundColor: config.backgroundColor,
    fontFamily: config.fontFamily,
    color: config.textColor,
    fontSize: config.bodyFontSize,
    lineHeight: config.lineHeight,
    boxSizing: "border-box"
  };

  const sectionHeaderStyle = {
    fontSize: config.headerFontSize,
    fontWeight: "bold",
    color: config.primaryColor,
    marginTop: config.sectionMarginTop,
    marginBottom: config.sectionMarginBottom,
    borderBottom: `${config.sectionBorderWidth}px solid ${config.accentColor}`,
    textTransform: config.textTransform,
    letterSpacing: config.letterSpacing,
    paddingBottom: 3,
  };

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={{ marginBottom: config.headerMarginBottom }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 6,
            paddingBottom: 8,
            borderBottom: `${config.headerBorderWidth}px solid ${config.primaryColor}`,
          }}
        >
          <div style={{ fontSize: config.nameFontSize, fontWeight: "bold", letterSpacing: config.letterSpacing, color: config.primaryColor }}>
            {resumeDetails.name || "Your Name"}
          </div>
          <div style={{ fontSize: config.titleFontSize, fontWeight: "bold", color: config.primaryColor }}>
            {resumeDetails.title || "Your Title"}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 6 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {resumeDetails.contact?.phone && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.phone}</div>}
            {resumeDetails.contact?.email && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.email}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
            {resumeDetails.contact?.linkedin && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.linkedin}</div>}
            {resumeDetails.contact?.github && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.github}</div>}
            {resumeDetails.contact?.location && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.location}</div>}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {showSummary && resumeDetails.summary && (
        <div>
          <div style={sectionHeaderStyle}>{sectionTitles.summary || "SUMMARY"}</div>
          <div style={{ marginBottom: 8, fontSize: config.bodyFontSize, textAlign: "justify" }}>{resumeDetails.summary}</div>
        </div>
      )}

      {/* TWO COLUMNS */}
      <div style={{ display: "flex", gap: config.columnGap }}>
        {/* LEFT COLUMN */}
        <div style={{ width: config.leftColumnWidth, paddingRight: 10 }}>
          {/* SKILLS */}
          {showSkills && skills?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.skills || "SKILLS"}</div>
              {Object.entries(groupedSkills).map(([cat, val], idx) => (
                <div key={idx} style={{ marginBottom: config.itemMarginBottom }}>
                  <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>{cat}</div>
                  <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{val}</div>
                </div>
              ))}
              {ungroupedSkills.length > 0 && (
                <div style={{ marginBottom: config.itemMarginBottom }}>
                  <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>Other</div>
                  <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{ungroupedSkills.join(", ")}</div>
                </div>
              )}
            </div>
          )}

          {/* EDUCATION */}
          {showEducation && educationList?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.education || "EDUCATION"}</div>
              {educationList.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: "bold", fontSize: config.bodyFontSize, color: config.textColor }}>{edu.degree}</div>
                  {edu.institution && <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{edu.institution}</div>}
                  <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>
                    {edu.year}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                  </div>
                  {edu.location && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{edu.location}</div>}
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATIONS */}
          {showCertifications && certifications?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.certifications || "CERTIFICATIONS"}</div>
              {certifications.filter(cert => cert?.trim()).map((cert, idx) => (
                <div key={idx} style={{ marginBottom: 4, color: config.textColor, fontSize: config.smallFontSize }}>
                  {config.bulletStyle} {cert}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: config.rightColumnWidth, paddingLeft: 10, borderLeft: `${config.columnBorderWidth}px solid ${config.accentColor}` }}>
          {/* EXPERIENCE */}
          {showExperience && experiences?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.experience || "EXPERIENCE"}</div>
              {experiences.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <div style={{ marginBottom: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{exp.position}</div>
                      <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{exp.duration}</div>
                    </div>
                    <div style={{ fontSize: config.smallFontSize + 0.5, marginBottom: 4, color: config.textColor }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ""}
                    </div>
                  </div>
                  {exp.achievements?.filter(a => a?.trim()).map((ach, j) => (
                    <div key={j} style={{ display: "flex", marginBottom: 3 }}>
                      <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
                      <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{ach}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {showProjects && projects?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.projects || "PROJECTS"}</div>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{proj.name}</div>
                    {proj.duration && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{proj.duration}</div>}
                  </div>
                  {proj.technologies && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", marginBottom: 4, color: config.textColor }}>{proj.technologies}</div>}
                  {proj.description?.filter(d => d?.trim()).map((desc, j) => (
                    <div key={j} style={{ display: "flex", marginBottom: 3 }}>
                      <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
                      <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{desc}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template1HTMLEditable;
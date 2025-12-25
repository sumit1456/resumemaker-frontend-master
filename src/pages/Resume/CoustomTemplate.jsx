
import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Register fonts if needed (optional)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

/**
 * UTILITY: Translator from Canvas/Web CSS to React-PDF styles
 * Some web styles (like 'gap', 'boxShadow') need handling or are partially supported in newer React-PDF versions.
 */
const applyPdfStyles = (baseStyle, configStyle = {}) => {
    if (!configStyle) return baseStyle;

    const merged = { ...baseStyle, ...configStyle };
    const validPdfStyles = {};

    // React-PDF supported properties whitelist (subset of web CSS)
    const allowedProps = [
        'alignContent', 'alignItems', 'alignSelf', 'backgroundColor', 'border',
        'borderBottom', 'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius',
        'borderBottomStyle', 'borderBottomWidth', 'borderColor', 'borderLeft',
        'borderLeftColor', 'borderLeftStyle', 'borderLeftWidth', 'borderRadius',
        'borderRight', 'borderRightColor', 'borderRightStyle', 'borderRightWidth',
        'borderStyle', 'borderTop', 'borderTopColor', 'borderTopLeftRadius',
        'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth', 'borderWidth',
        'bottom', 'color', 'display', 'flex', 'flexDirection', 'flexGrow',
        'flexShrink', 'flexWrap', 'fontFamily', 'fontSize', 'fontStyle',
        'fontWeight', 'height', 'justifyContent', 'left', 'letterSpacing',
        'lineHeight', 'margin', 'marginBottom', 'marginLeft', 'marginRight',
        'marginTop', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth',
        'opacity', 'overflow', 'padding', 'paddingBottom', 'paddingLeft',
        'paddingRight', 'paddingTop', 'position', 'right', 'textAlign',
        'textDecoration', 'textOverflow', 'textTransform', 'top', 'width',
        'zIndex', 'gap', 'rowGap', 'columnGap' // 'gap' is supported in React-PDF v3+
    ];

    Object.keys(merged).forEach(key => {
        if (allowedProps.includes(key) && merged[key] !== undefined && merged[key] !== "") {
            // Helper: Convert "px" strings to numbers if needed, though React-PDF handles typical string units well.
            // React-PDF treats unitless numbers as points (1/72 inch). 
            validPdfStyles[key] = merged[key];
        }
    });

    return validPdfStyles;
};


// ==================== GENERIC PDF COMPONENTS ====================

const PDFFlexibleText = ({ children, config = {}, style = {} }) => (
    <Text style={applyPdfStyles(style, config)}>
        {children}
    </Text>
);

const PDFFlexibleLayout = ({ children, config = {} }) => (
    <View style={applyPdfStyles({
        display: "flex",
        flexDirection: "column"
    }, config)}>
        {children}
    </View>
);

// ==================== SECTION COMPONENTS ====================

const PDFHeaderSection = ({ resumeDetails, styleConfig }) => {
    const config = styleConfig?.header || {};

    // Determine Order
    const sectionOrder = config.sectionOrder || ['name', 'title', 'contact'];

    return (
        <View style={applyPdfStyles({ marginBottom: 10 }, config.container)}>
            <View style={applyPdfStyles({ display: 'flex', flexDirection: 'column' }, config.mainLayout)}>

                {sectionOrder.map((sectionType, idx) => {
                    switch (sectionType) {
                        case 'name':
                            return (
                                <View key="name" style={applyPdfStyles({ alignItems: config.nameAlign || 'flex-start' }, config.nameZone)}>
                                    <PDFFlexibleText config={config.nameStyle}>
                                        {resumeDetails.name}
                                    </PDFFlexibleText>
                                </View>
                            );
                        case 'title':
                            if (!config.showTitle) return null;
                            return (
                                <View key="title" style={applyPdfStyles({ alignItems: config.titleAlign || 'flex-start', marginTop: 4 }, config.titleZone)}>
                                    <PDFFlexibleText config={config.titleStyle}>
                                        {resumeDetails.title}
                                    </PDFFlexibleText>
                                </View>
                            );
                        case 'contact':
                            if (!config.showContact) return null;
                            const hasGroups = config.contactLeftGroup && config.contactRightGroup;

                            if (hasGroups) {
                                return (
                                    <View key="contact" style={applyPdfStyles({
                                        marginTop: 8,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }, config.contactLayout)}>
                                        <View style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {config.contactLeftGroup.map(key => {
                                                if (!resumeDetails.contact[key]) return null;
                                                return (
                                                    <PDFFlexibleText key={key} config={config.contactItemStyle}>
                                                        {resumeDetails.contact[key]}
                                                    </PDFFlexibleText>
                                                )
                                            })}
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                                            {config.contactRightGroup.map(key => {
                                                if (!resumeDetails.contact[key]) return null;
                                                return (
                                                    <PDFFlexibleText key={key} config={config.contactItemStyle}>
                                                        {resumeDetails.contact[key]}
                                                    </PDFFlexibleText>
                                                )
                                            })}
                                        </View>
                                    </View>
                                );
                            }

                            return (
                                <View key="contact" style={applyPdfStyles({ marginTop: 8 }, config.contactLayout)}>
                                    {(config.contactOrder || ['phone', 'email', 'linkedin', 'github', 'location']).map(key => {
                                        if (!resumeDetails.contact[key]) return null;
                                        return (
                                            <PDFFlexibleText key={key} config={config.contactItemStyle}>
                                                {resumeDetails.contact[key]}
                                            </PDFFlexibleText>
                                        )
                                    })}
                                </View>
                            );
                        default: return null;
                    }
                })}
            </View>
            {config.showDivider && (
                <View style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomStyle: 'solid',
                    marginTop: config.dividerMarginTop || 5,
                    ...applyPdfStyles({}, config.dividerStyle) // This might require custom parsing for '2px solid black' string
                }} />
            )}
        </View>
    );
};


// Generic Title Component for Sections
const PDFSectionTitle = ({ title, config }) => {
    if (!config?.showTitle) return null;
    return (
        <PDFFlexibleText config={config.titleStyle} style={{ marginBottom: 6 }}>
            {title}
        </PDFFlexibleText>
    );
}

const PDFFlexibleSummary = ({ resumeDetails, styleConfig, sectionTitles }) => {
    const config = styleConfig?.summary || {};
    if (!config.showTitle && !resumeDetails.summary) return null;

    return (
        <View style={applyPdfStyles({ marginBottom: 15 }, config.container)}>
            <PDFSectionTitle title={sectionTitles?.summary || "PROFESSIONAL SUMMARY"} config={config} />
            <PDFFlexibleText config={config.bodyStyle}>
                {resumeDetails.summary}
            </PDFFlexibleText>
        </View>
    );
};

const PDFFlexibleExperience = ({ experiences, styleConfig, sectionTitles }) => {
    const config = styleConfig?.experience || {};
    if (!experiences?.length) return null;

    return (
        <View style={applyPdfStyles({ marginBottom: 15 }, config.container)}>
            <PDFSectionTitle title={sectionTitles?.experience || "EXPERIENCE"} config={config} />

            {experiences.map((exp, idx) => (
                <View key={idx} style={applyPdfStyles({ marginBottom: 10 }, config.itemContainer)}>
                    {/* Header Row: Position + Date */}
                    <View style={applyPdfStyles({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }, config.headerLayout)}>
                        <PDFFlexibleText config={config.positionFirst ? config.positionStyle : config.companyStyle}>
                            {config.positionFirst ? exp.position : exp.company}
                        </PDFFlexibleText>
                        <PDFFlexibleText config={config.durationStyle}>
                            {exp.duration}
                        </PDFFlexibleText>
                    </View>

                    {/* SubHeader Row: Company + Location */}
                    <View style={applyPdfStyles({ display: 'flex', flexDirection: 'row', marginBottom: 4 }, config.subHeaderLayout)}>
                        <PDFFlexibleText config={config.positionFirst ? config.companyStyle : config.positionStyle}>
                            {config.positionFirst ? exp.company : exp.position}
                            {exp.location ? `, ${exp.location}` : ''}
                        </PDFFlexibleText>
                    </View>

                    {/* Achievements */}
                    {config.showAchievements && exp.achievements && exp.achievements.map((ach, aIdx) => (
                        <View key={aIdx} style={{ display: 'flex', flexDirection: 'row', marginBottom: 2 }}>
                            <Text style={{ width: 10, fontSize: 10 }}>•</Text>
                            <PDFFlexibleText config={config.bulletConfig || { fontSize: 10 }}>{ach}</PDFFlexibleText>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    )
};

const PDFFlexibleSkills = ({ skills, styleConfig, sectionTitles }) => {
    const config = styleConfig?.skills || {};
    if (!skills?.length) return null;

    // Handle "inline" display (common for ATS) where skills are just a comma-separated text block
    const isInline = config.displayType === 'inline';
    // Handle "chip" display (common for Modern)
    const isChip = config.displayType === 'chip';

    return (
        <View style={applyPdfStyles({ marginBottom: 15 }, config.container)}>
            <PDFSectionTitle title={sectionTitles?.skills || "SKILLS"} config={config} />

            {isInline ? (
                <PDFFlexibleText config={config.valueStyle}>
                    {skills.map(s => typeof s === 'string' ? s : s.name).join(config.separator || ', ')}
                </PDFFlexibleText>
            ) : (
                <View style={applyPdfStyles({ display: 'flex', flexDirection: isChip ? 'row' : 'column', flexWrap: 'wrap', gap: 4 }, config.contentLayout)}>
                    {skills.map((skill, idx) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        if (!skillName) return null;

                        if (isChip) {
                            return (
                                <View key={idx} style={applyPdfStyles({
                                    backgroundColor: '#eee',
                                    padding: '4px 8px',
                                    borderRadius: 4
                                }, config.valueStyle)}>
                                    <Text style={{ fontSize: config.valueStyle?.fontSize || 10, color: config.valueStyle?.color }}>{skillName}</Text>
                                </View>
                            )
                        }

                        // List Item
                        return (
                            <View key={idx} style={applyPdfStyles({ marginBottom: 2, flexDirection: 'row' }, config.itemStyle)}>
                                <Text style={{ width: 10, fontSize: 10 }}>•</Text>
                                <PDFFlexibleText config={config.valueStyle}>{skillName}</PDFFlexibleText>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const PDFFlexibleProjects = ({ projects, styleConfig, sectionTitles }) => {
    const config = styleConfig?.projects || {};
    if (!projects?.length) return null;

    return (
        <View style={applyPdfStyles({ marginBottom: 15 }, config.container)}>
            <PDFSectionTitle title={sectionTitles?.projects || "PROJECTS"} config={config} />

            {projects.map((proj, idx) => (
                <View key={idx} style={applyPdfStyles({ marginBottom: 10 }, config.itemContainer)}>
                    {/* Header Row */}
                    <View style={applyPdfStyles({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }, config.headerLayout)}>
                        <PDFFlexibleText config={config.nameStyle}>
                            {proj.name}
                        </PDFFlexibleText>
                        {config.showDuration && (
                            <PDFFlexibleText config={config.durationStyle}>
                                {proj.duration}
                            </PDFFlexibleText>
                        )}
                    </View>

                    {/* Tech Stack */}
                    {config.showTechnologies && proj.technologies && (
                        <PDFFlexibleText config={config.techStyle}>
                            {proj.technologies}
                        </PDFFlexibleText>
                    )}

                    {/* Description Points */}
                    {config.showDescription && proj.description && proj.description.map((desc, dIdx) => (
                        <View key={dIdx} style={{ display: 'flex', flexDirection: 'row', marginBottom: 2 }}>
                            <Text style={{ width: 10, fontSize: 10 }}>•</Text>
                            <PDFFlexibleText config={config.bulletConfig || { fontSize: 10 }}>{desc}</PDFFlexibleText>
                        </View>
                    ))}
                    {config.showLink && proj.link && (
                        <PDFFlexibleText config={config.linkStyle}>
                            {proj.link}
                        </PDFFlexibleText>
                    )}
                </View>
            ))}
        </View>
    );
};

const PDFFlexibleEducation = ({ educationList, styleConfig, sectionTitles }) => {
    const config = styleConfig?.education || {};
    if (!educationList?.length) return null;

    return (
        <View style={applyPdfStyles({ marginBottom: 15 }, config.container)}>
            <PDFSectionTitle title={sectionTitles?.education || "EDUCATION"} config={config} />

            {educationList.map((edu, idx) => (
                <View key={idx} style={applyPdfStyles({ marginBottom: 10 }, config.itemMarginBottom ? { marginBottom: config.itemMarginBottom } : {})}>
                    <PDFFlexibleText config={config.degreeStyle}>
                        {edu.degree}
                    </PDFFlexibleText>
                    {config.showInstitution && (
                        <PDFFlexibleText config={config.institutionStyle}>
                            {edu.institution}
                        </PDFFlexibleText>
                    )}

                    <View style={applyPdfStyles({ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }, config.metaLayout)}>
                        <PDFFlexibleText config={config.metaStyle || config.detailsStyle}>
                            {edu.year}
                        </PDFFlexibleText>
                        {config.showGpa && edu.gpa && (
                            <PDFFlexibleText config={config.metaStyle || config.detailsStyle}>
                                | GPA: {edu.gpa}
                            </PDFFlexibleText>
                        )}
                        {config.showLocation && edu.location && (
                            <PDFFlexibleText config={config.metaStyle || config.detailsStyle}>
                                | {edu.location}
                            </PDFFlexibleText>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

const PDFFlexibleCertifications = ({ certifications, styleConfig, sectionTitles }) => {
    const config = styleConfig?.certifications || {};
    if (!certifications?.length) return null;

    return (
        <View style={applyPdfStyles({ marginBottom: 15 }, config.container)}>
            <PDFSectionTitle title={sectionTitles?.certifications || "CERTIFICATIONS"} config={config} />
            {certifications.map((cert, idx) => {
                const certName = typeof cert === 'string' ? cert : cert.name;
                return (
                    <View key={idx} style={applyPdfStyles({ marginBottom: 2, flexDirection: 'row' }, config.itemStyle)}>
                        <Text style={{ width: 10, fontSize: 10 }}>•</Text>
                        <PDFFlexibleText config={config.valueStyle || { fontSize: 9 }}>{certName}</PDFFlexibleText>
                    </View>
                )
            })}
        </View>
    );
};


const PDFFlexibleCustomSection = ({ section, styleConfig }) => {
    const config = styleConfig?.[section.title] || styleConfig?.customSection || {};
    if (!section.items?.length) return null;

    return (
        <View style={applyPdfStyles({ marginBottom: 15 }, config.container)}>
            <PDFSectionTitle title={section.title || "CUSTOM SECTION"} config={config} />
            <View style={applyPdfStyles({ display: 'flex', flexDirection: 'column', gap: 2 }, config.contentLayout)}>
                {section.items.map((item, idx) => (
                    <View key={idx} style={applyPdfStyles({ marginBottom: 2, flexDirection: 'row' }, config.itemStyle)}>
                        <Text style={{ width: 10, fontSize: 10 }}>•</Text>
                        <PDFFlexibleText config={config.valueStyle || { fontSize: 9 }}>{item}</PDFFlexibleText>
                    </View>
                ))}
            </View>
        </View>
    );
};


// ==================== MAIN CUSTOM TEMPLATE ====================

const CoustomTemplate = ({
    resumeDetails,
    skills,
    experiences,
    projects,
    educationList,
    certifications,
    sectionTitles,
    customSections,
    styleConfig
}) => {
    // Fallback if no config provided
    const config = styleConfig || {};
    const pageConfig = config.page || { padding: 30, fontFamily: 'Helvetica' };

    // Helper to render a section by name
    const renderSection = (sectionName) => {
        switch (sectionName) {
            case 'header':
                return <PDFHeaderSection resumeDetails={resumeDetails} styleConfig={config} />;
            case 'summary':
                return <PDFFlexibleSummary resumeDetails={resumeDetails} styleConfig={config} sectionTitles={sectionTitles} />;
            case 'experience':
                return <PDFFlexibleExperience experiences={experiences} styleConfig={config} sectionTitles={sectionTitles} />;
            case 'skills':
                return <PDFFlexibleSkills skills={skills} styleConfig={config} sectionTitles={sectionTitles} />;
            case 'education':
                return <PDFFlexibleEducation educationList={educationList} styleConfig={config} sectionTitles={sectionTitles} />;
            case 'projects':
                return <PDFFlexibleProjects projects={projects} styleConfig={config} sectionTitles={sectionTitles} />;
            case 'certifications':
                return <PDFFlexibleCertifications certifications={certifications} styleConfig={config} sectionTitles={sectionTitles} />;
            default:
                // Check if it's a custom section
                const customSec = (customSections || []).find(s => s.title === sectionName);
                if (customSec) {
                    return <PDFFlexibleCustomSection section={customSec} styleConfig={config} />;
                }
                return null;
        }
    };

    return (
        <Document>
            <Page size="A4" style={{
                padding: config.positions ? 0 : (pageConfig.padding || 30),
                backgroundColor: pageConfig.backgroundColor || '#FFF',
                fontFamily: pageConfig.fontFamily || 'Helvetica',
                fontSize: 10
            }}>
                {/* 1. Shapes (Always absolute, rendered first/bottom) */}
                {config.shapes && config.shapes.map((shape, idx) => (
                    <View key={`shape-${idx}`} style={{
                        position: 'absolute',
                        left: shape.x,
                        top: shape.y,
                        width: shape.width,
                        height: shape.height,
                        backgroundColor: shape.backgroundColor || shape.color || '#eee',
                        borderRadius: shape.borderRadius || 0,
                        opacity: shape.opacity || 1,
                        zIndex: -1
                    }} />
                ))}

                {/* 2. Main Body Content */}
                {config.positions ? (
                    // ABSOLUTE POSITIONING MODE
                    <React.Fragment>
                        {Object.entries(config.positions).map(([sectionName, pos]) => (
                            <View key={sectionName} style={{
                                position: 'absolute',
                                left: pos.x,
                                top: pos.y,
                                width: pos.width || config[sectionName]?.container?.width || '100%',
                            }}>
                                {renderSection(sectionName)}
                            </View>
                        ))}
                    </React.Fragment>
                ) : (
                    // STANDARD STACK MODE
                    <React.Fragment>
                        {renderSection('header')}
                        {renderSection('summary')}
                        {renderSection('skills')}
                        {renderSection('experience')}
                        {renderSection('projects')}
                        {renderSection('education')}
                        {renderSection('certifications')}
                        {(customSections || []).map((sec, idx) => (
                            <PDFFlexibleCustomSection key={idx} section={sec} styleConfig={config} />
                        ))}
                    </React.Fragment>
                )}

                {/* 3. Lines (Always absolute, rendered top layer) */}
                {config.lines && config.lines.map((line, idx) => (
                    <View key={`line-${idx}`} style={{
                        position: 'absolute',
                        left: line.x1,
                        top: line.y1,
                        width: line.orientation === 'vertical' ? line.thickness : Math.abs(line.x2 - line.x1),
                        height: line.orientation === 'vertical' ? Math.abs(line.y2 - line.y1) : line.thickness,
                        backgroundColor: line.color || '#000',
                    }} />
                ))}

            </Page>
        </Document>
    );
};

export default CoustomTemplate;

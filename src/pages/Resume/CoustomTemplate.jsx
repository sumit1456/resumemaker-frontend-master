import React, { useMemo } from "react";
import { Document, Page, Text, View, Line, Svg } from "@react-pdf/renderer";

// Default configuration as backup (Mimics ATS template)
const DEFAULT_RESUME_CONFIG = {
    page: {
        width: "210mm",
        height: "297mm",
        padding: 30,
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica",
    },
    header: {
        container: { marginBottom: 15 },
        nameStyle: { fontSize: 24, fontWeight: "bold", color: "#000000" },
        titleStyle: { fontSize: 14, color: "#666666", marginTop: 4 },
        contactLayout: { display: "flex", flexDirection: "row", gap: 10, marginTop: 8 },
        contactItemStyle: { fontSize: 9, color: "#000000" },
        showTitle: true,
        showContact: true,
    },
    summary: {
        container: { marginBottom: 15 },
        titleStyle: { fontSize: 12, fontWeight: "bold", borderBottom: 1, marginBottom: 5 },
        bodyStyle: { fontSize: 10, lineHeight: 1.5 },
        showTitle: true,
    },
    skills: {
        container: { marginBottom: 15 },
        titleStyle: { fontSize: 12, fontWeight: "bold", borderBottom: 1, marginBottom: 5 },
        valueStyle: { fontSize: 10, lineHeight: 1.4 },
        showTitle: true,
    },
    experience: {
        container: { marginBottom: 15 },
        titleStyle: { fontSize: 12, fontWeight: "bold", borderBottom: 1, marginBottom: 5 },
        positionStyle: { fontSize: 11, fontWeight: "bold" },
        companyStyle: { fontSize: 10, color: "#333333" },
        durationStyle: { fontSize: 9, fontStyle: "italic", color: "#666666" },
        bulletConfig: { fontSize: 9, marginLeft: 10, marginTop: 2 },
        itemMarginBottom: 10,
        showTitle: true,
    },
    education: {
        container: { marginBottom: 15 },
        titleStyle: { fontSize: 12, fontWeight: "bold", borderBottom: 1, marginBottom: 5 },
        degreeStyle: { fontSize: 10, fontWeight: "bold" },
        institutionStyle: { fontSize: 9 },
        detailsStyle: { fontSize: 9, color: "#666666" },
        itemMarginBottom: 8,
        showTitle: true,
    },
    certifications: {
        container: { marginBottom: 15 },
        titleStyle: { fontSize: 12, fontWeight: "bold", borderBottom: 1, marginBottom: 5 },
        valueStyle: { fontSize: 9 },
        showTitle: true,
    }
};

/* ---------------- UTILITIES ---------------- */

const parsePdfUnit = (val) => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.endsWith('px')) return parseFloat(trimmed) * 0.75; // px to pt approx
        if (trimmed.endsWith('pt')) return parseFloat(trimmed);
        if (trimmed.endsWith('mm')) return parseFloat(trimmed) * 2.8346;
        if (trimmed.includes('%')) return trimmed;
        const parsed = parseFloat(trimmed);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
};

const resolvePdfFont = (fontFamily) => {
    if (!fontFamily || typeof fontFamily !== 'string') return "Helvetica";
    const fonts = fontFamily.split(",").map(f => f.trim().replace(/['"]/g, "").toLowerCase());
    for (const f of fonts) {
        if (f.includes("roboto")) return "Helvetica";
        if (f.includes("sans") || f === "arial" || f === "helvetica") return "Helvetica";
        if (f.includes("serif") || f === "times") return "Times-Roman";
        if (f.includes("mono") || f === "courier") return "Courier";
    }
    return "Helvetica";
};

const applyPdfStyles = (base = {}, config = {}) => {
    if (!config) return base;
    const merged = { ...base, ...config };
    const out = {};

    for (const k in merged) {
        const v = merged[k];
        if (v === undefined || v === null || v === "") continue;

        if (k === "fontFamily") out[k] = resolvePdfFont(v);
        else if (k === "fontWeight") {
            out[k] = (v === "bold" || v === "700" || v === 700) ? 700 : 400;
        }
        else if (["fontSize", "lineHeight", "letterSpacing", "width", "height", "padding", "margin", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "gap", "rowGap", "columnGap", "borderBottomWidth", "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderRadius"].includes(k)) {
            out[k] = parsePdfUnit(v);
        }
        else if ((k === "borderBottom" || k === "borderTop") && typeof v === 'string') {
            const parts = v.split(' ');
            if (parts.length >= 1) out[`${k}Width`] = parsePdfUnit(parts[0]);
            if (parts.length >= 3) out[`${k}Color`] = parts[2];
            out[`${k}Style`] = 'solid';
        }
        else if (typeof v !== 'object') {
            out[k] = v;
        }
    }

    return out;
};

/* ---------------- RENDERING HELPERS ---------------- */

const PDFFlexibleContainer = ({ children, style = {}, config = {} }) => (
    <View style={applyPdfStyles(style, config)}>{children}</View>
);

const PDFFlexibleText = ({ children, style = {}, config = {} }) => {
    if (children === undefined || children === null || children === "") return null;
    // CRITICAL: Ensure children is a string or number. Objects will crash React-PDF.
    const safeChildren = (typeof children === 'string' || typeof children === 'number')
        ? String(children)
        : "";
    if (!safeChildren) return null;
    return <Text style={applyPdfStyles(style, config)}>{safeChildren}</Text>;
};

const PDFFlexibleLayout = ({ children, style = {}, config = {} }) => (
    <View style={applyPdfStyles({ display: "flex" }, config)}>{children}</View>
);

const PDFFlexibleBulletList = ({ items = [], styleConfig = {} }) => (
    <View style={applyPdfStyles({}, styleConfig.container)}>
        {(items || []).map((item, idx) => {
            const safeText = typeof item === 'string' ? item : (item ? String(item) : "");
            if (!safeText) return null;
            return (
                <View key={idx} style={applyPdfStyles({ flexDirection: "row", marginBottom: 2 }, styleConfig.itemStyle)}>
                    <Text style={applyPdfStyles({ width: 10 }, styleConfig.bulletStyle)}>{styleConfig.bulletChar || "•"}</Text>
                    <Text style={applyPdfStyles({ flex: 1 }, styleConfig.textStyle)}>{safeText}</Text>
                </View>
            );
        })}
    </View>
);

/* ---------------- SECTION COMPONENTS ---------------- */

const HeaderSection = ({ resumeDetails, config }) => (
    <PDFFlexibleContainer config={config.container}>
        <PDFFlexibleText config={config.nameStyle}>{resumeDetails.name}</PDFFlexibleText>
        {config.showTitle && <PDFFlexibleText config={config.titleStyle}>{resumeDetails.title}</PDFFlexibleText>}

        {config.showContact && (
            <PDFFlexibleLayout config={config.contactLayout}>
                {Object.entries(resumeDetails.contact || {}).map(([key, value]) => (
                    value ? (
                        <PDFFlexibleText key={key} config={config.contactItemStyle}>
                            {value}
                        </PDFFlexibleText>
                    ) : null
                ))}
            </PDFFlexibleLayout>
        )}
    </PDFFlexibleContainer>
);

const SummarySection = ({ summary, config, title }) => (
    <PDFFlexibleContainer config={config.container}>
        {config.showTitle && <PDFFlexibleText config={config.titleStyle}>{title || "SUMMARY"}</PDFFlexibleText>}
        <PDFFlexibleText config={config.bodyStyle}>{summary}</PDFFlexibleText>
    </PDFFlexibleContainer>
);

const SkillsSection = ({ skills, config, title }) => (
    <PDFFlexibleContainer config={config.container}>
        {config.showTitle && <PDFFlexibleText config={config.titleStyle}>{title || "SKILLS"}</PDFFlexibleText>}
        <PDFFlexibleText config={config.valueStyle}>{Array.isArray(skills) ? skills.join(", ") : skills}</PDFFlexibleText>
    </PDFFlexibleContainer>
);

const ExperienceSection = ({ experiences, config, title }) => (
    <PDFFlexibleContainer config={config.container}>
        {config.showTitle && <PDFFlexibleText config={config.titleStyle}>{title || "EXPERIENCE"}</PDFFlexibleText>}
        {experiences && experiences.map((exp, idx) => (
            <View key={idx} style={{ marginBottom: parsePdfUnit(config.itemMarginBottom) || 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <PDFFlexibleText config={config.positionStyle}>{exp.position}</PDFFlexibleText>
                    <PDFFlexibleText config={config.durationStyle}>{exp.duration}</PDFFlexibleText>
                </View>
                <PDFFlexibleText config={config.companyStyle}>
                    {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </PDFFlexibleText>
                {exp.achievements && Array.isArray(exp.achievements) && (
                    <PDFFlexibleBulletList items={exp.achievements} styleConfig={{ textStyle: config.bulletConfig }} />
                )}
            </View>
        ))}
    </PDFFlexibleContainer>
);

const EducationSection = ({ educationList, config, title }) => (
    <PDFFlexibleContainer config={config.container}>
        {config.showTitle && <PDFFlexibleText config={config.titleStyle}>{title || "EDUCATION"}</PDFFlexibleText>}
        {educationList && educationList.map((edu, idx) => (
            <View key={idx} style={{ marginBottom: parsePdfUnit(config.itemMarginBottom) || 8 }}>
                <PDFFlexibleText config={config.degreeStyle}>{edu.degree}</PDFFlexibleText>
                <PDFFlexibleText config={config.institutionStyle}>{edu.institution}</PDFFlexibleText>
                <PDFFlexibleText config={config.detailsStyle}>
                    {edu.year}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                </PDFFlexibleText>
            </View>
        ))}
    </PDFFlexibleContainer>
);

const ProjectsSection = ({ projects, config, title }) => (
    <PDFFlexibleContainer config={config.container}>
        {config.showTitle && <PDFFlexibleText config={config.titleStyle}>{title || "PROJECTS"}</PDFFlexibleText>}
        {projects && projects.map((proj, idx) => (
            <View key={idx} style={{ marginBottom: parsePdfUnit(config.itemMarginBottom) || 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <PDFFlexibleText config={config.nameStyle}>{proj.name}</PDFFlexibleText>
                    <PDFFlexibleText config={config.durationStyle}>{proj.duration}</PDFFlexibleText>
                </View>
                {proj.technologies && (
                    <PDFFlexibleText config={config.techStyle}>
                        {config.techPrefix || ""}{proj.technologies}
                    </PDFFlexibleText>
                )}
                {proj.description && Array.isArray(proj.description) && (
                    <PDFFlexibleBulletList items={proj.description} styleConfig={{ textStyle: config.bulletConfig }} />
                )}
            </View>
        ))}
    </PDFFlexibleContainer>
);

const CertificationsSection = ({ certifications, config, title }) => (
    <PDFFlexibleContainer config={config.container}>
        {config.showTitle && <PDFFlexibleText config={config.titleStyle}>{title || "CERTIFICATIONS"}</PDFFlexibleText>}
        {certifications && certifications.map((cert, idx) => (
            <PDFFlexibleText key={idx} config={config.valueStyle}>• {cert}</PDFFlexibleText>
        ))}
    </PDFFlexibleContainer>
);

/* ---------------- MAIN TEMPLATE ---------------- */

const CoustomTemplate = ({
    resumeDetails = {},
    skills = [],
    experiences = [],
    projects = [],
    educationList = [],
    certifications = [],
    customSections = [],
    sectionTitles = {},
    styleConfig = null
}) => {
    // Memoize the config merge with stable dependencies
    const cfg = useMemo(() => {
        const merged = JSON.parse(JSON.stringify(DEFAULT_RESUME_CONFIG)); // Deep clone
        const userConfig = styleConfig || resumeDetails?.styleConfig || {};

        for (const key in userConfig) {
            if (userConfig.hasOwnProperty(key) && typeof userConfig[key] === 'object' && userConfig[key] !== null) {
                if (merged[key]) {
                    merged[key] = { ...merged[key], ...userConfig[key] };
                } else {
                    merged[key] = userConfig[key];
                }
            }
        }
        return merged;
    }, [styleConfig, resumeDetails?.styleConfig]);

    const hasPositions = useMemo(() => cfg.positions && Object.keys(cfg.positions).length > 0, [cfg.positions]);

    const pageStyle = useMemo(() => applyPdfStyles({
        padding: 30,
        backgroundColor: "#FFFFFF",
    }, cfg.page || {}), [cfg.page]);

    // Pre-calculate position styles
    const positionStyles = useMemo(() => {
        if (!hasPositions) return {};
        const posOut = {};
        for (const key in cfg.positions) {
            const pos = cfg.positions[key];
            posOut[key] = {
                position: 'absolute',
                left: parsePdfUnit(pos.x),
                top: parsePdfUnit(pos.y),
            };
        }
        return posOut;
    }, [cfg.positions, hasPositions]);

    const renderSections = () => {
        const sectionData = [
            { key: 'header', component: <HeaderSection resumeDetails={resumeDetails} config={cfg.header} /> },
            { key: 'summary', component: <SummarySection summary={resumeDetails.summary} config={cfg.summary} title={sectionTitles.summary} /> },
            { key: 'skills', component: <SkillsSection skills={skills} config={cfg.skills} title={sectionTitles.skills} /> },
            { key: 'experience', component: <ExperienceSection experiences={experiences} config={cfg.experience} title={sectionTitles.experience} /> },
            { key: 'projects', component: <ProjectsSection projects={projects} config={cfg.projects || cfg.experience} title={sectionTitles.projects} /> },
            { key: 'education', component: <EducationSection educationList={educationList} config={cfg.education} title={sectionTitles.education} /> },
            { key: 'certifications', component: <CertificationsSection certifications={certifications} config={cfg.certifications} title={sectionTitles.certifications} /> },
            // Add Custom Sections
            ...(customSections || []).map((s, idx) => {
                if (!s || typeof s !== 'object') return null;
                const safeTitle = s.title || "Section";
                // Only use config if it's a plain object from our config, not a built-in property
                const sectionConfig = (cfg.hasOwnProperty(safeTitle) && typeof cfg[safeTitle] === 'object')
                    ? cfg[safeTitle]
                    : cfg.skills;

                return {
                    key: `custom-${s.id || idx}`,
                    component: (
                        <PDFFlexibleContainer config={sectionConfig?.container || sectionConfig}>
                            <PDFFlexibleText config={sectionConfig?.titleStyle || cfg.skills?.titleStyle}>{safeTitle}</PDFFlexibleText>
                            {s.items && Array.isArray(s.items) && s.items.map((item, i) => (
                                <PDFFlexibleText key={i} config={sectionConfig?.valueStyle || cfg.skills?.valueStyle}>
                                    {typeof item === 'string' ? `• ${item}` : ''}
                                </PDFFlexibleText>
                            ))}
                        </PDFFlexibleContainer>
                    )
                };
            }).filter(Boolean)
        ];

        return sectionData.map(s => {
            const style = positionStyles[s.key] || {};
            // Wrap in a View with wrap={false} to improve layout performance
            return (
                <View key={s.key} style={style} wrap={false}>
                    {s.component}
                </View>
            );
        });
    };

    return (
        <Document>
            <Page size="A4" style={pageStyle}>
                {/* Render Lines */}
                {cfg.lines && cfg.lines.length > 0 && (
                    <Svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        {cfg.lines.map((line, idx) => (
                            <Line
                                key={idx}
                                x1={parsePdfUnit(line.x1)}
                                y1={parsePdfUnit(line.y1)}
                                x2={parsePdfUnit(line.x2)}
                                y2={parsePdfUnit(line.y2)}
                                stroke={line.color || "#000"}
                                strokeWidth={parsePdfUnit(line.thickness || 1)}
                            />
                        ))}
                    </Svg>
                )}
                {renderSections()}
            </Page>
        </Document>
    );
};

export default CoustomTemplate;

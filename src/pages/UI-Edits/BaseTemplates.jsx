

import React from "react";
import { Phone, Mail, Linkedin, Github, MapPin, Globe } from "lucide-react";

const contactIconMap = {
    phone: Phone,
    email: Mail,
    linkedin: Linkedin,
    github: Github,
    location: MapPin,
    website: Globe
};



const applyStyles = (baseStyle, configStyle) => {
    if (!configStyle) return baseStyle;

    const validStyles = {};
    const validCSSProps = new Set([
        'alignContent', 'alignItems', 'alignSelf', 'animation', 'animationDelay',
        'animationDirection', 'animationDuration', 'animationFillMode',
        'animationIterationCount', 'animationName', 'animationPlayState',
        'animationTimingFunction', 'backfaceVisibility', 'background',
        'backgroundAttachment', 'backgroundBlendMode', 'backgroundClip',
        'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition',
        'backgroundRepeat', 'backgroundSize', 'border', 'borderBottom',
        'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius',
        'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderColor',
        'borderImage', 'borderImageOutset', 'borderImageRepeat', 'borderImageSlice',
        'borderImageSource', 'borderImageWidth', 'borderLeft', 'borderLeftColor',
        'borderLeftStyle', 'borderLeftWidth', 'borderRadius', 'borderRight',
        'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderSpacing',
        'borderStyle', 'borderTop', 'borderTopColor', 'borderTopLeftRadius',
        'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth', 'borderWidth',
        'bottom', 'boxDecorationBreak', 'boxShadow', 'boxSizing', 'breakAfter',
        'breakBefore', 'breakInside', 'captionSide', 'caretColor', 'clear', 'clip',
        'clipPath', 'color', 'columnCount', 'columnFill', 'columnGap', 'columnRule',
        'columnRuleColor', 'columnRuleStyle', 'columnRuleWidth', 'columnSpan',
        'columnWidth', 'columns', 'content', 'counterIncrement', 'counterReset',
        'cursor', 'direction', 'display', 'emptyCells', 'filter', 'flex',
        'flexBasis', 'flexDirection', 'flexFlow', 'flexGrow', 'flexShrink',
        'flexWrap', 'float', 'font', 'fontFamily', 'fontFeatureSettings',
        'fontKerning', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle',
        'fontSynthesis', 'fontVariant', 'fontVariantCaps', 'fontVariantLigatures',
        'fontVariantNumeric', 'fontVariantPosition', 'fontWeight', 'gap', 'grid',
        'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridColumn',
        'gridColumnEnd', 'gridColumnGap', 'gridColumnStart', 'gridGap', 'gridRow',
        'gridRowEnd', 'gridRowGap', 'gridRowStart', 'gridTemplate', 'gridTemplateAreas',
        'gridTemplateColumns', 'gridTemplateRows', 'height', 'hyphens', 'imageRendering',
        'isolation', 'justifyContent', 'justifyItems', 'justifySelf', 'left',
        'letterSpacing', 'lineBreak', 'lineHeight', 'listStyle', 'listStyleImage',
        'listStylePosition', 'listStyleType', 'margin', 'marginBottom', 'marginLeft',
        'marginRight', 'marginTop', 'mask', 'maskClip', 'maskComposite', 'maskImage',
        'maskMode', 'maskOrigin', 'maskPosition', 'maskRepeat', 'maskSize', 'maskType',
        'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'mixBlendMode', 'objectFit',
        'objectPosition', 'opacity', 'order', 'orphans', 'outline', 'outlineColor',
        'outlineOffset', 'outlineStyle', 'outlineWidth', 'overflow', 'overflowWrap',
        'overflowX', 'overflowY', 'padding', 'paddingBottom', 'paddingLeft',
        'paddingRight', 'paddingTop', 'pageBreakAfter', 'pageBreakBefore',
        'pageBreakInside', 'perspective', 'perspectiveOrigin', 'placeContent',
        'placeItems', 'placeSelf', 'pointerEvents', 'position', 'quotes', 'resize',
        'right', 'rowGap', 'scrollBehavior', 'tabSize', 'tableLayout', 'textAlign',
        'textAlignLast', 'textCombineUpright', 'textDecoration', 'textDecorationColor',
        'textDecorationLine', 'textDecorationStyle', 'textIndent', 'textJustify',
        'textOrientation', 'textOverflow', 'textShadow', 'textTransform',
        'textUnderlinePosition', 'top', 'transform', 'transformOrigin', 'transformStyle',
        'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty',
        'transitionTimingFunction', 'unicodeBidi', 'userSelect', 'verticalAlign',
        'visibility', 'whiteSpace', 'widows', 'width', 'willChange', 'wordBreak',
        'wordSpacing', 'wordWrap', 'writingMode', 'zIndex'
    ]);

    // Merge base and config first
    const merged = { ...baseStyle, ...configStyle };

    // Property conflict resolution: longhand properties take precedence over shorthand
    const shorthandMap = {
        'margin': ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
        'padding': ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        'border': ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'],
        'borderWidth': ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
        'borderStyle': ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'],
        'borderColor': ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
    };

    // If any longhand property exists, remove the shorthand
    Object.keys(shorthandMap).forEach(shorthand => {
        const longhands = shorthandMap[shorthand];
        const hasLonghand = longhands.some(prop => merged[prop] !== undefined);
        if (hasLonghand && merged[shorthand] !== undefined) {
            delete merged[shorthand];
        }
    });

    // Filter to only valid CSS properties
    Object.keys(merged).forEach(key => {
        const value = merged[key];
        if (validCSSProps.has(key) && (typeof value === 'string' || typeof value === 'number')) {
            validStyles[key] = value;
        }
    });

    return validStyles;
};

/**
 * Enhanced Flexible Container
 */
const FlexibleContainer = ({ children, config = {} }) => {
    const finalStyles = applyStyles({
        width: "fit-content",
        maxWidth: "100%",
        padding: "10px",
        margin: "0",
        backgroundColor: "transparent",  // Changed from #FFFFFF to transparent
        fontFamily: "Helvetica",
        color: "#000000",
        boxSizing: "border-box",
        overflow: "hidden",
    }, config);

    return (
        <div style={finalStyles}>
            {children}
        </div>
    );
};

/**
 * Enhanced Flexible Text - Any text element
 */
const FlexibleText = ({ children, config = {}, as = "div" }) => {
    const Element = as; // Can be div, span, p, h1, etc.
    const { href, target, rel, ...styleProps } = config;

    return (
        <Element
            href={href}
            target={target}
            rel={rel}
            style={applyStyles({
                fontSize: "10px",
                fontWeight: "normal",
                fontStyle: "normal",
                color: "#000000",
                lineHeight: "1.4",
                textAlign: "left",
                margin: "0",
                padding: "0",
            }, styleProps)}
        >
            {children}
        </Element>
    );
};

/**
 * Flexible Section Header
 */
const FlexibleSectionHeader = ({ title, config }) => {
    return (
        <div style={applyStyles({
            fontSize: "14px",
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "8px",
            marginTop: "0",
            paddingBottom: "3px",
            paddingTop: "0",
            borderBottom: "none",
            borderTop: "none",
            textTransform: "none",
            letterSpacing: "0",
            textAlign: "left",
            display: "block",
            background: "transparent",
        }, config)}>
            {config.icon && <span style={{ marginRight: "8px" }}>{config.icon}</span>}
            {title}
        </div>
    );
};

/**
 * Enhanced Flexible Layout
 */
const FlexibleLayout = ({ children, config = {} }) => {
    const isGrid = config.display === "grid";

    return (
        <div style={applyStyles({
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "stretch",
            flexWrap: "nowrap",
            gap: "0",
        }, {
            ...config,
            gridTemplateColumns: isGrid ? config.gridTemplateColumns : undefined,
            gridTemplateRows: isGrid ? config.gridTemplateRows : undefined,
        })}>
            {children}
        </div>
    );
};

// ========== ENHANCED BULLET LIST ==========

const FlexibleBulletList = ({ items = [], styleConfig = {} }) => {
    const config = styleConfig;

    return (
        <div
            style={applyStyles({
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                width: "100%",
            }, config.containerStyle)}
        >
            {items.filter(item => item?.trim()).map((item, index) => (
                <div
                    key={index}
                    style={applyStyles({
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        width: "100%",
                    }, config.itemStyle)}
                >
                    {/* Bullet */}
                    <div
                        style={applyStyles({
                            marginTop: "2px",
                            width: "10px",
                            minWidth: "10px",
                            fontSize: config.bulletSize || "12px",
                            color: config.bulletColor || config.textColor || "#000000",
                            lineHeight: config.lineHeight || "1.4",
                            userSelect: "none",
                        }, config.bulletStyle)}
                    >
                        {config.bulletChar || config.bulletStyle?.bulletChar || "•"}
                    </div>

                    {/* Text */}
                    <div
                        style={applyStyles({
                            flex: 1,
                            minWidth: 0,
                            fontSize: config.textSize || "10px",
                            color: config.textColor || "#000000",
                            lineHeight: config.lineHeight || "1.4",
                            whiteSpace: "normal",
                            wordBreak: "normal",
                            overflowWrap: "anywhere",
                        }, config.textStyle)}
                    >
                        {item}
                    </div>
                </div>
            ))}
        </div>
    );
};


export const FlexibleHeaderSection = ({ resumeDetails, styleConfig }) => {
    const config = styleConfig.header;

    // Helper function to render sections based on order
    const renderSection = (sectionType) => {


        switch (sectionType) {
            case 'nameRow':
                return (
                    <FlexibleLayout
                        key="nameRow"
                        config={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            width: "100%",
                            marginBottom: config.nameRowMarginBottom || "10px",
                            ...config.nameRowZone
                        }}
                    >
                        <FlexibleText config={config.nameStyle || { fontSize: "24px", fontWeight: "bold" }}>
                            {resumeDetails.name || "Your Name"}
                        </FlexibleText>
                        <FlexibleText config={config.titleStyle || { fontSize: "14px" }}>
                            {resumeDetails.title || "Your Title"}
                        </FlexibleText>
                    </FlexibleLayout>
                );

            case 'name':
                return (
                    <FlexibleLayout
                        key="name"
                        config={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: config.nameAlign || "flex-start",
                            justifyContent: config.nameJustify || "flex-start",
                            marginBottom: config.nameMarginBottom || "0px",
                            marginTop: config.nameMarginTop || "0px",
                            marginLeft: config.nameMarginLeft || "0px",
                            marginRight: config.nameMarginRight || "0px",
                            padding: config.namePadding || "0px",
                            width: config.nameWidth || "auto",
                            flex: config.nameFlex || "initial",
                            order: config.nameOrder ?? 1,
                            ...config.nameZone,
                        }}
                    >
                        <FlexibleText
                            config={config.nameStyle}
                            as={config.nameElement || "h1"}
                        >
                            {resumeDetails.name || "Your Name"}
                        </FlexibleText>
                    </FlexibleLayout>
                );

            case 'title':
                return config.showTitle ? (
                    <FlexibleLayout
                        key="title"
                        config={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: config.titleAlign || "flex-start",
                            justifyContent: config.titleJustify || "flex-start",
                            marginBottom: config.titleMarginBottom || "0px",
                            marginTop: config.titleMarginTop || "0px",
                            marginLeft: config.titleMarginLeft || "0px",
                            marginRight: config.titleMarginRight || "0px",
                            padding: config.titlePadding || "0px",
                            width: config.titleWidth || "auto",
                            flex: config.titleFlex || "initial",
                            order: config.titleOrder ?? 2,
                            ...config.titleZone,
                        }}
                    >
                        <FlexibleText
                            config={config.titleStyle}
                            as={config.titleElement || "div"}
                        >
                            {resumeDetails.title || "Your Title"}
                        </FlexibleText>
                    </FlexibleLayout>
                ) : null;

            case 'contact':
                return config.showContact ? (
                    <FlexibleLayout
                        key="contact"
                        config={{
                            ...config.contactLayout,
                            order: typeof config.contactOrder === 'number' ? config.contactOrder : 3,
                            ...config.contactZone,
                        }}
                    >
                        {/* Check if we have split groups */}
                        {config.contactLeftGroup && config.contactRightGroup ? (
                            <>
                                {/* Left Group */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                    {config.contactLeftGroup.map((type, idx) => {
                                        const value = resumeDetails.contact?.[type];
                                        if (!value) return null;

                                        return (
                                            <FlexibleLayout
                                                key={idx}
                                                config={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: config.contactItemJustify || "flex-start",
                                                    padding: config.contactItemPadding || "0px",
                                                    margin: config.contactItemMargin || "0px",
                                                    ...config.contactItemContainer,
                                                }}
                                            >
                                                {config.showContactIcons && (
                                                    <div
                                                        style={{
                                                            marginRight: config.contactIconMarginRight || "8px",
                                                            marginLeft: config.contactIconMarginLeft || "0px",
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        {(() => {
                                                            const IconComponent = contactIconMap[type] || Globe;
                                                            const rawSize = config.contactIconSize;
                                                            const sizeNum = parseInt(rawSize) || 0;
                                                            const iconSize = (sizeNum > 6) ? rawSize : 14;

                                                            return (
                                                                <IconComponent
                                                                    size={iconSize}
                                                                    color={config.contactIconColor || "#000000"}
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                )}

                                                <FlexibleText config={config.contactItemStyle}>
                                                    {value}
                                                </FlexibleText>
                                            </FlexibleLayout>
                                        );
                                    })}
                                </div>

                                {/* Right Group */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                    {config.contactRightGroup.map((type, idx) => {
                                        const value = resumeDetails.contact?.[type];
                                        if (!value) return null;

                                        return (
                                            <FlexibleLayout
                                                key={idx}
                                                config={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: config.contactItemJustify || "flex-start",
                                                    padding: config.contactItemPadding || "0px",
                                                    margin: config.contactItemMargin || "0px",
                                                    ...config.contactItemContainer,
                                                }}
                                            >
                                                {config.showContactIcons && (
                                                    <div
                                                        style={{
                                                            marginRight: config.contactIconMarginRight || "8px",
                                                            marginLeft: config.contactIconMarginLeft || "0px",
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        {(() => {
                                                            const IconComponent = contactIconMap[type] || Globe;
                                                            const rawSize = config.contactIconSize;
                                                            const sizeNum = parseInt(rawSize) || 0;
                                                            const iconSize = (sizeNum > 6) ? rawSize : 14;

                                                            return (
                                                                <IconComponent
                                                                    size={iconSize}
                                                                    color={config.contactIconColor || "#000000"}
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                )}

                                                <FlexibleText config={config.contactItemStyle}>
                                                    {value}
                                                </FlexibleText>
                                            </FlexibleLayout>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* Original single-group layout */
                            (config.contactItems || config.contactOrder)?.map((type, idx) => {
                                const value = resumeDetails.contact?.[type];
                                if (!value) return null;

                                return (
                                    <FlexibleLayout
                                        key={idx}
                                        config={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: config.contactItemJustify || "flex-start",
                                            padding: config.contactItemPadding || "0px",
                                            margin: config.contactItemMargin || "0px",
                                            ...config.contactItemContainer,
                                        }}
                                    >
                                        {config.showContactIcons && (
                                            <div
                                                style={{
                                                    marginRight: config.contactIconMarginRight || "8px",
                                                    marginLeft: config.contactIconMarginLeft || "0px",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                {(() => {
                                                    const IconComponent = contactIconMap[type] || Globe;
                                                    const rawSize = config.contactIconSize;
                                                    const sizeNum = parseInt(rawSize) || 0;
                                                    const iconSize = (sizeNum > 6) ? rawSize : 14;

                                                    return (
                                                        <IconComponent
                                                            size={iconSize}
                                                            color={config.contactIconColor || "#000000"}
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        <FlexibleText config={config.contactItemStyle}>
                                            {value}
                                        </FlexibleText>
                                    </FlexibleLayout>
                                );
                            })
                        )}
                    </FlexibleLayout>
                ) : null;

            default:
                return null;
        }
    };

    return (
        <FlexibleContainer config={config.container}>
            <FlexibleLayout
                config={{
                    display: config.layoutDisplay || "flex",
                    flexDirection: config.layoutDirection || "column",
                    alignItems: config.layoutAlign || "stretch",
                    justifyContent: config.layoutJustify || "flex-start",
                    gap: config.layoutGap || "0px",
                    rowGap: config.layoutRowGap,
                    columnGap: config.layoutColumnGap,
                    padding: config.layoutPadding || "0px",
                    ...config.layout,
                }}
            >
                {(config.sectionOrder || ['name', 'title', 'contact']).map(renderSection)}
            </FlexibleLayout>
        </FlexibleContainer>
    );
};

/**
 * SUMMARY SECTION - Enhanced
 */
export const FlexibleSummarySection = ({ summary, styleConfig }) => {
    const config = styleConfig.summary;

    return (
        <FlexibleContainer config={config.container}>
            {config.showTitle && (
                <FlexibleSectionHeader
                    title={config.titleText || "SUMMARY"}
                    config={config.titleStyle}
                />
            )}

            {Array.isArray(summary) ? (
                config.displayType === "bullets" ? (
                    <FlexibleBulletList items={summary} styleConfig={config.bulletConfig} />
                ) : (
                    summary.map((para, idx) => (
                        <FlexibleText key={idx} config={config.bodyStyle || config.valueStyle}>
                            {para}
                        </FlexibleText>
                    ))
                )
            ) : (
                <FlexibleText config={config.bodyStyle || config.valueStyle}>
                    {summary}
                </FlexibleText>
            )}
        </FlexibleContainer>
    );
};

/**
 * SKILLS SECTION - Enhanced with multiple display modes
 */
export const FlexibleSkillsSection = ({ skills, styleConfig }) => {
    const config = styleConfig.skills;

    // Parse skills based on display mode
    const groupedSkills = {};
    const flatSkills = [];

    if (skills && Array.isArray(skills)) {
        skills.forEach(skill => {
            const separator = config.categorySeparator || " - ";
            if (skill && skill.includes(separator)) {
                const [cat, val] = skill.split(separator);
                groupedSkills[cat.trim()] = val.trim();
            } else if (skill?.trim()) {
                flatSkills.push(skill.trim());
            }
        });
    }

    return (
        <FlexibleContainer config={config.container}>
            {config.showTitle && (
                <FlexibleSectionHeader
                    title={config.titleText || "SKILLS"}
                    config={config.titleStyle}
                />
            )}

            <FlexibleLayout config={config.contentLayout}>
                {/* Display Mode: Categories (DEFAULT) */}
                {(!config.displayMode || config.displayMode === "categories" || config.displayMode === "text") &&
                    Object.entries(groupedSkills).map(([category, value], idx) => (
                        <div key={idx} style={applyStyles({ display: "flex", flexDirection: "column", marginBottom: config.itemMarginBottom || "8px" }, config.categoryLayout)}>
                            {config.showCategories && (
                                <FlexibleText config={config.categoryStyle}>
                                    {category}
                                    {config.categoryValueSeparator && (
                                        <span style={applyStyles({}, config.separatorStyle || {})}>{config.categoryValueSeparator}</span>
                                    )}
                                </FlexibleText>
                            )}
                            <FlexibleText config={config.valueStyle}>
                                {value}
                            </FlexibleText>
                        </div>
                    ))}

                {/* Display Mode: Tags */}
                {config.displayMode === "tags" && (
                    <FlexibleLayout config={config.tagsContainer || { flexWrap: "wrap", gap: "6px" }}>
                        {[...Object.keys(groupedSkills), ...flatSkills].map((skill, idx) => (
                            <FlexibleText
                                key={idx}
                                config={config.tagStyle || {
                                    padding: "4px 10px",
                                    backgroundColor: "#E74C3C",
                                    color: "#FFFFFF",
                                    borderRadius: "3px",
                                    fontSize: "8px",
                                    fontWeight: "500",
                                }}
                            >
                                {skill}
                            </FlexibleText>
                        ))}
                    </FlexibleLayout>
                )}

                {/* Display Mode: List */}
                {config.displayMode === "list" && (
                    <FlexibleBulletList
                        items={[...Object.entries(groupedSkills).map(([k, v]) => `${k}: ${v}`), ...flatSkills]}
                        styleConfig={config.bulletConfig}
                    />
                )}

                {/* Display Mode: Inline */}
                {config.displayMode === "inline" && (
                    <FlexibleText config={config.inlineStyle || config.valueStyle}>
                        {[...Object.values(groupedSkills), ...flatSkills].join(config.inlineSeparator || ", ")}
                    </FlexibleText>
                )}

                {/* Ungrouped Skills (for backward compatibility) */}
                {flatSkills.length > 0 && (!config.displayMode || config.displayMode === "categories" || config.displayMode === "text") && (
                    <div style={{ marginBottom: config.itemMarginBottom || "8px" }}>
                        {config.showCategories && (
                            <FlexibleText config={config.categoryStyle}>
                                Other
                            </FlexibleText>
                        )}
                        <FlexibleText config={config.valueStyle}>
                            {flatSkills.join(config.separator || ", ")}
                        </FlexibleText>
                    </div>
                )}
            </FlexibleLayout>
        </FlexibleContainer>
    );
};

/**
 * EXPERIENCE SECTION - Enhanced with custom structure support
 */
export const FlexibleExperienceSection = ({ experiences, styleConfig }) => {
    const config = styleConfig.experience;

    return (
        <FlexibleContainer config={config.container}>
            {config.showTitle && (
                <FlexibleSectionHeader
                    title={config.titleText || "EXPERIENCE"}
                    config={config.titleStyle}
                />
            )}

            {experiences.map((exp, idx) => (
                <FlexibleContainer
                    key={idx}
                    config={{ marginBottom: config.itemMarginBottom || "12px", ...config.itemContainer, ...config.itemStyle }}
                >
                    {/* Custom Header Structure (NEW FEATURE) */}
                    {config.headerStructure ? (
                        config.headerStructure.map((structure, structIdx) => (
                            <FlexibleLayout key={structIdx} config={structure.layout}>
                                {structure.fields?.map((fieldName, fieldIdx) => {
                                    const value = exp[fieldName];
                                    if (!value && !structure.showEmpty) return null;

                                    const fieldStyle = structure.styles?.[fieldName] || {};
                                    const prefix = structure.prefix?.[fieldName] || "";
                                    const suffix = structure.suffix?.[fieldName] || "";

                                    return (
                                        <FlexibleText key={fieldIdx} config={fieldStyle}>
                                            {prefix}{value}{suffix}
                                        </FlexibleText>
                                    );
                                })}
                            </FlexibleLayout>
                        ))
                    ) : (
                        // Fallback to original layout (BACKWARD COMPATIBLE)
                        <>
                            <FlexibleLayout config={config.headerLayout}>
                                {config.positionFirst ? (
                                    <>
                                        <FlexibleText config={config.positionStyle}>
                                            {exp.position}
                                        </FlexibleText>
                                        <FlexibleText config={config.durationStyle}>
                                            {exp.duration}
                                        </FlexibleText>
                                    </>
                                ) : (
                                    <>
                                        <FlexibleText config={config.companyStyle}>
                                            {exp.company}
                                        </FlexibleText>
                                        <FlexibleText config={config.durationStyle}>
                                            {exp.duration}
                                        </FlexibleText>
                                    </>
                                )}
                            </FlexibleLayout>

                            <FlexibleLayout config={config.subHeaderLayout}>
                                <FlexibleText config={config.companyStyle}>
                                    {config.positionFirst ? exp.company : exp.position}
                                    {exp.location && config.showLocation ? `, ${exp.location}` : ""}
                                </FlexibleText>
                            </FlexibleLayout>
                        </>
                    )}

                    {/* Achievements */}
                    {config.showAchievements && exp.achievements && (
                        <FlexibleBulletList items={exp.achievements} styleConfig={config.bulletConfig} />
                    )}
                </FlexibleContainer>
            ))}
        </FlexibleContainer>
    );
};

/**
 * PROJECTS SECTION - Enhanced
 */
export const FlexibleProjectsSection = ({ projects, styleConfig }) => {
    const config = styleConfig.projects;

    return (
        <FlexibleContainer config={config.container}>
            {config.showTitle && (
                <FlexibleSectionHeader
                    title={config.titleText || "PROJECTS"}
                    config={config.titleStyle}
                />
            )}

            {projects.map((proj, idx) => (
                <FlexibleContainer
                    key={idx}
                    config={{ marginBottom: config.itemMarginBottom || "12px", ...config.itemStyle }}
                >
                    {/* Project Header */}
                    <FlexibleLayout config={config.headerLayout}>
                        <FlexibleText config={config.nameStyle}>
                            {proj.name}
                        </FlexibleText>
                        {proj.duration && config.showDuration && (
                            <FlexibleText config={config.durationStyle}>
                                {proj.duration}
                            </FlexibleText>
                        )}
                    </FlexibleLayout>

                    {/* Technologies */}
                    {proj.technologies && config.showTechnologies && (
                        <FlexibleText config={config.techStyle}>
                            {config.techPrefix || ""}{proj.technologies}
                        </FlexibleText>
                    )}

                    {/* Link */}
                    {proj.link && config.showLink && (
                        <FlexibleText
                            as="a"
                            config={{ ...config.linkStyle, href: proj.link, target: "_blank" }}
                        >
                            {proj.link}
                        </FlexibleText>
                    )}

                    {/* Description */}
                    {config.showDescription && proj.description && (
                        Array.isArray(proj.description) ? (
                            <FlexibleBulletList items={proj.description} styleConfig={config.bulletConfig} />
                        ) : (
                            <FlexibleText config={config.descriptionStyle || config.bodyStyle}>
                                {proj.description}
                            </FlexibleText>
                        )
                    )}
                </FlexibleContainer>
            ))}
        </FlexibleContainer>
    );
};

/**
 * EDUCATION SECTION - Enhanced with field order control
 */
export const FlexibleEducationSection = ({ educationList, styleConfig }) => {
    const config = styleConfig.education;

    return (
        <FlexibleContainer config={config.container}>
            {config.showTitle && (
                <FlexibleSectionHeader
                    title={config.titleText || "EDUCATION"}
                    config={config.titleStyle}
                />
            )}

            {educationList && Array.isArray(educationList) && educationList.map((edu, idx) => (
                <FlexibleContainer
                    key={idx}
                    config={{ marginBottom: config.itemMarginBottom || "10px", ...config.itemStyle }}
                >
                    {/* Custom Field Order (NEW FEATURE) */}
                    {config.fieldOrder ? (
                        config.fieldOrder.map((field, fieldIdx) => {
                            const value = edu[field];
                            if (!value && !config.showEmptyFields) return null;

                            const fieldConfig = config.fieldStyles?.[field] || {};
                            const prefix = config.fieldPrefixes?.[field] || "";

                            return (
                                <FlexibleText key={fieldIdx} config={fieldConfig}>
                                    {prefix}{value}
                                </FlexibleText>
                            );
                        })
                    ) : (
                        // Fallback to original layout (BACKWARD COMPATIBLE)
                        <>
                            <FlexibleText config={config.degreeStyle}>
                                {edu.degree}
                            </FlexibleText>

                            {edu.institution && config.showInstitution && (
                                <FlexibleText config={config.institutionStyle}>
                                    {edu.institution}
                                </FlexibleText>
                            )}

                            <FlexibleLayout config={config.detailsLayout}>
                                {edu.year && (
                                    <FlexibleText config={config.detailsStyle}>
                                        {edu.year}
                                    </FlexibleText>
                                )}
                                {edu.gpa && config.showGpa && (
                                    <FlexibleText config={config.detailsStyle}>
                                        {/* Smart prefix: Don't show "GPA: " if value is a percentage or already has a label */}
                                        {(edu.gpa.includes('%') || edu.gpa.toUpperCase().includes('CGPA') || edu.gpa.toUpperCase().includes('GPA'))
                                            ? ""
                                            : (config.gpaPrefix || "GPA: ")
                                        }{edu.gpa}
                                    </FlexibleText>
                                )}
                                {edu.location && config.showLocation && (
                                    <FlexibleText config={config.detailsStyle}>
                                        {edu.location}
                                    </FlexibleText>
                                )}
                            </FlexibleLayout>
                        </>
                    )}
                </FlexibleContainer>
            ))}
        </FlexibleContainer>
    );
};

/**
 * CERTIFICATIONS SECTION - Enhanced with display types
 */
export const FlexibleCertificationsSection = ({ certifications, styleConfig }) => {
    const config = styleConfig.certifications;

    return (
        <FlexibleContainer config={config.container}>
            {config.showTitle && (
                <FlexibleSectionHeader
                    title={config.titleText || "CERTIFICATIONS"}
                    config={config.titleStyle}
                />
            )}

            {config.displayType === "list" ? (
                <FlexibleBulletList items={certifications} styleConfig={config.bulletConfig} />
            ) : config.displayType === "grid" ? (
                <FlexibleLayout config={config.gridLayout || { flexWrap: "wrap", gap: "8px" }}>
                    {certifications.filter(cert => cert?.trim()).map((cert, idx) => (
                        <FlexibleText key={idx} config={config.itemStyle}>
                            {cert}
                        </FlexibleText>
                    ))}
                </FlexibleLayout>
            ) : (
                certifications.filter(cert => cert?.trim()).map((cert, idx) => (
                    <FlexibleText key={idx} config={config.itemStyle}>
                        {cert}
                    </FlexibleText>
                ))
            )}
        </FlexibleContainer>
    );
};




/**
 * CONTACT SECTION - Fully Flexible
 */
export const FlexibleContactSection = ({ resumeDetails, styleConfig }) => {
    const config = styleConfig.contact;

    if (!config) return null;

    return (
        <FlexibleContainer config={config.container}>
            {config.showTitle && (
                <FlexibleSectionHeader title="CONTACT" config={config.titleStyle} />
            )}

            <FlexibleLayout config={config.contactLayout}>
                {(config.contactOrder || []).map((contactType, idx) => {
                    const value = resumeDetails.contact?.[contactType];
                    if (!value) return null;

                    return (
                        <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: config.itemMarginBottom || '0'
                        }}>
                            {config.showContactIcons && contactIconMap[contactType] && (
                                <span style={{
                                    marginRight: "6px",
                                    color: config.contactItemStyle?.color || "#000",
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    {React.createElement(contactIconMap[contactType], { size: 12 })}
                                </span>
                            )}
                            <FlexibleText config={config.contactItemStyle}>
                                {value}
                            </FlexibleText>
                        </div>
                    );
                })}
            </FlexibleLayout>
        </FlexibleContainer>
    );
};

/**
 * CUSTOM SECTION - Flexible template for dynamic sections
 */
export const FlexibleCustomSection = ({ customSections, styleConfig }) => {
    // Use custom config if available, otherwise fallback to experience styles for consistency
    const config = styleConfig?.custom || styleConfig?.experience || {};

    if (!customSections || customSections.length === 0) return null;

    return (
        <>
            {customSections.map((section, idx) => (
                <FlexibleContainer key={section.id || idx} config={config.container}>
                    {section.title && (
                        <FlexibleSectionHeader
                            title={section.title}
                            config={config.titleStyle}
                        />
                    )}

                    {section.items && (
                        <FlexibleBulletList
                            items={section.items}
                            styleConfig={config.bulletConfig || {
                                // Fallback bullet config constructed from general config if specific bulletConfig missing
                                containerStyle: config.listContainer,
                                itemStyle: config.listItem,
                                bulletStyle: config.bulletStyle,
                                textStyle: config.itemStyle || config.valueStyle
                            }}
                        />
                    )}
                </FlexibleContainer>
            ))}
        </>
    );
};
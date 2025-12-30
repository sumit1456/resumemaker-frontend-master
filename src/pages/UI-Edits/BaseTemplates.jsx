

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
const FlexibleContainer = ({ children, config = {}, styleConfig = {} }) => {
    const finalStyles = applyStyles({
        width: "fit-content",
        maxWidth: "100%",
        padding: "10px",
        margin: "0",
        backgroundColor: "transparent",
        fontFamily: styleConfig.globalFontFamily || "inherit",
        color: styleConfig.globalTextColor || "#000000",
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
const FlexibleText = ({ children, config = {}, styleConfig = {}, as = "div" }) => {
    const Element = as; // Can be div, span, p, h1, etc.
    const { href, target, rel, ...styleProps } = config;

    // Simplified color resolution: Prioritize local config, then global primary/text fallbacks
    let resolvedColor = styleProps.color;
    if (!resolvedColor) {
        if (styleProps.isPrimary && styleConfig.globalPrimaryColor) {
            resolvedColor = styleConfig.globalPrimaryColor;
        } else {
            resolvedColor = styleConfig.globalTextColor || "#000000";
        }
    }

    return (
        <Element
            href={href}
            target={target}
            rel={rel}
            style={applyStyles({
                fontSize: "10px",
                fontWeight: "normal",
                fontStyle: "normal",
                color: resolvedColor,
                lineHeight: "1.4",
                textAlign: "left",
                margin: "0",
                padding: "0",
                fontFamily: styleConfig.globalFontFamily || "inherit",
            }, styleProps)}
        >
            {children}
        </Element>
    );
};

/**
 * Flexible Section Header
 */
const FlexibleSectionHeader = ({ title, config, styleConfig = {} }) => {
    // Determine header color: Prioritize config, then global primary color
    let headerColor = config.color;
    if (!headerColor && styleConfig.globalPrimaryColor) {
        headerColor = styleConfig.globalPrimaryColor;
    }

    return (
        <FlexibleText
            config={{
                fontSize: "14px",
                fontWeight: "bold",
                isTitle: true, // 🚀 Mark as title for color resolution
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
                ...config,
                color: config.color || undefined, // Allow FlexibleText to resolve from styleConfig
            }}
            styleConfig={styleConfig}
        >
            {config.icon && <span style={{ marginRight: "8px" }}>{config.icon}</span>}
            {title}
        </FlexibleText>
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

const FlexibleBulletList = ({ items = [], styleConfig = {}, globalStyleConfig = {} }) => {
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
                            marginTop: `${(parseFloat(globalStyleConfig.globalBulletTop) || 0) + (parseFloat(config.bulletStyle?.marginTop) || 2)}px`,
                            width: "10px",
                            minWidth: "10px",
                            fontSize: config.bulletSize || "12px",
                            color: globalStyleConfig.globalBulletColor || globalStyleConfig.globalPrimaryColor || config.bulletColor || config.textColor || "#000000",
                            lineHeight: config.lineHeight || "1.4",
                            userSelect: "none",
                            fontFamily: globalStyleConfig.globalFontFamily || "inherit"
                        }, config.bulletStyle)}
                    >
                        {config.bulletChar || config.bulletStyle?.bulletChar || "•"}
                    </div>

                    {/* Text */}
                    <FlexibleText
                        styleConfig={globalStyleConfig}
                        config={{
                            flex: 1,
                            minWidth: 0,
                            fontSize: config.textSize || "10px",
                            color: config.textColor || "#000000",
                            lineHeight: config.lineHeight || "1.4",
                            whiteSpace: "normal",
                            wordBreak: "normal",
                            overflowWrap: "anywhere",
                            ...config.textStyle
                        }}
                    >
                        {item}
                    </FlexibleText>
                </div>
            ))}
        </div>
    );
};


export const FlexibleHeaderSection = ({ resumeDetails, styleConfig = {} }) => {
    const sectionConfig = styleConfig.header || {};

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
                            marginBottom: sectionConfig.nameRowMarginBottom || "10px",
                            ...sectionConfig.nameRowZone
                        }}
                    >
                        <FlexibleText config={{ ...(sectionConfig.nameStyle || { fontSize: "24px", fontWeight: "bold" }), isTitle: true }} styleConfig={styleConfig}>
                            {resumeDetails.name || "Your Name"}
                        </FlexibleText>
                        <FlexibleText config={{ ...(sectionConfig.titleStyle || { fontSize: "14px" }), variant: "subtitle" }} styleConfig={styleConfig}>
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
                            alignItems: sectionConfig.nameAlign || "flex-start",
                            justifyContent: sectionConfig.nameJustify || "flex-start",
                            marginBottom: sectionConfig.nameMarginBottom || "0px",
                            marginTop: sectionConfig.nameMarginTop || "0px",
                            marginLeft: sectionConfig.nameMarginLeft || "0px",
                            marginRight: sectionConfig.nameMarginRight || "0px",
                            padding: sectionConfig.namePadding || "0px",
                            width: sectionConfig.nameWidth || "auto",
                            flex: sectionConfig.nameFlex || "initial",
                            order: sectionConfig.nameOrder ?? 1,
                            ...sectionConfig.nameZone,
                        }}
                    >
                        <FlexibleText
                            config={sectionConfig.nameStyle}
                            styleConfig={styleConfig}
                            as={sectionConfig.nameElement || "h1"}
                        >
                            {resumeDetails.name || "Your Name"}
                        </FlexibleText>
                    </FlexibleLayout>
                );

            case 'title':
                return sectionConfig.showTitle ? (
                    <FlexibleLayout
                        key="title"
                        config={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: sectionConfig.titleAlign || "flex-start",
                            justifyContent: sectionConfig.titleJustify || "flex-start",
                            marginBottom: sectionConfig.titleMarginBottom || "0px",
                            marginTop: sectionConfig.titleMarginTop || "0px",
                            marginLeft: sectionConfig.titleMarginLeft || "0px",
                            marginRight: sectionConfig.titleMarginRight || "0px",
                            padding: sectionConfig.titlePadding || "0px",
                            width: sectionConfig.titleWidth || "auto",
                            flex: sectionConfig.titleFlex || "initial",
                            order: sectionConfig.titleOrder ?? 2,
                            ...sectionConfig.titleZone,
                        }}
                    >
                        <FlexibleText
                            config={{ ...sectionConfig.titleStyle, variant: "subtitle" }}
                            styleConfig={styleConfig}
                            as={sectionConfig.titleElement || "div"}
                        >
                            {resumeDetails.title || "Your Title"}
                        </FlexibleText>
                    </FlexibleLayout>
                ) : null;

            case 'contact':
                return sectionConfig.showContact ? (
                    <FlexibleLayout
                        key="contact"
                        config={{
                            ...sectionConfig.contactLayout,
                            order: typeof sectionConfig.contactOrder === 'number' ? sectionConfig.contactOrder : 3,
                            ...sectionConfig.contactZone,
                        }}
                    >
                        {/* Check if we have split groups */}
                        {sectionConfig.contactLeftGroup && sectionConfig.contactRightGroup ? (
                            <>
                                {/* Left Group */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                    {sectionConfig.contactLeftGroup.map((type, idx) => {
                                        const value = resumeDetails.contact?.[type];
                                        if (!value) return null;

                                        return (
                                            <FlexibleLayout
                                                key={idx}
                                                config={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: sectionConfig.contactItemJustify || "flex-start",
                                                    padding: sectionConfig.contactItemPadding || "0px",
                                                    margin: sectionConfig.contactItemMargin || "0px",
                                                    ...sectionConfig.contactItemContainer,
                                                }}
                                            >
                                                {sectionConfig.showContactIcons && (
                                                    <div
                                                        style={{
                                                            marginRight: sectionConfig.contactIconMarginRight || "8px",
                                                            marginLeft: sectionConfig.contactIconMarginLeft || "0px",
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        {(() => {
                                                            const IconComponent = contactIconMap[type] || Globe;
                                                            const rawSize = sectionConfig.contactIconSize;
                                                            const sizeNum = parseInt(rawSize) || 0;
                                                            const iconSize = (sizeNum > 6) ? rawSize : 14;

                                                            return (
                                                                <IconComponent
                                                                    size={iconSize}
                                                                    color={sectionConfig.contactIconColor || "#000000"}
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                )}

                                                <FlexibleText config={sectionConfig.contactItemStyle} styleConfig={styleConfig}>
                                                    {value}
                                                </FlexibleText>
                                            </FlexibleLayout>
                                        );
                                    })}
                                </div>

                                {/* Right Group */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                    {sectionConfig.contactRightGroup.map((type, idx) => {
                                        const value = resumeDetails.contact?.[type];
                                        if (!value) return null;

                                        return (
                                            <FlexibleLayout
                                                key={idx}
                                                config={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: sectionConfig.contactItemJustify || "flex-start",
                                                    padding: sectionConfig.contactItemPadding || "0px",
                                                    margin: sectionConfig.contactItemMargin || "0px",
                                                    ...sectionConfig.contactItemContainer,
                                                }}
                                            >
                                                {sectionConfig.showContactIcons && (
                                                    <div
                                                        style={{
                                                            marginRight: sectionConfig.contactIconMarginRight || "8px",
                                                            marginLeft: sectionConfig.contactIconMarginLeft || "0px",
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        {(() => {
                                                            const IconComponent = contactIconMap[type] || Globe;
                                                            const rawSize = sectionConfig.contactIconSize;
                                                            const sizeNum = parseInt(rawSize) || 0;
                                                            const iconSize = (sizeNum > 6) ? rawSize : 14;

                                                            return (
                                                                <IconComponent
                                                                    size={iconSize}
                                                                    color={sectionConfig.contactIconColor || "#000000"}
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                )}

                                                <FlexibleText config={sectionConfig.contactItemStyle} styleConfig={styleConfig}>
                                                    {value}
                                                </FlexibleText>
                                            </FlexibleLayout>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* Original single-group layout */
                            (sectionConfig.contactItems || sectionConfig.contactOrder)?.map((type, idx) => {
                                const value = resumeDetails.contact?.[type];
                                if (!value) return null;

                                return (
                                    <FlexibleLayout
                                        key={idx}
                                        config={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: sectionConfig.contactItemJustify || "flex-start",
                                            padding: sectionConfig.contactItemPadding || "0px",
                                            margin: sectionConfig.contactItemMargin || "0px",
                                            ...sectionConfig.contactItemContainer,
                                        }}
                                    >
                                        {sectionConfig.showContactIcons && (
                                            <div
                                                style={{
                                                    marginRight: sectionConfig.contactIconMarginRight || "8px",
                                                    marginLeft: sectionConfig.contactIconMarginLeft || "0px",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                {(() => {
                                                    const IconComponent = contactIconMap[type] || Globe;
                                                    const rawSize = sectionConfig.contactIconSize;
                                                    const sizeNum = parseInt(rawSize) || 0;
                                                    const iconSize = (sizeNum > 6) ? rawSize : 14;

                                                    return (
                                                        <IconComponent
                                                            size={iconSize}
                                                            color={sectionConfig.contactIconColor || "#000000"}
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        <FlexibleText config={sectionConfig.contactItemStyle} styleConfig={styleConfig}>
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
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            <FlexibleLayout
                config={{
                    display: sectionConfig.layoutDisplay || "flex",
                    flexDirection: sectionConfig.layoutDirection || "column",
                    alignItems: sectionConfig.layoutAlign || "stretch",
                    justifyContent: sectionConfig.layoutJustify || "flex-start",
                    gap: sectionConfig.layoutGap || "0px",
                    rowGap: sectionConfig.layoutRowGap,
                    columnGap: sectionConfig.layoutColumnGap,
                    padding: sectionConfig.layoutPadding || "0px",
                    ...sectionConfig.layout,
                }}
            >
                {(sectionConfig.sectionOrder || ['name', 'title', 'contact']).map(renderSection)}
            </FlexibleLayout>
        </FlexibleContainer>
    );
};

/**
 * SUMMARY SECTION - Enhanced
 */
export const FlexibleSummarySection = ({ summary, styleConfig = {} }) => {
    const sectionConfig = styleConfig.summary || {};

    return (
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            {sectionConfig.showTitle && (
                <FlexibleSectionHeader
                    title={sectionConfig.titleText || "SUMMARY"}
                    config={sectionConfig.titleStyle}
                    styleConfig={styleConfig}
                />
            )}

            {Array.isArray(summary) ? (
                sectionConfig.displayType === "bullets" ? (
                    <FlexibleBulletList items={summary} styleConfig={sectionConfig.bulletConfig} globalStyleConfig={styleConfig} />
                ) : (
                    summary.map((para, idx) => (
                        <FlexibleText key={idx} config={sectionConfig.bodyStyle || sectionConfig.valueStyle} styleConfig={styleConfig}>
                            {para}
                        </FlexibleText>
                    ))
                )
            ) : (
                <FlexibleText config={sectionConfig.bodyStyle || sectionConfig.valueStyle} styleConfig={styleConfig}>
                    {summary}
                </FlexibleText>
            )}
        </FlexibleContainer>
    );
};

/**
 * SKILLS SECTION - Enhanced with multiple display modes
 */
export const FlexibleSkillsSection = ({ skills, styleConfig = {} }) => {
    const sectionConfig = styleConfig.skills || {};

    // Parse skills based on display mode
    const groupedSkills = {};
    const flatSkills = [];

    if (skills && Array.isArray(skills)) {
        skills.forEach(skill => {
            const separator = sectionConfig.categorySeparator || " - ";
            if (skill && skill.includes(separator)) {
                const [cat, val] = skill.split(separator);
                groupedSkills[cat.trim()] = val.trim();
            } else if (skill?.trim()) {
                flatSkills.push(skill.trim());
            }
        });
    }

    return (
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            {sectionConfig.showTitle && (
                <FlexibleSectionHeader
                    title={sectionConfig.titleText || "SKILLS"}
                    config={sectionConfig.titleStyle}
                    styleConfig={styleConfig}
                />
            )}

            <FlexibleLayout config={sectionConfig.contentLayout}>
                {/* Display Mode: Categories (DEFAULT) */}
                {(!sectionConfig.displayMode || sectionConfig.displayMode === "categories" || sectionConfig.displayMode === "text") &&
                    Object.entries(groupedSkills).map(([category, value], idx) => (
                        <div key={idx} style={applyStyles({ display: "flex", flexDirection: "column", marginBottom: sectionConfig.itemMarginBottom || "8px" }, sectionConfig.categoryLayout)}>
                            {sectionConfig.showCategories && (
                                <FlexibleText config={sectionConfig.categoryStyle} styleConfig={styleConfig}>
                                    {category}
                                    {sectionConfig.categoryValueSeparator && (
                                        <span style={applyStyles({}, sectionConfig.separatorStyle || {})}>{sectionConfig.categoryValueSeparator}</span>
                                    )}
                                </FlexibleText>
                            )}
                            <FlexibleText config={sectionConfig.valueStyle} styleConfig={styleConfig}>
                                {value}
                            </FlexibleText>
                        </div>
                    ))}

                {/* Display Mode: Tags */}
                {sectionConfig.displayMode === "tags" && (
                    <FlexibleLayout config={sectionConfig.tagsContainer || { flexWrap: "wrap", gap: "6px" }}>
                        {[...Object.keys(groupedSkills), ...flatSkills].map((skill, idx) => (
                            <FlexibleText
                                key={idx}
                                styleConfig={styleConfig}
                                config={sectionConfig.tagStyle || {
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
                {sectionConfig.displayMode === "list" && (
                    <FlexibleBulletList
                        items={[...Object.entries(groupedSkills).map(([k, v]) => `${k}: ${v}`), ...flatSkills]}
                        styleConfig={sectionConfig.bulletConfig}
                        globalStyleConfig={styleConfig}
                    />
                )}

                {/* Display Mode: Inline */}
                {sectionConfig.displayMode === "inline" && (
                    <FlexibleText config={sectionConfig.inlineStyle || sectionConfig.valueStyle} styleConfig={styleConfig}>
                        {[...Object.values(groupedSkills), ...flatSkills].join(sectionConfig.inlineSeparator || ", ")}
                    </FlexibleText>
                )}

                {/* Ungrouped Skills (for backward compatibility) */}
                {flatSkills.length > 0 && (!sectionConfig.displayMode || sectionConfig.displayMode === "categories" || sectionConfig.displayMode === "text") && (
                    <div style={{ marginBottom: sectionConfig.itemMarginBottom || "8px" }}>
                        {sectionConfig.showCategories && (
                            <FlexibleText config={sectionConfig.categoryStyle} styleConfig={styleConfig}>
                                Other
                            </FlexibleText>
                        )}
                        <FlexibleText config={sectionConfig.valueStyle} styleConfig={styleConfig}>
                            {flatSkills.join(sectionConfig.separator || ", ")}
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
export const FlexibleExperienceSection = ({ experiences, styleConfig = {} }) => {
    const sectionConfig = styleConfig.experience || {};

    return (
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            {sectionConfig.showTitle && (
                <FlexibleSectionHeader
                    title={sectionConfig.titleText || "EXPERIENCE"}
                    config={sectionConfig.titleStyle}
                    styleConfig={styleConfig}
                />
            )}

            {experiences.map((exp, idx) => (
                <FlexibleContainer
                    key={idx}
                    config={{ marginBottom: sectionConfig.itemMarginBottom || "12px", ...sectionConfig.itemContainer, ...sectionConfig.itemStyle }}
                    styleConfig={styleConfig}
                >
                    {/* Custom Header Structure (NEW FEATURE) */}
                    {sectionConfig.headerStructure ? (
                        sectionConfig.headerStructure.map((structure, structIdx) => (
                            <FlexibleLayout key={structIdx} config={structure.layout}>
                                {structure.fields?.map((fieldName, fieldIdx) => {
                                    const value = exp[fieldName];
                                    if (!value && !structure.showEmpty) return null;

                                    const fieldStyle = { ...structure.styles?.[fieldName], variant: fieldName === 'position' || fieldName === 'company' ? 'subtitle' : undefined };
                                    const prefix = structure.prefix?.[fieldName] || "";
                                    const suffix = structure.suffix?.[fieldName] || "";

                                    return (
                                        <FlexibleText key={fieldIdx} config={fieldStyle} styleConfig={styleConfig}>
                                            {prefix}{value}{suffix}
                                        </FlexibleText>
                                    );
                                })}
                            </FlexibleLayout>
                        ))
                    ) : (
                        // Fallback to original layout (BACKWARD COMPATIBLE)
                        <>
                            <FlexibleLayout config={sectionConfig.headerLayout}>
                                {sectionConfig.positionFirst ? (
                                    <>
                                        <FlexibleText config={{ ...sectionConfig.positionStyle, variant: "subtitle" }} styleConfig={styleConfig}>
                                            {exp.position}
                                        </FlexibleText>
                                        <FlexibleText config={sectionConfig.durationStyle} styleConfig={styleConfig}>
                                            {exp.duration}
                                        </FlexibleText>
                                    </>
                                ) : (
                                    <>
                                        <FlexibleText config={{ ...sectionConfig.companyStyle, variant: "subtitle" }} styleConfig={styleConfig}>
                                            {exp.company}
                                        </FlexibleText>
                                        <FlexibleText config={sectionConfig.durationStyle} styleConfig={styleConfig}>
                                            {exp.duration}
                                        </FlexibleText>
                                    </>
                                )}
                            </FlexibleLayout>

                            <FlexibleLayout config={sectionConfig.subHeaderLayout}>
                                <FlexibleText config={sectionConfig.companyStyle} styleConfig={styleConfig}>
                                    {sectionConfig.positionFirst ? exp.company : exp.position}
                                    {exp.location && sectionConfig.showLocation ? `, ${exp.location}` : ""}
                                </FlexibleText>
                            </FlexibleLayout>
                        </>
                    )}

                    {/* Achievements */}
                    {sectionConfig.showAchievements && exp.achievements && (
                        <FlexibleBulletList items={exp.achievements} styleConfig={sectionConfig.bulletConfig} globalStyleConfig={styleConfig} />
                    )}
                </FlexibleContainer>
            ))}
        </FlexibleContainer>
    );
};

/**
 * PROJECTS SECTION - Enhanced
 */
export const FlexibleProjectsSection = ({ projects, styleConfig = {} }) => {
    const sectionConfig = styleConfig.projects || {};

    return (
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            {sectionConfig.showTitle && (
                <FlexibleSectionHeader
                    title={sectionConfig.titleText || "PROJECTS"}
                    config={sectionConfig.titleStyle}
                    styleConfig={styleConfig}
                />
            )}

            {projects.map((proj, idx) => (
                <FlexibleContainer
                    key={idx}
                    config={{ marginBottom: sectionConfig.itemMarginBottom || "12px", ...sectionConfig.itemStyle }}
                    styleConfig={styleConfig}
                >
                    {/* Project Header */}
                    <FlexibleLayout config={sectionConfig.headerLayout}>
                        <FlexibleText config={{ ...sectionConfig.nameStyle, variant: "subtitle" }} styleConfig={styleConfig}>
                            {proj.name}
                        </FlexibleText>
                        {proj.duration && sectionConfig.showDuration && (
                            <FlexibleText config={sectionConfig.durationStyle} styleConfig={styleConfig}>
                                {proj.duration}
                            </FlexibleText>
                        )}
                    </FlexibleLayout>

                    {/* Technologies */}
                    {proj.technologies && sectionConfig.showTechnologies && (
                        <FlexibleText config={sectionConfig.techStyle} styleConfig={styleConfig}>
                            {sectionConfig.techPrefix || ""}{proj.technologies}
                        </FlexibleText>
                    )}

                    {/* Link */}
                    {proj.link && sectionConfig.showLink && (
                        <FlexibleText
                            as="a"
                            config={{ ...sectionConfig.linkStyle, href: proj.link, target: "_blank" }}
                            styleConfig={styleConfig}
                        >
                            {proj.link}
                        </FlexibleText>
                    )}

                    {/* Description */}
                    {sectionConfig.showDescription && proj.description && (
                        Array.isArray(proj.description) ? (
                            <FlexibleBulletList items={proj.description} styleConfig={sectionConfig.bulletConfig} globalStyleConfig={styleConfig} />
                        ) : (
                            <FlexibleText config={sectionConfig.descriptionStyle || sectionConfig.bodyStyle} styleConfig={styleConfig}>
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
export const FlexibleEducationSection = ({ educationList, styleConfig = {} }) => {
    const sectionConfig = styleConfig.education || {};

    return (
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            {sectionConfig.showTitle && (
                <FlexibleSectionHeader
                    title={sectionConfig.titleText || "EDUCATION"}
                    config={sectionConfig.titleStyle}
                    styleConfig={styleConfig}
                />
            )}

            {educationList && Array.isArray(educationList) && educationList.map((edu, idx) => (
                <FlexibleContainer
                    key={idx}
                    config={{ marginBottom: sectionConfig.itemMarginBottom || "10px", ...sectionConfig.itemStyle }}
                    styleConfig={styleConfig}
                >
                    {/* Custom Field Order (NEW FEATURE) */}
                    {sectionConfig.fieldOrder ? (
                        sectionConfig.fieldOrder.map((field, fieldIdx) => {
                            const value = edu[field];
                            if (!value && !sectionConfig.showEmptyFields) return null;

                            const fieldConfig = { ...sectionConfig.fieldStyles?.[field], variant: field === 'degree' ? 'subtitle' : undefined };
                            const prefix = sectionConfig.fieldPrefixes?.[field] || "";

                            return (
                                <FlexibleText key={fieldIdx} config={fieldConfig} styleConfig={styleConfig}>
                                    {prefix}{value}
                                </FlexibleText>
                            );
                        })
                    ) : (
                        // Fallback to original layout (BACKWARD COMPATIBLE)
                        <>
                            <FlexibleText config={{ ...sectionConfig.degreeStyle, variant: "subtitle" }} styleConfig={styleConfig}>
                                {edu.degree}
                            </FlexibleText>

                            {edu.institution && sectionConfig.showInstitution && (
                                <FlexibleText config={sectionConfig.institutionStyle} styleConfig={styleConfig}>
                                    {edu.institution}
                                </FlexibleText>
                            )}

                            <FlexibleLayout config={sectionConfig.detailsLayout}>
                                {edu.year && (
                                    <FlexibleText config={sectionConfig.detailsStyle} styleConfig={styleConfig}>
                                        {edu.year}
                                    </FlexibleText>
                                )}
                                {edu.gpa && sectionConfig.showGpa && (
                                    <FlexibleText config={sectionConfig.detailsStyle} styleConfig={styleConfig}>
                                        {/* Smart prefix: Don't show "GPA: " if value is a percentage or already has a label */}
                                        {(edu.gpa.includes('%') || edu.gpa.toUpperCase().includes('CGPA') || edu.gpa.toUpperCase().includes('GPA'))
                                            ? ""
                                            : (sectionConfig.gpaPrefix || "GPA: ")
                                        }{edu.gpa}
                                    </FlexibleText>
                                )}
                                {edu.location && sectionConfig.showLocation && (
                                    <FlexibleText config={sectionConfig.detailsStyle} styleConfig={styleConfig}>
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
export const FlexibleCertificationsSection = ({ certifications, styleConfig = {} }) => {
    const sectionConfig = styleConfig.certifications || {};

    return (
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            {sectionConfig.showTitle && (
                <FlexibleSectionHeader
                    title={sectionConfig.titleText || "CERTIFICATIONS"}
                    config={sectionConfig.titleStyle}
                    styleConfig={styleConfig}
                />
            )}

            {sectionConfig.displayType === "list" ? (
                <FlexibleBulletList items={certifications} styleConfig={sectionConfig.bulletConfig} globalStyleConfig={styleConfig} />
            ) : sectionConfig.displayType === "grid" ? (
                <FlexibleLayout config={sectionConfig.gridLayout || { flexWrap: "wrap", gap: "8px" }}>
                    {certifications.filter(cert => cert?.trim()).map((cert, idx) => (
                        <FlexibleText key={idx} config={sectionConfig.itemStyle} styleConfig={styleConfig}>
                            {cert}
                        </FlexibleText>
                    ))}
                </FlexibleLayout>
            ) : (
                certifications.filter(cert => cert?.trim()).map((cert, idx) => (
                    <FlexibleText key={idx} config={sectionConfig.itemStyle} styleConfig={styleConfig}>
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
export const FlexibleContactSection = ({ resumeDetails, styleConfig = {} }) => {
    const sectionConfig = styleConfig.contact || {};

    if (!sectionConfig) return null;

    return (
        <FlexibleContainer config={sectionConfig.container} styleConfig={styleConfig}>
            {sectionConfig.showTitle && (
                <FlexibleSectionHeader title="CONTACT" config={sectionConfig.titleStyle} styleConfig={styleConfig} />
            )}

            <FlexibleLayout config={sectionConfig.contactLayout}>
                {(sectionConfig.contactOrder || []).map((contactType, idx) => {
                    const value = resumeDetails.contact?.[contactType];
                    if (!value) return null;

                    return (
                        <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: sectionConfig.itemMarginBottom || '0'
                        }}>
                            {sectionConfig.showContactIcons && contactIconMap[contactType] && (
                                <span style={{
                                    marginRight: "6px",
                                    color: sectionConfig.contactItemStyle?.color || "#000",
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    {React.createElement(contactIconMap[contactType], { size: 12 })}
                                </span>
                            )}
                            <FlexibleText config={sectionConfig.contactItemStyle} styleConfig={styleConfig}>
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
export const FlexibleCustomSection = ({ customSections, styleConfig = {} }) => {
    // Use custom config if available, otherwise fallback to experience styles for consistency
    const sectionConfig = styleConfig?.custom || styleConfig?.experience || {};

    if (!customSections || customSections.length === 0) return null;

    return (
        <>
            {customSections.map((section, idx) => (
                <FlexibleContainer key={section.id || idx} config={sectionConfig.container} styleConfig={styleConfig}>
                    {section.title && (
                        <FlexibleSectionHeader
                            title={section.title}
                            config={sectionConfig.titleStyle}
                            styleConfig={styleConfig}
                        />
                    )}

                    {section.items && (
                        <FlexibleBulletList
                            items={section.items}
                            globalStyleConfig={styleConfig}
                            styleConfig={sectionConfig.bulletConfig || {
                                // Fallback bullet config constructed from general config if specific bulletConfig missing
                                containerStyle: sectionConfig.listContainer,
                                itemStyle: sectionConfig.listItem,
                                bulletStyle: sectionConfig.bulletStyle,
                                textStyle: sectionConfig.itemStyle || sectionConfig.valueStyle
                            }}
                        />
                    )}
                </FlexibleContainer>
            ))}
        </>
    );
};
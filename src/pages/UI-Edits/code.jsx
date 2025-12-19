import React from 'react';

// Flexible Container Component
const FlexibleContainer = ({ config = {}, children }) => {
  return <div style={config}>{children}</div>;
};

// Flexible Layout Component
const FlexibleLayout = ({ config = {}, children }) => {
  return <div style={config}>{children}</div>;
};

// Flexible Text Component
const FlexibleText = ({ config = {}, as = 'div', children }) => {
  const Component = as;
  return <Component style={config}>{children}</Component>;
};

// Enhanced Header Section Component
export const FlexibleHeaderSection = ({ resumeDetails, styleConfig }) => {
  const config = styleConfig.header;

  // Helper function to render sections based on order
  const renderSection = (sectionType) => {
    switch (sectionType) {
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
              display: config.contactLayoutType === "grid" ? "grid" : "flex",
              flexDirection: config.contactDirection || "row",
              flexWrap: config.contactWrap || "wrap",
              gridTemplateColumns: config.contactGridColumns,
              gridTemplateRows: config.contactGridRows,
              gap: config.contactGap || "16px",
              rowGap: config.contactRowGap,
              columnGap: config.contactColumnGap,
              alignItems: config.contactAlign || "center",
              justifyContent: config.contactJustify || "flex-start",
              marginTop: config.contactMarginTop || "0px",
              marginBottom: config.contactMarginBottom || "0px",
              marginLeft: config.contactMarginLeft || "0px",
              marginRight: config.contactMarginRight || "0px",
              padding: config.contactPadding || "0px",
              width: config.contactWidth || "auto",
              flex: config.contactFlex || "initial",
              order: config.contactOrder ?? 3,
              ...config.contactZone,
            }}
          >
            {config.contactItems?.map((type, idx) => {
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
                        width: config.contactIconSize || "5px",
                        height: config.contactIconSize || "5px",
                        borderRadius: config.contactIconBorderRadius || "50%",
                        backgroundColor: config.contactIconColor || "#E74C3C",
                        marginRight: config.contactIconMarginRight || "8px",
                        marginLeft: config.contactIconMarginLeft || "0px",
                      }}
                    />
                  )}

                  <FlexibleText config={config.contactItemStyle}>
                    {value}
                  </FlexibleText>
                </FlexibleLayout>
              );
            })}
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

// Demo Component
const Demo = () => {
  const [currentLayout, setCurrentLayout] = React.useState('default');

  const resumeDetails = {
    name: "John Doe",
    title: "Senior Software Engineer",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev"
    }
  };

  const layouts = {
    default: {
      header: {
        container: {
          padding: "32px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px"
        },
        layout: {
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        },
        sectionOrder: ['name', 'title', 'contact'],
        
        // Name configuration
        nameAlign: "flex-start",
        nameMarginBottom: "8px",
        nameStyle: {
          fontSize: "32px",
          fontWeight: "700",
          color: "#2c3e50"
        },
        
        // Title configuration
        showTitle: true,
        titleAlign: "flex-start",
        titleMarginBottom: "12px",
        titleStyle: {
          fontSize: "18px",
          fontWeight: "400",
          color: "#7f8c8d"
        },
        
        // Contact configuration
        showContact: true,
        contactDirection: "row",
        contactGap: "20px",
        contactAlign: "center",
        showContactIcons: true,
        contactItems: ['email', 'phone', 'location', 'linkedin'],
        contactItemStyle: {
          fontSize: "14px",
          color: "#34495e"
        }
      }
    },

    centered: {
      header: {
        container: {
          padding: "40px",
          backgroundColor: "#2c3e50",
          textAlign: "center"
        },
        layout: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px"
        },
        sectionOrder: ['name', 'title', 'contact'],
        
        nameAlign: "center",
        nameStyle: {
          fontSize: "36px",
          fontWeight: "800",
          color: "#ecf0f1"
        },
        
        showTitle: true,
        titleAlign: "center",
        titleStyle: {
          fontSize: "18px",
          fontWeight: "300",
          color: "#bdc3c7",
          fontStyle: "italic"
        },
        
        showContact: true,
        contactDirection: "row",
        contactGap: "24px",
        contactAlign: "center",
        contactJustify: "center",
        showContactIcons: true,
        contactIconColor: "#3498db",
        contactItems: ['email', 'phone', 'location'],
        contactItemStyle: {
          fontSize: "14px",
          color: "#ecf0f1"
        }
      }
    },

    twoColumn: {
      header: {
        container: {
          padding: "32px",
          backgroundColor: "#ffffff",
          borderBottom: "3px solid #3498db"
        },
        layout: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px"
        },
        sectionOrder: ['name', 'contact'],
        
        nameFlex: "1",
        nameAlign: "flex-start",
        nameZone: {
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        },
        nameStyle: {
          fontSize: "28px",
          fontWeight: "700",
          color: "#2c3e50"
        },
        
        showTitle: true,
        titleStyle: {
          fontSize: "16px",
          fontWeight: "400",
          color: "#7f8c8d"
        },
        
        showContact: true,
        contactDirection: "column",
        contactGap: "8px",
        contactAlign: "flex-end",
        showContactIcons: false,
        contactItems: ['phone', 'email', 'location'],
        contactItemStyle: {
          fontSize: "13px",
          color: "#34495e",
          textAlign: "right"
        }
      }
    },

    minimal: {
      header: {
        container: {
          padding: "24px 0",
          borderBottom: "1px solid #ecf0f1"
        },
        layout: {
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        },
        sectionOrder: ['name', 'contact'],
        
        nameStyle: {
          fontSize: "24px",
          fontWeight: "600",
          color: "#2c3e50"
        },
        
        showTitle: false,
        
        showContact: true,
        contactDirection: "row",
        contactGap: "12px",
        contactAlign: "center",
        showContactIcons: true,
        contactIconSize: "4px",
        contactIconColor: "#95a5a6",
        contactItems: ['email', 'phone'],
        contactItemStyle: {
          fontSize: "13px",
          color: "#7f8c8d"
        }
      }
    },

    sidebar: {
      header: {
        container: {
          padding: "40px 32px",
          backgroundColor: "#34495e"
        },
        layout: {
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        },
        sectionOrder: ['name', 'title', 'contact'],
        
        nameAlign: "flex-start",
        nameStyle: {
          fontSize: "26px",
          fontWeight: "700",
          color: "#ecf0f1",
          lineHeight: "1.2"
        },
        
        showTitle: true,
        titleAlign: "flex-start",
        titleStyle: {
          fontSize: "15px",
          fontWeight: "400",
          color: "#bdc3c7",
          paddingTop: "4px"
        },
        
        showContact: true,
        contactDirection: "column",
        contactGap: "12px",
        contactAlign: "flex-start",
        showContactIcons: true,
        contactIconColor: "#3498db",
        contactIconSize: "6px",
        contactItems: ['email', 'phone', 'location', 'linkedin', 'website'],
        contactItemStyle: {
          fontSize: "13px",
          color: "#ecf0f1"
        }
      }
    },

    grid: {
      header: {
        container: {
          padding: "32px",
          backgroundColor: "#f8f9fa"
        },
        layout: {
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        },
        sectionOrder: ['name', 'title', 'contact'],
        
        nameAlign: "flex-start",
        nameStyle: {
          fontSize: "30px",
          fontWeight: "700",
          color: "#2c3e50"
        },
        
        showTitle: true,
        titleAlign: "flex-start",
        titleStyle: {
          fontSize: "17px",
          fontWeight: "500",
          color: "#7f8c8d"
        },
        
        showContact: true,
        contactLayoutType: "grid",
        contactGridColumns: "repeat(2, 1fr)",
        contactGap: "12px",
        contactAlign: "start",
        showContactIcons: true,
        contactIconColor: "#e74c3c",
        contactItems: ['email', 'phone', 'location', 'linkedin'],
        contactItemStyle: {
          fontSize: "14px",
          color: "#34495e"
        }
      }
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px", color: "#2c3e50" }}>
          Layout Presets
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {Object.keys(layouts).map((layout) => (
            <button
              key={layout}
              onClick={() => setCurrentLayout(layout)}
              style={{
                padding: "10px 20px",
                backgroundColor: currentLayout === layout ? "#3498db" : "#ecf0f1",
                color: currentLayout === layout ? "#ffffff" : "#2c3e50",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                textTransform: "capitalize",
                transition: "all 0.2s"
              }}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <FlexibleHeaderSection
          resumeDetails={resumeDetails}
          styleConfig={layouts[currentLayout]}
        />
      </div>

      <div style={{ marginTop: "32px", padding: "24px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#2c3e50" }}>
          Configuration Options
        </h3>
        <div style={{ fontSize: "14px", color: "#34495e", lineHeight: "1.8" }}>
          <strong>Layout Control:</strong>
          <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
            <li><code>layoutDirection</code>: "row" | "column" - Main layout direction</li>
            <li><code>layoutAlign</code>: alignItems for main container</li>
            <li><code>layoutJustify</code>: justifyContent for main container</li>
            <li><code>layoutGap</code>: Space between sections</li>
            <li><code>sectionOrder</code>: ['name', 'title', 'contact'] - Reorder sections</li>
          </ul>

          <strong style={{ display: "block", marginTop: "16px" }}>Name Section:</strong>
          <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
            <li><code>nameAlign</code>: Horizontal alignment</li>
            <li><code>nameMarginTop/Bottom/Left/Right</code>: Individual margins</li>
            <li><code>namePadding</code>: Internal spacing</li>
            <li><code>nameWidth</code>: Width control</li>
            <li><code>nameFlex</code>: Flex grow/shrink</li>
          </ul>

          <strong style={{ display: "block", marginTop: "16px" }}>Title Section:</strong>
          <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
            <li><code>showTitle</code>: true | false</li>
            <li><code>titleAlign</code>: Horizontal alignment</li>
            <li><code>titleMarginTop/Bottom/Left/Right</code>: Individual margins</li>
            <li><code>titlePadding</code>: Internal spacing</li>
          </ul>

          <strong style={{ display: "block", marginTop: "16px" }}>Contact Section:</strong>
          <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
            <li><code>showContact</code>: true | false</li>
            <li><code>contactDirection</code>: "row" | "column" - Vertical or horizontal</li>
            <li><code>contactLayoutType</code>: "flex" | "grid"</li>
            <li><code>contactGap</code>: Space between items</li>
            <li><code>contactGridColumns</code>: Grid template (e.g., "repeat(2, 1fr)")</li>
            <li><code>contactAlign</code>: Alignment of items</li>
            <li><code>contactJustify</code>: Justify content</li>
            <li><code>contactMarginTop/Bottom/Left/Right</code>: Individual margins</li>
            <li><code>contactItems</code>: ['email', 'phone', ...] - Order and selection</li>
            <li><code>showContactIcons</code>: Show/hide icons</li>
            <li><code>contactIconSize</code>: Icon size</li>
            <li><code>contactIconColor</code>: Icon color</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Demo;


const handleHeaderLayoutChange = (key, value) => {
  console.log('Changing:', key, 'to:', value);
  setStyleConfig(prev => ({
    ...prev,
    header: {
      ...prev.header,
      [key]: value
    }
  }));
};

const handleHeaderStyleChange = (styleKey, property, value) => {
  console.log('Changing style:', styleKey, property, 'to:', value);
  setStyleConfig(prev => ({
    ...prev,
    header: {
      ...prev.header,
      [styleKey]: {
        ...prev.header?.[styleKey],
        [property]: value
      }
    }
  }));
};

const handleSectionOrderChange = (currentIndex, direction) => {
  const currentOrder = styleConfig.header?.sectionOrder || ['name', 'title', 'contact'];
  const newOrder = [...currentOrder];
  
  if (direction === 'up' && currentIndex > 0) {
    [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
  } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
    [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
  }
  
  setStyleConfig(prev => ({
    ...prev,
    header: {
      ...prev.header,
      sectionOrder: newOrder
    }
  }));
};
"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";
import { requestOpenObjectCatalog } from "../../lib/objectCatalog/objectCatalogRuntime";
import { requestOpenSystemModelingWorkspace } from "../../lib/systemModeling/systemModelRuntime";
import {
  logAddObjectPlaceholderClicked,
  logScenePanelCollapsed,
  logScenePanelExpanded,
  logScenePanelShellMounted,
} from "../../lib/ui/scenePanelShellInstrumentation";

export type ScenePanelShellProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onAddObjectClick?: () => void;
  onCreateSystemClick?: () => void;
};

const PLACEHOLDER_SECTIONS = ["Workspace", "Objects", "Signals", "Actions"] as const;

const headerStyle: React.CSSProperties = {
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "12px 10px",
  borderBottom: `1px solid ${nx.border}`,
  background: nx.bgDeep,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: nx.lowMuted,
  marginBottom: 6,
};

const sectionBodyStyle: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${nx.borderSoft}`,
  background: nx.bgControl,
  padding: "8px 10px",
  color: nx.muted,
  fontSize: 11,
  lineHeight: 1.45,
};

export function ScenePanelShell(props: ScenePanelShellProps): React.ReactElement {
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logScenePanelShellMounted();
  }, []);

  const handleToggle = React.useCallback(() => {
    if (props.collapsed) {
      logScenePanelExpanded();
    } else {
      logScenePanelCollapsed();
    }
    props.onToggleCollapsed();
  }, [props.collapsed, props.onToggleCollapsed]);

  const handleAddObject = React.useCallback(() => {
    logAddObjectPlaceholderClicked();
    requestOpenObjectCatalog("scene_panel");
    props.onAddObjectClick?.();
  }, [props.onAddObjectClick]);

  const handleCreateSystem = React.useCallback(() => {
    requestOpenSystemModelingWorkspace("scene_panel");
    props.onCreateSystemClick?.();
  }, [props.onCreateSystemClick]);

  if (props.collapsed) {
    return (
      <div
        id="nexora-scene-panel-shell"
        data-nx="scene-panel-shell"
        data-nx-state="collapsed"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          background: nx.workspacePanelBg,
        }}
      >
        <header style={{ ...headerStyle, flexDirection: "column", padding: "10px 6px", gap: 10 }}>
          <button
            type="button"
            aria-label="Expand scene panel"
            title="Expand scene panel"
            onClick={handleToggle}
            style={toggleButtonStyle}
          >
            ⟨
          </button>
          <span
            aria-hidden
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            Scene
          </span>
        </header>
      </div>
    );
  }

  return (
    <div
      id="nexora-scene-panel-shell"
      data-nx="scene-panel-shell"
      data-nx-state="expanded"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        background: nx.workspacePanelBg,
        boxShadow: nx.workspaceShadow,
      }}
    >
      <header style={headerStyle}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Scene Control
          </div>
        </div>
        <button
          type="button"
          aria-label="Collapse scene panel"
          title="Collapse scene panel"
          onClick={handleToggle}
          style={toggleButtonStyle}
        >
          ⟩
        </button>
      </header>

      <div
        data-nx="scene-panel-body"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {PLACEHOLDER_SECTIONS.map((section) => (
          <section key={section} data-nx-section={section.toLowerCase()}>
            <div style={sectionTitleStyle}>{section}</div>
            <div style={sectionBodyStyle}>
              {section === "Actions" ? (
                <>
                  <p style={{ margin: "0 0 8px" }}>Scene-level actions will appear here.</p>
                  <button
                    type="button"
                    aria-label="Add Object"
                    title="Add Object from executive catalog"
                    onClick={handleAddObject}
                    style={{ ...addObjectButtonStyle, marginBottom: 8 }}
                  >
                    [+] Add Object
                  </button>
                  <button
                    type="button"
                    aria-label="Load Template"
                    title="Load an executive domain template"
                    onClick={handleCreateSystem}
                    style={addObjectButtonStyle}
                  >
                    Load Template
                  </button>
                </>
              ) : (
                <span>Reserved for {section.toLowerCase()} controls.</span>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const toggleButtonStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 28,
  height: 28,
  borderRadius: 8,
  border: `1px solid ${nx.border}`,
  background: nx.btnSecondaryBg,
  color: nx.textSoft,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const addObjectButtonStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 9,
  border: `1px dashed ${nx.borderStrong}`,
  background: nx.bgDeep,
  color: nx.textSoft,
  fontSize: 11,
  fontWeight: 700,
  padding: "8px 10px",
  cursor: "pointer",
  opacity: 0.88,
};

export default ScenePanelShell;

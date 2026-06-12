"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";
import { requestOpenObjectCatalog } from "../../lib/objectCatalog/objectCatalogRuntime";
import { requestOpenSystemModelingWorkspace } from "../../lib/systemModeling/systemModelRuntime";
import {
  normalizeScenePanelState,
  SCENE_PANEL_CONTRACT,
} from "../../lib/scene/scenePanelContract";
import {
  HUD_PANEL_BODY_SCROLL_STYLE,
  HUD_PANEL_HEADER_PADDING_STYLE,
  HUD_PANEL_SCROLL_BODY_STYLE,
  HUD_PANEL_STICKY_HEADER_STYLE,
  HUD_PANEL_STICKY_SHELL_STYLE,
  traceHudPanelStickyHeader,
} from "../../lib/hud/hudPanelDesignContract";
import {
  SCENE_PANEL_EXPANDED_HEIGHT_RATIO,
  SCENE_PANEL_HEADER_STYLE,
  SCENE_PANEL_MINIMIZED_SHELL_STYLE,
  SCENE_PANEL_TOP_INSET_PX,
  SCENE_PANEL_WIDTH,
  traceScenePanelLayout,
  toScenePanelHeightMode,
} from "../../lib/scene/scenePanelWidthContract";
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

/**
 * ARCHITECTURE CONTRACT:
 * Scene Panel is scene-scoped, left of scene, collapsible body with header
 * always visible. It may open the catalog for object insertion; it must not
 * become a dashboard, object panel, assistant surface, left-nav menu, or
 * alternate workspace. Canonical details live in
 * docs/nexora-scene-panel-architecture.md.
 */
const PLACEHOLDER_SECTIONS = ["Workspace", "Objects", "Signals", "Actions"] as const;

const headerStyle: React.CSSProperties = {
  ...SCENE_PANEL_HEADER_STYLE,
  ...HUD_PANEL_HEADER_PADDING_STYLE,
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
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const shellStyle: React.CSSProperties = {
  ...HUD_PANEL_STICKY_SHELL_STYLE,
  width: SCENE_PANEL_WIDTH,
  maxWidth: SCENE_PANEL_WIDTH,
  minWidth: SCENE_PANEL_WIDTH,
  background: nx.workspacePanelBg,
};

export function ScenePanelShell(props: ScenePanelShellProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const scenePanelState = normalizeScenePanelState(props.collapsed, { warn: false });
  const minimized = scenePanelState === "collapsed";

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logScenePanelShellMounted();
  }, []);

  React.useEffect(() => {
    if (minimized) return;
    traceHudPanelStickyHeader({ panel: "scene" });
  }, [minimized]);

  React.useEffect(() => {
    traceScenePanelLayout({
      top: SCENE_PANEL_TOP_INSET_PX,
      width: SCENE_PANEL_WIDTH,
      heightMode: toScenePanelHeightMode(minimized),
      heightRatio: SCENE_PANEL_EXPANDED_HEIGHT_RATIO,
      bodyVisible: !minimized,
    });
  }, [minimized]);

  const handleToggle = React.useCallback(() => {
    if (minimized) {
      logScenePanelExpanded();
    } else {
      logScenePanelCollapsed();
    }
    props.onToggleCollapsed();
  }, [minimized, props.onToggleCollapsed]);

  const handleAddObject = React.useCallback(() => {
    logAddObjectPlaceholderClicked();
    requestOpenObjectCatalog(SCENE_PANEL_CONTRACT.objectCatalogEntrySource);
    props.onAddObjectClick?.();
  }, [props.onAddObjectClick]);

  const handleCreateSystem = React.useCallback(() => {
    requestOpenSystemModelingWorkspace("scene_panel");
    props.onCreateSystemClick?.();
  }, [props.onCreateSystemClick]);

  return (
    <div
      id="nexora-scene-panel-shell"
      data-nx="scene-panel-shell"
      data-nx-state={minimized ? "collapsed" : "expanded"}
      style={{
        ...shellStyle,
        ...(minimized ? SCENE_PANEL_MINIMIZED_SHELL_STYLE : { boxShadow: nx.workspaceShadow, overflow: "hidden" }),
      }}
    >
      <header
        style={{
          ...headerStyle,
          borderBottom: minimized ? undefined : headerStyle.borderBottom,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Scene
          </div>
        </div>
        <button
          type="button"
          aria-label={minimized ? "Expand scene panel" : "Minimize scene panel"}
          title={minimized ? "Expand scene panel" : "Minimize scene panel"}
          onClick={handleToggle}
          style={toggleButtonStyle}
        >
          {minimized ? "▲" : "▼"}
        </button>
      </header>

      {!minimized ? (
        <div
          data-nx="scene-panel-body"
          style={HUD_PANEL_SCROLL_BODY_STYLE}
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
      ) : null}
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

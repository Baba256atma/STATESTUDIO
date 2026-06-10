"use client";

import React from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../lib/ui/executiveWorkspaceLayout";
import { resolveObjectPanelState } from "../../lib/object-panel/objectPanelContract";
import {
  logObjectPanelCollapsed,
  logObjectPanelExpanded,
  logObjectPanelShellMounted,
  logObjectSelectionObserved,
} from "../../lib/ui/objectPanelShellInstrumentation";
import { nx } from "../ui/nexoraTheme";

export type ObjectPanelShellProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  /** E2:9 — preserve portal host without visible sidebar chrome. */
  headless?: boolean;
  children?: React.ReactNode;
};

/**
 * ARCHITECTURE CONTRACT:
 * Object Panel is the scene-native, right-side selected-object surface.
 * It is not Left Nav, Main Right Panel, a modal, or a global dashboard.
 * Selection remains single-object and route requests flow through Dashboard
 * Context instead of creating extra MRP tabs.
 * See docs/nexora-object-panel-architecture.md.
 */

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

export function ObjectPanelShell(props: ObjectPanelShellProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const selectedObjectId = props.selectedObjectId?.trim() || null;
  const selectedObjectLabel = props.selectedObjectLabel?.trim() || null;
  const hasSelection = Boolean(selectedObjectId || selectedObjectLabel);
  const objectPanelState = resolveObjectPanelState({
    visible: !props.headless,
    selectedObjectId,
  });

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logObjectPanelShellMounted();
  }, []);

  React.useEffect(() => {
    logObjectSelectionObserved({ selectedObjectId, selectedObjectLabel });
  }, [selectedObjectId, selectedObjectLabel]);

  const handleToggle = React.useCallback(() => {
    if (props.collapsed) {
      logObjectPanelExpanded();
    } else {
      logObjectPanelCollapsed();
    }
    props.onToggleCollapsed();
  }, [props.collapsed, props.onToggleCollapsed]);

  if (props.headless) {
    return (
      <div
        id={EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelShell}
        data-nx="object-panel-shell"
        data-nx-state="headless"
        data-nx-object-panel-state="hidden"
        aria-hidden
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelHost}
          data-nx="object-panel-host"
          style={{ display: "none" }}
        >
          {props.children}
        </div>
      </div>
    );
  }

  if (props.collapsed) {
    return (
      <div
        id={EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelShell}
        data-nx="object-panel-shell"
        data-nx-state="collapsed"
        data-nx-object-panel-state={objectPanelState}
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
            aria-label="Expand object panel"
            title="Expand object panel"
            onClick={handleToggle}
            style={toggleButtonStyle}
          >
            ⟩
          </button>
          <span
            aria-hidden
            style={{
              writingMode: "vertical-rl",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            Object
          </span>
        </header>
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelHost}
          data-nx="object-panel-host"
          aria-hidden
          style={{ display: "none" }}
        >
          {props.children}
        </div>
      </div>
    );
  }

  return (
    <div
      id={EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelShell}
      data-nx="object-panel-shell"
      data-nx-state="expanded"
      data-nx-object-panel-state={objectPanelState}
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
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            Object Actions
          </div>
        </div>
        <button
          type="button"
          aria-label="Collapse object panel"
          title="Collapse object panel"
          onClick={handleToggle}
          style={toggleButtonStyle}
        >
          ⟨
        </button>
      </header>

      <div
        data-nx="object-panel-body"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          data-nx="object-selection-state"
          style={{
            flexShrink: 0,
            padding: "10px 10px 0",
          }}
        >
          <div style={sectionTitleStyle}>Selection</div>
          <div style={{ ...sectionBodyStyle, marginBottom: 8 }}>
            {hasSelection ? (
              <>
                <div style={{ color: nx.textStrong, fontWeight: 700, fontSize: 12 }}>
                  {selectedObjectLabel ?? selectedObjectId}
                </div>
                {selectedObjectLabel && selectedObjectId ? (
                  <div style={{ marginTop: 4, fontSize: 10, color: nx.lowMuted }}>{selectedObjectId}</div>
                ) : null}
              </>
            ) : (
              <span>No object selected</span>
            )}
          </div>
        </div>

        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelHost}
          data-nx="object-panel-host"
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderTop: `1px solid ${nx.borderSoft}`,
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default ObjectPanelShell;

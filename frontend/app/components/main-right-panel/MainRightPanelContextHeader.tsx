"use client";

import React from "react";

import { useMrpContextHeaderView } from "../../lib/ui/mrpContext/useMrpContextHeader.ts";
import { nx } from "../ui/nexoraTheme";

export type MainRightPanelContextHeaderProps = Readonly<{
  onBackNavigation?: () => void;
}>;

const lineStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.35,
  color: nx.text,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const subLineStyle: React.CSSProperties = {
  ...lineStyle,
  fontWeight: 600,
  color: nx.textSoft,
};

const objectLineStyle: React.CSSProperties = {
  ...lineStyle,
  fontWeight: 600,
  color: nx.muted,
};

const backButtonStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.35,
  color: nx.lowMuted,
};

export function MainRightPanelContextHeader(
  props: MainRightPanelContextHeaderProps
): React.ReactElement {
  const header = useMrpContextHeaderView();

  const handleBack = React.useCallback(() => {
    props.onBackNavigation?.();
  }, [props.onBackNavigation]);

  return (
    <section
      id="nexora-mrp-context-header"
      data-nx="mrp-context-header"
      data-mrp-context-revision={header.revision}
      aria-label="Executive context"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "10px 12px",
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: nx.workspacePanelBg,
        minWidth: 0,
      }}
    >
      <p style={lineStyle} title={header.panelName}>
        {header.panelName}
      </p>
      <p style={subLineStyle} title={header.activeMode}>
        {header.activeMode}
      </p>
      <p style={objectLineStyle} title={header.selectedObject}>
        {header.selectedObject}
      </p>
      {header.showBackNavigation ? (
        <button
          type="button"
          style={backButtonStyle}
          onClick={handleBack}
          aria-label="Return to previous executive context"
        >
          {header.backLabel}
        </button>
      ) : null}
    </section>
  );
}

export default MainRightPanelContextHeader;

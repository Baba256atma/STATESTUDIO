"use client";

import React, { useEffect } from "react";

import type { ObjectPanelExecutiveViewModel } from "../../../lib/object-panel/objectPanelExecutiveViewModel.ts";
import { traceObjectPanelPhase } from "../../../lib/object-panel/objectPanelDiagnostics.ts";
import { dashboardVisualSpacing } from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { nx } from "../../ui/nexoraTheme.ts";
import { objectIconGlyph, objectPanelSectionStyle } from "./objectPanelExecutiveStyles.ts";

export type ObjectPanelExecutiveHeaderProps = Readonly<{
  view: ObjectPanelExecutiveViewModel;
}>;

function statusBadgeStyle(status: string): React.CSSProperties {
  const normalized = status.trim().toLowerCase();
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 999,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    border: `1px solid ${nx.borderSoft}`,
  };
  if (normalized.includes("active") || normalized.includes("healthy") || normalized.includes("stable")) {
    return { ...base, color: "#bbf7d0", border: "1px solid rgba(74,222,128,0.28)", background: "rgba(74,222,128,0.12)" };
  }
  if (normalized.includes("monitor") || normalized.includes("warn")) {
    return { ...base, color: "#fef08a", border: "1px solid rgba(250,204,21,0.28)", background: "rgba(250,204,21,0.1)" };
  }
  return { ...base, color: nx.textSoft, background: "rgba(2,6,23,0.32)" };
}

export function ObjectPanelExecutiveHeader(props: ObjectPanelExecutiveHeaderProps): React.ReactElement {
  useEffect(() => {
    traceObjectPanelPhase("header");
  }, []);

  const { view } = props;
  const glyph = objectIconGlyph(view.objectType, view.objectName);

  return (
    <section data-nx="object-panel-executive-header" style={{ ...objectPanelSectionStyle, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: dashboardVisualSpacing.md }}>
        <div
          aria-hidden
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            fontWeight: 800,
            color: nx.accentInk,
            border: `1px solid ${nx.borderStrong}`,
            background: "linear-gradient(145deg, rgba(56,189,248,0.18), rgba(2,6,23,0.5))",
          }}
        >
          {glyph}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: nx.text,
              lineHeight: 1.15,
              wordBreak: "break-word",
            }}
          >
            {view.objectName}
          </div>
          <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: nx.muted, lineHeight: 1.3 }}>
            {view.objectType}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: nx.textSoft, lineHeight: 1.35 }}>
            {view.operationalState}
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={statusBadgeStyle(view.statusLabel)}>{view.statusLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ObjectPanelExecutiveHeader;

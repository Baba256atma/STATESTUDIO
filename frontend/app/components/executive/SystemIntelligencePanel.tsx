"use client";

import React from "react";
import { cardStyle, nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";

type IntelligenceItem = {
  label: string;
  value?: string | null;
};

type SystemIntelligencePanelProps = {
  fragilityDrivers: IntelligenceItem[];
  conflicts: string[];
  propagationPath: string | null;
  propagationSummary: string | null;
  titleLabel?: string;
  driversTitle?: string;
  conflictsTitle?: string;
  propagationTitle?: string;
  emptyDriversText?: string;
  emptyConflictsText?: string;
  emptyPropagationText?: string;
  propagationHintText?: string;
};

export function SystemIntelligencePanel(props: SystemIntelligencePanelProps) {
  return (
    <div style={{ ...cardStyle, gap: 14 }}>
      <div style={{ ...sectionTitleStyle, color: "#cbd5f5" }}>{props.titleLabel ?? "System Intelligence"}</div>

      <div style={{ display: "grid", gap: 12 }}>
        <SectionBlock
          title={props.driversTitle ?? "Fragility Drivers"}
          rows={
            props.fragilityDrivers.length
              ? props.fragilityDrivers.map((item) => ({
                  primary: item.label,
                  secondary: item.value ?? "Active",
                }))
              : null
          }
          empty={props.emptyDriversText ?? "No major fragility driver is active in the current scene."}
        />

        <SectionBlock
          title={props.conflictsTitle ?? "Strategic Tensions"}
          rows={props.conflicts.length ? props.conflicts.map((item) => ({ primary: item })) : null}
          empty={props.emptyConflictsText ?? "No executive conflict is active in the current scene."}
        />

        <div style={{ ...softCardStyle, gap: 8, padding: 12 }}>
          <div style={{ color: nx.lowMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>
            {props.propagationTitle ?? "Propagation Path"}
          </div>
          <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 700 }}>
            {props.propagationPath ?? props.emptyPropagationText ?? "No active cause-and-effect chain is visible yet."}
          </div>
          {props.propagationSummary ? (
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{props.propagationSummary}</div>
          ) : (
            <div style={{ color: nx.lowMuted, fontSize: 12, lineHeight: 1.45 }}>
              {props.propagationHintText ?? "Ask about delay, pressure, fragility, or impact to reveal the next propagation path."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionBlock(props: {
  title: string;
  rows: Array<{ primary: string; secondary?: string | null }> | null;
  empty: string;
}) {
  return (
    <div style={{ ...softCardStyle, gap: 8, padding: 12 }}>
      <div style={{ color: nx.lowMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>
        {props.title}
      </div>
      {props.rows?.length ? (
        props.rows.map((row, index) => (
          <div key={`${row.primary}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
            <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{row.primary}</div>
            {row.secondary ? <div style={{ color: nx.muted, fontSize: 11, whiteSpace: "nowrap" }}>{row.secondary}</div> : null}
          </div>
        ))
      ) : (
        <div style={{ color: nx.lowMuted, fontSize: 12 }}>{props.empty}</div>
      )}
    </div>
  );
}

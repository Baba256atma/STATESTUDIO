"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

type AssistantDrawerHeaderProps = {
  title?: string;
  subtitle?: string;
  profileLabel?: string | null;
  onToggle: () => void;
  isOpen: boolean;
  /** Slim control-strip header for right rail (not a data panel). */
  density?: "default" | "rail-control";
};

export function AssistantDrawerHeader(props: AssistantDrawerHeaderProps) {
  const rail = props.density === "rail-control";
  return (
    <div
      style={{
        flexShrink: 0,
        padding: rail ? "8px 10px" : "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
        borderBottom: rail ? `1px solid ${nx.border}` : `1px solid ${nx.border}`,
        background: rail ? nx.accentSoft : "transparent",
      }}
    >
      <div style={{ minWidth: 0 }}>
        {rail ? (
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: nx.accentMuted }}>
            Control
          </div>
        ) : null}
        <div style={{ color: nx.text, fontWeight: 800, fontSize: rail ? 12 : 13, marginTop: rail ? 2 : 0 }}>
          {props.title ?? "Strategic Assistant"}
        </div>
        {props.subtitle && !rail ? (
          <div style={{ color: nx.lowMuted, fontSize: 10, marginTop: 2 }}>{props.subtitle}</div>
        ) : null}
        {props.profileLabel ? (
          <div style={{ color: nx.accentMuted, fontSize: rail ? 9 : 10, marginTop: rail ? 2 : 4, fontWeight: 700 }}>
            {props.profileLabel}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={props.onToggle}
        title={props.isOpen ? "Hide assistant" : "Open assistant"}
        aria-label={props.isOpen ? "Hide assistant" : "Open assistant"}
        style={{
          height: rail ? 26 : 30,
          padding: rail ? "0 8px" : "0 10px",
          borderRadius: 8,
          border: `1px solid ${nx.border}`,
          background: nx.btnSecondaryBg,
          color: nx.btnSecondaryText,
          cursor: "pointer",
          fontSize: rail ? 10 : 12,
          flex: "0 0 auto",
        }}
      >
        {props.isOpen ? "Hide" : "Open"}
      </button>
    </div>
  );
}

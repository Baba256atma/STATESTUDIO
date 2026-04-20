"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

type AssistantDrawerHeaderProps = {
  title?: string;
  subtitle?: string;
  profileLabel?: string | null;
  onToggle: () => void;
  isOpen: boolean;
};

export function AssistantDrawerHeader(props: AssistantDrawerHeaderProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: `1px solid ${nx.border}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ color: nx.text, fontWeight: 800, fontSize: 13 }}>
          {props.title ?? "Strategic Assistant"}
        </div>
        {props.subtitle ? (
          <div style={{ color: nx.lowMuted, fontSize: 10, marginTop: 2 }}>{props.subtitle}</div>
        ) : null}
        {props.profileLabel ? (
          <div style={{ color: nx.accentMuted, fontSize: 10, marginTop: 4, fontWeight: 700 }}>
            {props.profileLabel}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={props.onToggle}
        title={props.isOpen ? "Collapse assistant" : "Open assistant"}
        aria-label={props.isOpen ? "Collapse assistant" : "Open assistant"}
        style={{
          height: 30,
          padding: "0 10px",
          borderRadius: 8,
          border: `1px solid ${nx.border}`,
          background: nx.btnSecondaryBg,
          color: nx.btnSecondaryText,
          cursor: "pointer",
          fontSize: 12,
          flex: "0 0 auto",
        }}
      >
        {props.isOpen ? "Collapse" : "Open"}
      </button>
    </div>
  );
}

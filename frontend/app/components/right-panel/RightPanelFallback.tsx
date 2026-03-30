"use client";

import React from "react";

type RightPanelFallbackProps = {
  title: string;
  message: string;
  suggestedActionLabel?: string | null;
  onSuggestedAction?: (() => void) | null;
};

export function RightPanelFallback(props: RightPanelFallbackProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 14,
        borderRadius: 14,
        border: "1px solid rgba(148,163,184,0.14)",
        background: "rgba(15,23,42,0.78)",
        color: "#e2e8f0",
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800 }}>{props.title}</div>
      <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>{props.message}</div>
      {props.suggestedActionLabel && props.onSuggestedAction ? (
        <button
          type="button"
          onClick={props.onSuggestedAction}
          style={{
            alignSelf: "flex-start",
            borderRadius: 999,
            border: "1px solid rgba(96,165,250,0.28)",
            background: "rgba(59,130,246,0.14)",
            color: "#dbeafe",
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {props.suggestedActionLabel}
        </button>
      ) : null}
    </div>
  );
}

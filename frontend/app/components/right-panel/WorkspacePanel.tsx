"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";

type WorkspacePanelProps = {
  contextId: string | null;
  onBack: () => void;
};

export default function WorkspacePanel({ contextId, onBack }: WorkspacePanelProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
      }}
    >
      <div
        style={{
          ...softCardStyle,
          position: "relative",
          width: "100%",
          margin: 0,
          flexShrink: 0,
          zIndex: "auto",
          transform: "none",
          padding: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>Workspace</div>
        <button
          type="button"
          onClick={onBack}
          style={{
            borderRadius: 8,
            border: "1px solid rgba(148,163,184,0.22)",
            background: "rgba(2,6,23,0.38)",
            color: nx.text,
            padding: "8px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back to Scene
        </button>
      </div>

      <div
        style={{
          ...softCardStyle,
          position: "relative",
          width: "100%",
          margin: 0,
          flexShrink: 0,
          zIndex: "auto",
          transform: "none",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Deep Analysis Context
        </div>
        <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
          {`Deep analysis for context: ${contextId ?? "system"}`}
        </div>
        <div style={{ color: nx.textSoft, fontSize: 12, lineHeight: 1.45 }}>
          Use this workspace mode for deeper scenario reasoning, relation inspection, and follow-up execution actions.
        </div>
      </div>
    </div>
  );
}

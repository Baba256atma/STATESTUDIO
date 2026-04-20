"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

type AssistantPromptChipsProps = {
  prompts: string[];
  onSelect: (prompt: string) => void;
};

export function AssistantPromptChips(props: AssistantPromptChipsProps) {
  if (!props.prompts.length) return null;

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", rowGap: 8 }}>
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          width: "100%",
        }}
      >
        Guided prompts
      </div>
      {props.prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => props.onSelect(prompt)}
          style={{
            minHeight: 30,
            padding: "6px 12px",
            borderRadius: 999,
            border: `1px solid ${nx.border}`,
            background: nx.accentSoft,
            color: nx.accentInk,
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1.35,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

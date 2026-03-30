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
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        Guided Prompts
      </div>
      {props.prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => props.onSelect(prompt)}
          style={{
            minHeight: 28,
            padding: "4px 10px",
            borderRadius: 999,
            border: `1px solid ${nx.border}`,
            background: "rgba(59,130,246,0.12)",
            color: "#dbeafe",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

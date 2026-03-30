import React from "react";
import { nx, softCardStyle } from "./nexoraTheme";

export function EmptyStateCard({ text }: { text: string }): React.ReactElement {
  return (
    <div
      style={{
        ...softCardStyle,
        color: nx.muted,
        fontSize: 12,
        lineHeight: 1.5,
        border: `1px solid ${nx.border}`,
        background: "linear-gradient(180deg, rgba(15,23,42,0.72), rgba(2,6,23,0.46))",
      }}
    >
      {text}
    </div>
  );
}

export function ErrorStateCard({ text }: { text: string }): React.ReactElement {
  return (
    <div
      style={{
        ...softCardStyle,
        color: "#fecaca",
        border: "1px solid rgba(248,113,113,0.35)",
        background: "rgba(127,29,29,0.22)",
        fontSize: 12,
      }}
    >
      {text}
    </div>
  );
}

export function LoadingStateCard({ text = "Loading…" }: { text?: string }): React.ReactElement {
  return (
    <div style={{ ...softCardStyle, color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
      {text}
    </div>
  );
}

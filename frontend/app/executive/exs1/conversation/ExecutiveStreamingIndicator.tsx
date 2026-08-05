"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ConversationStreamState } from "./ExecutiveConversationSession";

type Props = {
  readonly state: ConversationStreamState;
};

export function ExecutiveStreamingIndicator({ state }: Props) {
  if (state !== "thinking" && state !== "streaming") return null;
  const label = state === "thinking" ? "Thinking" : "Streaming";
  return (
    <div
      data-testid="executive-conversation-streaming"
      data-stream-state={state}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        padding: "0.35rem 0.55rem",
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${cockpit.border}`,
        background: "rgba(56,189,248,0.06)",
        color: cockpit.muted,
        fontSize: "0.62rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      <span
        aria-hidden
        style={{
          width: "0.45rem",
          height: "0.45rem",
          borderRadius: "999px",
          background: cockpit.accent,
          boxShadow: `0 0 10px ${cockpit.accent}`,
          animation: "exs-conv-pulse 1.1s ease-in-out infinite",
        }}
      />
      {label}
      <style>{`@keyframes exs-conv-pulse{0%,100%{opacity:.35}50%{opacity:1}}`}</style>
    </div>
  );
}

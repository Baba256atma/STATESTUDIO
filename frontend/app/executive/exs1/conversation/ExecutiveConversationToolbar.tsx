"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ConversationStreamState } from "./ExecutiveConversationSession";

type Props = {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly streamState: ConversationStreamState;
  readonly onStop: () => void;
  readonly onReset: () => void;
};

export function ExecutiveConversationToolbar({
  searchQuery,
  onSearchChange,
  streamState,
  onStop,
  onReset,
}: Props) {
  const generating =
    streamState === "thinking" || streamState === "streaming";

  return (
    <div
      data-testid="executive-conversation-toolbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      <input
        data-testid="executive-conversation-search"
        type="search"
        placeholder="Search conversation"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "0.35rem 0.5rem",
          borderRadius: cockpit.radius.sm,
          border: `1px solid ${cockpit.border}`,
          background: "rgba(255,255,255,0.03)",
          color: cockpit.textSoft,
          fontSize: "0.7rem",
          fontFamily: "inherit",
          outline: "none",
        }}
      />
      {generating ? (
        <button
          type="button"
          data-testid="executive-conversation-toolbar-stop"
          onClick={onStop}
          style={toolBtn}
        >
          Stop
        </button>
      ) : null}
      <button
        type="button"
        data-testid="executive-conversation-reset"
        onClick={onReset}
        style={toolBtn}
      >
        Reset
      </button>
    </div>
  );
}

const toolBtn = {
  padding: "0.32rem 0.45rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.border}`,
  background: "transparent",
  color: cockpit.muted,
  fontSize: "0.58rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  cursor: "pointer",
  fontFamily: "inherit",
};

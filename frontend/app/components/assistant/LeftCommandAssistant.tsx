"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { nx } from "../ui/nexoraTheme";

export type LeftCommandAssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type LeftCommandAssistantCommand = {
  id: string;
  label: string;
  hint?: string;
};

export type LeftCommandAssistantProps = {
  open: boolean;
  messages: LeftCommandAssistantMessage[];
  input: string;
  loading?: boolean;
  activeContextSummary?: string | null;
  suggestedCommands?: LeftCommandAssistantCommand[];
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onOpen?: () => void;
  onRunCommand?: (commandId: string) => void;
};

/** Debounce before chat chrome shows “Analyzing…” / disables input (shared with HomeScreen). */
export const FAST_CHAT_THRESHOLD_MS = 300;

const DEFAULT_COMMANDS: LeftCommandAssistantCommand[] = [
  { id: "analyze", label: "Analyze system", hint: "Run analysis on the current system" },
  { id: "compare", label: "Compare options", hint: "Open option comparison" },
  { id: "why_this", label: "Explain decision", hint: "Open strategic advice" },
  { id: "simulate", label: "Simulate next move", hint: "Run simulation" },
  { id: "risk_flow", label: "View risk flow", hint: "Open risk propagation" },
];

function normalizeForDedupe(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function emitLeftCommandSetOpen(open: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("nexora:left-command-set-open", { detail: { open } }));
}

/** Collapse consecutive assistant bubbles with identical normalized text. */
export function dedupeConsecutiveAssistantMessages(messages: LeftCommandAssistantMessage[]): LeftCommandAssistantMessage[] {
  const out: LeftCommandAssistantMessage[] = [];
  let prevNorm: string | null = null;
  for (const m of messages) {
    if (m.role === "assistant") {
      const n = normalizeForDedupe(m.text);
      if (n.length > 0 && n === prevNorm) {
        continue;
      }
      prevNorm = n.length > 0 ? n : null;
    } else {
      prevNorm = null;
    }
    out.push(m);
  }
  return out;
}

type ParsedLine =
  | { kind: "label"; key: string; text: string }
  | { kind: "arrow"; text: string }
  | { kind: "plain"; text: string };

const LABEL_PATTERNS: Array<{ re: RegExp; key: string }> = [
  { re: /^\s*focus\s*:\s*(.+)$/i, key: "FOCUS" },
  { re: /^\s*risk\s*:\s*(.+)$/i, key: "RISK" },
  { re: /^\s*immediate\s*:\s*(.+)$/i, key: "IMMEDIATE" },
  { re: /^\s*next\s*:\s*(.+)$/i, key: "NEXT" },
  { re: /^\s*recommended\s+action\s*:\s*(.+)$/i, key: "ACTION" },
  { re: /^\s*action\s*:\s*(.+)$/i, key: "ACTION" },
];

function parseAssistantText(raw: string): ParsedLine[] {
  const t = raw.trim();
  if (!t) return [{ kind: "plain", text: "" }];

  const lines = t.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [{ kind: "plain", text: t }];

  const out: ParsedLine[] = [];
  for (const line of lines) {
    let matched = false;
    for (const { re, key } of LABEL_PATTERNS) {
      const m = line.match(re);
      if (m?.[1]) {
        out.push({ kind: "label", key, text: m[1].trim() });
        matched = true;
        break;
      }
    }
    if (matched) continue;
    if (/^→\s*/.test(line) || /^->\s*/.test(line)) {
      out.push({ kind: "arrow", text: line.replace(/^→\s*|^->\s*/, "").trim() });
      continue;
    }
    out.push({ kind: "plain", text: line });
  }

  if (out.length === 1 && out[0].kind === "plain" && out[0].text.length > 200) {
    const sentences = out[0].text.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length >= 3) {
      return [
        { kind: "plain", text: sentences[0] },
        { kind: "plain", text: sentences.slice(1, 3).join(" ") },
      ];
    }
  }

  return out.length ? out : [{ kind: "plain", text: t }];
}

function AssistantMessageBody({ text, role }: { text: string; role: "user" | "assistant" }) {
  if (role === "user") {
    return <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</span>;
  }

  const parts = parseAssistantText(text);
  const hasStructure = parts.some((p) => p.kind === "label" || p.kind === "arrow");

  if (!hasStructure) {
    return <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</span>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {parts.map((p, idx) => {
        if (p.kind === "label") {
          return (
            <div key={idx} style={{ lineHeight: 1.35 }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: nx.lowMuted,
                  opacity: 0.88,
                  marginRight: 6,
                }}
              >
                {p.key}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: nx.text }}>{p.text}</span>
            </div>
          );
        }
        if (p.kind === "arrow") {
          return (
            <div key={idx} style={{ fontSize: 11, color: nx.muted, paddingLeft: 2 }}>
              <span style={{ color: nx.accentMuted, marginRight: 6 }}>→</span>
              {p.text}
            </div>
          );
        }
        return (
          <div key={idx} style={{ fontSize: 11, color: nx.muted, lineHeight: 1.4 }}>
            {p.text}
          </div>
        );
      })}
    </div>
  );
}

export const LeftCommandAssistant = React.memo(function LeftCommandAssistant(props: LeftCommandAssistantProps) {
  const {
    open,
    messages,
    input,
    loading = false,
    activeContextSummary,
    suggestedCommands = DEFAULT_COMMANDS,
    onInputChange,
    onSubmit,
    onClose,
    onOpen,
    onRunCommand,
  } = props;

  const listRef = useRef<HTMLDivElement | null>(null);

  const displayMessages = useMemo(() => dedupeConsecutiveAssistantMessages(messages), [messages]);
  /** HomeScreen already defers `loading` by FAST_CHAT_THRESHOLD_MS; show the row as soon as that prop flips. */
  const showDelayedLoadingRow = loading;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [displayMessages.length, open]);

  if (!open) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          padding: "8px 4px",
          background: nx.bgPanelSoft,
        }}
      >
        <button
          type="button"
          onClick={() => {
            onOpen?.();
            emitLeftCommandSetOpen(true);
          }}
          title="Open Nexora Command"
          aria-label="Open Nexora Command"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            padding: "12px 6px",
            borderRadius: 10,
            border: `1px solid ${nx.border}`,
            background: nx.bgElevated,
            color: nx.text,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Command
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: nx.bgElevated,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "12px 12px 10px",
          borderBottom: `1px solid ${nx.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: nx.lowMuted,
              opacity: 0.85,
            }}
          >
            Command surface
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: nx.text, marginTop: 6, lineHeight: 1.25 }}>
            What matters → what to do
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            emitLeftCommandSetOpen(false);
          }}
          title="Collapse command panel"
          aria-label="Collapse command panel"
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 8,
            border: `1px solid ${nx.border}`,
            background: nx.bgDeep,
            color: nx.muted,
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ⟨
        </button>
      </div>

      {activeContextSummary ? (
        <div
          style={{
            flexShrink: 0,
            margin: "0 12px",
            marginTop: 10,
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${nx.border}`,
            background: nx.bgPanelSoft,
            fontSize: 10,
            fontWeight: 600,
            color: nx.muted,
            lineHeight: 1.4,
            maxHeight: 56,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: nx.lowMuted,
              opacity: 0.85,
              marginRight: 6,
            }}
          >
            Context
          </span>
          {activeContextSummary}
        </div>
      ) : null}

      <div
        ref={listRef}
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          minHeight: 0,
          overflowY: "auto",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {displayMessages.length === 0 ? (
          <div style={{ fontSize: 11, color: nx.lowMuted, lineHeight: 1.45 }}>
            No messages yet. Ask a question or use a quick command.
          </div>
        ) : (
          displayMessages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "92%",
                padding: "8px 10px",
                borderRadius: 10,
                border: `1px solid ${nx.border}`,
                background: m.role === "user" ? nx.accentSoft : nx.bgPanelSoft,
                lineHeight: 1.45,
                wordBreak: "break-word",
                opacity: 1,
                transform: "translateY(0px)",
                transition: "opacity 200ms ease, transform 200ms ease",
              }}
            >
              <AssistantMessageBody text={m.text} role={m.role} />
            </div>
          ))
        )}
        {showDelayedLoadingRow ? (
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "92%",
              padding: "8px 10px",
              borderRadius: 10,
              border: `1px solid ${nx.border}`,
              background: nx.bgPanelSoft,
              color: nx.muted,
              fontSize: 11,
              fontWeight: 600,
              opacity: 1,
              transform: "translateY(0px)",
              transition: "opacity 200ms ease, transform 200ms ease",
            }}
          >
            Analyzing system...
          </div>
        ) : null}
      </div>

      <div style={{ flexShrink: 0, padding: "10px 12px 12px", borderTop: `1px solid ${nx.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: nx.lowMuted, opacity: 0.85 }}>
          Quick commands
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {suggestedCommands.map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              disabled={loading || !onRunCommand}
              title={cmd.hint ?? cmd.label}
              onClick={() => onRunCommand?.(cmd.id)}
              style={{
                padding: "5px 10px",
                borderRadius: 999,
                border: `1px solid ${nx.border}`,
                background: nx.bgControl,
                color: nx.text,
                fontSize: 10,
                fontWeight: 700,
                cursor: loading || !onRunCommand ? "not-allowed" : "pointer",
                opacity: loading ? 0.65 : 1,
              }}
            >
              {cmd.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loading && input.trim()) onSubmit();
              }
            }}
            placeholder="What is happening? What should we do?"
            rows={2}
            disabled={loading}
            style={{
              flex: 1,
              minWidth: 0,
              resize: "none",
              borderRadius: 10,
              border: `1px solid ${nx.border}`,
              background: nx.bgDeep,
              color: nx.text,
              fontSize: 12,
              fontWeight: 500,
              padding: "8px 10px",
              lineHeight: 1.4,
              opacity: loading ? 0.65 : 1,
            }}
          />
          <button
            type="button"
            disabled={loading || !input.trim()}
            onClick={onSubmit}
            style={{
              flexShrink: 0,
              alignSelf: "stretch",
              padding: "0 14px",
              borderRadius: 10,
              border: `1px solid ${nx.navTileActiveBorder}`,
              background: nx.navTileActiveBg,
              color: nx.text,
              fontSize: 12,
              fontWeight: 800,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
});

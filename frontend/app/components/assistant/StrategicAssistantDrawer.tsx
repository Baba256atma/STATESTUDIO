"use client";

import React, { useEffect, useMemo, useState } from "react";

import { AssistantDrawerHeader } from "./AssistantDrawerHeader";
import { AssistantPromptChips } from "./AssistantPromptChips";
import { StrategicAssistantLauncher } from "./StrategicAssistantLauncher";
import { nx } from "../ui/nexoraTheme";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type StrategicAssistantDrawerProps = {
  /**
   * `overlay` — legacy floating card (launcher when collapsed).
   * `rail` — embedded in the right intelligence rail; full width, no scene overlap.
   */
  variant?: "overlay" | "rail";
  isOpen: boolean;
  onToggle: () => void;
  title?: string;
  subtitle?: string;
  profileLabel?: string | null;
  messages: ChatMessage[];
  promptChips: string[];
  inputValue: string;
  inputPlaceholder?: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onPromptSelect: (prompt: string) => void;
  isBusy?: boolean;
  demoModeActive?: boolean;
  demoValueHint?: string | null;
  demoFlowActiveStep?: number | null;
};

const DEMO_FLOW_STEPS = ["Load scenario", "Ask the system", "Open Risk → Explanation"] as const;

const RAIL_COMPACT_CHIP_CAP = 2;

export function StrategicAssistantDrawer(props: StrategicAssistantDrawerProps) {
  const variant = props.variant ?? "overlay";
  const [threadExpanded, setThreadExpanded] = useState(false);

  const hasUserMessage = useMemo(() => props.messages.some((m) => m.role === "user"), [props.messages]);
const flowStep = useMemo(() => {
  const step = props.demoFlowActiveStep;
  if (typeof step !== "number" || Number.isNaN(step)) return -1;
  return Math.max(0, Math.min(step, DEMO_FLOW_STEPS.length - 1));
}, [props.demoFlowActiveStep]);
  useEffect(() => {
    if (variant !== "rail") return;
    if (hasUserMessage || props.isBusy) {
      setThreadExpanded(true);
    }
  }, [variant, hasUserMessage, props.isBusy]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || variant !== "rail") return;
    const compact = !threadExpanded && !hasUserMessage && !props.isBusy;
    globalThis.console?.debug?.("[Nexora][RightRail] assistant_compact_mode", { compact });
  }, [variant, threadExpanded, hasUserMessage, props.isBusy]);

  if (!props.isOpen) {
    if (variant === "rail") {
      return (
        <button
          type="button"
          onClick={props.onToggle}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            borderRadius: 10,
            border: `1px solid ${nx.border}`,
            background: nx.bgPanelSoft,
            color: nx.muted,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            textAlign: "left",
            flexShrink: 0,
          }}
        >
          <span style={{ color: nx.accentMuted, marginRight: 8 }}>⌁</span>
          Open control — ask and run prompts (results below)
        </button>
      );
    }
    return <StrategicAssistantLauncher onOpen={props.onToggle} />;
  }

  const hasMessages = props.messages.length > 0;
  const rail = variant === "rail";

  if (rail) {
    const showThread = threadExpanded || props.isBusy || hasUserMessage;
    const visiblePrompts = props.promptChips.slice(0, RAIL_COMPACT_CHIP_CAP);
    const hasMorePrompts = props.promptChips.length > RAIL_COMPACT_CHIP_CAP;

    return (
      <div
        style={{
          width: "100%",
          maxWidth: "none",
          minHeight: 0,
          boxSizing: "border-box",
          borderRadius: 10,
          border: `1px solid ${nx.border}`,
          background: nx.bgElevated,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <AssistantDrawerHeader
          title={props.title}
          subtitle={undefined}
          profileLabel={props.profileLabel ?? null}
          onToggle={props.onToggle}
          isOpen={props.isOpen}
          density="rail-control"
        />

        {/* Type-C executive control: input + minimal prompts only */}
        <div
          style={{
            flexShrink: 0,
            padding: "8px 10px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
            <input
              value={props.inputValue}
              onChange={(event) => props.onInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") props.onSubmit();
              }}
              placeholder={props.inputPlaceholder}
              aria-label="Ask Nexora"
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                minHeight: 40,
                borderRadius: 10,
                border: `1px solid ${nx.borderStrong}`,
                outline: "none",
                padding: "0 14px",
                background: nx.consoleBg,
                color: nx.textPrimary,
                fontSize: 13,
                fontWeight: 500,
                boxShadow: nx.consoleInset,
              }}
            />
            <button
              type="button"
              onClick={props.onSubmit}
              style={{
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 10,
                border: `1px solid ${nx.primaryCtaBorder}`,
                background: nx.btnPrimaryBg,
                color: nx.btnPrimaryText,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 800,
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              {props.isBusy ? "…" : "Send"}
            </button>
          </div>

          {visiblePrompts.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: nx.lowMuted }}>
                Suggested
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                {visiblePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => props.onPromptSelect(prompt)}
                    style={{
                      maxWidth: "100%",
                      padding: "5px 10px",
                      borderRadius: 999,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgDeep,
                      color: nx.accentInk,
                      fontSize: 10,
                      fontWeight: 600,
                      lineHeight: 1.35,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
                {hasMorePrompts ? (
                  <button
                    type="button"
                    onClick={() => props.onPromptSelect(props.promptChips[2] ?? props.promptChips[0] ?? "")}
                    style={{
                      padding: "5px 9px",
                      borderRadius: 999,
                      border: `1px solid ${nx.border}`,
                      background: "transparent",
                      color: nx.muted,
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    More
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {!showThread && hasMessages ? (
            <button
              type="button"
              onClick={() => setThreadExpanded(true)}
              style={{
                alignSelf: "flex-start",
                padding: "4px 0",
                border: "none",
                background: "none",
                color: nx.accentMuted,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Expand thread
            </button>
          ) : null}
        </div>

        {showThread ? (
          <div
            style={{
              flexShrink: 0,
              maxHeight: 110,
              minHeight: 0,
              overflowY: "auto",
              borderTop: `1px solid ${nx.border}`,
              padding: "8px 10px",
              background: nx.bgDeep,
            }}
          >
            {props.messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: 6,
                  display: "flex",
                  justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "94%",
                    padding: "6px 8px",
                    borderRadius: 10,
                    border: `1px solid ${nx.border}`,
                    background: message.role === "user" ? nx.chatBubbleUserBg : nx.chatBubbleAssistantBg,
                    color: message.role === "user" ? nx.textPrimary : nx.muted,
                    fontSize: 11,
                    lineHeight: 1.4,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  /* ——— Overlay (legacy) layout ——— */
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        height: "100%",
        maxHeight: "100%",
        minHeight: 0,
        boxSizing: "border-box",
        borderRadius: 18,
        border: `1px solid ${nx.border}`,
        background: nx.bgPanel,
        backdropFilter: "blur(14px)",
        boxShadow: nx.shadowDrawer,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <AssistantDrawerHeader
        title={props.title}
        subtitle={props.subtitle}
        profileLabel={props.profileLabel ?? null}
        onToggle={props.onToggle}
        isOpen={props.isOpen}
      />

      {props.demoModeActive ? (
        <div
          style={{
            flexShrink: 0,
            padding: "8px 12px 0",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: nx.accentMuted,
              padding: "3px 8px",
              borderRadius: 8,
              border: `1px solid ${nx.borderStrong}`,
              background: nx.accentSoft,
            }}
          >
            Demo mode
          </span>
          {props.demoValueHint ? (
            <span style={{ fontSize: 10, fontWeight: 600, color: nx.muted }}>{props.demoValueHint}</span>
          ) : null}
        </div>
      ) : null}

      {props.demoModeActive ? (
        <div style={{ flexShrink: 0, padding: "10px 12px 0", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
            Suggested flow
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch" }}>
            {DEMO_FLOW_STEPS.map((label, idx) => {
              const active = idx === flowStep;
              return (
                <div
                  key={label}
                  style={{
                    flexGrow: 1,
                    flexShrink: 1,
                    flexBasis: "108px",
                    minWidth: 0,
                    padding: "6px 8px",
                    borderRadius: 10,
                    border: active ? `1px solid ${nx.navTileActiveBorder}` : `1px solid ${nx.border}`,
                    background: active ? nx.accentSoft : nx.bgPanelSoft,
                    fontSize: 10,
                    fontWeight: active ? 700 : 600,
                    color: active ? nx.textPrimary : nx.muted,
                    lineHeight: 1.35,
                  }}
                >
                  <span style={{ color: active ? nx.accentMuted : nx.lowMuted, marginRight: 4 }}>{idx + 1}.</span>
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            padding: 12,
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {hasMessages ? (
            props.messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "92%",
                    padding: "8px 10px",
                    borderRadius: 12,
                    border: `1px solid ${nx.border}`,
                    background: message.role === "user" ? nx.chatBubbleUserBg : nx.chatBubbleAssistantBg,
                    color: message.role === "user" ? nx.textPrimary : nx.muted,
                    fontSize: 12,
                    lineHeight: 1.4,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                height: "100%",
                minHeight: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: nx.muted,
                fontSize: 12,
                lineHeight: 1.5,
                padding: "0 20px",
              }}
            >
              Choose a guided prompt or ask a strategic question about tradeoffs, resilience, and next moves.
            </div>
          )}
        </div>

        <div
          style={{
            flexShrink: 0,
            padding: 12,
            borderTop: `1px solid ${nx.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: nx.surfacePanel,
          }}
        >
          <AssistantPromptChips prompts={props.promptChips} onSelect={props.onPromptSelect} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={props.inputValue}
              onChange={(event) => props.onInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") props.onSubmit();
              }}
              placeholder={props.inputPlaceholder}
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                height: 36,
                borderRadius: 12,
                border: `1px solid ${nx.border}`,
                outline: "none",
                padding: "0 12px",
                background: nx.consoleBg,
                color: nx.textPrimary,
                fontSize: 12,
              }}
            />
            <button
              type="button"
              onClick={props.onSubmit}
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 10,
                border: `1px solid ${nx.primaryCtaBorder}`,
                background: nx.btnPrimaryBg,
                color: nx.btnPrimaryText,
                cursor: "pointer",
                fontSize: 12,
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: "auto",
              }}
            >
              {props.isBusy ? "Working..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

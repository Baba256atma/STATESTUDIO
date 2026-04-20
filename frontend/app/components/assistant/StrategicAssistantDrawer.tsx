"use client";

import React from "react";

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

export function StrategicAssistantDrawer(props: StrategicAssistantDrawerProps) {
  if (!props.isOpen) {
    return <StrategicAssistantLauncher onOpen={props.onToggle} />;
  }

  const hasMessages = props.messages.length > 0;
  const flowStep =
    typeof props.demoFlowActiveStep === "number" && props.demoFlowActiveStep >= 0 && props.demoFlowActiveStep < DEMO_FLOW_STEPS.length
      ? props.demoFlowActiveStep
      : 0;
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

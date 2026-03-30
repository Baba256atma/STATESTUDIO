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
};

export function StrategicAssistantDrawer(props: StrategicAssistantDrawerProps) {
  if (!props.isOpen) {
    return <StrategicAssistantLauncher onOpen={props.onToggle} />;
  }

  const hasMessages = props.messages.length > 0;

  return (
    <div
      style={{
        width: 380,
        maxWidth: "min(380px, calc(100vw - 28px))",
        borderRadius: 18,
        border: `1px solid ${nx.border}`,
        background: "rgba(7,16,25,0.92)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 22px 50px rgba(2,6,23,0.34)",
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

      <div
        style={{
          maxHeight: 360,
          minHeight: 260,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
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
                    background:
                      message.role === "user" ? "rgba(96,165,250,0.14)" : "rgba(2,6,23,0.45)",
                    color: message.role === "user" ? nx.text : nx.muted,
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
              Ask Nexora about tradeoffs, fragility, or execution options.
            </div>
          )}
        </div>

        <div
          style={{
            padding: 12,
            borderTop: `1px solid ${nx.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "rgba(15,23,42,0.72)",
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
                flex: 1,
                minWidth: 0,
                height: 36,
                borderRadius: 12,
                border: `1px solid ${nx.border}`,
                outline: "none",
                padding: "0 12px",
                background: "rgba(2,6,23,0.55)",
                color: nx.text,
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
                border: "1px solid rgba(96,165,250,0.35)",
                background: "rgba(59,130,246,0.2)",
                color: "#dbeafe",
                cursor: "pointer",
                fontSize: 12,
                flex: "0 0 auto",
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

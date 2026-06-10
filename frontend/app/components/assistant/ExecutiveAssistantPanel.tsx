"use client";

import React, { useEffect, useMemo, useRef } from "react";

import {
  AssistantMessageBody,
  dedupeConsecutiveAssistantMessages,
  type LeftCommandAssistantMessage,
} from "./LeftCommandAssistant";
import {
  DEFAULT_EXECUTIVE_ASSISTANT_STATUS,
  DEFAULT_EXECUTIVE_QUESTION_SUGGESTIONS,
  type ExecutiveAssistantStatus,
} from "../../lib/ui/executiveAssistantPanelTypes";
import {
  logExecutiveAssistantMessageRendered,
  logExecutiveAssistantMounted,
  logExecutiveAssistantSuggestionSelected,
  logExecutiveAssistantThemeResolved,
} from "../../lib/ui/executiveAssistantInstrumentation";
import {
  nexoraHudSectionLabelStyle,
  type NexoraHudThemeMode,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { nx } from "../ui/nexoraTheme";

import type { AssistantIntelligenceCardModel } from "../../lib/assistant/assistantIntelligenceCardsContract";
import { AssistantChatHeader } from "../main-right-panel/assistant/AssistantChatHeader";
import { AssistantConversationArea } from "../main-right-panel/assistant/AssistantConversationArea";
import { AssistantIntelligenceCardsSurface } from "../main-right-panel/assistant/AssistantIntelligenceCardsSurface";
import { AssistantMessageInput } from "../main-right-panel/assistant/AssistantMessageInput";

export type ExecutiveAssistantPanelLayout = "default" | "chat-first";

export type ExecutiveAssistantPanelProps = {
  layout?: ExecutiveAssistantPanelLayout;
  contextLabel?: string | null;
  open: boolean;
  messages: LeftCommandAssistantMessage[];
  input: string;
  loading?: boolean;
  activeContextSummary?: string | null;
  questionSuggestions?: readonly string[];
  intelligenceCards?: readonly AssistantIntelligenceCardModel[];
  assistantStatus?: ExecutiveAssistantStatus;
  themeMode?: NexoraHudThemeMode;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onQuestionSelect?: (question: string) => void;
  onIntelligenceCardAction?: (card: AssistantIntelligenceCardModel) => void;
};

function emitExecutiveAssistantCollapsed(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("nexora:executive-assistant-set-collapsed", { detail: { collapsed: true } })
  );
}

function resolveStatusIndicatorColor(
  phase: ExecutiveAssistantStatus["phase"],
  theme: ReturnType<typeof useSceneHudTheme>
): string {
  if (phase === "online") return theme.success;
  if (phase === "processing") return theme.accent;
  return theme.textSecondary;
}

export function ExecutiveAssistantPanel(props: ExecutiveAssistantPanelProps): React.ReactElement {
  const {
    layout = "default",
    contextLabel,
    open,
    messages,
    input,
    loading = false,
    activeContextSummary,
    questionSuggestions = DEFAULT_EXECUTIVE_QUESTION_SUGGESTIONS,
    intelligenceCards = [],
    assistantStatus = DEFAULT_EXECUTIVE_ASSISTANT_STATUS,
    themeMode = "night",
    onInputChange,
    onSubmit,
    onClose,
    onQuestionSelect,
    onIntelligenceCardAction,
  } = props;

  const listRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(themeMode);
  const displayMessages = useMemo(() => dedupeConsecutiveAssistantMessages(messages), [messages]);
  const statusColor = resolveStatusIndicatorColor(assistantStatus.phase, theme);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveAssistantMounted();
  }, []);

  useEffect(() => {
    logExecutiveAssistantThemeResolved(theme.mode);
  }, [theme.mode]);

  useEffect(() => {
    for (const message of displayMessages) {
      logExecutiveAssistantMessageRendered(message.id);
    }
  }, [displayMessages]);

  useEffect(() => {
    const el = listRef.current;
    if (!el || !open) return;
    el.scrollTop = el.scrollHeight;
  }, [displayMessages.length, loading, open]);

  const handleQuestionClick = (question: string) => {
    if (onQuestionSelect) {
      onQuestionSelect(question);
      return;
    }
    onInputChange(question);
  };

  const handleCollapse = () => {
    onClose();
    emitExecutiveAssistantCollapsed();
  };

  if (!open) {
    return <div aria-hidden style={{ display: "none" }} />;
  }

  if (layout === "chat-first") {
    return (
      <div
        data-hud="executive-assistant-panel"
        data-nx="executive-assistant-chat-first"
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          minWidth: 0,
          background: theme.shellBackground,
          color: theme.text,
        }}
      >
        <AssistantChatHeader
          status={assistantStatus}
          contextLabel={contextLabel ?? "Executive workspace"}
          themeMode={themeMode}
          onCollapse={handleCollapse}
        />
        <AssistantIntelligenceCardsSurface
          cards={intelligenceCards}
          themeMode={themeMode}
          onAction={onIntelligenceCardAction}
        />
        <AssistantConversationArea
          messages={displayMessages}
          loading={loading}
          themeMode={themeMode}
        />
        <AssistantMessageInput
          value={input}
          loading={loading}
          themeMode={themeMode}
          onChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

  return (
    <div
      data-hud="executive-assistant-panel"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
        background: theme.shellBackground,
        backdropFilter: "blur(14px)",
        color: theme.text,
      }}
    >
      {/* E2:13 Scenario suggestion cards — future Dashboard tab surface */}
      <header
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "14px 14px 12px",
          borderBottom: `1px solid ${theme.shellBorder}`,
          background: theme.headerBackground,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.text,
            }}
          >
            NEXORA AI
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
              fontSize: 10,
              fontWeight: 600,
              color: theme.textMuted,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: statusColor,
                boxShadow: `0 0 8px ${statusColor}88`,
              }}
            />
            <span>{assistantStatus.label}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            emitExecutiveAssistantCollapsed();
          }}
          title="Collapse Nexora AI assistant"
          aria-label="Collapse Nexora AI assistant"
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 8,
            border: `1px solid ${theme.controlBorder}`,
            background: theme.controlBackground,
            color: theme.textMuted,
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ⟩
        </button>
      </header>

      {activeContextSummary ? (
        <div
          style={{
            flexShrink: 0,
            margin: "10px 12px 0",
            padding: "8px 10px",
            borderRadius: 10,
            border: `1px solid ${theme.controlBorder}`,
            background: theme.controlBackground,
            fontSize: 10,
            fontWeight: 600,
            color: theme.textMuted,
            lineHeight: 1.45,
            maxHeight: 56,
            overflow: "hidden",
          }}
        >
          <span style={{ ...nexoraHudSectionLabelStyle(theme), marginRight: 6 }}>Guidance</span>
          {activeContextSummary}
        </div>
      ) : null}

      <div
        ref={listRef}
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          padding: "12px 12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {displayMessages.length === 0 ? (
          <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>
            Executive advisor ready. Ask about risk, fragility, scenarios, or recommended actions.
          </div>
        ) : (
          displayMessages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "94%",
                padding: "9px 11px",
                borderRadius: 12,
                border: `1px solid ${theme.controlBorder}`,
                background:
                  message.role === "user"
                    ? "color-mix(in srgb, var(--nx-accent) 16%, transparent)"
                    : theme.controlBackground,
                lineHeight: 1.45,
                wordBreak: "break-word",
              }}
            >
              <AssistantMessageBody
                text={message.text}
                role={message.role}
                confidence={message.confidence}
                followUp={message.followUp}
              />
            </div>
          ))
        )}
        {loading ? (
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "94%",
              padding: "9px 11px",
              borderRadius: 12,
              border: `1px solid ${theme.controlBorder}`,
              background: theme.controlBackground,
              color: theme.textMuted,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Analyzing system...
          </div>
        ) : null}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "0 12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderTop: `1px solid ${theme.shellBorder}`,
        }}
      >
        <div style={{ paddingTop: 10 }}>
          <div style={{ ...nexoraHudSectionLabelStyle(theme), marginBottom: 8 }}>Executive questions</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {questionSuggestions.map((question) => (
              <button
                key={question}
                type="button"
                disabled={loading}
                title={question}
                onClick={() => handleQuestionClick(question)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 999,
                  border: `1px solid ${theme.controlBorder}`,
                  background: theme.controlBackground,
                  color: theme.text,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.65 : 1,
                  lineHeight: 1.35,
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "stretch", paddingBottom: 2 }}>
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (!loading && input.trim()) onSubmit();
              }
            }}
            placeholder="Ask or confirm..."
            rows={2}
            disabled={loading}
            style={{
              flex: 1,
              minWidth: 0,
              resize: "none",
              borderRadius: 10,
              border: `1px solid ${theme.controlBorder}`,
              background: theme.controlBackground,
              color: theme.text,
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
            title="Send"
            aria-label="Send message"
            style={{
              flexShrink: 0,
              alignSelf: "stretch",
              minWidth: 44,
              borderRadius: 10,
              border: `1px solid ${theme.controlBorder}`,
              background: nx.accentSoft,
              color: nx.accent,
              fontSize: 12,
              fontWeight: 800,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.55 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

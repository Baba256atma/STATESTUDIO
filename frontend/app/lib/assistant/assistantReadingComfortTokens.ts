/**
 * MRP:11:2:4 — Executive reading comfort presentation tokens.
 */

import type { CSSProperties } from "react";

export const ASSISTANT_READING_COMFORT_TOKENS = Object.freeze({
  conversation: Object.freeze({
    paddingX: 14,
    paddingY: 12,
    messageGap: 12,
    bubblePaddingX: 12,
    bubblePaddingY: 10,
    bubbleRadius: 14,
    fontSize: 12,
    lineHeight: 1.62,
    paragraphGap: 8,
    assistantMaxWidth: "100%",
    userMaxWidth: "88%",
  }),
  supportContent: Object.freeze({
    paddingX: 14,
    paddingY: 10,
    fontSize: 12,
    lineHeight: 1.58,
    paragraphGap: 8,
  }),
  chips: Object.freeze({
    containerGap: 6,
    rowGap: 6,
    paddingX: 10,
    paddingY: 5,
    fontSize: 11,
    lineHeight: 1.4,
    flexBasis: "min(100%, calc(50% - 3px))",
    minWidth: 120,
  }),
  input: Object.freeze({
    paddingX: 14,
    paddingY: 10,
    gap: 8,
    fontSize: 12,
    lineHeight: 1.45,
    fieldPaddingX: 10,
    fieldPaddingY: 8,
  }),
  header: Object.freeze({
    paddingX: 14,
    paddingY: 10,
  }),
});

export function resolveAssistantConversationAreaStyle(): CSSProperties {
  const t = ASSISTANT_READING_COMFORT_TOKENS.conversation;
  return {
    flex: "1 1 auto",
    minHeight: 120,
    overflowY: "auto",
    padding: `${t.paddingY}px ${t.paddingX}px`,
    display: "flex",
    flexDirection: "column",
    gap: t.messageGap,
  };
}

export function resolveAssistantMessageBubbleStyle(input: {
  role: "user" | "assistant";
  theme: {
    controlBorder: string;
    controlBackground: string;
  };
}): CSSProperties {
  const t = ASSISTANT_READING_COMFORT_TOKENS.conversation;
  const isUser = input.role === "user";
  return {
    alignSelf: isUser ? "flex-end" : "flex-start",
    maxWidth: isUser ? t.userMaxWidth : t.assistantMaxWidth,
    width: isUser ? undefined : "100%",
    padding: `${t.bubblePaddingY}px ${t.bubblePaddingX}px`,
    borderRadius: t.bubbleRadius,
    border: `1px solid ${input.theme.controlBorder}`,
    background: isUser
      ? "color-mix(in srgb, var(--nx-accent) 14%, transparent)"
      : input.theme.controlBackground,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
}

export function resolveAssistantSupportContentStyle(theme: { textMuted: string }): CSSProperties {
  const t = ASSISTANT_READING_COMFORT_TOKENS.supportContent;
  return {
    padding: `${t.paddingY}px ${t.paddingX}px`,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    color: theme.textMuted,
  };
}

export function resolveAssistantQuestionChipStyle(theme: {
  controlBorder: string;
  controlBackground: string;
  text: string;
}): CSSProperties {
  const t = ASSISTANT_READING_COMFORT_TOKENS.chips;
  return {
    flex: `1 1 ${t.flexBasis}`,
    minWidth: t.minWidth,
    padding: `${t.paddingY}px ${t.paddingX}px`,
    borderRadius: 999,
    border: `1px solid ${theme.controlBorder}`,
    background: theme.controlBackground,
    color: theme.text,
    fontSize: t.fontSize,
    fontWeight: 600,
    lineHeight: t.lineHeight,
    cursor: "pointer",
    textAlign: "left",
  };
}

export function resolveAssistantQuestionChipRowStyle(): CSSProperties {
  const t = ASSISTANT_READING_COMFORT_TOKENS.chips;
  return {
    display: "flex",
    flexWrap: "wrap",
    gap: t.containerGap,
    rowGap: t.rowGap,
    alignItems: "stretch",
  };
}

export function resolveAssistantMessageInputShellStyle(theme: {
  shellBorder: string;
  shellBackground: string;
}): CSSProperties {
  const t = ASSISTANT_READING_COMFORT_TOKENS.input;
  return {
    flexShrink: 0,
    display: "flex",
    gap: t.gap,
    alignItems: "stretch",
    padding: `${t.paddingY}px ${t.paddingX}px`,
    borderTop: `1px solid ${theme.shellBorder}`,
    background: theme.shellBackground,
  };
}

export function resolveAssistantMessageInputFieldStyle(theme: {
  controlBorder: string;
  controlBackground: string;
  text: string;
}): CSSProperties {
  const t = ASSISTANT_READING_COMFORT_TOKENS.input;
  return {
    flex: 1,
    minWidth: 0,
    resize: "none",
    borderRadius: 10,
    border: `1px solid ${theme.controlBorder}`,
    background: theme.controlBackground,
    color: theme.text,
    fontSize: t.fontSize,
    fontWeight: 500,
    padding: `${t.fieldPaddingY}px ${t.fieldPaddingX}px`,
    lineHeight: t.lineHeight,
  };
}

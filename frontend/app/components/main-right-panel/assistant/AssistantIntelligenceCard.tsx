"use client";

import React from "react";

import type { AssistantIntelligenceCardModel } from "../../../lib/assistant/assistantIntelligenceCardsContract";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";

export type AssistantIntelligenceCardProps = Readonly<{
  card: AssistantIntelligenceCardModel;
  themeMode?: NexoraHudThemeMode;
  onAction?: (card: AssistantIntelligenceCardModel) => void;
}>;

function resolveToneColor(
  tone: AssistantIntelligenceCardModel["tone"],
  theme: ReturnType<typeof useSceneHudTheme>
): string {
  if (tone === "risk") return theme.critical;
  if (tone === "recommendation") return theme.success;
  if (tone === "scenario") return theme.warning;
  if (tone === "insight") return theme.accent;
  return theme.textMuted;
}

function resolveBadgeStyle(
  badgeTone: AssistantIntelligenceCardModel["badgeTone"],
  theme: ReturnType<typeof useSceneHudTheme>
): React.CSSProperties {
  const color =
    badgeTone === "danger"
      ? theme.critical
      : badgeTone === "success"
        ? theme.success
        : badgeTone === "warning"
          ? theme.warning
          : badgeTone === "info"
            ? theme.accent
            : theme.textMuted;
  return {
    flexShrink: 0,
    borderRadius: 999,
    border: `1px solid ${color}55`,
    background: `${color}16`,
    color,
    padding: "2px 6px",
    fontSize: 9,
    fontWeight: 800,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };
}

export function AssistantIntelligenceCard(
  props: AssistantIntelligenceCardProps
): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const accent = resolveToneColor(props.card.tone, theme);

  return (
    <article
      data-nx="assistant-intelligence-card"
      data-card-id={props.card.id}
      style={{
        flex: "1 1 154px",
        minWidth: 148,
        maxWidth: 230,
        minHeight: 88,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "8px 9px",
        borderRadius: 8,
        border: `1px solid ${theme.shellBorder}`,
        background: theme.panelBackground,
        color: theme.text,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: 18,
            height: 18,
            borderRadius: 6,
            display: "grid",
            placeItems: "center",
            border: `1px solid ${accent}66`,
            background: `${accent}18`,
            color: accent,
            fontSize: 10,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {props.card.icon}
        </span>
        <strong
          style={{
            minWidth: 0,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 11,
            fontWeight: 850,
          }}
        >
          {props.card.title}
        </strong>
        {props.card.badge ? (
          <span style={resolveBadgeStyle(props.card.badgeTone, theme)}>{props.card.badge}</span>
        ) : null}
      </div>
      <div
        title={props.card.detail}
        style={{
          minHeight: 30,
          color: theme.text,
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1.34,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {props.card.summary}
      </div>
      <button
        type="button"
        onClick={() => props.onAction?.(props.card)}
        style={{
          alignSelf: "flex-start",
          marginTop: "auto",
          minHeight: 22,
          borderRadius: 7,
          border: `1px solid ${theme.controlBorder}`,
          background: theme.controlBackground,
          color: accent,
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 850,
          padding: "3px 8px",
          lineHeight: 1.2,
        }}
      >
        {props.card.action.label}
      </button>
    </article>
  );
}

export default AssistantIntelligenceCard;

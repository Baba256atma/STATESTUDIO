"use client";

import React from "react";

import type { AssistantIntelligenceCardModel } from "../../../lib/assistant/assistantIntelligenceCardsContract";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import { AssistantIntelligenceCard } from "./AssistantIntelligenceCard";

export type AssistantIntelligenceCardsSurfaceProps = Readonly<{
  cards: readonly AssistantIntelligenceCardModel[];
  themeMode?: NexoraHudThemeMode;
  onAction?: (card: AssistantIntelligenceCardModel) => void;
}>;

export function AssistantIntelligenceCardsSurface(
  props: AssistantIntelligenceCardsSurfaceProps
): React.ReactElement | null {
  const theme = useSceneHudTheme(props.themeMode);
  const cards = props.cards.slice(0, 4);

  if (cards.length === 0) return null;

  return (
    <section
      data-nx="assistant-intelligence-cards-surface"
      aria-label="Assistant intelligence briefing"
      style={{
        flexShrink: 0,
        display: "flex",
        gap: 8,
        padding: "8px 10px",
        borderBottom: `1px solid ${theme.shellBorder}`,
        background: theme.shellBackground,
        overflowX: "auto",
        overflowY: "hidden",
        maxHeight: 124,
        boxSizing: "border-box",
        scrollbarWidth: "thin",
      }}
    >
      {cards.map((card) => (
        <AssistantIntelligenceCard
          key={card.id}
          card={card}
          themeMode={props.themeMode}
          onAction={props.onAction}
        />
      ))}
    </section>
  );
}

export default AssistantIntelligenceCardsSurface;

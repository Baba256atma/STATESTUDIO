"use client";

import type React from "react";

import type { AssistantActionCardModel } from "../../lib/assistant-bridge/assistantActionCardContract";
import { nx, softCardStyle } from "../ui/nexoraTheme";

export type ExecutiveActionCardProps = {
  card: AssistantActionCardModel;
  disabled?: boolean;
  onLaunch: (card: AssistantActionCardModel) => void;
};

export function ExecutiveActionCard(props: ExecutiveActionCardProps): React.ReactElement {
  const { card } = props;
  const isComingSoon = card.status === "coming_soon" || props.disabled;

  return (
    <article
      data-nx="executive-action-card"
      data-nx-action-card-id={card.id}
      data-nx-action-card-status={card.status}
      style={{
        ...softCardStyle,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        border: `1px solid ${isComingSoon ? nx.borderSoft : nx.border}`,
        background: isComingSoon ? "rgba(2,6,23,0.22)" : nx.bgElevated,
        opacity: isComingSoon ? 0.78 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 750, lineHeight: 1.25 }}>{card.title}</div>
          {card.confidenceLabel ? (
            <div style={{ marginTop: 4, color: nx.lowMuted, fontSize: 10, fontWeight: 650 }}>
              {card.confidenceLabel}
            </div>
          ) : null}
        </div>
        {isComingSoon ? (
          <span
            style={{
              flexShrink: 0,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            Soon
          </span>
        ) : null}
      </div>

      <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.45 }}>{card.description}</div>

      <button
        type="button"
        disabled={isComingSoon}
        aria-disabled={isComingSoon}
        onClick={() => props.onLaunch(card)}
        style={{
          alignSelf: "flex-start",
          minHeight: 30,
          padding: "0 12px",
          borderRadius: 8,
          border: isComingSoon ? `1px solid ${nx.borderSoft}` : `1px solid rgba(56,189,248,0.35)`,
          background: isComingSoon ? "rgba(2,6,23,0.24)" : "rgba(56,189,248,0.12)",
          color: isComingSoon ? nx.lowMuted : nx.text,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.02em",
          cursor: isComingSoon ? "not-allowed" : "pointer",
        }}
      >
        {card.launchLabel}
      </button>
    </article>
  );
}

export default ExecutiveActionCard;

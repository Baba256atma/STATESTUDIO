"use client";

import React, { useCallback } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { ExecutiveRecommendationCardView } from "../../lib/dashboard/executiveBriefing/executiveBriefingContract";
import {
  EXECUTIVE_RECOMMENDATION_CONFIDENCE_LABELS,
  EXECUTIVE_RECOMMENDATION_TYPE_LABELS,
} from "../../lib/dashboard/executiveBriefing/executiveBriefingContract";
import {
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

const TYPE_ACCENT: Readonly<Record<ExecutiveRecommendationCardView["recommendationType"], string>> =
  Object.freeze({
    attention: nx.warning,
    opportunity: nx.accent,
    risk: nx.risk,
    insight: nx.textSoft,
    follow_up: nx.muted,
  });

export type ExecutiveRecommendationCardProps = Readonly<{
  card: ExecutiveRecommendationCardView;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}>;

export function ExecutiveRecommendationCard(props: ExecutiveRecommendationCardProps): React.ReactElement {
  const { card } = props;
  const canLaunch = card.launchable && card.actionKind === "workspace_launch";

  const handleAction = useCallback(() => {
    if (!canLaunch || !card.suggestedWorkspaceId || !props.onWorkspaceLaunch) return;
    props.onWorkspaceLaunch(card.suggestedWorkspaceId);
  }, [canLaunch, card.suggestedWorkspaceId, props.onWorkspaceLaunch]);

  return (
    <article
      data-nx="executive-recommendation-card"
      data-recommendation-id={card.id}
      data-recommendation-type={card.recommendationType}
      data-confidence={card.confidence}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${nx.border}`,
        background: nx.bgElevated,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div
          style={{
            ...dashboardVisualTypography.cardTitle,
            color: nx.text,
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {card.title}
        </div>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 999,
            border: `1px solid ${nx.borderSoft}`,
            background: nx.bgControl,
            color: TYPE_ACCENT[card.recommendationType],
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {EXECUTIVE_RECOMMENDATION_TYPE_LABELS[card.recommendationType]}
        </span>
      </div>

      <p style={{ margin: 0, color: nx.textSoft, fontSize: 12, lineHeight: 1.5 }}>{card.summary}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Confidence
        </div>
        <div style={{ color: nx.text, fontSize: 12, fontWeight: 600 }}>
          {EXECUTIVE_RECOMMENDATION_CONFIDENCE_LABELS[card.confidence]}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Action
        </div>
        <button
          type="button"
          disabled={!canLaunch}
          onClick={handleAction}
          style={{
            alignSelf: "flex-start",
            padding: "6px 14px",
            borderRadius: 999,
            border: `1px solid ${canLaunch ? nx.navTileActiveBorder : nx.border}`,
            background: canLaunch ? nx.btnSecondaryBg : nx.bgControl,
            color: canLaunch ? nx.btnSecondaryText : nx.lowMuted,
            fontSize: 11,
            fontWeight: 700,
            cursor: canLaunch ? "pointer" : "not-allowed",
          }}
        >
          {card.suggestedActionLabel}
        </button>
      </div>
    </article>
  );
}

export default ExecutiveRecommendationCard;

"use client";

import React, { useCallback, useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { evaluateWorkspaceRecommendations } from "../../lib/workspaces/workspaceRecommendationEngine";
import type {
  WorkspaceQuickActionCardView,
  WorkspaceQuickActionPriority,
  WorkspaceRecommendationContext,
} from "../../lib/workspaces/workspaceRecommendationContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveWorkspaceRecommendationsProps = Readonly<{
  context?: WorkspaceRecommendationContext;
  onQuickActionLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}>;

const PRIORITY_COLORS: Readonly<Record<WorkspaceQuickActionPriority, string>> = Object.freeze({
  critical: nx.risk,
  high: nx.warning,
  normal: nx.accent,
  low: nx.muted,
});

function QuickActionCard(props: {
  card: WorkspaceQuickActionCardView;
  onLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}): React.ReactElement {
  const { card, onLaunch } = props;
  const canLaunch = card.launchable;

  const handleLaunch = useCallback(() => {
    if (!canLaunch || !onLaunch) return;
    onLaunch(card.suggestedWorkspaceId);
  }, [canLaunch, card.suggestedWorkspaceId, onLaunch]);

  return (
    <article
      data-nx="workspace-quick-action-card"
      data-workspace-id={card.suggestedWorkspaceId}
      data-priority={card.priority}
      data-signal={card.signal}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${nx.border}`,
        background: nx.bgElevated,
        minWidth: 0,
        flex: "1 1 220px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div
          style={{
            ...dashboardVisualTypography.cardTitle,
            color: nx.text,
            fontSize: 13,
            fontWeight: 700,
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
            color: PRIORITY_COLORS[card.priority],
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {card.priority}
        </span>
      </div>
      <p style={{ margin: 0, color: nx.textSoft, fontSize: 12, lineHeight: 1.45 }}>{card.description}</p>
      <p style={{ margin: 0, color: nx.lowMuted, fontSize: 11, lineHeight: 1.4 }}>
        {card.reason}
      </p>
      <div style={{ color: nx.muted, fontSize: 10, fontWeight: 600 }}>
        Suggested: {card.suggestedWorkspaceName}
      </div>
      <button
        type="button"
        disabled={!canLaunch}
        onClick={handleLaunch}
        style={{
          alignSelf: "flex-start",
          marginTop: 4,
          padding: "6px 12px",
          borderRadius: 999,
          border: `1px solid ${canLaunch ? nx.navTileActiveBorder : nx.border}`,
          background: canLaunch ? nx.btnSecondaryBg : nx.bgControl,
          color: canLaunch ? nx.btnSecondaryText : nx.lowMuted,
          fontSize: 11,
          fontWeight: 700,
          cursor: canLaunch ? "pointer" : "not-allowed",
        }}
      >
        {canLaunch ? "Open Workspace" : "Select Object First"}
      </button>
    </article>
  );
}

export function ExecutiveWorkspaceRecommendations(
  props: ExecutiveWorkspaceRecommendationsProps
): React.ReactElement {
  const recommendationState = useMemo(
    () => evaluateWorkspaceRecommendations(props.context ?? {}),
    [props.context]
  );

  const handleLaunch = props.onQuickActionLaunch;

  return (
    <section
      data-nx="executive-workspace-recommendations"
      data-context-signature={recommendationState.contextSignature}
      data-recommendation-count={recommendationState.recommendations.length}
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: `${dashboardVisualSpacing.sm}px ${dashboardVisualSpacing.md}px`,
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: dashboardVisualColors.surface,
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Executive Recommendations
        </div>
        <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
          What should I investigate next?
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Advisory guidance only — you choose when to open a workspace.
        </div>
      </header>

      {recommendationState.recommendations.length === 0 ? (
        <div
          style={{
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.muted,
            fontSize: 12,
          }}
        >
          No workspace recommendations for the current context.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: dashboardVisualSpacing.sm,
            paddingBottom: dashboardVisualSpacing.xs,
          }}
        >
          {recommendationState.recommendations.map((card) => (
            <QuickActionCard key={card.id} card={card} onLaunch={handleLaunch} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveWorkspaceRecommendations;

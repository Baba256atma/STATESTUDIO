"use client";

import React, { useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { buildExecutiveBriefingView } from "../../lib/dashboard/executiveBriefing/executiveBriefingRuntime";
import type { DashboardHomeSectionLayoutVariant } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTypes";
import { applyDashboardHomeSectionChrome } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import type { WorkspaceRecommendationContext } from "../../lib/workspaces/workspaceRecommendationContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { ExecutiveIntelligenceBriefingLayer } from "./ExecutiveIntelligenceBriefingLayer";
import { ExecutiveRecommendationCard } from "./ExecutiveRecommendationCard";

export type ExecutiveRecommendationsSurfaceProps = Readonly<{
  context?: WorkspaceRecommendationContext;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  sectionRef?: React.RefObject<HTMLElement | null>;
  layoutVariant?: DashboardHomeSectionLayoutVariant;
}>;

export function ExecutiveRecommendationsSurface(
  props: ExecutiveRecommendationsSurfaceProps
): React.ReactElement {
  const briefingView = useMemo(
    () => buildExecutiveBriefingView(props.context ?? {}),
    [props.context]
  );

  const layoutVariant = props.layoutVariant ?? "standalone";

  return (
    <section
      ref={props.sectionRef}
      id="dashboard-home-recommendations"
      data-nx="executive-recommendations-surface"
      data-section-id="recommendations_surface"
      data-recommendation-count={briefingView.recommendations.length}
      data-briefing-nominal={briefingView.briefing.isNominal ? "true" : "false"}
      style={applyDashboardHomeSectionChrome(layoutVariant, {
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: `${dashboardVisualSpacing.sm}px ${dashboardVisualSpacing.md}px`,
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: dashboardVisualColors.surface,
      })}
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
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Actionable intelligence items that deserve attention.
        </div>
      </header>

      <ExecutiveIntelligenceBriefingLayer briefing={briefingView.briefing} />

      {!briefingView.briefing.isNominal ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
            gap: dashboardVisualSpacing.sm,
          }}
        >
          {briefingView.recommendations.map((card) => (
            <ExecutiveRecommendationCard
              key={card.id}
              card={card}
              onWorkspaceLaunch={props.onWorkspaceLaunch}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ExecutiveRecommendationsSurface;

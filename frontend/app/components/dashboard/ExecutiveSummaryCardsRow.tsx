"use client";

import React, { useMemo, useSyncExternalStore } from "react";

import type { DashboardHomeSummaryLayerInput } from "../../lib/dashboard/executiveSummaryLayerContract";
import { buildExecutiveSummaryLayerView } from "../../lib/dashboard/executiveSummaryLayerRuntime";
import {
  getWorkspaceFavoritesServerSnapshot,
  getWorkspaceFavoritesSnapshot,
  subscribeWorkspaceFavorites,
} from "../../lib/workspaces/workspaceFavoritesRegistry";
import type { DashboardHomeSectionLayoutVariant } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTypes";
import { buildDashboardHomeZoneChildSectionStyle } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { ExecutiveSummaryCard } from "./ExecutiveSummaryCard";

export type ExecutiveSummaryCardsRowProps = DashboardHomeSummaryLayerInput & {
  layoutVariant?: DashboardHomeSectionLayoutVariant;
};

function useFavoritesCount(): number {
  const snapshot = useSyncExternalStore(
    subscribeWorkspaceFavorites,
    getWorkspaceFavoritesSnapshot,
    getWorkspaceFavoritesServerSnapshot
  );
  return snapshot.items.length;
}

export function ExecutiveSummaryCardsRow(props: ExecutiveSummaryCardsRowProps): React.ReactElement {
  const favoritesCount = useFavoritesCount();
  const layoutVariant = props.layoutVariant ?? "standalone";

  const summaryView = useMemo(
    () =>
      buildExecutiveSummaryLayerView({
        ...props,
        favoritesCount,
      }),
    [
      props.activeWorkspaceId,
      props.dashboardMode,
      props.recommendationContext,
      props.recentsContext,
      props.selectedObjectId,
      props.selectedObjectLabel,
      props.selectedObjectStatus,
      props.selectedObjectType,
      favoritesCount,
    ]
  );

  return (
    <section
      data-nx="executive-summary-cards-row"
      data-section-id="executive_summary"
      data-card-count={summaryView.cards.length}
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding:
          layoutVariant === "zone-child"
            ? `${dashboardVisualSpacing.sm}px 0`
            : `${dashboardVisualSpacing.md}px ${dashboardVisualSpacing.md}px ${dashboardVisualSpacing.sm}px`,
        borderBottom: layoutVariant === "zone-child" ? "none" : `1px solid ${nx.borderSoft}`,
        background: layoutVariant === "zone-child" ? "transparent" : dashboardVisualColors.surface,
        ...buildDashboardHomeZoneChildSectionStyle(layoutVariant),
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
          Executive Summary
        </div>
        <div style={{ color: nx.text, fontSize: 15, fontWeight: 700 }}>
          System state at a glance
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
          gap: dashboardVisualSpacing.sm,
        }}
      >
        {summaryView.cards.map((card) => (
          <ExecutiveSummaryCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

export default ExecutiveSummaryCardsRow;

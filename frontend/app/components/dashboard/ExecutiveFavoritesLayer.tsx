"use client";

import React, { useCallback, useMemo, useSyncExternalStore } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { ExecutiveFavoriteCardView } from "../../lib/dashboard/executiveFavoritesLayer/executiveFavoritesLayerContract";
import { buildExecutiveFavoritesLayerView } from "../../lib/dashboard/executiveFavoritesLayer/executiveFavoritesLayerRuntime";
import type { DashboardHomeSectionLayoutVariant } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTypes";
import { applyDashboardHomeSectionChrome } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import {
  getWorkspaceFavoritesSnapshot,
  getWorkspaceFavoritesServerSnapshot,
  subscribeWorkspaceFavorites,
  validatePinnedActionLaunch,
} from "../../lib/workspaces/workspaceFavoritesRegistry";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { ExecutiveFavoriteCard } from "./ExecutiveFavoriteCard";

export type ExecutiveFavoritesLayerProps = Readonly<{
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  onFavoriteOpen?: (workspaceId: ExecutiveWorkspaceId) => void;
  layoutVariant?: DashboardHomeSectionLayoutVariant;
}>;

function useFavoritesSnapshot() {
  return useSyncExternalStore(
    subscribeWorkspaceFavorites,
    getWorkspaceFavoritesSnapshot,
    getWorkspaceFavoritesServerSnapshot
  );
}

export function ExecutiveFavoritesLayer(props: ExecutiveFavoritesLayerProps): React.ReactElement {
  const favoritesSnapshot = useFavoritesSnapshot();
  const selectedObjectId = props.selectedObjectId?.trim() || null;
  const activeWorkspaceId = props.activeWorkspaceId ?? null;

  const layerView = useMemo(
    () =>
      buildExecutiveFavoritesLayerView({
        snapshot: favoritesSnapshot,
        activeWorkspaceId,
        selectedObjectId,
      }),
    [activeWorkspaceId, favoritesSnapshot, selectedObjectId]
  );

  const handleQuickOpen = useCallback(
    (card: ExecutiveFavoriteCardView) => {
      const attempt = validatePinnedActionLaunch({
        favoriteId: card.sourceFavoriteId,
        activeWorkspaceId,
        selectedObjectId,
      });
      if (!attempt.approved || !attempt.workspaceId || !props.onFavoriteOpen) return;
      props.onFavoriteOpen(attempt.workspaceId);
    },
    [activeWorkspaceId, props.onFavoriteOpen, selectedObjectId]
  );

  const layoutVariant = props.layoutVariant ?? "standalone";

  return (
    <section
      data-nx="executive-favorites-layer"
      data-section-id="favorites_layer"
      data-favorite-count={layerView.favorites.length}
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
          Favorites
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Executive-prioritized items — display and access only.
        </div>
      </header>

      {layerView.favorites.length === 0 ? (
        <div
          data-nx="executive-favorites-empty-state"
          style={{
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.textSoft,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          No favorites available.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
            gap: dashboardVisualSpacing.sm,
          }}
        >
          {layerView.favorites.map((card) => (
            <ExecutiveFavoriteCard key={card.id} card={card} onQuickOpen={handleQuickOpen} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveFavoritesLayer;

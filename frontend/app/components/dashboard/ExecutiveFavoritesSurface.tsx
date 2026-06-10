"use client";

import React, { useCallback, useMemo, useSyncExternalStore } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import {
  buildPinnedActionDisplayTitle,
  type PinnedWorkspaceAction,
} from "../../lib/workspaces/workspaceFavoritesContract";
import {
  getWorkspaceFavoritesSnapshot,
  getWorkspaceFavoritesServerSnapshot,
  listPinCandidateWorkspaceIds,
  pinWorkspaceAction,
  renameWorkspaceFavoriteLabel,
  reorderWorkspaceFavorite,
  restoreDefaultWorkspaceFavorites,
  resetWorkspaceFavorites,
  subscribeWorkspaceFavorites,
  unpinWorkspaceAction,
  validatePinnedActionLaunch,
  previewPinnedActionLaunch,
} from "../../lib/workspaces/workspaceFavoritesRegistry";
import { getExecutiveWorkspaceEntry } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveFavoritesSurfaceProps = Readonly<{
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  onFavoriteLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}>;

function useFavoritesState() {
  return useSyncExternalStore(
    subscribeWorkspaceFavorites,
    getWorkspaceFavoritesSnapshot,
    getWorkspaceFavoritesServerSnapshot
  );
}

function PinnedFavoriteCard(props: {
  item: PinnedWorkspaceAction;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  selectedObjectId: string | null;
  onLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}): React.ReactElement {
  const { item, activeWorkspaceId, selectedObjectId, onLaunch } = props;
  const displayTitle = buildPinnedActionDisplayTitle(item);
  const isActive = item.workspaceTarget === activeWorkspaceId;

  const validation = useMemo(
    () =>
      previewPinnedActionLaunch({
        favoriteId: item.id,
        activeWorkspaceId,
        selectedObjectId,
      }),
    [item.id, activeWorkspaceId, selectedObjectId]
  );

  const canLaunch = validation.approved;

  const handleLaunch = useCallback(() => {
    if (!canLaunch || !validation.workspaceId || !onLaunch) return;
    const attempt = validatePinnedActionLaunch({
      favoriteId: item.id,
      activeWorkspaceId,
      selectedObjectId,
    });
    if (!attempt.approved || !attempt.workspaceId) return;
    onLaunch(attempt.workspaceId);
  }, [activeWorkspaceId, canLaunch, item.id, onLaunch, selectedObjectId, validation.workspaceId]);

  const handleUnpin = useCallback(() => {
    unpinWorkspaceAction(item.id);
  }, [item.id]);

  const handleMoveUp = useCallback(() => {
    reorderWorkspaceFavorite({ favoriteId: item.id, direction: "up" });
  }, [item.id]);

  const handleMoveDown = useCallback(() => {
    reorderWorkspaceFavorite({ favoriteId: item.id, direction: "down" });
  }, [item.id]);

  const handleRename = useCallback(() => {
    const next = globalThis.prompt?.("Rename favorite label (optional):", item.customLabel ?? item.title);
    if (next === null) return;
    renameWorkspaceFavoriteLabel({ favoriteId: item.id, customLabel: next });
  }, [item.customLabel, item.id, item.title]);

  return (
    <article
      data-nx="pinned-favorite-card"
      data-favorite-id={item.id}
      data-workspace-id={item.workspaceTarget ?? undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${isActive ? nx.navTileActiveBorder : nx.border}`,
        background: isActive ? nx.navTileActiveBg : nx.bgElevated,
        minWidth: 0,
        flex: "1 1 200px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <div style={{ ...dashboardVisualTypography.cardTitle, color: nx.text, fontSize: 13, fontWeight: 700 }}>
          {displayTitle}
        </div>
        <span style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
          {item.actionType}
        </span>
      </div>
      <p style={{ margin: 0, color: nx.textSoft, fontSize: 11, lineHeight: 1.4 }}>{item.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button type="button" disabled={!canLaunch} onClick={handleLaunch} style={actionButtonStyle(canLaunch)}>
          {isActive ? "Active" : canLaunch ? "Launch" : "Unavailable"}
        </button>
        <button type="button" onClick={handleUnpin} style={secondaryButtonStyle}>
          Unpin
        </button>
        <button type="button" onClick={handleMoveUp} style={secondaryButtonStyle}>
          ↑
        </button>
        <button type="button" onClick={handleMoveDown} style={secondaryButtonStyle}>
          ↓
        </button>
        <button type="button" onClick={handleRename} style={secondaryButtonStyle}>
          Rename
        </button>
      </div>
    </article>
  );
}

function actionButtonStyle(enabled: boolean): React.CSSProperties {
  return {
    padding: "5px 10px",
    borderRadius: 999,
    border: `1px solid ${enabled ? nx.navTileActiveBorder : nx.border}`,
    background: enabled ? nx.btnPrimaryBg : nx.bgControl,
    color: enabled ? nx.btnPrimaryText : nx.lowMuted,
    fontSize: 10,
    fontWeight: 700,
    cursor: enabled ? "pointer" : "not-allowed",
  };
}

const secondaryButtonStyle: React.CSSProperties = {
  padding: "5px 8px",
  borderRadius: 999,
  border: `1px solid ${nx.border}`,
  background: nx.bgControl,
  color: nx.textSoft,
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};

export function ExecutiveFavoritesSurface(props: ExecutiveFavoritesSurfaceProps): React.ReactElement {
  const favoritesState = useFavoritesState();
  const activeWorkspaceId = props.activeWorkspaceId ?? null;
  const selectedObjectId = props.selectedObjectId?.trim() || null;
  const pinCandidates = useMemo(() => listPinCandidateWorkspaceIds(), [favoritesState.updatedAt]);

  const handlePin = useCallback((workspaceId: ExecutiveWorkspaceId) => {
    pinWorkspaceAction({ workspaceId });
  }, []);

  const handleRestoreDefaults = useCallback(() => {
    restoreDefaultWorkspaceFavorites();
  }, []);

  const handleReset = useCallback(() => {
    resetWorkspaceFavorites();
  }, []);

  return (
    <section
      data-nx="executive-favorites-surface"
      data-favorite-count={favoritesState.items.length}
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
          Executive Favorites
        </div>
        <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
          What matters often
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Pinned by you — Nexora never auto-pins or auto-launches favorites.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
          <button type="button" onClick={handleRestoreDefaults} style={secondaryButtonStyle}>
            Restore Defaults
          </button>
          <button type="button" onClick={handleReset} style={secondaryButtonStyle}>
            Reset Favorites
          </button>
          {pinCandidates.map((workspaceId) => {
            const entry = getExecutiveWorkspaceEntry(workspaceId);
            return (
              <button
                key={workspaceId}
                type="button"
                onClick={() => handlePin(workspaceId)}
                style={secondaryButtonStyle}
              >
                Pin {entry.name}
              </button>
            );
          })}
        </div>
      </header>

      {favoritesState.items.length === 0 ? (
        <div
          style={{
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.muted,
            fontSize: 12,
          }}
        >
          No pinned favorites yet. Pin a workspace or restore defaults.
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: dashboardVisualSpacing.sm }}>
          {favoritesState.items.map((item) => (
            <PinnedFavoriteCard
              key={item.id}
              item={item}
              activeWorkspaceId={activeWorkspaceId}
              selectedObjectId={selectedObjectId}
              onLaunch={props.onFavoriteLaunch}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveFavoritesSurface;

"use client";

import React, { useCallback, useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import {
  buildWorkspaceRecentsView,
  previewRecentReturnPath,
  validateRecentReturnPath,
} from "../../lib/workspaces/workspaceRecentsRegistry";
import type {
  WorkspaceRecentItemView,
  WorkspaceRecentReturnKind,
  WorkspaceRecentsContextInput,
} from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveWorkspaceRecentsSurfaceProps = Readonly<{
  context?: WorkspaceRecentsContextInput;
  onRecentReturn?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
}>;

function RecentItemCard(props: {
  item: WorkspaceRecentItemView;
  selectedObjectId: string | null;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  onReturn?: ExecutiveWorkspaceRecentsSurfaceProps["onRecentReturn"];
}): React.ReactElement {
  const validation = useMemo(
    () =>
      previewRecentReturnPath({
        workspaceId: props.item.workspaceId,
        activeWorkspaceId: props.activeWorkspaceId,
        selectedObjectId: props.selectedObjectId,
      }),
    [props.activeWorkspaceId, props.item.workspaceId, props.selectedObjectId]
  );

  const canReturn = validation.approved && validation.returnKind !== null;

  const handleReturn = useCallback(() => {
    if (!canReturn || !validation.returnKind || !props.onReturn) return;
    const attempt = validateRecentReturnPath({
      workspaceId: props.item.workspaceId,
      activeWorkspaceId: props.activeWorkspaceId,
      selectedObjectId: props.selectedObjectId,
    });
    if (!attempt.approved || !attempt.returnKind) return;
    props.onReturn({
      workspaceId: props.item.workspaceId,
      returnKind: attempt.returnKind,
    });
  }, [
    canReturn,
    props.activeWorkspaceId,
    props.item.workspaceId,
    props.onReturn,
    props.selectedObjectId,
    validation.returnKind,
  ]);

  return (
    <article
      data-nx="workspace-recent-item"
      data-workspace-id={props.item.workspaceId}
      data-activity-type={props.item.activityType}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${props.item.isActive ? nx.navTileActiveBorder : nx.border}`,
        background: props.item.isActive ? nx.navTileActiveBg : nx.bgElevated,
        minWidth: 0,
        flex: "1 1 220px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <div style={{ ...dashboardVisualTypography.cardTitle, color: nx.text, fontSize: 13, fontWeight: 700 }}>
          {props.item.workspaceName}
        </div>
        {props.item.isBackStackHead ? (
          <span style={{ color: nx.accent, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
            Back
          </span>
        ) : null}
      </div>
      <p style={{ margin: 0, color: nx.textSoft, fontSize: 12, lineHeight: 1.45 }}>
        {props.item.contextSummary}
      </p>
      <div style={{ color: nx.lowMuted, fontSize: 10 }}>
        {new Date(props.item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        {" · "}
        {props.item.activityType.replace(/_/g, " ")}
      </div>
      <button
        type="button"
        disabled={!canReturn}
        onClick={handleReturn}
        style={{
          alignSelf: "flex-start",
          marginTop: 4,
          padding: "6px 12px",
          borderRadius: 999,
          border: `1px solid ${canReturn ? nx.navTileActiveBorder : nx.border}`,
          background: canReturn ? nx.btnSecondaryBg : nx.bgControl,
          color: canReturn ? nx.btnSecondaryText : nx.lowMuted,
          fontSize: 11,
          fontWeight: 700,
          cursor: canReturn ? "pointer" : "not-allowed",
        }}
      >
        {props.item.isActive
          ? "Current"
          : validation.returnKind === "back_via_history"
            ? "Return (Back)"
            : canReturn
              ? "Return"
              : "Unavailable"}
      </button>
    </article>
  );
}

export function ExecutiveWorkspaceRecentsSurface(
  props: ExecutiveWorkspaceRecentsSurfaceProps
): React.ReactElement {
  const recentsState = useMemo(
    () => buildWorkspaceRecentsView(props.context ?? {}),
    [props.context]
  );

  const selectedObjectId = props.context?.selectedObjectId?.trim() || null;
  const activeWorkspaceId = props.context?.activeWorkspaceId ?? recentsState.currentWorkspaceId;

  return (
    <section
      data-nx="executive-workspace-recents"
      data-recent-count={recentsState.items.length}
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
          Executive Recents
        </div>
        <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
          What was I doing?
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Investigative trail from navigation history — read-only, controller-governed returns.
        </div>
        {recentsState.backStack.length > 0 ? (
          <div style={{ color: nx.muted, fontSize: 10 }}>
            Back stack: {recentsState.backStack.join(" → ")}
          </div>
        ) : null}
      </header>

      {recentsState.items.length === 0 ? (
        <div
          style={{
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.muted,
            fontSize: 12,
          }}
        >
          No recent workspace activity yet. Launch a workspace to begin your trail.
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: dashboardVisualSpacing.sm }}>
          {recentsState.items.map((item) => (
            <RecentItemCard
              key={item.id}
              item={item}
              selectedObjectId={selectedObjectId}
              activeWorkspaceId={activeWorkspaceId}
              onReturn={props.onRecentReturn}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveWorkspaceRecentsSurface;

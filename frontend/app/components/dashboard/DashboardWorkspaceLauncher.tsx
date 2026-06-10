"use client";

import React, { useCallback, useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import {
  buildWorkspaceLauncherState,
} from "../../lib/dashboard/workspaceLauncher/workspaceLauncherRuntime";
import type { WorkspaceLauncherStateView } from "../../lib/dashboard/workspaceLauncher/workspaceLauncherContract";
import type { WorkspaceLauncherCardView } from "../../lib/dashboard/workspaceLauncher/workspaceLauncherContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type DashboardWorkspaceLauncherProps = Readonly<{
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  onLaunchRequest?: (workspaceId: ExecutiveWorkspaceId) => void;
}>;

function WorkspaceLauncherCard(props: {
  card: WorkspaceLauncherCardView;
  disabled: boolean;
  onLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
}): React.ReactElement {
  const { card, disabled, onLaunch } = props;
  const canLaunch = card.launchable && !card.isActive && !disabled;

  const handleLaunch = useCallback(() => {
    if (!canLaunch || !onLaunch) return;
    onLaunch(card.workspaceId);
  }, [canLaunch, card.workspaceId, onLaunch]);

  return (
    <article
      data-nx="workspace-launcher-card"
      data-workspace-id={card.workspaceId}
      data-workspace-status={card.status}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${card.isActive ? nx.navTileActiveBorder : nx.border}`,
        background: card.isActive ? nx.navTileActiveBg : nx.bgElevated,
        minWidth: 0,
        flex: "1 1 180px",
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
          {card.name}
        </div>
        {card.badge ? (
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              border: `1px solid ${nx.borderSoft}`,
              background: nx.bgControl,
              color: card.isActive ? nx.accent : nx.muted,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {card.badge}
          </span>
        ) : null}
      </div>
      <p
        style={{
          margin: 0,
          color: nx.textSoft,
          fontSize: 12,
          lineHeight: 1.45,
        }}
      >
        {card.description}
      </p>
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
          background: canLaunch ? nx.btnPrimaryBg : nx.bgControl,
          color: canLaunch ? nx.btnPrimaryText : nx.lowMuted,
          fontSize: 11,
          fontWeight: 700,
          cursor: canLaunch ? "pointer" : "not-allowed",
        }}
      >
        {card.isActive ? "Active" : card.launchable ? "Launch" : "Unavailable"}
      </button>
    </article>
  );
}

function LauncherStatusRow(props: {
  label: string;
  value: string | null;
}): React.ReactElement | null {
  if (!props.value) return null;
  return (
    <div style={{ display: "flex", gap: 8, fontSize: 11, color: nx.textSoft }}>
      <span style={{ color: nx.lowMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {props.label}
      </span>
      <span style={{ color: nx.text, fontWeight: 600 }}>{props.value}</span>
    </div>
  );
}

export function DashboardWorkspaceLauncher(props: DashboardWorkspaceLauncherProps): React.ReactElement {
  const launcherState: WorkspaceLauncherStateView = useMemo(
    () => buildWorkspaceLauncherState(props.activeWorkspaceId ?? null),
    [props.activeWorkspaceId]
  );

  const objectRequired = !props.selectedObjectId?.trim();
  const handleLaunch = props.onLaunchRequest;

  return (
    <section
      data-nx="dashboard-workspace-launcher"
      data-active-workspace={launcherState.activeWorkspaceId ?? undefined}
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: `${dashboardVisualSpacing.md}px ${dashboardVisualSpacing.md}px 0`,
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: dashboardVisualColors.surface,
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            ...dashboardVisualTypography.cardTitle,
            color: nx.lowMuted,
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Executive Workspaces
        </div>
        <div style={{ color: nx.text, fontSize: 14, fontWeight: 700 }}>
          What can I do next?
        </div>
        <LauncherStatusRow label="Active" value={launcherState.activeWorkspaceName} />
        <LauncherStatusRow label="Recent" value={launcherState.recentWorkspaceName} />
        {objectRequired ? (
          <div style={{ color: nx.warning, fontSize: 11, fontWeight: 600 }}>
            Select a scene object to launch object-scoped workspaces.
          </div>
        ) : null}
      </header>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: dashboardVisualSpacing.sm,
          paddingBottom: dashboardVisualSpacing.md,
        }}
      >
        {launcherState.cards.map((card) => (
          <WorkspaceLauncherCard
            key={card.workspaceId}
            card={card}
            disabled={objectRequired && card.launchable}
            onLaunch={handleLaunch}
          />
        ))}
      </div>
    </section>
  );
}

export default DashboardWorkspaceLauncher;

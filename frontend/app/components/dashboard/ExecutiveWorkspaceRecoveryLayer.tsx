"use client";

import React, { useCallback, useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { buildExecutiveWorkspaceRecoveryView } from "../../lib/dashboard/executiveRecovery/executiveRecoveryRuntime";
import type { DashboardHomeSectionLayoutVariant } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTypes";
import { applyDashboardHomeSectionChrome } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import type { WorkspaceRecentsContextInput } from "../../lib/workspaces/workspaceRecentsContract";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { ExecutiveRecoveryCard } from "./ExecutiveRecoveryCard";

export type ExecutiveWorkspaceRecoveryLayerProps = Readonly<{
  context?: WorkspaceRecentsContextInput;
  onRecoveryResume?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
  layoutVariant?: DashboardHomeSectionLayoutVariant;
}>;

export function ExecutiveWorkspaceRecoveryLayer(
  props: ExecutiveWorkspaceRecoveryLayerProps
): React.ReactElement {
  const recoveryView = useMemo(
    () => buildExecutiveWorkspaceRecoveryView(props.context ?? {}),
    [props.context]
  );

  const handleResume = useCallback(
    (input: { workspaceId: ExecutiveWorkspaceId; returnKind: WorkspaceRecentReturnKind }) => {
      props.onRecoveryResume?.(input);
    },
    [props.onRecoveryResume]
  );

  const layoutVariant = props.layoutVariant ?? "standalone";

  return (
    <section
      data-nx="executive-workspace-recovery-layer"
      data-section-id="workspace_recovery"
      data-recovery-count={recoveryView.entries.length}
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
          Workspace Recovery
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Resume interrupted work — resumable contexts only.
        </div>
      </header>

      {recoveryView.entries.length === 0 ? (
        <div
          data-nx="executive-recovery-empty-state"
          style={{
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.textSoft,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          No recoverable workspace context found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
            gap: dashboardVisualSpacing.sm,
          }}
        >
          {recoveryView.entries.map((entry) => (
            <ExecutiveRecoveryCard key={entry.id} entry={entry} onResume={handleResume} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveWorkspaceRecoveryLayer;

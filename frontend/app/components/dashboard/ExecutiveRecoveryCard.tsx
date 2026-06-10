"use client";

import React, { useCallback } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { ExecutiveRecoveryEntryView } from "../../lib/dashboard/executiveRecovery/executiveRecoveryContract";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveRecoveryCardProps = Readonly<{
  entry: ExecutiveRecoveryEntryView;
  onResume?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
}>;

export function ExecutiveRecoveryCard(props: ExecutiveRecoveryCardProps): React.ReactElement {
  const { entry } = props;

  const handleResume = useCallback(() => {
    if (!entry.resumeEnabled || !entry.returnKind || !props.onResume) return;
    props.onResume({
      workspaceId: entry.workspaceId,
      returnKind: entry.returnKind,
    });
  }, [entry.resumeEnabled, entry.returnKind, entry.workspaceId, props.onResume]);

  return (
    <article
      data-nx="executive-recovery-card"
      data-recovery-id={entry.id}
      data-recovery-kind={entry.recoveryKind}
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
      <div
        style={{
          ...dashboardVisualTypography.cardTitle,
          color: nx.text,
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1.35,
        }}
      >
        {entry.activityName}
      </div>

      <div style={{ color: nx.textSoft, fontSize: 12 }}>{entry.workspaceType}</div>
      <div style={{ color: nx.lowMuted, fontSize: 11 }}>{entry.timestampLabel}</div>

      <button
        type="button"
        disabled={!entry.resumeEnabled}
        onClick={handleResume}
        style={{
          alignSelf: "flex-start",
          marginTop: 2,
          padding: "6px 14px",
          borderRadius: 999,
          border: `1px solid ${entry.resumeEnabled ? nx.navTileActiveBorder : nx.border}`,
          background: entry.resumeEnabled ? nx.btnSecondaryBg : nx.bgControl,
          color: entry.resumeEnabled ? nx.btnSecondaryText : nx.lowMuted,
          fontSize: 11,
          fontWeight: 700,
          cursor: entry.resumeEnabled ? "pointer" : "not-allowed",
        }}
      >
        {entry.resumeActionLabel}
      </button>
    </article>
  );
}

export default ExecutiveRecoveryCard;

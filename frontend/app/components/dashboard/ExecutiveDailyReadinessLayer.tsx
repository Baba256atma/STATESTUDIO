"use client";

import React, { useCallback } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { DailyReadinessView } from "../../lib/dashboard/workspaceSnapshot/executiveWorkspaceSnapshotContract";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveDailyReadinessLayerProps = Readonly<{
  readiness: DailyReadinessView;
  onFocusRecommendations?: () => void;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  onResumeSession?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
}>;

const STATE_ACCENT: Readonly<Record<DailyReadinessView["state"], string>> = Object.freeze({
  ready: nx.accent,
  attention_recommended: nx.warning,
  review_pending: nx.text,
});

export function ExecutiveDailyReadinessLayer(
  props: ExecutiveDailyReadinessLayerProps
): React.ReactElement {
  const { readiness } = props;

  const handleAction = useCallback(
    (action: DailyReadinessView["actions"][number]) => {
      if (!action.enabled) return;

      switch (action.kind) {
        case "review_recommendations":
          props.onFocusRecommendations?.();
          break;
        case "resume_session":
          if (action.workspaceId && action.returnKind && props.onResumeSession) {
            props.onResumeSession({
              workspaceId: action.workspaceId,
              returnKind: action.returnKind,
            });
          }
          break;
        case "open_analyze":
          if (action.workspaceId && props.onWorkspaceLaunch) {
            props.onWorkspaceLaunch(action.workspaceId);
          }
          break;
        case "open_dashboard":
          break;
        default:
          break;
      }
    },
    [props.onFocusRecommendations, props.onResumeSession, props.onWorkspaceLaunch]
  );

  return (
    <div
      data-nx="executive-daily-readiness-layer"
      data-section-id="daily_readiness"
      data-readiness-state={readiness.state}
      style={{
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${nx.border}`,
        background: dashboardVisualColors.surface,
      }}
    >
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Daily Readiness
      </div>
      <div
        style={{
          color: STATE_ACCENT[readiness.state],
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {readiness.stateLabel}
      </div>
      <p
        style={{
          margin: 0,
          color: nx.textSoft,
          fontSize: 13,
          lineHeight: 1.55,
          maxWidth: 640,
        }}
      >
        {readiness.summary}
      </p>

      {readiness.actions.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: dashboardVisualSpacing.xs,
            marginTop: dashboardVisualSpacing.sm,
          }}
        >
          {readiness.actions.map((action) => (
            <button
              key={action.kind}
              type="button"
              disabled={!action.enabled || action.kind === "open_dashboard"}
              onClick={() => handleAction(action)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: `1px solid ${action.enabled && action.kind !== "open_dashboard" ? nx.navTileActiveBorder : nx.borderSoft}`,
                background:
                  action.enabled && action.kind !== "open_dashboard"
                    ? nx.btnSecondaryBg
                    : nx.bgControl,
                color:
                  action.enabled && action.kind !== "open_dashboard"
                    ? nx.btnSecondaryText
                    : nx.lowMuted,
                fontSize: 11,
                fontWeight: 700,
                cursor:
                  action.enabled && action.kind !== "open_dashboard" ? "pointer" : "default",
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ExecutiveDailyReadinessLayer;

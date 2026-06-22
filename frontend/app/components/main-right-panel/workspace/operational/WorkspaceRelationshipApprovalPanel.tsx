"use client";

import React from "react";

import {
  approveRelationshipCandidate,
  filterRelationshipApprovals,
  getRelationshipApprovalState,
  getWorkspaceRelationshipApprovalRegistryVersion,
  rejectRelationshipCandidate,
  renameRelationshipType,
  subscribeWorkspaceRelationshipApprovalRegistry,
  type WorkspaceRelationshipApprovalRecord,
  type WorkspaceRelationshipApprovalStatus,
} from "../../../../lib/workspace/workspaceRelationshipApprovalContract.ts";
import {
  getWorkspaceRelationshipClassificationRegistryVersion,
  subscribeWorkspaceRelationshipClassificationRegistry,
  type WorkspaceRelationshipCategory,
  type WorkspaceRelationshipStrength,
} from "../../../../lib/workspace/workspaceRelationshipClassificationContract.ts";
import {
  getWorkspaceRelationships,
  getWorkspaceRelationshipCreationRegistryVersion,
  subscribeWorkspaceRelationshipCreationRegistry,
} from "../../../../lib/workspace/workspaceRelationshipCreationContract.ts";
import {
  getSceneRelationships,
  getWorkspaceRelationshipSceneSyncRegistryVersion,
  subscribeWorkspaceRelationshipSceneSyncRegistry,
  syncWorkspaceRelationshipsToScene,
} from "../../../../lib/workspace/workspaceRelationshipSceneSyncContract.ts";
import {
  getActiveWorkspaceId,
  subscribeWorkspaceRegistry,
} from "../../../../lib/workspace/workspaceRegistryStore.ts";
import {
  operationalCardDetailStyle,
  operationalCardHeadlineStyle,
  operationalCardStyle,
  operationalSectionLabelStyle,
  operationalVisualColors,
  operationalVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";

export type WorkspaceRelationshipApprovalPanelProps = Readonly<{
  refreshSignal?: number;
}>;

type PanelFeedback = Readonly<{
  tone: "idle" | "success" | "error";
  message: string;
}>;

type StatusFilter = WorkspaceRelationshipApprovalStatus | "all";
type CategoryFilter = WorkspaceRelationshipCategory | "all";
type StrengthFilter = WorkspaceRelationshipStrength | "all";

const IDLE_FEEDBACK: PanelFeedback = Object.freeze({
  tone: "idle",
  message: "Review classified relationship candidates before creation.",
});

const PANEL_RADIUS = 4;
const CATEGORY_FILTERS: readonly CategoryFilter[] = Object.freeze([
  "all",
  "Business Flow",
  "Ownership",
  "Organization",
  "Dependency",
  "Financial",
  "Operational",
  "Governance",
  "Unknown",
]);
const STRENGTH_FILTERS: readonly StrengthFilter[] = Object.freeze([
  "all",
  "weak",
  "medium",
  "strong",
  "critical",
]);
const STATUS_FILTERS: readonly StatusFilter[] = Object.freeze([
  "all",
  "suggested",
  "approved",
  "rejected",
]);

function panelShellStyle(): React.CSSProperties {
  return {
    border: `1px solid ${operationalVisualColors.border}`,
    borderRadius: PANEL_RADIUS,
    background: "var(--nx-bg-panel)",
    padding: `${operationalVisualSpacing.shellPaddingY}px ${operationalVisualSpacing.shellPaddingX}px`,
    display: "flex",
    flexDirection: "column",
    gap: operationalVisualSpacing.sectionGap,
    minWidth: 0,
  };
}

function panelDividerStyle(): React.CSSProperties {
  return {
    borderTop: `1px solid ${operationalVisualColors.border}`,
    margin: 0,
  };
}

function panelButtonStyle(options?: { primary?: boolean; danger?: boolean; disabled?: boolean }): React.CSSProperties {
  const disabled = options?.disabled === true;
  const primary = options?.primary === true;
  const danger = options?.danger === true;
  return {
    border: `1px solid ${danger ? operationalVisualColors.warning : operationalVisualColors.border}`,
    borderRadius: PANEL_RADIUS,
    background: disabled ? "var(--nx-bg-muted)" : "var(--nx-bg-control)",
    color: disabled
      ? operationalVisualColors.muted
      : danger
        ? operationalVisualColors.warning
        : primary
          ? operationalVisualColors.success
          : operationalVisualColors.accent,
    cursor: disabled ? "default" : "pointer",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.06em",
    padding: "8px 12px",
    textTransform: "uppercase",
  };
}

function selectStyle(): React.CSSProperties {
  return {
    border: `1px solid ${operationalVisualColors.border}`,
    borderRadius: PANEL_RADIUS,
    background: "var(--nx-bg-control)",
    color: operationalVisualColors.text,
    fontSize: 11,
    fontWeight: 700,
    minWidth: 120,
    padding: "8px 10px",
  };
}

function feedbackStyle(tone: PanelFeedback["tone"]): React.CSSProperties {
  const color =
    tone === "success"
      ? operationalVisualColors.success
      : tone === "error"
        ? operationalVisualColors.warning
        : operationalVisualColors.muted;
  return {
    ...operationalCardDetailStyle(),
    color,
    margin: 0,
  };
}

function relationshipCardStyle(status: WorkspaceRelationshipApprovalStatus): React.CSSProperties {
  const borderColor =
    status === "approved"
      ? operationalVisualColors.success
      : status === "rejected"
        ? operationalVisualColors.warning
        : operationalVisualColors.border;
  return {
    ...operationalCardStyle("neutral"),
    borderColor,
    display: "grid",
    gap: operationalVisualSpacing.fieldGap,
  };
}

function labelFromObjectId(value: string): string {
  const cleaned = value
    .replace(/^obj_/, "")
    .replace(/_/g, " ")
    .trim();
  return cleaned
    ? cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Object";
}

function parseRelationshipEndpoints(approval: WorkspaceRelationshipApprovalRecord): {
  source: string;
  target: string;
} {
  const withoutType = approval.candidateRelationshipId.endsWith(`_${approval.relationshipType}`)
    ? approval.candidateRelationshipId.slice(0, -1 * (`_${approval.relationshipType}`).length)
    : approval.candidateRelationshipId;
  const objectMatches = [...withoutType.matchAll(/obj_[a-z0-9_]+?(?=_obj_|$)/g)].map(
    (match) => match[0]
  );
  const source = objectMatches[0] ?? "source_object";
  const target = objectMatches[1] ?? "target_object";
  return Object.freeze({
    source: labelFromObjectId(source),
    target: labelFromObjectId(target),
  });
}

function formatStrength(value: WorkspaceRelationshipStrength): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatConfidence(value: number): string {
  return value.toFixed(2);
}

function useRelationshipApprovalState(refreshSignal = 0) {
  const approvalVersion = React.useSyncExternalStore(
    subscribeWorkspaceRelationshipApprovalRegistry,
    getWorkspaceRelationshipApprovalRegistryVersion,
    () => 0
  );
  const classificationVersion = React.useSyncExternalStore(
    subscribeWorkspaceRelationshipClassificationRegistry,
    getWorkspaceRelationshipClassificationRegistryVersion,
    () => 0
  );
  const creationVersion = React.useSyncExternalStore(
    subscribeWorkspaceRelationshipCreationRegistry,
    getWorkspaceRelationshipCreationRegistryVersion,
    () => 0
  );
  const sceneRelationshipVersion = React.useSyncExternalStore(
    subscribeWorkspaceRelationshipSceneSyncRegistry,
    getWorkspaceRelationshipSceneSyncRegistryVersion,
    () => 0
  );
  const activeWorkspaceId = React.useSyncExternalStore(
    subscribeWorkspaceRegistry,
    () => getActiveWorkspaceId(),
    () => null
  );

  return React.useMemo(
    () => getRelationshipApprovalState(activeWorkspaceId),
    [activeWorkspaceId, approvalVersion, classificationVersion, creationVersion, sceneRelationshipVersion, refreshSignal]
  );
}

export function WorkspaceRelationshipApprovalPanel(
  props: WorkspaceRelationshipApprovalPanelProps
): React.ReactElement {
  const state = useRelationshipApprovalState(props.refreshSignal ?? 0);
  const [feedback, setFeedback] = React.useState<PanelFeedback>(IDLE_FEEDBACK);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>("all");
  const [strengthFilter, setStrengthFilter] = React.useState<StrengthFilter>("all");

  const rows = React.useMemo(
    () =>
      filterRelationshipApprovals(state.approvals, {
        status: statusFilter,
        category: categoryFilter,
        strength: strengthFilter,
      }),
    [categoryFilter, state.approvals, statusFilter, strengthFilter]
  );
  const workspaceRelationshipCount = state.workspaceId
    ? getWorkspaceRelationships(state.workspaceId).length
    : 0;
  const sceneRelationshipCount = state.workspaceId
    ? getSceneRelationships(state.workspaceId).length
    : 0;

  const applyResult = React.useCallback((result: { success: boolean; message: string }) => {
    setFeedback(
      Object.freeze({
        tone: result.success ? "success" : "error",
        message: result.message,
      })
    );
  }, []);

  const handleApprove = React.useCallback(
    (candidateRelationshipId: string) => {
      if (!state.workspaceId) return;
      applyResult(approveRelationshipCandidate(state.workspaceId, candidateRelationshipId));
    },
    [applyResult, state.workspaceId]
  );

  const handleReject = React.useCallback(
    (candidateRelationshipId: string) => {
      if (!state.workspaceId) return;
      applyResult(rejectRelationshipCandidate(state.workspaceId, candidateRelationshipId));
    },
    [applyResult, state.workspaceId]
  );

  const handleRename = React.useCallback(
    (approval: WorkspaceRelationshipApprovalRecord) => {
      if (!state.workspaceId) return;
      const nextType = window.prompt("Rename relationship type", approval.relationshipType);
      if (nextType === null) return;
      applyResult(
        renameRelationshipType(state.workspaceId, approval.candidateRelationshipId, nextType)
      );
    },
    [applyResult, state.workspaceId]
  );

  const handleSyncRelationshipsToScene = React.useCallback(() => {
    if (!state.workspaceId) return;
    applyResult(syncWorkspaceRelationshipsToScene(state.workspaceId));
  }, [applyResult, state.workspaceId]);

  return (
    <section
      data-nx="workspace-relationship-approval-panel"
      data-workspace-relationship-approval-panel="true"
      aria-label="Relationship Approval Panel"
      style={panelShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: operationalVisualSpacing.fieldGap,
        }}
      >
        <div style={operationalSectionLabelStyle()}>Relationship Approval Panel</div>
        <div style={operationalCardDetailStyle()}>DS-2 Discovery -&gt; Relationship Approval</div>
        <div style={operationalCardHeadlineStyle("accent")}>
          {state.totalCount} candidate{state.totalCount === 1 ? "" : "s"} · {state.approvedCount} approved · {state.rejectedCount} rejected · {workspaceRelationshipCount} created · {sceneRelationshipCount} in scene
        </div>
        <p style={feedbackStyle(feedback.tone)}>{feedback.message}</p>
      </header>

      <hr style={panelDividerStyle()} />

      <div
        aria-label="Relationship approval filters"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: operationalVisualSpacing.fieldGap,
        }}
      >
        <select
          aria-label="Status filter"
          style={selectStyle()}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.currentTarget.value as StatusFilter)}
        >
          {STATUS_FILTERS.map((filter) => (
            <option key={filter} value={filter}>
              {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </option>
          ))}
        </select>
        <select
          aria-label="Category filter"
          style={selectStyle()}
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.currentTarget.value as CategoryFilter)}
        >
          {CATEGORY_FILTERS.map((filter) => (
            <option key={filter} value={filter}>
              {filter === "all" ? "Category" : filter}
            </option>
          ))}
        </select>
        <select
          aria-label="Strength filter"
          style={selectStyle()}
          value={strengthFilter}
          onChange={(event) => setStrengthFilter(event.currentTarget.value as StrengthFilter)}
        >
          {STRENGTH_FILTERS.map((filter) => (
            <option key={filter} value={filter}>
              {filter === "all" ? "Strength" : formatStrength(filter)}
            </option>
          ))}
        </select>
      </div>

      {rows.length > 0 ? (
        <div
          aria-label="Classified relationship candidates"
          style={{
            display: "grid",
            gap: operationalVisualSpacing.fieldGap,
          }}
        >
          {rows.map((approval) => {
            const endpoints = parseRelationshipEndpoints(approval);
            return (
              <article
                key={approval.candidateRelationshipId}
                data-relationship-approval-status={approval.approvalStatus}
                style={relationshipCardStyle(approval.approvalStatus)}
              >
                <div style={operationalCardHeadlineStyle("neutral")}>{endpoints.source}</div>
                <div style={operationalCardDetailStyle()}>-&gt;</div>
                <div style={operationalCardHeadlineStyle("accent")}>{approval.relationshipType}</div>
                <div style={operationalCardDetailStyle()}>-&gt;</div>
                <div style={operationalCardHeadlineStyle("neutral")}>{endpoints.target}</div>

                <div style={operationalCardDetailStyle()}>
                  Category: {approval.relationshipCategory}
                </div>
                <div style={operationalCardDetailStyle()}>
                  Strength: {formatStrength(approval.relationshipStrength)}
                </div>
                <div style={operationalCardDetailStyle()}>
                  Confidence: {formatConfidence(approval.confidence)}
                </div>
                <div style={operationalCardDetailStyle()}>
                  Reason: {approval.approvalReason}
                </div>
                <div style={operationalCardDetailStyle()}>
                  Status: {approval.approvalStatus}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: operationalVisualSpacing.fieldGap,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    style={panelButtonStyle({ primary: true })}
                    onClick={() => handleApprove(approval.candidateRelationshipId)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    style={panelButtonStyle({ danger: true })}
                    onClick={() => handleReject(approval.candidateRelationshipId)}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    style={panelButtonStyle()}
                    onClick={() => handleRename(approval)}
                  >
                    Rename
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p style={operationalCardDetailStyle()}>
          No relationship candidates match the current filters.
        </p>
      )}

      <button
        type="button"
        style={panelButtonStyle({
          primary: true,
          disabled: !state.workspaceId || workspaceRelationshipCount === 0,
        })}
        disabled={!state.workspaceId || workspaceRelationshipCount === 0}
        onClick={handleSyncRelationshipsToScene}
      >
        Sync Relationships To Scene
      </button>
    </section>
  );
}

export default WorkspaceRelationshipApprovalPanel;

"use client";

import React from "react";

import {
  approveObjectApprovalCandidate,
  buildObjectApprovalPanelSnapshot,
  createSelectedApprovedObjects,
  addManualObjectApprovalCandidate,
  getObjectApprovalRegistryVersion,
  mergeObjectApprovalCandidates,
  rejectObjectApprovalCandidate,
  renameObjectApprovalCandidate,
  selectObjectApprovalPanelCandidate,
  subscribeObjectApprovalRegistry,
  type ObjectApprovalPanelSnapshot,
} from "../../../../lib/workspace/objectApprovalPanelRuntime.ts";
import {
  getWorkspaceCandidateObjectRegistryVersion,
  subscribeWorkspaceCandidateObjectRegistry,
} from "../../../../lib/workspace/candidateObjectDiscoveryEngine.ts";
import {
  getActiveWorkspaceId,
  subscribeWorkspaceRegistry,
} from "../../../../lib/workspace/workspaceRegistryStore.ts";
import { getWorkspaceCreatedObjects } from "../../../../lib/workspace/objectCreationPipeline.ts";
import {
  getWorkspaceSceneSyncVersionSnapshot,
  getWorkspaceSyncedSceneObjects,
  subscribeWorkspaceSceneSync,
  syncWorkspaceObjectsToSceneAction,
} from "../../../../lib/workspace/workspaceSceneSync.ts";
import {
  operationalCardDetailStyle,
  operationalCardHeadlineStyle,
  operationalCardStyle,
  operationalSectionLabelStyle,
  operationalVisualColors,
  operationalVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";

export type WorkspaceObjectApprovalPanelProps = Readonly<{
  refreshSignal?: number;
  mergeSelection?: readonly string[];
}>;

type PanelFeedback = Readonly<{
  tone: "idle" | "success" | "error";
  message: string;
}>;

const IDLE_FEEDBACK: PanelFeedback = Object.freeze({
  tone: "idle",
  message: "Review candidate objects before creation. Approve, reject, or rename each proposal.",
});

const PANEL_RADIUS = 4;

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
    border: `1px solid ${
      danger ? operationalVisualColors.warning : operationalVisualColors.border
    }`,
    borderRadius: PANEL_RADIUS,
    background: disabled ? "var(--nx-bg-muted)" : primary ? "var(--nx-bg-control)" : "var(--nx-bg-control)",
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

function listItemStyle(selected: boolean, approved: boolean): React.CSSProperties {
  return {
    border: `1px solid ${
      selected ? operationalVisualColors.accent : approved ? operationalVisualColors.success : operationalVisualColors.border
    }`,
    borderRadius: PANEL_RADIUS,
    background: selected ? "var(--nx-bg-control)" : "transparent",
    color: operationalVisualColors.text,
    cursor: "pointer",
    fontSize: 13,
    lineHeight: 1.4,
    padding: "10px 12px",
    textAlign: "left",
    width: "100%",
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

function formatConfidence(score: number): string {
  return score.toFixed(2);
}

function useObjectApprovalPanelSnapshot(refreshSignal = 0): ObjectApprovalPanelSnapshot {
  const candidateVersion = React.useSyncExternalStore(
    subscribeWorkspaceCandidateObjectRegistry,
    getWorkspaceCandidateObjectRegistryVersion,
    () => 0
  );
  const approvalVersion = React.useSyncExternalStore(
    subscribeObjectApprovalRegistry,
    getObjectApprovalRegistryVersion,
    () => 0
  );
  const activeWorkspaceId = React.useSyncExternalStore(
    subscribeWorkspaceRegistry,
    () => getActiveWorkspaceId(),
    () => null
  );
  const sceneSyncVersion = React.useSyncExternalStore(
    subscribeWorkspaceSceneSync,
    getWorkspaceSceneSyncVersionSnapshot,
    () => 0
  );

  return React.useMemo(
    () => buildObjectApprovalPanelSnapshot(activeWorkspaceId),
    [activeWorkspaceId, candidateVersion, approvalVersion, sceneSyncVersion, refreshSignal]
  );
}

export function WorkspaceObjectApprovalPanel(
  props: WorkspaceObjectApprovalPanelProps
): React.ReactElement {
  const snapshot = useObjectApprovalPanelSnapshot(props.refreshSignal ?? 0);
  const [feedback, setFeedback] = React.useState<PanelFeedback>(IDLE_FEEDBACK);
  const [mergeSelection, setMergeSelection] = React.useState<readonly string[]>([]);
  const selectedRow =
    snapshot.rows.find((row) => row.candidateId === snapshot.selectedCandidateId) ?? null;

  const applyResult = React.useCallback((result: { success: boolean; message: string }) => {
    setFeedback(
      Object.freeze({
        tone: result.success ? "success" : "error",
        message: result.message,
      })
    );
  }, []);

  const handleSelect = React.useCallback(
    (candidateId: string) => {
      if (!snapshot.workspaceId) return;
      applyResult(selectObjectApprovalPanelCandidate(snapshot.workspaceId, candidateId));
    },
    [applyResult, snapshot.workspaceId]
  );

  const handleApprove = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    applyResult(approveObjectApprovalCandidate(snapshot.workspaceId, snapshot.selectedCandidateId));
  }, [applyResult, snapshot.selectedCandidateId, snapshot.workspaceId]);

  const handleReject = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    applyResult(rejectObjectApprovalCandidate(snapshot.workspaceId, snapshot.selectedCandidateId));
  }, [applyResult, snapshot.selectedCandidateId, snapshot.workspaceId]);

  const handleRename = React.useCallback(() => {
    if (!snapshot.workspaceId || !snapshot.selectedCandidateId) return;
    const nextName = window.prompt("Rename candidate object", selectedRow?.displayName ?? "");
    if (nextName === null) return;
    applyResult(
      renameObjectApprovalCandidate(snapshot.workspaceId, nextName, snapshot.selectedCandidateId)
    );
  }, [applyResult, selectedRow?.displayName, snapshot.selectedCandidateId, snapshot.workspaceId]);

  const handleToggleMerge = React.useCallback((candidateId: string) => {
    setMergeSelection((current) =>
      current.includes(candidateId)
        ? current.filter((id) => id !== candidateId)
        : Object.freeze([...current, candidateId])
    );
  }, []);

  const handleMerge = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    const targets = mergeSelection.length >= 2 ? mergeSelection : [];
    if (targets.length < 2) {
      setFeedback(
        Object.freeze({
          tone: "error",
          message: "Select at least two objects to merge.",
        })
      );
      return;
    }
    applyResult(mergeObjectApprovalCandidates(snapshot.workspaceId, targets));
    setMergeSelection(Object.freeze([]));
  }, [applyResult, mergeSelection, snapshot.workspaceId]);

  const handleManualAdd = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    const objectName = window.prompt("Add manual object proposal");
    if (!objectName) return;
    applyResult(addManualObjectApprovalCandidate(snapshot.workspaceId, objectName));
  }, [applyResult, snapshot.workspaceId]);

  const handleCreateSelected = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    const result = createSelectedApprovedObjects(snapshot.workspaceId);
    setFeedback(
      Object.freeze({
        tone: result.success ? "success" : "error",
        message: result.message,
      })
    );
  }, [snapshot.workspaceId]);

  const handleSyncToScene = React.useCallback(() => {
    if (!snapshot.workspaceId) return;
    const result = syncWorkspaceObjectsToSceneAction(snapshot.workspaceId);
    setFeedback(
      Object.freeze({
        tone: result.success ? "success" : "error",
        message: result.message ?? "Scene sync complete.",
      })
    );
  }, [snapshot.workspaceId]);

  const actionsDisabled = !snapshot.workspaceId;
  const hasSelection = Boolean(snapshot.selectedCandidateId);
  const approvedCount = snapshot.approvedCount;
  const createdObjectCount = snapshot.workspaceId
    ? getWorkspaceCreatedObjects(snapshot.workspaceId).length
    : 0;
  const syncedSceneCount = snapshot.workspaceId
    ? getWorkspaceSyncedSceneObjects(snapshot.workspaceId).length
    : 0;

  return (
    <section
      data-nx="workspace-object-approval-panel"
      data-workspace-object-approval-panel="true"
      aria-label="Object Approval Panel"
      style={panelShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: operationalVisualSpacing.fieldGap,
        }}
      >
        <div style={operationalSectionLabelStyle()}>Object Approval Panel</div>
        <div style={operationalCardDetailStyle()}>DS-1 Discovery → Object Approval</div>
        <div style={operationalCardHeadlineStyle("accent")}>
          {snapshot.rows.length} candidate{snapshot.rows.length === 1 ? "" : "s"} · {approvedCount} approved · {createdObjectCount} created · {syncedSceneCount} in scene
        </div>
        <p style={feedbackStyle(feedback.tone)}>{feedback.message}</p>
      </header>

      <hr style={panelDividerStyle()} />

      {snapshot.rows.length > 0 ? (
        <div
          role="listbox"
          aria-label="Candidate objects for approval"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: operationalVisualSpacing.fieldGap,
          }}
        >
          {snapshot.rows.map((row) => {
            const selected = row.candidateId === snapshot.selectedCandidateId;
            const mergeMarked = mergeSelection.includes(row.candidateId);
            return (
              <button
                key={row.candidateId}
                type="button"
                role="option"
                aria-selected={selected}
                style={listItemStyle(selected, row.approved)}
                onClick={() => handleSelect(row.candidateId)}
              >
                {row.approved ? "✓ " : mergeMarked ? "◦ " : ""}
                {row.displayName}
              </button>
            );
          })}
        </div>
      ) : (
        <p style={operationalCardDetailStyle()}>
          No candidate objects yet. Complete DS-1 discovery to review proposals.
        </p>
      )}

      {selectedRow ? (
        <aside
          aria-label="Selected candidate object"
          style={{
            ...operationalCardStyle("neutral"),
            display: "grid",
            gap: operationalVisualSpacing.fieldGap,
          }}
        >
          <div style={operationalCardHeadlineStyle("neutral")}>{selectedRow.displayName}</div>
          <div style={operationalCardDetailStyle()}>
            Confidence: {formatConfidence(selectedRow.confidenceScore)}
          </div>
          <div style={operationalCardDetailStyle()}>
            Identifier: {selectedRow.primaryIdentifier ?? "None detected"}
          </div>
          <div style={operationalCardDetailStyle()}>
            Columns: {selectedRow.sourceColumnCount}
          </div>
          <div style={operationalCardDetailStyle()}>Reason: {selectedRow.reason}</div>
          <div style={operationalCardDetailStyle()}>Status: {selectedRow.statusLabel}</div>
        </aside>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: operationalVisualSpacing.fieldGap,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          style={panelButtonStyle({ primary: true, disabled: actionsDisabled || !hasSelection })}
          disabled={actionsDisabled || !hasSelection}
          onClick={handleApprove}
        >
          Approve
        </button>
        <button
          type="button"
          style={panelButtonStyle({ danger: true, disabled: actionsDisabled || !hasSelection })}
          disabled={actionsDisabled || !hasSelection}
          onClick={handleReject}
        >
          Reject
        </button>
        <button
          type="button"
          style={panelButtonStyle({ disabled: actionsDisabled || !hasSelection })}
          disabled={actionsDisabled || !hasSelection}
          onClick={handleRename}
        >
          Rename
        </button>
        <button
          type="button"
          style={panelButtonStyle({ disabled: true })}
          disabled
          title="Merge is reserved for a future release."
          onClick={handleMerge}
        >
          Merge (future)
        </button>
        <button
          type="button"
          style={panelButtonStyle({ disabled: actionsDisabled })}
          disabled={actionsDisabled}
          onClick={handleManualAdd}
        >
          Manual Add
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: operationalVisualSpacing.fieldGap,
          flexWrap: "wrap",
        }}
      >
        {snapshot.rows.map((row) => (
          <label
            key={`merge-${row.candidateId}`}
            style={{
              ...operationalCardDetailStyle(),
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "not-allowed",
              opacity: 0.6,
            }}
          >
            <input type="checkbox" disabled checked={mergeSelection.includes(row.candidateId)} />
            Merge {row.displayName}
          </label>
        ))}
      </div>

      <button
        type="button"
        style={panelButtonStyle({
          primary: true,
          disabled: actionsDisabled || approvedCount === 0,
        })}
        disabled={actionsDisabled || approvedCount === 0}
        onClick={handleCreateSelected}
      >
        Create Selected Objects
      </button>

      <button
        type="button"
        style={panelButtonStyle({
          primary: true,
          disabled: actionsDisabled || createdObjectCount === 0,
        })}
        disabled={actionsDisabled || createdObjectCount === 0}
        onClick={handleSyncToScene}
      >
        Sync Objects To Scene
      </button>
    </section>
  );
}

export default WorkspaceObjectApprovalPanel;

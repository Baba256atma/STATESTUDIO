/**
 * HomeScreen-facing orchestration for the canonical scene contract (`sceneApplyContract`).
 * Wraps call-site patterns only — does not duplicate contract rules.
 */

import type { SceneJson } from "../lib/sceneTypes";
import {
  decideSceneCanonApply,
  isSceneCanonReplaceDecision,
  type SceneApplyContractDecision,
} from "./sceneApplyContract";

export type { SceneApplyContractDecision } from "./sceneApplyContract";
export { isSceneCanonReplaceDecision } from "./sceneApplyContract";

const rejectNoSceneBlob: SceneApplyContractDecision = { kind: "reject", reason: "no_scene_blob" };

export function sceneJsonFromCanonDecision(d: SceneApplyContractDecision): SceneJson | null {
  return isSceneCanonReplaceDecision(d) ? d.scene : null;
}

export function evaluateSnapshotRestoreScene(sceneBlob: unknown): SceneApplyContractDecision {
  return decideSceneCanonApply({
    sceneBlob,
    source: "snapshot_restore",
    rule: "snapshot",
  });
}

export function evaluateWorkspaceHydrateScene(sceneBlob: unknown): SceneApplyContractDecision {
  return decideSceneCanonApply({
    sceneBlob,
    source: "workspace_hydrate",
    rule: "renderable_only",
  });
}

export function evaluateHistoryUndoScene(sceneBlob: unknown): SceneApplyContractDecision {
  return decideSceneCanonApply({
    sceneBlob,
    source: "history_undo",
    rule: "snapshot",
  });
}

export function evaluateBackupRestoreScene(sceneBlob: unknown): SceneApplyContractDecision {
  return decideSceneCanonApply({
    sceneBlob,
    source: "backup_restore",
    rule: "snapshot",
  });
}

export function evaluateTimelineForceScene(sceneBlob: unknown, payload: unknown): SceneApplyContractDecision {
  if (sceneBlob == null || typeof sceneBlob !== "object" || Array.isArray(sceneBlob)) {
    return rejectNoSceneBlob;
  }
  return decideSceneCanonApply({
    sceneBlob,
    payload,
    source: "timeline",
    rule: "force_only",
  });
}

export function evaluateProductFlowForcedScene(sceneBlob: unknown, payload: unknown): SceneApplyContractDecision {
  return decideSceneCanonApply({
    sceneBlob,
    payload,
    source: "product_flow_chat",
    rule: "force_only",
  });
}

export function evaluateUnifiedReactionSceneReplacement(sceneBlob: unknown): SceneApplyContractDecision {
  return decideSceneCanonApply({
    sceneBlob,
    source: "unified_reaction",
    rule: "renderable_only",
  });
}

export function evaluateDomainDemoScene(sceneBlob: unknown): SceneApplyContractDecision {
  return decideSceneCanonApply({
    sceneBlob,
    source: "domain_demo",
    rule: "renderable_only",
  });
}

/** When no blob exists (e.g. workspace has no scene yet). */
export function canonDecisionMissingSceneBlob(): SceneApplyContractDecision {
  return rejectNoSceneBlob;
}

/**
 * Canonical scene-apply decisions: classify before mutating canonical scene state.
 * Does not render; does not touch React state — callers commit based on the decision.
 *
 * Intent model (this module handles replace-style decisions only):
 * - **force_replace** / **renderable_replace** / **snapshot_restore**: returned kinds with a `scene`.
 * - **reject**: unsafe or non-renderable blob for the chosen rule.
 * - **reaction_only**: when a payload has no canonical scene replace — callers apply unified
 *   reactions / highlights without calling `decideSceneCanonApply` for scene blobs.
 */

import type { SceneJson } from "../lib/sceneTypes";
import { hasForcedSceneUpdate } from "../lib/scene/unifiedReaction";
import { tryRenderableSceneJsonFromUnknown } from "./homeScreenUtils";

export type SceneApplyContractSource =
  | "product_flow_chat"
  | "unified_reaction"
  | "snapshot_restore"
  | "timeline"
  | "workspace_hydrate"
  | "history_undo"
  | "backup_restore"
  | "domain_demo"
  | "other";

/**
 * - snapshot: renderable blob only → snapshot_restore, else reject (no force bypass on empty).
 * - force_only: explicit force flags + renderable scene → force_replace, else reject.
 * - renderable_only: any renderable scene blob → renderable_replace, else reject (no force required).
 */
export type SceneCanonRule = "snapshot" | "force_only" | "renderable_only";

export type SceneApplyContractDecision =
  | { kind: "force_replace"; scene: SceneJson; reason: string }
  | { kind: "renderable_replace"; scene: SceneJson; reason: string }
  | { kind: "snapshot_restore"; scene: SceneJson; reason: string }
  | { kind: "reject"; reason: string };

function logSceneContract(rejected: boolean, detail: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (rejected) {
    // eslint-disable-next-line no-console
    console.warn("[Nexora][SceneContract][Rejected]", detail);
  } else {
    // eslint-disable-next-line no-console
    console.log("[Nexora][SceneContract][Decision]", detail);
  }
}

/**
 * Single entry for classifying scene-like blobs before `setSceneJson` / canonical updates.
 */
export function decideSceneCanonApply(input: {
  sceneBlob: unknown;
  /** Full payload when force flags may appear on root or nested `scene_json`. */
  payload?: unknown;
  source: SceneApplyContractSource;
  rule: SceneCanonRule;
}): SceneApplyContractDecision {
  const { sceneBlob, payload, source, rule } = input;
  const renderable = tryRenderableSceneJsonFromUnknown(sceneBlob);
  const forced =
    rule === "force_only" ? hasForcedSceneUpdate(payload, renderable ?? undefined) : false;

  if (rule === "snapshot") {
    if (renderable) {
      logSceneContract(false, { source, rule, decisionKind: "snapshot_restore", reason: "snapshot_renderable_ok" });
      return { kind: "snapshot_restore", scene: renderable, reason: "snapshot_renderable_ok" };
    }
    logSceneContract(true, { source, rule, decisionKind: "snapshot_restore", reason: "snapshot_not_renderable" });
    return { kind: "reject", reason: "snapshot_not_renderable" };
  }

  if (rule === "force_only") {
    if (!forced) {
      logSceneContract(true, { source, rule, reason: "not_forced" });
      return { kind: "reject", reason: "not_forced" };
    }
    if (renderable) {
      logSceneContract(false, { source, rule, decisionKind: "force_replace", reason: "force_flags_with_renderable_scene" });
      return { kind: "force_replace", scene: renderable, reason: "force_flags_with_renderable_scene" };
    }
    logSceneContract(true, { source, rule, reason: "forced_update_without_renderable_scene" });
    return { kind: "reject", reason: "forced_update_without_renderable_scene" };
  }

  // renderable_only
  if (renderable) {
    logSceneContract(false, { source, rule, decisionKind: "renderable_replace", reason: "renderable_scene" });
    return { kind: "renderable_replace", scene: renderable, reason: "renderable_scene" };
  }
  logSceneContract(true, { source, rule, reason: "no_renderable_scene_in_blob" });
  return { kind: "reject", reason: "no_renderable_scene_in_blob" };
}

export function isSceneCanonReplaceDecision(
  d: SceneApplyContractDecision
): d is SceneApplyContractDecision & { scene: SceneJson } {
  return d.kind !== "reject";
}

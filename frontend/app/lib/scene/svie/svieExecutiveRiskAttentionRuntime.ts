/**
 * SVIE:2:3 — Executive risk attention runtime (read-only, one recompute per scene update).
 */

import { buildSvieSceneSignature } from "./svieHealthVisualizationRuntime.ts";
import {
  DEFAULT_SVIE_EXECUTIVE_RISK_ATTENTION_SNAPSHOT,
  SVIE_EXECUTIVE_ATTENTION_LOG,
  type SvieExecutiveRiskAttentionBuildInput,
  type SvieExecutiveRiskAttentionSnapshot,
} from "./svieExecutiveRiskAttentionContract.ts";
import { resolveSvieExecutiveRiskAttentionSnapshot } from "./svieExecutiveRiskAttentionResolver.ts";
import { buildSvieRiskSnapshot, initializeSvieRiskRuntime } from "./svieRiskRuntime.ts";
import {
  guardSvieRiskDashboardWrite,
  guardSvieRiskRouteWrite,
  guardSvieRiskWorkspaceWrite,
} from "./svieRiskRuntime.ts";

let lastSceneSignature: string | null = null;
let snapshot: SvieExecutiveRiskAttentionSnapshot = DEFAULT_SVIE_EXECUTIVE_RISK_ATTENTION_SNAPSHOT;
const loggedAttentionSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logExecutiveAttentionOnce(next: SvieExecutiveRiskAttentionSnapshot): void {
  if (!isDev()) return;
  if (loggedAttentionSignatures.has(next.sceneSignature)) return;
  loggedAttentionSignatures.add(next.sceneSignature);
  globalThis.console?.debug?.(SVIE_EXECUTIVE_ATTENTION_LOG, {
    topObjectId: next.topObjectId,
    score: next.topScore,
    objectCount: next.objectCount,
  });
}

export function syncSvieExecutiveRiskAttention(
  input: SvieExecutiveRiskAttentionBuildInput = {}
): SvieExecutiveRiskAttentionSnapshot {
  initializeSvieRiskRuntime();
  const sceneSignature = buildSvieSceneSignature(input.sceneJson);
  if (sceneSignature === lastSceneSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  lastSceneSignature = sceneSignature;
  const riskSnapshot = buildSvieRiskSnapshot(input);
  snapshot = resolveSvieExecutiveRiskAttentionSnapshot(
    input,
    riskSnapshot.objects,
    riskSnapshot.generatedAt,
    sceneSignature
  );
  logExecutiveAttentionOnce(snapshot);
  return snapshot;
}

export function getSvieExecutiveRiskAttentionSnapshot(): SvieExecutiveRiskAttentionSnapshot {
  return snapshot;
}

export function guardSvieExecutiveAttentionRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieRiskRouteWrite(attempt);
}

export function guardSvieExecutiveAttentionWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieRiskWorkspaceWrite(attempt);
}

export function guardSvieExecutiveAttentionDashboardWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieRiskDashboardWrite(attempt);
}

export function resetSvieExecutiveRiskAttentionRuntimeForTests(): void {
  lastSceneSignature = null;
  snapshot = DEFAULT_SVIE_EXECUTIVE_RISK_ATTENTION_SNAPSHOT;
  loggedAttentionSignatures.clear();
}

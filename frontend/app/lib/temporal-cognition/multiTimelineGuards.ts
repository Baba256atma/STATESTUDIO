import type {
  BranchCategory,
  DivergenceStrength,
  EnterpriseDivergencePath,
} from "./multiTimelineTypes";

export const MULTI_TIMELINE_MAX_DIVERGENCE = 10;
export const MULTI_TIMELINE_MAX_BRANCHES = 16;
export const MULTI_TIMELINE_MAX_SNAPSHOTS = 8;
export const MULTI_TIMELINE_MAX_TRAJECTORIES = 10;
export const MULTI_TIMELINE_MAX_SEQUENCES = 10;
export const MULTI_TIMELINE_MAX_SIGNALS = 10;
export const MULTI_TIMELINE_MIN_EVAL_INTERVAL_MS = 500;
export const MULTI_TIMELINE_MAX_RECURSION_DEPTH = 2;
export const MULTI_TIMELINE_MIN_CONFIDENCE = 0.45;
export const MULTI_TIMELINE_MIN_BRANCHES_FOR_DIVERGENCE = 2;

const lastEvalAtByOrg = new Map<string, number>();
let multiTimelineDepth = 0;

const VALID_BRANCH = new Set<BranchCategory>([
  "stabilization",
  "escalation",
  "resilience_growth",
  "governance_recovery",
  "operational_stagnation",
  "systemic_fragility",
  "adaptive_evolution",
  "unknown",
]);

const VALID_STRENGTH = new Set<DivergenceStrength>([
  "weak",
  "moderate",
  "strong",
  "accelerating",
]);

export function beginMultiTimelineEvaluation(): boolean {
  if (multiTimelineDepth >= MULTI_TIMELINE_MAX_RECURSION_DEPTH) return false;
  multiTimelineDepth += 1;
  return true;
}

export function endMultiTimelineEvaluation(): void {
  multiTimelineDepth = Math.max(0, multiTimelineDepth - 1);
}

export function shouldEvaluateMultiTimelineDivergence(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < MULTI_TIMELINE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateDivergencePath(
  path: EnterpriseDivergencePath | null | undefined
): path is EnterpriseDivergencePath {
  if (!path) return false;
  if (!path.divergenceId.trim() || !path.summary.trim()) return false;
  if (!VALID_BRANCH.has(path.dominantBranch)) return false;
  if (!VALID_STRENGTH.has(path.divergenceStrength)) return false;
  if (path.confidence < MULTI_TIMELINE_MIN_CONFIDENCE) return false;
  if (path.branches.length < MULTI_TIMELINE_MIN_BRANCHES_FOR_DIVERGENCE) return false;
  return Number.isFinite(path.generatedAt);
}

export function shouldRetainDivergencePath(path: EnterpriseDivergencePath): boolean {
  if (!validateDivergencePath(path)) return false;
  if (path.divergenceStrength === "weak" && path.branches.length < 3) return false;
  return true;
}

export function resetMultiTimelineGuards(): void {
  lastEvalAtByOrg.clear();
  multiTimelineDepth = 0;
}

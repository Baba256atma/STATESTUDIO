import type { OperationalCoordinationGraph } from "./actionDependencyTypes";

export const ACTION_DEPENDENCY_MAX_GRAPHS = 10;
export const ACTION_DEPENDENCY_MAX_SNAPSHOTS = 8;
export const ACTION_DEPENDENCY_MAX_NODES = 12;
export const ACTION_DEPENDENCY_MAX_SIGNALS = 12;
export const ACTION_DEPENDENCY_MAX_BOTTLENECKS = 8;
export const ACTION_DEPENDENCY_MIN_EVAL_INTERVAL_MS = 500;
export const ACTION_DEPENDENCY_MAX_RECURSION_DEPTH = 2;
export const ACTION_DEPENDENCY_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let dependencyDepth = 0;

export function beginActionDependencyEvaluation(): boolean {
  if (dependencyDepth >= ACTION_DEPENDENCY_MAX_RECURSION_DEPTH) return false;
  dependencyDepth += 1;
  return true;
}

export function endActionDependencyEvaluation(): void {
  dependencyDepth = Math.max(0, dependencyDepth - 1);
}

export function shouldEvaluateActionDependency(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < ACTION_DEPENDENCY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateOperationalCoordinationGraph(
  graph: OperationalCoordinationGraph | null | undefined
): graph is OperationalCoordinationGraph {
  if (!graph) return false;
  if (!graph.dependencyGraphId.trim() || !graph.summary.trim()) return false;
  if (graph.confidence < ACTION_DEPENDENCY_MIN_CONFIDENCE) return false;
  if (graph.dependencyRelationships.length === 0) return false;
  return Number.isFinite(graph.generatedAt);
}

export function shouldRetainOperationalCoordinationGraph(
  graph: OperationalCoordinationGraph
): boolean {
  if (!validateOperationalCoordinationGraph(graph)) return false;
  if (graph.coordinationState === "isolated" && graph.dependencyRelationships.length < 2) {
    return false;
  }
  if (graph.dependencyStrength === "critical" && graph.confidence < 0.75) {
    return false;
  }
  return true;
}

export function strengthRank(strength: OperationalCoordinationGraph["dependencyStrength"]): number {
  const ranks: Record<OperationalCoordinationGraph["dependencyStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    critical: 4,
  };
  return ranks[strength];
}

export function confidenceToDependencyLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetActionDependencyGuards(): void {
  lastEvalAtByOrg.clear();
  dependencyDepth = 0;
}

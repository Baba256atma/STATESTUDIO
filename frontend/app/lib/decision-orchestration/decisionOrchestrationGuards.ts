import type { StrategicDecisionOrchestration } from "./decisionOrchestrationTypes";

export const DECISION_ORCHESTRATION_MAX_ORCHESTRATIONS = 10;
export const DECISION_ORCHESTRATION_MAX_SNAPSHOTS = 8;
export const DECISION_ORCHESTRATION_MAX_CANDIDATES = 12;
export const DECISION_ORCHESTRATION_MAX_SIGNALS = 10;
export const DECISION_ORCHESTRATION_MAX_SEQUENCES = 8;
export const DECISION_ORCHESTRATION_MAX_DEPENDENCIES = 10;
export const DECISION_ORCHESTRATION_MIN_EVAL_INTERVAL_MS = 500;
export const DECISION_ORCHESTRATION_MAX_RECURSION_DEPTH = 2;
export const DECISION_ORCHESTRATION_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let orchestrationDepth = 0;

export function beginDecisionOrchestrationEvaluation(): boolean {
  if (orchestrationDepth >= DECISION_ORCHESTRATION_MAX_RECURSION_DEPTH) return false;
  orchestrationDepth += 1;
  return true;
}

export function endDecisionOrchestrationEvaluation(): void {
  orchestrationDepth = Math.max(0, orchestrationDepth - 1);
}

export function shouldEvaluateDecisionOrchestration(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DECISION_ORCHESTRATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateStrategicDecisionOrchestration(
  orchestration: StrategicDecisionOrchestration | null | undefined
): orchestration is StrategicDecisionOrchestration {
  if (!orchestration) return false;
  if (!orchestration.orchestrationId.trim() || !orchestration.summary.trim()) return false;
  if (orchestration.confidence < DECISION_ORCHESTRATION_MIN_CONFIDENCE) return false;
  if (orchestration.actionSequence.length === 0) return false;
  return Number.isFinite(orchestration.generatedAt);
}

export function shouldRetainStrategicDecisionOrchestration(
  orchestration: StrategicDecisionOrchestration
): boolean {
  if (!validateStrategicDecisionOrchestration(orchestration)) return false;
  if (orchestration.readinessState === "identified" && orchestration.actionSequence.length < 2) {
    return false;
  }
  if (orchestration.actionPriority === "critical" && orchestration.confidence < 0.72) {
    return false;
  }
  return true;
}

export function priorityRank(priority: StrategicDecisionOrchestration["actionPriority"]): number {
  const ranks: Record<StrategicDecisionOrchestration["actionPriority"], number> = {
    informational: 1,
    moderate: 2,
    elevated: 3,
    critical: 4,
  };
  return ranks[priority];
}

export function readinessRank(state: StrategicDecisionOrchestration["readinessState"]): number {
  const ranks: Record<StrategicDecisionOrchestration["readinessState"], number> = {
    identified: 1,
    organizing: 2,
    sequencing: 3,
    coordinated: 4,
    ready: 5,
  };
  return ranks[state];
}

export function confidenceToReadinessLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetDecisionOrchestrationGuards(): void {
  lastEvalAtByOrg.clear();
  orchestrationDepth = 0;
}

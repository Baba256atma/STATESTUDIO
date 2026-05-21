import type { LaunchReadinessDecision, MVPProductionReadinessGate } from "./productionReadinessGateTypes";

export const PRODUCTION_READINESS_GATE_MAX_SNAPSHOTS = 8;
export const PRODUCTION_READINESS_GATE_MAX_HISTORY = 10;
export const PRODUCTION_READINESS_GATE_MAX_BLOCKERS = 12;
export const PRODUCTION_READINESS_GATE_MAX_RISKS = 12;
export const PRODUCTION_READINESS_GATE_MAX_RECOMMENDATIONS = 8;
export const PRODUCTION_READINESS_GATE_MIN_EVAL_INTERVAL_MS = 500;
export const PRODUCTION_READINESS_GATE_MAX_RECURSION_DEPTH = 2;
export const PRODUCTION_READINESS_GATE_MIN_CONFIDENCE = 0.48;
export const PRODUCTION_READINESS_GATE_MAX_INFLATED_CONFIDENCE = 0.93;
export const PRODUCTION_READINESS_GATE_MIN_INTERACTION_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
const lastLoggedDecisionByOrg = new Map<string, LaunchReadinessDecision>();
let productionReadinessGateDepth = 0;

export function beginProductionReadinessGateEvaluation(): boolean {
  if (productionReadinessGateDepth >= PRODUCTION_READINESS_GATE_MAX_RECURSION_DEPTH) {
    return false;
  }
  productionReadinessGateDepth += 1;
  return true;
}

export function endProductionReadinessGateEvaluation(): void {
  productionReadinessGateDepth = Math.max(0, productionReadinessGateDepth - 1);
}

export function shouldEvaluateProductionReadinessGate(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < PRODUCTION_READINESS_GATE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampProductionReadinessGateConfidence(score: number): number {
  return Number(
    Math.min(
      PRODUCTION_READINESS_GATE_MAX_INFLATED_CONFIDENCE,
      Math.max(PRODUCTION_READINESS_GATE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function launchDecisionRank(decision: LaunchReadinessDecision): number {
  const ranks: Record<LaunchReadinessDecision, number> = {
    no_go: 1,
    conditional_go: 2,
    go_for_demo: 3,
    go_for_controlled_pilot: 4,
  };
  return ranks[decision];
}

export function shouldLogLaunchDecisionChange(
  organizationId: string,
  decision: LaunchReadinessDecision
): boolean {
  const prior = lastLoggedDecisionByOrg.get(organizationId);
  if (prior === decision) return false;
  lastLoggedDecisionByOrg.set(organizationId, decision);
  return true;
}

export function preventFalseProductionReadyClaim(
  decision: LaunchReadinessDecision,
  evidenceComplete: boolean,
  criticalBlockerCount: number,
  smokeFailed: boolean
): { decision: LaunchReadinessDecision; falseReadyPrevented: boolean } {
  if (criticalBlockerCount > 0 || smokeFailed) {
    return { decision: "no_go", falseReadyPrevented: decision !== "no_go" };
  }
  if (!evidenceComplete && decision === "go_for_controlled_pilot") {
    return { decision: "conditional_go", falseReadyPrevented: true };
  }
  return { decision, falseReadyPrevented: false };
}

export function stabilizeLaunchDecisionOscillation(
  proposed: LaunchReadinessDecision,
  prior: LaunchReadinessDecision | null
): LaunchReadinessDecision {
  if (!prior) return proposed;
  if (launchDecisionRank(proposed) - launchDecisionRank(prior) > 2) {
    return prior === "no_go" ? "conditional_go" : prior;
  }
  return proposed;
}

export function validateMVPProductionReadinessGate(
  gate: MVPProductionReadinessGate | null | undefined
): gate is MVPProductionReadinessGate {
  if (!gate) return false;
  if (!gate.gateId.trim() || !gate.organizationId.trim() || !gate.signature.trim()) return false;
  if (!gate.summary.trim() || !gate.launchRecommendation.headline.trim()) return false;
  if (gate.confidence < PRODUCTION_READINESS_GATE_MIN_CONFIDENCE) return false;
  if (gate.confidence > PRODUCTION_READINESS_GATE_MAX_INFLATED_CONFIDENCE) return false;
  return Number.isFinite(gate.generatedAt);
}

export function resetProductionReadinessGateGuards(): void {
  lastEvalAtByOrg.clear();
  lastLoggedDecisionByOrg.clear();
  productionReadinessGateDepth = 0;
}

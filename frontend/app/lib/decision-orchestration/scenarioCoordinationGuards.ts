import type { EnterpriseResponseTopology } from "./scenarioCoordinationTypes";

export const SCENARIO_COORDINATION_MAX_TOPOLOGIES = 10;
export const SCENARIO_COORDINATION_MAX_SNAPSHOTS = 8;
export const SCENARIO_COORDINATION_MAX_SCENARIOS = 12;
export const SCENARIO_COORDINATION_MAX_FIELDS = 10;
export const SCENARIO_COORDINATION_MAX_SIGNALS = 10;
export const SCENARIO_COORDINATION_MIN_EVAL_INTERVAL_MS = 500;
export const SCENARIO_COORDINATION_MAX_RECURSION_DEPTH = 2;
export const SCENARIO_COORDINATION_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let coordinationDepth = 0;

export function beginScenarioCoordinationEvaluation(): boolean {
  if (coordinationDepth >= SCENARIO_COORDINATION_MAX_RECURSION_DEPTH) return false;
  coordinationDepth += 1;
  return true;
}

export function endScenarioCoordinationEvaluation(): void {
  coordinationDepth = Math.max(0, coordinationDepth - 1);
}

export function shouldEvaluateScenarioCoordination(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < SCENARIO_COORDINATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateEnterpriseResponseTopology(
  topology: EnterpriseResponseTopology | null | undefined
): topology is EnterpriseResponseTopology {
  if (!topology) return false;
  if (!topology.topologyId.trim() || !topology.summary.trim()) return false;
  if (topology.confidence < SCENARIO_COORDINATION_MIN_CONFIDENCE) return false;
  if (topology.interactionRelationships.length < 1) return false;
  return Number.isFinite(topology.generatedAt);
}

export function shouldRetainEnterpriseResponseTopology(
  topology: EnterpriseResponseTopology
): boolean {
  if (!validateEnterpriseResponseTopology(topology)) return false;
  if (topology.topologyState === "constrained" && topology.confidence < 0.62) {
    return false;
  }
  return true;
}

export function topologyStateRank(state: EnterpriseResponseTopology["topologyState"]): number {
  const ranks: Record<EnterpriseResponseTopology["topologyState"], number> = {
    isolated: 1,
    linked: 2,
    coordinated: 3,
    constrained: 4,
    interconnected: 5,
  };
  return ranks[state];
}

export function coordinationStrengthRank(
  strength: EnterpriseResponseTopology["coordinationStrength"]
): number {
  const ranks: Record<EnterpriseResponseTopology["coordinationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
  };
  return ranks[strength];
}

export function confidenceToCoordinationLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetScenarioCoordinationGuards(): void {
  lastEvalAtByOrg.clear();
  coordinationDepth = 0;
}

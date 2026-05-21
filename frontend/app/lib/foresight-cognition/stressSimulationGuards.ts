import type { OperationalStressScenario } from "./stressSimulationTypes";

export const STRESS_SIMULATION_MAX_SCENARIOS = 10;
export const STRESS_SIMULATION_MAX_SNAPSHOTS = 8;
export const STRESS_SIMULATION_MAX_SIMULATIONS = 8;
export const STRESS_SIMULATION_MAX_PROPAGATIONS = 8;
export const STRESS_SIMULATION_MAX_STRAIN_SIGNALS = 10;
export const STRESS_SIMULATION_MAX_PRESSURE_FIELDS = 8;
export const STRESS_SIMULATION_MIN_EVAL_INTERVAL_MS = 500;
export const STRESS_SIMULATION_MAX_RECURSION_DEPTH = 2;
export const STRESS_SIMULATION_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let stressDepth = 0;

export function beginStressSimulationEvaluation(): boolean {
  if (stressDepth >= STRESS_SIMULATION_MAX_RECURSION_DEPTH) return false;
  stressDepth += 1;
  return true;
}

export function endStressSimulationEvaluation(): void {
  stressDepth = Math.max(0, stressDepth - 1);
}

export function shouldEvaluateStressSimulation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRESS_SIMULATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateOperationalStressScenario(
  scenario: OperationalStressScenario | null | undefined
): scenario is OperationalStressScenario {
  if (!scenario) return false;
  if (!scenario.stressScenarioId.trim() || !scenario.summary.trim()) return false;
  if (scenario.confidence < STRESS_SIMULATION_MIN_CONFIDENCE) return false;
  if (scenario.stressSignals.length === 0) return false;
  return Number.isFinite(scenario.generatedAt);
}

export function shouldRetainOperationalStressScenario(
  scenario: OperationalStressScenario
): boolean {
  if (!validateOperationalStressScenario(scenario)) return false;
  if (scenario.stressSeverity === "low" && scenario.confidence < 0.62) return false;
  if (scenario.simulationState === "stable" && scenario.stressSeverity === "low") return false;
  if (scenario.stressSeverity === "critical" && scenario.confidence < 0.82) return false;
  return true;
}

export function confidenceToStressSimulationLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function severityRank(severity: OperationalStressScenario["stressSeverity"]): number {
  const ranks: Record<OperationalStressScenario["stressSeverity"], number> = {
    low: 1,
    moderate: 2,
    elevated: 3,
    severe: 4,
    critical: 5,
  };
  return ranks[severity];
}

export function resetStressSimulationGuards(): void {
  lastEvalAtByOrg.clear();
  stressDepth = 0;
}

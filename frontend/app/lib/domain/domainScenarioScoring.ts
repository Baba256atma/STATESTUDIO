import type { DomainScenario, DomainScenarioSeverity } from "./domainScenarioTypes.ts";

export type DomainScenarioScore = {
  scenarioId: string;
  overallScore: number;
  riskReductionScore: number;
  confidenceScore: number;
  operationalComplexityScore: number;
  executivePriority:
    | "low"
    | "medium"
    | "high"
    | "critical";
};

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

function severityBase(severity: DomainScenarioSeverity): number {
  if (severity === "critical") return 92;
  if (severity === "high") return 76;
  if (severity === "medium") return 52;
  return 28;
}

function priorityFromScore(score: number): DomainScenarioScore["executivePriority"] {
  if (score >= 82) return "critical";
  if (score >= 66) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function riskReductionScore(scenario: DomainScenario): number {
  const riskImpact = scenario.impacts.find((impact) => impact.category === "risk");
  if (!riskImpact) return severityBase(scenario.severity) * 0.45;
  if (riskImpact.direction === "decrease") return severityBase(scenario.severity) * 0.55 + riskImpact.magnitude * 0.45;
  if (riskImpact.direction === "increase") return Math.max(10, severityBase(scenario.severity) - riskImpact.magnitude * 0.55);
  return severityBase(scenario.severity) * 0.5;
}

function complexityScore(scenario: DomainScenario): number {
  const actionPenalty = Math.max(0, scenario.recommendedActions.length - 1) * 8;
  const objectPenalty = Math.max(0, scenario.relatedObjectIds.length - 1) * 6;
  const typePenalty =
    scenario.type === "expansion" ? 18 :
      scenario.type === "fallback" ? 14 :
        scenario.type === "containment" ? 10 :
          scenario.type === "mitigation" ? 8 :
            6;
  return clampScore(100 - actionPenalty - objectPenalty - typePenalty);
}

export function scoreDomainScenarios(params: {
  scenarios: DomainScenario[];
}): DomainScenarioScore[] {
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
  return scenarios.map((scenario) => {
    const reduction = clampScore(riskReductionScore(scenario));
    const confidence = clampScore(scenario.confidence * 100);
    const complexity = complexityScore(scenario);
    const overallScore = clampScore(reduction * 0.48 + confidence * 0.32 + complexity * 0.2);
    return {
      scenarioId: scenario.id,
      overallScore,
      riskReductionScore: reduction,
      confidenceScore: confidence,
      operationalComplexityScore: complexity,
      executivePriority: priorityFromScore(overallScore),
    };
  });
}

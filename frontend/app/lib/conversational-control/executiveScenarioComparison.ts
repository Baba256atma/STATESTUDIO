/**
 * CC:9 — Scenario comparison (evaluated results only). Preference ≠ commitment.
 */

import type { NexoraExecutiveUncertainty } from "./executiveRecommendation.ts";
import {
  EXECUTIVE_SCENARIO_REASON,
  type ExecutiveScenarioReasonCode,
} from "./executiveScenarioConversation.ts";
import type { NexoraExecutiveScenario } from "./executiveScenarioDefinition.ts";
import type { NexoraExecutiveScenarioEvaluation } from "./executiveScenarioEvaluation.ts";

export const NEXORA_SCENARIO_PREFERENCE_BASES = Object.freeze([
  "goal-alignment",
  "risk",
  "cost",
  "time",
  "balanced",
  "none",
] as const);

export type NexoraScenarioPreferenceBasis =
  (typeof NEXORA_SCENARIO_PREFERENCE_BASES)[number];

export type NexoraScenarioComparisonDimension = {
  readonly dimension:
    | "goal-alignment"
    | "risk"
    | "cost"
    | "capacity"
    | "time"
    | "confidence";
  readonly scenarioScores: Readonly<Record<string, number>>;
  readonly notes: string;
};

export type NexoraScenarioComparison = {
  readonly comparisonId: string;
  readonly scenarioIds: readonly string[];
  readonly dimensions: readonly NexoraScenarioComparisonDimension[];
  /** Preference within analysis only — NOT a Decision commitment. */
  readonly preferredScenarioId: string | null;
  readonly preferenceBasis: NexoraScenarioPreferenceBasis;
  readonly preferenceReasons: readonly string[];
  readonly uncertainties: readonly NexoraExecutiveUncertainty[];
  readonly requiresDecisionCommitment: false;
};

export type NexoraScenarioComparisonResult = {
  readonly comparison: NexoraScenarioComparison | null;
  readonly status: "compared" | "insufficient-data" | "unsupported";
  readonly trace: {
    readonly reasons: readonly ExecutiveScenarioReasonCode[];
  };
};

export type NexoraCompareExecutiveScenariosInput = {
  readonly scenarios: readonly NexoraExecutiveScenario[];
  readonly evaluations: readonly NexoraExecutiveScenarioEvaluation[];
  readonly goalSubjectId?: string | null;
  readonly problemSubjectId?: string | null;
};

function scoreCapacityRelief(
  evaluation: NexoraExecutiveScenarioEvaluation,
): number {
  const impact = evaluation.impacts.find(
    (i) =>
      i.subjectId === "obj-capacity" && i.metricKey === "capacity-pressure",
  );
  if (!impact) return 0;
  if (impact.direction === "decrease") return 80;
  if (impact.direction === "stable") return 40;
  if (impact.direction === "increase") return 10;
  return 20;
}

function scoreRisk(
  evaluation: NexoraExecutiveScenarioEvaluation,
): number {
  // Higher is better (lower risk).
  const riskPenalty = evaluation.risks.length * 15;
  const uncertaintyPenalty = evaluation.uncertainties.length * 10;
  return Math.max(0, 100 - riskPenalty - uncertaintyPenalty);
}

/**
 * Compare evaluated scenarios only. Does not commit a decision.
 */
export function compareNexoraExecutiveScenarios(
  input: NexoraCompareExecutiveScenariosInput,
): NexoraScenarioComparisonResult {
  const reasons: ExecutiveScenarioReasonCode[] = [
    EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
    EXECUTIVE_SCENARIO_REASON.DECISION_COMMITMENT_DEFERRED,
  ];

  const evaluated = input.evaluations.filter(
    (e) =>
      e.status === "evaluated" ||
      e.status === "partial",
  );

  if (evaluated.length < 2) {
    return Object.freeze({
      comparison: null,
      status: "insufficient-data",
      trace: Object.freeze({
        reasons: Object.freeze([
          ...reasons,
          EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA,
        ]),
      }),
    });
  }

  const scenarioIds = Object.freeze(evaluated.map((e) => e.scenarioId));
  const capacityScores: Record<string, number> = {};
  const riskScores: Record<string, number> = {};
  const confidenceScores: Record<string, number> = {};

  for (const evaluation of evaluated) {
    capacityScores[evaluation.scenarioId] = scoreCapacityRelief(evaluation);
    riskScores[evaluation.scenarioId] = scoreRisk(evaluation);
    confidenceScores[evaluation.scenarioId] = Math.round(
      (evaluation.impacts.reduce((s, i) => s + i.confidence, 0) /
        Math.max(1, evaluation.impacts.length)) *
        100,
    );
  }

  const dimensions: NexoraScenarioComparisonDimension[] = [
    Object.freeze({
      dimension: "capacity" as const,
      scenarioScores: Object.freeze({ ...capacityScores }),
      notes: "Directional capacity-pressure relief under modeled interventions.",
    }),
    Object.freeze({
      dimension: "risk" as const,
      scenarioScores: Object.freeze({ ...riskScores }),
      notes: "Lower risk score is better; uncertainties reduce score.",
    }),
    Object.freeze({
      dimension: "confidence" as const,
      scenarioScores: Object.freeze({ ...confidenceScores }),
      notes: "Average impact confidence — not a model probability.",
    }),
  ];

  if (input.goalSubjectId) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.GOAL_ALIGNMENT);
    dimensions.unshift(
      Object.freeze({
        dimension: "goal-alignment" as const,
        scenarioScores: Object.freeze({ ...capacityScores }),
        notes:
          "Goal alignment approximated via modeled capacity-pressure relief when goal-linked.",
      }),
    );
  }

  // Prefer higher capacity relief then higher risk score (transparent, documented).
  let preferredScenarioId: string | null = null;
  let best = -1;
  const preferenceReasons: string[] = [];
  for (const id of scenarioIds) {
    const combined =
      (capacityScores[id] ?? 0) * 2 + (riskScores[id] ?? 0);
    if (combined > best) {
      best = combined;
      preferredScenarioId = id;
    }
  }

  if (preferredScenarioId) {
    const scenario = input.scenarios.find(
      (s) => s.scenarioId === preferredScenarioId,
    );
    preferenceReasons.push(
      `${scenario?.name ?? preferredScenarioId} aligns better on modeled capacity relief versus alternatives.`,
    );
    const prefEval = evaluated.find((e) => e.scenarioId === preferredScenarioId);
    if (prefEval && prefEval.uncertainties.length > 0) {
      preferenceReasons.push(
        "It still carries unresolved uncertainties (preference is not commitment).",
      );
    }
    reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_PREFERENCE_DERIVED);
  }

  const uncertainties = Object.freeze(
    evaluated.flatMap((e) => e.uncertainties),
  );

  reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_COMPARISON_CREATED);

  return Object.freeze({
    comparison: Object.freeze({
      comparisonId: `cc9:compare:${scenarioIds.join("+")}`,
      scenarioIds,
      dimensions: Object.freeze(dimensions),
      preferredScenarioId,
      preferenceBasis: input.goalSubjectId
        ? ("goal-alignment" as const)
        : ("balanced" as const),
      preferenceReasons: Object.freeze(preferenceReasons),
      uncertainties,
      requiresDecisionCommitment: false as const,
    }),
    status: "compared",
    trace: Object.freeze({ reasons: Object.freeze(reasons) }),
  });
}

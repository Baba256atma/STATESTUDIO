/**
 * CC:9 — Scenario evaluation contracts and pure evaluator.
 *
 * Uses deterministic transformations only. Never invents numeric outcomes
 * for unmodeled variables. Preserves baseline (side-effect free).
 */

import type { NexoraExecutiveEvidenceReference } from "./executiveRecommendation.ts";
import type { NexoraExecutiveTradeoff } from "./executiveRecommendation.ts";
import type { NexoraExecutiveUncertainty } from "./executiveRecommendation.ts";
import {
  EXECUTIVE_SCENARIO_REASON,
  type ExecutiveScenarioReasonCode,
} from "./executiveScenarioConversation.ts";
import type {
  NexoraExecutiveScenario,
  NexoraScenarioHorizon,
} from "./executiveScenarioDefinition.ts";
import {
  isModeledScenarioSubject,
  NEXORA_SCENARIO_EVALUATION_POLICY,
} from "./executiveScenarioPolicy.ts";

export const NEXORA_SCENARIO_EVALUATION_STATUSES = Object.freeze([
  "evaluated",
  "partial",
  "unsupported",
  "insufficient-data",
  "invalid",
  "clarification-required",
] as const);

export type NexoraScenarioEvaluationStatus =
  (typeof NEXORA_SCENARIO_EVALUATION_STATUSES)[number];

export const NEXORA_SCENARIO_IMPACT_DIRECTIONS = Object.freeze([
  "increase",
  "decrease",
  "stable",
  "mixed",
  "unknown",
] as const);

export type NexoraScenarioImpactDirection =
  (typeof NEXORA_SCENARIO_IMPACT_DIRECTIONS)[number];

export type NexoraScenarioImpact = {
  readonly subjectId: string;
  readonly metricKey?: string;
  readonly direction: NexoraScenarioImpactDirection;
  readonly magnitude?: number;
  readonly unit?: string;
  readonly confidence: number;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraScenarioRisk = {
  readonly riskId: string;
  readonly summary: string;
  readonly subjectId?: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraScenarioBaselineSnapshot = {
  readonly baselineId: string;
  readonly subjectIds: readonly string[];
  readonly attentionBySubject: Readonly<
    Record<string, "normal" | "elevated" | "important" | "critical" | undefined>
  >;
  readonly fingerprint: string;
};

export type NexoraExecutiveScenarioEvaluation = {
  readonly scenarioId: string;
  readonly status: NexoraScenarioEvaluationStatus;
  readonly baseline: NexoraScenarioBaselineSnapshot;
  readonly baselinePreserved: boolean;
  readonly impacts: readonly NexoraScenarioImpact[];
  readonly risks: readonly NexoraScenarioRisk[];
  readonly tradeoffs: readonly NexoraExecutiveTradeoff[];
  readonly uncertainties: readonly NexoraExecutiveUncertainty[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly horizon: NexoraScenarioHorizon | null;
};

export type NexoraExecutiveScenarioEvaluationTrace = {
  readonly scenarioId: string;
  readonly evaluator: "deterministic-cc9-policy";
  readonly modeledSubjects: readonly string[];
  readonly unsupportedSubjects: readonly string[];
  readonly reasons: readonly ExecutiveScenarioReasonCode[];
  readonly baselineFingerprintBefore: string;
  readonly baselineFingerprintAfter: string;
};

export type NexoraExecutiveScenarioEvaluationResult = {
  readonly evaluation: NexoraExecutiveScenarioEvaluation | null;
  readonly status: NexoraScenarioEvaluationStatus;
  readonly clarificationPrompt: string | null;
  readonly trace: NexoraExecutiveScenarioEvaluationTrace;
};

export type NexoraEvaluateExecutiveScenarioInput = {
  readonly scenario: NexoraExecutiveScenario;
  readonly baseline: NexoraScenarioBaselineSnapshot;
  /** Goal subject for relevance notes (no invented causality). */
  readonly goalSubjectId?: string | null;
  readonly problemSubjectId?: string | null;
  /** Canonical related subject ids for the primary intervention subject. */
  readonly relatedSubjectIds?: readonly string[];
  readonly requireHorizonForDoNothing?: boolean;
};

function ref(subjectId: string, factKey: string): NexoraExecutiveEvidenceReference {
  return Object.freeze({
    sourceKind: "runtime" as const,
    sourceId: `scenario-eval:${subjectId}:${factKey}`,
    subjectId,
    factKey,
  });
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 1000) / 1000;
}

/**
 * Pure evaluator. Does not mutate baseline.
 */
export function evaluateNexoraExecutiveScenario(
  input: NexoraEvaluateExecutiveScenarioInput,
): NexoraExecutiveScenarioEvaluationResult {
  const baselineBefore = input.baseline.fingerprint;
  const reasons: ExecutiveScenarioReasonCode[] = [
    EXECUTIVE_SCENARIO_REASON.DETERMINISTIC,
    EXECUTIVE_SCENARIO_REASON.SCENARIO_BASELINE_PRESERVED,
  ];

  const requireHorizon =
    input.requireHorizonForDoNothing ??
    NEXORA_SCENARIO_EVALUATION_POLICY.doNothingRequiresHorizon;

  if (
    input.scenario.kind === "do-nothing" &&
    requireHorizon &&
    !input.scenario.horizon
  ) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_HORIZON_REQUIRED);
    return Object.freeze({
      evaluation: null,
      status: "clarification-required",
      clarificationPrompt: "For what time horizon?",
      trace: Object.freeze({
        scenarioId: input.scenario.scenarioId,
        evaluator: "deterministic-cc9-policy" as const,
        modeledSubjects: Object.freeze([]),
        unsupportedSubjects: Object.freeze([]),
        reasons: Object.freeze(reasons),
        baselineFingerprintBefore: baselineBefore,
        baselineFingerprintAfter: input.baseline.fingerprint,
      }),
    });
  }

  const unsupportedSubjects: string[] = [];
  const modeledSubjects: string[] = [];
  const impacts: NexoraScenarioImpact[] = [];
  const risks: NexoraScenarioRisk[] = [];
  const tradeoffs: NexoraExecutiveTradeoff[] = [];
  const uncertainties: NexoraExecutiveUncertainty[] = [];
  const evidenceRefs: NexoraExecutiveEvidenceReference[] = [];

  // Do-nothing: baseline conditions continue — directional stable/pressure continues.
  if (input.scenario.kind === "do-nothing") {
    modeledSubjects.push("do-nothing");
    for (const subjectId of input.scenario.subjectIds.length
      ? input.scenario.subjectIds
      : Object.keys(input.baseline.attentionBySubject)) {
      const attention = input.baseline.attentionBySubject[subjectId];
      const pressureContinues =
        attention === "critical" ||
        attention === "important" ||
        attention === "elevated";
      const e = ref(subjectId, "baseline-continuation");
      evidenceRefs.push(e);
      impacts.push(
        Object.freeze({
          subjectId,
          metricKey: "executive-pressure",
          direction: pressureContinues ? ("stable" as const) : ("stable" as const),
          confidence: clampConfidence(0.7),
          evidenceRefs: Object.freeze([e]),
        }),
      );
      if (pressureContinues) {
        risks.push(
          Object.freeze({
            riskId: `risk:continue:${subjectId}`,
            summary: `${subjectId} pressure continues under do-nothing.`,
            subjectId,
            evidenceRefs: Object.freeze([e]),
          }),
        );
      }
    }
    reasons.push(
      EXECUTIVE_SCENARIO_REASON.SCENARIO_EVALUATED,
      EXECUTIVE_SCENARIO_REASON.DO_NOTHING_DEFINED,
    );
  }

  // Interventions
  for (const intervention of input.scenario.interventions) {
    if (!isModeledScenarioSubject(intervention.subjectId)) {
      unsupportedSubjects.push(intervention.subjectId);
      continue;
    }
    modeledSubjects.push(intervention.subjectId);
    const e = ref(intervention.subjectId, intervention.actionKind);
    evidenceRefs.push(e);

    if (
      intervention.subjectId === "obj-capacity" &&
      (intervention.actionKind === "increase-by" ||
        intervention.actionKind === "decrease-by")
    ) {
      const direction =
        intervention.actionKind === "increase-by"
          ? ("decrease" as const)
          : ("increase" as const);
      impacts.push(
        Object.freeze({
          subjectId: "obj-capacity",
          metricKey: "capacity-pressure",
          direction,
          // Magnitude of pressure change is not a certified numeric model — omit.
          confidence: clampConfidence(0.72),
          evidenceRefs: Object.freeze([e]),
        }),
      );
      uncertainties.push(
        Object.freeze({
          kind: "cost-unmodeled",
          description: "Cost impact of capacity change is unresolved.",
          evidenceRefs: Object.freeze([e]),
        }),
      );
      tradeoffs.push(
        Object.freeze({
          dimension: "capacity" as const,
          upside:
            intervention.actionKind === "increase-by"
              ? "Capacity pressure may ease."
              : "Capacity spend may fall.",
          downside:
            intervention.actionKind === "increase-by"
              ? "Cost and execution impact remain unresolved."
              : "Capacity pressure may worsen.",
          evidenceRefs: Object.freeze([e]),
        }),
      );

      // Related subjects: relevance only — no invented numeric outcomes.
      for (const relatedId of input.relatedSubjectIds ?? []) {
        if (relatedId === "obj-capacity") continue;
        const er = ref(relatedId, "relationship-relevance");
        evidenceRefs.push(er);
        impacts.push(
          Object.freeze({
            subjectId: relatedId,
            metricKey: "related-outlook",
            direction: "unknown" as const,
            confidence: clampConfidence(0.35),
            evidenceRefs: Object.freeze([er]),
          }),
        );
        uncertainties.push(
          Object.freeze({
            kind: "causality-not-modeled",
            description: `${relatedId} impact is not numerically modeled.`,
            evidenceRefs: Object.freeze([er]),
          }),
        );
        reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_CAUSALITY_NOT_MODELED);
      }
    } else if (
      intervention.subjectId === "obj-demand" &&
      (intervention.actionKind === "increase-by" ||
        intervention.actionKind === "decrease-by")
    ) {
      const direction =
        intervention.actionKind === "increase-by"
          ? ("increase" as const)
          : ("decrease" as const);
      impacts.push(
        Object.freeze({
          subjectId: "obj-demand",
          metricKey: "demand-pressure",
          direction,
          confidence: clampConfidence(0.7),
          evidenceRefs: Object.freeze([e]),
        }),
      );
      uncertainties.push(
        Object.freeze({
          kind: "elasticity-unknown",
          description: "Demand elasticity / revenue response is unmodeled.",
          evidenceRefs: Object.freeze([e]),
        }),
      );
    } else {
      unsupportedSubjects.push(intervention.subjectId);
    }
  }

  // Assumptions (exogenous)
  for (const assumption of input.scenario.assumptions) {
    const subjectId = assumption.subjectId;
    if (!subjectId || !isModeledScenarioSubject(subjectId)) {
      if (subjectId) unsupportedSubjects.push(subjectId);
      continue;
    }
    modeledSubjects.push(subjectId);
    const e = ref(subjectId, `assumption:${assumption.key}`);
    evidenceRefs.push(e);
    const direction =
      assumption.operator === "increase-by"
        ? ("increase" as const)
        : assumption.operator === "decrease-by"
          ? ("decrease" as const)
          : ("unknown" as const);
    impacts.push(
      Object.freeze({
        subjectId,
        metricKey: assumption.metricKey ?? "assumption",
        direction,
        confidence: clampConfidence(0.55),
        evidenceRefs: Object.freeze([e]),
      }),
    );
  }

  if (
    unsupportedSubjects.length > 0 &&
    modeledSubjects.length === 0 &&
    input.scenario.kind !== "do-nothing"
  ) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_UNSUPPORTED);
    return Object.freeze({
      evaluation: Object.freeze({
        scenarioId: input.scenario.scenarioId,
        status: "unsupported" as const,
        baseline: input.baseline,
        baselinePreserved: true,
        impacts: Object.freeze([]),
        risks: Object.freeze([]),
        tradeoffs: Object.freeze([]),
        uncertainties: Object.freeze([
          Object.freeze({
            kind: "unsupported-variable",
            description:
              "That change isn't modeled in the current scenario system.",
            evidenceRefs: Object.freeze([]),
          }),
        ]),
        evidenceRefs: Object.freeze([]),
        horizon: input.scenario.horizon,
      }),
      status: "unsupported",
      clarificationPrompt: null,
      trace: Object.freeze({
        scenarioId: input.scenario.scenarioId,
        evaluator: "deterministic-cc9-policy" as const,
        modeledSubjects: Object.freeze([]),
        unsupportedSubjects: Object.freeze([...unsupportedSubjects]),
        reasons: Object.freeze(reasons),
        baselineFingerprintBefore: baselineBefore,
        baselineFingerprintAfter: input.baseline.fingerprint,
      }),
    });
  }

  if (impacts.length === 0 && input.scenario.kind !== "do-nothing") {
    reasons.push(EXECUTIVE_SCENARIO_REASON.SCENARIO_INSUFFICIENT_DATA);
    return Object.freeze({
      evaluation: Object.freeze({
        scenarioId: input.scenario.scenarioId,
        status: "insufficient-data" as const,
        baseline: input.baseline,
        baselinePreserved: true,
        impacts: Object.freeze([]),
        risks: Object.freeze([]),
        tradeoffs: Object.freeze([]),
        uncertainties: Object.freeze([
          Object.freeze({
            kind: "insufficient-data",
            description: "Insufficient trusted data to evaluate this scenario.",
            evidenceRefs: Object.freeze([]),
          }),
        ]),
        evidenceRefs: Object.freeze([]),
        horizon: input.scenario.horizon,
      }),
      status: "insufficient-data",
      clarificationPrompt: null,
      trace: Object.freeze({
        scenarioId: input.scenario.scenarioId,
        evaluator: "deterministic-cc9-policy" as const,
        modeledSubjects: Object.freeze([...modeledSubjects]),
        unsupportedSubjects: Object.freeze([...unsupportedSubjects]),
        reasons: Object.freeze(reasons),
        baselineFingerprintBefore: baselineBefore,
        baselineFingerprintAfter: input.baseline.fingerprint,
      }),
    });
  }

  const hasUnresolved =
    uncertainties.length > 0 || unsupportedSubjects.length > 0;
  const status: NexoraScenarioEvaluationStatus = hasUnresolved
    ? "partial"
    : "evaluated";
  reasons.push(
    status === "partial"
      ? EXECUTIVE_SCENARIO_REASON.SCENARIO_PARTIAL
      : EXECUTIVE_SCENARIO_REASON.SCENARIO_EVALUATED,
  );

  if (input.goalSubjectId) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.GOAL_ALIGNMENT);
  }
  if (input.problemSubjectId) {
    reasons.push(EXECUTIVE_SCENARIO_REASON.PROBLEM_ALIGNMENT);
  }

  // Baseline fingerprint must be unchanged (side-effect free).
  const baselineAfter = input.baseline.fingerprint;
  const baselinePreserved = baselineBefore === baselineAfter;

  return Object.freeze({
    evaluation: Object.freeze({
      scenarioId: input.scenario.scenarioId,
      status,
      baseline: input.baseline,
      baselinePreserved,
      impacts: Object.freeze(impacts),
      risks: Object.freeze(risks),
      tradeoffs: Object.freeze(tradeoffs),
      uncertainties: Object.freeze(uncertainties),
      evidenceRefs: Object.freeze(
        evidenceRefs.filter(
          (r, i, all) =>
            all.findIndex((x) => x.sourceId === r.sourceId) === i,
        ),
      ),
      horizon: input.scenario.horizon,
    }),
    status,
    clarificationPrompt: null,
    trace: Object.freeze({
      scenarioId: input.scenario.scenarioId,
      evaluator: "deterministic-cc9-policy" as const,
      modeledSubjects: Object.freeze([...new Set(modeledSubjects)]),
      unsupportedSubjects: Object.freeze([...new Set(unsupportedSubjects)]),
      reasons: Object.freeze(reasons),
      baselineFingerprintBefore: baselineBefore,
      baselineFingerprintAfter: baselineAfter,
    }),
  });
}

export function createNexoraScenarioBaselineSnapshot(input: {
  readonly baselineId?: string;
  readonly attentionBySubject: Readonly<
    Record<string, "normal" | "elevated" | "important" | "critical" | undefined>
  >;
}): NexoraScenarioBaselineSnapshot {
  const subjectIds = Object.freeze(Object.keys(input.attentionBySubject).sort());
  const fingerprint = subjectIds
    .map((id) => `${id}:${input.attentionBySubject[id] ?? "none"}`)
    .join("|");
  return Object.freeze({
    baselineId: input.baselineId ?? "cc9:baseline",
    subjectIds,
    attentionBySubject: Object.freeze({ ...input.attentionBySubject }),
    fingerprint,
  });
}

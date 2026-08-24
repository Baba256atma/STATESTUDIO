/**
 * NEX-EXP:9 — observation, expected vs observed, Goal impact.
 * Reuses CORE-OUT:1 comparison and CC:12 snapshots. Does not invent outcomes.
 */

import { projectExecutionFollowUpSnapshot } from "@/app/lib/conversational-control/executiveFollowUpSnapshot.ts";
import type { NexoraExecutionRuntimeAdapter } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import {
  EXECUTION_OUTCOME_LEARNING_BOUNDARY,
  assessCausalRelationship,
} from "@/app/lib/executive-intelligence/executionOutcomeLearningIntelligence.ts";
import {
  LIVE_OUTCOME_BOUNDARY,
  projectLiveOutcomeIntelligence,
  type ExecutiveOutcomeExpectation,
  type ExecutiveOutcomeObservation,
} from "@/app/lib/executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import { executiveStageDecisionMemoryIdentity } from "@/app/lib/spatial-presentation/executiveStageDecisionMemory.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type {
  ExecutiveGoalImpactView,
  ExecutiveOutcomeComparisonView,
  ExecutiveOutcomeContextView,
  ExecutiveOutcomeObservationView,
  GoalImpactState,
  NexoraLearningReassessmentHandoff,
  OutcomeComparisonStatus,
  ObservationPhase,
} from "./nexoraOutcomeMonitoringTypes.ts";

export function isOutcomeMonitoringUtterance(normalized: string): boolean {
  return (
    /what changed/.test(normalized) ||
    /what is the outcome/.test(normalized) ||
    /what did we expect/.test(normalized) ||
    /what actually happened/.test(normalized) ||
    /did it work/.test(normalized) ||
    /are we improving/.test(normalized) ||
    /did we achieve the goal/.test(normalized) ||
    /how far are we from the goal/.test(normalized) ||
    /where did that number come from/.test(normalized) ||
    /how current is it/.test(normalized) ||
    /early signal or a final outcome/.test(normalized) ||
    /did the execution cause/.test(normalized) ||
    /what don'?t we know/.test(normalized) ||
    /why is the outcome worse/.test(normalized) ||
    /should we keep going/.test(normalized) ||
    /should we reassess/.test(normalized) ||
    /should we stop/.test(normalized) ||
    /execution is done/.test(normalized) ||
    /did we succeed/.test(normalized) ||
    /on-time delivery is (?:now |around )?/.test(normalized) ||
    /delivery (?:seems |is )?(?:better|worse|improved|down)/.test(normalized) ||
    /backlog (?:declined|increased|is)/.test(normalized) ||
    /that figure is old/.test(normalized) ||
    /back down to/.test(normalized) ||
    /cost worsened/.test(normalized) ||
    /recovered cash|cash increased|critical path|milestone variance|critical bugs/.test(
      normalized,
    ) ||
    /compare .*orders/.test(normalized) ||
    /what happens next/.test(normalized)
  );
}

export function outcomeAuthorities() {
  return Object.freeze({
    coreOut1: LIVE_OUTCOME_BOUNDARY.role,
    cc12: EXECUTION_OUTCOME_LEARNING_BOUNDARY.operationalObservationAuthority,
    ei6: EXECUTION_OUTCOME_LEARNING_BOUNDARY.comparisonAuthority,
    prod5: executiveStageDecisionMemoryIdentity,
    infersCausality: assessCausalRelationship({
      temporalSequenceObserved: false,
      consistentWithExpectedDirection: null,
    }).causalStatus,
  });
}

export function parseNumericToken(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function parseManagerObservation(
  utterance: string,
  entrance: NexoraEntranceSession,
  previous: readonly ExecutiveOutcomeObservationView[],
): ExecutiveOutcomeObservationView | null {
  const normalized = utterance.toLowerCase();
  const executionId =
    entrance.executionPlanning?.canonicalExecutionId ?? null;
  const stale = /that figure is old|back down to/.test(normalized);
  const percents = [...utterance.matchAll(/(\d+(?:\.\d+)?)\s*%/g)].map((match) =>
    Number(match[1]),
  );
  const fromTo = utterance.match(
    /from\s+(\d+(?:\.\d+)?)[^\d]+to\s+(\d+(?:\.\d+)?)/i,
  );
  let numeric = percents.at(-1) ?? null;
  let unit: string | null = percents.length ? "%" : null;
  if (!numeric && fromTo) {
    numeric = Number(fromTo[2]);
  }
  const orders = utterance.match(
    /(\d+(?:\.\d+)?)\s+(?:orders|units|items)/i,
  );
  if (orders && /backlog/i.test(utterance)) {
    numeric = Number(orders[1]);
    unit = "orders";
  }
  const measure = /backlog/i.test(utterance)
    ? "backlog"
    : /on-time|otd|delivery/i.test(utterance)
      ? "on-time-delivery"
      : /cash|receivable/i.test(utterance)
        ? "cash"
        : /cost/i.test(utterance)
          ? "cost"
          : entrance.realityDiscovery?.context.gap?.measure ?? "goal-measure";
  const baseline = parseNumericToken(
    entrance.realityDiscovery?.context.gap?.currentValue,
  );
  const target = parseNumericToken(
    entrance.realityDiscovery?.context.gap?.targetValue,
  );
  let improved =
    /improv|better|declined|narrow|recovered|shortened/i.test(normalized) &&
    !/worsen|worse|down to|increased/i.test(normalized);
  let worsened =
    /worsen|worse|degrad|down to|increased(?! readiness)/i.test(normalized) &&
    !improved;
  if (numeric != null && baseline != null && target != null && !improved && !worsened) {
    const before = Math.abs(target - baseline);
    const after = Math.abs(target - numeric);
    improved = after < before;
    worsened = after > before;
  }
  if (
    numeric == null &&
    !improved &&
    !worsened &&
    !stale
  ) {
    return null;
  }
  const phase: ObservationPhase = previous.length === 0 ? "EARLY_SIGNAL" : "INTERIM";
  return Object.freeze({
    observationId: `obs-manager-${previous.length + 1}`,
    executionId,
    subjectId: entrance.goalDiscovery?.object?.id ?? null,
    measure,
    observedValue:
      numeric != null ? `${numeric}${unit === "%" ? "%" : unit ? ` ${unit}` : ""}` : utterance,
    numericValue: numeric,
    unit,
    state: improved ? "improved" : worsened ? "worsened" : stale ? "corrected" : "reported",
    timestamp: null,
    source: "manager-reported" as const,
    sourceAuthority: "manager-statement",
    provenance: "manager-reported-observation",
    freshness: stale ? ("stale" as const) : ("current" as const),
    epistemicStatus: "UNKNOWN" as const,
    goalRelevance: "relevant" as const,
    phase,
  });
}

export function baselineFromReality(
  entrance: NexoraEntranceSession,
): ExecutiveOutcomeObservationView | null {
  const gap = entrance.realityDiscovery?.context.gap;
  if (!gap?.currentValue) return null;
  return Object.freeze({
    observationId: "obs-baseline-reality",
    executionId: entrance.executionPlanning?.canonicalExecutionId ?? null,
    subjectId: gap.goalId,
    measure: gap.measure,
    observedValue: gap.currentValue,
    numericValue: parseNumericToken(gap.currentValue),
    unit: gap.unit,
    state: "baseline",
    timestamp: null,
    source: "data-reality" as const,
    sourceAuthority: "NEX-EXP:3/CurrentRealityExecutiveContextDiscovery",
    provenance: "pre-execution-reality",
    freshness: entrance.realityDiscovery?.context.freshness === "STALE"
      ? ("stale" as const)
      : ("current" as const),
    epistemicStatus: gap.epistemicStatus,
    goalRelevance: "relevant" as const,
    phase: "UNKNOWN" as const,
  });
}

export function expectedStatements(entrance: NexoraEntranceSession): readonly string[] {
  const handoff = entrance.executionPlanning?.handoff;
  if (handoff?.expectedOutcomes.length) return handoff.expectedOutcomes;
  const effects =
    entrance.scenarioDiscovery?.scenarios.find(
      (entry) =>
        entry.id === entrance.decisionExperience?.handoff?.chosenScenario,
    )?.expectedEffects ?? [];
  return Object.freeze(effects.map((effect) => `PREDICTED: ${effect}`));
}

export function compareExpectedObserved(input: {
  readonly entrance: NexoraEntranceSession;
  readonly observations: readonly ExecutiveOutcomeObservationView[];
}): readonly ExecutiveOutcomeComparisonView[] {
  const expected = expectedStatements(input.entrance);
  const latest = latestObserved(input.observations);
  const baseline = baselineFromReality(input.entrance);
  const coreExpected: ExecutiveOutcomeExpectation | null = expected[0]
    ? Object.freeze({
        expectationId: "exp9-expected",
        statement: expected[0],
        claimKind: "PREDICTION",
        dimension: latest?.measure ?? baseline?.measure ?? "goal",
        source: "scenario",
        numericTarget: null,
        comparator: null,
        unit: latest?.unit ?? baseline?.unit ?? null,
        expectedDirection: /declin|reduc|lower|cost/i.test(expected[0])
          ? "reduce"
          : "improve",
        capturedAt: null,
        evidenceRefs: Object.freeze([]),
        provenanceRefs: Object.freeze(["nex-exp8-handoff"]),
      })
    : null;
  const validated = input.observations.filter(
    (entry) => entry.source === "data-reality" && entry.epistemicStatus === "KNOWN",
  );
  const coreActual: ExecutiveOutcomeObservation | null = validated[0]
    ? Object.freeze({
        observationId: validated[0].observationId,
        statement: validated[0].observedValue ?? "",
        claimKind: "FACT",
        dimension: validated[0].measure ?? "goal",
        source: "data-reality",
        numericValue: validated[0].numericValue,
        unit: validated[0].unit,
        observedDirection:
          validated[0].state === "improved"
            ? "improved"
            : validated[0].state === "worsened"
              ? "worsened"
              : "unchanged",
        observedAt: validated[0].timestamp,
        freshness: validated[0].freshness,
        validationStatus: "validated",
        outcomeLinked: true,
        evidenceRefs: Object.freeze([
          {
            sourceKind: "data-reality" as const,
            sourceId: validated[0].observationId,
          },
        ]),
        provenanceRefs: Object.freeze([validated[0].provenance ?? "data-reality"]),
      })
    : null;
  if (coreExpected && coreActual) {
    const assessment = projectLiveOutcomeIntelligence({
      subjectId: input.entrance.goalDiscovery?.object?.id ?? null,
      decisionId: input.entrance.decisionExperience?.canonicalRecord?.decisionId,
      executionId: input.entrance.executionPlanning?.canonicalExecutionId,
      expected: coreExpected,
      actuals: [coreActual],
      baseline: baseline
        ? {
            measured: baseline.observedValue ?? "",
            measuredAt: null,
            source: baseline.sourceAuthority,
            numericValue: baseline.numericValue,
            unit: baseline.unit,
            confidence: "medium",
            provenanceRefs: Object.freeze([baseline.provenance ?? "baseline"]),
          }
        : null,
    });
    return Object.freeze([
      Object.freeze({
        subject: coreExpected.dimension,
        expected: coreExpected.statement,
        observed: coreActual.statement,
        unit: coreActual.unit,
        direction: assessment.comparison.statement,
        variance: assessment.comparison.numericDelta,
        comparisonStatus: mapCoreComparison(assessment.comparison.result),
        evidence: Object.freeze(assessment.provenanceRefs),
        epistemicStatus: "KNOWN" as const,
      }),
    ]);
  }
  if (!latest) {
    return Object.freeze([
      Object.freeze({
        subject: "goal-impact",
        expected: expected[0] ?? null,
        observed: null,
        unit: null,
        direction: null,
        variance: null,
        comparisonStatus: "UNKNOWN" as const,
        evidence: Object.freeze([]),
        epistemicStatus: "UNKNOWN" as const,
      }),
    ]);
  }
  if (
    latest.unit &&
    baseline?.unit &&
    latest.unit !== baseline.unit &&
    latest.measure !== baseline.measure
  ) {
    return Object.freeze([
      Object.freeze({
        subject: latest.measure ?? "measure",
        expected: expected[0] ?? null,
        observed: latest.observedValue,
        unit: latest.unit,
        direction: null,
        variance: null,
        comparisonStatus: "NOT_COMPARABLE" as const,
        evidence: Object.freeze(["incompatible-units"]),
        epistemicStatus: "UNKNOWN" as const,
      }),
    ]);
  }
  const qualitative: OutcomeComparisonStatus =
    latest.state === "worsened"
      ? "WORSE_THAN_EXPECTED"
      : latest.state === "improved"
        ? "MATCHED"
        : "PARTIAL";
  return Object.freeze([
    Object.freeze({
      subject: latest.measure ?? "goal-impact",
      expected: expected[0] ?? "PREDICTED directional movement",
      observed: latest.observedValue,
      unit: latest.unit,
      direction:
        "Direction compared qualitatively. Magnitude is unknown unless both sides are numeric and compatible.",
      variance: null,
      comparisonStatus: qualitative,
      evidence: Object.freeze([latest.observationId]),
      epistemicStatus: "INFERRED" as const,
    }),
  ]);
}

export function resolveGoalImpact(input: {
  readonly entrance: NexoraEntranceSession;
  readonly observations: readonly ExecutiveOutcomeObservationView[];
  readonly comparisons: readonly ExecutiveOutcomeComparisonView[];
}): ExecutiveGoalImpactView {
  const gap = input.entrance.realityDiscovery?.context.gap;
  const latest = latestObserved(input.observations);
  const baseline = parseNumericToken(gap?.currentValue);
  const target = parseNumericToken(gap?.targetValue);
  const now = latest?.numericValue ?? null;
  const mixed =
    input.observations.some((entry) => entry.state === "worsened") &&
    input.observations.some((entry) => entry.state === "improved");
  let state: GoalImpactState = "UNKNOWN";
  let gapBefore: number | null = null;
  let gapNow: number | null = null;
  if (mixed) state = "MIXED";
  else if (baseline != null && target != null && now != null) {
    gapBefore = Math.abs(target - baseline);
    gapNow = Math.abs(target - now);
    const achieved =
      (target >= baseline && now >= target) ||
      (target <= baseline && now <= target);
    state = achieved
      ? "ACHIEVED"
      : gapNow < gapBefore
        ? "IMPROVING"
        : gapNow > gapBefore
          ? "WORSENING"
          : "UNCHANGED";
  } else if (latest?.state === "improved") state = "IMPROVING";
  else if (latest?.state === "worsened") state = "WORSENING";
  else if (latest) state = "UNCHANGED";
  if (latest?.freshness === "stale") state = "UNKNOWN";
  return Object.freeze({
    goalId: input.entrance.goalDiscovery?.object?.id ?? null,
    executionId: input.entrance.executionPlanning?.canonicalExecutionId ?? null,
    state,
    supportingObservations: Object.freeze(
      input.observations
        .filter((entry) => entry.state === "improved")
        .map((entry) => entry.observationId),
    ),
    contradictingObservations: Object.freeze(
      input.observations
        .filter((entry) => entry.state === "worsened")
        .map((entry) => entry.observationId),
    ),
    currentValue: latest?.observedValue ?? gap?.currentValue ?? null,
    targetValue: gap?.targetValue ?? null,
    gapBefore,
    gapNow,
    direction: state === "UNKNOWN" ? null : state.toLowerCase(),
    confidence: latest?.source === "data-reality" ? "MEDIUM" : latest ? "LOW" : "UNKNOWN",
    epistemicStatus: latest ? "INFERRED" : "UNKNOWN",
    attribution: "NOT_CONFIRMED",
  });
}

export function buildOutcomeContext(input: {
  readonly entrance: NexoraEntranceSession;
  readonly observations: readonly ExecutiveOutcomeObservationView[];
  readonly state: ExecutiveOutcomeContextView["status"];
}): ExecutiveOutcomeContextView {
  const comparisons = compareExpectedObserved(input);
  const goalImpact = resolveGoalImpact({
    entrance: input.entrance,
    observations: input.observations,
    comparisons,
  });
  const unknowns: string[] = [];
  if (!latestObserved(input.observations)) {
    unknowns.push("No validated outcome evidence yet.");
  }
  if (goalImpact.attribution === "NOT_CONFIRMED") {
    unknowns.push("Causal attribution is not confirmed.");
  }
  if (!input.entrance.realityDiscovery?.context.gap?.targetValue) {
    unknowns.push("Measurable Goal success criteria may be undefined.");
  }
  const stale = input.observations.some((entry) => entry.freshness === "stale");
  return Object.freeze({
    executionId: input.entrance.executionPlanning?.canonicalExecutionId ?? null,
    decisionId: input.entrance.decisionExperience?.canonicalRecord?.decisionId ?? null,
    goalId: input.entrance.goalDiscovery?.object?.id ?? null,
    expectedOutcomes: expectedStatements(input.entrance),
    observedOutcomes: Object.freeze([...input.observations]),
    comparisons,
    goalImpact,
    evidence: Object.freeze(input.observations.map((entry) => entry.observationId)),
    provenance: Object.freeze(
      input.observations
        .map((entry) => entry.provenance)
        .filter((value): value is string => Boolean(value)),
    ),
    unknowns: Object.freeze(unknowns),
    freshness: stale ? "stale" : input.observations.length ? "current" : "unknown",
    epistemicStatus: latestObserved(input.observations) ? "INFERRED" : "UNKNOWN",
    status: input.state,
  });
}

export function reassessmentSignals(
  impact: ExecutiveGoalImpactView,
  comparisons: readonly ExecutiveOutcomeComparisonView[],
): readonly string[] {
  const signals: string[] = [];
  if (impact.state === "WORSENING") signals.push("GOAL_WORSENING");
  if (comparisons.some((entry) => entry.comparisonStatus === "WORSE_THAN_EXPECTED")) {
    signals.push("OUTCOME_BELOW_EXPECTATION");
  }
  if (impact.state === "MIXED") signals.push("CONTRADICTORY_RESULTS");
  if (impact.state === "ACHIEVED") signals.push("GOAL_ACHIEVED");
  return Object.freeze(signals);
}

export function toLearningHandoff(input: {
  readonly entrance: NexoraEntranceSession;
  readonly context: ExecutiveOutcomeContextView | null;
}): NexoraLearningReassessmentHandoff {
  return Object.freeze({
    activeGoal: input.entrance.goalDiscovery?.context ?? null,
    committedDecision: input.entrance.decisionExperience?.canonicalRecord ?? null,
    executionPlan: input.entrance.executionPlanning?.plan ?? null,
    executionRuntimeState: input.entrance.executionPlanning?.canonicalStatus ?? null,
    expectedOutcomes: input.context?.expectedOutcomes ?? [],
    observedOutcomes: input.context?.observedOutcomes ?? [],
    outcomeComparisons: input.context?.comparisons ?? [],
    goalImpact: input.context?.goalImpact ?? null,
    reassessmentSignals: input.context
      ? reassessmentSignals(input.context.goalImpact, input.context.comparisons)
      : [],
    evidence: input.context?.evidence ?? [],
    provenance: input.context?.provenance ?? [],
    unknowns: input.context?.unknowns ?? [],
    conversationContext: input.entrance.conversationNotes.slice(-6).join(" | "),
    startsLearning: false,
  });
}

export function followUpProgress(
  adapter: NexoraExecutionRuntimeAdapter | null,
  executionId: string | null,
): string | null {
  if (!adapter || !executionId) return null;
  const snapshot = projectExecutionFollowUpSnapshot({
    runtime: adapter,
    executionId,
  });
  if (!snapshot) return null;
  return `Follow-up: execution status ${snapshot.status}. That is progress, not an Outcome.`;
}

export function summarizeOutcome(context: ExecutiveOutcomeContextView): string {
  const expected = context.expectedOutcomes[0] ?? "No numeric expected value was recorded.";
  const observed = latestObserved(context.observedOutcomes);
  if (!observed) {
    return `Execution is active. ${expected} Expected remains PREDICTED. Nexora does not yet have enough outcome evidence to determine impact. Execution progress is not Outcome. Attribution is NOT_CONFIRMED.`;
  }
  const gap =
    context.goalImpact.gapBefore != null && context.goalImpact.gapNow != null
      ? ` Goal gap moved from ${context.goalImpact.gapBefore} to ${context.goalImpact.gapNow}.`
      : "";
  const source =
    observed.source === "manager-reported"
      ? " This observation is manager-reported, not a validated imported measure."
      : "";
  return `Expected stays PREDICTED (${expected}). Observed: ${observed.observedValue} (${observed.phase}). Goal impact: ${context.goalImpact.state}.${gap}${source} This is not proof that execution caused the change, and it is not Goal achievement unless success criteria are met.`;
}

export function compareNumericExpectedObserved(
  expected: number,
  observed: number,
  unit: string,
): ExecutiveOutcomeComparisonView {
  const variance = observed - expected;
  const status: OutcomeComparisonStatus =
    observed === expected
      ? "MATCHED"
      : Math.abs(observed) > Math.abs(expected) &&
          Math.sign(observed) === Math.sign(expected)
        ? "BETTER_THAN_EXPECTED"
        : observed < expected
          ? "WORSE_THAN_EXPECTED"
          : "DIFFERENT";
  return Object.freeze({
    subject: unit,
    expected: String(expected),
    observed: String(observed),
    unit,
    direction: variance === 0 ? "matched" : variance < 0 ? "below" : "above",
    variance,
    comparisonStatus: status,
    evidence: Object.freeze(["numeric-compatible-measures"]),
    epistemicStatus: "KNOWN",
  });
}

export function unitsComparable(left: string | null, right: string | null): boolean {
  return Boolean(left && right && left === right);
}

export function latestObserved(
  observations: readonly ExecutiveOutcomeObservationView[],
): ExecutiveOutcomeObservationView | null {
  return (
    [...observations]
      .reverse()
      .find((entry) => entry.observationId !== "obs-baseline-reality") ?? null
  );
}

function mapCoreComparison(result: string): OutcomeComparisonStatus {
  if (result === "exceeded") return "BETTER_THAN_EXPECTED";
  if (result === "met") return "MATCHED";
  if (result === "partially-met") return "PARTIAL";
  if (result === "not-met") return "WORSE_THAN_EXPECTED";
  if (result === "mixed") return "PARTIAL";
  if (result === "insufficient-comparable-evidence") return "NOT_COMPARABLE";
  return "UNKNOWN";
}

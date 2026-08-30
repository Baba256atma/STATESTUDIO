/**
 * DTH:11 — Outcome Observation Theatre composer.
 * Projects existing observations. Does not write Outcome, Learning, or Decisions.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreAuthoritativeExecution } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";
import {
  nexoraDecisionTheatreOutcomeObservationIdentity,
  nexoraDecisionTheatreOutcomeObservationVersion,
  type NexoraDecisionTheatreOutcomeObservation,
  type NexoraDecisionTheatreOutcomeObservationAction,
  type NexoraDecisionTheatreOutcomeObservationActionAvailability,
  type NexoraDecisionTheatreOutcomeObservationState,
} from "./nexoraDecisionTheatreOutcomeObservation.ts";

export const nexoraDecisionTheatreOutcomeObservationComposerIdentity =
  "DTH:11/OutcomeObservationComposer" as const;

export type NexoraDecisionTheatreAuthoritativeOutcomeObservation = Readonly<{
  observationId: string;
  executionId: string;
  decisionId?: string | null;
  goalId?: string | null;
  measure: string;
  observedNumeric: number | null;
  observedLabel: string;
  unit: string | null;
  baselineNumeric: number | null;
  baselineLabel: string | null;
  targetNumeric: number | null;
  targetLabel: string | null;
  source: "data-reality" | "kpi-observation" | "manager-reported" | "captured" | "unknown";
  phase: "early" | "interim" | "final" | "unknown";
  causalSupport: false;
  financialKnown: boolean;
}>;

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function action(
  name: NexoraDecisionTheatreOutcomeObservationAction,
  available: boolean,
  reason: string,
): NexoraDecisionTheatreOutcomeObservationActionAvailability {
  return Object.freeze({ action: name, available, reason });
}

function liveStatus(status: string | null): boolean {
  return status === "in-progress" || status === "blocked" || status === "at-risk" || status === "completed";
}

export function formatOutcomePercentagePointDelta(
  baseline: number,
  observed: number,
): Readonly<{ delta: number; label: string }> {
  const raw = observed - baseline;
  const delta = Number(raw.toFixed(6));
  const display = Number.isInteger(delta) ? String(delta) : String(Number(delta.toFixed(4)));
  const sign = delta > 0 ? "+" : "";
  return Object.freeze({
    delta,
    label: `${sign}${display} percentage points`,
  });
}

export function mapCapturedObservationsForTheatre(input: {
  readonly captured: readonly {
    observationId: string;
    executionId: string | null;
    decisionId: string | null;
    dimension: string;
    value: number | null;
    unit: string | null;
    qualitativeState: string | null;
    sourceId: string | null;
    provenanceRefs: readonly string[];
  }[];
  readonly executions: readonly { executionId: string; status: string }[];
}): readonly NexoraDecisionTheatreAuthoritativeOutcomeObservation[] {
  const knownIds = new Set(input.executions.map((item) => item.executionId));
  return Object.freeze(
    input.captured
      .filter((item) => item.executionId != null && knownIds.has(item.executionId))
      .map((item) => {
        const baselineRef = item.provenanceRefs.find((ref) => ref.startsWith("baseline:"));
        const targetRef = item.provenanceRefs.find((ref) => ref.startsWith("target:"));
        const baselineNumeric = baselineRef ? Number(baselineRef.slice("baseline:".length)) : null;
        const targetNumeric = targetRef ? Number(targetRef.slice("target:".length)) : null;
        const executionId = item.executionId as string;
        const status = input.executions.find((execution) => execution.executionId === executionId)?.status;
        return Object.freeze({
          observationId: item.observationId,
          executionId,
          decisionId: item.decisionId,
          goalId: null,
          measure: item.dimension,
          observedNumeric: item.value,
          observedLabel:
            item.value != null && item.unit === "%"
              ? `${Number(item.value.toFixed(4))}%`
              : item.qualitativeState ?? item.dimension,
          unit: item.unit,
          baselineNumeric,
          baselineLabel: baselineNumeric != null ? `${baselineNumeric}%` : null,
          targetNumeric,
          targetLabel: targetNumeric != null ? `${targetNumeric}%` : null,
          source:
            item.sourceId === "manager-reported"
              ? ("manager-reported" as const)
              : ("captured" as const),
          phase: status === "in-progress" ? ("early" as const) : ("unknown" as const),
          causalSupport: false as const,
          financialKnown: false,
        });
      })
      .filter((item) => item.executionId.length > 0),
  );
}

export function parseDeliveryOutcomeUtterance(utterance: string): {
  readonly observed: number;
  readonly baseline: number | null;
} | null {
  const text = utterance.trim().toLowerCase();
  const fromTo = text.match(/from\s+(\d+(?:\.\d+)?)\s*%?\s+to\s+(\d+(?:\.\d+)?)\s*%/);
  if (fromTo) {
    return Object.freeze({ baseline: Number(fromTo[1]), observed: Number(fromTo[2]) });
  }
  const now = text.match(/(?:on-time\s+)?delivery(?:\s+performance)?\s+(?:is\s+now|is|was observed(?:\s+at)?|at)\s+(\d+(?:\.\d+)?)\s*%/);
  if (now) {
    return Object.freeze({ baseline: null, observed: Number(now[1]) });
  }
  return null;
}

function theatreState(input: {
  readonly hasObservation: boolean;
  readonly executionStatus: string;
  readonly source: string | null;
  readonly phase: string;
}): NexoraDecisionTheatreOutcomeObservationState {
  if (!input.hasObservation) return "OUTCOME_PENDING";
  if (input.executionStatus !== "completed" && (input.phase === "early" || input.phase === "interim")) {
    return "OUTCOME_PARTIAL";
  }
  if (input.source === "manager-reported" || input.source === "unknown") return "OUTCOME_UNCERTAIN";
  return "OUTCOME_OBSERVED";
}

export function projectNexoraDecisionTheatreOutcomeObservation(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly authoritativeExecutions?: readonly NexoraDecisionTheatreAuthoritativeExecution[] | null;
  readonly authoritativeOutcomeObservations?: readonly NexoraDecisionTheatreAuthoritativeOutcomeObservation[] | null;
}): NexoraDecisionTheatreOutcomeObservation | null {
  const commitment = input.theatre.decisionCommitment;
  if (commitment?.state !== "COMMITTED" || commitment.authoritativeDecisionId == null) return null;
  const related =
    (input.authoritativeExecutions ?? []).find((item) => item.decisionId === commitment.authoritativeDecisionId) ??
    null;
  if (related == null || !liveStatus(related.status)) return null;
  const observations = (input.authoritativeOutcomeObservations ?? []).filter(
    (item) => item.executionId === related.executionId,
  );
  if (observations.length === 0 && related.status !== "completed") return null;
  const primary =
    observations.find((item) => /delivery/i.test(item.measure)) ?? observations[0] ?? null;
  const hasObservation = primary != null;
  const state = theatreState({
    hasObservation,
    executionStatus: related.status,
    source: primary?.source ?? null,
    phase: primary?.phase ?? "unknown",
  });
  const samePercentUnit =
    primary?.unit === "%" &&
    primary.observedNumeric != null &&
    primary.baselineNumeric != null;
  const delta = samePercentUnit
    ? formatOutcomePercentagePointDelta(primary.baselineNumeric!, primary.observedNumeric!)
    : null;
  const targetComparable =
    primary?.unit === "%" && primary.observedNumeric != null && primary.targetNumeric != null;
  const belowTarget = targetComparable ? primary.observedNumeric! < primary.targetNumeric! : null;
  const decisionTitle = commitment.candidateLabel ?? commitment.advisorReadable.reviewing;
  const unknowns = Object.freeze(
    [
      hasObservation ? null : "observed result",
      primary?.financialKnown === true ? null : "financial impact",
      primary?.baselineNumeric == null ? "baseline" : null,
      primary?.targetNumeric == null ? "target" : null,
      "causality",
      "learning",
    ].filter((item): item is string => item != null),
  );
  const resultCopy = hasObservation
    ? primary.observedNumeric != null
      ? `${primary.measure} was observed at ${primary.observedLabel} after the execution.`
      : primary.observedLabel
    : "I don't have an authoritative outcome observation yet.";
  const goalCopy =
    belowTarget === true
      ? `${primary!.measure} is below the stated ${primary!.targetLabel} goal.`
      : belowTarget === false
        ? `${primary!.measure} reached the stated ${primary!.targetLabel} goal.`
        : "A target is not established on the Outcome record.";
  const successCopy =
    belowTarget === true
      ? `${primary!.measure} improved or changed relative to available observations, but the observed result did not fully reach the target. That is not the same as declaring the Decision failed.`
      : hasObservation
        ? "An observation is available. That is not an automatic success or failure judgment."
        : "Execution completion is not the same as a successful Outcome.";
  const causalityCopy =
    "The available evidence does not establish that this execution alone caused the change.";
  const earlyCopy =
    state === "OUTCOME_PARTIAL"
      ? "This is an early or partial observation. It is not a final Outcome."
      : "No early Outcome label is applied.";
  const outcomeObservationId = `dth11-outcome:${input.theatre.sceneScript.scriptId}:${related.executionId}:${state}:${primary?.observationId ?? "none"}`;

  return freezeTree({
    identity: nexoraDecisionTheatreOutcomeObservationIdentity,
    version: nexoraDecisionTheatreOutcomeObservationVersion,
    outcomeObservationId,
    open: true as const,
    state,
    sceneIntentKind: input.theatre.sceneIntent.intentKind,
    sceneScriptId: input.theatre.sceneScript.scriptId,
    outcomeId: primary?.observationId ?? null,
    executionId: related.executionId,
    decisionId: related.decisionId,
    decisionTitle,
    goalId: primary?.goalId ?? null,
    executionStatus: related.status,
    observedLabel: primary?.observedLabel ?? null,
    observedNumeric: primary?.observedNumeric ?? null,
    baselineLabel: primary?.baselineLabel ?? null,
    baselineNumeric: primary?.baselineNumeric ?? null,
    targetLabel: primary?.targetLabel ?? null,
    targetNumeric: primary?.targetNumeric ?? null,
    deltaPercentagePoints: delta?.delta ?? null,
    deltaLabel: delta?.label ?? null,
    belowTarget,
    comparable: Boolean(delta) || Boolean(targetComparable),
    causalSupport: false as const,
    financialKnown: primary?.financialKnown === true,
    phase: primary?.phase ?? "unknown",
    comparisonMemberIds: commitment.comparisonMemberIds,
    unknowns,
    suggestedQuestions: Object.freeze([
      "What was the result?",
      "Did we reach the goal?",
      "Was it successful?",
    ]),
    actions: Object.freeze([
      action("VIEW_OUTCOME", hasObservation, hasObservation ? "The observation comes from existing Outcome capture." : "No Outcome observation is available yet."),
      action("VIEW_RELATED_EXECUTION", true, "The Execution comes from the existing Execution authority."),
      action("VIEW_AUTHORIZING_DECISION", true, "The authorizing Decision comes from the existing Decision authority."),
      action(
        "SHOW_COMPARISON_HISTORY",
        commitment.comparisonMemberIds.length >= 2,
        "Compared options remain available as history.",
      ),
      action("INSPECT_RELATED_OBJECT", true, "Inspection reuses existing object investigation."),
    ]),
    advisorReadable: Object.freeze({
      scene: hasObservation
        ? `The Theatre is now showing what was observed after the ${decisionTitle} execution.`
        : `The ${decisionTitle} execution does not yet have an authoritative Outcome observation.`,
      result: resultCopy,
      goal: goalCopy,
      delta:
        delta?.label ??
        (hasObservation
          ? "A comparable baseline is not established, so improvement is not calculated."
          : "No Outcome observation is available to compare."),
      success: successCopy,
      causality: causalityCopy,
      evidence: hasObservation
        ? `The ${primary.measure} observation is supported by the recorded observation source.`
        : "No Outcome evidence is recorded yet.",
      unknown: unknowns.map((item) => `${item} is not established`).join(". ") + ".",
      early: earlyCopy,
      mustNotInfer: Object.freeze([
        "Execution completed is not Outcome observed.",
        "Below target is not a failed Decision.",
        "Improvement during the period is not proven causation.",
        "Outcome is not Learning.",
        "Missing financial impact is not zero savings.",
      ]),
    }),
    limitations: Object.freeze([
      "DTH:11 does not write Outcome, Learning, or a new Decision.",
      "CORE-OUT:1A remains session-scoped capture when used. There is no durable Outcome writer on existing /executive.",
    ]),
    derivationMetadata: Object.freeze({
      composer: "DTH:11/OutcomeObservationComposer" as const,
      inventedOutcome: false as const,
      completionMeansSuccess: false as const,
      inventedCausality: false as const,
      inventedFinancials: false as const,
      inventedLearning: false as const,
      inventedDecision: false as const,
      clickMutatedOutcome: false as const,
      mutatedStage: false as const,
      timestampUsed: false as const,
      randomUsed: false as const,
    }),
  });
}

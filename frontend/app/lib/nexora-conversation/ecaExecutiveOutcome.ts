/**
 * NPA-T ECA:11 — Outcome Dialogue & Executive Result Interpretation.
 * Read-only conversational projection of CORE-OUT / DTH:11 evidence.
 * Does not write Outcome, Learning, Goal, Decision, or Execution.
 */
import { formatOutcomePercentagePointDelta } from "@/app/lib/decision-theatre/nexoraDecisionTheatreOutcomeObservationComposer.ts";
import type { EcaConversationActionPlan, EcaExecutiveIntent } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveAnswerIntakeJudgment } from "./ecaExecutiveAnswerIntake.ts";
import type { EcaLiveExecutionJudgment } from "./ecaLiveExecution.ts";
import type { EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";

export const ECA_OUTCOME_DIALOGUE_IDENTITY =
  "NPA-T ECA:11/OutcomeDialogueExecutiveResultInterpretation" as const;

export const ECA_OUTCOME_OBSERVATION_STATES = Object.freeze([
  "NOT_YET_OBSERVED",
  "PARTIALLY_OBSERVED",
  "OBSERVED",
  "CONFLICTED",
  "STALE",
  "UNKNOWN",
] as const);
export type EcaOutcomeObservationState = (typeof ECA_OUTCOME_OBSERVATION_STATES)[number];

export const ECA_OUTCOME_MANAGER_INTENTS = Object.freeze([
  "NONE",
  "RESULT",
  "GOAL",
  "IMPROVE",
  "CAUSE",
  "SUCCESS",
  "NEXT",
  "WHY",
  "COUNTERFACTUAL",
] as const);
export type EcaOutcomeManagerIntent = (typeof ECA_OUTCOME_MANAGER_INTENTS)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesDataTruth: false as const,
  writesRisk: false as const,
  writesGoal: false as const,
  writesKpi: false as const,
  writesProblem: false as const,
  writesScenario: false as const,
  commitsDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  createsSecondOutcomeWriter: false as const,
  replacesDth11: false as const,
  replacesDth12: false as const,
  replacesCoreOut: false as const,
  createsSecondInitiativeEngine: false as const,
  createsLearningEngine: false as const,
  infersCausality: false as const,
  inventsCounterfactual: false as const,
});

export type EcaOutcomeDimension = Readonly<{
  measure: string;
  observed: number | null;
  baseline: number | null;
  target: number | null;
  unit: string | null;
  source: "CONFIRMED" | "REPORTED" | "ESTIMATED" | "UNKNOWN";
}>;

export type EcaOutcomeEvidence = Readonly<{
  decisionId: string | null;
  executionId: string | null;
  executionStatus: string | null;
  primary: EcaOutcomeDimension | null;
  secondary: EcaOutcomeDimension | null;
  conflicted: boolean;
  stale: boolean;
  preExecution: boolean;
}>;

export type EcaOutcomeSession = Readonly<{
  lastFingerprint: string | null;
  acknowledgedResult: string | null;
}>;

export type EcaExecutiveOutcomeJudgment = Readonly<{
  identity: typeof ECA_OUTCOME_DIALOGUE_IDENTITY;
  observationState: EcaOutcomeObservationState;
  managerIntent: EcaOutcomeManagerIntent;
  baselineComparison: "IMPROVED" | "DETERIORATED" | "UNCHANGED" | "UNKNOWN";
  targetComparison: "MET" | "EXCEEDED" | "NOT_MET" | "UNKNOWN";
  overallInterpretation: "FAVORABLE" | "UNFAVORABLE" | "MIXED" | "INCONCLUSIVE" | "UNKNOWN";
  attribution: "NOT_ESTABLISHED";
  primaryResult: string | null;
  managerFacingNote: string | null;
  speak: boolean;
  falseObservation: false;
  falseImprovement: false;
  successInflation: false;
  causalityInflation: false;
  trustInflation: false;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{ sources: readonly string[]; rationale: string }>;
}>;

export type EcaOutcomeDialogueInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  answerIntake?: EcaExecutiveAnswerIntakeJudgment | null;
  liveExecution?: EcaLiveExecutionJudgment | null;
  session?: EcaOutcomeSession | null;
  evidence?: EcaOutcomeEvidence | null;
  recommendedOption?: string | null;
  chosenOption?: string | null;
  capAvUnconfirmed?: boolean;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function projectEcaOutcomeEvidence(input: {
  readonly execution?: {
    readonly executionId: string;
    readonly decisionId: string;
    readonly status: string;
  } | null;
  readonly observations?: readonly {
    readonly executionId: string;
    readonly decisionId?: string | null;
    readonly measure: string;
    readonly observedNumeric: number | null;
    readonly baselineNumeric: number | null;
    readonly targetNumeric: number | null;
    readonly unit: string | null;
    readonly source: string;
  }[];
}): EcaOutcomeEvidence | null {
  const execution = input.execution ?? null;
  const linked = (input.observations ?? []).filter(
    (item) => !execution || item.executionId === execution.executionId,
  );
  if (!execution && linked.length === 0) {
    return freeze({
      decisionId: null,
      executionId: null,
      executionStatus: null,
      primary: null,
      secondary: null,
      conflicted: false,
      stale: false,
      preExecution: false,
    });
  }
  const values = new Set(linked.map((item) => item.observedNumeric).filter((value): value is number => value != null));
  const delivery = linked.find((item) => /delivery/i.test(item.measure)) ?? linked[0] ?? null;
  const other = linked.find((item) => item !== delivery) ?? null;
  const source =
    delivery?.source === "manager-reported" || delivery?.source === "captured"
      ? "REPORTED"
      : delivery
        ? "CONFIRMED"
        : "UNKNOWN";
  return freeze({
    decisionId: execution?.decisionId ?? delivery?.decisionId ?? null,
    executionId: execution?.executionId ?? delivery?.executionId ?? null,
    executionStatus: execution?.status ?? null,
    primary: delivery
      ? freeze({
          measure: delivery.measure,
          observed: delivery.observedNumeric,
          baseline: delivery.baselineNumeric,
          target: delivery.targetNumeric,
          unit: delivery.unit,
          source,
        })
      : null,
    secondary: other
      ? freeze({
          measure: other.measure,
          observed: other.observedNumeric,
          baseline: other.baselineNumeric,
          target: other.targetNumeric,
          unit: other.unit,
          source: "CONFIRMED" as const,
        })
      : null,
    conflicted: values.size > 1,
    stale: false,
    preExecution: false,
  });
}

export function emptyEcaOutcomeSession(): EcaOutcomeSession {
  return freeze({ lastFingerprint: null, acknowledgedResult: null });
}

function classifyIntent(text: string, intent: EcaExecutiveIntent): EcaOutcomeManagerIntent {
  if (/\bwhat would have happened\b|\bwithout the decision\b/i.test(text)) return "COUNTERFACTUAL";
  if (/\bdid (?:our |the |this )?decision cause\b|\bdid capacity cause\b|\bcause (?:the improvement|it)\b/i.test(text)) {
    return "CAUSE";
  }
  if (/\bwhy (?:did|are) .*(?:improve|below|target)\b|\bwhy did it improve\b/i.test(text)) return "WHY";
  if (/\bdid we (?:hit|reach|achieve) the goal\b|\bso we hit the goal\b/i.test(text)) return "GOAL";
  if (/\bdid we improve\b|\bhow (?:did|much did) (?:delivery |we |it )?change\b|\bhow much did it improve\b/i.test(text)) {
    return "IMPROVE";
  }
  if (/\bwas it successful\b|\bwas choosing .*(?:mistake|right)\b|\bwas nexora right\b/i.test(text)) return "SUCCESS";
  if (/\bwhat should we do now\b|\breassess\b/i.test(text)) return "NEXT";
  if (
    intent === "REVIEW_OUTCOME" ||
    /\bdid it work\b|\bdid the decision work\b|\bwhat happened\b|\bwhat was the result\b|\bhow did we do\b|\bwhat(?:[’']s| is) the result\b/i.test(
      text,
    )
  ) {
    return "RESULT";
  }
  return "NONE";
}

function compareBaseline(
  baseline: number | null,
  observed: number | null,
  invert = false,
): EcaExecutiveOutcomeJudgment["baselineComparison"] {
  if (baseline == null || observed == null) return "UNKNOWN";
  if (observed === baseline) return "UNCHANGED";
  const improved = invert ? observed < baseline : observed > baseline;
  return improved ? "IMPROVED" : "DETERIORATED";
}

function compareTarget(target: number | null, observed: number | null): EcaExecutiveOutcomeJudgment["targetComparison"] {
  if (target == null || observed == null) return "UNKNOWN";
  if (observed > target) return "EXCEEDED";
  if (observed === target) return "MET";
  return "NOT_MET";
}

export function judgeEcaExecutiveOutcome(input: EcaOutcomeDialogueInput): EcaExecutiveOutcomeJudgment {
  const text = input.utterance.trim();
  const managerIntent = classifyIntent(text, input.actionPlan.intent);
  const evidence = input.evidence ?? null;
  const primary = evidence?.primary ?? null;
  const secondary = evidence?.secondary ?? null;
  const completed = evidence?.executionStatus === "completed" || input.liveExecution?.liveState === "COMPLETED";
  const live = Boolean(
    evidence?.executionStatus &&
      /^(?:in-progress|blocked|at-risk|completed)$/.test(evidence.executionStatus),
  );
  const estimate = input.answerIntake?.answerType === "ESTIMATE" || input.answerIntake?.confidence === "ESTIMATED";
  const intakeConflict = input.answerIntake?.conflict === "VALUE_CONFLICT" || input.answerIntake?.conflict === "SOURCE_CONFLICT";
  const conflicted = Boolean(evidence?.conflicted || intakeConflict);
  const stale = Boolean(evidence?.stale || evidence?.preExecution);
  const hasObservation = primary?.observed != null && !stale;
  const sources = freeze(["CORE-OUT:1", "CORE-OUT:1A", "DTH:11", "NPA-T ECA:11"]);

  let observationState: EcaOutcomeObservationState = "UNKNOWN";
  if (conflicted && hasObservation) observationState = "CONFLICTED";
  else if (stale && primary?.observed != null) observationState = "STALE";
  else if (hasObservation && !completed) observationState = "PARTIALLY_OBSERVED";
  else if (hasObservation) observationState = "OBSERVED";
  else if (completed || managerIntent !== "NONE") observationState = "NOT_YET_OBSERVED";

  const baselineComparison = conflicted || stale ? "UNKNOWN" : compareBaseline(primary?.baseline ?? null, primary?.observed ?? null);
  const secondaryComparison =
    secondary != null
      ? compareBaseline(secondary.baseline, secondary.observed, /cost/i.test(secondary.measure))
      : "UNKNOWN";
  const targetComparison = conflicted || stale ? "UNKNOWN" : compareTarget(primary?.target ?? null, primary?.observed ?? null);
  let overall: EcaExecutiveOutcomeJudgment["overallInterpretation"] = "UNKNOWN";
  if (conflicted) overall = "INCONCLUSIVE";
  else if (!hasObservation) overall = "UNKNOWN";
  else if (secondary && secondary.observed != null && secondary.baseline != null) {
    if (
      (baselineComparison === "IMPROVED" && secondaryComparison === "DETERIORATED") ||
      (baselineComparison === "DETERIORATED" && secondaryComparison === "IMPROVED")
    ) {
      overall = "MIXED";
    }
  }
  if (overall !== "MIXED" && hasObservation && !conflicted && !stale) {
    if (baselineComparison === "DETERIORATED" || targetComparison === "NOT_MET") overall = "UNFAVORABLE";
    if (baselineComparison === "IMPROVED" && targetComparison !== "NOT_MET") overall = "FAVORABLE";
    if (baselineComparison === "IMPROVED" && targetComparison === "NOT_MET") overall = "INCONCLUSIVE";
  }

  const acknowledge = /\bi (?:know|understand)\b/i.test(text);
  let speak = false;
  let note: string | null = null;
  let primaryResult: string | null = null;
  let rationale = "Outcome interpretation is read-only and never writes Outcome or Learning.";

  const outcomeMode = hasObservation || (completed && managerIntent !== "NONE");
  const resultQuestion = managerIntent !== "NONE";

  if (managerIntent === "NONE") {
    speak = false;
  } else if (!outcomeMode && live && !completed) {
    speak = false;
    rationale = "No Outcome evidence while Execution is live; ECA:10 remains primary.";
  } else if (managerIntent === "COUNTERFACTUAL") {
    speak = true;
    note = "We don’t have enough evidence to know what would have happened without the Decision.";
  } else if (input.capAvUnconfirmed && managerIntent === "CAUSE") {
    speak = true;
    note = "Capacity may be relevant, but CAP_AV’s business meaning is still unconfirmed. It will not be treated as the cause.";
  } else if (managerIntent === "CAUSE" || managerIntent === "WHY") {
    speak = true;
    note = hasObservation
      ? "The improvement followed the Decision’s Execution, but that alone doesn’t establish that the Decision caused it. The Decision may have contributed, but the current evidence doesn’t rule out other factors."
      : "The available evidence doesn’t establish a cause. Temporal sequence is not causality.";
  } else if (conflicted && resultQuestion) {
    speak = true;
    observationState = "CONFLICTED";
    note = "You reported a different value than the current accepted data source. We should resolve which observation is current before judging Goal achievement.";
    primaryResult = "conflicting Outcome evidence";
  } else if (stale && resultQuestion) {
    speak = true;
    note = "The latest recorded measurement predates this Execution, so I won’t treat it as the post-Execution Outcome.";
  } else if (!hasObservation && resultQuestion) {
    speak = Boolean(completed || managerIntent === "RESULT" || managerIntent === "GOAL" || managerIntent === "SUCCESS");
    if (completed) {
      note = "The Execution is complete, but I don’t have an observed result yet to judge whether it achieved the intended Outcome. Completion tells us the work finished; it doesn’t yet tell us whether the Decision achieved its result.";
    } else {
      speak = false;
    }
  } else if (hasObservation && managerIntent === "IMPROVE") {
    speak = true;
    if (primary!.baseline == null) {
      note = `I can see the current result is ${primary!.observed}%, but I don’t have a confirmed baseline to determine whether it improved.`;
    } else {
      const delta = formatOutcomePercentagePointDelta(primary!.baseline, primary!.observed!);
      note = `${primary!.measure} moved from ${primary!.baseline}% to ${primary!.observed}%, ${delta.label}.`;
      primaryResult = `${primary!.measure} ${delta.label}`;
    }
  } else if (hasObservation && managerIntent === "GOAL") {
    speak = true;
    if (primary!.target == null) {
      note = "I don’t have a confirmed target to judge Goal achievement.";
    } else if (conflicted) {
      note = "The result isn’t settled yet because the current sources disagree.";
    } else {
      const gap = formatOutcomePercentagePointDelta(primary!.target, primary!.observed!);
      const met = targetComparison === "MET" || targetComparison === "EXCEEDED";
      const baselineBit =
        primary!.baseline != null
          ? ` It did move from the ${primary!.baseline}% baseline.`
          : "";
      note = met
        ? `Yes. The observed value is ${primary!.observed}%, which meets the ${primary!.target}% Goal.${baselineBit} That does not by itself prove the Decision caused the result.`
        : `No. The observed value is ${primary!.observed}%, which is ${Math.abs(gap.delta)} percentage points below the ${primary!.target}% Goal.${baselineBit}`;
      primaryResult = met ? "Goal met" : "Goal not met";
    }
  } else if (hasObservation && managerIntent === "SUCCESS") {
    speak = true;
    if (overall === "MIXED" && secondary) {
      note = `${primary!.measure} improved, but ${secondary.measure} worsened, so the result is mixed rather than a clear success or failure.`;
      primaryResult = "mixed Outcome";
    } else if (baselineComparison === "IMPROVED" && targetComparison === "NOT_MET") {
      note = `The result improved relative to baseline, but the Goal wasn’t fully reached. That is not an automatic success or failure, and it does not grade the Decision.`;
    } else if (targetComparison === "MET" || targetComparison === "EXCEEDED") {
      note = "The observed result meets the available target. That does not prove the Decision was optimal.";
    } else {
      note = "I won’t invent a success score. The factual result is what the evidence shows, not a Decision grade.";
    }
    if (input.recommendedOption && input.chosenOption && input.recommendedOption !== input.chosenOption) {
      note = `${note} Interpretation follows the Decision that was actually executed, not Nexora’s earlier recommendation.`;
    }
  } else if (hasObservation && managerIntent === "NEXT") {
    speak = true;
    note =
      targetComparison === "NOT_MET"
        ? "The result remains below the Goal. The next useful step is to review what the Outcome tells us and whether any assumptions or the approach should be reassessed."
        : "The next useful step is to review the observed result. Reassessment belongs to the existing Learning/Reassessment path, not to this Outcome review.";
  } else if (hasObservation && (managerIntent === "RESULT" || intentResult(input.actionPlan.intent))) {
    speak = true;
    const trust =
      estimate || primary!.source === "ESTIMATED" || primary!.source === "REPORTED"
        ? `You reported ${primary!.measure} at around ${primary!.observed}%. `
        : "";
    if (primary!.baseline != null && primary!.target != null) {
      const fromBase = formatOutcomePercentagePointDelta(primary!.baseline, primary!.observed!);
      const vsGoal = formatOutcomePercentagePointDelta(primary!.target, primary!.observed!);
      const below = primary!.observed! < primary!.target;
      note = `${trust}${primary!.measure} moved from ${primary!.baseline}% to ${primary!.observed}%, ${fromBase.label}. ${
        below
          ? `The ${primary!.target}% Goal has not been reached yet; the current result is ${Math.abs(vsGoal.delta)} points below it.`
          : `The ${primary!.target}% Goal is met.`
      } The available evidence does not yet establish how much of that change was caused by this Decision.`;
      primaryResult = `${primary!.measure} ${fromBase.label}`;
    } else if (primary!.baseline != null) {
      const fromBase = formatOutcomePercentagePointDelta(primary!.baseline, primary!.observed!);
      note = `${trust}${primary!.measure} moved from ${primary!.baseline}% to ${primary!.observed}%, ${fromBase.label}. I don’t have a confirmed target to judge Goal achievement.`;
      primaryResult = `${primary!.measure} ${fromBase.label}`;
    } else if (primary!.target != null) {
      note = `${trust}The current result is ${primary!.observed}%. I don’t have a confirmed baseline to judge improvement.`;
    } else {
      note = `${trust}The current result is ${primary!.observed}%. I don’t have a confirmed baseline or target to judge improvement or Goal achievement.`;
    }
    if (completed) {
      note = `${note} Execution completion remains separate from this business result.`;
    } else if (live) {
      note = `${note} Execution remains active; this is a current observation, not proof that work is finished.`;
    }
    if (input.recommendedOption && input.chosenOption && input.recommendedOption !== input.chosenOption) {
      note = `${note} Interpretation follows the Decision that was actually executed, not Nexora’s earlier recommendation.`;
    }
  }

  if (acknowledge && input.session?.acknowledgedResult && input.session.acknowledgedResult === primaryResult) {
    speak = false;
  }

  return freeze({
    identity: ECA_OUTCOME_DIALOGUE_IDENTITY,
    observationState,
    managerIntent,
    baselineComparison,
    targetComparison,
    overallInterpretation: overall,
    attribution: "NOT_ESTABLISHED",
    primaryResult,
    managerFacingNote: note,
    speak,
    falseObservation: false,
    falseImprovement: false,
    successInflation: false,
    causalityInflation: false,
    trustInflation: false,
    boundaries: BOUNDARIES,
    provenance: freeze({ sources, rationale }),
  });
}

function intentResult(intent: EcaExecutiveIntent): boolean {
  return intent === "REVIEW_OUTCOME";
}

export function nextEcaOutcomeSession(
  previous: EcaOutcomeSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveOutcomeJudgment,
  evidence?: EcaOutcomeEvidence | null,
): EcaOutcomeSession {
  const base = previous ?? emptyEcaOutcomeSession();
  const acknowledge = /\bi (?:know|understand)\b/i.test(utterance);
  const fingerprint = evidence?.primary
    ? `${evidence.primary.measure}:${evidence.primary.observed}:${evidence.primary.baseline}:${evidence.primary.target}`
    : base.lastFingerprint;
  return freeze({
    lastFingerprint: fingerprint,
    acknowledgedResult: acknowledge && judgment.primaryResult ? judgment.primaryResult : base.acknowledgedResult,
  });
}

export function applyEcaOutcomeToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveOutcomeJudgment;
  readonly locked?: boolean;
}): string {
  if (input.locked || !input.judgment.speak) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 28).toLowerCase())) return input.source;
  // Generic CC/command failure is not Outcome truth. When ECA:11 can interpret, replace it.
  if (/couldn[’']t complete that request/i.test(input.source)) return note;
  return `${input.source} ${note}`.trim();
}

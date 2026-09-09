/**
 * NPA-T ECA:12 — Executive Learning, Reassessment & Conversation Loop Closure.
 * Read-only conversational projection of ECA:11 + CORE-OUT:2 + DTH:12.
 * Does not write Learning, APP-4, Decision, Goal, or a second objective store.
 */
import type { EcaConversationActionPlan } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveAnswerIntakeJudgment } from "./ecaExecutiveAnswerIntake.ts";
import type { EcaExecutiveDialogueStrategy } from "./ecaExecutiveDialogueStrategy.ts";
import type { EcaExecutiveOutcomeJudgment } from "./ecaExecutiveOutcome.ts";
import type { EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";

export const ECA_LEARNING_CLOSURE_IDENTITY =
  "NPA-T ECA:12/ExecutiveLearningReassessmentConversationLoopClosure" as const;

export const ECA_LEARNING_STATES = Object.freeze([
  "NONE",
  "UNKNOWN",
  "TENTATIVE",
  "SUPPORTED",
  "WEAK",
  "CONTRADICTED",
  "INCONCLUSIVE",
] as const);
export type EcaLearningState = (typeof ECA_LEARNING_STATES)[number];

export const ECA_LEARNING_MANAGER_INTENTS = Object.freeze([
  "NONE",
  "LEARNING",
  "REASSESS",
  "REPEAT",
  "DONE",
  "CLOSE",
  "KEEP_OPEN",
  "ACCEPT_UNKNOWN",
  "OVERSTATE",
  "NEXT",
  "REOPEN",
  "NEW_OBJECTIVE",
] as const);
export type EcaLearningManagerIntent = (typeof ECA_LEARNING_MANAGER_INTENTS)[number];

export const ECA_CLOSURE_STATES = Object.freeze([
  "CONTINUE",
  "READY_TO_CLOSE",
  "READY_TO_REASSESS",
  "WAIT_FOR_EVIDENCE",
  "PAUSE",
  "BLOCKED",
  "UNKNOWN",
] as const);
export type EcaClosureState = (typeof ECA_CLOSURE_STATES)[number];

export const ECA_REASSESSMENT_TARGETS = Object.freeze([
  "ASSUMPTION",
  "EVIDENCE",
  "SCENARIO",
  "DECISION",
  "EXECUTION_APPROACH",
  "GOAL",
  "UNKNOWN",
] as const);
export type EcaReassessmentTarget = (typeof ECA_REASSESSMENT_TARGETS)[number];

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
  writesApp4: false as const,
  createsSecondLearningEngine: false as const,
  replacesCoreOut2: false as const,
  replacesDth12: false as const,
  createsSecondObjectiveStore: false as const,
  replacesEca6: false as const,
  createsSecondInitiativeEngine: false as const,
  infersCausality: false as const,
  inventsCounterfactual: false as const,
  rewritesHistoricalRecommendation: false as const,
});

export type EcaLearningClosureSession = Readonly<{
  lastFingerprint: string | null;
  lastLearningNote: string | null;
  acceptedCauseUnknown: boolean;
  wantsClose: boolean;
  wantsKeepOpen: boolean;
  closedObjective: string | null;
  resumed: boolean;
  improvementObjective: boolean;
}>;

export type EcaExecutiveLearningClosureJudgment = Readonly<{
  identity: typeof ECA_LEARNING_CLOSURE_IDENTITY;
  managerIntent: EcaLearningManagerIntent;
  learningState: EcaLearningState;
  learningStatement: string | null;
  learningScope: "case-specific";
  hypothesisEffect: "strengthened" | "weakened" | "unchanged" | "unresolved" | "none";
  reassessmentWarranted: boolean;
  reassessmentTarget: EcaReassessmentTarget | null;
  reassessmentReason: string | null;
  closureState: EcaClosureState;
  closureReason: string | null;
  primaryResult: string | null;
  managerFacingNote: string | null;
  speak: boolean;
  causalLearningInflation: false;
  durableWrite: false;
  stickyStaleObjective: false;
  managerFacingNoteDuplicate: false;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{ sources: readonly string[]; rationale: string }>;
}>;

export type EcaLearningClosureInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  outcome: EcaExecutiveOutcomeJudgment;
  dialogue?: EcaExecutiveDialogueStrategy | null;
  answerIntake?: EcaExecutiveAnswerIntakeJudgment | null;
  session?: EcaLearningClosureSession | null;
  capAvUnconfirmed?: boolean;
  pendingConfirmation?: boolean;
  priorHypothesis?: "capacity-pressure" | null;
  hypothesisObservation?: "supports" | "challenges" | "inconclusive" | null;
  recommendedOption?: string | null;
  chosenOption?: string | null;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaLearningClosureSession(): EcaLearningClosureSession {
  return freeze({
    lastFingerprint: null,
    lastLearningNote: null,
    acceptedCauseUnknown: false,
    wantsClose: false,
    wantsKeepOpen: false,
    closedObjective: null,
    resumed: false,
    improvementObjective: false,
  });
}

function classifyIntent(text: string): EcaLearningManagerIntent {
  if (/\bgo back to (?:the )?delivery result\b|\breopen\b/i.test(text)) return "REOPEN";
  if (/\bnow (?:let['’]?s|lets) look at\b|\bnow compare\b|\bsupplier cost\b/i.test(text) && !/\bwhat did we learn\b/i.test(text)) {
    return "NEW_OBJECTIVE";
  }
  if (/\bwe (?:proved|learned that).*(?:was the cause|definitely)\b|\bproved capacity was the cause\b/i.test(text)) {
    return "OVERSTATE";
  }
  if (/\bi don['’]?t need to (?:know|investigate) (?:the )?cause\b|\bthat['’]?s okay\. i don['’]?t need\b|\bdon['’]?t need to investigate why\b/i.test(text)) {
    return "ACCEPT_UNKNOWN";
  }
  if (/\bkeep this open\b|\bwant to understand the cause\b/i.test(text)) return "KEEP_OPEN";
  if (/\bclose this review\b|\bthat['’]?s enough\b|\bno\. that['’]?s enough\b/i.test(text)) return "CLOSE";
  if (/\bare we done\b|\banything else we need\b|\banything else\b|\bdo we need to revisit\b/i.test(text)) return "DONE";
  if (/\bcome back later\b/i.test(text)) return "DONE";
  if (/\bshould we (?:do (?:this|it) again|repeat)\b|\bwas this worth it\b/i.test(text)) return "REPEAT";
  if (/\bshould we (?:reconsider|rethink|reassess)\b|\brethink the approach\b/i.test(text)) return "REASSESS";
  if (/\bwhat did we learn\b|\bwhat would you do next\b/i.test(text)) return "LEARNING";
  if (/\bwhat should we do now\b/i.test(text)) return "NEXT";
  return "NONE";
}

function insufficientOutcome(outcome: EcaExecutiveOutcomeJudgment): boolean {
  return (
    outcome.observationState === "NOT_YET_OBSERVED" ||
    outcome.observationState === "UNKNOWN" ||
    outcome.observationState === "STALE" ||
    outcome.observationState === "CONFLICTED"
  );
}

function mapLearning(outcome: EcaExecutiveOutcomeJudgment, conflicted: boolean): EcaLearningState {
  if (conflicted || outcome.observationState === "CONFLICTED") return "INCONCLUSIVE";
  if (outcome.observationState === "STALE") return "INCONCLUSIVE";
  if (insufficientOutcome(outcome)) return "NONE";
  if (outcome.overallInterpretation === "MIXED") return "TENTATIVE";
  if (outcome.baselineComparison === "UNKNOWN" && outcome.targetComparison === "UNKNOWN") return "NONE";
  return "TENTATIVE";
}

export function judgeEcaExecutiveLearningClosure(
  input: EcaLearningClosureInput,
): EcaExecutiveLearningClosureJudgment {
  const text = input.utterance.trim();
  const managerIntent = classifyIntent(text);
  const outcome = input.outcome;
  const session = input.session ?? emptyEcaLearningClosureSession();
  const sideQuestion = /\bwhat does cap_av mean\b/i.test(text);
  const sources = freeze(["ECA:11", "CORE-OUT:2", "DTH:12", "ECA:6", "NPA-T ECA:12"]);
  const conflicted = outcome.observationState === "CONFLICTED";
  const missingBaselineImprove =
    /\b(?:did (?:the decision |this )?improve|whether (?:delivery )?improved|did this improve)\b/i.test(text) ||
    (managerIntent === "DONE" && session.improvementObjective);
  const hypothesis = input.priorHypothesis ?? null;
  const hypothesisObs = input.hypothesisObservation ?? null;

  let learningState = mapLearning(outcome, conflicted);
  let hypothesisEffect: EcaExecutiveLearningClosureJudgment["hypothesisEffect"] = "none";
  if (hypothesis === "capacity-pressure" && !insufficientOutcome(outcome) && !conflicted) {
    if (hypothesisObs === "challenges" || (outcome.baselineComparison === "UNCHANGED" && outcome.targetComparison === "NOT_MET")) {
      learningState = "WEAK";
      hypothesisEffect = "weakened";
    } else if (hypothesisObs === "supports" || outcome.baselineComparison === "IMPROVED") {
      learningState = "TENTATIVE";
      hypothesisEffect = "strengthened";
    } else {
      hypothesisEffect = "unresolved";
    }
  }

  if (input.capAvUnconfirmed && (managerIntent === "OVERSTATE" || /capacity was the cause/i.test(text))) {
    learningState = insufficientOutcome(outcome) ? "NONE" : "TENTATIVE";
    hypothesisEffect = "unresolved";
  }

  const mixed = outcome.overallInterpretation === "MIXED";
  const goalMiss = outcome.targetComparison === "NOT_MET";
  const goalMet = outcome.targetComparison === "MET" || outcome.targetComparison === "EXCEEDED";
  const pending = Boolean(input.pendingConfirmation || input.workingContext.interactionMode === "PROPOSE_MUTATION");
  const accepted = session.acceptedCauseUnknown || managerIntent === "ACCEPT_UNKNOWN";
  const keepOpen = session.wantsKeepOpen || managerIntent === "KEEP_OPEN";

  let reassessmentWarranted = false;
  let reassessmentTarget: EcaReassessmentTarget | null = null;
  let reassessmentReason: string | null = null;
  if (!insufficientOutcome(outcome) && (goalMiss || mixed || hypothesisEffect === "weakened")) {
    reassessmentWarranted = true;
    reassessmentTarget = mixed ? "UNKNOWN" : hypothesisEffect === "weakened" ? "ASSUMPTION" : "EXECUTION_APPROACH";
    reassessmentReason = mixed ? "MATERIAL_TRADEOFF" : goalMiss ? "TARGET_NOT_MET" : "ASSUMPTION_WEAKENED";
  }
  if (goalMet && !mixed && hypothesisEffect !== "weakened") {
    reassessmentWarranted = false;
    reassessmentTarget = null;
    reassessmentReason = null;
  }

  let closureState: EcaClosureState = "CONTINUE";
  let closureReason = "Objective remains in progress.";
  if (pending) {
    closureState = "BLOCKED";
    closureReason = "A canonical confirmation is still pending.";
  } else if (conflicted && managerIntent !== "CLOSE" && managerIntent !== "ACCEPT_UNKNOWN") {
    closureState = "CONTINUE";
    closureReason = "Conflicting Outcome evidence still blocks a reliable lesson.";
  } else if (insufficientOutcome(outcome) && (managerIntent === "LEARNING" || managerIntent === "DONE" || managerIntent === "NONE")) {
    closureState = "WAIT_FOR_EVIDENCE";
    closureReason = "No Outcome evidence is available to learn from yet.";
  } else if (
    (managerIntent === "DONE" || managerIntent === "LEARNING") &&
    outcome.baselineComparison === "UNKNOWN" &&
    (missingBaselineImprove || /\bimprove delivery\b|\bdid the decision improve\b/i.test(text))
  ) {
    closureState = "BLOCKED";
    closureReason = "Baseline is missing, so improvement cannot be determined.";
  } else if (keepOpen && managerIntent !== "CLOSE" && managerIntent !== "ACCEPT_UNKNOWN" && managerIntent !== "NEW_OBJECTIVE") {
    closureState = "CONTINUE";
    closureReason = "Manager asked to keep the review open.";
  } else if (managerIntent === "REASSESS" && reassessmentWarranted) {
    closureState = "READY_TO_REASSESS";
    closureReason = "Material Outcome evidence justifies considering reassessment.";
  } else if (managerIntent === "CLOSE" || (managerIntent === "DONE" && accepted) || (managerIntent === "DONE" && goalMet && !keepOpen)) {
    closureState = "READY_TO_CLOSE";
    closureReason = accepted
      ? "The requested result question is resolved and remaining causal uncertainty is accepted."
      : "The requested executive question is sufficiently resolved.";
  } else if (managerIntent === "DONE" && goalMiss && !accepted && keepOpen === false && outcome.observationState !== "NOT_YET_OBSERVED") {
    closureState = "READY_TO_CLOSE";
    closureReason = "Goal-achievement is known even if cause remains uncertain.";
  } else if (/\bcome back later\b/i.test(text)) {
    closureState = "PAUSE";
    closureReason = "Manager asked to pause.";
  } else if (reassessmentWarranted && managerIntent === "LEARNING") {
    closureState = "READY_TO_REASSESS";
    closureReason = "Learning is bounded; reassessment may be considered.";
  }

  if (managerIntent === "NEW_OBJECTIVE") {
    closureState = "READY_TO_CLOSE";
    closureReason = "Previous review should not contaminate the new objective.";
  }

  let note: string | null = null;
  let speak = false;
  let primaryResult: string | null = null;
  let rationale = "ECA:12 frames CORE-OUT:2 Learning and ECA:6 closure without writing Learning or APP-4.";

  if (sideQuestion) {
    speak = false;
    rationale = "Side question; ECA:6 remains continuity authority.";
  } else if (managerIntent === "NONE" && input.dialogue?.relationshipToCurrentTurn === "SIDE_QUESTION") {
    speak = false;
  } else if (managerIntent === "LEARNING" && conflicted) {
    speak = true;
    note = "The current evidence is too inconsistent to draw a reliable lesson yet.";
    primaryResult = "inconclusive Learning";
  } else if (managerIntent === "LEARNING" && insufficientOutcome(outcome)) {
    speak = true;
    note = "We don’t have enough evidence to draw a useful lesson yet.";
    primaryResult = "no Learning yet";
  } else if (managerIntent === "OVERSTATE") {
    speak = true;
    note = input.capAvUnconfirmed
      ? "That’s your current interpretation. CAP_AV’s business meaning is still unconfirmed, so this cannot be treated as causal Learning."
      : "That’s your current interpretation. The result may strengthen a hypothesis, but the evidence still doesn’t establish it as the sole cause.";
    primaryResult = "causal boundary preserved";
  } else if (managerIntent === "LEARNING" && mixed) {
    speak = true;
    note =
      "The approach appears more promising for delivery than for cost. The trade-off should be considered before repeating it. That is not a universal success judgment.";
    primaryResult = "mixed Learning";
  } else if (managerIntent === "LEARNING" && hypothesisEffect === "weakened") {
    speak = true;
    note =
      "This result weakens the case that capacity alone explains the delivery problem. It does not prove capacity is irrelevant.";
    primaryResult = "weakened hypothesis";
  } else if (managerIntent === "LEARNING" && hypothesisEffect === "strengthened") {
    speak = true;
    note =
      "The result strengthens the capacity-pressure hypothesis, although it doesn’t establish capacity as the sole cause.";
    primaryResult = "strengthened hypothesis";
  } else if (managerIntent === "LEARNING" && goalMet) {
    speak = true;
    note =
      "The observed result met the available target. That is useful case-specific evidence. It does not prove the Decision was optimal or that Nexora’s earlier recommendation was correct.";
    primaryResult = "bounded favorable Learning";
  } else if (managerIntent === "LEARNING") {
    speak = true;
    note =
      outcome.baselineComparison === "IMPROVED"
        ? "The result improved relative to baseline. That is bounded, case-specific evidence. It does not establish what caused the change."
        : "Any lesson here stays bounded to this case. The available evidence does not establish a universal rule or a proven cause.";
    primaryResult = "bounded Learning";
  } else if (managerIntent === "REASSESS") {
    speak = true;
    if (reassessmentWarranted) {
      note =
        "The result is material enough to reassess the approach before repeating or extending it. That does not create a new Decision or change the Goal.";
    } else {
      note = "Nothing in the current Outcome requires immediate reassessment.";
    }
    primaryResult = reassessmentWarranted ? "reassessment candidate" : "no reassessment required";
  } else if (managerIntent === "REPEAT") {
    speak = true;
    note = mixed
      ? "The result supports considering the approach again under similar conditions, but the cost trade-off remains unresolved. I will not automatically recommend repeating it."
      : "I will not automatically recommend repeating the approach. Any new choice belongs to the existing Decision path.";
  } else if (managerIntent === "KEEP_OPEN") {
    speak = true;
    note = "I’ll keep this review open. The causal question remains unresolved.";
    closureState = "CONTINUE";
  } else if (managerIntent === "ACCEPT_UNKNOWN" || (managerIntent === "DONE" && accepted)) {
    speak = true;
    note =
      "For this review, yes. We know the result, and you’ve chosen not to pursue the remaining causal uncertainty.";
    closureState = "READY_TO_CLOSE";
  } else if (managerIntent === "CLOSE") {
    speak = true;
    if (pending) {
      note = "A confirmation is still pending, so I won’t treat this objective as complete yet.";
      closureState = "BLOCKED";
    } else {
      note = "We can close this review here. Nothing material remains required for the question you asked.";
      closureState = "READY_TO_CLOSE";
    }
  } else if (managerIntent === "DONE" && closureState === "BLOCKED") {
    speak = true;
    note =
      "Not for that question. I can see a current result, but I don’t have a confirmed baseline to determine whether delivery improved.";
  } else if (managerIntent === "DONE" && closureState === "WAIT_FOR_EVIDENCE") {
    speak = true;
    note = "Not yet. We don’t have an observed Outcome to learn from, so this review should wait for the result.";
  } else if (managerIntent === "DONE" && !reassessmentWarranted && !insufficientOutcome(outcome)) {
    speak = true;
    note =
      "Nothing material is unresolved for the objective you asked me to review. We can close it here.";
    closureState = "READY_TO_CLOSE";
  } else if (managerIntent === "DONE") {
    speak = true;
    note = accepted
      ? "For the Goal-achievement question, the review can close. The cause remains uncertain, and you’ve said you don’t need to investigate it further."
      : "For the Goal-achievement question the result is known. Remaining causal uncertainty does not have to keep the review open unless you want it to.";
    if (!keepOpen) closureState = "READY_TO_CLOSE";
  } else if (managerIntent === "NEXT") {
    speak = true;
    note = reassessmentWarranted
      ? "The next useful step is to review whether the approach should be reassessed. That does not create a new Decision."
      : "The next useful step is to close this review unless you want to investigate a remaining uncertainty.";
  } else if (managerIntent === "REOPEN") {
    speak = true;
    note = session.lastLearningNote
      ? session.lastLearningNote
      : "We can return to the delivery result using the existing objective, not a second objective store.";
  } else if (managerIntent === "NEW_OBJECTIVE") {
    speak = false;
    rationale = "New objective; prior Outcome review must not stay sticky.";
  }

  if (input.recommendedOption && input.chosenOption && input.recommendedOption !== input.chosenOption && speak && note) {
    if (!/earlier recommendation/i.test(note)) {
      note = `${note} Learning follows the Decision that was actually executed, not the earlier recommendation.`;
    }
  }

  if (session.lastLearningNote && note && session.lastLearningNote === note && managerIntent === "LEARNING") {
    speak = false;
    rationale = "Duplicate unchanged Learning is not repeated unsolicited.";
  }

  return freeze({
    identity: ECA_LEARNING_CLOSURE_IDENTITY,
    managerIntent,
    learningState,
    learningStatement: note,
    learningScope: "case-specific",
    hypothesisEffect,
    reassessmentWarranted,
    reassessmentTarget,
    reassessmentReason,
    closureState,
    closureReason,
    primaryResult,
    managerFacingNote: note,
    speak,
    causalLearningInflation: false,
    durableWrite: false,
    stickyStaleObjective: false,
    managerFacingNoteDuplicate: false,
    boundaries: BOUNDARIES,
    provenance: freeze({ sources, rationale }),
  });
}

export function nextEcaLearningClosureSession(
  previous: EcaLearningClosureSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveLearningClosureJudgment,
): EcaLearningClosureSession {
  const base = previous ?? emptyEcaLearningClosureSession();
  const intent = classifyIntent(utterance);
  const asksImprove = /\b(?:did (?:the decision |this )?improve|whether (?:delivery )?improved|did this improve)\b/i.test(
    utterance,
  );
  return freeze({
    lastFingerprint: `${judgment.learningState}:${judgment.closureState}:${judgment.hypothesisEffect}`,
    lastLearningNote: judgment.managerFacingNote ?? base.lastLearningNote,
    acceptedCauseUnknown: intent === "ACCEPT_UNKNOWN" ? true : base.acceptedCauseUnknown,
    wantsClose: intent === "CLOSE" || judgment.closureState === "READY_TO_CLOSE",
    wantsKeepOpen: intent === "KEEP_OPEN" ? true : intent === "CLOSE" || intent === "NEW_OBJECTIVE" ? false : base.wantsKeepOpen,
    closedObjective: judgment.closureState === "READY_TO_CLOSE" ? "ASSESS_OUTCOME" : intent === "NEW_OBJECTIVE" ? null : base.closedObjective,
    resumed: intent === "REOPEN",
    improvementObjective: asksImprove || (base.improvementObjective && intent !== "NEW_OBJECTIVE"),
  });
}

export function applyEcaLearningClosureToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveLearningClosureJudgment;
  readonly locked?: boolean;
}): string {
  if (input.locked || !input.judgment.speak) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 28).toLowerCase())) return input.source;
  if (/couldn[’']t complete that request/i.test(input.source)) return note;
  return `${input.source} ${note}`.trim();
}

/**
 * NPA-T ECA:6 — Executive Dialogue Strategy & Multi-Turn Objective Control.
 * Read-only strategy over CONV:2 thread/objective plus ECA:1–5. Does not
 * replace CONV:2, ECA:2, journey engines, or any writer.
 */
import type { EcaConversationActionPlan, EcaExecutiveIntent } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveInitiativeJudgment } from "./ecaExecutiveInitiativeJudgment.ts";
import type { EcaExecutiveInformationNeedJudgment } from "./ecaExecutiveInformationNeed.ts";
import type { EcaExecutiveAnswerIntakeJudgment } from "./ecaExecutiveAnswerIntake.ts";
import type { EcaSubject, EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";
import type {
  NexoraConversationObjective,
  NexoraConversationThreadStatus,
} from "./nexoraConversationObjective.ts";

export const ECA_EXECUTIVE_DIALOGUE_STRATEGY_IDENTITY =
  "NPA-T ECA:6/ExecutiveDialogueStrategyMultiTurnObjectiveControl" as const;

export const ECA_DIALOGUE_OBJECTIVE_TYPES = Object.freeze([
  "UNDERSTAND_SITUATION",
  "INVESTIGATE_ISSUE",
  "ASSESS_RISK",
  "EXPLORE_OPTIONS",
  "COMPARE_OPTIONS",
  "PREPARE_RECOMMENDATION",
  "PREPARE_DECISION",
  "REVIEW_DECISION",
  "PREPARE_EXECUTION",
  "REVIEW_EXECUTION",
  "ASSESS_OUTCOME",
  "REASSESS_APPROACH",
  "ACQUIRE_REQUIRED_INFORMATION",
] as const);
export type EcaDialogueObjectiveType = (typeof ECA_DIALOGUE_OBJECTIVE_TYPES)[number];

export const ECA_DIALOGUE_LIFECYCLES = Object.freeze([
  "CREATED",
  "ACTIVE",
  "PAUSED",
  "RESUMED",
  "COMPLETED",
  "ABANDONED",
  "SUPERSEDED",
] as const);
export type EcaDialogueLifecycle = (typeof ECA_DIALOGUE_LIFECYCLES)[number];

export const ECA_TURN_RELATIONSHIPS = Object.freeze([
  "PROGRESS",
  "SUPPORT",
  "SIDE_QUESTION",
  "SWITCH",
  "UNRELATED",
] as const);
export type EcaTurnRelationship = (typeof ECA_TURN_RELATIONSHIPS)[number];

export const ECA_DIALOGUE_MILESTONES = Object.freeze([
  "UNDERSTAND_CONTEXT",
  "CLARIFY_SUBJECT",
  "REVIEW_EVIDENCE",
  "RESOLVE_CRITICAL_INFORMATION_GAP",
  "INVESTIGATE_HYPOTHESIS",
  "IDENTIFY_OPTIONS",
  "COMPARE_OPTIONS",
  "REVIEW_TRADEOFFS",
  "FORM_RECOMMENDATION",
  "REVIEW_DECISION_READINESS",
  "REVIEW_EXECUTION_READINESS",
  "REVIEW_OUTCOME",
  "REASSESS",
  "NONE",
] as const);
export type EcaDialogueMilestone = (typeof ECA_DIALOGUE_MILESTONES)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesDataTruth: false as const,
  writesRisk: false as const,
  writesGoal: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  createsSecondObjectiveStore: false as const,
  replacesConv2: false as const,
  forcesWorkflow: false as const,
  recommendationEqualsDecision: false as const,
});

const SUPPORT_INTENTS: ReadonlySet<EcaExecutiveIntent> = new Set([
  "EXPLAIN",
  "UNDERSTAND",
  "SHOW",
  "COUNT",
  "LOCATE",
  "SUMMARIZE",
  "CLARIFY",
  "INSPECT_EVIDENCE",
  "UNKNOWN",
]);

export type EcaDialogueProgressMarker = Readonly<{
  id: string;
  confirmed: boolean;
}>;

export type EcaConv2ThreadRef = Readonly<{
  threadId: string | null;
  objective: NexoraConversationObjective | null;
  status: NexoraConversationThreadStatus | null;
}>;

export type EcaDialogueStrategySession = Readonly<{
  primaryType: EcaDialogueObjectiveType | null;
  lifecycle: EcaDialogueLifecycle | null;
  subjectId: string | null;
  subjectLabel: string | null;
  originUtterance: string | null;
  convThreadId: string | null;
  convObjective: NexoraConversationObjective | null;
  progress: readonly string[];
  pausedType: EcaDialogueObjectiveType | null;
  pausedSubjectLabel: string | null;
  turnCount: number;
  sawEvidence: boolean;
  sawCompare: boolean;
  sawRecommend: boolean;
  sawChoose: boolean;
}>;

export type EcaExecutiveDialogueStrategy = Readonly<{
  identity: typeof ECA_EXECUTIVE_DIALOGUE_STRATEGY_IDENTITY;
  objectiveType: EcaDialogueObjectiveType | null;
  lifecycle: EcaDialogueLifecycle | null;
  subject: EcaSubject | null;
  convThreadId: string | null;
  convObjective: NexoraConversationObjective | null;
  originUtterance: string | null;
  progress: readonly EcaDialogueProgressMarker[];
  unresolvedNeedId: string | null;
  currentMilestone: EcaDialogueMilestone;
  recommendedMilestone: EcaDialogueMilestone;
  relationshipToCurrentTurn: EcaTurnRelationship;
  returnToObjective: boolean;
  completionReason: string | null;
  reusedSuggestedManagerTurns: EcaConversationActionPlan["suggestedManagerTurns"];
  managerFacingNote: string | null;
  unnecessaryObjective: false;
  lostObjective: false;
  stickyStaleObjective: false;
  falseCompletion: false;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{
    sources: readonly string[];
    rationale: string;
  }>;
}>;

export type EcaDialogueStrategyInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  initiative?: EcaExecutiveInitiativeJudgment | null;
  informationNeed?: EcaExecutiveInformationNeedJudgment | null;
  answerIntake?: EcaExecutiveAnswerIntakeJudgment | null;
  session?: EcaDialogueStrategySession | null;
  conversationThread?: EcaConv2ThreadRef | null;
  committedDecisionId?: string | null;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaDialogueStrategySession(): EcaDialogueStrategySession {
  return freeze({
    primaryType: null,
    lifecycle: null,
    subjectId: null,
    subjectLabel: null,
    originUtterance: null,
    convThreadId: null,
    convObjective: null,
    progress: Object.freeze([]),
    pausedType: null,
    pausedSubjectLabel: null,
    turnCount: 0,
    sawEvidence: false,
    sawCompare: false,
    sawRecommend: false,
    sawChoose: false,
  });
}

function isWhereAreWe(text: string): boolean {
  return /^(?:where are we(?: now)?)\??$/i.test(text.trim());
}
function isWhatsNext(text: string): boolean {
  return /^(?:what(?:'s| is) next)\??$/i.test(text.trim());
}
function isAreWeDone(text: string): boolean {
  return /^(?:are we done|are we finished)\??$/i.test(text.trim());
}
function isStartOver(text: string): boolean {
  return /^(?:start over|restart)\.?$/i.test(text.trim());
}
function isPause(text: string): boolean {
  return /come back to this later|we(?:'| wi)ll come back|^not now\.?$/i.test(text.trim());
}
function isStageInspection(text: string): boolean {
  return (
    /\bwhat(?:'s| is) on (?:the )?stage\b/i.test(text) ||
    /\bwhat objects (?:are )?(?:on )?(?:the )?stage\b/i.test(text) ||
    /\bwhat can i see (?:here|on (?:the )?stage)\b/i.test(text) ||
    /\bwhich objects (?:are )?(?:visible|showing)\b/i.test(text)
  );
}
function isSideMeaning(text: string): boolean {
  return (
    /\bwhat does [\w_]+ mean\b|\bcap_av\b/i.test(text) ||
    isStageInspection(text) ||
    (/\b(?:csv|data library|data source)\b/i.test(text) && !/\bwhat data (?:is|are) this using\b/i.test(text) && !/\bwhat data supports\b/i.test(text)) ||
    /\b(?:kpi|conclude|which columns|what does [\w_]+ mean)\b/i.test(text) ||
    /^(?:explain|what is) data\b/i.test(text)
  );
}
function isResume(text: string): boolean {
  return /\b(?:go back to|let'?s go back|return to|continue the investigation|okay, continue|continue)\b/i.test(text);
}
function isAbandon(text: string): boolean {
  return /\b(?:forget (?:this|delivery|it)|drop it|this isn'?t useful|let'?s look at staffing)\b/i.test(text);
}
function isChoose(text: string, intent: EcaExecutiveIntent): boolean {
  return intent === "COMMIT_DECISION" || /^(?:i choose|choose)\b/i.test(text.trim());
}
function startsInvestigate(text: string, intent: EcaExecutiveIntent): boolean {
  if (intent === "INVESTIGATE") return true;
  return /\bwhy (?:are|is) .{0,60}late\b|\bhelp me understand why\b|\binvestigate\b/i.test(text);
}
function startsCompare(text: string, intent: EcaExecutiveIntent): boolean {
  if (intent === "COMPARE") return true;
  if (/\bcompare\b/i.test(text)) return true;
  return intent === "EVALUATE" && /\b(safer|cheaper|lower risk)\b/i.test(text);
}
function startsExplore(text: string, intent: EcaExecutiveIntent): boolean {
  return intent === "EXPLORE_SCENARIO" || /\bwhat can we do\b|\bshow (?:me )?the scenarios\b|\bwhat options\b/i.test(text);
}
function startsRecommend(intent: EcaExecutiveIntent): boolean {
  return intent === "SEEK_RECOMMENDATION";
}
function startsOutcome(intent: EcaExecutiveIntent, text: string): boolean {
  return intent === "REVIEW_OUTCOME" || /\bdid (?:it|the plan) work\b/i.test(text);
}
function startsExecutionReview(intent: EcaExecutiveIntent, text: string): boolean {
  return (
    intent === "REVIEW_EXECUTION" ||
    intent === "REQUEST_EXECUTION_ACTION" ||
    /\bshow (?:me )?(?:current )?executions?\b|\bstart the approved plan\b/i.test(text)
  );
}

function inferStartType(
  text: string,
  intent: EcaExecutiveIntent,
  hasPrimary: boolean,
): EcaDialogueObjectiveType | null {
  if (isSideMeaning(text)) return null;
  if (hasPrimary && /^(?:why|explain(?: it)?|thanks)\.?$/i.test(text.trim())) return null;
  if (startsOutcome(intent, text)) return "ASSESS_OUTCOME";
  if (isChoose(text, intent) || intent === "REVIEW_DECISION") return "PREPARE_DECISION";
  if (startsRecommend(intent)) return "PREPARE_RECOMMENDATION";
  if (startsCompare(text, intent)) return "COMPARE_OPTIONS";
  if (startsExplore(text, intent)) return "EXPLORE_OPTIONS";
  if (startsInvestigate(text, intent)) return "INVESTIGATE_ISSUE";
  if (!hasPrimary && startsExecutionReview(intent, text)) return "REVIEW_EXECUTION";
  if (intent === "REASSESS") return "REASSESS_APPROACH";
  if (!hasPrimary && intent === "UNDERSTAND" && /\bhelp me understand\b/i.test(text)) {
    return "UNDERSTAND_SITUATION";
  }
  return null;
}

function evolveType(
  current: EcaDialogueObjectiveType,
  next: EcaDialogueObjectiveType,
): EcaDialogueObjectiveType {
  if (current === next) return current;
  if (current === "INVESTIGATE_ISSUE" && (next === "EXPLORE_OPTIONS" || next === "COMPARE_OPTIONS")) {
    return next;
  }
  if (current === "EXPLORE_OPTIONS" && (next === "COMPARE_OPTIONS" || next === "PREPARE_RECOMMENDATION")) {
    return next;
  }
  if (current === "COMPARE_OPTIONS" && (next === "PREPARE_RECOMMENDATION" || next === "PREPARE_DECISION")) {
    return next;
  }
  if (current === "PREPARE_RECOMMENDATION" && next === "PREPARE_DECISION") return next;
  if (current === "PREPARE_DECISION" && (next === "PREPARE_EXECUTION" || next === "REVIEW_EXECUTION")) {
    return next;
  }
  if (next === "ASSESS_OUTCOME" || next === "REASSESS_APPROACH") return next;
  return current;
}

function milestoneFor(
  type: EcaDialogueObjectiveType | null,
  session: Pick<EcaDialogueStrategySession, "sawEvidence" | "sawCompare" | "sawRecommend">,
  need: EcaExecutiveInformationNeedJudgment | null,
): EcaDialogueMilestone {
  if (!type) return "NONE";
  if (need?.shouldAsk || need?.primaryNeed?.necessity === "BLOCKING") {
    return "RESOLVE_CRITICAL_INFORMATION_GAP";
  }
  if (type === "INVESTIGATE_ISSUE") {
    return session.sawEvidence ? "INVESTIGATE_HYPOTHESIS" : "REVIEW_EVIDENCE";
  }
  if (type === "EXPLORE_OPTIONS") return session.sawCompare ? "COMPARE_OPTIONS" : "IDENTIFY_OPTIONS";
  if (type === "COMPARE_OPTIONS") {
    if (session.sawRecommend) return "FORM_RECOMMENDATION";
    if (session.sawCompare) return "REVIEW_TRADEOFFS";
    return "COMPARE_OPTIONS";
  }
  if (type === "PREPARE_RECOMMENDATION") return "FORM_RECOMMENDATION";
  if (type === "PREPARE_DECISION") return "REVIEW_DECISION_READINESS";
  if (type === "PREPARE_EXECUTION" || type === "REVIEW_EXECUTION") return "REVIEW_EXECUTION_READINESS";
  if (type === "ASSESS_OUTCOME") return "REVIEW_OUTCOME";
  if (type === "REASSESS_APPROACH") return "REASSESS";
  return "UNDERSTAND_CONTEXT";
}

function progressList(
  session: EcaDialogueStrategySession,
  extras: readonly string[],
): readonly EcaDialogueProgressMarker[] {
  const ids = [...session.progress, ...extras].filter((item, index, all) => all.indexOf(item) === index);
  return freeze(
    ids.map((id) =>
      freeze({
        id,
        confirmed: id !== "INFORMATION_GAP_OPEN",
      }),
    ),
  );
}

function subjectOf(working: EcaWorkingConversationContext, labelHint?: string | null): EcaSubject | null {
  if (labelHint) {
    const lower = labelHint.toLowerCase().replace(/\s+watch$/i, "");
    const hit =
      working.stageContext.visible.find((item) => item.label.toLowerCase() === labelHint.toLowerCase()) ??
      working.stageContext.visible.find((item) => item.label.toLowerCase().replace(/\s+watch$/i, "") === lower) ??
      working.stageContext.visible.find((item) => item.label.toLowerCase().includes(lower));
    if (hit) return hit;
  }
  return working.activeSubject ?? working.stageContext.focus;
}

function blockingNeed(need: EcaExecutiveInformationNeedJudgment | null): boolean {
  return need?.shouldAsk === true || need?.primaryNeed?.necessity === "BLOCKING";
}

function nextNote(milestone: EcaDialogueMilestone): string {
  const map: Record<EcaDialogueMilestone, string> = {
    UNDERSTAND_CONTEXT: "The next useful step is clarifying what we are working on.",
    CLARIFY_SUBJECT: "The next useful step is clarifying the subject.",
    REVIEW_EVIDENCE: "The next useful step is reviewing the available evidence.",
    RESOLVE_CRITICAL_INFORMATION_GAP: "The next useful step is resolving the missing comparison or evidence input.",
    INVESTIGATE_HYPOTHESIS: "The next useful step is evaluating the current hypotheses.",
    IDENTIFY_OPTIONS: "The next useful step is identifying the available options.",
    COMPARE_OPTIONS: "The next useful step is comparing the options against delivery speed, cost, and risk.",
    REVIEW_TRADEOFFS: "The next useful step is reviewing the remaining trade-offs.",
    FORM_RECOMMENDATION: "The next useful step is reviewing the recommendation.",
    REVIEW_DECISION_READINESS: "The next useful step is reviewing Decision readiness. I will not commit a Decision.",
    REVIEW_EXECUTION_READINESS: "The next useful step is reviewing execution readiness. I will not start Execution.",
    REVIEW_OUTCOME: "The next useful step is reviewing the observed result without inferring causality.",
    REASSESS: "The next useful step is reassessment, without automatically changing the Decision.",
    NONE: "There is no additional strategic milestone right now.",
  };
  return map[milestone];
}

function finish(partial: Omit<EcaExecutiveDialogueStrategy, "identity" | "unnecessaryObjective" | "lostObjective" | "stickyStaleObjective" | "falseCompletion" | "boundaries">): EcaExecutiveDialogueStrategy {
  return freeze({
    identity: ECA_EXECUTIVE_DIALOGUE_STRATEGY_IDENTITY,
    unnecessaryObjective: false,
    lostObjective: false,
    stickyStaleObjective: false,
    falseCompletion: false,
    boundaries: BOUNDARIES,
    ...partial,
  });
}

export function judgeEcaExecutiveDialogueStrategy(
  input: EcaDialogueStrategyInput,
): EcaExecutiveDialogueStrategy {
  const text = input.utterance.trim();
  const intent = input.actionPlan.intent;
  const previous = input.session ?? emptyEcaDialogueStrategySession();
  const thread = input.conversationThread ?? null;
  const need = input.informationNeed ?? null;
  const intake = input.answerIntake ?? null;
  const gap = blockingNeed(need);
  const convThreadId = thread?.threadId ?? previous.convThreadId ?? input.workingContext.conversationContext.activeThreadId;
  const convObjective = thread?.objective ?? previous.convObjective;
  const sources = freeze(["NEX-CONV:2", "NPA-T ECA:1", "NPA-T ECA:2", "NPA-T ECA:4", "NPA-T ECA:5", "NPA-T ECA:6"]);

  const emptyResult = (rationale: string, relationship: EcaTurnRelationship, note: string | null = null) =>
    finish({
      objectiveType: null,
      lifecycle: null,
      subject: subjectOf(input.workingContext),
      convThreadId,
      convObjective,
      originUtterance: null,
      progress: freeze([]),
      unresolvedNeedId: need?.primaryNeed?.id ?? null,
      currentMilestone: "NONE",
      recommendedMilestone: "NONE",
      relationshipToCurrentTurn: relationship,
      returnToObjective: false,
      completionReason: null,
      reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
      managerFacingNote: note,
      provenance: freeze({ sources, rationale }),
    });

  if (isStartOver(text)) {
    return finish({
      objectiveType: null,
      lifecycle: "ABANDONED",
      subject: subjectOf(input.workingContext),
      convThreadId,
      convObjective,
      originUtterance: previous.originUtterance,
      progress: freeze([]),
      unresolvedNeedId: null,
      currentMilestone: "NONE",
      recommendedMilestone: "UNDERSTAND_CONTEXT",
      relationshipToCurrentTurn: "SWITCH",
      returnToObjective: false,
      completionReason: "Manager asked to restart conversational strategy, not business state.",
      reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
      managerFacingNote:
        "I can restart this conversation’s objective. I will not reset business objects, Decisions, or data.",
      provenance: freeze({
        sources,
        rationale: "Start over clears dialogue strategy only; canonical writers are untouched.",
      }),
    });
  }

  if (!previous.primaryType && SUPPORT_INTENTS.has(intent) && !inferStartType(text, intent, false) &&
      !isWhereAreWe(text) && !isWhatsNext(text) && !isAreWeDone(text) && !isSideMeaning(text) &&
      !startsExecutionReview(intent, text) && !startsOutcome(intent, text)) {
    return emptyResult(
      "Supporting turns do not create a new primary executive dialogue objective.",
      "UNRELATED",
    );
  }

  if (isAbandon(text) && previous.primaryType) {
    const nextType = startsExecutionReview(intent, text)
      ? "REVIEW_EXECUTION"
      : inferStartType(text, intent, false);
    return finish({
      objectiveType: nextType,
      lifecycle: nextType ? "CREATED" : "SUPERSEDED",
      subject: subjectOf(input.workingContext),
      convThreadId,
      convObjective,
      originUtterance: nextType ? text : previous.originUtterance,
      progress: freeze([]),
      unresolvedNeedId: null,
      currentMilestone: milestoneFor(nextType, previous, need),
      recommendedMilestone: milestoneFor(nextType, previous, need),
      relationshipToCurrentTurn: "SWITCH",
      returnToObjective: false,
      completionReason: "Manager explicitly moved on.",
      reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
      managerFacingNote: null,
      provenance: freeze({
        sources,
        rationale: "Explicit manager switch supersedes the prior dialogue objective.",
      }),
    });
  }

  if (isPause(text) && previous.primaryType && previous.lifecycle !== "COMPLETED") {
    return finish({
      objectiveType: previous.primaryType,
      lifecycle: "PAUSED",
      subject: freeze({
        id: previous.subjectId ?? "unknown",
        label: previous.subjectLabel ?? "current issue",
        kind: null,
      }),
      convThreadId,
      convObjective,
      originUtterance: previous.originUtterance,
      progress: progressList(previous, []),
      unresolvedNeedId: need?.primaryNeed?.id ?? null,
      currentMilestone: milestoneFor(previous.primaryType, previous, need),
      recommendedMilestone: "NONE",
      relationshipToCurrentTurn: "UNRELATED",
      returnToObjective: false,
      completionReason: null,
      reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
      managerFacingNote: null,
      provenance: freeze({
        sources,
        rationale: "Pause is conversational; Nexora does not repeatedly steer back.",
      }),
    });
  }

  if (isResume(text) && (previous.pausedType || previous.lifecycle === "PAUSED" || previous.primaryType)) {
    const resumed = previous.pausedType ?? previous.primaryType;
    return finish({
      objectiveType: resumed,
      lifecycle: "RESUMED",
      subject: freeze({
        id: previous.subjectId ?? "unknown",
        label: previous.pausedSubjectLabel ?? previous.subjectLabel ?? "prior issue",
        kind: null,
      }),
      convThreadId,
      convObjective,
      originUtterance: previous.originUtterance,
      progress: progressList(previous, ["RESUMED"]),
      unresolvedNeedId: need?.primaryNeed?.id ?? null,
      currentMilestone: milestoneFor(resumed, previous, need),
      recommendedMilestone: milestoneFor(resumed, previous, need),
      relationshipToCurrentTurn: "PROGRESS",
      returnToObjective: false,
      completionReason: null,
      reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
      managerFacingNote: null,
      provenance: freeze({
        sources,
        rationale: "Resume uses the session strategy overlay only; Stage is not reconstructed as an objective.",
      }),
    });
  }

  if (previous.lifecycle === "PAUSED" && startsExecutionReview(intent, text) && !isResume(text)) {
    return finish({
      objectiveType: previous.primaryType,
      lifecycle: "PAUSED",
      subject: freeze({
        id: previous.subjectId ?? "unknown",
        label: previous.subjectLabel ?? "prior issue",
        kind: null,
      }),
      convThreadId,
      convObjective,
      originUtterance: previous.originUtterance,
      progress: progressList(previous, []),
      unresolvedNeedId: null,
      currentMilestone: milestoneFor(previous.primaryType, previous, need),
      recommendedMilestone: "NONE",
      relationshipToCurrentTurn: "UNRELATED",
      returnToObjective: false,
      completionReason: null,
      reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
      managerFacingNote: null,
      provenance: freeze({
        sources,
        rationale: "Explicit Execution request is answered; the paused objective is not forced back.",
      }),
    });
  }

  const started = inferStartType(text, intent, Boolean(previous.primaryType));
  let primary = previous.primaryType;
  let lifecycle: EcaDialogueLifecycle | null = previous.lifecycle;
  let origin = previous.originUtterance;
  let relationship: EcaTurnRelationship = "PROGRESS";
  let rationale = "The current turn is interpreted against CONV:2 identity plus the ECA:6 strategy overlay.";
  const extras: string[] = [];

  if (primary && isSideMeaning(text)) {
    relationship = "SIDE_QUESTION";
    rationale = "A side question does not destroy the primary dialogue objective.";
  } else if (primary && startsExecutionReview(intent, text) && started !== "PREPARE_EXECUTION") {
    relationship = "UNRELATED";
    rationale = "Explicit manager intent is answered; the investigation objective remains in the background.";
  } else if (primary && SUPPORT_INTENTS.has(intent) && !started) {
    relationship = intent === "INSPECT_EVIDENCE" || (intent === "SHOW" && /\bevidence\b/i.test(text))
      ? "PROGRESS"
      : "SUPPORT";
    if (
      input.actionPlan.nextAction === "SHOW_EVIDENCE" &&
      input.actionPlan.requiredContext.some(
        (item) => item.kind === "EVIDENCE" && item.availability === "AVAILABLE",
      )
    ) {
      extras.push("EVIDENCE_REVIEWED");
    }
  } else if (!primary && started) {
    primary = started;
    lifecycle = "CREATED";
    origin = text;
    extras.push("ISSUE_IDENTIFIED");
    relationship = "PROGRESS";
    rationale = "A sufficiently clear larger purpose started a primary dialogue objective.";
  } else if (primary && started && started !== primary) {
    const evolved = evolveType(primary, started);
    if (evolved !== primary) {
      relationship = "PROGRESS";
      primary = evolved;
      extras.push(`EVOLVED_${started}`);
      lifecycle = "ACTIVE";
    } else {
      relationship = "SUPPORT";
    }
  } else if (primary) {
    relationship = "PROGRESS";
    if (lifecycle === "CREATED" || lifecycle === "RESUMED") lifecycle = "ACTIVE";
  } else {
    return emptyResult("No larger executive dialogue objective is warranted for this turn.", "UNRELATED");
  }

  if (lifecycle === "CREATED" && previous.primaryType === primary) lifecycle = "ACTIVE";
  if (primary && lifecycle !== "PAUSED" && lifecycle !== "COMPLETED" && lifecycle !== "ABANDONED" && lifecycle !== "SUPERSEDED") {
    lifecycle = previous.primaryType === primary && previous.lifecycle && previous.lifecycle !== "CREATED"
      ? "ACTIVE"
      : lifecycle ?? "ACTIVE";
  }

  if (startsCompare(text, intent) || intent === "COMPARE") extras.push("OPTIONS_COMPARED");
  if (startsRecommend(intent) || input.actionPlan.nextAction === "RECOMMEND_OPTION") {
    extras.push("RECOMMENDATION_PRESENTED");
  }
  if (intake?.needSatisfaction === "PARTIALLY_SATISFIED") extras.push("PARTIAL_INPUT_ACQUIRED");
  if (intake?.needSatisfaction === "SATISFIED" && intake.answerType === "ESTIMATE") {
    extras.push("ESTIMATE_ACQUIRED_NOT_CONFIRMED");
  }
  if (need?.shouldAsk) extras.push("INFORMATION_GAP_OPEN");
  if (isChoose(text, intent)) extras.push("DECISION_INTENT");
  if (primary === "ASSESS_OUTCOME") extras.push("OUTCOME_CLAIM_ONLY");

  const sawEvidence = previous.sawEvidence || extras.includes("EVIDENCE_REVIEWED");
  const sawCompare = previous.sawCompare || extras.includes("OPTIONS_COMPARED") || intent === "COMPARE";
  const sawRecommend = previous.sawRecommend || extras.includes("RECOMMENDATION_PRESENTED");
  const sawChoose = previous.sawChoose || extras.includes("DECISION_INTENT");
  const sessionView = freeze({
    ...previous,
    sawEvidence,
    sawCompare,
    sawRecommend,
    sawChoose,
    primaryType: primary,
  });

  let completionReason: string | null = null;
  const comparisonComplete =
    (primary === "COMPARE_OPTIONS" || primary === "PREPARE_RECOMMENDATION") &&
    sawCompare &&
    sawRecommend &&
    !gap &&
    intake?.needSatisfaction !== "PARTIALLY_SATISFIED";

  if (isAreWeDone(text) && gap) {
    lifecycle = "ACTIVE";
  } else if (isAreWeDone(text) && comparisonComplete) {
    lifecycle = "COMPLETED";
    completionReason = "The comparison conversational objective is complete. No Decision was committed.";
  }

  if (input.committedDecisionId && (primary === "PREPARE_DECISION" || sawChoose || previous.sawChoose)) {
    lifecycle = "COMPLETED";
    completionReason = "Canonical Decision commitment completed PREPARE_DECISION. Execution was not started.";
    extras.push("DECISION_COMMITTED_CANONICAL");
    primary = "PREPARE_DECISION";
  }

  const currentMilestone = milestoneFor(primary, sessionView, need);
  let recommendedMilestone = currentMilestone;
  if (extras.includes("DECISION_COMMITTED_CANONICAL") || /\bstart the approved plan\b/i.test(text)) {
    recommendedMilestone = "REVIEW_EXECUTION_READINESS";
  }
  if (startsRecommend(intent)) recommendedMilestone = "FORM_RECOMMENDATION";
  if (isWhatsNext(text) && recommendedMilestone === "NONE") recommendedMilestone = "UNDERSTAND_CONTEXT";

  const returnToObjective =
    relationship === "SIDE_QUESTION" &&
    primary === "COMPARE_OPTIONS" &&
    isSideMeaning(text) &&
    !/^thanks\.?$/i.test(text);

  let note: string | null = null;
  if (isWhereAreWe(text) && primary) {
    const bits = progressList(previous, extras)
      .map((item) => item.id.replace(/_/g, " ").toLowerCase())
      .slice(0, 4);
    note = `We are still working on ${primary.replace(/_/g, " ").toLowerCase()}${
      previous.subjectLabel ? ` around ${previous.subjectLabel}` : ""
    }. Progress so far: ${bits.join(", ") || "just started"}${
      gap ? ", but a required information gap remains" : ""
    }.`;
  }
  if (isWhatsNext(text)) note = nextNote(recommendedMilestone);
  if (isAreWeDone(text)) {
    note =
      lifecycle === "COMPLETED"
        ? "Yes. The comparison is complete. You can now review the recommendation or make a Decision."
        : gap
          ? "Not yet. A required input is still uncertain, so this objective is not complete."
          : "Not yet. The current objective still has remaining work.";
  }
  if (returnToObjective) {
    note =
      "That field’s meaning is still unconfirmed in Data. We were comparing options — do you want to continue?";
  }

  return finish({
    objectiveType: primary,
    lifecycle,
    subject: subjectOf(input.workingContext, previous.subjectLabel),
    convThreadId,
    convObjective,
    originUtterance: origin,
    progress: progressList(previous, extras),
    unresolvedNeedId: gap ? need?.primaryNeed?.id ?? null : null,
    currentMilestone,
    recommendedMilestone,
    relationshipToCurrentTurn: relationship,
    returnToObjective,
    completionReason,
    reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
    managerFacingNote: note,
    provenance: freeze({ sources, rationale }),
  });
}

export function nextEcaDialogueStrategySession(
  previous: EcaDialogueStrategySession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveDialogueStrategy,
): EcaDialogueStrategySession {
  const base = previous ?? emptyEcaDialogueStrategySession();
  if (isStartOver(utterance)) return emptyEcaDialogueStrategySession();
  const paused = judgment.lifecycle === "PAUSED";
  const switched = judgment.relationshipToCurrentTurn === "SWITCH";
  return freeze({
    primaryType:
      judgment.lifecycle === "SUPERSEDED" && !judgment.objectiveType ? null : judgment.objectiveType,
    lifecycle: judgment.lifecycle,
    subjectId: judgment.subject?.id ?? base.subjectId,
    subjectLabel: judgment.subject?.label ?? base.subjectLabel,
    originUtterance: judgment.originUtterance ?? base.originUtterance,
    convThreadId: judgment.convThreadId,
    convObjective: judgment.convObjective,
    progress: freeze(judgment.progress.map((item) => item.id).slice(-16)),
    pausedType: paused ? judgment.objectiveType : switched ? base.primaryType : base.pausedType,
    pausedSubjectLabel: paused ? judgment.subject?.label ?? null : base.pausedSubjectLabel,
    turnCount: base.turnCount + 1,
    sawEvidence: base.sawEvidence || judgment.progress.some((item) => item.id === "EVIDENCE_REVIEWED"),
    sawCompare:
      base.sawCompare ||
      judgment.progress.some((item) => item.id === "OPTIONS_COMPARED") ||
      judgment.objectiveType === "COMPARE_OPTIONS",
    sawRecommend: base.sawRecommend || judgment.progress.some((item) => item.id === "RECOMMENDATION_PRESENTED"),
    sawChoose: base.sawChoose || judgment.progress.some((item) => item.id === "DECISION_INTENT"),
  });
}

export function applyEcaDialogueStrategyToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveDialogueStrategy;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (/step \d+ of \d+/i.test(note)) return input.source;
  const meta =
    isWhereAreWe(input.utterance) ||
    isWhatsNext(input.utterance) ||
    isAreWeDone(input.utterance) ||
    isStartOver(input.utterance);
  if (!meta && !input.judgment.returnToObjective) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 24).toLowerCase())) return input.source;
  return `${input.source} ${note}`.trim();
}

/**
 * NPA-T ECA:9 — Executive Post-Decision Dialogue & Execution Readiness Guidance.
 * Read-only judgment after a canonical Decision. Does not replace CC:11, DTH:9,
 * or DTH:10, and never writes Execution.
 */
import type { EcaConversationActionPlan, EcaExecutiveIntent } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveInformationNeedJudgment } from "./ecaExecutiveInformationNeed.ts";
import type { EcaExecutiveAnswerIntakeJudgment } from "./ecaExecutiveAnswerIntake.ts";
import type { EcaExecutiveDialogueStrategy } from "./ecaExecutiveDialogueStrategy.ts";
import type { EcaExecutiveRecommendationJudgment } from "./ecaExecutiveRecommendation.ts";
import type { EcaExecutiveCommitmentJudgment } from "./ecaExecutiveCommitment.ts";
import type { EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";

export const ECA_EXECUTIVE_EXECUTION_READINESS_IDENTITY =
  "NPA-T ECA:9/ExecutivePostDecisionDialogueExecutionReadinessGuidance" as const;

export const ECA_POST_DECISION_STATES = Object.freeze([
  "NOT_APPLICABLE",
  "DECISION_CONFIRMED",
  "EXECUTION_REVIEW",
  "EXECUTION_PREPARATION",
  "EXECUTION_READY",
  "EXECUTION_NOT_READY",
  "EXECUTION_CREATE_INTENT",
  "EXECUTION_START_INTENT",
  "EXECUTION_ALREADY_ACTIVE",
  "EXECUTION_BLOCKED",
] as const);
export type EcaPostDecisionState = (typeof ECA_POST_DECISION_STATES)[number];

export const ECA_EXECUTION_READINESS_STATES = Object.freeze([
  "READY",
  "READY_WITH_CONDITIONS",
  "NOT_READY",
  "BLOCKED",
  "ALREADY_EXECUTING",
  "NOT_APPLICABLE",
] as const);
export type EcaExecutionReadinessState = (typeof ECA_EXECUTION_READINESS_STATES)[number];

export const ECA_EXECUTION_MANAGER_INTENTS = Object.freeze([
  "NONE",
  "WHATS_NEXT",
  "READINESS",
  "MISSING",
  "OWNER",
  "STOPPERS",
  "REVIEW",
  "CREATE",
  "START",
  "DEFER",
  "RECONSIDER",
  "LIVE",
  "HYPOTHETICAL",
] as const);
export type EcaExecutionManagerIntent = (typeof ECA_EXECUTION_MANAGER_INTENTS)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesDataTruth: false as const,
  writesRisk: false as const,
  writesGoal: false as const,
  writesScenario: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  createsExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  createsSecondExecutionWriter: false as const,
  createsSecondExecutionStore: false as const,
  replacesDth9: false as const,
  replacesDth10: false as const,
  replacesCc11: false as const,
  illegalCreateStartCollapse: false as const,
  recommendationOverridesDecision: false as const,
});

export type EcaExecutionSnapshot = Readonly<{
  executionId: string;
  decisionId: string;
  title: string;
  status: string;
  ownerIds: readonly string[];
  blockers: readonly { readonly blockerId?: string; readonly label: string }[];
  risks: readonly { readonly riskId?: string; readonly label: string }[];
}>;

export type EcaExecutionReadinessSession = Readonly<{
  lastDecisionId: string | null;
  lastExecutionId: string | null;
  acknowledgedGap: string | null;
  deferredStart: boolean;
  lastReadiness: EcaExecutionReadinessState | null;
}>;

export type EcaExecutiveExecutionReadinessJudgment = Readonly<{
  identity: typeof ECA_EXECUTIVE_EXECUTION_READINESS_IDENTITY;
  postDecisionState: EcaPostDecisionState;
  managerIntent: EcaExecutionManagerIntent;
  decisionId: string | null;
  executionId: string | null;
  executionStatus: string | null;
  readiness: EcaExecutionReadinessState;
  primaryGap: string | null;
  ownerState: "KNOWN" | "UNKNOWN" | "AMBIGUOUS" | "NOT_APPLICABLE";
  blockerState: "NONE" | "KNOWN" | "UNKNOWN" | "NOT_APPLICABLE";
  riskIsBlocker: false;
  canonicalCreateAllowed: boolean;
  canonicalStartAllowed: boolean;
  canonicalAuthority: "CC:11 Execution Follow-up";
  cc11StartMayCreate: true;
  reusedSuggestedManagerTurns: EcaConversationActionPlan["suggestedManagerTurns"];
  managerFacingNote: string | null;
  speak: boolean;
  staleReadiness: false;
  trustInflation: false;
  implicitCreate: false;
  implicitStart: false;
  targetDrift: false;
  unnecessaryBlocker: false;
  duplicateWarning: false;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{
    sources: readonly string[];
    rationale: string;
  }>;
}>;

export type EcaExecutionReadinessInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  informationNeed?: EcaExecutiveInformationNeedJudgment | null;
  answerIntake?: EcaExecutiveAnswerIntakeJudgment | null;
  dialogueStrategy?: EcaExecutiveDialogueStrategy | null;
  recommendation?: EcaExecutiveRecommendationJudgment | null;
  commitment?: EcaExecutiveCommitmentJudgment | null;
  session?: EcaExecutionReadinessSession | null;
  committedDecisionId?: string | null;
  committedDecisionTitle?: string | null;
  execution?: EcaExecutionSnapshot | null;
  capAvUnconfirmed?: boolean;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaExecutionReadinessSession(): EcaExecutionReadinessSession {
  return freeze({
    lastDecisionId: null,
    lastExecutionId: null,
    acknowledgedGap: null,
    deferredStart: false,
    lastReadiness: null,
  });
}

function classifyIntent(text: string, intent: EcaExecutiveIntent): EcaExecutionManagerIntent {
  if (/\bwhat if\b|\bif we start monday\b|\bcan we start monday\b|\bstart monday\b/i.test(text)) return "HYPOTHETICAL";
  if (/\bdon[’']t start(?: yet)?\b|\bhold off\b|\bnot yet\b.*\bstart\b|\bdelay execution\b/i.test(text)) return "DEFER";
  if (/\breconsider\b|\brevisit (?:the )?decision\b/i.test(text) || intent === "REASSESS") return "RECONSIDER";
  if (/\bwhat(?:[’']s| is) happening now\b|\bhow is (?:it|this|execution) going\b/i.test(text)) return "LIVE";
  if (/\bare we ready(?: to execute)?\b|\bready to execute\b/i.test(text)) return "READINESS";
  if (/\bwhat is missing\b|\bwhat(?:[’']s| is) missing\b|\bwhat do we need before\b/i.test(text)) return "MISSING";
  if (/\bwho owns\b/i.test(text)) return "OWNER";
  if (/\bwhat could stop\b|\bwhat(?:[’']s| is) blocking\b|\bshow blockers\b/i.test(text)) return "STOPPERS";
  if (/\bwhat(?:[’']s| is) next\b|\bwhere are we\b|\bare we done\b|\bwhat happens if i start\b/i.test(text)) return "WHATS_NEXT";
  if (/\bcreate (?:an? )?(?:the )?execution\b|\bprepare (?:an? )?execution\b/i.test(text)) return "CREATE";
  if (/\bshow(?: me)?(?: the)? execution\b|\breview (?:the )?execution\b/i.test(text) || intent === "REVIEW_EXECUTION") return "REVIEW";
  if (intent === "REQUEST_EXECUTION_ACTION" || /^(?:start|begin)(?: it| execution)?\b|\bstart (?:the )?execution\b|\bexecute (?:it|the decision)\b/i.test(text.trim())) {
    return "START";
  }
  if (/\bmake it happen\b/i.test(text)) return "NONE";
  return "NONE";
}

export function judgeEcaExecutiveExecutionReadiness(
  input: EcaExecutionReadinessInput,
): EcaExecutiveExecutionReadinessJudgment {
  const text = input.utterance.trim();
  const managerIntent = classifyIntent(text, input.actionPlan.intent);
  const previous = input.session ?? emptyEcaExecutionReadinessSession();
  const decisionId = input.committedDecisionId ?? null;
  const execution = input.execution ?? null;
  const sources = freeze(["CC:11", "DTH:9", "DTH:10", "NPA-T ECA:8", "NPA-T ECA:9"]);
  const live = Boolean(execution && /^(?:in-progress|at-risk|completed)$/.test(execution.status));
  const blockedStatus = execution?.status === "blocked";
  const blockers = execution?.blockers ?? [];
  const risks = execution?.risks ?? [];
  const owners = execution?.ownerIds ?? [];
  const hasBlocker = blockedStatus || blockers.length > 0;
  const ownerState: EcaExecutiveExecutionReadinessJudgment["ownerState"] = !decisionId
    ? "NOT_APPLICABLE"
    : owners.length > 1
      ? "AMBIGUOUS"
      : owners.length === 1
        ? "KNOWN"
        : "UNKNOWN";
  const blockerState: EcaExecutiveExecutionReadinessJudgment["blockerState"] = !decisionId
    ? "NOT_APPLICABLE"
    : hasBlocker
      ? "KNOWN"
      : "NONE";
  const capAv = Boolean(input.capAvUnconfirmed);
  const acknowledge = /\bi (?:know|understand|accept)\b|\bstart anyway\b/i.test(text);

  let readiness: EcaExecutionReadinessState = "NOT_APPLICABLE";
  let primaryGap: string | null = null;
  let postDecisionState: EcaPostDecisionState = "NOT_APPLICABLE";
  let createAllowed = false;
  let startAllowed = false;
  let speak = false;
  let note: string | null = null;
  let rationale = "Post-Decision execution guidance requires a canonical Decision and never writes Execution.";

  if (!decisionId) {
    rationale = "No canonical Approved Decision; ECA:9 does not assume post-Decision execution.";
    if (managerIntent === "WHATS_NEXT" || managerIntent === "READINESS" || managerIntent === "START" || managerIntent === "CREATE") {
      speak = true;
      note = "No Decision has been committed yet, so execution is not in play.";
    }
  } else if (live && execution?.status === "completed") {
    readiness = "ALREADY_EXECUTING";
    postDecisionState = "EXECUTION_ALREADY_ACTIVE";
    rationale = "Canonical Execution is completed; ECA:9 does not offer a new start.";
    if (managerIntent !== "NONE") {
      speak = true;
      note = "This Decision already has a completed Execution. Review Outcome through the existing Outcome authority rather than starting again.";
    }
  } else if (live) {
    readiness = "ALREADY_EXECUTING";
    postDecisionState = blockedStatus ? "EXECUTION_BLOCKED" : "EXECUTION_ALREADY_ACTIVE";
    primaryGap = hasBlocker ? blockers[0]?.label ?? "A canonical Execution blocker is recorded." : null;
    rationale = "Canonical Execution is already live; DTH:10 owns live presentation.";
    if (managerIntent === "START" || managerIntent === "CREATE") {
      speak = true;
      note = blockedStatus
        ? `Execution is blocked${primaryGap ? ` by ${primaryGap}` : ""}. I won’t start another one.`
        : "This Decision already has an active Execution. We should review its progress rather than start another one.";
    } else if (managerIntent !== "NONE") {
      speak = true;
      note = blockedStatus
        ? `Execution is already active and currently blocked${primaryGap ? `: ${primaryGap}` : ""}.`
        : "Execution is already active. We should review progress rather than prepare a new start.";
    }
  } else {
    const ownerGap = ownerState === "UNKNOWN" ? "ownership is still unresolved" : null;
    const blockerGap = hasBlocker ? blockers[0]?.label ?? "a recorded Execution blocker" : null;
    const capGap = capAv ? "CAP_AV’s meaning is still unconfirmed, so capacity readiness is not established" : null;
    const estimate = input.answerIntake?.answerType === "ESTIMATE" || input.answerIntake?.confidence === "ESTIMATED";
    primaryGap = blockerGap ?? capGap ?? ownerGap;
    if (previous.acknowledgedGap && previous.acknowledgedGap === primaryGap && !blockerGap) {
      primaryGap = null;
    }
    if (hasBlocker) {
      readiness = "BLOCKED";
      postDecisionState = "EXECUTION_BLOCKED";
      startAllowed = false;
      createAllowed = !execution;
    } else if (capAv && !acknowledge && previous.acknowledgedGap !== capGap) {
      readiness = "READY_WITH_CONDITIONS";
      postDecisionState = "EXECUTION_NOT_READY";
      createAllowed = !execution;
      startAllowed = execution?.status === "planned" || execution?.status === "ready";
    } else if (ownerGap && !acknowledge && previous.acknowledgedGap !== ownerGap) {
      readiness = "READY_WITH_CONDITIONS";
      postDecisionState = "EXECUTION_PREPARATION";
      createAllowed = !execution;
      startAllowed = true;
    } else if (estimate) {
      readiness = "READY_WITH_CONDITIONS";
      postDecisionState = "EXECUTION_READY";
      createAllowed = !execution;
      startAllowed = true;
    } else {
      readiness = "READY";
      postDecisionState = execution ? "EXECUTION_READY" : "DECISION_CONFIRMED";
      createAllowed = !execution;
      startAllowed = true;
    }
    if (managerIntent === "CREATE") {
      postDecisionState = "EXECUTION_CREATE_INTENT";
      if (execution) {
        createAllowed = false;
        speak = true;
        note = "An execution already exists for this Decision.";
        rationale = "CC:11 reuses the existing Decision-linked Execution; ECA:9 does not create a second.";
      } else {
        speak = true;
        note = "I can hand that create request to Nexora’s Execution authority. Starting remains a separate step unless you explicitly start.";
      }
    } else if (managerIntent === "START") {
      postDecisionState = "EXECUTION_START_INTENT";
      if (hasBlocker) {
        speak = true;
        note = `Before starting, ${primaryGap ?? "a canonical blocker"} still blocks Execution.`;
        startAllowed = false;
      } else if (previous.deferredStart && !/\bstart\b/i.test(text)) {
        speak = true;
        note = "Understood — Execution will not start yet.";
        startAllowed = false;
      } else {
        speak = true;
        note = execution
          ? "You’re asking to start the existing Execution. That goes through Nexora’s Execution authority."
          : "You’re asking to start Execution. CC:11 may create the Execution if none exists, then start it. ECA:9 does not write.";
      }
    } else if (managerIntent === "DEFER") {
      speak = true;
      startAllowed = false;
      note = "The Decision remains. Execution will not start yet.";
    } else if (managerIntent === "RECONSIDER") {
      speak = true;
      startAllowed = false;
      createAllowed = false;
      note = "We can review the Decision through the existing Decision path. Execution will not be forced.";
    } else if (managerIntent === "HYPOTHETICAL") {
      speak = true;
      startAllowed = false;
      createAllowed = false;
      note = "That’s a timing question, not a start command. Execution is unchanged.";
    } else if (managerIntent === "REVIEW") {
      postDecisionState = "EXECUTION_REVIEW";
      speak = true;
      note = execution
        ? `You’re reviewing ${execution.title}. Status is ${execution.status}. No Execution mutation.`
        : "The Decision is committed, but no Execution has been created for it yet.";
    } else if (managerIntent === "OWNER") {
      speak = true;
      note = ownerState === "KNOWN" ? `The execution owner is ${owners[0]}.` : "The execution owner is still unknown.";
    } else if (managerIntent === "STOPPERS") {
      speak = true;
      note = hasBlocker
        ? `${blockers[0]?.label ?? "A blocker"} is a current blocker.${risks[0] ? ` ${risks[0].label} is a risk, not a confirmed blocker.` : ""}`
        : risks[0]
          ? `${risks[0].label} is a risk, not a confirmed blocker.`
          : "No current Execution blocker is recorded.";
    } else if (managerIntent === "MISSING" || managerIntent === "READINESS" || managerIntent === "WHATS_NEXT") {
      speak = true;
      if (readiness === "BLOCKED") {
        note = `The Decision is committed, but execution is not ready yet because ${primaryGap}.`;
      } else if (readiness === "READY_WITH_CONDITIONS" && capAv) {
        note = "Execution can move forward, but CAP_AV’s meaning is still unconfirmed, so I would not treat capacity readiness as established yet.";
      } else if (readiness === "READY_WITH_CONDITIONS" && ownerGap) {
        note = "The Decision is committed, but execution is not ready yet because no owner is identified.";
      } else if (readiness === "READY_WITH_CONDITIONS") {
        note = "Execution can move forward, but remaining uncertainty should stay visible during the handoff.";
      } else if (!execution) {
        note = "The Decision is committed, but no Execution has been created for it yet. I don’t see a material canonical start blocker.";
      } else {
        note = "The Decision is committed and no material readiness blocker is currently recorded. The next step is to review the Execution before starting it.";
      }
    }
  }

  if (managerIntent === "START" && !decisionId) startAllowed = false;
  if (managerIntent !== "CREATE") {
    /* createAllowed remains a capability flag, not an implicit write */
  }
  if (managerIntent === "READINESS" || managerIntent === "WHATS_NEXT" || managerIntent === "MISSING") {
    startAllowed = false;
    createAllowed = false;
  }

  return freeze({
    identity: ECA_EXECUTIVE_EXECUTION_READINESS_IDENTITY,
    postDecisionState,
    managerIntent,
    decisionId,
    executionId: execution?.executionId ?? null,
    executionStatus: execution?.status ?? null,
    readiness,
    primaryGap,
    ownerState,
    blockerState,
    riskIsBlocker: false,
    canonicalCreateAllowed: createAllowed,
    canonicalStartAllowed: startAllowed,
    canonicalAuthority: "CC:11 Execution Follow-up",
    cc11StartMayCreate: true,
    reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
    managerFacingNote: note,
    speak,
    staleReadiness: false,
    trustInflation: false,
    implicitCreate: false,
    implicitStart: false,
    targetDrift: false,
    unnecessaryBlocker: false,
    duplicateWarning: false,
    boundaries: BOUNDARIES,
    provenance: freeze({ sources, rationale }),
  });
}

export function nextEcaExecutionReadinessSession(
  previous: EcaExecutionReadinessSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveExecutionReadinessJudgment,
): EcaExecutionReadinessSession {
  const base = previous ?? emptyEcaExecutionReadinessSession();
  const text = utterance.trim();
  const acknowledge = /\bi (?:know|understand|accept)\b|\bstart anyway\b/i.test(text);
  return freeze({
    lastDecisionId: judgment.decisionId ?? base.lastDecisionId,
    lastExecutionId: judgment.executionId ?? base.lastExecutionId,
    acknowledgedGap: acknowledge && judgment.primaryGap ? judgment.primaryGap : base.acknowledgedGap,
    deferredStart: judgment.managerIntent === "DEFER" ? true : judgment.managerIntent === "START" ? false : base.deferredStart,
    lastReadiness: judgment.readiness,
  });
}

export function applyEcaExecutionReadinessToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveExecutionReadinessJudgment;
  readonly locked?: boolean;
}): string {
  if (input.locked || !input.judgment.speak) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 28).toLowerCase())) return input.source;
  return `${input.source} ${note}`.trim();
}

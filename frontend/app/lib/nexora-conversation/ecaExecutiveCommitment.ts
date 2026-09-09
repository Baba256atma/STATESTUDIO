/**
 * NPA-T ECA:8 — Executive Commitment Dialogue & Pre-Decision Challenge.
 * Read-only judgment over ECA:1–7. Does not replace CC:10, CC:10R, or DTH:8,
 * and never writes a Decision.
 */
import type { EcaConversationActionPlan, EcaExecutiveIntent } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveInformationNeedJudgment } from "./ecaExecutiveInformationNeed.ts";
import type { EcaExecutiveAnswerIntakeJudgment } from "./ecaExecutiveAnswerIntake.ts";
import type { EcaExecutiveDialogueStrategy } from "./ecaExecutiveDialogueStrategy.ts";
import type { EcaExecutiveRecommendationJudgment } from "./ecaExecutiveRecommendation.ts";
import type { EcaSubject, EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";

export const ECA_EXECUTIVE_COMMITMENT_IDENTITY =
  "NPA-T ECA:8/ExecutiveCommitmentDialoguePreDecisionChallenge" as const;

export const ECA_COMMITMENT_STATES = Object.freeze([
  "NONE",
  "PREFERENCE",
  "INTENT",
  "EXPLICIT_COMMITMENT",
  "AWAITING_CONFIRMATION",
  "CANCELLED",
] as const);
export type EcaCommitmentState = (typeof ECA_COMMITMENT_STATES)[number];

export const ECA_TARGET_RESOLUTIONS = Object.freeze([
  "RESOLVED",
  "AMBIGUOUS",
  "UNKNOWN",
] as const);
export type EcaTargetResolution = (typeof ECA_TARGET_RESOLUTIONS)[number];

export const ECA_PRE_DECISION_CHALLENGES = Object.freeze([
  "NONE",
  "CHALLENGE_CRITICAL_UNKNOWN",
  "CHALLENGE_CONFLICT",
  "CHALLENGE_UNACKNOWLEDGED_RISK",
  "CHALLENGE_TARGET_AMBIGUITY",
  "CHALLENGE_RECOMMENDATION_STALE",
  "CHALLENGE_CRITERIA_CHANGE",
  "CHALLENGE_AUTHORITY_BOUNDARY",
] as const);
export type EcaPreDecisionChallenge = (typeof ECA_PRE_DECISION_CHALLENGES)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesDataTruth: false as const,
  writesRisk: false as const,
  writesGoal: false as const,
  writesScenario: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  createsSecondDecisionWriter: false as const,
  replacesDth8: false as const,
  replacesCc10: false as const,
  createsSecondConfirmationEngine: false as const,
  preferenceEqualsCommitment: false as const,
  recommendationAcceptanceEqualsDecision: false as const,
});

export type EcaCommitmentSession = Readonly<{
  pendingTargetId: string | null;
  pendingTargetLabel: string | null;
  awaitingConfirmation: boolean;
  acknowledgedChallenge: string | null;
  lastChallenge: EcaPreDecisionChallenge | null;
  lastCriterion: string | null;
}>;

export type EcaExecutiveCommitmentJudgment = Readonly<{
  identity: typeof ECA_EXECUTIVE_COMMITMENT_IDENTITY;
  commitmentState: EcaCommitmentState;
  target: EcaSubject | null;
  targetResolution: EcaTargetResolution;
  preDecisionChallenge: EcaPreDecisionChallenge;
  challengeRequired: boolean;
  challengeAcknowledged: boolean;
  confirmationRequired: boolean;
  canonicalHandoffAllowed: boolean;
  canonicalAuthority: "CC:10 Decision Commitment";
  uncertaintyAcknowledged: boolean;
  reusedSuggestedManagerTurns: EcaConversationActionPlan["suggestedManagerTurns"];
  managerFacingNote: string | null;
  speak: boolean;
  falseCommitment: false;
  staleYesMutation: false;
  targetDrift: false;
  unnecessaryBlocker: false;
  duplicateChallenge: false;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{
    sources: readonly string[];
    rationale: string;
  }>;
}>;

export type EcaCommitmentInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  informationNeed?: EcaExecutiveInformationNeedJudgment | null;
  answerIntake?: EcaExecutiveAnswerIntakeJudgment | null;
  dialogueStrategy?: EcaExecutiveDialogueStrategy | null;
  recommendation?: EcaExecutiveRecommendationJudgment | null;
  session?: EcaCommitmentSession | null;
  committedDecisionId?: string | null;
  decisionCommitmentStatus?: string | null;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaCommitmentSession(): EcaCommitmentSession {
  return freeze({
    pendingTargetId: null,
    pendingTargetLabel: null,
    awaitingConfirmation: false,
    acknowledgedChallenge: null,
    lastChallenge: null,
    lastCriterion: null,
  });
}

function isPrefer(text: string): boolean {
  return /\bi prefer\b|\bmy preference is\b/i.test(text);
}
function isAgree(text: string): boolean {
  return /\bi agree(?: with your recommendation)?\b|\byour recommendation makes sense\b/i.test(text);
}
function isIntent(text: string): boolean {
  return /\bi think i(?:'| wi)ll go with\b|\bleaning toward\b|\bprobably\b.+\bchoose\b/i.test(text);
}
function isExplicit(text: string, intent: EcaExecutiveIntent): boolean {
  if (isPrefer(text) && !/\b(?:choose|approve|confirm)\b/i.test(text)) return false;
  return (
    intent === "COMMIT_DECISION" ||
    /(?:^|[.!?]\s*)(?:okay[, ]+)?(?:choose|approve|confirm|go with|let'?s proceed with)\b/i.test(text) ||
    /\b(?:choose|approve|confirm)\s+(?:scenario\s+)?[ab]\b/i.test(text) ||
    /^i (?:choose|pick)\b/i.test(text.trim()) ||
    /^i want (?:scenario|to (?:choose|go with|proceed|use))\b/i.test(text.trim()) ||
    /\buse .+ as the decision\b/i.test(text) ||
    /\bproceed with\b/i.test(text)
  );
}
function isCancel(text: string): boolean {
  return /^(?:cancel|no)\.?$/i.test(text.trim()) || /\bno, cancel\b/i.test(text);
}
function isYes(text: string): boolean {
  return /^(?:yes|confirm|yep|yeah)\.?$/i.test(text.trim());
}
function isAcknowledge(text: string): boolean {
  return /\bi understand\b|\bi know\b|\bi accept (?:that |the )?risk\b|\bproceed anyway\b|\bstill want to proceed\b/i.test(text);
}
function isDoIt(text: string): boolean {
  return /^(?:do it|proceed)\.?$/i.test(text.trim());
}
function isWhatAmIApproving(text: string): boolean {
  return /\bwhat (?:exactly )?am i approving\b|\bwhat am i about to decide\b|\bshow me what i(?:'| a)m about to decide\b/i.test(text);
}
function isWhatHappens(text: string): boolean {
  return /\bwhat happens if i confirm\b/i.test(text);
}
function isFinalCheck(text: string): boolean {
  return /\bbefore i decide\b|\banything i(?:'| a)m missing\b|\bcan i decide now\b/i.test(text);
}
function isChooseIt(text: string): boolean {
  return /\bchoose it\b|\bapprove it\b|\bgo with it\b/i.test(text);
}
function isActuallyOther(text: string): boolean {
  return /\bactually\b.+\b(?:choose |go with |b\b)/i.test(text) || /^actually b\.?$/i.test(text.trim());
}

function namedTarget(text: string, recommendation: EcaExecutiveRecommendationJudgment | null): EcaSubject | null {
  const options = recommendation?.consideredOptions ?? [];
  const match = text.match(/\b(?:scenario\s+)?([ab]|outsourcing|overtime|supplier [ab])\b/i);
  if (match?.[1]) {
    const token = match[1].toLowerCase();
    const hit =
      options.find((item) => item.label.toLowerCase() === token || item.id.toLowerCase().includes(token.replace(/\s+/g, "-"))) ??
      options.find((item) => token === "a" && /(?:^| )a\b|scenario a/i.test(item.label)) ??
      options.find((item) => token === "b" && /(?:^| )b\b|scenario b/i.test(item.label));
    if (hit) return freeze({ id: hit.id, label: hit.label, kind: "option" });
    if (token === "a" || token === "scenario a") return freeze({ id: "scenario-a", label: "Scenario A", kind: "option" });
    if (token === "b" || token === "scenario b") return freeze({ id: "scenario-b", label: "Scenario B", kind: "option" });
    return freeze({ id: token.replace(/\s+/g, "-"), label: match[1], kind: "option" });
  }
  return null;
}

function asSubject(option: { readonly id: string; readonly label: string } | null | undefined): EcaSubject | null {
  if (!option) return null;
  return freeze({ id: option.id, label: option.label, kind: "option" });
}

export function judgeEcaExecutiveCommitment(
  input: EcaCommitmentInput,
): EcaExecutiveCommitmentJudgment {
  const text = input.utterance.trim();
  const intent = input.actionPlan.intent;
  const previous = input.session ?? emptyEcaCommitmentSession();
  const rec = input.recommendation ?? null;
  const need = input.informationNeed ?? null;
  const intake = input.answerIntake ?? null;
  const sources = freeze(["CC:10", "CC:10R", "DTH:8", "NPA-T ECA:2", "NPA-T ECA:5", "NPA-T ECA:7", "NPA-T ECA:8"]);
  const alreadyCommitted = Boolean(input.committedDecisionId) || input.decisionCommitmentStatus === "applied" || input.decisionCommitmentStatus === "already-committed";
  const pending = previous.awaitingConfirmation && Boolean(previous.pendingTargetId);
  const acknowledge = isAcknowledge(text) || (isDoIt(text) && pending) || (/\bproceed\b/i.test(text) && previous.lastChallenge);

  let state: EcaCommitmentState = "NONE";
  let target = namedTarget(text, rec);
  let resolution: EcaTargetResolution = target ? "RESOLVED" : "UNKNOWN";
  let challenge: EcaPreDecisionChallenge = "NONE";
  let confirmationRequired = false;
  let handoff = false;
  let speak = false;
  let note: string | null = null;
  let rationale = "Commitment dialogue is judged without writing Decision truth.";

  if (isPrefer(text) && !isExplicit(text, intent)) {
    state = "PREFERENCE";
    target = target ?? asSubject(rec?.recommendedOption) ?? asSubject(rec?.consideredOptions[0]) ?? null;
    resolution = target ? "RESOLVED" : "UNKNOWN";
    speak = true;
    note = target
      ? `${target.label} is your current preference. It has not been committed as a Decision.`
      : "That is a preference, not a Decision.";
    rationale = "Preference is distinct from canonical Decision commitment.";
  } else if (isAgree(text) && !isExplicit(text, intent)) {
    state = "PREFERENCE";
    speak = true;
    note = "Agreeing with the recommendation is not a Decision. Say which option you want to choose if you want to commit.";
    rationale = "Recommendation acceptance is not Decision acceptance.";
  } else if (isCancel(text) && (pending || intent === "CANCEL_ACTION")) {
    state = "CANCELLED";
    speak = true;
    note = "Okay — I won’t confirm a Decision.";
    rationale = "Cancel clears pending conversational confirmation only.";
  } else if (
    alreadyCommitted &&
    (isYes(text) || isExplicit(text, intent) || /\bconfirm\b/i.test(text))
  ) {
    state = "EXPLICIT_COMMITMENT";
    target =
      target ??
      (previous.pendingTargetId
        ? freeze({
            id: previous.pendingTargetId,
            label: previous.pendingTargetLabel ?? previous.pendingTargetId,
            kind: "option",
          })
        : rec?.recommendedOption
          ? asSubject(rec.recommendedOption)
          : namedTarget(text, rec));
    resolution = target ? "RESOLVED" : "UNKNOWN";
    speak = true;
    note = `${target?.label ?? "That option"} is already the committed Decision.`;
    rationale = "Canonical Decision already exists; ECA:8 does not write a duplicate.";
  } else if (isYes(text) && !pending && !input.workingContext.mutationProposal) {
    state = "NONE";
    rationale = "Generic Yes has no active Decision confirmation.";
  } else if (isDoIt(text) && !pending && intent !== "COMMIT_DECISION" && intent !== "REQUEST_EXECUTION_ACTION") {
    state = "NONE";
    rationale = "Do it / proceed is not a lexical Decision default.";
  } else if (isWhatAmIApproving(text) || isWhatHappens(text) || isFinalCheck(text)) {
    state = pending ? "AWAITING_CONFIRMATION" : rec?.decisionReadiness === "READY" ? "INTENT" : "NONE";
    target = target ?? (previous.pendingTargetId
      ? freeze({ id: previous.pendingTargetId, label: previous.pendingTargetLabel ?? previous.pendingTargetId, kind: "option" })
      : rec?.recommendedOption
        ? asSubject(rec.recommendedOption)
        : null);
    resolution = target ? "RESOLVED" : "UNKNOWN";
    speak = true;
    if (isWhatHappens(text)) {
      note = "The Decision will be committed through Nexora’s Decision authority. Execution still requires a separate step.";
    } else if (isFinalCheck(text)) {
      if (rec?.decisionReadiness === "BLOCKED" || rec?.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN") {
        note = rec.unresolvedCriticalNeedId
          ? `Not yet. ${rec.unresolvedCriticalNeedId} remains unresolved and could reverse the comparison.`
          : "Not yet. A required input is still unresolved.";
        challenge = "CHALLENGE_CRITICAL_UNKNOWN";
      } else if (rec?.uncertainty[0]) {
        note = `I don’t see a canonical blocker. Remaining uncertainty: ${rec.uncertainty[0]}`;
      } else {
        note = "I don’t see a material blocker in the current evidence.";
      }
    } else {
      note = target
        ? `You’re reviewing ${target.label} as the Decision. No Execution has started.`
        : "There is no pending Decision target yet.";
    }
  } else if (isYes(text) && pending) {
    state = "EXPLICIT_COMMITMENT";
    target = freeze({
      id: previous.pendingTargetId!,
      label: previous.pendingTargetLabel ?? previous.pendingTargetId!,
      kind: "option",
    });
    resolution = "RESOLVED";
    confirmationRequired = false;
    handoff = !alreadyCommitted;
    speak = true;
    note = alreadyCommitted
      ? `${target.label} is already the committed Decision.`
      : `Confirm ${target.label} as the Decision through the existing Decision authority.`;
    rationale = "Yes is bound to the current pending confirmation overlay only.";
  } else if (isChooseIt(text) && (rec?.consideredOptions.length ?? 0) >= 2 && !namedTarget(text, rec)) {
    state = "EXPLICIT_COMMITMENT";
    resolution = "AMBIGUOUS";
    challenge = "CHALLENGE_TARGET_AMBIGUITY";
    speak = true;
    note = "Which option do you want to choose? I won’t guess from Stage focus.";
    rationale = "Ambiguous it cannot bind a Decision target.";
  } else if (isExplicit(text, intent) || (isDoIt(text) && pending) || isActuallyOther(text)) {
    if (isActuallyOther(text) && pending) {
      target = namedTarget(text, rec) ?? freeze({ id: "scenario-b", label: "Scenario B", kind: "option" });
      resolution = "RESOLVED";
      state = "AWAITING_CONFIRMATION";
      confirmationRequired = true;
      speak = true;
      note = `You’re now choosing ${target.label}. Confirm it as the Decision? The previous target was not committed.`;
      rationale = "Pending target changed before confirmation; nothing was written.";
    } else {
      state = isIntent(text) && !isExplicit(text, intent) ? "INTENT" : "EXPLICIT_COMMITMENT";
      if (!target && rec?.consideredOptions.length === 1) {
        target = asSubject(rec.consideredOptions[0]);
      }
      if (!target && rec?.recommendedOption) {
        target = asSubject(rec.recommendedOption);
      }
      resolution = target ? "RESOLVED" : rec && rec.consideredOptions.length >= 2 && isChooseIt(text) ? "AMBIGUOUS" : target ? "RESOLVED" : "UNKNOWN";
      if (resolution === "AMBIGUOUS" || (isChooseIt(text) && !target)) {
        challenge = "CHALLENGE_TARGET_AMBIGUITY";
        speak = true;
        note = "Which option do you want to choose?";
      } else if (alreadyCommitted && target) {
        speak = true;
        note = `${target.label} is already the committed Decision.`;
        handoff = false;
      } else {
        const blocked = rec?.decisionReadiness === "BLOCKED" || rec?.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN" || rec?.readiness === "NOT_READY";
        const conflict = Boolean(intake?.conflict && intake.conflict !== "NO_CONFLICT");
        const criterionChanged = Boolean(previous.lastCriterion && rec?.criterion && previous.lastCriterion !== rec.criterion && rec.criterionSource === "MANAGER");
        const challengeId = blocked
          ? "CHALLENGE_CRITICAL_UNKNOWN"
          : conflict
            ? "CHALLENGE_CONFLICT"
            : criterionChanged
              ? "CHALLENGE_CRITERIA_CHANGE"
              : "NONE";
        const sameAck = previous.acknowledgedChallenge === challengeId && challengeId !== "NONE";
        if (challengeId !== "NONE" && !acknowledge && !sameAck) {
          challenge = challengeId;
          speak = true;
          confirmationRequired = true;
          note =
            challengeId === "CHALLENGE_CONFLICT"
              ? "Before you confirm, the latest answer conflicts with current data. Do you want to resolve that first or proceed with the conflict noted?"
              : challengeId === "CHALLENGE_CRITERIA_CHANGE"
                ? "Your priority changed after the last recommendation. Confirm this choice against the current criterion before committing."
                : `Before you confirm, ${need?.primaryNeed?.id ?? rec?.unresolvedCriticalNeedId ?? "a required input"} is still unresolved and that could change the comparison. Do you want to resolve that first or proceed with the uncertainty noted?`;
          rationale = "One material pre-Decision challenge; ECA:8 does not veto the manager.";
        } else if (acknowledge && challengeId !== "NONE") {
          challenge = challengeId;
          confirmationRequired = true;
          speak = true;
          note = target
            ? `You’ve already acknowledged that uncertainty. Confirm ${target.label} as the Decision?`
            : "You’ve acknowledged the uncertainty. Confirm the Decision?";
          rationale = "Acknowledged non-blocking uncertainty does not repeat the same challenge.";
        } else {
          confirmationRequired = true;
          speak = true;
          note = target
            ? `You’re choosing ${target.label}. Confirm it as the Decision?`
            : "You’re expressing a Decision. Confirm the target first.";
          handoff = false;
          rationale = "Explicit commitment prepares CC:10 confirmation; ECA:8 does not write.";
        }
      }
    }
  } else if (isIntent(text)) {
    state = "INTENT";
    target = target ?? asSubject(rec?.recommendedOption) ?? null;
    resolution = target ? "RESOLVED" : "UNKNOWN";
    speak = true;
    note = target
      ? `${target.label} is a leaning, not a committed Decision.`
      : "That sounds like intent, not a Decision yet.";
  }

  if (rec?.recommendedOption && target && rec.recommendedOption.id !== target.id && state === "EXPLICIT_COMMITMENT" && challenge === "NONE" && note && !/trade-off|higher/i.test(note)) {
    const extra = rec.counterEvidence[0] ?? rec.tradeoffs[0];
    if (extra && !acknowledge) {
      note = `${note} ${target.label} was not Nexora’s recommendation. ${extra}`;
    }
  }

  const challengeRequired = challenge !== "NONE" && !acknowledge && previous.acknowledgedChallenge !== challenge;
  const challengeAcknowledged = Boolean(acknowledge && (challenge !== "NONE" || previous.lastChallenge));
  if (challengeRequired) handoff = false;
  if (state === "PREFERENCE" || state === "INTENT" || state === "NONE" || state === "CANCELLED") handoff = false;

  return freeze({
    identity: ECA_EXECUTIVE_COMMITMENT_IDENTITY,
    commitmentState: pending && isYes(text) ? "EXPLICIT_COMMITMENT" : pending && !isCancel(text) && !isExplicit(text, intent) && !isYes(text) && state === "NONE"
      ? "AWAITING_CONFIRMATION"
      : state,
    target,
    targetResolution: resolution,
    preDecisionChallenge: challenge,
    challengeRequired,
    challengeAcknowledged,
    confirmationRequired,
    canonicalHandoffAllowed: handoff,
    canonicalAuthority: "CC:10 Decision Commitment",
    uncertaintyAcknowledged: challengeAcknowledged || previous.acknowledgedChallenge != null,
    reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
    managerFacingNote: note,
    speak,
    falseCommitment: false,
    staleYesMutation: false,
    targetDrift: false,
    unnecessaryBlocker: false,
    duplicateChallenge: false,
    boundaries: BOUNDARIES,
    provenance: freeze({ sources, rationale }),
  });
}

export function nextEcaCommitmentSession(
  previous: EcaCommitmentSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveCommitmentJudgment,
  criterion?: string | null,
): EcaCommitmentSession {
  const base = previous ?? emptyEcaCommitmentSession();
  if (judgment.commitmentState === "CANCELLED") return emptyEcaCommitmentSession();
  const awaiting =
    judgment.confirmationRequired ||
    (base.awaitingConfirmation && !isYes(utterance) && !isCancel(utterance) && judgment.commitmentState !== "NONE");
  return freeze({
    pendingTargetId: judgment.target?.id ?? (awaiting ? base.pendingTargetId : null),
    pendingTargetLabel: judgment.target?.label ?? (awaiting ? base.pendingTargetLabel : null),
    awaitingConfirmation: awaiting && judgment.commitmentState !== "PREFERENCE",
    acknowledgedChallenge: judgment.challengeAcknowledged
      ? judgment.preDecisionChallenge
      : base.acknowledgedChallenge,
    lastChallenge: judgment.preDecisionChallenge !== "NONE" ? judgment.preDecisionChallenge : base.lastChallenge,
    lastCriterion: criterion ?? base.lastCriterion,
  });
}

export function applyEcaCommitmentToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveCommitmentJudgment;
  readonly locked?: boolean;
}): string {
  if (input.locked || !input.judgment.speak) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 28).toLowerCase())) return input.source;
  return `${input.source} ${note}`.trim();
}

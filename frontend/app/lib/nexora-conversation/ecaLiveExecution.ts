/**
 * NPA-T ECA:10 — Live Execution Dialogue & Deviation Intelligence.
 * Read-only interpretation after a canonical live Execution. Does not replace
 * CC:11, DTH:10, or ECA:3, and never writes Execution.
 */
import type { EcaConversationActionPlan, EcaExecutiveIntent } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveAnswerIntakeJudgment } from "./ecaExecutiveAnswerIntake.ts";
import type { EcaExecutiveExecutionReadinessJudgment } from "./ecaExecutiveExecutionReadiness.ts";
import type { EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";

export const ECA_LIVE_EXECUTION_IDENTITY =
  "NPA-T ECA:10/LiveExecutionDialogueDeviationIntelligence" as const;

export const ECA_LIVE_STATES = Object.freeze([
  "NOT_LIVE",
  "ACTIVE",
  "BLOCKED",
  "COMPLETED",
  "UNKNOWN",
] as const);
export type EcaLiveState = (typeof ECA_LIVE_STATES)[number];

export const ECA_TRACK_STATUSES = Object.freeze([
  "ON_TRACK",
  "OFF_TRACK",
  "AHEAD",
  "POSSIBLE_DEVIATION",
  "UNKNOWN",
] as const);
export type EcaTrackStatus = (typeof ECA_TRACK_STATUSES)[number];

export const ECA_DEVIATION_KINDS = Object.freeze([
  "NO_MATERIAL_DEVIATION",
  "FAVORABLE_DEVIATION",
  "UNFAVORABLE_DEVIATION",
  "MIXED_DEVIATION",
  "POSSIBLE_DEVIATION",
  "UNKNOWN",
] as const);
export type EcaDeviationKind = (typeof ECA_DEVIATION_KINDS)[number];

export const ECA_LIVE_MANAGER_INTENTS = Object.freeze([
  "NONE",
  "SUMMARY",
  "TRACK",
  "CHANGED",
  "ATTENTION",
  "BLOCKERS",
  "RISKS",
  "OUTCOME_QUESTION",
  "REASSESS",
  "READ",
  "WRITE",
] as const);
export type EcaLiveManagerIntent = (typeof ECA_LIVE_MANAGER_INTENTS)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesDataTruth: false as const,
  writesRisk: false as const,
  writesGoal: false as const,
  writesProblem: false as const,
  writesScenario: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  createsSecondExecutionWriter: false as const,
  replacesDth10: false as const,
  replacesCc11: false as const,
  createsSecondInitiativeEngine: false as const,
  createsMonitoringDaemon: false as const,
});

export type EcaLiveExecutionSnapshot = Readonly<{
  executionId: string;
  decisionId: string;
  title: string;
  status: string;
  progress?: number | null;
  ownerIds: readonly string[];
  blockers: readonly { readonly label: string }[];
  risks: readonly { readonly label: string }[];
}>;

export type EcaLiveExecutionSession = Readonly<{
  lastExecutionId: string | null;
  lastProgress: number | null;
  lastBlockerFingerprint: string | null;
  acknowledgedAttention: string | null;
}>;

export type EcaLiveExecutionJudgment = Readonly<{
  identity: typeof ECA_LIVE_EXECUTION_IDENTITY;
  liveState: EcaLiveState;
  managerIntent: EcaLiveManagerIntent;
  executionId: string | null;
  decisionId: string | null;
  executionStatus: string | null;
  progressValue: number | null;
  progressStatus: "CONFIRMED" | "REPORTED" | "ESTIMATED" | "UNKNOWN";
  trackStatus: EcaTrackStatus;
  deviation: EcaDeviationKind;
  primaryAttentionItem: string | null;
  blockerState: "NONE" | "KNOWN" | "NOT_APPLICABLE";
  riskIsBlocker: false;
  canonicalHandoffAllowed: boolean;
  canonicalAuthority: "CC:11 Execution Follow-up";
  reusedSuggestedManagerTurns: EcaConversationActionPlan["suggestedManagerTurns"];
  managerFacingNote: string | null;
  speak: boolean;
  falseLive: false;
  falseDeviation: false;
  trustInflation: false;
  unsupportedCause: false;
  duplicateAttention: false;
  staleDeviation: false;
  targetDrift: false;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{
    sources: readonly string[];
    rationale: string;
  }>;
}>;

export type EcaLiveExecutionInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  answerIntake?: EcaExecutiveAnswerIntakeJudgment | null;
  readiness?: EcaExecutiveExecutionReadinessJudgment | null;
  session?: EcaLiveExecutionSession | null;
  execution?: EcaLiveExecutionSnapshot | null;
  expectedProgress?: number | null;
  capAvUnconfirmed?: boolean;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaLiveExecutionSession(): EcaLiveExecutionSession {
  return freeze({
    lastExecutionId: null,
    lastProgress: null,
    lastBlockerFingerprint: null,
    acknowledgedAttention: null,
  });
}

function isLiveStatus(status: string | undefined): boolean {
  return status === "in-progress" || status === "blocked" || status === "at-risk" || status === "completed";
}

function classifyIntent(text: string, intent: EcaExecutiveIntent): EcaLiveManagerIntent {
  if (
    /\badd .+\bas a blocker\b|\badd (?:a )?blocker\b|\bset progress\b|\bupdate progress\b|\bpause it\b|\bresume it\b|\bcomplete it\b|\bmark (?:this|it) complete\b/i.test(
      text,
    ) &&
    !/\bshow\b/i.test(text)
  ) {
    return "WRITE";
  }
  if (/\bi (?:know|understand) (?:about )?(?:the |that )?/i.test(text) && !/\?/.test(text)) return "NONE";
  if (/\bdid it work\b|\bis (?:this |the )?decision working\b|\bwill we hit the goal\b/i.test(text)) return "OUTCOME_QUESTION";
  if (/\breassess\b|\bdoes this change the decision\b|\bshould we change the (?:plan|decision)\b/i.test(text)) return "REASSESS";
  if (/\bwhat changed\b/i.test(text)) return "CHANGED";
  if (/\bare we (?:on track|behind|ahead)\b|\bon track\b/i.test(text)) return "TRACK";
  if (/\bwhat needs (?:my )?attention\b|\bany problems\b|\bbiggest concern\b/i.test(text)) return "ATTENTION";
  if (/\bshow (?:me )?(?:the )?blockers\b|\bwhat(?:[’']s| is) blocking\b/i.test(text)) return "BLOCKERS";
  if (/\bshow (?:me )?(?:the )?risks\b/i.test(text)) return "RISKS";
  if (
    /\bhow is (?:it|execution|this) going\b|\bhow are we doing\b|\bupdate me\b|\bwhat(?:[’']s| is) happening now\b/i.test(text)
  ) {
    return "SUMMARY";
  }
  if (/\bshow (?:me )?(?:the )?execution\b/i.test(text)) return "READ";
  if (intent === "REVIEW_EXECUTION") return "SUMMARY";
  return "NONE";
}

export function judgeEcaLiveExecution(input: EcaLiveExecutionInput): EcaLiveExecutionJudgment {
  const text = input.utterance.trim();
  const managerIntent = classifyIntent(text, input.actionPlan.intent);
  const previous = input.session ?? emptyEcaLiveExecutionSession();
  const execution = input.execution ?? null;
  const live = Boolean(execution && isLiveStatus(execution.status));
  const sources = freeze(["CC:11", "DTH:10", "NPA-T ECA:9", "NPA-T ECA:10"]);
  const capAv = Boolean(input.capAvUnconfirmed);
  const estimate = input.answerIntake?.answerType === "ESTIMATE" || input.answerIntake?.confidence === "ESTIMATED";
  const reported = input.answerIntake?.confidence === "REPORTED";
  const acknowledge = /\bi (?:know|understand)\b/i.test(text);

  let liveState: EcaLiveState = "NOT_LIVE";
  const progressValue: number | null = execution?.progress ?? null;
  let progressStatus: EcaLiveExecutionJudgment["progressStatus"] = progressValue == null ? "UNKNOWN" : "CONFIRMED";
  if (estimate) progressStatus = "ESTIMATED";
  if (reported) progressStatus = "REPORTED";
  let trackStatus: EcaTrackStatus = "UNKNOWN";
  let deviation: EcaDeviationKind = "UNKNOWN";
  let primaryAttention: string | null = null;
  let speak = false;
  let note: string | null = null;
  let rationale = "Live Execution interpretation requires a canonical live Execution and never writes.";
  let handoff = false;

  if (!live) {
    liveState = "NOT_LIVE";
    deviation = "NO_MATERIAL_DEVIATION";
    rationale = "No canonical live Execution; ECA:9 remains the readiness authority.";
    if (managerIntent === "SUMMARY" || managerIntent === "TRACK") {
      speak = true;
      note = "Execution is not live yet. Readiness still belongs to the pre-start path.";
    }
  } else {
    liveState =
      execution!.status === "completed"
        ? "COMPLETED"
        : execution!.status === "blocked"
          ? "BLOCKED"
          : "ACTIVE";
    const blockers = execution!.blockers;
    const risks = execution!.risks;
    const blockerLabel = blockers[0]?.label ?? null;
    const riskLabel = risks[0]?.label ?? null;
    const expected = input.expectedProgress ?? null;
    const priorProgress = previous.lastExecutionId === execution!.executionId ? previous.lastProgress : null;
    const blockerFp = blockers.map((item) => item.label).join("|");
    const newBlocker = Boolean(blockerLabel && previous.lastBlockerFingerprint !== blockerFp && previous.lastExecutionId === execution!.executionId);
    const progressMoved = priorProgress != null && progressValue != null && progressValue !== priorProgress;

    if (expected == null) {
      trackStatus = "UNKNOWN";
      if (progressMoved && newBlocker) deviation = "MIXED_DEVIATION";
      else if (progressMoved) deviation = "NO_MATERIAL_DEVIATION";
      else if (newBlocker) deviation = "UNFAVORABLE_DEVIATION";
      else if (priorProgress == null && managerIntent === "CHANGED") deviation = "UNKNOWN";
      else deviation = "NO_MATERIAL_DEVIATION";
    } else if (progressValue == null) {
      trackStatus = "UNKNOWN";
      deviation = "UNKNOWN";
    } else if (progressValue + 0.0001 < expected) {
      trackStatus = "OFF_TRACK";
      deviation = "UNFAVORABLE_DEVIATION";
    } else if (progressValue > expected + 0.0001) {
      trackStatus = "AHEAD";
      deviation = "FAVORABLE_DEVIATION";
    } else {
      trackStatus = "ON_TRACK";
      deviation = "NO_MATERIAL_DEVIATION";
    }
    if (capAv && (trackStatus === "OFF_TRACK" || deviation === "UNFAVORABLE_DEVIATION") && !blockerLabel) {
      trackStatus = "UNKNOWN";
      deviation = "POSSIBLE_DEVIATION";
    }

    primaryAttention = blockerLabel ?? (deviation === "UNFAVORABLE_DEVIATION" ? "progress is behind the available baseline" : null) ?? (capAv ? "CAP_AV meaning is still unconfirmed" : null);
    if (acknowledge && previous.acknowledgedAttention === primaryAttention) {
      primaryAttention = previous.acknowledgedAttention;
    }

    const progressPhrase =
      progressValue == null
        ? "no authoritative progress observation"
        : progressStatus === "ESTIMATED" || progressStatus === "REPORTED"
          ? `reported/estimated progress around ${progressValue}%`
          : `${progressValue}% recorded progress`;

    if (managerIntent === "WRITE") {
      speak = true;
      handoff = true;
      note = "That is an Execution change request. It has to go through Execution confirmation before anything is written.";
    } else if (managerIntent === "OUTCOME_QUESTION") {
      speak = true;
      note =
        liveState === "COMPLETED"
          ? "Execution is complete. That confirms the work finished, not whether the Decision achieved the intended Outcome. The next step is Outcome review."
          : "Execution is progressing, but it is too early to judge the Decision’s Outcome.";
    } else if (managerIntent === "REASSESS") {
      speak = true;
      note = blockerLabel
        ? `The live Execution evidence, including ${blockerLabel}, may justify reassessing the Decision. Reviewing Execution does not itself change the Decision.`
        : "Live Execution evidence can be reviewed against the Decision. Reviewing Execution does not itself change the Decision.";
    } else if (managerIntent === "CHANGED") {
      speak = true;
      if (priorProgress == null && previous.lastExecutionId !== execution!.executionId) {
        note = `I can describe the current state (${progressPhrase}), but I don’t have a prior execution observation to compare against.`;
        deviation = "UNKNOWN";
      } else if (priorProgress == null && !newBlocker) {
        note = `I can describe the current state (${progressPhrase}), but I don’t have a prior execution observation to compare against.`;
        deviation = "UNKNOWN";
      } else if (deviation === "MIXED_DEVIATION") {
        note = `Progress improved since the last observation, but a new blocker appeared (${blockerLabel}), so the overall change is mixed.`;
      } else if (newBlocker) {
        note = `A new blocker is now recorded: ${blockerLabel}.`;
      } else if (progressMoved) {
        note = `Progress moved from ${priorProgress}% to ${progressValue}%. That is a change since the last observation, not a schedule judgment.`;
      } else {
        note = "I don’t see a material change since the last valid observation.";
      }
    } else if (managerIntent === "TRACK") {
      speak = true;
      if (expected == null) {
        note = `Current progress is ${progressPhrase}, but I don’t have a confirmed baseline to judge whether that is ahead or behind plan.`;
        trackStatus = "UNKNOWN";
      } else if (trackStatus === "OFF_TRACK") {
        note = `Current progress is ${progressValue}% against a ${expected}% expected milestone, so execution is behind that baseline. I won’t invent a cause.`;
      } else if (trackStatus === "AHEAD") {
        note = `Current progress is ${progressValue}% against a ${expected}% expected milestone, so execution is ahead of that baseline. That does not prove Decision success.`;
      } else {
        note = `Current progress is ${progressValue}% against a ${expected}% expected milestone.`;
      }
    } else if (managerIntent === "ATTENTION") {
      speak = true;
      if (blockerLabel && riskLabel) {
        note = `${blockerLabel} is the main live issue right now. It is a current obstruction; ${riskLabel} is still a Risk rather than a confirmed blocker.`;
      } else if (blockerLabel) {
        note = `The main live issue is ${blockerLabel}.`;
      } else if (riskLabel) {
        note = `${riskLabel} is a Risk, not a confirmed Execution blocker.`;
      } else {
        note = "I don’t see a material live-execution attention item in the current evidence.";
      }
    } else if (managerIntent === "BLOCKERS") {
      speak = true;
      note = blockerLabel ? `Current blocker: ${blockerLabel}.` : "No current Execution blocker is recorded.";
    } else if (managerIntent === "RISKS") {
      speak = true;
      note = riskLabel ? `${riskLabel} is a Risk, not a blocker.` : "No Execution Risk is recorded.";
    } else if (managerIntent === "SUMMARY" || managerIntent === "READ") {
      speak = true;
      if (liveState === "COMPLETED") {
        note = "Execution is complete. That confirms the work finished, not whether the Decision achieved the intended Outcome.";
      } else {
        const trackBit =
          expected == null
            ? "I don’t have a confirmed schedule baseline, so I can’t reliably call it on-track or off-track yet."
            : trackStatus === "OFF_TRACK"
              ? "It is behind the available baseline."
              : trackStatus === "AHEAD"
                ? "It is ahead of the available baseline."
                : "It matches the available baseline.";
        const blockerBit = blockerLabel ? ` A supplier-relevant blocker is open: ${blockerLabel}.` : "";
        note = `Execution is ${liveState === "BLOCKED" ? "blocked" : "active"} at ${progressPhrase}.${blockerBit} ${trackBit}`;
      }
    }
  }

  if (managerIntent === "NONE") speak = false;

  return freeze({
    identity: ECA_LIVE_EXECUTION_IDENTITY,
    liveState,
    managerIntent,
    executionId: execution?.executionId ?? null,
    decisionId: execution?.decisionId ?? null,
    executionStatus: execution?.status ?? null,
    progressValue,
    progressStatus,
    trackStatus: live ? trackStatus : "UNKNOWN",
    deviation: live ? deviation : "NO_MATERIAL_DEVIATION",
    primaryAttentionItem: live ? primaryAttention : null,
    blockerState: !live ? "NOT_APPLICABLE" : (execution?.blockers.length ?? 0) > 0 ? "KNOWN" : "NONE",
    riskIsBlocker: false,
    canonicalHandoffAllowed: handoff,
    canonicalAuthority: "CC:11 Execution Follow-up",
    reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
    managerFacingNote: note,
    speak,
    falseLive: false,
    falseDeviation: false,
    trustInflation: false,
    unsupportedCause: false,
    duplicateAttention: false,
    staleDeviation: false,
    targetDrift: false,
    boundaries: BOUNDARIES,
    provenance: freeze({ sources, rationale }),
  });
}

export function nextEcaLiveExecutionSession(
  previous: EcaLiveExecutionSession | null | undefined,
  utterance: string,
  judgment: EcaLiveExecutionJudgment,
  execution?: EcaLiveExecutionSnapshot | null,
): EcaLiveExecutionSession {
  const base = previous ?? emptyEcaLiveExecutionSession();
  const acknowledge = /\bi (?:know|understand)\b/i.test(utterance);
  const fp = execution?.blockers.map((item) => item.label).join("|") ?? null;
  return freeze({
    lastExecutionId: judgment.executionId ?? base.lastExecutionId,
    lastProgress: judgment.progressValue ?? base.lastProgress,
    lastBlockerFingerprint: fp ?? base.lastBlockerFingerprint,
    acknowledgedAttention: acknowledge && judgment.primaryAttentionItem
      ? judgment.primaryAttentionItem
      : base.acknowledgedAttention,
  });
}

export function applyEcaLiveExecutionToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaLiveExecutionJudgment;
  readonly locked?: boolean;
}): string {
  if (input.locked || !input.judgment.speak) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 28).toLowerCase())) return input.source;
  return `${input.source} ${note}`.trim();
}

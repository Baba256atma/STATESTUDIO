/**
 * NCA:5 — Conversational initiative over existing executive intelligence.
 * Consumes MO:6, NCA:1–4, and caller-provided observations.
 * Does not monitor, score options, commit decisions, or start execution.
 */

import type { ExecutiveAttentionIntelligence } from "./managerObjectAttentionTypes.ts";
import type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";
import type { ExecutiveQuestionStrategy } from "./nexoraNca3QuestionIntelligenceTypes.ts";
import type { ExecutiveAdvisoryStrategy } from "./nexoraNca4AdvisoryIntelligenceTypes.ts";
import { isProcessStateLanguage } from "./nexoraRegisteredReferenceRecovery.ts";
import { isGreetingSocialUtterance } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  NEXORA_NCA5_BOUNDARY,
  nexoraNca5Identity,
  nexoraNca5Namespace,
  nexoraNca5Version,
  type ConversationImportance,
  type ConversationalInitiativeDecision,
  type ExecutiveInitiativeStrategy,
  type InitiativePriority,
  type NcaInitiativeSnapshot,
  type ProactiveAdvisorBehavior,
  type ProactiveConversationStrategy,
  type ProactiveExecutiveSignal,
  type ProactiveSignalFamily,
} from "./nexoraNca5InitiativeIntelligenceTypes.ts";

export {
  NEXORA_NCA5_BOUNDARY,
  nexoraNca5Identity,
  nexoraNca5Namespace,
  nexoraNca5Version,
};
export type {
  ConversationalInitiativeDecision,
  ExecutiveInitiativeStrategy,
  NcaInitiativeSnapshot,
  ProactiveExecutiveSignal,
} from "./nexoraNca5InitiativeIntelligenceTypes.ts";

export function getNexoraNca5Identity() {
  return Object.freeze({
    id: nexoraNca5Identity,
    version: nexoraNca5Version,
    namespace: nexoraNca5Namespace,
  });
}

export function verifyNexoraNca5(): { readonly ok: true } {
  if (getNexoraNca5Identity().id !== nexoraNca5Identity) {
    throw new Error("NCA:5 identity mismatch");
  }
  if (NEXORA_NCA5_BOUNDARY.createsSecondAlertQueue) {
    throw new Error("NCA:5 must not create a second alert queue");
  }
  if (NEXORA_NCA5_BOUNDARY.duplicatesMo6) {
    throw new Error("NCA:5 must not duplicate MO:6");
  }
  if (NEXORA_NCA5_BOUNDARY.commitsDecision || NEXORA_NCA5_BOUNDARY.startsExecution) {
    throw new Error("NCA:5 must not commit decisions or start execution");
  }
  if (NEXORA_NCA5_BOUNDARY.usesLiveLlm) {
    throw new Error("NCA:5 must not claim a live LLM");
  }
  return Object.freeze({ ok: true as const });
}

export function createProactiveExecutiveSignal(
  input: Partial<ProactiveExecutiveSignal> &
    Pick<ProactiveExecutiveSignal, "id" | "family" | "subjectId" | "subjectLabel" | "observation">,
): ProactiveExecutiveSignal {
  return Object.freeze({
    id: input.id,
    family: input.family,
    source: input.source ?? "caller",
    subjectId: input.subjectId,
    subjectLabel: input.subjectLabel,
    goalId: input.goalId ?? null,
    observation: input.observation,
    previousValue: input.previousValue ?? null,
    currentValue: input.currentValue ?? null,
    targetValue: input.targetValue ?? null,
    significance: clamp01(input.significance ?? 0.5),
    relevance: clamp01(input.relevance ?? 0.5),
    urgency: clamp01(input.urgency ?? 0.4),
    novelty: clamp01(input.novelty ?? 1),
    actionability: clamp01(input.actionability ?? 0.5),
    confidence: clamp01(input.confidence ?? 0.8),
    evidence: Object.freeze([...(input.evidence ?? [input.observation])]),
    uncertainties: Object.freeze([...(input.uncertainties ?? [])]),
    nextStep: input.nextStep ?? null,
    critical: input.critical ?? false,
    positive: input.positive ?? false,
    processOnly:
      input.processOnly ?? isProcessStateLanguage(input.observation ?? ""),
  });
}

export function evaluateNca5InitiativeStrategy(input: {
  readonly utterance?: string;
  readonly nca?: ManagerConversationTurn | null;
  readonly conversation?: NexoraConversationState | null;
  readonly nca3?: ExecutiveQuestionStrategy | null;
  readonly nca4?: ExecutiveAdvisoryStrategy | null;
  readonly attention?: ExecutiveAttentionIntelligence | null;
  readonly signals?: readonly ProactiveExecutiveSignal[];
  readonly conversationImportance?: ConversationImportance;
  readonly managerTurnPresent?: boolean;
}): ExecutiveInitiativeStrategy {
  const utterance = input.utterance ?? "";
  const conversation = input.conversation ?? null;
  const importance =
    input.conversationImportance ?? inferConversationImportance(utterance, input.nca);
  const managerTurn = input.managerTurnPresent ?? Boolean(utterance.trim());
  const dismissal = classifyDismissal(utterance);
  const scored = collectCandidates(input)
    .map((signal) => scoreSignal(signal, conversation, importance, dismissal))
    .sort((left, right) => right.value - left.value);
  const winner = scored[0];
  if (!winner || winner.silent) {
    return buildStrategy(
      silentDecision(
        scored.length,
        winner?.reason ?? "No initiative candidate deserves manager attention.",
      ),
      input.nca3,
      input.nca4,
    );
  }
  const interruption = decideInterruption(
    winner.signal,
    winner.priority,
    importance,
    managerTurn,
    utterance,
    input.nca,
  );
  if (managerTurn && !interruption.justified) {
    return buildStrategy(
      silentDecision(
        scored.length,
        "The manager's current request takes precedence over a non-critical initiative.",
      ),
      input.nca3,
      input.nca4,
    );
  }
  return buildStrategy(
    Object.freeze({
      shouldInitiate: true,
      signal: winner.signal,
      reason: winner.reason,
      priority: winner.priority,
      behavior: resolveBehavior(winner.signal, input.nca3, input.nca4),
      interruption,
      value: winner.value,
      competingCount: Math.max(0, scored.length - 1),
    }),
    input.nca3,
    input.nca4,
  );
}

export function applyNca5StrategyToResponse(input: {
  readonly source: string;
  readonly strategy: ExecutiveInitiativeStrategy;
  readonly locked: boolean;
  readonly managerTurnPresent?: boolean;
}): string {
  if (input.locked) return input.source;
  const interruptJustified = Boolean(
    input.strategy.decision.interruption.justified,
  );
  if (input.managerTurnPresent && !interruptJustified) {
    return input.source;
  }
  if (!input.strategy.shouldInitiate || !input.strategy.response) return input.source;
  if (
    /\?/.test(input.source) &&
    !input.strategy.decision.interruption.justified &&
    input.strategy.decision.behavior !== "ASK"
  ) {
    return input.source;
  }
  if (
    /reducing that uncertainty|not yet establish|candidate explanation|validated causal proof|scenario rather than a prediction/i.test(
      input.source,
    ) &&
    !input.strategy.decision.interruption.justified
  ) {
    return input.source;
  }
  const source = input.source.trim();
  const initiative = input.strategy.response.trim();
  if (!source || source === initiative) return initiative;
  if (source.includes(initiative)) return source;
  if (input.strategy.decision.interruption.justified) {
    return `${initiative} ${source}`.replace(/\s+/g, " ").trim();
  }
  if (input.managerTurnPresent) {
    return `${source} ${initiative}`.replace(/\s+/g, " ").trim();
  }
  return initiative;
}

export function attachInitiativeSnapshot(
  state: NexoraConversationState,
  strategy: ExecutiveInitiativeStrategy,
  utterance = "",
): NexoraConversationState {
  const dismissal = classifyDismissal(utterance);
  const lastKey = strategy.snapshot?.fingerprint ?? state.lastInitiativeSnapshot?.fingerprint ?? null;
  let dismissed = [...(state.dismissedInitiativeKeys ?? [])];
  let suppressed = [...(state.suppressedInitiativeKeys ?? [])];
  if (dismissal === "dismiss" && lastKey) dismissed = uniquePush(dismissed, lastKey);
  if (dismissal === "suppress" && lastKey) suppressed = uniquePush(suppressed, lastKey);
  return Object.freeze({
    ...state,
    lastInitiativeSnapshot: strategy.snapshot ?? state.lastInitiativeSnapshot,
    dismissedInitiativeKeys: Object.freeze(dismissed.slice(-8)),
    suppressedInitiativeKeys: Object.freeze(suppressed.slice(-8)),
  });
}

type DismissalKind = "none" | "dismiss" | "suppress";

function collectCandidates(input: {
  readonly utterance?: string;
  readonly nca?: ManagerConversationTurn | null;
  readonly conversation?: NexoraConversationState | null;
  readonly nca3?: ExecutiveQuestionStrategy | null;
  readonly nca4?: ExecutiveAdvisoryStrategy | null;
  readonly attention?: ExecutiveAttentionIntelligence | null;
  readonly signals?: readonly ProactiveExecutiveSignal[];
}): ProactiveExecutiveSignal[] {
  const collected = [
    ...(input.signals ?? []),
    ...signalsFromUtterance(input.utterance ?? "", input.nca),
    ...signalsFromAttention(input.attention ?? null),
    ...signalsFromAdvisory(input.nca4 ?? null),
    ...signalsFromOpenThread(input.conversation ?? null, input.nca3 ?? null),
  ];
  const seen = new Set<string>();
  return collected.filter((signal) => {
    if (seen.has(signal.id)) return false;
    seen.add(signal.id);
    return true;
  });
}

function signalsFromUtterance(
  utterance: string,
  nca: ManagerConversationTurn | null | undefined,
): readonly ProactiveExecutiveSignal[] {
  const match =
    /([A-Za-z][A-Za-z0-9 /-]{1,40})\s+(?:dropped|fell|deteriorated|moved|improved|rose)\s+(?:from\s+([\d.]+)\s+to\s+)?([\d.]+)/i.exec(
      utterance,
    );
  if (!match) return Object.freeze([]);
  const label = (match[1] ?? "metric").trim();
  const previous = match[2] ? Number(match[2]) : null;
  const current = Number(match[3]);
  const delta = previous == null ? 0 : Math.abs(current - previous);
  const declined = previous != null && current < previous;
  const improved = previous != null && current > previous;
  const material = delta >= 3 || (previous != null && delta / Math.max(Math.abs(previous), 1) >= 0.04);
  return Object.freeze([
    createProactiveExecutiveSignal({
      id: `utterance:${slug(label)}`,
      family: improved ? "OUTCOME_CHANGE" : "MATERIAL_CHANGE",
      source: "conversation-observation",
      subjectId: slug(label),
      subjectLabel: label,
      goalId: nca?.conversationContext.activeGoal ?? null,
      observation: `${label} moved${previous == null ? "" : ` from ${previous}`} to ${current}.`,
      previousValue: previous,
      currentValue: current,
      significance: material ? 0.84 : 0.12,
      relevance: goalRelevance(label, nca?.conversationContext.activeGoal ?? null),
      urgency: material && declined ? 0.74 : 0.2,
      novelty: 1,
      actionability: material ? 0.72 : 0.18,
      confidence: 0.86,
      nextStep: material ? "Investigate whether the current plan is still sufficient." : null,
      critical: material && declined && delta >= 6,
      positive: Boolean(improved && material),
    }),
  ]);
}

function signalsFromAttention(
  attention: ExecutiveAttentionIntelligence | null,
): readonly ProactiveExecutiveSignal[] {
  const item = attention?.primaryAttention;
  if (!item || attention.attentionState === "NONE") return Object.freeze([]);
  const processOnly = isProcessStateLanguage(`${item.reason} ${item.label} ${item.kind}`);
  const critical =
    !processOnly &&
    (attention.attentionState === "URGENT" || item.interventionNeed === "ESCALATION_REQUIRED");
  return Object.freeze([
    createProactiveExecutiveSignal({
      id: `mo6:${item.attentionId}`,
      family: familyFromAttention(item.kind),
      source: "MO:6",
      subjectId: item.subjectId ?? item.attentionId,
      subjectLabel: item.label,
      observation: item.reason,
      significance: attention.attentionState === "URGENT" ? 0.9 : attention.attentionState === "ATTENTION" ? 0.7 : 0.28,
      relevance: item.goalRelevance === "DIRECT" ? 0.92 : item.goalRelevance === "RELATED" ? 0.55 : 0.22,
      urgency: item.urgency === "time-sensitive" ? 0.8 : critical ? 0.86 : 0.34,
      actionability: item.interventionNeed === "NOT_REQUIRED" ? 0.2 : 0.66,
      confidence: 0.75,
      evidence: item.evidence,
      nextStep: item.recommendedPath,
      critical,
      processOnly,
    }),
  ]);
}

function signalsFromAdvisory(
  nca4: ExecutiveAdvisoryStrategy | null,
): readonly ProactiveExecutiveSignal[] {
  if (!nca4?.shouldAdvise || nca4.position.status !== "REVISED") return Object.freeze([]);
  const option = nca4.position.recommendation.optionLabel ?? "the advisory position";
  return Object.freeze([
    createProactiveExecutiveSignal({
      id: "nca4:recommendation-change",
      family: "RECOMMENDATION_CHANGE",
      source: "NCA:4",
      subjectId: nca4.position.recommendation.optionId ?? "advisory",
      subjectLabel: option,
      observation: nca4.position.revisionNote ?? `The advisory position changed to ${option}.`,
      significance: 0.86,
      relevance: 0.92,
      urgency: 0.7,
      actionability: 0.82,
      confidence: nca4.position.confidence.level === "HIGH" ? 0.85 : 0.7,
      nextStep: "Reassess before committing further resources.",
    }),
  ]);
}

function signalsFromOpenThread(
  conversation: NexoraConversationState | null,
  nca3: ExecutiveQuestionStrategy | null,
): readonly ProactiveExecutiveSignal[] {
  const thread = conversation?.threads.find((item) => item.state === "SUSPENDED");
  if (!thread || nca3?.shouldAsk) return Object.freeze([]);
  if (nca3?.sufficiency === "INSUFFICIENT") return Object.freeze([]);
  return Object.freeze([
    createProactiveExecutiveSignal({
      id: `thread:${thread.id}`,
      family: "UNRESOLVED_THREAD",
      source: "NCA:2",
      subjectId: thread.subject.id ?? thread.id,
      subjectLabel: thread.subject.name ?? thread.topic.label,
      observation: `An unfinished ${thread.topic.label} thread can continue.`,
      significance: 0.62,
      relevance: 0.76,
      urgency: 0.44,
      actionability: 0.72,
      nextStep: "Continue the unfinished investigation.",
    }),
  ]);
}

function scoreSignal(
  signal: ProactiveExecutiveSignal,
  conversation: NexoraConversationState | null,
  importance: ConversationImportance,
  dismissal: DismissalKind,
): {
  readonly signal: ProactiveExecutiveSignal;
  readonly value: number;
  readonly priority: InitiativePriority;
  readonly reason: string;
  readonly silent: boolean;
} {
  const fingerprint = fingerprintOf(signal);
  const previous = conversation?.lastInitiativeSnapshot ?? null;
  const dismissed = conversation?.dismissedInitiativeKeys.includes(fingerprint) ?? false;
  const suppressed = conversation?.suppressedInitiativeKeys.includes(fingerprint) ?? false;
  const sameAsLast = previous?.fingerprint === fingerprint;
  const materialSince =
    previous != null &&
    previous.subjectId === signal.subjectId &&
    signal.currentValue != null &&
    previous.currentValue != null &&
    Math.abs(signal.currentValue - previous.currentValue) >= 3;
  const novelty = sameAsLast && !materialSince ? 0.08 : materialSince ? 0.92 : signal.novelty;
  const interruptionCost = importance === "CRITICAL" ? 0.85 : importance === "HIGH" ? 0.55 : 0.18;
  const value =
    signal.significance *
      Math.max(signal.relevance, signal.critical ? 0.85 : 0.15) *
      novelty *
      signal.actionability *
      Math.max(signal.urgency, 0.25) *
      signal.confidence -
    interruptionCost * 0.25 -
    (sameAsLast && !materialSince ? 0.7 : 0);
  let silent = value < 0.1 || signal.significance < 0.2;
  let reason = `${signal.subjectLabel} deserves attention because ${signal.observation}`;
  if (signal.positive && signal.significance >= 0.7 && signal.relevance >= 0.6) {
    silent = false;
    reason = `${signal.subjectLabel} improved enough to be worth noting.`;
  }
  if (signal.family === "UNRESOLVED_THREAD" && signal.actionability >= 0.6) {
    silent = false;
    reason = `An unfinished ${signal.subjectLabel} thread can usefully continue.`;
  }
  if (!signal.nextStep && !signal.critical && signal.significance < 0.7) {
    silent = true;
    reason = "No useful next step exists for a non-critical change.";
  }
  if (sameAsLast && !materialSince) {
    silent = true;
    reason = "This issue was already surfaced and nothing material has changed.";
  }
  if (dismissed && !signal.critical && !materialSince) {
    silent = true;
    reason = "The manager deferred this issue and it has not become critical.";
  }
  if ((suppressed || dismissal === "suppress") && !signal.critical) {
    silent = true;
    reason = "The manager asked not to raise this unchanged issue again.";
  }
  if (signal.critical && (materialSince || !sameAsLast) && !isProcessOnlySignal(signal)) {
    silent = false;
    reason = materialSince
      ? "The previously deferred issue has become materially worse."
      : reason;
  }
  if (isProcessOnlySignal(signal)) {
    silent = true;
    reason = "Journey/process state is not an executive interruption.";
  }
  const priority: InitiativePriority = signal.critical
    ? "CRITICAL"
    : value >= 0.55
      ? "HIGH"
      : value >= 0.32
        ? "NORMAL"
        : "LOW";
  return Object.freeze({ signal, value, priority, reason, silent });
}

function decideInterruption(
  signal: ProactiveExecutiveSignal,
  priority: InitiativePriority,
  importance: ConversationImportance,
  managerTurn: boolean,
  utterance: string,
  nca: ManagerConversationTurn | null | undefined,
): { readonly justified: boolean; readonly reason: string } {
  if (!managerTurn) {
    return Object.freeze({ justified: true, reason: "No competing manager turn." });
  }
  if (isProcessOnlySignal(signal)) {
    return Object.freeze({
      justified: false,
      reason: "Process-state signals must not interrupt a manager request.",
    });
  }
  if (isGreetingSocialUtterance(utterance) && priority !== "CRITICAL" && !signal.critical) {
    return Object.freeze({
      justified: false,
      reason: "A greeting owns the turn unless a critical signal justifies interruption.",
    });
  }
  if (priority === "CRITICAL" || signal.critical) {
    return Object.freeze({
      justified: true,
      reason: "Critical evidence justifies interrupting the current flow.",
    });
  }
  if (importance === "HIGH" || importance === "CRITICAL") {
    return Object.freeze({
      justified: false,
      reason: "The current conversation is too consequential to interrupt.",
    });
  }
  if (sameSubject(signal, utterance, nca ?? null)) {
    return Object.freeze({
      justified: false,
      reason: "The manager already opened this subject.",
    });
  }
  return Object.freeze({
    justified: false,
    reason: "A non-critical signal should not hijack the manager's turn.",
  });
}

function resolveBehavior(
  signal: ProactiveExecutiveSignal,
  nca3: ExecutiveQuestionStrategy | null | undefined,
  nca4: ExecutiveAdvisoryStrategy | null | undefined,
): ProactiveAdvisorBehavior {
  if (signal.family === "RECOMMENDATION_CHANGE" || nca4?.position.status === "REVISED") {
    return "RECOMMEND";
  }
  if (signal.family === "ASSUMPTION_INVALIDATION" || signal.family === "DECISION_RISK") {
    return "CHALLENGE";
  }
  if (signal.family === "UNRESOLVED_THREAD" || signal.family === "MANAGER_FOLLOW_UP") {
    return "FOLLOW_UP";
  }
  if (nca3?.shouldAsk && nca3.question) return "ASK";
  if (signal.positive) return "INFORM";
  if (signal.family === "RISK_ESCALATION" || signal.critical) return "WARN";
  if (signal.family === "OPPORTUNITY") return "RECOMMEND";
  if (signal.family === "EXECUTION_DRIFT") return "REASSESS";
  return "SURFACE";
}

function buildStrategy(
  decision: ConversationalInitiativeDecision,
  nca3: ExecutiveQuestionStrategy | null | undefined,
  nca4: ExecutiveAdvisoryStrategy | null | undefined,
): ExecutiveInitiativeStrategy {
  const composed = composeResponse(decision, nca3, nca4);
  const snapshot =
    decision.shouldInitiate && decision.signal ? snapshotOf(decision.signal, decision) : null;
  return Object.freeze({
    identity: nexoraNca5Identity,
    shouldInitiate: decision.shouldInitiate,
    decision,
    strategy: conversationStrategy(decision, composed.question),
    snapshot,
    response: composed.response,
    question: composed.question,
    commitsDecision: false,
    startsExecution: false,
    reason: decision.reason,
  });
}

function composeResponse(
  decision: ConversationalInitiativeDecision,
  nca3: ExecutiveQuestionStrategy | null | undefined,
  nca4: ExecutiveAdvisoryStrategy | null | undefined,
): { readonly response: string | null; readonly question: string | null } {
  if (!decision.shouldInitiate || !decision.signal) return { response: null, question: null };
  const signal = decision.signal;
  const changed =
    signal.previousValue != null && signal.currentValue != null
      ? `${signal.subjectLabel} moved from ${signal.previousValue} to ${signal.currentValue}.`
      : signal.observation;
  const next = signal.nextStep ? ` ${signal.nextStep}` : "";
  if (decision.behavior === "ASK" && nca3?.question) {
    return {
      response: `${changed} That now matters enough to continue. ${nca3.question}`,
      question: nca3.question,
    };
  }
  if (decision.behavior === "RECOMMEND" && nca4?.shouldAdvise && nca4.response) {
    return {
      response: `The evidence changed enough that I would revise my recommendation. ${nca4.response}`,
      question: null,
    };
  }
  if (decision.behavior === "CHALLENGE") {
    return {
      response: `Before we continue, one change is important: ${changed} I would reassess before committing.`,
      question: null,
    };
  }
  if (decision.behavior === "FOLLOW_UP") {
    return {
      response: `We can now continue the unfinished ${signal.subjectLabel} thread. ${changed}${next}`,
      question: null,
    };
  }
  if (decision.behavior === "INFORM") {
    return {
      response: `${changed} That is a meaningful improvement toward the active goal.`,
      question: null,
    };
  }
  if (decision.interruption.justified) {
    return {
      response: `Before we continue, ${changed} ${decision.reason}${next}`,
      question: null,
    };
  }
  return { response: `${changed} ${decision.reason}${next}`, question: null };
}

function conversationStrategy(
  decision: ConversationalInitiativeDecision,
  question: string | null,
): ProactiveConversationStrategy {
  const signal = decision.signal;
  return Object.freeze({
    behavior: decision.behavior,
    subject: signal?.subjectLabel ?? null,
    objective: decision.shouldInitiate
      ? "Surface one high-value executive issue."
      : "Protect manager attention.",
    reasonForInitiative: decision.reason,
    evidence: signal?.evidence ?? Object.freeze([]),
    nextCapability: question ? "NCA:3" : decision.behavior === "RECOMMEND" ? "NCA:4" : "NONE",
    interruptionJustified: decision.interruption.justified,
    suppressRepeat: true,
    presentationIntent: Object.freeze({
      kind: decision.shouldInitiate ? "information-card-ready" : "none",
      subject: signal?.subjectLabel ?? null,
      reason: decision.reason,
      importance: decision.priority,
      evidence: signal?.evidence ?? Object.freeze([]),
      recommendedNextStep: signal?.nextStep ?? question,
    }),
    timelineIntent:
      decision.shouldInitiate && signal
        ? Object.freeze({
            eventKind: signal.family,
            subject: signal.subjectLabel,
            summary: signal.observation,
          })
        : null,
  });
}

function silentDecision(competing: number, reason: string): ConversationalInitiativeDecision {
  return Object.freeze({
    shouldInitiate: false,
    signal: null,
    reason,
    priority: "LOW",
    behavior: "SILENT",
    interruption: Object.freeze({
      justified: false,
      reason: "Silence protects manager attention.",
    }),
    value: 0,
    competingCount: competing,
  });
}

function snapshotOf(
  signal: ProactiveExecutiveSignal,
  decision: ConversationalInitiativeDecision,
): NcaInitiativeSnapshot {
  return Object.freeze({
    signalId: signal.id,
    subjectId: signal.subjectId,
    family: signal.family,
    fingerprint: fingerprintOf(signal),
    behavior: decision.behavior,
    priority: decision.priority,
    observation: signal.observation,
    currentValue: signal.currentValue ?? null,
  });
}

function fingerprintOf(signal: ProactiveExecutiveSignal): string {
  const bucket =
    signal.currentValue == null ? "na" : String(Math.round(signal.currentValue * 2) / 2);
  return `${signal.family}|${signal.subjectId}|${bucket}`;
}

function isProcessOnlySignal(signal: ProactiveExecutiveSignal): boolean {
  return (
    signal.processOnly === true ||
    isProcessStateLanguage(`${signal.observation} ${signal.source} ${signal.family}`)
  );
}

function familyFromAttention(kind: string): ProactiveSignalFamily {
  if (kind === "RISK") return "RISK_ESCALATION";
  if (kind === "OPPORTUNITY") return "OPPORTUNITY";
  if (kind === "EXECUTION") return "EXECUTION_DRIFT";
  if (kind === "OUTCOME") return "OUTCOME_CHANGE";
  if (kind === "DECISION") return "DECISION_RISK";
  if (kind === "GOAL") return "GOAL_DEVIATION";
  if (kind === "CHANGE") return "MATERIAL_CHANGE";
  return "NEW_EVIDENCE";
}

function inferConversationImportance(
  utterance: string,
  nca: ManagerConversationTurn | null | undefined,
): ConversationImportance {
  if (/confirm|approve|commit|sign off|make the decision/i.test(utterance)) return "HIGH";
  if (nca?.need.family === "DECIDE") return "HIGH";
  if (/explain|show|what is|walk me/i.test(utterance)) return "NORMAL";
  return "LOW";
}

function classifyDismissal(utterance: string): DismissalKind {
  const text = utterance.trim().toLowerCase();
  if (/stop bringing this up|don't bring this up|stop raising this/.test(text)) return "suppress";
  if (/not now|ignore that|we'll deal with it later|i know\b/.test(text)) return "dismiss";
  return "none";
}

function sameSubject(
  signal: ProactiveExecutiveSignal,
  utterance: string,
  nca: ManagerConversationTurn | null | undefined,
): boolean {
  const haystack = `${utterance} ${nca?.conversationContext.activeObject ?? ""}`.toLowerCase();
  return haystack.includes(signal.subjectLabel.toLowerCase()) || haystack.includes(signal.subjectId);
}

function goalRelevance(label: string, goal: string | null): number {
  if (!goal) return 0.45;
  const goalText = goal.toLowerCase();
  const subject = label.toLowerCase();
  if (goalText.includes(subject) || (subject.includes("delivery") && /deliver/i.test(goalText))) {
    return 0.95;
  }
  return 0.25;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "subject";
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function uniquePush(list: string[], value: string): string[] {
  if (list.includes(value)) return list;
  return [...list, value];
}

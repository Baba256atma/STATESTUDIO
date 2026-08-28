/**
 * NXA:4 — conversational-entry policy over MO:6, NCA:5 and NXA:3.
 * It neither detects business change nor owns attention, memory, recommendations,
 * Decisions, Executions, Outcomes, monitoring, scheduling, or Stage.
 */
import type { ExecutiveAttentionIntelligence } from "./managerObjectAttentionTypes.ts";
import type { ExecutiveInitiativeStrategy, ProactiveExecutiveSignal } from "./nexoraNca5InitiativeIntelligenceTypes.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";
import type { ExecutiveSituation } from "./nexoraNxa3ExecutiveSituation.ts";

export const nexoraNxa4Identity = "NXA:4/ExecutiveProactiveAdvisoryInterventionIntelligence" as const;
export const NEXORA_NXA4_BOUNDARY = Object.freeze({
  consumesExecutiveSituation: true as const,
  consumesMo6Attention: true as const,
  consumesNca5Initiative: true as const,
  createsAttentionEngine: false as const,
  createsSituationModel: false as const,
  createsRecommendationEngine: false as const,
  createsInterventionQueue: false as const,
  createsMonitoringEngine: false as const,
  createsScheduler: false as const,
  commitsDecision: false as const,
  changesExecution: false as const,
  writesOutcome: false as const,
  writesStage: false as const,
});

export type ProactiveAdvisoryDisposition = "SPEAK" | "DEFER" | "SUPPRESS" | "ESCALATE";
export type ProactiveAdvisoryIntensity = "NOTICE" | "ADVISE" | "WARN" | "ESCALATE";
export type ProactiveMateriality = "NOISE" | "RELEVANT" | "MATERIAL" | "CRITICAL";
export type ProactiveEvidenceStrength = "WEAK" | "MODERATE" | "STRONG";

export type Nxa4ProactiveAdvisoryEvaluation = {
  readonly identity: typeof nexoraNxa4Identity;
  readonly candidate: { readonly id: string; readonly subjectId: string; readonly category: string; readonly source: string } | null;
  readonly disposition: ProactiveAdvisoryDisposition;
  readonly intensity: ProactiveAdvisoryIntensity;
  readonly materiality: ProactiveMateriality;
  readonly goalRelevance: "DIRECT" | "RELATED" | "SEVERE_EXCEPTION" | "LOW";
  readonly evidenceStrength: ProactiveEvidenceStrength;
  readonly novelty: "NEW" | "MATERIALLY_CHANGED" | "REPEATED" | "UNKNOWN";
  readonly urgency: "IMMEDIATE" | "IMPORTANT_NOT_URGENT" | "LOW";
  readonly managerFocus: "ALIGNED" | "PROTECTED" | "AVAILABLE";
  readonly previousIntervention: "NONE" | "ACKNOWLEDGED" | "DEFERRED_OR_REJECTED" | "REPEATED";
  readonly actionPossible: boolean;
  readonly reason: string;
  readonly audit: readonly string[];
  readonly managerMessage: string | null;
  readonly commitsDecision: false;
  readonly changesExecution: false;
  readonly writesOutcome: false;
  readonly writesStage: false;
};

export function evaluateNxa4ProactiveAdvisory(input: {
  readonly situation: ExecutiveSituation;
  readonly attention: ExecutiveAttentionIntelligence;
  readonly initiative: ExecutiveInitiativeStrategy;
  readonly conversation?: NexoraConversationState | null;
  readonly candidate?: ProactiveExecutiveSignal | null;
  readonly managerFocusImportance?: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  readonly managerOverride?: boolean;
  readonly actionPossible?: boolean;
}): Nxa4ProactiveAdvisoryEvaluation {
  const signal = input.candidate ?? input.initiative.decision.signal;
  if (!signal) return quiet("SUPPRESS", "No authoritative intervention candidate was supplied.");

  const materiality = classifyMateriality(signal, input.attention);
  const validatedSource = /validated|MO:6|runtime/i.test(signal.source);
  const evidenceStrength = validatedSource && signal.confidence >= 0.8 && signal.evidence.length > 0 ? "STRONG" : signal.confidence >= 0.55 ? "MODERATE" : "WEAK";
  const goalRelevance = signal.goalId || input.situation.goal && related(signal, input.situation.goal.title)
    ? "DIRECT"
    : signal.critical || input.attention.attentionState === "URGENT" ? "SEVERE_EXCEPTION"
      : signal.relevance >= 0.5 ? "RELATED" : "LOW";
  const previous = input.conversation?.lastInitiativeSnapshot ?? null;
  const same = Boolean(previous && previous.signalId === signal.id && previous.currentValue === (signal.currentValue ?? null));
  const changed = Boolean(previous && previous.signalId === signal.id && previous.currentValue !== (signal.currentValue ?? null));
  const overridden = Boolean(input.managerOverride || input.situation.advisory.status === "OVERRIDDEN");
  const novelty = same ? "REPEATED" : changed ? "MATERIALLY_CHANGED" : signal.novelty >= 0.5 ? "NEW" : "UNKNOWN";
  const focusImportance = input.managerFocusImportance ?? "NORMAL";
  const focusAligned = related(signal, `${input.situation.focus.subjectId ?? ""} ${input.situation.focus.label ?? ""}`);
  const focusProtected = !focusAligned && (focusImportance === "HIGH" || focusImportance === "CRITICAL");
  const actionPossible = input.actionPossible ?? Boolean(signal.nextStep || signal.actionability >= 0.4 || signal.positive);
  const urgent = signal.critical || signal.urgency >= 0.75 || input.attention.attentionState === "URGENT";
  const severeChange = novelty === "MATERIALLY_CHANGED" && (materiality === "CRITICAL" || urgent);
  const mo6Supports = input.attention.attentionState !== "NONE" && !input.attention.doNotDisturb &&
    input.attention.interventionAssessment.need !== "NOT_REQUIRED";

  let disposition: ProactiveAdvisoryDisposition;
  let reason: string;
  if (signal.processOnly || materiality === "NOISE") {
    disposition = "SUPPRESS"; reason = "The authoritative signal is process-only or non-material noise.";
  } else if (same && !severeChange) {
    disposition = "SUPPRESS"; reason = "The same issue was already surfaced and carries no new executive value.";
  } else if (overridden && !severeChange && !(urgent && materiality === "CRITICAL")) {
    disposition = "DEFER"; reason = "The manager redirected attention and no material escalation justifies overriding that direction.";
  } else if (focusProtected && !urgent) {
    disposition = "DEFER"; reason = "A higher-value active conversation protects the manager from this unrelated interruption.";
  } else if (evidenceStrength === "WEAK" && !urgent) {
    disposition = materiality === "MATERIAL" ? "DEFER" : "SUPPRESS"; reason = "Evidence is not yet strong enough for a manager interruption.";
  } else if (!actionPossible && !signal.positive && !urgent) {
    disposition = "DEFER"; reason = "The issue matters, but there is no useful action to take now.";
  } else if ((signal.family === "ASSUMPTION_INVALIDATION" || signal.family === "DECISION_RISK" || signal.family === "EXECUTION_DRIFT") && urgent) {
    disposition = "ESCALATE"; reason = "A material change challenges an active Decision or Execution premise.";
  } else if (severeChange || (urgent && mo6Supports)) {
    disposition = "ESCALATE"; reason = "MO:6 significance and material new evidence justify stronger proactive attention now.";
  } else if ((materiality === "MATERIAL" || materiality === "CRITICAL") && (mo6Supports || input.initiative.shouldInitiate)) {
    disposition = "SPEAK"; reason = "The material, relevant, novel issue has sufficient executive value to justify speaking now.";
  } else {
    disposition = materiality === "RELEVANT" ? "DEFER" : "SUPPRESS"; reason = "Expected executive value does not exceed the interruption cost now.";
  }

  const intensity = disposition === "ESCALATE" ? "ESCALATE" : urgent ? "WARN" : signal.nextStep ? "ADVISE" : "NOTICE";
  const audit = Object.freeze([
    `MO:6 attention=${input.attention.attentionState}; intervention=${input.attention.interventionAssessment.need}`,
    `NXA:3 change=${input.situation.change.kind}; goal=${input.situation.goal?.title ?? "none"}; focus=${input.situation.focus.label ?? "none"}`,
    `materiality=${materiality}; goalRelevance=${goalRelevance}; evidence=${evidenceStrength}; novelty=${novelty}`,
    `managerFocus=${focusProtected ? "PROTECTED" : focusAligned ? "ALIGNED" : "AVAILABLE"}; override=${overridden}; actionPossible=${actionPossible}`,
    `disposition=${disposition}: ${reason}`,
  ]);
  return Object.freeze({
    identity: nexoraNxa4Identity,
    candidate: Object.freeze({ id: signal.id, subjectId: signal.subjectId, category: signal.family, source: signal.source }),
    disposition, intensity, materiality, goalRelevance, evidenceStrength, novelty,
    urgency: urgent ? "IMMEDIATE" : materiality === "MATERIAL" || materiality === "CRITICAL" ? "IMPORTANT_NOT_URGENT" : "LOW",
    managerFocus: focusProtected ? "PROTECTED" : focusAligned ? "ALIGNED" : "AVAILABLE",
    previousIntervention: same ? "REPEATED" : overridden ? "DEFERRED_OR_REJECTED" : previous ? "ACKNOWLEDGED" : "NONE",
    actionPossible, reason, audit,
    managerMessage: disposition === "SPEAK" || disposition === "ESCALATE" ? composeMessage(signal, input.situation, evidenceStrength, intensity) : null,
    commitsDecision: false, changesExecution: false, writesOutcome: false, writesStage: false,
  });
}

function classifyMateriality(signal: ProactiveExecutiveSignal, attention: ExecutiveAttentionIntelligence): ProactiveMateriality {
  if (signal.processOnly || signal.significance < 0.25) return "NOISE";
  if (signal.critical || attention.attentionState === "URGENT" || signal.significance >= 0.88) return "CRITICAL";
  if (signal.significance >= 0.6) return "MATERIAL";
  return "RELEVANT";
}

function related(signal: ProactiveExecutiveSignal, value: string): boolean {
  const terms = `${signal.subjectId} ${signal.subjectLabel} ${signal.goalId ?? ""}`.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 3);
  const haystack = value.toLowerCase();
  return terms.some((term) => haystack.includes(term));
}

function composeMessage(signal: ProactiveExecutiveSignal, situation: ExecutiveSituation, evidence: ProactiveEvidenceStrength, intensity: ProactiveAdvisoryIntensity): string {
  const calibration = evidence === "WEAK" ? "There is an emerging indication that" : evidence === "MODERATE" ? "Current evidence suggests" : "The validated evidence shows";
  const changed = signal.previousValue != null && signal.currentValue != null
    ? `${signal.subjectLabel} changed from ${signal.previousValue} to ${signal.currentValue}.`
    : `${calibration} ${lowerFirst(signal.observation)}`;
  const goal = situation.goal ? ` This matters to ${situation.goal.title}${situation.goal.target ? ` (${situation.goal.target})` : ""}.` : "";
  const uncertainty = signal.uncertainties.length ? ` ${signal.uncertainties[0]}` : signal.family === "OUTCOME_CHANGE" ? " This observation does not by itself establish causality." : "";
  const next = signal.nextStep ? ` I recommend ${lowerFirst(signal.nextStep)}` : "";
  const premise = intensity === "ESCALATE" && situation.decision.subjectId ? " Before continuing, the Decision premise deserves reassessment." : "";
  return `${changed}${goal}${uncertainty}${premise}${next}`.replace(/\s+/g, " ").trim();
}

function lowerFirst(value: string): string { return value ? value[0]!.toLowerCase() + value.slice(1) : value; }

function quiet(disposition: "SUPPRESS" | "DEFER", reason: string): Nxa4ProactiveAdvisoryEvaluation {
  return Object.freeze({ identity: nexoraNxa4Identity, candidate: null, disposition, intensity: "NOTICE", materiality: "NOISE", goalRelevance: "LOW", evidenceStrength: "WEAK", novelty: "UNKNOWN", urgency: "LOW", managerFocus: "AVAILABLE", previousIntervention: "NONE", actionPossible: false, reason, audit: Object.freeze([`disposition=${disposition}: ${reason}`]), managerMessage: null, commitsDecision: false, changesExecution: false, writesOutcome: false, writesStage: false });
}

export function composeNxa4MonitoringBoundaryResponse(actualMonitoringActive: boolean): string {
  return actualMonitoringActive
    ? "Monitoring is active through the connected runtime; I can reassess as validated observations arrive."
    : "I’m not continuously monitoring this. I can reassess when new data or observations enter the system.";
}

export function verifyNexoraNxa4(): { readonly ok: true } {
  if (!NEXORA_NXA4_BOUNDARY.consumesMo6Attention || NEXORA_NXA4_BOUNDARY.createsAttentionEngine || NEXORA_NXA4_BOUNDARY.createsInterventionQueue || NEXORA_NXA4_BOUNDARY.writesStage) throw new Error("NXA:4 boundary violation");
  return Object.freeze({ ok: true as const });
}

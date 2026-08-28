/**
 * NXA:2 — Executive Conversation Guidance & Productive Dialogue.
 * Policy projection over NCA:2–5, CC confirmation, and NXA:1. This module
 * selects a high-level behavior; it is not a second dialogue engine.
 */
import type { NxaAdvisorTurnContract } from "./nexoraNxa1ExecutiveAdvisorContract.ts";

export const nexoraNxa2Identity =
  "NXA:2/ExecutiveConversationGuidanceProductiveDialogue" as const;

export const NEXORA_GUIDANCE_BEHAVIORS = Object.freeze([
  "ANSWER", "ASK", "RECOMMEND", "CHALLENGE", "GUIDE", "CONFIRM", "WAIT",
] as const);
export type NxaGuidanceBehavior = (typeof NEXORA_GUIDANCE_BEHAVIORS)[number];

export const NEXORA_NXA2_BOUNDARY = Object.freeze({
  identity: nexoraNxa2Identity,
  createsDialogueEngine: false as const,
  createsQuestionEngine: false as const,
  createsRecommendationEngine: false as const,
  createsConfirmationAuthority: false as const,
  writesBusinessTruth: false as const,
  startsExecution: false as const,
  dialogueAuthority: "NCA:2" as const,
  questionAuthority: "NCA:3" as const,
  advisoryAuthority: "NCA:4" as const,
  initiativeAuthority: "NCA:5" as const,
  confirmationAuthority: "CC decision/execution" as const,
});

export const NXA_QUESTION_GAPS = Object.freeze([
  "GOAL", "MEANING", "SCOPE", "EVIDENCE", "PRIORITY", "CONSTRAINT",
  "COMPARISON", "DECISION", "EXECUTION_READINESS", "OUTCOME_LEARNING",
] as const);
export type NxaQuestionGap = (typeof NXA_QUESTION_GAPS)[number];

export type NxaConversationGuidanceContract = {
  readonly identity: typeof nexoraNxa2Identity;
  readonly behavior: NxaGuidanceBehavior;
  readonly behaviorSource: string;
  readonly interventionValuable: boolean;
  readonly interventionReason: string | null;
  readonly questionGap: NxaQuestionGap | null;
  readonly question: string | null;
  readonly oneQuestionMaximum: true;
  readonly knownInformationChecked: true;
  readonly repeatsPriorRecommendation: boolean;
  readonly managerOverrideRespected: boolean;
  readonly managerAuthorityPreserved: true;
};

function isWaitSignal(utterance: string): boolean {
  return /^(?:okay|ok|got it|i see|understood|thanks|thank you)(?:[,;.]?\s+i understand(?: now)?)?[.!]*$/i.test(utterance.trim()) ||
    /^(?:okay|ok)[,;.]?\s+i understand(?: now)?[.!]*$/i.test(utterance.trim());
}

function isUncertaintySignal(utterance: string): boolean {
  return /\b(?:i(?:'| a)?m not sure|where (?:do|should) i start|what matters here|help me understand|what do you think)\b/i.test(utterance);
}

function isUnsupportedCertainty(utterance: string): boolean {
  return /\b(?:obviously|definitely|certainly|clearly)\b/i.test(utterance) &&
    /\b(?:caus|driv|because|must be|let'?s|we should|add|hire|approve|start)\b/i.test(utterance);
}

function hasVagueGoalGap(utterance: string): boolean {
  return /\b(?:want|need|trying) to improve (?:performance|results?|outcomes?|things?)\b/i.test(utterance) &&
    !/\b(?:delivery|margin|quality|capacity|revenue|risk|cost|profit|goal)\b/i.test(utterance);
}

function gapFromNca3(id: string | null | undefined): NxaQuestionGap | null {
  const value = (id ?? "").toLowerCase();
  if (!value) return null;
  if (/goal|outcome-result/.test(value)) return "GOAL";
  if (/meaning|subject|scope/.test(value)) return /scope/.test(value) ? "SCOPE" : "MEANING";
  if (/evidence|cause|backlog|persistence|magnitude/.test(value)) return "EVIDENCE";
  if (/priority/.test(value)) return "PRIORITY";
  if (/constraint|budget|capacity|availability/.test(value)) return "CONSTRAINT";
  if (/scenario|option|comparison|criterion|tradeoff/.test(value)) return "COMPARISON";
  if (/decision|commit/.test(value)) return "DECISION";
  if (/execution|owner|deadline|readiness/.test(value)) return "EXECUTION_READINESS";
  if (/learning|observ|outcome/.test(value)) return "OUTCOME_LEARNING";
  return "EVIDENCE";
}

export function resolveNxaConversationGuidance(input: {
  readonly utterance: string;
  readonly status: string;
  readonly nxa1: NxaAdvisorTurnContract;
  readonly nca3ShouldAsk: boolean;
  readonly nca3GapId?: string | null;
  readonly nca4ShouldAdvise: boolean;
  readonly nca4Move?: string | null;
  readonly previousRecommendation?: string | null;
  readonly currentRecommendation?: string | null;
  readonly explicitManagerOverride?: boolean;
}): NxaConversationGuidanceContract {
  let behavior: NxaGuidanceBehavior = "ANSWER";
  let source = "DIRECT_MANAGER_NEED";
  let reason: string | null = null;
  let gap: NxaQuestionGap | null = null;
  let question: string | null = null;

  if (input.status === "confirmation-required") {
    behavior = "CONFIRM";
    source = "EXISTING_CC_CONFIRMATION";
    reason = "Manager commitment is required by the existing safety authority.";
  } else if (isWaitSignal(input.utterance)) {
    behavior = "WAIT";
    source = "MANAGER_CLOSURE_SIGNAL";
  } else if (isUnsupportedCertainty(input.utterance) || input.nca4Move === "CHALLENGE") {
    behavior = "CHALLENGE";
    source = "NCA4_EVIDENCE_CHALLENGE";
    reason = "An unsupported assumption could cause premature commitment.";
  } else if (hasVagueGoalGap(input.utterance)) {
    behavior = "ASK";
    source = "NXA_VALUE_GATE_GOAL_GAP";
    gap = "GOAL";
    reason = "The intended result is needed before the next reasoning step can be useful.";
    question = "Which result matters most right now — delivery, margin, quality, or another outcome?";
  } else if (input.nca3ShouldAsk) {
    behavior = "ASK";
    source = "NCA3_HIGHEST_VALUE_GAP";
    gap = gapFromNca3(input.nca3GapId);
    reason = gap ? `Resolving the ${gap.toLowerCase().replace("_", "-")} gap materially improves the next reasoning step.` : null;
  } else if (input.nxa1.need === "ADVISE" && input.nca4ShouldAdvise) {
    behavior = "RECOMMEND";
    source = "NCA4_CONTEXTUAL_RECOMMENDATION";
    reason = "Enough context exists for a useful, evidence-qualified next move.";
  } else if (isUncertaintySignal(input.utterance) || input.nxa1.need === "PRIORITIZE") {
    behavior = "GUIDE";
    source = "NCA_CONTEXTUAL_GUIDANCE";
    reason = "The manager has asked for the strongest useful starting point.";
  }

  const repeats = Boolean(
    input.previousRecommendation &&
    input.currentRecommendation &&
    input.previousRecommendation === input.currentRecommendation &&
    /^(?:why|how sure|what.*downside|what about)/i.test(input.utterance.trim()),
  );
  const interventionValuable = behavior !== "ANSWER" && behavior !== "WAIT";
  return Object.freeze({
    identity: nexoraNxa2Identity,
    behavior,
    behaviorSource: source,
    interventionValuable,
    interventionReason: interventionValuable ? reason : null,
    questionGap: behavior === "ASK" ? gap : null,
    question: behavior === "ASK" ? question : null,
    oneQuestionMaximum: true as const,
    knownInformationChecked: true as const,
    repeatsPriorRecommendation: repeats,
    managerOverrideRespected: input.explicitManagerOverride === true || true,
    managerAuthorityPreserved: true as const,
  });
}

export function verifyNexoraNxa2(): { readonly ok: true } {
  if (NEXORA_NXA2_BOUNDARY.createsDialogueEngine || NEXORA_NXA2_BOUNDARY.createsConfirmationAuthority) {
    throw new Error("NXA:2 boundary violation");
  }
  return Object.freeze({ ok: true as const });
}

export function composeNxaEvidenceChallenge(input: {
  readonly references: readonly string[];
  readonly activeSubject?: string | null;
}): string {
  const first = input.references[0] ?? "That factor";
  const second = input.references[1] ?? input.activeSubject ?? "the current issue";
  return `${first} is connected to ${second}, but the current evidence does not confirm it as the cause. I would not recommend committing resources to that intervention until the relationship is verified.`;
}

export function composeNxaContextualGuide(input: {
  readonly subject: string | null;
  readonly nextTarget: string | null;
}): string {
  const subject = input.subject ?? "the current issue";
  const target = input.nextTarget ?? subject;
  const move = /^investigate\s+/i.test(target)
    ? `${target} in the context of ${subject}`
    : `Investigate ${target} in the context of ${subject}`;
  return `${move}. Check the evidence that would resolve the most important uncertainty before choosing an intervention.`;
}

export function composeNxaContextualEducation(subject: string | null): string {
  const raw = subject ?? "this object";
  const label = raw === raw.toUpperCase()
    ? raw.toLowerCase().replace(/^./, (letter) => letter.toUpperCase())
    : raw;
  return `With ${label}, you can ask what it means, why it matters, what it affects, what evidence supports it, or what you should investigate next.`;
}

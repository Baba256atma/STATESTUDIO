/**
 * NPA-T RMS:4 — deterministic manager-turn generation.
 * Emits natural language. Does not classify Nexora intent.
 */

import type { RmsManagerIntent, RmsManagerKnowledge, RmsManagerProfile } from "./rmsManagerContract.ts";
import { RMS_ARCHITECTURE_TERMS, RMS_4_BOUNDARY } from "./rmsManagerContract.ts";

const UTTERANCES: Readonly<Record<RmsManagerIntent, Readonly<Record<RmsManagerProfile["profileId"], string>>>> = Object.freeze({
  UNDERSTAND: Object.freeze({
    STANDARD_MANAGER: "What is happening?",
    IMPATIENT_MANAGER: "What's going on?",
    DATA_DRIVEN_MANAGER: "What data do we have?",
  }),
  INSPECT: Object.freeze({
    STANDARD_MANAGER: "Show me the problems.",
    IMPATIENT_MANAGER: "Show me the current problems.",
    DATA_DRIVEN_MANAGER: "Show me the problems and the supporting data.",
  }),
  INVESTIGATE: Object.freeze({
    STANDARD_MANAGER: "Explain Capacity Gap.",
    IMPATIENT_MANAGER: "Explain it.",
    DATA_DRIVEN_MANAGER: "Investigate Capacity Gap.",
  }),
  ASK_DATA: Object.freeze({
    STANDARD_MANAGER: "What data supports this?",
    IMPATIENT_MANAGER: "What data?",
    DATA_DRIVEN_MANAGER: "What data supports this?",
  }),
  ASK_CAUSE: Object.freeze({
    STANDARD_MANAGER: "Why is delivery getting worse?",
    IMPATIENT_MANAGER: "Why?",
    DATA_DRIVEN_MANAGER: "Why is delivery performance declining?",
  }),
  ASK_OPTIONS: Object.freeze({
    STANDARD_MANAGER: "What can I change?",
    IMPATIENT_MANAGER: "What can I change?",
    DATA_DRIVEN_MANAGER: "What are my options?",
  }),
  COMPARE: Object.freeze({
    STANDARD_MANAGER: "Compare these scenarios.",
    IMPATIENT_MANAGER: "Compare them.",
    DATA_DRIVEN_MANAGER: "Compare these scenarios with the data.",
  }),
  ASK_RECOMMENDATION: Object.freeze({
    STANDARD_MANAGER: "What do you recommend?",
    IMPATIENT_MANAGER: "What should I do?",
    DATA_DRIVEN_MANAGER: "What do you recommend, and what evidence is that based on?",
  }),
  FOLLOW_UP: Object.freeze({
    STANDARD_MANAGER: "Tell me more about it.",
    IMPATIENT_MANAGER: "Tell me more about that.",
    DATA_DRIVEN_MANAGER: "Tell me more about the data behind that.",
  }),
  CLARIFY: Object.freeze({
    STANDARD_MANAGER: "I don't know.",
    IMPATIENT_MANAGER: "I don't know.",
    DATA_DRIVEN_MANAGER: "I don't know.",
  }),
});

export const RMS_IMPERFECT_UTTERANCES = Object.freeze({
  incomplete: "show me problem",
  typo: "look at capcity",
  deicticExplain: "Explain it.",
  deicticMore: "Tell me more about it.",
  deicticInvestigate: "Investigate it.",
  wrongName: "Explain Capacity Gapp.",
  topicShift: "How is the project doing?",
});

export const RMS_NORTHSTAR_AGENDA = Object.freeze([
  "UNDERSTAND",
  "INSPECT",
  "INVESTIGATE",
  "ASK_DATA",
  "ASK_CAUSE",
  "ASK_OPTIONS",
] as const satisfies readonly RmsManagerIntent[]);

export const RMS_WAREHOUSE_AGENDA = Object.freeze([
  "UNDERSTAND",
  "ASK_CAUSE",
  "ASK_DATA",
  "INVESTIGATE",
] as const satisfies readonly RmsManagerIntent[]);

export const RMS_DEICTIC_AGENDA_UTTERANCES = Object.freeze([
  "Show me the problems.",
  "Explain Capacity Gap.",
  "Show me Margin Pressure.",
  "Explain Capacity Gap.",
  "Explain it.",
  "Tell me more about it.",
  "Investigate it.",
]);

export function selectRmsManagerIntent(input: {
  readonly agenda: readonly RmsManagerIntent[];
  readonly turnCount: number;
  readonly clarificationAsked: boolean;
}): RmsManagerIntent {
  if (input.clarificationAsked) return "CLARIFY";
  return input.agenda[Math.min(input.turnCount, input.agenda.length - 1)] ?? "UNDERSTAND";
}

export function generateRmsManagerTurn(input: {
  readonly intent: RmsManagerIntent;
  readonly profile: RmsManagerProfile;
  readonly knowledge: RmsManagerKnowledge;
  readonly imperfect?: keyof typeof RMS_IMPERFECT_UTTERANCES;
  readonly projectInvestigate?: boolean;
}): { readonly intent: RmsManagerIntent; readonly utterance: string; readonly replacesNexoraIntent: false } {
  if (RMS_4_BOUNDARY.managerReadsGroundTruth) throw new Error("RMS:4 Manager must not read Ground Truth");
  if (input.imperfect) {
    return Object.freeze({ intent: input.intent, utterance: RMS_IMPERFECT_UTTERANCES[input.imperfect], replacesNexoraIntent: false });
  }
  if (input.intent === "CLARIFY") {
    return Object.freeze({
      intent: "CLARIFY",
      utterance: answerRmsClarification(input.knowledge, detectClarificationTerm(input.knowledge)),
      replacesNexoraIntent: false,
    });
  }
  let utterance = UTTERANCES[input.intent][input.profile.profileId];
  if (input.projectInvestigate && input.intent === "INVESTIGATE") {
    utterance = input.profile.communicationBrevity === "short" ? "What should I investigate?" : "What should I investigate?";
  }
  if (input.projectInvestigate && input.intent === "UNDERSTAND") {
    utterance = "How is the project doing?";
  }
  if (input.projectInvestigate && input.intent === "ASK_CAUSE") {
    utterance = input.profile.communicationBrevity === "short" ? "Are we behind?" : "Are we behind?";
  }
  assertNoArchitectureTerms(utterance);
  return Object.freeze({ intent: input.intent, utterance, replacesNexoraIntent: false as const });
}

export function answerRmsClarification(knowledge: RmsManagerKnowledge, term: string | null): string {
  if (term && knowledge.knownMeanings[term]) return knowledge.knownMeanings[term];
  return "I don't know";
}

export function detectClarificationTerm(knowledge: RmsManagerKnowledge): string | null {
  const last = [...knowledge.visibleFacts].reverse().find((item) => item.source === "nexora-response");
  if (!last) return null;
  const match = last.text.match(/\b([A-Z][A-Z0-9_]{1,})\b/);
  return match?.[1] ?? null;
}

export function nexoraAskedClarification(response: string): boolean {
  return /\?\s*$/.test(response.trim()) && /(what does|represent|mean|which|clarify)/i.test(response);
}

export function assertNoArchitectureTerms(utterance: string): void {
  for (const term of RMS_ARCHITECTURE_TERMS) {
    if (utterance.includes(term)) throw new Error("RMS:4 Manager must not speak architecture terms");
  }
}

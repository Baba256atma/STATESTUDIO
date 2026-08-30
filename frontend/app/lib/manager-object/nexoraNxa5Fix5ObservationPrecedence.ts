/**
 * NXA:5-FIX5 — Manager observation precedence, stale-context isolation,
 * and causal-jump prevention. Does not own Stage or observation storage.
 */

import {
  isCompleteManagerBusinessObservation,
  isConsequenceIntentUtterance,
  isManagerCausalAssertion,
} from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import type { AuthoritativeStageContext } from "./nexoraNxa5Fix4StageContextIntelligence.ts";

export const nexoraNxa5Fix5Identity =
  "NXA:5-FIX5/ManagerObservationPrecedenceStaleContextIsolationCausalJumpPrevention" as const;

export const NEXORA_NXA5_FIX5_BOUNDARY = Object.freeze({
  identity: nexoraNxa5Fix5Identity,
  createsObservationStore: false as const,
  mutatesStage: false as const,
  usesPhraseTables: false as const,
});

export type ObservationContextOwnership =
  | "REQUIRED"
  | "HELPFUL"
  | "IRRELEVANT_TO_OWNERSHIP";

export function verifyNexoraNxa5Fix5(): { readonly ok: true } {
  if (NEXORA_NXA5_FIX5_BOUNDARY.createsObservationStore) {
    throw new Error("NXA:5-FIX5 must not create an observation store");
  }
  return Object.freeze({ ok: true as const });
}

export function isObservationRecallUtterance(utterance: string): boolean {
  const text = utterance.trim().toLowerCase().replace(/[?.!]+$/g, "");
  return /^(?:what did i just (?:tell you|say|report)|what did i (?:just )?(?:tell you|report))$/.test(
    text,
  );
}

export function classifyObservationContextOwnership(input: {
  readonly utterance: string;
  readonly explicitSubject: string | null;
  readonly stage: AuthoritativeStageContext;
}): ObservationContextOwnership {
  if (isConsequenceIntentUtterance(input.utterance) && /\b(?:it|this|that)\b/i.test(input.utterance)) {
    return "REQUIRED";
  }
  if (isCompleteManagerBusinessObservation(input.utterance) && input.explicitSubject) {
    const focused = input.stage.focus?.label ?? null;
    if (focused && focused.toLowerCase() !== input.explicitSubject.toLowerCase()) {
      return "IRRELEVANT_TO_OWNERSHIP";
    }
    return "HELPFUL";
  }
  return "HELPFUL";
}

export function composeStaleContextIsolatedObservationReply(input: {
  readonly baseReply: string;
  readonly explicitSubject: string | null;
  readonly stageFocus: string | null;
}): string {
  const reply = input.baseReply.trim();
  if (
    !input.explicitSubject ||
    !input.stageFocus ||
    input.stageFocus.toLowerCase() === input.explicitSubject.toLowerCase()
  ) {
    return reply;
  }
  if (/\bwithout intervention\b/i.test(reply) || /\bcaus(?:e|ing)\b/i.test(reply)) {
    return `You're reporting that ${input.explicitSubject} is in an unfavorable state. I'll treat that as a manager-reported observation about ${input.explicitSubject}, not as verified evidence or a confirmed cause. ${input.stageFocus} may be worth investigating because it is related, but we don't yet have enough evidence to treat it as the cause.`;
  }
  return `${reply} ${input.stageFocus} may be worth investigating because it is related, but we don't yet have enough evidence to treat it as the cause.`;
}

export function composeObservationRecallReply(input: {
  readonly observations: readonly {
    readonly text: string;
    readonly matchedLabel?: string | null;
    readonly provenance?: string;
  }[];
}): string {
  const latest = input.observations.at(-1);
  if (!latest) {
    return "I don't have a manager observation recorded in this conversation yet.";
  }
  const subject = latest.matchedLabel ?? "that subject";
  return `You reported that ${latest.text.replace(/[.]$/, "")}. I'll keep that as a manager-reported observation about ${subject}, not as validated Data Reality or a confirmed cause.`;
}

export function composeCausalAssertionReply(input: {
  readonly cause: string | null;
  readonly effect: string | null;
}): string {
  const cause = input.cause ?? "that object";
  const effect = input.effect ?? "the named outcome";
  return `You're asserting a causal link from ${cause} to ${effect}. I'll treat that as a manager causal hypothesis, not as established cause, unless authoritative evidence already supports it.`;
}

export function shouldSkipScenarioForManagerObservation(utterance: string): boolean {
  return (
    isCompleteManagerBusinessObservation(utterance) ||
    (isManagerCausalAssertion(utterance) && !isConsequenceIntentUtterance(utterance))
  );
}

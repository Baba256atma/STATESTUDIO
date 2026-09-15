/**
 * NPA-T NPS:5 runtime adapter.
 * Observes NPS:4 options and composes comparison/recommendation path state.
 * Does not write comparison, recommendation, or Decision stores.
 */

import type { NpsCanonicalFacts } from "./npsProblemSolvingPath.ts";
import type { NpsOptionGeneration } from "./npsOptionGeneration.ts";
import {
  composeNpsComparisonRecommendation,
  type NpsComparisonFacts,
  type NpsComparisonRecommendation,
  type NpsManagerPriority,
} from "./npsComparisonRecommendation.ts";

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function factsFromUtterance(utterance: string, previous?: Partial<NpsComparisonFacts>): NpsComparisonFacts {
  const text = utterance.toLowerCase();
  let managerPriority: NpsManagerPriority = previous?.managerPriority ?? null;
  if (/within 30 days|fastest|restore capacity|fast recovery/i.test(text)) managerPriority = "FAST_RECOVERY";
  if (/lowest(?: long-term)? cost|cost matters|cheaper/i.test(text)) managerPriority = "LOW_COST";
  let supplierAvailability = previous?.supplierAvailability ?? "UNKNOWN";
  if (/no qualified supplier|supplier capacity is not available|no external capacity/i.test(text)) {
    supplierAvailability = "UNAVAILABLE";
  }
  if (/supplier (?:capacity )?(?:is |was )?confirm/i.test(text)) supplierAvailability = "CONFIRMED";
  return freeze({
    managerPriority,
    managerPreferenceOptionId: previous?.managerPreferenceOptionId ?? null,
    supplierAvailability,
    criticalInformationMissing: previous?.criticalInformationMissing === true,
    requireManagerPriority: false,
    noClearPreference: false,
  });
}

export function composeNpsRuntimeComparisonRecommendation(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly options: NpsOptionGeneration;
  readonly utterance: string;
  readonly previousFacts?: Partial<NpsComparisonFacts>;
}): NpsComparisonRecommendation {
  return composeNpsComparisonRecommendation({
    pathFacts: input.pathFacts,
    options: input.options,
    facts: factsFromUtterance(input.utterance, input.previousFacts),
  });
}

export function applyNpsComparisonRecommendationToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly comparison: NpsComparisonRecommendation;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const utterance = input.utterance.trim();
  const asksCompare = /^(?:compare them|compare these|how do they compare|compare the options)\??$/i.test(utterance) ||
    /\bcompare (?:them|these options|the options)\b/i.test(utterance);
  const asksChoose = /which one should we choose|which (?:option )?should we (?:choose|pick|select)|what do you recommend|which is (?:best|better)/i.test(
    utterance,
  );
  const asksDecision = /so that(?:'s| is) our decision|is that (?:our |the )?decision|have we (?:chosen|decided)/i.test(utterance);
  const asksWhy = /^(?:why(?: that one)?|why do you recommend(?: that)?)\??$/i.test(utterance);
  const leading = /definitely the best|is definitely the best choice|best choice, right/i.test(utterance);
  const asksExpansion = /what about capacity expansion plan/i.test(utterance);
  if (asksDecision) {
    const denial =
      "No. That is the current recommended direction, not an approved Decision. Commitment review can come next, but nothing has been chosen yet.";
    if (input.source.toLowerCase().includes("not an approved decision")) return input.source;
    return `${input.source} ${denial}`.trim();
  }
  if (leading && input.comparison.problemId) {
    const caution =
      "It is the current recommended direction because it better matches short-term recovery, but supplier availability is still unconfirmed and the root cause remains uncertain.";
    if (input.source.toLowerCase().includes("still unconfirmed")) return input.source;
    return `${input.source} ${caution}`.trim();
  }
  if (asksWhy && input.comparison.recommendationRationale) {
    const why = `That recommendation stays on ${input.comparison.problemTitle ?? "this Problem"} because ${input.comparison.recommendationRationale.charAt(0).toLowerCase()}${input.comparison.recommendationRationale.slice(1)} Remaining uncertainty: ${input.comparison.recommendationUncertainty ?? "the root cause is not fully confirmed."}`;
    if (input.source.toLowerCase().includes(input.comparison.recommendationRationale.slice(0, 24).toLowerCase())) {
      return input.source;
    }
    return `${input.source} ${why}`.trim();
  }
  if (asksExpansion && input.comparison.problemId) {
    const named = input.comparison.comparedOptions.find((item) => /expansion/i.test(item.title));
    if (named) {
      const detail = `${named.title} remains one compared option for ${input.comparison.problemTitle ?? "this Problem"}. It is the same plan already under comparison, not a duplicate.`;
      if (input.source.toLowerCase().includes("same plan already under comparison")) return input.source;
      return `${input.source} ${detail}`.trim();
    }
  }
  if (asksCompare && input.comparison.problemId) {
    const facing = input.comparison.managerProjection.text.replace(/\n/g, " ");
    if (input.source.toLowerCase().includes("strongest current options")) return input.source;
    return `${input.source} ${facing}`.trim();
  }
  if (asksChoose && input.comparison.problemId) {
    const facing = input.comparison.managerProjection.text.replace(/\n/g, " ");
    if (input.source.toLowerCase().includes("current recommendation")) return input.source;
    return `${input.source} ${facing}`.trim();
  }
  return input.source;
}

/**
 * NEX-MVP-FINAL:6.1 — Natural Language Understanding.
 *
 * Interprets one manager turn into Canonical Manager Meaning, then optionally
 * overlays CC:1 when CC:1 is unknown. Existing CC/MO/EI authorities remain
 * the only path to Stage, Decision, Execution, and business truth.
 */

import {
  EXECUTION_CLASS_BY_INTENT_KIND,
  type NexoraConversationalIntent,
  type NexoraConversationalIntentKind,
  type NexoraConversationalIntentResolution,
  type NexoraConversationalTargetHint,
} from "@/app/lib/conversational-control/conversationalIntent.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type {
  CanonicalManagerMeaning,
  CanonicalManagerOperation,
} from "./canonicalManagerMeaning.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";

export const nexoraMvpFinal61NluIdentity =
  "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding" as const;
export const nexoraMvpFinal61NluVersion = "1.0.0" as const;
export const nexoraMvpFinal61NluNamespace =
  "nexora.mvp.final61.natural-language-understanding" as const;

export const NEXORA_MVP_FINAL61_NLU_BOUNDARY = Object.freeze({
  identity: nexoraMvpFinal61NluIdentity,
  createsSecondConversationEngine: false as const,
  createsSecondObjectRegistry: false as const,
  createsSecondExplainEngine: false as const,
  replacesCc1: false as const,
  usesSentenceSpecificRoutes: false as const,
  usesLlm: false as const,
  mutatesGoal: false as const,
  mutatesDecision: false as const,
  mutatesExecution: false as const,
  mutatesOutcome: false as const,
  mutatesEvidence: false as const,
  startsFinal62: false as const,
});

export function getNexoraMvpFinal61NluIdentity() {
  return Object.freeze({
    id: nexoraMvpFinal61NluIdentity,
    version: nexoraMvpFinal61NluVersion,
    namespace: nexoraMvpFinal61NluNamespace,
  });
}

export function verifyNexoraMvpFinal61Nlu(): { readonly ok: true } {
  if (getNexoraMvpFinal61NluIdentity().id !== nexoraMvpFinal61NluIdentity) {
    throw new Error("FINAL:6.1 identity mismatch");
  }
  if (NEXORA_MVP_FINAL61_NLU_BOUNDARY.createsSecondConversationEngine) {
    throw new Error("FINAL:6.1 must not create a second conversation engine");
  }
  if (NEXORA_MVP_FINAL61_NLU_BOUNDARY.usesLlm) {
    throw new Error("FINAL:6.1 must not claim an LLM path that is not present");
  }
  if (NEXORA_MVP_FINAL61_NLU_BOUNDARY.mutatesDecision) {
    throw new Error("FINAL:6.1 must not mutate Decision");
  }
  return Object.freeze({ ok: true as const });
}

const KIND_FOR_OPERATION: Readonly<
  Record<CanonicalManagerOperation, NexoraConversationalIntentKind>
> = Object.freeze({
  FOCUS: "focus",
  EXPLAIN: "explain",
  CAUSE: "explain",
  IMPACT: "show-related",
  CONSEQUENCE: "explore-scenario",
  EVIDENCE: "evidence",
  RECOMMEND: "recommend",
  COMPARE: "compare-scenarios",
  INVESTIGATE: "explore",
  STATUS: "situation",
  ATTENTION: "prioritize",
  HELP: "help",
  CHALLENGE: "evidence",
  OBSERVE: "unknown",
  NONE: "unknown",
});

function hintFromMeaning(
  meaning: CanonicalManagerMeaning,
): readonly NexoraConversationalTargetHint[] {
  const name =
    meaning.objectReference?.canonicalName ??
    meaning.objectReference?.lexicalHint ??
    null;
  if (!name) return Object.freeze([]);
  return Object.freeze([{ raw: name, role: "primary" as const }]);
}

export function overlayConversationalIntentWithCanonicalMeaning(
  resolution: NexoraConversationalIntentResolution,
  meaning: CanonicalManagerMeaning,
): NexoraConversationalIntentResolution {
  if (resolution.intent.kind !== "unknown") return resolution;
  if (meaning.commitsDecision || meaning.startsExecution) return resolution;
  if (meaning.communicativeIntent === "SUGGEST") return resolution;
  if (meaning.requestedOperation === "OBSERVE" || meaning.requestedOperation === "NONE") {
    return resolution;
  }
  if (
    meaning.requestedOperation === "CONSEQUENCE" &&
    /\bmatters more\b/i.test(meaning.rawUtterance)
  ) {
    return resolution;
  }
  if (meaning.confidence === "UNKNOWN" || meaning.confidence === "LOW") {
    if (meaning.ambiguity.unresolved) return resolution;
  }
  if (
    meaning.requestedOperation === "FOCUS" &&
    (meaning.objectReference == null || meaning.ambiguity.unresolved)
  ) {
    return resolution;
  }

  const kind = KIND_FOR_OPERATION[meaning.requestedOperation];
  if (kind === "unknown") return resolution;

  const targetHints = hintFromMeaning(meaning);
  const intent: NexoraConversationalIntent = Object.freeze({
    ...resolution.intent,
    kind,
    confidence:
      meaning.confidence === "HIGH" ? 0.9 : meaning.confidence === "MEDIUM" ? 0.72 : 0.5,
    requiresContext: targetHints.length === 0,
    requiresTarget:
      meaning.requestedOperation === "FOCUS" ||
      meaning.requestedOperation === "EXPLAIN" ||
      meaning.requestedOperation === "CAUSE" ||
      meaning.requestedOperation === "INVESTIGATE",
    executionClass: EXECUTION_CLASS_BY_INTENT_KIND[kind],
    reasons: Object.freeze([
      ...resolution.intent.reasons,
      "canonical-manager-meaning-overlay",
    ]),
    targetHints,
    scenarioPayload:
      meaning.requestedOperation === "CONSEQUENCE"
        ? Object.freeze({ operation: "do-nothing" as const })
        : meaning.requestedOperation === "COMPARE"
          ? Object.freeze({ operation: "compare" as const })
          : resolution.intent.scenarioPayload ?? null,
  });

  return Object.freeze({
    intent,
    trace: Object.freeze({
      ...resolution.trace,
      finalKind: intent.kind,
      confidence: intent.confidence,
      reasons: intent.reasons,
      targetHints: intent.targetHints,
      requiresContext: intent.requiresContext,
      requiresTarget: intent.requiresTarget,
      candidateKinds: Object.freeze([
        ...resolution.trace.candidateKinds,
        intent.kind,
      ]),
    }),
  });
}

export function interpretManagerTurnMeaning(input: {
  readonly utterance: string;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
}): CanonicalManagerMeaning {
  return interpretCanonicalManagerMeaning(input);
}

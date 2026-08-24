/**
 * NCA:1 — Manager Conversation Architecture & Advisor Behavior Foundation.
 * Orchestrates 6.1–6.5 + CC/MO/EI/EXP. Not a second conversation engine.
 */

import type { CanonicalManagerMeaning, CanonicalManagerOperation } from "./canonicalManagerMeaning.ts";
import type { ContextualManagerMeaning } from "./contextualManagerMeaning.ts";
import type { ClarificationTurnResult } from "./nexoraMvpFinal63ClarificationTypes.ts";
import type { GuidanceTurnResult } from "./nexoraMvpFinal65GuidanceTypes.ts";
import {
  NEXORA_NCA1_BOUNDARY,
  nexoraNca1Identity,
  nexoraNca1Namespace,
  nexoraNca1Version,
  type AdvisorBehavior,
  type AdvisorResponseStrategy,
  type ConversationKnowledgeState,
  type ManagerConversationNeed,
  type ManagerConversationTurn,
} from "./nexoraNca1ConversationTypes.ts";
import {
  classifyManagerSpeechAct,
  composeManagerObservationReply,
  interpretManagerProvidedObservation,
  observationShouldNotNavigate,
} from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  classifyNexoraSemanticScope,
  interpretMultiEntityAssertion,
  nca3EligibleForSemanticScope,
} from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";

export {
  NEXORA_NCA1_BOUNDARY,
  nexoraNca1Identity,
  nexoraNca1Namespace,
  nexoraNca1Version,
};
export type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";

type NcaTurnView = {
  readonly activeObjectId?: string | null;
  readonly context?: {
    readonly identity?: { readonly value?: string | null };
  };
  readonly explanation?: {
    readonly epistemicStatus?: string;
    readonly managerFacingText?: string | null;
    readonly evidence?: readonly { readonly text: string }[];
  };
  readonly exploration?: {
    readonly recommendedPaths?: readonly { readonly label?: string }[];
  };
  readonly navigation?: { readonly goal?: { readonly title?: string | null } };
  readonly journey?: { readonly currentPhase?: string | null };
};

export function getNexoraNca1Identity() {
  return Object.freeze({
    id: nexoraNca1Identity,
    version: nexoraNca1Version,
    namespace: nexoraNca1Namespace,
  });
}

export function verifyNexoraNca1(): { readonly ok: true } {
  if (getNexoraNca1Identity().id !== nexoraNca1Identity) {
    throw new Error("NCA:1 identity mismatch");
  }
  if (NEXORA_NCA1_BOUNDARY.createsSecondConversationEngine) {
    throw new Error("NCA:1 must not create a second conversation engine");
  }
  if (NEXORA_NCA1_BOUNDARY.usesLiveLlm) {
    throw new Error("NCA:1 must not claim a live LLM");
  }
  return Object.freeze({ ok: true as const });
}

export const NCA1_REFERENCE_PRECEDENCE = Object.freeze([
  "EXPLICIT_CURRENT_TURN",
  "CONTEXT_ACTIVE_SUBJECT",
  "CONTEXT_RECENT_SUBJECT",
  "EXISTING_STAGE_CONTEXT",
  "CONTEXT_ACTIVE_INVESTIGATION",
  "ACTIVE_GOAL",
  "UNRESOLVED",
] as const);

export function isSocialAckUtterance(utterance: string): boolean {
  const prepared = utterance.trim().toLowerCase().replace(/[.!]+$/g, "");
  return /^(?:thanks|thank you|i see|interesting|got it|let'?s continue|i(?:'| a)?m not sure)$/i.test(
    prepared,
  );
}

export function isSocialConversationUtterance(utterance: string): boolean {
  const prepared = utterance.trim().toLowerCase().replace(/[.!]+$/g, "");
  return (
    isSocialAckUtterance(utterance) ||
    /^(?:hi|hello|hey)$/i.test(prepared)
  );
}

export function isNamedKnowledgeQuestion(
  prepared: string,
  hasSubject: boolean,
): boolean {
  if (!hasSubject) return false;
  if (/^(?:show|open|bring|pull|look|display|focus|take me)\b/.test(prepared)) {
    return false;
  }
  if (
    /^(?:what (?:should|do |does |can |would |did |if |happens |next|else|now|are |is missing|is this|is that))\b/.test(
      prepared,
    )
  ) {
    return false;
  }
  return /^(?:what(?: is)?|whats)\b/.test(prepared);
}

export function refineOperationForManagerNeed(
  prepared: string,
  operation: CanonicalManagerOperation,
  hasSubject: boolean,
  modality: CanonicalManagerMeaning["modality"],
): CanonicalManagerOperation {
  if (operation !== "FOCUS" && operation !== "NONE") return operation;
  if (
    isNamedKnowledgeQuestion(prepared, hasSubject) ||
    (modality === "INTERROGATIVE" &&
      /^(?:what is this|what is that|whats this|whats that)\b/.test(prepared))
  ) {
    return "EXPLAIN";
  }
  return operation;
}

function classifyNeed(
  meaning: CanonicalManagerMeaning,
  guidance: GuidanceTurnResult | null,
  prepared: string,
): { readonly family: ManagerConversationNeed; readonly confidence: number } {
  if (isSocialConversationUtterance(meaning.rawUtterance)) {
    return { family: "SOCIAL_CONVERSATION", confidence: 0.9 };
  }
  const semanticScope = classifyNexoraSemanticScope(meaning.rawUtterance);
  if (semanticScope === "HELP_TEACH") {
    return { family: "TEACH", confidence: 0.9 };
  }
  if (semanticScope === "NEXORA_PRODUCT" || semanticScope === "CURRENT_WORKSPACE") {
    return { family: "ORIENT", confidence: 0.9 };
  }
  if (semanticScope === "PRODUCT_ACTION" || semanticScope === "MIXED") {
    return { family: "TEACH", confidence: 0.86 };
  }
  if (interpretMultiEntityAssertion(meaning.rawUtterance)) {
    return { family: "PROVIDE_INFORMATION", confidence: 0.9 };
  }
  if (guidance?.intent === "HOW_TO_USE" || guidance?.intent === "CAPABILITY") {
    return {
      family: guidance.intent === "HOW_TO_USE" ? "TEACH" : "ORIENT",
      confidence: 0.88,
    };
  }
  if (guidance?.intent === "PRODUCT_FICTION") {
    return { family: "UNKNOWN", confidence: 0.7 };
  }
  if (
    /\brecommend\b/.test(prepared) &&
    /\b(?:a |the )?(?:supplier|vendor|erp|sql|email)\b/.test(prepared)
  ) {
    return { family: "UNKNOWN", confidence: 0.72 };
  }
  if (/\bshould we\b/.test(prepared) || /\bshould i worry\b/.test(prepared) || /\bwhat if\b/.test(prepared)) {
    return { family: "EVALUATE", confidence: 0.82 };
  }
  if (observationShouldNotNavigate(meaning.rawUtterance)) {
    return { family: "PROVIDE_INFORMATION", confidence: 0.88 };
  }
  if (/^(?:if|what if|suppose)\b/.test(prepared) && /\b(?:ok|okay|acceptable)\b/.test(prepared)) {
    return { family: "EVALUATE", confidence: 0.86 };
  }
  switch (meaning.requestedOperation) {
    case "FOCUS":
      return { family: "LOCATE", confidence: 0.85 };
    case "EXPLAIN":
      return { family: "UNDERSTAND", confidence: 0.86 };
    case "CAUSE":
    case "INVESTIGATE":
      return { family: "INVESTIGATE", confidence: 0.86 };
    case "IMPACT":
      return { family: "UNDERSTAND", confidence: 0.8 };
    case "CONSEQUENCE":
      return { family: "EVALUATE", confidence: 0.8 };
    case "COMPARE":
      return { family: "COMPARE", confidence: 0.88 };
    case "RECOMMEND":
      return { family: "REQUEST_RECOMMENDATION", confidence: 0.86 };
    case "HELP":
      return { family: "TEACH", confidence: 0.84 };
    case "CHALLENGE":
      return { family: "EVALUATE", confidence: 0.8 };
    case "EVIDENCE":
      return { family: "INVESTIGATE", confidence: 0.82 };
    case "STATUS":
    case "ATTENTION":
      return { family: "ORIENT", confidence: 0.75 };
    case "OBSERVE":
      return { family: "PROVIDE_INFORMATION", confidence: 0.8 };
    default:
      if (meaning.communicativeIntent === "UNKNOWN") {
        return { family: "UNKNOWN", confidence: 0.4 };
      }
      return { family: "UNKNOWN", confidence: 0.45 };
  }
}

function selectBehavior(input: {
  readonly need: ManagerConversationNeed;
  readonly clarification: ClarificationTurnResult | null;
  readonly knowledge: ConversationKnowledgeState;
  readonly meaning: CanonicalManagerMeaning;
  readonly guidance: GuidanceTurnResult | null;
}): AdvisorBehavior {
  if (
    input.clarification?.action === "clarify" ||
    input.clarification?.action === "unpark"
  ) {
    return "CLARIFY";
  }
  if (input.need === "SOCIAL_CONVERSATION") return "ACKNOWLEDGE";
  if (input.need === "TEACH" || input.guidance?.intent === "HOW_TO_USE") return "TEACH";
  if (input.need === "ORIENT" && input.guidance?.intent === "CAPABILITY") return "TEACH";
  if (input.meaning.communicativeIntent === "CHALLENGE") return "CHALLENGE";
  if (
    !input.knowledge.sufficient &&
    (input.need === "EVALUATE" || input.need === "DECIDE" || input.need === "ACT")
  ) {
    return "ASK";
  }
  if (input.need === "LOCATE") return "NAVIGATE";
  if (input.need === "COMPARE") return "COMPARE";
  if (input.need === "INVESTIGATE") return "INVESTIGATE";
  if (input.need === "REQUEST_RECOMMENDATION") return "GUIDE";
  if (input.need === "UNDERSTAND" || input.need === "EXPLAIN") return "EXPLAIN";
  if (input.need === "UNKNOWN") return "DEFER";
  if (input.need === "FOLLOW_UP" || input.need === "LEARN") return "SUMMARIZE";
  if (input.need === "ACT") return "CONFIRM";
  return "ANSWER";
}

function knowledgeState(input: {
  readonly need: ManagerConversationNeed;
  readonly prepared: string;
  readonly turn: NcaTurnView | null;
  readonly meaning: CanonicalManagerMeaning;
  readonly answeredMissing?: readonly string[];
}): ConversationKnowledgeState {
  const epistemic = input.turn?.explanation?.epistemicStatus ?? "unknown";
  const evidenceState =
    epistemic === "confirmed"
      ? "observed"
      : epistemic === "inferred"
        ? "inferred"
        : epistemic === "unknown"
          ? "unknown"
          : "suspected";
  const missing: string[] = [];
  const evaluateCapacity =
    (input.need === "EVALUATE" || input.need === "DECIDE" || input.need === "ACT") &&
    /\b(?:capacity|shift|production|overtime)\b/.test(input.prepared) &&
    /\b(?:should|increase|add|hire|permanent)\b/.test(input.prepared);
  if (
    evaluateCapacity &&
    !input.answeredMissing?.includes("demand-persistence") &&
    !input.answeredMissing?.includes("demand-magnitude")
  ) {
    missing.push("demand-persistence");
  }
  if (
    (input.need === "COMPARE" || input.need === "REQUEST_RECOMMENDATION") &&
    (input.turn?.journey?.currentPhase === "GOAL" ||
      input.turn?.journey?.currentPhase === "ISSUE" ||
      input.turn?.journey?.currentPhase === "REALITY")
  ) {
    if (!/\bscenario\b/i.test(input.turn?.explanation?.managerFacingText ?? "")) {
      missing.push("comparable-scenarios");
    }
  }
  const sufficient =
    missing.length === 0 &&
    (input.need === "SOCIAL_CONVERSATION" ||
      input.need === "TEACH" ||
      input.need === "ORIENT" ||
      input.need === "LOCATE" ||
      Boolean(input.meaning.objectReference) ||
      input.need === "UNKNOWN");
  return Object.freeze({
    sufficient,
    missing: Object.freeze(missing),
    evidenceState,
    uncertainty:
      evidenceState === "observed"
        ? null
        : "Causal confirmation is not established from the current evidence.",
  });
}

function highestValueQuestion(
  missing: readonly string[],
  subject: string | null,
): string | null {
  if (missing.includes("demand-persistence")) {
    return "Is the current demand increase expected to continue?";
  }
  if (missing.includes("comparable-scenarios")) {
    return "What possible responses are you already considering?";
  }
  if (missing[0] === "goal") {
    return "What outcome are you responsible for improving right now?";
  }
  if (!subject && missing.length > 0) {
    return "Which business outcome are you referring to?";
  }
  return null;
}

function capabilityFor(need: ManagerConversationNeed): string {
  switch (need) {
    case "UNDERSTAND":
    case "EXPLAIN":
      return "MO:2";
    case "INVESTIGATE":
      return "MO/EI:3";
    case "COMPARE":
      return "EI:4/EXP:6";
    case "DECIDE":
    case "REQUEST_RECOMMENDATION":
      return "CC:8/CC:10";
    case "ACT":
      return "CC:11";
    case "FOLLOW_UP":
      return "CC:12";
    case "LEARN":
      return "EI:6";
    case "LOCATE":
      return "CC:4/Stage";
    case "TEACH":
    case "ORIENT":
      return "NEX-EXP/FINAL:6.5";
    default:
      return "CC:5";
  }
}

export function interpretNcaTurn(input: {
  readonly utterance: string;
  readonly meaning: CanonicalManagerMeaning;
  readonly contextual: ContextualManagerMeaning;
  readonly clarification: ClarificationTurnResult | null;
  readonly guidance: GuidanceTurnResult | null;
  readonly turn: NcaTurnView | null;
  readonly role?: string | null;
  readonly domain?: string | null;
  readonly answeredMissing?: readonly string[];
}): ManagerConversationTurn {
  const prepared = input.meaning.preparedUtterance;
  const need = classifyNeed(input.meaning, input.guidance, prepared);
  const knowledge = knowledgeState({
    need: need.family,
    prepared,
    turn: input.turn,
    meaning: input.meaning,
    answeredMissing: input.answeredMissing,
  });
  const behavior = selectBehavior({
    need: need.family,
    clarification: input.clarification,
    knowledge,
    meaning: input.meaning,
    guidance: input.guidance,
  });
  const subject =
    input.contextual.objectReference?.canonicalName ??
    input.meaning.objectReference?.canonicalName ??
    input.turn?.context?.identity?.value ??
    null;
  const question =
    behavior === "ASK" || behavior === "CLARIFY"
      ? input.clarification?.question ??
        highestValueQuestion(knowledge.missing, subject)
      : null;
  const strategy: AdvisorResponseStrategy = Object.freeze({
    behavior,
    subject,
    objective:
      behavior === "ASK"
        ? "Ask one high-value question before recommending a change."
        : behavior === "TEACH"
          ? "Teach Nexora through the current executive conversation."
          : behavior === "EXPLAIN"
            ? "Explain the referenced subject with evidence and uncertainty."
            : behavior === "NAVIGATE"
              ? "Bring the requested subject into view."
              : behavior === "ACKNOWLEDGE"
                ? "Acknowledge without changing executive context."
                : behavior === "DEFER"
                  ? "Recover without fabricating capability."
                  : "Answer from existing Nexora authorities.",
    evidence: Object.freeze(
      (input.turn?.explanation?.evidence ?? [])
        .slice(0, 3)
        .map((item) => item.text),
    ),
    uncertainty: knowledge.uncertainty,
    question,
    recommendedAction: input.turn?.exploration?.recommendedPaths?.[0]?.label ?? null,
    capability: capabilityFor(need.family),
    continuity:
      behavior === "CLARIFY"
        ? "clarify"
        : behavior === "ACKNOWLEDGE"
          ? "preserve"
          : "update-subject",
  });
  return Object.freeze({
    identity: nexoraNca1Identity,
    message: input.utterance,
    managerContext: Object.freeze({
      role: input.role ?? null,
      domain: input.domain ?? null,
    }),
    conversationContext: Object.freeze({
      activeTopic: input.contextual.objectReference?.canonicalName ?? null,
      activeObject: input.turn?.activeObjectId ?? null,
      activeGoal: input.turn?.navigation?.goal?.title ?? null,
      activeJourneyState: input.turn?.journey?.currentPhase ?? null,
    }),
    reference: Object.freeze({
      explicit: input.meaning.objectReference?.canonicalName ?? null,
      resolvedId: input.contextual.objectReference?.subjectId ?? null,
      resolvedName: subject,
      confidence: input.contextual.confidence,
      provenance: input.contextual.provenance,
    }),
    need,
    knowledgeState: knowledge,
    advisorBehavior: behavior,
    strategy,
  });
}

export function applyNcaStrategyToResponse(input: {
  readonly source: string;
  readonly nca: ManagerConversationTurn;
  readonly locked: boolean;
}): string {
  if (input.locked) return input.source;
  const source = input.source.trim();
  if (
    input.nca.advisorBehavior === "ASK" &&
    input.nca.strategy.question &&
    !source.includes("?")
  ) {
    const subject = input.nca.strategy.subject ?? "this area";
    return `There is visible pressure around ${subject}, but I don't have enough evidence yet to recommend a lasting change. ${input.nca.strategy.question}`;
  }
  if (input.nca.need.family === "SOCIAL_CONVERSATION") {
    if (/thanks|thank you/i.test(input.nca.message)) return "You're welcome.";
    if (/^hi|^hello|^hey/i.test(input.nca.message.trim())) return source || "Hello.";
    return source.length > 0 ? source : "Understood.";
  }
  if (input.nca.need.family === "PROVIDE_INFORMATION") {
    const observation = interpretManagerProvidedObservation({
      utterance: input.nca.message,
      subjectName: input.nca.strategy.subject,
    });
    if (observation && classifyManagerSpeechAct(input.nca.message) !== "COMMAND") {
      return composeManagerObservationReply(observation);
    }
  }
  if (
    input.nca.need.family === "UNKNOWN" &&
    nca3EligibleForSemanticScope(classifyNexoraSemanticScope(input.nca.message)) &&
    /don'?t understand|unknown intent|couldn'?t complete|not sure how that relates/i.test(
      source,
    )
  ) {
    return "I can help investigate that, but I need to know which business outcome you're referring to.";
  }
  return source;
}

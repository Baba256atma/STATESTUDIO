/**
 * NCA:3 — Clarification, information-gap, and executive question intelligence.
 * Ranks whether a missing fact is worth asking. Reuses NCA:1/NCA:2 and existing truth.
 */

import { NEXORA_MVP_SUBJECT_PRESENTATION_FIXTURES } from "../nex-mvp/nexoraMVPPresentationFixtures.ts";
import {
  classifyNexoraSemanticScope,
  nca3EligibleForSemanticScope,
} from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";
import type {
  NcaAnswerPayload,
  NexoraConversationState,
} from "./nexoraNca2ConversationStateTypes.ts";
import {
  NEXORA_NCA3_BOUNDARY,
  nexoraNca3Identity,
  nexoraNca3Namespace,
  nexoraNca3Version,
  type ExecutiveInformationGap,
  type ExecutiveQuestionPurpose,
  type ExecutiveQuestionStrategy,
  type InformationGapCategory,
  type KnowledgeSufficiencyState,
  type Nca3KnownFacts,
  type QuestionStrategyMode,
} from "./nexoraNca3QuestionIntelligenceTypes.ts";

export {
  NEXORA_NCA3_BOUNDARY,
  nexoraNca3Identity,
  nexoraNca3Namespace,
  nexoraNca3Version,
};
export type {
  ExecutiveInformationGap,
  ExecutiveQuestionStrategy,
  Nca3KnownFacts,
} from "./nexoraNca3QuestionIntelligenceTypes.ts";

export function getNexoraNca3Identity() {
  return Object.freeze({
    id: nexoraNca3Identity,
    version: nexoraNca3Version,
    namespace: nexoraNca3Namespace,
  });
}

export function verifyNexoraNca3(): { readonly ok: true } {
  if (getNexoraNca3Identity().id !== nexoraNca3Identity) {
    throw new Error("NCA:3 identity mismatch");
  }
  if (NEXORA_NCA3_BOUNDARY.createsSecondEvidenceStore) {
    throw new Error("NCA:3 must not create a second evidence store");
  }
  if (NEXORA_NCA3_BOUNDARY.usesLiveLlm) {
    throw new Error("NCA:3 must not claim a live LLM");
  }
  return Object.freeze({ ok: true as const });
}

export type Nca3ComparisonClarification = Readonly<{
  question: string;
  purpose: "comparison-criterion" | "comparison-subjects";
  expectedInformation: "PRIORITY" | "ENTITY";
  questionPurpose: "CLARIFY_COMPARISON_CRITERION" | "CLARIFY_COMPARISON_SUBJECTS";
}>;

/** Bounded comparison clarification composed by the existing NCA:3 question authority. */
export function buildNca3ComparisonCriterionClarification(input: {
  readonly hasActiveGoal: boolean;
}): Nca3ComparisonClarification {
  const goalCriterion = input.hasActiveGoal ? "impact on the current Goal, " : "";
  return Object.freeze({
    question: `Important in which sense—${goalCriterion}urgency, financial impact, risk exposure, evidence strength, or which to investigate first?`,
    purpose: "comparison-criterion",
    expectedInformation: "PRIORITY",
    questionPurpose: "CLARIFY_COMPARISON_CRITERION",
  });
}

export function buildNca3ComparisonSubjectClarification(): Nca3ComparisonClarification {
  return Object.freeze({
    question: "Which Problems or objects do you want me to compare?",
    purpose: "comparison-subjects",
    expectedInformation: "ENTITY",
    questionPurpose: "CLARIFY_COMPARISON_SUBJECTS",
  });
}

function preparedOf(utterance: string): string {
  return utterance.trim().toLowerCase().replace(/[.!]+$/g, "");
}

export function isManagerUnknownUtterance(utterance: string): boolean {
  const text = preparedOf(utterance);
  return (
    /^(?:i don'?t know|not sure|no idea|we don'?t (?:know|track) that)\b/.test(text) ||
    /\bi don'?t know\b/.test(text)
  );
}

export function isManagerDeclineUtterance(utterance: string): boolean {
  return /^(?:skip(?: that)?|i'?d rather not|not relevant|don'?t want to answer)\b/.test(
    preparedOf(utterance),
  );
}

export function isTemporaryDemandUtterance(utterance: string): boolean {
  return /seasonal|temporary|three months|next (?:few )?months|not (?:expected to )?last|will (?:ease|normalize|drop)|through q[1-4]|q4|maybe longer|at least through/i.test(
    utterance,
  );
}

export function isExternalInformationRequest(utterance: string): boolean {
  return /which supplier|find a supplier|look up.{0,24}supplier|supplier in vancouver|who can (?:deliver|supply)\b|search the web|look online/i.test(
    utterance,
  );
}

function subjectOf(nca: ManagerConversationTurn): string {
  return nca.reference.resolvedName ?? nca.conversationContext.activeObject ?? "this";
}

function presentationFor(name: string) {
  const needle = name.toLowerCase();
  return (
    NEXORA_MVP_SUBJECT_PRESENTATION_FIXTURES.find((item) =>
      item.subjectId.toLowerCase().includes(needle.replace(/\s+/g, "-")),
    ) ?? null
  );
}

export function detectKnownFacts(input: {
  readonly nca: ManagerConversationTurn;
  readonly conversation: NexoraConversationState | null;
  readonly utterance: string;
  readonly explanationText?: string | null;
  readonly goalTitle?: string | null;
  readonly lastAnswer?: NcaAnswerPayload | null;
  readonly override?: Partial<Nca3KnownFacts>;
}): Nca3KnownFacts {
  const fixture = presentationFor(subjectOf(input.nca));
  const kpi = fixture && "primaryKpi" in fixture ? fixture.primaryKpi : undefined;
  const explanation = `${input.explanationText ?? ""} ${input.nca.strategy.evidence.join(" ")}`;
  const answered = input.conversation?.answeredMissing ?? [];
  const last = input.lastAnswer ?? input.conversation?.lastAnswer ?? null;
  const temporary =
    isTemporaryDemandUtterance(input.utterance) || last?.booleanValue === false;
  const continuing =
    answered.includes("demand-persistence") && last?.booleanValue === true;
  const demandPersistence: Nca3KnownFacts["demandPersistence"] =
    isManagerUnknownUtterance(input.utterance)
      ? "unavailable"
      : temporary
        ? "temporary"
        : continuing
          ? "continuing"
          : "unknown";
  const goal = input.goalTitle ?? input.nca.conversationContext.activeGoal;
  return Object.freeze({
    hasCurrentKpi: Boolean((kpi && "value" in kpi && kpi.value) || /%/.test(explanation)),
    hasTarget: Boolean((kpi && "target" in kpi && kpi.target) || /target/i.test(explanation)),
    hasGoal: Boolean(goal),
    goalProtectsDelivery: /delivery|on-time|service level/i.test(goal ?? ""),
    demandPersistence,
    managerDeclined: isManagerDeclineUtterance(input.utterance),
    ...input.override,
  });
}

function makeGap(input: {
  readonly id: string;
  readonly category: InformationGapCategory;
  readonly purpose: ExecutiveQuestionPurpose;
  readonly questionBeingResolved: string;
  readonly expectedInformation: string;
  readonly managerQuestion: string;
  readonly relevanceToNeed: number;
  readonly relevanceToGoal?: number;
  readonly relevanceToDecision?: number;
  readonly couldChangeConclusion?: boolean;
  readonly couldChangeRecommendation?: boolean;
  readonly alreadyInNexora?: boolean;
  readonly managerLikelyKnows?: boolean;
  readonly externalSourceRequired?: boolean;
  readonly status?: ExecutiveInformationGap["status"];
}): ExecutiveInformationGap {
  const decisionImpact = input.relevanceToDecision ?? input.relevanceToNeed;
  const answerability = input.managerLikelyKnows === false ? 0.15 : 0.88;
  const knownFactor = input.alreadyInNexora ? 0.05 : 1;
  const questionValue = Number(
    (
      (decisionImpact / 100) * (input.relevanceToNeed / 100) * knownFactor * answerability -
      0.16
    ).toFixed(3),
  );
  return Object.freeze({
    id: input.id,
    category: input.category,
    questionBeingResolved: input.questionBeingResolved,
    purpose: input.purpose,
    expectedInformation: input.expectedInformation,
    status: input.status ?? "OPEN",
    relevanceToNeed: input.relevanceToNeed,
    relevanceToGoal: input.relevanceToGoal ?? 40,
    relevanceToDecision: decisionImpact,
    couldChangeConclusion: input.couldChangeConclusion ?? true,
    couldChangeRecommendation: input.couldChangeRecommendation ?? true,
    couldChangePriority: false,
    couldChangeConfidence: true,
    alreadyInNexora: input.alreadyInNexora ?? false,
    managerLikelyKnows: input.managerLikelyKnows ?? true,
    externalSourceRequired: input.externalSourceRequired ?? false,
    questionValue: Math.max(0, questionValue),
    managerQuestion: input.managerQuestion,
  });
}

function lastingDecision(need: string, utterance: string): boolean {
  if (need === "SOCIAL_CONVERSATION" || need === "TEACH") return false;
  return /permanent|permanently|lasting|expand|add (?:a )?shift|increase (?:capacity|production|shifts)/i.test(
    utterance,
  );
}

function statusQuestion(need: string, utterance: string): boolean {
  if (need === "LOCATE" || need === "TEACH" || need === "SOCIAL_CONVERSATION") return true;
  return (
    (need === "UNDERSTAND" || need === "EXPLAIN") &&
    /what (?:does|is|do) |show|status|current/i.test(utterance)
  );
}

function causalInvestigation(need: string, utterance: string): boolean {
  if (need === "SOCIAL_CONVERSATION" || need === "TEACH" || need === "LOCATE") {
    return false;
  }
  if (/can'?t i compare|how do i compare|why can'?t i/i.test(utterance)) {
    return false;
  }
  if (/^why\??$/i.test(utterance.trim())) return false;
  if (/\bwhy (?:this|that|not)\b/i.test(utterance)) return false;
  return /why .{0,80}(below|target|off[- ]track)|why is delivery/i.test(utterance);
}

function preferenceTradeoff(utterance: string): boolean {
  return /cost vs|versus|or (?:speed|delivery|quality)|trade-?off|which matters more/i.test(
    utterance,
  );
}

function performanceJudgement(utterance: string): boolean {
  return /(?:is|does) \w+ (?:bad|poor|below|off track|a problem)|how (?:bad|good) is/i.test(
    utterance,
  );
}

function deriveGaps(input: {
  readonly nca: ManagerConversationTurn;
  readonly facts: Nca3KnownFacts;
  readonly utterance: string;
  readonly conversation: NexoraConversationState | null;
}): ExecutiveInformationGap[] {
  const need = input.nca.need.family;
  const subject = subjectOf(input.nca);
  const gaps: ExecutiveInformationGap[] = [];

  if (isExternalInformationRequest(input.utterance)) {
    gaps.push(
      makeGap({
        id: "external-evidence",
        category: "MISSING_EXTERNAL_EVIDENCE",
        purpose: "CONFIRM_FACT",
        questionBeingResolved: "What external option is available?",
        expectedInformation: "external-option",
        managerQuestion:
          "I cannot look up external suppliers yet, so I will not invent availability.",
        relevanceToNeed: 50,
        managerLikelyKnows: false,
        externalSourceRequired: true,
        couldChangeRecommendation: false,
        status: "UNAVAILABLE",
      }),
    );
  }

  if (statusQuestion(need, input.utterance) && input.facts.hasCurrentKpi) {
    return gaps;
  }

  if (
    performanceJudgement(input.utterance) &&
    input.facts.hasCurrentKpi &&
    !input.facts.hasTarget
  ) {
    gaps.push(
      makeGap({
        id: "missing-target",
        category: "MISSING_TARGET",
        purpose: "ESTABLISH_TARGET",
        questionBeingResolved: "What target should this be compared with?",
        expectedInformation: "NUMBER",
        managerQuestion: `I can see the current ${subject} reading. What target are you working toward?`,
        relevanceToNeed: 84,
        relevanceToDecision: 70,
      }),
    );
  }

  if (
    causalInvestigation(need, input.utterance) &&
    !input.conversation?.answeredMissing.includes("backlog")
  ) {
    gaps.push(
      makeGap({
        id: "causal-timing",
        category: "MISSING_CAUSAL_EVIDENCE",
        purpose: "RESOLVE_CAUSAL_UNCERTAINTY",
        questionBeingResolved: "Did related operational pressure move at the same time?",
        expectedInformation: "BOOLEAN",
        managerQuestion: "Has backlog increased over the same period?",
        relevanceToNeed: 78,
        relevanceToDecision: 60,
        couldChangeRecommendation: false,
      }),
    );
  }

  if (
    lastingDecision(need, input.utterance) &&
    input.facts.demandPersistence === "unknown" &&
    !input.facts.managerDeclined
  ) {
    gaps.push(
      makeGap({
        id: "demand-persistence",
        category: "MISSING_TIMEFRAME",
        purpose: "ESTABLISH_TIMEFRAME",
        questionBeingResolved: "Is the current pressure expected to continue?",
        expectedInformation: "BOOLEAN",
        managerQuestion:
          "Before recommending a lasting capacity change, I need to know whether this demand increase is expected to continue. Do you expect this higher demand to continue beyond the next few months?",
        relevanceToNeed: 96,
        relevanceToGoal: 82,
        relevanceToDecision: 94,
      }),
    );
    gaps.push(
      makeGap({
        id: "labor-availability",
        category: "MISSING_RESOURCE",
        purpose: "IDENTIFY_CONSTRAINT",
        questionBeingResolved: "Is additional labor available?",
        expectedInformation: "BOOLEAN",
        managerQuestion: "Do you currently have labor available for an extra shift?",
        relevanceToNeed: 44,
        relevanceToDecision: 42,
        couldChangeConclusion: false,
      }),
    );
    gaps.push(
      makeGap({
        id: "budget-cap",
        category: "MISSING_COST",
        purpose: "IDENTIFY_CONSTRAINT",
        questionBeingResolved: "What budget is available?",
        expectedInformation: "NUMBER",
        managerQuestion: "What budget is available for additional capacity?",
        relevanceToNeed: 28,
        relevanceToDecision: 26,
        couldChangeConclusion: false,
        couldChangeRecommendation: false,
      }),
    );
  }

  if (preferenceTradeoff(input.utterance) && !input.facts.goalProtectsDelivery) {
    gaps.push(
      makeGap({
        id: "manager-priority",
        category: "MISSING_MANAGER_PREFERENCE",
        purpose: "ESTABLISH_PREFERENCE",
        questionBeingResolved: "Which outcome should win the trade-off?",
        expectedInformation: "PRIORITY",
        managerQuestion:
          "Which matters more here right now: protecting cost or protecting delivery speed?",
        relevanceToNeed: 80,
        relevanceToDecision: 88,
      }),
    );
  }

  if (preferenceTradeoff(input.utterance) && input.facts.goalProtectsDelivery) {
    gaps.push(
      makeGap({
        id: "manager-priority-resolved",
        category: "MISSING_MANAGER_PREFERENCE",
        purpose: "ESTABLISH_PREFERENCE",
        questionBeingResolved: "Which outcome should win the trade-off?",
        expectedInformation: "PRIORITY",
        managerQuestion: "Which matters more here right now?",
        relevanceToNeed: 18,
        alreadyInNexora: true,
        status: "NOT_REQUIRED",
        couldChangeRecommendation: false,
      }),
    );
  }

  if (
    /assume|assumption|must be demand/i.test(input.utterance) &&
    !input.conversation?.answeredMissing.includes("demand-magnitude")
  ) {
    gaps.push(
      makeGap({
        id: "assumption-check",
        category: "MISSING_ASSUMPTION",
        purpose: "CONFIRM_FACT",
        questionBeingResolved: "Has incoming volume actually increased?",
        expectedInformation: "BOOLEAN",
        managerQuestion:
          "That still depends on an unconfirmed assumption. Has incoming order volume actually increased?",
        relevanceToNeed: 74,
      }),
    );
  }

  return gaps;
}

function materialGaps(
  gaps: readonly ExecutiveInformationGap[],
): ExecutiveInformationGap[] {
  return [...gaps]
    .filter(
      (item) =>
        item.status === "OPEN" &&
        !item.alreadyInNexora &&
        !item.externalSourceRequired &&
        item.questionValue >= 0.24 &&
        (item.couldChangeConclusion ||
          item.couldChangeRecommendation ||
          item.couldChangeConfidence),
    )
    .sort((left, right) => right.questionValue - left.questionValue);
}

function sufficiencyOf(
  mode: QuestionStrategyMode,
  facts: Nca3KnownFacts,
): KnowledgeSufficiencyState {
  if (facts.demandPersistence !== "unknown") return "SUFFICIENT_WITH_UNCERTAINTY";
  if (mode === "ASK") return "INSUFFICIENT";
  if (mode === "PARTIAL_ANSWER") return "PARTIALLY_SUFFICIENT";
  return "SUFFICIENT";
}

export function evaluateNca3QuestionStrategy(input: {
  readonly utterance: string;
  readonly nca: ManagerConversationTurn;
  readonly conversation: NexoraConversationState | null;
  readonly dialogueMove?: string | null;
  readonly explanationText?: string | null;
  readonly goalTitle?: string | null;
  readonly lastAnswer?: NcaAnswerPayload | null;
  readonly knownFacts?: Partial<Nca3KnownFacts>;
}): ExecutiveQuestionStrategy {
  const facts = detectKnownFacts({
    nca: input.nca,
    conversation: input.conversation,
    utterance: input.utterance,
    explanationText: input.explanationText,
    goalTitle: input.goalTitle,
    lastAnswer: input.lastAnswer,
    override: input.knownFacts,
  });
  let gaps = deriveGaps({
    nca: input.nca,
    facts,
    utterance: input.utterance,
    conversation: input.conversation,
  });

  if (facts.managerDeclined) {
    gaps = gaps.map((item) =>
      item.status === "OPEN" ? Object.freeze({ ...item, status: "DECLINED" as const }) : item,
    );
  }
  if (facts.demandPersistence === "unavailable") {
    gaps = gaps.map((item) =>
      item.id === "demand-persistence"
        ? Object.freeze({ ...item, status: "UNAVAILABLE" as const })
        : item,
    );
  }
  if (
    facts.demandPersistence === "temporary" ||
    facts.demandPersistence === "continuing"
  ) {
    if (!gaps.some((item) => item.id === "demand-persistence")) {
      gaps = [
        ...gaps,
        makeGap({
          id: "demand-persistence",
          category: "MISSING_TIMEFRAME",
          purpose: "ESTABLISH_TIMEFRAME",
          questionBeingResolved: "Is the current pressure expected to continue?",
          expectedInformation: "BOOLEAN",
          managerQuestion: "Do you expect this higher demand to continue?",
          relevanceToNeed: 96,
          status: "RESOLVED",
        }),
      ];
    }
    gaps = gaps.map((item) =>
      item.id === "demand-persistence"
        ? Object.freeze({ ...item, status: "RESOLVED" as const })
        : item,
    );
  }

  const ranked = materialGaps(gaps);
  const chosen = ranked[0] ?? null;
  const external = gaps.find((item) => item.externalSourceRequired);
  const unknownNow = isManagerUnknownUtterance(input.utterance);
  const declinedNow = isManagerDeclineUtterance(input.utterance);
  const resolvedDemand = facts.demandPersistence !== "unknown";

  let mode: QuestionStrategyMode = "ANSWER";
  if (unknownNow || declinedNow || resolvedDemand) mode = "ANSWER";
  else if (external && !chosen) mode = "ANSWER";
  else if (chosen && lastingDecision(input.nca.need.family, input.utterance)) mode = "ASK";
  else if (chosen) mode = "PARTIAL_ANSWER";
  if (input.nca.need.family === "CLARIFY" && input.nca.advisorBehavior === "CLARIFY") {
    mode = "ASK";
  }

  const shouldAsk =
    nca3EligibleForSemanticScope(classifyNexoraSemanticScope(input.utterance)) &&
    mode !== "ANSWER" &&
    chosen != null &&
    chosen.status === "OPEN";

  return Object.freeze({
    identity: nexoraNca3Identity,
    mode,
    shouldAsk,
    sufficiency: sufficiencyOf(mode, facts),
    gap: shouldAsk ? chosen : null,
    gaps: Object.freeze(gaps),
    question: shouldAsk ? chosen?.managerQuestion ?? null : null,
    purpose: shouldAsk ? chosen?.purpose ?? null : null,
    expectedInformation: shouldAsk ? chosen?.expectedInformation ?? null : null,
    reason: shouldAsk
      ? "Ask only because this missing fact would change the next advisory step."
      : facts.demandPersistence === "temporary"
        ? "Demand looks temporary, so a lasting expansion is harder to justify."
        : unknownNow
          ? "The manager cannot fill the gap; proceed with uncertainty rather than looping."
          : declinedNow
            ? "The manager declined the question; do not repeat it."
            : external
              ? "The missing information requires an external source Nexora does not have."
              : "Enough is known to advise without another question.",
    fallbackIfUnknown:
      "Then I would avoid treating the increase as permanent. We can compare a temporary-capacity option against doing nothing using the evidence we do have.",
    recomputeAfterAnswer: true as const,
  });
}

export function overlayNcaTurnWithQuestionStrategy(
  nca: ManagerConversationTurn,
  strategy: ExecutiveQuestionStrategy,
): ManagerConversationTurn {
  if (!strategy.shouldAsk) {
    const keepAsk =
      nca.advisorBehavior === "ASK" &&
      strategy.sufficiency === "INSUFFICIENT";
    const behavior =
      nca.advisorBehavior === "NAVIGATE" ||
      nca.advisorBehavior === "TEACH" ||
      nca.advisorBehavior === "ACKNOWLEDGE" ||
      nca.advisorBehavior === "DEFER" ||
      nca.advisorBehavior === "INVESTIGATE" ||
      nca.advisorBehavior === "CLARIFY"
        ? nca.advisorBehavior
        : keepAsk
          ? "ASK"
          : nca.advisorBehavior === "ASK"
            ? "ANSWER"
            : nca.advisorBehavior;
    return Object.freeze({
      ...nca,
      advisorBehavior: behavior,
      knowledgeState: Object.freeze({
        ...nca.knowledgeState,
        sufficient: strategy.sufficiency !== "INSUFFICIENT",
      }),
      strategy: Object.freeze({
        ...nca.strategy,
        behavior,
        question: behavior === "ASK" ? nca.strategy.question : null,
      }),
    });
  }
  const behavior = strategy.mode === "ASK" ? "ASK" : nca.advisorBehavior;
  return Object.freeze({
    ...nca,
    advisorBehavior: behavior,
    knowledgeState: Object.freeze({
      ...nca.knowledgeState,
      sufficient: false,
      missing: Object.freeze(
        strategy.gap
          ? [...nca.knowledgeState.missing, strategy.gap.id]
          : nca.knowledgeState.missing,
      ),
    }),
    strategy: Object.freeze({
      ...nca.strategy,
      behavior,
      question: strategy.question,
      objective: strategy.reason,
    }),
  });
}

function questionCount(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

export function applyNca3StrategyToResponse(input: {
  readonly source: string;
  readonly strategy: ExecutiveQuestionStrategy;
  readonly utterance: string;
  readonly locked: boolean;
  readonly dialogueMove?: string | null;
}): string {
  if (input.locked) return input.source;
  if (input.dialogueMove === "ANSWER_NEXORA" && !isTemporaryDemandUtterance(input.utterance)) {
    return input.source;
  }
  const source = input.source.trim();
  if (input.strategy.shouldAsk && input.strategy.question) {
    const stripped = source.replace(/[^.?!]*\?/g, "").trim();
    if (input.strategy.mode === "ASK") return input.strategy.question;
    const combined = `${stripped} ${input.strategy.question}`.trim();
    return questionCount(combined) > 1 ? input.strategy.question : combined;
  }
  if (isManagerUnknownUtterance(input.utterance)) return input.strategy.fallbackIfUnknown;
  if (isManagerDeclineUtterance(input.utterance)) {
    return "Understood. I’ll proceed with the evidence we do have and keep that point marked as unavailable.";
  }
  if (isExternalInformationRequest(input.utterance)) {
    return "I cannot look up external suppliers yet, so I will not invent availability. We can still work from the executive evidence we already have.";
  }
  if (isTemporaryDemandUtterance(input.utterance)) {
    return "Then a permanent expansion looks harder to justify. A temporary-capacity option is safer under the current evidence, with moderate confidence because other operating constraints are still unconfirmed.";
  }
  if (!input.strategy.shouldAsk && questionCount(source) > 0) {
    if (
      isTemporaryDemandUtterance(input.utterance) ||
      isManagerUnknownUtterance(input.utterance) ||
      isManagerDeclineUtterance(input.utterance)
    ) {
      return source.replace(/[^.?!]*\?/g, "").trim() || source;
    }
    return source;
  }
  return source;
}

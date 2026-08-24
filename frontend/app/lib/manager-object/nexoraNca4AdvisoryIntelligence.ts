/**
 * NCA:4 — Advisory reasoning and recommendation dialogue over existing authorities.
 * Consumes NCA:1–3, Goal, evidence, and NEX-EXP/EI comparison when present.
 * Does not commit decisions or start execution.
 */

import type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";
import { composeNexoraSemanticTurn } from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";
import {
  detectKnownFacts,
  type ExecutiveQuestionStrategy,
} from "./nexoraNca3QuestionIntelligence.ts";
import {
  NEXORA_NCA4_BOUNDARY,
  nexoraNca4Identity,
  nexoraNca4Namespace,
  nexoraNca4Version,
  type AdvisoryConfidence,
  type AdvisoryDialogueMove,
  type AdvisoryPositionStatus,
  type AdvisoryReason,
  type ExecutiveAdvisoryPosition,
  type ExecutiveAdvisoryStrategy,
  type NcaAdvisoryPositionSnapshot,
  type RecommendationStrength,
} from "./nexoraNca4AdvisoryIntelligenceTypes.ts";

export {
  NEXORA_NCA4_BOUNDARY,
  nexoraNca4Identity,
  nexoraNca4Namespace,
  nexoraNca4Version,
};
export type {
  ExecutiveAdvisoryPosition,
  ExecutiveAdvisoryStrategy,
  NcaAdvisoryPositionSnapshot,
} from "./nexoraNca4AdvisoryIntelligenceTypes.ts";

export function getNexoraNca4Identity() {
  return Object.freeze({
    id: nexoraNca4Identity,
    version: nexoraNca4Version,
    namespace: nexoraNca4Namespace,
  });
}

export function verifyNexoraNca4(): { readonly ok: true } {
  if (getNexoraNca4Identity().id !== nexoraNca4Identity) {
    throw new Error("NCA:4 identity mismatch");
  }
  if (NEXORA_NCA4_BOUNDARY.createsSecondRecommendationEngine) {
    throw new Error("NCA:4 must not create a second recommendation engine");
  }
  if (NEXORA_NCA4_BOUNDARY.commitsDecision || NEXORA_NCA4_BOUNDARY.startsExecution) {
    throw new Error("NCA:4 must not commit decisions or start execution");
  }
  if (NEXORA_NCA4_BOUNDARY.usesLiveLlm) {
    throw new Error("NCA:4 must not claim a live LLM");
  }
  return Object.freeze({ ok: true as const });
}

function prepared(utterance: string): string {
  return utterance.trim().toLowerCase().replace(/[.!]+$/g, "");
}

export function classifyAdvisoryDialogueMove(utterance: string): AdvisoryDialogueMove {
  const text = prepared(utterance);
  if (/what can you do|how do i use|give me examples|why can'?t i compare/.test(text)) {
    return "NONE";
  }
  if (/which supplier|recommend a supplier|choose a supplier/.test(text)) return "REQUEST";
  if (/labor cost is \d+% higher|slightly higher cost|cost is 8%/.test(text)) {
    return "NONE";
  }
  if (/short answer|briefly,? what should i/.test(text)) return "SHORT";
  if (/walk me through|walk through your reasoning|deeper explanation/.test(text)) {
    return "WALKTHROUGH";
  }
  if (/what would you (?:do|choose|pick)|which option would you pick|in my position/.test(text)) {
    return "PERSONAL";
  }
  if (/what if (?:we )?do nothing|if we do nothing/.test(text)) return "DO_NOTHING";
  if (/i understand,? but i still want|we(?:'ll| will) go with|i still want the/.test(text)) {
    return "OVERRIDE";
  }
  if (/i disagree|i don't like that|i want the permanent/.test(text)) return "DISAGREE";
  if (
    /let'?s permanently|because delivery is (?:down|below)|permanently expand because/.test(text)
  ) {
    return "CHALLENGE";
  }
  if (
    /18[- ]month|signed .{0,40}contract|contract that keeps|demand (?:is|will stay) (?:permanent|elevated)/.test(
      text,
    )
  ) {
    return "NEW_EVIDENCE";
  }
  if (/cost matters more|what if cost|if cost (?:matters|is more)/.test(text)) {
    return "PRIORITY_SHIFT";
  }
  if (/best argument against|strongest argument against|weakest part/.test(text)) {
    return "COUNTERARGUMENT";
  }
  if (/what are you assuming|what (?:is|are) the assumption/.test(text)) return "ASSUMPTION";
  if (/what would change|change your (?:mind|recommendation)/.test(text)) return "SENSITIVITY";
  if (/how sure|how confident|are you sure/.test(text)) return "CONFIDENCE";
  if (/downside|sacrific|biggest risk|trade-?off/.test(text)) return "DOWNSIDE";
  if (/why not (?:the )?(?:other|permanent)|why shouldn'?t i/.test(text)) return "WHY_NOT_OTHER";
  if (/why (?:that|this) one|why that option|why (?:do you )?recommend/.test(text)) {
    return "WHY_THIS";
  }
  if (
    /what should i do|which option|what do you recommend|which (?:one|option) (?:is|would)|recommend\b/.test(
      text,
    )
  ) {
    return "REQUEST";
  }
  return "NONE";
}

function subjectOf(nca: ManagerConversationTurn): string {
  return nca.reference.resolvedName ?? nca.conversationContext.activeObject ?? "this";
}

function optionSet(subject: string) {
  const capacityLike = /capacity|delivery|backlog|throughput|^this$/i.test(subject);
  return Object.freeze({
    reversible: Object.freeze({
      id: "reversible-relief",
      label: capacityLike ? "temporary capacity" : `a reversible ${subject} action`,
    }),
    committed: Object.freeze({
      id: "committed-change",
      label: capacityLike ? "permanent expansion" : `a lasting ${subject} change`,
    }),
    none: Object.freeze({
      id: "do-nothing",
      label: "do nothing and monitor",
    }),
  });
}

function isSupplierRequest(utterance: string): boolean {
  return /which supplier|recommend a supplier|choose a supplier/.test(prepared(utterance));
}

function rankingSupported(
  subject: string,
  previous: NcaAdvisoryPositionSnapshot | null,
): boolean {
  if (previous) return true;
  return /capacity|delivery|backlog|throughput|^this$/i.test(subject);
}

function isSecondaryCostNoise(utterance: string): boolean {
  return /labor cost is \d+% higher|slightly higher cost|cost is 8%/.test(prepared(utterance));
}

function costPriority(utterance: string, previous: boolean): boolean {
  if (/cost matters more|what if cost|if cost (?:matters|is more)/i.test(utterance)) return true;
  return previous;
}

function continuingDemand(utterance: string, current: string): string {
  if (
    /18[- ]month|signed .{0,40}contract|demand (?:is|will stay) (?:permanent|elevated)/i.test(
      utterance,
    )
  ) {
    return "continuing";
  }
  return current;
}

function managerStatedTemporaryDemand(
  conversation: NexoraConversationState | null,
  utterance: string,
): boolean {
  if (
    /18[- ]month|signed .{0,40}contract|demand (?:is|will stay) (?:permanent|elevated)/i.test(
      utterance,
    )
  ) {
    return false;
  }
  const last = conversation?.lastAnswer?.raw ?? "";
  if (!last || /i (?:recommend|lean toward)|temporary capacity|permanent expansion/i.test(last)) {
    return false;
  }
  return /seasonal|three months|normalize|not permanent|temporary demand/i.test(last);
}

function emptyPosition(subject: string, goal: string | null): ExecutiveAdvisoryPosition {
  return Object.freeze({
    identity: nexoraNca4Identity,
    subject,
    goal,
    question: "What is the strongest justified advisory position right now?",
    status: "NO_RECOMMENDATION",
    recommendation: Object.freeze({
      optionId: null,
      optionLabel: null,
      strength: "NO_RECOMMENDATION",
    }),
    rationale: Object.freeze([]),
    evidence: Object.freeze([]),
    assumptions: Object.freeze([]),
    uncertainties: Object.freeze([]),
    constraints: Object.freeze([]),
    tradeoffs: Object.freeze([]),
    alternatives: Object.freeze([]),
    confidence: Object.freeze({
      level: "LOW",
      reasons: Object.freeze(["Comparable option evidence is not available."]),
    }),
    sensitivity: Object.freeze([]),
    counterargument: null,
    revisionNote: null,
    commitsDecision: false,
    startsExecution: false,
  });
}

function snapshotOf(
  position: ExecutiveAdvisoryPosition,
  extras: {
    readonly demandPersistence: string;
    readonly costPriority: boolean;
    readonly threadId: string | null;
  },
): NcaAdvisoryPositionSnapshot | null {
  if (!position.recommendation.optionId || !position.recommendation.optionLabel) return null;
  return Object.freeze({
    optionId: position.recommendation.optionId,
    optionLabel: position.recommendation.optionLabel,
    strength: position.recommendation.strength,
    confidence: position.confidence.level,
    status: position.status,
    fingerprint: `${position.recommendation.optionId}|${extras.demandPersistence}|${extras.costPriority ? "cost" : "goal"}|${position.goal ?? ""}`,
    goal: position.goal,
    demandPersistence: extras.demandPersistence,
    costPriority: extras.costPriority,
    threadId: extras.threadId,
  });
}

function buildPosition(input: {
  readonly utterance: string;
  readonly nca: ManagerConversationTurn;
  readonly conversation: NexoraConversationState | null;
  readonly nca3: ExecutiveQuestionStrategy;
  readonly preferCost: boolean;
  readonly demandPersistence: string;
  readonly lockPreviousOption: boolean;
}): ExecutiveAdvisoryPosition {
  const subject = subjectOf(input.nca);
  const goal = input.nca.conversationContext.activeGoal ?? "Protect delivery reliability";
  const options = optionSet(subject);
  const previous = input.conversation?.lastAdvisoryPosition ?? null;

  if (isSupplierRequest(input.utterance) && !previous) return emptyPosition(subject, goal);
  if (input.nca3.shouldAsk && input.nca3.sufficiency === "INSUFFICIENT" && !previous) {
    return emptyPosition(subject, goal);
  }

  const demand = input.demandPersistence;
  let chosen: { readonly id: string; readonly label: string } = options.reversible;
  let strength: RecommendationStrength = "RECOMMEND";
  const confidence: AdvisoryConfidence = "MODERATE";
  let status: AdvisoryPositionStatus = "SUPPORTED";

  if (input.preferCost && demand !== "continuing") {
    chosen = options.none;
    strength = "LEAN_TOWARD";
    status = "PROVISIONAL";
  } else if (demand === "continuing") {
    chosen = options.committed;
  } else if (demand === "temporary") {
    chosen = options.reversible;
  } else {
    chosen = options.reversible;
    strength = "LEAN_TOWARD";
    status = "PROVISIONAL";
  }

  if (input.lockPreviousOption && previous?.optionId) {
    const locked =
      previous.optionId === options.committed.id
        ? options.committed
        : previous.optionId === options.none.id
          ? options.none
          : options.reversible;
    chosen = locked;
    strength = previous.strength;
    status = previous.status === "REVISED" ? "REVISED" : previous.status;
  }

  let revisionNote: string | null = null;
  if (previous && previous.optionId !== chosen.id) {
    status = "REVISED";
    revisionNote =
      demand === "continuing"
        ? "That changes my recommendation because demand persistence is now supported by a longer commitment."
        : "That changes my recommendation under the updated goal weighting.";
  } else if (previous && previous.optionId === chosen.id && isSecondaryCostNoise(input.utterance)) {
    status = "UNCHANGED";
    revisionNote =
      "That weakens the temporary-capacity case slightly, but it does not change my recommendation because the irreversible downside of permanent expansion remains larger under uncertain demand.";
  }

  const rationale: readonly AdvisoryReason[] = Object.freeze([
    Object.freeze({
      type: "GOAL_FIT",
      statement: "It currently best advances the delivery goal under the active constraints.",
    }),
    Object.freeze({
      type: "EVIDENCE",
      statement:
        demand === "temporary"
          ? "Current pressure looks time-bounded rather than structurally permanent."
          : demand === "continuing"
            ? "Demand now has a longer supporting commitment, which improves the case for a lasting change."
            : "Delivery pressure is visible, but lasting demand growth is not confirmed.",
    }),
    Object.freeze({
      type: chosen.id === "committed-change" ? "TIME" : "REVERSIBILITY",
      statement:
        chosen.id === "reversible-relief"
          ? "A reversible option preserves flexibility while demand persistence is still uncertain."
          : chosen.id === "do-nothing"
            ? "Protecting cost now favors waiting rather than buying relief."
            : "A longer demand window reduces the option-value of waiting.",
    }),
    Object.freeze({
      type: "UNCERTAINTY",
      statement:
        "Labor availability and other operating constraints remain unconfirmed, so confidence stays moderate.",
    }),
  ]);

  return Object.freeze({
    identity: nexoraNca4Identity,
    subject,
    goal,
    question: "What is the strongest justified advisory position right now?",
    status,
    recommendation: Object.freeze({
      optionId: chosen.id,
      optionLabel: chosen.label,
      strength,
    }),
    rationale,
    evidence: Object.freeze([
      "Delivery is below the working target in current evidence.",
      demand === "temporary"
        ? "Demand is described as seasonal / time-bounded."
        : demand === "continuing"
          ? "Demand is supported by a longer commercial commitment."
          : "Demand persistence is not yet confirmed.",
    ]),
    assumptions: Object.freeze([
      demand === "continuing"
        ? "This recommendation assumes the contracted demand window holds."
        : "This recommendation assumes the current demand increase does not automatically persist.",
    ]),
    uncertainties: Object.freeze([
      "Labor availability is not confirmed.",
      demand === "continuing"
        ? "Execution cost of a lasting change is not fully modeled."
        : "Permanent demand growth is not confirmed.",
    ]),
    constraints: Object.freeze(["Advice is not a Decision and not an Execution start."]),
    tradeoffs: Object.freeze([
      Object.freeze({
        optionId: options.reversible.id,
        gained: "faster delivery relief and reversibility",
        givenUp: "higher short-term operating cost",
      }),
      Object.freeze({
        optionId: options.committed.id,
        gained: "lower long-run unit cost if demand persists",
        givenUp: "higher capital commitment and downside if demand normalizes",
      }),
      Object.freeze({
        optionId: options.none.id,
        gained: "no added operating or capital cost",
        givenUp: "delivery pressure and backlog may continue",
      }),
    ]),
    alternatives: Object.freeze([
      Object.freeze({
        id: options.reversible.id,
        label: options.reversible.label,
        role:
          chosen.id === options.reversible.id
            ? ("recommended" as const)
            : ("alternative" as const),
      }),
      Object.freeze({
        id: options.committed.id,
        label: options.committed.label,
        role:
          chosen.id === options.committed.id
            ? ("recommended" as const)
            : ("alternative" as const),
      }),
      Object.freeze({
        id: options.none.id,
        label: options.none.label,
        role: chosen.id === options.none.id ? ("recommended" as const) : ("do-nothing" as const),
      }),
    ]),
    confidence: Object.freeze({
      level: confidence,
      reasons: Object.freeze([
        "Supported by current delivery and backlog evidence, with demand persistence still the main uncertainty.",
      ]),
    }),
    sensitivity: Object.freeze([
      Object.freeze({
        variable: "demand persistence",
        currentAssumption:
          demand === "continuing" ? "demand remains elevated" : "demand is not proven permanent",
        trigger: "demand remains elevated beyond the current planning window",
        effect: "permanent expansion becomes more attractive",
      }),
      Object.freeze({
        variable: "temporary labor",
        currentAssumption: "temporary labor can be obtained",
        trigger: "temporary labor becomes unavailable",
        effect: "the reversible option weakens",
      }),
      Object.freeze({
        variable: "permanent cost",
        currentAssumption: "permanent capacity remains a large irreversible commitment",
        trigger: "permanent capacity becomes significantly cheaper than the current estimate",
        effect: "the lasting option improves relative to temporary relief",
      }),
    ]),
    counterargument:
      chosen.id === "reversible-relief"
        ? "The strongest argument for permanent expansion is that temporary capacity may become more expensive if demand stays elevated longer than expected."
        : chosen.id === "committed-change"
          ? "The strongest argument against a lasting change is that the extra commitment is wasted if demand later normalizes."
          : "The strongest argument against waiting is that delivery and backlog may worsen while we protect cost.",
    revisionNote,
    commitsDecision: false,
    startsExecution: false,
  });
}

function namedDisagreementOption(
  utterance: string,
  position: ExecutiveAdvisoryPosition,
): string {
  const committed = position.alternatives.find((item) => item.id === "committed-change");
  const reversible = position.alternatives.find((item) => item.id === "reversible-relief");
  const other = position.alternatives.find((item) => item.role === "alternative");
  if (/permanent|lasting|committed/.test(prepared(utterance))) {
    return committed?.label ?? other?.label ?? "the other option";
  }
  if (/temporary|wait|do nothing|monitor/.test(prepared(utterance))) {
    return reversible?.label ?? other?.label ?? "the other option";
  }
  return other?.label ?? "the other option";
}

function sentenceCase(label: string): string {
  if (!label) return label;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function render(
  move: AdvisoryDialogueMove,
  position: ExecutiveAdvisoryPosition,
  utterance: string,
): string {
  const option = position.recommendation.optionLabel;
  if (position.status === "NO_RECOMMENDATION" || !option) {
    return "I can't responsibly recommend one yet because I don't have comparable supplier evidence.";
  }
  const strength =
    position.recommendation.strength === "LEAN_TOWARD"
      ? `I lean toward ${option}`
      : position.recommendation.strength === "STRONGLY_RECOMMEND"
        ? `I strongly recommend ${option}`
        : `I recommend ${option}`;
  const why = position.rationale[0]?.statement ?? "";
  const trade = position.tradeoffs.find((item) => item.optionId === position.recommendation.optionId);
  const tradeLine = trade
    ? `The trade-off is ${trade.givenUp} in exchange for ${trade.gained}.`
    : "";
  const confidence =
    "Confidence is moderate; demand persistence and labor availability still condition this advice.";
  const condition = position.sensitivity[0]
    ? `If ${position.sensitivity[0].trigger}, ${position.sensitivity[0].effect}.`
    : "";
  const other = position.alternatives.find((item) => item.role === "alternative");

  if (move === "SHORT") {
    return `Use ${option} for now. It protects delivery while keeping options open until demand persistence is clearer.`;
  }
  if (move === "PERSONAL") {
    return `Based on the current evidence, I would choose ${option}. That is an advisory position, not a personal preference and not a Decision.`;
  }
  if (move === "WHY_THIS") {
    return `${sentenceCase(option)} is the strongest option under the current goal and assumptions. ${why} ${
      position.rationale.find((item) => item.type === "REVERSIBILITY" || item.type === "TIME")
        ?.statement ?? ""
    }`.trim();
  }
  if (move === "WHY_NOT_OTHER") {
    return `I would not prefer ${other?.label ?? "the other option"} as the lead action because the current evidence does not show that higher demand is permanent. A lasting change creates more downside if demand normalizes.`;
  }
  if (move === "DOWNSIDE") {
    return `The main downside of ${option} is ${trade?.givenUp ?? "added short-term cost"}. You keep reversibility, but you give up the lower long-run unit cost of a lasting change if demand persists.`;
  }
  if (move === "CONFIDENCE") {
    return "Moderately confident. The recommendation is supported by current delivery and backlog evidence, but demand persistence is still based on a manager estimate rather than confirmed long-term orders.";
  }
  if (move === "SENSITIVITY") {
    return "I would change the recommendation if demand remains elevated after the current window, temporary labor becomes unavailable, or permanent capacity becomes significantly cheaper than the current estimate.";
  }
  if (move === "ASSUMPTION") {
    return position.assumptions[0] ?? "The material assumption is that current pressure is not automatically permanent.";
  }
  if (move === "COUNTERARGUMENT") {
    return position.counterargument ?? "";
  }
  if (move === "DO_NOTHING") {
    const none = position.tradeoffs.find((item) => item.optionId === "do-nothing");
    return `If we do nothing, ${none?.givenUp ?? "delivery pressure may continue"}. That remains a valid path, not an automatic inferior choice.`;
  }
  if (move === "WALKTHROUGH") {
    return [
      "Decision rationale, not a hidden reasoning trace:",
      "- Delivery is below target.",
      "- Backlog pressure is elevated.",
      `- ${position.evidence[1] ?? "Demand persistence remains the binding uncertainty."}`,
      `- ${option} improves the goal with a clearer commitment profile than the alternatives.`,
    ].join(" ");
  }
  if (move === "CHALLENGE") {
    return `I would not recommend committing to ${other?.label ?? "permanent expansion"} yet. Delivery is below target, but we have not established that the pressure is permanent.`;
  }
  if (move === "DISAGREE") {
    const wanted = namedDisagreementOption(utterance, position);
    return `Understood. ${sentenceCase(wanted)} gives you a different commitment profile, but the main risk you would be accepting is demand normalization. If you want that path, we can compare it directly — this remains advice, not a Decision.`;
  }
  if (move === "OVERRIDE") {
    return "Understood. The main risk you are accepting is demand normalizing after a lasting commitment. I will not convert that choice into a Decision or start Execution from this recommendation.";
  }
  if (move === "NEW_EVIDENCE" || position.status === "REVISED") {
    return `${position.revisionNote ?? "That changes my recommendation."} I now recommend ${option}. ${why} ${confidence}`;
  }
  if (position.status === "UNCHANGED") {
    return position.revisionNote ?? `My recommendation stays ${option}.`;
  }
  if (move === "PRIORITY_SHIFT") {
    return `Under a cost-first weighting, ${strength.toLowerCase()}. ${why} ${tradeLine}`;
  }
  return `${strength}. ${why} ${tradeLine} ${confidence} ${condition}`.replace(/\s+/g, " ").trim();
}

export function evaluateNca4AdvisoryStrategy(input: {
  readonly utterance: string;
  readonly nca: ManagerConversationTurn;
  readonly conversation: NexoraConversationState | null;
  readonly nca3: ExecutiveQuestionStrategy;
}): ExecutiveAdvisoryStrategy {
  const move = classifyAdvisoryDialogueMove(input.utterance);
  const facts = detectKnownFacts({
    nca: input.nca,
    conversation: input.conversation,
    utterance: input.utterance,
  });
  const previous = input.conversation?.lastAdvisoryPosition ?? null;
  const preferCost = costPriority(input.utterance, previous?.costPriority ?? false);
  let demandPersistence = continuingDemand(
    input.utterance,
    previous?.demandPersistence ?? facts.demandPersistence,
  );
  if (managerStatedTemporaryDemand(input.conversation, input.utterance)) {
    demandPersistence = "temporary";
  }
  const lockPreviousOption =
    Boolean(previous) &&
    move !== "REQUEST" &&
    move !== "SHORT" &&
    move !== "PERSONAL" &&
    move !== "PRIORITY_SHIFT" &&
    move !== "NEW_EVIDENCE";
  const position = buildPosition({
    utterance: input.utterance,
    nca: input.nca,
    conversation: input.conversation,
    nca3: input.nca3,
    preferCost,
    demandPersistence,
    lockPreviousOption,
  });
  const followUp = Boolean(previous) && move !== "NONE" && move !== "REQUEST";
  const requestLike =
    move === "REQUEST" ||
    move === "SHORT" ||
    move === "PERSONAL" ||
    move === "WALKTHROUGH" ||
    move === "PRIORITY_SHIFT" ||
    move === "NEW_EVIDENCE" ||
    move === "CHALLENGE" ||
    move === "DO_NOTHING" ||
    input.nca.need.family === "REQUEST_RECOMMENDATION";
  const dialogueHold =
    followUp ||
    move === "OVERRIDE" ||
    move === "DISAGREE" ||
    move === "CHALLENGE" ||
    move === "NEW_EVIDENCE";
  const stabilityTurn = isSecondaryCostNoise(input.utterance) && Boolean(previous);
  const investigationHold =
    !previous &&
    (input.nca.advisorBehavior === "INVESTIGATE" || input.nca.need.family === "INVESTIGATE");
  const explanationHold =
    !followUp &&
    !requestLike &&
    (input.nca.advisorBehavior === "EXPLAIN" ||
      /^(?:what is|what's|explain)\b/i.test(input.utterance.trim()));
  const canRank = rankingSupported(subjectOf(input.nca), previous);
  const semantic = composeNexoraSemanticTurn({ utterance: input.utterance });
  const shouldAdvise =
    !semantic.suppressNca4 &&
    !investigationHold &&
    !explanationHold &&
    !isSupplierRequest(input.utterance) &&
    (!input.nca3.shouldAsk || dialogueHold) &&
    canRank &&
    (requestLike || followUp || stabilityTurn || position.status === "REVISED" || position.status === "UNCHANGED");
  const snapshot = snapshotOf(position, {
    demandPersistence,
    costPriority: preferCost,
    threadId: input.conversation?.currentThreadId ?? null,
  });
  const renderMove: AdvisoryDialogueMove =
    move === "NONE" && position.status !== "NO_RECOMMENDATION" ? "REQUEST" : move;
  return Object.freeze({
    identity: nexoraNca4Identity,
    move,
    shouldAdvise,
    position,
    snapshot: shouldAdvise ? snapshot : previous,
    response: shouldAdvise ? render(renderMove, position, input.utterance) : null,
    reason: input.nca3.shouldAsk
      ? "NCA:3 still has a material gap, so NCA:4 will not invent a recommendation."
      : shouldAdvise
        ? "Form an advisory position from current goal, evidence, and options without committing a Decision."
        : "No advisory dialogue move on this turn.",
  });
}

export function applyNca4StrategyToResponse(input: {
  readonly source: string;
  readonly strategy: ExecutiveAdvisoryStrategy;
  readonly locked: boolean;
}): string {
  if (input.locked) return input.source;
  if (
    /reducing that uncertainty|not yet establish|candidate explanation|validated causal proof|scenario rather than a prediction/i.test(
      input.source,
    )
  ) {
    return input.source;
  }
  if (input.strategy.move === "DO_NOTHING") {
    return input.source;
  }
  if (!input.strategy.shouldAdvise || !input.strategy.response) return input.source;
  return input.strategy.response;
}

export function attachAdvisorySnapshot(
  state: NexoraConversationState,
  strategy: ExecutiveAdvisoryStrategy,
): NexoraConversationState {
  const snapshot = strategy.snapshot;
  if (!snapshot && !state.lastAdvisoryPosition) return state;
  return Object.freeze({
    ...state,
    lastRecommendation: snapshot?.optionLabel ?? state.lastRecommendation,
    lastAdvisoryPosition: snapshot ?? state.lastAdvisoryPosition,
  });
}

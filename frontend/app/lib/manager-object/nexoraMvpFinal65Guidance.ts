/**
 * NEX-MVP-FINAL:6.5 — Guidance & Self-Knowledge.
 * Read-only projection over MO:4–6, CC, EI, EXP. Not a second journey or Advisor.
 */

import type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";
import { prepareManagerUtteranceLight } from "./canonicalManagerMeaningInterpreter.ts";
import type { ClarificationTurnResult } from "./nexoraMvpFinal63ClarificationTypes.ts";
import type { ManagerObjectTurn } from "./managerObjectInteraction.ts";
import type {
  CapabilityAvailability,
  GuidanceIntent,
  GuidanceTurnResult,
} from "./nexoraMvpFinal65GuidanceTypes.ts";
import { sanitizeManagerCopy } from "./managerObjectExperienceComposer.ts";

export const nexoraMvpFinal65GuidanceIdentity =
  "NEX-MVP-FINAL:6.5/GuidanceSelfKnowledge" as const;
export const nexoraMvpFinal65GuidanceVersion = "1.0.0" as const;
export const nexoraMvpFinal65GuidanceNamespace =
  "nexora.mvp.final65.guidance-self-knowledge" as const;

export const NEXORA_MVP_FINAL65_GUIDANCE_BOUNDARY = Object.freeze({
  identity: nexoraMvpFinal65GuidanceIdentity,
  createsSecondCapabilityRegistry: false as const,
  createsSecondJourneyEngine: false as const,
  createsSecondAdvisor: false as const,
  createsSecondWorkflowEngine: false as const,
  inventsBusinessTruth: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  usesStaticFaqAsPrimary: false as const,
  startsFinal66: false as const,
});

export function getNexoraMvpFinal65GuidanceIdentity() {
  return Object.freeze({
    id: nexoraMvpFinal65GuidanceIdentity,
    version: nexoraMvpFinal65GuidanceVersion,
    namespace: nexoraMvpFinal65GuidanceNamespace,
  });
}

export function verifyNexoraMvpFinal65Guidance(): { readonly ok: true } {
  if (getNexoraMvpFinal65GuidanceIdentity().id !== nexoraMvpFinal65GuidanceIdentity) {
    throw new Error("FINAL:6.5 identity mismatch");
  }
  if (NEXORA_MVP_FINAL65_GUIDANCE_BOUNDARY.createsSecondJourneyEngine) {
    throw new Error("FINAL:6.5 must not create a second journey engine");
  }
  return Object.freeze({ ok: true as const });
}

function emptyResult(
  overrides: Partial<GuidanceTurnResult>,
): GuidanceTurnResult {
  return Object.freeze({
    identity: nexoraMvpFinal65GuidanceIdentity,
    intent: "NONE",
    action: "keep",
    answer: null,
    capabilityId: null,
    availability: null,
    prerequisite: null,
    journeyPhase: null,
    selectedGuidance: null,
    guidanceReason: null,
    proactiveEligible: false,
    proactiveSuppressed: null,
    authoritySource: "MO:5/ExecutiveJourneyProgressIntelligence",
    commitsDecision: false,
    startsExecution: false,
    ...overrides,
  });
}

export type ProjectedCapability = {
  readonly id: string;
  readonly label: string;
  readonly availability: CapabilityAvailability;
  readonly prerequisite: string | null;
  readonly authority: string;
};

export function projectNexoraCapabilities(
  turn: ManagerObjectTurn,
  registeredNames: readonly string[] = [],
): readonly ProjectedCapability[] {
  const phase = turn.journey.currentPhase;
  const scenariosReady =
    turn.journey.currentPhase === "SCENARIO" ||
    turn.journey.currentPhase === "DECISION" ||
    turn.journey.decisionState === "proposed" ||
    turn.journey.decisionState === "recommended" ||
    turn.journey.decisionState === "committed";
  const decisionApproved = turn.journey.decisionState === "committed";
  const executionActive = turn.journey.executionState === "ACTIVE";
  const cap = (
    id: string,
    label: string,
    availability: CapabilityAvailability,
    prerequisite: string | null,
    authority: string,
  ): ProjectedCapability =>
    Object.freeze({ id, label, availability, prerequisite, authority });
  const core = [
    cap("FOCUS", "focus executive objects", "AVAILABLE_NOW", null, "CC:1/MO:1"),
    cap("EXPLAIN", "explain objects and evidence", "AVAILABLE_NOW", null, "MO:2"),
    cap("INVESTIGATE", "investigate problems and relationships", "AVAILABLE_NOW", null, "FINAL:5/EI"),
    cap(
      "GOAL",
      "connect issues to the goal",
      phase === "CONTEXT" ? "BLOCKED_BY_PREREQUISITE" : "AVAILABLE_NOW",
      phase === "CONTEXT" ? "a goal to improve" : null,
      "MO:4",
    ),
    cap(
      "COMPARE_SCENARIOS",
      "compare options",
      scenariosReady ? "AVAILABLE_NOW" : "BLOCKED_BY_PREREQUISITE",
      scenariosReady ? null : "at least two scenarios",
      "CC:9/EI:4",
    ),
    cap("RECOMMEND", "recommend a stronger option", "SUPPORTED", null, "CC:8"),
    cap(
      "DECISION",
      "prepare a decision for your approval",
      scenariosReady ? "AVAILABLE_NOW" : "BLOCKED_BY_PREREQUISITE",
      scenariosReady ? null : "options to compare first",
      "CC:10",
    ),
    cap(
      "EXECUTION",
      "start execution through the approval flow",
      decisionApproved ? "AVAILABLE_NOW" : "BLOCKED_BY_PREREQUISITE",
      decisionApproved ? null : "an approved decision",
      "CC:11",
    ),
    cap(
      "OUTCOME",
      "inspect outcomes against the baseline",
      executionActive || turn.journey.outcomeState !== "NOT_OBSERVED"
        ? "AVAILABLE_NOW"
        : "SUPPORTED",
      null,
      "CC:12",
    ),
    cap(
      "LEARNING",
      "capture learning when evidence supports it",
      turn.journey.learningState === "AVAILABLE" || turn.journey.learningState === "CAPTURED"
        ? "AVAILABLE_NOW"
        : "SUPPORTED",
      null,
      "CORE-OUT",
    ),
  ];
  const extras = registeredNames
    .filter((name) => name.trim().length > 0)
    .map((name) =>
      cap(
        `INSPECT_${name.replace(/\s+/g, "_").toUpperCase()}`,
        `inspect ${name}`,
        "AVAILABLE_NOW",
        null,
        "MO:1/registered-subject",
      ),
    );
  return Object.freeze([...core, ...extras]);
}

export function classifyGuidanceIntent(
  meaning: CanonicalManagerMeaning,
  utterance: string,
): GuidanceIntent {
  const light = prepareManagerUtteranceLight(utterance);
  if (
    /\b(?:send (?:an |this )?email|send .{0,40}\bemail|update (?:our |the )?erp|call the supplier)\b/.test(light) ||
    /\b(?:monitor this 24|24 7|automatically approve|guarantee )\b/.test(light) ||
    /\b(?:change (?:the |our )?erp|ingest files|browse the web|search the web)\b/.test(light) ||
    /\b(?:rag|pdf|sql|warehouse|calendar)\b/.test(light)
  ) {
    return "PRODUCT_FICTION";
  }
  if (/\b(?:forecast|predict exact|exact recovery date|predict exactly)\b/.test(light)) {
    return "PARTIAL_FORECAST";
  }
  if (/\b(?:you decide|make the decision for me)\b/.test(light)) return "YOU_DECIDE";
  if (/\b(?:do it for me|just handle it)\b/.test(light)) return "DO_IT_FOR_ME";
  if (/\bhelp me decide|help me make this decision|can you help me decide\b/.test(light)) {
    return "HELP_DECIDE";
  }
  if (
    /\b(?:can you start|start it|act now)\b/.test(light) ||
    /^(?:start|act now)\.?$/.test(light)
  ) {
    return "START";
  }
  if (/\b(?:can you monitor|monitor this)\b/.test(light)) return "MONITOR";
  if (/\bdid we decide\b/.test(light)) return "DID_WE_DECIDE";
  if (/\bare we doing\b/.test(light)) return "ARE_WE_DOING";
  if (/\b(?:example questions|give me examples|try asking)\b/.test(light)) return "EXAMPLES";
  if (/\bwhat should i ask\b/.test(light)) return "WHAT_TO_ASK";
  if (
    /\b(?:how do i use|how should i (?:use|work)|how should i use nexora|how should i work with you)\b/.test(
      light,
    )
  ) {
    return "HOW_TO_USE";
  }
  if (
    /\b(?:what can you|what are you useful|what are you able|how can you help|what can we actually do|what are you able to help)\b/.test(
      light,
    )
  ) {
    return "CAPABILITY";
  }
  if (/\b(?:now what|what next|where do we go|what should i (?:look at |do )?next|what would be smart)\b/.test(light)) {
    return "NEXT_STEP";
  }
  if (/\bwhat is left|what is still (?:open|unresolved)\b/.test(light)) return "REMAINING";
  if (/\bwhat have we done\b/.test(light)) return "PROGRESS";
  if (/\b(?:where are we|where have we got|where have we gotten)\b/.test(light)) {
    return "WHERE_WE_ARE";
  }
  if (/\b(?:what do you need|what information|what is missing|what is missing before)\b/.test(light)) {
    return "NEED_INFO";
  }
  if (/\bwhat (?:do not|dont|don't) we know|what have not we figured|what haven.t we figured\b/.test(light)) {
    return "DONT_KNOW";
  }
  if (
    /\bwhat do you know\b/.test(light) &&
    meaning.objectReference == null &&
    !/\babout\b/.test(light)
  ) {
    return "KNOW";
  }
  if (/\bwhat can we investigate|what else can we look|what else could i\b/.test(light)) {
    return "INVESTIGATE";
  }
  if (
    /\bwhat (?:are )?(?:my |our |the )?options|compare them yet|compare the options yet\b/.test(
      light,
    )
  ) {
    return "OPTIONS";
  }
  if (meaning.objectReference != null && /\babout\b/.test(light)) {
    return "NONE";
  }
  if (meaning.communicativeIntent === "ASK_CAPABILITY" && meaning.requestedOperation === "HELP") {
    if (meaning.objectReference != null) return "NONE";
    if (/\bwhat should i ask|examples\b/.test(light)) return "WHAT_TO_ASK";
    if (/\bhow\b/.test(light)) return "HOW_TO_USE";
    return "CAPABILITY";
  }
  if (meaning.requestedOperation === "HELP" && meaning.objectReference == null) {
    return "CAPABILITY";
  }
  if (/^(?:ok|okay)\.?$/.test(light)) return "NEXT_STEP";
  return "NONE";
}

function phaseCopy(phase: string): string {
  switch (phase) {
    case "GOAL":
      return "We've established a goal and are looking at current performance.";
    case "REALITY":
      return "We've established current performance against the goal.";
    case "ISSUE":
      return "We're investigating the issue connected to the goal. We haven't compared solutions yet.";
    case "SCENARIO":
      return "We're looking at options. The decision is not approved yet.";
    case "DECISION":
      return "A decision path is in view. Approval is still yours.";
    case "EXECUTION":
      return "The decision is in motion. We can follow execution and later outcomes.";
    case "OUTCOME":
      return "We're looking at observed results against the baseline.";
    case "LEARNING":
      return "This loop can be assessed for learning, then we can reassess the goal.";
    default:
      return "We're at the start. Tell me the outcome you want to improve.";
  }
}

function managerLabel(value: string): string {
  if (value === "DECISION_REQUIRED") return "the pending decision";
  if (value === "ACTION_REQUIRED") return "the action that still needs approval";
  if (/^[A-Z][A-Z0-9_]+$/.test(value)) return value.toLowerCase().replace(/_/g, " ");
  return value;
}

function nextStepFromTurn(turn: ManagerObjectTurn): { readonly text: string; readonly reason: string } {
  const attention = turn.attention.primaryAttention?.label;
  const blocker = turn.journey.blocker?.recommendedResolutionPath;
  const nav = turn.navigation.recommendedPath?.path.label;
  const explore = turn.exploration.recommendedPaths[0]?.label;
  if (attention && !/^[A-Z][A-Z0-9_]+$/.test(attention)) {
    return {
      text: `Investigate ${managerLabel(attention)} next.`,
      reason: "MO:6 primary attention",
    };
  }
  if (blocker) {
    return { text: sanitizeManagerCopy(blocker), reason: "MO:5 journey blocker" };
  }
  if (nav) return { text: managerLabel(nav), reason: "MO:4 goal navigation" };
  if (explore) return { text: managerLabel(explore), reason: "MO exploration" };
  if (attention) {
    return {
      text: `The strongest next step is ${managerLabel(attention)}.`,
      reason: "MO:6 primary attention",
    };
  }
  if (blocker) {
    return { text: sanitizeManagerCopy(blocker), reason: "MO:5 journey blocker" };
  }
  if (nav) return { text: nav, reason: "MO:4 goal navigation" };
  if (explore) return { text: explore, reason: "MO exploration" };
  if (turn.journey.currentPhase === "CONTEXT" || turn.navigation.goal.source === "unknown") {
    return {
      text: "Start with the outcome you want to improve.",
      reason: "missing goal",
    };
  }
  return {
    text: "I don't have enough evidence to recommend the next investigation yet.",
    reason: "insufficient basis",
  };
}

function capabilityAnswer(turn: ManagerObjectTurn): string {
  const phase = turn.journey.currentPhase;
  const rawLabel = turn.attention.primaryAttention?.label ?? null;
  const concrete =
    rawLabel && !/^[A-Z][A-Z0-9_]+$/.test(rawLabel) ? managerLabel(rawLabel) : null;
  if ((phase === "ISSUE" || phase === "REALITY") && concrete) {
    return `I can explain the gap, investigate connected problems like ${concrete}, test what happens if nothing changes, or help you explore options.`;
  }
  if (phase === "SCENARIO" || phase === "DECISION") {
    return "I can compare the options, investigate remaining issues, explain the trade-offs, or show why one fits the goal better. You make the final decision.";
  }
  if (phase === "EXECUTION" || phase === "OUTCOME") {
    return "I can help you follow execution, compare outcomes with the baseline, and assess goal impact. I don't monitor in the background unless outcome data arrives.";
  }
  return "I can help you understand the current situation, define the goal, investigate problems and risks, compare options, support a decision you control, and follow what happens afterward. Start with the outcome you want to improve.";
}

function askExamples(turn: ManagerObjectTurn): string {
  const phase = turn.journey.currentPhase;
  if (phase === "SCENARIO" || phase === "DECISION") {
    return "Try: 'Which option is safer?', 'What are the trade-offs?', or 'Which one best supports the goal?'";
  }
  if (phase === "ISSUE" || phase === "REALITY") {
    return "Try: 'Why is it below target?', 'What should I investigate first?', or 'What happens if we do nothing?'";
  }
  return "Try: 'Why is Delivery below target?', 'What should I investigate first?', or 'What happens if we do nothing?'";
}

function whatToAsk(turn: ManagerObjectTurn): string {
  const phase = turn.journey.currentPhase;
  if (phase === "GOAL" || phase === "REALITY") {
    return "You could ask what is preventing the goal, which issue matters most, or where the evidence is weak.";
  }
  if (phase === "ISSUE") {
    return "You could ask why it matters, what it affects, what evidence supports it, or what happens if you ignore it.";
  }
  if (phase === "SCENARIO" || phase === "DECISION") {
    return "You could ask which option is safer, what the trade-offs are, or which one best supports the goal.";
  }
  return "You can speak naturally — ask what's happening, why it matters, what your options are, or what you should look at next.";
}

export function resolveGuidanceTurn(input: {
  readonly utterance: string;
  readonly meaning: CanonicalManagerMeaning;
  readonly intentKind: string;
  readonly status: string;
  readonly turn: ManagerObjectTurn;
  readonly clarification: ClarificationTurnResult | null;
  readonly authorityResponse: string;
  readonly registeredNames?: readonly string[];
  readonly previousGuidance?: string | null;
}): GuidanceTurnResult {
  const turn = input.turn;
  const intent = classifyGuidanceIntent(input.meaning, input.utterance);
  const capabilities = projectNexoraCapabilities(turn, input.registeredNames ?? []);
  const next = nextStepFromTurn(turn);
  const pendingClarify =
    input.clarification?.action === "clarify" ||
    input.clarification?.action === "unpark" ||
    input.clarification?.action === "fail";
  const correcting = Boolean(input.clarification?.correctionDetected);
  const confirming = input.status === "confirmation-required";
  const phase = turn.journey.currentPhase;

  if (pendingClarify) {
    return emptyResult({
      intent,
      action: "keep",
      journeyPhase: phase,
      proactiveEligible: false,
      proactiveSuppressed: "clarification-pending",
    });
  }

  if (intent === "PRODUCT_FICTION") {
    return emptyResult({
      intent,
      action: "replace",
      answer:
        "I can't do that from this workspace. I can help assess the decision and define what should change.",
      availability: "NOT_SUPPORTED",
      capabilityId: "INTEGRATION",
      journeyPhase: phase,
      authoritySource: "FINAL:6.5 capability projection",
    });
  }

  let answer: string | null = null;
  let availability: CapabilityAvailability | null = null;
  let prerequisite: string | null = null;
  let capabilityId: string | null = null;
  const reason = next.reason;

  switch (intent) {
    case "CAPABILITY":
      answer = capabilityAnswer(turn);
      capabilityId = "FOCUS";
      availability = "AVAILABLE_NOW";
      break;
    case "HOW_TO_USE":
      answer =
        "Tell me what you're trying to improve. We'll establish the current reality, investigate what matters, explore options, make the decision explicit, and then follow the outcome. You can speak naturally — you don't need commands.";
      break;
    case "WHAT_TO_ASK":
      answer = whatToAsk(turn);
      break;
    case "EXAMPLES":
      answer = askExamples(turn);
      break;
    case "NEXT_STEP":
      answer = next.text.startsWith("Investigate")
        ? `${next.text.replace(/\.$/, "")} — it is the strongest unresolved issue in the current context.`
        : next.text;
      break;
    case "WHERE_WE_ARE":
      answer = sanitizeManagerCopy(
        turn.journey.managerFacingText || phaseCopy(phase),
      ).replace(/\bREADY_FOR_[A-Z_]+\b/g, "");
      if (!answer || /READY_FOR|UNKNOWN/.test(answer)) answer = phaseCopy(phase);
      break;
    case "PROGRESS":
      answer = sanitizeManagerCopy(turn.journey.accomplishedText);
      break;
    case "REMAINING":
      answer = sanitizeManagerCopy(turn.journey.unresolvedText);
      break;
    case "NEED_INFO":
      if (turn.navigation.goal.source === "unknown") {
        answer =
          "I need the outcome you want to improve — the goal and, if you have it, the current result versus target.";
      } else {
        answer =
          "I have the current goal context. What is missing is enough evidence to confirm what is driving the gap.";
      }
      break;
    case "KNOW":
      if (
        input.authorityResponse.trim().length >= 80 &&
        !/unknown intent|couldn.?t complete/i.test(input.authorityResponse)
      ) {
        break;
      }
      answer = sanitizeManagerCopy(
        turn.explanation.currentSituation ?? turn.explanation.managerFacingText,
      );
      break;
    case "DONT_KNOW":
      if (
        input.authorityResponse.trim().length >= 80 &&
        !/unknown intent|couldn.?t complete/i.test(input.authorityResponse)
      ) {
        break;
      }
      answer =
        turn.explanation.uncertainty ??
        "We can see the current result and connected issues. We don't yet have enough evidence to confirm a cause.";
      break;
    case "INVESTIGATE": {
      const alt = /\bwhat else\b/.test(prepareManagerUtteranceLight(input.utterance));
      const label = alt
        ? turn.attention.secondaryItems[0]?.label
        : turn.attention.primaryAttention?.label;
      if (alt && label && label === turn.attention.primaryAttention?.label) {
        answer = "I don't have another supported issue to add right now.";
      } else if (alt && label) {
        answer = `${managerLabel(label)} is also unresolved.`;
      } else if (label) {
        answer = `${managerLabel(label)} is the strongest current investigation.`;
      } else {
        answer = "I don't have another supported issue to add right now.";
      }
      capabilityId = "INVESTIGATE";
      availability = "AVAILABLE_NOW";
      break;
    }
    case "OPTIONS": {
      const compare = capabilities.find((item) => item.id === "COMPARE_SCENARIOS");
      availability = compare?.availability ?? "BLOCKED_BY_PREREQUISITE";
      prerequisite = compare?.prerequisite ?? "at least two scenarios";
      capabilityId = "COMPARE_SCENARIOS";
      if (
        availability === "AVAILABLE_NOW" &&
        !/at least two|need .*scenario|still need to define/i.test(
          input.authorityResponse,
        )
      ) {
        break;
      }
      answer = `I can compare options once we have ${prerequisite}. Right now we still need to define the options.`;
      break;
    }
    case "HELP_DECIDE": {
      const compare = capabilities.find((item) => item.id === "COMPARE_SCENARIOS");
      answer =
        compare?.availability === "AVAILABLE_NOW"
          ? "Yes. I can compare the options against the goal, evidence, risks, and trade-offs, then recommend the stronger one. You make the final decision."
          : "Yes, but we need options to compare first before I can support a decision. You still make the final decision.";
      capabilityId = "DECISION";
      availability = compare?.availability ?? "BLOCKED_BY_PREREQUISITE";
      break;
    }
    case "YOU_DECIDE":
    case "DO_IT_FOR_ME":
      answer =
        "I can recommend and explain the trade-offs, but I won't commit the decision for you. " + next.text;
      capabilityId = "DECISION";
      availability = "SUPPORTED";
      break;
    case "START": {
      const execution = capabilities.find((item) => item.id === "EXECUTION");
      availability = execution?.availability ?? "BLOCKED_BY_PREREQUISITE";
      prerequisite = execution?.prerequisite ?? "an approved decision";
      capabilityId = "EXECUTION";
      if (availability === "AVAILABLE_NOW" || confirming) {
        break;
      }
      answer = "Not yet. We need an approved decision before execution can start.";
      break;
    }
    case "MONITOR":
      answer =
        "I can inspect outcomes when new results arrive. I don't run continuous background monitoring.";
      capabilityId = "OUTCOME";
      availability = "SUPPORTED";
      break;
    case "DID_WE_DECIDE":
      answer =
        turn.journey.decisionState === "committed"
          ? "Yes. The decision is approved, but check whether execution has started."
          : "Not yet. We may have a recommendation, but no approved decision.";
      break;
    case "ARE_WE_DOING":
      answer =
        turn.journey.executionState === "ACTIVE"
          ? "Yes. Execution is active."
          : turn.journey.decisionState === "committed"
            ? "Not yet. The decision is approved, but execution hasn't started."
            : "Not yet. There is no active execution.";
      break;
    case "PARTIAL_FORECAST":
      answer =
        "I can model scenarios from the available assumptions, but I don't have a validated forecasting model for an exact prediction.";
      availability = "SUPPORTED";
      capabilityId = "COMPARE_SCENARIOS";
      break;
    default:
      break;
  }

  const mentionedRegistered = (input.registeredNames ?? []).find((name) =>
    prepareManagerUtteranceLight(input.utterance).includes(name.toLowerCase()),
  );
  if (
    !answer &&
    mentionedRegistered &&
    (/couldn.?t complete/i.test(input.authorityResponse) ||
      /\b(?:understand|investigate about)\b/.test(
        prepareManagerUtteranceLight(input.utterance),
      ))
  ) {
    answer = `I can inspect ${mentionedRegistered} as a registered subject. I don't have loaded evidence to produce a business result for it yet.`;
    capabilityId = `INSPECT_${mentionedRegistered.replace(/\s+/g, "_").toUpperCase()}`;
    availability = "AVAILABLE_NOW";
  }

  if (answer) {
    return emptyResult({
      intent,
      action: "replace",
      answer: answer.replace(/\s{2,}/g, " ").trim(),
      capabilityId,
      availability,
      prerequisite,
      journeyPhase: phase,
      selectedGuidance: next.text,
      guidanceReason: reason,
      authoritySource: "MO:4/MO:5/MO:6 projection",
    });
  }

  const alreadyGuides = /investigate|next useful|next step/i.test(input.authorityResponse);
  const repeats = Boolean(input.previousGuidance) && next.text === input.previousGuidance;
  const narrowFact =
    input.intentKind === "focus" ||
    input.meaning.requestedOperation === "FOCUS" ||
    confirming ||
    correcting;
  const light = prepareManagerUtteranceLight(input.utterance);
  const observedGap = /\b(?:\d+\s*%|below target|we are at)\b/.test(light);
  const canAppend =
    !pendingClarify &&
    !narrowFact &&
    !alreadyGuides &&
    !repeats &&
    !confirming &&
    !correcting &&
    Boolean(turn.attention.primaryAttention?.label) &&
    observedGap &&
    intent === "NONE";

  if (canAppend) {
    return emptyResult({
      intent: "NEXT_STEP",
      action: "append",
      answer: "I'd investigate what's preventing the goal next.",
      journeyPhase: phase,
      selectedGuidance: next.text,
      guidanceReason: reason,
      proactiveEligible: true,
      authoritySource: "MO:6 attention",
    });
  }

  return emptyResult({
    intent,
    action: "keep",
    journeyPhase: phase,
    selectedGuidance: next.text,
    guidanceReason: reason,
    capabilityId,
    availability,
    prerequisite,
    proactiveEligible: false,
    proactiveSuppressed: narrowFact
      ? "narrow-request"
      : pendingClarify
        ? "clarification-pending"
        : alreadyGuides || repeats
          ? "would-repeat"
          : "no-strong-trigger",
  });
}

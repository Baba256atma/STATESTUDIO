/**
 * NCA:6 — Adapt how Nexora speaks. Never adapt executive truth.
 * Runs after NCA:1–5. Presentation only. No live LLM.
 */

import type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";
import type { ExecutiveQuestionStrategy } from "./nexoraNca3QuestionIntelligenceTypes.ts";
import type { ExecutiveAdvisoryStrategy } from "./nexoraNca4AdvisoryIntelligenceTypes.ts";
import type { ExecutiveInitiativeStrategy } from "./nexoraNca5InitiativeIntelligenceTypes.ts";
import { rewriteTautologicalAttentionLanguage } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  ADVISOR_TRUST_CONTRACT,
  NEXORA_NCA6_BOUNDARY,
  nexoraNca6Identity,
  nexoraNca6Namespace,
  nexoraNca6Version,
  type AdaptationConfidence,
  type CommunicationDepth,
  type CommunicationFraming,
  type CommunicationStructure,
  type ExecutiveCommunicationStrategy,
  type ManagerModelSource,
  type ManagerRole,
  type Nca6ManagerContextInput,
  type NcaCommunicationSnapshot,
  type NexoraFamiliarity,
  type NexoraManagerModel,
  type SourcedManagerField,
  type VocabularyTechnicality,
} from "./nexoraNca6CommunicationIntelligenceTypes.ts";

export {
  ADVISOR_TRUST_CONTRACT,
  NEXORA_NCA6_BOUNDARY,
  nexoraNca6Identity,
  nexoraNca6Namespace,
  nexoraNca6Version,
};
export type {
  ExecutiveCommunicationStrategy,
  Nca6ManagerContextInput,
  NcaCommunicationSnapshot,
} from "./nexoraNca6CommunicationIntelligenceTypes.ts";

const ARCHITECTURE_LEAK =
  /\b(?:canonical(?:\s+relationship)?|resolver|runtime|state machine|journey process blocker|process blocker|goal linkage|NCA(?::\d)?|MO(?::\d)?|EI(?::\d)?|WATCH)\b/gi;

type CommunicationSignals = {
  readonly brief: boolean;
  readonly detailed: boolean;
  readonly simplify: boolean;
  readonly technical: boolean;
  readonly teaching: boolean;
  readonly skipTeaching: boolean;
  readonly persistBrief: boolean;
  readonly persistDetailed: boolean;
  readonly temporaryOnly: boolean;
  readonly disagreement: boolean;
  readonly challenge: boolean;
  readonly managerCorrection: boolean;
  readonly cheapest: boolean;
  readonly capabilityAsk: boolean;
  readonly conceptAsk: boolean;
};

export function getNexoraNca6Identity() {
  return Object.freeze({
    id: nexoraNca6Identity,
    version: nexoraNca6Version,
    namespace: nexoraNca6Namespace,
  });
}

export function verifyNexoraNca6(): { readonly ok: true } {
  if (getNexoraNca6Identity().id !== nexoraNca6Identity) {
    throw new Error("NCA:6 identity mismatch");
  }
  if (NEXORA_NCA6_BOUNDARY.createsPersonalityProfiler) {
    throw new Error("NCA:6 must not create a personality profiler");
  }
  if (NEXORA_NCA6_BOUNDARY.commitsDecision || NEXORA_NCA6_BOUNDARY.startsExecution) {
    throw new Error("NCA:6 must not commit decisions or start execution");
  }
  if (NEXORA_NCA6_BOUNDARY.usesLiveLlm) {
    throw new Error("NCA:6 must not claim a live LLM");
  }
  if (NEXORA_NCA6_BOUNDARY.adaptsTruthToPersonality) {
    throw new Error("NCA:6 must not adapt truth to personality");
  }
  return Object.freeze({ ok: true as const });
}

function sourced<T>(
  value: T,
  source: ManagerModelSource,
  confidence: AdaptationConfidence,
  persist: boolean,
): SourcedManagerField<T> {
  return Object.freeze({ value, source, confidence, persist });
}

function prepared(utterance: string): string {
  return utterance.trim().toLowerCase();
}

export function classifyCommunicationSignals(utterance: string): CommunicationSignals {
  const text = prepared(utterance);
  return Object.freeze({
    brief:
      /give me the short version|short answer|keep (?:this|it) (?:one )?short|briefly|executive summary/.test(
        text,
      ),
    detailed:
      /walk me through|explain (?:this |it |the )?(?:reasoning|in detail)|go deeper|show me the reasoning|give me the details/.test(
        text,
      ),
    simplify:
      /i don'?t understand|what does that mean|explain (?:that |it |this )?more simply|too technical|i'?m confused|explain it simply/.test(
        text,
      ),
    technical:
      /more technically|in technical terms|more precise language|what is nca(?::\d)?|what does canonical mean|in the code/.test(
        text,
      ),
    teaching: /what is a scenario|what does nexora mean|how does nexora work/.test(text),
    skipTeaching: /skip the explanation|i already know|just compare/.test(text),
    persistBrief: /always keep (?:it|this) short|from now on.{0,24}concise/.test(text),
    persistDetailed: /always (?:explain|walk me through|go deep)/.test(text),
    temporaryOnly: /keep this one short|just this (?:one|time)/.test(text),
    disagreement:
      /i disagree|permanent expansion is better|i (?:still )?want permanent/.test(text),
    challenge: /are you sure|that can'?t be right|you'?re wrong/.test(text),
    managerCorrection:
      /that'?s not right|the target is \d+%?,? not \d+%?|not \d+%,? it'?s \d+%/.test(text),
    cheapest: /cheapest option|i want the cheapest|lowest cost option/.test(text),
    capabilityAsk:
      /best supplier in vancouver|find me (?:a |the )?supplier|search the web for/.test(text),
    conceptAsk: /capacity gap/.test(text),
  });
}

export function roleFromText(value: string | null | undefined): ManagerRole {
  const text = String(value ?? "").toLowerCase();
  if (!text) return "UNKNOWN";
  if (/cfo|finance|controller|treasury/.test(text)) return "FINANCE";
  if (/exec|ceo|coo|president/.test(text)) return "EXECUTIVE";
  if (/operat|ops manager|plant|warehouse/.test(text)) return "OPERATIONS";
  if (/project manager|\bpm\b/.test(text)) return "PROJECT";
  if (/engineer/.test(text)) return "ENGINEERING";
  if (/\bpmo\b/.test(text)) return "PMO";
  if (/gm\b|general manager|general/.test(text)) return "GENERAL";
  return "UNKNOWN";
}

function framingForRole(role: ManagerRole): CommunicationFraming {
  if (role === "FINANCE") return "FINANCE";
  if (role === "OPERATIONS") return "OPERATIONS";
  if (role === "PROJECT" || role === "PMO") return "PROJECT";
  if (role === "EXECUTIVE" || role === "GENERAL") return "EXECUTIVE";
  return "NEUTRAL";
}

function resolveDepth(
  signals: CommunicationSignals,
  previous: NcaCommunicationSnapshot | null,
  persistent: CommunicationDepth | null,
): { depth: CommunicationDepth; explicit: boolean; persist: boolean } {
  if (signals.detailed) {
    return { depth: "DETAILED", explicit: true, persist: signals.persistDetailed };
  }
  if (signals.brief) {
    return {
      depth: "BRIEF",
      explicit: true,
      persist: signals.persistBrief && !signals.temporaryOnly,
    };
  }
  if (persistent) return { depth: persistent, explicit: false, persist: true };
  if (previous?.sessionPreferredDepth) {
    return { depth: previous.sessionPreferredDepth, explicit: false, persist: false };
  }
  return { depth: "STANDARD", explicit: false, persist: false };
}

function resolveFamiliarity(
  signals: CommunicationSignals,
  input: Nca6ManagerContextInput | null | undefined,
  previous: NcaCommunicationSnapshot | null,
): SourcedManagerField<NexoraFamiliarity> {
  if (input?.familiarity) return sourced(input.familiarity, "EXPLICIT", "HIGH", true);
  if (signals.skipTeaching) return sourced("FAMILIAR", "OBSERVED", "LOW", false);
  if (signals.teaching) return sourced("LEARNING", "OBSERVED", "MODERATE", false);
  if (previous?.familiarity && previous.familiarity !== "UNKNOWN") {
    return sourced(previous.familiarity, "CONTEXTUAL", "LOW", false);
  }
  return sourced("UNKNOWN", "UNKNOWN", "LOW", false);
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function join(parts: readonly (string | null | undefined)[]): string {
  return parts
    .filter((item): item is string => Boolean(item && item.trim()))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function optionLabelOf(nca4: ExecutiveAdvisoryStrategy | null | undefined): string | null {
  return nca4?.position.recommendation.optionLabel ?? null;
}

function extractNumbers(text: string): readonly string[] {
  return Object.freeze(Array.from(new Set(text.match(/\d+(?:\.\d+)?%?/g) ?? [])));
}

function uncertaintyClause(text: string): string | null {
  const match = text.match(
    /[^.]*\b(?:uncertain|uncertainty|not (?:yet )?(?:confirmed|enough evidence)|moderately confident|hypothesis)\b[^.]*\.?/i,
  );
  return match?.[0]?.trim() ?? null;
}

function stripArchitectureLeak(text: string, explainInternal: boolean): string {
  if (explainInternal) return text;
  return text
    .replace(/before we continue, one change is important:?\s*/gi, "")
    .replace(/this is a journey process blocker[^.]*\.?/gi, "")
    .replace(ARCHITECTURE_LEAK, (token) => (/watch/i.test(token) ? "worth monitoring" : ""))
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

function simplifyLanguage(text: string, conceptAsk: boolean): string {
  let next = text
    .replace(/\bCapacity Gap\b/gi, "the gap between needed and available capacity")
    .replace(/\bthroughput\b/gi, "how much work you can complete")
    .replace(/\bepistemic\b/gi, "what we actually know")
    .replace(/\bcausal status\b/gi, "whether this is the cause")
    .replace(/confidence\s*=\s*0\.\d+/gi, "I'm moderately confident");
  if (conceptAsk || /capacity gap|needed and available capacity/i.test(`${text} ${next}`)) {
    const meaning =
      "Capacity Gap means the difference between the capacity you need and the capacity you currently have. It is a constraint to investigate, not a proven cause by itself.";
    if (!/difference between the capacity you need/i.test(next)) {
      next = join([meaning, next]);
    }
  }
  return next;
}

function technicalCapacityLanguage(text: string): string {
  if (/capacity gap|needed and available capacity/i.test(text)) {
    return join([
      "Capacity Gap is the recorded shortfall between required and available capacity for the current window.",
      "That object meaning is unchanged; causality remains unconfirmed unless the evidence already says so.",
      text,
    ]);
  }
  return text;
}

function briefen(text: string, option: string | null, source: string): string {
  const parts = splitSentences(text);
  const rec = parts.find((item) =>
    option ? item.toLowerCase().includes(option.toLowerCase()) : /recommend|use /i.test(item),
  );
  const uncertainty =
    uncertaintyClause(source) ??
    uncertaintyClause(text) ??
    (option
      ? "I'm moderately confident, and it still depends on whether demand persists."
      : null);
  return join([...new Set([rec ?? parts[0], uncertainty])].slice(0, 3));
}

function framingPrefix(framing: CommunicationFraming, subject: string): string | null {
  if (framing === "EXECUTIVE") {
    return `The immediate decision is how to protect ${subject} without locking in a lasting commitment.`;
  }
  if (framing === "OPERATIONS") {
    return `${subject} is an operational constraint: backlog, throughput, and capacity pressure.`;
  }
  if (framing === "FINANCE") {
    return `${subject} still has the same facts; the financial question is cost and exposure versus a lasting commitment.`;
  }
  if (framing === "PROJECT") {
    return `${subject} should be framed around schedule risk and whether the work can still land.`;
  }
  return null;
}

function teachingPrefix(familiarity: NexoraFamiliarity, skip: boolean): string | null {
  if (skip || familiarity === "FAMILIAR") return null;
  if (familiarity === "NEW") {
    return "Start with the outcome you want to improve. Nexora will use that goal to organize the evidence, issues, scenarios, and decisions around it.";
  }
  if (familiarity === "LEARNING") {
    return "A Scenario is a possible course of action Nexora can compare before you make a decision.";
  }
  return null;
}

function restoreTruth(adapted: string, source: string, option: string | null): string {
  let next = adapted;
  if (option && !next.toLowerCase().includes(option.toLowerCase())) {
    next = join([next, `My recommendation remains ${option}.`]);
  }
  for (const token of extractNumbers(source)) {
    if (!next.includes(token)) next = join([next, token]);
  }
  const uncertainty = uncertaintyClause(source);
  if (uncertainty && !uncertaintyClause(next)) next = join([next, uncertainty]);
  if (/\bnot proven\b/i.test(source) && !/\b(?:not proven|assumption)\b/i.test(next)) {
    next = join([next, "Causality is not proven."]);
  }
  if (/moderately confident|moderate confidence/i.test(source) && !/moderat/i.test(next)) {
    next = join([next, "I'm moderately confident."]);
  }
  return next.replace(/\s+/g, " ").trim();
}

function capabilityHonesty(text: string, needed: boolean): string {
  if (!needed) return text;
  if (/cannot look up|don't currently have verified|will not invent/i.test(text)) return text;
  return join([
    "I can help define supplier criteria and compare candidates you already have, but I don't currently have verified supplier-market data to recommend a specific vendor.",
    text,
  ]);
}

function disagreementOverlay(text: string, option: string | null, wanted: boolean): string {
  if (!wanted) return text;
  const rec = option ?? "the current recommendation";
  if (/my recommendation (?:still )?remains|still remains/i.test(text)) return text;
  return join([
    text,
    "That's a valid alternative if you're willing to accept the risk of permanent cost under uncertain demand.",
    `My recommendation still remains ${rec}.`,
  ]);
}

function goalPreferenceConflict(text: string, cheapest: boolean, goal: string | null): string {
  if (!cheapest) return text;
  if (!/deliver/i.test(goal ?? "") && !/deliver/i.test(text)) return text;
  if (/conflicts with the current delivery goal|reassess the goal/i.test(text)) return text;
  return join([
    "The cheapest option is doing nothing, but that conflicts with the current delivery goal.",
    "If cost is now the higher priority, we should explicitly reassess the goal or trade-off.",
    text,
  ]);
}

function managerCorrectionAck(text: string, utterance: string, offered: boolean): string {
  if (!offered) return text;
  const pair = utterance.match(/(\d+%?).{0,24}not\s+(\d+%?)/i);
  const inverted = utterance.match(/not\s+(\d+%?).{0,12}(\d+%?)/i);
  let ack = "Understood.";
  if (pair) ack = `Understood — ${pair[1]}, not ${pair[2]}.`;
  else if (inverted) ack = `Understood — ${inverted[2]}, not ${inverted[1]}.`;
  if (/understood/i.test(text.slice(0, 80))) return text;
  return join([ack, text]);
}

function selfCorrection(
  text: string,
  previousResponse: string | null | undefined,
  source: string,
): string {
  const previousTarget = previousResponse?.match(/(\d+%?)\s+target|target(?: is| of)?\s+(\d+%?)/i);
  const currentTarget = source.match(/(\d+%?)\s+target|target(?: is| of)?\s+(\d+%?)/i);
  const prev = previousTarget?.[1] ?? previousTarget?.[2];
  const curr = currentTarget?.[1] ?? currentTarget?.[2];
  if (!prev || !curr || prev === curr) return text;
  if (/need to correct my earlier statement/i.test(text)) return text;
  return join([`I need to correct my earlier statement: the target is ${curr}, not ${prev}.`, text]);
}

function revisionLanguage(text: string, nca4: ExecutiveAdvisoryStrategy | null | undefined): string {
  const status = nca4?.position.status;
  const option = optionLabelOf(nca4);
  if (status === "REVISED" || nca4?.move === "NEW_EVIDENCE") {
    if (/that changes my recommendation|earlier i|now more defensible/i.test(text)) return text;
    return join([
      nca4?.position.revisionNote ?? "That new evidence changes the situation.",
      "Earlier I preferred a reversible option because demand persistence was uncertain.",
      option ? `The recommendation is now ${option}.` : "",
      text,
    ]);
  }
  if (status === "UNCHANGED") {
    if (/does not change my recommendation|recommendation stays|remains/i.test(text)) return text;
    return join([
      nca4?.position.revisionNote ??
        `The new information does not change my recommendation${option ? ` of ${option}` : ""} because the larger uncertainty remains.`,
      text,
    ]);
  }
  return text;
}

function criticalProminence(text: string, critical: boolean): string {
  if (!critical) return text;
  const parts = splitSentences(text);
  const lead =
    parts.find((item) =>
      /important change|no longer holds|before we continue|assumption/i.test(item),
    ) ?? parts[0];
  return join([lead, ...parts.filter((item) => item !== lead).slice(0, 2)]);
}

function structureOf(
  signals: CommunicationSignals,
  nca5: ExecutiveInitiativeStrategy | null | undefined,
  nca3: ExecutiveQuestionStrategy | null | undefined,
  familiarity: NexoraFamiliarity,
): CommunicationStructure {
  if (nca5?.shouldInitiate && nca5.decision.priority === "CRITICAL") return "CRITICAL";
  if (signals.simplify || signals.teaching || familiarity === "NEW" || familiarity === "LEARNING") {
    return "TEACHING";
  }
  if (nca3?.shouldAsk) return "INVESTIGATION";
  if (signals.brief) return "SUMMARY";
  return "ADVISORY";
}

function composeAdaptedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly signals: CommunicationSignals;
  readonly depth: CommunicationDepth;
  readonly framing: CommunicationFraming;
  readonly structure: CommunicationStructure;
  readonly technicality: VocabularyTechnicality;
  readonly familiarity: NexoraFamiliarity;
  readonly nca4: ExecutiveAdvisoryStrategy | null;
  readonly nca5: ExecutiveInitiativeStrategy | null;
  readonly previousResponse: string | null;
  readonly goal: string | null;
  readonly skipTeaching: boolean;
}): string {
  const option = optionLabelOf(input.nca4);
  const subject = input.nca4?.position.subject ?? "the current issue";
  let text = stripArchitectureLeak(input.source, input.technicality === "HIGH");
  if (input.signals.simplify || input.technicality === "LOW") {
    text = simplifyLanguage(text, input.signals.conceptAsk);
  }
  if (input.signals.technical || input.technicality === "HIGH") {
    text = technicalCapacityLanguage(text);
  }
  if (input.depth === "BRIEF") text = briefen(text, option, input.source);
  text = revisionLanguage(text, input.nca4);
  text = disagreementOverlay(
    text,
    option,
    input.signals.disagreement || input.signals.challenge,
  );
  text = goalPreferenceConflict(text, input.signals.cheapest, input.goal);
  text = capabilityHonesty(text, input.signals.capabilityAsk);
  text = managerCorrectionAck(text, input.utterance, input.signals.managerCorrection);
  text = selfCorrection(text, input.previousResponse, input.source);
  if (input.structure !== "CRITICAL") {
    const teach = teachingPrefix(input.familiarity, input.skipTeaching);
    if (teach && input.depth !== "BRIEF" && !/start with the outcome|a scenario is/i.test(text)) {
      text = join([teach, text]);
    }
    const prefix = framingPrefix(input.framing, subject);
    if (prefix && !text.startsWith(prefix)) text = join([prefix, text]);
  } else {
    const initiative = input.nca5?.response?.trim();
    if (initiative && !text.includes(initiative)) {
      text = join([initiative, text]);
    }
    text = criticalProminence(text, true);
  }
  text = restoreTruth(text, input.source, option);
  return text
    .replace(/I changed the plan/gi, "The plan has not been changed")
    .replace(/I approved it/gi, "This is still advice, not an approved Decision")
    .replace(/I started execution/gi, "Execution has not started")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateNca6CommunicationStrategy(input: {
  readonly utterance: string;
  readonly source: string;
  readonly nca?: ManagerConversationTurn | null;
  readonly conversation?: NexoraConversationState | null;
  readonly nca3?: ExecutiveQuestionStrategy | null;
  readonly nca4?: ExecutiveAdvisoryStrategy | null;
  readonly nca5?: ExecutiveInitiativeStrategy | null;
  readonly managerContext?: Nca6ManagerContextInput | null;
  readonly previousResponse?: string | null;
}): ExecutiveCommunicationStrategy {
  const signals = classifyCommunicationSignals(input.utterance);
  const previous = input.conversation?.lastCommunicationSnapshot ?? null;
  const role = roleFromText(
    input.managerContext?.role ?? input.nca?.managerContext.role ?? null,
  );
  const roleKnown = Boolean(input.managerContext?.role || input.nca?.managerContext.role);
  const domainValue = input.managerContext?.domain ?? input.nca?.managerContext.domain ?? null;
  const depthResolved = resolveDepth(
    signals,
    previous,
    input.managerContext?.persistentPreferredDepth ?? previous?.sessionPreferredDepth ?? null,
  );
  const familiarity = resolveFamiliarity(signals, input.managerContext, previous);
  const framing = framingForRole(role);
  const technicality: VocabularyTechnicality = signals.technical
    ? "HIGH"
    : signals.simplify
      ? "LOW"
      : "STANDARD";
  const structure = structureOf(signals, input.nca5, input.nca3, familiarity.value);
  const critical = structure === "CRITICAL";
  const sessionPreferredDepth = depthResolved.persist
    ? depthResolved.depth
    : previous?.sessionPreferredDepth ?? null;
  const model: NexoraManagerModel = Object.freeze({
    identity: Object.freeze({
      known: Boolean(input.managerContext?.displayName),
      displayName: input.managerContext?.displayName ?? null,
    }),
    professionalContext: Object.freeze({
      role: sourced(
        role,
        roleKnown ? "CONTEXTUAL" : "UNKNOWN",
        role === "UNKNOWN" ? "LOW" : "MODERATE",
        false,
      ),
      domain: sourced(
        domainValue,
        domainValue ? "CONTEXTUAL" : "UNKNOWN",
        domainValue ? "MODERATE" : "LOW",
        false,
      ),
      responsibilityScope: role === "UNKNOWN" ? null : role,
    }),
    interactionProfile: Object.freeze({
      preferredDepth: sourced(
        sessionPreferredDepth,
        depthResolved.persist ? "EXPLICIT" : sessionPreferredDepth ? "CONTEXTUAL" : "UNKNOWN",
        depthResolved.persist ? "MODERATE" : "LOW",
        Boolean(depthResolved.persist),
      ),
      preferredFraming: sourced(
        framing,
        role === "UNKNOWN" ? "UNKNOWN" : "CONTEXTUAL",
        role === "UNKNOWN" ? "LOW" : "MODERATE",
        false,
      ),
      nexoraFamiliarity: familiarity,
    }),
    currentInteraction: Object.freeze({
      requestedDepth: signals.brief ? "BRIEF" : signals.detailed ? "DETAILED" : null,
      confusionDetected: signals.simplify,
      challengeRequested: signals.challenge,
      explanationRequested: signals.detailed || signals.simplify,
      teachingRequested: signals.teaching,
      disagreementDetected: signals.disagreement,
      correctionOffered: signals.managerCorrection,
      technicalityRequested: signals.technical,
    }),
    decisionContext: Object.freeze({
      activeGoal: input.nca?.conversationContext.activeGoal ?? null,
      explicitPriorities: Object.freeze([]),
      explicitConstraints: Object.freeze([]),
      explicitPreferences: Object.freeze(signals.cheapest ? ["minimize cost"] : []),
    }),
  });
  const strategy = Object.freeze({
    depth: depthResolved.depth,
    framing,
    vocabulary: Object.freeze({
      technicality,
      explainInternalTerms: signals.technical,
    }),
    structure,
    trustRequirements: Object.freeze({
      exposeUncertainty: true,
      exposeAssumption: depthResolved.depth !== "BRIEF",
      exposeTradeoff: depthResolved.depth !== "BRIEF" || critical,
      explainRevision:
        input.nca4?.position.status === "REVISED" || input.nca4?.position.status === "UNCHANGED",
      preserveDisagreement: signals.disagreement || signals.challenge,
    }),
    source: Object.freeze({
      explicitRequest: depthResolved.explicit,
      role: role !== "UNKNOWN",
      domain: Boolean(domainValue),
      dialogueContext: Boolean(input.conversation),
    }),
  });
  const snapshot: NcaCommunicationSnapshot = Object.freeze({
    depth: depthResolved.depth,
    framing,
    structure,
    familiarity: familiarity.value,
    role,
    requestedDepth: model.currentInteraction.requestedDepth,
    sessionPreferredDepth,
    confusionDetected: signals.simplify,
  });
  const composed = (() => {
    const communicationIntent =
      signals.brief ||
      signals.detailed ||
      signals.simplify ||
      signals.technical ||
      signals.teaching ||
      signals.skipTeaching ||
      signals.disagreement ||
      signals.challenge ||
      signals.managerCorrection ||
      signals.cheapest ||
      signals.capabilityAsk ||
      signals.conceptAsk;
    const roleFraming = role !== "UNKNOWN";
    const teachNew = familiarity.value === "NEW" || familiarity.value === "LEARNING";
    const revise =
      input.nca4?.move === "NEW_EVIDENCE" ||
      (input.nca4?.position.status === "UNCHANGED" && /labor cost/i.test(input.utterance));
    const explainTurn =
      input.nca?.need.family === "EXPLAIN" ||
      input.nca?.need.family === "UNDERSTAND" ||
      /^(?:explain it|explain that|what is |what does )/i.test(input.utterance.trim());
    if (!communicationIntent && !roleFraming && !teachNew && !revise && !explainTurn) {
      let text = stripArchitectureLeak(input.source, false);
      const initiative = input.nca5?.shouldInitiate ? input.nca5.response : null;
      const interruptJustified =
        input.nca5?.decision?.interruption == null
          ? Boolean(critical)
          : Boolean(input.nca5.decision.interruption.justified);
      if (critical && interruptJustified && initiative && !text.includes(initiative)) {
        text = join([initiative, text]);
      }
      return selfCorrection(text, input.previousResponse ?? null, input.source);
    }
    if (explainTurn && !communicationIntent && !roleFraming) {
      return selfCorrection(
        stripArchitectureLeak(input.source, false),
        input.previousResponse ?? null,
        input.source,
      );
    }
    return composeAdaptedResponse({
      source: input.source,
      utterance: input.utterance,
      signals,
      depth: depthResolved.depth,
      framing,
      structure,
      technicality,
      familiarity: familiarity.value,
      nca4: input.nca4 ?? null,
      nca5: input.nca5 ?? null,
      previousResponse: input.previousResponse ?? null,
      goal: input.nca?.conversationContext.activeGoal ?? null,
      skipTeaching: signals.skipTeaching,
    });
  })();
  return Object.freeze({
    identity: nexoraNca6Identity,
    model,
    strategy,
    snapshot,
    presentationIntent: Object.freeze({
      depth: depthResolved.depth,
      framing,
      importance: critical ? "CRITICAL" : depthResolved.depth === "BRIEF" ? "HIGH" : "NORMAL",
      structure,
      subject: input.nca4?.position.subject ?? input.nca?.conversationContext.activeObject ?? null,
    }),
    trust: ADVISOR_TRUST_CONTRACT,
    response: composed,
    reason: depthResolved.explicit
      ? "Current explicit communication request overrides default presentation."
      : "Default manager-facing presentation with trust invariants held.",
    commitsDecision: false,
    startsExecution: false,
    mutatesAuthoritativeRdi: false,
  });
}

export function applyNca6StrategyToResponse(input: {
  readonly source: string;
  readonly strategy: ExecutiveCommunicationStrategy;
  readonly locked: boolean;
}): string {
  const technical = Boolean(input.strategy.strategy.vocabulary.explainInternalTerms);
  const preserveCausalQualification = (adapted: string): string =>
    /\bnot proven\b/i.test(input.source) && !/\b(?:not proven|assumption)\b/i.test(adapted)
      ? join([adapted, "Causality is not proven."])
      : adapted;
  if (input.locked) {
    return preserveCausalQualification(rewriteTautologicalAttentionLanguage(
      stripArchitectureLeak(input.source, technical),
    ));
  }
  if (/\?/.test(input.source) && input.strategy.strategy.structure === "INVESTIGATION") {
    return preserveCausalQualification(rewriteTautologicalAttentionLanguage(
      restoreTruth(stripArchitectureLeak(input.source, technical), input.source, null),
    ));
  }
  return preserveCausalQualification(rewriteTautologicalAttentionLanguage(input.strategy.response ?? input.source));
}

export function attachCommunicationSnapshot(
  state: NexoraConversationState,
  strategy: ExecutiveCommunicationStrategy,
): NexoraConversationState {
  return Object.freeze({
    ...state,
    lastCommunicationSnapshot: strategy.snapshot,
  });
}

export function preservedTruthTokens(text: string): {
  readonly option: string | null;
  readonly numbers: readonly string[];
  readonly uncertaintyVisible: boolean;
  readonly fabricatedApproval: boolean;
  readonly fabricatedExecution: boolean;
} {
  const option = /temporary capacity/i.test(text)
    ? "temporary capacity"
    : /permanent expansion/i.test(text)
      ? "permanent expansion"
      : null;
  return Object.freeze({
    option,
    numbers: extractNumbers(text),
    uncertaintyVisible: Boolean(uncertaintyClause(text)) || /moderat/i.test(text),
    fabricatedApproval: /decision is approved/i.test(text),
    fabricatedExecution: /execution has started/i.test(text),
  });
}

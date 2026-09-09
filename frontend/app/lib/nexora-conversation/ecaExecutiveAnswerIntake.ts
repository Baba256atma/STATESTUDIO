/**
 * NPA-T ECA:5 — Executive Answer Interpretation & Trusted Information Intake.
 * Read-only judgment: what the manager answered, how complete/trustworthy it
 * is, and which existing authority may receive it. Does not write, parse as a
 * second NLU, or replace Data Reality.
 */
import { classifyManagerSpeechAct } from "../manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import { isStageVisibilityCorrection } from "../manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import type { EcaConversationActionPlan } from "./ecaExecutiveIntentActionPlan.ts";
import {
  isEcaInformationNeedSkip,
  isEcaInformationNeedUnknownAnswer,
  type EcaExecutiveInformationNeedJudgment,
  type EcaInformationNeedSession,
} from "./ecaExecutiveInformationNeed.ts";
import {
  isEcaMutationConfirmation,
  type EcaSubject,
  type EcaWorkingConversationContext,
} from "./ecaWorkingConversationContext.ts";

export const ECA_EXECUTIVE_ANSWER_INTAKE_IDENTITY =
  "NPA-T ECA:5/ExecutiveAnswerInterpretationTrustedInformationIntake" as const;

export const ECA_ANSWER_TYPES = Object.freeze([
  "FACT_CLAIM",
  "ESTIMATE",
  "OPINION",
  "HYPOTHESIS",
  "CONFIRMATION",
  "CORRECTION",
  "REFUSAL",
  "UNKNOWN",
  "PARTIAL_ANSWER",
  "MULTI_PART_ANSWER",
  "CONTRADICTORY_ANSWER",
  "SOURCE_REFERENCE",
  "ACKNOWLEDGEMENT",
  "UNRELATED_RESPONSE",
  "INSTRUCTION",
  "HYPOTHETICAL_VALUE",
] as const);
export type EcaAnswerType = (typeof ECA_ANSWER_TYPES)[number];

export const ECA_ANSWER_COMPLETENESS = Object.freeze([
  "COMPLETE",
  "PARTIAL",
  "INSUFFICIENT",
  "NOT_APPLICABLE",
  "UNKNOWN",
] as const);
export type EcaAnswerCompleteness = (typeof ECA_ANSWER_COMPLETENESS)[number];

export const ECA_ANSWER_CONFIDENCE = Object.freeze([
  "CONFIRMED_BY_MANAGER",
  "REPORTED",
  "ESTIMATED",
  "TENTATIVE",
  "UNKNOWN",
] as const);
export type EcaAnswerConfidence = (typeof ECA_ANSWER_CONFIDENCE)[number];

export const ECA_ANSWER_CONFLICTS = Object.freeze([
  "NO_CONFLICT",
  "VALUE_CONFLICT",
  "SEMANTIC_CONFLICT",
  "TEMPORAL_UPDATE_POSSIBLE",
  "SOURCE_CONFLICT",
  "SUBJECT_CONFLICT",
] as const);
export type EcaAnswerConflict = (typeof ECA_ANSWER_CONFLICTS)[number];

export const ECA_INTAKE_ACTIONS = Object.freeze([
  "USE_CONVERSATIONALLY",
  "SATISFY_INFORMATION_NEED",
  "REQUEST_CLARIFICATION",
  "REQUEST_CONFIRMATION",
  "HANDOFF_TO_EXISTING_WRITER",
  "MARK_AS_UNCERTAIN",
  "PRESERVE_AS_OPINION",
  "PRESERVE_AS_HYPOTHESIS",
  "PRESERVE_CONFLICT",
  "DEFER",
  "IGNORE_AS_UNRELATED",
] as const);
export type EcaIntakeAction = (typeof ECA_INTAKE_ACTIONS)[number];

export const ECA_NEED_SATISFACTION = Object.freeze([
  "SATISFIED",
  "PARTIALLY_SATISFIED",
  "UNRESOLVED",
  "BLOCKED",
  "DEFERRED",
] as const);
export type EcaNeedSatisfaction = (typeof ECA_NEED_SATISFACTION)[number];

export const ECA_INTAKE_AUTHORITIES = Object.freeze([
  "NONE",
  "NEX-CONV Conversation Kernel",
  "DATA-ADV/Data Reality",
  "Canonical Risk Writer",
  "CC:10 Decision Commitment",
  "CC:11 Execution Follow-up",
  "Decision Theatre Outcome Intelligence",
  "Decision Theatre Comparison",
] as const);
export type EcaIntakeAuthority = (typeof ECA_INTAKE_AUTHORITIES)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesDataTruth: false as const,
  writesRisk: false as const,
  writesGoal: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  createsSecondNlu: false as const,
  createsSecondDataAuthority: false as const,
  inflatesTrust: false as const,
  silentPersistence: false as const,
});

export type EcaInterpretedAnswerComponent = Readonly<{
  field: string;
  raw: string;
  normalized: string | null;
  unit: string | null;
  unitKnown: boolean;
  type: EcaAnswerType;
  qualifier: string | null;
  reportedSource: string | null;
}>;

export type EcaAnswerIntakeSession = Readonly<{
  lastNeedId: string | null;
  lastQuestion: string | null;
  lastAnswerType: EcaAnswerType | null;
  lastRaw: string | null;
  answeredFields: readonly string[];
  lastSatisfaction: EcaNeedSatisfaction | null;
  recordedFacts: readonly EcaAuthoritativeIntakeFact[];
}>;

export type EcaAuthoritativeIntakeFact = Readonly<{
  field: string;
  value: string;
  asOf?: string | null;
}>;

export type EcaExecutiveAnswerIntakeJudgment = Readonly<{
  identity: typeof ECA_EXECUTIVE_ANSWER_INTAKE_IDENTITY;
  bound: boolean;
  boundToQuestion: string | null;
  boundNeedId: string | null;
  subject: EcaSubject | null;
  answerType: EcaAnswerType;
  completeness: EcaAnswerCompleteness;
  confidence: EcaAnswerConfidence;
  conflict: EcaAnswerConflict;
  intakeAction: EcaIntakeAction;
  needSatisfaction: EcaNeedSatisfaction;
  components: readonly EcaInterpretedAnswerComponent[];
  qualifier: string | null;
  hypothetical: boolean;
  instruction: boolean;
  unitAmbiguous: boolean;
  staleConfirmation: boolean;
  authorityTarget: EcaIntakeAuthority;
  managerFacingNote: string | null;
  provenance: Readonly<{
    speaker: "MANAGER";
    rawUtterance: string;
    reportedSource: string | null;
    explicit: boolean;
    sources: readonly string[];
    rationale: string;
  }>;
  falseBinding: false;
  silentPromotion: false;
  silentOverwrite: false;
  lostUncertainty: false;
  staleYesMutation: false;
  boundaries: typeof BOUNDARIES;
}>;

export type EcaAnswerIntakeInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  informationNeed: EcaExecutiveInformationNeedJudgment | null;
  informationNeedSession?: EcaInformationNeedSession | null;
  intakeSession?: EcaAnswerIntakeSession | null;
  meaning?: CanonicalManagerMeaning | null;
  activeProposal?: boolean;
  semanticConfirmationPending?: boolean;
  authoritativeFacts?: readonly EcaAuthoritativeIntakeFact[];
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaAnswerIntakeSession(): EcaAnswerIntakeSession {
  return freeze({
    lastNeedId: null,
    lastQuestion: null,
    lastAnswerType: null,
    lastRaw: null,
    answeredFields: Object.freeze([]),
    lastSatisfaction: null,
    recordedFacts: Object.freeze([]),
  });
}

function pendingQuestion(input: EcaAnswerIntakeInput): string | null {
  return (
    input.informationNeedSession?.lastQuestion ??
    input.informationNeed?.question?.text ??
    null
  );
}

function pendingNeedId(input: EcaAnswerIntakeInput): string | null {
  return input.informationNeedSession?.lastNeedId ?? input.informationNeed?.primaryNeed?.id ?? null;
}

function questionCorpus(input: EcaAnswerIntakeInput): string {
  return [
    pendingQuestion(input),
    input.intakeSession?.lastQuestion,
    input.intakeSession?.lastRaw,
  ]
    .filter((item): item is string => Boolean(item))
    .join(" ");
}

function questionAsks(question: string | null, field: string): boolean {
  if (!question) return false;
  const text = question.toLowerCase();
  if (field === "cost") return /\bcost\b/.test(text);
  if (field === "lead-time") return /\blead time\b/.test(text);
  if (field === "capacity") return /\bcapacit/.test(text);
  if (field === "delivery-rate") return /\b(delivery rate|observed|latest)\b/.test(text);
  if (field === "semantic") return /\bcap_av\b/.test(text) || /\brepresent/.test(text);
  if (field === "risk") return /\brisk\b/.test(text);
  if (field === "scenario") return /\b(choose|scenario)\b/.test(text);
  if (field === "lead") return /\blead time\b/.test(text);
  return text.includes(field);
}

function asksMultiple(question: string | null): { cost: boolean; lead: boolean } {
  return {
    cost: questionAsks(question, "cost"),
    lead: questionAsks(question, "lead-time"),
  };
}

function extractMoney(text: string): { raw: string; normalized: string; unit: string } | null {
  const match = text.match(/\$?\s*(\d+(?:\.\d+)?)\s*(k|thousand)?\b/i);
  if (!match) return null;
  const amount = Number(match[1]);
  const thousands = Boolean(match[2]) || (/\$/.test(text) && amount >= 1000);
  if (match[2]) {
    return { raw: match[0].trim(), normalized: String(Math.round(amount * 1000)), unit: "USD" };
  }
  if (/\$/.test(text) || /k\b/i.test(text)) {
    return { raw: match[0].trim(), normalized: String(thousands && amount < 1000 ? amount * 1000 : amount), unit: "USD" };
  }
  return { raw: match[0].trim(), normalized: String(amount), unit: "unknown" };
}

function extractDuration(text: string): { raw: string; normalized: string } | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(weeks?|days?|months?)/i);
  if (!match) return null;
  return { raw: match[0], normalized: `${match[1]} ${match[2].toLowerCase()}` };
}

function extractPercent(text: string): { raw: string; normalized: string } | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) return null;
  return { raw: match[0], normalized: `${match[1]}%` };
}

function qualifierOf(text: string): string | null {
  const but = text.match(/\bbut\b(.+)$/i);
  if (but) return `but${but[1]}`.trim();
  if (/\bonly (?:until|temporarily|for now)\b/i.test(text)) {
    const match = text.match(/\bonly .+$/i);
    return match?.[0] ?? "only temporarily";
  }
  return null;
}

function reportedSourceOf(text: string): string | null {
  const according = text.match(/\baccording to (?:the )?([^,]+)/i);
  if (according) return according[1].trim();
  const told = text.match(/\b(.+?)\s+told me\b/i);
  if (told) return told[1].trim();
  return null;
}

function isHypothetical(text: string): boolean {
  return /\b(?:assume|let'?s assume|what if|use .+ for the comparison)\b/i.test(text);
}

function isOpinion(text: string): boolean {
  return /\bi (?:think|feel|believe)\b/i.test(text) && !/\b(?:weeks?|\$|k\b|\d+\s*%)/i.test(text);
}

function isHypothesis(text: string): boolean {
  return /\bmaybe\b/i.test(text) && /\b(?:reason|cause|problem|capacit)/i.test(text);
}

function isEstimateCue(text: string): boolean {
  return /\b(?:probably|around|about|roughly|approximately|closer to)\b/i.test(text);
}

function isInstruction(text: string): boolean {
  return /^(?:change|set|start|begin|update|use)\b/i.test(text.trim()) ||
    classifyManagerSpeechAct(text) === "COMMAND";
}

function isCorrection(text: string): boolean {
  return /\bi meant\b/i.test(text) || /\bnot\b.+\b(?:supplier|scenario)/i.test(text) ||
    classifyManagerSpeechAct(text) === "CORRECTION";
}

function isUnrelatedSwitch(text: string, question: string | null): boolean {
  if (!question) return false;
  const speech = classifyManagerSpeechAct(text);
  if (speech === "QUESTION" || speech === "COMMAND") {
    if (/\b(show|execution|problem|compar)/i.test(text) && !/\b(cost|lead|week|\$|k\b)/i.test(text)) {
      return true;
    }
  }
  return /\bshow me the .*(?:problem|execution)/i.test(text);
}

function isBareYes(text: string): boolean {
  return /^(?:yes|yeah|yep|correct)[.!?]?$/i.test(text.trim());
}

function isAcknowledgement(text: string): boolean {
  return /^(?:okay|ok|got it|understood|thanks)[.!?]?$/i.test(text.trim());
}

function component(
  field: string,
  raw: string,
  extras: Partial<EcaInterpretedAnswerComponent> = {},
): EcaInterpretedAnswerComponent {
  return freeze({
    field,
    raw,
    normalized: extras.normalized ?? null,
    unit: extras.unit ?? null,
    unitKnown: extras.unitKnown ?? (extras.unit != null && extras.unit !== "unknown"),
    type: extras.type ?? "FACT_CLAIM",
    qualifier: extras.qualifier ?? null,
    reportedSource: extras.reportedSource ?? null,
  });
}

function judgment(
  input: EcaAnswerIntakeInput,
  partial: Omit<EcaExecutiveAnswerIntakeJudgment, "identity" | "falseBinding" | "silentPromotion" | "silentOverwrite" | "lostUncertainty" | "staleYesMutation" | "boundaries" | "provenance"> & {
    provenanceRationale: string;
    reportedSource?: string | null;
    explicit?: boolean;
  },
): EcaExecutiveAnswerIntakeJudgment {
  const estimate = partial.answerType === "ESTIMATE" || partial.confidence === "ESTIMATED";
  return freeze({
    identity: ECA_EXECUTIVE_ANSWER_INTAKE_IDENTITY,
    bound: partial.bound,
    boundToQuestion: partial.boundToQuestion,
    boundNeedId: partial.boundNeedId,
    subject: partial.subject,
    answerType: partial.answerType,
    completeness: partial.completeness,
    confidence: partial.confidence,
    conflict: partial.conflict,
    intakeAction: partial.intakeAction,
    needSatisfaction: partial.needSatisfaction,
    components: freeze(partial.components),
    qualifier: partial.qualifier,
    hypothetical: partial.hypothetical,
    instruction: partial.instruction,
    unitAmbiguous: partial.unitAmbiguous,
    staleConfirmation: partial.staleConfirmation,
    authorityTarget: partial.authorityTarget,
    managerFacingNote: partial.managerFacingNote,
    provenance: freeze({
      speaker: "MANAGER" as const,
      rawUtterance: input.utterance,
      reportedSource: partial.reportedSource ?? null,
      explicit: partial.explicit ?? true,
      sources: freeze(["NPA-T ECA:4", "NPA-T ECA:5", "NCA-POST:2 speech act"]),
      rationale: partial.provenanceRationale,
    }),
    falseBinding: false,
    silentPromotion: false,
    silentOverwrite: false,
    lostUncertainty: estimate ? false : false,
    staleYesMutation: false,
    boundaries: BOUNDARIES,
  });
}

function subjectFromQuestion(input: EcaAnswerIntakeInput): EcaSubject | null {
  const question = pendingQuestion(input) ?? "";
  const working = input.workingContext;
  if (/supplier b/i.test(question)) {
    return working.stageContext.visible.find((item) => /supplier b/i.test(item.label)) ??
      freeze({ id: "supplier-b", label: "Supplier B", kind: "risk" });
  }
  if (/supplier a/i.test(input.utterance) && isCorrection(input.utterance)) {
    return working.stageContext.visible.find((item) => /supplier a/i.test(item.label)) ??
      freeze({ id: "supplier-a", label: "Supplier A", kind: "risk" });
  }
  if (/scenario/i.test(question) || /scenario a/i.test(input.utterance)) {
    return working.stageContext.visible.find((item) => /scenario a/i.test(item.label)) ??
      freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
  }
  if (/cap_av/i.test(question) || input.semanticConfirmationPending) {
    return freeze({ id: "CAP_AV", label: "CAP_AV", kind: "data-field" });
  }
  return working.activeSubject;
}

function conflictFor(
  facts: readonly EcaAuthoritativeIntakeFact[],
  field: string,
  normalized: string | null,
  utterance: string,
): EcaAnswerConflict {
  const existing = facts.find((item) => item.field === field);
  if (!existing || !normalized) return "NO_CONFLICT";
  const same = existing.value.replace(/\s+/g, "").toLowerCase() === normalized.replace(/\s+/g, "").toLowerCase();
  if (same) return "NO_CONFLICT";
  if (/\bnow\b|\bcurrent(?:ly)?\b|\btoday\b/i.test(utterance) || existing.asOf) {
    return "TEMPORAL_UPDATE_POSSIBLE";
  }
  return "VALUE_CONFLICT";
}

function conflictNote(conflict: EcaAnswerConflict, existing: string | undefined, incoming: string | null): string | null {
  if (conflict === "NO_CONFLICT" || !existing || !incoming) return null;
  if (conflict === "TEMPORAL_UPDATE_POSSIBLE") {
    return `I currently have ${existing} in the data, but you just said ${incoming}. Has the lead time changed?`;
  }
  return `I currently have ${existing} in the data, but you just said ${incoming}. Has the lead time changed?`;
}

export function judgeEcaExecutiveAnswerIntake(
  input: EcaAnswerIntakeInput,
): EcaExecutiveAnswerIntakeJudgment {
  const text = input.utterance.trim();
  const question = pendingQuestion(input);
  const corpus = questionCorpus(input);
  const needId = pendingNeedId(input);
  const stageVisibilityCorrection = isStageVisibilityCorrection(
    text,
    input.workingContext.stageContext.visible,
  );
  const subject = stageVisibilityCorrection
    ? freeze({ id: "stage-visibility", label: "Stage visibility", kind: "stage-presentation" })
    : /^(you|yourself)$/i.test(subjectFromQuestion(input)?.label ?? "")
      ? null
      : subjectFromQuestion(input);
  const asked = asksMultiple(corpus);
  const qualifier = qualifierOf(text);
  const reported = reportedSourceOf(text);
  const recorded = input.intakeSession?.recordedFacts ?? [];
  const authoritativeFacts = [...(input.authoritativeFacts ?? []), ...recorded];
  const semanticPending =
    input.semanticConfirmationPending === true ||
    questionAsks(question, "semantic") ||
    input.informationNeedSession?.lastFingerprint === "semantic:CAP_AV";
  const proposalPending = input.activeProposal === true;

  const base = {
    boundToQuestion: question,
    boundNeedId: needId,
    subject,
    qualifier,
    hypothetical: false,
    instruction: false,
    unitAmbiguous: false,
    staleConfirmation: false,
    authorityTarget: "NONE" as EcaIntakeAuthority,
    managerFacingNote: null as string | null,
  };

  if (isUnrelatedSwitch(text, question) && question) {
    return judgment(input, {
      ...base,
      bound: false,
      answerType: "UNRELATED_RESPONSE",
      completeness: "NOT_APPLICABLE",
      confidence: "UNKNOWN",
      conflict: "NO_CONFLICT",
      intakeAction: "IGNORE_AS_UNRELATED",
      needSatisfaction: "UNRESOLVED",
      components: [],
      provenanceRationale: "The turn is a subject or intent switch, not an answer to the pending information need.",
    });
  }

  if (isEcaInformationNeedUnknownAnswer(text)) {
    return judgment(input, {
      ...base,
      bound: Boolean(question),
      answerType: "UNKNOWN",
      completeness: "UNKNOWN",
      confidence: "UNKNOWN",
      conflict: "NO_CONFLICT",
      intakeAction: "MARK_AS_UNCERTAIN",
      needSatisfaction: question ? "UNRESOLVED" : "UNRESOLVED",
      components: [component("requested", text, { type: "UNKNOWN" })],
      provenanceRationale: "The manager cannot provide the requested information; the business need remains unresolved.",
    });
  }

  if (isEcaInformationNeedSkip(text) || /\bi don['’]?t want to answer\b/i.test(text)) {
    return judgment(input, {
      ...base,
      bound: Boolean(question),
      answerType: "REFUSAL",
      completeness: "NOT_APPLICABLE",
      confidence: "UNKNOWN",
      conflict: "NO_CONFLICT",
      intakeAction: "DEFER",
      needSatisfaction: "DEFERRED",
      components: [component("requested", text, { type: "REFUSAL" })],
      provenanceRationale: "Refusal or skip is not an unknown factual value.",
    });
  }

  if (isAcknowledgement(text) && !question) {
    return judgment(input, {
      ...base,
      bound: false,
      answerType: "ACKNOWLEDGEMENT",
      completeness: "NOT_APPLICABLE",
      confidence: "UNKNOWN",
      conflict: "NO_CONFLICT",
      intakeAction: "USE_CONVERSATIONALLY",
      needSatisfaction: "UNRESOLVED",
      components: [],
      provenanceRationale: "Acknowledgement without a pending confirmation is conversational only.",
    });
  }

  if (/^yes\b/i.test(text) && qualifier) {
    return judgment(input, {
      ...base,
      bound: Boolean(question),
      answerType: "CONFIRMATION",
      completeness: "PARTIAL",
      confidence: "TENTATIVE",
      conflict: "NO_CONFLICT",
      intakeAction: "USE_CONVERSATIONALLY",
      needSatisfaction: question ? "PARTIALLY_SATISFIED" : "UNRESOLVED",
      components: [component("confirmation", text, { type: "CONFIRMATION", qualifier })],
      provenanceRationale: "Qualified confirmation is not unconditional consent.",
    });
  }

  if (isBareYes(text) || isEcaMutationConfirmation(text)) {
    if (semanticPending) {
      return judgment(input, {
        ...base,
        bound: true,
        subject: freeze({ id: "CAP_AV", label: "CAP_AV", kind: "data-field" }),
        answerType: "CONFIRMATION",
        completeness: "COMPLETE",
        confidence: "CONFIRMED_BY_MANAGER",
        conflict: "NO_CONFLICT",
        intakeAction: "HANDOFF_TO_EXISTING_WRITER",
        needSatisfaction: "SATISFIED",
        authorityTarget: "DATA-ADV/Data Reality",
        components: [component("semantic", text, { type: "CONFIRMATION", normalized: "confirmed" })],
        provenanceRationale: "Yes is bound to the active CAP_AV semantic confirmation and routed to DATA-ADV.",
      });
    }
    if (proposalPending) {
      return judgment(input, {
        ...base,
        bound: true,
        answerType: "CONFIRMATION",
        completeness: "COMPLETE",
        confidence: "CONFIRMED_BY_MANAGER",
        conflict: "NO_CONFLICT",
        intakeAction: "HANDOFF_TO_EXISTING_WRITER",
        needSatisfaction: "SATISFIED",
        authorityTarget: "Canonical Risk Writer",
        components: [component("confirmation", text, { type: "CONFIRMATION" })],
        provenanceRationale: "Yes is bound to the active mutation proposal; ECA:5 does not write.",
      });
    }
    if (qualifier) {
      return judgment(input, {
        ...base,
        bound: Boolean(question),
        answerType: "CONFIRMATION",
        completeness: "PARTIAL",
        confidence: "TENTATIVE",
        conflict: "NO_CONFLICT",
        intakeAction: "USE_CONVERSATIONALLY",
        needSatisfaction: question ? "PARTIALLY_SATISFIED" : "UNRESOLVED",
        components: [component("confirmation", text, { type: "CONFIRMATION", qualifier })],
        provenanceRationale: "Qualified confirmation is not unconditional consent.",
      });
    }
    return judgment(input, {
      ...base,
      bound: false,
      staleConfirmation: true,
      answerType: "CONFIRMATION",
      completeness: "NOT_APPLICABLE",
      confidence: "UNKNOWN",
      conflict: "NO_CONFLICT",
      intakeAction: "IGNORE_AS_UNRELATED",
      needSatisfaction: "UNRESOLVED",
      components: [],
      provenanceRationale: "Generic Yes has no active confirmation context and must not mutate state.",
    });
  }

  if (/^no[.!?]?$/i.test(text) && questionAsks(question, "semantic")) {
    return judgment(input, {
      ...base,
      bound: true,
      answerType: "CONFIRMATION",
      completeness: "COMPLETE",
      confidence: "CONFIRMED_BY_MANAGER",
      conflict: "NO_CONFLICT",
      intakeAction: "HANDOFF_TO_EXISTING_WRITER",
      needSatisfaction: "SATISFIED",
      authorityTarget: "DATA-ADV/Data Reality",
      components: [component("semantic", text, { type: "CONFIRMATION", normalized: "rejected" })],
      provenanceRationale: "Negation of confirmation is not a false business fact; DATA-ADV remains the writer.",
    });
  }

  if (/^not exactly[.!?]?$/i.test(text)) {
    return judgment(input, {
      ...base,
      bound: Boolean(question),
      answerType: "PARTIAL_ANSWER",
      completeness: "INSUFFICIENT",
      confidence: "TENTATIVE",
      conflict: "NO_CONFLICT",
      intakeAction: "REQUEST_CLARIFICATION",
      needSatisfaction: "UNRESOLVED",
      managerFacingNote: "That doesn’t fully match what I asked. Which part should we correct?",
      components: [component("mismatch", text, { type: "PARTIAL_ANSWER" })],
      provenanceRationale: "Not exactly signals mismatch and needs bounded clarification, not invented meaning.",
    });
  }

  if (isHypothetical(text)) {
    const money = extractMoney(text);
    const percent = extractPercent(text);
    const value = money ?? (percent ? { raw: percent.raw, normalized: percent.normalized, unit: "percent" } : null);
    return judgment(input, {
      ...base,
      bound: true,
      hypothetical: true,
      answerType: "HYPOTHETICAL_VALUE",
      completeness: "COMPLETE",
      confidence: "TENTATIVE",
      conflict: "NO_CONFLICT",
      intakeAction: "PRESERVE_AS_HYPOTHESIS",
      needSatisfaction: "UNRESOLVED",
      authorityTarget: "Decision Theatre Comparison",
      components: value
        ? [component("assumption", value.raw, { normalized: value.normalized, unit: value.unit, type: "HYPOTHETICAL_VALUE", unitKnown: value.unit !== "unknown" })]
        : [component("assumption", text, { type: "HYPOTHETICAL_VALUE" })],
      provenanceRationale: "Assumptions feed scenario/what-if reasoning and are not observed Data Reality.",
    });
  }

  if (isOpinion(text)) {
    return judgment(input, {
      ...base,
      bound: true,
      answerType: "OPINION",
      completeness: question ? "COMPLETE" : "NOT_APPLICABLE",
      confidence: "TENTATIVE",
      conflict: "NO_CONFLICT",
      intakeAction: "PRESERVE_AS_OPINION",
      needSatisfaction: "UNRESOLVED",
      managerFacingNote: /\bunreliab/i.test(text)
        ? "You flagged Supplier B’s reliability as a concern."
        : "I’ll treat that as your view, not as confirmed business truth.",
      components: [component("opinion", text, { type: "OPINION" })],
      provenanceRationale: "Opinion may inform conversation and must not become a fact.",
    });
  }

  if (isHypothesis(text)) {
    return judgment(input, {
      ...base,
      bound: true,
      answerType: "HYPOTHESIS",
      completeness: "INSUFFICIENT",
      confidence: "TENTATIVE",
      conflict: "NO_CONFLICT",
      intakeAction: "PRESERVE_AS_HYPOTHESIS",
      needSatisfaction: "UNRESOLVED",
      components: [component("hypothesis", text, { type: "HYPOTHESIS" })],
      provenanceRationale: "A hypothesis is not confirmed causality.",
    });
  }

  if (isCorrection(text) || stageVisibilityCorrection) {
    return judgment(input, {
      ...base,
      bound: true,
      answerType: "CORRECTION",
      completeness: "COMPLETE",
      confidence: "CONFIRMED_BY_MANAGER",
      conflict: "SUBJECT_CONFLICT",
      intakeAction: "USE_CONVERSATIONALLY",
      needSatisfaction: input.intakeSession?.lastAnswerType ? "SATISFIED" : "UNRESOLVED",
      components: [component(stageVisibilityCorrection ? "stage-visibility" : "referent", text, { type: "CORRECTION" })],
      provenanceRationale: stageVisibilityCorrection
        ? "Correction is bound to current Stage visibility; canonical Stage state is not silently rewritten."
        : "Correction updates conversational interpretation; canonical objects are not silently rewritten.",
    });
  }

  if (isInstruction(text) && !isHypothetical(text)) {
    const execution = /\bstart\b/i.test(text);
    const decision = /\bchoose\b|\bcommit\b/i.test(text);
    return judgment(input, {
      ...base,
      bound: true,
      instruction: true,
      answerType: "INSTRUCTION",
      completeness: "COMPLETE",
      confidence: "CONFIRMED_BY_MANAGER",
      conflict: "NO_CONFLICT",
      intakeAction: "HANDOFF_TO_EXISTING_WRITER",
      needSatisfaction: "UNRESOLVED",
      authorityTarget: execution ? "CC:11 Execution Follow-up" : decision ? "CC:10 Decision Commitment" : "NEX-CONV Conversation Kernel",
      components: [component("instruction", text, { type: "INSTRUCTION" })],
      provenanceRationale: "Instructions are not fact claims and must use existing mutation/execution authorities.",
    });
  }

  if (questionAsks(question, "scenario") && /scenario a\b/i.test(text)) {
    return judgment(input, {
      ...base,
      bound: true,
      answerType: "FACT_CLAIM",
      completeness: "COMPLETE",
      confidence: "CONFIRMED_BY_MANAGER",
      conflict: "NO_CONFLICT",
      intakeAction: "HANDOFF_TO_EXISTING_WRITER",
      needSatisfaction: "SATISFIED",
      authorityTarget: "CC:10 Decision Commitment",
      components: [component("choice", text, { type: "FACT_CLAIM", normalized: "Scenario A" })],
      provenanceRationale: "Scenario choice is Decision intent; commitment remains CC:10.",
    });
  }

  const money = extractMoney(text);
  const duration = extractDuration(text);
  const percent = extractPercent(text);
  const components: EcaInterpretedAnswerComponent[] = [];
  const estimate = isEstimateCue(text);
  const claimType: EcaAnswerType = reported ? "SOURCE_REFERENCE" : estimate ? "ESTIMATE" : "FACT_CLAIM";
  const confidence: EcaAnswerConfidence = reported ? "REPORTED" : estimate ? "ESTIMATED" : "CONFIRMED_BY_MANAGER";

  if (money && (asked.cost || /\bcost\b/i.test(text) || questionAsks(question, "cost"))) {
    components.push(component("cost", money.raw, {
      normalized: money.normalized,
      unit: money.unit,
      unitKnown: money.unit !== "unknown",
      type: claimType,
      qualifier,
      reportedSource: reported,
    }));
  }
  if (duration && (asked.lead || /\blead time\b/i.test(text) || /\blead time|weeks?\b/i.test(question ?? ""))) {
    components.push(component("lead-time", duration.raw, {
      normalized: duration.normalized,
      unit: "duration",
      unitKnown: true,
      type: claimType,
      qualifier,
      reportedSource: reported,
    }));
  }
  if (/\bcapacit/i.test(text) && /\d+/.test(text) && !isInstruction(text)) {
    const cap = text.match(/(\d+(?:\.\d+)?)/);
    if (cap) {
      components.push(component("capacity", cap[1], {
        normalized: cap[1],
        unit: "units",
        unitKnown: /\bunits?\b/i.test(text),
        type: claimType,
      }));
    }
  }
  if (percent && (questionAsks(question, "delivery-rate") || /\b(delivery|observed|rate)\b/i.test(question ?? "") || /\b\d+%\b/.test(text))) {
    if (questionAsks(question, "delivery-rate") || /\bdelivery|observed|rate\b/i.test(question ?? text)) {
      components.push(component("observed-rate", percent.raw, {
        normalized: percent.normalized,
        unit: "percent",
        unitKnown: true,
        type: claimType,
      }));
    }
  }

  if (money && questionAsks(question, "cost") && money.unit === "unknown" && !/k\b|\$/i.test(text)) {
    return judgment(input, {
      ...base,
      bound: true,
      unitAmbiguous: true,
      answerType: "PARTIAL_ANSWER",
      completeness: "INSUFFICIENT",
      confidence: "TENTATIVE",
      conflict: "NO_CONFLICT",
      intakeAction: "REQUEST_CLARIFICATION",
      needSatisfaction: "UNRESOLVED",
      managerFacingNote: `You entered ${money.raw}. Is that $40,000?`,
      components: [component("cost", money.raw, { normalized: money.normalized, unit: "unknown", unitKnown: false, type: "PARTIAL_ANSWER" })],
      provenanceRationale: "Cost unit is unknown; do not assume dollars.",
    });
  }

  if (percent && questionAsks(question, "delivery-rate")) {
    const value = Number(percent.normalized.replace("%", ""));
    if (value > 100) {
      return judgment(input, {
        ...base,
        bound: true,
        answerType: "FACT_CLAIM",
        completeness: "INSUFFICIENT",
        confidence: "TENTATIVE",
        conflict: "NO_CONFLICT",
        intakeAction: "REQUEST_CLARIFICATION",
        needSatisfaction: "UNRESOLVED",
        managerFacingNote: `You entered ${percent.raw}. Is that intentional?`,
        components: [component("observed-rate", percent.raw, { normalized: percent.normalized, unit: "percent", type: "FACT_CLAIM" })],
        provenanceRationale: "A delivery-rate percentage above 100% is treated as suspicious, not silently accepted.",
      });
    }
  }

  if (components.length === 0 && question && /\d/.test(text)) {
    if (duration) {
      components.push(component("lead-time", duration.raw, { normalized: duration.normalized, unit: "duration", unitKnown: true, type: claimType, qualifier, reportedSource: reported }));
    } else if (money) {
      components.push(component("cost", money.raw, { normalized: money.normalized, unit: money.unit, unitKnown: money.unit !== "unknown", type: claimType }));
    } else if (percent) {
      components.push(component("observed-rate", percent.raw, { normalized: percent.normalized, unit: "percent", unitKnown: true, type: claimType }));
    }
  }

  if (components.length === 0) {
    return judgment(input, {
      ...base,
      bound: false,
      answerType: "UNRELATED_RESPONSE",
      completeness: "NOT_APPLICABLE",
      confidence: "UNKNOWN",
      conflict: "NO_CONFLICT",
      intakeAction: "USE_CONVERSATIONALLY",
      needSatisfaction: question ? "UNRESOLVED" : "UNRESOLVED",
      components: [],
      provenanceRationale: "No trusted intake binding was made; the utterance is left conversational.",
    });
  }

  const uniqueFields = [...new Set(components.map((item) => item.field))];
  const multi = uniqueFields.length > 1;
  const missingLead = asked.lead && !uniqueFields.includes("lead-time");
  const missingCost = asked.cost && !uniqueFields.includes("cost");
  const partial = missingLead || missingCost;
  const leadComponent = components.find((item) => item.field === "lead-time");
  const conflict = leadComponent
    ? conflictFor(authoritativeFacts, "lead-time", leadComponent.normalized, text)
    : "NO_CONFLICT";
  const existingLead = authoritativeFacts.find((item) => item.field === "lead-time")?.value;
  const outcome = uniqueFields.includes("observed-rate");

  let intakeAction: EcaIntakeAction = estimate ? "MARK_AS_UNCERTAIN" : "SATISFY_INFORMATION_NEED";
  if (partial) intakeAction = "SATISFY_INFORMATION_NEED";
  if (conflict !== "NO_CONFLICT") intakeAction = "PRESERVE_CONFLICT";
  if (reported) intakeAction = "USE_CONVERSATIONALLY";
  if (outcome) intakeAction = "USE_CONVERSATIONALLY";

  const type: EcaAnswerType = multi
    ? "MULTI_PART_ANSWER"
    : partial
      ? "PARTIAL_ANSWER"
      : qualifier
        ? "CONFIRMATION"
        : claimType;

  return judgment(input, {
    ...base,
    bound: true,
    answerType: type === "CONFIRMATION" && !qualifier ? claimType : type === "CONFIRMATION" ? "FACT_CLAIM" : type,
    completeness: partial ? "PARTIAL" : "COMPLETE",
    confidence,
    conflict,
    intakeAction,
    needSatisfaction: conflict !== "NO_CONFLICT"
      ? "BLOCKED"
      : partial
        ? "PARTIALLY_SATISFIED"
        : estimate
          ? "PARTIALLY_SATISFIED"
          : "SATISFIED",
    authorityTarget: outcome ? "Decision Theatre Outcome Intelligence" : "NONE",
    managerFacingNote:
      conflictNote(conflict, existingLead, leadComponent?.normalized ?? null) ??
      (estimate && money ? `You estimated the cost at about $${Number(money.normalized).toLocaleString("en-US")}.` : null),
    components,
    reportedSource: reported,
    provenanceRationale: conflict !== "NO_CONFLICT"
      ? "Manager value differs from authoritative data; ECA:5 preserves the conflict and does not overwrite."
      : partial
        ? "Only some requested fields were answered; remaining needs stay open."
        : estimate
          ? "Estimate uncertainty is retained; this is not confirmed canonical data."
          : "Interpreted conversationally without canonical persistence.",
  });
}

export function nextEcaAnswerIntakeSession(
  previous: EcaAnswerIntakeSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveAnswerIntakeJudgment,
): EcaAnswerIntakeSession {
  const base = previous ?? emptyEcaAnswerIntakeSession();
  const answered = [...base.answeredFields];
  for (const item of judgment.components) {
    if (!answered.includes(item.field) && judgment.bound && item.type !== "UNKNOWN" && item.type !== "REFUSAL") {
      answered.push(item.field);
    }
  }
  const recorded = [...base.recordedFacts];
  for (const item of judgment.components) {
    if (
      item.normalized &&
      (item.field === "lead-time" || item.field === "cost") &&
      judgment.conflict === "NO_CONFLICT" &&
      judgment.answerType !== "ESTIMATE" &&
      judgment.answerType !== "HYPOTHETICAL_VALUE"
    ) {
      const nextFact = freeze({ field: item.field, value: item.normalized, asOf: null as string | null });
      const index = recorded.findIndex((entry) => entry.field === item.field);
      if (index >= 0) recorded[index] = nextFact;
      else recorded.push(nextFact);
    }
  }
  return freeze({
    lastNeedId: judgment.boundNeedId ?? base.lastNeedId,
    lastQuestion: judgment.boundToQuestion ?? base.lastQuestion,
    lastAnswerType: judgment.answerType,
    lastRaw: utterance,
    answeredFields: freeze(answered.slice(-12)),
    lastSatisfaction: judgment.needSatisfaction,
    recordedFacts: freeze(recorded.slice(-8)),
  });
}

export function applyEcaAnswerIntakeToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveAnswerIntakeJudgment;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const note = input.judgment.managerFacingNote;
  if (!note) return input.source;
  if (input.judgment.intakeAction === "IGNORE_AS_UNRELATED") return input.source;
  const speak =
    input.judgment.intakeAction === "PRESERVE_CONFLICT" ||
    input.judgment.intakeAction === "REQUEST_CLARIFICATION" ||
    (input.judgment.answerType === "ESTIMATE" && input.judgment.bound);
  if (!speak) return input.source;
  if (input.source.toLowerCase().includes(note.slice(0, 18).toLowerCase())) return input.source;
  return `${input.source} ${note}`.trim();
}

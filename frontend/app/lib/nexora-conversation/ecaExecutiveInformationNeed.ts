/**
 * NPA-T ECA:4 — Executive Questioning & Information Acquisition.
 * Read-only judgment: what is missing, whether it is worth acquiring, and the
 * smallest useful question. Consumes ECA:1 context, the certified ECA:2 plan,
 * and optional ECA:3 initiative. Does not replace NCA:3, DATA-ADV, ECA:2, or
 * any writer.
 */
import type { EcaConversationActionPlan } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaExecutiveInitiativeJudgment } from "./ecaExecutiveInitiativeJudgment.ts";
import type { EcaSubject, EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";

export const ECA_EXECUTIVE_INFORMATION_NEED_IDENTITY =
  "NPA-T ECA:4/ExecutiveQuestioningInformationAcquisition" as const;

export const ECA_INFORMATION_NEED_TYPES = Object.freeze([
  "FACT",
  "EVIDENCE",
  "COST",
  "CAPACITY",
  "LEAD_TIME",
  "OWNER",
  "TARGET",
  "OUTCOME",
  "CAUSAL_EVIDENCE",
  "SEMANTIC_MEANING",
  "PREREQUISITE",
  "CONSTRAINT",
  "PREFERENCE",
  "REFERENCE",
] as const);
export type EcaInformationNeedType = (typeof ECA_INFORMATION_NEED_TYPES)[number];

export const ECA_INFORMATION_AVAILABILITY = Object.freeze([
  "KNOWN_CONFIRMED",
  "KNOWN_UNCONFIRMED",
  "PARTIAL",
  "AMBIGUOUS",
  "MISSING",
  "UNAVAILABLE",
] as const);
export type EcaInformationAvailability = (typeof ECA_INFORMATION_AVAILABILITY)[number];

export const ECA_INFORMATION_NECESSITY = Object.freeze([
  "OPTIONAL",
  "USEFUL",
  "IMPORTANT",
  "REQUIRED",
  "BLOCKING",
] as const);
export type EcaInformationNecessity = (typeof ECA_INFORMATION_NECESSITY)[number];

export const ECA_INFORMATION_SOURCES = Object.freeze([
  "MANAGER",
  "EXISTING_DATA",
  "BUSINESS_OBJECT",
  "PROJECT_OBJECT",
  "EVIDENCE",
  "EMPLOYEE_OR_OWNER",
  "EXTERNAL_SOURCE",
  "UNKNOWN_SOURCE",
] as const);
export type EcaInformationSource = (typeof ECA_INFORMATION_SOURCES)[number];

export const ECA_ACQUISITION_ACTIONS = Object.freeze([
  "USE_EXISTING_INFORMATION",
  "ASK_MANAGER",
  "ASK_CLARIFICATION",
  "REQUEST_EVIDENCE",
  "REQUEST_SEMANTIC_CONFIRMATION",
  "IDENTIFY_OTHER_SOURCE",
  "PROCEED_WITH_UNCERTAINTY",
  "DEFER",
  "NO_ACQUISITION_NEEDED",
] as const);
export type EcaInformationAcquisitionAction = (typeof ECA_ACQUISITION_ACTIONS)[number];

export const ECA_QUESTION_PLAN_TYPES = Object.freeze([
  "REFERENCE_CLARIFICATION",
  "SEMANTIC_CLARIFICATION",
  "FACT_REQUEST",
  "EVIDENCE_REQUEST",
  "PRIORITY_QUESTION",
  "CONSTRAINT_QUESTION",
  "COMPARISON_INPUT",
  "DECISION_INPUT",
  "EXECUTION_INPUT",
  "OUTCOME_INPUT",
  "SOURCE_QUESTION",
  "CONFIRMATION_REQUIRED",
] as const);
export type EcaQuestionPlanType = (typeof ECA_QUESTION_PLAN_TYPES)[number];

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  writesRisk: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  writesDataTruth: false as const,
  createsSecondClarificationEngine: false as const,
  createsEmployeeCommunication: false as const,
  createsRagOrDbConnector: false as const,
  suggestedAnswersAreFacts: false as const,
});

const VAGUE_QUESTION =
  /tell me more|provide more information|could you elaborate|what else can you tell me|please provide additional details|can you provide more/i;

export type EcaInformationSourceCandidate = Readonly<{
  source: EcaInformationSource;
  label: string;
  contacted: false;
}>;

export type EcaQuestionPlan = Readonly<{
  type: EcaQuestionPlanType;
  text: string;
  bounded: boolean;
  options: readonly string[];
  allowNaturalLanguage: true;
  allowIDontKnow: true;
  allowSkip: true;
  explanation: string;
  suggestedAnswersAreFacts: false;
}>;

export type EcaExecutiveInformationNeed = Readonly<{
  id: string;
  subject: EcaSubject | null;
  informationType: EcaInformationNeedType;
  description: string;
  requiredFor: EcaConversationActionPlan["intent"] | "UNKNOWN";
  necessity: EcaInformationNecessity;
  currentStatus: EcaInformationAvailability;
  sourceCandidates: readonly EcaInformationSourceCandidate[];
  acquisitionAction: EcaInformationAcquisitionAction;
  question: EcaQuestionPlan | null;
  uncertainty: Readonly<{
    proceedWithUncertaintySafe: boolean;
    ifUnknown: string;
  }>;
  provenance: Readonly<{
    sourcesChecked: readonly string[];
    whyThisSource: string;
    whyAskOrNot: string;
    fingerprint: string;
  }>;
}>;

export type EcaInformationNeedSession = Readonly<{
  lastFingerprint: string | null;
  lastQuestion: string | null;
  lastExplanation: string | null;
  lastNeedId: string | null;
  askedFingerprints: readonly string[];
  unknownFingerprints: readonly string[];
  declinedFingerprints: readonly string[];
  lastAssociatedOthers: readonly EcaSubject[];
  lastFocalSubject: EcaSubject | null;
}>;

export type EcaKnownInformation = Readonly<{
  deliveryTarget?: string | null;
  confirmedDataByField?: Readonly<Record<string, string>>;
  valuePresentByField?: Readonly<Record<string, boolean>>;
  semanticStatusByField?: Readonly<Record<string, "CONFIRMED" | "PROPOSED" | "LIKELY" | "UNKNOWN">>;
  missingFields?: readonly Readonly<{
    subjectId: string;
    subjectLabel: string;
    field: string;
    necessity?: EcaInformationNecessity;
  }>[];
  observedOutcome?: string | null;
  causalEvidenceSufficient?: boolean;
  boundedOptions?: readonly string[];
  nca3ShouldAsk?: boolean;
  nca3Question?: string | null;
  managerRole?: string | null;
  associatedOthers?: readonly EcaSubject[];
  focalSubject?: EcaSubject | null;
}>;

export type EcaExecutiveInformationNeedJudgment = Readonly<{
  identity: typeof ECA_EXECUTIVE_INFORMATION_NEED_IDENTITY;
  primaryNeed: EcaExecutiveInformationNeed | null;
  competingNeeds: readonly EcaExecutiveInformationNeed[];
  acquisitionAction: EcaInformationAcquisitionAction;
  shouldAsk: boolean;
  question: EcaQuestionPlan | null;
  reusedSuggestedManagerTurns: EcaConversationActionPlan["suggestedManagerTurns"];
  explanation: string | null;
  proceedWithUncertainty: boolean;
  nca3AlreadyOwnsQuestion: boolean;
  answerWouldRequireCanonicalProposal: boolean;
  unnecessaryQuestion: false;
  duplicateQuestion: false;
  advisorConsumedInformationNeed: boolean;
  boundaries: typeof BOUNDARIES;
  provenance: Readonly<{
    sources: readonly string[];
    rationale: string;
  }>;
}>;

export type EcaInformationNeedInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  initiative?: EcaExecutiveInitiativeJudgment | null;
  session?: EcaInformationNeedSession | null;
  known?: EcaKnownInformation | null;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function emptyEcaInformationNeedSession(): EcaInformationNeedSession {
  return freeze({
    lastFingerprint: null,
    lastQuestion: null,
    lastExplanation: null,
    lastNeedId: null,
    askedFingerprints: Object.freeze([]),
    unknownFingerprints: Object.freeze([]),
    declinedFingerprints: Object.freeze([]),
    lastAssociatedOthers: Object.freeze([]),
    lastFocalSubject: null,
  });
}

export function isEcaInformationNeedWhyFollowUp(utterance: string): boolean {
  return /\bwhy (?:do you need|ask|is that needed|that)\b/i.test(utterance.trim());
}

/**
 * Speech act: the manager is asking what information/evidence is required to
 * resolve the currently active uncertainty. Not ordinary business “need”,
 * execution readiness, or reassessment.
 */
export function isEcaInformationRequirementRequest(utterance: string): boolean {
  const text = utterance.trim().toLowerCase().replace(/[’]/g, "'");
  if (!text) return false;
  if (/^what is (?:nexora|the (?:stage|advisor|workspace)|an? object)\b/.test(text)) return false;
  if (/\b(?:reassess|reconsider|rethink)\b/.test(text)) return false;
  if (/\bbefore (?:starting|we start|execution|committing|start)\b/.test(text)) return false;
  if (/\bwhat do we need before\b/.test(text)) return false;
  if (
    /\b(?:we|i|they) need to\b/.test(text) &&
    !/\bneed to (?:know|determine|confirm|see|have|get|give|understand)\b/.test(text)
  ) {
    return false;
  }
  return (
    /\b(?:what|which|how)\b/.test(text) &&
    (/\b(?:do you need|would you need|you still need|you need)\b/.test(text) ||
      /\b(?:is missing|are missing)\b/.test(text) ||
      (/\bwhat (?:information|evidence|data)\b/.test(text) && /\b(?:need|missing|require)\b/.test(text)) ||
      /\b(?:information|evidence|data) (?:do you need|is missing|would you need)\b/.test(text) ||
      /\bhow (?:can|do|would) we determine\b/.test(text) ||
      /\bwhat would (?:confirm|help you determine|help us determine)\b/.test(text) ||
      /\bwhat should i (?:give|provide|share)\b/.test(text) ||
      /\bneed from me\b/.test(text))
  );
}

function informationRequirementHijackProtected(
  plan: EcaConversationActionPlan,
  utterance: string,
): boolean {
  if (
    plan.intent === "REQUEST_EXECUTION_ACTION" ||
    plan.intent === "REASSESS" ||
    plan.intent === "REVIEW_OUTCOME"
  ) {
    return true;
  }
  if (/\bbefore (?:starting|we start|execution)\b/i.test(utterance)) return true;
  if (/\b(?:reassess|reconsider|rethink)\b/i.test(utterance)) return true;
  return false;
}

export function isEcaInformationNeedUnknownAnswer(utterance: string): boolean {
  return /^(i don['’]?t know|unknown|no idea)\.?$/i.test(utterance.trim());
}

export function isEcaInformationNeedSkip(utterance: string): boolean {
  return /^(skip(?: it)?|not now|not this time)\.?$/i.test(utterance.trim());
}

function necessityRank(value: EcaInformationNecessity): number {
  return { OPTIONAL: 0, USEFUL: 1, IMPORTANT: 2, REQUIRED: 3, BLOCKING: 4 }[value];
}

function cheaperRequested(utterance: string): boolean {
  return (
    /\bcheaper\b/i.test(utterance) ||
    /\bwhich\b.*\b(cost|price)\b/i.test(utterance) ||
    (/\bscenario\b/i.test(utterance) && /\b(expected cost|cost)\b/i.test(utterance))
  );
}

function compareRequested(utterance: string, intent: EcaConversationActionPlan["intent"]): boolean {
  return (
    intent === "COMPARE" ||
    intent === "EVALUATE" ||
    /\bcompar(?:e|ing|ison)\b/i.test(utterance) ||
    cheaperRequested(utterance)
  );
}

function outcomeRequested(utterance: string, intent: EcaConversationActionPlan["intent"]): boolean {
  return intent === "REVIEW_OUTCOME" || /\bdid (?:it|the plan) work\b/i.test(utterance);
}

function contactRequested(utterance: string): boolean {
  return /\bwho (?:should i contact|owns|is (?:the )?owner)\b/i.test(utterance);
}

function causalityRequested(utterance: string): boolean {
  return /\b(?:causing|caused|cause)\b/i.test(utterance);
}

function capAvMentioned(
  utterance: string,
  working: EcaWorkingConversationContext,
  session: EcaInformationNeedSession,
): boolean {
  return (
    /\bcap_av\b/i.test(utterance) ||
    working.activeDataSource?.fieldId === "CAP_AV" ||
    session.lastFingerprint === "semantic:CAP_AV"
  );
}

function scenarioSubject(
  working: EcaWorkingConversationContext,
  hint: string,
): EcaSubject | null {
  const needle = hint.toLowerCase();
  return (
    working.stageContext.visible.find((item) => item.label.toLowerCase().includes(needle)) ??
    working.decisionContext.comparisonSubjects.find((item) => item.label.toLowerCase().includes(needle)) ??
    null
  );
}

function associatedOthersOf(input: EcaInformationNeedInput): readonly EcaSubject[] {
  const known = knownOf(input).associatedOthers ?? [];
  if (known.length > 0) return known;
  return sessionOf(input).lastAssociatedOthers;
}

function focalSubjectOf(input: EcaInformationNeedInput): EcaSubject | null {
  return (
    input.workingContext.activeSubject ??
    knownOf(input).focalSubject ??
    sessionOf(input).lastFocalSubject ??
    input.workingContext.stageContext.focus ??
    null
  );
}

function marginTimingPresent(input: EcaInformationNeedInput, utterance?: string): boolean {
  const text = utterance ?? input.utterance;
  if (knownOf(input).confirmedDataByField?.marginHistory) return true;
  if (knownOf(input).valuePresentByField?.marginHistory === true) return true;
  if (knownOf(input).confirmedDataByField?.marginTiming) return true;
  return /\bmargin\b/i.test(text) && /\b(?:july|june|history|fell|dropped|moved|timing)\b/i.test(text);
}

function riskTimingPresent(input: EcaInformationNeedInput, utterance?: string): boolean {
  const text = utterance ?? input.utterance;
  if (knownOf(input).confirmedDataByField?.riskTiming) return true;
  if (knownOf(input).valuePresentByField?.riskTiming === true) return true;
  return /\brisk\b/i.test(text) && /\b(?:started|intensif|changed|appeared|when it (?:began|started))\b/i.test(text);
}

function composeInformationRequirementAnswer(
  input: EcaInformationNeedInput,
  primary: EcaExecutiveInformationNeed | null,
  others: readonly EcaSubject[],
): string {
  const utterance = input.utterance;
  const subject = primary?.subject ?? focalSubjectOf(input);
  const counterpart = others[0] ?? null;
  const subjectLabel = subject?.label ?? "this";
  const otherLabel = counterpart?.label ?? null;
  const fromMe = /\bfrom me\b/i.test(utterance);
  const howDetermine = /\bhow (?:can|do|would) we determine\b/i.test(utterance);
  const wouldConfirm = /\bwhat would confirm\b/i.test(utterance);
  const best = primary?.sourceCandidates[0]?.source ?? "EXISTING_DATA";
  const marginKnown = marginTimingPresent(input);
  const riskKnown = riskTimingPresent(input);

  if (!primary || primary.currentStatus === "KNOWN_CONFIRMED") {
    return "I don’t need additional information for the question we just resolved.";
  }

  if (primary.currentStatus === "AMBIGUOUS" || primary.acquisitionAction === "ASK_CLARIFICATION") {
    const labels = others.length > 1
      ? others.slice(0, 2).map((item) => item.label).join(" or ")
      : input.workingContext.continuation.options.slice(0, 2).join(" or ");
    return labels
      ? `Which unresolved relationship should I treat as the current question — ${labels}?`
      : "Which unresolved relationship should I treat as the current question?";
  }

  if (primary.informationType === "SEMANTIC_MEANING") {
    return primary.question?.explanation ?? primary.description;
  }

  if (howDetermine && otherLabel) {
    return `First, compare when ${subjectLabel} appeared or changed with the ${otherLabel} movement. Then check whether another known factor explains the same change. If the available evidence is still insufficient, I’ll tell you exactly what’s missing.`;
  }

  if (fromMe && (best === "EXISTING_DATA" || best === "EVIDENCE" || best === "BUSINESS_OBJECT")) {
    return otherLabel
      ? `I may not need anything from you yet. I should first check whether the timing of ${subjectLabel} and ${otherLabel} already exists in the available data.`
      : "I may not need anything from you yet. I should first check whether the missing evidence already exists in the available data.";
  }

  if (marginKnown && !riskKnown && otherLabel) {
    return `I already have the margin timing. What is still missing is evidence about when ${subjectLabel} occurred or changed before we can assess the relationship.`;
  }
  if (riskKnown && !marginKnown && otherLabel) {
    return `I already have the timing for ${subjectLabel}. What is still missing is evidence about when ${otherLabel} moved.`;
  }

  if (best === "UNKNOWN_SOURCE" && otherLabel) {
    return `The missing piece is the timing of ${subjectLabel} relative to ${otherLabel}. I don’t yet know which available source contains it.`;
  }

  const missing = otherLabel
    ? `I need evidence that connects this ${subjectLabel} with ${otherLabel} — especially when ${subjectLabel} appeared or changed and what happened to ${otherLabel.toLowerCase().includes("margin") ? "margin" : otherLabel} at the same time. I also need enough context to rule out other likely explanations.`
    : `I need evidence that would reduce the current uncertainty about ${subjectLabel}.`;
  const sourceStep =
    best === "MANAGER"
      ? "If that isn’t already in the available data, I would need it from you or the responsible owner."
      : "I should use any relevant data already available before asking you for more.";
  const causal = wouldConfirm
    ? " That would strengthen the relationship, but confirming causality may require stronger evidence."
    : " That would help determine whether the relationship is supported and whether a causal explanation is justified.";
  return `${missing}${causal} ${sourceStep}`.replace(/\s+/g, " ").trim();
}

function source(
  kind: EcaInformationSource,
  label: string,
): EcaInformationSourceCandidate {
  return freeze({ source: kind, label, contacted: false as const });
}

function questionPlan(input: {
  type: EcaQuestionPlanType;
  text: string;
  explanation: string;
  options?: readonly string[];
}): EcaQuestionPlan {
  const options = freeze(input.options ?? []);
  return freeze({
    type: input.type,
    text: input.text,
    bounded: options.length > 0,
    options,
    allowNaturalLanguage: true as const,
    allowIDontKnow: true as const,
    allowSkip: true as const,
    explanation: input.explanation,
    suggestedAnswersAreFacts: false as const,
  });
}

function need(partial: EcaExecutiveInformationNeed): EcaExecutiveInformationNeed {
  return freeze(partial);
}

function isVague(text: string): boolean {
  return VAGUE_QUESTION.test(text) || /^(can you provide more information\??)$/i.test(text.trim());
}

function sessionOf(input: EcaInformationNeedInput): EcaInformationNeedSession {
  return input.session ?? emptyEcaInformationNeedSession();
}

function knownOf(input: EcaInformationNeedInput): EcaKnownInformation {
  return input.known ?? {};
}

function semanticStatus(
  input: EcaInformationNeedInput,
  fieldId: string,
): "CONFIRMED" | "PROPOSED" | "LIKELY" | "UNKNOWN" | null {
  const fromKnown = knownOf(input).semanticStatusByField?.[fieldId];
  if (fromKnown) return fromKnown;
  const active = input.workingContext.activeDataSource;
  if (active?.fieldId === fieldId) {
    if (active.semanticStatus === "CONFIRMED") return "CONFIRMED";
    if (active.semanticStatus === "PROPOSED") return "PROPOSED";
    return "UNKNOWN";
  }
  return null;
}

function valuePresent(input: EcaInformationNeedInput, fieldId: string): boolean {
  if (knownOf(input).valuePresentByField?.[fieldId] === true) return true;
  if (knownOf(input).confirmedDataByField?.[fieldId]) return true;
  const active = input.workingContext.activeDataSource;
  return active?.fieldId === fieldId && active.evidenceRefs.length > 0;
}

function alreadyAsked(session: EcaInformationNeedSession, fingerprint: string): boolean {
  return (
    session.askedFingerprints.includes(fingerprint) ||
    session.unknownFingerprints.includes(fingerprint) ||
    session.declinedFingerprints.includes(fingerprint)
  );
}

function noNeed(
  input: EcaInformationNeedInput,
  action: EcaInformationAcquisitionAction,
  rationale: string,
  extras: Partial<EcaExecutiveInformationNeedJudgment> = {},
): EcaExecutiveInformationNeedJudgment {
  return freeze({
    identity: ECA_EXECUTIVE_INFORMATION_NEED_IDENTITY,
    primaryNeed: extras.primaryNeed ?? null,
    competingNeeds: extras.competingNeeds ?? Object.freeze([]),
    acquisitionAction: action,
    shouldAsk: false,
    question: extras.question ?? null,
    reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
    explanation: extras.explanation ?? null,
    proceedWithUncertainty: action === "PROCEED_WITH_UNCERTAINTY" || extras.proceedWithUncertainty === true,
    nca3AlreadyOwnsQuestion: knownOf(input).nca3ShouldAsk === true,
    answerWouldRequireCanonicalProposal: extras.answerWouldRequireCanonicalProposal === true,
    unnecessaryQuestion: false,
    duplicateQuestion: false,
    advisorConsumedInformationNeed: extras.advisorConsumedInformationNeed === true,
    boundaries: BOUNDARIES,
    provenance: freeze({
      sources: freeze(["NPA-T ECA:1", "NPA-T ECA:2", "NPA-T ECA:4"]),
      rationale,
    }),
  });
}

function withNeed(
  input: EcaInformationNeedInput,
  primary: EcaExecutiveInformationNeed,
  competing: readonly EcaExecutiveInformationNeed[],
  rationale: string,
  extras: Partial<EcaExecutiveInformationNeedJudgment> = {},
): EcaExecutiveInformationNeedJudgment {
  const nca3Owns = knownOf(input).nca3ShouldAsk === true && Boolean(knownOf(input).nca3Question);
  const action = primary.acquisitionAction;
  const shouldAsk =
    extras.shouldAsk === false
      ? false
      : !nca3Owns &&
        (action === "ASK_MANAGER" ||
          action === "ASK_CLARIFICATION" ||
          action === "REQUEST_SEMANTIC_CONFIRMATION" ||
          action === "REQUEST_EVIDENCE") &&
        primary.question != null &&
        !isVague(primary.question.text);
  return freeze({
    identity: ECA_EXECUTIVE_INFORMATION_NEED_IDENTITY,
    primaryNeed: primary,
    competingNeeds: freeze(competing),
    acquisitionAction: action,
    shouldAsk,
    question: shouldAsk ? primary.question : nca3Owns ? primary.question : extras.question ?? primary.question,
    reusedSuggestedManagerTurns: input.actionPlan.suggestedManagerTurns,
    explanation: extras.explanation ?? primary.question?.explanation ?? null,
    proceedWithUncertainty:
      action === "PROCEED_WITH_UNCERTAINTY" || primary.uncertainty.proceedWithUncertaintySafe,
    nca3AlreadyOwnsQuestion: nca3Owns,
    answerWouldRequireCanonicalProposal: extras.answerWouldRequireCanonicalProposal === true,
    unnecessaryQuestion: false,
    duplicateQuestion: false,
    advisorConsumedInformationNeed: extras.advisorConsumedInformationNeed === true,
    boundaries: BOUNDARIES,
    provenance: freeze({
      sources: freeze(["NPA-T ECA:1", "NPA-T ECA:2", "NPA-T ECA:4", ...primary.provenance.sourcesChecked]),
      rationale,
    }),
  });
}

function collectNeeds(input: EcaInformationNeedInput): EcaExecutiveInformationNeed[] {
  const utterance = input.utterance;
  const plan = input.actionPlan;
  const working = input.workingContext;
  const known = knownOf(input);
  const needs: EcaExecutiveInformationNeed[] = [];
  const scenarioB = scenarioSubject(working, "scenario b") ?? freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
  const supplierB = scenarioSubject(working, "supplier b") ?? freeze({ id: "supplier-b", label: "Supplier B", kind: "risk" });

  if (
    plan.requiresClarification &&
    plan.nextAction === "ASK_CLARIFICATION" &&
    !cheaperRequested(utterance) &&
    !outcomeRequested(utterance, plan.intent) &&
    !(isEcaInformationRequirementRequest(utterance) && associatedOthersOf(input).length === 1)
  ) {
    needs.push(
      need({
        id: "reference-ambiguity",
        subject: working.activeSubject,
        informationType: "REFERENCE",
        description: "The current request has multiple plausible referents.",
        requiredFor: plan.intent,
        necessity: "REQUIRED",
        currentStatus: "AMBIGUOUS",
        sourceCandidates: freeze([source("MANAGER", "Manager")]),
        acquisitionAction: "ASK_CLARIFICATION",
        question: null,
        uncertainty: freeze({
          proceedWithUncertaintySafe: false,
          ifUnknown: "Existing ECA:1/NCA clarification remains the authority.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["ECA:1 unresolved referents"]),
          whyThisSource: "Reference ambiguity is not a business information gap.",
          whyAskOrNot: "Delegate to the existing clarification path.",
          fingerprint: "ambiguity:reference",
        }),
      }),
    );
  }

  if (
    capAvMentioned(utterance, working, sessionOf(input)) &&
    !(isEcaInformationRequirementRequest(utterance) && !/\bcap_av\b/i.test(utterance))
  ) {
    const status = semanticStatus(input, "CAP_AV") ?? "PROPOSED";
    const present = valuePresent(input, "CAP_AV") || status === "PROPOSED" || status === "LIKELY";
    if (present && status !== "CONFIRMED") {
      needs.push(
        need({
          id: "cap-av-semantics",
          subject: freeze({ id: "CAP_AV", label: "CAP_AV", kind: "data-field" }),
          informationType: "SEMANTIC_MEANING",
          description: "CAP_AV has a value but its meaning is not manager-confirmed.",
          requiredFor: plan.intent,
          necessity: /\bworr(?:y|ied)\b/i.test(utterance) ? "REQUIRED" : "IMPORTANT",
          currentStatus: "KNOWN_UNCONFIRMED",
          sourceCandidates: freeze([source("EXISTING_DATA", "Data Reality / DATA-ADV")]),
          acquisitionAction: "REQUEST_SEMANTIC_CONFIRMATION",
          question: questionPlan({
            type: "SEMANTIC_CLARIFICATION",
            text: "Does CAP_AV represent available capacity?",
            explanation: "A value exists, but its meaning is still unconfirmed, so I cannot treat it as available capacity yet.",
          }),
          uncertainty: freeze({
            proceedWithUncertaintySafe: true,
            ifUnknown: "Keep CAP_AV as a candidate field, not authoritative capacity.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["DATA-ADV semantic status", "ECA:1 activeDataSource"]),
            whyThisSource: "Semantic confirmation already has a canonical DATA-ADV path.",
            whyAskOrNot: "Do not classify an unconfirmed meaning as a missing value.",
            fingerprint: "semantic:CAP_AV",
          }),
        }),
      );
    }
  }

  const targetNeeded =
    compareRequested(utterance, plan.intent) && /\b(target|delivery target|on-time)\b/i.test(utterance);
  if (targetNeeded && known.deliveryTarget) {
    needs.push(
      need({
        id: "delivery-target-known",
        subject: freeze({ id: "goal:delivery", label: "On-time delivery", kind: "goal" }),
        informationType: "TARGET",
        description: `Authoritative delivery target is already ${known.deliveryTarget}.`,
        requiredFor: plan.intent,
        necessity: "REQUIRED",
        currentStatus: "KNOWN_CONFIRMED",
        sourceCandidates: freeze([source("BUSINESS_OBJECT", "Goal")]),
        acquisitionAction: "NO_ACQUISITION_NEEDED",
        question: null,
        uncertainty: freeze({
          proceedWithUncertaintySafe: true,
          ifUnknown: "Use the existing Goal target.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["Goal object", "authoritative working context"]),
          whyThisSource: "Goal already contains the delivery target.",
          whyAskOrNot: "Do not ask the manager for information Nexora already has.",
          fingerprint: "known:delivery-target",
        }),
      }),
    );
  }

  const confirmedCost =
    known.confirmedDataByField?.["scenario-b-cost"] ??
    known.confirmedDataByField?.["cost:scenario-b"];
  const missingCostEntry = known.missingFields?.find((item) => /cost/i.test(item.field) && /b/i.test(item.subjectLabel));
  const cheaper = cheaperRequested(utterance) && compareRequested(utterance, plan.intent);
  if (cheaper && confirmedCost) {
    needs.push(
      need({
        id: "scenario-b-cost-known",
        subject: scenarioB,
        informationType: "COST",
        description: "Scenario B cost is already present in authoritative data.",
        requiredFor: "COMPARE",
        necessity: "BLOCKING",
        currentStatus: "KNOWN_CONFIRMED",
        sourceCandidates: freeze([source("EXISTING_DATA", "Data Reality")]),
        acquisitionAction: "USE_EXISTING_INFORMATION",
        question: null,
        uncertainty: freeze({
          proceedWithUncertaintySafe: false,
          ifUnknown: "Use the existing cost evidence.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["Data Reality", "confirmed CSV/object state"]),
          whyThisSource: "Authoritative data already supplies the comparison input.",
          whyAskOrNot: "Existing information first.",
          fingerprint: "known:scenario-b-cost",
        }),
      }),
    );
  } else if (cheaper || missingCostEntry) {
    const necessity: EcaInformationNecessity = cheaper ? "BLOCKING" : "USEFUL";
    const ask = necessity === "BLOCKING";
    needs.push(
      need({
        id: "scenario-b-cost",
        subject: scenarioB,
        informationType: "COST",
        description: "Scenario B cost is missing and is required to say which option is cheaper.",
        requiredFor: "COMPARE",
        necessity,
        currentStatus: "MISSING",
        sourceCandidates: freeze([
          source("EXISTING_DATA", "Scenario evidence"),
          source("MANAGER", "Manager"),
        ]),
        acquisitionAction: ask ? "ASK_MANAGER" : "PROCEED_WITH_UNCERTAINTY",
        question: ask
          ? questionPlan({
              type: "COMPARISON_INPUT",
              text: "Scenario B’s cost is still unknown. What is its expected cost, or should we compare them without cost for now?",
              explanation: "You’re comparing the scenarios, and cost is currently missing for Scenario B.",
              options: known.boundedOptions,
            })
          : null,
        uncertainty: freeze({
          proceedWithUncertaintySafe: !cheaper,
          ifUnknown: "Comparison can continue with cost left uncertain if the manager is not asking which is cheaper.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["Current scenario evidence", "ECA:2 comparison set"]),
          whyThisSource: "No authoritative data source currently provides Scenario B cost.",
          whyAskOrNot: ask
            ? "Cost is blocking for a cheaper-than comparison."
            : "Generic comparison does not make cost blocking.",
          fingerprint: "gap:scenario-b-cost",
        }),
      }),
    );
  }

  if (/\bowner\b/i.test(utterance) || contactRequested(utterance)) {
    const required = contactRequested(utterance);
    needs.push(
      need({
        id: "owner-identity",
        subject: working.activeSubject,
        informationType: "OWNER",
        description: "Owner identity is not in the current working context.",
        requiredFor: plan.intent,
        necessity: required ? "REQUIRED" : "OPTIONAL",
        currentStatus: "MISSING",
        sourceCandidates: freeze([source("BUSINESS_OBJECT", "Object owner"), source("MANAGER", "Manager")]),
        acquisitionAction: required ? "ASK_MANAGER" : "NO_ACQUISITION_NEEDED",
        question: required
          ? questionPlan({
              type: "FACT_REQUEST",
              text: `Who should be contacted about ${working.activeSubject?.label ?? "this issue"}?`,
              explanation: "You asked who to contact, so owner identity is required for this request.",
            })
          : null,
        uncertainty: freeze({
          proceedWithUncertaintySafe: !required,
          ifUnknown: "Explanation can continue without an owner name.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["Working conversation context", "object state"]),
          whyThisSource: "Necessity follows the current executive objective.",
          whyAskOrNot: required ? "The current request needs an owner." : "Owner is optional for an explanation.",
          fingerprint: "gap:owner",
        }),
      }),
    );
  }

  if (
    plan.intent === "REQUEST_EXECUTION_ACTION" &&
    plan.requiredContext.some((item) => item.kind === "COMMITTED_DECISION" && item.availability === "MISSING_AND_REQUIRED")
  ) {
    needs.push(
      need({
        id: "execution-prerequisite",
        subject: working.activeSubject,
        informationType: "PREREQUISITE",
        description: "Execution cannot start without a committed Decision.",
        requiredFor: "REQUEST_EXECUTION_ACTION",
        necessity: "BLOCKING",
        currentStatus: "MISSING",
        sourceCandidates: freeze([source("BUSINESS_OBJECT", "Decision")]),
        acquisitionAction: "ASK_MANAGER",
        question: questionPlan({
          type: "EXECUTION_INPUT",
          text: "There is no committed Decision yet. Do you want to review a Decision before starting execution?",
          explanation: "Existing Execution authority requires a committed Decision before start.",
        }),
        uncertainty: freeze({
          proceedWithUncertaintySafe: false,
          ifUnknown: "Do not start Execution.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["ECA:2 requiredContext COMMITTED_DECISION", "CC:11"]),
          whyThisSource: "Canonical Execution prerequisite, not a new checklist.",
          whyAskOrNot: "Ask for the missing prerequisite without starting Execution.",
          fingerprint: "gap:committed-decision",
        }),
      }),
    );
  }

  if (plan.intent === "REVIEW_DECISION" && known.missingFields?.some((item) => /risk/i.test(item.field))) {
    const field = known.missingFields.find((item) => /risk/i.test(item.field))!;
    needs.push(
      need({
        id: "decision-readiness-risk",
        subject: freeze({ id: field.subjectId, label: field.subjectLabel, kind: "risk" }),
        informationType: "EVIDENCE",
        description: "Decision review is missing one material evidence input.",
        requiredFor: "REVIEW_DECISION",
        necessity: "IMPORTANT",
        currentStatus: "MISSING",
        sourceCandidates: freeze([source("EVIDENCE", "Risk evidence"), source("MANAGER", "Manager")]),
        acquisitionAction: "ASK_MANAGER",
        question: questionPlan({
          type: "DECISION_INPUT",
          text: `What evidence do you have for ${field.subjectLabel} before committing?`,
          explanation: "This Decision review still lacks one material evidence input.",
        }),
        uncertainty: freeze({
          proceedWithUncertaintySafe: true,
          ifUnknown: "Do not commit a Decision from this question.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["Decision context", "Risk evidence"]),
          whyThisSource: "Manager or existing evidence can supply the missing input.",
          whyAskOrNot: "Surface one readiness question without Decision mutation.",
          fingerprint: `gap:decision:${field.field}`,
        }),
      }),
    );
  }

  if (outcomeRequested(utterance, plan.intent)) {
    if (known.observedOutcome) {
      needs.push(
        need({
          id: "observed-outcome-known",
          subject: working.activeSubject,
          informationType: "OUTCOME",
          description: "Observed result is already available.",
          requiredFor: "REVIEW_OUTCOME",
          necessity: "REQUIRED",
          currentStatus: "KNOWN_CONFIRMED",
          sourceCandidates: freeze([source("EXISTING_DATA", "Outcome / Data Reality")]),
          acquisitionAction: "USE_EXISTING_INFORMATION",
          question: null,
          uncertainty: freeze({
            proceedWithUncertaintySafe: false,
            ifUnknown: "Use the existing observed result.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["Outcome context", "Data Reality"]),
            whyThisSource: "Existing data first.",
            whyAskOrNot: "Do not invent or re-ask an observed result.",
            fingerprint: "known:observed-outcome",
          }),
        }),
      );
    } else {
      needs.push(
        need({
          id: "observed-outcome",
          subject: working.activeSubject,
          informationType: "OUTCOME",
          description: "Observed result is missing for an outcome question.",
          requiredFor: "REVIEW_OUTCOME",
          necessity: "REQUIRED",
          currentStatus: "MISSING",
          sourceCandidates: freeze([source("EXISTING_DATA", "KPI / Data Reality"), source("MANAGER", "Manager")]),
          acquisitionAction: "ASK_MANAGER",
          question: questionPlan({
            type: "OUTCOME_INPUT",
            text: "What is the latest observed delivery rate?",
            explanation: "You’re asking whether the plan worked, and the observed result is not in context.",
          }),
          uncertainty: freeze({
            proceedWithUncertaintySafe: false,
            ifUnknown: "Do not fabricate an Outcome.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["Outcome context", "Execution context"]),
            whyThisSource: "No authoritative observed result is currently attached.",
            whyAskOrNot: "Ask for the observed result without inventing Outcome.",
            fingerprint: "gap:observed-outcome",
          }),
        }),
      );
    }
  }

  if (causalityRequested(utterance) && known.causalEvidenceSufficient !== true) {
    needs.push(
      need({
        id: "causal-evidence",
        subject: working.activeSubject,
        informationType: "CAUSAL_EVIDENCE",
        description: "Association evidence is insufficient to claim causality.",
        requiredFor: plan.intent,
        necessity: "IMPORTANT",
        currentStatus: "MISSING",
        sourceCandidates: freeze([source("EVIDENCE", "Causal evidence"), source("MANAGER", "Manager")]),
        acquisitionAction: "REQUEST_EVIDENCE",
        question: questionPlan({
          type: "EVIDENCE_REQUEST",
          text: "Do you have evidence showing that delivery delays increase when capacity falls?",
          explanation: "Available evidence can support association, but not that one issue caused the other.",
        }),
        uncertainty: freeze({
          proceedWithUncertaintySafe: true,
          ifUnknown: "Do not assert causation.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["Working evidence", "ECA:2 INVESTIGATE uncertainty"]),
          whyThisSource: "Causal claims need evidence the current context does not supply.",
          whyAskOrNot: "Identify the causal evidence gap instead of answering yes.",
          fingerprint: "gap:causal-evidence",
        }),
      }),
    );
  }

  if (/\b(available capacity|lead time)\b/i.test(utterance) && !known.confirmedDataByField?.capacity) {
    const field = /\blead time\b/i.test(utterance) ? "LEAD_TIME" : "CAPACITY";
    const role = (known.managerRole ?? working.managerContext.role ?? "").toLowerCase();
    const operational = /\b(downtime|machine)\b/i.test(utterance) && /\b(ceo|executive|board)\b/.test(role);
    needs.push(
      need({
        id: field === "LEAD_TIME" ? "supplier-lead-time" : "supplier-capacity",
        subject: supplierB,
        informationType: field,
        description:
          field === "LEAD_TIME"
            ? "Supplier B lead time is not in authoritative context."
            : "Supplier B available capacity is not in authoritative context.",
        requiredFor: plan.intent,
        necessity: "REQUIRED",
        currentStatus: "MISSING",
        sourceCandidates: freeze(
          operational
            ? [source("EMPLOYEE_OR_OWNER", "Operations"), source("MANAGER", "Manager")]
            : [source("MANAGER", "Manager"), source("EXISTING_DATA", "Data Reality")],
        ),
        acquisitionAction: operational ? "IDENTIFY_OTHER_SOURCE" : "ASK_MANAGER",
        question: operational
          ? questionPlan({
              type: "SOURCE_QUESTION",
              text: "This is likely known by operations rather than by the CEO. I will not contact them from here.",
              explanation: "Source identification only; no employee message is sent.",
            })
          : questionPlan({
              type: field === "LEAD_TIME" ? "FACT_REQUEST" : "CONSTRAINT_QUESTION",
              text:
                field === "LEAD_TIME"
                  ? "Do you know Supplier B’s current delivery lead time?"
                  : "What is Supplier B’s current available capacity?",
              explanation:
                field === "LEAD_TIME"
                  ? "Lead time is missing and is the smallest fact that unlocks this request."
                  : "Available capacity is missing and the manager is the current suitable source.",
              options: field === "CAPACITY" ? known.boundedOptions : undefined,
            }),
        uncertainty: freeze({
          proceedWithUncertaintySafe: true,
          ifUnknown: "Keep capacity or lead time uncertain; do not invent a value.",
        }),
        provenance: freeze({
          sourcesChecked: freeze(["Stage context", "Data Reality", "object state"]),
          whyThisSource: operational
            ? "Manager role suggests operations is a better source; ECA:4 does not message them."
            : "No authoritative data source currently provides this fact.",
          whyAskOrNot: operational ? "Identify the likely source without contacting them." : "Ask one focused manager question.",
          fingerprint: field === "LEAD_TIME" ? "gap:lead-time" : "gap:capacity",
        }),
      }),
    );
  }

  for (const extra of known.missingFields ?? []) {
    if (needs.some((item) => item.description.includes(extra.field) || item.id.includes(extra.field))) continue;
    const blocking = extra.necessity === "BLOCKING" || extra.necessity === "REQUIRED";
    if (!blocking && (cheaper || compareRequested(utterance, plan.intent))) {
      needs.push(
        need({
          id: `optional-${extra.subjectId}-${extra.field}`,
          subject: freeze({ id: extra.subjectId, label: extra.subjectLabel, kind: null }),
          informationType: "FACT",
          description: `${extra.subjectLabel} ${extra.field} is unknown but not required for the current objective.`,
          requiredFor: plan.intent,
          necessity: extra.necessity ?? "OPTIONAL",
          currentStatus: "MISSING",
          sourceCandidates: freeze([source("UNKNOWN_SOURCE", "Unspecified")]),
          acquisitionAction: "NO_ACQUISITION_NEEDED",
          question: null,
          uncertainty: freeze({
            proceedWithUncertaintySafe: true,
            ifUnknown: "Continue without this field.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["Current executive objective"]),
            whyThisSource: "Non-blocking unknowns must not generate questions.",
            whyAskOrNot: "Optional relative to the current objective.",
            fingerprint: `optional:${extra.subjectId}:${extra.field}`,
          }),
        }),
      );
    }
  }

  if (
    isEcaInformationRequirementRequest(utterance) &&
    !informationRequirementHijackProtected(plan, utterance)
  ) {
    const others = associatedOthersOf(input).filter((item) => item.id !== focalSubjectOf(input)?.id && item.label !== focalSubjectOf(input)?.label);
    const subject = focalSubjectOf(input);
    if (others.length === 0 && sessionOf(input).lastFingerprint !== "gap:relationship-evidence") {
      // No active unresolved relationship to report.
    } else if (others.length > 1 && !others.some((item) => new RegExp(item.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(utterance))) {
      needs.push(
        need({
          id: "relationship-referent",
          subject,
          informationType: "REFERENCE",
          description: "More than one unresolved relationship could be the current referent.",
          requiredFor: plan.intent,
          necessity: "REQUIRED",
          currentStatus: "AMBIGUOUS",
          sourceCandidates: freeze([source("MANAGER", "Manager")]),
          acquisitionAction: "ASK_CLARIFICATION",
          question: questionPlan({
            type: "REFERENCE_CLARIFICATION",
            text: `Which unresolved relationship should I treat as the current question — ${others
              .slice(0, 2)
              .map((item) => item.label)
              .join(" or ")}?`,
            explanation: "The current request has more than one plausible unresolved relationship.",
          }),
          uncertainty: freeze({
            proceedWithUncertaintySafe: false,
            ifUnknown: "Do not pick a relationship arbitrarily.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["ECA:1 referents", "associated working relationships"]),
            whyThisSource: "Reference ambiguity is not a fabricated information gap.",
            whyAskOrNot: "Ask one bounded clarification.",
            fingerprint: "ambiguity:relationship-referent",
          }),
        }),
      );
    } else {
      const counterpart = others[0] ?? null;
      const subject = focalSubjectOf(input);
      const marginKnown = marginTimingPresent(input);
      const riskKnown = riskTimingPresent(input);
      const status: EcaInformationAvailability =
        marginKnown && riskKnown ? "KNOWN_CONFIRMED" : marginKnown || riskKnown ? "PARTIAL" : "MISSING";
      needs.push(
        need({
          id: "relationship-evidence",
          subject,
          informationType: "EVIDENCE",
          description: counterpart
            ? `Evidence connecting ${subject?.label ?? "the current subject"} and ${counterpart.label} is insufficient to determine the relationship.`
            : "Evidence required to determine the active unresolved relationship is missing.",
          requiredFor: plan.intent,
          necessity: "IMPORTANT",
          currentStatus: status,
          sourceCandidates: freeze([
            source("EXISTING_DATA", "Available data / Evidence"),
            source("MANAGER", "Manager"),
            source("EMPLOYEE_OR_OWNER", "Responsible owner"),
          ]),
          acquisitionAction:
            status === "KNOWN_CONFIRMED" ? "NO_ACQUISITION_NEEDED" : "REQUEST_EVIDENCE",
          question:
            status === "KNOWN_CONFIRMED"
              ? null
              : questionPlan({
                  type: "EVIDENCE_REQUEST",
                  text: counterpart
                    ? `Do we have evidence for when ${subject?.label ?? "this"} changed relative to ${counterpart.label}?`
                    : "Do we have evidence that would reduce this uncertainty?",
                  explanation: counterpart
                    ? `Timing and alternative explanations for ${subject?.label ?? "this"} and ${counterpart.label} would reduce the uncertainty without proving causality.`
                    : "The smallest useful evidence is whatever would reduce the active uncertainty without inventing fields.",
                }),
          uncertainty: freeze({
            proceedWithUncertaintySafe: true,
            ifUnknown: "Keep the relationship unresolved; do not assert direction or causality.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["Stage context", "working relationships", "Data Reality"]),
            whyThisSource: "Existing data first; do not invent mandatory fields or sources.",
            whyAskOrNot: "Answer the manager’s information-requirement request from the active gap.",
            fingerprint: "gap:relationship-evidence",
          }),
        }),
      );
    }
  }

  return needs;
}

function pickPrimary(needs: readonly EcaExecutiveInformationNeed[]): EcaExecutiveInformationNeed | null {
  if (needs.length === 0) return null;
  const actionable = [...needs].sort((left, right) => {
    const actionBoost = (item: EcaExecutiveInformationNeed) => {
      if (item.informationType === "REFERENCE") return 8;
      if (item.acquisitionAction === "NO_ACQUISITION_NEEDED" || item.acquisitionAction === "USE_EXISTING_INFORMATION") {
        return item.currentStatus === "KNOWN_CONFIRMED" ? 30 : -20;
      }
      return 0;
    };
    return necessityRank(right.necessity) + actionBoost(right) - (necessityRank(left.necessity) + actionBoost(left));
  });
  return actionable[0] ?? null;
}

export function judgeEcaExecutiveInformationNeed(
  input: EcaInformationNeedInput,
): EcaExecutiveInformationNeedJudgment {
  const session = sessionOf(input);
  const utterance = input.utterance.trim();

  if (isEcaInformationNeedWhyFollowUp(utterance) && session.lastExplanation) {
    const explanation = session.lastExplanation;
    return noNeed(input, "NO_ACQUISITION_NEEDED", "Manager asked why the pending information need exists.", {
      explanation,
      question: session.lastQuestion
        ? questionPlan({
            type: "FACT_REQUEST",
            text: session.lastQuestion,
            explanation,
          })
        : null,
    });
  }

  if (isEcaInformationNeedUnknownAnswer(utterance) && session.lastFingerprint) {
    return noNeed(
      input,
      "PROCEED_WITH_UNCERTAINTY",
      "Manager answered I don’t know; keep the fact unknown and do not repeat the question.",
      {
        proceedWithUncertainty: true,
        explanation:
          session.lastFingerprint === "gap:relationship-evidence"
            ? "Understood. Then that part remains unknown. If another source contains the timing, we can use it; otherwise I can only treat the relationship as unresolved."
            : "I’ll keep that uncertain rather than inventing a value or asking the same question again.",
      },
    );
  }

  if (
    session.lastFingerprint === "gap:relationship-evidence" &&
    /^i don['’]?t know\b/i.test(utterance) &&
    !isEcaInformationNeedUnknownAnswer(utterance)
  ) {
    return noNeed(
      input,
      "PROCEED_WITH_UNCERTAINTY",
      "Manager cannot supply the pending relationship evidence; keep it unknown.",
      {
        proceedWithUncertainty: true,
        explanation:
          "Understood. Then that part remains unknown. If another source contains the timing, we can use it; otherwise I can only treat the relationship as unresolved.",
      },
    );
  }

  if (isEcaInformationNeedSkip(utterance) && session.lastFingerprint) {
    return noNeed(
      input,
      "DEFER",
      "Manager skipped the pending question; questioning must not become a trap.",
      {
        proceedWithUncertainty: true,
        explanation: "Okay. I can continue with the available evidence, but that information will remain uncertain.",
      },
    );
  }

  if (/\b(yes|add it)\b/i.test(utterance) && /risk/i.test(session.lastQuestion ?? "")) {
    return noNeed(input, "NO_ACQUISITION_NEEDED", "A question answer is not mutation consent.", {
      answerWouldRequireCanonicalProposal: true,
    });
  }

  if (
    session.lastFingerprint === "gap:relationship-evidence" &&
    !isEcaInformationRequirementRequest(utterance) &&
    (marginTimingPresent(input) || riskTimingPresent(input))
  ) {
    const others = associatedOthersOf(input);
    const remainingRisk = marginTimingPresent(input) && !riskTimingPresent(input);
    const remainingMargin = riskTimingPresent(input) && !marginTimingPresent(input);
    const explanation = remainingRisk
      ? `That gives us the margin timing. We still need to know when ${input.workingContext.activeSubject?.label ?? "this Risk"} appeared or intensified before we can assess the relationship.`
      : remainingMargin
        ? `That gives us the Risk timing. We still need evidence of when ${others[0]?.label ?? "the associated issue"} moved.`
        : "Good. Then the missing piece is no longer that timing evidence.";
    const status: EcaInformationAvailability = remainingRisk || remainingMargin ? "PARTIAL" : "KNOWN_CONFIRMED";
    return noNeed(
      input,
      status === "KNOWN_CONFIRMED" ? "NO_ACQUISITION_NEEDED" : "REQUEST_EVIDENCE",
      "Manager supplied part of the relationship evidence; recompute only the remaining gap.",
      {
        explanation,
        primaryNeed: need({
          id: "relationship-evidence",
          subject: input.workingContext.activeSubject,
          informationType: "EVIDENCE",
          description: explanation,
          requiredFor: input.actionPlan.intent,
          necessity: "IMPORTANT",
          currentStatus: status,
          sourceCandidates: freeze([source("EXISTING_DATA", "Available data / Evidence"), source("MANAGER", "Manager")]),
          acquisitionAction: status === "KNOWN_CONFIRMED" ? "NO_ACQUISITION_NEEDED" : "REQUEST_EVIDENCE",
          question: null,
          uncertainty: freeze({
            proceedWithUncertaintySafe: true,
            ifUnknown: "Keep the remaining timing unknown; do not assert causality.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["Pending information need", "manager answer"]),
            whyThisSource: "Bind the answer to the active evidence need without writing Evidence.",
            whyAskOrNot: "Do not re-ask what was just supplied.",
            fingerprint: "gap:relationship-evidence",
          }),
        }),
      },
    );
  }

  if (
    session.lastFingerprint === "gap:scenario-b-cost" &&
    /\$?\d/.test(utterance) &&
    !isEcaInformationNeedUnknownAnswer(utterance)
  ) {
    return noNeed(
      input,
      "NO_ACQUISITION_NEEDED",
      "Manager-reported cost is acquired information, not durable business truth written by ECA:4.",
      {
        primaryNeed: need({
          id: "scenario-b-cost-reported",
          subject: scenarioSubject(input.workingContext, "scenario b"),
          informationType: "COST",
          description: "Manager reported Scenario B cost; ECA:4 does not write it as canonical truth.",
          requiredFor: "COMPARE",
          necessity: "BLOCKING",
          currentStatus: "KNOWN_UNCONFIRMED",
          sourceCandidates: freeze([source("MANAGER", "Manager")]),
          acquisitionAction: "NO_ACQUISITION_NEEDED",
          question: null,
          uncertainty: freeze({
            proceedWithUncertaintySafe: true,
            ifUnknown: "Durability remains with existing provenance/writer authority.",
          }),
          provenance: freeze({
            sourcesChecked: freeze(["Pending information need", "manager answer"]),
            whyThisSource: "The manager answered the planned question.",
            whyAskOrNot: "Do not ask again, and do not promote the answer beyond authority.",
            fingerprint: "gap:scenario-b-cost",
          }),
        }),
      },
    );
  }

  const needs = collectNeeds(input).filter((item) => {
    if (alreadyAsked(session, item.provenance.fingerprint) && item.acquisitionAction === "ASK_MANAGER") {
      return false;
    }
    return true;
  });
  const primary = pickPrimary(needs);
  if (!primary) {
    if (
      isEcaInformationRequirementRequest(utterance) &&
      !informationRequirementHijackProtected(input.actionPlan, utterance) &&
      session.lastFingerprint === "gap:relationship-evidence"
    ) {
      return noNeed(
        input,
        "NO_ACQUISITION_NEEDED",
        "The manager asked what is needed, but no remaining information gap is required.",
        {
          explanation: "I don’t need additional information for the question we just resolved.",
          advisorConsumedInformationNeed: true,
        },
      );
    }
    return noNeed(input, "NO_ACQUISITION_NEEDED", "No identifiable information gap is required for the current executive objective.");
  }

  if (primary.question && isVague(primary.question.text)) {
    return noNeed(input, "NO_ACQUISITION_NEEDED", "Rejected a vague question that does not name the missing information.");
  }

  if (
    primary.acquisitionAction === "ASK_MANAGER" &&
    alreadyAsked(session, primary.provenance.fingerprint)
  ) {
    return noNeed(input, "PROCEED_WITH_UNCERTAINTY", "The same unanswered question was already asked.", {
      primaryNeed: primary,
      proceedWithUncertainty: true,
    });
  }

  const competing = freeze(needs.filter((item) => item.id !== primary.id));
  if (primary.necessity === "OPTIONAL") {
    return withNeed(input, { ...primary, acquisitionAction: "NO_ACQUISITION_NEEDED", question: null }, competing, "Optional unknowns must not generate questions.");
  }

  const initiativeOnly =
    input.initiative?.shouldIntervene === true &&
    input.initiative.reason !== "MISSING_CRITICAL_INFORMATION" &&
    primary.necessity !== "BLOCKING" &&
    primary.necessity !== "REQUIRED";
  if (initiativeOnly && primary.acquisitionAction === "ASK_MANAGER") {
    return withNeed(
      input,
      {
        ...primary,
        acquisitionAction: "NO_ACQUISITION_NEEDED",
        question: null,
        provenance: freeze({
          ...primary.provenance,
          whyAskOrNot: "ECA:3 intervention is not a license to ask a new question.",
        }),
      },
      competing,
      "ECA:4 must not ask whenever ECA:3 intervenes.",
    );
  }

  const consumeRequirement =
    isEcaInformationRequirementRequest(utterance) &&
    !informationRequirementHijackProtected(input.actionPlan, utterance) &&
    (primary.provenance.fingerprint === "gap:relationship-evidence" ||
      primary.provenance.fingerprint === "ambiguity:relationship-referent" ||
      associatedOthersOf(input).length > 0);
  return withNeed(
    input,
    primary,
    competing,
    primary.provenance.whyAskOrNot,
    consumeRequirement
      ? {
          shouldAsk: false,
          explanation: composeInformationRequirementAnswer(input, primary, associatedOthersOf(input)),
          advisorConsumedInformationNeed: true,
        }
      : undefined,
  );
}

export function nextEcaInformationNeedSession(
  previous: EcaInformationNeedSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveInformationNeedJudgment,
  associatedOthers: readonly EcaSubject[] = [],
  focalSubject: EcaSubject | null = null,
): EcaInformationNeedSession {
  const base = previous ?? emptyEcaInformationNeedSession();
  const fingerprint = judgment.primaryNeed?.provenance.fingerprint ?? base.lastFingerprint;
  const asked = [...base.askedFingerprints];
  const unknown = [...base.unknownFingerprints];
  const declined = [...base.declinedFingerprints];
  if (judgment.shouldAsk && fingerprint && !asked.includes(fingerprint)) asked.push(fingerprint);
  if (isEcaInformationNeedUnknownAnswer(utterance) && fingerprint && !unknown.includes(fingerprint)) {
    unknown.push(fingerprint);
  }
  if (isEcaInformationNeedSkip(utterance) && fingerprint && !declined.includes(fingerprint)) {
    declined.push(fingerprint);
  }
  return freeze({
    lastFingerprint: fingerprint,
    lastQuestion: isEcaInformationNeedWhyFollowUp(utterance)
      ? base.lastQuestion
      : judgment.question?.text ?? base.lastQuestion,
    lastExplanation: judgment.explanation ?? base.lastExplanation,
    lastNeedId: judgment.primaryNeed?.id ?? base.lastNeedId,
    askedFingerprints: freeze(asked.slice(-12)),
    unknownFingerprints: freeze(unknown.slice(-12)),
    declinedFingerprints: freeze(declined.slice(-12)),
    lastAssociatedOthers: freeze(
      associatedOthers.length > 0 ? [...associatedOthers] : [...base.lastAssociatedOthers],
    ),
    lastFocalSubject: focalSubject ?? judgment.primaryNeed?.subject ?? base.lastFocalSubject,
  });
}

export function composeEcaRuntimeKnownInformation(input: {
  readonly utterance: string;
  readonly goalTarget?: string | null;
  readonly nca3ShouldAsk?: boolean;
  readonly nca3Question?: string | null;
  readonly managerRole?: string | null;
  readonly associatedOthers?: readonly EcaSubject[];
  readonly focalSubject?: EcaSubject | null;
  readonly confirmedDataByField?: Readonly<Record<string, string>>;
  readonly valuePresentByField?: Readonly<Record<string, boolean>>;
}): EcaKnownInformation {
  const targetFromUtterance =
    input.utterance.match(/(?:target|goal)[^%]{0,40}(\d+(?:\.\d+)?%)/i) ??
    input.utterance.match(/(\d+(?:\.\d+)?%)[^.]{0,24}(?:goal|target)/i);
  const capAv = /\bcap_av\b/i.test(input.utterance);
  return freeze({
    deliveryTarget: input.goalTarget ?? (targetFromUtterance ? targetFromUtterance[1] : null),
    confirmedDataByField: input.confirmedDataByField,
    valuePresentByField: capAv
      ? freeze({ CAP_AV: true, ...(input.valuePresentByField ?? {}) })
      : input.valuePresentByField,
    semanticStatusByField: capAv ? freeze({ CAP_AV: "LIKELY" as const }) : undefined,
    nca3ShouldAsk: input.nca3ShouldAsk === true,
    nca3Question: input.nca3Question ?? null,
    managerRole: input.managerRole ?? null,
    associatedOthers: input.associatedOthers,
    focalSubject: input.focalSubject ?? null,
  });
}

export function applyEcaInformationNeedToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveInformationNeedJudgment;
  readonly locked?: boolean;
  readonly nca3ShouldAsk?: boolean;
}): string {
  if (input.locked) return input.source;
  if (isEcaInformationRequirementRequest(input.utterance) && input.judgment.advisorConsumedInformationNeed && input.judgment.explanation) {
    return input.judgment.explanation;
  }
  if (
    (isEcaInformationNeedUnknownAnswer(input.utterance) || /^i don['’]?t know\b/i.test(input.utterance.trim())) &&
    input.judgment.explanation &&
    /relationship as unresolved/i.test(input.judgment.explanation)
  ) {
    return input.judgment.explanation;
  }
  if (
    input.judgment.primaryNeed?.provenance.fingerprint === "gap:relationship-evidence" &&
    input.judgment.explanation &&
    !input.judgment.shouldAsk
  ) {
    return input.judgment.explanation;
  }
  if (isEcaInformationNeedWhyFollowUp(input.utterance) && input.judgment.explanation) {
    if (input.source.toLowerCase().includes(input.judgment.explanation.slice(0, 24).toLowerCase())) {
      return input.source;
    }
    return `${input.source} ${input.judgment.explanation}`.trim();
  }
  if (
    (isEcaInformationNeedUnknownAnswer(input.utterance) || isEcaInformationNeedSkip(input.utterance)) &&
    input.judgment.explanation &&
    input.judgment.acquisitionAction !== "ASK_MANAGER"
  ) {
    if (/\?/.test(input.judgment.explanation)) return input.source;
    return `${input.source} ${input.judgment.explanation}`.trim();
  }
  if (!input.judgment.shouldAsk || !input.judgment.question) return input.source;
  if (input.nca3ShouldAsk) return input.source;
  if (isVague(input.judgment.question.text)) return input.source;
  if (input.source.toLowerCase().includes(input.judgment.question.text.slice(0, 18).toLowerCase())) {
    return input.source;
  }
  return `${input.source} ${input.judgment.question.text}`.trim();
}

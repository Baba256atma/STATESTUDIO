/**
 * NPA-T NPS:2 — Problem Understanding & Investigation.
 *
 * Read-oriented path composition over NPS:1 plus existing Problem,
 * investigation, evidence, and ECA questioning authorities.
 * Does not own those authorities or perform NPS:3 cause analysis.
 */

import {
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsPathState,
  type NpsProblemSolvingPath,
  type NpsSupportingReference,
} from "./npsProblemSolvingPath.ts";

export const NPS_PROBLEM_UNDERSTANDING_IDENTITY =
  "NPA-T NPS:2/ProblemUnderstandingInvestigation" as const;

export const NPS_UNDERSTANDING_STATUSES = Object.freeze([
  "INSUFFICIENT",
  "PARTIAL",
  "INVESTIGABLE",
  "SUFFICIENT_FOR_NEXT_STEP",
  "BLOCKED",
] as const);
export type NpsUnderstandingStatus = (typeof NPS_UNDERSTANDING_STATUSES)[number];

export const NPS_INVESTIGATION_ACTIONS = Object.freeze([
  "ASK_MANAGER",
  "INVESTIGATE_EXISTING_EVIDENCE",
  "CLARIFY_PROBLEM",
  "WAIT_FOR_EVIDENCE",
  "READY_FOR_NEXT_STEP",
] as const);
export type NpsInvestigationAction = (typeof NPS_INVESTIGATION_ACTIONS)[number];

export const NPS_PROBLEM_UNDERSTANDING_BOUNDARY = Object.freeze({
  identity: NPS_PROBLEM_UNDERSTANDING_IDENTITY,
  newAuthorityLayer: false as const,
  createsProblemAuthority: false as const,
  createsQuestioningAuthority: false as const,
  createsInvestigationEngine: false as const,
  ecaRemainsConversationAuthority: true as const,
  investigationOwner: "FINAL:5 investigation composer" as const,
  questioningOwner: "NPA-T ECA:4" as const,
  answerIntakeOwner: "NPA-T ECA:5" as const,
  evidenceOwner: "Data Reality / CC:8" as const,
  convertsAssumptionsToFacts: false as const,
  guessesProblemWhenUncertain: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesScenario: false as const,
  fabricatesEvidence: false as const,
  performsCauseAnalysis: false as const,
  observationEqualsCause: false as const,
  symptomEqualsCause: false as const,
  correlationEqualsCause: false as const,
  managerStatementEqualsVerifiedCause: false as const,
  investigationClueEqualsConfirmedCause: false as const,
  pathAdvancementMutatesCanonicalState: false as const,
});

export type NpsObservedStatement = Readonly<{
  text: string;
  epistemic: "FACT" | "SYMPTOM" | "CONSTRAINT" | "ASSUMPTION" | "UNKNOWN";
  observedFrom: string;
}>;

export type NpsEvidenceAvailability = Readonly<{
  id: string | null;
  label: string;
  trust: "TRUSTED" | "UNTRUSTED" | "UNAVAILABLE";
  observedFrom: string;
}>;

export type NpsCausalSafetyObservation = Readonly<{
  text: string;
  relation: "SYMPTOM" | "CORRELATION" | "ASSOCIATION" | "RECORDED_CAUSAL_SUPPORT";
  supportedByExistingCausalAuthority: boolean;
}>;

export type NpsUnderstandingFacts = Readonly<{
  knownFacts: readonly NpsObservedStatement[];
  knownSymptoms: readonly NpsObservedStatement[];
  knownConstraints: readonly NpsObservedStatement[];
  unknowns: readonly NpsObservedStatement[];
  assumptions: readonly NpsObservedStatement[];
  unresolvedQuestions: readonly string[];
  availableEvidence: readonly NpsEvidenceAvailability[];
  missingEvidence: readonly NpsEvidenceAvailability[];
  managerKnowledgeRequired: boolean;
  requiredEvidenceUnavailable: boolean;
  trustedEvidenceAvailable: boolean;
  investigationActive: boolean;
  investigationCompleted: boolean;
  usableEvidenceForReview: boolean;
  nextInvestigationNeed: string | null;
  usefulQuestion: string | null;
  causalObservations: readonly NpsCausalSafetyObservation[];
}>;

export type NpsQuestioningHandoff = Readonly<{
  required: boolean;
  owner: "NPA-T ECA:4";
  intakeOwner: "NPA-T ECA:5";
  investigationNeed: string | null;
  suggestedQuestion: string | null;
  npsSelectsQuestion: false;
}>;

export type NpsInvestigationHandoff = Readonly<{
  required: boolean;
  owner: "FINAL:5 investigation composer";
  causalOwner: "CORE-INT:3";
  investigationNeed: string | null;
  npsPerformsInvestigation: false;
}>;

export type NpsUnderstandingManagerProjection = Readonly<{
  problem: string;
  whatWeKnow: string | null;
  whatIsStillUnclear: string | null;
  whatIsMissing: string | null;
  nextUsefulStep: string | null;
  usefulQuestion: string | null;
  text: string;
}>;

export type NpsProblemUnderstanding = Readonly<{
  identity: typeof NPS_PROBLEM_UNDERSTANDING_IDENTITY;
  problemId: string | null;
  problemTitle: string | null;
  problemOwnership: NpsProblemSolvingPath["problemOwnership"];
  knownFacts: readonly string[];
  knownSymptoms: readonly string[];
  knownConstraints: readonly string[];
  unknowns: readonly string[];
  assumptions: readonly string[];
  unresolvedQuestions: readonly string[];
  availableEvidence: readonly string[];
  missingEvidence: readonly string[];
  understandingStatus: NpsUnderstandingStatus;
  nextInvestigationNeed: string | null;
  action: NpsInvestigationAction;
  questioningHandoff: NpsQuestioningHandoff;
  investigationHandoff: NpsInvestigationHandoff;
  path: NpsProblemSolvingPath;
  readyForEvidenceReview: boolean;
  confirmedCause: null;
  investigationDirection: string | null;
  supportingReferences: readonly NpsSupportingReference[];
  managerProjection: NpsUnderstandingManagerProjection;
  unknownsRemainExplicit: true;
  canonicalMutations: readonly [];
  commitsDecision: false;
  startsExecution: false;
  writesScenario: false;
  fabricatesEvidence: false;
  boundary: typeof NPS_PROBLEM_UNDERSTANDING_BOUNDARY;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function texts(items: readonly NpsObservedStatement[]): readonly string[] {
  return freeze(items.map((item) => item.text).filter((text) => text.trim().length > 0));
}

function evidenceLabels(items: readonly NpsEvidenceAvailability[]): readonly string[] {
  return freeze(items.map((item) => item.label).filter((label) => label.trim().length > 0));
}

function architectureLeak(text: string): boolean {
  return /\b(?:NPS|ECA|CC:\d|resolver|authority|composer|Director|Theatre)\b/i.test(text);
}

function firstSentence(items: readonly string[], fallback: string | null): string | null {
  const hit = items.find((item) => item.trim().length > 0) ?? fallback;
  return hit?.trim() ? hit.trim() : null;
}

function resolveAction(
  path: NpsProblemSolvingPath,
  facts: NpsUnderstandingFacts,
): NpsInvestigationAction {
  if (path.problemOwnership !== "DETERMINED") return "CLARIFY_PROBLEM";
  if (facts.requiredEvidenceUnavailable && !facts.trustedEvidenceAvailable && !facts.managerKnowledgeRequired) {
    return "WAIT_FOR_EVIDENCE";
  }
  if (facts.usableEvidenceForReview && facts.investigationCompleted) {
    return "READY_FOR_NEXT_STEP";
  }
  if (facts.trustedEvidenceAvailable) return "INVESTIGATE_EXISTING_EVIDENCE";
  if (facts.managerKnowledgeRequired) return "ASK_MANAGER";
  if (facts.requiredEvidenceUnavailable) return "WAIT_FOR_EVIDENCE";
  if (facts.unknowns.length === 0 && facts.unresolvedQuestions.length === 0) {
    return "READY_FOR_NEXT_STEP";
  }
  return "ASK_MANAGER";
}

function resolveStatus(
  action: NpsInvestigationAction,
  facts: NpsUnderstandingFacts,
): NpsUnderstandingStatus {
  if (action === "CLARIFY_PROBLEM" || action === "WAIT_FOR_EVIDENCE") return "BLOCKED";
  if (action === "READY_FOR_NEXT_STEP") return "SUFFICIENT_FOR_NEXT_STEP";
  if (action === "INVESTIGATE_EXISTING_EVIDENCE") return "INVESTIGABLE";
  if (facts.knownFacts.length > 0 || facts.knownSymptoms.length > 0) return "PARTIAL";
  return "INSUFFICIENT";
}

function integratePath(
  pathFacts: NpsCanonicalFacts,
  understanding: NpsUnderstandingFacts,
): NpsProblemSolvingPath {
  let evidenceState = pathFacts.evidenceState;
  if (understanding.usableEvidenceForReview) {
    evidenceState = understanding.missingEvidence.length === 0 ? "SUFFICIENT" : "PARTIAL";
  } else if (understanding.availableEvidence.some((item) => item.trust === "TRUSTED")) {
    evidenceState = evidenceState === "NONE" ? "PARTIAL" : evidenceState;
  }
  return composeNpsProblemSolvingPath(
    freeze({
      ...pathFacts,
      investigationPresent: pathFacts.investigationPresent || understanding.investigationActive,
      evidenceState,
    }),
  );
}

function managerText(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  title: string;
  action: NpsInvestigationAction;
  known: string | null;
  unclear: string | null;
  missing: string | null;
  next: string | null;
  question: string | null;
}): string {
  if (input.ownership !== "DETERMINED") {
    return "The active Problem is not determined. Clarify which Problem to investigate before gathering evidence.";
  }
  if (input.action === "ASK_MANAGER") {
    return [
      `Problem: ${input.title}`,
      input.missing ? `What is missing: ${input.missing}` : null,
      input.question ? `Useful question: ${input.question}` : null,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
  }
  return [
    `Problem: ${input.title}`,
    input.known ? `What we know: ${input.known}` : null,
    input.unclear ? `What is still unclear: ${input.unclear}` : null,
    input.next ? `Next useful step: ${input.next}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

function investigationDirection(
  facts: NpsUnderstandingFacts,
): string | null {
  const recorded = facts.causalObservations.find(
    (item) => item.relation === "RECORDED_CAUSAL_SUPPORT" && item.supportedByExistingCausalAuthority,
  );
  if (recorded) {
    return `${recorded.text} Existing evidence already records this relationship; it is not a new root-cause conclusion.`;
  }
  const clue = facts.causalObservations[0];
  if (!clue) return facts.nextInvestigationNeed;
  if (clue.relation === "SYMPTOM") {
    return `${clue.text} That is a symptom to investigate, not a confirmed cause.`;
  }
  if (clue.relation === "CORRELATION" || clue.relation === "ASSOCIATION") {
    return `${clue.text} That association should be investigated; it is not a confirmed cause.`;
  }
  return facts.nextInvestigationNeed;
}

export function composeNpsProblemUnderstanding(input: {
  readonly path: NpsProblemSolvingPath;
  readonly pathFacts: NpsCanonicalFacts;
  readonly understanding: NpsUnderstandingFacts;
}): NpsProblemUnderstanding {
  const action = resolveAction(input.path, input.understanding);
  const status = resolveStatus(action, input.understanding);
  const integrated = input.path.problemOwnership === "DETERMINED"
    ? integratePath(input.pathFacts, input.understanding)
    : input.path;
  const knownFacts = texts(input.understanding.knownFacts);
  const knownSymptoms = texts(input.understanding.knownSymptoms);
  const knownConstraints = texts(input.understanding.knownConstraints);
  const unknowns = texts(input.understanding.unknowns);
  const assumptions = texts(input.understanding.assumptions);
  const need =
    action === "CLARIFY_PROBLEM"
      ? "Determine the active Problem before investigating."
      : input.understanding.nextInvestigationNeed;
  const usefulQuestion = action === "ASK_MANAGER" ? input.understanding.usefulQuestion : null;
  const title = input.path.problemLabel?.trim() || "This Problem";
  const known = firstSentence(knownFacts, firstSentence(knownSymptoms, null));
  const unclear = firstSentence(unknowns, firstSentence(input.understanding.unresolvedQuestions, null));
  const missing = firstSentence(
    evidenceLabels(input.understanding.missingEvidence),
    firstSentence(unknowns, null),
  );
  const projection = freeze({
    problem: input.path.problemOwnership === "DETERMINED" ? title : "Not determined",
    whatWeKnow: action === "ASK_MANAGER" ? null : known,
    whatIsStillUnclear: action === "ASK_MANAGER" ? null : unclear,
    whatIsMissing: action === "ASK_MANAGER" ? missing : null,
    nextUsefulStep: action === "ASK_MANAGER" || action === "CLARIFY_PROBLEM" ? null : need,
    usefulQuestion,
    text: managerText({
      ownership: input.path.problemOwnership,
      title,
      action,
      known,
      unclear,
      missing,
      next: need,
      question: usefulQuestion,
    }),
  });
  if (architectureLeak(projection.text)) {
    throw new Error("NPS:2 manager projection leaked architecture terminology");
  }

  const readyForEvidenceReview =
    action !== "CLARIFY_PROBLEM" &&
    input.understanding.investigationCompleted &&
    input.understanding.usableEvidenceForReview;

  return freeze({
    identity: NPS_PROBLEM_UNDERSTANDING_IDENTITY,
    problemId: input.path.problemId,
    problemTitle: input.path.problemLabel,
    problemOwnership: input.path.problemOwnership,
    knownFacts,
    knownSymptoms,
    knownConstraints,
    unknowns,
    assumptions,
    unresolvedQuestions: freeze([...input.understanding.unresolvedQuestions]),
    availableEvidence: evidenceLabels(input.understanding.availableEvidence),
    missingEvidence: evidenceLabels(input.understanding.missingEvidence),
    understandingStatus: status,
    nextInvestigationNeed: need,
    action,
    questioningHandoff: freeze({
      required: action === "ASK_MANAGER",
      owner: "NPA-T ECA:4",
      intakeOwner: "NPA-T ECA:5",
      investigationNeed: action === "ASK_MANAGER" ? need : null,
      suggestedQuestion: usefulQuestion,
      npsSelectsQuestion: false,
    }),
    investigationHandoff: freeze({
      required: action === "INVESTIGATE_EXISTING_EVIDENCE",
      owner: "FINAL:5 investigation composer",
      causalOwner: "CORE-INT:3",
      investigationNeed: action === "INVESTIGATE_EXISTING_EVIDENCE" ? need : null,
      npsPerformsInvestigation: false,
    }),
    path: integrated,
    readyForEvidenceReview,
    confirmedCause: null,
    investigationDirection: investigationDirection(input.understanding),
    supportingReferences: integrated.supportingReferences,
    managerProjection: projection,
    unknownsRemainExplicit: true,
    canonicalMutations: freeze([]),
    commitsDecision: false,
    startsExecution: false,
    writesScenario: false,
    fabricatesEvidence: false,
    boundary: NPS_PROBLEM_UNDERSTANDING_BOUNDARY,
  });
}

export function attemptNpsUnderstandingAdvancement(
  understanding: NpsProblemUnderstanding,
): ReturnType<typeof attemptNpsPathAdvancement> &
  Readonly<{
    scenarioWrites: 0;
    evidenceFabricated: false;
  }> {
  const advanced = attemptNpsPathAdvancement(understanding.path);
  return freeze({
    ...advanced,
    scenarioWrites: 0,
    evidenceFabricated: false,
  });
}

export function npsPathStateAfterUnderstanding(
  understanding: NpsProblemUnderstanding,
): NpsPathState | null {
  return understanding.path.currentState;
}

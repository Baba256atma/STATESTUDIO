/**
 * NPA-T NPS:3 — Evidence & Cause Analysis.
 *
 * Read-oriented path composition over NPS:1–2 plus Data Reality, CC:8,
 * CORE-INT:3, and DATA-ADV semantic confidence. Does not own evidence,
 * invent causality, generate options, or start NPS:4.
 */

import {
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsEvidenceState,
  type NpsPathState,
  type NpsProblemSolvingPath,
  type NpsSupportingReference,
} from "./npsProblemSolvingPath.ts";
import type { NpsProblemUnderstanding } from "./npsProblemUnderstanding.ts";

export const NPS_EVIDENCE_CAUSE_ANALYSIS_IDENTITY =
  "NPA-T NPS:3/EvidenceCauseAnalysis" as const;

export const NPS_EVIDENCE_CLASSIFICATIONS = Object.freeze([
  "DATA",
  "OBSERVATION",
  "EVIDENCE",
  "RELATIONSHIP",
  "PATTERN",
  "POSSIBLE_CONTRIBUTOR",
  "POSSIBLE_CAUSE",
  "SUPPORTED_CAUSE",
] as const);
export type NpsEvidenceClassification = (typeof NPS_EVIDENCE_CLASSIFICATIONS)[number];

export const NPS_EVIDENCE_SUFFICIENCIES = Object.freeze([
  "NONE",
  "INSUFFICIENT",
  "LIMITED",
  "USABLE",
  "STRONG",
  "CONFLICTING",
] as const);
export type NpsEvidenceSufficiency = (typeof NPS_EVIDENCE_SUFFICIENCIES)[number];

export const NPS_CAUSAL_LADDER = Object.freeze([
  "OBSERVED",
  "ASSOCIATED",
  "POSSIBLE_CONTRIBUTOR",
  "SUPPORTED_CONTRIBUTOR",
  "POSSIBLE_CAUSE",
  "SUPPORTED_CAUSE",
  "CONFIRMED_CAUSE",
] as const);
export type NpsCausalLadder = (typeof NPS_CAUSAL_LADDER)[number];

export const NPS_CONTRIBUTOR_STATUSES = Object.freeze([
  "POSSIBLE",
  "SUPPORTED_CONTRIBUTOR",
  "WEAK",
  "CONFLICTING",
  "REJECTED",
] as const);
export type NpsContributorStatus = (typeof NPS_CONTRIBUTOR_STATUSES)[number];

export const NPS_CAUSE_HYPOTHESIS_STATUSES = Object.freeze([
  "POSSIBLE_CAUSE",
  "SUPPORTED_CAUSE",
  "WEAKENED",
  "REJECTED",
] as const);
export type NpsCauseHypothesisStatus = (typeof NPS_CAUSE_HYPOTHESIS_STATUSES)[number];

export const NPS_EVIDENCE_ACTIONS = Object.freeze([
  "ASK_MANAGER",
  "INVESTIGATE_EXISTING_EVIDENCE",
  "REQUEST_MORE_EVIDENCE",
  "TEST_HYPOTHESIS",
  "READY_FOR_OPTIONS",
  "CLARIFY_PROBLEM",
] as const);
export type NpsEvidenceAction = (typeof NPS_EVIDENCE_ACTIONS)[number];

export const NPS_EVIDENCE_CAUSE_BOUNDARY = Object.freeze({
  identity: NPS_EVIDENCE_CAUSE_ANALYSIS_IDENTITY,
  newAuthorityLayer: false as const,
  createsEvidenceStore: false as const,
  createsCausalEngine: false as const,
  createsVariableIntelligence: false as const,
  dataRealityRemainsDataAuthority: true as const,
  evidenceOwner: "CC:8 / Data Reality" as const,
  causalOwner: "CORE-INT:3" as const,
  semanticOwner: "DATA-ADV" as const,
  promotesClassificationIndependently: false as const,
  dataEqualsEvidence: false as const,
  evidenceEqualsCorrelation: false as const,
  correlationEqualsContributor: false as const,
  contributorEqualsCause: false as const,
  possibleCauseEqualsConfirmedCause: false as const,
  hidesContradictingEvidence: false as const,
  generatesScenarios: false as const,
  generatesRecommendations: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  pathAdvancementMutatesCanonicalState: false as const,
  variableIntelligenceRuntimeReady: false as const,
});

export type NpsEvidenceItemFact = Readonly<{
  id: string;
  label: string;
  classification: NpsEvidenceClassification;
  observation: string | null;
  interpretation: string | null;
  sourceId: string | null;
  sourceType: string | null;
  field: string | null;
  timeRange: string | null;
  semanticConfidence: "CONFIRMED" | "UNCONFIRMED" | "UNRESOLVED" | "NONE";
  managerConfirmation: boolean;
  evidenceStatus: "TRUSTED" | "UNTRUSTED" | "UNRESOLVED" | "MISSING";
  existingCausalAuthority: boolean;
  contradicting: boolean;
  confounder: boolean;
  supportingReference: string;
}>;

export type NpsContributorFact = Readonly<{
  candidateId: string;
  label: string;
  relationshipToProblem: string;
  supportingEvidenceIds: readonly string[];
  contradictingEvidenceIds: readonly string[];
  status: NpsContributorStatus;
  confidence: "low" | "medium" | "high" | "unknown";
  uncertainty: string;
  existingCausalAuthority: boolean;
}>;

export type NpsCauseHypothesisFact = Readonly<{
  id: string;
  label: string;
  supportingEvidenceIds: readonly string[];
  contradictingEvidenceIds: readonly string[];
  alternativeExplanationIds: readonly string[];
  confounderIds: readonly string[];
  status: NpsCauseHypothesisStatus;
  confidence: "low" | "medium" | "high" | "unknown";
  existingCausalAuthority: boolean;
  confirmedByExistingAuthority: boolean;
}>;

export type NpsEvidenceCauseFacts = Readonly<{
  items: readonly NpsEvidenceItemFact[];
  contributors: readonly NpsContributorFact[];
  hypotheses: readonly NpsCauseHypothesisFact[];
  patterns: readonly string[];
  nextEvidenceNeed: string | null;
  nextCausalTest: string | null;
  managerKnowledgeRequired: boolean;
}>;

export type NpsEvidenceCauseManagerProjection = Readonly<{
  problem: string;
  whatTheEvidenceShows: string | null;
  possibleContributor: string | null;
  whatIsNotProven: string | null;
  alternativeExplanation: string | null;
  nextUsefulTest: string | null;
  text: string;
}>;

export type NpsEvidenceCauseAnalysis = Readonly<{
  identity: typeof NPS_EVIDENCE_CAUSE_ANALYSIS_IDENTITY;
  problemId: string | null;
  problemTitle: string | null;
  problemOwnership: NpsProblemSolvingPath["problemOwnership"];
  evidenceItems: readonly NpsEvidenceItemFact[];
  evidenceStatus: "NONE" | "UNRESOLVED" | "TRUSTED" | "MIXED";
  evidenceSufficiency: NpsEvidenceSufficiency;
  observations: readonly string[];
  interpretations: readonly string[];
  patterns: readonly string[];
  relationships: readonly string[];
  possibleContributors: readonly NpsContributorFact[];
  possibleCauses: readonly NpsCauseHypothesisFact[];
  supportedCauses: readonly NpsCauseHypothesisFact[];
  rejectedHypotheses: readonly NpsCauseHypothesisFact[];
  uncertainties: readonly string[];
  confounders: readonly string[];
  alternativeExplanations: readonly string[];
  causalStatus: NpsCausalLadder | "NONE";
  confirmedCause: null | string;
  nextEvidenceNeed: string | null;
  nextCausalTest: string | null;
  action: NpsEvidenceAction;
  readyForOptions: boolean;
  variableRolesAvailable: false;
  variableIntelligenceGap: string;
  supportingReferences: readonly NpsSupportingReference[];
  path: NpsProblemSolvingPath;
  managerProjection: NpsEvidenceCauseManagerProjection;
  canonicalMutations: readonly [];
  fabricatesEvidence: false;
  writesScenario: false;
  writesRecommendation: false;
  commitsDecision: false;
  startsExecution: false;
  boundary: typeof NPS_EVIDENCE_CAUSE_BOUNDARY;
}>;

const LADDER_RANK: Readonly<Record<NpsCausalLadder, number>> = Object.freeze({
  OBSERVED: 0,
  ASSOCIATED: 1,
  POSSIBLE_CONTRIBUTOR: 2,
  SUPPORTED_CONTRIBUTOR: 3,
  POSSIBLE_CAUSE: 4,
  SUPPORTED_CAUSE: 5,
  CONFIRMED_CAUSE: 6,
});

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function capItem(item: NpsEvidenceItemFact): NpsEvidenceItemFact {
  if (item.semanticConfidence === "UNRESOLVED" || item.evidenceStatus === "UNRESOLVED") {
    return freeze({
      ...item,
      classification: "DATA",
      interpretation: null,
      evidenceStatus: "UNRESOLVED",
    });
  }
  if (
    (item.classification === "POSSIBLE_CAUSE" || item.classification === "SUPPORTED_CAUSE") &&
    !item.existingCausalAuthority
  ) {
    return freeze({ ...item, classification: "POSSIBLE_CONTRIBUTOR" });
  }
  return item;
}

function sufficiencyOf(
  items: readonly NpsEvidenceItemFact[],
  contributors: readonly NpsContributorFact[],
): NpsEvidenceSufficiency {
  const usable = items.filter((item) => item.evidenceStatus === "TRUSTED" && item.classification !== "DATA");
  if (items.some((item) => item.contradicting) || contributors.some((item) => item.status === "CONFLICTING")) {
    if (usable.length > 0) return "CONFLICTING";
  }
  if (usable.length === 0) {
    if (items.some((item) => item.evidenceStatus === "UNRESOLVED")) return "INSUFFICIENT";
    return items.length === 0 ? "NONE" : "INSUFFICIENT";
  }
  const hasRelationship = usable.some(
    (item) =>
      item.classification === "RELATIONSHIP" ||
      item.classification === "PATTERN" ||
      item.classification === "POSSIBLE_CONTRIBUTOR",
  );
  const supported = contributors.some((item) => item.status === "SUPPORTED_CONTRIBUTOR");
  if (supported && usable.length >= 2) return "STRONG";
  if (hasRelationship || contributors.length > 0) return "USABLE";
  if (usable.some((item) => item.classification === "OBSERVATION" || item.classification === "EVIDENCE")) {
    return "LIMITED";
  }
  return "INSUFFICIENT";
}

function ladderOf(
  items: readonly NpsEvidenceItemFact[],
  contributors: readonly NpsContributorFact[],
  hypotheses: readonly NpsCauseHypothesisFact[],
): NpsCausalLadder | "NONE" {
  if (hypotheses.some((item) => item.confirmedByExistingAuthority && item.existingCausalAuthority)) {
    return "CONFIRMED_CAUSE";
  }
  if (hypotheses.some((item) => item.status === "SUPPORTED_CAUSE" && item.existingCausalAuthority)) {
    return "SUPPORTED_CAUSE";
  }
  if (hypotheses.some((item) => item.status === "POSSIBLE_CAUSE" && item.existingCausalAuthority)) {
    return "POSSIBLE_CAUSE";
  }
  if (contributors.some((item) => item.status === "SUPPORTED_CONTRIBUTOR")) {
    return "SUPPORTED_CONTRIBUTOR";
  }
  if (contributors.some((item) => item.status === "POSSIBLE") || items.some((item) => item.classification === "POSSIBLE_CONTRIBUTOR")) {
    return "POSSIBLE_CONTRIBUTOR";
  }
  if (items.some((item) => item.classification === "RELATIONSHIP" || item.classification === "PATTERN")) {
    return "ASSOCIATED";
  }
  if (items.some((item) => item.classification === "OBSERVATION" || item.classification === "EVIDENCE")) {
    return "OBSERVED";
  }
  return "NONE";
}

function mapEvidenceState(sufficiency: NpsEvidenceSufficiency): NpsEvidenceState {
  if (sufficiency === "NONE") return "NONE";
  if (sufficiency === "INSUFFICIENT") return "INSUFFICIENT";
  if (sufficiency === "STRONG") return "SUFFICIENT";
  return "PARTIAL";
}

function resolveAction(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  sufficiency: NpsEvidenceSufficiency;
  managerKnowledgeRequired: boolean;
  unresolvedSemantics: boolean;
  trustedData: boolean;
  alternatives: number;
  readyForOptions: boolean;
}): NpsEvidenceAction {
  if (input.ownership !== "DETERMINED") return "CLARIFY_PROBLEM";
  if (input.unresolvedSemantics && input.managerKnowledgeRequired) return "ASK_MANAGER";
  if (input.sufficiency === "NONE" || input.sufficiency === "INSUFFICIENT") {
    return input.trustedData ? "INVESTIGATE_EXISTING_EVIDENCE" : "REQUEST_MORE_EVIDENCE";
  }
  if (input.readyForOptions) return "READY_FOR_OPTIONS";
  if (input.alternatives > 0 || input.sufficiency === "CONFLICTING") return "TEST_HYPOTHESIS";
  if (input.trustedData && input.sufficiency === "LIMITED") return "INVESTIGATE_EXISTING_EVIDENCE";
  return "TEST_HYPOTHESIS";
}

function managerText(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  title: string;
  sufficiency: NpsEvidenceSufficiency;
  shows: string | null;
  contributor: string | null;
  unproven: string | null;
  alternative: string | null;
  next: string | null;
}): string {
  if (input.ownership !== "DETERMINED") {
    return "The active Problem is not determined. Clarify which Problem the evidence should explain before analysing causes.";
  }
  if (input.sufficiency === "NONE" || input.sufficiency === "INSUFFICIENT") {
    return [
      `Problem: ${input.title}`,
      "There is not enough reliable evidence yet to identify a likely cause.",
      input.next ? `The next useful step is to ${input.next.charAt(0).toLowerCase()}${input.next.slice(1)}` : null,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
  }
  return [
    `Problem: ${input.title}`,
    input.shows ? `What the evidence shows: ${input.shows}` : null,
    input.contributor ? `Possible contributor: ${input.contributor}` : null,
    input.unproven ? `What is not proven: ${input.unproven}` : null,
    input.alternative ? `Alternative explanation: ${input.alternative}` : null,
    input.next ? `Next useful test: ${input.next}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export function composeNpsEvidenceCauseAnalysis(input: {
  readonly path: NpsProblemSolvingPath;
  readonly pathFacts: NpsCanonicalFacts;
  readonly understanding?: NpsProblemUnderstanding | null;
  readonly facts: NpsEvidenceCauseFacts;
}): NpsEvidenceCauseAnalysis {
  const cappedItems = freeze(input.facts.items.map(capItem));
  const hypotheses = freeze(
    input.facts.hypotheses.map((item) =>
      item.confirmedByExistingAuthority && !item.existingCausalAuthority
        ? freeze({ ...item, confirmedByExistingAuthority: false, status: "POSSIBLE_CAUSE" as const })
        : item.status === "SUPPORTED_CAUSE" && !item.existingCausalAuthority
          ? freeze({ ...item, status: "POSSIBLE_CAUSE" as const })
          : item,
    ),
  );
  const contributors = freeze(input.facts.contributors);
  const sufficiency = sufficiencyOf(cappedItems, contributors);
  const causalStatus = ladderOf(cappedItems, contributors, hypotheses);
  const confirmed =
    hypotheses.find((item) => item.confirmedByExistingAuthority && item.existingCausalAuthority) ?? null;
  const possibleCauses = freeze(
    hypotheses.filter((item) => item.status === "POSSIBLE_CAUSE" || item.status === "WEAKENED"),
  );
  const supportedCauses = freeze(hypotheses.filter((item) => item.status === "SUPPORTED_CAUSE" && item.existingCausalAuthority));
  const rejected = freeze(hypotheses.filter((item) => item.status === "REJECTED"));
  const confounders = freeze([
    ...cappedItems.filter((item) => item.confounder).map((item) => item.label),
    ...hypotheses.flatMap((item) => item.confounderIds),
  ].filter((value, index, all) => all.indexOf(value) === index));
  const alternatives = freeze([
    ...hypotheses.flatMap((item) => item.alternativeExplanationIds),
    ...contributors.filter((item) => item.candidateId !== contributors[0]?.candidateId).map((item) => item.label),
  ].filter((value, index, all) => all.indexOf(value) === index));
  const uncertainties = freeze([
    ...cappedItems.filter((item) => item.evidenceStatus === "UNRESOLVED").map((item) => `${item.label} meaning is unresolved.`),
    ...contributors.map((item) => item.uncertainty).filter(Boolean),
    confirmed ? null : "No confirmed cause is established.",
  ].filter((item): item is string => Boolean(item)));
  const unresolvedSemantics = cappedItems.some((item) => item.evidenceStatus === "UNRESOLVED");
  const trustedData = cappedItems.some((item) => item.evidenceStatus === "TRUSTED" || item.classification === "DATA" && item.semanticConfidence !== "UNRESOLVED");
  const readyForOptions =
    input.path.problemOwnership === "DETERMINED" &&
    (sufficiency === "USABLE" || sufficiency === "STRONG" || sufficiency === "CONFLICTING") &&
    contributors.length > 0 &&
    confirmed == null;
  const action = resolveAction({
    ownership: input.path.problemOwnership,
    sufficiency,
    managerKnowledgeRequired: input.facts.managerKnowledgeRequired,
    unresolvedSemantics,
    trustedData,
    alternatives: alternatives.length,
    readyForOptions,
  });
  const causeHypothesesAvailable =
    contributors.length > 0 || hypotheses.length > 0 || causalStatus === "POSSIBLE_CONTRIBUTOR" || causalStatus === "ASSOCIATED";
  const integrated =
    input.path.problemOwnership === "DETERMINED"
      ? composeNpsProblemSolvingPath(
          freeze({
            ...input.pathFacts,
            investigationPresent: input.pathFacts.investigationPresent || Boolean(input.understanding?.path.completedStates.includes("INVESTIGATING")),
            evidenceState: mapEvidenceState(sufficiency),
            causeHypothesesAvailable,
            scenarioIds: freeze([]),
          }),
        )
      : input.path;

  const shows =
    cappedItems.find((item) => item.observation && item.evidenceStatus === "TRUSTED")?.observation ??
    cappedItems.find((item) => item.interpretation)?.interpretation ??
    null;
  const contributorLabel = contributors[0]?.label ?? null;
  const unproven =
    confirmed == null
      ? contributorLabel
        ? `We do not yet know whether ${contributorLabel.toLowerCase()} is the main cause.`
        : "A confirmed cause is not established."
      : null;
  const alternative = alternatives[0] ?? confounders[0] ?? null;
  const next =
    input.facts.nextCausalTest ??
    input.facts.nextEvidenceNeed ??
    (sufficiency === "NONE" || sufficiency === "INSUFFICIENT"
      ? "Review capacity, demand, staffing, and downtime over the same period."
      : "Compare the leading contributor against remaining alternative explanations.");
  const title = input.path.problemLabel?.trim() || "This Problem";
  const projection = freeze({
    problem: input.path.problemOwnership === "DETERMINED" ? title : "Not determined",
    whatTheEvidenceShows: shows,
    possibleContributor: contributorLabel,
    whatIsNotProven: unproven,
    alternativeExplanation: alternative,
    nextUsefulTest: next,
    text: managerText({
      ownership: input.path.problemOwnership,
      title,
      sufficiency,
      shows,
      contributor: contributorLabel,
      unproven,
      alternative,
      next,
    }),
  });
  if (/\b(?:NPS|ECA|CC:\d|CORE-INT|resolver|composer|authority)\b/i.test(projection.text)) {
    throw new Error("NPS:3 manager projection leaked architecture terminology");
  }

  const evidenceStatus: NpsEvidenceCauseAnalysis["evidenceStatus"] =
    cappedItems.length === 0
      ? "NONE"
      : unresolvedSemantics && !cappedItems.some((item) => item.evidenceStatus === "TRUSTED")
        ? "UNRESOLVED"
        : unresolvedSemantics
          ? "MIXED"
          : "TRUSTED";

  return freeze({
    identity: NPS_EVIDENCE_CAUSE_ANALYSIS_IDENTITY,
    problemId: input.path.problemId,
    problemTitle: input.path.problemLabel,
    problemOwnership: input.path.problemOwnership,
    evidenceItems: cappedItems,
    evidenceStatus,
    evidenceSufficiency: sufficiency,
    observations: freeze(cappedItems.map((item) => item.observation).filter((item): item is string => Boolean(item))),
    interpretations: freeze(cappedItems.map((item) => item.interpretation).filter((item): item is string => Boolean(item))),
    patterns: freeze([...input.facts.patterns]),
    relationships: freeze(
      cappedItems.filter((item) => item.classification === "RELATIONSHIP" || item.classification === "PATTERN").map((item) => item.label),
    ),
    possibleContributors: contributors,
    possibleCauses,
    supportedCauses,
    rejectedHypotheses: rejected,
    uncertainties,
    confounders,
    alternativeExplanations: alternatives,
    causalStatus,
    confirmedCause: confirmed?.label ?? null,
    nextEvidenceNeed: input.facts.nextEvidenceNeed,
    nextCausalTest: input.facts.nextCausalTest,
    action,
    readyForOptions,
    variableRolesAvailable: false,
    variableIntelligenceGap:
      "Lever, moderator, control, and confounder roles from Variable Intelligence are not a certified runtime authority for NPS:3; confounders are preserved only when supplied by existing evidence or relationships.",
    supportingReferences: integrated.supportingReferences,
    path: integrated,
    managerProjection: projection,
    canonicalMutations: freeze([]),
    fabricatesEvidence: false,
    writesScenario: false,
    writesRecommendation: false,
    commitsDecision: false,
    startsExecution: false,
    boundary: NPS_EVIDENCE_CAUSE_BOUNDARY,
  });
}

export function attemptNpsEvidenceCauseAdvancement(
  analysis: NpsEvidenceCauseAnalysis,
): ReturnType<typeof attemptNpsPathAdvancement> &
  Readonly<{
    evidenceFabricated: false;
    scenarioWrites: 0;
    recommendationWrites: 0;
  }> {
  const advanced = attemptNpsPathAdvancement(analysis.path);
  return freeze({
    ...advanced,
    evidenceFabricated: false,
    scenarioWrites: 0,
    recommendationWrites: 0,
  });
}

export function npsPathStateAfterEvidenceCause(
  analysis: NpsEvidenceCauseAnalysis,
): NpsPathState | null {
  return analysis.path.currentState;
}

export function causalLadderDoesNotSkip(from: NpsCausalLadder | "NONE", to: NpsCausalLadder): boolean {
  if (from === "NONE") return to === "OBSERVED" || to === "ASSOCIATED";
  return LADDER_RANK[to] - LADDER_RANK[from] <= 1 || LADDER_RANK[to] <= LADDER_RANK[from];
}

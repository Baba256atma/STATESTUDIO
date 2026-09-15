/**
 * NPA-T NPS:5 — Comparison & Recommendation.
 *
 * Read-oriented path composition over NPS:1–4 plus NCA-POST:4 and ECA:7 / NCA:4.
 * Does not own comparison, recommendation, commitment, or Decision.
 */

import {
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsPathState,
  type NpsProblemSolvingPath,
  type NpsSupportingReference,
} from "./npsProblemSolvingPath.ts";
import type { NpsOptionCandidate, NpsOptionGeneration } from "./npsOptionGeneration.ts";

export const NPS_COMPARISON_RECOMMENDATION_IDENTITY =
  "NPA-T NPS:5/ComparisonRecommendation" as const;

export const NPS_COMPARISON_STATUSES = Object.freeze([
  "NOT_READY",
  "COMPARING",
  "INSUFFICIENT_INFORMATION",
  "TRADEOFFS_AVAILABLE",
  "NO_CLEAR_PREFERENCE",
  "PREFERENCE_EMERGING",
  "READY_FOR_RECOMMENDATION",
] as const);
export type NpsComparisonStatus = (typeof NPS_COMPARISON_STATUSES)[number];

export const NPS_RECOMMENDATION_STATUSES = Object.freeze([
  "RECOMMEND",
  "DEFER",
  "NO_CLEAR_PREFERENCE",
  "CONDITIONAL_RECOMMENDATION",
] as const);
export type NpsRecommendationStatus = (typeof NPS_RECOMMENDATION_STATUSES)[number];

export const NPS_COMPARISON_ACTIONS = Object.freeze([
  "CLARIFY_PROBLEM",
  "NEED_MORE_OPTIONS",
  "ASK_MANAGER",
  "DEFER",
  "READY_FOR_COMMITMENT_REVIEW",
] as const);
export type NpsComparisonAction = (typeof NPS_COMPARISON_ACTIONS)[number];

export const NPS_COMMITMENT_READINESS = Object.freeze([
  "NOT_READY",
  "NEEDS_MORE_COMPARISON",
  "NEEDS_MANAGER_PRIORITY",
  "NEEDS_VALIDATION",
  "READY_FOR_COMMITMENT_REVIEW",
] as const);
export type NpsCommitmentReadiness = (typeof NPS_COMMITMENT_READINESS)[number];

export const NPS_COMPARISON_RECOMMENDATION_BOUNDARY = Object.freeze({
  identity: NPS_COMPARISON_RECOMMENDATION_IDENTITY,
  newAuthorityLayer: false as const,
  createsComparisonEngine: false as const,
  createsRecommendationEngine: false as const,
  createsScoringAuthority: false as const,
  comparisonOwner: "NCA-POST:4" as const,
  recommendationOwner: "ECA:7 / NCA:4" as const,
  commitmentOwner: "ECA:8" as const,
  decisionOwner: "CC:10" as const,
  executionOwner: "CC:11" as const,
  comparisonEqualsRecommendation: false as const,
  recommendationEqualsManagerPreference: false as const,
  recommendationEqualsCommitment: false as const,
  recommendationEqualsDecision: false as const,
  inventsNumericScores: false as const,
  inventsCostValues: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  pathAdvancementMutatesCanonicalState: false as const,
});

export type NpsManagerPriority = "FAST_RECOVERY" | "LOW_COST" | null;

export type NpsComparedOption = Readonly<{
  optionId: string;
  title: string;
  canonicalScenarioId: string | null;
  scenarioStatus: NpsOptionCandidate["scenarioStatus"];
  advantages: readonly string[];
  disadvantages: readonly string[];
  constraints: readonly string[];
  assumptions: readonly string[];
  uncertainties: readonly string[];
  evidenceSupport: readonly string[];
  expectedCost: "UNKNOWN";
  expectedTime: "UNKNOWN";
  expectedImpact: string;
  score: null;
}>;

export type NpsComparisonFacts = Readonly<{
  managerPriority: NpsManagerPriority;
  managerPreferenceOptionId: string | null;
  supplierAvailability: "UNKNOWN" | "CONFIRMED" | "UNAVAILABLE";
  criticalInformationMissing: boolean;
  requireManagerPriority: boolean;
  noClearPreference: boolean;
}>;

export type NpsComparisonManagerProjection = Readonly<{
  problem: string;
  options: readonly string[];
  currentRecommendation: string | null;
  why: string | null;
  remainingUncertainty: string | null;
  nextStep: string | null;
  text: string;
}>;

export type NpsComparisonRecommendation = Readonly<{
  identity: typeof NPS_COMPARISON_RECOMMENDATION_IDENTITY;
  problemId: string | null;
  problemTitle: string | null;
  comparedOptions: readonly NpsComparedOption[];
  comparisonCriteria: readonly string[];
  tradeoffs: readonly NpsComparedOption[];
  advantages: readonly string[];
  disadvantages: readonly string[];
  constraints: readonly string[];
  assumptions: readonly string[];
  uncertainties: readonly string[];
  evidenceSupport: readonly string[];
  dominanceStatus: "NONE" | "WEAKER_ON_KNOWN_CRITERIA";
  comparisonStatus: NpsComparisonStatus;
  recommendationStatus: NpsRecommendationStatus | null;
  recommendedOptionId: string | null;
  recommendationRationale: string | null;
  recommendationConditions: readonly string[];
  recommendationUncertainty: string | null;
  managerPreference: string | null;
  nexoraRecommendation: string | null;
  committedOption: null;
  approvedDecision: null;
  nextStep: string | null;
  action: NpsComparisonAction;
  commitmentReadiness: NpsCommitmentReadiness;
  comparisonHandoff: Readonly<{ owner: "NCA-POST:4"; npsOwnsComparison: false }>;
  recommendationHandoff: Readonly<{ owner: "ECA:7 / NCA:4"; npsOwnsRecommendation: false }>;
  supportingReferences: readonly NpsSupportingReference[];
  path: NpsProblemSolvingPath;
  managerProjection: NpsComparisonManagerProjection;
  confirmedCauseUsedAsFact: false;
  canonicalMutations: readonly [];
  writesEvidence: false;
  writesScenario: false;
  writesRecommendationStore: false;
  commitsDecision: false;
  startsExecution: false;
  writesOutcome: false;
  boundary: typeof NPS_COMPARISON_RECOMMENDATION_BOUNDARY;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function qualitativeTradeoffs(option: NpsOptionCandidate): Pick<NpsComparedOption, "advantages" | "disadvantages"> {
  if (option.intent === "TRANSFER" || /external/i.test(option.title)) {
    return {
      advantages: freeze(["Faster deployment", "More reversible", "Avoids immediate permanent expansion"]),
      disadvantages: freeze(["Higher variable cost", "Supplier dependency", "Availability still unconfirmed"]),
    };
  }
  if (option.intent === "ABSORB" || /expansion/i.test(option.title)) {
    return {
      advantages: freeze(["Stronger long-term internal capacity"]),
      disadvantages: freeze(["Slower implementation", "Higher permanent commitment", "Lower reversibility"]),
    };
  }
  if (option.intent === "ADAPT") {
    return {
      advantages: freeze(["Reduces load without adding capacity"]),
      disadvantages: freeze(["Delivery commitments may be delayed"]),
    };
  }
  return {
    advantages: freeze(["Avoids immediate resource commitment", "Lets the gap be observed"]),
    disadvantages: freeze(["The gap may worsen during the observation period"]),
  };
}

function relevantCriteria(priority: NpsManagerPriority): readonly string[] {
  if (priority === "FAST_RECOVERY") {
    return freeze(["speed", "capacity impact", "reversibility", "operational risk"]);
  }
  if (priority === "LOW_COST") return freeze(["cost", "capacity impact", "reversibility"]);
  return freeze(["speed", "capacity impact", "cost", "operational risk", "reversibility"]);
}

function toCompared(option: NpsOptionCandidate): NpsComparedOption {
  const sides = qualitativeTradeoffs(option);
  return freeze({
    optionId: option.reusedScenarioId ?? option.candidateId,
    title: option.title,
    canonicalScenarioId: option.reusedScenarioId,
    scenarioStatus: option.scenarioStatus,
    advantages: sides.advantages,
    disadvantages: sides.disadvantages,
    constraints: freeze([...option.constraints]),
    assumptions: freeze([...option.assumptions]),
    uncertainties: freeze([...option.uncertainties]),
    evidenceSupport: freeze([...option.supportingEvidence]),
    expectedCost: "UNKNOWN",
    expectedTime: "UNKNOWN",
    expectedImpact: option.expectedDirection,
    score: null,
  });
}

function pickExternal(options: readonly NpsOptionCandidate[]): NpsOptionCandidate | null {
  return options.find((item) => item.intent === "TRANSFER" || /external/i.test(item.title)) ?? null;
}

function pickExpansion(options: readonly NpsOptionCandidate[]): NpsOptionCandidate | null {
  return (
    options.find((item) => item.reusedScenarioId != null || /expansion/i.test(item.title)) ??
    options.find((item) => item.intent === "ABSORB" && !item.currentlyInfeasible) ??
    null
  );
}

function managerText(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  title: string;
  compared: readonly NpsComparedOption[];
  recommendation: string | null;
  why: string | null;
  uncertainty: string | null;
  next: string | null;
  action: NpsComparisonAction;
}): string {
  if (input.ownership !== "DETERMINED") {
    return "The active Problem is not determined. Clarify which Problem these options belong to before comparing them.";
  }
  if (input.action === "NEED_MORE_OPTIONS") {
    return `Problem: ${input.title}\nThe current option set is not diverse enough for a meaningful comparison. More distinct responses are needed first.`;
  }
  if (input.action === "ASK_MANAGER") {
    return `Problem: ${input.title}\nTwo viable responses remain. Which matters more here: fastest capacity recovery or lowest long-term cost?`;
  }
  if (input.action === "DEFER" && !input.recommendation) {
    return `Problem: ${input.title}\nComparison is deferred because a critical comparison fact is still missing. No winner is selected.`;
  }
  const lines = input.compared.flatMap((item) => [
    item.title,
    ...item.advantages.map((entry) => `- ${entry}`),
    ...item.disadvantages.map((entry) => `- ${entry}`),
  ]);
  return [
    `Problem: ${input.title}`,
    "The strongest current options are:",
    ...lines,
    input.recommendation ? `Current recommendation: ${input.recommendation}` : "Current recommendation: none.",
    input.why ? `Why: ${input.why}` : null,
    input.uncertainty ? `Remaining uncertainty: ${input.uncertainty}` : null,
    input.next ? `Next step: ${input.next}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

function emptyUncertain(
  options: NpsOptionGeneration,
): NpsComparisonRecommendation {
  const path = options.path;
  const projection = freeze({
    problem: "Not determined",
    options: freeze([] as string[]),
    currentRecommendation: null,
    why: null,
    remainingUncertainty: null,
    nextStep: "Determine the active Problem",
    text: managerText({
      ownership: options.path.problemOwnership,
      title: "This Problem",
      compared: freeze([]),
      recommendation: null,
      why: null,
      uncertainty: null,
      next: "Determine the active Problem",
      action: "CLARIFY_PROBLEM",
    }),
  });
  return freeze({
    identity: NPS_COMPARISON_RECOMMENDATION_IDENTITY,
    problemId: options.problemId,
    problemTitle: options.problemTitle,
    comparedOptions: freeze([]),
    comparisonCriteria: freeze([]),
    tradeoffs: freeze([]),
    advantages: freeze([]),
    disadvantages: freeze([]),
    constraints: freeze([]),
    assumptions: freeze([]),
    uncertainties: freeze([]),
    evidenceSupport: freeze([]),
    dominanceStatus: "NONE",
    comparisonStatus: "NOT_READY",
    recommendationStatus: null,
    recommendedOptionId: null,
    recommendationRationale: null,
    recommendationConditions: freeze([]),
    recommendationUncertainty: null,
    managerPreference: null,
    nexoraRecommendation: null,
    committedOption: null,
    approvedDecision: null,
    nextStep: "Determine the active Problem",
    action: "CLARIFY_PROBLEM",
    commitmentReadiness: "NOT_READY",
    comparisonHandoff: freeze({ owner: "NCA-POST:4", npsOwnsComparison: false }),
    recommendationHandoff: freeze({ owner: "ECA:7 / NCA:4", npsOwnsRecommendation: false }),
    supportingReferences: path.supportingReferences,
    path,
    managerProjection: projection,
    confirmedCauseUsedAsFact: false,
    canonicalMutations: freeze([]),
    writesEvidence: false,
    writesScenario: false,
    writesRecommendationStore: false,
    commitsDecision: false,
    startsExecution: false,
    writesOutcome: false,
    boundary: NPS_COMPARISON_RECOMMENDATION_BOUNDARY,
  });
}

export function composeNpsComparisonRecommendation(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly options: NpsOptionGeneration;
  readonly facts?: Partial<NpsComparisonFacts>;
}): NpsComparisonRecommendation {
  const facts: NpsComparisonFacts = freeze({
    managerPriority: input.facts?.managerPriority ?? null,
    managerPreferenceOptionId: input.facts?.managerPreferenceOptionId ?? null,
    supplierAvailability: input.facts?.supplierAvailability ?? "UNKNOWN",
    criticalInformationMissing: input.facts?.criticalInformationMissing === true,
    requireManagerPriority: input.facts?.requireManagerPriority === true,
    noClearPreference: input.facts?.noClearPreference === true,
  });
  if (input.options.path.problemOwnership !== "DETERMINED") {
    return emptyUncertain(input.options);
  }

  const feasible = input.options.optionCandidates.filter((item) => {
    if (item.currentlyInfeasible) return false;
    if (facts.supplierAvailability === "UNAVAILABLE" && (item.intent === "TRANSFER" || /external/i.test(item.title))) {
      return false;
    }
    return true;
  });
  const compared = freeze(feasible.map(toCompared));
  const criteria = relevantCriteria(facts.managerPriority);
  const external = pickExternal(feasible);
  const expansion = pickExpansion(feasible);
  const insufficientCoverage =
    input.options.coverage === "INSUFFICIENT" ||
    input.options.generationStatus !== "READY_FOR_COMPARISON" ||
    compared.length < 2;

  let action: NpsComparisonAction = "DEFER";
  let comparisonStatus: NpsComparisonStatus = "TRADEOFFS_AVAILABLE";
  let recommendationStatus: NpsRecommendationStatus | null = null;
  let recommended: NpsOptionCandidate | null = null;
  let rationale: string | null = null;
  let conditions: readonly string[] = freeze([]);
  let commitment: NpsCommitmentReadiness = "NEEDS_MORE_COMPARISON";

  if (insufficientCoverage) {
    action = "NEED_MORE_OPTIONS";
    comparisonStatus = "NOT_READY";
  } else if (facts.criticalInformationMissing) {
    action = "DEFER";
    comparisonStatus = "INSUFFICIENT_INFORMATION";
    recommendationStatus = "DEFER";
    commitment = "NOT_READY";
  } else if (facts.requireManagerPriority && facts.managerPriority == null) {
    action = "ASK_MANAGER";
    comparisonStatus = "PREFERENCE_EMERGING";
    commitment = "NEEDS_MANAGER_PRIORITY";
  } else if (facts.noClearPreference && facts.managerPriority == null) {
    action = "DEFER";
    comparisonStatus = "NO_CLEAR_PREFERENCE";
    recommendationStatus = "NO_CLEAR_PREFERENCE";
    commitment = "NEEDS_MANAGER_PRIORITY";
    rationale =
      "Internal capacity is faster on workforce terms while external capacity is more flexible, but current evidence does not establish a clear preference.";
  } else {
    recommended = facts.managerPriority === "LOW_COST" ? expansion ?? external : external ?? expansion;
    if (
      recommended &&
      recommended === external &&
      (recommended.requiresValidation || facts.supplierAvailability === "UNKNOWN")
    ) {
      recommendationStatus = "CONDITIONAL_RECOMMENDATION";
      conditions = freeze(["Qualified external capacity must be available."]);
      rationale =
        "It addresses the short-term Capacity Gap faster and with less permanent commitment than internal expansion.";
      commitment = "NEEDS_VALIDATION";
      action = "DEFER";
      comparisonStatus = "READY_FOR_RECOMMENDATION";
    } else if (recommended) {
      recommendationStatus = "RECOMMEND";
      rationale =
        facts.managerPriority === "LOW_COST"
          ? "It better matches a lowest-cost priority among the currently feasible responses."
          : facts.supplierAvailability === "UNAVAILABLE"
            ? "External capacity is no longer feasible, so the remaining internal response is the current recommended direction."
            : "It better matches short-term capacity recovery among the currently feasible responses.";
      commitment = "READY_FOR_COMMITMENT_REVIEW";
      action = "READY_FOR_COMMITMENT_REVIEW";
      comparisonStatus = "READY_FOR_RECOMMENDATION";
    }
  }

  const uncertainty =
    input.options.uncertainties[0] ??
    "The underlying cause of the Capacity Gap is not fully confirmed.";
  const next =
    action === "ASK_MANAGER"
      ? "Confirm whether fastest recovery or lowest long-term cost matters more."
      : action === "NEED_MORE_OPTIONS"
        ? "Develop additional distinct response options before comparing."
        : recommendationStatus === "DEFER"
          ? "Gather the missing comparison fact before selecting a direction."
          : recommendationStatus === "NO_CLEAR_PREFERENCE"
            ? "Confirm external capacity availability and cost."
            : recommendationStatus === "CONDITIONAL_RECOMMENDATION"
              ? "Validate external capacity before commitment."
              : action === "READY_FOR_COMMITMENT_REVIEW"
                ? "Review commitment. This is not an approved Decision."
                : "Compare these options on the relevant trade-offs.";

  const recommendedId = recommended ? recommended.reusedScenarioId ?? recommended.candidateId : null;
  const recommendedTitle = recommended?.title ?? null;
  const managerPrefOption =
    feasible.find(
      (item) =>
        item.candidateId === facts.managerPreferenceOptionId ||
        item.reusedScenarioId === facts.managerPreferenceOptionId,
    ) ?? null;
  const recLine =
    recommendationStatus === "CONDITIONAL_RECOMMENDATION" && recommendedTitle
      ? `${recommendedTitle}, if supplier capacity can be confirmed.`
      : recommendationStatus === "NO_CLEAR_PREFERENCE"
        ? "No clear preference."
        : recommendationStatus === "DEFER"
          ? "Deferred until the missing comparison fact is available."
          : recommendedTitle;

  const pathReady = !insufficientCoverage;
  const recommendationReady =
    recommendationStatus === "RECOMMEND" ||
    recommendationStatus === "CONDITIONAL_RECOMMENDATION" ||
    recommendationStatus === "NO_CLEAR_PREFERENCE" ||
    recommendationStatus === "DEFER";
  const integrated = pathReady
    ? composeNpsProblemSolvingPath(
        freeze({
          ...input.pathFacts,
          investigationPresent: true,
          evidenceState:
            input.pathFacts.evidenceState === "NONE" ? "PARTIAL" : input.pathFacts.evidenceState,
          causeHypothesesAvailable: true,
          scenarioIds: freeze(compared.map((item) => item.canonicalScenarioId ?? item.optionId)),
          scenarioObservedFrom: "NPS:4 option composition; canonical Scenario writes remain CC:9",
          comparisonAvailable: true,
          comparisonObservedFrom: "NCA-POST:4 comparison composition observed by NPS:5",
          recommendationReady,
          recommendationObservedFrom: recommendationReady
            ? "ECA:7 / NCA:4 recommendation composition observed by NPS:5"
            : undefined,
          awaitingCommitment: false,
        }),
      )
    : input.options.path;

  const expansionId = expansion?.reusedScenarioId ?? expansion?.candidateId;
  const primary = compared.filter(
    (item) =>
      item.optionId === recommendedId ||
      item.canonicalScenarioId != null ||
      /external/i.test(item.title) ||
      item.optionId === expansionId,
  );
  const focusedCompared = freeze((primary.length >= 2 ? primary : compared).slice(0, 2));

  const projection = freeze({
    problem: input.options.problemTitle ?? "This Problem",
    options: freeze(focusedCompared.map((item) => item.title)),
    currentRecommendation: recLine,
    why: rationale,
    remainingUncertainty: uncertainty,
    nextStep: next,
    text: managerText({
      ownership: input.options.path.problemOwnership,
      title: input.options.problemTitle ?? "This Problem",
      compared: focusedCompared,
      recommendation: recLine,
      why: rationale,
      uncertainty,
      next,
      action,
    }),
  });
  if (/\b(?:NPS|ECA|CC:\d|CORE-INT|NCA|resolver|composer|authority)\b/i.test(projection.text)) {
    throw new Error("NPS:5 manager projection leaked architecture terminology");
  }
  if (/\$\d|\b\d{2,3}\s*\/\s*100\b/.test(projection.text)) {
    throw new Error("NPS:5 manager projection invented numeric precision");
  }

  return freeze({
    identity: NPS_COMPARISON_RECOMMENDATION_IDENTITY,
    problemId: input.options.problemId,
    problemTitle: input.options.problemTitle,
    comparedOptions: compared,
    comparisonCriteria: criteria,
    tradeoffs: compared,
    advantages: freeze(compared.flatMap((item) => item.advantages)),
    disadvantages: freeze(compared.flatMap((item) => item.disadvantages)),
    constraints: freeze(input.options.constraints),
    assumptions: freeze(feasible.flatMap((item) => [...item.assumptions])),
    uncertainties: freeze([...input.options.uncertainties]),
    evidenceSupport: freeze([...input.options.relevantEvidence]),
    dominanceStatus: "NONE",
    comparisonStatus,
    recommendationStatus,
    recommendedOptionId: recommendedId,
    recommendationRationale: rationale,
    recommendationConditions: conditions,
    recommendationUncertainty: uncertainty,
    managerPreference: managerPrefOption?.title ?? null,
    nexoraRecommendation: recommendedTitle,
    committedOption: null,
    approvedDecision: null,
    nextStep: next,
    action,
    commitmentReadiness: commitment,
    comparisonHandoff: freeze({ owner: "NCA-POST:4", npsOwnsComparison: false }),
    recommendationHandoff: freeze({ owner: "ECA:7 / NCA:4", npsOwnsRecommendation: false }),
    supportingReferences: integrated.supportingReferences,
    path: integrated,
    managerProjection: projection,
    confirmedCauseUsedAsFact: false,
    canonicalMutations: freeze([]),
    writesEvidence: false,
    writesScenario: false,
    writesRecommendationStore: false,
    commitsDecision: false,
    startsExecution: false,
    writesOutcome: false,
    boundary: NPS_COMPARISON_RECOMMENDATION_BOUNDARY,
  });
}

export function attemptNpsComparisonRecommendationAdvancement(
  comparison: NpsComparisonRecommendation,
): ReturnType<typeof attemptNpsPathAdvancement> &
  Readonly<{
    comparisonWrites: 0;
    recommendationWrites: 0;
    unauthorizedScenarioWrites: 0;
  }> {
  const advanced = attemptNpsPathAdvancement(comparison.path);
  return freeze({
    ...advanced,
    comparisonWrites: 0,
    recommendationWrites: 0,
    unauthorizedScenarioWrites: 0,
  });
}

export function npsPathStateAfterComparison(
  comparison: NpsComparisonRecommendation,
): NpsPathState | null {
  return comparison.path.currentState;
}

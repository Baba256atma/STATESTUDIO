/**
 * NPA-T NPS:4 — Options & Scenario Generation.
 *
 * Read-oriented path composition over NPS:1–3. Composes option candidates and
 * routes them to CC:9. Does not write Scenarios, recommend, decide, or execute.
 */

import {
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsPathState,
  type NpsProblemSolvingPath,
  type NpsSupportingReference,
} from "./npsProblemSolvingPath.ts";
import type { NpsEvidenceCauseAnalysis } from "./npsEvidenceCauseAnalysis.ts";

export const NPS_OPTION_GENERATION_IDENTITY =
  "NPA-T NPS:4/OptionsScenarioGeneration" as const;

export const NPS_OPTION_INTENTS = Object.freeze([
  "REMOVE",
  "REDUCE",
  "ABSORB",
  "TRANSFER",
  "ADAPT",
  "DEFER",
  "MONITOR",
  "DO_NOTHING",
] as const);
export type NpsOptionIntent = (typeof NPS_OPTION_INTENTS)[number];

export const NPS_OPTION_GENERATION_STATUSES = Object.freeze([
  "NOT_READY",
  "NEEDS_CLARIFICATION",
  "OPTIONS_AVAILABLE",
  "INSUFFICIENT_COVERAGE",
  "READY_FOR_COMPARISON",
  "BLOCKED",
] as const);
export type NpsOptionGenerationStatus = (typeof NPS_OPTION_GENERATION_STATUSES)[number];

export const NPS_OPTION_SCENARIO_STATUSES = Object.freeze([
  "OPTION_CANDIDATE",
  "REUSES_CANONICAL",
  "CURRENTLY_INFEASIBLE",
  "REQUIRES_VALIDATION",
] as const);
export type NpsOptionScenarioStatus = (typeof NPS_OPTION_SCENARIO_STATUSES)[number];

export const NPS_OPTION_ACTIONS = Object.freeze([
  "CLARIFY_PROBLEM",
  "ASK_MANAGER",
  "INVESTIGATE_EXISTING_EVIDENCE",
  "REQUEST_MORE_EVIDENCE",
  "READY_FOR_COMPARISON",
] as const);
export type NpsOptionAction = (typeof NPS_OPTION_ACTIONS)[number];

export const NPS_OPTION_GENERATION_BOUNDARY = Object.freeze({
  identity: NPS_OPTION_GENERATION_IDENTITY,
  newAuthorityLayer: false as const,
  createsScenarioStore: false as const,
  createsScenarioAuthority: false as const,
  scenarioWriter: "CC:9/ScenarioConversation" as const,
  comparisonOwner: "NCA-POST:4" as const,
  recommendationOwner: "ECA:7 / NCA:4" as const,
  decisionOwner: "CC:10" as const,
  executionOwner: "CC:11" as const,
  candidateEqualsCanonicalScenario: false as const,
  optionEqualsRecommendation: false as const,
  optionEqualsDecision: false as const,
  contributorEqualsConfirmedCause: false as const,
  bypassesCc9: false as const,
  writesEvidence: false as const,
  writesRecommendation: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  pathAdvancementMutatesCanonicalState: false as const,
});

export type NpsExistingScenarioRef = Readonly<{
  id: string;
  title: string;
  mechanism: string;
  problemId: string | null;
}>;

export type NpsHardConstraint = Readonly<{
  id: string;
  label: string;
  kind: "HIRING_FREEZE" | "BUDGET" | "POLICY" | "TIME" | "QUALITY" | "OTHER";
}>;

export type NpsOptionCandidate = Readonly<{
  candidateId: string;
  title: string;
  intent: NpsOptionIntent;
  addresses: string;
  mechanism: string;
  assumptions: readonly string[];
  requiredConditions: readonly string[];
  constraints: readonly string[];
  supportingEvidence: readonly string[];
  contributorLabels: readonly string[];
  problemId: string | null;
  uncertainties: readonly string[];
  expectedDirection: string;
  potentialRisks: readonly string[];
  scenarioStatus: NpsOptionScenarioStatus;
  reusedScenarioId: string | null;
  cc9Kind: "do-nothing" | "intervention" | "custom";
  currentlyInfeasible: boolean;
  requiresValidation: boolean;
}>;

export type NpsOptionGenerationFacts = Readonly<{
  existingScenarios: readonly NpsExistingScenarioRef[];
  hardConstraints: readonly NpsHardConstraint[];
  externalAvailabilityUnknown: boolean;
  includeHiringOption: boolean;
  managerKnowledgeRequired: boolean;
}>;

export type NpsScenarioHandoff = Readonly<{
  owner: "CC:9/ScenarioConversation";
  npsWritesScenario: false;
  candidates: readonly NpsOptionCandidate[];
}>;

export type NpsOptionManagerProjection = Readonly<{
  problem: string;
  options: readonly string[];
  importantUncertainty: string | null;
  nextStep: string | null;
  text: string;
}>;

export type NpsOptionGeneration = Readonly<{
  identity: typeof NPS_OPTION_GENERATION_IDENTITY;
  problemId: string | null;
  problemTitle: string | null;
  generationStatus: NpsOptionGenerationStatus;
  problemObjective: string | null;
  relevantEvidence: readonly string[];
  contributorsConsidered: readonly string[];
  supportedContributors: readonly string[];
  constraints: readonly string[];
  uncertainties: readonly string[];
  optionCandidates: readonly NpsOptionCandidate[];
  coverage: "NONE" | "INSUFFICIENT" | "SUFFICIENT";
  missingOptionNeed: string | null;
  nextStep: string | null;
  action: NpsOptionAction;
  recommendation: null;
  preferredOption: null;
  scenarioHandoff: NpsScenarioHandoff;
  readyForComparison: boolean;
  confirmedCauseUsedAsFact: false;
  supportingReferences: readonly NpsSupportingReference[];
  path: NpsProblemSolvingPath;
  managerProjection: NpsOptionManagerProjection;
  canonicalMutations: readonly [];
  writesEvidence: false;
  writesScenario: false;
  writesRecommendation: false;
  commitsDecision: false;
  startsExecution: false;
  writesOutcome: false;
  boundary: typeof NPS_OPTION_GENERATION_BOUNDARY;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function reuseScenario(
  existing: readonly NpsExistingScenarioRef[],
  mechanism: string,
): NpsExistingScenarioRef | null {
  const normalized = mechanism.toLowerCase();
  return (
    existing.find((item) => {
      const haystack = `${item.title} ${item.mechanism}`.toLowerCase();
      return (
        haystack.includes(normalized) ||
        (normalized.includes("capacity") && /expansion|capacity/i.test(haystack))
      );
    }) ?? null
  );
}

function option(input: Omit<NpsOptionCandidate, "currentlyInfeasible" | "requiresValidation">): NpsOptionCandidate {
  return freeze({
    ...input,
    currentlyInfeasible: input.scenarioStatus === "CURRENTLY_INFEASIBLE",
    requiresValidation: input.scenarioStatus === "REQUIRES_VALIDATION",
  });
}

function composeCandidates(
  analysis: NpsEvidenceCauseAnalysis,
  facts: NpsOptionGenerationFacts,
): readonly NpsOptionCandidate[] {
  if (analysis.problemOwnership !== "DETERMINED" || !analysis.problemId) return freeze([]);
  const evidence = analysis.observations;
  const contributors = analysis.possibleContributors.map((item) => item.label);
  const alternative = analysis.alternativeExplanations[0] ?? analysis.confounders[0] ?? null;
  const uncertainty = analysis.confirmedCause
    ? null
    : analysis.uncertainties[0] ?? "A confirmed cause is not established.";
  const weak =
    analysis.evidenceSufficiency === "NONE" || analysis.evidenceSufficiency === "INSUFFICIENT";
  const hiringFreeze = facts.hardConstraints.some((item) => item.kind === "HIRING_FREEZE");
  const candidates: NpsOptionCandidate[] = [];
  const stamp = (
    input: Omit<NpsOptionCandidate, "currentlyInfeasible" | "requiresValidation" | "contributorLabels" | "problemId">,
  ) =>
    option({
      ...input,
      contributorLabels: freeze(contributors),
      problemId: analysis.problemId,
    });

  if (weak) {
    candidates.push(
      stamp({
        candidateId: "opt-monitor",
        title: "Continue current operations and monitor the gap",
        intent: "MONITOR",
        addresses: analysis.problemTitle ?? "the Problem",
        mechanism: "observe without intervening",
        assumptions: freeze(["Further observation will not violate a hard constraint."]),
        requiredConditions: freeze([]),
        constraints: freeze(facts.hardConstraints.map((item) => item.label)),
        supportingEvidence: evidence,
        uncertainties: freeze(uncertainty ? [uncertainty] : []),
        expectedDirection: "Clarify whether the pressure is temporary before committing resources.",
        potentialRisks: freeze(["The gap may worsen during the observation period."]),
        scenarioStatus: "OPTION_CANDIDATE",
        reusedScenarioId: null,
        cc9Kind: "do-nothing",
      }),
    );
    return freeze(candidates);
  }

  const absorbReuse = reuseScenario(facts.existingScenarios, "capacity expansion");
  candidates.push(
    stamp({
      candidateId: absorbReuse?.id ?? "opt-internal-capacity",
      title: absorbReuse ? absorbReuse.title : "Temporarily increase internal capacity",
      intent: "ABSORB",
      addresses: "Potential short-term demand/capacity mismatch",
      mechanism: "internal capacity increase",
      assumptions: freeze(["Additional internal capacity can be made available for a limited period."]),
      requiredConditions: freeze([]),
      constraints: freeze([]),
      supportingEvidence: evidence,
      uncertainties: freeze(uncertainty ? [uncertainty] : []),
      expectedDirection: "Relieve capacity pressure enough to test whether extra capacity reduces the observed gap.",
      potentialRisks: freeze(["The gap may persist if another factor is driving the shortfall."]),
      scenarioStatus: absorbReuse ? "REUSES_CANONICAL" : "OPTION_CANDIDATE",
      reusedScenarioId: absorbReuse?.id ?? null,
      cc9Kind: "intervention",
    }),
  );

  candidates.push(
    stamp({
      candidateId: "opt-external-capacity",
      title: "Use external capacity for overflow",
      intent: "TRANSFER",
      addresses: "Short-term capacity pressure without immediate permanent expansion",
      mechanism: "external overflow capacity",
      assumptions: freeze(["Qualified external capacity is available."]),
      requiredConditions: freeze(["External production is permitted."]),
      constraints: freeze([]),
      supportingEvidence: evidence,
      uncertainties: freeze([
        facts.externalAvailabilityUnknown ? "External capacity availability is not yet confirmed." : "",
        uncertainty ?? "",
      ].filter(Boolean)),
      expectedDirection: "Cover overflow while keeping the permanent footprint unchanged.",
      potentialRisks: freeze(["Quality, lead time, or cost may worsen if the supplier is a poor fit."]),
      scenarioStatus: facts.externalAvailabilityUnknown ? "REQUIRES_VALIDATION" : "OPTION_CANDIDATE",
      reusedScenarioId: null,
      cc9Kind: "intervention",
    }),
  );

  candidates.push(
    stamp({
      candidateId: "opt-adapt-demand",
      title: "Adjust demand or production scheduling",
      intent: "ADAPT",
      addresses: contributors.find((label) => /demand/i.test(label)) ?? "Possible demand/schedule mismatch",
      mechanism: "demand or schedule adjustment",
      assumptions: freeze(["Demand or schedule can be shifted without violating a committed delivery constraint."]),
      requiredConditions: freeze([]),
      constraints: freeze([]),
      supportingEvidence: evidence,
      uncertainties: freeze(uncertainty ? [uncertainty] : []),
      expectedDirection: "Reduce pressure by changing load rather than adding capacity.",
      potentialRisks: freeze(["Delivery commitments may be delayed."]),
      scenarioStatus: "OPTION_CANDIDATE",
      reusedScenarioId: null,
      cc9Kind: "intervention",
    }),
  );

  if (alternative && /downtime|staff|maintenance/i.test(alternative)) {
    candidates.push(
      stamp({
        candidateId: "opt-recover-effective-capacity",
        title: "Recover lost effective capacity through maintenance intervention",
        intent: "REDUCE",
        addresses: alternative,
        mechanism: "maintenance recovery",
        assumptions: freeze(["Downtime is a plausible alternative explanation, not a confirmed cause."]),
        requiredConditions: freeze([]),
        constraints: freeze([]),
        supportingEvidence: evidence,
        uncertainties: freeze([`${alternative} has not been ruled out.`]),
        expectedDirection: "Restore effective capacity if downtime is contributing.",
        potentialRisks: freeze(["Maintenance may not close the gap if demand is the stronger factor."]),
        scenarioStatus: "OPTION_CANDIDATE",
        reusedScenarioId: null,
        cc9Kind: "intervention",
      }),
    );
  }

  if (facts.includeHiringOption || hiringFreeze) {
    candidates.push(
      stamp({
        candidateId: "opt-hire-permanent",
        title: "Hire permanent staff",
        intent: "ABSORB",
        addresses: "Sustained capacity shortfall",
        mechanism: "permanent hiring",
        assumptions: freeze(["Staffing is the binding constraint."]),
        requiredConditions: freeze(["Hiring is permitted."]),
        constraints: freeze(hiringFreeze ? ["Hiring freeze"] : []),
        supportingEvidence: freeze([]),
        uncertainties: freeze(["Permanent hiring may be unnecessary if the gap is temporary."]),
        expectedDirection: "Increase lasting internal capacity.",
        potentialRisks: freeze(["The commitment is hard to reverse."]),
        scenarioStatus: hiringFreeze ? "CURRENTLY_INFEASIBLE" : "OPTION_CANDIDATE",
        reusedScenarioId: null,
        cc9Kind: "intervention",
      }),
    );
  }

  candidates.push(
    stamp({
      candidateId: "opt-monitor",
      title: "Continue current operations and monitor the gap",
      intent: "DO_NOTHING",
      addresses: analysis.problemTitle ?? "the Problem",
      mechanism: "observe without intervening",
      assumptions: freeze(["Delaying intervention is currently permitted."]),
      requiredConditions: freeze([]),
      constraints: freeze(facts.hardConstraints.map((item) => item.label)),
      supportingEvidence: evidence,
      uncertainties: freeze(uncertainty ? [uncertainty] : []),
      expectedDirection: "Establish whether the pressure is temporary before committing resources.",
      potentialRisks: freeze(["The gap may worsen during the observation period."]),
      scenarioStatus: "OPTION_CANDIDATE",
      reusedScenarioId: null,
      cc9Kind: "do-nothing",
    }),
  );

  return freeze(candidates);
}

function coverageOf(options: readonly NpsOptionCandidate[]): "NONE" | "INSUFFICIENT" | "SUFFICIENT" {
  const feasible = options.filter((item) => !item.currentlyInfeasible);
  if (feasible.length === 0) return "NONE";
  const intents = new Set(feasible.map((item) => item.intent));
  if (intents.size <= 1 && feasible.length > 1) return "INSUFFICIENT";
  if (intents.size >= 3 && feasible.length >= 3) return "SUFFICIENT";
  if (feasible.length >= 2 && intents.size >= 2) return "SUFFICIENT";
  return "INSUFFICIENT";
}

function resolveStatus(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  weak: boolean;
  coverage: "NONE" | "INSUFFICIENT" | "SUFFICIENT";
  options: number;
}): NpsOptionGenerationStatus {
  if (input.ownership !== "DETERMINED") return "NEEDS_CLARIFICATION";
  if (input.weak && input.options <= 1) return "NOT_READY";
  if (input.coverage === "INSUFFICIENT") return "INSUFFICIENT_COVERAGE";
  if (input.coverage === "SUFFICIENT") return "READY_FOR_COMPARISON";
  if (input.options > 0) return "OPTIONS_AVAILABLE";
  return "NOT_READY";
}

function resolveAction(
  status: NpsOptionGenerationStatus,
  facts: NpsOptionGenerationFacts,
  analysis: NpsEvidenceCauseAnalysis,
): NpsOptionAction {
  if (status === "NEEDS_CLARIFICATION") return "CLARIFY_PROBLEM";
  if (status === "NOT_READY") {
    if (facts.managerKnowledgeRequired) return "ASK_MANAGER";
    if (analysis.observations.length > 0 || analysis.evidenceItems.length > 0) {
      return "INVESTIGATE_EXISTING_EVIDENCE";
    }
    return "REQUEST_MORE_EVIDENCE";
  }
  if (status === "READY_FOR_COMPARISON") return "READY_FOR_COMPARISON";
  return "REQUEST_MORE_EVIDENCE";
}

function managerText(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  title: string;
  options: readonly NpsOptionCandidate[];
  uncertainty: string | null;
  next: string | null;
  status: NpsOptionGenerationStatus;
}): string {
  if (input.ownership !== "DETERMINED") {
    return "The active Problem is not determined. Clarify which Problem these options should address before generating responses.";
  }
  if (input.status === "NOT_READY") {
    return `Problem: ${input.title}\nThere is not enough reliable evidence yet to develop intervention options. The next useful step is to gather trusted evidence before comparing responses.`;
  }
  const lines = input.options
    .filter((item) => !item.currentlyInfeasible)
    .map((item, index) => `${index + 1}. ${item.title}.`);
  return [
    `Problem: ${input.title}`,
    `Based on the current evidence, ${lines.length} responses are worth evaluating:`,
    ...lines,
    input.uncertainty ? `Important uncertainty: ${input.uncertainty}` : null,
    input.next ? `Next step: ${input.next}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export function composeNpsOptionGeneration(input: {
  readonly path: NpsProblemSolvingPath;
  readonly pathFacts: NpsCanonicalFacts;
  readonly analysis: NpsEvidenceCauseAnalysis;
  readonly facts?: NpsOptionGenerationFacts;
}): NpsOptionGeneration {
  const facts: NpsOptionGenerationFacts = input.facts ?? freeze({
    existingScenarios: freeze([]),
    hardConstraints: freeze([]),
    externalAvailabilityUnknown: true,
    includeHiringOption: false,
    managerKnowledgeRequired: false,
  });
  const weak =
    input.analysis.evidenceSufficiency === "NONE" ||
    input.analysis.evidenceSufficiency === "INSUFFICIENT";
  const options =
    input.analysis.problemOwnership === "DETERMINED"
      ? composeCandidates(input.analysis, facts)
      : freeze([]);
  const coverage = coverageOf(options);
  const status = resolveStatus({
    ownership: input.analysis.problemOwnership,
    weak,
    coverage,
    options: options.length,
  });
  const action = resolveAction(status, facts, input.analysis);
  const feasibleIds = options
    .filter((item) => !item.currentlyInfeasible)
    .map((item) => item.reusedScenarioId ?? item.candidateId);
  const integrated =
    input.analysis.problemOwnership === "DETERMINED" && feasibleIds.length > 0 && status !== "NOT_READY"
      ? composeNpsProblemSolvingPath(
          freeze({
            ...input.pathFacts,
            investigationPresent: true,
            evidenceState:
              input.pathFacts.evidenceState === "NONE" ? "PARTIAL" : input.pathFacts.evidenceState,
            causeHypothesesAvailable: true,
            scenarioIds: freeze(feasibleIds),
            scenarioObservedFrom: "NPS:4 option composition; canonical Scenario writes remain CC:9",
            comparisonAvailable: false,
          }),
        )
      : input.analysis.problemOwnership !== "DETERMINED"
        ? input.path
        : input.analysis.path;
  const uncertainty =
    input.analysis.confirmedCause == null
      ? input.analysis.possibleContributors[0]
        ? `${input.analysis.possibleContributors[0].label} may be contributing, but ${input.analysis.alternativeExplanations[0] ?? "other explanations"} ${input.analysis.alternativeExplanations[0] ? "has not been ruled out" : "remain possible"}.`
        : "A confirmed cause is not established."
      : null;
  const next =
    status === "READY_FOR_COMPARISON"
      ? "Compare these options on impact, cost, time, risk, and reversibility."
      : status === "NOT_READY"
        ? "Gather trusted evidence before developing intervention options."
        : "Review these options before comparing them.";
  const title = input.analysis.problemTitle?.trim() || "This Problem";
  const projection = freeze({
    problem: input.analysis.problemOwnership === "DETERMINED" ? title : "Not determined",
    options: freeze(options.filter((item) => !item.currentlyInfeasible).map((item) => item.title)),
    importantUncertainty: uncertainty,
    nextStep: next,
    text: managerText({
      ownership: input.analysis.problemOwnership,
      title,
      options,
      uncertainty,
      next,
      status,
    }),
  });
  if (/\b(?:NPS|ECA|CC:\d|CORE-INT|resolver|composer|authority)\b/i.test(projection.text)) {
    throw new Error("NPS:4 manager projection leaked architecture terminology");
  }
  if (/\brecommend(?:s|ed|ation)?\b|\bbest option\b|\bshould be selected\b/i.test(projection.text)) {
    throw new Error("NPS:4 manager projection recommended an option");
  }

  return freeze({
    identity: NPS_OPTION_GENERATION_IDENTITY,
    problemId: input.analysis.problemId,
    problemTitle: input.analysis.problemTitle,
    generationStatus: status,
    problemObjective: title === "Not determined" ? null : `Respond to ${title} without treating unconfirmed contributors as proven causes.`,
    relevantEvidence: freeze([...input.analysis.observations]),
    contributorsConsidered: freeze(input.analysis.possibleContributors.map((item) => item.label)),
    supportedContributors: freeze(
      input.analysis.possibleContributors
        .filter((item) => item.status === "SUPPORTED_CONTRIBUTOR")
        .map((item) => item.label),
    ),
    constraints: freeze(facts.hardConstraints.map((item) => item.label)),
    uncertainties: freeze([...input.analysis.uncertainties]),
    optionCandidates: options,
    coverage,
    missingOptionNeed: coverage === "INSUFFICIENT" ? "Additional distinct response mechanisms are needed before comparison." : null,
    nextStep: next,
    action,
    recommendation: null,
    preferredOption: null,
    scenarioHandoff: freeze({
      owner: "CC:9/ScenarioConversation",
      npsWritesScenario: false,
      candidates: options,
    }),
    readyForComparison: status === "READY_FOR_COMPARISON",
    confirmedCauseUsedAsFact: false,
    supportingReferences: integrated.supportingReferences,
    path: integrated,
    managerProjection: projection,
    canonicalMutations: freeze([]),
    writesEvidence: false,
    writesScenario: false,
    writesRecommendation: false,
    commitsDecision: false,
    startsExecution: false,
    writesOutcome: false,
    boundary: NPS_OPTION_GENERATION_BOUNDARY,
  });
}

export function attemptNpsOptionGenerationAdvancement(
  generation: NpsOptionGeneration,
): ReturnType<typeof attemptNpsPathAdvancement> &
  Readonly<{
    unauthorizedScenarioWrites: 0;
    recommendationWrites: 0;
  }> {
  const advanced = attemptNpsPathAdvancement(generation.path);
  return freeze({
    ...advanced,
    unauthorizedScenarioWrites: 0,
    recommendationWrites: 0,
  });
}

export function npsPathStateAfterOptions(
  generation: NpsOptionGeneration,
): NpsPathState | null {
  return generation.path.currentState;
}

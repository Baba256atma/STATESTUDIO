/**
 * CORE-INT:5 — Live Trade-off Intelligence.
 *
 * Evidence-bounded comparison of real Scenario/Decision alternatives.
 * Reuses EI:4 ScenarioTradeoff records. Does not wire the EI:4
 * certification trace, invent economics, or choose a recommendation.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type { SemanticConfidence } from "./problemRiskOpportunityIntelligence.ts";
import type { SharedEpistemicEvidenceStatus } from "./nexoraSharedEpistemicFoundation.ts";
import {
  createScenarioTradeoff,
  type ScenarioTradeoff,
  type TradeoffDimension,
} from "./scenarioPriorityTradeoffIntelligence.ts";

export const nexoraExecutiveTradeoffIntelligenceIdentity =
  "CORE-INT:5/LiveTradeoffIntelligence" as const;
export const nexoraExecutiveTradeoffIntelligenceVersion = "1.0.0" as const;

export const EXECUTIVE_TRADEOFF_BOUNDARY = Object.freeze({
  role: "live-tradeoff-comparison" as const,
  epistemicAuthority: "CORE-INT:2/SharedEpistemicUncertaintyFoundation" as const,
  causalConstraintAuthority: "CORE-INT:3/GroundedCausalConstraintIntelligence" as const,
  priorityAuthority: "CORE-INT:4/ExecutivePriorityIntelligence" as const,
  tradeoffRecordAuthority: "EI:4/createScenarioTradeoff" as const,
  reusesEi4CertificationTrace: false as const,
  wiresCreateScenarioPriorityTradeoffTrace: false as const,
  startsExi4: false as const,
  usesLlm: false as const,
  inventsEconomics: false as const,
  inventsNumericScore: false as const,
  choosesRecommendation: false as const,
  mutatesDecision: false as const,
  mutatesExecution: false as const,
  writesMemory: false as const,
  mutatesStage: false as const,
  usesOutcomeLearning: false as const,
  isExiWriter: false as const,
});

export type TradeoffClaimKind = "FACT" | "ASSUMPTION" | "PREDICTION" | "UNKNOWN";
export type TradeoffComparisonStatus =
  | "multi-option"
  | "single-option"
  | "no-options"
  | "not-comparable";
export type TradeoffPreferenceAuthority =
  | "decision-brief"
  | "next-best-action"
  | "professional-advisor"
  | "none";

export type ExecutiveTradeoffEvidence = Readonly<{
  readonly statement: string;
  readonly dimension: TradeoffDimension | "constraint" | "assumption";
  readonly claimKind: TradeoffClaimKind;
  readonly confidence: SemanticConfidence;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly sourceSummary: string | null;
  readonly numericValue: null;
}>;

export type ExecutiveTradeoffOptionSource = Readonly<{
  readonly optionId: string;
  readonly title: string;
  readonly scopeId: string;
  readonly sourceSummary: string;
  readonly kind: "scenario" | "decision-option";
}>;

export type ExecutiveTradeoffOption = Readonly<{
  readonly optionId: string;
  readonly title: string;
  readonly scopeId: string;
  readonly gains: readonly ExecutiveTradeoffEvidence[];
  readonly sacrifices: readonly ExecutiveTradeoffEvidence[];
  readonly risks: readonly ExecutiveTradeoffEvidence[];
  readonly constraints: readonly ExecutiveTradeoffEvidence[];
  readonly assumptions: readonly ExecutiveTradeoffEvidence[];
  readonly timeEffects: readonly ExecutiveTradeoffEvidence[];
  readonly resourceEffects: readonly ExecutiveTradeoffEvidence[];
  readonly costEffects: readonly ExecutiveTradeoffEvidence[];
  readonly uncertainty: SemanticConfidence;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly missingDimensions: readonly string[];
  readonly ei4Tradeoffs: readonly ScenarioTradeoff[];
}>;

export type ExecutiveTradeoffAssessment = Readonly<{
  readonly identity: typeof nexoraExecutiveTradeoffIntelligenceIdentity;
  readonly subjectId: string | null;
  readonly scopeId: string | null;
  readonly options: readonly ExecutiveTradeoffOption[];
  readonly comparable: boolean;
  readonly comparisonStatus: TradeoffComparisonStatus;
  readonly preferredOptionId: string | null;
  readonly preferenceAuthority: TradeoffPreferenceAuthority;
  readonly recommendationAlignment: string | null;
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly confidence: SemanticConfidence;
  readonly missingDimensions: readonly string[];
  readonly comparisonSummary: string;
  readonly numericalScore: null;
  readonly writesMemory: false;
  readonly mutatesDecision: false;
  readonly mutatesExecution: false;
  readonly mutatesStage: false;
}>;

const CONFIDENCE_RANK: Record<SemanticConfidence, number> = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)]);
}

function lowestConfidence(
  values: readonly SemanticConfidence[],
): SemanticConfidence {
  if (values.length === 0) return "unknown";
  return values.reduce((lowest, value) =>
    CONFIDENCE_RANK[value] < CONFIDENCE_RANK[lowest] ? value : lowest,
  );
}

function support(optionId: string, factKey: string, summary: string) {
  return {
    evidenceRefs: Object.freeze([
      {
        sourceKind: "scenario" as const,
        sourceId: `core-int5:${optionId}:${factKey}`,
        subjectId: optionId,
        factKey,
      },
    ]),
    provenanceRefs: Object.freeze([
      `mvp-scenario-adapter:${optionId}:${factKey}`,
    ]),
    sourceSummary: summary,
    numericValue: null,
    confidence: "medium" as const,
  };
}

function evidenceItem(
  optionId: string,
  factKey: string,
  summary: string,
  statement: string,
  dimension: ExecutiveTradeoffEvidence["dimension"],
  claimKind: TradeoffClaimKind,
): ExecutiveTradeoffEvidence {
  return deepFreeze({
    statement,
    dimension,
    claimKind,
    ...support(optionId, factKey, summary),
  });
}

function ei4Record(
  optionId: string,
  dimension: TradeoffDimension,
  gain: string | null,
  sacrifice: string | null,
  summary: string,
): ScenarioTradeoff {
  return createScenarioTradeoff({
    tradeoffId: `core-int5:${optionId}:${dimension}`,
    dimension,
    gain,
    sacrifice,
    evidenceRefs: [
      {
        sourceKind: "scenario",
        sourceId: `core-int5:${optionId}:${dimension}`,
        subjectId: optionId,
        factKey: dimension,
      },
    ],
    assumptionRefs: [`mvp-scenario-adapter:${optionId}:${dimension}`],
    confidence: "medium",
    timeHorizon: null,
    reversibility: "unknown",
  });
}

type CanonicalSeed = Readonly<{
  readonly gains: readonly {
    readonly dimension: TradeoffDimension;
    readonly statement: string;
  }[];
  readonly sacrifices: readonly {
    readonly dimension: TradeoffDimension;
    readonly statement: string;
  }[];
  readonly risks: readonly { readonly statement: string }[];
  readonly constraints: readonly { readonly statement: string }[];
  readonly assumptions: readonly { readonly statement: string }[];
}>;

/**
 * Deterministic adapter for known MVP Scenario IDs.
 * Not prose mining: only explicit recorded meanings for canonical fixtures.
 */
const CANONICAL_SCENARIO_TRADEOFFS: Readonly<Record<string, CanonicalSeed>> =
  Object.freeze({
    "ctx-scenario-pricing": Object.freeze({
      gains: Object.freeze([
        {
          dimension: "profit" as const,
          statement: "Expected benefit: margin recovery.",
        },
      ]),
      sacrifices: Object.freeze([]),
      risks: Object.freeze([]),
      constraints: Object.freeze([
        {
          statement: "Recorded constraint context: constrained capacity.",
        },
      ]),
      assumptions: Object.freeze([
        {
          statement:
            "Assumption: this option is evaluated under constrained capacity.",
        },
      ]),
    }),
    "ctx-scenario-demand": Object.freeze({
      gains: Object.freeze([
        {
          dimension: "revenue" as const,
          statement: "Expected benefit: volume upside.",
        },
      ]),
      sacrifices: Object.freeze([]),
      risks: Object.freeze([
        { statement: "Projected risk: delivery risk." },
      ]),
      constraints: Object.freeze([]),
      assumptions: Object.freeze([]),
    }),
    "ctx-scenario-capacity": Object.freeze({
      gains: Object.freeze([
        {
          dimension: "capacity" as const,
          statement: "Expected benefit: relieve the recorded Capacity Gap.",
        },
      ]),
      sacrifices: Object.freeze([]),
      risks: Object.freeze([]),
      constraints: Object.freeze([
        { statement: "Recorded constraint context: Capacity Gap." },
      ]),
      assumptions: Object.freeze([]),
    }),
  });

export function adaptCanonicalScenarioTradeoffs(
  source: ExecutiveTradeoffOptionSource,
): ExecutiveTradeoffOption {
  const seed = CANONICAL_SCENARIO_TRADEOFFS[source.optionId];
  const summary = source.sourceSummary;
  const gains = (seed?.gains ?? []).map((entry) =>
    evidenceItem(
      source.optionId,
      `gain:${entry.dimension}`,
      summary,
      entry.statement,
      entry.dimension,
      "PREDICTION",
    ),
  );
  const sacrifices = (seed?.sacrifices ?? []).map((entry) =>
    evidenceItem(
      source.optionId,
      `sacrifice:${entry.dimension}`,
      summary,
      entry.statement,
      entry.dimension,
      "PREDICTION",
    ),
  );
  const risks = (seed?.risks ?? []).map((entry, index) =>
    evidenceItem(
      source.optionId,
      `risk:${index}`,
      summary,
      entry.statement,
      "risk",
      "PREDICTION",
    ),
  );
  const constraints = (seed?.constraints ?? []).map((entry, index) =>
    evidenceItem(
      source.optionId,
      `constraint:${index}`,
      summary,
      entry.statement,
      "constraint",
      "ASSUMPTION",
    ),
  );
  const assumptions = (seed?.assumptions ?? []).map((entry, index) =>
    evidenceItem(
      source.optionId,
      `assumption:${index}`,
      summary,
      entry.statement,
      "assumption",
      "ASSUMPTION",
    ),
  );
  const missing: string[] = [];
  if (sacrifices.length === 0) missing.push("sacrifice");
  if (gains.every((entry) => entry.dimension !== "cost") && sacrifices.every((entry) => entry.dimension !== "cost")) {
    missing.push("cost");
  }
  if (gains.every((entry) => entry.dimension !== "time")) missing.push("time");
  if (risks.length === 0) missing.push("risk-direction");
  const ei4Tradeoffs = [
    ...gains.map((entry) =>
      ei4Record(
        source.optionId,
        entry.dimension === "constraint" || entry.dimension === "assumption"
          ? "operational-stability"
          : entry.dimension,
        entry.statement,
        null,
        summary,
      ),
    ),
    ...risks.map((entry) =>
      ei4Record(source.optionId, "risk", null, entry.statement, summary),
    ),
  ];
  const evidenceRefs = unique(
    [...gains, ...sacrifices, ...risks, ...constraints, ...assumptions].flatMap(
      (entry) => entry.evidenceRefs.map((ref) => ref.sourceId),
    ),
  );
  return deepFreeze({
    optionId: source.optionId,
    title: source.title,
    scopeId: source.scopeId,
    gains: Object.freeze(gains),
    sacrifices: Object.freeze(sacrifices),
    risks: Object.freeze(risks),
    constraints: Object.freeze(constraints),
    assumptions: Object.freeze(assumptions),
    timeEffects: Object.freeze([]),
    resourceEffects: Object.freeze([]),
    costEffects: Object.freeze([]),
    uncertainty: seed ? "medium" : "unknown",
    evidenceRefs: Object.freeze(
      [...gains, ...sacrifices, ...risks, ...constraints, ...assumptions].flatMap(
        (entry) => entry.evidenceRefs,
      ),
    ),
    provenanceRefs: Object.freeze([
      `mvp-scenario-adapter:${source.optionId}`,
      ...evidenceRefs,
    ]),
    missingDimensions: Object.freeze(missing),
    ei4Tradeoffs: Object.freeze(ei4Tradeoffs),
  });
}

export function projectExecutiveTradeoffIntelligence(input: {
  readonly subjectId: string | null;
  readonly sources: readonly ExecutiveTradeoffOptionSource[];
  readonly overview?: boolean;
  readonly alignedOptionId?: string | null;
  readonly preferenceAuthority?: TradeoffPreferenceAuthority;
  readonly recommendationAlignment?: string | null;
}): ExecutiveTradeoffAssessment {
  if (input.overview === true || input.subjectId == null) {
    return emptyAssessment(
      null,
      null,
      "no-options",
      "No evaluated option is in focus. Open Scenarios when you want to inspect alternatives.",
      input.recommendationAlignment ?? null,
    );
  }

  const seen = new Set<string>();
  const options = input.sources
    .filter((source) => {
      if (seen.has(source.optionId)) return false;
      seen.add(source.optionId);
      return source.kind === "scenario" || source.kind === "decision-option";
    })
    .map(adaptCanonicalScenarioTradeoffs);

  const scopes = unique(options.map((option) => option.scopeId));
  if (options.length === 0) {
    return emptyAssessment(
      input.subjectId,
      null,
      "no-options",
      "No evaluated option is currently available for this issue.",
      input.recommendationAlignment ?? null,
    );
  }
  if (scopes.length > 1) {
    return deepFreeze({
      identity: nexoraExecutiveTradeoffIntelligenceIdentity,
      subjectId: input.subjectId,
      scopeId: null,
      options: Object.freeze(options),
      comparable: false,
      comparisonStatus: "not-comparable",
      preferredOptionId: null,
      preferenceAuthority: "none",
      recommendationAlignment: null,
      evidenceStatus: "present",
      confidence: "unknown",
      missingDimensions: Object.freeze(["comparability"]),
      comparisonSummary:
        "These options do not belong to the same decision or problem scope, so Nexora will not compare them.",
      numericalScore: null,
      writesMemory: false,
      mutatesDecision: false,
      mutatesExecution: false,
      mutatesStage: false,
    });
  }

  const comparisonStatus: TradeoffComparisonStatus =
    options.length === 1 ? "single-option" : "multi-option";
  const missing = unique(options.flatMap((option) => option.missingDimensions));
  const preferred =
    input.alignedOptionId &&
    options.some((option) => option.optionId === input.alignedOptionId)
      ? input.alignedOptionId
      : null;
  const authority =
    preferred && input.preferenceAuthority && input.preferenceAuthority !== "none"
      ? input.preferenceAuthority
      : "none";
  return deepFreeze({
    identity: nexoraExecutiveTradeoffIntelligenceIdentity,
    subjectId: input.subjectId,
    scopeId: scopes[0] ?? null,
    options: Object.freeze(options),
    comparable: comparisonStatus === "multi-option",
    comparisonStatus,
    preferredOptionId: preferred,
    preferenceAuthority: authority,
    recommendationAlignment: input.recommendationAlignment ?? null,
    evidenceStatus: "present",
    confidence: lowestConfidence(options.map((option) => option.uncertainty)),
    missingDimensions: missing,
    comparisonSummary: composeSummary(options, comparisonStatus, missing),
    numericalScore: null,
    writesMemory: false,
    mutatesDecision: false,
    mutatesExecution: false,
    mutatesStage: false,
  });
}

function emptyAssessment(
  subjectId: string | null,
  scopeId: string | null,
  status: TradeoffComparisonStatus,
  summary: string,
  recommendationAlignment: string | null = null,
): ExecutiveTradeoffAssessment {
  return deepFreeze({
    identity: nexoraExecutiveTradeoffIntelligenceIdentity,
    subjectId,
    scopeId,
    options: Object.freeze([]),
    comparable: false,
    comparisonStatus: status,
    preferredOptionId: null,
    preferenceAuthority: "none",
    recommendationAlignment,
    evidenceStatus: status === "no-options" ? "missing" : "present",
    confidence: "unknown",
    missingDimensions: Object.freeze(["options"]),
    comparisonSummary: summary,
    numericalScore: null,
    writesMemory: false,
    mutatesDecision: false,
    mutatesExecution: false,
    mutatesStage: false,
  });
}

function composeSummary(
  options: readonly ExecutiveTradeoffOption[],
  status: TradeoffComparisonStatus,
  missing: readonly string[],
): string {
  if (status === "single-option") {
    const option = options[0]!;
    return `One evaluated option is currently available: ${option.title}. ${option.gains[0]?.statement ?? option.constraints[0]?.statement ?? ""} This is a projected effect, not an observed fact. Projected impact. Evidence limited.`.replace(/\s+/g, " ").trim();
  }
  const lines = options.map((option) => {
    const parts = [
      option.gains[0]?.statement,
      option.sacrifices[0]?.statement ??
        "No validated sacrifice is currently recorded.",
      option.risks[0]?.statement,
      option.constraints[0]?.statement,
      option.assumptions[0]?.statement,
    ].filter(Boolean);
    return `${option.title}: ${parts.join(" ")} Projected impact. Evidence limited.`;
  });
  const costCopy = missing.includes("cost")
    ? " Nexora does not currently have enough validated cost evidence to compare these options on cost."
    : "";
  const timeCopy = missing.includes("time")
    ? " Validated time evidence is also missing."
    : "";
  return `${options.map((option) => option.title).join(" and ")} are evaluated alternatives for the same context. ${lines.join(" ")} These are projected alternatives, not observed facts.${costCopy}${timeCopy}`;
}

export function presentTradeoffAssessment(
  assessment: ExecutiveTradeoffAssessment,
): string {
  return assessment.comparisonSummary;
}

export function presentTradeoffGains(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.options.length === 0) {
    return "No evaluated options are currently available.";
  }
  return assessment.options
    .map(
      (option) =>
        option.gains[0]?.statement ??
        `${option.title}: no validated gain is currently recorded.`,
    )
    .join(" ");
}

export function presentTradeoffSacrifices(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.options.length === 0) {
    return "No evaluated options are currently available.";
  }
  return assessment.options
    .map(
      (option) =>
        option.sacrifices[0]?.statement ??
        `${option.title}: No validated sacrifice is currently recorded.`,
    )
    .join(" ");
}

export function presentTradeoffRiskComparison(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.options.length === 0) {
    return "No evaluated options are currently available.";
  }
  const withRisk = assessment.options.filter((option) => option.risks.length > 0);
  if (withRisk.length === 0) {
    return "Current evidence is insufficient to rank the options by risk.";
  }
  return `Recorded risk language exists for ${withRisk.map((option) => option.title).join(" and ")}. Current evidence is insufficient to rank the options by risk.`;
}

export function presentTradeoffConstraintComparison(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.options.length === 0) {
    return "No evaluated options are currently available.";
  }
  const withConstraint = assessment.options.filter(
    (option) => option.constraints.length > 0,
  );
  if (withConstraint.length === 0) {
    return "Current evidence is not sufficient to say which option addresses the recorded constraint more directly.";
  }
  return `${withConstraint
    .map((option) => `${option.title}: ${option.constraints[0]!.statement}`)
    .join(" ")} Current evidence is not sufficient to say which option addresses the recorded constraint more directly.`;
}

export function presentTradeoffCostComparison(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.options.some((option) => option.costEffects.length > 0)) {
    return assessment.options
      .map((option) => option.costEffects[0]?.statement)
      .filter(Boolean)
      .join(" ");
  }
  return "Nexora does not currently have enough validated cost evidence to compare these options on cost.";
}

export function presentTradeoffTimeComparison(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.options.some((option) => option.timeEffects.length > 0)) {
    return assessment.options
      .map((option) => option.timeEffects[0]?.statement)
      .filter(Boolean)
      .join(" ");
  }
  return "Nexora does not currently have enough validated time evidence to compare these options on speed.";
}

export function presentTradeoffAssumptions(
  assessment: ExecutiveTradeoffAssessment,
): string {
  const lines = assessment.options
    .map((option) => option.assumptions[0]?.statement)
    .filter((value): value is string => Boolean(value));
  if (lines.length === 0) {
    return "No validated assumption is currently recorded for these options.";
  }
  return lines.join(" ");
}

export function presentTradeoffConfidence(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.comparisonStatus === "no-options") {
    return "There is no option comparison to be confident about.";
  }
  return "Evidence limited. This comparison is projected, not observed, and is not stronger than the current evidence.";
}

export function presentTradeoffMissingDimensions(
  assessment: ExecutiveTradeoffAssessment,
): string {
  if (assessment.missingDimensions.length === 0) {
    return "Current comparison dimensions are limited and projected.";
  }
  return `I can compare these options on the recorded expected-benefit, constraint, and risk language, but validated ${assessment.missingDimensions.join(" and ")} evidence is missing.`;
}

export function presentCoreOptionAsExi(option: ExecutiveTradeoffOption): {
  readonly optionId: string;
  readonly label: string;
  readonly benefits: string | null;
  readonly costs: string | null;
  readonly risks: string | null;
  readonly constraints: string | null;
  readonly assumptions: string | null;
  readonly predictedEffects: string;
  readonly uncertainty: string;
  readonly evidence: string;
  readonly missingDimensions: readonly string[];
} {
  const summary = option.gains[0]?.sourceSummary ?? option.provenanceRefs[0] ?? option.title;
  return {
    optionId: option.optionId,
    label: option.title,
    benefits: option.gains[0]?.statement ?? null,
    costs: option.sacrifices[0]?.statement ?? null,
    risks: option.risks[0]?.statement ?? null,
    constraints: option.constraints[0]?.statement ?? null,
    assumptions: option.assumptions[0]?.statement ?? null,
    predictedEffects: `${typeof summary === "string" && summary.includes("explores") ? summary : option.title} This is a projected effect, not an observed fact.`,
    uncertainty: "Projected impact. Evidence limited.",
    evidence:
      option.gains[0]?.sourceSummary ??
      option.risks[0]?.sourceSummary ??
      option.title,
    missingDimensions: option.missingDimensions,
  };
}

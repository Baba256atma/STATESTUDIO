import assert from "node:assert/strict";
import test from "node:test";
import {
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
} from "./npsProblemSolvingPath.ts";
import {
  composeNpsEvidenceCauseAnalysis,
  type NpsContributorFact,
  type NpsEvidenceCauseFacts,
  type NpsEvidenceItemFact,
} from "./npsEvidenceCauseAnalysis.ts";
import {
  composeNpsOptionGeneration,
  type NpsOptionGenerationFacts,
} from "./npsOptionGeneration.ts";
import {
  NPS_COMPARISON_RECOMMENDATION_BOUNDARY,
  attemptNpsComparisonRecommendationAdvancement,
  composeNpsComparisonRecommendation,
  npsPathStateAfterComparison,
} from "./npsComparisonRecommendation.ts";
import { applyNpsComparisonRecommendationToPresentedResponse } from "./npsComparisonRecommendationRuntime.ts";

function pathFacts(overrides: Partial<NpsCanonicalFacts> = {}): NpsCanonicalFacts {
  return Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "NPS:1",
    }),
    investigationPresent: true,
    investigationId: "inv-capacity-1",
    evidenceState: "PARTIAL",
    causeHypothesesAvailable: true,
    scenarioIds: Object.freeze([]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: Object.freeze({ present: false, executionId: null, status: "NONE" }),
    outcome: Object.freeze({ observed: false, problemResolved: null }),
    stageFocusId: "ctx-scenario-demand",
    conversationSubjectId: "ctx-problem-margin",
    ...overrides,
  });
}

function item(overrides: Partial<NpsEvidenceItemFact> = {}): NpsEvidenceItemFact {
  return Object.freeze({
    id: "e1",
    label: "Demand",
    classification: "OBSERVATION",
    observation: "Demand increased 18%.",
    interpretation: null,
    sourceId: "src-demand",
    sourceType: "kpi",
    field: "demand",
    timeRange: "current period",
    semanticConfidence: "CONFIRMED",
    managerConfirmation: false,
    evidenceStatus: "TRUSTED",
    existingCausalAuthority: false,
    contradicting: false,
    confounder: false,
    supportingReference: "Data Reality / CC:8",
    ...overrides,
  });
}

function contributor(overrides: Partial<NpsContributorFact> = {}): NpsContributorFact {
  return Object.freeze({
    candidateId: "demand-surge",
    label: "Demand Surge",
    relationshipToProblem: "associated with Capacity Gap",
    supportingEvidenceIds: Object.freeze(["obs-demand"]),
    contradictingEvidenceIds: Object.freeze([]),
    status: "SUPPORTED_CONTRIBUTOR",
    confidence: "medium",
    uncertainty: "Demand Surge may be related, but it is not a confirmed cause.",
    existingCausalAuthority: false,
    ...overrides,
  });
}

function analysisFacts(overrides: Partial<NpsEvidenceCauseFacts> = {}): NpsEvidenceCauseFacts {
  return Object.freeze({
    items: Object.freeze([
      item({ id: "obs-demand" }),
      item({
        id: "obs-cap",
        label: "Capacity",
        observation: "Available capacity remained approximately stable.",
      }),
    ]),
    contributors: Object.freeze([
      contributor(),
      contributor({
        candidateId: "equipment-downtime",
        label: "Equipment downtime",
        status: "POSSIBLE",
        uncertainty: "Equipment downtime has not been ruled out.",
      }),
    ]),
    hypotheses: Object.freeze([]),
    patterns: Object.freeze([]),
    nextEvidenceNeed: null,
    nextCausalTest: "Compare capacity pressure against demand while accounting for downtime.",
    managerKnowledgeRequired: false,
    ...overrides,
  });
}

const reuseFacts: NpsOptionGenerationFacts = Object.freeze({
  existingScenarios: Object.freeze([
    Object.freeze({
      id: "ctx-scenario-capacity",
      title: "Capacity Expansion Plan",
      mechanism: "capacity expansion",
      problemId: "ctx-problem-capacity",
    }),
  ]),
  hardConstraints: Object.freeze([]),
  externalAvailabilityUnknown: true,
  includeHiringOption: false,
  managerKnowledgeRequired: false,
});

function options(
  canonical: NpsCanonicalFacts = pathFacts(),
  causeFacts: NpsEvidenceCauseFacts = analysisFacts(),
  optionFacts: NpsOptionGenerationFacts = reuseFacts,
) {
  const cause = composeNpsEvidenceCauseAnalysis({
    path: composeNpsProblemSolvingPath(canonical),
    pathFacts: canonical,
    facts: causeFacts,
  });
  return composeNpsOptionGeneration({
    path: cause.path,
    pathFacts: canonical,
    analysis: cause,
    facts: optionFacts,
  });
}

function compare(
  canonical: NpsCanonicalFacts = pathFacts(),
  comparisonFacts?: Parameters<typeof composeNpsComparisonRecommendation>[0]["facts"],
  optionFacts: NpsOptionGenerationFacts = reuseFacts,
) {
  const generated = options(canonical, analysisFacts(), optionFacts);
  return composeNpsComparisonRecommendation({
    pathFacts: canonical,
    options: generated,
    facts: comparisonFacts,
  });
}

test("boundary: NPS:5 does not create comparison or recommendation engines", () => {
  assert.equal(NPS_COMPARISON_RECOMMENDATION_BOUNDARY.createsComparisonEngine, false);
  assert.equal(NPS_COMPARISON_RECOMMENDATION_BOUNDARY.createsRecommendationEngine, false);
  assert.equal(NPS_COMPARISON_RECOMMENDATION_BOUNDARY.createsScoringAuthority, false);
  assert.equal(NPS_COMPARISON_RECOMMENDATION_BOUNDARY.recommendationEqualsDecision, false);
  assert.equal(NPS_COMPARISON_RECOMMENDATION_BOUNDARY.recommendationEqualsCommitment, false);
  assert.equal(NPS_COMPARISON_RECOMMENDATION_BOUNDARY.comparisonOwner, "NCA-POST:4");
  assert.equal(NPS_COMPARISON_RECOMMENDATION_BOUNDARY.recommendationOwner, "ECA:7 / NCA:4");
});

test("A — Ready comparison produces explicit trade-offs", () => {
  const generated = options();
  assert.equal(generated.generationStatus, "READY_FOR_COMPARISON");
  const result = compare();
  assert.ok(result.comparedOptions.length >= 2);
  assert.ok(result.tradeoffs.some((item) => item.advantages.length > 0 && item.disadvantages.length > 0));
  assert.equal(result.comparedOptions.every((item) => item.score === null), true);
  assert.equal(result.comparedOptions.every((item) => item.expectedCost === "UNKNOWN"), true);
});

test("B — Fast recovery makes speed relevant without mechanical extra dimensions", () => {
  const result = compare(pathFacts(), { managerPriority: "FAST_RECOVERY" });
  assert.ok(result.comparisonCriteria.includes("speed"));
  assert.equal(result.comparisonCriteria.includes("evidenceStrength"), false);
  assert.equal(result.comparisonCriteria.includes("INVESTIGATION_PRIORITY"), false);
});

test("C — Unknown priority that discriminates speed vs cost asks the manager", () => {
  const result = compare(pathFacts(), { requireManagerPriority: true });
  assert.equal(result.action, "ASK_MANAGER");
  assert.equal(result.recommendedOptionId, null);
  assert.equal(result.nexoraRecommendation, null);
  assert.match(result.managerProjection.text, /fastest capacity recovery or lowest long-term cost/i);
});

test("D — External capacity with unknown supplier is conditional", () => {
  const result = compare(pathFacts(), { managerPriority: "FAST_RECOVERY" });
  assert.equal(result.recommendationStatus, "CONDITIONAL_RECOMMENDATION");
  assert.ok(result.recommendationConditions.some((item) => /external capacity/i.test(item)));
  assert.match(result.nexoraRecommendation ?? "", /external/i);
});

test("E — Missing critical information defers without a fake winner", () => {
  const result = compare(pathFacts(), { criticalInformationMissing: true });
  assert.equal(result.recommendationStatus, "DEFER");
  assert.equal(result.recommendedOptionId, null);
  assert.equal(result.comparisonStatus, "INSUFFICIENT_INFORMATION");
});

test("F — Balanced trade-offs with no priority produce no clear preference", () => {
  const result = compare(pathFacts(), { noClearPreference: true });
  assert.equal(result.recommendationStatus, "NO_CLEAR_PREFERENCE");
  assert.match(result.managerProjection.text, /no clear preference/i);
});

test("G — Recommended direction traces to Problem and Evidence", () => {
  const result = compare(pathFacts(), { managerPriority: "FAST_RECOVERY" });
  assert.equal(result.problemId, "ctx-problem-capacity");
  assert.ok((result.evidenceSupport.length ?? 0) > 0);
  assert.ok(result.recommendationRationale);
  assert.match(result.managerProjection.text, /Capacity Gap/);
});

test("H — Causal safety: Demand Surge is not treated as the confirmed cause", () => {
  const result = compare();
  assert.doesNotMatch(result.managerProjection.text, /Demand Surge caused/i);
  assert.equal(result.confirmedCauseUsedAsFact, false);
  assert.ok(result.recommendationUncertainty);
});

test("I — Manager preference and Nexora recommendation stay separate", () => {
  const result = compare(pathFacts(), {
    managerPriority: "FAST_RECOVERY",
    managerPreferenceOptionId: "ctx-scenario-capacity",
  });
  assert.equal(result.managerPreference, "Capacity Expansion Plan");
  assert.match(result.nexoraRecommendation ?? "", /external/i);
  assert.notEqual(result.managerPreference, result.nexoraRecommendation);
  assert.equal(result.commitsDecision, false);
});

test("J — Capacity Expansion Plan keeps canonical Scenario identity", () => {
  const result = compare();
  const expansion = result.comparedOptions.find((item) => item.title === "Capacity Expansion Plan");
  assert.equal(expansion?.canonicalScenarioId, "ctx-scenario-capacity");
  assert.equal(expansion?.optionId, "ctx-scenario-capacity");
  assert.equal(result.comparedOptions.filter((item) => /Expansion Plan 2/.test(item.title)).length, 0);
});

test("K — Leading question does not upgrade a conditional recommendation", () => {
  const result = compare(pathFacts(), { managerPriority: "FAST_RECOVERY" });
  const spoken = applyNpsComparisonRecommendationToPresentedResponse({
    source: "Noted.",
    utterance: "So External Capacity is definitely the best choice?",
    comparison: result,
  });
  assert.match(spoken, /unconfirmed|uncertain/i);
  assert.doesNotMatch(spoken, /definitely the best choice is approved/i);
  assert.equal(result.recommendationStatus, "CONDITIONAL_RECOMMENDATION");
});

test("L — New evidence that supplier capacity is unavailable updates the recommendation", () => {
  const previous = compare(pathFacts(), { managerPriority: "FAST_RECOVERY", supplierAvailability: "UNKNOWN" });
  assert.match(previous.nexoraRecommendation ?? "", /external/i);
  const updated = compare(pathFacts(), { managerPriority: "FAST_RECOVERY", supplierAvailability: "UNAVAILABLE" });
  assert.doesNotMatch(updated.nexoraRecommendation ?? "", /external/i);
  assert.ok(updated.nexoraRecommendation);
  assert.notEqual(updated.recommendedOptionId, previous.recommendedOptionId);
});

test("M — Recommendation produces zero Decision writes", () => {
  const result = compare(pathFacts(), { managerPriority: "FAST_RECOVERY" });
  const advanced = attemptNpsComparisonRecommendationAdvancement(result);
  assert.equal(result.commitsDecision, false);
  assert.equal(result.approvedDecision, null);
  assert.equal(result.committedOption, null);
  assert.equal(advanced.decisionsCreated, 0);
});

test("N — NPS:5 composition alone produces zero unauthorized writes", () => {
  const result = compare();
  const advanced = attemptNpsComparisonRecommendationAdvancement(result);
  assert.equal(result.canonicalMutations.length, 0);
  assert.equal(result.writesEvidence, false);
  assert.equal(result.writesScenario, false);
  assert.equal(result.writesRecommendationStore, false);
  assert.equal(result.commitsDecision, false);
  assert.equal(result.startsExecution, false);
  assert.equal(result.writesOutcome, false);
  assert.equal(advanced.comparisonWrites, 0);
  assert.equal(advanced.recommendationWrites, 0);
  assert.ok(
    npsPathStateAfterComparison(result) === "COMPARING_OPTIONS" ||
      npsPathStateAfterComparison(result) === "RECOMMENDATION_READY",
  );
  assert.notEqual(npsPathStateAfterComparison(result), "AWAITING_COMMITMENT");
});

test("uncertain Problem does not compare options", () => {
  const canonical = pathFacts({
    problem: Object.freeze({
      problemId: null,
      problemLabel: null,
      confidence: "UNKNOWN",
      observedFrom: "UNRESOLVED",
    }),
  });
  const result = compare(canonical);
  assert.equal(result.action, "CLARIFY_PROBLEM");
  assert.equal(result.comparedOptions.length, 0);
});

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
  NPS_OPTION_GENERATION_BOUNDARY,
  attemptNpsOptionGenerationAdvancement,
  composeNpsOptionGeneration,
  npsPathStateAfterOptions,
  type NpsOptionGenerationFacts,
} from "./npsOptionGeneration.ts";

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
    status: "POSSIBLE",
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
      contributor({ status: "SUPPORTED_CONTRIBUTOR" }),
      contributor({
        candidateId: "equipment-downtime",
        label: "Equipment downtime",
        status: "POSSIBLE",
        uncertainty: "Equipment downtime has not been ruled out.",
      }),
    ]),
    hypotheses: Object.freeze([]),
    patterns: Object.freeze(["Demand increased while available capacity stayed roughly stable."]),
    nextEvidenceNeed: null,
    nextCausalTest: "Compare capacity pressure against demand while accounting for downtime.",
    managerKnowledgeRequired: false,
    ...overrides,
  });
}

function analysis(canonical: NpsCanonicalFacts = pathFacts(), facts: NpsEvidenceCauseFacts = analysisFacts()) {
  return composeNpsEvidenceCauseAnalysis({
    path: composeNpsProblemSolvingPath(canonical),
    pathFacts: canonical,
    facts,
  });
}

function compose(
  canonical: NpsCanonicalFacts = pathFacts(),
  facts: NpsEvidenceCauseFacts = analysisFacts(),
  optionFacts?: NpsOptionGenerationFacts,
) {
  const cause = analysis(canonical, facts);
  return composeNpsOptionGeneration({
    path: cause.path,
    pathFacts: canonical,
    analysis: cause,
    facts: optionFacts,
  });
}

test("boundary: NPS:4 does not create a Scenario authority or store", () => {
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.createsScenarioStore, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.createsScenarioAuthority, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.bypassesCc9, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.optionEqualsRecommendation, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.optionEqualsDecision, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.contributorEqualsConfirmedCause, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.candidateEqualsCanonicalScenario, false);
});

test("A — Ready Problem generates meaningful option candidates", () => {
  const result = compose();
  assert.equal(result.problemId, "ctx-problem-capacity");
  assert.equal(analysis().readyForOptions, true);
  assert.ok(result.optionCandidates.length >= 4);
  assert.ok(result.relevantEvidence.some((text) => /18%/.test(text)));
  assert.ok(result.optionCandidates.every((item) => item.problemId === "ctx-problem-capacity"));
  assert.ok(result.optionCandidates.every((item) => item.supportingEvidence.length > 0 || item.currentlyInfeasible));
});

test("B — Causal uncertainty allows a capacity option without stating a confirmed cause", () => {
  const result = compose();
  assert.equal(result.contributorsConsidered.includes("Demand Surge"), true);
  assert.ok(result.optionCandidates.some((item) => item.intent === "ABSORB"));
  assert.doesNotMatch(result.managerProjection.text, /Demand Surge caused/i);
  assert.doesNotMatch(result.managerProjection.text, /therefore capacity must/i);
  assert.ok(result.managerProjection.importantUncertainty?.includes("may be contributing"));
  assert.equal(result.confirmedCauseUsedAsFact, false);
});

test("C — Capacity Gap options are distinct mechanisms, not cosmetic variants", () => {
  const result = compose();
  const feasible = result.optionCandidates.filter((item) => !item.currentlyInfeasible);
  const intents = new Set(feasible.map((item) => item.intent));
  assert.ok(intents.has("ABSORB"));
  assert.ok(intents.has("TRANSFER"));
  assert.ok(intents.has("ADAPT"));
  assert.ok(intents.has("DO_NOTHING"));
  const increaseOnly = feasible.filter((item) => /increase (internal )?capacity/i.test(item.title));
  assert.ok(increaseOnly.length <= 1);
});

test("D — Hiring freeze marks permanent hiring currently infeasible", () => {
  const result = compose(
    pathFacts(),
    analysisFacts(),
    Object.freeze({
      existingScenarios: Object.freeze([]),
      hardConstraints: Object.freeze([
        Object.freeze({ id: "c-hire", label: "Hiring freeze", kind: "HIRING_FREEZE" as const }),
      ]),
      externalAvailabilityUnknown: true,
      includeHiringOption: true,
      managerKnowledgeRequired: false,
    }),
  );
  const hiring = result.optionCandidates.find((item) => item.candidateId === "opt-hire-permanent");
  assert.equal(hiring?.scenarioStatus, "CURRENTLY_INFEASIBLE");
  assert.equal(hiring?.currentlyInfeasible, true);
  assert.ok(hiring?.constraints.some((item) => /hiring freeze/i.test(item)));
});

test("E — Unknown supplier availability stays REQUIRES_VALIDATION", () => {
  const result = compose();
  const external = result.optionCandidates.find((item) => item.candidateId === "opt-external-capacity");
  assert.equal(external?.scenarioStatus, "REQUIRES_VALIDATION");
  assert.equal(external?.requiresValidation, true);
  assert.ok(external?.assumptions.some((item) => /external capacity is available/i.test(item)));
  assert.ok(external?.uncertainties.some((item) => /not yet confirmed/i.test(item)));
});

test("F — Existing Capacity Expansion Plan is reused rather than duplicated", () => {
  const result = compose(
    pathFacts(),
    analysisFacts(),
    Object.freeze({
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
    }),
  );
  const reused = result.optionCandidates.filter((item) => item.reusedScenarioId === "ctx-scenario-capacity");
  assert.equal(reused.length, 1);
  assert.equal(reused[0]?.scenarioStatus, "REUSES_CANONICAL");
  assert.equal(reused[0]?.title, "Capacity Expansion Plan");
  assert.equal(
    result.optionCandidates.filter((item) => /Capacity Expansion Plan 2/i.test(item.title)).length,
    0,
  );
});

test("G — Uncertain Problem ownership returns CLARIFY_PROBLEM with zero options", () => {
  const canonical = pathFacts({
    problem: Object.freeze({
      problemId: null,
      problemLabel: null,
      confidence: "UNKNOWN",
      observedFrom: "UNRESOLVED",
    }),
  });
  const result = compose(canonical, analysisFacts({ contributors: Object.freeze([contributor()]) }));
  assert.equal(result.action, "CLARIFY_PROBLEM");
  assert.equal(result.optionCandidates.length, 0);
  assert.equal(result.generationStatus, "NEEDS_CLARIFICATION");
});

test("H — Insufficient evidence does not fabricate intervention logic", () => {
  const result = compose(
    pathFacts({ evidenceState: "INSUFFICIENT", causeHypothesesAvailable: false }),
    analysisFacts({
      items: Object.freeze([
        item({
          evidenceStatus: "UNRESOLVED",
          semanticConfidence: "UNRESOLVED",
          observation: null,
        }),
      ]),
      contributors: Object.freeze([]),
    }),
  );
  assert.ok(result.generationStatus === "NOT_READY" || result.action === "INVESTIGATE_EXISTING_EVIDENCE" || result.action === "REQUEST_MORE_EVIDENCE");
  assert.equal(result.optionCandidates.some((item) => item.intent === "TRANSFER"), false);
  assert.equal(result.optionCandidates.some((item) => item.intent === "ABSORB"), false);
});

test("I — Distinct bounded options become READY_FOR_COMPARISON", () => {
  const result = compose();
  assert.equal(result.coverage, "SUFFICIENT");
  assert.equal(result.generationStatus, "READY_FOR_COMPARISON");
  assert.equal(result.readyForComparison, true);
  assert.equal(result.path.currentState, "OPTIONS_AVAILABLE");
  assert.ok(result.path.availableNextStates.includes("COMPARING_OPTIONS"));
  assert.equal(result.path.currentState === "COMPARING_OPTIONS", false);
});

test("J — Option generation does not recommend a winner", () => {
  const result = compose();
  assert.equal(result.recommendation, null);
  assert.equal(result.preferredOption, null);
  assert.doesNotMatch(result.managerProjection.text, /recommend|best option|should be selected/i);
});

test("K — Option candidates do not write a Decision", () => {
  const result = compose();
  const advanced = attemptNpsOptionGenerationAdvancement(result);
  assert.equal(result.commitsDecision, false);
  assert.equal(advanced.decisionsCreated, 0);
});

test("L — NPS:4 composition alone produces zero unauthorized writes", () => {
  const result = compose();
  const advanced = attemptNpsOptionGenerationAdvancement(result);
  assert.equal(result.canonicalMutations.length, 0);
  assert.equal(result.writesEvidence, false);
  assert.equal(result.writesScenario, false);
  assert.equal(result.writesRecommendation, false);
  assert.equal(result.commitsDecision, false);
  assert.equal(result.startsExecution, false);
  assert.equal(result.writesOutcome, false);
  assert.equal(advanced.unauthorizedScenarioWrites, 0);
  assert.equal(advanced.recommendationWrites, 0);
  assert.equal(npsPathStateAfterOptions(result), "OPTIONS_AVAILABLE");
  assert.equal(result.scenarioHandoff.npsWritesScenario, false);
  assert.equal(result.scenarioHandoff.owner, "CC:9/ScenarioConversation");
});

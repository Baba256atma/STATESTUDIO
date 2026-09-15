import assert from "node:assert/strict";
import test from "node:test";
import {
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
} from "./npsProblemSolvingPath.ts";
import {
  NPS_EVIDENCE_CAUSE_BOUNDARY,
  attemptNpsEvidenceCauseAdvancement,
  composeNpsEvidenceCauseAnalysis,
  npsPathStateAfterEvidenceCause,
  type NpsCauseHypothesisFact,
  type NpsContributorFact,
  type NpsEvidenceCauseFacts,
  type NpsEvidenceItemFact,
} from "./npsEvidenceCauseAnalysis.ts";

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
    evidenceState: "NONE",
    causeHypothesesAvailable: false,
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

function item(overrides: Partial<NpsEvidenceItemFact>): NpsEvidenceItemFact {
  return Object.freeze({
    id: "e1",
    label: "Demand",
    classification: "OBSERVATION",
    observation: null,
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
    candidateId: "demand-growth",
    label: "Demand growth",
    relationshipToProblem: "associated with Capacity Gap",
    supportingEvidenceIds: Object.freeze(["obs-demand"]),
    contradictingEvidenceIds: Object.freeze([]),
    status: "POSSIBLE",
    confidence: "medium",
    uncertainty: "Demand growth may be related, but it is not a confirmed cause.",
    existingCausalAuthority: false,
    ...overrides,
  });
}

function hypothesis(overrides: Partial<NpsCauseHypothesisFact> = {}): NpsCauseHypothesisFact {
  return Object.freeze({
    id: "hyp-demand",
    label: "Demand growth contributes to Capacity Gap",
    supportingEvidenceIds: Object.freeze(["obs-demand"]),
    contradictingEvidenceIds: Object.freeze([]),
    alternativeExplanationIds: Object.freeze([]),
    confounderIds: Object.freeze([]),
    status: "POSSIBLE_CAUSE",
    confidence: "medium",
    existingCausalAuthority: false,
    confirmedByExistingAuthority: false,
    ...overrides,
  });
}

function facts(overrides: Partial<NpsEvidenceCauseFacts> = {}): NpsEvidenceCauseFacts {
  return Object.freeze({
    items: Object.freeze([]),
    contributors: Object.freeze([]),
    hypotheses: Object.freeze([]),
    patterns: Object.freeze([]),
    nextEvidenceNeed: "Review capacity, demand, staffing, and downtime over the same period.",
    nextCausalTest: null,
    managerKnowledgeRequired: false,
    ...overrides,
  });
}

function compose(canonical: NpsCanonicalFacts, analysisFacts: NpsEvidenceCauseFacts) {
  return composeNpsEvidenceCauseAnalysis({
    path: composeNpsProblemSolvingPath(canonical),
    pathFacts: canonical,
    facts: analysisFacts,
  });
}

test("boundary: NPS:3 does not create evidence or causal authorities", () => {
  assert.equal(NPS_EVIDENCE_CAUSE_BOUNDARY.createsEvidenceStore, false);
  assert.equal(NPS_EVIDENCE_CAUSE_BOUNDARY.createsCausalEngine, false);
  assert.equal(NPS_EVIDENCE_CAUSE_BOUNDARY.createsVariableIntelligence, false);
  assert.equal(NPS_EVIDENCE_CAUSE_BOUNDARY.promotesClassificationIndependently, false);
  assert.equal(NPS_EVIDENCE_CAUSE_BOUNDARY.generatesScenarios, false);
  assert.equal(NPS_EVIDENCE_CAUSE_BOUNDARY.generatesRecommendations, false);
});

test("A — No evidence → INSUFFICIENT/NONE, no cause, REQUEST_MORE_EVIDENCE", () => {
  const result = compose(pathFacts(), facts());
  assert.ok(result.evidenceSufficiency === "NONE" || result.evidenceSufficiency === "INSUFFICIENT");
  assert.equal(result.possibleCauses.length, 0);
  assert.equal(result.confirmedCause, null);
  assert.equal(result.action, "REQUEST_MORE_EVIDENCE");
});

test("B — Observation only is recorded without automatic cause", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({
          id: "obs-demand",
          observation: "Demand increased 18%.",
          interpretation: "Demand rose during the observed period.",
        }),
      ]),
    }),
  );
  assert.ok(result.observations.some((text) => /18%/.test(text)));
  assert.equal(result.possibleCauses.length, 0);
  assert.equal(result.confirmedCause, null);
  assert.equal(result.causalStatus, "OBSERVED");
});

test("C — Correlation stays ASSOCIATED / POSSIBLE_CONTRIBUTOR, not confirmed cause", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({ id: "obs-demand", observation: "Demand increased 18%." }),
        item({
          id: "obs-gap",
          label: "Capacity Gap",
          classification: "RELATIONSHIP",
          observation: "Capacity Gap worsened in the same period.",
        }),
      ]),
      contributors: Object.freeze([contributor()]),
      patterns: Object.freeze(["Demand rises while Capacity Gap worsens."]),
    }),
  );
  assert.ok(result.causalStatus === "ASSOCIATED" || result.causalStatus === "POSSIBLE_CONTRIBUTOR");
  assert.notEqual(result.causalStatus, "CONFIRMED_CAUSE");
  assert.equal(result.confirmedCause, null);
});

test("D — Supported contributor keeps causal uncertainty", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({ id: "obs-demand", observation: "Demand increased 18%." }),
        item({
          id: "obs-cap",
          label: "Capacity",
          field: "capacity",
          observation: "Available capacity remained approximately stable.",
        }),
      ]),
      contributors: Object.freeze([
        contributor({ status: "SUPPORTED_CONTRIBUTOR", confidence: "medium" }),
      ]),
    }),
  );
  assert.equal(result.possibleContributors[0]?.status, "SUPPORTED_CONTRIBUTOR");
  assert.equal(result.causalStatus, "SUPPORTED_CONTRIBUTOR");
  assert.equal(result.confirmedCause, null);
  assert.ok(result.uncertainties.some((item) => /confirmed cause/i.test(item)));
});

test("E — Confounder is preserved; no premature causal conclusion", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({ id: "obs-demand", observation: "Demand increased 18%." }),
        item({
          id: "obs-gap",
          label: "Capacity Gap",
          observation: "Capacity Gap worsened.",
        }),
        item({
          id: "obs-down",
          label: "Equipment downtime",
          observation: "Downtime also increased.",
          confounder: true,
        }),
      ]),
      contributors: Object.freeze([contributor()]),
      hypotheses: Object.freeze([
        hypothesis({
          alternativeExplanationIds: Object.freeze(["Equipment downtime"]),
          confounderIds: Object.freeze(["Equipment downtime"]),
        }),
      ]),
      nextCausalTest: "Compare Capacity Gap during high-demand periods while controlling for downtime.",
    }),
  );
  assert.ok(result.confounders.some((item) => /downtime/i.test(item)));
  assert.ok(result.alternativeExplanations.some((item) => /downtime/i.test(item)));
  assert.equal(result.confirmedCause, null);
  assert.match(result.nextCausalTest ?? "", /downtime/i);
});

test("F — Contradicting evidence weakens the demand hypothesis", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({ id: "obs-demand", observation: "Demand increased 18%." }),
        item({
          id: "obs-normal",
          label: "Normal-demand Capacity Gap",
          observation: "Capacity Gap also occurred during periods of normal demand.",
          contradicting: true,
        }),
      ]),
      contributors: Object.freeze([
        contributor({
          status: "CONFLICTING",
          contradictingEvidenceIds: Object.freeze(["obs-normal"]),
          uncertainty: "The demand hypothesis is weakened by gaps under normal demand.",
        }),
      ]),
      hypotheses: Object.freeze([
        hypothesis({
          status: "WEAKENED",
          contradictingEvidenceIds: Object.freeze(["obs-normal"]),
        }),
      ]),
    }),
  );
  assert.equal(result.evidenceSufficiency, "CONFLICTING");
  assert.equal(result.possibleCauses[0]?.status, "WEAKENED");
  assert.ok(result.possibleContributors[0]?.contradictingEvidenceIds.includes("obs-normal"));
});

test("G — Unconfirmed CAP_AV must not become Available Capacity evidence", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({
          id: "cap-av",
          label: "CAP_AV",
          classification: "EVIDENCE",
          observation: "Available capacity declined.",
          interpretation: "Available Capacity declined.",
          field: "CAP_AV",
          semanticConfidence: "UNRESOLVED",
          evidenceStatus: "UNRESOLVED",
        }),
      ]),
      managerKnowledgeRequired: true,
    }),
  );
  assert.equal(result.evidenceItems[0]?.classification, "DATA");
  assert.equal(result.evidenceItems[0]?.evidenceStatus, "UNRESOLVED");
  assert.equal(result.evidenceItems[0]?.interpretation, null);
  assert.doesNotMatch(result.managerProjection.text, /Available Capacity declined/i);
  assert.equal(result.action, "ASK_MANAGER");
});

test("H — Manager-confirmed CAP_AV meaning may participate in evidence analysis", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({
          id: "cap-av",
          label: "Available capacity",
          classification: "EVIDENCE",
          observation: "Available capacity remained approximately stable.",
          field: "CAP_AV",
          semanticConfidence: "CONFIRMED",
          managerConfirmation: true,
          evidenceStatus: "TRUSTED",
        }),
      ]),
    }),
  );
  assert.equal(result.evidenceItems[0]?.classification, "EVIDENCE");
  assert.ok(result.observations.some((text) => /available capacity/i.test(text)));
});

test("I — Cause analysis stays on Capacity Gap despite Stage and conversation drift", () => {
  const result = compose(
    pathFacts(),
    facts({ items: Object.freeze([item({ observation: "Demand increased 18%." })]) }),
  );
  assert.equal(result.problemId, "ctx-problem-capacity");
  assert.notEqual(result.problemId, "ctx-scenario-demand");
  assert.notEqual(result.problemId, "ctx-problem-margin");
});

test("J — Ready for options without generating a Scenario", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({ id: "obs-demand", observation: "Demand increased 18%." }),
        item({
          id: "obs-cap",
          label: "Capacity",
          observation: "Available capacity remained approximately stable.",
        }),
      ]),
      contributors: Object.freeze([contributor({ status: "SUPPORTED_CONTRIBUTOR" })]),
      nextCausalTest: "Compare capacity pressure against demand while accounting for downtime.",
    }),
  );
  assert.equal(result.action, "READY_FOR_OPTIONS");
  assert.equal(result.readyForOptions, true);
  assert.equal(result.writesScenario, false);
  assert.deepEqual(result.path.availableNextStates.includes("OPTIONS_AVAILABLE") || result.path.currentState === "CAUSE_ANALYSIS", true);
  assert.notEqual(result.path.currentState, "OPTIONS_AVAILABLE");
});

test("K — Correlation only keeps confirmedCause null", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([
        item({ classification: "RELATIONSHIP", observation: "Demand and Capacity Gap moved together." }),
      ]),
      hypotheses: Object.freeze([
        hypothesis({ confirmedByExistingAuthority: true, existingCausalAuthority: false }),
      ]),
    }),
  );
  assert.equal(result.confirmedCause, null);
  assert.notEqual(result.causalStatus, "CONFIRMED_CAUSE");
});

test("L — Analysis alone produces zero mutations", () => {
  const result = compose(
    pathFacts(),
    facts({
      items: Object.freeze([item({ observation: "Demand increased 18%." })]),
      contributors: Object.freeze([contributor()]),
    }),
  );
  const advanced = attemptNpsEvidenceCauseAdvancement(result);
  assert.equal(result.canonicalMutations.length, 0);
  assert.equal(result.fabricatesEvidence, false);
  assert.equal(result.writesScenario, false);
  assert.equal(result.writesRecommendation, false);
  assert.equal(result.commitsDecision, false);
  assert.equal(result.startsExecution, false);
  assert.equal(advanced.decisionsCreated, 0);
  assert.equal(advanced.executionsStarted, 0);
  assert.equal(advanced.scenarioWrites, 0);
  assert.equal(advanced.recommendationWrites, 0);
  assert.equal(npsPathStateAfterEvidenceCause(result) === "EVIDENCE_REVIEW" || npsPathStateAfterEvidenceCause(result) === "CAUSE_ANALYSIS", true);
});

test("uncertain ownership does not run cause analysis", () => {
  const canonical = pathFacts({
    problem: Object.freeze({
      problemId: null,
      problemLabel: null,
      confidence: "UNKNOWN",
      observedFrom: "UNRESOLVED",
    }),
  });
  const result = compose(
    canonical,
    facts({ contributors: Object.freeze([contributor()]) }),
  );
  assert.equal(result.action, "CLARIFY_PROBLEM");
  assert.equal(result.problemId, null);
  assert.equal(result.path.currentState, null);
});

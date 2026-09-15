import assert from "node:assert/strict";
import test from "node:test";
import {
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
} from "./npsProblemSolvingPath.ts";
import {
  NPS_PROBLEM_UNDERSTANDING_BOUNDARY,
  attemptNpsUnderstandingAdvancement,
  composeNpsProblemUnderstanding,
  npsPathStateAfterUnderstanding,
  type NpsUnderstandingFacts,
} from "./npsProblemUnderstanding.ts";

function pathFacts(overrides: Partial<NpsCanonicalFacts> = {}): NpsCanonicalFacts {
  return Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "MO Context associatedProblem",
    }),
    investigationPresent: false,
    evidenceState: "NONE",
    causeHypothesesAvailable: false,
    scenarioIds: Object.freeze([]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: Object.freeze({ present: false, executionId: null, status: "NONE" }),
    outcome: Object.freeze({ observed: false, problemResolved: null }),
    stageFocusId: "ctx-problem-capacity",
    conversationSubjectId: "ctx-problem-capacity",
    ...overrides,
  });
}

function understanding(overrides: Partial<NpsUnderstandingFacts> = {}): NpsUnderstandingFacts {
  return Object.freeze({
    knownFacts: Object.freeze([
      {
        text: "Available capacity is below required demand.",
        epistemic: "FACT",
        observedFrom: "MO presentation / KPI",
      },
    ]),
    knownSymptoms: Object.freeze([
      {
        text: "Delivery performance is constrained.",
        epistemic: "SYMPTOM",
        observedFrom: "Problem summary",
      },
    ]),
    knownConstraints: Object.freeze([]),
    unknowns: Object.freeze([
      {
        text: "Whether the gap is temporary or persistent.",
        epistemic: "UNKNOWN",
        observedFrom: "missing duration evidence",
      },
    ]),
    assumptions: Object.freeze([
      {
        text: "The gap will continue without intervention.",
        epistemic: "ASSUMPTION",
        observedFrom: "unverified projection",
      },
    ]),
    unresolvedQuestions: Object.freeze(["How long has the capacity pressure been present?"]),
    availableEvidence: Object.freeze([]),
    missingEvidence: Object.freeze([
      {
        id: null,
        label: "Recent capacity and demand history",
        trust: "UNAVAILABLE",
        observedFrom: "Data Reality",
      },
    ]),
    managerKnowledgeRequired: false,
    requiredEvidenceUnavailable: false,
    trustedEvidenceAvailable: false,
    investigationActive: false,
    investigationCompleted: false,
    usableEvidenceForReview: false,
    nextInvestigationNeed: "Review recent capacity and demand history.",
    usefulQuestion: "Has this capacity gap been persistent, or did it begin recently?",
    causalObservations: Object.freeze([]),
    ...overrides,
  });
}

function compose(pathOverride: Partial<NpsCanonicalFacts> = {}, facts?: NpsUnderstandingFacts) {
  const canonical = pathFacts(pathOverride);
  return composeNpsProblemUnderstanding({
    path: composeNpsProblemSolvingPath(canonical),
    pathFacts: canonical,
    understanding: facts ?? understanding(),
  });
}

test("boundary: NPS:2 is path composition, not a new authority", () => {
  assert.equal(NPS_PROBLEM_UNDERSTANDING_BOUNDARY.newAuthorityLayer, false);
  assert.equal(NPS_PROBLEM_UNDERSTANDING_BOUNDARY.createsProblemAuthority, false);
  assert.equal(NPS_PROBLEM_UNDERSTANDING_BOUNDARY.createsQuestioningAuthority, false);
  assert.equal(NPS_PROBLEM_UNDERSTANDING_BOUNDARY.createsInvestigationEngine, false);
  assert.equal(NPS_PROBLEM_UNDERSTANDING_BOUNDARY.performsCauseAnalysis, false);
  assert.equal(NPS_PROBLEM_UNDERSTANDING_BOUNDARY.observationEqualsCause, false);
});

test("A — Clear Problem, missing understanding → UNDERSTANDING and an investigation need", () => {
  const result = compose();
  assert.equal(result.problemOwnership, "DETERMINED");
  assert.equal(result.problemId, "ctx-problem-capacity");
  assert.equal(npsPathStateAfterUnderstanding(result), "UNDERSTANDING");
  assert.equal(result.understandingStatus, "PARTIAL");
  assert.match(result.nextInvestigationNeed ?? "", /capacity and demand history/i);
  assert.ok(result.unknowns.some((item) => /temporary or persistent/i.test(item)));
  assert.ok(result.assumptions.length > 0);
  assert.notEqual(result.assumptions[0], result.knownFacts[0]);
});

test("B — Manager knowledge required → ASK_MANAGER with ECA questioning handoff", () => {
  const result = compose(
    {},
    understanding({
      managerKnowledgeRequired: true,
      trustedEvidenceAvailable: false,
      nextInvestigationNeed: "Duration of Capacity Gap is unknown.",
    }),
  );
  assert.equal(result.action, "ASK_MANAGER");
  assert.equal(result.questioningHandoff.required, true);
  assert.equal(result.questioningHandoff.owner, "NPA-T ECA:4");
  assert.equal(result.questioningHandoff.intakeOwner, "NPA-T ECA:5");
  assert.equal(result.questioningHandoff.npsSelectsQuestion, false);
  assert.match(result.questioningHandoff.suggestedQuestion ?? "", /persistent|recently/i);
  assert.equal(result.investigationHandoff.required, false);
  assert.match(result.managerProjection.text, /What is missing:/);
  assert.match(result.managerProjection.text, /Useful question:/);
  assert.doesNotMatch(result.managerProjection.text, /NPS|ECA|CC:|resolver|authority|composer/);
});

test("C — Existing trusted evidence → INVESTIGATE_EXISTING_EVIDENCE and do not ask", () => {
  const result = compose(
    {},
    understanding({
      trustedEvidenceAvailable: true,
      managerKnowledgeRequired: true,
      availableEvidence: Object.freeze([
        {
          id: "csv-capacity",
          label: "Trusted capacity CSV",
          trust: "TRUSTED",
          observedFrom: "Data Reality",
        },
      ]),
      nextInvestigationNeed: "Review recent capacity and demand history.",
    }),
  );
  assert.equal(result.action, "INVESTIGATE_EXISTING_EVIDENCE");
  assert.equal(result.understandingStatus, "INVESTIGABLE");
  assert.equal(result.questioningHandoff.required, false);
  assert.equal(result.investigationHandoff.required, true);
  assert.equal(result.investigationHandoff.npsPerformsInvestigation, false);
  assert.equal(result.managerProjection.usefulQuestion, null);
});

test("D — NPS:1 ownership UNCERTAIN → CLARIFY_PROBLEM and no guessed investigation", () => {
  const canonical = pathFacts({
    problem: Object.freeze({
      problemId: null,
      problemLabel: null,
      confidence: "UNKNOWN",
      observedFrom: "UNRESOLVED",
    }),
    stageFocusId: "obj-delivery",
    conversationSubjectId: "ctx-problem-margin",
  });
  const result = composeNpsProblemUnderstanding({
    path: composeNpsProblemSolvingPath(canonical),
    pathFacts: canonical,
    understanding: understanding({
      nextInvestigationNeed: "Investigate Margin Pressure.",
    }),
  });
  assert.equal(result.action, "CLARIFY_PROBLEM");
  assert.equal(result.problemId, null);
  assert.equal(result.path.currentState, null);
  assert.equal(result.investigationHandoff.required, false);
  assert.match(result.nextInvestigationNeed ?? "", /Determine the active Problem/i);
  assert.doesNotMatch(result.managerProjection.text, /Margin Pressure/);
});

test("E — Conflicting Stage/conversation context stays anchored to Capacity Gap", () => {
  const result = compose({
    stageFocusId: "ctx-scenario-demand",
    conversationSubjectId: "ctx-problem-margin",
    scenarioIds: Object.freeze(["ctx-scenario-demand"]),
  });
  assert.equal(result.problemId, "ctx-problem-capacity");
  assert.equal(result.problemTitle, "Capacity Gap");
  assert.notEqual(result.problemId, "ctx-scenario-demand");
  assert.notEqual(result.problemId, "ctx-problem-margin");
});

test("F — Required evidence unavailable → WAIT_FOR_EVIDENCE with no invented understanding", () => {
  const result = compose(
    {},
    understanding({
      knownFacts: Object.freeze([]),
      knownSymptoms: Object.freeze([]),
      unknowns: Object.freeze([
        {
          text: "Required operational delay evidence is not available.",
          epistemic: "UNKNOWN",
          observedFrom: "Data Reality",
        },
      ]),
      requiredEvidenceUnavailable: true,
      trustedEvidenceAvailable: false,
      managerKnowledgeRequired: false,
      nextInvestigationNeed: "Wait for delay-by-stage evidence.",
    }),
  );
  assert.equal(result.action, "WAIT_FOR_EVIDENCE");
  assert.equal(result.understandingStatus, "BLOCKED");
  assert.equal(result.knownFacts.length, 0);
  assert.equal(result.fabricatesEvidence, false);
});

test("G — Investigation active → NPS state INVESTIGATING", () => {
  const result = compose(
    { investigationPresent: true, investigationId: "inv-capacity-1" },
    understanding({ investigationActive: true, trustedEvidenceAvailable: true }),
  );
  assert.equal(npsPathStateAfterUnderstanding(result), "INVESTIGATING");
});

test("H — Completed investigation with usable evidence may become EVIDENCE_REVIEW", () => {
  const result = compose(
    { investigationPresent: true, evidenceState: "PARTIAL" },
    understanding({
      investigationActive: true,
      investigationCompleted: true,
      usableEvidenceForReview: true,
      trustedEvidenceAvailable: true,
      unknowns: Object.freeze([]),
      unresolvedQuestions: Object.freeze([]),
    }),
  );
  assert.equal(result.readyForEvidenceReview, true);
  assert.equal(npsPathStateAfterUnderstanding(result), "EVIDENCE_REVIEW");
  assert.equal(result.action, "READY_FOR_NEXT_STEP");
  assert.equal(result.boundary.performsCauseAnalysis, false);
});

test("I — Symptom plus correlation is investigation direction, not a confirmed cause", () => {
  const result = compose(
    {},
    understanding({
      causalObservations: Object.freeze([
        {
          text: "Capacity pressure appears alongside higher demand.",
          relation: "CORRELATION",
          supportedByExistingCausalAuthority: false,
        },
        {
          text: "Late shipments increased.",
          relation: "SYMPTOM",
          supportedByExistingCausalAuthority: false,
        },
      ]),
    }),
  );
  assert.equal(result.confirmedCause, null);
  assert.match(result.investigationDirection ?? "", /investigat/i);
  assert.doesNotMatch(result.investigationDirection ?? "", /caused the Capacity Gap/i);
  assert.equal(result.boundary.correlationEqualsCause, false);
  assert.equal(result.boundary.symptomEqualsCause, false);
});

test("J — Understanding and path progression produce zero canonical mutations", () => {
  const result = compose({}, understanding({ trustedEvidenceAvailable: true, investigationActive: true }));
  const advanced = attemptNpsUnderstandingAdvancement(result);
  assert.equal(result.canonicalMutations.length, 0);
  assert.equal(result.commitsDecision, false);
  assert.equal(result.startsExecution, false);
  assert.equal(result.writesScenario, false);
  assert.equal(result.fabricatesEvidence, false);
  assert.equal(advanced.decisionsCreated, 0);
  assert.equal(advanced.executionsStarted, 0);
  assert.equal(advanced.scenarioWrites, 0);
  assert.equal(advanced.evidenceFabricated, false);
  assert.equal(advanced.canonicalMutations.length, 0);
});

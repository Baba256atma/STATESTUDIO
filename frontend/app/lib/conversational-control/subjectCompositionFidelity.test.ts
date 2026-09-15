import assert from "node:assert/strict";
import { test } from "node:test";

import {
  decideSubjectCompositionFidelity,
  isDeicticSubjectExplain,
  isScenarioAssessmentFollowUpOperation,
  resolveConversationalCompositionSubject,
  staleScenarioAssessmentWouldCaptureComposition,
} from "./subjectCompositionFidelity.ts";

test("continuity is the resolved composition subject when present", () => {
  const resolved = resolveConversationalCompositionSubject({
    continuityId: "ctx-problem-capacity",
    continuityKind: "problem",
    currentSubjectId: "ctx-scenario-capacity",
    currentSubjectKind: "scenario",
  });
  assert.equal(resolved.id, "ctx-problem-capacity");
  assert.equal(resolved.kind, "problem");
});

test("deictic explain of a Problem is stale Scenario capture", () => {
  assert.equal(
    staleScenarioAssessmentWouldCaptureComposition({
      hasActiveScenarioAssessment: true,
      hasPrimaryTargetHint: false,
      resolvedSubjectKind: "problem",
      intentKind: "explain",
      normalizedUtterance: "explain it",
    }),
    true,
  );
});

test("how sure remains a Scenario operation but cannot capture a newer Object", () => {
  assert.equal(
    isScenarioAssessmentFollowUpOperation("explain", "how sure are you"),
    true,
  );
  assert.equal(
    staleScenarioAssessmentWouldCaptureComposition({
      hasActiveScenarioAssessment: true,
      hasPrimaryTargetHint: false,
      resolvedSubjectKind: "object",
      intentKind: "explain",
      normalizedUtterance: "how sure are you",
    }),
    true,
  );
});

test("how sure continues an active Scenario when no newer conversation subject owns the turn", () => {
  assert.equal(
    staleScenarioAssessmentWouldCaptureComposition({
      hasActiveScenarioAssessment: true,
      hasEstablishedConversationSubject: false,
      hasPrimaryTargetHint: false,
      resolvedSubjectKind: "object",
      intentKind: "explain",
      normalizedUtterance: "how sure are you",
    }),
    false,
  );
});

test("named Scenario explain is not blocked", () => {
  assert.equal(
    staleScenarioAssessmentWouldCaptureComposition({
      hasActiveScenarioAssessment: true,
      hasPrimaryTargetHint: true,
      resolvedSubjectKind: "problem",
      intentKind: "explain",
      normalizedUtterance: "explain demand surge",
    }),
    false,
  );
});

test("resolved Scenario deictic explain is not stale", () => {
  assert.equal(
    staleScenarioAssessmentWouldCaptureComposition({
      hasActiveScenarioAssessment: true,
      hasPrimaryTargetHint: false,
      resolvedSubjectKind: "scenario",
      intentKind: "explain",
      normalizedUtterance: "explain it",
    }),
    false,
  );
});

test("stale Scenario cannot capture Risk evidence or uncertainty follow-ups", () => {
  for (const [intentKind, normalizedUtterance] of [
    ["evidence", "what evidence do we have"],
    ["explain", "what don't we know"],
    ["explain", "how serious is it"],
  ] as const) {
    assert.equal(
      staleScenarioAssessmentWouldCaptureComposition({
        hasActiveScenarioAssessment: true,
        hasPrimaryTargetHint: false,
        resolvedSubjectKind: "risk",
        intentKind,
        normalizedUtterance,
      }),
      true,
    );
  }
});

test("deictic tell me more of a Problem is stale Scenario capture", () => {
  assert.equal(
    staleScenarioAssessmentWouldCaptureComposition({
      hasActiveScenarioAssessment: true,
      hasPrimaryTargetHint: false,
      resolvedSubjectKind: "problem",
      intentKind: "explain",
      normalizedUtterance: "tell me more about it",
    }),
    true,
  );
});

test("different Scenario ids are not interchangeable composition subjects", () => {
  const decision = decideSubjectCompositionFidelity({
    resolvedSubject: Object.freeze({
      id: "ctx-scenario-demand",
      kind: "scenario",
    }),
    candidateSubject: Object.freeze({
      id: "ctx-scenario-capacity",
      kind: "scenario",
    }),
    candidateSource: "request-explanation",
    intentKind: "explain",
    normalizedUtterance: "tell me more about it",
    blockedStaleScenarioAssessment: false,
  });
  assert.equal(decision.compatible, false);
  assert.equal(decision.selectedSubject.id, "ctx-scenario-demand");
});

test("incompatible Scenario candidate cannot be the composition subject", () => {
  const decision = decideSubjectCompositionFidelity({
    resolvedSubject: Object.freeze({
      id: "ctx-problem-capacity",
      kind: "problem",
    }),
    candidateSubject: Object.freeze({
      id: "ctx-scenario-capacity",
      kind: "scenario",
    }),
    candidateSource: "explain-scenario",
    intentKind: "explain",
    normalizedUtterance: "explain it",
    blockedStaleScenarioAssessment: true,
  });
  assert.equal(decision.compatible, false);
  assert.equal(decision.selectedSubject.id, "ctx-problem-capacity");
  assert.equal(isDeicticSubjectExplain("explain", "explain it"), true);
});

import assert from "node:assert/strict";
import test from "node:test";

import { createDeck, resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { deleteWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { assessCausalHypothesisReadiness, reviewCausalHypothesis } from "./causalHypothesisReview.ts";
import {
  assessScenarioEvidenceCurrency,
  commitCausalScenarioHandoff,
  prepareCausalScenarioHandoff,
} from "./causalScenarioHandoff.ts";
import {
  createCausalHypothesis,
  createCausalInvestigation,
  createCausalObservation,
  getCausalHypothesis,
  listCausalHypothesisReviews,
  resetCausalInvestigationDomainForTests,
  transitionCausalObservation,
  updateCausalHypothesis,
} from "./canonicalCausalInvestigationDomain.ts";
import {
  archiveDecisionNode,
  createDecisionGoal,
  createDecisionScenario,
  deleteDecisionNode,
  getDecisionScenario,
  CANONICAL_DECISION_STORAGE_KEY,
  listDecisionGoals,
  listDecisionScenarios,
  listExecutionPlans,
  listManagerDecisions,
  resetDecisionDomainForTests,
} from "./canonicalDecisionDomain.ts";
import { createCanonicalObject, getCanonicalObject, resetCanonicalObjectsForTests } from "./canonicalObjectRegistry.ts";

const T0 = "2026-11-10T12:00:00.000Z";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) { values.set(key, value); },
  };
}

function setup() {
  const store = memory();
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  setDeckRegistryStorageForTests(store);
  resetCanonicalObjectsForTests(store);
  resetCausalInvestigationDomainForTests(store);
  resetDecisionDomainForTests(store);
  return store;
}

test("only an accepted hypothesis can create one proposed scenario with provenance", () => {
  const store = setup();
  const company = createManagerWorkspaceFromEntry({ name: "NPA Handoff", kind: "BUSINESS" });
  const other = createManagerWorkspaceFromEntry({ name: "NPA Other", kind: "BUSINESS" });
  assert.ok(company && other);
  if (!company || !other) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    const finance = createDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
    assert.equal(production.ok && finance.ok, true);
    if (!production.ok || !finance.ok) return;
    const machine = createCanonicalObject({
      workspaceId: company.workspaceId,
      objectType: "MACHINE",
      displayName: "CNC Machine A",
      deckId: production.value.deckId,
      now: T0,
    });
    assert.equal(machine.ok, true);
    if (!machine.ok) return;
    const beforeObject = JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId));
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Why did production efficiency decline?",
      problemStatement: "Effective output fell.",
      now: T0,
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const observation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The manager reports lower effective output.",
      canonicalObjectId: machine.value.canonicalObjectId,
      now: T0,
    });
    assert.equal(observation.ok, true);
    if (!observation.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Maintenance downtime may be contributing to reduced production capacity.",
      observationIds: [observation.value.observationId],
      assumptions: ["Maintenance resources are available."],
      limitations: ["The report does not prove downtime caused the decline."],
      now: T0,
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const proposed = prepareCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(proposed.ok, false);
    if (proposed.ok) return;
    assert.equal(proposed.reason, "ineligible-status");
    const started = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "Review the current evidence.",
      operationId: "start-handoff",
      now: T0,
    });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    const accepted = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept for scenario exploration.",
      operationId: "accept-handoff",
      acknowledgeLimitations: true,
      evidenceFingerprint: started.value.readiness.evidenceFingerprint,
      now: T0,
    });
    assert.equal(accepted.ok, true);
    if (!accepted.ok) return;
    const prepared = prepareCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    assert.equal(prepared.value.causalProof, false);
    assert.equal(prepared.value.evidenceFingerprint, accepted.value.review.evidenceFingerprint);
    const goal = createDecisionGoal({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Restore reliable capacity",
      description: "Evaluate ways to recover effective output.",
      now: T0,
    });
    const financeGoal = createDecisionGoal({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      name: "Finance goal",
      now: T0,
    });
    assert.equal(goal.ok && financeGoal.ok, true);
    if (!goal.ok || !financeGoal.ok) return;
    const base = {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      targetGoalId: goal.value.goalId,
      scenarioName: "Reduce unplanned machine downtime by 20%",
      intervention: "Introduce preventive maintenance scheduling.",
      assumptions: ["Maintenance resources are available.", "Production demand remains comparable."],
      limitations: ["The observed report does not prove downtime caused the decline.", "The 20% target is a scenario assumption, not a measured forecast."],
      operationId: "handoff-1",
      evidenceFingerprint: prepared.value.evidenceFingerprint,
      acknowledgeLimitations: true,
      now: T0,
    };
    assert.equal(commitCausalScenarioHandoff({ ...base, acknowledgeLimitations: false }).ok, false);
    assert.equal(commitCausalScenarioHandoff({ ...base, evidenceFingerprint: "evidence:old" }).ok, false);
    if (!commitCausalScenarioHandoff({ ...base, evidenceFingerprint: "evidence:old" }).ok) {
      assert.equal(commitCausalScenarioHandoff({ ...base, evidenceFingerprint: "evidence:old" }).ok, false);
    }
    const stale = commitCausalScenarioHandoff({ ...base, evidenceFingerprint: "evidence:old" });
    assert.equal(stale.ok, false);
    if (stale.ok) return;
    assert.equal(stale.reason, "stale-handoff");
    assert.equal(listDecisionScenarios(company.workspaceId, production.value.deckId).length, 0);
    const financeAttempt = commitCausalScenarioHandoff({ ...base, targetGoalId: financeGoal.value.goalId });
    assert.equal(financeAttempt.ok, false);
    const demo = prepareCausalScenarioHandoff({
      workspaceId: DEMO_WORKSPACE_ID,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(demo.ok, false);
    const committed = commitCausalScenarioHandoff(base);
    assert.equal(committed.ok, true);
    if (!committed.ok) return;
    assert.equal(committed.value.scenario.lifecycleStatus, "PROPOSED");
    assert.equal(committed.value.scenario.causalOrigin?.originType, "NEXOCAUSE");
    assert.equal(committed.value.scenario.causalOrigin?.hypothesisId, hypothesis.value.hypothesisId);
    assert.equal(committed.value.scenario.causalOrigin?.causalProof, false);
    assert.equal(committed.value.decisionCount, 0);
    assert.equal(committed.value.planCount, 0);
    assert.equal(listManagerDecisions(company.workspaceId, production.value.deckId).length, 0);
    assert.equal(listExecutionPlans(company.workspaceId, production.value.deckId).length, 0);
    const replay = commitCausalScenarioHandoff(base);
    assert.equal(replay.ok, true);
    if (!replay.ok) return;
    assert.equal(replay.value.replayed, true);
    assert.equal(replay.value.scenario.scenarioId, committed.value.scenario.scenarioId);
    assert.equal(listDecisionScenarios(company.workspaceId, production.value.deckId).length, 1);
    const conflict = commitCausalScenarioHandoff({ ...base, scenarioName: "A different scenario" });
    assert.equal(conflict.ok, false);
    if (conflict.ok) return;
    assert.equal(conflict.reason, "operation-conflict");
    assert.equal(getDecisionScenario(company.workspaceId, committed.value.scenario.scenarioId)?.name, base.scenarioName);
    assert.equal(JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId)), beforeObject);
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "ACCEPTED_FOR_SCENARIO");
    const leaked = prepareCausalScenarioHandoff({
      workspaceId: other.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(leaked.ok, false);
    assert.equal(transitionCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      observationId: observation.value.observationId,
      lifecycleStatus: "ARCHIVED",
      now: T0,
    }).ok, true);
    const changed = commitCausalScenarioHandoff({ ...base, operationId: "handoff-2" });
    assert.equal(changed.ok, false);
    if (changed.ok) return;
    assert.equal(changed.reason, "reassessment-required");
    const reading = assessCausalHypothesisReadiness({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(reading.ok, true);
    if (!reading.ok) return;
    const reassessed = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REASSESS_EVIDENCE",
      managerNote: "Acknowledge the archived observation before any further handoff.",
      operationId: "reassess-archived",
      acknowledgeLimitations: true,
      evidenceFingerprint: reading.value.evidenceFingerprint,
      now: T0,
    });
    assert.equal(reassessed.ok, true);
    const archivedGoal = createDecisionGoal({ workspaceId: company.workspaceId, deckId: production.value.deckId, name: "Archived goal", now: T0 });
    assert.equal(archivedGoal.ok, true);
    if (!archivedGoal.ok) return;
    assert.equal(archiveDecisionNode({ workspaceId: company.workspaceId, deckId: production.value.deckId, nodeId: archivedGoal.value.goalId, now: T0 }).ok, true);
    const fresh = prepareCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(fresh.ok, true);
    if (!fresh.ok) return;
    const archivedAttempt = commitCausalScenarioHandoff({
      ...base,
      operationId: "handoff-archived",
      targetGoalId: archivedGoal.value.goalId,
      evidenceFingerprint: fresh.value.evidenceFingerprint,
    });
    assert.equal(archivedAttempt.ok, false);
    if (archivedAttempt.ok) return;
    assert.equal(archivedAttempt.reason, "archived-goal");
    const removedGoal = createDecisionGoal({ workspaceId: company.workspaceId, deckId: production.value.deckId, name: "Removed goal", now: T0 });
    assert.equal(removedGoal.ok, true);
    if (!removedGoal.ok) return;
    assert.equal(deleteDecisionNode({ workspaceId: company.workspaceId, deckId: production.value.deckId, nodeId: removedGoal.value.goalId, now: T0 }).ok, true);
    const deletedAttempt = commitCausalScenarioHandoff({
      ...base,
      operationId: "handoff-deleted",
      targetGoalId: removedGoal.value.goalId,
      evidenceFingerprint: fresh.value.evidenceFingerprint,
    });
    assert.equal(deletedAttempt.ok, false);
    if (deletedAttempt.ok) return;
    assert.equal(deletedAttempt.reason, "deleted-goal");
    const legacy = createDecisionScenario({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Legacy scenario",
      goalId: goal.value.goalId,
      now: T0,
    });
    assert.equal(legacy.ok, true);
    if (!legacy.ok) return;
    assert.equal(legacy.value.causalOrigin, undefined);
    const originalSet = store.setItem.bind(store);
    store.setItem = (key: string, value: string) => {
      if (key.includes("decision-domain")) throw new Error("full");
      originalSet(key, value);
    };
    const blockedWrite = commitCausalScenarioHandoff({
      ...base,
      operationId: "handoff-failed",
      scenarioName: "Failed write scenario",
      evidenceFingerprint: fresh.value.evidenceFingerprint,
    });
    assert.equal(blockedWrite.ok, false);
    if (blockedWrite.ok) return;
    assert.equal(blockedWrite.reason, "storage-failed");
    assert.equal(listDecisionScenarios(company.workspaceId, production.value.deckId).some((scenario) => scenario.name === "Failed write scenario"), false);
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "ACCEPTED_FOR_SCENARIO");
    store.setItem = originalSet;
    const retried = commitCausalScenarioHandoff({
      ...base,
      operationId: "handoff-failed",
      scenarioName: "Failed write scenario",
      evidenceFingerprint: fresh.value.evidenceFingerprint,
    });
    assert.equal(retried.ok, true);
    if (!retried.ok) return;
    assert.equal(retried.value.replayed, false);
    assert.equal(retried.value.decisionCount, 0);
    assert.equal(retried.value.planCount, 0);
    const replayed = commitCausalScenarioHandoff({
      ...base,
      operationId: "handoff-failed",
      scenarioName: "Failed write scenario",
      evidenceFingerprint: fresh.value.evidenceFingerprint,
    });
    assert.equal(replayed.ok, true);
    if (!replayed.ok) return;
    assert.equal(replayed.value.replayed, true);
    assert.equal(listDecisionScenarios(company.workspaceId, production.value.deckId).filter((scenario) => scenario.name === "Failed write scenario").length, 1);
  } finally {
    deleteWorkspace(company.workspaceId);
    deleteWorkspace(other.workspaceId);
  }
});

test("changed evidence keeps the historical review and rejects a new handoff until reassessment", () => {
  const store = setup();
  const company = createManagerWorkspaceFromEntry({ name: "NPA Evidence", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    assert.equal(production.ok, true);
    if (!production.ok) return;
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Capacity reading",
      problemStatement: "The capacity reading may have changed.",
      now: T0,
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const observation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The manager reports 120 units per hour.",
      unit: "units/hour",
      periodLabel: "2026-W45",
      now: T0,
    });
    assert.equal(observation.ok, true);
    if (!observation.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Maintenance may be limiting capacity.",
      observationIds: [observation.value.observationId],
      assumptions: ["The report is the reviewed reading."],
      limitations: ["The report does not prove a cause."],
      evidenceRoles: [{ observationId: observation.value.observationId, role: "SUPPORTING" }],
      now: T0,
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const started = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "Review the reported capacity.",
      operationId: "start-evidence",
      now: T0,
    });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    const accepted = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept the reported capacity for scenario exploration.",
      operationId: "accept-evidence",
      acknowledgeLimitations: true,
      evidenceFingerprint: started.value.readiness.evidenceFingerprint,
      now: T0,
    });
    assert.equal(accepted.ok, true);
    if (!accepted.ok) return;
    const historicalFingerprint = accepted.value.review.evidenceFingerprint;
    const goal = createDecisionGoal({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Inspect capacity",
      now: T0,
    });
    assert.equal(goal.ok, true);
    if (!goal.ok) return;
    const committed = commitCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      targetGoalId: goal.value.goalId,
      scenarioName: "Inspect the reported capacity",
      intervention: "Compare the next reading before acting.",
      assumptions: ["The report is the reviewed reading."],
      limitations: ["The report does not prove a cause."],
      operationId: "handoff-evidence",
      evidenceFingerprint: historicalFingerprint,
      acknowledgeLimitations: true,
      now: T0,
    });
    assert.equal(committed.ok, true);
    if (!committed.ok) return;
    const changed = updateCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      hypothesisId: hypothesis.value.hypothesisId,
      evidenceRoles: [{ observationId: observation.value.observationId, role: "CONFLICTING" }],
      now: T0,
    });
    assert.equal(changed.ok, true);
    const blocked = prepareCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(blocked.ok, false);
    if (blocked.ok) return;
    assert.equal(blocked.reason, "reassessment-required");
    const stale = commitCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      targetGoalId: goal.value.goalId,
      scenarioName: "A second scenario",
      intervention: "This should not be created.",
      assumptions: ["The report is the reviewed reading."],
      limitations: ["The report does not prove a cause."],
      operationId: "handoff-stale",
      evidenceFingerprint: historicalFingerprint,
      acknowledgeLimitations: true,
      now: T0,
    });
    assert.equal(stale.ok, false);
    if (stale.ok) return;
    assert.equal(stale.reason, "reassessment-required");
    assert.equal(listDecisionScenarios(company.workspaceId, production.value.deckId).length, 1);
    assert.equal(getDecisionScenario(company.workspaceId, committed.value.scenario.scenarioId)?.causalOrigin?.evidenceFingerprint, historicalFingerprint);
    const reviews = listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId);
    assert.equal(reviews.find((review) => review.action === "ACCEPT_FOR_SCENARIO")?.evidenceFingerprint, historicalFingerprint);
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "ACCEPTED_FOR_SCENARIO");
    const same = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REASSESS_EVIDENCE",
      managerNote: "The evidence has not been read again.",
      operationId: "reassess-same",
      acknowledgeLimitations: true,
      evidenceFingerprint: historicalFingerprint,
      now: T0,
    });
    assert.equal(same.ok, false);
    const reassessed = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REASSESS_EVIDENCE",
      managerNote: "The role is now conflicting and needs another acknowledgment.",
      operationId: "reassess-current",
      acknowledgeLimitations: true,
      evidenceFingerprint: historicalFingerprint,
      now: T0,
    });
    assert.equal(reassessed.ok, false);
    if (reassessed.ok) return;
    assert.equal(reassessed.reason, "stale-evidence");
    const current = prepareCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(current.ok, false);
    const readiness = started.value.readiness.evidenceFingerprint;
    void readiness;
    const fresh = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REASSESS_EVIDENCE",
      managerNote: "Acknowledge the current conflicting role.",
      operationId: "reassess-fresh",
      acknowledgeLimitations: true,
      now: T0,
    });
    assert.equal(fresh.ok, false);
    const assessed = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "This status cannot start review again.",
      operationId: "start-after-accept",
      now: T0,
    });
    assert.equal(assessed.ok, false);
    const reading = listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId);
    const accept = reading.find((review) => review.reviewId === accepted.value.review.reviewId);
    assert.equal(accept?.evidenceFingerprint, historicalFingerprint);
    assert.equal(accept?.action, "ACCEPT_FOR_SCENARIO");
    const currency = assessScenarioEvidenceCurrency({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      scenarioId: committed.value.scenario.scenarioId,
    });
    assert.equal(currency.historicalFingerprint, historicalFingerprint);
    assert.equal(currency.changedSinceHandoff, true);
    assert.equal(currency.causalProof, false);
    assert.notEqual(currency.currentFingerprint, historicalFingerprint);
    const acknowledged = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REASSESS_EVIDENCE",
      managerNote: "Acknowledge the current conflicting role.",
      operationId: "reassess-acknowledged",
      acknowledgeLimitations: true,
      evidenceFingerprint: currency.currentFingerprint ?? "",
      now: T0,
    });
    assert.equal(acknowledged.ok, true);
    if (!acknowledged.ok) return;
    assert.equal(acknowledged.value.hypothesis.status, "ACCEPTED_FOR_SCENARIO");
    assert.equal(listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId)
      .find((review) => review.action === "ACCEPT_FOR_SCENARIO")?.evidenceFingerprint, historicalFingerprint);
    assert.equal(getDecisionScenario(company.workspaceId, committed.value.scenario.scenarioId)?.causalOrigin?.evidenceFingerprint, historicalFingerprint);
    const eligible = prepareCausalScenarioHandoff({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(eligible.ok, true);
    if (!eligible.ok) return;
    assert.equal(eligible.value.evidenceFingerprint, currency.currentFingerprint);
    assert.equal(eligible.value.reviewId, acknowledged.value.review.reviewId);
    assert.equal(listManagerDecisions(company.workspaceId, production.value.deckId).length, 0);
    assert.equal(listExecutionPlans(company.workspaceId, production.value.deckId).length, 0);
    void store;
  } finally {
    deleteWorkspace(company.workspaceId);
  }
});

test("a waiting handoff rereads a newer decision snapshot instead of reporting an invalid goal", () => {
  const store = setup();
  const company = createManagerWorkspaceFromEntry({ name: "Waiting Handoff", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    assert.equal(production.ok, true);
    if (!production.ok) return;
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Waiting review",
      problemStatement: "Output is short.",
      now: T0,
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A second shift would close the gap.",
      assumptions: ["Demand stays level."],
      limitations: ["This does not prove the cause."],
      now: T0,
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const started = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "Review the claim.",
      operationId: "start-wait",
      now: T0,
    });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    const accepted = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept the recorded claim.",
      operationId: "accept-wait",
      acknowledgeLimitations: true,
      evidenceFingerprint: started.value.readiness.evidenceFingerprint,
      hypothesisStatement: "A second shift would close the gap.",
      now: T0,
    });
    assert.equal(accepted.ok, true);
    const goal = createDecisionGoal({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Raise capacity",
      now: T0,
    });
    assert.equal(goal.ok, true);
    if (!goal.ok) return;
    const base = {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      targetGoalId: goal.value.goalId,
      scenarioName: "Same payload",
      intervention: "Evaluate a second shift.",
      assumptions: ["Demand stays level."],
      limitations: ["This does not prove the cause."],
      operationId: "handoff-wait",
      evidenceFingerprint: started.value.readiness.evidenceFingerprint,
      acknowledgeLimitations: true as const,
      now: T0,
    };
    listDecisionGoals(company.workspaceId, production.value.deckId);
    const before = store.getItem(CANONICAL_DECISION_STORAGE_KEY);
    const committed = commitCausalScenarioHandoff(base);
    assert.equal(committed.ok, true);
    const after = store.getItem(CANONICAL_DECISION_STORAGE_KEY);
    assert.ok(before && after && before !== after);
    resetDecisionDomainForTests(store);
    store.setItem(CANONICAL_DECISION_STORAGE_KEY, before);
    listDecisionGoals(company.workspaceId, production.value.deckId);
    store.setItem(CANONICAL_DECISION_STORAGE_KEY, after);
    const replay = commitCausalScenarioHandoff(base);
    assert.equal(replay.ok, true);
    if (!replay.ok) return;
    assert.equal(replay.value.replayed, true);
    resetDecisionDomainForTests(store);
    store.setItem(CANONICAL_DECISION_STORAGE_KEY, before);
    listDecisionGoals(company.workspaceId, production.value.deckId);
    store.setItem(CANONICAL_DECISION_STORAGE_KEY, after);
    const conflict = commitCausalScenarioHandoff({ ...base, scenarioName: "Different payload" });
    assert.equal(conflict.ok, false);
    if (conflict.ok) return;
    assert.equal(conflict.reason, "operation-conflict");
    assert.equal(listDecisionScenarios(company.workspaceId, production.value.deckId).length, 1);
  } finally {
    if (company) deleteWorkspace(company.workspaceId);
  }
});

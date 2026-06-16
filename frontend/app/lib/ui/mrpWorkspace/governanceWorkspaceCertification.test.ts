/**
 * MRP:5B:6 — Governance workspace certification gate tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  GOVERNANCE_WORKSPACE_CERTIFICATION_VERSION,
  MRP_GOVERNANCE_CERTIFIED_TAG,
  MRP_PHASE5B_COMPLETE_TAG,
} from "./governance/governanceWorkspaceCertificationContract.ts";
import {
  getLastGovernanceWorkspaceCertificationResult,
  resetGovernanceWorkspaceCertificationForTests,
  runGovernanceWorkspaceCertification,
} from "./governance/governanceWorkspaceCertification.ts";
import {
  GOVERNANCE_WORKSPACE_VERSION,
  CANONICAL_GOVERNANCE_WORKSPACE_OWNER,
} from "./governance/governanceWorkspaceContract.ts";

test.beforeEach(() => {
  resetGovernanceWorkspaceCertificationForTests();
});

test("exports governance certification freeze tags and version", () => {
  assert.equal(MRP_GOVERNANCE_CERTIFIED_TAG, "[MRP_GOVERNANCE_CERTIFIED]");
  assert.equal(MRP_PHASE5B_COMPLETE_TAG, "[MRP_PHASE5B_COMPLETE]");
  assert.equal(GOVERNANCE_WORKSPACE_CERTIFICATION_VERSION, "5B.6.0");
  assert.equal(GOVERNANCE_WORKSPACE_VERSION, "5B.6.0");
  assert.equal(CANONICAL_GOVERNANCE_WORKSPACE_OWNER, "GovernanceWorkspace");
});

test("runGovernanceWorkspaceCertification passes all gates and validation checks", () => {
  const result = runGovernanceWorkspaceCertification({ force: true });
  assert.ok(result.verdict === "PASS" || result.verdict === "PASS WITH WARNINGS");
  assert.equal(result.blockers.length, 0);
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.gates.length, 12);
  assert.equal(result.validationChecks.every((check) => check.status === "PASS"), true);
  assert.equal(result.status, "Governance Workspace Frozen");
  assert.deepEqual(result.freezeTags, [
    MRP_GOVERNANCE_CERTIFIED_TAG,
    MRP_PHASE5B_COMPLETE_TAG,
  ]);
});

test("certification result is memoized until forced", () => {
  const first = runGovernanceWorkspaceCertification({ force: true });
  const second = runGovernanceWorkspaceCertification();
  assert.equal(first, second);
  assert.equal(getLastGovernanceWorkspaceCertificationResult(), first);
});

test("validation matrix confirms governance capabilities and blocks", () => {
  const result = runGovernanceWorkspaceCertification({ force: true });
  const policy = result.validationChecks.find((check) => check.id === "policy_review");
  const constraint = result.validationChecks.find((check) => check.id === "constraint_review");
  const approval = result.validationChecks.find((check) => check.id === "approval_chain");
  const authority = result.validationChecks.find((check) => check.id === "authority_review");
  const outcome = result.validationChecks.find((check) => check.id === "governance_outcome");
  const forecast = result.validationChecks.find((check) => check.id === "forecast_generation");
  const scenario = result.validationChecks.find((check) => check.id === "scenario_creation");
  const execute = result.validationChecks.find((check) => check.id === "decision_execution");

  assert.equal(policy?.actual, true);
  assert.equal(constraint?.actual, true);
  assert.equal(approval?.actual, true);
  assert.equal(authority?.actual, true);
  assert.equal(outcome?.actual, true);
  assert.equal(forecast?.actual, false);
  assert.equal(scenario?.actual, false);
  assert.equal(execute?.actual, false);
});

test("Gate L — Rule #14 compliance", () => {
  const result = runGovernanceWorkspaceCertification({ force: true });
  const gateL = result.gates.find((gate) => gate.id === "L");
  assert.equal(gateL?.status, "PASS");
});

test("Gate I J K — ownership boundaries", () => {
  const result = runGovernanceWorkspaceCertification({ force: true });
  assert.equal(result.gates.find((gate) => gate.id === "I")?.status, "PASS");
  assert.equal(result.gates.find((gate) => gate.id === "J")?.status, "PASS");
  assert.equal(result.gates.find((gate) => gate.id === "K")?.status, "PASS");
});

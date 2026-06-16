/**
 * MRP:5A:6 — Advisory workspace certification gate tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_WORKSPACE_CERTIFICATION_VERSION,
  MRP_ADVISORY_CERTIFIED_TAG,
  MRP_PHASE5A_COMPLETE_TAG,
} from "./advisory/advisoryWorkspaceCertificationContract.ts";
import {
  getLastAdvisoryWorkspaceCertificationResult,
  resetAdvisoryWorkspaceCertificationForTests,
  runAdvisoryWorkspaceCertification,
} from "./advisory/advisoryWorkspaceCertification.ts";
import {
  ADVISORY_WORKSPACE_VERSION,
  CANONICAL_ADVISORY_WORKSPACE_OWNER,
} from "./advisory/advisoryWorkspaceContract.ts";

test.beforeEach(() => {
  resetAdvisoryWorkspaceCertificationForTests();
});

test("exports advisory certification freeze tags and version", () => {
  assert.equal(MRP_ADVISORY_CERTIFIED_TAG, "[MRP_ADVISORY_CERTIFIED]");
  assert.equal(MRP_PHASE5A_COMPLETE_TAG, "[MRP_PHASE5A_COMPLETE]");
  assert.equal(ADVISORY_WORKSPACE_CERTIFICATION_VERSION, "5A.6.0");
  assert.equal(ADVISORY_WORKSPACE_VERSION, "5A.6.0");
  assert.equal(CANONICAL_ADVISORY_WORKSPACE_OWNER, "AdvisoryWorkspace");
});

test("runAdvisoryWorkspaceCertification passes all gates and validation checks", () => {
  const result = runAdvisoryWorkspaceCertification({ force: true });
  assert.ok(result.verdict === "PASS" || result.verdict === "PASS WITH WARNINGS");
  assert.equal(result.blockers.length, 0);
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.gates.length, 12);
  assert.equal(result.validationChecks.every((check) => check.status === "PASS"), true);
  assert.deepEqual(result.freezeTags, [
    MRP_ADVISORY_CERTIFIED_TAG,
    MRP_PHASE5A_COMPLETE_TAG,
  ]);
});

test("certification result is memoized until forced", () => {
  const first = runAdvisoryWorkspaceCertification({ force: true });
  const second = runAdvisoryWorkspaceCertification();
  assert.equal(first, second);
  assert.equal(getLastAdvisoryWorkspaceCertificationResult(), first);
});

test("validation matrix confirms advisory capabilities and blocks", () => {
  const result = runAdvisoryWorkspaceCertification({ force: true });
  const creates = result.validationChecks.find((check) => check.id === "creates_recommendations");
  const explains = result.validationChecks.find((check) => check.id === "explains_recommendations");
  const confidence = result.validationChecks.find(
    (check) => check.id === "produces_confidence_analysis"
  );
  const governance = result.validationChecks.find(
    (check) => check.id === "creates_governance_package"
  );
  const executes = result.validationChecks.find((check) => check.id === "executes_decisions");
  const approves = result.validationChecks.find((check) => check.id === "approves_decisions");

  assert.equal(creates?.actual, true);
  assert.equal(explains?.actual, true);
  assert.equal(confidence?.actual, true);
  assert.equal(governance?.actual, true);
  assert.equal(executes?.actual, false);
  assert.equal(approves?.actual, false);
});

test("Gate L — Rule #14 compliance", () => {
  const result = runAdvisoryWorkspaceCertification({ force: true });
  const gateL = result.gates.find((gate) => gate.id === "L");
  assert.equal(gateL?.status, "PASS");
});

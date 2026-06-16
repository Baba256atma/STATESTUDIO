/**
 * MRP:4G — Phase 4 Runtime Certification gate tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE_TAG,
  MRP_PHASE4_CERTIFIED_WORKSPACE_IDS,
  MRP_PHASE4_RUNTIME_CERTIFIED_TAG,
  MRP_PHASE4_RUNTIME_VALIDATION_PATH,
} from "./mrpPhase4RuntimeCertificationContract.ts";
import {
  getLastMrpPhase4RuntimeCertificationResult,
  resetMrpPhase4RuntimeCertificationForTests,
  runMrpPhase4RuntimeCertification,
} from "./mrpPhase4RuntimeCertification.ts";
import {
  MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG,
  MRP_PHASE4_RUNTIME_CERTIFIED_TAG as LOADER_PHASE4_TAG,
} from "./mrpWorkspaceLoaderContract.ts";

test.beforeEach(() => {
  resetMrpPhase4RuntimeCertificationForTests();
});

test("exports Phase 4 runtime certification freeze tags", () => {
  assert.equal(MRP_PHASE4_RUNTIME_CERTIFIED_TAG, "[MRP_PHASE4_RUNTIME_CERTIFIED]");
  assert.equal(
    MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE_TAG,
    "[MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE]"
  );
  assert.equal(LOADER_PHASE4_TAG, "[MRP_PHASE4_RUNTIME_CERTIFIED]");
  assert.equal(
    MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG,
    "[MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED]"
  );
});

test("validation path covers six certified workspaces", () => {
  assert.equal(MRP_PHASE4_CERTIFIED_WORKSPACE_IDS.length, 6);
  assert.equal(MRP_PHASE4_RUNTIME_VALIDATION_PATH.length, 6);
  assert.deepEqual(
    MRP_PHASE4_RUNTIME_VALIDATION_PATH.map((step) => step.step),
    [...MRP_PHASE4_CERTIFIED_WORKSPACE_IDS]
  );
});

test("runMrpPhase4RuntimeCertification passes all gates", () => {
  const result = runMrpPhase4RuntimeCertification({ force: true });
  assert.ok(result.verdict === "PASS" || result.verdict === "PASS WITH WARNINGS");
  assert.equal(result.blockers.length, 0);
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.gates.length, 11);
  assert.equal(result.certifiedWorkspaceCount, 6);
  assert.deepEqual(result.freezeTags, [
    MRP_PHASE4_RUNTIME_CERTIFIED_TAG,
    MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE_TAG,
  ]);
});

test("certification result is memoized until forced", () => {
  const first = runMrpPhase4RuntimeCertification({ force: true });
  const second = runMrpPhase4RuntimeCertification();
  assert.equal(first, second);
  assert.equal(getLastMrpPhase4RuntimeCertificationResult(), first);
});

test("Gate A — workspace routing resolves certified mount targets", () => {
  const result = runMrpPhase4RuntimeCertification({ force: true });
  const gateA = result.gates.find((gate) => gate.id === "A");
  assert.equal(gateA?.status, "PASS");
});

test("Gate F — object panel actions route without focus lock", () => {
  const result = runMrpPhase4RuntimeCertification({ force: true });
  const gateF = result.gates.find((gate) => gate.id === "F");
  assert.equal(gateF?.status, "PASS");
});

test("Gate K — certification freeze tags active", () => {
  const result = runMrpPhase4RuntimeCertification({ force: true });
  const gateK = result.gates.find((gate) => gate.id === "K");
  assert.equal(gateK?.status, "PASS");
});

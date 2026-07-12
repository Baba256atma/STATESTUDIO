import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./engineCertificationIndex.ts";
import { ExecutiveEngineCertificationManifest, ExecutiveEngineCertificationRegistry, ExecutiveEngineCertificationRunner, ExecutiveEngineCertificationSummary, getExecutiveEngineCertificationManifest, getExecutiveEngineCertificationSummary, runExecutiveEngineCertification } from "./engineCertificationIndex.ts";

test("certification registry contains exactly fifteen ordered gates", () => {
  assert.equal(ExecutiveEngineCertificationRegistry.length, 15);
  assert.deepEqual(ExecutiveEngineCertificationRegistry.map((entry) => entry.artifactId), Array.from({ length: 15 }, (_, index) => `ENG-CERT-GATE-${String(index + 1).padStart(3, "0")}`));
  assert.equal(new Set(ExecutiveEngineCertificationRegistry.map((entry) => entry.certificationIdentifier)).size, 15);
  assert.equal(new Set(ExecutiveEngineCertificationRegistry.map((entry) => entry.artifactId)).size, 15);
});
test("all certification gates pass with explicit evidence", () => {
  assert.equal(ExecutiveEngineCertificationRegistry.every((entry) => entry.certificationStatus === "PASS"), true);
  assert.equal(ExecutiveEngineCertificationRegistry.every((entry) => entry.evidenceReference.length > 0), true);
  assert.equal(ExecutiveEngineCertificationSummary.certificationStatus, "Certified");
});
test("manifest, summary, and runner exist and are immutable", () => {
  assert.ok(ExecutiveEngineCertificationManifest);
  assert.ok(ExecutiveEngineCertificationSummary);
  assert.ok(ExecutiveEngineCertificationRunner);
  assert.equal(Object.isFrozen(ExecutiveEngineCertificationManifest), true);
  assert.equal(Object.isFrozen(ExecutiveEngineCertificationSummary), true);
  assert.equal(Object.isFrozen(ExecutiveEngineCertificationRunner), true);
});
test("nested certification metadata is deeply frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveEngineCertificationRegistry), true);
  assert.equal(ExecutiveEngineCertificationRegistry.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(ExecutiveEngineCertificationManifest.certificationCounts), true);
  assert.equal(Object.isFrozen(ExecutiveEngineCertificationManifest.complianceSummaries), true);
});
test("summary counts and compliance are correct", () => {
  assert.equal(ExecutiveEngineCertificationSummary.totalCertificationGates, 15);
  assert.equal(ExecutiveEngineCertificationSummary.passedGates, 15);
  assert.equal(ExecutiveEngineCertificationSummary.failedGates, 0);
  assert.equal(ExecutiveEngineCertificationSummary.compliancePercentage, 100);
  assert.equal(ExecutiveEngineCertificationSummary.ownershipCompliance, "PASS");
  assert.equal(ExecutiveEngineCertificationSummary.dependencyCompliance, "PASS");
  assert.equal(ExecutiveEngineCertificationSummary.antiDuplicationCompliance, "PASS");
  assert.equal(ExecutiveEngineCertificationSummary.releaseReadiness, "ReadyForFreeze");
});
test("helpers and metadata runner are deterministic", () => {
  assert.equal(getExecutiveEngineCertificationManifest(), ExecutiveEngineCertificationManifest);
  assert.equal(getExecutiveEngineCertificationSummary(), ExecutiveEngineCertificationSummary);
  assert.deepEqual(runExecutiveEngineCertification(), runExecutiveEngineCertification());
  assert.equal(Object.isFrozen(runExecutiveEngineCertification()), true);
  assert.equal(runExecutiveEngineCertification().status, "Certified");
});
test("public certification API is runtime-free and targets ENG-1:8", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveEngineCertificationRegistry", "ExecutiveEngineCertificationManifest", "ExecutiveEngineCertificationSummary", "ExecutiveEngineCertificationRunner", "getExecutiveEngineCertificationManifest", "getExecutiveEngineCertificationSummary", "runExecutiveEngineCertification"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /reason|planRequest|orchestrat|route|executeWorkflow|schedule|automate|persist|network|infer|runtimeService|builder|internal|test/i.test(key)), false);
  assert.equal(ExecutiveEngineCertificationRunner.runtimeValidation, false);
  assert.equal(ExecutiveEngineCertificationSummary.nextPhase, "ENG-1:8 — Executive Engine Freeze");
});

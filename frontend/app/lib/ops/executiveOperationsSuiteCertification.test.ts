import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuiteCertificationIndex.ts";
import { ExecutiveOperationsSuiteCertification, ExecutiveOperationsSuiteCertificationManifest, ExecutiveOperationsSuiteCertificationMetadata, ExecutiveOperationsSuiteCertificationNamespace, ExecutiveOperationsSuiteCertificationRegistry, ExecutiveOperationsSuiteCertificationStatus, getExecutiveOperationsSuiteCertification, getExecutiveOperationsSuiteCertificationGateById, getExecutiveOperationsSuiteCertificationManifest, getExecutiveOperationsSuiteCertificationMetadata, getExecutiveOperationsSuiteCertificationRegistry, getExecutiveOperationsSuiteCertificationSummary } from "./executiveOperationsSuiteCertificationIndex.ts";

test("certification object has exactly four immutable sections", () => {
  assert.ok(ExecutiveOperationsSuiteCertification);
  assert.deepEqual(Object.keys(ExecutiveOperationsSuiteCertification), ["metadata", "registry", "manifest", "summary"]);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteCertification), true);
  assert.equal(Object.values(ExecutiveOperationsSuiteCertification).every(Object.isFrozen), true);
});
test("registry contains at least eighteen unique immutable gates", () => {
  assert.equal(ExecutiveOperationsSuiteCertificationRegistry.length >= 18, true);
  assert.equal(new Set(ExecutiveOperationsSuiteCertificationRegistry.map((gate) => gate.id)).size, ExecutiveOperationsSuiteCertificationRegistry.length);
  assert.equal(ExecutiveOperationsSuiteCertificationRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOperationsSuiteCertificationRegistry.every((gate) => gate.status === "Satisfied" && gate.metadataOnly), true);
});
test("summary counts are derived and platform readiness is represented", () => {
  const summary = getExecutiveOperationsSuiteCertificationSummary();
  assert.equal(summary.gateCount, ExecutiveOperationsSuiteCertificationRegistry.length);
  assert.equal(summary.passedGateCount, ExecutiveOperationsSuiteCertificationRegistry.filter((gate) => gate.status === "Satisfied").length);
  assert.equal(summary.certificationStatus, "Ready");
  assert.equal(ExecutiveOperationsSuiteCertificationMetadata.platformReadiness, "ReadyForCertification");
});
test("manifest and metadata are immutable and consistent", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteCertificationManifest), true);
  assert.equal(ExecutiveOperationsSuiteCertificationManifest.gateInventory.totalGates, ExecutiveOperationsSuiteCertificationRegistry.length);
  assert.equal(ExecutiveOperationsSuiteCertificationMetadata.namespace, ExecutiveOperationsSuiteCertificationNamespace);
  assert.equal(ExecutiveOperationsSuiteCertificationStatus.releaseStatus, "Draft");
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteCertificationManifest.certificationPolicy), true);
});
test("exact gate lookup returns entries or undefined", () => {
  assert.equal(getExecutiveOperationsSuiteCertificationGateById("suite-cert-platform")?.category, "platform");
  assert.equal(getExecutiveOperationsSuiteCertificationGateById("SUITE-CERT-PLATFORM"), undefined);
  assert.equal(getExecutiveOperationsSuiteCertificationGateById("unknown"), undefined);
});
test("helper APIs return canonical deterministic frozen objects", () => {
  assert.equal(getExecutiveOperationsSuiteCertification(), ExecutiveOperationsSuiteCertification);
  assert.equal(getExecutiveOperationsSuiteCertificationRegistry(), ExecutiveOperationsSuiteCertificationRegistry);
  assert.equal(getExecutiveOperationsSuiteCertificationManifest(), ExecutiveOperationsSuiteCertificationManifest);
  assert.equal(getExecutiveOperationsSuiteCertificationMetadata(), ExecutiveOperationsSuiteCertificationMetadata);
  assert.deepEqual(getExecutiveOperationsSuiteCertificationSummary(), getExecutiveOperationsSuiteCertificationSummary());
  assert.equal(Object.isFrozen(getExecutiveOperationsSuiteCertificationSummary()), true);
});
test("public API is stable without runtime certification or mutation APIs", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveOperationsSuiteCertification", "ExecutiveOperationsSuiteCertificationRegistry", "ExecutiveOperationsSuiteCertificationManifest", "getExecutiveOperationsSuiteCertificationGateById"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /^(runCertification|certifySuite|approveRelease|executeCertification|registerCertificationGate|updateCertification)$/.test(key)), false);
  assert.equal(keys.some((key) => /internal|test|builder/i.test(key)), false);
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspaceCertification } from "./executiveHomeWorkspaceCertification.ts";

const files = ["executiveHomeWorkspaceCertification.test.ts",
  "executiveHomeWorkspaceCertification.ts",
  "executiveHomeWorkspaceCertificationCriteria.ts",
  "executiveHomeWorkspaceCertificationEvidence.ts",
  "executiveHomeWorkspaceCertificationGates.ts",
  "executiveHomeWorkspaceCertificationReadiness.ts",
  "executiveHomeWorkspaceCertificationResults.ts",
  "executiveHomeWorkspaceCertificationTypes.ts"];

test("WS-2:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:7 has complete unique passing criteria and gates", () => {
  const certification = ExecutiveHomeWorkspaceCertification;
  assert.equal(certification.identity.id, "WS-2:7/ExecutiveHomeWorkspaceCertification");
  assert.deepEqual([certification.criteria.length, certification.gates.length], [28, 20]);
  assert.equal(new Set(certification.criteria.map(({ id }) => id)).size, 28);
  assert.equal(new Set(certification.gates.map(({ id }) => id)).size, 20);
  assert.equal(certification.results.allMandatoryCriteriaPass, true);
  assert.equal(certification.results.allMandatoryGatesPass, true);
});

test("WS-2:7 evidence and inventory are Platform-derived", () => {
  const certification = ExecutiveHomeWorkspaceCertification;
  assert.equal(certification.evidence.source, certification.platform);
  assert.equal(certification.evidence.platformInventory, certification.platform.inventory);
  assert.equal(certification.inventory.platformInventory, certification.platform.inventory);
  assert.equal(certification.certificationStatus, "Certified");
  assert.equal(certification.freezeRecommendation, "ReadyForFreeze");
});

test("WS-2:7 consumes only Platform and contains no runtime certification", () => {
  const certification = ExecutiveHomeWorkspaceCertification;
  const source = readFileSync(new URL("./executiveHomeWorkspaceCertification.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./executiveHomeWorkspaceManifest"), false);
  assert.deepEqual(certification.upstreamDependencies,
    ["WS-2:6 Executive Home Workspace Platform"]);
  assert.equal(certification.runtimeMonitoring, false);
  assert.equal(certification.uiTesting, false);
  assert.equal(certification.readiness.status, "ReadyForFreeze");
});

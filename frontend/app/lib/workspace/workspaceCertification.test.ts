import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WorkspaceCertification } from "./workspaceCertification.ts";
const files = ["workspaceCertification.test.ts", "workspaceCertification.ts",
  "workspaceCertificationCriteria.ts", "workspaceCertificationEvidence.ts",
  "workspaceCertificationGates.ts", "workspaceCertificationReadiness.ts",
  "workspaceCertificationResults.ts", "workspaceCertificationTypes.ts"];
test("WS-1:7 has exactly eight Certification artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url)).filter((file) => files.includes(file)).sort(), files);
});
test("WS-1:7 certifies all mandatory criteria and gates", () => {
  assert.equal(WorkspaceCertification.identity.id, "WS-1:7/WorkspaceCertification");
  assert.deepEqual([WorkspaceCertification.criteria.length, WorkspaceCertification.gates.length], [28, 20]);
  assert.equal(new Set(WorkspaceCertification.criteria.map(({ id }) => id)).size, 28);
  assert.equal(new Set(WorkspaceCertification.gates.map(({ id }) => id)).size, 20);
  assert.equal(WorkspaceCertification.results.allMandatoryCriteriaPass, true);
  assert.equal(WorkspaceCertification.certificationStatus, "Certified");
  assert.equal(WorkspaceCertification.freezeRecommendation, "ReadyForFreeze");
});
test("WS-1:7 consumes only Platform and contains no runtime", () => {
  const source = readFileSync(new URL("./workspaceCertification.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./workspaceManifest"), false);
  assert.equal(WorkspaceCertification.upstreamDependencies.length, 1);
  assert.equal(WorkspaceCertification.runtimeMonitoring, false);
});

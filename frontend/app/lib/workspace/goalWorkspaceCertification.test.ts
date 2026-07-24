import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspaceCertification } from "./goalWorkspaceCertification.ts";
const files = ["goalWorkspaceCertification.test.ts", "goalWorkspaceCertification.ts",
  "goalWorkspaceCertificationCriteria.ts", "goalWorkspaceCertificationGates.ts",
  "goalWorkspaceCertificationGuarantees.ts", "goalWorkspaceCertificationIdentity.ts",
  "goalWorkspaceCertificationReadiness.ts", "goalWorkspaceCertificationResults.ts"];
test("WS-3:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});
test("WS-3:7 publishes complete unique certification metadata", () => {
  const certification = GoalWorkspaceCertification;
  assert.equal(certification.identity.id, "WS-3:7/GoalWorkspaceCertification");
  assert.deepEqual([certification.criteria.length, certification.gates.length,
    certification.results.length, certification.guarantees.length], [16, 16, 4, 12]);
  const records = [certification.criteria, certification.gates,
    certification.results, certification.guarantees].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});
test("WS-3:7 resolves all certification declarations", () => {
  const certification = GoalWorkspaceCertification;
  assert.equal(certification.criteria.every(({ result }) => result === "Pass"), true);
  assert.equal(certification.gates.every(({ result }) => result === "Pass"), true);
  assert.equal(certification.guarantees.every(({ state }) => state === "Satisfied"), true);
  assert.equal(certification.certificationStatus, "Certified");
  assert.equal(certification.certificationResult, "Pass");
  assert.equal(certification.readiness.certificationReadiness, "ReadyForFreeze");
});
test("WS-3:7 consumes only Platform and contains no runtime", () => {
  const source = readFileSync(new URL("./goalWorkspaceCertification.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./goalWorkspaceManifest"), false);
  assert.deepEqual(GoalWorkspaceCertification.upstreamDependencies,
    ["WS-3:6 Goal Workspace Platform"]);
  assert.equal(GoalWorkspaceCertification.runtime, false);
  assert.equal(GoalWorkspaceCertification.ui, false);
});

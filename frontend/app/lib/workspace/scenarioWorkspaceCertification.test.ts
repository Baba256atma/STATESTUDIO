import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ScenarioWorkspaceCertification } from "./scenarioWorkspaceCertification.ts";

const files = [
  "scenarioWorkspaceCertification.test.ts",
  "scenarioWorkspaceCertification.ts",
  "scenarioWorkspaceCertificationCriteria.ts",
  "scenarioWorkspaceCertificationGates.ts",
  "scenarioWorkspaceCertificationGuarantees.ts",
  "scenarioWorkspaceCertificationIdentity.ts",
  "scenarioWorkspaceCertificationReadiness.ts",
  "scenarioWorkspaceCertificationResults.ts",
];

test("WS-5:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-5:7 publishes complete unique certification metadata", () => {
  const certification = ScenarioWorkspaceCertification;
  assert.equal(
    certification.identity.id,
    "WS-5:7/ScenarioWorkspaceCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.workspace.scenario.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.identity.status, "Certification");
  assert.deepEqual(
    [
      certification.criteria.length,
      certification.gates.length,
      certification.results.length,
      certification.guarantees.length,
    ],
    [16, 16, 4, 12],
  );
  const records = [
    certification.criteria,
    certification.gates,
    certification.results,
    certification.guarantees,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-5:7 resolves all certification declarations", () => {
  const certification = ScenarioWorkspaceCertification;
  assert.equal(
    certification.criteria.every(({ result }) => result === "Pass"),
    true,
  );
  assert.equal(
    certification.gates.every(({ result }) => result === "Pass"),
    true,
  );
  assert.equal(
    certification.guarantees.every(({ state }) => state === "Satisfied"),
    true,
  );
  assert.equal(certification.certificationStatus, "Certified");
  assert.equal(certification.certificationResult, "Pass");
  assert.equal(
    certification.readiness.certificationReadiness,
    "ReadyForFreeze",
  );
});

test("WS-5:7 ordering and summary counts are deterministic", () => {
  const certification = ScenarioWorkspaceCertification;
  assert.deepEqual(
    certification.criteria.map(({ order }) => order),
    certification.criteria.map((_, index) => index + 1),
  );
  assert.equal(
    certification.summary.criterionCount,
    certification.criteria.length,
  );
  assert.equal(certification.summary.gateCount, certification.gates.length);
});

test("WS-5:7 consumes only Platform and contains no runtime", () => {
  const certification = ScenarioWorkspaceCertification;
  const source = readFileSync(
    new URL("./scenarioWorkspaceCertification.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./scenarioWorkspaceManifest"), false);
  assert.equal(source.includes("./scenarioWorkspaceValidation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "WS-5:6 Scenario Workspace Platform",
  ]);
  assert.equal(certification.runtime, false);
  assert.equal(certification.simulationEngine, false);
  assert.equal(certification.predictionEngine, false);
  assert.equal(certification.businessLogic, false);
});

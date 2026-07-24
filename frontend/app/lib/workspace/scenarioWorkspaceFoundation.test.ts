import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";

const files = [
  "scenarioWorkspaceBoundaries.ts",
  "scenarioWorkspaceCapabilities.ts",
  "scenarioWorkspaceContracts.ts",
  "scenarioWorkspaceFoundation.test.ts",
  "scenarioWorkspaceFoundation.ts",
  "scenarioWorkspaceIdentity.ts",
  "scenarioWorkspaceLifecycle.ts",
  "scenarioWorkspaceScenarioTypes.ts",
];

test("WS-5:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-5:1 publishes complete immutable Foundation metadata", () => {
  const foundation = ScenarioWorkspaceFoundation;
  assert.equal(foundation.identity.id, "WS-5:1/ScenarioWorkspaceFoundation");
  assert.equal(
    foundation.identity.namespace,
    "nexora.workspace.scenario.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.identity.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.deepEqual(
    [
      foundation.contracts.length,
      foundation.capabilities.length,
      foundation.responsibilities.length,
      foundation.scenarioTypes.length,
      foundation.lifecycle.length,
      foundation.boundaries.length,
    ],
    [12, 12, 10, 12, 8, 15],
  );
  assert.equal(Object.isFrozen(foundation), true);
});

test("WS-5:1 identities are unique and ordering is deterministic", () => {
  const foundation = ScenarioWorkspaceFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.responsibilities,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every((record) => Object.isFrozen(record)), true);
  assert.deepEqual(
    foundation.lifecycle,
    [
      "Draft",
      "UnderReview",
      "UnderAnalysis",
      "Approved",
      "Rejected",
      "Active",
      "Completed",
      "Archived",
    ],
  );
});

test("WS-5:1 has no Workspace or runtime dependency", () => {
  const source = readFileSync(
    new URL("./scenarioWorkspaceFoundation.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(
    imports.every((value) => value.includes("./scenarioWorkspace")),
    true,
  );
  assert.equal(ScenarioWorkspaceFoundation.upstreamDependencies.length, 0);
});

test("WS-5:1 implements no prohibited behavior", () => {
  const foundation = ScenarioWorkspaceFoundation;
  assert.equal(
    foundation.boundaries.every(({ implemented }) => implemented === false),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.simulationEngine, false);
  assert.equal(foundation.predictionEngine, false);
  assert.equal(foundation.scenarioExecution, false);
  assert.equal(foundation.businessLogic, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.ui, false);
});

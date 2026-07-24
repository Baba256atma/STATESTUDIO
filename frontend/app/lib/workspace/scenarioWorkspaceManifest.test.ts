import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ScenarioWorkspaceManifest } from "./scenarioWorkspaceManifest.ts";

const files = [
  "scenarioWorkspaceManifest.test.ts",
  "scenarioWorkspaceManifest.ts",
  "scenarioWorkspaceManifestGuarantees.ts",
  "scenarioWorkspaceManifestIdentity.ts",
  "scenarioWorkspaceManifestInventory.ts",
  "scenarioWorkspaceManifestPublicApi.ts",
  "scenarioWorkspaceManifestReadiness.ts",
  "scenarioWorkspaceManifestSources.ts",
];

test("WS-5:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-5:5 publishes complete ordered sources and inventories", () => {
  const manifest = ScenarioWorkspaceManifest;
  assert.equal(manifest.identity.id, "WS-5:5/ScenarioWorkspaceManifest");
  assert.equal(
    manifest.identity.namespace,
    "nexora.workspace.scenario.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.identity.status, "Manifest");
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.deepEqual(
    manifest.sources.map(({ phaseId }) => phaseId),
    ["WS-5:1", "WS-5:2", "WS-5:3", "WS-5:4"],
  );
  assert.deepEqual(
    [
      manifest.inventory.responsibilities.length,
      manifest.inventory.capabilities.length,
      manifest.inventory.scenarioTypes.length,
      manifest.inventory.lifecycle.length,
      manifest.inventory.contracts.length,
      manifest.inventory.domainModels.length,
      manifest.inventory.relationships.length,
      manifest.inventory.compositions.length,
    ],
    [10, 12, 12, 8, 12, 12, 12, 10],
  );
  assert.equal(manifest.inventory.source, manifest.validation);
});

test("WS-5:5 guarantees, readiness, and API identities are complete", () => {
  const manifest = ScenarioWorkspaceManifest;
  assert.deepEqual(
    [
      manifest.guarantees.length,
      manifest.readinessGates.length,
      manifest.publicApi.length,
    ],
    [15, 12, 8],
  );
  assert.equal(
    manifest.guarantees.every(
      ({ currentState }) => currentState === "Satisfied",
    ),
    true,
  );
  assert.equal(
    manifest.readinessGates.every(({ outcome }) => outcome === "Pass"),
    true,
  );
  assert.equal(new Set(manifest.guarantees.map(({ id }) => id)).size, 15);
  assert.equal(new Set(manifest.publicApi.map(({ id }) => id)).size, 8);
});

test("WS-5:5 consumes only Validation and contains no runtime", () => {
  const manifest = ScenarioWorkspaceManifest;
  const source = readFileSync(
    new URL("./scenarioWorkspaceManifest.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./scenarioWorkspaceModel"), false);
  assert.equal(source.includes("./scenarioWorkspaceRegistry"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "WS-5:4 Scenario Workspace Validation",
  ]);
  assert.equal(manifest.canonicalInventoryRuleSatisfied, true);
  assert.equal(manifest.summary.validationStatus, "Pass");
  assert.equal(manifest.summary.guaranteeStatus, "Satisfied");
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.simulationEngine, false);
  assert.equal(manifest.predictionEngine, false);
});

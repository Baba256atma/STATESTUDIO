import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ScenarioWorkspacePlatform } from "./scenarioWorkspacePlatform.ts";

const files = [
  "scenarioWorkspacePlatform.test.ts",
  "scenarioWorkspacePlatform.ts",
  "scenarioWorkspacePlatformCapabilities.ts",
  "scenarioWorkspacePlatformCompatibility.ts",
  "scenarioWorkspacePlatformComposition.ts",
  "scenarioWorkspacePlatformExtensions.ts",
  "scenarioWorkspacePlatformGuarantees.ts",
  "scenarioWorkspacePlatformIdentity.ts",
];

test("WS-5:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-5:6 publishes complete immutable composition", () => {
  const platform = ScenarioWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-5:6/ScenarioWorkspacePlatform");
  assert.equal(
    platform.identity.namespace,
    "nexora.workspace.scenario.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.identity.status, "Platform");
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.deepEqual(
    [
      platform.capabilities.length,
      platform.guarantees.length,
      platform.compatibility.length,
      platform.extensions.length,
    ],
    [10, 12, 12, 10],
  );
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(
    platform.composition.scenarioTypes,
    platform.manifest.inventory.scenarioTypes,
  );
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-5:6 declarations resolve to approved states", () => {
  const platform = ScenarioWorkspacePlatform;
  assert.equal(
    platform.guarantees.every(
      ({ currentState }) => currentState === "Satisfied",
    ),
    true,
  );
  assert.equal(
    platform.compatibility.every(({ state }) => state === "Compatible"),
    true,
  );
  assert.equal(
    platform.extensions.every(({ state }) => state === "Extensible"),
    true,
  );
  assert.equal(platform.summary.readiness, "ReadyForCertification");
  assert.equal(platform.summary.capabilityCount, platform.capabilities.length);
});

test("WS-5:6 identifiers are unique and ordering is deterministic", () => {
  const platform = ScenarioWorkspacePlatform;
  const records = [
    platform.capabilities,
    platform.guarantees,
    platform.compatibility,
    platform.extensions,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-5:6 consumes only Manifest and contains no runtime", () => {
  const platform = ScenarioWorkspacePlatform;
  const source = readFileSync(
    new URL("./scenarioWorkspacePlatform.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./scenarioWorkspaceValidation"), false);
  assert.equal(source.includes("./scenarioWorkspaceModel"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "WS-5:5 Scenario Workspace Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.simulationEngine, false);
  assert.equal(platform.predictionEngine, false);
  assert.equal(platform.businessLogic, false);
});

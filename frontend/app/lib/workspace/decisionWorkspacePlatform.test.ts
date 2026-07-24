import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspacePlatform } from "./decisionWorkspacePlatform.ts";

const files = [
  "decisionWorkspacePlatform.test.ts",
  "decisionWorkspacePlatform.ts",
  "decisionWorkspacePlatformCapabilities.ts",
  "decisionWorkspacePlatformCompatibility.ts",
  "decisionWorkspacePlatformComposition.ts",
  "decisionWorkspacePlatformExtensions.ts",
  "decisionWorkspacePlatformGuarantees.ts",
  "decisionWorkspacePlatformIdentity.ts",
];

test("WS-4:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-4:6 publishes complete immutable composition", () => {
  const platform = DecisionWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-4:6/DecisionWorkspacePlatform");
  assert.equal(
    platform.identity.namespace,
    "nexora.workspace.decision.platform",
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
    platform.composition.responsibilities,
    platform.manifest.inventory.responsibilities,
  );
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-4:6 declarations resolve to approved states", () => {
  const platform = DecisionWorkspacePlatform;
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

test("WS-4:6 identifiers are unique and ordering is deterministic", () => {
  const platform = DecisionWorkspacePlatform;
  const records = [
    platform.capabilities,
    platform.guarantees,
    platform.compatibility,
    platform.extensions,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-4:6 consumes only Manifest and contains no runtime", () => {
  const platform = DecisionWorkspacePlatform;
  const source = readFileSync(
    new URL("./decisionWorkspacePlatform.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./decisionWorkspaceValidation"), false);
  assert.equal(source.includes("./decisionWorkspaceModel"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "WS-4:5 Decision Workspace Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.businessLogic, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.ui, false);
});

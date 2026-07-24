import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspaceValidation } from "./warRoomWorkspaceValidation.ts";

const files = [
  "warRoomWorkspaceValidation.test.ts",
  "warRoomWorkspaceValidation.ts",
  "warRoomWorkspaceValidationCategories.ts",
  "warRoomWorkspaceValidationGates.ts",
  "warRoomWorkspaceValidationIdentity.ts",
  "warRoomWorkspaceValidationOutcomes.ts",
  "warRoomWorkspaceValidationRules.ts",
  "warRoomWorkspaceValidationTargets.ts",
];

test("WS-8:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-8:4 publishes exactly 48 immutable rules", () => {
  const validation = WarRoomWorkspaceValidation;
  assert.equal(validation.identity.id, "WS-8:4/WarRoomWorkspaceValidation");
  assert.equal(
    validation.identity.namespace,
    "nexora.workspace.war-room.validation",
  );
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(validation.rules.length, 48);
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(new Set(validation.rules.map(({ id }) => id)).size, 48);
});

test("WS-8:4 collections and guarantees are complete", () => {
  const validation = WarRoomWorkspaceValidation;
  assert.deepEqual(
    [
      validation.categories.length, validation.targets.length,
      validation.outcomes.length, validation.gates.length,
      validation.guarantees.length,
    ],
    [16, 16, 4, 10, 8],
  );
  assert.equal(
    validation.gates.every(({ declaredOutcome }) => declaredOutcome === "Pass"),
    true,
  );
});

test("WS-8:4 consumes only Foundation, Registry, and Model", () => {
  const validation = WarRoomWorkspaceValidation;
  const source = readFileSync(
    new URL("./warRoomWorkspaceValidation.ts", import.meta.url), "utf8",
  );
  assert.equal(source.includes("warRoomWorkspaceManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-8:1 War Room Workspace Foundation",
    "WS-8:2 War Room Workspace Registry",
    "WS-8:3 War Room Workspace Model",
  ]);
  assert.equal(validation.executableValidators, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.liveMonitoring, false);
  assert.equal(validation.businessLogic, false);
});

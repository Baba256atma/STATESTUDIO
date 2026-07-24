import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspaceValidation } from "./timelineWorkspaceValidation.ts";

const files = [
  "timelineWorkspaceValidation.test.ts",
  "timelineWorkspaceValidation.ts",
  "timelineWorkspaceValidationCategories.ts",
  "timelineWorkspaceValidationGates.ts",
  "timelineWorkspaceValidationIdentity.ts",
  "timelineWorkspaceValidationOutcomes.ts",
  "timelineWorkspaceValidationRules.ts",
  "timelineWorkspaceValidationTargets.ts",
];

test("WS-10:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:4 publishes exactly 48 immutable rules", () => {
  const validation = TimelineWorkspaceValidation;
  assert.equal(
    validation.identity.id,
    "WS-10:4/TimelineWorkspaceValidation",
  );
  assert.equal(
    validation.identity.namespace,
    "nexora.workspace.timeline.validation",
  );
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(validation.rules.length, 48);
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(new Set(validation.rules.map(({ id }) => id)).size, 48);
});

test("WS-10:4 collections and guarantees are complete", () => {
  const validation = TimelineWorkspaceValidation;
  assert.deepEqual(
    [
      validation.categories.length,
      validation.targets.length,
      validation.outcomes.length,
      validation.gates.length,
      validation.guarantees.length,
    ],
    [16, 16, 4, 10, 8],
  );
  assert.equal(
    validation.gates.every(({ declaredOutcome }) => declaredOutcome === "Pass"),
    true,
  );
});

test("WS-10:4 consumes only Foundation, Registry, and Model", () => {
  const validation = TimelineWorkspaceValidation;
  const source = readFileSync(
    new URL("./timelineWorkspaceValidation.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("timelineWorkspaceManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-10:1 Timeline Workspace Foundation",
    "WS-10:2 Timeline Workspace Registry",
    "WS-10:3 Timeline Workspace Model",
  ]);
  assert.equal(validation.executableValidators, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.timelinePlayback, false);
  assert.equal(validation.businessLogic, false);
});

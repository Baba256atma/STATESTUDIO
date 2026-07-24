import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspaceRegistry } from "./timelineWorkspaceRegistry.ts";

const files = [
  "timelineWorkspaceCapabilityRegistry.ts",
  "timelineWorkspaceGovernanceRegistry.ts",
  "timelineWorkspaceIdentityRegistry.ts",
  "timelineWorkspaceReferenceRegistry.ts",
  "timelineWorkspaceRegistry.test.ts",
  "timelineWorkspaceRegistry.ts",
  "timelineWorkspaceTaxonomyRegistry.ts",
  "timelineWorkspaceTransitionRegistry.ts",
];

test("WS-10:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:2 publishes complete canonical vocabularies", () => {
  const registry = TimelineWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-10:2/TimelineWorkspaceRegistry");
  assert.equal(
    registry.identity.namespace,
    "nexora.workspace.timeline.registry",
  );
  assert.equal(registry.readiness, "ReadyForModel");
  assert.deepEqual(
    [
      registry.eventCategories.length,
      registry.recordTypes.length,
      registry.transitionTypes.length,
      registry.granularities.length,
      registry.statusTypes.length,
      registry.historicalReferenceTypes.length,
      registry.capabilities.length,
      registry.responsibilities.length,
      registry.lifecycle.length,
      registry.boundaries.length,
    ],
    [15, 10, 10, 8, 5, 10, 11, 12, 8, 9],
  );
});

test("WS-10:2 registry identities are globally unique and immutable", () => {
  const registry = TimelineWorkspaceRegistry;
  const records = [
    registry.eventCategories,
    registry.recordTypes,
    registry.transitionTypes,
    registry.granularities,
    registry.statusTypes,
    registry.historicalReferenceTypes,
    registry.capabilities,
    registry.responsibilities,
    registry.lifecycle,
    registry.boundaries,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-10:2 consumes only Foundation and has no prohibited imports", () => {
  const source = readFileSync(
    new URL("./timelineWorkspaceRegistry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("timelineWorkspaceModel"), false);
  assert.deepEqual(TimelineWorkspaceRegistry.upstreamDependencies, [
    "WS-10:1 Timeline Workspace Foundation",
  ]);
});

test("WS-10:2 contains no executable or business behavior", () => {
  const registry = TimelineWorkspaceRegistry;
  assert.equal(registry.runtime, false);
  assert.equal(registry.eventPlayback, false);
  assert.equal(registry.chronologicalProcessing, false);
  assert.equal(registry.workflowExecution, false);
  assert.equal(registry.businessLogic, false);
});

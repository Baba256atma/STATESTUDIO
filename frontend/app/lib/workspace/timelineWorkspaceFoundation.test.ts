import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspaceFoundation } from "./timelineWorkspaceFoundation.ts";

const files = [
  "timelineWorkspaceBoundaries.ts",
  "timelineWorkspaceCapabilities.ts",
  "timelineWorkspaceContracts.ts",
  "timelineWorkspaceFoundation.test.ts",
  "timelineWorkspaceFoundation.ts",
  "timelineWorkspaceIdentity.ts",
  "timelineWorkspaceLifecycle.ts",
  "timelineWorkspaceTerminology.ts",
];

test("WS-10:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:1 publishes complete immutable Foundation metadata", () => {
  const foundation = TimelineWorkspaceFoundation;
  assert.equal(
    foundation.identity.id,
    "WS-10:1/TimelineWorkspaceFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.workspace.timeline.foundation",
  );
  assert.equal(foundation.status, "ReadyForRegistry");
  assert.deepEqual(
    [
      foundation.contracts.length,
      foundation.capabilities.length,
      foundation.responsibilities.length,
      foundation.lifecycle.length,
      foundation.boundaries.length,
    ],
    [12, 11, 12, 8, 9],
  );
  assert.equal(Object.isFrozen(foundation), true);
});

test("WS-10:1 identities and lifecycle ordering are deterministic", () => {
  const foundation = TimelineWorkspaceFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.responsibilities,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.deepEqual(foundation.lifecycle, [
    "Declared",
    "Initialized",
    "Recorded",
    "Organized",
    "Reviewed",
    "Published",
    "ReadyForValidation",
    "Archived",
  ]);
});

test("WS-10:1 has no upstream or prohibited dependency", () => {
  const source = readFileSync(
    new URL("./timelineWorkspaceFoundation.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(
    imports.every((value) => value.includes("./timelineWorkspace")),
    true,
  );
  assert.equal(TimelineWorkspaceFoundation.upstreamDependencies.length, 0);
});

test("WS-10:1 implements no prohibited behavior", () => {
  const foundation = TimelineWorkspaceFoundation;
  assert.equal(
    foundation.boundaries.every(({ implemented }) => !implemented),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.eventPlayback, false);
  assert.equal(foundation.chronologicalProcessing, false);
  assert.equal(foundation.analytics, false);
  assert.equal(foundation.businessLogic, false);
});

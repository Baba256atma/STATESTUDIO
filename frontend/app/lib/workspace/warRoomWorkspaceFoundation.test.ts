import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";

const files = [
  "warRoomWorkspaceBoundaries.ts",
  "warRoomWorkspaceCapabilities.ts",
  "warRoomWorkspaceContracts.ts",
  "warRoomWorkspaceFoundation.test.ts",
  "warRoomWorkspaceFoundation.ts",
  "warRoomWorkspaceIdentity.ts",
  "warRoomWorkspaceLifecycle.ts",
  "warRoomWorkspaceTerminology.ts",
];

test("WS-8:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-8:1 publishes complete immutable Foundation metadata", () => {
  const foundation = WarRoomWorkspaceFoundation;
  assert.equal(foundation.identity.id, "WS-8:1/WarRoomWorkspaceFoundation");
  assert.equal(foundation.identity.phaseId, "WS-8:1");
  assert.equal(
    foundation.identity.namespace,
    "nexora.workspace.war-room.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "ReadyForRegistry");
  assert.deepEqual(
    [
      foundation.contracts.length,
      foundation.capabilities.length,
      foundation.responsibilities.length,
      foundation.lifecycle.length,
      foundation.boundaries.length,
    ],
    [12, 11, 12, 8, 12],
  );
  assert.equal(Object.isFrozen(foundation), true);
});

test("WS-8:1 identities are unique and lifecycle order is deterministic", () => {
  const foundation = WarRoomWorkspaceFoundation;
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
    "Active",
    "Coordinated",
    "Monitored",
    "Reviewed",
    "ReadyForValidation",
    "Archived",
  ]);
});

test("WS-8:1 has no upstream or prohibited dependency", () => {
  const source = readFileSync(
    new URL("./warRoomWorkspaceFoundation.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(
    imports.every((value) => value.includes("./warRoomWorkspace")),
    true,
  );
  assert.equal(WarRoomWorkspaceFoundation.upstreamDependencies.length, 0);
});

test("WS-8:1 implements no prohibited behavior", () => {
  const foundation = WarRoomWorkspaceFoundation;
  assert.equal(
    foundation.boundaries.every(({ implemented }) => !implemented),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.orchestration, false);
  assert.equal(foundation.monitoring, false);
  assert.equal(foundation.alertProcessing, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.businessLogic, false);
});

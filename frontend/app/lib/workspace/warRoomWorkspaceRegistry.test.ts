import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";

const files = [
  "warRoomWorkspaceCapabilityRegistry.ts",
  "warRoomWorkspaceCoordinationRegistry.ts",
  "warRoomWorkspaceEventIncidentRegistry.ts",
  "warRoomWorkspaceGovernanceRegistry.ts",
  "warRoomWorkspaceIdentityRegistry.ts",
  "warRoomWorkspaceRegistry.test.ts",
  "warRoomWorkspaceRegistry.ts",
  "warRoomWorkspaceTaxonomyRegistry.ts",
];

test("WS-8:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-8:2 publishes all canonical War Room registries", () => {
  const registry = WarRoomWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-8:2/WarRoomWorkspaceRegistry");
  assert.equal(
    registry.identity.namespace,
    "nexora.workspace.war-room.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.deepEqual(
    [
      registry.taxonomy.operationalCategories.length,
      registry.taxonomy.operationalStatuses.length,
      registry.taxonomy.alertTypes.length,
      registry.events.length,
      registry.incidents.length,
      registry.coordination.length,
      registry.monitoringDomains.length,
    ],
    [15, 8, 10, 10, 10, 7, 10],
  );
});

test("WS-8:2 identifiers and keys are globally unique", () => {
  const registry = WarRoomWorkspaceRegistry;
  const records = [
    registry.taxonomy.operationalCategories,
    registry.taxonomy.operationalStatuses,
    registry.taxonomy.alertTypes,
    registry.events,
    registry.incidents,
    registry.coordination,
    registry.monitoringDomains,
    registry.capabilities,
    registry.responsibilities,
    registry.lifecycle,
    registry.boundaries,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-8:2 consumes only Foundation and contains no runtime", () => {
  const registry = WarRoomWorkspaceRegistry;
  const source = readFileSync(
    new URL("./warRoomWorkspaceRegistry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("warRoomWorkspaceModel"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "WS-8:1 War Room Workspace Foundation",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.liveMonitoring, false);
  assert.equal(registry.orchestration, false);
  assert.equal(registry.businessLogic, false);
});

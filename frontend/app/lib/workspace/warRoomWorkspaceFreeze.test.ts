import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspaceFreeze } from "./warRoomWorkspaceFreeze.ts";

const files = [
  "warRoomWorkspaceFreeze.test.ts",
  "warRoomWorkspaceFreeze.ts",
  "warRoomWorkspaceFreezeCompatibility.ts",
  "warRoomWorkspaceFreezeGuarantees.ts",
  "warRoomWorkspaceFreezeIdentity.ts",
  "warRoomWorkspaceFreezeLock.ts",
  "warRoomWorkspaceFreezePublicApi.ts",
  "warRoomWorkspaceFrozenBaselines.ts",
];

test("WS-8:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-8:8 publishes its canonical immutable lock", () => {
  const freeze = WarRoomWorkspaceFreeze;
  assert.equal(freeze.identity.id, "WS-8:8/WarRoomWorkspaceFreeze");
  assert.equal(
    freeze.identity.namespace, "nexora.workspace.war-room.freeze",
  );
  assert.equal(freeze.lock.id, "WS-8-WAR-ROOM-WORKSPACE-LOCKED");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(Object.isFrozen(freeze), true);
});

test("WS-8:8 freezes exactly eight baselines and complete chain", () => {
  const freeze = WarRoomWorkspaceFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.deepEqual(freeze.metadata.architectureChain, [
    "Foundation", "Registry", "Model", "Validation", "Manifest",
    "Platform", "Certification", "Freeze",
  ]);
  assert.equal(freeze.baselines[6].source, freeze.certification);
});

test("WS-8:8 publishes deterministic compatibility, guarantees, and APIs", () => {
  const freeze = WarRoomWorkspaceFreeze;
  assert.deepEqual(
    [freeze.compatibility.length, freeze.guarantees.length, freeze.publicApi.length],
    [9, 8, 8],
  );
  assert.equal(new Set(freeze.publicApi.map(({ id }) => id)).size, 8);
  assert.equal(freeze.release, "Released");
  assert.equal(freeze.certificationStatus, "Certified");
  assert.equal(freeze.freezeStatus, "Frozen");
  assert.equal(freeze.stability, "Stable");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("WS-8:8 consumes Certification only and contains no runtime", () => {
  const freeze = WarRoomWorkspaceFreeze;
  const source = readFileSync(
    new URL("./warRoomWorkspaceFreeze.ts", import.meta.url), "utf8",
  );
  assert.equal(source.includes("./warRoomWorkspacePlatform"), false);
  assert.equal(source.includes("./warRoomWorkspaceManifest"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "WS-8:7 War Room Workspace Certification",
  ]);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.liveMonitoring, false);
  assert.equal(freeze.businessLogic, false);
});

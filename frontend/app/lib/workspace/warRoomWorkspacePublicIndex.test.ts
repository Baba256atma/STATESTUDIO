import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./warRoomWorkspacePublicIndex.ts";
import { warRoomWorkspacePublicIndex } from "./warRoomWorkspacePublicIndex.ts";

test("WS-8:9 has exactly two artifacts and twelve public exports", () => {
  const files = [
    "warRoomWorkspacePublicIndex.test.ts",
    "warRoomWorkspacePublicIndex.ts",
  ];
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(warRoomWorkspacePublicIndex.publicExportCount, 12);
});

test("WS-8:9 publishes exactly nine canonical namespace sections", () => {
  assert.deepEqual(
    warRoomWorkspacePublicIndex.namespace.map(({ section }) => section),
    [
      "Identity", "Workspace", "Foundation", "Registry", "Model",
      "Validation", "Platform", "Release", "Consumer",
    ],
  );
  assert.equal(warRoomWorkspacePublicIndex.namespaceCount, 9);
});

test("WS-8:9 publishes canonical identity and release metadata", () => {
  const index = warRoomWorkspacePublicIndex;
  assert.equal(index.identity.id, "WS-8:9/WarRoomWorkspacePublicIndex");
  assert.equal(
    index.identity.namespace,
    "nexora.workspace.war-room.public-index",
  );
  assert.deepEqual(index.releaseStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    readiness: "ReadyForConsumer",
  });
});

test("WS-8:9 preserves Freeze API registry and derives its count", () => {
  const index = warRoomWorkspacePublicIndex;
  assert.equal(index.publicApiRegistry, index.freezeReference.publicApi);
  assert.equal(index.publicApiCount, index.freezeReference.publicApi.length);
  assert.equal(
    new Set(index.publicApiRegistry.map(({ id }) => id)).size,
    index.publicApiRegistry.length,
  );
  assert.equal(Object.isFrozen(index.publicApiRegistry), true);
});

test("WS-8:9 is the immutable sole consumer entry", () => {
  const index = warRoomWorkspacePublicIndex;
  assert.equal(index.consumerEntry.file, "warRoomWorkspacePublicIndex.ts");
  assert.equal(index.soleConsumerEntry, true);
  assert.equal(
    index.platformReference,
    index.freezeReference.certification.platform,
  );
  assert.equal(new Set(index.publicExports).size, 12);
  assert.equal(Object.isFrozen(index), true);
});

test("WS-8:9 imports only Freeze and contains no runtime", () => {
  const index = warRoomWorkspacePublicIndex;
  const source = readFileSync(
    new URL("./warRoomWorkspacePublicIndex.ts", import.meta.url), "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { WarRoomWorkspaceFreeze } from "./warRoomWorkspaceFreeze.ts";',
  ]);
  assert.equal(index.soleDependency, "warRoomWorkspaceFreeze.ts");
  assert.equal(index.runtime, false);
  assert.equal(index.liveMonitoring, false);
  assert.equal(index.businessLogic, false);
});

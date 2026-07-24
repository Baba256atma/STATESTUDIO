import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./timelineWorkspacePublicIndex.ts";
import { timelineWorkspacePublicIndex } from "./timelineWorkspacePublicIndex.ts";

test("WS-10:9 has exactly two artifacts and twelve public exports", () => {
  const files = [
    "timelineWorkspacePublicIndex.test.ts",
    "timelineWorkspacePublicIndex.ts",
  ];
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(timelineWorkspacePublicIndex.publicExportCount, 12);
});

test("WS-10:9 publishes exactly nine canonical namespace sections", () => {
  assert.deepEqual(
    timelineWorkspacePublicIndex.namespace.map(({ section }) => section),
    [
      "Identity",
      "Workspace",
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Platform",
      "Release",
      "Consumer",
    ],
  );
  assert.equal(timelineWorkspacePublicIndex.namespaceCount, 9);
});

test("WS-10:9 publishes canonical identity and release metadata", () => {
  const index = timelineWorkspacePublicIndex;
  assert.equal(index.identity.id, "WS-10:9/TimelineWorkspacePublicIndex");
  assert.equal(
    index.identity.namespace,
    "nexora.workspace.timeline.public-index",
  );
  assert.deepEqual(index.releaseStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    readiness: "ReadyForConsumer",
  });
});

test("WS-10:9 preserves Freeze API registry and derives its count", () => {
  const index = timelineWorkspacePublicIndex;
  assert.equal(index.publicApiRegistry, index.freezeReference.publicApi);
  assert.equal(index.publicApiCount, index.freezeReference.publicApi.length);
  assert.equal(
    new Set(index.publicApiRegistry.map(({ id }) => id)).size,
    index.publicApiRegistry.length,
  );
  assert.equal(Object.isFrozen(index.publicApiRegistry), true);
});

test("WS-10:9 is the immutable sole consumer entry", () => {
  const index = timelineWorkspacePublicIndex;
  assert.equal(index.consumerEntry.file, "timelineWorkspacePublicIndex.ts");
  assert.equal(index.soleConsumerEntry, true);
  assert.equal(
    index.platformReference,
    index.freezeReference.certification.platform,
  );
  assert.equal(new Set(index.publicExports).size, 12);
  assert.equal(Object.isFrozen(index), true);
});

test("WS-10:9 imports only Freeze and contains no runtime", () => {
  const index = timelineWorkspacePublicIndex;
  const source = readFileSync(
    new URL("./timelineWorkspacePublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { TimelineWorkspaceFreeze } from "./timelineWorkspaceFreeze.ts";',
  ]);
  assert.equal(index.soleDependency, "timelineWorkspaceFreeze.ts");
  assert.equal(index.runtime, false);
  assert.equal(index.timelinePlayback, false);
  assert.equal(index.businessLogic, false);
});

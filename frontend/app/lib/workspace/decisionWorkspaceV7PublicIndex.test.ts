import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./decisionWorkspaceV7PublicIndex.ts";
import { decisionWorkspacePublicIndex } from "./decisionWorkspaceV7PublicIndex.ts";

test("WS-7:9 has exactly two collision-safe artifacts and twelve exports", () => {
  const files = [
    "decisionWorkspaceV7PublicIndex.test.ts",
    "decisionWorkspaceV7PublicIndex.ts",
  ];
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(decisionWorkspacePublicIndex.publicExportCount, 12);
});

test("WS-7:9 publishes exactly nine canonical namespace sections", () => {
  assert.deepEqual(
    decisionWorkspacePublicIndex.namespace.map(({ section }) => section),
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
  assert.equal(decisionWorkspacePublicIndex.namespaceCount, 9);
});

test("WS-7:9 publishes canonical identity and release metadata", () => {
  const index = decisionWorkspacePublicIndex;
  assert.equal(index.identity.id, "WS-7:9/DecisionWorkspacePublicIndex");
  assert.equal(
    index.identity.namespace,
    "nexora.workspace.decision.public-index",
  );
  assert.equal(index.identity.version, "1.0.0");
  assert.deepEqual(index.releaseStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    readiness: "ReadyForConsumer",
  });
  assert.equal(index.readiness, "ReadyForConsumer");
});

test("WS-7:9 preserves Freeze API registry and derives its count", () => {
  const index = decisionWorkspacePublicIndex;
  assert.equal(index.publicApiRegistry, index.freezeReference.publicApi);
  assert.equal(index.publicApiCount, index.freezeReference.publicApi.length);
  assert.equal(
    new Set(index.publicApiRegistry.map(({ id }) => id)).size,
    index.publicApiRegistry.length,
  );
  assert.equal(Object.isFrozen(index.publicApiRegistry), true);
});

test("WS-7:9 is the immutable sole WS-7 consumer entry", () => {
  const index = decisionWorkspacePublicIndex;
  assert.equal(index.consumerEntry.file, "decisionWorkspaceV7PublicIndex.ts");
  assert.equal(index.soleConsumerEntry, true);
  assert.equal(
    index.platformReference,
    index.freezeReference.certification.platform,
  );
  assert.equal(new Set(index.publicExports).size, 12);
  assert.equal(Object.isFrozen(index), true);
});

test("WS-7:9 imports only WS-7 Freeze and contains no runtime", () => {
  const index = decisionWorkspacePublicIndex;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7PublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { DecisionWorkspaceV7Freeze } from "./decisionWorkspaceV7Freeze.ts";',
  ]);
  assert.equal(index.soleDependency, "decisionWorkspaceV7Freeze.ts");
  assert.equal(index.runtime, false);
  assert.equal(index.decisionExecution, false);
  assert.equal(index.businessLogic, false);
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./decisionWorkspacePublicIndex.ts";
import { decisionWorkspacePublicIndex } from "./decisionWorkspacePublicIndex.ts";

test("WS-4:9 has exactly two artifacts and twelve public exports", () => {
  const files = [
    "decisionWorkspacePublicIndex.test.ts",
    "decisionWorkspacePublicIndex.ts",
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

test("WS-4:9 publishes nine canonically ordered namespace sections", () => {
  assert.deepEqual(
    decisionWorkspacePublicIndex.namespace.map(({ section }) => section),
    [
      "Identity",
      "Platform",
      "Workspace",
      "Metadata",
      "Public API",
      "Consumer",
      "Release",
      "Compatibility",
      "Readiness",
    ],
  );
  assert.equal(decisionWorkspacePublicIndex.publicNamespaceCount, 9);
});

test("WS-4:9 publishes the canonical identity and release state", () => {
  const index = decisionWorkspacePublicIndex;
  assert.equal(index.identity.id, "WS-4:9/DecisionWorkspacePublicIndex");
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
  assert.equal(index.consumerEntry.file, "decisionWorkspacePublicIndex.ts");
});

test("WS-4:9 preserves the Freeze API registry and derives its count", () => {
  const index = decisionWorkspacePublicIndex;
  const registry = index.publicApiRegistry;
  assert.equal(registry, index.freezeReference.publicApi);
  assert.equal(index.publicApiCount, registry.length);
  assert.equal(new Set(registry.map(({ id }) => id)).size, registry.length);
  assert.deepEqual(
    registry.map(({ order }) => order),
    registry.map((_, position) => position + 1),
  );
  assert.equal(Object.isFrozen(registry), true);
});

test("WS-4:9 derives public export and namespace counts", () => {
  const index = decisionWorkspacePublicIndex;
  assert.equal(index.publicExportCount, index.publicExports.length);
  assert.equal(index.publicNamespaceCount, index.namespace.length);
  assert.equal(
    new Set(index.publicExports).size,
    index.publicExports.length,
  );
});

test("WS-4:9 imports only Freeze and publishes immutable metadata", () => {
  const index = decisionWorkspacePublicIndex;
  const source = readFileSync(
    new URL("./decisionWorkspacePublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { DecisionWorkspaceFreeze } from "./decisionWorkspaceFreeze.ts";',
  ]);
  assert.equal(index.soleDependency, "decisionWorkspaceFreeze.ts");
  assert.equal(index.freezeReference.status, "Frozen");
  assert.equal(Object.isFrozen(index), true);
  assert.equal(Object.isFrozen(index.namespace), true);
  assert.equal(index.runtime, false);
  assert.equal(index.businessLogic, false);
  assert.equal(index.persistence, false);
  assert.equal(index.ui, false);
  assert.equal(index.networking, false);
  assert.equal(index.aiBehavior, false);
});

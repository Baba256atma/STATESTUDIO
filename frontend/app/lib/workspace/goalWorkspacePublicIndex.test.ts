import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./goalWorkspacePublicIndex.ts";
import { goalWorkspacePublicIndex } from "./goalWorkspacePublicIndex.ts";

test("WS-3:9 has exactly two artifacts and twelve public exports", () => {
  const files = [
    "goalWorkspacePublicIndex.test.ts",
    "goalWorkspacePublicIndex.ts",
  ];
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(goalWorkspacePublicIndex.publicExportCount, 12);
});

test("WS-3:9 publishes nine canonically ordered namespace sections", () => {
  assert.deepEqual(
    goalWorkspacePublicIndex.namespace.map(({ section }) => section),
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
  assert.equal(goalWorkspacePublicIndex.publicNamespaceCount, 9);
});

test("WS-3:9 publishes the canonical identity and release state", () => {
  const index = goalWorkspacePublicIndex;
  assert.equal(index.identity.id, "WS-3:9/GoalWorkspacePublicIndex");
  assert.equal(index.identity.namespace, "nexora.workspace.goal.public-index");
  assert.equal(index.identity.version, "1.0.0");
  assert.deepEqual(index.releaseStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    readiness: "ReadyForConsumer",
  });
  assert.equal(index.readiness, "ReadyForConsumer");
  assert.equal(index.consumerEntry.file, "goalWorkspacePublicIndex.ts");
});

test("WS-3:9 preserves the Freeze API registry and derives its count", () => {
  const index = goalWorkspacePublicIndex;
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

test("WS-3:9 imports only Freeze and publishes immutable metadata", () => {
  const source = readFileSync(
    new URL("./goalWorkspacePublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { GoalWorkspaceFreeze } from "./goalWorkspaceFreeze.ts";',
  ]);
  assert.equal(goalWorkspacePublicIndex.soleDependency, "goalWorkspaceFreeze.ts");
  assert.equal(goalWorkspacePublicIndex.freezeReference.status, "Frozen");
  assert.equal(Object.isFrozen(goalWorkspacePublicIndex), true);
  assert.equal(Object.isFrozen(goalWorkspacePublicIndex.namespace), true);
  assert.equal(goalWorkspacePublicIndex.runtime, false);
  assert.equal(goalWorkspacePublicIndex.businessLogic, false);
  assert.equal(goalWorkspacePublicIndex.persistence, false);
  assert.equal(goalWorkspacePublicIndex.ui, false);
  assert.equal(goalWorkspacePublicIndex.networking, false);
  assert.equal(goalWorkspacePublicIndex.aiBehavior, false);
});

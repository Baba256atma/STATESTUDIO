import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./workspacePublicIndex.ts";
import { WorkspacePublicIndex } from "./workspacePublicIndex.ts";

test("WS-1:9 has exactly two Public Index artifacts and twelve exports", () => {
  const files = ["workspacePublicIndex.test.ts", "workspacePublicIndex.ts"];
  assert.deepEqual(readdirSync(new URL(".", import.meta.url)).filter((file) => files.includes(file)).sort(), files);
  assert.equal(Object.keys(publicExports).length, 12);
});

test("WS-1:9 publishes nine ordered Freeze-reachable sections", () => {
  assert.deepEqual(WorkspacePublicIndex.publicNamespace.map(({ section }) => section), [
    "Foundation", "Registry", "Model", "Validation", "Manifest",
    "Platform", "Certification", "Freeze", "Public Index",
  ]);
  assert.equal(WorkspacePublicIndex.publicNamespace.length, 9);
});

test("WS-1:9 publishes canonical release metadata", () => {
  assert.equal(WorkspacePublicIndex.identity.id, "WS-1:9/WorkspacePublicIndex");
  assert.equal(WorkspacePublicIndex.identity.version, "1.0.0");
  assert.deepEqual(WorkspacePublicIndex.status, {
    release: "Released", certification: "Certified", freeze: "Frozen",
    stability: "Stable", readiness: "ReadyForConsumer",
  });
  assert.equal(WorkspacePublicIndex.canonicalLockId, "WS-1-WORKSPACE-FOUNDATION-LOCKED");
  assert.equal(WorkspacePublicIndex.soleConsumerEntry, "workspacePublicIndex.ts");
});

test("WS-1:9 has a unique deterministic dynamically counted API registry", () => {
  const registry = WorkspacePublicIndex.publicApiRegistry;
  assert.equal(new Set(registry.map(({ id }) => id)).size, registry.length);
  assert.equal(new Set(registry.map(({ exportName }) => exportName)).size, registry.length);
  assert.equal(WorkspacePublicIndex.publicApiCount, registry.length);
  assert.equal(Object.isFrozen(registry), true);
});

test("WS-1:9 imports only Freeze and contains no behavior", () => {
  const source = readFileSync(new URL("./workspacePublicIndex.ts", import.meta.url), "utf8");
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, ['import { WorkspaceFreeze } from "./workspaceFreeze.ts";']);
  assert.equal(WorkspacePublicIndex.soleDependency, "workspaceFreeze.ts");
  assert.equal(WorkspacePublicIndex.runtime, false);
  assert.equal(WorkspacePublicIndex.ui, false);
  assert.equal(WorkspacePublicIndex.rendering, false);
  assert.equal(WorkspacePublicIndex.orchestration, false);
});

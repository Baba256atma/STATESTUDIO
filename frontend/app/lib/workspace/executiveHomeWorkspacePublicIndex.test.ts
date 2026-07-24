import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./executiveHomeWorkspacePublicIndex.ts";
import { ExecutiveHomeWorkspacePublicIndex } from "./executiveHomeWorkspacePublicIndex.ts";

test("WS-2:9 has exactly two artifacts and twelve exports", () => {
  const files = ["executiveHomeWorkspacePublicIndex.test.ts",
    "executiveHomeWorkspacePublicIndex.ts"];
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
  assert.equal(Object.keys(publicExports).length, 12);
});

test("WS-2:9 publishes nine deterministically ordered sections", () => {
  assert.deepEqual(ExecutiveHomeWorkspacePublicIndex.publicNamespace.map(
    ({ section }) => section,
  ), ["Foundation", "Registry", "Model", "Validation", "Manifest",
    "Platform", "Certification", "Freeze", "Public Index"]);
  assert.equal(ExecutiveHomeWorkspacePublicIndex.publicNamespace.length, 9);
});

test("WS-2:9 publishes canonical release state", () => {
  const index = ExecutiveHomeWorkspacePublicIndex;
  assert.equal(index.identity.id, "WS-2:9/ExecutiveHomeWorkspacePublicIndex");
  assert.equal(index.version, "1.0.0");
  assert.deepEqual(index.status, {
    release: "Released", certification: "Certified", freeze: "Frozen",
    stability: "Stable", readiness: "ReadyForConsumer",
  });
  assert.equal(index.canonicalLockId, "WS-2-EXECUTIVE-HOME-WORKSPACE-LOCKED");
  assert.equal(index.soleConsumerEntry, "executiveHomeWorkspacePublicIndex.ts");
});

test("WS-2:9 API records are unique and dynamically counted", () => {
  const registry = ExecutiveHomeWorkspacePublicIndex.publicApiRegistry;
  assert.equal(new Set(registry.map(({ id }) => id)).size, registry.length);
  assert.equal(new Set(registry.map(({ exportName }) => exportName)).size, registry.length);
  assert.equal(ExecutiveHomeWorkspacePublicIndex.publicApiCount, registry.length);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(ExecutiveHomeWorkspacePublicIndex), true);
});

test("WS-2:9 imports only Freeze and contains no runtime behavior", () => {
  const index = ExecutiveHomeWorkspacePublicIndex;
  const source = readFileSync(
    new URL("./executiveHomeWorkspacePublicIndex.ts", import.meta.url), "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports,
    ['import { ExecutiveHomeWorkspaceFreeze } from "./executiveHomeWorkspaceFreeze.ts";']);
  assert.equal(index.soleDependency, "executiveHomeWorkspaceFreeze.ts");
  assert.equal(index.runtime, false);
  assert.equal(index.ui, false);
  assert.equal(index.rendering, false);
  assert.equal(index.orchestration, false);
});

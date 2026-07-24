import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

import PublicIndex, * as PublicExports from "./featuresModulesPublicIndex.ts";

test("NEX-3:9 consists of exactly two Public Index files", () => {
  const files = readdirSync(new URL(".", import.meta.url))
    .filter((name) => name.startsWith("featuresModulesPublicIndex"));
  assert.deepEqual(files.sort(), [
    "featuresModulesPublicIndex.test.ts",
    "featuresModulesPublicIndex.ts",
  ]);
});

test("NEX-3:9 exposes exactly twelve exports and nine namespace sections", () => {
  assert.equal(Object.keys(PublicExports).length, 12);
  assert.equal(PublicIndex.publicApiRegistry.length, 12);
  assert.equal(PublicIndex.publicApiCount, 12);
  assert.deepEqual(Object.keys(PublicIndex.namespace), [
    "identity",
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
    "certification",
    "freeze",
  ]);
});

test("NEX-3:9 publishes a unique deterministic immutable API Registry", () => {
  const registry = PublicIndex.publicApiRegistry;
  assert.equal(new Set(registry.map(({ id }) => id)).size, registry.length);
  assert.equal(new Set(registry.map(({ exportName }) => exportName)).size, registry.length);
  assert.deepEqual(registry.map(({ order }) => order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(PublicIndex.namespace), true);
});

test("NEX-3:9 imports only Freeze and is ReadyForConsumer", () => {
  const source = readFileSync(
    new URL("./featuresModulesPublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { FeaturesModulesFreeze } from "./featuresModulesFreeze.ts";',
  ]);
  assert.equal(PublicIndex.identity.namespace, "nexora.nex.features-modules.public-index");
  assert.equal(PublicIndex.consumerEntry.soleSupportedConsumerEntryPoint, true);
  assert.equal(PublicIndex.consumerEntry.freezeOnlyDependency, true);
  assert.equal(PublicIndex.readiness, "ReadyForConsumer");
  assert.equal(PublicIndex.status, "Released · Certified · Frozen · Stable");
  assert.equal(PublicIndex.validationMetadata.length, 10);
  assert.equal(PublicIndex.runtimeExecution, false);
  assert.equal(PublicIndex.featureExecution, false);
  assert.equal(PublicIndex.moduleLoading, false);
  assert.equal(PublicIndex.featureLoading, false);
  assert.equal(PublicIndex.businessLogic, false);
  assert.equal(PublicIndex.persistence, false);
  assert.equal(PublicIndex.networking, false);
  assert.equal(PublicIndex.rendering, false);
  assert.equal(PublicIndex.ui, false);
});

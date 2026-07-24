import assert from "node:assert/strict";
import test from "node:test";

import { ProductVisionStrategyRegistry } from "./productVisionStrategyRegistry.ts";

test("NEX-1:2 publishes sixteen immutable metadata registries", () => {
  assert.equal(ProductVisionStrategyRegistry.identity.id, "NEX-1:2/ProductVisionStrategyRegistry");
  assert.equal(ProductVisionStrategyRegistry.identity.status, "Registry");
  assert.equal(ProductVisionStrategyRegistry.readiness, "ReadyForModel");
  assert.equal(ProductVisionStrategyRegistry.readyForModel, true);
  assert.equal(ProductVisionStrategyRegistry.registryCount, 16);
  assert.equal(Object.keys(ProductVisionStrategyRegistry.registries).length, 16);
  assert.equal(ProductVisionStrategyRegistry.registries.visions.length > 0, true);
  assert.equal(ProductVisionStrategyRegistry.registries.missions.length > 0, true);
  assert.equal(Object.isFrozen(ProductVisionStrategyRegistry), true);
  assert.equal(Object.isFrozen(ProductVisionStrategyRegistry.registries), true);
});

test("NEX-1:2 depends only on NEX-1:1 Foundation", () => {
  assert.equal(ProductVisionStrategyRegistry.dependency.upstreamId, "NEX-1:1/ProductVisionStrategyFoundation");
  assert.equal(ProductVisionStrategyRegistry.dependency.foundationOnly, true);
  assert.equal(ProductVisionStrategyRegistry.dependency.otherDependenciesAllowed, false);
});

test("NEX-1:2 contains required entry metadata and no runtime surfaces", () => {
  for (const entries of Object.values(ProductVisionStrategyRegistry.registries)) {
    for (const entry of entries) {
      assert.ok(entry.identifier);
      assert.ok(entry.canonicalName);
      assert.ok(entry.description);
      assert.ok(entry.category);
      assert.equal(entry.status, "Registered");
      assert.equal(entry.owner, "Nexora Product");
      assert.equal(entry.version, "1.0.0");
      assert.equal(entry.metadataOnly, true);
      assert.equal(entry.immutable, true);
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
  }
  assert.equal(ProductVisionStrategyRegistry.runtimeLogic, false);
  assert.equal(ProductVisionStrategyRegistry.businessLogic, false);
  assert.equal(ProductVisionStrategyRegistry.persistence, false);
  assert.equal(ProductVisionStrategyRegistry.networking, false);
  assert.equal(ProductVisionStrategyRegistry.rendering, false);
  assert.equal(ProductVisionStrategyRegistry.ui, false);
  assert.equal(ProductVisionStrategyRegistry.api, false);
});

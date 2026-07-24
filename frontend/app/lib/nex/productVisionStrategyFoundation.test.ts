import assert from "node:assert/strict";
import test from "node:test";

import { ProductVisionStrategyFoundation } from "./productVisionStrategyFoundation.ts";

test("NEX-1:1 publishes the complete immutable metadata-only Foundation", () => {
  assert.equal(ProductVisionStrategyFoundation.identity.id, "NEX-1:1/ProductVisionStrategyFoundation");
  assert.equal(ProductVisionStrategyFoundation.identity.version, "1.0.0");
  assert.equal(ProductVisionStrategyFoundation.status, "Foundation");
  assert.equal(ProductVisionStrategyFoundation.readiness, "ReadyForRegistry");
  assert.equal(ProductVisionStrategyFoundation.contracts.length, 10);
  assert.equal(ProductVisionStrategyFoundation.validationMetadata.length, 8);
  assert.ok(ProductVisionStrategyFoundation.vision.statement.length > 0);
  assert.ok(ProductVisionStrategyFoundation.mission.statement.length > 0);
  assert.ok(ProductVisionStrategyFoundation.principles.length > 0);
  assert.ok(ProductVisionStrategyFoundation.targetUsers.length > 0);
  assert.ok(ProductVisionStrategyFoundation.goals.length > 0);
  assert.equal(new Set(ProductVisionStrategyFoundation.principles.map(({ id }) => id)).size, ProductVisionStrategyFoundation.principles.length);
  assert.equal(Object.isFrozen(ProductVisionStrategyFoundation), true);
  assert.equal(Object.isFrozen(ProductVisionStrategyFoundation.contracts), true);
  assert.equal(ProductVisionStrategyFoundation.metadataOnly, true);
});

test("NEX-1:1 declares no prohibited implementation surfaces", () => {
  assert.equal(ProductVisionStrategyFoundation.runtimeBehavior, false);
  assert.equal(ProductVisionStrategyFoundation.executableLogic, false);
  assert.equal(ProductVisionStrategyFoundation.ui, false);
  assert.equal(ProductVisionStrategyFoundation.rendering, false);
  assert.equal(ProductVisionStrategyFoundation.networking, false);
  assert.equal(ProductVisionStrategyFoundation.database, false);
  assert.equal(ProductVisionStrategyFoundation.artificialIntelligenceImplementation, false);
  assert.equal(ProductVisionStrategyFoundation.orchestration, false);
  assert.equal(ProductVisionStrategyFoundation.integrations, false);
  assert.equal(ProductVisionStrategyFoundation.sdk, false);
});

import assert from "node:assert/strict";
import test from "node:test";

import * as PublicFoundation from "./productRoadmapFoundation.ts";

test("NEX-2:1 exposes exactly eight public Foundation exports", () => {
  assert.equal(Object.keys(PublicFoundation).length, 8);
  assert.equal(PublicFoundation.ProductRoadmapFoundationPublicApiRegistry.length, 8);
});

test("NEX-2:1 publishes complete immutable Roadmap Foundation metadata", () => {
  const foundation = PublicFoundation.ProductRoadmapFoundation;
  assert.equal(foundation.identity.id, "NEX-2:1/ProductRoadmapFoundation");
  assert.equal(foundation.identity.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(foundation.readyForRegistry, true);
  assert.equal(foundation.domains.length, 16);
  assert.equal(foundation.contracts.length, 10);
  assert.equal(foundation.rules.length, 10);
  assert.equal(foundation.inventory.foundationDomainCount, 16);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(foundation.contracts), true);
});

test("NEX-2:1 has no upstream dependency or executable planning", () => {
  const foundation = PublicFoundation.ProductRoadmapFoundation;
  assert.equal(foundation.dependency.upstreamDependency, "None");
  assert.equal(foundation.dependency.upstreamDependencyCount, 0);
  assert.equal(foundation.runtimeExecution, false);
  assert.equal(foundation.businessLogic, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.networking, false);
  assert.equal(foundation.rendering, false);
  assert.equal(foundation.ui, false);
  assert.equal(foundation.apiImplementation, false);
  assert.equal(foundation.scheduling, false);
  assert.equal(foundation.projectManagementExecution, false);
});

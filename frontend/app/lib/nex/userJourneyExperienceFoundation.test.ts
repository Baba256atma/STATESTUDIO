import assert from "node:assert/strict";
import test from "node:test";

import * as PublicFoundation from "./userJourneyExperienceFoundation.ts";

test("NEX-4:1 exposes exactly eight public Foundation exports", () => {
  assert.equal(Object.keys(PublicFoundation).length, 8);
  assert.equal(PublicFoundation.UserJourneyExperienceFoundationPublicApiRegistry.length, 8);
});

test("NEX-4:1 publishes complete immutable Foundation metadata", () => {
  const foundation = PublicFoundation.UserJourneyExperienceFoundation;
  assert.equal(foundation.identity.id, "NEX-4:1/UserJourneyExperienceFoundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(foundation.readyForRegistry, true);
  assert.equal(foundation.sections.length, 16);
  assert.equal(foundation.contracts.length, 10);
  assert.equal(foundation.rules.length, 10);
  assert.equal(foundation.inventory.foundationSectionCount, 16);
  assert.equal(foundation.inventory.publicApiCount, 8);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(foundation.sections), true);
});

test("NEX-4:1 has no upstream dependency or executable journey", () => {
  const foundation = PublicFoundation.UserJourneyExperienceFoundation;
  assert.equal(foundation.dependency.upstreamDependency, "None");
  assert.equal(foundation.dependency.upstreamDependencyCount, 0);
  assert.equal(foundation.runtimeExecution, false);
  assert.equal(foundation.executableUserJourney, false);
  assert.equal(foundation.uiImplementation, false);
  assert.equal(foundation.workflows, false);
  assert.equal(foundation.navigationLogic, false);
  assert.equal(foundation.businessLogic, false);
  assert.equal(foundation.rendering, false);
  assert.equal(foundation.networking, false);
  assert.equal(foundation.persistence, false);
});

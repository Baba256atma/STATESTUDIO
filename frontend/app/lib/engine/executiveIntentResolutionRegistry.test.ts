import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveIntentResolutionRegistryIndex.ts";
import { ExecutiveIntentResolutionCapabilityRegistry, ExecutiveIntentResolutionDomainRegistry, ExecutiveIntentResolutionIntentRegistry, ExecutiveIntentResolutionRegistryManifest, ExecutiveIntentResolutionRegistryPlatform, getExecutiveIntentResolutionRegistryManifest, getExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";

test("registry platform exists and is deeply immutable", () => {
  assert.ok(ExecutiveIntentResolutionRegistryPlatform);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionRegistryPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionRegistryPlatform.metadata), true);
  assert.equal(Object.values(ExecutiveIntentResolutionRegistryPlatform).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("formalized intent, domain, and capability registries are complete", () => {
  assert.equal(ExecutiveIntentResolutionIntentRegistry.entries.length, 15);
  assert.equal(ExecutiveIntentResolutionDomainRegistry.entries.length, 17);
  assert.equal(ExecutiveIntentResolutionCapabilityRegistry.entries.length, 13);
  assert.equal(ExecutiveIntentResolutionIntentRegistry.entries.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionDomainRegistry.entries.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionCapabilityRegistry.entries.every(Object.isFrozen), true);
});

test("manifest statically publishes all nine registry groups", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionRegistryManifest), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionRegistryManifest.registryGroups), true);
  assert.deepEqual(ExecutiveIntentResolutionRegistryManifest.registryGroups.map(({ group }) => group), ["IntentTypes", "Goals", "BusinessDomains", "Capabilities", "OutputExpectations", "LifecycleStages", "Priorities", "ConfidenceLevels", "Statuses"]);
  assert.deepEqual(ExecutiveIntentResolutionRegistryManifest.registryGroups.map(({ entries }) => entries.length), [15, 5, 17, 13, 10, 7, 4, 4, 7]);
});

test("ownership, compatibility, versioning, and publication metadata is complete", () => {
  assert.equal(ExecutiveIntentResolutionRegistryManifest.ownership, "ENG-3");
  assert.equal(ExecutiveIntentResolutionRegistryManifest.compatibility.foundation, "ENG-3:1");
  assert.equal(ExecutiveIntentResolutionRegistryManifest.compatibility.publicApiOnly, true);
  assert.equal(ExecutiveIntentResolutionRegistryManifest.version, "1.0.0");
  assert.equal(ExecutiveIntentResolutionRegistryManifest.publicationState, "Published");
  assert.equal(ExecutiveIntentResolutionRegistryManifest.metadataOnly, true);
});

test("registry collection and entry identifiers contain no duplicates", () => {
  const groups = ExecutiveIntentResolutionRegistryManifest.registryGroups;
  assert.equal(new Set(groups.map(({ id }) => id)).size, groups.length);
  const entries = groups.flatMap(({ entries }) => entries);
  assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
});

test("helpers return deterministic canonical frozen references", () => {
  assert.equal(getExecutiveIntentResolutionRegistryPlatform(), ExecutiveIntentResolutionRegistryPlatform);
  assert.equal(getExecutiveIntentResolutionRegistryManifest(), ExecutiveIntentResolutionRegistryManifest);
  assert.equal(Object.isFrozen(getExecutiveIntentResolutionRegistryPlatform()), true);
});

test("public index exposes exactly seven approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionIntentRegistry", "ExecutiveIntentResolutionDomainRegistry",
    "ExecutiveIntentResolutionCapabilityRegistry", "ExecutiveIntentResolutionRegistryManifest",
    "ExecutiveIntentResolutionRegistryPlatform", "getExecutiveIntentResolutionRegistryPlatform",
    "getExecutiveIntentResolutionRegistryManifest",
  ].sort());
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligenceCanonicalModel,
  ExecutiveBusinessIntelligenceModelDescription,
  ExecutiveBusinessIntelligenceModelFoundation,
  ExecutiveBusinessIntelligenceModelId,
  ExecutiveBusinessIntelligenceModelMetadata,
  ExecutiveBusinessIntelligenceModelName,
  ExecutiveBusinessIntelligenceModelVersion,
  buildExecutiveBusinessIntelligenceModel,
  getExecutiveBusinessIntelligenceModelCapabilities,
  getExecutiveBusinessIntelligenceModelDependencies,
  getExecutiveBusinessIntelligenceModelDomains,
  getExecutiveBusinessIntelligenceModelNamespaces,
  getExecutiveBusinessIntelligenceModelPlatforms,
  getExecutiveBusinessIntelligenceModelSummary,
} from "./executiveBusinessIntelligenceModelIndex.ts";

test("canonical model builds from registry metadata", () => {
  const built = buildExecutiveBusinessIntelligenceModel();
  assert.equal(ExecutiveBusinessIntelligenceModelId, "BUS-34:3");
  assert.equal(ExecutiveBusinessIntelligenceModelVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessIntelligenceModelName,
    "Executive Business Intelligence Model",
  );
  assert.equal(
    ExecutiveBusinessIntelligenceModelDescription,
    "Canonical metadata-only model layer for executive business intelligence.",
  );
  assert.equal(built.profile.id, "executive-business-intelligence-profile-canonical");
  assert.equal(Object.isFrozen(built), true);
});

test("every capability references a valid domain", () => {
  const domainIds = new Set(
    ExecutiveBusinessIntelligenceCanonicalModel.domains.map((domain) => domain),
  );
  for (const capability of ExecutiveBusinessIntelligenceCanonicalModel.capabilities) {
    assert.equal(domainIds.has(capability.domain), true);
  }
});

test("every platform reference has valid namespace and version metadata", () => {
  for (const platform of ExecutiveBusinessIntelligenceCanonicalModel.platforms) {
    assert.equal(platform.namespace.startsWith("nexora.bus."), true);
    assert.equal(platform.version, "1.0.0");
  }
});

test("every dependency references valid platform ids", () => {
  const platformIds = new Set<string>(
    ExecutiveBusinessIntelligenceCanonicalModel.platforms.map((platform) => platform.id),
  );
  for (const dependency of ExecutiveBusinessIntelligenceCanonicalModel.dependencies) {
    assert.equal(platformIds.has(dependency.source), true);
    assert.equal(platformIds.has(dependency.target), true);
  }
});

test("domain-to-capability and domain-to-platform relationships are valid", () => {
  const capabilityIds = new Set<string>(
    ExecutiveBusinessIntelligenceCanonicalModel.capabilities.map(
      (capability) => capability.id,
    ),
  );
  const platformIds = new Set<string>(
    ExecutiveBusinessIntelligenceCanonicalModel.platforms.map((platform) => platform.id),
  );

  for (const relationship of ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToCapability) {
    for (const capabilityId of relationship.capabilityIds) {
      assert.equal(capabilityIds.has(capabilityId), true);
    }
  }

  for (const relationship of ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToPlatform) {
    for (const platformId of relationship.platformIds) {
      assert.equal(platformIds.has(platformId), true);
    }
  }
});

test("model metadata is immutable and helper APIs are deterministic", () => {
  assert.equal(
    ExecutiveBusinessIntelligenceModelMetadata.registryMetadata.registryId,
    "BUS-34:2",
  );
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceModelMetadata), true);
  assert.equal(
    getExecutiveBusinessIntelligenceModelDomains(),
    ExecutiveBusinessIntelligenceCanonicalModel.domains,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceModelCapabilities(),
    ExecutiveBusinessIntelligenceCanonicalModel.capabilities,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceModelPlatforms(),
    ExecutiveBusinessIntelligenceCanonicalModel.platforms,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceModelNamespaces(),
    ExecutiveBusinessIntelligenceCanonicalModel.namespaces,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceModelDependencies(),
    ExecutiveBusinessIntelligenceCanonicalModel.dependencies,
  );
  assert.equal(ExecutiveBusinessIntelligenceModelFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceModelFoundation), true);
});

test("public exports are correct and no runtime behavior exists", () => {
  const summary = getExecutiveBusinessIntelligenceModelSummary();
  assert.equal(summary.profileId, "executive-business-intelligence-profile-canonical");
  assert.equal(summary.domainCount, 11);
  assert.equal(summary.capabilityCount, 11);
  assert.equal(summary.platformCount, 11);
  assert.equal(summary.relationshipCount, 27);
});

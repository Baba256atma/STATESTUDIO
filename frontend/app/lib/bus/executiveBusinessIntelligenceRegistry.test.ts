import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligenceCapabilityRegistry,
  ExecutiveBusinessIntelligenceDependencyRegistry,
  ExecutiveBusinessIntelligenceDomainRegistry,
  ExecutiveBusinessIntelligenceIntegrationRegistry,
  ExecutiveBusinessIntelligenceNamespaceRegistry,
  ExecutiveBusinessIntelligencePlatformRegistry,
  ExecutiveBusinessIntelligenceRegistryFoundation,
  ExecutiveBusinessIntelligenceRegistryMetadata,
  getExecutiveBusinessIntelligenceCapabilities,
  getExecutiveBusinessIntelligenceCapabilitiesByDomain,
  getExecutiveBusinessIntelligenceDependencies,
  getExecutiveBusinessIntelligenceDependencyMetadata,
  getExecutiveBusinessIntelligenceDomains,
  getExecutiveBusinessIntelligenceNamespaces,
  getExecutiveBusinessIntelligencePlatforms,
  getExecutiveBusinessIntelligencePlatformsByDomain,
} from "./executiveBusinessIntelligenceRegistryIndex.ts";

test("registries build successfully and remain immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceDomainRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceCapabilityRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligencePlatformRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceNamespaceRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceDependencyRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceIntegrationRegistry), true);
});

test("registries preserve deterministic ordering", () => {
  assert.equal(ExecutiveBusinessIntelligenceDomainRegistry[0], "Strategy");
  assert.equal(ExecutiveBusinessIntelligenceDomainRegistry[10], "Reporting");
  assert.equal(
    ExecutiveBusinessIntelligencePlatformRegistry[0].id,
    "executive-business-platform-strategy",
  );
});

test("every capability references a valid domain", () => {
  const domains = new Set(ExecutiveBusinessIntelligenceDomainRegistry);
  for (const capability of ExecutiveBusinessIntelligenceCapabilityRegistry) {
    assert.equal(domains.has(capability.domain), true);
  }

  const financeCapabilities = getExecutiveBusinessIntelligenceCapabilitiesByDomain(
    "Finance",
  );
  assert.equal(financeCapabilities.length, 1);
  assert.equal(financeCapabilities[0].name, "Finance Integration");
});

test("every platform reference has namespace and version metadata", () => {
  for (const platform of ExecutiveBusinessIntelligencePlatformRegistry) {
    assert.equal(platform.namespace.startsWith("nexora.bus."), true);
    assert.equal(platform.version, "1.0.0");
  }

  const reportingPlatforms = getExecutiveBusinessIntelligencePlatformsByDomain("Reporting");
  assert.equal(reportingPlatforms.length, 1);
  assert.equal(reportingPlatforms[0].name, "Executive Reporting Platform");
});

test("every dependency references valid platform ids", () => {
  const platformIds = new Set(
    ExecutiveBusinessIntelligencePlatformRegistry.map((platform) => platform.id),
  );
  for (const dependency of ExecutiveBusinessIntelligenceDependencyRegistry) {
    assert.equal(platformIds.has(dependency.source), true);
    assert.equal(platformIds.has(dependency.target), true);
  }
});

test("helper APIs are deterministic and public exports are correct", () => {
  assert.equal(
    getExecutiveBusinessIntelligenceDomains(),
    ExecutiveBusinessIntelligenceDomainRegistry,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceCapabilities(),
    ExecutiveBusinessIntelligenceCapabilityRegistry,
  );
  assert.equal(
    getExecutiveBusinessIntelligencePlatforms(),
    ExecutiveBusinessIntelligencePlatformRegistry,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceNamespaces(),
    ExecutiveBusinessIntelligenceNamespaceRegistry,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceDependencies(),
    ExecutiveBusinessIntelligenceDependencyRegistry,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceDependencyMetadata(),
    ExecutiveBusinessIntelligenceDependencyRegistry,
  );
  assert.equal(ExecutiveBusinessIntelligenceRegistryFoundation.metadataOnly, true);
  assert.equal(ExecutiveBusinessIntelligenceRegistryMetadata.metadataOnly, true);
});

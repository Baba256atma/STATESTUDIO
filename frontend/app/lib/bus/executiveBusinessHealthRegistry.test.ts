import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthCapabilityRegistry,
  ExecutiveBusinessHealthDimensionRegistry,
  ExecutiveBusinessHealthDomainRegistry,
  ExecutiveBusinessHealthIndicatorRegistry,
  ExecutiveBusinessHealthRegistryFoundation,
  ExecutiveBusinessHealthRegistryMetadata,
  ExecutiveBusinessHealthSeverityRegistry,
  ExecutiveBusinessHealthStatusRegistry,
  ExecutiveBusinessHealthTrendRegistry,
  getExecutiveBusinessHealthCapabilities,
  getExecutiveBusinessHealthCapabilitiesByDimension,
  getExecutiveBusinessHealthDimensions,
  getExecutiveBusinessHealthDomains,
  getExecutiveBusinessHealthIndicators,
  getExecutiveBusinessHealthIndicatorsByDomain,
} from "./executiveBusinessHealthRegistryIndex.ts";

test("registries are immutable and deterministic", () => {
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthDomainRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthDimensionRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthCapabilityRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthIndicatorRegistry), true);
  assert.equal(ExecutiveBusinessHealthDomainRegistry[0].id, "Executive");
  assert.equal(ExecutiveBusinessHealthDomainRegistry[12].id, "Governance");
});

test("domain coverage is complete", () => {
  assert.equal(ExecutiveBusinessHealthDomainRegistry.length, 13);
  assert.equal(ExecutiveBusinessHealthStatusRegistry.length, 5);
  assert.equal(ExecutiveBusinessHealthTrendRegistry.length, 4);
  assert.equal(ExecutiveBusinessHealthSeverityRegistry.length, 5);
});

test("dimension to capability mapping is preserved", () => {
  const dimensions = getExecutiveBusinessHealthDimensions();
  const capabilities = getExecutiveBusinessHealthCapabilitiesByDimension(dimensions[0].id);
  assert.equal(dimensions.length, 6);
  assert.equal(capabilities.length, 1);
  assert.equal(capabilities[0].name, "Strategic Direction");
});

test("capability to indicator and domain mapping is preserved", () => {
  const capabilities = getExecutiveBusinessHealthCapabilities();
  const indicators = getExecutiveBusinessHealthIndicatorsByDomain("Revenue");
  assert.equal(capabilities[1].indicators.length, 2);
  assert.equal(indicators.length, 1);
  assert.equal(indicators[0].name, "Revenue Resilience");
});

test("public foundation and helper exports stay narrow and metadata-only", () => {
  assert.equal(getExecutiveBusinessHealthDomains(), ExecutiveBusinessHealthDomainRegistry);
  assert.equal(getExecutiveBusinessHealthDimensions(), ExecutiveBusinessHealthDimensionRegistry);
  assert.equal(getExecutiveBusinessHealthCapabilities(), ExecutiveBusinessHealthCapabilityRegistry);
  assert.equal(getExecutiveBusinessHealthIndicators(), ExecutiveBusinessHealthIndicatorRegistry);
  assert.equal(ExecutiveBusinessHealthRegistryFoundation.metadataOnly, true);
  assert.equal(ExecutiveBusinessHealthRegistryMetadata.metadataOnly, true);
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_HIERARCHY_REGISTRY,
  EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY,
  EXECUTIVE_ORGANIZATION_REGISTRY,
  EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION,
  EXECUTIVE_ORGANIZATION_UNIT_REGISTRY,
  EXECUTIVE_OWNERSHIP_REGISTRY,
  EXECUTIVE_POSITION_REGISTRY,
  EXECUTIVE_REPORTING_REGISTRY,
  EXECUTIVE_RESPONSIBILITY_REGISTRY,
  EXECUTIVE_ROLE_REGISTRY,
  ExecutiveOrganizationRegistryFoundation,
  ExecutiveOrganizationRegistryPublicFoundation,
} from "./executiveOrganizationRegistryIndex.ts";

test("publishes immutable platform registry", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY.platformId, "BUS-30");
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY.platformStatus, "Published");
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY.platformNamespace,
    "nexora.bus.executive-organization",
  );
  assert.equal(Object.isFrozen(EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY), true);
});

test("publishes registry integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_REGISTRY.organizations.length, 1);
  assert.equal(EXECUTIVE_ORGANIZATION_UNIT_REGISTRY.units.length, 1);
  assert.equal(EXECUTIVE_ROLE_REGISTRY.roles.length, 1);
  assert.equal(EXECUTIVE_POSITION_REGISTRY.positions.length, 1);
  assert.equal(EXECUTIVE_REPORTING_REGISTRY.relationships.length, 1);
  assert.equal(EXECUTIVE_OWNERSHIP_REGISTRY.ownershipEntries.length, 1);
  assert.equal(EXECUTIVE_RESPONSIBILITY_REGISTRY.responsibilities.length, 1);
  assert.equal(EXECUTIVE_HIERARCHY_REGISTRY.hierarchies.length, 1);
});

test("publishes namespace-consistent metadata", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_REGISTRY.metadata.registryNamespace,
    "nexora.bus.executive-organization.registry",
  );
  assert.equal(
    EXECUTIVE_ORGANIZATION_UNIT_REGISTRY.metadata.registryNamespace,
    EXECUTIVE_ORGANIZATION_REGISTRY.metadata.registryNamespace,
  );
  assert.equal(EXECUTIVE_ROLE_REGISTRY.metadata.registryCreatedBy, "BUS-30:2");
});

test("publishes public API completeness", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS.length, 11);
  assert.equal(
    EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS.includes("ExecutiveOrganizationRegistryFoundation"),
    true,
  );
  assert.equal(Object.isFrozen(EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS), true);
});

test("publishes metadata consistency and deterministic exports", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION.validationStatus, "PASS");
  assert.equal(EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION.summary.organizationCount, 1);
  assert.equal(ExecutiveOrganizationRegistryFoundation.validationRegistry, EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION);
  assert.equal(Object.isFrozen(ExecutiveOrganizationRegistryFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveOrganizationRegistryPublicFoundation), true);
});

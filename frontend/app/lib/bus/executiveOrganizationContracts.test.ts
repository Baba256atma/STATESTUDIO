import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY,
  EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
  EXECUTIVE_ORGANIZATION_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_UNIT_TYPES,
  EXECUTIVE_OWNERSHIP_TYPES,
  EXECUTIVE_REPORTING_RELATIONSHIP_TYPES,
  EXECUTIVE_RESPONSIBILITY_CATEGORIES,
  ExecutiveOrganizationContractFoundation,
  ExecutiveOrganizationContracts,
} from "./executiveOrganizationIndex.ts";

test("publishes immutable platform identity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_ID, "BUS-30");
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_NAME, "Executive Organization Intelligence Platform");
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE, "nexora.bus.executive-organization");
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
    "Canonical metadata-only contract foundation for executive organization intelligence.",
  );
  assert.equal(Object.isFrozen(ExecutiveOrganizationContracts), true);
});

test("publishes public API availability", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PUBLIC_APIS.length, 9);
  assert.equal(
    EXECUTIVE_ORGANIZATION_PUBLIC_APIS.includes("ExecutiveOrganizationContractFoundation"),
    true,
  );
  assert.equal(Object.isFrozen(EXECUTIVE_ORGANIZATION_PUBLIC_APIS), true);
});

test("publishes deterministic classification contracts", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_UNIT_TYPES.length, 12);
  assert.equal(EXECUTIVE_REPORTING_RELATIONSHIP_TYPES.length, 6);
  assert.equal(EXECUTIVE_OWNERSHIP_TYPES.length, 8);
  assert.equal(EXECUTIVE_RESPONSIBILITY_CATEGORIES.length, 12);
});

test("publishes namespace-consistent registry", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY.platformNamespace,
    EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  );
  assert.equal(EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY.publicApis, EXECUTIVE_ORGANIZATION_PUBLIC_APIS);
  assert.equal(Object.isFrozen(EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY), true);
});

test("publishes metadata-complete foundation", () => {
  assert.equal(ExecutiveOrganizationContractFoundation.organization.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.organizationUnit.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.executiveRole.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.executivePosition.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.reportingRelationship.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.ownership.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.responsibility.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.hierarchy.metadataOnly, true);
  assert.equal(ExecutiveOrganizationContractFoundation.validation.summary.valid, true);
  assert.equal(Object.isFrozen(ExecutiveOrganizationContractFoundation), true);
});

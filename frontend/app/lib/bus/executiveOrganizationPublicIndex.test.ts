import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
  EXECUTIVE_ORGANIZATION_FREEZE_STATUS,
  EXECUTIVE_ORGANIZATION_PUBLIC_API_ID,
  EXECUTIVE_ORGANIZATION_PUBLIC_API_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PUBLIC_API_REGISTRY,
  EXECUTIVE_ORGANIZATION_PUBLIC_API_STATUS,
  EXECUTIVE_ORGANIZATION_PUBLIC_API_VERSION,
  EXECUTIVE_ORGANIZATION_RELEASE_STATUS,
  EXECUTIVE_ORGANIZATION_INTELLIGENCE_PUBLIC_METADATA,
  ExecutiveOrganizationIntelligencePlatform,
} from "./executiveOrganizationPublicIndex.ts";

test("all BUS-30 phases are publicly exported", () => {
  assert.ok(ExecutiveOrganizationIntelligencePlatform.contracts);
  assert.ok(ExecutiveOrganizationIntelligencePlatform.registry);
  assert.ok(ExecutiveOrganizationIntelligencePlatform.model);
  assert.ok(ExecutiveOrganizationIntelligencePlatform.validation);
  assert.ok(ExecutiveOrganizationIntelligencePlatform.manifest);
  assert.ok(ExecutiveOrganizationIntelligencePlatform.platform);
  assert.ok(ExecutiveOrganizationIntelligencePlatform.certification);
  assert.ok(ExecutiveOrganizationIntelligencePlatform.freeze);
});

test("namespace and public API registry integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PUBLIC_API_ID, "executive-organization-public-api-registry");
  assert.equal(
    EXECUTIVE_ORGANIZATION_PUBLIC_API_NAMESPACE,
    "nexora.bus.executive-organization.public-index",
  );
  assert.equal(EXECUTIVE_ORGANIZATION_PUBLIC_API_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_ORGANIZATION_PUBLIC_API_STATUS, "PUBLIC");
  assert.equal(EXECUTIVE_ORGANIZATION_PUBLIC_API_REGISTRY.exportedPhases.length, 8);
  assert.equal(EXECUTIVE_ORGANIZATION_PUBLIC_API_REGISTRY.exportedNamespaces.length, 8);
});

test("freeze, certification, and platform metadata are present", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_INTELLIGENCE_PUBLIC_METADATA.certificationStatus, "PASS");
  assert.equal(EXECUTIVE_ORGANIZATION_INTELLIGENCE_PUBLIC_METADATA.freezeStatus, "FROZEN");
  assert.equal(EXECUTIVE_ORGANIZATION_INTELLIGENCE_PUBLIC_METADATA.releaseStatus, "RELEASED");
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS, "PASS");
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_STATUS, "FROZEN");
  assert.equal(EXECUTIVE_ORGANIZATION_RELEASE_STATUS, "RELEASED");
});

test("immutable public namespace and deterministic public API", () => {
  assert.equal(Object.isFrozen(ExecutiveOrganizationIntelligencePlatform), true);
  assert.equal(Object.isFrozen(EXECUTIVE_ORGANIZATION_PUBLIC_API_REGISTRY), true);
  assert.equal(Object.isFrozen(EXECUTIVE_ORGANIZATION_INTELLIGENCE_PUBLIC_METADATA), true);
  assert.equal(ExecutiveOrganizationIntelligencePlatform.metadata.metadataOnly, true);
  assert.equal(ExecutiveOrganizationIntelligencePlatform.metadata.immutable, true);
});

test("no runtime behavior is introduced", () => {
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.contracts, "object");
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.registry, "object");
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.model, "object");
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.validation, "object");
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.manifest, "object");
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.platform, "object");
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.certification, "object");
  assert.equal(typeof ExecutiveOrganizationIntelligencePlatform.freeze, "object");
});

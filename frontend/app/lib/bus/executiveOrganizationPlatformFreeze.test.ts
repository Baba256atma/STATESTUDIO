import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_ORGANIZATION_FREEZE_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_FREEZE_FOUNDATION_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_FREEZE_MANIFEST,
  EXECUTIVE_ORGANIZATION_FREEZE_METADATA,
  EXECUTIVE_ORGANIZATION_FREEZE_NAMESPACE,
  EXECUTIVE_ORGANIZATION_FREEZE_POLICY,
  EXECUTIVE_ORGANIZATION_FREEZE_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_FREEZE_REGISTRY,
  EXECUTIVE_ORGANIZATION_FREEZE_STATUS,
  EXECUTIVE_ORGANIZATION_FREEZE_SUMMARY,
  EXECUTIVE_ORGANIZATION_FREEZE_VERSION,
  EXECUTIVE_ORGANIZATION_PLATFORM_FREEZE,
  EXECUTIVE_ORGANIZATION_RELEASE_STATE,
  EXECUTIVE_ORGANIZATION_RELEASE_STATUS,
  ExecutiveOrganizationPlatformFreezeFoundation,
  ExecutiveOrganizationPlatformFreezePublicFoundation,
} from "./executiveOrganizationPlatformFreezeIndex.ts";

test("publishes immutable freeze exports", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_NAMESPACE, "nexora.bus.executive-organization.freeze");
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_STATUS, "FROZEN");
  assert.equal(EXECUTIVE_ORGANIZATION_RELEASE_STATUS, "RELEASED");
  assert.equal(Object.isFrozen(ExecutiveOrganizationPlatformFreezeFoundation), true);
});

test("publishes freeze manifest and registry snapshot integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_MANIFEST.manifestStatus, "Published");
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_REGISTRY.certifiedComponents.length, 7);
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_REGISTRY.dependencySnapshot.length, 5);
});

test("publishes compatibility and freeze policy integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(
    EXECUTIVE_ORGANIZATION_FREEZE_POLICY.policyId,
    "executive-organization-freeze-policy",
  );
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_POLICY.freezeRequirements.length, 6);
});

test("publishes release metadata and aggregate freeze foundation", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_FREEZE.releaseStatus, "RELEASED");
  assert.equal(EXECUTIVE_ORGANIZATION_RELEASE_STATE.releaseStage, "Freeze");
  assert.equal(ExecutiveOrganizationPlatformFreezeFoundation.summary, EXECUTIVE_ORGANIZATION_FREEZE_SUMMARY);
  assert.equal(ExecutiveOrganizationPlatformFreezeFoundation.release, EXECUTIVE_ORGANIZATION_RELEASE_STATE);
});

test("publishes namespace consistency and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_FREEZE_METADATA.freezeNamespace,
    EXECUTIVE_ORGANIZATION_FREEZE_NAMESPACE,
  );
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_PUBLIC_APIS.length, 14);
  assert.equal(EXECUTIVE_ORGANIZATION_FREEZE_FOUNDATION_COMPATIBILITY.platformPublicApiCount > 0, true);
  assert.equal(Object.isFrozen(ExecutiveOrganizationPlatformFreezePublicFoundation), true);
});

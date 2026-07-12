import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_ORGANIZATION_PLATFORM_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_PLATFORM_CONSUMERS,
  EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES,
  EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY,
  EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY,
  EXECUTIVE_ORGANIZATION_PLATFORM_METADATA,
  EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_PLATFORM_SUMMARY,
  ExecutiveOrganizationPlatformFoundation,
  ExecutiveOrganizationPlatformPublicFoundation,
} from "./executiveOrganizationPlatformIndex.ts";

test("publishes immutable exports", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformId, "BUS-30");
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformName,
    "Executive Organization Intelligence Platform",
  );
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformNamespace,
    "nexora.bus.executive-organization",
  );
  assert.equal(Object.isFrozen(ExecutiveOrganizationPlatformFoundation), true);
});

test("publishes platform identity and dependency integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES.length, 5);
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES.every(
      (dependency) => dependency.dependencyStatus === "Available",
    ),
    true,
  );
});

test("publishes compatibility and extension policy integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY.extensionPolicyId,
    "executive-organization-platform-extension-policy",
  );
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY.compatibilityRequirements.includes(
      "metadata-only",
    ),
    true,
  );
});

test("publishes consumer metadata and aggregate platform integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_CONSUMERS.length, 8);
  assert.equal(ExecutiveOrganizationPlatformFoundation.summary, EXECUTIVE_ORGANIZATION_PLATFORM_SUMMARY);
  assert.equal(ExecutiveOrganizationPlatformFoundation.identity, EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY);
  assert.equal(ExecutiveOrganizationPlatformFoundation.metadata, EXECUTIVE_ORGANIZATION_PLATFORM_METADATA);
});

test("publishes namespace consistency and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_METADATA.platformNamespace,
    "nexora.bus.executive-organization.platform",
  );
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS.length, 8);
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_SUMMARY.componentCount, 10);
  assert.equal(Object.isFrozen(ExecutiveOrganizationPlatformPublicFoundation), true);
});

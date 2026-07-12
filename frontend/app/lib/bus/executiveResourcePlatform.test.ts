import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE_PLATFORM_COMPATIBILITY,
  EXECUTIVE_RESOURCE_PLATFORM_CONSUMERS,
  EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES,
  EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY,
  EXECUTIVE_RESOURCE_PLATFORM_IDENTITY,
  EXECUTIVE_RESOURCE_PLATFORM_METADATA,
  EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_PLATFORM_SUMMARY,
  ExecutiveResourcePlatformFoundation,
  ExecutiveResourcePlatformPublicFoundation,
} from "./executiveResourcePlatformIndex.ts";

test("publishes immutable platform exports", () => {
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformId, "BUS-31");
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformName,
    "Executive Resource Intelligence Platform",
  );
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformNamespace,
    "nexora.bus.executive-resource",
  );
  assert.equal(Object.isFrozen(ExecutiveResourcePlatformFoundation), true);
});

test("publishes platform identity and dependency integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES.length, 5);
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES.every(
      (dependency) => dependency.dependencyStatus === "Available",
    ),
    true,
  );
});

test("publishes compatibility and extension policy integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY.extensionPolicyId,
    "executive-resource-platform-extension-policy",
  );
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY.compatibilityRequirements.includes(
      "metadata-only",
    ),
    true,
  );
});

test("publishes consumer metadata and aggregate platform integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_CONSUMERS.length, 10);
  assert.equal(ExecutiveResourcePlatformFoundation.summary, EXECUTIVE_RESOURCE_PLATFORM_SUMMARY);
  assert.equal(
    ExecutiveResourcePlatformFoundation.identity,
    EXECUTIVE_RESOURCE_PLATFORM_IDENTITY,
  );
  assert.equal(
    ExecutiveResourcePlatformFoundation.metadata,
    EXECUTIVE_RESOURCE_PLATFORM_METADATA,
  );
});

test("publishes namespace consistency and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_METADATA.platformNamespace,
    "nexora.bus.executive-resource.platform",
  );
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS.length, 8);
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_SUMMARY.componentCount, 10);
  assert.equal(Object.isFrozen(ExecutiveResourcePlatformPublicFoundation), true);
});

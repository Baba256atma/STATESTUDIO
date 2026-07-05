import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCoreTenantIdentityManifest,
  CORE_TENANT_BOUNDARY,
  CORE_TENANT_CANONICAL_IDENTITY,
  CORE_TENANT_IDENTITY_REGISTRY,
  CoreTenantIdentity,
  validateCoreTenantIdentity,
} from "./coreTenantIdentityIndex.ts";
import type { TenantIdentity } from "./coreTenantIdentityTypes.ts";

test("identity contracts are complete", () => {
  const identity = CORE_TENANT_CANONICAL_IDENTITY;

  assert.equal(identity.tenantId, "tenant-executive-root");
  assert.equal(identity.tenantCode, "TENANT_EXECUTIVE_ROOT");
  assert.equal(identity.classification, "Executive");
  assert.equal(identity.status, "Certified");
  assert.equal(identity.metadata.namespace, "nexora.core.tenant");
  assert.equal(identity.metadata.metadataVersion, "1.0.0");
});

test("public api exists", () => {
  assert.equal(typeof CoreTenantIdentity.buildCoreTenantIdentityManifest, "function");
  assert.equal(typeof CoreTenantIdentity.validateCoreTenantIdentity, "function");
  assert.equal(Object.isFrozen(CoreTenantIdentity), true);
});

test("manifest builds deterministically", () => {
  const first = buildCoreTenantIdentityManifest();
  const second = buildCoreTenantIdentityManifest();

  assert.equal(first.platformId, "CORE-TEN-1");
  assert.equal(first.platformNamespace, "nexora.core.tenant");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(Object.isFrozen(first), true);
});

test("validation succeeds", () => {
  const validation = validateCoreTenantIdentity();

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.errors, []);
});

test("boundary is highest isolation boundary", () => {
  assert.equal(CORE_TENANT_BOUNDARY.highestIsolationBoundary, true);
  assert.equal(CORE_TENANT_BOUNDARY.prohibitsExternalExistence, true);
  assert.equal(CORE_TENANT_BOUNDARY.containedPlatformObjects.includes("Executive Brain"), true);
  assert.equal(CORE_TENANT_BOUNDARY.containedPlatformObjects.includes("Projects"), true);
});

test("registry metadata is immutable and complete", () => {
  assert.equal(CORE_TENANT_IDENTITY_REGISTRY.platformName, "Executive Tenant Identity Foundation");
  assert.equal(CORE_TENANT_IDENTITY_REGISTRY.platformVersion, "1.0.0");
  assert.equal(CORE_TENANT_IDENTITY_REGISTRY.identitySchemaVersion, "1.0.0");
  assert.equal(CORE_TENANT_IDENTITY_REGISTRY.supportedTenantVersions.length, 1);
  assert.equal(Object.isFrozen(CORE_TENANT_IDENTITY_REGISTRY), true);
});

test("duplicate tags are rejected", () => {
  const invalidIdentity: TenantIdentity = Object.freeze({
    ...CORE_TENANT_CANONICAL_IDENTITY,
    metadata: Object.freeze({
      ...CORE_TENANT_CANONICAL_IDENTITY.metadata,
      tags: Object.freeze(["core", "core"]),
    }),
  });

  const validation = validateCoreTenantIdentity(invalidIdentity);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-tag:core"), true);
});

test("invalid namespace is rejected", () => {
  const invalidIdentity = Object.freeze({
    ...CORE_TENANT_CANONICAL_IDENTITY,
    metadata: Object.freeze({
      ...CORE_TENANT_CANONICAL_IDENTITY.metadata,
      namespace: "nexora.invalid.tenant",
    }),
  }) as unknown as TenantIdentity;

  const validation = validateCoreTenantIdentity(invalidIdentity);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-namespace"), true);
});

test("no runtime behavior exists", () => {
  const manifest = buildCoreTenantIdentityManifest();

  assert.equal("authentication" in CoreTenantIdentity, false);
  assert.equal("login" in CoreTenantIdentity, false);
  assert.equal("session" in CoreTenantIdentity, false);
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.immutable, true);
});

import assert from "node:assert/strict";
import test from "node:test";

import { CORE_TENANT_CANONICAL_IDENTITY } from "./coreTenantIdentityIndex.ts";
import {
  buildExecutiveTenantRegistryManifest,
  CORE_TENANT_REGISTRY,
  CORE_TENANT_REGISTRY_ENTRIES,
  CORE_TENANT_REGISTRY_INTEGRITY,
  CORE_TENANT_REGISTRY_METADATA,
  CORE_TENANT_REGISTRY_SNAPSHOT,
  CORE_TENANT_REGISTRY_STATISTICS,
  ExecutiveTenantRegistry,
  validateExecutiveTenantRegistry,
} from "./coreTenantRegistryIndex.ts";
import type { TenantRegistry } from "./coreTenantRegistryTypes.ts";

test("registry contracts complete", () => {
  assert.equal(CORE_TENANT_REGISTRY_METADATA.platformId, "CORE-TEN-2");
  assert.equal(CORE_TENANT_REGISTRY_ENTRIES.length, 1);
  assert.equal(CORE_TENANT_REGISTRY_ENTRIES[0]?.tenantId, CORE_TENANT_CANONICAL_IDENTITY.tenantId);
});

test("manifest builds deterministically", () => {
  const first = buildExecutiveTenantRegistryManifest();
  const second = buildExecutiveTenantRegistryManifest();

  assert.equal(first.platformId, "CORE-TEN-2");
  assert.equal(first.platformNamespace, "nexora.core.tenant.registry");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(Object.isFrozen(first), true);
});

test("validation passes", () => {
  const validation = validateExecutiveTenantRegistry();

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.errors, []);
});

test("registry integrity verified", () => {
  assert.equal(CORE_TENANT_REGISTRY_INTEGRITY.identityReferencesValid, true);
  assert.equal(CORE_TENANT_REGISTRY_INTEGRITY.schemaCompatible, true);
  assert.equal(CORE_TENANT_REGISTRY_INTEGRITY.namespaceUnique, true);
  assert.equal(CORE_TENANT_REGISTRY_INTEGRITY.tenantIdsUnique, true);
});

test("statistics and snapshot are immutable", () => {
  assert.equal(CORE_TENANT_REGISTRY_STATISTICS.registeredTenantCount, 1);
  assert.equal(CORE_TENANT_REGISTRY_SNAPSHOT.entries.length, 1);
  assert.equal(Object.isFrozen(CORE_TENANT_REGISTRY_STATISTICS), true);
  assert.equal(Object.isFrozen(CORE_TENANT_REGISTRY_SNAPSHOT), true);
});

test("public api exists", () => {
  assert.equal(typeof ExecutiveTenantRegistry.buildExecutiveTenantRegistryManifest, "function");
  assert.equal(typeof ExecutiveTenantRegistry.validateExecutiveTenantRegistry, "function");
  assert.equal(Object.isFrozen(ExecutiveTenantRegistry), true);
});

test("duplicate tenant ids are rejected", () => {
  const invalidRegistry: TenantRegistry = Object.freeze({
    ...CORE_TENANT_REGISTRY,
    entries: Object.freeze([
      CORE_TENANT_REGISTRY_ENTRIES[0],
      Object.freeze({
        ...CORE_TENANT_REGISTRY_ENTRIES[0],
        entryId: "tenant-registry-entry-executive-root-duplicate",
      }),
    ]),
  });

  const validation = validateExecutiveTenantRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`duplicate-tenant-id:${CORE_TENANT_CANONICAL_IDENTITY.tenantId}`), true);
});

test("duplicate namespaces are rejected", () => {
  const invalidRegistry: TenantRegistry = Object.freeze({
    ...CORE_TENANT_REGISTRY,
    entries: Object.freeze([
      CORE_TENANT_REGISTRY_ENTRIES[0],
      Object.freeze({
        ...CORE_TENANT_REGISTRY_ENTRIES[0],
        entryId: "tenant-registry-entry-other",
        tenantId: "tenant-other",
      }),
    ]),
  });

  const validation = validateExecutiveTenantRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-namespace:nexora.core.tenant"), true);
});

test("no runtime registration or crud exists", () => {
  assert.equal("register" in ExecutiveTenantRegistry, false);
  assert.equal("add" in ExecutiveTenantRegistry, false);
  assert.equal("remove" in ExecutiveTenantRegistry, false);
  assert.equal("update" in ExecutiveTenantRegistry, false);
});


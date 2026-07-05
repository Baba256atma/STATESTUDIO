import assert from "node:assert/strict";
import test from "node:test";

import {
  CORE_TENANT_CANONICAL_IDENTITY,
} from "./coreTenantIdentityIndex.ts";
import {
  CORE_TENANT_REGISTRY,
} from "./coreTenantRegistryIndex.ts";
import {
  buildExecutiveTenantContextManifest,
  CORE_TENANT_CONTEXT,
  CORE_TENANT_CONTEXT_BINDING,
  CORE_TENANT_CONTEXT_METADATA,
  CORE_TENANT_CONTEXT_SNAPSHOT,
  ExecutiveTenantContext,
  validateExecutiveTenantContext,
} from "./coreTenantContextIndex.ts";
import type { TenantContext } from "./coreTenantContextTypes.ts";

test("context contracts complete", () => {
  assert.equal(CORE_TENANT_CONTEXT.contextId, "tenant-context-executive-root");
  assert.equal(CORE_TENANT_CONTEXT.scope, "Architecture");
  assert.equal(CORE_TENANT_CONTEXT.mode, "ReferenceOnly");
  assert.equal(CORE_TENANT_CONTEXT.source, "ArchitectureBootstrap");
  assert.equal(CORE_TENANT_CONTEXT.status, "Certified");
});

test("context references TEN-1 identity", () => {
  assert.equal(CORE_TENANT_CONTEXT_BINDING.tenantIdentityReference.tenantId, CORE_TENANT_CANONICAL_IDENTITY.tenantId);
  assert.equal(CORE_TENANT_CONTEXT_BINDING.contextBoundary.boundaryId, CORE_TENANT_CANONICAL_IDENTITY.boundary.boundaryId);
});

test("context references TEN-2 registry", () => {
  assert.equal(CORE_TENANT_CONTEXT_BINDING.tenantRegistryReference.metadata.registryId, CORE_TENANT_REGISTRY.metadata.registryId);
  assert.equal(CORE_TENANT_CONTEXT_BINDING.tenantRegistryEntryReference.tenantId, CORE_TENANT_CANONICAL_IDENTITY.tenantId);
});

test("manifest builds deterministically", () => {
  const first = buildExecutiveTenantContextManifest();
  const second = buildExecutiveTenantContextManifest();

  assert.equal(first.platformId, "CORE-TEN-3");
  assert.equal(first.platformNamespace, "nexora.core.tenant.context");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(Object.isFrozen(first), true);
});

test("validation passes", () => {
  const validation = validateExecutiveTenantContext();

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.errors, []);
});

test("context verification and compatibility are complete", () => {
  assert.deepEqual(CORE_TENANT_CONTEXT_METADATA.compatibility, ["CORE-TEN-1", "CORE-TEN-2"]);
  assert.equal(CORE_TENANT_CONTEXT_SNAPSHOT.registryVersion, "1.0.0");
  assert.equal(CORE_TENANT_CONTEXT_SNAPSHOT.boundaryId, "core-tenant-boundary");
});

test("boundary verification confirms metadata-only context", () => {
  assert.equal(CORE_TENANT_CONTEXT_BINDING.contextBoundary.highestIsolationBoundary, true);
  assert.equal(CORE_TENANT_CONTEXT_METADATA.metadataOnly, true);
  assert.equal(CORE_TENANT_CONTEXT_METADATA.immutable, true);
});

test("invalid tenant reference is rejected", () => {
  const invalidContext: TenantContext = Object.freeze({
    ...CORE_TENANT_CONTEXT,
    binding: Object.freeze({
      ...CORE_TENANT_CONTEXT.binding,
      currentTenantReference: "tenant-missing",
    }),
  });

  const validation = validateExecutiveTenantContext(invalidContext);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("missing-tenant-reference"), true);
});

test("no runtime switching or session state exists", () => {
  assert.equal("switch" in ExecutiveTenantContext, false);
  assert.equal("activate" in ExecutiveTenantContext, false);
  assert.equal("session" in ExecutiveTenantContext, false);
  assert.equal("persist" in ExecutiveTenantContext, false);
  assert.equal(Object.isFrozen(ExecutiveTenantContext), true);
});


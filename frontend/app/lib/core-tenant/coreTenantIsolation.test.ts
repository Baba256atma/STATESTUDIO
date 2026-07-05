import assert from "node:assert/strict";
import test from "node:test";

import { CORE_TENANT_CANONICAL_IDENTITY } from "./coreTenantIdentityIndex.ts";
import { CORE_TENANT_REGISTRY } from "./coreTenantRegistryIndex.ts";
import { CORE_TENANT_CONTEXT } from "./coreTenantContextIndex.ts";
import {
  buildExecutiveTenantIsolationManifest,
  CORE_TENANT_ISOLATION,
  CORE_TENANT_ISOLATION_BOUNDARY,
  CORE_TENANT_ISOLATION_DOMAINS,
  CORE_TENANT_ISOLATION_GUARANTEES,
  CORE_TENANT_ISOLATION_RISKS,
  CORE_TENANT_ISOLATION_RULES,
  ExecutiveTenantIsolation,
  validateExecutiveTenantIsolation,
} from "./coreTenantIsolationIndex.ts";
import type { TenantIsolationContract } from "./coreTenantIsolationTypes.ts";

test("isolation contracts complete", () => {
  assert.equal(CORE_TENANT_ISOLATION_BOUNDARY.boundaryId, "core-tenant-isolation-boundary");
  assert.equal(CORE_TENANT_ISOLATION_RULES.length, 14);
  assert.equal(CORE_TENANT_ISOLATION_GUARANTEES.length, 14);
  assert.equal(CORE_TENANT_ISOLATION_RISKS.length, 14);
});

test("isolation references TEN-1 identity", () => {
  assert.equal(CORE_TENANT_ISOLATION.identityReference.tenantId, CORE_TENANT_CANONICAL_IDENTITY.tenantId);
});

test("isolation references TEN-2 registry", () => {
  assert.equal(CORE_TENANT_ISOLATION.registryReference.metadata.registryId, CORE_TENANT_REGISTRY.metadata.registryId);
});

test("isolation references TEN-3 context", () => {
  assert.equal(CORE_TENANT_ISOLATION.contextReference.contextId, CORE_TENANT_CONTEXT.contextId);
});

test("all isolation domains described", () => {
  assert.equal(CORE_TENANT_ISOLATION_DOMAINS.length, 14);
  assert.equal(CORE_TENANT_ISOLATION_DOMAINS.includes("Identity"), true);
  assert.equal(CORE_TENANT_ISOLATION_DOMAINS.includes("Governance"), true);
});

test("manifest builds and validation passes", () => {
  const first = buildExecutiveTenantIsolationManifest();
  const second = buildExecutiveTenantIsolationManifest();
  const validation = validateExecutiveTenantIsolation();

  assert.equal(first.platformId, "CORE-TEN-4");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(validation.valid, true);
  assert.deepEqual(validation.errors, []);
});

test("boundary verification confirms no runtime enforcement", () => {
  assert.equal(CORE_TENANT_ISOLATION_BOUNDARY.runtimeEnforcementIncluded, false);
  assert.equal(CORE_TENANT_ISOLATION.rules.every((rule) => !rule.runtimeEnforcement), true);
  assert.equal(CORE_TENANT_ISOLATION.rules.every((rule) => !rule.permissionsRequired), true);
  assert.equal(CORE_TENANT_ISOLATION.rules.every((rule) => !rule.authenticationRequired), true);
});

test("invalid runtime enforcement field is rejected", () => {
  const invalidIsolation = Object.freeze({
    ...CORE_TENANT_ISOLATION,
    rules: Object.freeze([
      Object.freeze({
        ...CORE_TENANT_ISOLATION.rules[0],
        runtimeEnforcement: true,
      }),
      ...CORE_TENANT_ISOLATION.rules.slice(1),
    ]),
  }) as unknown as TenantIsolationContract;

  const validation = validateExecutiveTenantIsolation(invalidIsolation);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`runtime-enforcement-not-allowed:${CORE_TENANT_ISOLATION.rules[0].ruleId}`), true);
});

test("no runtime enforcement or permissions apis exist", () => {
  assert.equal("enforce" in ExecutiveTenantIsolation, false);
  assert.equal("permission" in ExecutiveTenantIsolation, false);
  assert.equal("authenticate" in ExecutiveTenantIsolation, false);
  assert.equal("persist" in ExecutiveTenantIsolation, false);
  assert.equal(Object.isFrozen(ExecutiveTenantIsolation), true);
});

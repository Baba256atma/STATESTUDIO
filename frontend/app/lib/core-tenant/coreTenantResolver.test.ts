import assert from "node:assert/strict";
import test from "node:test";

import { CORE_TENANT_CANONICAL_IDENTITY } from "./coreTenantIdentityIndex.ts";
import { CORE_TENANT_REGISTRY } from "./coreTenantRegistryIndex.ts";
import { CORE_TENANT_CONTEXT } from "./coreTenantContextIndex.ts";
import { CORE_TENANT_ISOLATION } from "./coreTenantIsolationIndex.ts";
import {
  buildExecutiveTenantResolverManifest,
  CORE_TENANT_RESOLVER,
  CORE_TENANT_RESOLVER_COMPATIBILITY,
  CORE_TENANT_RESOLVER_DOMAINS,
  CORE_TENANT_RESOLVER_GUARANTEES,
  CORE_TENANT_RESOLVER_INPUTS,
  CORE_TENANT_RESOLVER_OUTPUTS,
  CORE_TENANT_RESOLVER_RULES,
  ExecutiveTenantResolver,
  validateExecutiveTenantResolver,
} from "./coreTenantResolverIndex.ts";
import type { TenantResolverContract } from "./coreTenantResolverTypes.ts";

test("resolver contracts complete", () => {
  assert.equal(CORE_TENANT_RESOLVER_DOMAINS.length, 15);
  assert.equal(CORE_TENANT_RESOLVER_INPUTS.length, 15);
  assert.equal(CORE_TENANT_RESOLVER_OUTPUTS.length, 15);
  assert.equal(CORE_TENANT_RESOLVER_RULES.length, 15);
  assert.equal(CORE_TENANT_RESOLVER_GUARANTEES.length, 15);
});

test("resolver references TEN-1 identity", () => {
  assert.equal(CORE_TENANT_RESOLVER.identityReference.tenantId, CORE_TENANT_CANONICAL_IDENTITY.tenantId);
});

test("resolver references TEN-2 registry", () => {
  assert.equal(CORE_TENANT_RESOLVER.registryReference.metadata.registryId, CORE_TENANT_REGISTRY.metadata.registryId);
});

test("resolver references TEN-3 context", () => {
  assert.equal(CORE_TENANT_RESOLVER.contextReference.contextId, CORE_TENANT_CONTEXT.contextId);
});

test("resolver references TEN-4 isolation", () => {
  assert.equal(CORE_TENANT_RESOLVER.isolationReference.boundary.boundaryId, CORE_TENANT_ISOLATION.boundary.boundaryId);
});

test("all resolver domains described", () => {
  assert.equal(CORE_TENANT_RESOLVER_DOMAINS.includes("Isolation"), true);
  assert.equal(CORE_TENANT_RESOLVER_DOMAINS.includes("Governance"), true);
});

test("manifest builds and validation passes", () => {
  const first = buildExecutiveTenantResolverManifest();
  const second = buildExecutiveTenantResolverManifest();
  const validation = validateExecutiveTenantResolver();

  assert.equal(first.platformId, "CORE-TEN-5");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(validation.valid, true);
  assert.deepEqual(validation.errors, []);
});

test("boundary verification confirms no runtime resolving", () => {
  assert.deepEqual(CORE_TENANT_RESOLVER_COMPATIBILITY.supportedContracts, ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4"]);
  assert.equal(CORE_TENANT_RESOLVER.rules.every((rule) => !rule.runtimeResolving), true);
  assert.equal(CORE_TENANT_RESOLVER.rules.every((rule) => !rule.tenantSwitching), true);
  assert.equal(CORE_TENANT_RESOLVER.rules.every((rule) => !rule.authenticationRequired), true);
});

test("invalid runtime resolving field is rejected", () => {
  const invalidResolver = Object.freeze({
    ...CORE_TENANT_RESOLVER,
    rules: Object.freeze([
      Object.freeze({
        ...CORE_TENANT_RESOLVER.rules[0],
        runtimeResolving: true,
      }),
      ...CORE_TENANT_RESOLVER.rules.slice(1),
    ]),
  }) as unknown as TenantResolverContract;

  const validation = validateExecutiveTenantResolver(invalidResolver);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`runtime-resolving-not-allowed:${CORE_TENANT_RESOLVER.rules[0].ruleId}`), true);
});

test("no runtime resolving or tenant switching apis exist", () => {
  assert.equal("resolve" in ExecutiveTenantResolver, false);
  assert.equal("switch" in ExecutiveTenantResolver, false);
  assert.equal("authenticate" in ExecutiveTenantResolver, false);
  assert.equal("persist" in ExecutiveTenantResolver, false);
  assert.equal(Object.isFrozen(ExecutiveTenantResolver), true);
});


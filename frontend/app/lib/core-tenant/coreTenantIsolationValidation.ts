import { validateCoreTenantIdentity } from "./coreTenantIdentityIndex.ts";
import { CORE_TENANT_ISOLATION } from "./coreTenantIsolation.ts";
import { buildExecutiveTenantIsolationManifest } from "./coreTenantIsolationManifest.ts";
import { validateExecutiveTenantRegistry } from "./coreTenantRegistryIndex.ts";
import { validateExecutiveTenantContext } from "./coreTenantContextIndex.ts";
import type {
  TenantIsolationContract,
  TenantIsolationManifest,
  TenantIsolationValidationResult,
} from "./coreTenantIsolationTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[]): TenantIsolationValidationResult {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([]),
  });
}

function validateIsolation(isolation: TenantIsolationContract): readonly string[] {
  const errors: string[] = [];

  if (isolation.identityReference.tenantId !== isolation.contextReference.binding.currentTenantReference) {
    errors.push("identity-context-incompatible");
  }
  if (isolation.registryReference.metadata.registryId !== isolation.contextReference.binding.tenantRegistryReference.metadata.registryId) {
    errors.push("registry-context-incompatible");
  }
  if (isolation.identityReference.tenantId !== isolation.registryReference.entries[0]?.tenantId) {
    errors.push("identity-registry-incompatible");
  }
  if (isolation.boundary.boundaryId !== isolation.snapshot.boundaryId) errors.push("boundary-incomplete");
  if (isolation.domains.length !== 14) errors.push("domain-coverage-incomplete");
  if (isolation.rules.length !== isolation.domains.length) errors.push("rule-completeness-failed");
  if (isolation.guarantees.length !== isolation.domains.length) errors.push("guarantee-completeness-failed");
  if (isolation.risks.length !== isolation.domains.length) errors.push("risk-coverage-incomplete");
  if (isolation.metadata.namespace !== "nexora.core.tenant.isolation") errors.push("invalid-isolation-namespace");
  if (isolation.metadata.metadataVersion !== "1.0.0") errors.push("invalid-isolation-metadata-version");

  for (const rule of isolation.rules) {
    if (rule.runtimeEnforcement) errors.push(`runtime-enforcement-not-allowed:${rule.ruleId}`);
    if (rule.permissionsRequired) errors.push(`permissions-not-allowed:${rule.ruleId}`);
    if (rule.authenticationRequired) errors.push(`authentication-not-allowed:${rule.ruleId}`);
    if (rule.persistenceRequired) errors.push(`persistence-not-allowed:${rule.ruleId}`);
  }

  for (const guarantee of isolation.guarantees) {
    if (guarantee.consistentWithRuleIds.length === 0) {
      errors.push(`guarantee-without-rule:${guarantee.guaranteeId}`);
    }
  }

  errors.push(
    ...duplicateValues(isolation.domains).map((value) => `duplicate-domain:${value}`),
    ...duplicateValues(isolation.rules.map((rule) => rule.ruleId)).map((value) => `duplicate-rule:${value}`),
    ...duplicateValues(isolation.guarantees.map((guarantee) => guarantee.guaranteeId)).map((value) => `duplicate-guarantee:${value}`),
    ...duplicateValues(isolation.risks.map((risk) => risk.riskId)).map((value) => `duplicate-risk:${value}`)
  );

  return Object.freeze(errors);
}

function validateManifest(manifest: TenantIsolationManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "CORE-TEN-4") errors.push("invalid-manifest-platform-id");
  if (manifest.platformName !== "Executive Tenant Isolation Contract") errors.push("invalid-manifest-platform-name");
  if (manifest.platformVersion !== "1.0.0") errors.push("invalid-manifest-platform-version");
  if (manifest.platformNamespace !== "nexora.core.tenant.isolation") errors.push("invalid-manifest-namespace");
  if (!manifest.deterministicFingerprint) errors.push("missing-deterministic-fingerprint");
  if (!manifest.metadataOnly) errors.push("manifest-not-metadata-only");
  if (!manifest.immutable) errors.push("manifest-not-immutable");

  return Object.freeze(errors);
}

export function validateExecutiveTenantIsolation(
  isolation: TenantIsolationContract = CORE_TENANT_ISOLATION,
  manifest: TenantIsolationManifest = buildExecutiveTenantIsolationManifest()
): TenantIsolationValidationResult {
  const identityValidation = validateCoreTenantIdentity();
  const registryValidation = validateExecutiveTenantRegistry();
  const contextValidation = validateExecutiveTenantContext();
  const errors = Object.freeze([
    ...(identityValidation.valid ? [] : identityValidation.errors.map((error) => `tenant-identity:${error}`)),
    ...(registryValidation.valid ? [] : registryValidation.errors.map((error) => `tenant-registry:${error}`)),
    ...(contextValidation.valid ? [] : contextValidation.errors.map((error) => `tenant-context:${error}`)),
    ...validateIsolation(isolation),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}


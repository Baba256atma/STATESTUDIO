import { validateCoreTenantIdentity } from "./coreTenantIdentityIndex.ts";
import { validateExecutiveTenantRegistry } from "./coreTenantRegistryIndex.ts";
import { validateExecutiveTenantContext } from "./coreTenantContextIndex.ts";
import { validateExecutiveTenantIsolation } from "./coreTenantIsolationIndex.ts";
import { CORE_TENANT_RESOLVER } from "./coreTenantResolver.ts";
import { buildExecutiveTenantResolverManifest } from "./coreTenantResolverManifest.ts";
import type {
  TenantResolverContract,
  TenantResolverManifest,
  TenantResolverValidationResult,
} from "./coreTenantResolverTypes.ts";

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

function result(errors: readonly string[]): TenantResolverValidationResult {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([]),
  });
}

function validateResolver(resolver: TenantResolverContract): readonly string[] {
  const errors: string[] = [];

  if (resolver.identityReference.tenantId !== resolver.contextReference.binding.currentTenantReference) {
    errors.push("identity-context-incompatible");
  }
  if (resolver.registryReference.metadata.registryId !== resolver.contextReference.binding.tenantRegistryReference.metadata.registryId) {
    errors.push("registry-context-incompatible");
  }
  if (resolver.isolationReference.boundary.boundaryId !== resolver.snapshot.tenantIsolationReference) {
    errors.push("isolation-snapshot-incompatible");
  }
  if (resolver.domains.length !== 15) errors.push("resolver-domain-coverage-incomplete");
  if (resolver.inputs.length !== resolver.domains.length) errors.push("input-reference-completeness-failed");
  if (resolver.outputs.length !== resolver.domains.length) errors.push("output-reference-completeness-failed");
  if (resolver.rules.length !== resolver.domains.length) errors.push("rule-completeness-failed");
  if (resolver.guarantees.length !== resolver.domains.length) errors.push("guarantee-completeness-failed");
  if (resolver.compatibility.supportedContracts.length !== 4) errors.push("resolver-compatibility-incomplete");
  if (resolver.metadata.namespace !== "nexora.core.tenant.resolver") errors.push("invalid-resolver-namespace");
  if (resolver.metadata.metadataVersion !== "1.0.0") errors.push("invalid-resolver-metadata-version");

  for (const rule of resolver.rules) {
    if (rule.runtimeResolving) errors.push(`runtime-resolving-not-allowed:${rule.ruleId}`);
    if (rule.tenantSwitching) errors.push(`tenant-switching-not-allowed:${rule.ruleId}`);
    if (rule.authenticationRequired) errors.push(`authentication-not-allowed:${rule.ruleId}`);
    if (rule.persistenceRequired) errors.push(`persistence-not-allowed:${rule.ruleId}`);
  }

  for (const guarantee of resolver.guarantees) {
    if (guarantee.consistentWithRuleIds.length === 0) {
      errors.push(`guarantee-without-rule:${guarantee.guaranteeId}`);
    }
  }

  errors.push(
    ...duplicateValues(resolver.domains).map((value) => `duplicate-domain:${value}`),
    ...duplicateValues(resolver.inputs.map((input) => input.inputId)).map((value) => `duplicate-input:${value}`),
    ...duplicateValues(resolver.outputs.map((output) => output.outputId)).map((value) => `duplicate-output:${value}`),
    ...duplicateValues(resolver.rules.map((rule) => rule.ruleId)).map((value) => `duplicate-rule:${value}`),
    ...duplicateValues(resolver.guarantees.map((guarantee) => guarantee.guaranteeId)).map((value) => `duplicate-guarantee:${value}`)
  );

  return Object.freeze(errors);
}

function validateManifest(manifest: TenantResolverManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "CORE-TEN-5") errors.push("invalid-manifest-platform-id");
  if (manifest.platformName !== "Executive Tenant Resolver Contract") errors.push("invalid-manifest-platform-name");
  if (manifest.platformVersion !== "1.0.0") errors.push("invalid-manifest-platform-version");
  if (manifest.platformNamespace !== "nexora.core.tenant.resolver") errors.push("invalid-manifest-namespace");
  if (!manifest.deterministicFingerprint) errors.push("missing-deterministic-fingerprint");
  if (!manifest.metadataOnly) errors.push("manifest-not-metadata-only");
  if (!manifest.immutable) errors.push("manifest-not-immutable");

  return Object.freeze(errors);
}

export function validateExecutiveTenantResolver(
  resolver: TenantResolverContract = CORE_TENANT_RESOLVER,
  manifest: TenantResolverManifest = buildExecutiveTenantResolverManifest()
): TenantResolverValidationResult {
  const identityValidation = validateCoreTenantIdentity();
  const registryValidation = validateExecutiveTenantRegistry();
  const contextValidation = validateExecutiveTenantContext();
  const isolationValidation = validateExecutiveTenantIsolation();
  const errors = Object.freeze([
    ...(identityValidation.valid ? [] : identityValidation.errors.map((error) => `tenant-identity:${error}`)),
    ...(registryValidation.valid ? [] : registryValidation.errors.map((error) => `tenant-registry:${error}`)),
    ...(contextValidation.valid ? [] : contextValidation.errors.map((error) => `tenant-context:${error}`)),
    ...(isolationValidation.valid ? [] : isolationValidation.errors.map((error) => `tenant-isolation:${error}`)),
    ...validateResolver(resolver),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}


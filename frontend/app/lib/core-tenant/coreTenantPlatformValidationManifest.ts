import {
  CORE_TENANT_VALIDATION_METADATA,
  runExecutiveTenantPlatformValidation,
} from "./coreTenantPlatformValidation.ts";
import type { TenantValidationManifest } from "./coreTenantPlatformValidationTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-6-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTenantValidationManifest(): TenantValidationManifest {
  const validation = runExecutiveTenantPlatformValidation();

  return Object.freeze({
    platformId: "CORE-TEN-6",
    platformName: "Executive Tenant Validation Platform",
    platformVersion: "1.0.0",
    platformNamespace: CORE_TENANT_VALIDATION_METADATA.namespace,
    dependencies: validation.dependencies,
    summary: validation.summary,
    snapshot: validation.snapshot,
    deterministicFingerprint: fingerprint([
      CORE_TENANT_VALIDATION_METADATA.namespace,
      CORE_TENANT_VALIDATION_METADATA.metadataVersion,
      ...validation.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.available}`),
      ...validation.gates.map((entry) => `${entry.gateId}:${entry.passed}`),
      ...validation.checks.map((entry) => `${entry.checkId}:${entry.passed}`),
      validation.summary.status,
    ]),
    metadataOnly: true,
    immutable: true,
  });
}


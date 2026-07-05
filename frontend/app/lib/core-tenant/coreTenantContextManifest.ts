import { CORE_TENANT_CONTEXT } from "./coreTenantContext.ts";
import type { TenantContextManifest } from "./coreTenantContextTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-3-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTenantContextManifest(): TenantContextManifest {
  const context = CORE_TENANT_CONTEXT;

  return Object.freeze({
    platformId: "CORE-TEN-3",
    platformName: "Executive Tenant Context Foundation",
    platformVersion: "1.0.0",
    platformNamespace: "nexora.core.tenant.context",
    contextId: context.contextId,
    scope: context.scope,
    mode: context.mode,
    source: context.source,
    status: context.status,
    compatibility: context.metadata.compatibility,
    snapshot: context.snapshot,
    deterministicFingerprint: fingerprint([
      context.contextId,
      context.scope,
      context.mode,
      context.source,
      context.status,
      context.binding.currentTenantReference,
      context.binding.tenantIdentityReference.tenantId,
      context.binding.tenantRegistryReference.metadata.registryId,
      context.binding.tenantRegistryEntryReference.entryId,
      context.binding.registryMetadataReference.registryVersion,
      context.binding.contextBoundary.boundaryId,
      context.metadata.namespace,
      ...context.metadata.compatibility,
      ...context.metadata.tags,
      ...Object.entries(context.metadata.labels)
        .map(([key, value]) => `${key}:${value}`)
        .sort(),
    ]),
    metadataOnly: true,
    immutable: true,
  });
}


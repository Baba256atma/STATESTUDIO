import { CORE_TENANT_REGISTRY } from "./coreTenantRegistry.ts";
import type { RegistryManifest } from "./coreTenantRegistryTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-2-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTenantRegistryManifest(): RegistryManifest {
  const registry = CORE_TENANT_REGISTRY;

  return Object.freeze({
    platformId: "CORE-TEN-2",
    platformName: "Executive Tenant Registry Platform",
    platformVersion: "1.0.0",
    platformNamespace: "nexora.core.tenant.registry",
    registryVersion: registry.metadata.registryVersion,
    schemaVersion: registry.metadata.schemaVersion,
    metadataVersion: registry.metadata.metadataVersion,
    tenantRegistry: registry,
    deterministicFingerprint: fingerprint([
      registry.metadata.registryId,
      registry.metadata.registryVersion,
      registry.metadata.platformNamespace,
      registry.metadata.schemaVersion,
      ...registry.entries.map(
        (entry) =>
          `${entry.entryId}:${entry.tenantId}:${entry.tenantNamespace}:${entry.tenantVersion}:${entry.tenantStatus}:${entry.tenantClassification}`
      ),
      `${registry.statistics.registeredTenantCount}`,
      `${registry.statistics.namespaceCount}`,
    ]),
    metadataOnly: true,
    immutable: true,
  });
}


import { CORE_TENANT_RESOLVER } from "./coreTenantResolver.ts";
import type { TenantResolverManifest } from "./coreTenantResolverTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-5-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTenantResolverManifest(): TenantResolverManifest {
  const resolver = CORE_TENANT_RESOLVER;

  return Object.freeze({
    platformId: "CORE-TEN-5",
    platformName: "Executive Tenant Resolver Contract",
    platformVersion: "1.0.0",
    platformNamespace: "nexora.core.tenant.resolver",
    compatibility: resolver.compatibility.supportedContracts,
    snapshot: resolver.snapshot,
    deterministicFingerprint: fingerprint([
      resolver.identityReference.tenantId,
      resolver.registryReference.metadata.registryId,
      resolver.contextReference.contextId,
      resolver.isolationReference.boundary.boundaryId,
      ...resolver.domains,
      ...resolver.inputs.map((input) => `${input.inputId}:${input.domain}:${input.inputType}`),
      ...resolver.outputs.map((output) => `${output.outputId}:${output.domain}:${output.outputType}`),
      ...resolver.rules.map((rule) => `${rule.ruleId}:${rule.domain}:${rule.scope}`),
      ...resolver.guarantees.map((guarantee) => `${guarantee.guaranteeId}:${guarantee.domain}:${guarantee.guaranteeType}`),
    ]),
    metadataOnly: true,
    immutable: true,
  });
}


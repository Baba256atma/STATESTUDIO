/**
 * EIL-8:1 — Executive Integration Suite Foundation Capabilities.
 *
 * Exactly eight immutable suite capabilities.
 * Metadata only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-8:1.
 */

/** Closed suite-capability key vocabulary. */
export type SuiteCapabilityKey =
  | "SuiteComposition"
  | "ModuleDiscovery"
  | "PublicIndexAggregation"
  | "DependencyPublication"
  | "CompatibilityPublication"
  | "SuiteIdentity"
  | "SuiteMetadataPublication"
  | "SuiteReadiness";

/** Immutable suite capability descriptor. */
export interface ExecutiveIntegrationSuiteCapability {
  readonly capabilityId: `EIL-8:1/Capability/${SuiteCapabilityKey}`;
  readonly capabilityKey: SuiteCapabilityKey;
  readonly capabilityName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.foundation";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const capability = (
  capabilityKey: SuiteCapabilityKey,
  capabilityName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteCapability =>
  Object.freeze({
    capabilityId: `EIL-8:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.foundation" as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable suite capabilities in deterministic order.
 */
export const ExecutiveIntegrationSuiteCapabilities: readonly ExecutiveIntegrationSuiteCapability[] =
  Object.freeze([
    capability(
      "SuiteComposition",
      "Suite Composition",
      "Compose EIL-1 through EIL-7 Public Indexes into one Suite foundation.",
      1,
    ),
    capability(
      "ModuleDiscovery",
      "Module Discovery",
      "Publish suite module membership metadata for discovery.",
      2,
    ),
    capability(
      "PublicIndexAggregation",
      "Public Index Aggregation",
      "Aggregate released Public Index references without reconstruction.",
      3,
    ),
    capability(
      "DependencyPublication",
      "Dependency Publication",
      "Publish Public Index–only dependency metadata.",
      4,
    ),
    capability(
      "CompatibilityPublication",
      "Compatibility Publication",
      "Publish suite compatibility declarations across composed modules.",
      5,
    ),
    capability(
      "SuiteIdentity",
      "Suite Identity",
      "Publish canonical Suite Foundation identity metadata.",
      6,
    ),
    capability(
      "SuiteMetadataPublication",
      "Suite Metadata Publication",
      "Publish immutable Suite foundation metadata packaging.",
      7,
    ),
    capability(
      "SuiteReadiness",
      "Suite Readiness",
      "Publish ReadyForRegistry readiness for Suite Registry.",
      8,
    ),
  ]);

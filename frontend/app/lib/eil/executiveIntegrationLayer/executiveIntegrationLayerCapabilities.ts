/**
 * EIL-9:1 — Executive Integration Layer Foundation Capabilities.
 *
 * Exactly eight immutable layer capabilities.
 * Metadata only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-9:1.
 */

/** Closed layer-capability key vocabulary. */
export type LayerCapabilityKey =
  | "LayerComposition"
  | "SuiteAggregation"
  | "PublicSurfacePublication"
  | "DependencyPublication"
  | "CompatibilityPublication"
  | "LayerIdentity"
  | "LayerMetadataPublication"
  | "LayerReadiness";

/** Immutable layer capability descriptor. */
export interface ExecutiveIntegrationLayerCapability {
  readonly capabilityId: `EIL-9:1/Capability/${LayerCapabilityKey}`;
  readonly capabilityKey: LayerCapabilityKey;
  readonly capabilityName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.foundation";
  readonly status: "Declared";
  readonly runtimeResolved: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const capability = (
  capabilityKey: LayerCapabilityKey,
  capabilityName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerCapability =>
  Object.freeze({
    capabilityId: `EIL-9:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.foundation" as const,
    status: "Declared" as const,
    runtimeResolved: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable layer capabilities in deterministic order.
 */
export const ExecutiveIntegrationLayerCapabilities: readonly ExecutiveIntegrationLayerCapability[] =
  Object.freeze([
    capability(
      "LayerComposition",
      "Layer Composition",
      "Compose the Executive Integration Suite Public Index into one Layer foundation.",
      1,
    ),
    capability(
      "SuiteAggregation",
      "Suite Aggregation",
      "Aggregate the released EIL-8 Suite Public Index without reconstruction.",
      2,
    ),
    capability(
      "PublicSurfacePublication",
      "Public Surface Publication",
      "Publish Layer Foundation public surface metadata.",
      3,
    ),
    capability(
      "DependencyPublication",
      "Dependency Publication",
      "Publish EIL-8 Public Index–only dependency metadata.",
      4,
    ),
    capability(
      "CompatibilityPublication",
      "Compatibility Publication",
      "Publish Layer compatibility with the frozen Suite architecture.",
      5,
    ),
    capability(
      "LayerIdentity",
      "Layer Identity",
      "Publish canonical Layer Foundation identity metadata.",
      6,
    ),
    capability(
      "LayerMetadataPublication",
      "Layer Metadata Publication",
      "Publish immutable Layer Foundation architectural metadata.",
      7,
    ),
    capability(
      "LayerReadiness",
      "Layer Readiness",
      "Publish ReadyForRegistry readiness for Registry phase.",
      8,
    ),
  ]);

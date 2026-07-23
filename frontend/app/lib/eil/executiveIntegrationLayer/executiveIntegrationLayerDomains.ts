/**
 * EIL-9:1 — Executive Integration Layer Foundation Domains.
 *
 * Exactly eight immutable layer domains.
 * Metadata only. No domain runtime behavior.
 *
 * Ownership: owned exclusively by EIL-9:1.
 */

/** Closed layer-domain key vocabulary. */
export type LayerDomainKey =
  | "Foundation"
  | "Layer"
  | "Suite"
  | "Composition"
  | "Dependencies"
  | "Compatibility"
  | "Publication"
  | "Metadata";

/** Immutable layer domain descriptor. */
export interface ExecutiveIntegrationLayerDomain {
  readonly domainId: `EIL-9:1/Domain/${LayerDomainKey}`;
  readonly domainKey: LayerDomainKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.foundation";
  readonly status: "Declared";
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const domain = (
  domainKey: LayerDomainKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerDomain =>
  Object.freeze({
    domainId: `EIL-9:1/Domain/${domainKey}` as const,
    domainKey,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.foundation" as const,
    status: "Declared" as const,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable layer domains in deterministic order.
 */
export const ExecutiveIntegrationLayerDomains: readonly ExecutiveIntegrationLayerDomain[] =
  Object.freeze([
    domain(
      "Foundation",
      "Foundation",
      "Architectural domain for Layer Foundation identity and baseline metadata.",
      1,
    ),
    domain(
      "Layer",
      "Layer",
      "Architectural domain for the top-level Executive Integration Layer.",
      2,
    ),
    domain(
      "Suite",
      "Suite",
      "Architectural domain for Executive Integration Suite membership by Public Index.",
      3,
    ),
    domain(
      "Composition",
      "Composition",
      "Architectural domain for layer composition of the released Suite.",
      4,
    ),
    domain(
      "Dependencies",
      "Dependencies",
      "Architectural domain for EIL-8 Public Index–only dependency declarations.",
      5,
    ),
    domain(
      "Compatibility",
      "Compatibility",
      "Architectural domain for Suite and Layer compatibility metadata.",
      6,
    ),
    domain(
      "Publication",
      "Publication",
      "Architectural domain for Layer Foundation publication metadata.",
      7,
    ),
    domain(
      "Metadata",
      "Metadata",
      "Architectural domain for metadata-only Layer Foundation guarantees.",
      8,
    ),
  ]);

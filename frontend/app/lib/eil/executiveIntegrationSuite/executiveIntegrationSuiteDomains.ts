/**
 * EIL-8:1 — Executive Integration Suite Foundation Domains.
 *
 * Exactly eight immutable suite domains.
 * Metadata only. No domain runtime behavior.
 *
 * Ownership: owned exclusively by EIL-8:1.
 */

/** Closed suite-domain key vocabulary. */
export type SuiteDomainKey =
  | "Foundation"
  | "Composition"
  | "Modules"
  | "Dependencies"
  | "Compatibility"
  | "Publication"
  | "Metadata"
  | "Suite";

/** Immutable suite domain descriptor. */
export interface ExecutiveIntegrationSuiteDomain {
  readonly domainId: `EIL-8:1/Domain/${SuiteDomainKey}`;
  readonly domainKey: SuiteDomainKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.foundation";
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const domain = (
  domainKey: SuiteDomainKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteDomain =>
  Object.freeze({
    domainId: `EIL-8:1/Domain/${domainKey}` as const,
    domainKey,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.foundation" as const,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable suite domains in deterministic order.
 */
export const ExecutiveIntegrationSuiteDomains: readonly ExecutiveIntegrationSuiteDomain[] =
  Object.freeze([
    domain(
      "Foundation",
      "Foundation",
      "Architectural domain for Suite Foundation identity and baseline metadata.",
      1,
    ),
    domain(
      "Composition",
      "Composition",
      "Architectural domain for suite composition of released EIL modules.",
      2,
    ),
    domain(
      "Modules",
      "Modules",
      "Architectural domain for EIL-1 through EIL-7 suite membership.",
      3,
    ),
    domain(
      "Dependencies",
      "Dependencies",
      "Architectural domain for Public Index–only dependency declarations.",
      4,
    ),
    domain(
      "Compatibility",
      "Compatibility",
      "Architectural domain for cross-module compatibility metadata.",
      5,
    ),
    domain(
      "Publication",
      "Publication",
      "Architectural domain for suite metadata publication readiness.",
      6,
    ),
    domain(
      "Metadata",
      "Metadata",
      "Architectural domain for immutable suite metadata packaging.",
      7,
    ),
    domain(
      "Suite",
      "Suite",
      "Architectural domain for the unified Executive Integration Suite.",
      8,
    ),
  ]);

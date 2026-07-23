/**
 * EIL-7:1 — Integration Governance Foundation Domains.
 *
 * Immutable architectural domain declarations for Integration Governance.
 * Metadata only. No governance or policy behavior.
 *
 * Ownership: owned exclusively by EIL-7:1.
 */

/** Closed domain-key vocabulary. */
export type GovernanceDomainKey =
  | "Policies"
  | "Compliance"
  | "Versioning"
  | "Compatibility"
  | "Standards"
  | "Approvals"
  | "Audit"
  | "Risk"
  | "Lifecycle"
  | "Governance";

/** Immutable governance domain descriptor. */
export interface IntegrationGovernanceDomain {
  readonly domainId: `EIL-7:1/Domain/${GovernanceDomainKey}`;
  readonly domainKey: GovernanceDomainKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const domain = (
  domainKey: GovernanceDomainKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceDomain =>
  Object.freeze({
    domainId: `EIL-7:1/Domain/${domainKey}` as const,
    domainKey,
    canonicalName,
    description,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten architectural governance domains.
 */
export const IntegrationGovernanceFoundationDomains: readonly IntegrationGovernanceDomain[] =
  Object.freeze([
    domain(
      "Policies",
      "Policies",
      "Architectural domain for declarative governance policy metadata.",
      1,
    ),
    domain(
      "Compliance",
      "Compliance",
      "Architectural domain for declarative compliance requirement metadata.",
      2,
    ),
    domain(
      "Versioning",
      "Versioning",
      "Architectural domain for declarative versioning metadata.",
      3,
    ),
    domain(
      "Compatibility",
      "Compatibility",
      "Architectural domain for declarative compatibility metadata.",
      4,
    ),
    domain(
      "Standards",
      "Standards",
      "Architectural domain for declarative integration standard metadata.",
      5,
    ),
    domain(
      "Approvals",
      "Approvals",
      "Architectural domain for declarative approval metadata.",
      6,
    ),
    domain(
      "Audit",
      "Audit",
      "Architectural domain for declarative audit metadata.",
      7,
    ),
    domain(
      "Risk",
      "Risk",
      "Architectural domain for declarative risk metadata.",
      8,
    ),
    domain(
      "Lifecycle",
      "Lifecycle",
      "Architectural domain for declarative lifecycle governance metadata.",
      9,
    ),
    domain(
      "Governance",
      "Governance",
      "Architectural domain for declarative governance oversight metadata.",
      10,
    ),
  ]);

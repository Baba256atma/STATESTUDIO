/**
 * EIL-7:1 — Integration Governance Foundation Policy Categories.
 *
 * Exactly eight immutable policy categories.
 * Categories only. No policy execution.
 *
 * Ownership: owned exclusively by EIL-7:1.
 */

/** Closed policy-category key vocabulary. */
export type GovernancePolicyCategoryKey =
  | "ArchitecturalPolicy"
  | "DependencyPolicy"
  | "CompatibilityPolicy"
  | "SecurityPolicy"
  | "VersionPolicy"
  | "LifecyclePolicy"
  | "CompliancePolicy"
  | "PublicationPolicy";

/** Immutable policy category descriptor. */
export interface IntegrationGovernancePolicyCategory {
  readonly categoryId: `EIL-7:1/PolicyCategory/${GovernancePolicyCategoryKey}`;
  readonly categoryKey: GovernancePolicyCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly executesPolicy: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const policyCategory = (
  categoryKey: GovernancePolicyCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernancePolicyCategory =>
  Object.freeze({
    categoryId: `EIL-7:1/PolicyCategory/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    executesPolicy: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight architectural policy categories.
 */
export const IntegrationGovernancePolicyCategories: readonly IntegrationGovernancePolicyCategory[] =
  Object.freeze([
    policyCategory(
      "ArchitecturalPolicy",
      "Architectural Policy",
      "Declarative architectural policy category metadata.",
      1,
    ),
    policyCategory(
      "DependencyPolicy",
      "Dependency Policy",
      "Declarative dependency policy category metadata.",
      2,
    ),
    policyCategory(
      "CompatibilityPolicy",
      "Compatibility Policy",
      "Declarative compatibility policy category metadata.",
      3,
    ),
    policyCategory(
      "SecurityPolicy",
      "Security Policy",
      "Declarative security policy category metadata.",
      4,
    ),
    policyCategory(
      "VersionPolicy",
      "Version Policy",
      "Declarative version policy category metadata.",
      5,
    ),
    policyCategory(
      "LifecyclePolicy",
      "Lifecycle Policy",
      "Declarative lifecycle policy category metadata.",
      6,
    ),
    policyCategory(
      "CompliancePolicy",
      "Compliance Policy",
      "Declarative compliance policy category metadata.",
      7,
    ),
    policyCategory(
      "PublicationPolicy",
      "Publication Policy",
      "Declarative publication policy category metadata.",
      8,
    ),
  ]);

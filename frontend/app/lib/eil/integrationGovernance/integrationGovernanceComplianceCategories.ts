/**
 * EIL-7:1 — Integration Governance Foundation Compliance Categories.
 *
 * Exactly eight immutable compliance categories.
 * Metadata only. No compliance evaluation.
 *
 * Ownership: owned exclusively by EIL-7:1.
 */

/** Closed compliance-category key vocabulary. */
export type GovernanceComplianceCategoryKey =
  | "ArchitectureCompliance"
  | "NamespaceCompliance"
  | "DependencyCompliance"
  | "VersionCompliance"
  | "CompatibilityCompliance"
  | "MetadataCompliance"
  | "ExportCompliance"
  | "GovernanceCompliance";

/** Immutable compliance category descriptor. */
export interface IntegrationGovernanceComplianceCategory {
  readonly categoryId: `EIL-7:1/ComplianceCategory/${GovernanceComplianceCategoryKey}`;
  readonly categoryKey: GovernanceComplianceCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly evaluatesCompliance: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const complianceCategory = (
  categoryKey: GovernanceComplianceCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceComplianceCategory =>
  Object.freeze({
    categoryId: `EIL-7:1/ComplianceCategory/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    evaluatesCompliance: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight architectural compliance categories.
 */
export const IntegrationGovernanceComplianceCategories: readonly IntegrationGovernanceComplianceCategory[] =
  Object.freeze([
    complianceCategory(
      "ArchitectureCompliance",
      "Architecture Compliance",
      "Declarative architecture compliance category metadata.",
      1,
    ),
    complianceCategory(
      "NamespaceCompliance",
      "Namespace Compliance",
      "Declarative namespace compliance category metadata.",
      2,
    ),
    complianceCategory(
      "DependencyCompliance",
      "Dependency Compliance",
      "Declarative dependency compliance category metadata.",
      3,
    ),
    complianceCategory(
      "VersionCompliance",
      "Version Compliance",
      "Declarative version compliance category metadata.",
      4,
    ),
    complianceCategory(
      "CompatibilityCompliance",
      "Compatibility Compliance",
      "Declarative compatibility compliance category metadata.",
      5,
    ),
    complianceCategory(
      "MetadataCompliance",
      "Metadata Compliance",
      "Declarative metadata compliance category metadata.",
      6,
    ),
    complianceCategory(
      "ExportCompliance",
      "Export Compliance",
      "Declarative export compliance category metadata.",
      7,
    ),
    complianceCategory(
      "GovernanceCompliance",
      "Governance Compliance",
      "Declarative governance compliance category metadata.",
      8,
    ),
  ]);

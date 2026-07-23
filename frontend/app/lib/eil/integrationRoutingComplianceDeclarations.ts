/**
 * EIL-3:7 — Integration Routing Compliance Declarations.
 *
 * Immutable compliance metadata for Certification.
 * Descriptive only — no runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-3:7.
 */

import type {
  RoutingComplianceDeclaration,
  RoutingComplianceKey,
} from "./integrationRoutingCertificationTypes.ts";

const compliance = (
  key: RoutingComplianceKey,
  canonicalName: string,
  description: string,
  ordinal: number,
): RoutingComplianceDeclaration =>
  Object.freeze({
    complianceId: `EIL-3:7/Compliance/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-3:7" as const,
    ordinal,
    tags: Object.freeze(["compliance", key.toLowerCase()]),
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten compliance declarations.
 */
export const IntegrationRoutingComplianceDeclarations: readonly RoutingComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "MetadataOnlyCompliance",
      "Metadata-only Compliance",
      "EIL-3 remains metadata-only through Platform certification.",
      1,
    ),
    compliance(
      "CanonicalNamingCompliance",
      "Canonical Naming Compliance",
      "Canonical IDs and namespaces follow nexora.eil.integration-routing.* conventions.",
      2,
    ),
    compliance(
      "DependencyCompliance",
      "Dependency Compliance",
      "Each phase consumes only its declared aggregate upstream entry point.",
      3,
    ),
    compliance(
      "CompatibilityCompliance",
      "Compatibility Compliance",
      "Compatibility declarations remain complete and descriptive only.",
      4,
    ),
    compliance(
      "InventoryCompliance",
      "Inventory Compliance",
      "Inventory totals remain dynamically derived from canonical collections.",
      5,
    ),
    compliance(
      "ImmutabilityCompliance",
      "Immutability Compliance",
      "All certification and platform exports remain deeply immutable.",
      6,
    ),
    compliance(
      "DeterministicOrderingCompliance",
      "Deterministic Ordering Compliance",
      "All collections preserve explicit stable ordinals.",
      7,
    ),
    compliance(
      "AggregateEntryCompliance",
      "Aggregate Entry Compliance",
      "Certification consumes only integrationRoutingPlatform.ts.",
      8,
    ),
    compliance(
      "ArchitecturalCompliance",
      "Architectural Compliance",
      "Foundation through Platform lineage remains architecturally consistent.",
      9,
    ),
    compliance(
      "CertificationCompliance",
      "Certification Compliance",
      "Certification criteria and gates declare Freeze eligibility without execution.",
      10,
    ),
  ]);

/**
 * EIL-2:7 — Integration Connector Compliance Declarations.
 *
 * Immutable compliance metadata for Certification.
 * Descriptive only — no runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-2:7.
 */

import type {
  IntegrationConnectorComplianceDeclaration,
  IntegrationConnectorComplianceKey,
} from "./integrationConnectorCertificationTypes.ts";

const compliance = (
  key: IntegrationConnectorComplianceKey,
  canonicalName: string,
  description: string,
  ordinal: number,
): IntegrationConnectorComplianceDeclaration =>
  Object.freeze({
    complianceId: `EIL-2:7/Compliance/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-2:7" as const,
    ordinal,
    tags: Object.freeze(["compliance", key.toLowerCase()]),
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten compliance declarations.
 */
export const IntegrationConnectorComplianceDeclarations: readonly IntegrationConnectorComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "MetadataOnlyCompliance",
      "Metadata-only compliance",
      "EIL-2 remains metadata-only through Platform certification.",
      1,
    ),
    compliance(
      "CanonicalNamingCompliance",
      "Canonical naming compliance",
      "Canonical IDs and namespaces follow nexora.eil.integration-connector.* conventions.",
      2,
    ),
    compliance(
      "DependencyCompliance",
      "Dependency compliance",
      "Each phase consumes only its declared aggregate upstream entry point.",
      3,
    ),
    compliance(
      "CompatibilityCompliance",
      "Compatibility compliance",
      "Compatibility declarations remain complete and descriptive only.",
      4,
    ),
    compliance(
      "InventoryCompliance",
      "Inventory compliance",
      "Inventory totals remain dynamically derived from canonical collections.",
      5,
    ),
    compliance(
      "ImmutabilityCompliance",
      "Immutability compliance",
      "All certification and platform exports remain deeply immutable.",
      6,
    ),
    compliance(
      "DeterministicOrderingCompliance",
      "Deterministic ordering compliance",
      "All collections preserve explicit stable ordinals.",
      7,
    ),
    compliance(
      "AggregateEntryCompliance",
      "Aggregate entry compliance",
      "Certification consumes only integrationConnectorPlatform.ts.",
      8,
    ),
    compliance(
      "ArchitecturalCompliance",
      "Architectural compliance",
      "Foundation through Platform lineage remains architecturally consistent.",
      9,
    ),
    compliance(
      "CertificationCompliance",
      "Certification compliance",
      "Certification criteria and gates declare Freeze eligibility without execution.",
      10,
    ),
  ]);

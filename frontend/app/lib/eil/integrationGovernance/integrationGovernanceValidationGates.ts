/**
 * EIL-7:4 — Integration Governance Validation Gates.
 *
 * Exactly sixteen immutable readiness gates.
 * Metadata-only. No gate execution.
 *
 * Ownership: owned exclusively by EIL-7:4.
 */

import {
  IntegrationGovernanceModelCanonicalId,
  IntegrationGovernanceModelIdentity,
} from "./integrationGovernanceModel.ts";
import type { GovernanceValidationResultValue } from "./integrationGovernanceValidationResults.ts";

/** Closed readiness-gate key vocabulary. */
export type GovernanceValidationGateKey =
  | "IdentityComplete"
  | "NamespaceComplete"
  | "RegistryDependencyVerified"
  | "ModelDependencyVerified"
  | "InventoryVerified"
  | "RelationshipsVerified"
  | "MetadataVerified"
  | "ExportSurfaceVerified"
  | "ImmutabilityVerified"
  | "DeterministicOrderingVerified"
  | "RuntimeIndependenceVerified"
  | "PackageIntegrityVerified"
  | "TypeIntegrityVerified"
  | "ValidationComplete"
  | "ArchitectureApproved"
  | "ReadyForManifest";

/** Immutable readiness gate descriptor. */
export interface IntegrationGovernanceValidationGate {
  readonly gateId: `EIL-7:4/Gate/${GovernanceValidationGateKey}`;
  readonly canonicalKey: GovernanceValidationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly declaredResult: GovernanceValidationResultValue;
  readonly namespace: "nexora.eil.integration-governance.validation";
  readonly sourceModelId: typeof IntegrationGovernanceModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const gate = (
  key: GovernanceValidationGateKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceValidationGate =>
  Object.freeze({
    gateId: `EIL-7:4/Gate/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    declaredResult: "Pass" as const,
    namespace: "nexora.eil.integration-governance.validation" as const,
    sourceModelId: IntegrationGovernanceModelCanonicalId,
    sourceReference: `${IntegrationGovernanceModelIdentity.canonicalId}/validation/gates/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen readiness gates in deterministic order.
 */
export const IntegrationGovernanceValidationGates: readonly IntegrationGovernanceValidationGate[] =
  Object.freeze([
    gate(
      "IdentityComplete",
      "Identity Complete",
      "Canonical Model identity metadata is complete.",
      1,
    ),
    gate(
      "NamespaceComplete",
      "Namespace Complete",
      "Canonical Model namespace metadata is complete.",
      2,
    ),
    gate(
      "RegistryDependencyVerified",
      "Registry Dependency Verified",
      "Model exclusive Registry dependency is architecturally verified.",
      3,
    ),
    gate(
      "ModelDependencyVerified",
      "Model Dependency Verified",
      "Validation exclusive Model dependency is architecturally verified.",
      4,
    ),
    gate(
      "InventoryVerified",
      "Inventory Verified",
      "Derived Model inventory integrity is architecturally verified.",
      5,
    ),
    gate(
      "RelationshipsVerified",
      "Relationships Verified",
      "Architectural relationship metadata is verified.",
      6,
    ),
    gate(
      "MetadataVerified",
      "Metadata Verified",
      "Metadata-only architectural guarantees are verified.",
      7,
    ),
    gate(
      "ExportSurfaceVerified",
      "Export Surface Verified",
      "Package Model export surface is architecturally verified.",
      8,
    ),
    gate(
      "ImmutabilityVerified",
      "Immutability Verified",
      "Frozen immutable Model collections are verified.",
      9,
    ),
    gate(
      "DeterministicOrderingVerified",
      "Deterministic Ordering Verified",
      "Sequential deterministic ordering is verified.",
      10,
    ),
    gate(
      "RuntimeIndependenceVerified",
      "Runtime Independence Verified",
      "Runtime-free governance independence is verified.",
      11,
    ),
    gate(
      "PackageIntegrityVerified",
      "Package Integrity Verified",
      "Package entry integrity for Validation surface is verified.",
      12,
    ),
    gate(
      "TypeIntegrityVerified",
      "Type Integrity Verified",
      "Strict TypeScript architectural type integrity is verified.",
      13,
    ),
    gate(
      "ValidationComplete",
      "Validation Complete",
      "Validation categories, rules, and gates are architecturally complete.",
      14,
    ),
    gate(
      "ArchitectureApproved",
      "Architecture Approved",
      "Integration Governance architecture is approved for Manifest.",
      15,
    ),
    gate(
      "ReadyForManifest",
      "Ready For Manifest",
      "Validation readiness gate declaring ReadyForManifest.",
      16,
    ),
  ]);

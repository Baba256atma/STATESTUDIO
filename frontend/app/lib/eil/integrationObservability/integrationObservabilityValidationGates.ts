/**
 * EIL-6:4 — Integration Observability Validation Gates.
 *
 * Exactly sixteen immutable readiness gates.
 * Metadata-only. No gate execution.
 *
 * Ownership: owned exclusively by EIL-6:4.
 */

import {
  IntegrationObservabilityModelCanonicalId,
  IntegrationObservabilityModelIdentity,
} from "./integrationObservabilityModel.ts";
import type { ObservabilityValidationResultValue } from "./integrationObservabilityValidationResults.ts";

/** Closed readiness-gate key vocabulary. */
export type ObservabilityValidationGateKey =
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
export interface IntegrationObservabilityValidationGate {
  readonly gateId: `EIL-6:4/Gate/${ObservabilityValidationGateKey}`;
  readonly canonicalKey: ObservabilityValidationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly declaredResult: ObservabilityValidationResultValue;
  readonly namespace: "nexora.eil.integration-observability.validation";
  readonly sourceModelId: typeof IntegrationObservabilityModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const gate = (
  key: ObservabilityValidationGateKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityValidationGate =>
  Object.freeze({
    gateId: `EIL-6:4/Gate/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    declaredResult: "Pass" as const,
    namespace: "nexora.eil.integration-observability.validation" as const,
    sourceModelId: IntegrationObservabilityModelCanonicalId,
    sourceReference: `${IntegrationObservabilityModelIdentity.canonicalId}/validation/gates/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen readiness gates in deterministic order.
 */
export const IntegrationObservabilityValidationGates: readonly IntegrationObservabilityValidationGate[] =
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
      "Runtime-free observability independence is verified.",
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
      "Integration Observability architecture is approved for Manifest.",
      15,
    ),
    gate(
      "ReadyForManifest",
      "Ready For Manifest",
      "Validation readiness gate declaring ReadyForManifest.",
      16,
    ),
  ]);

/**
 * EIL-9:4 — Executive Integration Layer Validation Gates.
 *
 * Exactly sixteen immutable readiness gates.
 * Metadata-only. No gate execution.
 *
 * Ownership: owned exclusively by EIL-9:4.
 */

import {
  ExecutiveIntegrationLayerModelCanonicalId,
  ExecutiveIntegrationLayerModelIdentity,
} from "./executiveIntegrationLayerModel.ts";
import type { LayerValidationResultValue } from "./executiveIntegrationLayerValidationResults.ts";

/** Closed readiness-gate key vocabulary. */
export type LayerValidationGateKey =
  | "IdentityComplete"
  | "NamespaceComplete"
  | "DependencyVerified"
  | "RegistryReferenceVerified"
  | "ModelReferenceVerified"
  | "InventoryVerified"
  | "RelationshipVerified"
  | "MetadataVerified"
  | "ExportSurfaceVerified"
  | "OrderingVerified"
  | "ImmutabilityVerified"
  | "PackageIntegrityVerified"
  | "TypeIntegrityVerified"
  | "ValidationComplete"
  | "ArchitectureApproved"
  | "ReadyForManifest";

/** Immutable readiness gate descriptor. */
export interface ExecutiveIntegrationLayerValidationGate {
  readonly gateId: `EIL-9:4/Gate/${LayerValidationGateKey}`;
  readonly canonicalKey: LayerValidationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly declaredResult: LayerValidationResultValue;
  readonly namespace: "nexora.eil.executive-integration-layer.validation";
  readonly sourceModelId: typeof ExecutiveIntegrationLayerModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const gate = (
  key: LayerValidationGateKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerValidationGate =>
  Object.freeze({
    gateId: `EIL-9:4/Gate/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    declaredResult: "Pass" as const,
    namespace: "nexora.eil.executive-integration-layer.validation" as const,
    sourceModelId: ExecutiveIntegrationLayerModelCanonicalId,
    sourceReference: `${ExecutiveIntegrationLayerModelIdentity.canonicalId}/validation/gates/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen readiness gates in deterministic order.
 */
export const ExecutiveIntegrationLayerValidationGates: readonly ExecutiveIntegrationLayerValidationGate[] =
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
      "DependencyVerified",
      "Dependency Verified",
      "Validation exclusive Model dependency is architecturally verified.",
      3,
    ),
    gate(
      "RegistryReferenceVerified",
      "Registry Reference Verified",
      "Model exclusive Registry reference integrity is architecturally verified.",
      4,
    ),
    gate(
      "ModelReferenceVerified",
      "Model Reference Verified",
      "Validation Model reference integrity is architecturally verified.",
      5,
    ),
    gate(
      "InventoryVerified",
      "Inventory Verified",
      "Derived Model inventory integrity is architecturally verified.",
      6,
    ),
    gate(
      "RelationshipVerified",
      "Relationship Verified",
      "Architectural relationship metadata is verified.",
      7,
    ),
    gate(
      "MetadataVerified",
      "Metadata Verified",
      "Metadata-only architectural guarantees are verified.",
      8,
    ),
    gate(
      "ExportSurfaceVerified",
      "Export Surface Verified",
      "Package Model export surface is architecturally verified.",
      9,
    ),
    gate(
      "OrderingVerified",
      "Ordering Verified",
      "Sequential deterministic ordering is verified.",
      10,
    ),
    gate(
      "ImmutabilityVerified",
      "Immutability Verified",
      "Frozen immutable Model collections are verified.",
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
      "Executive Integration Layer architecture is approved for Manifest.",
      15,
    ),
    gate(
      "ReadyForManifest",
      "Ready For Manifest",
      "Validation readiness gate declaring ReadyForManifest.",
      16,
    ),
  ]);

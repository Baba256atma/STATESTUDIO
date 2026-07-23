/**
 * EIL-6:7 — Integration Observability Certification Gates.
 *
 * Exactly sixteen immutable certification gates.
 * Metadata-only. No executable gate logic.
 *
 * Ownership: owned exclusively by EIL-6:7.
 */

import { IntegrationObservabilityPlatformCanonicalId } from "./integrationObservabilityPlatform.ts";
import type { ObservabilityCertificationResultValue } from "./integrationObservabilityCertificationResults.ts";

/** Closed certification-gate key vocabulary. */
export type ObservabilityCertificationGateKey =
  | "IdentityGate"
  | "NamespaceGate"
  | "DependencyGate"
  | "CompositionGate"
  | "MetadataGate"
  | "InventoryGate"
  | "CompatibilityGate"
  | "ExportGate"
  | "TypeGate"
  | "ArchitectureGate"
  | "RuntimeIndependenceGate"
  | "PackageIntegrityGate"
  | "PlatformApprovalGate"
  | "CertificationApprovalGate"
  | "FreezeApprovalGate"
  | "ReadyForFreezeGate";

/** Immutable certification gate descriptor. */
export interface IntegrationObservabilityCertificationGate {
  readonly gateId: `EIL-6:7/Gate/${ObservabilityCertificationGateKey}`;
  readonly canonicalKey: ObservabilityCertificationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly declaredResult: ObservabilityCertificationResultValue;
  readonly namespace: "nexora.eil.integration-observability.certification";
  readonly sourcePlatformId: typeof IntegrationObservabilityPlatformCanonicalId;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const gate = (
  key: ObservabilityCertificationGateKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityCertificationGate =>
  Object.freeze({
    gateId: `EIL-6:7/Gate/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    declaredResult: "Pass" as const,
    namespace: "nexora.eil.integration-observability.certification" as const,
    sourcePlatformId: IntegrationObservabilityPlatformCanonicalId,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen certification gates in deterministic order.
 */
export const IntegrationObservabilityCertificationGates: readonly IntegrationObservabilityCertificationGate[] =
  Object.freeze([
    gate("IdentityGate", "Identity Gate", "Canonical identity gate.", 1),
    gate("NamespaceGate", "Namespace Gate", "Canonical namespace gate.", 2),
    gate(
      "DependencyGate",
      "Dependency Gate",
      "Platform dependency integrity gate.",
      3,
    ),
    gate(
      "CompositionGate",
      "Composition Gate",
      "Foundation through Platform composition gate.",
      4,
    ),
    gate("MetadataGate", "Metadata Gate", "Metadata-only integrity gate.", 5),
    gate(
      "InventoryGate",
      "Inventory Gate",
      "Platform-derived inventory integrity gate.",
      6,
    ),
    gate(
      "CompatibilityGate",
      "Compatibility Gate",
      "Platform compatibility declaration gate.",
      7,
    ),
    gate("ExportGate", "Export Gate", "Package export surface gate.", 8),
    gate("TypeGate", "Type Gate", "Strict TypeScript integrity gate.", 9),
    gate(
      "ArchitectureGate",
      "Architecture Gate",
      "Canonical architecture integrity gate.",
      10,
    ),
    gate(
      "RuntimeIndependenceGate",
      "Runtime Independence Gate",
      "Runtime-free observability independence gate.",
      11,
    ),
    gate(
      "PackageIntegrityGate",
      "Package Integrity Gate",
      "Package entry integrity gate.",
      12,
    ),
    gate(
      "PlatformApprovalGate",
      "Platform Approval Gate",
      "Platform architectural approval gate.",
      13,
    ),
    gate(
      "CertificationApprovalGate",
      "Certification Approval Gate",
      "Certification architectural approval gate.",
      14,
    ),
    gate(
      "FreezeApprovalGate",
      "Freeze Approval Gate",
      "Freeze phase approval gate.",
      15,
    ),
    gate(
      "ReadyForFreezeGate",
      "Ready For Freeze Gate",
      "ReadyForFreeze readiness gate.",
      16,
    ),
  ]);

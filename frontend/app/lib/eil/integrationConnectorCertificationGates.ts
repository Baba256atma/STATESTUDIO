/**
 * EIL-2:7 — Integration Connector Certification Gates.
 *
 * Immutable declarative certification gates for Freeze eligibility.
 * Descriptive only. No gate execution.
 *
 * Ownership: owned exclusively by EIL-2:7.
 */

import { IntegrationConnectorPlatformIdentity } from "./integrationConnectorPlatform.ts";
import type {
  IntegrationConnectorCertificationGate,
  IntegrationConnectorCertificationGateKey,
  IntegrationConnectorPlatformReference,
} from "./integrationConnectorCertificationTypes.ts";

const platformRef = (
  sourcePath: string,
): IntegrationConnectorPlatformReference =>
  Object.freeze({
    platformId: IntegrationConnectorPlatformIdentity.canonicalId,
    platformNamespace: IntegrationConnectorPlatformIdentity.namespace,
    entryPoint: "integrationConnectorPlatform.ts" as const,
    sourcePath,
    preservesCanonicalReference: true as const,
    duplicatesPlatformValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const gate = (
  key: IntegrationConnectorCertificationGateKey,
  canonicalName: string,
  description: string,
  passCondition: string,
  sourcePath: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationConnectorCertificationGate =>
  Object.freeze({
    gateId: `EIL-2:7/Gate/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    passCondition,
    sourceReference: platformRef(sourcePath),
    ownership: "EIL-2:7" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesGate: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve certification gates.
 */
export const IntegrationConnectorCertificationGates: readonly IntegrationConnectorCertificationGate[] =
  Object.freeze([
    gate(
      "IdentityGate",
      "Identity Gate",
      "Certifies canonical Platform identity integrity.",
      "Platform identity equals EIL-2:6/IntegrationConnectorPlatform.",
      "identity",
      1,
      Object.freeze(["identity", "gate"]),
    ),
    gate(
      "NamespaceGate",
      "Namespace Gate",
      "Certifies namespace integrity for Platform composition.",
      "Namespace equals nexora.eil.integration-connector.platform.",
      "identity/namespace",
      2,
      Object.freeze(["namespace", "gate"]),
    ),
    gate(
      "DependencyGate",
      "Dependency Gate",
      "Certifies sole Manifest aggregate dependency.",
      "Manifest aggregate is the only upstream phase dependency.",
      "dependency",
      3,
      Object.freeze(["dependency", "gate"]),
    ),
    gate(
      "InventoryGate",
      "Inventory Gate",
      "Certifies inventory derivation integrity.",
      "Inventory totals are derived from Manifest without hardcoding.",
      "inventory",
      4,
      Object.freeze(["inventory", "gate"]),
    ),
    gate(
      "ValidationGate",
      "Validation Gate",
      "Certifies Validation lineage presence in composition.",
      "Validation reference remains present and non-duplicated.",
      "composition/validationReference",
      5,
      Object.freeze(["validation", "gate"]),
    ),
    gate(
      "ManifestGate",
      "Manifest Gate",
      "Certifies Manifest completeness for Platform composition.",
      "Manifest reference equals EIL-2:5/IntegrationConnectorManifest.",
      "composition/manifestReference",
      6,
      Object.freeze(["manifest", "gate"]),
    ),
    gate(
      "PlatformGate",
      "Platform Gate",
      "Certifies Platform completeness for Certification.",
      "Platform guarantees and compatibility collections are complete.",
      "guarantees",
      7,
      Object.freeze(["platform", "gate"]),
    ),
    gate(
      "CompatibilityGate",
      "Compatibility Gate",
      "Certifies compatibility declaration completeness.",
      "Compatibility scopes remain complete and descriptive only.",
      "compatibility",
      8,
      Object.freeze(["compatibility", "gate"]),
    ),
    gate(
      "ArchitectureGate",
      "Architecture Gate",
      "Certifies architectural consistency across EIL-2 lineage.",
      "Release lineage spans Foundation through Platform.",
      "composition",
      9,
      Object.freeze(["architecture", "gate"]),
    ),
    gate(
      "ReadinessGate",
      "Readiness Gate",
      "Certifies Platform readiness for Freeze eligibility.",
      "Platform readiness equals ReadyForCertification.",
      "readiness",
      10,
      Object.freeze(["readiness", "gate"]),
    ),
    gate(
      "ComplianceGate",
      "Compliance Gate",
      "Certifies metadata-only architectural compliance.",
      "Runtime, networking, and connector execution behaviors remain absent.",
      "metadataOnly",
      11,
      Object.freeze(["compliance", "gate"]),
    ),
    gate(
      "ReleaseGate",
      "Release Gate",
      "Certifies release consistency for Freeze transition.",
      "Version and release lineage remain consistent at 1.0.0.",
      "composition/releaseLineage",
      12,
      Object.freeze(["release", "gate"]),
    ),
  ]);

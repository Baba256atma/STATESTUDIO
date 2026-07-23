/**
 * EIL-3:7 — Integration Routing Certification Gates.
 *
 * Immutable declarative certification gates for Freeze eligibility.
 * Descriptive only. No gate execution.
 *
 * Ownership: owned exclusively by EIL-3:7.
 */

import { IntegrationRoutingPlatformIdentity } from "./integrationRoutingPlatform.ts";
import type {
  RoutingCertificationGate,
  RoutingCertificationGateKey,
  RoutingPlatformReference,
} from "./integrationRoutingCertificationTypes.ts";

const platformRef = (sourcePath: string): RoutingPlatformReference =>
  Object.freeze({
    platformId: IntegrationRoutingPlatformIdentity.canonicalId,
    platformNamespace: IntegrationRoutingPlatformIdentity.namespace,
    entryPoint: "integrationRoutingPlatform.ts" as const,
    sourcePath,
    preservesCanonicalReference: true as const,
    duplicatesPlatformValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const gate = (
  key: RoutingCertificationGateKey,
  canonicalName: string,
  description: string,
  passCondition: string,
  sourcePath: string,
  ordinal: number,
  tags: readonly string[],
): RoutingCertificationGate =>
  Object.freeze({
    gateId: `EIL-3:7/Gate/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    passCondition,
    sourceReference: platformRef(sourcePath),
    ownership: "EIL-3:7" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesGate: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve certification gates.
 */
export const IntegrationRoutingCertificationGates: readonly RoutingCertificationGate[] =
  Object.freeze([
    gate(
      "Identity",
      "Identity",
      "Certifies canonical Platform identity integrity.",
      "Platform identity equals EIL-3:6/IntegrationRoutingPlatform.",
      "identity",
      1,
      Object.freeze(["identity", "gate"]),
    ),
    gate(
      "Namespace",
      "Namespace",
      "Certifies namespace integrity for Platform composition.",
      "Namespace equals nexora.eil.integration-routing.platform.",
      "identity/namespace",
      2,
      Object.freeze(["namespace", "gate"]),
    ),
    gate(
      "Dependency",
      "Dependency",
      "Certifies sole Manifest aggregate dependency.",
      "Manifest aggregate is the only upstream phase dependency.",
      "dependency",
      3,
      Object.freeze(["dependency", "gate"]),
    ),
    gate(
      "Inventory",
      "Inventory",
      "Certifies inventory derivation integrity.",
      "Inventory totals are derived from Manifest without hardcoding.",
      "inventory",
      4,
      Object.freeze(["inventory", "gate"]),
    ),
    gate(
      "Validation",
      "Validation",
      "Certifies Validation lineage presence in composition.",
      "Validation reference remains present and non-duplicated.",
      "composition/validationReference",
      5,
      Object.freeze(["validation", "gate"]),
    ),
    gate(
      "Manifest",
      "Manifest",
      "Certifies Manifest completeness for Platform composition.",
      "Manifest reference equals EIL-3:5/IntegrationRoutingManifest.",
      "composition/manifestReference",
      6,
      Object.freeze(["manifest", "gate"]),
    ),
    gate(
      "Platform",
      "Platform",
      "Certifies Platform completeness for Certification.",
      "Platform guarantees and compatibility collections are complete.",
      "guarantees",
      7,
      Object.freeze(["platform", "gate"]),
    ),
    gate(
      "Compatibility",
      "Compatibility",
      "Certifies compatibility declaration completeness.",
      "Compatibility scopes remain complete and descriptive only.",
      "compatibility",
      8,
      Object.freeze(["compatibility", "gate"]),
    ),
    gate(
      "Architecture",
      "Architecture",
      "Certifies architectural consistency across EIL-3 lineage.",
      "Release lineage spans Foundation through Platform.",
      "composition",
      9,
      Object.freeze(["architecture", "gate"]),
    ),
    gate(
      "Readiness",
      "Readiness",
      "Certifies Platform readiness for Freeze eligibility.",
      "Platform readiness equals ReadyForCertification.",
      "readiness",
      10,
      Object.freeze(["readiness", "gate"]),
    ),
    gate(
      "Compliance",
      "Compliance",
      "Certifies metadata-only architectural compliance.",
      "Runtime, networking, and routing engine behaviors remain absent.",
      "metadataOnly",
      11,
      Object.freeze(["compliance", "gate"]),
    ),
    gate(
      "Release",
      "Release",
      "Certifies release consistency for Freeze transition.",
      "Version and release lineage remain consistent at 1.0.0.",
      "composition/releaseLineage",
      12,
      Object.freeze(["release", "gate"]),
    ),
  ]);

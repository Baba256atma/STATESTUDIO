/**
 * EIL-5:7 — Integration Policy & Governance Certification Gates.
 *
 * Immutable declarative certification gates for Freeze eligibility.
 * Descriptive only. No gate execution.
 *
 * Ownership: owned exclusively by EIL-5:7.
 */

import { IntegrationPolicyGovernancePlatformIdentity } from "./integrationPolicyGovernancePlatform.ts";
import type {
  IntegrationPolicyGovernanceCertificationGate,
  PolicyGovernanceCertificationGateKey,
  PolicyGovernancePlatformReference,
} from "./integrationPolicyGovernanceCertificationTypes.ts";

const platformRef = (sourcePath: string): PolicyGovernancePlatformReference =>
  Object.freeze({
    platformId: IntegrationPolicyGovernancePlatformIdentity.canonicalId,
    platformNamespace: IntegrationPolicyGovernancePlatformIdentity.namespace,
    entryPoint: "integrationPolicyGovernancePlatform.ts" as const,
    sourcePath,
    preservesCanonicalReference: true as const,
    duplicatesPlatformValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const gate = (
  key: PolicyGovernanceCertificationGateKey,
  canonicalName: string,
  description: string,
  passCondition: string,
  sourcePath: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationPolicyGovernanceCertificationGate =>
  Object.freeze({
    gateId: `EIL-5:7/Gate/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    passCondition,
    sourceReference: platformRef(sourcePath),
    ownership: "EIL-5:7" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesGate: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve certification gates.
 */
export const IntegrationPolicyGovernanceCertificationGates: readonly IntegrationPolicyGovernanceCertificationGate[] =
  Object.freeze([
    gate(
      "Identity",
      "Identity",
      "Certifies canonical Platform identity integrity.",
      "Platform identity equals EIL-5:6/IntegrationPolicyGovernancePlatform.",
      "identity",
      1,
      Object.freeze(["identity", "gate"]),
    ),
    gate(
      "Namespace",
      "Namespace",
      "Certifies namespace integrity for Platform composition.",
      "Namespace equals nexora.eil.integration-policy-governance.platform.",
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
      "Manifest reference equals EIL-5:5/IntegrationPolicyGovernanceManifest.",
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
      "Certifies architectural consistency across EIL-5 lineage.",
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
      "Runtime, networking, and governance engine behaviors remain absent.",
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

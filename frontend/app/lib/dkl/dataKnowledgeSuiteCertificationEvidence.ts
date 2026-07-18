/**
 * DKL-9:7 — Data Knowledge Suite Certification Evidence.
 *
 * Immutable evidence descriptors supporting certification criteria.
 * Metadata-only references — no embedded documents or persistence.
 *
 * Ownership: owned exclusively by DKL-9:7.
 */

import { DataKnowledgeSuitePlatform } from "./dataKnowledgeSuitePlatform.ts";

const platform = DataKnowledgeSuitePlatform;

const evidence = (
  order: number,
  key: string,
  description: string,
  observation: string,
) =>
  Object.freeze({
    evidenceId: `DKL-9:7/Evidence/${key}`,
    description,
    observation,
    sourcePhase: "DKL-9:7" as const,
    targetReference: platform.identity.platformId,
    embedsDocuments: false as const,
    persists: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Evidence descriptors aligned to certification criteria. */
export const DataKnowledgeSuiteCertificationEvidence = Object.freeze([
  evidence(
    1,
    "PlatformIdentity",
    "Platform identity fields exposed by DataKnowledgeSuitePlatform.",
    `${platform.identity.platformId}; ${platform.identity.platformVersion}; ${platform.status}; ${platform.readiness}`,
  ),
  evidence(
    2,
    "PlatformDependency",
    "Platform dependency metadata declaring Manifest-only consumption.",
    platform.dependency.canonicalPath,
  ),
  evidence(
    3,
    "PlatformSections",
    "Canonical Platform section order and count.",
    `${platform.sectionCount}; ${platform.sectionOrder.join(",")}`,
  ),
  evidence(
    4,
    "CapabilityCatalog",
    "Suite capability catalog preserved on Platform.",
    `count=${platform.capabilityCatalog.length}`,
  ),
  evidence(
    5,
    "OwnershipBoundaries",
    "Ownership and boundary aggregates preserved on Platform.",
    `ownsSuite=${String(platform.ownership.aggregate.ownership.owns.includes("Suite composition"))}; runtimeEnforcement=${String(platform.boundaries.aggregate.boundaries.runtimeEnforcement)}`,
  ),
  evidence(
    6,
    "CompatibilityGuarantees",
    "Platform compatibility and guarantee collections.",
    `compatibility=${platform.compatibility.length}; guarantees=${platform.guarantees.length}`,
  ),
  evidence(
    7,
    "CanonicalReferences",
    "Manifest/Validation/Model/Registry/Foundation reference chain.",
    `${platform.manifest.identity.manifestId} → ${platform.validation.identity.validationId} → ${platform.model.identity.modelId} → ${platform.registry.identity.registryId} → ${platform.foundation.identity.foundationId}`,
  ),
  evidence(
    8,
    "CanonicalInventory",
    "Platform inventory derived through Manifest.",
    `sourced=${String(platform.inventory.sourcedThroughManifest)}; manifestTotal=${platform.inventory.manifestTotalEntryCount}; apiTotal=${platform.inventory.publicApiInventoryTotal}`,
  ),
  evidence(
    9,
    "PlatformMetadata",
    "Platform architecture and readiness metadata.",
    `${platform.metadata.architectureStatus}; ${platform.readiness}`,
  ),
  evidence(
    10,
    "RuntimeProhibitions",
    "Platform runtime prohibition flags.",
    `runtimeBehavior=${String(platform.runtimeBehavior)}; reconstructs=${String(platform.reconstructsUpstream)}`,
  ),
]);

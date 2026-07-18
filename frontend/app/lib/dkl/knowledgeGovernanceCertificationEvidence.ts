/**
 * DKL-8:7 — Knowledge Governance Certification Evidence.
 *
 * Immutable evidence descriptors supporting certification criteria.
 * Metadata-only references — no embedded documents or persistence.
 *
 * Ownership: owned exclusively by DKL-8:7.
 */

import { KnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";
import { KnowledgeGovernanceCertificationCriteria } from "./knowledgeGovernanceCertificationCriteria.ts";

const platform = KnowledgeGovernancePlatform;

const evidence = (
  order: number,
  key: string,
  description: string,
  observation: string,
) =>
  Object.freeze({
    evidenceId: `DKL-8:7/Evidence/${key}`,
    description,
    observation,
    sourcePhase: "DKL-8:7" as const,
    targetReference: platform.identity.platformId,
    embedsDocuments: false as const,
    persists: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Evidence descriptors aligned to certification criteria. */
export const KnowledgeGovernanceCertificationEvidence = Object.freeze([
  evidence(
    1,
    "PlatformIdentity",
    "Platform identity fields exposed by KnowledgeGovernancePlatform.",
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
    "ArchitectureChain",
    "Platform architecture phase and chain-id metadata.",
    `phases=${platform.architecture.phases.length}; completed=${platform.architecture.completedPhaseCount}`,
  ),
  evidence(
    4,
    "PublicSurface",
    "Platform API registry export names.",
    platform.apiRegistry.map((item) => item.exportName).join(", "),
  ),
  evidence(
    5,
    "ApiRegistry",
    "Platform API registry length and publicApiCount.",
    `apiRegistry=${platform.apiRegistry.length}; publicApiCount=${platform.counts.publicApiCount}`,
  ),
  evidence(
    6,
    "ManifestReference",
    "Manifest identity reached through Platform.manifest.",
    platform.manifest.identity.manifestId,
  ),
  evidence(
    7,
    "ValidationReference",
    "Validation identity reached through Platform.validation.",
    platform.validation.identity.validationId,
  ),
  evidence(
    8,
    "ModelReference",
    "Model identity reached through Platform.model.",
    platform.model.identity.modelId,
  ),
  evidence(
    9,
    "RegistryReference",
    "Registry identity reached through Platform.registry.",
    platform.registry.identity.registryId,
  ),
  evidence(
    10,
    "FoundationReference",
    "Foundation identity reached through Platform.foundation.",
    platform.foundation.identity.foundationId,
  ),
  evidence(
    11,
    "Ownership",
    "Ownership collection sizes preserved on Platform.",
    `owned=${platform.ownership.ownedCount}; nonOwned=${platform.ownership.nonOwnedCount}`,
  ),
  evidence(
    12,
    "Boundaries",
    "Boundary collection size preserved on Platform.",
    `boundaries=${platform.boundaries.length}`,
  ),
  evidence(
    13,
    "CanonicalInventory",
    "Platform inventory upstream values sourced through Manifest.",
    `manifestTotal=${platform.inventory.manifestTotalEntryCount}; registry=${platform.inventory.registryEntryCount}`,
  ),
  evidence(
    14,
    "InventoryConsistency",
    "Platform inventory consistency with held collections.",
    `totalEntryCount=${platform.inventory.totalEntryCount}`,
  ),
  evidence(
    15,
    "Immutability",
    "Platform immutability declarations and freeze state.",
    `immutable=${platform.immutable}; frozen=${Object.isFrozen(platform)}`,
  ),
  evidence(
    16,
    "Determinism",
    "Platform determinism declarations.",
    `deterministic=${platform.deterministic}`,
  ),
  evidence(
    17,
    "RuntimeProhibitions",
    "Platform runtime prohibition flags.",
    `runtime=${platform.runtimeBehavior}; enforces=${platform.enforces}; persists=${platform.persists}`,
  ),
  evidence(
    18,
    "FreezeReadiness",
    "Composite freeze-readiness evidence from criterion outcomes.",
    `criteriaPass=${KnowledgeGovernanceCertificationCriteria.every((item) => item.outcome === "Pass")}`,
  ),
]);

export const KnowledgeGovernanceCertificationEvidenceById = Object.freeze(
  Object.fromEntries(
    KnowledgeGovernanceCertificationEvidence.map((item) => [
      item.evidenceId,
      item,
    ]),
  ),
);

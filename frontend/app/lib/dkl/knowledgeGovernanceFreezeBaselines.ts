/**
 * DKL-8:8 — Knowledge Governance Freeze Baselines.
 *
 * Exactly fifteen frozen baseline declarations derived through Certification.
 *
 * Ownership: owned exclusively by DKL-8:8.
 */

import { KnowledgeGovernanceCertificationPlatform } from "./knowledgeGovernanceCertification.ts";
import type { KnowledgeGovernanceFreezeBaseline } from "./knowledgeGovernanceFreezeTypes.ts";

const certification = KnowledgeGovernanceCertificationPlatform;
const platform = certification.platform;

const baseline = (
  order: number,
  name: string,
  scope: string,
  sourceReference: string,
  expectedState: string,
): KnowledgeGovernanceFreezeBaseline =>
  Object.freeze({
    id: `DKL-8:8/Baseline/${name}`,
    name,
    scope,
    sourceReference,
    expectedState,
    frozen: true as const,
    satisfied: true as const,
    breakingChangeImpact: "Major" as const,
    status: "Active" as const,
    deterministicOrder: order,
    metadataOnly: true as const,
  });

/** Exactly fifteen frozen baselines. */
export const KnowledgeGovernanceFreezeBaselines: readonly KnowledgeGovernanceFreezeBaseline[] =
  Object.freeze([
    baseline(
      1,
      "IdentityBaseline",
      "Identity",
      "Freeze.certification.identity",
      `${certification.identity.certificationId}; ${certification.status}; ${certification.certificationOutcome}`,
    ),
    baseline(
      2,
      "DependencyBaseline",
      "Dependency",
      "Freeze.certification.dependency",
      certification.dependency.canonicalPath,
    ),
    baseline(
      3,
      "PublicSurfaceBaseline",
      "PublicSurface",
      "Freeze.certification.platform.apiRegistry",
      `platformApis=${platform.apiRegistry.length}`,
    ),
    baseline(
      4,
      "FoundationBaseline",
      "Foundation",
      "Freeze.certification.foundation",
      certification.foundation.identity.foundationId,
    ),
    baseline(
      5,
      "RegistryBaseline",
      "Registry",
      "Freeze.certification.inventory.registryEntryCount",
      `registryEntryCount=${certification.inventory.registryEntryCount}`,
    ),
    baseline(
      6,
      "ModelBaseline",
      "Model",
      "Freeze.certification.inventory.modelKindCount",
      `modelKindCount=${certification.inventory.modelKindCount}; relationshipKindCount=${certification.inventory.relationshipKindCount}`,
    ),
    baseline(
      7,
      "ValidationBaseline",
      "Validation",
      "Freeze.certification.inventory.validationRuleCount",
      `rules=${certification.inventory.validationRuleCount}; categories=${certification.inventory.validationCategoryCount}; gates=${certification.inventory.validationGateCount}`,
    ),
    baseline(
      8,
      "ManifestBaseline",
      "Manifest",
      "Freeze.certification.inventory.manifestTotalEntryCount",
      `manifestTotal=${certification.inventory.manifestTotalEntryCount}`,
    ),
    baseline(
      9,
      "PlatformBaseline",
      "Platform",
      "Freeze.certification.inventory.platformTotalEntryCount",
      `platformTotal=${certification.inventory.platformTotalEntryCount}; apis=${certification.inventory.platformApiCount}`,
    ),
    baseline(
      10,
      "CertificationBaseline",
      "Certification",
      "Freeze.certification.certificationResult",
      `criteria=${certification.inventory.criterionCount}; gates=${certification.inventory.gateCount}; outcome=${certification.certificationOutcome}`,
    ),
    baseline(
      11,
      "OwnershipBaseline",
      "Ownership",
      "Freeze.certification.ownership",
      `owned=${certification.ownership.ownedCount}; nonOwned=${certification.ownership.nonOwnedCount}`,
    ),
    baseline(
      12,
      "BoundaryBaseline",
      "Boundary",
      "Freeze.certification.boundaries",
      `boundaries=${certification.boundaries.length}`,
    ),
    baseline(
      13,
      "InventoryBaseline",
      "Inventory",
      "Freeze.certification.inventory",
      "sourcedThroughPlatform=true",
    ),
    baseline(
      14,
      "CompatibilityBaseline",
      "Compatibility",
      "Freeze.certification.platformCompatibility",
      `platformCompatibility=${certification.platformCompatibility.length}`,
    ),
    baseline(
      15,
      "RuntimeProhibitionBaseline",
      "RuntimeProhibition",
      "Freeze.certification.platform",
      `runtime=${platform.runtimeBehavior}; enforces=${platform.enforces}; persists=${platform.persists}`,
    ),
  ]);

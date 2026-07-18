/**
 * DKL-9:8 — Data Knowledge Suite Freeze Baselines.
 *
 * Exactly fifteen frozen baseline declarations derived through Certification.
 *
 * Ownership: owned exclusively by DKL-9:8.
 */

import { DataKnowledgeSuiteCertificationPlatform } from "./dataKnowledgeSuiteCertification.ts";
import type { DataKnowledgeSuiteFreezeBaseline } from "./dataKnowledgeSuiteFreezeTypes.ts";

const certification = DataKnowledgeSuiteCertificationPlatform;
const platform = certification.platform;

const baseline = (
  order: number,
  name: string,
  scope: string,
  sourceReference: string,
  expectedState: string,
): DataKnowledgeSuiteFreezeBaseline =>
  Object.freeze({
    id: `DKL-9:8/Baseline/${name}`,
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
export const DataKnowledgeSuiteFreezeBaselines: readonly DataKnowledgeSuiteFreezeBaseline[] =
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
      "PlatformBaseline",
      "Platform",
      "Freeze.certification.inventory.platformTotalEntryCount",
      `platformTotal=${certification.inventory.platformTotalEntryCount}; apis=${certification.inventory.platformApiCount}`,
    ),
    baseline(
      4,
      "ManifestBaseline",
      "Manifest",
      "Freeze.certification.inventory.manifestTotalEntryCount",
      `manifestTotal=${certification.inventory.manifestTotalEntryCount}`,
    ),
    baseline(
      5,
      "ValidationBaseline",
      "Validation",
      "Freeze.certification.inventory.validationRuleCount",
      `rules=${certification.inventory.validationRuleCount}; categories=${certification.inventory.validationCategoryCount}; gates=${certification.inventory.validationGateCount}`,
    ),
    baseline(
      6,
      "ModelBaseline",
      "Model",
      "Freeze.certification.inventory.modelKindCount",
      `modelKindCount=${certification.inventory.modelKindCount}`,
    ),
    baseline(
      7,
      "RegistryBaseline",
      "Registry",
      "Freeze.certification.inventory.registryTotalEntryCount",
      `registryTotalEntryCount=${certification.inventory.registryTotalEntryCount}`,
    ),
    baseline(
      8,
      "FoundationBaseline",
      "Foundation",
      "Freeze.certification.foundation",
      certification.foundation.identity.foundationId,
    ),
    baseline(
      9,
      "OwnershipBaseline",
      "Ownership",
      "Freeze.certification.ownership",
      `ownsSuite=${String(certification.ownership.aggregate.ownership.owns.includes("Suite composition"))}`,
    ),
    baseline(
      10,
      "BoundariesBaseline",
      "Boundaries",
      "Freeze.certification.boundaries",
      `runtimeEnforcement=${String(certification.boundaries.aggregate.boundaries.runtimeEnforcement)}; lowerLevel=${String(certification.boundaries.aggregate.boundaries.importsLowerLevelDklModules)}`,
    ),
    baseline(
      11,
      "InventoryBaseline",
      "Inventory",
      "Freeze.certification.inventory",
      `sourcedThroughPlatform=${String(certification.inventory.sourcedThroughPlatform)}; capabilityCount=${certification.inventory.capabilityCount}; publicApiInventoryTotal=${certification.inventory.publicApiInventoryTotal}`,
    ),
    baseline(
      12,
      "CompatibilityBaseline",
      "Compatibility",
      "Freeze.certification.platformCompatibility",
      `platformCompatibility=${certification.platformCompatibility.length}`,
    ),
    baseline(
      13,
      "PublicSurfaceBaseline",
      "Public Surface",
      "Freeze.certification.platform.apiRegistry",
      `platformApis=${platform.apiRegistry.length}`,
    ),
    baseline(
      14,
      "RuntimeProhibitionsBaseline",
      "Runtime Prohibitions",
      "Freeze.certification.platform",
      `runtime=${String(platform.runtimeBehavior)}; reconstructs=${String(platform.reconstructsUpstream)}; enforces=${String(platform.runtimeEnforcement)}`,
    ),
    baseline(
      15,
      "ReleaseReadinessBaseline",
      "Release Readiness",
      "Freeze.certification.certificationResult",
      `outcome=${certification.certificationOutcome}; criteria=${certification.inventory.criterionCount}; gates=${certification.inventory.gateCount}; readyForFreeze=${String(certification.certificationResult.readyForFreeze)}`,
    ),
  ]);

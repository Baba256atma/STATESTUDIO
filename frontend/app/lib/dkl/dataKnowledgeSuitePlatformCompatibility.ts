/**
 * DKL-9:6 — Data Knowledge Suite Platform Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Count-bearing statements derive from Manifest inventory.
 *
 * Ownership: owned exclusively by DKL-9:6.
 */

import { DataKnowledgeSuiteManifestPlatform } from "./dataKnowledgeSuiteManifest.ts";
import type { DataKnowledgeSuitePlatformCompatibilityDeclaration } from "./dataKnowledgeSuitePlatformTypes.ts";

const manifest = DataKnowledgeSuiteManifestPlatform;

const compatibility = (
  order: number,
  name: string,
  scope: string,
  sourceReference: string,
): DataKnowledgeSuitePlatformCompatibilityDeclaration =>
  Object.freeze({
    id: `DKL-9:6/Compatibility/${String(order).padStart(2, "0")}`,
    name,
    scope,
    compatible: true as const,
    protected: true as const,
    sourceReference,
    status: "Compatible" as const,
    deterministicOrder: order,
  });

/** Exactly twelve Platform compatibility declarations. */
export const DataKnowledgeSuitePlatformCompatibility: readonly DataKnowledgeSuitePlatformCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      1,
      "FoundationCompatible",
      "DKL-9:1",
      manifest.upstream.foundation.identity.foundationId,
    ),
    compatibility(
      2,
      "RegistryCompatible",
      "DKL-9:2",
      manifest.upstream.registry.identity.registryId,
    ),
    compatibility(
      3,
      "ModelCompatible",
      "DKL-9:3",
      manifest.upstream.model.identity.modelId,
    ),
    compatibility(
      4,
      "ValidationCompatible",
      "DKL-9:4",
      manifest.upstreamValidation.identity.validationId,
    ),
    compatibility(
      5,
      "ManifestCompatible",
      "DKL-9:5",
      manifest.identity.manifestId,
    ),
    compatibility(
      6,
      "CapabilityCatalogCompatible",
      "SuiteCapabilities",
      `capabilityCount:${manifest.inventory.capabilityCount}`,
    ),
    compatibility(
      7,
      "PublicApiInventoryCompatible",
      "SuitePublicApis",
      `publicApiInventoryTotal:${manifest.inventory.publicApiInventoryTotal}`,
    ),
    compatibility(
      8,
      "ValidationRulesCompatible",
      "SuiteValidation",
      `validationRuleCount:${manifest.inventory.validationRuleCount}`,
    ),
    compatibility(
      9,
      "FutureCertificationCompatible",
      "DKL-9:7",
      "DKL-9:7/DataKnowledgeSuiteCertification",
    ),
    compatibility(
      10,
      "FutureFreezeCompatible",
      "DKL-9:8",
      "DKL-9:8/DataKnowledgeSuiteFreeze",
    ),
    compatibility(
      11,
      "FuturePublicIndexCompatible",
      "DKL-9:9",
      "DKL-9:9/DataKnowledgeSuitePublicIndex",
    ),
    compatibility(
      12,
      "ReadyForCertificationCompatible",
      "DKL-9:6",
      "ReadyForCertification",
    ),
  ]);

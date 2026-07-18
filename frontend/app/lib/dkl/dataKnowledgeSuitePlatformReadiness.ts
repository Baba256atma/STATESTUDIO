/**
 * DKL-9:6 — Data Knowledge Suite Platform Readiness.
 *
 * Platform readiness and public API declarations.
 *
 * Ownership: owned exclusively by DKL-9:6.
 */

import type { DataKnowledgeSuitePlatformPublicApiDeclaration } from "./dataKnowledgeSuitePlatformTypes.ts";

export const DataKnowledgeSuitePlatformReadinessValue =
  "ReadyForCertification" as const;

export const DataKnowledgeSuitePlatformArchitectureStatus =
  "CompleteThroughPlatform" as const;

const api = (
  exportName: string,
  description: string,
  order: number,
): DataKnowledgeSuitePlatformPublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-9:6/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

/** Exactly eight public API declarations for DKL-9:6. */
export const DataKnowledgeSuitePlatformPublicApis: readonly DataKnowledgeSuitePlatformPublicApiDeclaration[] =
  Object.freeze([
    api("DataKnowledgeSuitePlatformId", "Platform identity constant.", 1),
    api("DataKnowledgeSuitePlatformVersion", "Platform version constant.", 2),
    api("DataKnowledgeSuitePlatformName", "Platform name constant.", 3),
    api(
      "DataKnowledgeSuitePlatformNamespace",
      "Platform namespace constant.",
      4,
    ),
    api("DataKnowledgeSuitePlatformStatus", "Platform status constant.", 5),
    api(
      "DataKnowledgeSuitePlatformReadiness",
      "Platform readiness constant.",
      6,
    ),
    api("DataKnowledgeSuitePlatform", "Canonical Platform aggregate.", 7),
    api(
      "getDataKnowledgeSuitePlatformSummary",
      "Deterministic frozen Platform summary helper.",
      8,
    ),
  ]);

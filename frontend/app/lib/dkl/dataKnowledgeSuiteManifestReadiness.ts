/**
 * DKL-9:5 — Data Knowledge Suite Manifest Readiness.
 *
 * Manifest readiness and public API declarations.
 *
 * Ownership: owned exclusively by DKL-9:5.
 */

import type { DataKnowledgeSuiteManifestPublicApiDeclaration } from "./dataKnowledgeSuiteManifestTypes.ts";

export const DataKnowledgeSuiteManifestReadinessValue =
  "ReadyForPlatform" as const;

export const DataKnowledgeSuiteManifestArchitectureStatus =
  "CompleteThroughManifest" as const;

const api = (
  exportName: string,
  description: string,
  order: number,
): DataKnowledgeSuiteManifestPublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-9:5/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

/** Exactly eight public API declarations for DKL-9:5. */
export const DataKnowledgeSuiteManifestPublicApis: readonly DataKnowledgeSuiteManifestPublicApiDeclaration[] =
  Object.freeze([
    api("DataKnowledgeSuiteManifestId", "Manifest identity constant.", 1),
    api("DataKnowledgeSuiteManifestVersion", "Manifest version constant.", 2),
    api("DataKnowledgeSuiteManifestName", "Manifest name constant.", 3),
    api(
      "DataKnowledgeSuiteManifestNamespace",
      "Manifest namespace constant.",
      4,
    ),
    api("DataKnowledgeSuiteManifestStatus", "Manifest status constant.", 5),
    api(
      "DataKnowledgeSuiteManifestReadiness",
      "Manifest readiness constant.",
      6,
    ),
    api(
      "DataKnowledgeSuiteManifestPlatform",
      "Canonical Manifest platform aggregate.",
      7,
    ),
    api(
      "getDataKnowledgeSuiteManifestSummary",
      "Deterministic frozen Manifest summary helper.",
      8,
    ),
  ]);

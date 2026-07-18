/**
 * DKL-4:1 — Knowledge Modeling Dependencies.
 *
 * Immutable layer dependency declarations. Consumes DKL-3 exclusively through
 * the Data Understanding Public Index. Metadata only.
 *
 * Ownership: owned exclusively by DKL-4:1.
 */

import {
  DataUnderstandingPublicIndexId,
  DataUnderstandingPublicIndexVersion,
  DataUnderstandingPublicReleaseStatus,
  getDataUnderstandingPublicReleaseMetadata,
} from "./dataUnderstandingPublicIndex.ts";

const dkl3Release = getDataUnderstandingPublicReleaseMetadata();

/** Canonical immutable Knowledge Modeling dependency declarations. */
export const KnowledgeModelingDependencies = Object.freeze({
  dependenciesId: "DKL-4:1/KnowledgeModelingDependencies",
  sourcePhase: "DKL-4:1",
  allowed: Object.freeze([
    Object.freeze({
      dependencyId: "DEP-DKL3-PUBLIC-INDEX",
      name: "DKL-3 Data Understanding Public Index",
      module: "dataUnderstandingPublicIndex.ts",
      phase: "DKL-3:9",
      publicIndexId: DataUnderstandingPublicIndexId,
      publicIndexVersion: DataUnderstandingPublicIndexVersion,
      releaseStatus: DataUnderstandingPublicReleaseStatus,
      readyForDKL4: dkl3Release.ReadyForDKL4 === true,
      required: true,
      futurePhase: false,
    }),
  ]),
  entryCount: 1,
  noFuturePhases: true,
  forbidden: Object.freeze([
    "DKL-3:1 through DKL-3:8 internal modules",
    "DKL-4:2+",
    "DKL-5+",
    "data ingestion",
    "parser internals",
    "pipeline internals",
    "Persistence",
    "Database",
    "Engine",
    "Advisor",
    "Director",
    "Scene",
    "UI",
    "OPS",
    "BUS",
    "NEA",
    "EVE",
    "external AI or LLM services",
    "external packages",
  ]),
  notes: Object.freeze({
    publicApiOnly: true,
    forwardOnly: true,
    cycleFree: true,
    dkl3ViaPublicIndexOnly: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * DKL-3:5 — Data Understanding Manifest Dependencies.
 *
 * Immutable dependency inventory for approved upstream platforms only.
 * Never includes future phases or implementation details.
 *
 * Ownership: owned exclusively by DKL-3:5.
 */

import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";
import {
  DataUnderstandingFoundation,
  DataUnderstandingFoundationVersion,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingRegistry,
  DataUnderstandingRegistryVersion,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingModel,
  DataUnderstandingModelVersion,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingValidation,
  DataUnderstandingValidationVersion,
} from "./dataUnderstandingValidation.ts";
import type { ManifestDependencyEntry } from "./dataUnderstandingManifestTypes.ts";

const dep = (
  dependencyId: string,
  dependencyName: string,
  module: string,
  version: string | null,
  phase: string,
  readiness: string,
): ManifestDependencyEntry =>
  Object.freeze({
    dependencyId,
    dependencyName,
    module,
    version,
    phase,
    readiness,
    required: true as const,
    futurePhase: false as const,
  });

const ENTRIES: readonly ManifestDependencyEntry[] = Object.freeze([
  dep(
    "dep-dkl-2-public-index",
    "DKL-2 Public Index",
    "dataSourceKnowledgeRegistryPublicIndex.ts",
    DataSourceKnowledgeRegistryPublicIndexVersion,
    "DKL-2:9",
    "Released",
  ),
  dep(
    "dep-pipeline-understanding-platform",
    "Pipeline Understanding Platform",
    "pipelineUnderstandingPlatform.ts",
    PipelineUnderstandingPlatform.summary.platformVersion,
    "UI-PIPE-1:3",
    PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake
      ? "ReadyForDKL3Intake"
      : "NotReady",
  ),
  dep(
    "dep-dkl-3-1-foundation",
    "DKL-3:1 Foundation",
    "dataUnderstandingFoundation.ts",
    DataUnderstandingFoundationVersion,
    "DKL-3:1",
    DataUnderstandingFoundation.readiness.ReadyForRegistry
      ? "ReadyForRegistry"
      : "NotReady",
  ),
  dep(
    "dep-dkl-3-2-registry",
    "DKL-3:2 Registry",
    "dataUnderstandingRegistry.ts",
    DataUnderstandingRegistryVersion,
    "DKL-3:2",
    DataUnderstandingRegistry.readiness.ReadyForModel ? "ReadyForModel" : "NotReady",
  ),
  dep(
    "dep-dkl-3-3-model",
    "DKL-3:3 Model",
    "dataUnderstandingModel.ts",
    DataUnderstandingModelVersion,
    "DKL-3:3",
    DataUnderstandingModel.readiness.ReadyForValidation
      ? "ReadyForValidation"
      : "NotReady",
  ),
  dep(
    "dep-dkl-3-4-validation",
    "DKL-3:4 Validation",
    "dataUnderstandingValidation.ts",
    DataUnderstandingValidationVersion,
    "DKL-3:4",
    DataUnderstandingValidation.readiness.ReadyForManifest
      ? "ReadyForManifest"
      : "NotReady",
  ),
]);

const FORBIDDEN = Object.freeze([
  "DKL-3:6+",
  "DKL-4",
  "Engine",
  "Advisor",
  "Scene",
  "Business Objects",
  "Knowledge Graph",
  "Persistence",
  "AI",
  "Database",
  "Parser internals",
  "Pipeline internals",
  "UI",
  "External packages",
]);

/** Canonical immutable dependency inventory. */
export const DataUnderstandingManifestDependencies = Object.freeze({
  dependencyInventoryId: "DKL-3:5/ManifestDependencies",
  sourcePhase: "DKL-3:5",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  forbidden: FORBIDDEN,
  allRequired: true,
  noFuturePhases: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

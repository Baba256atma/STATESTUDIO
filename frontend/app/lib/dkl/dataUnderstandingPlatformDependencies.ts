/**
 * DKL-3:6 — Data Understanding Platform Dependencies.
 *
 * Immutable dependency declarations for approved upstream platforms only.
 * Future phases are forbidden.
 *
 * Ownership: owned exclusively by DKL-3:6.
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
import {
  DataUnderstandingManifest,
  DataUnderstandingManifestVersion,
} from "./dataUnderstandingManifest.ts";
import type { PlatformDependencyEntry } from "./dataUnderstandingPlatformTypes.ts";

const dep = (
  dependencyId: string,
  dependencyName: string,
  module: string,
  version: string | null,
  phase: string,
  readiness: string,
): PlatformDependencyEntry =>
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

const ENTRIES: readonly PlatformDependencyEntry[] = Object.freeze([
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
    "dep-dkl-2-public-index",
    "DKL-2 Public Index",
    "dataSourceKnowledgeRegistryPublicIndex.ts",
    DataSourceKnowledgeRegistryPublicIndexVersion,
    "DKL-2:9",
    "Released",
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
  dep(
    "dep-dkl-3-5-manifest",
    "DKL-3:5 Manifest",
    "dataUnderstandingManifest.ts",
    DataUnderstandingManifestVersion,
    "DKL-3:5",
    DataUnderstandingManifest.readiness.ReadyForPlatform
      ? "ReadyForPlatform"
      : "NotReady",
  ),
]);

const FORBIDDEN = Object.freeze([
  "DKL-3:7+",
  "DKL-4",
  "Business Objects",
  "Knowledge Graph",
  "Engine",
  "Advisor",
  "Scene",
  "Persistence",
  "AI",
  "Database",
  "Parser internals",
  "Pipeline internals",
  "UI",
  "External packages",
]);

/** Canonical immutable platform dependency declarations. */
export const DataUnderstandingPlatformDependencies = Object.freeze({
  dependencyId: "DKL-3:6/PlatformDependencies",
  sourcePhase: "DKL-3:6",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  forbidden: FORBIDDEN,
  allRequired: true,
  noFuturePhases: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

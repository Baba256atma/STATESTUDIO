/**
 * DKL-3:8 — Data Understanding Freeze.
 *
 * The canonical immutable Freeze aggregate for the Data Understanding Platform.
 * Publishes exactly eight runtime exports. Permanently locks Foundation through
 * Certification for Public Index readiness. Freeze only — no understanding,
 * no validation execution, no certification execution, no Business Objects,
 * no Knowledge Graph, no AI, no Engine, no persistence.
 *
 * Ownership: owned exclusively by DKL-3:8.
 */

import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";
import {
  DataUnderstandingFoundation,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingRegistry,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingModel,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingValidation,
} from "./dataUnderstandingValidation.ts";
import {
  DataUnderstandingManifest,
} from "./dataUnderstandingManifest.ts";
import {
  DataUnderstandingPlatform,
  DataUnderstandingPlatformDependencies,
} from "./dataUnderstandingPlatform.ts";
import {
  DataUnderstandingCertification,
} from "./dataUnderstandingCertification.ts";
import {
  DATA_UNDERSTANDING_FREEZE_IDENTITY,
  DATA_UNDERSTANDING_FREEZE_VERSION,
  DataUnderstandingFreezeRegistry,
} from "./dataUnderstandingFreezeRegistry.ts";
import { DataUnderstandingFreezeCompatibility } from "./dataUnderstandingFreezeCompatibility.ts";
import { DataUnderstandingFreezeLocks } from "./dataUnderstandingFreezeLocks.ts";
import { DataUnderstandingFreezeManifest } from "./dataUnderstandingFreezeManifest.ts";
import { DataUnderstandingFreezeSummary } from "./dataUnderstandingFreezeSummary.ts";

export const DataUnderstandingFreezeVersion: string =
  DATA_UNDERSTANDING_FREEZE_VERSION;

export const DataUnderstandingFreezeIdentity =
  DATA_UNDERSTANDING_FREEZE_IDENTITY;

/**
 * Canonical immutable Data Understanding Freeze aggregate.
 *
 * Exposes `certifiedPlatform` and `certification` by reference so DKL-3:9 can
 * reach every prior phase through Freeze alone (DKL-2:8 → DKL-2:9 pattern).
 * No new runtime exports.
 */
export const DataUnderstandingFreeze = Object.freeze({
  identity: DataUnderstandingFreezeIdentity,
  version: DataUnderstandingFreezeVersion,
  registry: DataUnderstandingFreezeRegistry,
  compatibility: DataUnderstandingFreezeCompatibility,
  locks: DataUnderstandingFreezeLocks,
  manifest: DataUnderstandingFreezeManifest,
  summary: DataUnderstandingFreezeSummary,
  frozenSurfaces: Object.freeze({
    foundation: Object.freeze({
      identity: DataUnderstandingFoundation.identity,
      readiness: DataUnderstandingFoundation.readiness.ReadyForRegistry,
      frozen: true,
    }),
    registry: Object.freeze({
      identity: DataUnderstandingRegistry.identity,
      readiness: DataUnderstandingRegistry.readiness.ReadyForModel,
      frozen: true,
    }),
    model: Object.freeze({
      identity: DataUnderstandingModel.identity,
      readiness: DataUnderstandingModel.readiness.ReadyForValidation,
      frozen: true,
    }),
    validation: Object.freeze({
      identity: DataUnderstandingValidation.identity,
      readiness: DataUnderstandingValidation.readiness.ReadyForManifest,
      frozen: true,
    }),
    manifest: Object.freeze({
      identity: DataUnderstandingManifest.identity,
      readiness: DataUnderstandingManifest.readiness.ReadyForPlatform,
      frozen: true,
    }),
    platform: Object.freeze({
      identity: DataUnderstandingPlatform.identity,
      readiness: DataUnderstandingPlatform.readiness.ReadyForCertification,
      frozen: true,
    }),
    certification: Object.freeze({
      identity: DataUnderstandingCertification.identity,
      readiness: DataUnderstandingCertification.readiness.ReadyForFreeze,
      frozen: true,
    }),
  }),
  dependencies: Object.freeze({
    dkl2PublicIndex: Object.freeze({
      module: "dataSourceKnowledgeRegistryPublicIndex.ts",
      version: DataSourceKnowledgeRegistryPublicIndexVersion,
    }),
    pipelineUnderstandingPlatform: Object.freeze({
      module: "pipelineUnderstandingPlatform.ts",
      readyForDKL3Intake:
        PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake === true,
    }),
    platformDependencies: DataUnderstandingPlatformDependencies,
    certification: DataUnderstandingCertification,
    forbidden: Object.freeze([
      "DKL-3:9+",
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
    ]),
  }),
  /**
   * Canonical DKL-3:6 Platform aggregate — Public Index gateway only.
   * Same reference identity as DataUnderstandingPlatform.
   */
  certifiedPlatform: DataUnderstandingPlatform,
  /**
   * Canonical DKL-3:7 Certification aggregate — Public Index gateway only.
   * Same reference identity as DataUnderstandingCertification.
   */
  certification: DataUnderstandingCertification,
  readiness: DataUnderstandingFreezeManifest.readiness,
  freezeStatus: "Frozen" as const,
  stability: "Stable" as const,
  nextPhase: "DKL-3:9 — Data Understanding Public Index",
  metadata: Object.freeze({
    metadataOnly: true,
    freezeOnly: true,
    deterministic: true,
    immutable: true,
    semanticUnderstandingPerformed: false,
    validationExecuted: false,
    certificationExecuted: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
  }),
  metadataOnly: true,
  freezeOnly: true,
  immutable: true,
});

export {
  DataUnderstandingFreezeRegistry,
  DataUnderstandingFreezeCompatibility,
  DataUnderstandingFreezeLocks,
  DataUnderstandingFreezeManifest,
  DataUnderstandingFreezeSummary,
};

/**
 * DKL-3:7 — Data Understanding Certification.
 *
 * The canonical immutable Certification aggregate for the Data Understanding
 * Platform. Publishes exactly eight runtime exports. Certifies Foundation
 * through Platform for Freeze readiness. Certification only — no understanding,
 * no validation execution, no Business Objects, no Knowledge Graph, no AI,
 * no Engine, no persistence.
 *
 * Ownership: owned exclusively by DKL-3:7.
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
  DATA_UNDERSTANDING_CERTIFICATION_IDENTITY,
  DATA_UNDERSTANDING_CERTIFICATION_VERSION,
  DataUnderstandingCertificationRegistry,
} from "./dataUnderstandingCertificationRegistry.ts";
import { DataUnderstandingCertificationCompatibility } from "./dataUnderstandingCertificationCompatibility.ts";
import { DataUnderstandingCertificationEvidence } from "./dataUnderstandingCertificationEvidence.ts";
import { DataUnderstandingCertificationManifest } from "./dataUnderstandingCertificationManifest.ts";
import { DataUnderstandingCertificationReport } from "./dataUnderstandingCertificationReport.ts";

export const DataUnderstandingCertificationVersion: string =
  DATA_UNDERSTANDING_CERTIFICATION_VERSION;

export const DataUnderstandingCertificationIdentity =
  DATA_UNDERSTANDING_CERTIFICATION_IDENTITY;

/** Canonical immutable Data Understanding Certification aggregate. */
export const DataUnderstandingCertification = Object.freeze({
  identity: DataUnderstandingCertificationIdentity,
  version: DataUnderstandingCertificationVersion,
  registry: DataUnderstandingCertificationRegistry,
  compatibility: DataUnderstandingCertificationCompatibility,
  evidence: DataUnderstandingCertificationEvidence,
  manifest: DataUnderstandingCertificationManifest,
  report: DataUnderstandingCertificationReport,
  gates: DataUnderstandingCertificationRegistry.gates,
  certifiedSurfaces: Object.freeze({
    foundation: Object.freeze({
      identity: DataUnderstandingFoundation.identity,
      readiness: DataUnderstandingFoundation.readiness.ReadyForRegistry,
      certified: true,
    }),
    registry: Object.freeze({
      identity: DataUnderstandingRegistry.identity,
      readiness: DataUnderstandingRegistry.readiness.ReadyForModel,
      certified: true,
    }),
    model: Object.freeze({
      identity: DataUnderstandingModel.identity,
      readiness: DataUnderstandingModel.readiness.ReadyForValidation,
      certified: true,
    }),
    validation: Object.freeze({
      identity: DataUnderstandingValidation.identity,
      readiness: DataUnderstandingValidation.readiness.ReadyForManifest,
      certified: true,
    }),
    manifest: Object.freeze({
      identity: DataUnderstandingManifest.identity,
      readiness: DataUnderstandingManifest.readiness.ReadyForPlatform,
      certified: true,
    }),
    platform: Object.freeze({
      identity: DataUnderstandingPlatform.identity,
      readiness: DataUnderstandingPlatform.readiness.ReadyForCertification,
      certified: true,
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
    forbidden: Object.freeze([
      "DKL-3:8+",
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
  readiness: DataUnderstandingCertificationManifest.readiness,
  status: "Certified" as const,
  nextPhase: "DKL-3:8 — Data Understanding Freeze",
  metadata: Object.freeze({
    metadataOnly: true,
    certificationOnly: true,
    deterministic: true,
    immutable: true,
    semanticUnderstandingPerformed: false,
    validationExecuted: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
  }),
  metadataOnly: true,
  certificationOnly: true,
  immutable: true,
});

export {
  DataUnderstandingCertificationRegistry,
  DataUnderstandingCertificationCompatibility,
  DataUnderstandingCertificationEvidence,
  DataUnderstandingCertificationManifest,
  DataUnderstandingCertificationReport,
};

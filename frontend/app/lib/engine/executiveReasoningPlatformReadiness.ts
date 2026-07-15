import { getExecutiveReasoningManifestSummary } from "./executiveReasoningManifestPlatform.ts";
import { getExecutiveReasoningModelSummary } from "./executiveReasoningModelIndex.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import { getReasoningRegistrySummary } from "./executiveReasoningRegistryIndex.ts";
import {
  getExecutiveReasoningValidationStatus,
  getExecutiveReasoningValidationSummary,
} from "./executiveReasoningValidationPlatform.ts";

const foundationPass = ExecutiveReasoningPipelineFoundation.platformId === "ENG-6:1" ? "PASS" : "FAIL";
const registryPass = getReasoningRegistrySummary().componentCount === 8 ? "PASS" : "FAIL";
const modelPass = getExecutiveReasoningModelSummary().modelCount === 8 ? "PASS" : "FAIL";
const validationPass = getExecutiveReasoningValidationStatus() === "PASS"
  && getExecutiveReasoningValidationSummary().totalRuleCount === 30
  ? "PASS"
  : "FAIL";
const manifestPass = getExecutiveReasoningManifestSummary().releaseReadiness === "ReadyForPlatform"
  ? "PASS"
  : "FAIL";

const layerStatuses = Object.freeze({
  Foundation: foundationPass,
  Registry: registryPass,
  Model: modelPass,
  Validation: validationPass,
  Manifest: manifestPass,
} as const);

const allPass = Object.values(layerStatuses).every((status) => status === "PASS");

/**
 * Immutable readiness metadata derived solely from declared layer metadata.
 */
export const ExecutiveReasoningPlatformReadiness = Object.freeze({
  id: "eng-6-platform-readiness",
  name: "Executive Reasoning Platform Readiness",
  phase: "ENG-6:6",
  owner: "ENG-6",
  Foundation: layerStatuses.Foundation,
  Registry: layerStatuses.Registry,
  Model: layerStatuses.Model,
  Validation: layerStatuses.Validation,
  Manifest: layerStatuses.Manifest,
  platformStatus: allPass ? "READY" : "NOT_READY",
  layers: layerStatuses,
  gates: Object.freeze([
    Object.freeze({ id: "eng-6-platform-gate-foundation", layer: "Foundation", status: layerStatuses.Foundation } as const),
    Object.freeze({ id: "eng-6-platform-gate-registry", layer: "Registry", status: layerStatuses.Registry } as const),
    Object.freeze({ id: "eng-6-platform-gate-model", layer: "Model", status: layerStatuses.Model } as const),
    Object.freeze({ id: "eng-6-platform-gate-validation", layer: "Validation", status: layerStatuses.Validation } as const),
    Object.freeze({ id: "eng-6-platform-gate-manifest", layer: "Manifest", status: layerStatuses.Manifest } as const),
    Object.freeze({
      id: "eng-6-platform-gate-platform",
      layer: "Platform",
      status: allPass ? "READY" : "NOT_READY",
    } as const),
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

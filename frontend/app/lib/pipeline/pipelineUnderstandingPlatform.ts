/**
 * UI-PIPE-1:3 — Pipeline Understanding Contract Platform.
 *
 * Canonical public API surface connecting reviewed Pipeline Preview to future
 * DKL-3 Data Understanding intake. Exactly eight runtime exports.
 *
 * Ownership: owned exclusively by UI-PIPE-1:3.
 * Does not execute DKL-3. No persistence. No AI. No side effects.
 */

import { PipelineUnderstandingContract } from "./pipelineUnderstandingContract.ts";
import { PipelineUnderstandingCompatibility } from "./pipelineUnderstandingCompatibility.ts";
import { PipelineUnderstandingManifest } from "./pipelineUnderstandingManifest.ts";
import {
  createPipelineUnderstandingIntakePackage,
  getPipelineUnderstandingContractSummary,
  validatePipelineUnderstandingIntakePackage,
} from "./pipelineUnderstandingIntakePackage.ts";
import { PipelineUnderstandingValidationRules } from "./pipelineUnderstandingValidation.ts";

const PLATFORM_VERSION = "1.0.0";

/** Canonical immutable UI-PIPE-1:3 platform aggregate. */
export const PipelineUnderstandingPlatform = Object.freeze({
  identity: PipelineUnderstandingContract,
  contract: PipelineUnderstandingContract,
  validationRules: PipelineUnderstandingValidationRules,
  compatibility: PipelineUnderstandingCompatibility,
  manifest: PipelineUnderstandingManifest,
  summary: Object.freeze({
    platformId: "UI-PIPE-1:3",
    platformVersion: PLATFORM_VERSION,
    platformName: "Pipeline-to-DKL-3 Handoff Contract",
    completionStatus: Object.freeze([
      "PipelineToDKL3ContractComplete",
      "ContractValidated",
      "SourceReferencesResolved",
      "SelectedColumnsProjected",
      "PreviewEvidenceBounded",
      "DiagnosticsPreserved",
      "TenantBoundaryProtected",
      "WorkspaceBoundaryProtected",
      "SessionBoundaryProtected",
      "PreviewOnly",
      "PersistenceFree",
      "SemanticFree",
      "AIFree",
      "Deterministic",
      "Immutable",
      "ReadyForDKL3Intake",
    ]),
    nextPhase: "DKL-3:1 — Data Understanding Foundation",
  }),
  boundaries: Object.freeze({
    previewOnly: true,
    persistenceFree: true,
    semanticFree: true,
    aiFree: true,
    dkl3ExecutionForbidden: true,
  }),
  readiness: Object.freeze({
    ContractComplete: true,
    HandoffValidated: true,
    PreviewOnly: true,
    ReadyForDKL3Intake: true,
  }),
});

export {
  PipelineUnderstandingContract,
  PipelineUnderstandingValidationRules,
  PipelineUnderstandingCompatibility,
  PipelineUnderstandingManifest,
  createPipelineUnderstandingIntakePackage,
  validatePipelineUnderstandingIntakePackage,
  getPipelineUnderstandingContractSummary,
};

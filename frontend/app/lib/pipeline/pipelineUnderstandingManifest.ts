/**
 * UI-PIPE-1:3 — Pipeline Understanding Contract Manifest.
 *
 * Immutable manifest describing the Pipeline-to-DKL-3 handoff contract.
 *
 * Ownership: owned exclusively by UI-PIPE-1:3.
 */

import { PipelineUnderstandingContract } from "./pipelineUnderstandingContract.ts";
import type { PipelineUnderstandingContractManifest } from "./pipelineUnderstandingContractTypes.ts";

/** Canonical immutable contract manifest. */
export const PipelineUnderstandingManifest: PipelineUnderstandingContractManifest =
  Object.freeze({
    contractId: PipelineUnderstandingContract.contractId,
    version: PipelineUnderstandingContract.contractVersion,
    name: PipelineUnderstandingContract.contractName,
    owner: PipelineUnderstandingContract.owner,
    sourcePlatforms: Object.freeze(["UI-PIPE-1", "INT-1:2", "DKL-2"]),
    targetPlatform: "DKL-3",
    sectionCount: 9,
    validationRuleCount: 18,
    compatibilityCount: 8,
    requiredIdentityFields: Object.freeze([
      "intakeId",
      "contractVersion",
      "tenantId",
      "workspaceId",
      "sessionId",
      "datasetId",
      "handoffId",
      "sourcePhase",
      "targetPhase",
    ]),
    requiredSourceReferences: Object.freeze([
      "sourceRegistryId",
      "connectorRegistryId",
      "contentTypeRegistryId",
      "dklRegistryVersion",
    ]),
    metadataOnly: true,
    previewOnly: true,
    deterministic: true,
    immutable: true,
    persistenceFree: true,
    semanticFree: true,
    aiFree: true,
    readiness: "ReadyForDKL3Intake",
    nextPhase: "DKL-3:1",
  });

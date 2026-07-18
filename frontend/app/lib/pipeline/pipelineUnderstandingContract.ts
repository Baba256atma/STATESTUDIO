/**
 * UI-PIPE-1:3 — Pipeline Understanding Contract identity and descriptor.
 *
 * Ownership: owned exclusively by UI-PIPE-1:3.
 */

import type { PipelineUnderstandingContractIdentity } from "./pipelineUnderstandingContractTypes.ts";

export const PIPELINE_UNDERSTANDING_CONTRACT_VERSION = "1.0.0";

/** Canonical immutable contract identity for Pipeline → DKL-3. */
export const PipelineUnderstandingContract: PipelineUnderstandingContractIdentity =
  Object.freeze({
    contractId: "UI-PIPE-1:3/PipelineUnderstandingContract",
    contractVersion: PIPELINE_UNDERSTANDING_CONTRACT_VERSION,
    contractName: "Pipeline-to-DKL-3 Handoff Contract",
    contractNamespace: "nexora.pipeline.understanding-contract",
    owner: "UI-PIPE-1 Pipeline Page",
    sourcePhase: "UI-PIPE-1:3",
    sourcePlatform: "UI-PIPE-1",
    targetPlatform: "DKL-3",
    status: "ContractComplete",
    readiness: "ReadyForDKL3Intake",
  });

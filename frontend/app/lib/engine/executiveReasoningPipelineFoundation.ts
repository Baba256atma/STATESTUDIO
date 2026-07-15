import { ExecutiveEvidenceCategories, ExecutiveHypothesisTypes } from "./executiveReasoningEvidence.ts";
import { ExecutiveConfidenceLevels, ExecutiveInferenceTypes } from "./executiveReasoningInference.ts";
import { ExecutiveReasoningDomains } from "./executiveReasoningDomains.ts";
import { ExecutiveReasoningLifecycle } from "./executiveReasoningLifecycle.ts";
import { ExecutiveReasoningPipelineContracts } from "./executiveReasoningPipelineContracts.ts";

export const ExecutiveReasoningPipelineFoundation = Object.freeze({
  platformId: "ENG-6:1",
  name: "Executive Reasoning Pipeline Foundation",
  version: "1.0.0",
  namespace: "nexora.engine.executive.reasoning.foundation",
  description:
    "Canonical metadata-only architectural foundation for the Executive Reasoning Pipeline between planning and decision making. Describes reasoning architecture only; never performs reasoning, inference, scoring, or AI execution.",
  phase: "ENG-6:1",
  owner: "ENG-6",
  layer: "ExecutiveEngine",
  module: "ExecutiveReasoningPipelineFoundation",
  status: Object.freeze({
    foundation: "Foundation",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    aiFree: "AiFree",
    llmFree: "LlmFree",
  } as const),
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "reasoning stages",
      "reasoning contracts",
      "evidence contracts",
      "inference contracts",
      "confidence contracts",
      "contradiction contracts",
      "hypothesis contracts",
      "reasoning metadata",
      "reasoning lifecycle",
    ] as const),
    neverOwns: Object.freeze([
      "planning",
      "execution",
      "orchestration",
      "business calculations",
      "KPI computation",
      "workflow execution",
      "database access",
      "LLM inference",
      "AI models",
      "runtime logic",
    ] as const),
    planningOwner: "ENG-5",
    decisionOwner: "ENG-7",
    executionOwner: "OPS",
  } as const),
  contracts: ExecutiveReasoningPipelineContracts,
  domains: ExecutiveReasoningDomains,
  lifecycle: ExecutiveReasoningLifecycle,
  evidenceCategories: ExecutiveEvidenceCategories,
  hypothesisTypes: ExecutiveHypothesisTypes,
  inferenceTypes: ExecutiveInferenceTypes,
  confidenceLevels: ExecutiveConfidenceLevels,
  publicDependencies: Object.freeze([
    Object.freeze({ phase: "ENG-1", publicIndex: "executiveEnginePublicIndex.ts", consumption: "PublicIndexOnly" } as const),
    Object.freeze({ phase: "ENG-2", publicIndex: "executiveRequestIntentPublicIndex.ts", consumption: "PublicIndexOnly" } as const),
    Object.freeze({ phase: "ENG-3", publicIndex: "executiveIntentResolutionPublicIndex.ts", consumption: "PublicIndexOnly" } as const),
    Object.freeze({ phase: "ENG-4", publicIndex: "executiveContextAssemblyPublicIndex.ts", consumption: "PublicIndexOnly" } as const),
    Object.freeze({ phase: "ENG-5", publicIndex: "executivePlanningPublicIndex.ts", consumption: "PublicIndexOnly" } as const),
  ] as const),
  nextPhase: "ENG-6:2",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
  llmFree: true,
} as const);

export { ExecutiveReasoningPipelineContracts } from "./executiveReasoningPipelineContracts.ts";
export { ExecutiveReasoningDomains } from "./executiveReasoningDomains.ts";
export { ExecutiveReasoningLifecycle } from "./executiveReasoningLifecycle.ts";
export { ExecutiveEvidenceCategories } from "./executiveReasoningEvidence.ts";
export { ExecutiveConfidenceLevels, ExecutiveInferenceTypes } from "./executiveReasoningInference.ts";

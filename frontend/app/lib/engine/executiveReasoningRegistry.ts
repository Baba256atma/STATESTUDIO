import {
  ExecutiveConfidenceLevels,
  ExecutiveEvidenceCategories,
  ExecutiveInferenceTypes,
  ExecutiveReasoningPipelineFoundation,
} from "./executiveReasoningPipelineFoundation.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  getReasoningCapabilityById,
} from "./executiveReasoningCapabilityRegistry.ts";
import {
  ExecutiveReasoningComponentRegistry,
  getReasoningComponentById,
} from "./executiveReasoningComponentRegistry.ts";
import {
  ExecutiveReasoningLifecycleRegistry,
  getReasoningLifecycleStageById,
} from "./executiveReasoningLifecycleRegistry.ts";
import { ExecutiveReasoningRegistryMetadata } from "./executiveReasoningRegistryMetadata.ts";

const evidenceRegistry = Object.freeze(
  ExecutiveEvidenceCategories.map((entry) => Object.freeze({
    id: entry.id,
    name: entry.name,
    description: entry.description,
    owner: "ENG-6",
    status: "Registered",
    sourcePhase: "ENG-6:1",
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const)),
);

const inferenceRegistry = Object.freeze(
  ExecutiveInferenceTypes.map((entry) => Object.freeze({
    id: entry.id,
    name: entry.name,
    description: entry.description,
    owner: "ENG-6",
    status: "Registered",
    sourcePhase: "ENG-6:1",
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
    aiFree: true,
  } as const)),
);

const confidenceRegistry = Object.freeze(
  ExecutiveConfidenceLevels.map((entry) => Object.freeze({
    id: entry.id,
    name: entry.name,
    description: entry.description,
    order: entry.order,
    owner: "ENG-6",
    status: "Registered",
    sourcePhase: "ENG-6:1",
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const)),
);

const hypothesisRegistry = Object.freeze(
  ExecutiveReasoningPipelineFoundation.hypothesisTypes.map((entry) => Object.freeze({
    id: entry.id,
    name: entry.name,
    description: entry.description,
    owner: "ENG-6",
    status: "Registered",
    sourcePhase: "ENG-6:1",
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const)),
);

const evidenceIndex = Object.freeze(
  Object.fromEntries(evidenceRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, (typeof evidenceRegistry)[number] | undefined>
  >,
);
const inferenceIndex = Object.freeze(
  Object.fromEntries(inferenceRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, (typeof inferenceRegistry)[number] | undefined>
  >,
);
const confidenceIndex = Object.freeze(
  Object.fromEntries(confidenceRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, (typeof confidenceRegistry)[number] | undefined>
  >,
);

export const ExecutiveReasoningRegistry = Object.freeze({
  metadata: ExecutiveReasoningRegistryMetadata,
  components: ExecutiveReasoningComponentRegistry,
  capabilities: ExecutiveReasoningCapabilityRegistry,
  lifecycle: ExecutiveReasoningLifecycleRegistry,
  evidence: evidenceRegistry,
  inference: inferenceRegistry,
  confidence: confidenceRegistry,
  hypotheses: hypothesisRegistry,
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "component registry",
      "capability registry",
      "stage registry",
      "evidence registry",
      "inference registry",
      "confidence registry",
      "hypothesis registry",
      "lifecycle registry",
      "registry metadata",
    ] as const),
    neverOwns: Object.freeze([
      "reasoning execution",
      "evidence evaluation",
      "confidence computation",
      "inference algorithms",
      "hypothesis generation",
      "contradiction resolution",
      "planning",
      "decision making",
      "orchestration",
      "business logic",
      "runtime behavior",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const getReasoningEvidenceCategoryById = (
  id: string,
): (typeof evidenceRegistry)[number] | undefined => evidenceIndex[id];

export const getReasoningInferenceTypeById = (
  id: string,
): (typeof inferenceRegistry)[number] | undefined => inferenceIndex[id];

export const getReasoningConfidenceLevelById = (
  id: string,
): (typeof confidenceRegistry)[number] | undefined => confidenceIndex[id];

export {
  getReasoningCapabilityById,
  getReasoningComponentById,
  getReasoningLifecycleStageById,
};

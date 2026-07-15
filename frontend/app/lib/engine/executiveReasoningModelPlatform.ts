import { ExecutiveReasoningModelMetadata } from "./executiveReasoningModelMetadata.ts";
import { ExecutiveReasoningModelRegistry } from "./executiveReasoningModelRegistry.ts";
import { ExecutiveReasoningModels } from "./executiveReasoningModels.ts";
import { ExecutiveReasoningRelationshipModel } from "./executiveReasoningRelationshipModel.ts";

export const ExecutiveReasoningModelPlatform = Object.freeze({
  metadata: ExecutiveReasoningModelMetadata,
  models: ExecutiveReasoningModels,
  registry: ExecutiveReasoningModelRegistry,
  relationships: ExecutiveReasoningRelationshipModel,
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "reasoning models",
      "evidence models",
      "hypothesis models",
      "inference models",
      "contradiction models",
      "confidence models",
      "explanation models",
      "reasoning result models",
      "reasoning metadata models",
    ] as const),
    neverOwns: Object.freeze([
      "reasoning execution",
      "inference algorithms",
      "confidence calculation",
      "evidence scoring",
      "planning",
      "orchestration",
      "decision making",
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

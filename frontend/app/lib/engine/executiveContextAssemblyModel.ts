import { ExecutiveContextCompositionModel } from "./executiveContextCompositionModel.ts";
import { ExecutiveContextDomainModel } from "./executiveContextDomainModel.ts";
import { ExecutiveContextMetadataModel, ExecutiveContextModelDependencies } from "./executiveContextMetadataModel.ts";
import { ExecutiveContextModel } from "./executiveContextModel.ts";
import { ExecutiveContextSnapshotModel } from "./executiveContextSnapshotModel.ts";
import type {
  ExecutiveContextAssemblyModelAggregate,
  ExecutiveContextAssemblyModelSummary,
  ExecutiveContextModelRegistryEntry,
} from "./executiveContextAssemblyModelTypes.ts";

const registryEntry = (model: ExecutiveContextModelRegistryEntry["model"]) => Object.freeze({
  id: model.id, name: model.name, model, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextModelRegistryEntry);

const modelRegistry = Object.freeze([
  registryEntry(ExecutiveContextModel),
  registryEntry(ExecutiveContextDomainModel),
  registryEntry(ExecutiveContextSnapshotModel),
  registryEntry(ExecutiveContextCompositionModel),
  registryEntry(ExecutiveContextMetadataModel),
] as const);

export const ExecutiveContextAssemblyModel = Object.freeze({
  executiveContext: ExecutiveContextModel,
  domain: ExecutiveContextDomainModel,
  snapshot: ExecutiveContextSnapshotModel,
  composition: ExecutiveContextCompositionModel,
  metadata: ExecutiveContextMetadataModel,
  modelRegistry,
  dependencies: ExecutiveContextModelDependencies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextAssemblyModelAggregate);

const modelSummary = Object.freeze({
  modelId: "ENG-4:3",
  phase: "ENG-4:3",
  namespace: "nexora.engine.executive.context-assembly.model",
  owner: "ENG-4",
  modelCount: modelRegistry.length,
  dependencyCount: ExecutiveContextModelDependencies.length,
  structuralModelCount: Object.keys(ExecutiveContextModel.structuralModels).length,
  nextPhase: "ENG-4:4",
  validationReady: true,
  status: Object.freeze({
    model: "Model",
    metadataOnly: "MetadataOnly",
    immutable: "Immutable",
    runtimeFree: "RuntimeFree",
    deterministic: "Deterministic",
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextAssemblyModelSummary);

export { ExecutiveContextCompositionModel } from "./executiveContextCompositionModel.ts";
export { ExecutiveContextDomainModel } from "./executiveContextDomainModel.ts";
export { ExecutiveContextMetadataModel } from "./executiveContextMetadataModel.ts";
export { ExecutiveContextModel } from "./executiveContextModel.ts";
export { ExecutiveContextSnapshotModel } from "./executiveContextSnapshotModel.ts";

export const getExecutiveContextAssemblyModel = () => ExecutiveContextAssemblyModel;
export const getExecutiveContextModel = () => ExecutiveContextModel;
export const getExecutiveContextDomainModel = () => ExecutiveContextDomainModel;
export const getExecutiveContextSnapshotModel = () => ExecutiveContextSnapshotModel;
export const getExecutiveContextCompositionModel = () => ExecutiveContextCompositionModel;
export const getExecutiveContextMetadataModel = () => ExecutiveContextMetadataModel;
export const getExecutiveContextAssemblyModelSummary = () => modelSummary;

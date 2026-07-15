import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
import type {
  ExecutiveContextMetadataModelDescriptor,
  ExecutiveContextModelDependency,
} from "./executiveContextAssemblyModelTypes.ts";

const dependency = (
  phase: ExecutiveContextModelDependency["phase"],
  publicIndex: string,
  artifact?: object,
) => Object.freeze({
  phase, publicIndex, consumption: "PublicIndexOnly",
  ...(artifact ? { artifact } : {}),
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextModelDependency);

export const ExecutiveContextModelDependencies = Object.freeze([
  dependency("ENG-1", "executiveEnginePublicIndex.ts"),
  dependency("ENG-2", "executiveRequestIntentPublicIndex.ts"),
  dependency("ENG-3", "executiveIntentResolutionPublicIndex.ts"),
  dependency("ENG-4:1", "executiveContextAssemblyFoundation.ts", ExecutiveContextAssemblyFoundation),
  dependency("ENG-4:2", "executiveContextAssemblyRegistry.ts", ExecutiveContextAssemblyRegistry),
] as const);

export const ExecutiveContextMetadataModel = Object.freeze({
  id: "eng-4-model-context-metadata",
  name: "Context Metadata Model",
  description: "Immutable metadata model for the Executive Context Assembly Model layer.",
  fields: Object.freeze([
    "version", "namespace", "owner", "status", "dependencies", "releaseMetadata",
  ]),
  modelVersion: "1.0.0",
  modelNamespace: "nexora.engine.executive.context-assembly.model",
  modelOwner: "ENG-4",
  dependencies: ExecutiveContextModelDependencies,
  releaseMetadata: Object.freeze({
    phase: "ENG-4:3",
    releaseStatus: "Draft",
    nextPhase: "ENG-4:4",
    certificationState: "Uncertified",
    publicationState: "Published",
  } as const),
  owner: "ENG-4",
  phase: "ENG-4:3",
  namespace: "nexora.engine.executive.context-assembly.model",
  version: "1.0.0",
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
} as const satisfies ExecutiveContextMetadataModelDescriptor);

import type { ExecutiveContextRegistryCollection, ExecutiveContextRegistryEntry } from "./executiveContextAssemblyRegistryTypes.ts";

const source = (id: string, key: string, name: string, description: string) => Object.freeze({
  id, key, name, description, status: "Registered", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextRegistryEntry);

export const ExecutiveContextSourceRegistry = Object.freeze({
  id: "eng-4-registry-context-sources",
  group: "ContextSources",
  category: "Source",
  owner: "ENG-4",
  version: "1.0.0",
  namespace: "nexora.engine.executive.context-assembly.registry",
  entries: Object.freeze([
    source("eng-4-source-workspace-metadata", "WorkspaceMetadata", "Workspace Metadata", "Architectural source describing workspace metadata participation."),
    source("eng-4-source-business-platform", "BusinessPlatform", "Business Platform", "Architectural source describing business-platform metadata participation."),
    source("eng-4-source-operations-platform", "OperationsPlatform", "Operations Platform", "Architectural source describing operations-platform metadata participation."),
    source("eng-4-source-engine-platform", "EnginePlatform", "Engine Platform", "Architectural source describing engine-platform metadata participation."),
    source("eng-4-source-connected-dataset", "ConnectedDataset", "Connected Dataset", "Architectural source describing connected-dataset metadata participation."),
    source("eng-4-source-manual-input", "ManualInput", "Manual Input", "Architectural source describing manually declared context metadata."),
    source("eng-4-source-imported-file", "ImportedFile", "Imported File", "Architectural source describing imported-file metadata participation."),
    source("eng-4-source-external-integration", "ExternalIntegration", "External Integration", "Architectural source describing external-integration metadata participation."),
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextRegistryCollection);

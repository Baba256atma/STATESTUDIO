import type { ExecutiveContextCompositionModelDescriptor } from "./executiveContextAssemblyModelTypes.ts";

const relationship = (id: string, name: string, description: string) => Object.freeze({
  id, name, description, metadataOnly: true, immutable: true,
} as const);

export const ExecutiveContextCompositionModel = Object.freeze({
  id: "eng-4-model-context-composition",
  name: "Context Composition Model",
  description: "Architectural model describing how an Executive Context is composed without execution logic.",
  fields: Object.freeze([
    "compositionId", "domains", "sources", "scope", "relationships", "metadata",
  ]),
  compositionFields: Object.freeze({
    compositionId: "compositionId",
    domains: "domains",
    sources: "sources",
    scope: "scope",
    relationships: "relationships",
    metadata: "metadata",
  } as const),
  relationships: Object.freeze([
    relationship("eng-4-composition-rel-domain-source", "DomainToSource", "Describes domain participation relative to approved context sources."),
    relationship("eng-4-composition-rel-scope-domain", "ScopeToDomain", "Describes scope membership relative to approved context domains."),
    relationship("eng-4-composition-rel-context-snapshot", "ContextToSnapshot", "Describes composition linkage to snapshot identity metadata."),
  ]),
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
} as const satisfies ExecutiveContextCompositionModelDescriptor);

import {
  ExecutiveContextDomainRegistry,
  ExecutiveContextLifecycleRegistry,
  ExecutiveContextSourceRegistry,
} from "./executiveContextAssemblyRegistry.ts";
import type { ExecutiveContextCanonicalModel } from "./executiveContextAssemblyModelTypes.ts";

const structural = (fields: readonly string[]) => Object.freeze({
  fields: Object.freeze(fields), metadataOnly: true, immutable: true,
} as const);

export const ExecutiveContextModel = Object.freeze({
  id: "eng-4-model-executive-context",
  name: "Executive Context Model",
  description: "Canonical architectural model describing an Executive Context for Context Assembly.",
  fields: Object.freeze([
    "contextId", "name", "description", "scope", "domains", "sources",
    "lifecycle", "version", "metadata", "status",
  ]),
  structuralModels: Object.freeze({
    source: structural(["sourceId", "sourceName", "sourceCategory", "ownership", "visibility"]),
    scope: structural(["scopeId", "scopeName", "includedDomains", "excludedDomains", "boundaryReferences"]),
    version: structural(["versionId", "versionLabel", "compatibility", "supersedes", "publicationState"]),
    summary: structural(["summaryId", "contextReference", "domainCount", "sourceCount", "lifecycleStage", "status"]),
    reference: structural(["referenceId", "contextId", "namespace", "version", "visibility"]),
  }),
  registryReferences: Object.freeze({
    domains: ExecutiveContextDomainRegistry,
    sources: ExecutiveContextSourceRegistry,
    lifecycle: ExecutiveContextLifecycleRegistry,
  }),
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
} as const satisfies ExecutiveContextCanonicalModel);

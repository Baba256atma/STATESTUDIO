import { ExecutiveContextDomainRegistry } from "./executiveContextAssemblyRegistry.ts";
import type { ExecutiveContextDomainModelDescriptor } from "./executiveContextAssemblyModelTypes.ts";

export const ExecutiveContextDomainModel = Object.freeze({
  id: "eng-4-model-context-domain",
  name: "Context Domain Model",
  description: "Architectural model representing one domain eligible to participate in an Executive Context.",
  fields: Object.freeze([
    "domainId", "domainName", "category", "owner", "description", "visibility",
  ]),
  domainFields: Object.freeze({
    domainId: "domainId",
    domainName: "domainName",
    category: "category",
    owner: "owner",
    description: "description",
    visibility: "visibility",
  } as const),
  registryReference: ExecutiveContextDomainRegistry,
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
} as const satisfies ExecutiveContextDomainModelDescriptor);

/** ASSISTANT-8:3 — Pure metadata helpers for Model construction. */
import type {
  ExecutionDomainModelMetadata,
  ExecutionModelCatalogEntry,
  ExecutionModelCategory,
  ExecutionRelationshipMetadata,
} from "./executionModelTypes.ts";

export const EXECUTION_MODEL_NAMESPACE =
  "nexora.assistant.executive-action-execution.model" as const;

export const EXECUTION_MODEL_SOURCE_REGISTRY =
  "ASSISTANT-8:2/ExecutiveActionExecutionRegistry" as const;

export const registerCatalogEntries = (
  category: string,
  names: readonly string[],
  registryReference: string = EXECUTION_MODEL_SOURCE_REGISTRY,
): readonly ExecutionModelCatalogEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-8:3/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} model catalog metadata for ${name}.`,
    category,
    order: index + 1,
    registryReference,
    version: "1.0.0",
    status: "Canonical",
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const registerDomainModel = (input: {
  readonly order: number;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutionModelCategory;
  readonly attributes: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly registryReference: string;
}): ExecutionDomainModelMetadata => Object.freeze({
  id: `ASSISTANT-8:3/DomainModel/${String(input.order).padStart(2, "0")}`,
  name: input.name,
  description: input.description,
  category: input.category,
  attributes: Object.freeze([...input.attributes]),
  relationshipReferences: Object.freeze([...input.relationshipReferences]),
  registryReference: input.registryReference,
  sourceRegistry: EXECUTION_MODEL_SOURCE_REGISTRY,
  namespace: EXECUTION_MODEL_NAMESPACE,
  ownership: "Nexora Assistant",
  lifecycle: "ASSISTANT-8:3/Lifecycle",
  compatibility: "ASSISTANT-8 Registry Compatible",
  readiness: "ReadyForValidation",
  version: "1.0.0",
  status: "Canonical",
  order: input.order,
  immutableIdentity: true,
  executable: false,
  metadataOnly: true,
  immutable: true,
});

export const registerRelationship = (
  order: number,
  source: string,
  relationshipType: string,
  target: string,
  description: string,
  registryReference: string = EXECUTION_MODEL_SOURCE_REGISTRY,
): ExecutionRelationshipMetadata => Object.freeze({
  id: `ASSISTANT-8:3/Relationship/${String(order).padStart(2, "0")}`,
  source,
  relationshipType,
  target,
  description,
  registryReference,
  order,
  executable: false,
  metadataOnly: true,
  immutable: true,
});

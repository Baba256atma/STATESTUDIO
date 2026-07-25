/** ASSISTANT-8:2 — Registry identity, entry type, and metadata registry. */
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";

export interface ExecutionRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly canonicalIdentity: string;
  readonly version: "1.0.0";
  readonly status: "Registered";
  readonly order: number;
  readonly immutableIdentity: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const registerExecutionEntries = (
  category: string,
  source: readonly {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
  }[],
): readonly ExecutionRegistryEntry[] => Object.freeze(
  source.map((entry, index) => Object.freeze({
    id: `ASSISTANT-8:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name: entry.name,
    description: entry.description
      ?? `Canonical ${category} registry metadata for ${entry.name}.`,
    category,
    canonicalIdentity: entry.id,
    version: "1.0.0",
    status: "Registered",
    order: index + 1,
    immutableIdentity: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ExecutiveActionExecutionRegistryIdentity = Object.freeze({
  id: "ASSISTANT-8:2/ExecutiveActionExecutionRegistry",
  name: "Assistant Executive Action Execution Registry",
  phaseId: "ASSISTANT-8:2",
  version: "1.0.0",
  status: "Registry",
  stage: "ReadyForModel",
  canonical: true,
  mutable: false,
  sourceFoundation: "ASSISTANT-8:1/ExecutiveActionExecutionFoundation",
  metadataOnly: true,
  immutable: true,
} as const);

const metadataDefinitions = Object.freeze([
  {
    id: "ASSISTANT-8:2/MetadataDefinition/01",
    name: "Canonical Id",
    description: "Canonical registry identifier metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/02",
    name: "Namespace",
    description: "Canonical registry namespace metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/03",
    name: "Ownership",
    description: "Registry ownership metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/04",
    name: "Version",
    description: "Registry version metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/05",
    name: "Release State",
    description: "Registry release state metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/06",
    name: "Compatibility",
    description: "Registry compatibility metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/07",
    name: "Readiness",
    description: "Registry readiness metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/08",
    name: "Dependencies",
    description: "Registry dependency metadata.",
  },
  {
    id: "ASSISTANT-8:2/MetadataDefinition/09",
    name: "Registry Category",
    description: "Registry category classification metadata.",
  },
] as const);

export const ExecutionMetadataRegistry = Object.freeze({
  identity: ExecutiveActionExecutionRegistryIdentity,
  namespace: "nexora.assistant.executive-action-execution.registry",
  ownership: "Nexora Assistant",
  version: "1.0.0",
  releaseState: "Registry",
  readiness: "ReadyForModel",
  compatibility: Object.freeze({
    foundationCompatible: true,
    modelCompatible: true,
    freezeCompatible: true,
    publicIndexCompatible: true,
  }),
  dependencies: Object.freeze([
    "ASSISTANT-8:1 Executive Action Execution Foundation",
  ]),
  registryCategory: "Executive Action Execution",
  definitions: registerExecutionEntries(
    "MetadataDefinition",
    metadataDefinitions,
  ),
  sourceFoundation: ExecutiveActionExecutionFoundation.identity,
  metadataOnly: true,
  immutable: true,
} as const);

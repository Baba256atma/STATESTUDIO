/**
 * EIL-4:3 — Integration Orchestration Topology Models.
 *
 * Immutable topology architecture declarations for orchestration metadata.
 * Metadata only — no graph engines or orchestration traversal.
 *
 * Ownership: owned exclusively by EIL-4:3.
 */

import { IntegrationOrchestrationRegistryIdentity } from "./integrationOrchestrationRegistry.ts";
import type {
  IntegrationOrchestrationTopologyModel,
  OrchestrationRegistryReference,
  OrchestrationTopologyKey,
} from "./integrationOrchestrationModelTypes.ts";

const registryRef = (
  collection: OrchestrationRegistryReference["collection"],
  entryKey: string,
): OrchestrationRegistryReference =>
  Object.freeze({
    registryId: IntegrationOrchestrationRegistryIdentity.canonicalId,
    registryNamespace: IntegrationOrchestrationRegistryIdentity.namespace,
    entryPoint: "integrationOrchestrationRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const topology = (
  key: OrchestrationTopologyKey,
  canonicalName: string,
  description: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationOrchestrationTopologyModel =>
  Object.freeze({
    topologyModelId: `EIL-4:3/Topology/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-4:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef("collections", "collections"),
    sourceReference:
      `EIL-4:2/IntegrationOrchestrationRegistry/collections/topology/${key}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    graphEngine: false as const,
    orchestrationEngine: false as const,
    visualization: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable topology models.
 * Architecture description only.
 */
export const IntegrationOrchestrationTopologyModels: readonly IntegrationOrchestrationTopologyModel[] =
  Object.freeze([
    topology(
      "Linear",
      "Linear",
      "Declarative linear topology metadata for single-path orchestration composition.",
      1,
      Object.freeze(["topology", "linear"]),
    ),
    topology(
      "Sequential",
      "Sequential",
      "Declarative sequential topology metadata for ordered orchestration composition.",
      2,
      Object.freeze(["topology", "sequential"]),
    ),
    topology(
      "Parallel",
      "Parallel",
      "Declarative parallel topology metadata for concurrent orchestration composition.",
      3,
      Object.freeze(["topology", "parallel"]),
    ),
    topology(
      "Tree",
      "Tree",
      "Declarative tree topology metadata for hierarchical orchestration composition.",
      4,
      Object.freeze(["topology", "tree"]),
    ),
    topology(
      "Mesh",
      "Mesh",
      "Declarative mesh topology metadata for multi-path orchestration composition.",
      5,
      Object.freeze(["topology", "mesh"]),
    ),
    topology(
      "Hub",
      "Hub",
      "Declarative hub topology metadata for centralized orchestration composition.",
      6,
      Object.freeze(["topology", "hub"]),
    ),
    topology(
      "Composite",
      "Composite",
      "Declarative composite topology metadata for multi-topology orchestration composition.",
      7,
      Object.freeze(["topology", "composite"]),
    ),
    topology(
      "Executive",
      "Executive",
      "Declarative executive topology metadata for executive-level orchestration composition.",
      8,
      Object.freeze(["topology", "executive"]),
    ),
  ]);

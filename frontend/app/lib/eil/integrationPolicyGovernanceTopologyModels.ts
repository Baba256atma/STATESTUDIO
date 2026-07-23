/**
 * EIL-5:3 — Integration Policy & Governance Topology Models.
 *
 * Immutable topology architecture declarations for governance metadata.
 * Metadata only — no graph engines or governance traversal.
 *
 * Ownership: owned exclusively by EIL-5:3.
 */

import { IntegrationPolicyGovernanceRegistryIdentity } from "./integrationPolicyGovernanceRegistry.ts";
import type {
  IntegrationPolicyGovernanceTopologyModel,
  PolicyGovernanceRegistryReference,
  PolicyGovernanceTopologyKey,
} from "./integrationPolicyGovernanceModelTypes.ts";

const registryRef = (
  collection: PolicyGovernanceRegistryReference["collection"],
  entryKey: string,
): PolicyGovernanceRegistryReference =>
  Object.freeze({
    registryId: IntegrationPolicyGovernanceRegistryIdentity.canonicalId,
    registryNamespace: IntegrationPolicyGovernanceRegistryIdentity.namespace,
    entryPoint: "integrationPolicyGovernanceRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const topology = (
  key: PolicyGovernanceTopologyKey,
  canonicalName: string,
  description: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationPolicyGovernanceTopologyModel =>
  Object.freeze({
    topologyModelId: `EIL-5:3/Topology/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-5:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef("collections", "collections"),
    sourceReference: `EIL-5:2/IntegrationPolicyGovernanceRegistry/collections/topology/${key}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    graphEngine: false as const,
    governanceEngine: false as const,
    visualization: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable topology models.
 * Architecture description only.
 */
export const IntegrationPolicyGovernanceTopologyModels: readonly IntegrationPolicyGovernanceTopologyModel[] =
  Object.freeze([
    topology(
      "Linear",
      "Linear",
      "Declarative linear topology metadata for single-path governance composition.",
      1,
      Object.freeze(["topology", "linear"]),
    ),
    topology(
      "Hierarchical",
      "Hierarchical",
      "Declarative hierarchical topology metadata for ordered governance composition.",
      2,
      Object.freeze(["topology", "hierarchical"]),
    ),
    topology(
      "Tree",
      "Tree",
      "Declarative tree topology metadata for branched governance composition.",
      3,
      Object.freeze(["topology", "tree"]),
    ),
    topology(
      "Mesh",
      "Mesh",
      "Declarative mesh topology metadata for multi-path governance composition.",
      4,
      Object.freeze(["topology", "mesh"]),
    ),
    topology(
      "Hub",
      "Hub",
      "Declarative hub topology metadata for centralized governance composition.",
      5,
      Object.freeze(["topology", "hub"]),
    ),
    topology(
      "Composite",
      "Composite",
      "Declarative composite topology metadata for multi-topology governance composition.",
      6,
      Object.freeze(["topology", "composite"]),
    ),
    topology(
      "Layered",
      "Layered",
      "Declarative layered topology metadata for stratified governance composition.",
      7,
      Object.freeze(["topology", "layered"]),
    ),
    topology(
      "Executive",
      "Executive",
      "Declarative executive topology metadata for executive-level governance composition.",
      8,
      Object.freeze(["topology", "executive"]),
    ),
  ]);

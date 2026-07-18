/**
 * DKL-6:2 — Knowledge Repository Component Registry.
 *
 * Canonical repository component vocabulary. Metadata only.
 * runtimeBehavior is always None.
 *
 * Ownership: owned exclusively by DKL-6:2.
 */

import type { KnowledgeRepositoryComponentEntry } from "./knowledgeRepositoryRegistryTypes.ts";

const component = (
  id: string,
  name: string,
  category: string,
  responsibility: string,
  deterministicOrder: number,
): KnowledgeRepositoryComponentEntry =>
  Object.freeze({
    id,
    name,
    group: "RepositoryComponent" as const,
    description: `Repository component declaration for ${name}.`,
    category,
    responsibility,
    owner: "DKL-6" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

/** Exact repository component vocabulary. */
export const KnowledgeRepositoryComponentEntries: readonly KnowledgeRepositoryComponentEntry[] =
  Object.freeze([
    component(
      "DKL-6:2/Component/RepositoryIdentity",
      "RepositoryIdentity",
      "Identity",
      "Declares canonical identity metadata for a logical knowledge repository.",
      1,
    ),
    component(
      "DKL-6:2/Component/RepositoryRecord",
      "RepositoryRecord",
      "Record",
      "Declares the logical record surface held by a knowledge repository.",
      2,
    ),
    component(
      "DKL-6:2/Component/RepositoryVersion",
      "RepositoryVersion",
      "Version",
      "Declares logical version metadata for repository contents.",
      3,
    ),
    component(
      "DKL-6:2/Component/RepositorySnapshot",
      "RepositorySnapshot",
      "Snapshot",
      "Declares logical snapshot metadata for repository contents.",
      4,
    ),
    component(
      "DKL-6:2/Component/RepositoryHistory",
      "RepositoryHistory",
      "History",
      "Declares logical history vocabulary for repository contents.",
      5,
    ),
    component(
      "DKL-6:2/Component/RepositoryArchive",
      "RepositoryArchive",
      "Archive",
      "Declares logical archive metadata for repository contents.",
      6,
    ),
    component(
      "DKL-6:2/Component/RepositoryMetadata",
      "RepositoryMetadata",
      "Metadata",
      "Declares repository metadata structure and ownership surfaces.",
      7,
    ),
    component(
      "DKL-6:2/Component/RepositoryIndex",
      "RepositoryIndex",
      "Index",
      "Declares logical index vocabulary without constructing indexes.",
      8,
    ),
    component(
      "DKL-6:2/Component/RepositoryRetention",
      "RepositoryRetention",
      "Retention",
      "Declares logical retention vocabulary without scheduling or deletion.",
      9,
    ),
    component(
      "DKL-6:2/Component/RepositoryRetrieval",
      "RepositoryRetrieval",
      "Retrieval",
      "Declares logical retrieval contracts without query execution.",
      10,
    ),
  ]);

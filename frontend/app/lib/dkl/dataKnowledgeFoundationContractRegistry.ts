/**
 * DKL-1:2 — Data Knowledge Foundation Registry.
 *
 * Immutable registry of every architectural contract defined by the
 * DKL-1:1 Foundation. Metadata only — no runtime behavior.
 */

import { DataKnowledgeFoundationContracts } from "./dataKnowledgeFoundationContract.ts";
import type { DataKnowledgeContractRegistryEntry } from "./dataKnowledgeFoundationRegistryTypes.ts";

export const DataKnowledgeFoundationContractRegistry = Object.freeze(
  DataKnowledgeFoundationContracts.contracts.map((entry) =>
    Object.freeze({
      id: entry.id,
      name: entry.name,
      kind: entry.kind,
      description: entry.description,
      stability: entry.stability,
      metadataOnly: true,
      immutable: true,
    } as const satisfies DataKnowledgeContractRegistryEntry)
  )
);

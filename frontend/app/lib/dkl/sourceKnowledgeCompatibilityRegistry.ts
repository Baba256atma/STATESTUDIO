/**
 * DKL-2:2 — Source-to-Knowledge Compatibility Registry.
 *
 * Immutable, metadata-only declarations describing which source categories may
 * commonly provide which knowledge categories. A compatibility entry means only
 * "architecturally permitted or commonly expected" — never guaranteed
 * extraction, verified data presence, live connector support, runtime mapping,
 * or semantic certainty. All classifications are static.
 *
 * Responsibility: publish the compatibility registry + deterministic lookups.
 * Ownership: owned exclusively by DKL-2:2.
 * Dependency rules: depends only on DKL-2:2 registry types.
 * Architectural purpose: answer "which sources commonly inform which knowledge?".
 */

import {
  compatibilityId,
  createRegistryIdentity,
  dataSourceId,
  knowledgeTypeId,
  REGISTRY_OWNER,
  type CompatibilityConfidence,
  type CompatibilityRegistryContainer,
  type CompatibilityRegistryEntry,
  type CompatibilityType,
  type DataSourceCategoryKey,
  type KnowledgeCategoryKey,
} from "./dataSourceRegistryTypes.ts";

interface CompatibilityConfig {
  readonly source: DataSourceCategoryKey;
  readonly knowledge: KnowledgeCategoryKey;
  readonly compatibilityType: CompatibilityType;
  readonly confidence: CompatibilityConfidence;
  readonly rationale: string;
}

const COMPATIBILITY: readonly CompatibilityConfig[] = Object.freeze([
  { source: "crm", knowledge: "customer", compatibilityType: "primary", confidence: "high", rationale: "CRM systems are the primary system of record for customers." },
  { source: "crm", knowledge: "organization", compatibilityType: "primary", confidence: "high", rationale: "CRM systems track customer organizations and accounts." },
  { source: "crm", knowledge: "opportunity", compatibilityType: "primary", confidence: "high", rationale: "CRM pipelines define sales opportunities." },
  { source: "crm", knowledge: "product", compatibilityType: "secondary", confidence: "medium", rationale: "CRM records reference products attached to deals." },
  { source: "crm", knowledge: "service", compatibilityType: "secondary", confidence: "medium", rationale: "CRM records reference services attached to accounts." },

  { source: "erp", knowledge: "invoice", compatibilityType: "primary", confidence: "high", rationale: "ERP systems are the system of record for invoices." },
  { source: "erp", knowledge: "purchase", compatibilityType: "primary", confidence: "high", rationale: "ERP systems record purchase transactions." },
  { source: "erp", knowledge: "revenue", compatibilityType: "primary", confidence: "high", rationale: "ERP financials aggregate revenue." },
  { source: "erp", knowledge: "cost", compatibilityType: "primary", confidence: "high", rationale: "ERP financials aggregate costs." },
  { source: "erp", knowledge: "product", compatibilityType: "secondary", confidence: "medium", rationale: "ERP catalogs reference products." },

  { source: "email", knowledge: "conversation", compatibilityType: "primary", confidence: "high", rationale: "Email threads are conversations." },
  { source: "email", knowledge: "customer", compatibilityType: "secondary", confidence: "medium", rationale: "Email correspondence commonly references customers." },
  { source: "email", knowledge: "meeting", compatibilityType: "secondary", confidence: "medium", rationale: "Email invitations commonly describe meetings." },
  { source: "email", knowledge: "decision", compatibilityType: "secondary", confidence: "low", rationale: "Email threads may record decisions." },
  { source: "email", knowledge: "risk", compatibilityType: "secondary", confidence: "low", rationale: "Email threads may surface risks." },

  { source: "chat", knowledge: "conversation", compatibilityType: "primary", confidence: "high", rationale: "Chat threads are conversations." },
  { source: "chat", knowledge: "task", compatibilityType: "secondary", confidence: "medium", rationale: "Chat messages commonly capture tasks." },
  { source: "chat", knowledge: "decision", compatibilityType: "secondary", confidence: "low", rationale: "Chat threads may record decisions." },
  { source: "chat", knowledge: "event", compatibilityType: "secondary", confidence: "low", rationale: "Chat messages may reference events." },

  { source: "pdf", knowledge: "document", compatibilityType: "primary", confidence: "high", rationale: "PDF files are documents." },
  { source: "pdf", knowledge: "contract", compatibilityType: "secondary", confidence: "medium", rationale: "Contracts are commonly distributed as PDFs." },
  { source: "pdf", knowledge: "invoice", compatibilityType: "secondary", confidence: "medium", rationale: "Invoices are commonly distributed as PDFs." },
  { source: "pdf", knowledge: "strategy", compatibilityType: "secondary", confidence: "low", rationale: "Strategy documents are commonly distributed as PDFs." },
  { source: "pdf", knowledge: "risk", compatibilityType: "secondary", confidence: "low", rationale: "Risk assessments are commonly distributed as PDFs." },
]);

const compatibilityEntry = (config: CompatibilityConfig): CompatibilityRegistryEntry =>
  Object.freeze({
    identity: createRegistryIdentity({
      id: compatibilityId(config.source, config.knowledge),
      name: `${config.source} → ${config.knowledge}`,
      description: config.rationale,
      kind: "CompatibilityRelationship",
      category: "compatibility",
      owner: REGISTRY_OWNER,
      tags: Object.freeze(["compatibility", config.source, config.knowledge]),
    }),
    sourceCategoryId: dataSourceId(config.source),
    knowledgeCategoryId: knowledgeTypeId(config.knowledge),
    compatibilityType: config.compatibilityType,
    confidence: config.confidence,
    rationale: config.rationale,
    metadataOnly: true,
    immutable: true,
  } as const satisfies CompatibilityRegistryEntry);

const compatibilityEntries: readonly CompatibilityRegistryEntry[] = Object.freeze(
  COMPATIBILITY.map(compatibilityEntry)
);

const EMPTY: readonly CompatibilityRegistryEntry[] = Object.freeze([]);

export const SourceKnowledgeCompatibilityRegistry: CompatibilityRegistryContainer = Object.freeze({
  kind: "CompatibilityRelationship",
  entries: compatibilityEntries,
  getById: (id: string): CompatibilityRegistryEntry | undefined =>
    compatibilityEntries.find((entry) => entry.identity.registryEntryId === id),
  getBySourceId: (sourceCategoryId: string): readonly CompatibilityRegistryEntry[] => {
    const matches = compatibilityEntries.filter((entry) => entry.sourceCategoryId === sourceCategoryId);
    return matches.length === 0 ? EMPTY : Object.freeze(matches);
  },
  getByKnowledgeId: (knowledgeCategoryId: string): readonly CompatibilityRegistryEntry[] => {
    const matches = compatibilityEntries.filter(
      (entry) => entry.knowledgeCategoryId === knowledgeCategoryId
    );
    return matches.length === 0 ? EMPTY : Object.freeze(matches);
  },
});

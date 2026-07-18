/**
 * DKL-2:2 — Data Source & Knowledge Registry Manifest.
 *
 * One immutable aggregate manifest deterministically derived from the frozen
 * registries. It reports platform identity, per-registry totals, entry counts by
 * kind and status, duplicate-id status, and release readiness for DKL-2:3.
 *
 * Responsibility: publish the derived registry manifest.
 * Ownership: owned exclusively by DKL-2:2.
 * Dependency rules: depends only on the DKL-2:2 registries and types.
 * Architectural purpose: a single deterministic inventory of the registry
 * platform. No source inspection, no reflection, no runtime behavior.
 */

import { ConnectorTypeRegistry, ContentTypeRegistry, SourceGroupRegistry } from "./connectorContentRegistry.ts";
import { DataSourceRegistry } from "./dataSourceRegistry.ts";
import { KnowledgeTypeRegistry } from "./knowledgeTypeRegistry.ts";
import { SourceKnowledgeCompatibilityRegistry } from "./sourceKnowledgeCompatibilityRegistry.ts";
import type {
  RegistryEntryIdentity,
  RegistryEntryKind,
  RegistryManifestDescriptor,
  RegistryStatus,
} from "./dataSourceRegistryTypes.ts";

const allIdentities: readonly RegistryEntryIdentity[] = Object.freeze([
  ...DataSourceRegistry.entries.map((entry) => entry.identity),
  ...KnowledgeTypeRegistry.entries.map((entry) => entry.identity),
  ...ConnectorTypeRegistry.entries.map((entry) => entry.identity),
  ...ContentTypeRegistry.entries.map((entry) => entry.identity),
  ...SourceGroupRegistry.entries.map((entry) => entry.identity),
  ...SourceKnowledgeCompatibilityRegistry.entries.map((entry) => entry.identity),
]);

const countByKind = (kind: RegistryEntryKind): number =>
  allIdentities.filter((identity) => identity.registryEntryKind === kind).length;

const countByStatus = (status: RegistryStatus): number =>
  allIdentities.filter((identity) => identity.status === status).length;

const uniqueIdCount = new Set(allIdentities.map((identity) => identity.registryEntryId)).size;
const duplicateIdStatus: "none" | "detected" =
  uniqueIdCount === allIdentities.length ? "none" : "detected";

export const DataSourceKnowledgeRegistryManifest = Object.freeze({
  platformId: "DKL-2:2",
  name: "Data Source & Knowledge Registry Platform",
  namespace: "nexora.dkl.dsk-registry.platform",
  version: "1.0.0",
  sourcePhase: "DKL-2:2",
  dependency: "DKL-2:1",
  totalDataSourceEntries: DataSourceRegistry.entries.length,
  totalKnowledgeEntries: KnowledgeTypeRegistry.entries.length,
  totalConnectorEntries: ConnectorTypeRegistry.entries.length,
  totalContentEntries: ContentTypeRegistry.entries.length,
  totalSourceGroups: SourceGroupRegistry.entries.length,
  totalCompatibilityRelationships: SourceKnowledgeCompatibilityRegistry.entries.length,
  entryCountsByKind: Object.freeze({
    DataSource: countByKind("DataSource"),
    KnowledgeType: countByKind("KnowledgeType"),
    ConnectorType: countByKind("ConnectorType"),
    ContentType: countByKind("ContentType"),
    MetadataType: countByKind("MetadataType"),
    SourceGroup: countByKind("SourceGroup"),
    CompatibilityRelationship: countByKind("CompatibilityRelationship"),
  }),
  entryCountsByStatus: Object.freeze({
    Draft: countByStatus("Draft"),
    Active: countByStatus("Active"),
    Deprecated: countByStatus("Deprecated"),
    Reserved: countByStatus("Reserved"),
  }),
  duplicateIdStatus,
  completion: Object.freeze([
    "RegistryComplete",
    "MetadataOnly",
    "RuntimeFree",
    "Deterministic",
    "Immutable",
    "ReadyForModel",
  ]),
  readiness: "ReadyForModel",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies RegistryManifestDescriptor);

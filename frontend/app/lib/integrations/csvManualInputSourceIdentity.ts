/**
 * INT-1:1 — CSV & Manual Input Source Identity.
 *
 * Resolves immutable source references from the released DKL-2 platform through
 * its sole public entry point. INT-1 uses DKL-2 only to identify CSV / Manual
 * Input data sources, File Upload / Manual Entry connectors, and Tabular /
 * Manual Record content types. It never modifies DKL registries, never copies
 * whole registries, and preserves canonical ids and references.
 *
 * Ownership: owned exclusively by INT-1.
 * Dependency rules: consumes DKL-2 exclusively through
 * dataSourceKnowledgeRegistryPublicIndex.ts. If a required DKL entry is
 * unavailable, a deterministic foundation diagnostic is exposed rather than
 * inventing an entry.
 */

import { DataSourceKnowledgeRegistryPublicPlatform } from "../dkl/dataSourceKnowledgeRegistryPublicIndex.ts";
import { buildDiagnostic, DIAGNOSTIC_CODES } from "./csvManualInputDiagnostics.ts";
import type {
  ImportDiagnostic,
  SourceReferenceKind,
  SourceRegistryReference,
} from "./csvManualInputFoundationTypes.ts";

// Canonical DKL-2 registry ids. These mirror the released registry identifiers
// (dsk-datasource-*, dsk-connector-type-*, dsk-content-type-*) and are resolved
// against the live Public Index — never invented.
const CANONICAL_IDS = Object.freeze({
  csvDataSource: "dsk-datasource-csv",
  manualInputDataSource: "dsk-datasource-manual-input",
  fileUploadConnector: "dsk-connector-type-file-upload",
  manualEntryConnector: "dsk-connector-type-manual-entry",
  tabularContent: "dsk-content-type-tabular",
  manualRecordContent: "dsk-content-type-manual-record",
} as const);

const registry = DataSourceKnowledgeRegistryPublicPlatform.registry;

const missingReference = (
  id: string,
  kind: SourceReferenceKind,
): SourceRegistryReference =>
  Object.freeze({ registryEntryId: id, registryEntryName: "", kind, resolved: false });

const resolveDataSource = (id: string): SourceRegistryReference => {
  const entry = registry.dataSources.getById(id);
  if (entry === undefined) {
    return missingReference(id, "DataSource");
  }
  return Object.freeze({
    registryEntryId: entry.identity.registryEntryId,
    registryEntryName: entry.identity.registryEntryName,
    kind: "DataSource",
    resolved: true,
  });
};

const resolveConnector = (id: string): SourceRegistryReference => {
  const entry = registry.connectors.getById(id);
  if (entry === undefined) {
    return missingReference(id, "ConnectorType");
  }
  return Object.freeze({
    registryEntryId: entry.identity.registryEntryId,
    registryEntryName: entry.identity.registryEntryName,
    kind: "ConnectorType",
    resolved: true,
  });
};

const resolveContent = (id: string): SourceRegistryReference => {
  const entry = registry.contentTypes.getById(id);
  if (entry === undefined) {
    return missingReference(id, "ContentType");
  }
  return Object.freeze({
    registryEntryId: entry.identity.registryEntryId,
    registryEntryName: entry.identity.registryEntryName,
    kind: "ContentType",
    resolved: true,
  });
};

const csvDataSource = resolveDataSource(CANONICAL_IDS.csvDataSource);
const manualInputDataSource = resolveDataSource(CANONICAL_IDS.manualInputDataSource);
const fileUploadConnector = resolveConnector(CANONICAL_IDS.fileUploadConnector);
const manualEntryConnector = resolveConnector(CANONICAL_IDS.manualEntryConnector);
const tabularContent = resolveContent(CANONICAL_IDS.tabularContent);
const manualRecordContent = resolveContent(CANONICAL_IDS.manualRecordContent);

const ALL_REFERENCES: readonly SourceRegistryReference[] = Object.freeze([
  csvDataSource,
  manualInputDataSource,
  fileUploadConnector,
  manualEntryConnector,
  tabularContent,
  manualRecordContent,
]);

const unresolvedDiagnostics: readonly ImportDiagnostic[] = Object.freeze(
  ALL_REFERENCES.filter((ref) => !ref.resolved).map((ref) =>
    buildDiagnostic(DIAGNOSTIC_CODES.REGISTRY_REFERENCE_MISSING, {
      field: ref.registryEntryId,
      message: `Required DKL-2 registry reference ${ref.registryEntryId} could not be resolved.`,
    }),
  ),
);

/**
 * Immutable, canonical DKL-2 source references for CSV and manual input,
 * resolved through the released Public Index.
 */
export const CsvManualInputSourceReferences = Object.freeze({
  csvDataSource,
  manualInputDataSource,
  fileUploadConnector,
  manualEntryConnector,
  tabularContent,
  manualRecordContent,
  all: ALL_REFERENCES,
  allResolved: ALL_REFERENCES.every((ref) => ref.resolved),
  diagnostics: unresolvedDiagnostics,
  publicIndexNamespace: DataSourceKnowledgeRegistryPublicPlatform.publicIndex.identity.publicIndexNamespace,
});

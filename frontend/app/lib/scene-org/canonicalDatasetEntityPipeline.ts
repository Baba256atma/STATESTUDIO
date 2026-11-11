/**
 * NPA-T CANONICAL-DATASET-ENTITY-PIPELINE:1
 *
 * Reads one committed Dataset snapshot and prepares an approval plan.
 * Preview writes nothing. Approval is rejected when the Dataset version
 * or the object registry revision no longer matches the preview.
 */

import {
  getCsvRealDataImport,
  getCsvRemovedSourceReference,
} from "../data-reality/csvRealDataImportStore.ts";
import { listManagerDeckDatasetIds } from "../deck/nexoraDeckDatasetReferenceAuthority.ts";
import {
  applyDatasetReconciliation,
  associateCanonicalObjectSource,
  canonicalObjectRevision,
  getCanonicalObject,
  listCanonicalObjects,
  previewDatasetEntities,
  type CanonicalObjectFailure,
  type CanonicalObjectResult,
  type CanonicalObjectType,
  type DatasetEntityPreview,
} from "./canonicalObjectRegistry.ts";

export const canonicalDatasetEntityPipelineIdentity =
  "NPA-T CANONICAL-DATASET-ENTITY-PIPELINE:1/CommittedDatasetEntityPipeline" as const;

export const COMMITTED_DATASET_ENTITY_ROW_LIMIT = 500 as const;

export type CommittedDatasetSnapshot = Readonly<{
  workspaceId: string;
  sourceContextId: string;
  datasetIdentity: string;
  importId: string;
  contentFingerprint: string;
  columns: readonly string[];
  rows: readonly Readonly<Record<string, string>>[];
  rowCount: number;
}>;

export type EntityMappingConfiguration = Readonly<{
  objectType: CanonicalObjectType;
  sourceKeyColumn: string;
  displayNameColumn: string;
  attributeColumns: Readonly<Record<string, string>>;
}>;

export type EntityReconciliationPlan = Readonly<{
  workspaceId: string;
  deckId: string;
  datasetIdentity: string;
  sourceContextId: string;
  importId: string;
  datasetFingerprint: string;
  mappingFingerprint: string;
  registryRevision: number;
  mapping: EntityMappingConfiguration;
  preview: DatasetEntityPreview;
}>;

export type DatasetEntityFailure =
  | CanonicalObjectFailure
  | "dataset-missing"
  | "dataset-deleted"
  | "malformed-dataset"
  | "stale-dataset"
  | "stale-registry"
  | "wrong-deck"
  | "row-limit";

export type DatasetEntityResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; reason: DatasetEntityFailure }>;

function fingerprint(value: string): string {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(index);
  }
  return `fp:${(hash >>> 0).toString(16)}`;
}

function cellText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export function readCommittedDatasetSnapshot(
  workspaceId: string,
  sourceContextId: string,
): DatasetEntityResult<CommittedDatasetSnapshot> {
  if (getCsvRemovedSourceReference(workspaceId, sourceContextId)) {
    return { ok: false, reason: "dataset-deleted" };
  }
  const committed = getCsvRealDataImport(workspaceId, sourceContextId);
  if (!committed) return { ok: false, reason: "dataset-missing" };
  if (committed.workspaceId !== workspaceId || committed.sourceContextId !== sourceContextId) {
    return { ok: false, reason: "dataset-missing" };
  }
  const parse = committed.prepared.parse;
  if (!parse?.valid || !Array.isArray(parse.columns) || !Array.isArray(parse.records)) {
    return { ok: false, reason: "malformed-dataset" };
  }
  const columns = parse.columns.map((column) => column.name);
  const rows = parse.records.map((record) => {
    const row: Record<string, string> = {};
    columns.forEach((column, index) => {
      row[column] = cellText(record.values[index]);
    });
    return Object.freeze(row);
  });
  if (rows.length > COMMITTED_DATASET_ENTITY_ROW_LIMIT) return { ok: false, reason: "row-limit" };
  const contentFingerprint = fingerprint(JSON.stringify({
    importId: committed.importId,
    columns,
    rows,
  }));
  return {
    ok: true,
    value: Object.freeze({
      workspaceId,
      sourceContextId,
      datasetIdentity: sourceContextId,
      importId: committed.importId,
      contentFingerprint,
      columns: Object.freeze(columns),
      rows: Object.freeze(rows),
      rowCount: rows.length,
    }),
  };
}

function mappingFingerprint(mapping: EntityMappingConfiguration): string {
  return fingerprint(JSON.stringify({
    objectType: mapping.objectType,
    sourceKeyColumn: mapping.sourceKeyColumn,
    displayNameColumn: mapping.displayNameColumn,
    attributeColumns: mapping.attributeColumns,
  }));
}

export function previewCommittedDatasetEntities(input: {
  readonly workspaceId: string;
  readonly sourceContextId: string;
  readonly deckId: string;
  readonly mapping: EntityMappingConfiguration;
}): DatasetEntityResult<EntityReconciliationPlan> {
  const snapshot = readCommittedDatasetSnapshot(input.workspaceId, input.sourceContextId);
  if (!snapshot.ok) return snapshot;
  if (!snapshot.value.columns.includes(input.mapping.sourceKeyColumn) || !snapshot.value.columns.includes(input.mapping.displayNameColumn)) {
    return { ok: false, reason: "invalid-attribute" };
  }
  const preview = previewDatasetEntities({
    workspaceId: input.workspaceId,
    datasetId: snapshot.value.datasetIdentity,
    objectType: input.mapping.objectType,
    sourceKeyColumn: input.mapping.sourceKeyColumn,
    displayNameColumn: input.mapping.displayNameColumn,
    attributeColumns: input.mapping.attributeColumns,
    rows: snapshot.value.rows,
  });
  if (!preview.ok) return preview;
  return {
    ok: true,
    value: Object.freeze({
      workspaceId: input.workspaceId,
      deckId: input.deckId,
      datasetIdentity: snapshot.value.datasetIdentity,
      sourceContextId: snapshot.value.sourceContextId,
      importId: snapshot.value.importId,
      datasetFingerprint: snapshot.value.contentFingerprint,
      mappingFingerprint: mappingFingerprint(input.mapping),
      registryRevision: canonicalObjectRevision(),
      mapping: input.mapping,
      preview: preview.value,
    }),
  };
}

export function approveCommittedDatasetEntities(input: {
  readonly plan: EntityReconciliationPlan;
  readonly workspaceId: string;
  readonly deckId: string;
}): DatasetEntityResult<DatasetEntityPreview> {
  if (input.plan.workspaceId !== input.workspaceId) return { ok: false, reason: "invalid-workspace" };
  if (input.plan.deckId !== input.deckId) return { ok: false, reason: "wrong-deck" };
  const snapshot = readCommittedDatasetSnapshot(input.workspaceId, input.plan.sourceContextId);
  if (!snapshot.ok) return snapshot;
  if (
    snapshot.value.contentFingerprint !== input.plan.datasetFingerprint ||
    snapshot.value.importId !== input.plan.importId ||
    mappingFingerprint(input.plan.mapping) !== input.plan.mappingFingerprint
  ) {
    return { ok: false, reason: "stale-dataset" };
  }
  if (canonicalObjectRevision() !== input.plan.registryRevision) return { ok: false, reason: "stale-registry" };
  const fresh = previewCommittedDatasetEntities({
    workspaceId: input.workspaceId,
    sourceContextId: input.plan.sourceContextId,
    deckId: input.deckId,
    mapping: input.plan.mapping,
  });
  if (!fresh.ok) return fresh;
  if (fresh.value.datasetFingerprint !== input.plan.datasetFingerprint) return { ok: false, reason: "stale-dataset" };
  const applied = applyDatasetReconciliation({
    workspaceId: input.workspaceId,
    datasetId: input.plan.datasetIdentity,
    objectType: input.plan.mapping.objectType,
    sourceKeyColumn: input.plan.mapping.sourceKeyColumn,
    displayNameColumn: input.plan.mapping.displayNameColumn,
    attributeColumns: input.plan.mapping.attributeColumns,
    rows: snapshot.value.rows,
    deckId: input.deckId,
    createProposed: true,
    updateExisting: true,
  });
  if (!applied.ok) return applied;
  return { ok: true, value: input.plan.preview };
}

export type SourceLinkStatus =
  | "READY_TO_LINK"
  | "ALREADY_LINKED"
  | "IDENTITY_CONFLICT"
  | "ATTRIBUTE_CONFLICT"
  | "INVALID_SOURCE"
  | "UNAUTHORIZED";

export type SourceAttributeConflict = Readonly<{
  attribute: string;
  canonicalValue: string;
  sourceValue: string;
}>;

export type SourceLinkPlan = Readonly<{
  status: SourceLinkStatus;
  workspaceId: string;
  deckId: string;
  canonicalObjectId: string;
  objectUpdatedAt: string;
  objectType: CanonicalObjectType;
  displayName: string;
  datasetIdentity: string;
  sourceContextId: string;
  importId: string;
  datasetFingerprint: string;
  sourceKeyColumn: string;
  sourceKey: string;
  sourceDisplayName: string;
  attributeConflicts: readonly SourceAttributeConflict[];
}>;

function sameAttributeValue(current: string | number | boolean, source: string): boolean {
  if (typeof current === "number") return source.trim() !== "" && Number(source) === current;
  return String(current) === source;
}

export function previewSourceAssociation(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly canonicalObjectId: string;
  readonly sourceContextId: string;
  readonly sourceKeyColumn: string;
  readonly sourceKey: string;
  readonly displayNameColumn?: string;
  readonly attributeColumns?: Readonly<Record<string, string>>;
}): DatasetEntityResult<SourceLinkPlan> {
  const object = getCanonicalObject(input.workspaceId, input.canonicalObjectId);
  if (!object || object.workspaceId !== input.workspaceId || object.lifecycleStatus !== "ACTIVE") {
    return { ok: false, reason: "missing" };
  }
  if (!object.deckIds.includes(input.deckId)) return { ok: false, reason: "wrong-deck" };
  const snapshot = readCommittedDatasetSnapshot(input.workspaceId, input.sourceContextId);
  if (!snapshot.ok) return snapshot;
  const authorized = listManagerDeckDatasetIds(input.workspaceId, input.deckId).includes(snapshot.value.datasetIdentity);
  const sourceKey = input.sourceKey.trim();
  const row = snapshot.value.rows.find((entry) => (entry[input.sourceKeyColumn] ?? "").trim() === sourceKey);
  let status: SourceLinkStatus = "READY_TO_LINK";
  if (!authorized) status = "UNAUTHORIZED";
  else if (!snapshot.value.columns.includes(input.sourceKeyColumn) || sourceKey.length === 0 || !row) status = "INVALID_SOURCE";
  else if (object.sourceLinks.some((link) => link.datasetId === snapshot.value.datasetIdentity && link.sourceKey === sourceKey)) status = "ALREADY_LINKED";
  const attributeConflicts: SourceAttributeConflict[] = [];
  if (row && status !== "UNAUTHORIZED" && status !== "INVALID_SOURCE") {
    for (const [column, attribute] of Object.entries(input.attributeColumns ?? {})) {
      const sourceValue = (row[column] ?? "").trim();
      const canonicalValue = object.attributes[attribute];
      if (sourceValue.length === 0 || canonicalValue === undefined) continue;
      if (!sameAttributeValue(canonicalValue, sourceValue)) {
        attributeConflicts.push(Object.freeze({
          attribute,
          canonicalValue: String(canonicalValue),
          sourceValue,
        }));
      }
    }
    if (status === "READY_TO_LINK" && attributeConflicts.length > 0) status = "ATTRIBUTE_CONFLICT";
  }
  const owners = listCanonicalObjects(input.workspaceId).filter((entry) =>
    entry.canonicalObjectId !== object.canonicalObjectId &&
    entry.sourceLinks.some((link) =>
      link.datasetId === snapshot.value.datasetIdentity &&
      link.objectType === object.objectType &&
      link.sourceKey === sourceKey));
  if (owners.length > 0) status = "IDENTITY_CONFLICT";
  return {
    ok: true,
    value: Object.freeze({
      status,
      workspaceId: input.workspaceId,
      deckId: input.deckId,
      canonicalObjectId: object.canonicalObjectId,
      objectUpdatedAt: object.updatedAt,
      objectType: object.objectType,
      displayName: object.displayName,
      datasetIdentity: snapshot.value.datasetIdentity,
      sourceContextId: snapshot.value.sourceContextId,
      importId: snapshot.value.importId,
      datasetFingerprint: snapshot.value.contentFingerprint,
      sourceKeyColumn: input.sourceKeyColumn,
      sourceKey,
      sourceDisplayName: row && input.displayNameColumn ? (row[input.displayNameColumn] ?? "").trim() : object.displayName,
      attributeConflicts: Object.freeze(attributeConflicts),
    }),
  };
}

export function approveSourceAssociation(input: {
  readonly plan: SourceLinkPlan;
  readonly workspaceId: string;
  readonly deckId: string;
}): DatasetEntityResult<SourceLinkPlan> {
  if (input.plan.workspaceId !== input.workspaceId) return { ok: false, reason: "invalid-workspace" };
  if (input.plan.deckId !== input.deckId) return { ok: false, reason: "wrong-deck" };
  const fresh = previewSourceAssociation({
    workspaceId: input.workspaceId,
    deckId: input.deckId,
    canonicalObjectId: input.plan.canonicalObjectId,
    sourceContextId: input.plan.sourceContextId,
    sourceKeyColumn: input.plan.sourceKeyColumn,
    sourceKey: input.plan.sourceKey,
    attributeColumns: Object.fromEntries(input.plan.attributeConflicts.map((conflict) => [conflict.attribute, conflict.attribute])),
  });
  if (!fresh.ok) return fresh;
  if (fresh.value.datasetFingerprint !== input.plan.datasetFingerprint || fresh.value.importId !== input.plan.importId) {
    return { ok: false, reason: "stale-dataset" };
  }
  if (fresh.value.status === "IDENTITY_CONFLICT") return { ok: false, reason: "conflict" };
  if (fresh.value.status === "UNAUTHORIZED" || fresh.value.status === "INVALID_SOURCE") {
    return { ok: false, reason: fresh.value.status === "UNAUTHORIZED" ? "wrong-deck" : "invalid-attribute" };
  }
  if (fresh.value.objectUpdatedAt !== input.plan.objectUpdatedAt && fresh.value.status !== "ALREADY_LINKED") {
    return { ok: false, reason: "stale-registry" };
  }
  if (fresh.value.status === "ALREADY_LINKED") return { ok: true, value: fresh.value };
  const linked = associateCanonicalObjectSource({
    workspaceId: input.workspaceId,
    canonicalObjectId: input.plan.canonicalObjectId,
    datasetId: input.plan.datasetIdentity,
    sourceKey: input.plan.sourceKey,
  });
  if (!linked.ok) return linked;
  if (linked.value.canonicalObjectId !== input.plan.canonicalObjectId) return { ok: false, reason: "conflict" };
  return { ok: true, value: fresh.value };
}

export function committedDatasetEntityResult<T>(result: CanonicalObjectResult<T>): DatasetEntityResult<T> {
  return result;
}

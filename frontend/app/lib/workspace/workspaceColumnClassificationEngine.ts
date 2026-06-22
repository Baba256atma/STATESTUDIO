/**
 * DS-1:2 — Workspace column classification engine.
 * Reads DS-1:1 schema via getDataSourceSchema only — no CSV re-parse, no downstream triggers.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import { guardWorkspaceDataSourceAccess } from "./workspaceDataSourceIsolationGuard.ts";
import { resolveWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import type { WorkspaceDataSourceColumnSchema } from "./workspaceDataSourceSchemaContract.ts";
import { getDataSourceSchema } from "./workspaceDataSourceSchemaResolver.ts";
import {
  NEXORA_COLUMN_CLASSIFICATION_LOG_PREFIX,
  WORKSPACE_COLUMN_CLASSIFICATION_SOURCE,
  WORKSPACE_COLUMN_CLASSIFICATION_TAGS,
  WORKSPACE_COLUMN_CLASSIFICATION_VERSION,
  workspaceColumnClassificationIsComplete,
  workspaceDataSourceColumnClassificationProfileIsComplete,
  type ClassifyDataSourceColumnsResult,
  type ColumnBusinessRole,
  type WorkspaceColumnClassification,
  type WorkspaceColumnClassificationStore,
  type WorkspaceDataSourceColumnClassificationProfile,
} from "./workspaceColumnClassificationContract.ts";

const STORAGE_KEY = "nexora.workspaceColumnClassifications.v2";

type ColumnClassificationListener = () => void;

const columnClassificationListeners = new Set<ColumnClassificationListener>();

let workspaceColumnClassifications: WorkspaceColumnClassificationStore = {};
let columnClassificationHydrated = false;
let columnClassificationVersion = 0;
let classificationUpdatedAt: string | null = null;

const IDENTIFIER_PATTERNS: readonly RegExp[] = [
  /^id$/,
  /_id$/,
  /_key$/,
  /_code$/,
  /_uuid$/,
  /^uuid$/,
  /^guid$/,
  /^sku$/,
  /identifier/,
  /^account_id$/,
  /^customer_id$/,
  /^supplier_id$/,
];

const NAME_PATTERNS: readonly RegExp[] = [
  /_name$/,
  /^name$/,
  /_title$/,
  /^title$/,
  /customer_name$/,
  /supplier_name$/,
];

const METRIC_PATTERNS: readonly RegExp[] = [
  /revenue/,
  /expense/,
  /expenses/,
  /profit/,
  /margin/,
  /amount/,
  /price/,
  /cost/,
  /total/,
  /sales/,
  /value/,
];

const PERCENTAGE_PATTERNS: readonly RegExp[] = [/percent/, /percentage/, /pct/, /margin_percent/, /margin_pct/];

const DATE_PATTERNS: readonly RegExp[] = [
  /date/,
  /created_at/,
  /updated_at/,
  /order_date/,
  /invoice_date/,
  /timestamp/,
  /started/,
  /ended/,
];

const STATUS_PATTERNS: readonly RegExp[] = [/status/, /^state$/, /stage/];

const CATEGORY_PATTERNS: readonly RegExp[] = [/region/, /department/, /category/, /segment/, /channel/, /tier/];

const LOCATION_PATTERNS: readonly RegExp[] = [/country/, /city/, /location/, /address/, /postal/, /zip/];

const QUANTITY_PATTERNS: readonly RegExp[] = [/quantity/, /^qty$/, /units/, /^count$/, /unit_count/];

const UNKNOWN_PATTERNS: readonly RegExp[] = [/^notes$/, /^misc$/, /^comment/, /^description$/];

function nowIso(): string {
  return new Date().toISOString();
}

function emitColumnClassificationDiagnostic(
  message: string,
  payload: Readonly<{
    workspaceId: string;
    dataSourceId: string;
    columnName: string;
    businessRole: ColumnBusinessRole;
    confidence: number;
    reason: string;
  }> & Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("columnClassification", `${NEXORA_COLUMN_CLASSIFICATION_LOG_PREFIX} ${message}`, {
    ...payload,
    tags: WORKSPACE_COLUMN_CLASSIFICATION_TAGS,
    phase: "DS-1:2",
  });
}

function notifyColumnClassificationListeners(): void {
  columnClassificationVersion += 1;
  columnClassificationListeners.forEach((listener) => listener());
}

function normalizeStoredProfiles(raw: unknown): WorkspaceColumnClassificationStore {
  if (!raw || typeof raw !== "object") return {};

  const normalized: Record<
    WorkspaceId,
    Readonly<Record<string, WorkspaceDataSourceColumnClassificationProfile>>
  > = {};

  for (const [workspaceId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const byDataSource: Record<string, WorkspaceDataSourceColumnClassificationProfile> = {};
      for (const profile of value as WorkspaceDataSourceColumnClassificationProfile[]) {
        if (profile?.dataSourceId) {
          byDataSource[profile.dataSourceId] = profile;
        }
      }
      normalized[workspaceId] = Object.freeze(byDataSource);
      continue;
    }
    if (value && typeof value === "object") {
      normalized[workspaceId] = Object.freeze({
        ...(value as Record<string, WorkspaceDataSourceColumnClassificationProfile>),
      });
    }
  }

  return Object.freeze(normalized);
}

function readStorage(): WorkspaceColumnClassificationStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return normalizeStoredProfiles(JSON.parse(raw));
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceColumnClassifications));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function hydrateColumnClassificationStore(): void {
  if (columnClassificationHydrated) return;
  columnClassificationHydrated = true;
  workspaceColumnClassifications = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function normalizeColumnToken(columnName: string): string {
  return columnName
    .trim()
    .toLowerCase()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function matchesAnyPattern(token: string, patterns: readonly RegExp[]): string | null {
  for (const pattern of patterns) {
    if (pattern.test(token)) return pattern.source;
  }
  return null;
}

function freezeClassification(
  classification: WorkspaceColumnClassification
): WorkspaceColumnClassification {
  return Object.freeze({ ...classification });
}

function freezeProfile(
  profile: WorkspaceDataSourceColumnClassificationProfile
): WorkspaceDataSourceColumnClassificationProfile {
  const columns: Record<string, WorkspaceColumnClassification> = {};
  for (const [columnName, classification] of Object.entries(profile.columns)) {
    columns[columnName] = freezeClassification(classification);
  }
  return Object.freeze({
    ...profile,
    columns: Object.freeze(columns),
  });
}

function getDataSourceProfiles(
  workspaceId: WorkspaceId
): Readonly<Record<string, WorkspaceDataSourceColumnClassificationProfile>> {
  return workspaceColumnClassifications[workspaceId] ?? Object.freeze({});
}

function commitClassificationChange(timestamp = nowIso()): void {
  classificationUpdatedAt = timestamp;
  writeStorage();
  notifyColumnClassificationListeners();
}

function guardClassificationRead(
  workspaceId: WorkspaceId,
  dataSourceId?: string | null
): boolean {
  const trimmedDataSourceId = dataSourceId?.trim() ?? null;
  if (!trimmedDataSourceId) {
    return guardWorkspaceDataSourceAccess({ action: "read", workspaceId }).allowed;
  }

  const dataSource = resolveWorkspaceDataSource(workspaceId, trimmedDataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: "read",
      workspaceId,
      dataSource,
      dataSourceId: trimmedDataSourceId,
    }).allowed;
  }

  return guardWorkspaceDataSourceAccess({ action: "read", workspaceId }).allowed;
}

function guardClassificationWrite(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  isCreate: boolean
): boolean {
  const dataSource = resolveWorkspaceDataSource(workspaceId, dataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: isCreate ? "import" : "update",
      workspaceId,
      dataSource,
      dataSourceId,
    }).allowed;
  }

  return guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
    dataSourceId,
  }).allowed;
}

export function classifyColumnFromSchemaColumn(input: {
  workspaceId: WorkspaceId;
  dataSourceId: string;
  column: WorkspaceDataSourceColumnSchema;
  classifiedAt?: string;
}): WorkspaceColumnClassification {
  const token = normalizeColumnToken(input.column.columnName);
  const detectedType = input.column.detectedType;
  const timestamp = input.classifiedAt ?? nowIso();

  const base = {
    workspaceId: input.workspaceId.trim(),
    dataSourceId: input.dataSourceId.trim(),
    columnName: input.column.columnName.trim(),
    detectedType,
    classifiedAt: timestamp,
    source: WORKSPACE_COLUMN_CLASSIFICATION_SOURCE,
  } as const;

  if (!token || input.column.nullPercentage >= 100) {
    return freezeClassification({
      ...base,
      businessRole: "Unknown",
      confidence: 0.2,
      reason: "Column is empty or unnamed in schema profile",
    });
  }

  if (matchesAnyPattern(token, UNKNOWN_PATTERNS)) {
    return freezeClassification({
      ...base,
      businessRole: "Unknown",
      confidence: 0.2,
      reason: "Column name indicates unstructured notes or miscellaneous content",
    });
  }

  const identifierPattern = matchesAnyPattern(token, IDENTIFIER_PATTERNS);
  if (identifierPattern || detectedType === "identifier") {
    const exactMatch = token.endsWith("_id") || token === "id" || token === "account_id";
    return freezeClassification({
      ...base,
      businessRole: "Identifier",
      confidence: exactMatch ? 0.95 : detectedType === "identifier" ? 0.88 : 0.82,
      reason: exactMatch
        ? "Exact identifier column name match"
        : "Column name and schema type indicate an entity identifier",
    });
  }

  const namePattern = matchesAnyPattern(token, NAME_PATTERNS);
  if (namePattern) {
    return freezeClassification({
      ...base,
      businessRole: "Name",
      confidence: token.endsWith("_name") || token === "name" ? 0.93 : 0.85,
      reason: "Column name matches entity name pattern",
    });
  }

  const datePattern = matchesAnyPattern(token, DATE_PATTERNS);
  if (datePattern || detectedType === "date") {
    return freezeClassification({
      ...base,
      businessRole: "Date",
      confidence: detectedType === "date" && datePattern ? 0.92 : detectedType === "date" ? 0.86 : 0.8,
      reason: "Column name and schema type indicate a temporal field",
    });
  }

  const statusPattern = matchesAnyPattern(token, STATUS_PATTERNS);
  if (statusPattern) {
    return freezeClassification({
      ...base,
      businessRole: "Status",
      confidence: 0.9,
      reason: "Column name matches lifecycle status pattern",
    });
  }

  if (detectedType === "boolean") {
    return freezeClassification({
      ...base,
      businessRole: statusPattern ? "Status" : "Boolean",
      confidence: statusPattern ? 0.88 : 0.84,
      reason: statusPattern
        ? "Boolean schema type with status-like column name"
        : "Schema detected boolean values for this column",
    });
  }

  const percentagePattern = matchesAnyPattern(token, PERCENTAGE_PATTERNS);
  if (detectedType === "percentage" || percentagePattern) {
    return freezeClassification({
      ...base,
      businessRole: "Percentage",
      confidence: detectedType === "percentage" && percentagePattern ? 0.91 : 0.83,
      reason: "Column represents a percentage metric",
    });
  }

  if (detectedType === "currency") {
    const metricPattern = matchesAnyPattern(token, METRIC_PATTERNS);
    return freezeClassification({
      ...base,
      businessRole: "Currency",
      confidence: metricPattern ? 0.9 : 0.82,
      reason: metricPattern
        ? "Currency schema type with financial metric column name"
        : "Schema detected currency values for this column",
    });
  }

  const metricPattern = matchesAnyPattern(token, METRIC_PATTERNS);
  if (metricPattern || (detectedType === "number" && /amount|revenue|cost|expense|profit|margin|price/.test(token))) {
    return freezeClassification({
      ...base,
      businessRole: "Metric",
      confidence: metricPattern ? 0.88 : 0.72,
      reason: metricPattern
        ? "Column name matches financial metric pattern"
        : "Numeric schema type with metric-like column name",
    });
  }

  const quantityPattern = matchesAnyPattern(token, QUANTITY_PATTERNS);
  if (quantityPattern) {
    return freezeClassification({
      ...base,
      businessRole: "Quantity",
      confidence: token === "quantity" || token === "qty" ? 0.9 : 0.8,
      reason: "Column name matches quantity or count pattern",
    });
  }

  const locationPattern = matchesAnyPattern(token, LOCATION_PATTERNS);
  if (locationPattern) {
    return freezeClassification({
      ...base,
      businessRole: "Location",
      confidence: 0.86,
      reason: "Column name matches geographic location pattern",
    });
  }

  const categoryPattern = matchesAnyPattern(token, CATEGORY_PATTERNS);
  if (categoryPattern) {
    return freezeClassification({
      ...base,
      businessRole: "Category",
      confidence: token === "region" || token === "category" || token === "department" ? 0.9 : 0.78,
      reason: "Column name matches categorical grouping pattern",
    });
  }

  if (detectedType === "number") {
    return freezeClassification({
      ...base,
      businessRole: "Metric",
      confidence: 0.55,
      reason: "Numeric schema type without a stronger business role signal",
    });
  }

  if (detectedType === "text") {
    return freezeClassification({
      ...base,
      businessRole: "Text",
      confidence: 0.5,
      reason: "Text schema type without a stronger business role signal",
    });
  }

  return freezeClassification({
    ...base,
    businessRole: "Unknown",
    confidence: 0.2,
    reason: "No deterministic business role rule matched",
  });
}

export function classifyDataSourceColumns(
  workspaceId: WorkspaceId,
  dataSourceId: string
): ClassifyDataSourceColumnsResult {
  hydrateColumnClassificationStore();

  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "missing_identifier",
      created: false,
    });
  }

  if (!guardClassificationWrite(trimmedWorkspaceId, trimmedDataSourceId, !getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId])) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "access_denied",
      created: false,
    });
  }

  const schema = getDataSourceSchema(trimmedWorkspaceId, trimmedDataSourceId);
  if (!schema) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "schema_not_found",
      created: false,
    });
  }

  const timestamp = nowIso();
  const columns: Record<string, WorkspaceColumnClassification> = {};
  const classifications: WorkspaceColumnClassification[] = [];

  for (const column of schema.columns) {
    const classification = classifyColumnFromSchemaColumn({
      workspaceId: trimmedWorkspaceId,
      dataSourceId: trimmedDataSourceId,
      column,
      classifiedAt: timestamp,
    });
    columns[column.columnName] = classification;
    classifications.push(classification);
    emitColumnClassificationDiagnostic("Column Classified", {
      workspaceId: trimmedWorkspaceId,
      dataSourceId: trimmedDataSourceId,
      columnName: classification.columnName,
      businessRole: classification.businessRole,
      confidence: classification.confidence,
      reason: classification.reason,
    });
  }

  const current = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  const nextProfile = freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_COLUMN_CLASSIFICATION_VERSION,
      workspaceId: trimmedWorkspaceId,
      dataSourceId: trimmedDataSourceId,
      fileName: schema.fileName,
      columns: Object.freeze(columns),
      classifiedAt: current?.classifiedAt ?? timestamp,
      updatedAt: timestamp,
    })
  );

  if (!workspaceDataSourceColumnClassificationProfileIsComplete(nextProfile)) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "invalid_classification_profile",
      created: false,
    });
  }

  workspaceColumnClassifications = Object.freeze({
    ...workspaceColumnClassifications,
    [trimmedWorkspaceId]: Object.freeze({
      ...getDataSourceProfiles(trimmedWorkspaceId),
      [trimmedDataSourceId]: nextProfile,
    }),
  });
  commitClassificationChange(timestamp);

  return Object.freeze({
    success: true,
    classifications: Object.freeze(classifications),
    reason: current ? "updated" : "created",
    created: !current,
  });
}

export function persistWorkspaceDataSourceColumnClassificationProfile(
  profile: WorkspaceDataSourceColumnClassificationProfile
): ClassifyDataSourceColumnsResult {
  hydrateColumnClassificationStore();

  if (!workspaceDataSourceColumnClassificationProfileIsComplete(profile)) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "invalid_classification_profile",
      created: false,
    });
  }

  const workspaceId = profile.workspaceId.trim();
  const dataSourceId = profile.dataSourceId.trim();
  const current = getDataSourceProfiles(workspaceId)[dataSourceId] ?? null;

  if (!guardClassificationWrite(workspaceId, dataSourceId, !current)) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "access_denied",
      created: false,
    });
  }

  const nextProfile = freezeProfile(
    Object.freeze({
      ...profile,
      workspaceId,
      dataSourceId,
      classifiedAt: current?.classifiedAt ?? profile.classifiedAt,
      updatedAt: profile.updatedAt || nowIso(),
    })
  );

  workspaceColumnClassifications = Object.freeze({
    ...workspaceColumnClassifications,
    [workspaceId]: Object.freeze({
      ...getDataSourceProfiles(workspaceId),
      [dataSourceId]: nextProfile,
    }),
  });
  commitClassificationChange(nextProfile.updatedAt);

  for (const classification of Object.values(nextProfile.columns)) {
    emitColumnClassificationDiagnostic("Column Classified", {
      workspaceId,
      dataSourceId,
      columnName: classification.columnName,
      businessRole: classification.businessRole,
      confidence: classification.confidence,
      reason: classification.reason,
    });
  }

  return Object.freeze({
    success: true,
    classifications: Object.freeze(Object.values(nextProfile.columns).map(freezeClassification)),
    reason: current ? "updated" : "created",
    created: !current,
  });
}

export function getColumnClassifications(
  workspaceId: WorkspaceId,
  dataSourceId: string
): readonly WorkspaceColumnClassification[] {
  hydrateColumnClassificationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return Object.freeze([]);
  if (!guardClassificationRead(trimmedWorkspaceId, trimmedDataSourceId)) return Object.freeze([]);

  const profile = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  if (!profile) return Object.freeze([]);
  return Object.freeze(Object.values(profile.columns).map(freezeClassification));
}

export function getColumnClassification(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  columnName: string
): WorkspaceColumnClassification | null {
  hydrateColumnClassificationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  const trimmedColumnName = columnName.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId || !trimmedColumnName) return null;
  if (!guardClassificationRead(trimmedWorkspaceId, trimmedDataSourceId)) return null;

  const profile = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  const match = profile?.columns[trimmedColumnName] ?? null;
  return match ? freezeClassification(match) : null;
}

export function removeWorkspaceColumnClassificationProfile(
  workspaceId: WorkspaceId,
  dataSourceId: string
): ClassifyDataSourceColumnsResult {
  hydrateColumnClassificationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "missing_identifier",
      created: false,
    });
  }

  const current = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  if (!current) {
    return Object.freeze({
      success: false,
      classifications: Object.freeze([]),
      reason: "classification_not_found",
      created: false,
    });
  }

  const { [trimmedDataSourceId]: _removed, ...remaining } = getDataSourceProfiles(trimmedWorkspaceId);
  workspaceColumnClassifications = Object.freeze({
    ...workspaceColumnClassifications,
    [trimmedWorkspaceId]: Object.freeze(remaining),
  });
  commitClassificationChange();
  return Object.freeze({
    success: true,
    classifications: Object.freeze([]),
    reason: "removed",
    created: false,
  });
}

export function resetWorkspaceColumnClassificationStoreForTests(): void {
  workspaceColumnClassifications = {};
  columnClassificationHydrated = false;
  columnClassificationVersion = 0;
  classificationUpdatedAt = null;
  columnClassificationListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("nexora.workspaceColumnClassifications.v1");
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function getWorkspaceColumnClassificationProfile(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceColumnClassificationProfile | null {
  hydrateColumnClassificationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return null;
  if (!guardClassificationRead(trimmedWorkspaceId, trimmedDataSourceId)) return null;
  const profile = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  return profile ? freezeProfile(profile) : null;
}

export function listWorkspaceColumnClassificationProfiles(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceDataSourceColumnClassificationProfile[] {
  hydrateColumnClassificationStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId || !guardClassificationRead(resolvedWorkspaceId)) return Object.freeze([]);
  return Object.freeze(Object.values(getDataSourceProfiles(resolvedWorkspaceId)).map(freezeProfile));
}

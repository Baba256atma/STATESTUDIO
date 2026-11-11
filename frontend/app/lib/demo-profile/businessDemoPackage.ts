/**
 * BUSINESS-DEMO-PACKAGE:1 — Business Demo CSV package.
 *
 * Three original synthetic series for business_demo_workspace only.
 * Month-end 2026-03 through 2026-08. Revenue rises, with one dip, on-hand
 * inventory falls into a low-stock condition, and operating cost drifts upward.
 * Current Revenue is paired with Previous Revenue because the existing
 * revenue growth KPI requires both mapped metrics.
 * This module does not create a Deck, Stage objects, or a demo profile.
 */
import {
  commitPreparedCsvRealDataImport,
  exportCsvRealDataImportState,
  getCsvRealDataImport,
  hydrateCsvRealDataImportState,
  listCsvRealDataImports,
  type CsvCommittedImport,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  createIndexedDbCsvDurabilityStorage,
  parseCsvDurableSnapshot,
  persistCsvRealDataImportDurability,
  type CsvDurabilityStorage,
} from "../data-reality/csvRealDataImportDurability.ts";
import {
  csvCanonicalSourceContextId,
  parseCsvDeterministically,
  prepareCsvRealDataImport,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { BUSINESS_DEMO_WORKSPACE_ID, type WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const businessDemoPackageIdentity = "BUSINESS-DEMO-PACKAGE:1" as const;
export const BUSINESS_DEMO_COMMITTED_AT = "2026-08-31T00:00:00.000Z";
export const BUSINESS_DEMO_IMPORT_PREFIX = "business-demo:" as const;

export const BUSINESS_DEMO_SALES_FILE = "sales.csv";
export const BUSINESS_DEMO_INVENTORY_FILE = "inventory.csv";
export const BUSINESS_DEMO_EXPENSES_FILE = "expenses.csv";

export const BUSINESS_DEMO_SALES_TEXT =
  "Date,Current Revenue,Previous Revenue\n2026-03-31,84200,79800\n2026-04-30,87500,84200\n2026-05-31,90100,87500\n2026-06-30,94800,90100\n2026-07-31,91200,94800\n2026-08-31,98600,91200\n";

export const BUSINESS_DEMO_INVENTORY_TEXT =
  "Date,Inventory On Hand\n2026-03-31,480\n2026-04-30,410\n2026-05-31,360\n2026-06-30,290\n2026-07-31,210\n2026-08-31,140\n";

export const BUSINESS_DEMO_EXPENSES_TEXT =
  "Date,Operating Cost\n2026-03-31,51200\n2026-04-30,52800\n2026-05-31,54100\n2026-06-30,53600\n2026-07-31,55900\n2026-08-31,57200\n";

export const BUSINESS_DEMO_PACKAGE_FILES = Object.freeze([
  Object.freeze({
    fileName: BUSINESS_DEMO_SALES_FILE,
    csvText: BUSINESS_DEMO_SALES_TEXT,
    objectKey: "revenue" as const,
    targetId: "revenue.current" as const,
  }),
  Object.freeze({
    fileName: BUSINESS_DEMO_INVENTORY_FILE,
    csvText: BUSINESS_DEMO_INVENTORY_TEXT,
    objectKey: "inventory" as const,
    targetId: "inventory.on-hand" as const,
  }),
  Object.freeze({
    fileName: BUSINESS_DEMO_EXPENSES_FILE,
    csvText: BUSINESS_DEMO_EXPENSES_TEXT,
    objectKey: "cost" as const,
    targetId: "cost.operating" as const,
  }),
]);

export type BusinessDemoPackageStatus =
  | "loaded"
  | "already_present"
  | "refused_wrong_workspace"
  | "failed_validation"
  | "failed_persistence";

export type BusinessDemoPackageFileReport = Readonly<{
  fileName: string;
  importId: string;
  sourceContextId: string;
  workspaceId: typeof BUSINESS_DEMO_WORKSPACE_ID;
  objectKey: "revenue" | "inventory" | "cost";
  targetId: string;
  rowCount: number;
  ready: boolean;
  committed: boolean;
  alreadyPresent: boolean;
  conflict: boolean;
  recognizedTargets: readonly string[];
  errors: readonly string[];
}>;

export type BusinessDemoPackageReport = Readonly<{
  identity: typeof businessDemoPackageIdentity;
  status: BusinessDemoPackageStatus;
  workspaceId: WorkspaceId;
  activeWorkspaceId: WorkspaceId;
  refused: boolean;
  files: readonly BusinessDemoPackageFileReport[];
}>;

export function businessDemoImportId(fileName: string): string {
  return `${BUSINESS_DEMO_IMPORT_PREFIX}${BUSINESS_DEMO_WORKSPACE_ID}:${fileName}`;
}

function emptyReport(activeWorkspaceId: WorkspaceId, status: BusinessDemoPackageStatus): BusinessDemoPackageReport {
  return Object.freeze({
    identity: businessDemoPackageIdentity,
    status,
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    activeWorkspaceId,
    refused: status === "refused_wrong_workspace",
    files: Object.freeze([]),
  });
}

function recordKey(workspaceId: string, id: string): string {
  return `${workspaceId}\u0000${id}`;
}

function mergeByKey<T>(
  current: readonly T[],
  stored: readonly T[],
  keyOf: (record: T) => string,
): readonly T[] {
  const merged = new Map<string, T>();
  for (const record of stored) merged.set(keyOf(record), record);
  for (const record of current) merged.set(keyOf(record), record);
  return Object.freeze([...merged.values()]);
}

function sameMembership(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const seen = new Set(left);
  return right.every((key) => seen.has(key));
}

/**
 * Pull durable rows that are absent from memory.
 * An in-memory record wins on the same workspace and source key, so a stored
 * row with different ownership cannot replace it.
 */
async function recoverMissingCsvSnapshot(storage: CsvDurabilityStorage): Promise<void> {
  const raw = await storage.get();
  if (!raw) return;
  const parsed = parseCsvDurableSnapshot(raw);
  if (!parsed.snapshot) return;
  const current = exportCsvRealDataImportState();
  const committed = mergeByKey(
    current.committed,
    parsed.snapshot.committed,
    (entry) => recordKey(entry.workspaceId, entry.sourceContextId),
  );
  const pending = mergeByKey(
    current.pending,
    parsed.snapshot.pending,
    (entry) => recordKey(entry.workspaceId, entry.candidateId),
  );
  const removed = mergeByKey(
    current.removed,
    parsed.snapshot.removed,
    (entry) => recordKey(entry.workspaceId, entry.sourceId),
  );
  const unchanged = sameMembership(
    current.committed.map((entry) => recordKey(entry.workspaceId, entry.sourceContextId)),
    committed.map((entry) => recordKey(entry.workspaceId, entry.sourceContextId)),
  ) && sameMembership(
    current.pending.map((entry) => recordKey(entry.workspaceId, entry.candidateId)),
    pending.map((entry) => recordKey(entry.workspaceId, entry.candidateId)),
  ) && sameMembership(
    current.removed.map((entry) => recordKey(entry.workspaceId, entry.sourceId)),
    removed.map((entry) => recordKey(entry.workspaceId, entry.sourceId)),
  );
  if (unchanged) return;
  hydrateCsvRealDataImportState({ committed, pending, removed });
}

function resolveStorage(storage: CsvDurabilityStorage | undefined): CsvDurabilityStorage | null {
  if (storage) return storage;
  if (typeof indexedDB === "undefined") return null;
  return createIndexedDbCsvDurabilityStorage();
}

function inspectFile(file: (typeof BUSINESS_DEMO_PACKAGE_FILES)[number]): BusinessDemoPackageFileReport {
  const importId = businessDemoImportId(file.fileName);
  const sourceContextId = csvCanonicalSourceContextId(BUSINESS_DEMO_WORKSPACE_ID, file.fileName);
  const parse = parseCsvDeterministically(file.csvText);
  const prepared = prepareCsvRealDataImport({
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    fileName: file.fileName,
    fileSize: file.csvText.length,
    csvText: file.csvText,
    importId,
    importedAt: BUSINESS_DEMO_COMMITTED_AT,
  });
  const recognizedTargets = Object.freeze(
    prepared.mapping.mappings
      .filter((entry) => entry.confirmed && !entry.ignored && entry.targetId)
      .map((entry) => entry.targetId as string),
  );
  const existing = getCsvRealDataImport(BUSINESS_DEMO_WORKSPACE_ID, sourceContextId);
  const conflict = Boolean(
    existing &&
      (existing.importId !== importId ||
        existing.workspaceId !== BUSINESS_DEMO_WORKSPACE_ID ||
        existing.prepared.workspaceId !== BUSINESS_DEMO_WORKSPACE_ID),
  );
  return Object.freeze({
    fileName: file.fileName,
    importId,
    sourceContextId,
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    objectKey: file.objectKey,
    targetId: file.targetId,
    rowCount: parse.records.length,
    ready: prepared.ready && recognizedTargets.includes(file.targetId),
    committed: false,
    alreadyPresent: Boolean(existing && !conflict),
    conflict,
    recognizedTargets,
    errors: Object.freeze(
      prepared.ready
        ? conflict
          ? ["existing_import_ownership_conflict"]
          : []
        : prepared.errors,
    ),
  });
}

export async function ensureBusinessDemoPackage(input: {
  readonly storage?: CsvDurabilityStorage;
  readonly writtenAt?: string;
} = {}): Promise<BusinessDemoPackageReport> {
  const activeWorkspaceId = readLiveExecutiveDataWorkspaceId();
  if (activeWorkspaceId !== BUSINESS_DEMO_WORKSPACE_ID) {
    return emptyReport(activeWorkspaceId, "refused_wrong_workspace");
  }

  const storage = resolveStorage(input.storage);
  if (!storage) return emptyReport(activeWorkspaceId, "failed_persistence");

  await recoverMissingCsvSnapshot(storage);
  const workspaceAfterRecovery = readLiveExecutiveDataWorkspaceId();
  if (workspaceAfterRecovery !== BUSINESS_DEMO_WORKSPACE_ID) {
    return emptyReport(workspaceAfterRecovery, "refused_wrong_workspace");
  }
  const inspected = BUSINESS_DEMO_PACKAGE_FILES.map(inspectFile);
  if (inspected.some((file) => !file.ready || file.conflict)) {
    return Object.freeze({
      identity: businessDemoPackageIdentity,
      status: "failed_validation" as const,
      workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
      activeWorkspaceId,
      refused: false,
      files: Object.freeze(inspected),
    });
  }

  const files = inspected.map((file) => {
    if (file.alreadyPresent) return file;
    const source = BUSINESS_DEMO_PACKAGE_FILES.find((entry) => entry.fileName === file.fileName)!;
    const prepared = prepareCsvRealDataImport({
      workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
      fileName: source.fileName,
      fileSize: source.csvText.length,
      csvText: source.csvText,
      importId: file.importId,
      importedAt: BUSINESS_DEMO_COMMITTED_AT,
    });
    const committed = commitPreparedCsvRealDataImport({
      prepared,
      expectedWorkspaceId: BUSINESS_DEMO_WORKSPACE_ID,
      mode: "new",
      committedAt: BUSINESS_DEMO_COMMITTED_AT,
    });
    const kept = committed.committed || committed.reason === "source_exists";
    return Object.freeze({
      ...file,
      committed: committed.committed,
      alreadyPresent: committed.reason === "source_exists",
      errors: Object.freeze(kept ? [] : [committed.reason]),
      ready: kept,
    });
  });

  if (files.some((file) => !file.ready)) {
    return Object.freeze({
      identity: businessDemoPackageIdentity,
      status: "failed_validation" as const,
      workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
      activeWorkspaceId,
      refused: false,
      files: Object.freeze(files),
    });
  }

  const persisted = await persistCsvRealDataImportDurability(
    storage,
    input.writtenAt ?? BUSINESS_DEMO_COMMITTED_AT,
  );
  if (!persisted.persisted) {
    return Object.freeze({
      identity: businessDemoPackageIdentity,
      status: "failed_persistence" as const,
      workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
      activeWorkspaceId,
      refused: false,
      files: Object.freeze(files),
    });
  }

  const status: BusinessDemoPackageStatus = files.some((file) => file.committed)
    ? "loaded"
    : "already_present";
  return Object.freeze({
    identity: businessDemoPackageIdentity,
    status,
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    activeWorkspaceId,
    refused: false,
    files: Object.freeze(files),
  });
}

export function listBusinessDemoPackageImports(): readonly CsvCommittedImport[] {
  const ids = new Set(BUSINESS_DEMO_PACKAGE_FILES.map((file) => businessDemoImportId(file.fileName)));
  return Object.freeze(
    listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).filter((entry) => ids.has(entry.importId)),
  );
}

/**
 * RDI:2 live MVP demo bootstrap.
 * Commits governed demo CSV through the existing prepare+commit path.
 * Not a second Data Reality, chart engine, or conversation owner.
 */
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  getCsvImportCandidate,
  listCsvImportCandidates,
  listCsvRealDataImports,
  saveCsvImportCandidate,
} from "./csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
} from "./csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "./csvSemanticUnderstanding.ts";

export const csvRealDataMvpDemoBootstrapIdentity =
  "RDI:2/CsvMvpDemoBootstrap" as const;

export const CSV_MVP_DEMO_BOOTSTRAP_BOUNDARY = Object.freeze({
  ownsDataReality: false as const,
  ownsCsvStore: false as const,
  ownsChartRenderer: false as const,
  ownsConversation: false as const,
  seedsRenderer: false as const,
  demoDataOnly: true as const,
});

export const CSV_MVP_DEMO_INVENTORY_FILE = "inventory-observations.csv";
export const CSV_MVP_DEMO_PENDING_FILE = "data-ux3-ambiguous.csv";
export const CSV_MVP_DEMO_COMMITTED_AT = "2026-06-01T00:00:00.000Z";

/** Demo/test business data only. Not observations from a real company. */
export const CSV_MVP_DEMO_INVENTORY_TEXT =
  "Date,Inventory On Hand\n2026-01-01,80\n2026-02-01,95\n2026-03-01,88\n2026-04-01,72\n2026-05-01,67\n2026-06-01,74\n";

export const CSV_MVP_DEMO_PENDING_TEXT =
  "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120\n2026-02-01,1080,93.2,840,145\n2026-03-01,1160,91.8,825,190\n2026-04-01,1240,90.5,810,245\n";

export const CSV_MVP_DEMO_INVENTORY_VALUES = Object.freeze([
  Object.freeze({ periodLabel: "2026-01-01", value: 80 }),
  Object.freeze({ periodLabel: "2026-02-01", value: 95 }),
  Object.freeze({ periodLabel: "2026-03-01", value: 88 }),
  Object.freeze({ periodLabel: "2026-04-01", value: 72 }),
  Object.freeze({ periodLabel: "2026-05-01", value: 67 }),
  Object.freeze({ periodLabel: "2026-06-01", value: 74 }),
]);

function hasAcceptedInventory(workspaceId: WorkspaceId): boolean {
  return listCsvRealDataImports(workspaceId).some((entry) =>
    entry.prepared.mapping?.mappings.some(
      (mapping) =>
        mapping.confirmed &&
        !mapping.ignored &&
        mapping.targetId === "inventory.on-hand",
    ),
  );
}

function hasPendingDemo(workspaceId: WorkspaceId): boolean {
  return (
    getCsvImportCandidate(
      workspaceId,
      csvImportCandidateId(workspaceId, CSV_MVP_DEMO_PENDING_FILE),
    ) != null ||
    listCsvImportCandidates(workspaceId).some(
      (entry) => entry.fileName === CSV_MVP_DEMO_PENDING_FILE,
    )
  );
}

function commitInventoryDemo(workspaceId: WorkspaceId): boolean {
  const importId = `cei3-mvp-demo:${workspaceId}:${CSV_MVP_DEMO_INVENTORY_FILE}`;
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName: CSV_MVP_DEMO_INVENTORY_FILE,
    fileSize: CSV_MVP_DEMO_INVENTORY_TEXT.length,
    csvText: CSV_MVP_DEMO_INVENTORY_TEXT,
    importId,
    importedAt: CSV_MVP_DEMO_COMMITTED_AT,
  });
  if (!prepared.ready) return false;
  const relatedToInventory = prepared.mapping.mappings.some(
    (mapping) =>
      mapping.confirmed && mapping.targetId === "inventory.on-hand",
  );
  if (!relatedToInventory) return false;
  const committed = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: CSV_MVP_DEMO_COMMITTED_AT,
  });
  return committed.committed;
}

function seedPendingDemo(workspaceId: WorkspaceId): boolean {
  const fileName = CSV_MVP_DEMO_PENDING_FILE;
  const input = Object.freeze({
    workspaceId,
    fileName,
    fileSize: CSV_MVP_DEMO_PENDING_TEXT.length,
    csvText: CSV_MVP_DEMO_PENDING_TEXT,
    importId: `cei3-mvp-demo:${workspaceId}:${fileName}`,
    importedAt: CSV_MVP_DEMO_COMMITTED_AT,
  });
  const parse = parseCsvDeterministically(CSV_MVP_DEMO_PENDING_TEXT);
  const saved = saveCsvImportCandidate(
    Object.freeze({
      workspaceId,
      candidateId: csvImportCandidateId(workspaceId, fileName),
      fileName,
      status: "preview",
      input,
      parse,
      mapping: interpretCsvSemantics({
        input,
        parse,
        structural: suggestCsvColumnMappings(parse.columns, input.importId),
      }),
      prepared: null,
      error: null,
      replacementSourceContextId: null,
    }),
  );
  return saved.saved && saved.candidate.status === "preview";
}

export type CsvMvpDemoBootstrapReport = Readonly<{
  identity: typeof csvRealDataMvpDemoBootstrapIdentity;
  workspaceId: WorkspaceId;
  inventorySeeded: boolean;
  inventoryAlreadyPresent: boolean;
  pendingSeeded: boolean;
  pendingAlreadyPresent: boolean;
}>;

export function ensureCsvMvpDemoBootstrap(input: {
  readonly workspaceId: WorkspaceId;
}): CsvMvpDemoBootstrapReport {
  const inventoryAlreadyPresent = hasAcceptedInventory(input.workspaceId);
  const pendingAlreadyPresent = hasPendingDemo(input.workspaceId);
  return Object.freeze({
    identity: csvRealDataMvpDemoBootstrapIdentity,
    workspaceId: input.workspaceId,
    inventoryAlreadyPresent,
    inventorySeeded: inventoryAlreadyPresent
      ? false
      : commitInventoryDemo(input.workspaceId),
    pendingAlreadyPresent,
    pendingSeeded: pendingAlreadyPresent
      ? false
      : seedPendingDemo(input.workspaceId),
  });
}

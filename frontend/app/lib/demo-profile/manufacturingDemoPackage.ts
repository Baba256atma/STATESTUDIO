/**
 * DEMO-MVP:1 — Manufacturing Demo CSV package.
 *
 * Observations only. Interpretation stays with Data Reality and its consumers.
 * RMS Manufacturing Under Capacity Pressure informed the shape of the story
 * (demand rising against a constrained plant). These rows are original synthetic
 * values. RMS ground truth is not imported.
 *
 * Series reasoning (month-end 2026-01 through 2026-08):
 * Orders received rise from 760 to 1230. Production used rises from 740 to 980
 * against a flat available capacity of 1000, so slack shrinks from 260 to 20.
 * Inventory on hand falls from 640 to 320. The order-to-production gap widens
 * from 20 to 250. Inventory does not drop by that full gap: unfilled demand is
 * not modeled as a stock identity because backlog has no mapping target.
 *
 * Unavailable observations:
 * - backlog: no CSV mapping target owns it.
 * - orders shipped: "Shipped Orders" would map to Total Deliveries, and the
 *   existing On-Time Delivery Rate KPI then requires On-Time Deliveries.
 *   Committing shipments alone fails the production prepare path. The column
 *   is omitted rather than ignored or invented.
 */
import {
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_PENDING_FILE,
} from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  commitPreparedCsvRealDataImport,
  discardCsvImportCandidate,
  getCsvRealDataImportCommitInvocationCount,
  listCsvImportCandidates,
  listCsvRealDataImports,
  removeCsvRealDataImport,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { DEMO_WORKSPACE_ID, type WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { MANUFACTURING_DEMO_PROFILE_ID } from "./demoProfileContract.ts";
import { retireInactiveDemoProfileImports } from "./demoProfilePackageTransition.ts";

export const manufacturingDemoPackageIdentity = "DEMO-MVP:1/ManufacturingPackage" as const;

export const MANUFACTURING_DEMO_COMMITTED_AT = "2026-08-31T00:00:00.000Z";

export const MANUFACTURING_DEMO_ORDERS_FILE = "manufacturing-orders.csv";
export const MANUFACTURING_DEMO_PRODUCTION_FILE = "manufacturing-production.csv";
export const MANUFACTURING_DEMO_INVENTORY_FILE = "manufacturing-inventory.csv";

export const MANUFACTURING_DEMO_ORDERS_TEXT =
  "Date,Orders Received\n2026-01-31,760\n2026-02-28,820\n2026-03-31,890\n2026-04-30,960\n2026-05-31,1040\n2026-06-30,1110\n2026-07-31,1170\n2026-08-31,1230\n";

export const MANUFACTURING_DEMO_PRODUCTION_TEXT =
  "Date,Production Used Capacity,Production Total Capacity\n2026-01-31,740,1000\n2026-02-28,790,1000\n2026-03-31,840,1000\n2026-04-30,880,1000\n2026-05-31,920,1000\n2026-06-30,950,1000\n2026-07-31,970,1000\n2026-08-31,980,1000\n";

export const MANUFACTURING_DEMO_INVENTORY_TEXT =
  "Date,Inventory On Hand\n2026-01-31,640\n2026-02-28,610\n2026-03-31,575\n2026-04-30,530\n2026-05-31,480\n2026-06-30,425\n2026-07-31,370\n2026-08-31,320\n";

export const MANUFACTURING_DEMO_PACKAGE_FILES = Object.freeze([
  Object.freeze({
    fileName: MANUFACTURING_DEMO_ORDERS_FILE,
    csvText: MANUFACTURING_DEMO_ORDERS_TEXT,
  }),
  Object.freeze({
    fileName: MANUFACTURING_DEMO_PRODUCTION_FILE,
    csvText: MANUFACTURING_DEMO_PRODUCTION_TEXT,
  }),
  Object.freeze({
    fileName: MANUFACTURING_DEMO_INVENTORY_FILE,
    csvText: MANUFACTURING_DEMO_INVENTORY_TEXT,
  }),
]);

export const MANUFACTURING_DEMO_UNAVAILABLE_OBSERVATIONS = Object.freeze([
  Object.freeze({
    column: "backlog",
    reason: "No production CSV mapping target owns backlog.",
  }),
  Object.freeze({
    column: "orders_shipped",
    reason:
      "Total Deliveries is recognized only as part of On-Time Delivery Rate, which also requires On-Time Deliveries. The package does not invent that pair.",
  }),
]);

/**
 * State a later Reset Demo must clear for this profile.
 * This module does not clear it.
 */
export const MANUFACTURING_DEMO_RESET_SURFACE = Object.freeze({
  profileId: MANUFACTURING_DEMO_PROFILE_ID,
  workspaceId: DEMO_WORKSPACE_ID,
  sessionKey: "nexora.demo-profile.v1",
  importIdPrefix: "demo-profile:manufacturing:",
  fileNames: Object.freeze([
    MANUFACTURING_DEMO_ORDERS_FILE,
    MANUFACTURING_DEMO_PRODUCTION_FILE,
    MANUFACTURING_DEMO_INVENTORY_FILE,
  ]),
  legacyDemoFilesRetiredWhileProfileActive: Object.freeze([
    CSV_MVP_DEMO_INVENTORY_FILE,
    CSV_MVP_DEMO_PENDING_FILE,
  ]),
  mustNotClear: Object.freeze([
    "BUSINESS workspace records",
    "PROJECT workspace records",
    "manager CSV imports",
    "workspaceRegistryStore",
  ]),
});

export function manufacturingDemoImportId(workspaceId: WorkspaceId, fileName: string): string {
  return `demo-profile:${MANUFACTURING_DEMO_PROFILE_ID}:${workspaceId}:${fileName}`;
}

export type ManufacturingDemoPackageFileReport = Readonly<{
  fileName: string;
  importId: string;
  sourceContextId: string | null;
  ready: boolean;
  committed: boolean;
  alreadyPresent: boolean;
  recognizedTargets: readonly string[];
  datasetId: string | null;
  errors: readonly string[];
}>;

export type ManufacturingDemoPackageReport = Readonly<{
  identity: typeof manufacturingDemoPackageIdentity;
  profileId: typeof MANUFACTURING_DEMO_PROFILE_ID;
  workspaceId: WorkspaceId;
  refused: boolean;
  refusalReason: "not_demo_workspace" | null;
  legacyInventoryRemoved: boolean;
  legacyPendingDiscarded: boolean;
  commitInvocationsBefore: number;
  commitInvocationsAfter: number;
  files: readonly ManufacturingDemoPackageFileReport[];
}>;

function isLegacyDemoImport(fileName: string, importId: string): boolean {
  return (
    fileName === CSV_MVP_DEMO_INVENTORY_FILE ||
    fileName === CSV_MVP_DEMO_PENDING_FILE ||
    importId.startsWith("cei3-mvp-demo:")
  );
}

function retireLegacyDemoCsv(workspaceId: WorkspaceId): Readonly<{
  legacyInventoryRemoved: boolean;
  legacyPendingDiscarded: boolean;
}> {
  let legacyInventoryRemoved = false;
  let legacyPendingDiscarded = false;
  for (const candidate of listCsvImportCandidates(workspaceId)) {
    if (!isLegacyDemoImport(candidate.fileName, candidate.input.importId)) continue;
    if (discardCsvImportCandidate(workspaceId, candidate.candidateId)) {
      legacyPendingDiscarded = true;
    }
  }
  for (const entry of listCsvRealDataImports(workspaceId)) {
    if (!isLegacyDemoImport(entry.prepared.fileName, entry.importId)) continue;
    const removed = removeCsvRealDataImport({
      workspaceId,
      sourceContextId: entry.sourceContextId,
      activeSourceContextId: entry.sourceContextId,
      confirmedActiveRemoval: true,
    });
    if (removed.removed) legacyInventoryRemoved = true;
  }
  return Object.freeze({ legacyInventoryRemoved, legacyPendingDiscarded });
}

export function ensureManufacturingDemoPackage(input: {
  readonly workspaceId: WorkspaceId;
}): ManufacturingDemoPackageReport {
  if (input.workspaceId !== DEMO_WORKSPACE_ID) {
    return Object.freeze({
      identity: manufacturingDemoPackageIdentity,
      profileId: MANUFACTURING_DEMO_PROFILE_ID,
      workspaceId: input.workspaceId,
      refused: true,
      refusalReason: "not_demo_workspace" as const,
      legacyInventoryRemoved: false,
      legacyPendingDiscarded: false,
      commitInvocationsBefore: getCsvRealDataImportCommitInvocationCount(),
      commitInvocationsAfter: getCsvRealDataImportCommitInvocationCount(),
      files: Object.freeze([]),
    });
  }

  const commitInvocationsBefore = getCsvRealDataImportCommitInvocationCount();
  retireInactiveDemoProfileImports({
    workspaceId: input.workspaceId,
    activeProfileId: MANUFACTURING_DEMO_PROFILE_ID,
  });
  const retired = retireLegacyDemoCsv(input.workspaceId);
  const files: ManufacturingDemoPackageFileReport[] = [];

  for (const file of MANUFACTURING_DEMO_PACKAGE_FILES) {
    const importId = manufacturingDemoImportId(input.workspaceId, file.fileName);
    const parse = parseCsvDeterministically(file.csvText);
    if (!parse.valid) {
      files.push(Object.freeze({
        fileName: file.fileName,
        importId,
        sourceContextId: null,
        ready: false,
        committed: false,
        alreadyPresent: false,
        recognizedTargets: Object.freeze([]),
        datasetId: null,
        errors: Object.freeze(parse.issues.map((issue) => issue.message)),
      }));
      continue;
    }
    const prepared = prepareCsvRealDataImport({
      workspaceId: input.workspaceId,
      fileName: file.fileName,
      fileSize: file.csvText.length,
      csvText: file.csvText,
      importId,
      importedAt: MANUFACTURING_DEMO_COMMITTED_AT,
    });
    const recognizedTargets = Object.freeze(
      prepared.mapping.mappings
        .filter((entry) => entry.confirmed && !entry.ignored && entry.targetId)
        .map((entry) => entry.targetId as string),
    );
    if (!prepared.ready) {
      files.push(Object.freeze({
        fileName: file.fileName,
        importId,
        sourceContextId: prepared.sourceContextId,
        ready: false,
        committed: false,
        alreadyPresent: false,
        recognizedTargets,
        datasetId: null,
        errors: prepared.errors,
      }));
      continue;
    }
    const committed = commitPreparedCsvRealDataImport({
      prepared,
      expectedWorkspaceId: input.workspaceId,
      mode: "new",
      committedAt: MANUFACTURING_DEMO_COMMITTED_AT,
    });
    const alreadyPresent = committed.reason === "source_exists";
    files.push(Object.freeze({
      fileName: file.fileName,
      importId,
      sourceContextId: prepared.sourceContextId,
      ready: true,
      committed: committed.committed || alreadyPresent,
      alreadyPresent,
      recognizedTargets,
      datasetId: prepared.handoff?.dataset.id ?? null,
      errors: Object.freeze(committed.committed || alreadyPresent ? [] : [committed.reason]),
    }));
  }

  return Object.freeze({
    identity: manufacturingDemoPackageIdentity,
    profileId: MANUFACTURING_DEMO_PROFILE_ID,
    workspaceId: input.workspaceId,
    refused: false,
    refusalReason: null,
    legacyInventoryRemoved: retired.legacyInventoryRemoved,
    legacyPendingDiscarded: retired.legacyPendingDiscarded,
    commitInvocationsBefore,
    commitInvocationsAfter: getCsvRealDataImportCommitInvocationCount(),
    files: Object.freeze(files),
  });
}

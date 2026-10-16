/**
 * DEMO-MVP:2 — Project Management Demo CSV package.
 *
 * Observations only. RMS Project Delivery Pressure informed the shape of the
 * story. These rows are original. RMS ground truth is not imported.
 *
 * Schedule Variance Days follows the existing RMS convention: a schedule delay
 * raises the value (the project disturbance leaves it at +6) and the improve
 * action applies a negative delta. Positive days mean behind plan.
 *
 * Series (month-end 2026-01 through 2026-08), ratios for progress:
 * Planned progress advances 0.12 → 0.84. Actual progress starts equal and
 * finishes at 0.68, so the gap grows 0 → 0.16. Resource load rises 6 → 11.
 * Schedule variance days move 0 → 9. The project begins on plan.
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
import { PROJECT_DEMO_PROFILE_ID } from "./demoProfileContract.ts";
import { retireInactiveDemoProfileImports } from "./demoProfilePackageTransition.ts";

export const projectDemoPackageIdentity = "DEMO-MVP:2/ProjectPackage" as const;

export const PROJECT_DEMO_COMMITTED_AT = "2026-08-31T00:00:00.000Z";

export const PROJECT_DEMO_PROGRESS_FILE = "progress.csv";
export const PROJECT_DEMO_RESOURCES_FILE = "resources.csv";
export const PROJECT_DEMO_SCHEDULE_FILE = "schedule.csv";

export const PROJECT_DEMO_PROGRESS_TEXT =
  "Date,Planned Progress,Actual Progress\n2026-01-31,0.12,0.12\n2026-02-28,0.24,0.23\n2026-03-31,0.36,0.34\n2026-04-30,0.48,0.44\n2026-05-31,0.60,0.53\n2026-06-30,0.70,0.60\n2026-07-31,0.78,0.65\n2026-08-31,0.84,0.68\n";

export const PROJECT_DEMO_RESOURCES_TEXT =
  "Date,Resource Load\n2026-01-31,6\n2026-02-28,6\n2026-03-31,7\n2026-04-30,8\n2026-05-31,8\n2026-06-30,9\n2026-07-31,10\n2026-08-31,11\n";

export const PROJECT_DEMO_SCHEDULE_TEXT =
  "Date,Schedule Variance Days\n2026-01-31,0\n2026-02-28,0\n2026-03-31,1\n2026-04-30,1\n2026-05-31,2\n2026-06-30,4\n2026-07-31,6\n2026-08-31,9\n";

export const PROJECT_DEMO_PACKAGE_FILES = Object.freeze([
  Object.freeze({ fileName: PROJECT_DEMO_PROGRESS_FILE, csvText: PROJECT_DEMO_PROGRESS_TEXT }),
  Object.freeze({ fileName: PROJECT_DEMO_RESOURCES_FILE, csvText: PROJECT_DEMO_RESOURCES_TEXT }),
  Object.freeze({ fileName: PROJECT_DEMO_SCHEDULE_FILE, csvText: PROJECT_DEMO_SCHEDULE_TEXT }),
]);

export const PROJECT_DEMO_SCHEDULE_CONVENTION = Object.freeze({
  field: "Schedule Variance Days",
  positiveMeans: "behind plan" as const,
  authority: "RMS schedule delay raises scheduleVarianceDays; re-sequence applies a negative delta" as const,
});

function projectImportId(workspaceId: WorkspaceId, fileName: string): string {
  return `demo-profile:${PROJECT_DEMO_PROFILE_ID}:${workspaceId}:${fileName}`;
}

export type ProjectDemoPackageFileReport = Readonly<{
  fileName: string;
  importId: string;
  sourceContextId: string | null;
  ready: boolean;
  committed: boolean;
  alreadyPresent: boolean;
  recognizedTargets: readonly string[];
  datasetId: string | null;
  finalFacts: Readonly<Record<string, number>>;
  historicalRowCount: number;
  errors: readonly string[];
}>;

export type ProjectDemoPackageReport = Readonly<{
  identity: typeof projectDemoPackageIdentity;
  profileId: typeof PROJECT_DEMO_PROFILE_ID;
  workspaceId: WorkspaceId;
  refused: boolean;
  refusalReason: "not_demo_workspace" | null;
  retiredOtherProfileImportIds: readonly string[];
  legacyInventoryRemoved: boolean;
  legacyPendingDiscarded: boolean;
  commitInvocationsBefore: number;
  commitInvocationsAfter: number;
  files: readonly ProjectDemoPackageFileReport[];
}>;

function retireLegacyDemoCsv(workspaceId: WorkspaceId): Readonly<{
  legacyInventoryRemoved: boolean;
  legacyPendingDiscarded: boolean;
}> {
  let legacyInventoryRemoved = false;
  let legacyPendingDiscarded = false;
  for (const candidate of listCsvImportCandidates(workspaceId)) {
    const legacy =
      candidate.fileName === CSV_MVP_DEMO_INVENTORY_FILE ||
      candidate.fileName === CSV_MVP_DEMO_PENDING_FILE ||
      candidate.input.importId.startsWith("cei3-mvp-demo:");
    if (!legacy) continue;
    if (discardCsvImportCandidate(workspaceId, candidate.candidateId)) legacyPendingDiscarded = true;
  }
  for (const entry of listCsvRealDataImports(workspaceId)) {
    const legacy =
      entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE ||
      entry.prepared.fileName === CSV_MVP_DEMO_PENDING_FILE ||
      entry.importId.startsWith("cei3-mvp-demo:");
    if (!legacy) continue;
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

export function ensureProjectDemoPackage(input: {
  readonly workspaceId: WorkspaceId;
}): ProjectDemoPackageReport {
  if (input.workspaceId !== DEMO_WORKSPACE_ID) {
    return Object.freeze({
      identity: projectDemoPackageIdentity,
      profileId: PROJECT_DEMO_PROFILE_ID,
      workspaceId: input.workspaceId,
      refused: true,
      refusalReason: "not_demo_workspace" as const,
      retiredOtherProfileImportIds: Object.freeze([]),
      legacyInventoryRemoved: false,
      legacyPendingDiscarded: false,
      commitInvocationsBefore: getCsvRealDataImportCommitInvocationCount(),
      commitInvocationsAfter: getCsvRealDataImportCommitInvocationCount(),
      files: Object.freeze([]),
    });
  }

  const commitInvocationsBefore = getCsvRealDataImportCommitInvocationCount();
  const switched = retireInactiveDemoProfileImports({
    workspaceId: input.workspaceId,
    activeProfileId: PROJECT_DEMO_PROFILE_ID,
  });
  const retired = retireLegacyDemoCsv(input.workspaceId);
  const files: ProjectDemoPackageFileReport[] = [];

  for (const file of PROJECT_DEMO_PACKAGE_FILES) {
    const importId = projectImportId(input.workspaceId, file.fileName);
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
        finalFacts: Object.freeze({}),
        historicalRowCount: 0,
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
      importedAt: PROJECT_DEMO_COMMITTED_AT,
    });
    const recognizedTargets = Object.freeze(
      prepared.mapping.mappings
        .filter((entry) => entry.confirmed && !entry.ignored && entry.targetId)
        .map((entry) => entry.targetId as string),
    );
    const finalFacts = Object.freeze(
      Object.fromEntries(
        (prepared.handoff?.dataset.records ?? []).map((record) => [record.metricKey, record.value]),
      ),
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
        finalFacts,
        historicalRowCount: parse.records.length,
        errors: prepared.errors,
      }));
      continue;
    }
    const committed = commitPreparedCsvRealDataImport({
      prepared,
      expectedWorkspaceId: input.workspaceId,
      mode: "new",
      committedAt: PROJECT_DEMO_COMMITTED_AT,
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
      finalFacts,
      historicalRowCount: prepared.parse.records.length,
      errors: Object.freeze(committed.committed || alreadyPresent ? [] : [committed.reason]),
    }));
  }

  return Object.freeze({
    identity: projectDemoPackageIdentity,
    profileId: PROJECT_DEMO_PROFILE_ID,
    workspaceId: input.workspaceId,
    refused: false,
    refusalReason: null,
    retiredOtherProfileImportIds: switched.removedImportIds,
    legacyInventoryRemoved: retired.legacyInventoryRemoved,
    legacyPendingDiscarded: retired.legacyPendingDiscarded,
    commitInvocationsBefore,
    commitInvocationsAfter: getCsvRealDataImportCommitInvocationCount(),
    files: Object.freeze(files),
  });
}

/**
 * DEMO-MVP:2 — switch one Demo Profile package for another inside demo_workspace.
 *
 * A switch retires imports owned by the profile being left.
 * It is not Reset Demo. Reset would later restore the selected profile to its
 * original baseline and clear later demo-owned mutations. This module only
 * retires inactive demo-profile imports.
 */
import {
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_PENDING_FILE,
} from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  discardCsvImportCandidate,
  listCsvImportCandidates,
  listCsvRealDataImports,
  removeCsvRealDataImport,
} from "../data-reality/csvRealDataImportStore.ts";
import { DEMO_WORKSPACE_ID, type WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  DEMO_PROFILE_IDS,
  DEMO_PROFILE_SESSION_KEY,
  demoProfileImportPrefix,
  type DemoProfileId,
} from "./demoProfileContract.ts";

export const demoProfilePackageTransitionIdentity =
  "DEMO-MVP:2/DemoProfilePackageTransition" as const;

/**
 * Durable demo-owned state a later Reset Demo must manage.
 * Profile switch uses only the inactive-profile import ids below.
 */
export const DEMO_PROFILE_DURABLE_STATE = Object.freeze({
  identity: demoProfilePackageTransitionIdentity,
  workspaceId: DEMO_WORKSPACE_ID,
  sessionKey: DEMO_PROFILE_SESSION_KEY,
  profiles: DEMO_PROFILE_IDS,
  importIdPrefix: "demo-profile:" as const,
  legacyDemoFilesRetiredWhileModernProfileActive: Object.freeze([
    CSV_MVP_DEMO_INVENTORY_FILE,
    CSV_MVP_DEMO_PENDING_FILE,
  ]),
  switchRetires: "demo-profile imports whose profile id is not the profile being opened, on demo_workspace only" as const,
  resetWouldRestore: "the selected Demo Profile package to its original CSV baseline without touching BUSINESS or PROJECT imports" as const,
  mustNotClear: Object.freeze([
    "BUSINESS workspace records",
    "PROJECT workspace records",
    "manager CSV imports",
    "workspaceRegistryStore",
  ]),
});

export function isDemoProfileOwnedImportId(importId: string, profileId?: DemoProfileId): boolean {
  if (profileId) return importId.startsWith(demoProfileImportPrefix(profileId));
  return importId.startsWith("demo-profile:");
}

export function retireAllDemoProfileImports(workspaceId: WorkspaceId): Readonly<{ removedImportIds: readonly string[] }> {
  if (workspaceId !== DEMO_WORKSPACE_ID) {
    return Object.freeze({ removedImportIds: Object.freeze([]) });
  }
  const removed: string[] = [];
  for (const candidate of listCsvImportCandidates(workspaceId)) {
    if (!candidate.input.importId.startsWith("demo-profile:")) continue;
    if (discardCsvImportCandidate(workspaceId, candidate.candidateId)) {
      removed.push(candidate.input.importId);
    }
  }
  for (const entry of listCsvRealDataImports(workspaceId)) {
    if (!entry.importId.startsWith("demo-profile:")) continue;
    const result = removeCsvRealDataImport({
      workspaceId,
      sourceContextId: entry.sourceContextId,
      activeSourceContextId: entry.sourceContextId,
      confirmedActiveRemoval: true,
    });
    if (result.removed) removed.push(entry.importId);
  }
  return Object.freeze({ removedImportIds: Object.freeze(removed) });
}

export function retireInactiveDemoProfileImports(input: {
  readonly workspaceId: WorkspaceId;
  readonly activeProfileId: DemoProfileId;
}): Readonly<{ removedImportIds: readonly string[] }> {
  if (input.workspaceId !== DEMO_WORKSPACE_ID) {
    return Object.freeze({ removedImportIds: Object.freeze([]) });
  }
  const activePrefix = demoProfileImportPrefix(input.activeProfileId);
  const removed: string[] = [];
  for (const candidate of listCsvImportCandidates(input.workspaceId)) {
    if (!candidate.input.importId.startsWith("demo-profile:")) continue;
    if (candidate.input.importId.startsWith(activePrefix)) continue;
    if (discardCsvImportCandidate(input.workspaceId, candidate.candidateId)) {
      removed.push(candidate.input.importId);
    }
  }
  for (const entry of listCsvRealDataImports(input.workspaceId)) {
    if (!entry.importId.startsWith("demo-profile:")) continue;
    if (entry.importId.startsWith(activePrefix)) continue;
    const result = removeCsvRealDataImport({
      workspaceId: input.workspaceId,
      sourceContextId: entry.sourceContextId,
      activeSourceContextId: entry.sourceContextId,
      confirmedActiveRemoval: true,
    });
    if (result.removed) removed.push(entry.importId);
  }
  return Object.freeze({ removedImportIds: Object.freeze(removed) });
}

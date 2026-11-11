/**
 * NPA-T WORKSPACE-LIFECYCLE-CLEANUP:1
 * Recoverable Workspace deletion over the existing store owners.
 * localStorage and IndexedDB are not one transaction. Progress is durable
 * on the Workspace record until the registry entry is removed.
 */

import { forgetWorkspaceAutomaticMonitoring, listAutomaticMonitoringPolicies } from "../data-reality/automaticMonitoringRuntime.ts";
import { forgetWorkspaceCsvRemovalHistory, listCsvRealDataImports, listCsvRemovalHistoryWorkspaceIds, removeWorkspaceCsvData, subscribeCsvRealDataImports } from "../data-reality/csvRealDataImportStore.ts";
import { DURABLE_MONITORING_STORAGE_KEY, forgetWorkspaceDurableMonitoring } from "../data-reality/durableMonitoringRuntime.ts";
import { countWorkspaceDatasetReferences, forgetWorkspaceDatasetReferences } from "../deck/nexoraDeckDatasetReferenceRegistry.ts";
import { forgetWorkspaceDecks, listWorkspaceDecks } from "../deck/nexoraDeckRegistry.ts";
import { forgetWorkspaceCanonicalMutations, listCanonicalMutations, canonicalMutationJournalStatus } from "../scene-org/canonicalMutationJournal.ts";
import {
  canonicalCausalInvestigationAuthorityStatus,
  countWorkspaceCausalInvestigationRecords,
  forgetWorkspaceCausalInvestigations,
} from "../scene-org/canonicalCausalInvestigationDomain.ts";
import { forgetWorkspaceCausalInvestigationUiSelection } from "../scene-org/causalInvestigationUiSession.ts";
import {
  canonicalDecisionAuthorityStatus,
  countWorkspaceDecisionRecords,
  forgetWorkspaceDecisionDomain,
} from "../scene-org/canonicalDecisionDomain.ts";
import {
  canonicalObjectAuthorityStatus,
  forgetWorkspaceCanonicalObjects,
  listCanonicalObjectWorkspaceIds,
  listCanonicalObjects,
} from "../scene-org/canonicalObjectRegistry.ts";
import {
  canonicalRelationshipAuthorityStatus,
  forgetWorkspaceCanonicalRelationships,
  readCanonicalRelationshipGraph,
} from "../scene-org/canonicalRelationshipGraph.ts";
import { listSceneOrgSavedScenesForManagerWorkspace } from "../scene-org/sceneOrgSavedSceneCollectionAccess.ts";
import { forgetWorkspaceSavedScenes, loadSceneOrgSavedScenes } from "../scene-org/sceneOrgSavedSceneDurability.ts";
import { isCustomerHostedWorkspaceId } from "../workspace-auth/hostedWorkspaceId.ts";
import { blockWorkspaceMutations, releaseWorkspaceMutationBlock } from "./workspaceDeletionGuard.ts";
import {
  isManagerWorkspaceKind,
  isProtectedDemoWorkspaceId,
  type Workspace,
} from "./workspaceRegistryContract.ts";
import {
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaceRegistrySnapshot,
  recordWorkspaceRevocation,
  setActiveWorkspace,
  upsertWorkspace,
  workspaceRegistryStorageIsAuthoritative,
} from "./workspaceRegistryStore.ts";

export const workspaceDeletionLifecycleIdentity =
  "NPA-T WORKSPACE-LIFECYCLE-CLEANUP:1/WorkspaceDeletionLifecycle" as const;

/**
 * The disposable NexoCause certification Workspace predates the metadata marker.
 * This id is the operator authorization for that record. It is not a general grant.
 */
export const AUTHORIZED_LOCAL_DISPOSABLE_WORKSPACE_IDS = Object.freeze([
  "npa_nexocause_stage_test_mwa6vynb",
  "npa_nexocause_handoff_test_mwb3vqc4",
] as const);

export const WORKSPACE_DELETION_STEPS = Object.freeze([
  "investigations",
  "decisions",
  "scenes",
  "monitoring",
  "dataset-references",
  "datasets",
  "relationships",
  "objects",
  "journal",
  "decks",
  "ui-selection",
  "verify",
  "registry",
] as const);

export type WorkspaceDeletionStep = (typeof WORKSPACE_DELETION_STEPS)[number];
export type WorkspaceDeletionPhase = "DELETE_REQUESTED" | "DELETING" | "DELETE_BLOCKED";

export type WorkspaceDeletionIntent = Readonly<{
  phase: WorkspaceDeletionPhase;
  operationId: string;
  fingerprint: string;
  completedSteps: readonly WorkspaceDeletionStep[];
  failedStep: WorkspaceDeletionStep | null;
  updatedAt: string;
}>;

export type WorkspaceDeletionPreview = Readonly<{
  permitted: boolean;
  reason: string | null;
  workspaceId: string;
  workspaceName: string | null;
  fingerprint: string;
  decks: number;
  objects: number;
  relationships: number;
  datasets: number;
  datasetReferences: number;
  investigations: number;
  observations: number;
  hypotheses: number;
  reviews: number;
  decisions: number;
  scenes: number;
  monitoring: number;
  journal: number;
  blockers: readonly string[];
}>;

export type WorkspaceDeletionResult = Readonly<{
  ok: boolean;
  reason: string;
  phase: WorkspaceDeletionPhase | "DELETED" | null;
  failedStep: WorkspaceDeletionStep | null;
  replayed: boolean;
}>;

let forcedStepFailure: WorkspaceDeletionStep | null = null;

export function failWorkspaceDeletionStepForTests(step: WorkspaceDeletionStep | null): void {
  forcedStepFailure = step;
}

export function localWorkspaceDeletionPermitted(workspaceId: string): boolean {
  if (isProtectedDemoWorkspaceId(workspaceId)) return false;
  if (isCustomerHostedWorkspaceId(workspaceId)) return false;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace || workspace.status !== "active" || !isManagerWorkspaceKind(workspace.kind)) return false;
  if (workspace.metadata?.disposableCertification === "local-certification") return true;
  return (AUTHORIZED_LOCAL_DISPOSABLE_WORKSPACE_IDS as readonly string[]).includes(workspaceId);
}

export function readWorkspaceDeletionIntent(workspaceId: string): WorkspaceDeletionIntent | null {
  const metadata = getWorkspaceById(workspaceId)?.metadata?.deletionLifecycle;
  if (!metadata || typeof metadata !== "object") return null;
  const record = metadata as Partial<WorkspaceDeletionIntent>;
  if (record.phase !== "DELETE_REQUESTED" && record.phase !== "DELETING" && record.phase !== "DELETE_BLOCKED") return null;
  if (typeof record.operationId !== "string" || typeof record.fingerprint !== "string") return null;
  return Object.freeze({
    phase: record.phase,
    operationId: record.operationId,
    fingerprint: record.fingerprint,
    completedSteps: Object.freeze((record.completedSteps ?? []).filter((step): step is WorkspaceDeletionStep =>
      (WORKSPACE_DELETION_STEPS as readonly string[]).includes(step))),
    failedStep: (WORKSPACE_DELETION_STEPS as readonly string[]).includes(record.failedStep ?? "")
      ? record.failedStep as WorkspaceDeletionStep
      : null,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : "",
  });
}

function sweepAbsentCanonicalRecords(): void {
  if (!workspaceRegistryStorageIsAuthoritative()) return;
  const live = new Set(getWorkspaceRegistrySnapshot().workspaceOrder);
  for (const workspaceId of listCanonicalObjectWorkspaceIds()) {
    if (live.has(workspaceId) || isProtectedDemoWorkspaceId(workspaceId)) continue;
    forgetWorkspaceCanonicalObjects(workspaceId);
    forgetWorkspaceCanonicalRelationships(workspaceId);
    forgetWorkspaceCausalInvestigations(workspaceId);
    forgetWorkspaceDecisionDomain(workspaceId);
    forgetWorkspaceDatasetReferences(workspaceId);
    forgetWorkspaceDecks(workspaceId);
    forgetWorkspaceSavedScenes(workspaceId);
    forgetWorkspaceCanonicalMutations(workspaceId);
    forgetWorkspaceAutomaticMonitoring(workspaceId);
    const storage = browserStorage();
    if (storage) forgetWorkspaceDurableMonitoring(workspaceId, storage);
    forgetWorkspaceCsvRemovalHistory(workspaceId);
    recordWorkspaceRevocation(workspaceId);
  }
}

function sweepAbsentCsvRemovalHistory(): void {
  const live = new Set(getWorkspaceRegistrySnapshot().workspaceOrder);
  for (const workspaceId of listCsvRemovalHistoryWorkspaceIds()) {
    if (!live.has(workspaceId)) forgetWorkspaceCsvRemovalHistory(workspaceId);
  }
}

let csvSweepInstalled = false;

export function syncWorkspaceDeletionGuards(): void {
  const snapshot = getWorkspaceRegistrySnapshot();
  for (const workspaceId of snapshot.workspaceOrder) {
    const phase = readWorkspaceDeletionIntent(workspaceId)?.phase;
    if (phase === "DELETING" || phase === "DELETE_BLOCKED") blockWorkspaceMutations(workspaceId);
    else releaseWorkspaceMutationBlock(workspaceId);
  }
  sweepAbsentCsvRemovalHistory();
  sweepAbsentCanonicalRecords();
  if (!csvSweepInstalled) {
    csvSweepInstalled = true;
    subscribeCsvRealDataImports(() => sweepAbsentCsvRemovalHistory());
  }
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function previewWorkspaceDeletion(workspaceId: string): WorkspaceDeletionPreview {
  const workspace = getWorkspaceById(workspaceId);
  const blockers: string[] = [];
  if (!localWorkspaceDeletionPermitted(workspaceId)) {
    blockers.push(isProtectedDemoWorkspaceId(workspaceId) ? "protected-workspace" : isCustomerHostedWorkspaceId(workspaceId) ? "hosted-workspace" : "local-deletion-unauthorized");
  }
  if (canonicalObjectAuthorityStatus() === "corrupt") blockers.push("corrupt-objects");
  if (canonicalRelationshipAuthorityStatus() === "corrupt") blockers.push("corrupt-relationships");
  if (canonicalCausalInvestigationAuthorityStatus() === "corrupt") blockers.push("corrupt-investigations");
  if (canonicalDecisionAuthorityStatus() === "corrupt") blockers.push("corrupt-decisions");
  if (canonicalMutationJournalStatus() === "corrupt") blockers.push("corrupt-journal");
  const sceneLoad = loadSceneOrgSavedScenes();
  if (sceneLoad.status === "invalid" || sceneLoad.status === "incompatible") blockers.push("corrupt-scenes");
  const causal = countWorkspaceCausalInvestigationRecords(workspaceId);
  const counts = {
    decks: workspace ? listWorkspaceDecks(workspaceId).length : 0,
    objects: listCanonicalObjects(workspaceId).length,
    relationships: readCanonicalRelationshipGraph(workspaceId).relationships.length,
    datasets: listCsvRealDataImports(workspaceId).length,
    datasetReferences: countWorkspaceDatasetReferences(workspaceId),
    investigations: causal.investigations,
    observations: causal.observations,
    hypotheses: causal.hypotheses,
    reviews: causal.reviews,
    decisions: countWorkspaceDecisionRecords(workspaceId),
    scenes: listSceneOrgSavedScenesForManagerWorkspace(sceneLoad.scenes, workspaceId).length,
    monitoring: listAutomaticMonitoringPolicies(workspaceId).length,
    journal: listCanonicalMutations().filter((entry) => entry.workspaceId === workspaceId).length,
  };
  const fingerprint = JSON.stringify({ workspaceId, name: workspace?.workspaceName ?? null, ...counts });
  return Object.freeze({
    permitted: blockers.length === 0,
    reason: blockers[0] ?? null,
    workspaceId,
    workspaceName: workspace?.workspaceName ?? null,
    fingerprint,
    ...counts,
    blockers: Object.freeze(blockers),
  });
}

function writeIntent(workspace: Workspace, intent: WorkspaceDeletionIntent): boolean {
  const previousPhase = readWorkspaceDeletionIntent(workspace.workspaceId)?.phase ?? null;
  const generation = Number(workspace.metadata?.authorityGeneration ?? 1);
  const authorityGeneration = intent.phase === "DELETE_REQUESTED" && previousPhase !== "DELETE_REQUESTED"
    ? (Number.isFinite(generation) ? generation + 1 : 2)
    : (Number.isFinite(generation) ? generation : 1);
  const next = upsertWorkspace(Object.freeze({
    ...workspace,
    metadata: Object.freeze({
      ...(workspace.metadata ?? {}),
      authorityGeneration,
      deletionLifecycle: intent,
    }),
  }));
  return Boolean(next.workspaces[workspace.workspaceId]);
}

function result(ok: boolean, reason: string, phase: WorkspaceDeletionResult["phase"], failedStep: WorkspaceDeletionStep | null, replayed = false): WorkspaceDeletionResult {
  return Object.freeze({ ok, reason, phase, failedStep, replayed });
}

export function requestWorkspaceDeletion(input: {
  readonly workspaceId: string;
  readonly operationId: string;
  readonly now?: string;
}): WorkspaceDeletionResult {
  const preview = previewWorkspaceDeletion(input.workspaceId);
  if (!preview.permitted) return result(false, preview.reason ?? "unauthorized", null, null);
  const workspace = getWorkspaceById(input.workspaceId);
  if (!workspace) return result(false, "missing-workspace", null, null);
  const current = readWorkspaceDeletionIntent(input.workspaceId);
  if (current && current.operationId !== input.operationId) return result(false, "operation-conflict", current.phase, current.failedStep);
  if (current?.operationId === input.operationId) return result(true, "requested", current.phase, current.failedStep, true);
  const intent: WorkspaceDeletionIntent = Object.freeze({
    phase: "DELETE_REQUESTED",
    operationId: input.operationId,
    fingerprint: preview.fingerprint,
    completedSteps: Object.freeze([]),
    failedStep: null,
    updatedAt: input.now ?? new Date().toISOString(),
  });
  if (!writeIntent(workspace, intent)) return result(false, "storage-failed", null, null);
  return result(true, "requested", "DELETE_REQUESTED", null);
}

function runStep(workspaceId: string, step: WorkspaceDeletionStep): string | null {
  if (forcedStepFailure === step) return "injected-failure";
  if (step === "investigations") return forgetWorkspaceCausalInvestigations(workspaceId).ok ? null : "investigation-cleanup-failed";
  if (step === "decisions") return forgetWorkspaceDecisionDomain(workspaceId).ok ? null : "decision-cleanup-failed";
  if (step === "scenes") {
    const loaded = loadSceneOrgSavedScenes();
    if (loaded.status === "invalid" || loaded.status === "incompatible") return "scene-cleanup-failed";
    const owned = listSceneOrgSavedScenesForManagerWorkspace(loaded.scenes, workspaceId);
    if (owned.length === 0) return null;
    return forgetWorkspaceSavedScenes(workspaceId) ? null : "scene-cleanup-failed";
  }
  if (step === "monitoring") {
    forgetWorkspaceAutomaticMonitoring(workspaceId);
    const storage = browserStorage();
    if (!storage) return null;
    const monitoring = forgetWorkspaceDurableMonitoring(workspaceId, storage);
    return monitoring === "corrupt" || monitoring === "residual" ? `monitoring-${monitoring}` : null;
  }
  if (step === "dataset-references") return forgetWorkspaceDatasetReferences(workspaceId).ok ? null : "dataset-reference-cleanup-failed";
  if (step === "datasets") {
    if (listCsvRealDataImports(workspaceId).length === 0) return null;
    setActiveWorkspace(workspaceId);
    const removed = removeWorkspaceCsvData(workspaceId);
    return removed.removed || listCsvRealDataImports(workspaceId).length === 0 ? null : removed.reason;
  }
  if (step === "relationships") return forgetWorkspaceCanonicalRelationships(workspaceId).ok ? null : "relationship-cleanup-failed";
  if (step === "objects") return forgetWorkspaceCanonicalObjects(workspaceId).ok ? null : "object-cleanup-failed";
  if (step === "journal") {
    const journal = forgetWorkspaceCanonicalMutations(workspaceId);
    return journal === "ok" ? null : journal;
  }
  if (step === "decks") return forgetWorkspaceDecks(workspaceId).ok ? null : "deck-cleanup-failed";
  if (step === "ui-selection") {
    forgetWorkspaceCausalInvestigationUiSelection(workspaceId);
    return null;
  }
  if (step === "verify") {
    const preview = previewWorkspaceDeletion(workspaceId);
    if (preview.blockers.some((blocker) => blocker.startsWith("corrupt"))) return preview.blockers.find((blocker) => blocker.startsWith("corrupt")) ?? "verification-incomplete";
    const owned = preview.decks + preview.objects + preview.relationships + preview.datasets + preview.datasetReferences
      + preview.investigations + preview.observations + preview.hypotheses + preview.reviews
      + preview.scenes + preview.decisions + preview.monitoring + preview.journal;
    return owned === 0 ? null : "verification-incomplete";
  }
  const before = getWorkspaceById(workspaceId);
  if (!before) return null;
  deleteWorkspace(workspaceId);
  return getWorkspaceById(workspaceId) ? "registry-cleanup-failed" : null;
}

function execute(workspaceId: string, operationId: string, fingerprint: string, now?: string): WorkspaceDeletionResult {
  const workspace = getWorkspaceById(workspaceId);
  const current = readWorkspaceDeletionIntent(workspaceId);
  if (!workspace || !current) return result(false, "missing-intent", null, null);
  if (current.operationId !== operationId) return result(false, "operation-conflict", current.phase, current.failedStep);
  if (current.fingerprint !== fingerprint) return result(false, "stale-confirmation", current.phase, current.failedStep);
  const fresh = previewWorkspaceDeletion(workspaceId);
  if (fresh.fingerprint !== fingerprint && current.phase === "DELETE_REQUESTED") {
    return result(false, "stale-confirmation", current.phase, null);
  }
  blockWorkspaceMutations(workspaceId);
  const completed = new Set(current.completedSteps);
  let failedStep: WorkspaceDeletionStep | null = null;
  let failure: string | null = null;
  for (const step of WORKSPACE_DELETION_STEPS) {
    if (completed.has(step)) continue;
    failure = runStep(workspaceId, step);
    if (failure) {
      failedStep = step;
      break;
    }
    completed.add(step);
    if (step === "registry") break;
  }
  if (failedStep) {
    const latest = getWorkspaceById(workspaceId) ?? workspace;
    writeIntent(latest, Object.freeze({
      phase: "DELETE_BLOCKED",
      operationId,
      fingerprint,
      completedSteps: Object.freeze([...completed]),
      failedStep,
      updatedAt: now ?? new Date().toISOString(),
    }));
    return result(false, failure ?? "cleanup-failed", "DELETE_BLOCKED", failedStep);
  }
  return result(true, "deleted", "DELETED", null);
}

export function confirmWorkspaceDeletion(input: {
  readonly workspaceId: string;
  readonly operationId: string;
  readonly fingerprint: string;
  readonly now?: string;
}): WorkspaceDeletionResult {
  const current = readWorkspaceDeletionIntent(input.workspaceId);
  if (!current) return result(false, "confirmation-required", null, null);
  if (current.phase === "DELETING" && current.operationId === input.operationId) {
    return execute(input.workspaceId, input.operationId, current.fingerprint, input.now);
  }
  if (current.operationId !== input.operationId) return result(false, "operation-conflict", current.phase, current.failedStep);
  const fresh = current.phase === "DELETE_REQUESTED" ? previewWorkspaceDeletion(input.workspaceId) : null;
  if (fresh && input.fingerprint !== fresh.fingerprint) return result(false, "stale-confirmation", current.phase, null);
  if (!fresh && current.fingerprint !== input.fingerprint) return result(false, "stale-confirmation", current.phase, current.failedStep);
  const workspace = getWorkspaceById(input.workspaceId);
  if (!workspace) return result(false, "missing-workspace", null, null);
  const fingerprint = fresh?.fingerprint ?? current.fingerprint;
  writeIntent(workspace, Object.freeze({
    ...current,
    phase: "DELETING",
    fingerprint,
    updatedAt: input.now ?? new Date().toISOString(),
  }));
  return execute(input.workspaceId, input.operationId, fingerprint, input.now);
}

export function retryWorkspaceDeletion(input: {
  readonly workspaceId: string;
  readonly operationId: string;
  readonly now?: string;
}): WorkspaceDeletionResult {
  const current = readWorkspaceDeletionIntent(input.workspaceId);
  if (!current) return result(false, "missing-intent", null, null);
  if (current.operationId !== input.operationId) return result(false, "operation-conflict", current.phase, current.failedStep);
  if (current.phase === "DELETE_REQUESTED") return result(false, "confirmation-required", current.phase, null);
  return execute(input.workspaceId, input.operationId, current.fingerprint, input.now);
}

export function workspaceDeletionStorageKeyForTests(): typeof DURABLE_MONITORING_STORAGE_KEY {
  return DURABLE_MONITORING_STORAGE_KEY;
}

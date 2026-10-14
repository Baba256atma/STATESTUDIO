/**
 * NPA-T MWI:3 — classify, migrate, or quarantine historical workspace identity.
 *
 * The workspace registry remains the only active-workspace authority.
 * The active workspace is not migration evidence.
 */

import {
  CSV_MVP_DEMO_COMMITTED_AT,
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_PENDING_FILE,
} from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  listAutomaticMonitoringPolicies,
  listAutomaticMonitoringRuntimeStates,
} from "../data-reality/automaticMonitoringRuntime.ts";
import {
  listCsvRealDataImports,
  type CsvCommittedImport,
  type CsvImportCandidate,
  type CsvRealDataImportExportedState,
  type CsvRemovedSourceReference,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  listNexoraLiveConnections,
  listNexoraLiveObservations,
} from "../data-reality/liveDataConnectionStore.ts";
import {
  DEMO_WORKSPACE_ID,
  isLegacyWorkflowWorkspaceIdentifier,
  type WorkspaceId,
} from "./workspaceRegistryContract.ts";
import { isRealManagerWorkspaceId } from "./liveManagerDataWorkspaceGuard.ts";

export const LEGACY_GLOBAL_WORKSPACE_KEY = "nexora-mvp" as const;
export const MWI3_MIGRATION_IDENTITY = "MWI:3/LegacyWorkspaceIdentityMigration" as const;

const DEMO_IMPORT_PREFIX = "cei3-mvp-demo:";
const DEMO_FILE_NAMES = new Set<string>([
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_PENDING_FILE,
]);

const ACCEPTED_OWNERSHIP_BASES = new Set([
  "persisted-canonical-id",
  "durable-source-metadata",
  "business-project-reference",
  "canonical-source-relationship",
  "import-ownership",
  "explicit-source-link",
]);

export type LegacyWorkspaceClassification =
  | "LEGACY_WORKFLOW_KEY"
  | "LEGACY_GLOBAL_KEY"
  | "DEMO_DATA"
  | "MANAGER_DATA_PROVABLE"
  | "MANAGER_DATA_AMBIGUOUS"
  | "NAVIGATION_ONLY"
  | "TEST_ONLY"
  | "CANONICAL";

export type LegacyMigrationDisposition =
  | "unchanged"
  | "migrated-demo"
  | "migrated-manager"
  | "quarantined"
  | "conflict-retained";

export type LegacyOwnershipProof = Readonly<{
  readonly sourceContextId: string;
  readonly targetWorkspaceId: string;
  readonly basis: string;
}>;

export type LegacyWorkspaceMigrationOptions = Readonly<{
  readonly proofs?: readonly LegacyOwnershipProof[];
  /** Recorded so callers can see it was supplied. It is never used as evidence. */
  readonly activeWorkspaceId?: string | null;
}>;

export type LegacyRecordMigration = Readonly<{
  readonly recordKey: string;
  readonly fromWorkspaceId: string;
  readonly classification: LegacyWorkspaceClassification;
  readonly disposition: LegacyMigrationDisposition;
  readonly toWorkspaceId: string | null;
  readonly evidence: string | null;
}>;

export type CsvLegacyIdentityMigrationReport = Readonly<{
  readonly identity: typeof MWI3_MIGRATION_IDENTITY;
  readonly activeWorkspaceUsedAsEvidence: false;
  readonly changed: boolean;
  readonly state: CsvRealDataImportExportedState;
  readonly records: readonly LegacyRecordMigration[];
}>;

export const MWI3_HISTORICAL_IDENTITY_DEBT = Object.freeze([
  Object.freeze({
    identity: "overview|problem|scenario|decision|execution",
    system: "csv-indexeddb",
    classification: "LEGACY_WORKFLOW_KEY",
    action: "demo markers move to demo_workspace; explicit non-active proof moves to that manager workspace; otherwise retain and exclude",
  }),
  Object.freeze({
    identity: "nexora-mvp",
    system: "learning",
    classification: "LEGACY_GLOBAL_KEY",
    action: "preserve as historical product bucket; manager reads and new manager writes use the canonical workspace id",
  }),
  Object.freeze({
    identity: "overview|problem|scenario|decision|execution",
    system: "conversation-context.currentWorkspaceId",
    classification: "NAVIGATION_ONLY",
    action: "keep as workflow mode; manager identity is managerWorkspaceId",
  }),
  Object.freeze({
    identity: "overview|problem|scenario|decision|execution",
    system: "monitoring-and-live-connection",
    classification: "MANAGER_DATA_AMBIGUOUS",
    action: "retain under the historical key unless an explicit connection proof names one Manager Workspace; manager reads exclude the legacy key",
  }),
  Object.freeze({
    identity: "default_workspace",
    system: "localStorage nexora.workspace.v1",
    classification: "OBSOLETE_CONTAINER",
    action: "classified OBSOLETE_CONTAINER; its load and save cannot select the registry workspace",
  }),
  Object.freeze({
    identity: "interaction.workspace",
    system: "saved-scene-empty-detail",
    classification: "NAVIGATION_ONLY",
    action: "empty Detail uses scene-org:empty-detail; Saved Scene ownership is managerWorkspaceId on the existing scene",
  }),
] as const);

function isLegacyOrGlobalKey(workspaceId: string): boolean {
  return isLegacyWorkflowWorkspaceIdentifier(workspaceId) || workspaceId === LEGACY_GLOBAL_WORKSPACE_KEY;
}

function demoFile(fileName: unknown): boolean {
  return typeof fileName === "string" && DEMO_FILE_NAMES.has(fileName);
}

function demoImport(importId: unknown): boolean {
  return typeof importId === "string" && importId.startsWith(DEMO_IMPORT_PREFIX);
}

function committedDemoProven(record: CsvCommittedImport): boolean {
  return (
    demoFile(record.prepared?.fileName) &&
    demoImport(record.importId) &&
    record.committedAt === CSV_MVP_DEMO_COMMITTED_AT
  );
}

function pendingDemoProven(record: CsvImportCandidate): boolean {
  return (
    demoFile(record.fileName) &&
    demoImport(record.input?.importId) &&
    record.input?.importedAt === CSV_MVP_DEMO_COMMITTED_AT
  );
}

function removedDemoProven(record: CsvRemovedSourceReference): boolean {
  return demoFile(record.label) && demoImport(record.importId);
}

function provenManagerTarget(
  sourceContextId: string,
  proofs: readonly LegacyOwnershipProof[],
): { readonly workspaceId: string; readonly evidence: string } | null {
  const accepted = proofs.filter(
    (proof) =>
      proof.sourceContextId === sourceContextId &&
      ACCEPTED_OWNERSHIP_BASES.has(proof.basis) &&
      isRealManagerWorkspaceId(proof.targetWorkspaceId),
  );
  const targets = [...new Set(accepted.map((proof) => proof.targetWorkspaceId))];
  if (targets.length !== 1) return null;
  const evidence = [...new Set(accepted.map((proof) => proof.basis))].sort().join("+");
  return { workspaceId: targets[0]!, evidence };
}

function retargetPrepared<T extends CsvCommittedImport["prepared"]>(prepared: T, from: string, to: WorkspaceId): T {
  const snapshot = prepared.snapshot;
  const identity = snapshot?.source.identity;
  const handoff = prepared.handoff;
  return {
    ...prepared,
    workspaceId: prepared.workspaceId === from ? to : prepared.workspaceId,
    mapping: {
      ...prepared.mapping,
      mappings: prepared.mapping.mappings.map((entry) => {
        const semantic = entry.semantic;
        if (!semantic || semantic.workspaceId !== from) return entry;
        return { ...entry, semantic: { ...semantic, workspaceId: to } };
      }),
    },
    snapshot:
      snapshot && identity
        ? {
            ...snapshot,
            source: {
              ...snapshot.source,
              identity: {
                ...identity,
                workspaceId: identity.workspaceId === from ? to : identity.workspaceId,
              },
            },
          }
        : snapshot,
    handoff:
      handoff && handoff.workspaceId === from
        ? { ...handoff, workspaceId: to }
        : handoff,
  };
}

function retargetCommitted(record: CsvCommittedImport, to: string): CsvCommittedImport {
  return {
    ...record,
    workspaceId: to,
    prepared: retargetPrepared(record.prepared, record.workspaceId, to),
  };
}

function retargetPending(record: CsvImportCandidate, to: string): CsvImportCandidate {
  return {
    ...record,
    workspaceId: to,
    input: {
      ...record.input,
      workspaceId: record.input.workspaceId === record.workspaceId ? to : record.input.workspaceId,
    },
    prepared: record.prepared ? retargetPrepared(record.prepared, record.workspaceId, to) : record.prepared,
  };
}

function committedAligned(record: CsvCommittedImport): boolean {
  return (
    typeof record.sourceContextId === "string" &&
    typeof record.importId === "string" &&
    record.prepared?.ready === true &&
    record.prepared.workspaceId === record.workspaceId &&
    record.prepared.sourceContextId === record.sourceContextId
  );
}

function pendingAligned(record: CsvImportCandidate): boolean {
  return (
    typeof record.candidateId === "string" &&
    record.input?.workspaceId === record.workspaceId &&
    typeof record.input.csvText === "string"
  );
}

export function applyCsvLegacyIdentityMigration(
  state: CsvRealDataImportExportedState,
  options: LegacyWorkspaceMigrationOptions = {},
): CsvLegacyIdentityMigrationReport {
  const proofs = options.proofs ?? [];
  void options.activeWorkspaceId;
  const records: LegacyRecordMigration[] = [];
  const committed: CsvCommittedImport[] = [];
  const pending: CsvImportCandidate[] = [];
  const removed: CsvRemovedSourceReference[] = [];
  const occupiedCommitted = new Map<string, string>();
  const occupiedPending = new Map<string, string>();
  const occupiedRemoved = new Map<string, string>();
  let collapsedDuplicate = false;

  for (const item of state.committed) {
    if (!isLegacyOrGlobalKey(item.workspaceId)) {
      occupiedCommitted.set(`${item.workspaceId}::${item.sourceContextId}`, item.importId);
    }
  }
  for (const item of state.pending) {
    if (!isLegacyOrGlobalKey(item.workspaceId)) {
      occupiedPending.set(`${item.workspaceId}::${item.candidateId}`, item.input.importId);
    }
  }
  for (const item of state.removed) {
    if (!isLegacyOrGlobalKey(item.workspaceId)) {
      occupiedRemoved.set(`${item.workspaceId}::${item.sourceId}`, item.importId);
    }
  }

  for (const record of state.committed) {
    if (!isLegacyOrGlobalKey(record.workspaceId)) {
      committed.push(record);
      records.push(Object.freeze({
        recordKey: record.sourceContextId,
        fromWorkspaceId: record.workspaceId,
        classification: record.workspaceId === DEMO_WORKSPACE_ID ? "DEMO_DATA" : "CANONICAL",
        disposition: "unchanged",
        toWorkspaceId: null,
        evidence: null,
      }));
      continue;
    }
    const baseClassification: LegacyWorkspaceClassification =
      record.workspaceId === LEGACY_GLOBAL_WORKSPACE_KEY ? "LEGACY_GLOBAL_KEY" : "LEGACY_WORKFLOW_KEY";
    if (!committedAligned(record)) {
      committed.push(record);
      records.push(Object.freeze({
        recordKey: record.sourceContextId ?? "corrupt-committed",
        fromWorkspaceId: record.workspaceId,
        classification: "MANAGER_DATA_AMBIGUOUS",
        disposition: "quarantined",
        toWorkspaceId: null,
        evidence: "corrupt-or-unaligned",
      }));
      continue;
    }
    if (committedDemoProven(record)) {
      const slot = `${DEMO_WORKSPACE_ID}::${record.sourceContextId}`;
      const existing = occupiedCommitted.get(slot);
      if (existing != null && existing !== record.importId) {
        committed.push(record);
        records.push(Object.freeze({
          recordKey: record.sourceContextId,
          fromWorkspaceId: record.workspaceId,
          classification: "DEMO_DATA",
          disposition: "conflict-retained",
          toWorkspaceId: null,
          evidence: "demo-markers+target-conflict",
        }));
        continue;
      }
      if (existing === record.importId) {
        collapsedDuplicate = true;
        records.push(Object.freeze({
          recordKey: record.sourceContextId,
          fromWorkspaceId: record.workspaceId,
          classification: "DEMO_DATA",
          disposition: "unchanged",
          toWorkspaceId: DEMO_WORKSPACE_ID,
          evidence: "demo-markers+already-present",
        }));
        continue;
      }
      const moved = retargetCommitted(record, DEMO_WORKSPACE_ID);
      committed.push(moved);
      occupiedCommitted.set(slot, record.importId);
      records.push(Object.freeze({
        recordKey: record.sourceContextId,
        fromWorkspaceId: record.workspaceId,
        classification: "DEMO_DATA",
        disposition: "migrated-demo",
        toWorkspaceId: DEMO_WORKSPACE_ID,
        evidence: "cei3-mvp-demo+demo-file+demo-committed-at",
      }));
      continue;
    }
    const proof = provenManagerTarget(record.sourceContextId, proofs);
    if (!proof) {
      committed.push(record);
      records.push(Object.freeze({
        recordKey: record.sourceContextId,
        fromWorkspaceId: record.workspaceId,
        classification: "MANAGER_DATA_AMBIGUOUS",
        disposition: "quarantined",
        toWorkspaceId: null,
        evidence: baseClassification,
      }));
      continue;
    }
    const slot = `${proof.workspaceId}::${record.sourceContextId}`;
    const existing = occupiedCommitted.get(slot);
    if (existing != null && existing !== record.importId) {
      committed.push(record);
      records.push(Object.freeze({
        recordKey: record.sourceContextId,
        fromWorkspaceId: record.workspaceId,
        classification: "MANAGER_DATA_AMBIGUOUS",
        disposition: "conflict-retained",
        toWorkspaceId: null,
        evidence: "conflicting-target-content",
      }));
      continue;
    }
    if (existing === record.importId) {
      collapsedDuplicate = true;
      records.push(Object.freeze({
        recordKey: record.sourceContextId,
        fromWorkspaceId: record.workspaceId,
        classification: "MANAGER_DATA_PROVABLE",
        disposition: "unchanged",
        toWorkspaceId: proof.workspaceId,
        evidence: proof.evidence,
      }));
      continue;
    }
    const moved = retargetCommitted(record, proof.workspaceId);
    committed.push(moved);
    occupiedCommitted.set(slot, record.importId);
    records.push(Object.freeze({
      recordKey: record.sourceContextId,
      fromWorkspaceId: record.workspaceId,
      classification: "MANAGER_DATA_PROVABLE",
      disposition: "migrated-manager",
      toWorkspaceId: proof.workspaceId,
      evidence: proof.evidence,
    }));
  }

  for (const record of state.pending) {
    if (!isLegacyOrGlobalKey(record.workspaceId)) {
      pending.push(record);
      records.push(Object.freeze({
        recordKey: record.candidateId,
        fromWorkspaceId: record.workspaceId,
        classification: record.workspaceId === DEMO_WORKSPACE_ID ? "DEMO_DATA" : "CANONICAL",
        disposition: "unchanged",
        toWorkspaceId: null,
        evidence: null,
      }));
      continue;
    }
    if (!pendingAligned(record)) {
      pending.push(record);
      records.push(Object.freeze({
        recordKey: record.candidateId ?? "corrupt-pending",
        fromWorkspaceId: record.workspaceId,
        classification: "MANAGER_DATA_AMBIGUOUS",
        disposition: "quarantined",
        toWorkspaceId: null,
        evidence: "corrupt-or-unaligned",
      }));
      continue;
    }
    if (!pendingDemoProven(record)) {
      pending.push(record);
      records.push(Object.freeze({
        recordKey: record.candidateId,
        fromWorkspaceId: record.workspaceId,
        classification: "MANAGER_DATA_AMBIGUOUS",
        disposition: "quarantined",
        toWorkspaceId: null,
        evidence: "pending-without-demo-proof",
      }));
      continue;
    }
    const slot = `${DEMO_WORKSPACE_ID}::${record.candidateId}`;
    if (occupiedPending.has(slot)) {
      pending.push(record);
      records.push(Object.freeze({
        recordKey: record.candidateId,
        fromWorkspaceId: record.workspaceId,
        classification: "DEMO_DATA",
        disposition: "conflict-retained",
        toWorkspaceId: null,
        evidence: "demo-markers+target-conflict",
      }));
      continue;
    }
    pending.push(retargetPending(record, DEMO_WORKSPACE_ID));
    occupiedPending.set(slot, record.input.importId);
    records.push(Object.freeze({
      recordKey: record.candidateId,
      fromWorkspaceId: record.workspaceId,
      classification: "DEMO_DATA",
      disposition: "migrated-demo",
      toWorkspaceId: DEMO_WORKSPACE_ID,
      evidence: "cei3-mvp-demo+demo-file+demo-imported-at",
    }));
  }

  for (const record of state.removed) {
    if (!isLegacyOrGlobalKey(record.workspaceId)) {
      removed.push(record);
      records.push(Object.freeze({
        recordKey: record.sourceId,
        fromWorkspaceId: record.workspaceId,
        classification: record.workspaceId === DEMO_WORKSPACE_ID ? "DEMO_DATA" : "CANONICAL",
        disposition: "unchanged",
        toWorkspaceId: null,
        evidence: null,
      }));
      continue;
    }
    if (!removedDemoProven(record)) {
      removed.push(record);
      records.push(Object.freeze({
        recordKey: record.sourceId,
        fromWorkspaceId: record.workspaceId,
        classification: "MANAGER_DATA_AMBIGUOUS",
        disposition: "quarantined",
        toWorkspaceId: null,
        evidence: "removed-without-demo-proof",
      }));
      continue;
    }
    const slot = `${DEMO_WORKSPACE_ID}::${record.sourceId}`;
    if (occupiedRemoved.has(slot)) {
      removed.push(record);
      records.push(Object.freeze({
        recordKey: record.sourceId,
        fromWorkspaceId: record.workspaceId,
        classification: "DEMO_DATA",
        disposition: "conflict-retained",
        toWorkspaceId: null,
        evidence: "demo-markers+target-conflict",
      }));
      continue;
    }
    removed.push({ ...record, workspaceId: DEMO_WORKSPACE_ID });
    occupiedRemoved.set(slot, record.importId);
    records.push(Object.freeze({
      recordKey: record.sourceId,
      fromWorkspaceId: record.workspaceId,
      classification: "DEMO_DATA",
      disposition: "migrated-demo",
      toWorkspaceId: DEMO_WORKSPACE_ID,
      evidence: "cei3-mvp-demo+demo-file",
    }));
  }

  const changed = collapsedDuplicate || records.some(
    (record) => record.disposition === "migrated-demo" || record.disposition === "migrated-manager",
  );
  return Object.freeze({
    identity: MWI3_MIGRATION_IDENTITY,
    activeWorkspaceUsedAsEvidence: false as const,
    changed,
    state: Object.freeze({
      committed: Object.freeze(committed),
      pending: Object.freeze(pending),
      removed: Object.freeze(removed),
    }),
    records: Object.freeze(records),
  });
}

/** Manager truth reads one canonical workspace. Legacy and global keys contribute nothing. */
export function readManagerWorkspaceCsvImports(workspaceId: WorkspaceId): readonly CsvCommittedImport[] {
  if (isLegacyOrGlobalKey(workspaceId)) return Object.freeze([]);
  return listCsvRealDataImports(workspaceId);
}

/**
 * Learning under nexora-mvp is a historical product bucket.
 * A real manager read uses its own workspace id. A missing or workflow id
 * stays on the historical bucket so existing callers are not reassigned.
 */
export type MonitoringOwnershipProof = Readonly<{
  readonly connectionId: string;
  readonly targetWorkspaceId: string;
  readonly basis: string;
}>;

export type MonitoringLegacySnapshot = {
  readonly policies: readonly { workspaceId: string; connectionId: string; policyId: string }[];
  readonly runtimeStates: readonly { workspaceId: string; connectionId: string; policyId: string }[];
  readonly liveData: {
    readonly connections: readonly { workspaceId: string; connectionId: string }[];
    readonly observations: readonly { workspaceId: string; connectionId: string; observationId: string }[];
  };
  readonly advisorDelivery: { readonly briefs: readonly { workspaceId: string; briefId: string }[] };
};

export type MonitoringLegacyMigrationReport<T> = Readonly<{
  readonly identity: typeof MWI3_MIGRATION_IDENTITY;
  readonly activeWorkspaceUsedAsEvidence: false;
  readonly changed: boolean;
  readonly state: T;
  readonly records: readonly LegacyRecordMigration[];
}>;

function retargetWorkspace<T extends { workspaceId: string }>(record: T, to: string): T {
  if (record.workspaceId === to) return record;
  const next = { ...record, workspaceId: to } as T & {
    snapshot?: { source?: { identity?: { workspaceId?: string } } };
    handoff?: { workspaceId?: string };
  };
  const identity = next.snapshot?.source?.identity;
  if (identity?.workspaceId === record.workspaceId && next.snapshot?.source) {
    next.snapshot = {
      ...next.snapshot,
      source: {
        ...next.snapshot.source,
        identity: { ...identity, workspaceId: to },
      },
    };
  }
  if (next.handoff?.workspaceId === record.workspaceId) {
    next.handoff = { ...next.handoff, workspaceId: to };
  }
  return next;
}

export function applyMonitoringLegacyIdentityMigration<T extends MonitoringLegacySnapshot>(
  snapshot: T,
  options: Omit<LegacyWorkspaceMigrationOptions, "proofs"> & {
    readonly proofs?: readonly MonitoringOwnershipProof[];
  } = {},
): MonitoringLegacyMigrationReport<T> {
  void options.activeWorkspaceId;
  const proofs = (options.proofs ?? []) as readonly MonitoringOwnershipProof[];
  const records: LegacyRecordMigration[] = [];
  const legacyConnections = snapshot.liveData.connections.filter((entry) => isLegacyOrGlobalKey(entry.workspaceId));
  const legacyPolicies = snapshot.policies.filter((entry) => isLegacyOrGlobalKey(entry.workspaceId));
  const legacyStates = snapshot.runtimeStates.filter((entry) => isLegacyOrGlobalKey(entry.workspaceId));
  const legacyObservations = snapshot.liveData.observations.filter((entry) => isLegacyOrGlobalKey(entry.workspaceId));
  const legacyBriefs = snapshot.advisorDelivery.briefs.filter((entry) => isLegacyOrGlobalKey(entry.workspaceId));
  if (
    legacyConnections.length === 0 &&
    legacyPolicies.length === 0 &&
    legacyStates.length === 0 &&
    legacyObservations.length === 0 &&
    legacyBriefs.length === 0
  ) {
    return Object.freeze({
      identity: MWI3_MIGRATION_IDENTITY,
      activeWorkspaceUsedAsEvidence: false as const,
      changed: false,
      state: snapshot,
      records: Object.freeze(records),
    });
  }

  const occupied = new Set(
    snapshot.liveData.connections
      .filter((entry) => !isLegacyOrGlobalKey(entry.workspaceId))
      .map((entry) => `${entry.workspaceId}::${entry.connectionId}`),
  );
  const decision = new Map<string, { to: string; evidence: string } | "quarantine" | "conflict">();
  const connectionIds = new Set([
    ...legacyConnections.map((entry) => entry.connectionId),
    ...legacyPolicies.map((entry) => entry.connectionId),
    ...legacyStates.map((entry) => entry.connectionId),
    ...legacyObservations.map((entry) => entry.observationId ? entry.connectionId : entry.connectionId),
  ]);
  for (const connectionId of connectionIds) {
    const accepted = proofs.filter(
      (proof) =>
        proof.connectionId === connectionId &&
        ACCEPTED_OWNERSHIP_BASES.has(proof.basis) &&
        isRealManagerWorkspaceId(proof.targetWorkspaceId),
    );
    const targets = [...new Set(accepted.map((proof) => proof.targetWorkspaceId))];
    if (targets.length !== 1) {
      decision.set(connectionId, "quarantine");
      continue;
    }
    const target = targets[0]!;
    if (occupied.has(`${target}::${connectionId}`)) {
      decision.set(connectionId, "conflict");
      continue;
    }
    decision.set(connectionId, {
      to: target,
      evidence: [...new Set(accepted.map((proof) => proof.basis))].sort().join("+"),
    });
    occupied.add(`${target}::${connectionId}`);
  }

  let changed = false;
  const mapFamily = <TRecord extends { workspaceId: string; connectionId: string }>(items: readonly TRecord[]) =>
    items.map((item) => {
      if (!isLegacyOrGlobalKey(item.workspaceId)) {
        records.push(Object.freeze({
          recordKey: item.connectionId,
          fromWorkspaceId: item.workspaceId,
          classification: item.workspaceId === DEMO_WORKSPACE_ID ? "DEMO_DATA" : "CANONICAL",
          disposition: "unchanged",
          toWorkspaceId: null,
          evidence: null,
        }));
        return item;
      }
      const chosen = decision.get(item.connectionId);
      if (!chosen || chosen === "quarantine" || chosen === "conflict") {
        records.push(Object.freeze({
          recordKey: item.connectionId,
          fromWorkspaceId: item.workspaceId,
          classification: "MANAGER_DATA_AMBIGUOUS",
          disposition: chosen === "conflict" ? "conflict-retained" : "quarantined",
          toWorkspaceId: null,
          evidence: chosen === "conflict" ? "conflicting-target-content" : "monitoring-without-ownership-proof",
        }));
        return item;
      }
      changed = true;
      records.push(Object.freeze({
        recordKey: item.connectionId,
        fromWorkspaceId: item.workspaceId,
        classification: "MANAGER_DATA_PROVABLE",
        disposition: "migrated-manager",
        toWorkspaceId: chosen.to,
        evidence: chosen.evidence,
      }));
      return retargetWorkspace(item, chosen.to);
    });

  const connections = mapFamily(snapshot.liveData.connections);
  const policies = mapFamily(snapshot.policies);
  const runtimeStates = mapFamily(snapshot.runtimeStates);
  const observations = mapFamily(snapshot.liveData.observations);
  const briefs = snapshot.advisorDelivery.briefs.map((brief) => {
    if (!isLegacyOrGlobalKey(brief.workspaceId)) return brief;
    records.push(Object.freeze({
      recordKey: brief.briefId,
      fromWorkspaceId: brief.workspaceId,
      classification: "MANAGER_DATA_AMBIGUOUS",
      disposition: "quarantined",
      toWorkspaceId: null,
      evidence: "brief-without-connection-proof",
    }));
    return brief;
  });
  if (!changed) {
    return Object.freeze({
      identity: MWI3_MIGRATION_IDENTITY,
      activeWorkspaceUsedAsEvidence: false as const,
      changed: false,
      state: snapshot,
      records: Object.freeze(records),
    });
  }
  return Object.freeze({
    identity: MWI3_MIGRATION_IDENTITY,
    activeWorkspaceUsedAsEvidence: false as const,
    changed: true,
    state: {
      ...snapshot,
      policies,
      runtimeStates,
      liveData: {
        ...snapshot.liveData,
        connections,
        observations,
      },
      advisorDelivery: {
        ...snapshot.advisorDelivery,
        briefs,
      },
    } as T,
    records: Object.freeze(records),
  });
}

/** Manager monitoring and connection reads stay on one canonical workspace id. */
export function readManagerLiveConnections(workspaceId: string) {
  if (isLegacyOrGlobalKey(workspaceId)) return Object.freeze([]);
  return listNexoraLiveConnections(workspaceId);
}

export function readManagerLiveObservations(workspaceId: string, connectionId: string) {
  if (isLegacyOrGlobalKey(workspaceId)) return Object.freeze([]);
  return listNexoraLiveObservations(workspaceId, connectionId);
}

export function readManagerMonitoringPolicies(workspaceId: string) {
  if (isLegacyOrGlobalKey(workspaceId)) return Object.freeze([]);
  return listAutomaticMonitoringPolicies(workspaceId);
}

export function readManagerMonitoringRuntimeStates(workspaceId: string) {
  if (isLegacyOrGlobalKey(workspaceId)) return Object.freeze([]);
  return listAutomaticMonitoringRuntimeStates(workspaceId);
}

export function managerLearningWorkspaceId(managerWorkspaceId: string | null | undefined): string {
  if (
    typeof managerWorkspaceId === "string" &&
    managerWorkspaceId.length > 0 &&
    !isLegacyOrGlobalKey(managerWorkspaceId)
  ) {
    return managerWorkspaceId;
  }
  return LEGACY_GLOBAL_WORKSPACE_KEY;
}

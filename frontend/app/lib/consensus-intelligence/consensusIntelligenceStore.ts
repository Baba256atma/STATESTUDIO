import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CONSENSUS_INTELLIGENCE_MAX_ALIGNMENT_FIELDS,
  CONSENSUS_INTELLIGENCE_MAX_CONFLICTS,
  CONSENSUS_INTELLIGENCE_MAX_PERSPECTIVES,
  CONSENSUS_INTELLIGENCE_MAX_RECORDS,
  CONSENSUS_INTELLIGENCE_MAX_SIGNALS,
  CONSENSUS_INTELLIGENCE_MAX_SNAPSHOTS,
} from "./consensusIntelligenceGuards";
import type {
  ConsensusAlignmentField,
  ConsensusIntelligenceStoreState,
  ConsensusState,
  EnterprisePerspectiveConflict,
  ExecutiveReasoningPerspective,
  MultiAgentReasoningSignal,
  StrategicConsensusRecord,
  StrategicConsensusSnapshot,
} from "./consensusIntelligenceTypes";

function mergePerspectives(
  existing: ExecutiveReasoningPerspective,
  incoming: ExecutiveReasoningPerspective
): ExecutiveReasoningPerspective {
  return {
    ...existing,
    prioritySummary: incoming.prioritySummary || existing.prioritySummary,
    perspectiveWeight: Math.max(existing.perspectiveWeight, incoming.perspectiveWeight),
    alignmentSignals: Object.freeze(
      Array.from(new Set([...existing.alignmentSignals, ...incoming.alignmentSignals])).slice(0, 6)
    ),
    divergenceRisks: Object.freeze(
      Array.from(new Set([...existing.divergenceRisks, ...incoming.divergenceRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function mergeRecords(
  existing: StrategicConsensusRecord,
  incoming: StrategicConsensusRecord
): StrategicConsensusRecord {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    alignedPerspectives: Object.freeze(
      Array.from(new Set([...existing.alignedPerspectives, ...incoming.alignedPerspectives])).slice(
        0,
        6
      )
    ),
    divergentPerspectives: Object.freeze(
      Array.from(
        new Set([...existing.divergentPerspectives, ...incoming.divergentPerspectives])
      ).slice(0, 6)
    ),
    consensusSignals: Object.freeze(
      Array.from(new Set([...existing.consensusSignals, ...incoming.consensusSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    consensusState:
      incoming.confidence >= existing.confidence ? incoming.consensusState : existing.consensusState,
    consensusStrength:
      incoming.confidence >= existing.confidence
        ? incoming.consensusStrength
        : existing.consensusStrength,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  consensusRecords: readonly StrategicConsensusRecord[];
}): string {
  return stableSignature([
    "d9-7-1-consensus-intelligence",
    state.consensusRecords.length,
    state.consensusRecords.slice(0, 3).map((r) => r.consensusId),
  ]);
}

export function createConsensusIntelligenceStore(initial?: ConsensusIntelligenceStoreState): {
  getState(): ConsensusIntelligenceStoreState;
  upsertReasoningPerspectives(
    perspectives: ExecutiveReasoningPerspective[],
    now?: number
  ): ConsensusIntelligenceStoreState;
  upsertConsensusRecords(
    records: StrategicConsensusRecord[],
    now?: number
  ): ConsensusIntelligenceStoreState;
  upsertSnapshots(
    snapshots: StrategicConsensusSnapshot[],
    now?: number
  ): ConsensusIntelligenceStoreState;
  upsertPerspectiveConflicts(
    conflicts: EnterprisePerspectiveConflict[],
    now?: number
  ): ConsensusIntelligenceStoreState;
  upsertMultiAgentSignals(
    signals: MultiAgentReasoningSignal[],
    now?: number
  ): ConsensusIntelligenceStoreState;
  upsertAlignmentFields(
    fields: ConsensusAlignmentField[],
    now?: number
  ): ConsensusIntelligenceStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastConsensusState(state: ConsensusState): void;
  clear(): ConsensusIntelligenceStoreState;
} {
  let state: ConsensusIntelligenceStoreState = initial ?? {
    reasoningPerspectives: [],
    consensusRecords: [],
    snapshots: [],
    perspectiveConflicts: [],
    multiAgentSignals: [],
    alignmentFields: [],
    signature: buildStoreSignature({ consensusRecords: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastConsensusState: null,
  };

  return {
    getState(): ConsensusIntelligenceStoreState {
      return {
        ...state,
        reasoningPerspectives: state.reasoningPerspectives.map((p) => ({ ...p })),
        consensusRecords: state.consensusRecords.map((r) => ({ ...r })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        perspectiveConflicts: state.perspectiveConflicts.map((c) => ({ ...c })),
        multiAgentSignals: state.multiAgentSignals.map((s) => ({ ...s })),
        alignmentFields: state.alignmentFields.map((f) => ({ ...f })),
      };
    },

    upsertReasoningPerspectives(
      perspectives: ExecutiveReasoningPerspective[],
      now = Date.now()
    ): ConsensusIntelligenceStoreState {
      const byId = new Map<string, ExecutiveReasoningPerspective>();
      for (const p of state.reasoningPerspectives) byId.set(p.perspectiveId, p);
      for (const p of perspectives) {
        const existing = byId.get(p.perspectiveId);
        byId.set(p.perspectiveId, existing ? mergePerspectives(existing, p) : p);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CONSENSUS_INTELLIGENCE_MAX_PERSPECTIVES);
      state = { ...state, reasoningPerspectives: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertConsensusRecords(
      records: StrategicConsensusRecord[],
      now = Date.now()
    ): ConsensusIntelligenceStoreState {
      const byId = new Map<string, StrategicConsensusRecord>();
      for (const r of state.consensusRecords) byId.set(r.consensusId, r);
      for (const r of records) {
        const existing = byId.get(r.consensusId);
        byId.set(r.consensusId, existing ? mergeRecords(existing, r) : r);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CONSENSUS_INTELLIGENCE_MAX_RECORDS);
      state = {
        ...state,
        consensusRecords: Object.freeze(next),
        signature: buildStoreSignature({ consensusRecords: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StrategicConsensusSnapshot[],
      now = Date.now()
    ): ConsensusIntelligenceStoreState {
      const bySig = new Map<string, StrategicConsensusSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_INTELLIGENCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPerspectiveConflicts(
      conflicts: EnterprisePerspectiveConflict[],
      now = Date.now()
    ): ConsensusIntelligenceStoreState {
      const byId = new Map<string, EnterprisePerspectiveConflict>();
      for (const c of state.perspectiveConflicts) byId.set(c.conflictId, c);
      for (const c of conflicts) byId.set(c.conflictId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_INTELLIGENCE_MAX_CONFLICTS);
      state = { ...state, perspectiveConflicts: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertMultiAgentSignals(
      signals: MultiAgentReasoningSignal[],
      now = Date.now()
    ): ConsensusIntelligenceStoreState {
      const byId = new Map<string, MultiAgentReasoningSignal>();
      for (const s of state.multiAgentSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_INTELLIGENCE_MAX_SIGNALS);
      state = { ...state, multiAgentSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAlignmentFields(
      fields: ConsensusAlignmentField[],
      now = Date.now()
    ): ConsensusIntelligenceStoreState {
      const byId = new Map<string, ConsensusAlignmentField>();
      for (const f of state.alignmentFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_INTELLIGENCE_MAX_ALIGNMENT_FIELDS);
      state = { ...state, alignmentFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastConsensusState(consensusState: ConsensusState): void {
      state = { ...state, lastConsensusState: consensusState };
    },

    clear(): ConsensusIntelligenceStoreState {
      state = {
        reasoningPerspectives: [],
        consensusRecords: [],
        snapshots: [],
        perspectiveConflicts: [],
        multiAgentSignals: [],
        alignmentFields: [],
        signature: buildStoreSignature({ consensusRecords: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastConsensusState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createConsensusIntelligenceStore>>();

export function getConsensusIntelligenceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createConsensusIntelligenceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetConsensusIntelligenceStores(): void {
  storesByOrganization.clear();
}

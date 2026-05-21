import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_GOVERNANCE_MAX_OBSERVATIONS,
  INSTITUTIONAL_GOVERNANCE_MAX_SIGNALS,
  INSTITUTIONAL_GOVERNANCE_MAX_SNAPSHOTS,
  INSTITUTIONAL_GOVERNANCE_MAX_VALIDATIONS,
  integrityRank,
  statusSeverity,
} from "./institutionalGovernanceGuards";
import type {
  CognitiveIntegritySignal,
  InstitutionalConsistencyObservation,
  InstitutionalGovernanceStoreState,
  InstitutionalLearningGovernanceSnapshot,
  OrganizationalLearningHealth,
  StrategicTrustValidation,
} from "./institutionalGovernanceTypes";

function mergeSnapshots(
  existing: InstitutionalLearningGovernanceSnapshot,
  incoming: InstitutionalLearningGovernanceSnapshot
): InstitutionalLearningGovernanceSnapshot {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    governanceStatus:
      statusSeverity(incoming.governanceStatus) < statusSeverity(existing.governanceStatus)
        ? incoming.governanceStatus
        : existing.governanceStatus,
    integrityLevel:
      integrityRank(incoming.integrityLevel) > integrityRank(existing.integrityLevel)
        ? incoming.integrityLevel
        : existing.integrityLevel,
    confidence: Math.max(existing.confidence, incoming.confidence),
    observations: Object.freeze(
      Array.from(new Set([...existing.observations, ...incoming.observations])).slice(0, 6)
    ),
    lastEvaluatedAt: Math.max(existing.lastEvaluatedAt, incoming.lastEvaluatedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  snapshots: readonly InstitutionalLearningGovernanceSnapshot[];
  integritySignals: readonly CognitiveIntegritySignal[];
}): string {
  return stableSignature([
    "d9-2-9-governance",
    state.snapshots.length,
    state.integritySignals.length,
    state.snapshots.slice(0, 3).map((s) => s.governanceSnapshotId),
  ]);
}

export function createInstitutionalGovernanceStore(initial?: InstitutionalGovernanceStoreState): {
  getState(): InstitutionalGovernanceStoreState;
  upsertSnapshots(
    snapshots: InstitutionalLearningGovernanceSnapshot[],
    now?: number
  ): InstitutionalGovernanceStoreState;
  upsertIntegritySignals(
    signals: CognitiveIntegritySignal[],
    now?: number
  ): InstitutionalGovernanceStoreState;
  upsertTrustValidations(
    validations: StrategicTrustValidation[],
    now?: number
  ): InstitutionalGovernanceStoreState;
  upsertConsistencyObservations(
    observations: InstitutionalConsistencyObservation[],
    now?: number
  ): InstitutionalGovernanceStoreState;
  setLearningHealth(health: OrganizationalLearningHealth | null): void;
  setLastEvaluationSignature(signature: string): void;
  setLastGovernanceStatus(status: InstitutionalLearningGovernanceSnapshot["governanceStatus"]): void;
  clear(): InstitutionalGovernanceStoreState;
} {
  let state: InstitutionalGovernanceStoreState = initial ?? {
    snapshots: [],
    integritySignals: [],
    trustValidations: [],
    consistencyObservations: [],
    learningHealth: null,
    signature: buildStoreSignature({ snapshots: [], integritySignals: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastGovernanceStatus: null,
  };

  return {
    getState(): InstitutionalGovernanceStoreState {
      return {
        ...state,
        snapshots: state.snapshots.map((s) => ({ ...s })),
        integritySignals: state.integritySignals.map((s) => ({ ...s })),
        trustValidations: state.trustValidations.map((v) => ({ ...v })),
        consistencyObservations: state.consistencyObservations.map((o) => ({ ...o })),
        learningHealth: state.learningHealth ? { ...state.learningHealth } : null,
      };
    },

    upsertSnapshots(
      snapshots: InstitutionalLearningGovernanceSnapshot[],
      now = Date.now()
    ): InstitutionalGovernanceStoreState {
      const byId = new Map<string, InstitutionalLearningGovernanceSnapshot>();
      for (const s of state.snapshots) byId.set(s.governanceSnapshotId, s);
      for (const s of snapshots) {
        const existing = byId.get(s.governanceSnapshotId);
        byId.set(s.governanceSnapshotId, existing ? mergeSnapshots(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastEvaluatedAt - a.lastEvaluatedAt)
        .slice(0, INSTITUTIONAL_GOVERNANCE_MAX_SNAPSHOTS);
      state = {
        ...state,
        snapshots: Object.freeze(next),
        signature: buildStoreSignature({ snapshots: next, integritySignals: state.integritySignals }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertIntegritySignals(
      signals: CognitiveIntegritySignal[],
      now = Date.now()
    ): InstitutionalGovernanceStoreState {
      const byId = new Map<string, CognitiveIntegritySignal>();
      for (const s of state.integritySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_GOVERNANCE_MAX_SIGNALS);
      state = {
        ...state,
        integritySignals: Object.freeze(next),
        signature: buildStoreSignature({ snapshots: state.snapshots, integritySignals: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertTrustValidations(
      validations: StrategicTrustValidation[],
      now = Date.now()
    ): InstitutionalGovernanceStoreState {
      const byId = new Map<string, StrategicTrustValidation>();
      for (const v of state.trustValidations) byId.set(v.validationId, v);
      for (const v of validations) byId.set(v.validationId, v);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_GOVERNANCE_MAX_VALIDATIONS);
      state = { ...state, trustValidations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertConsistencyObservations(
      observations: InstitutionalConsistencyObservation[],
      now = Date.now()
    ): InstitutionalGovernanceStoreState {
      const byId = new Map<string, InstitutionalConsistencyObservation>();
      for (const o of state.consistencyObservations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_GOVERNANCE_MAX_OBSERVATIONS);
      state = { ...state, consistencyObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLearningHealth(health: OrganizationalLearningHealth | null): void {
      state = { ...state, learningHealth: health };
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastGovernanceStatus(
      status: InstitutionalLearningGovernanceSnapshot["governanceStatus"]
    ): void {
      state = { ...state, lastGovernanceStatus: status };
    },

    clear(): InstitutionalGovernanceStoreState {
      state = {
        snapshots: [],
        integritySignals: [],
        trustValidations: [],
        consistencyObservations: [],
        learningHealth: null,
        signature: buildStoreSignature({ snapshots: [], integritySignals: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastGovernanceStatus: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInstitutionalGovernanceStore>
>();

export function getInstitutionalGovernanceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalGovernanceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalGovernanceStores(): void {
  storesByOrganization.clear();
}

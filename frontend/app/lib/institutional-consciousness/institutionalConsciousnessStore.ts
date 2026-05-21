import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_CONSCIOUSNESS_MAX_FIELDS,
  INSTITUTIONAL_CONSCIOUSNESS_MAX_OBSERVATIONS,
  INSTITUTIONAL_CONSCIOUSNESS_MAX_RELATIONSHIPS,
  INSTITUTIONAL_CONSCIOUSNESS_MAX_SIGNALS,
  INSTITUTIONAL_CONSCIOUSNESS_MAX_SNAPSHOTS,
} from "./institutionalConsciousnessGuards";
import type {
  CivilizationScaleAwarenessField,
  EcosystemOperationalSignal,
  EnterpriseEcosystemRelationship,
  InstitutionalConsciousnessStoreState,
  InstitutionalConsciousnessSnapshot,
  InstitutionalState,
  MacroOperationalObservation,
} from "./institutionalConsciousnessTypes";

function mergeObservations(
  existing: MacroOperationalObservation,
  incoming: MacroOperationalObservation
): MacroOperationalObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    ecosystemSignals: Object.freeze(
      Array.from(new Set([...existing.ecosystemSignals, ...incoming.ecosystemSignals])).slice(0, 6)
    ),
    ecosystemRisks: Object.freeze(
      Array.from(new Set([...existing.ecosystemRisks, ...incoming.ecosystemRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    institutionalState:
      incoming.confidence >= existing.confidence
        ? incoming.institutionalState
        : existing.institutionalState,
    awarenessStrength:
      incoming.confidence >= existing.confidence
        ? incoming.awarenessStrength
        : existing.awarenessStrength,
    awarenessCategory:
      incoming.confidence >= existing.confidence
        ? incoming.awarenessCategory
        : existing.awarenessCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly MacroOperationalObservation[];
}): string {
  return stableSignature([
    "d9-8-1-institutional-consciousness",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.institutionalAwarenessId),
  ]);
}

export function createInstitutionalConsciousnessStore(initial?: InstitutionalConsciousnessStoreState): {
  getState(): InstitutionalConsciousnessStoreState;
  upsertObservations(
    observations: MacroOperationalObservation[],
    now?: number
  ): InstitutionalConsciousnessStoreState;
  upsertSnapshots(
    snapshots: InstitutionalConsciousnessSnapshot[],
    now?: number
  ): InstitutionalConsciousnessStoreState;
  upsertEcosystemSignals(
    signals: EcosystemOperationalSignal[],
    now?: number
  ): InstitutionalConsciousnessStoreState;
  upsertAwarenessFields(
    fields: CivilizationScaleAwarenessField[],
    now?: number
  ): InstitutionalConsciousnessStoreState;
  upsertEcosystemRelationships(
    relationships: EnterpriseEcosystemRelationship[],
    now?: number
  ): InstitutionalConsciousnessStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastInstitutionalState(state: InstitutionalState): void;
  clear(): InstitutionalConsciousnessStoreState;
} {
  let state: InstitutionalConsciousnessStoreState = initial ?? {
    observations: [],
    snapshots: [],
    ecosystemSignals: [],
    awarenessFields: [],
    ecosystemRelationships: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastInstitutionalState: null,
  };

  return {
    getState(): InstitutionalConsciousnessStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        ecosystemSignals: state.ecosystemSignals.map((s) => ({ ...s })),
        awarenessFields: state.awarenessFields.map((f) => ({ ...f })),
        ecosystemRelationships: state.ecosystemRelationships.map((r) => ({ ...r })),
      };
    },

    upsertObservations(
      observations: MacroOperationalObservation[],
      now = Date.now()
    ): InstitutionalConsciousnessStoreState {
      const byId = new Map<string, MacroOperationalObservation>();
      for (const o of state.observations) byId.set(o.institutionalAwarenessId, o);
      for (const o of observations) {
        const existing = byId.get(o.institutionalAwarenessId);
        byId.set(o.institutionalAwarenessId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_CONSCIOUSNESS_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: InstitutionalConsciousnessSnapshot[],
      now = Date.now()
    ): InstitutionalConsciousnessStoreState {
      const bySig = new Map<string, InstitutionalConsciousnessSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_CONSCIOUSNESS_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEcosystemSignals(
      signals: EcosystemOperationalSignal[],
      now = Date.now()
    ): InstitutionalConsciousnessStoreState {
      const byId = new Map<string, EcosystemOperationalSignal>();
      for (const s of state.ecosystemSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_CONSCIOUSNESS_MAX_SIGNALS);
      state = { ...state, ecosystemSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAwarenessFields(
      fields: CivilizationScaleAwarenessField[],
      now = Date.now()
    ): InstitutionalConsciousnessStoreState {
      const byId = new Map<string, CivilizationScaleAwarenessField>();
      for (const f of state.awarenessFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_CONSCIOUSNESS_MAX_FIELDS);
      state = { ...state, awarenessFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEcosystemRelationships(
      relationships: EnterpriseEcosystemRelationship[],
      now = Date.now()
    ): InstitutionalConsciousnessStoreState {
      const byId = new Map<string, EnterpriseEcosystemRelationship>();
      for (const r of state.ecosystemRelationships) byId.set(r.relationshipId, r);
      for (const r of relationships) byId.set(r.relationshipId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_CONSCIOUSNESS_MAX_RELATIONSHIPS);
      state = { ...state, ecosystemRelationships: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastInstitutionalState(institutionalState: InstitutionalState): void {
      state = { ...state, lastInstitutionalState: institutionalState };
    },

    clear(): InstitutionalConsciousnessStoreState {
      state = {
        observations: [],
        snapshots: [],
        ecosystemSignals: [],
        awarenessFields: [],
        ecosystemRelationships: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastInstitutionalState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInstitutionalConsciousnessStore>
>();

export function getInstitutionalConsciousnessStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalConsciousnessStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalConsciousnessStores(): void {
  storesByOrganization.clear();
}

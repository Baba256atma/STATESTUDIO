import { stableSignature } from "../intelligence/shared/dedupe";
import {
  TEMPORAL_FIELD_MAX_CONTINUITY_FIELDS,
  TEMPORAL_FIELD_MAX_ERA_EVOLUTIONS,
  TEMPORAL_FIELD_MAX_FIELDS,
  TEMPORAL_FIELD_MAX_PATTERNS,
  TEMPORAL_FIELD_MAX_SIGNALS,
  TEMPORAL_FIELD_MAX_SNAPSHOTS,
  TEMPORAL_FIELD_MAX_STRATEGIC_FIELDS,
} from "./temporalFieldGuards";
import type {
  EnterpriseLongHorizonPattern,
  InstitutionalContinuityField,
  LongHorizonAwarenessSnapshot,
  LongHorizonContinuitySignal,
  OperationalEraEvolution,
  OrganizationalTimeField,
  StrategicTemporalField,
  TemporalFieldStoreState,
} from "./temporalFieldTypes";

function mergeTimeFields(
  existing: OrganizationalTimeField,
  incoming: OrganizationalTimeField
): OrganizationalTimeField {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    fieldSignals: Object.freeze(
      Array.from(new Set([...existing.fieldSignals, ...incoming.fieldSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  timeFields: readonly OrganizationalTimeField[];
}): string {
  return stableSignature([
    "d9-3-9-temporal-field",
    state.timeFields.length,
    state.timeFields.slice(0, 3).map((f) => f.temporalFieldId),
  ]);
}

export function createTemporalFieldStore(initial?: TemporalFieldStoreState): {
  getState(): TemporalFieldStoreState;
  upsertTimeFields(fields: OrganizationalTimeField[], now?: number): TemporalFieldStoreState;
  upsertSnapshots(
    snapshots: LongHorizonAwarenessSnapshot[],
    now?: number
  ): TemporalFieldStoreState;
  upsertLongHorizonPatterns(
    patterns: EnterpriseLongHorizonPattern[],
    now?: number
  ): TemporalFieldStoreState;
  upsertStrategicTemporalFields(
    fields: StrategicTemporalField[],
    now?: number
  ): TemporalFieldStoreState;
  upsertEraEvolutions(
    evolutions: OperationalEraEvolution[],
    now?: number
  ): TemporalFieldStoreState;
  upsertContinuityFields(
    fields: InstitutionalContinuityField[],
    now?: number
  ): TemporalFieldStoreState;
  upsertContinuitySignals(
    signals: LongHorizonContinuitySignal[],
    now?: number
  ): TemporalFieldStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): TemporalFieldStoreState;
} {
  let state: TemporalFieldStoreState = initial ?? {
    timeFields: [],
    snapshots: [],
    longHorizonPatterns: [],
    strategicTemporalFields: [],
    eraEvolutions: [],
    continuityFields: [],
    continuitySignals: [],
    signature: buildStoreSignature({ timeFields: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): TemporalFieldStoreState {
      return {
        ...state,
        timeFields: state.timeFields.map((f) => ({ ...f })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        longHorizonPatterns: state.longHorizonPatterns.map((p) => ({ ...p })),
        strategicTemporalFields: state.strategicTemporalFields.map((f) => ({ ...f })),
        eraEvolutions: state.eraEvolutions.map((e) => ({ ...e })),
        continuityFields: state.continuityFields.map((f) => ({ ...f })),
        continuitySignals: state.continuitySignals.map((s) => ({ ...s })),
      };
    },

    upsertTimeFields(
      fields: OrganizationalTimeField[],
      now = Date.now()
    ): TemporalFieldStoreState {
      const byId = new Map<string, OrganizationalTimeField>();
      for (const f of state.timeFields) byId.set(f.temporalFieldId, f);
      for (const f of fields) {
        const existing = byId.get(f.temporalFieldId);
        byId.set(f.temporalFieldId, existing ? mergeTimeFields(existing, f) : { ...f });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TEMPORAL_FIELD_MAX_FIELDS);
      state = {
        ...state,
        timeFields: Object.freeze(next),
        signature: buildStoreSignature({ timeFields: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: LongHorizonAwarenessSnapshot[],
      now = Date.now()
    ): TemporalFieldStoreState {
      const byId = new Map<string, LongHorizonAwarenessSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_FIELD_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertLongHorizonPatterns(
      patterns: EnterpriseLongHorizonPattern[],
      now = Date.now()
    ): TemporalFieldStoreState {
      const byId = new Map<string, EnterpriseLongHorizonPattern>();
      for (const p of state.longHorizonPatterns) byId.set(p.patternId, p);
      for (const p of patterns) byId.set(p.patternId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_FIELD_MAX_PATTERNS);
      state = { ...state, longHorizonPatterns: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicTemporalFields(
      fields: StrategicTemporalField[],
      now = Date.now()
    ): TemporalFieldStoreState {
      const byId = new Map<string, StrategicTemporalField>();
      for (const f of state.strategicTemporalFields) byId.set(f.fieldKey, f);
      for (const f of fields) byId.set(f.fieldKey, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_FIELD_MAX_STRATEGIC_FIELDS);
      state = { ...state, strategicTemporalFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEraEvolutions(
      evolutions: OperationalEraEvolution[],
      now = Date.now()
    ): TemporalFieldStoreState {
      const byId = new Map<string, OperationalEraEvolution>();
      for (const e of state.eraEvolutions) byId.set(e.eraId, e);
      for (const e of evolutions) byId.set(e.eraId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_FIELD_MAX_ERA_EVOLUTIONS);
      state = { ...state, eraEvolutions: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertContinuityFields(
      fields: InstitutionalContinuityField[],
      now = Date.now()
    ): TemporalFieldStoreState {
      const byId = new Map<string, InstitutionalContinuityField>();
      for (const f of state.continuityFields) byId.set(f.continuityFieldId, f);
      for (const f of fields) byId.set(f.continuityFieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_FIELD_MAX_CONTINUITY_FIELDS);
      state = { ...state, continuityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertContinuitySignals(
      signals: LongHorizonContinuitySignal[],
      now = Date.now()
    ): TemporalFieldStoreState {
      const byId = new Map<string, LongHorizonContinuitySignal>();
      for (const s of state.continuitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_FIELD_MAX_SIGNALS);
      state = { ...state, continuitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): TemporalFieldStoreState {
      state = {
        timeFields: [],
        snapshots: [],
        longHorizonPatterns: [],
        strategicTemporalFields: [],
        eraEvolutions: [],
        continuityFields: [],
        continuitySignals: [],
        signature: buildStoreSignature({ timeFields: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createTemporalFieldStore>>();

export function getTemporalFieldStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createTemporalFieldStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetTemporalFieldStores(): void {
  storesByOrganization.clear();
}

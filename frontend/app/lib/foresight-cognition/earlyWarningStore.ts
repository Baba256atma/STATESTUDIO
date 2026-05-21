import { stableSignature } from "../intelligence/shared/dedupe";
import {
  EARLY_WARNING_MAX_INDICATORS,
  EARLY_WARNING_MAX_PATTERNS,
  EARLY_WARNING_MAX_PRECURSOR_FIELDS,
  EARLY_WARNING_MAX_SIGNALS,
  EARLY_WARNING_MAX_SNAPSHOTS,
} from "./earlyWarningGuards";
import type {
  EarlyWarningStoreState,
  EnterpriseEarlyWarningSnapshot,
  EscalationPrecursorField,
  OrganizationalWarningPattern,
  PreEscalationSignal,
  StrategicInstabilityIndicator,
} from "./earlyWarningTypes";

function mergePreEscalationSignals(
  existing: PreEscalationSignal,
  incoming: PreEscalationSignal
): PreEscalationSignal {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    warningSignals: Object.freeze(
      Array.from(new Set([...existing.warningSignals, ...incoming.warningSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    warningSeverity:
      incoming.confidence >= existing.confidence
        ? incoming.warningSeverity
        : existing.warningSeverity,
    escalationState:
      incoming.confidence >= existing.confidence
        ? incoming.escalationState
        : existing.escalationState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  preEscalationSignals: readonly PreEscalationSignal[];
}): string {
  return stableSignature([
    "d9-4-3-early-warning",
    state.preEscalationSignals.length,
    state.preEscalationSignals.slice(0, 3).map((s) => s.warningId),
  ]);
}

export function createEarlyWarningStore(initial?: EarlyWarningStoreState): {
  getState(): EarlyWarningStoreState;
  upsertPreEscalationSignals(
    signals: PreEscalationSignal[],
    now?: number
  ): EarlyWarningStoreState;
  upsertSnapshots(
    snapshots: EnterpriseEarlyWarningSnapshot[],
    now?: number
  ): EarlyWarningStoreState;
  upsertWarningPatterns(
    patterns: OrganizationalWarningPattern[],
    now?: number
  ): EarlyWarningStoreState;
  upsertPrecursorFields(
    fields: EscalationPrecursorField[],
    now?: number
  ): EarlyWarningStoreState;
  upsertInstabilityIndicators(
    indicators: StrategicInstabilityIndicator[],
    now?: number
  ): EarlyWarningStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): EarlyWarningStoreState;
} {
  let state: EarlyWarningStoreState = initial ?? {
    preEscalationSignals: [],
    snapshots: [],
    warningPatterns: [],
    precursorFields: [],
    instabilityIndicators: [],
    signature: buildStoreSignature({ preEscalationSignals: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): EarlyWarningStoreState {
      return {
        ...state,
        preEscalationSignals: state.preEscalationSignals.map((s) => ({ ...s })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        warningPatterns: state.warningPatterns.map((p) => ({ ...p })),
        precursorFields: state.precursorFields.map((f) => ({ ...f })),
        instabilityIndicators: state.instabilityIndicators.map((i) => ({ ...i })),
      };
    },

    upsertPreEscalationSignals(
      signals: PreEscalationSignal[],
      now = Date.now()
    ): EarlyWarningStoreState {
      const byId = new Map<string, PreEscalationSignal>();
      for (const s of state.preEscalationSignals) byId.set(s.warningId, s);
      for (const s of signals) {
        const existing = byId.get(s.warningId);
        byId.set(s.warningId, existing ? mergePreEscalationSignals(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, EARLY_WARNING_MAX_SIGNALS);
      state = {
        ...state,
        preEscalationSignals: Object.freeze(next),
        signature: buildStoreSignature({ preEscalationSignals: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseEarlyWarningSnapshot[],
      now = Date.now()
    ): EarlyWarningStoreState {
      const byId = new Map<string, EnterpriseEarlyWarningSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EARLY_WARNING_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertWarningPatterns(
      patterns: OrganizationalWarningPattern[],
      now = Date.now()
    ): EarlyWarningStoreState {
      const byId = new Map<string, OrganizationalWarningPattern>();
      for (const p of state.warningPatterns) byId.set(p.patternId, p);
      for (const p of patterns) byId.set(p.patternId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EARLY_WARNING_MAX_PATTERNS);
      state = { ...state, warningPatterns: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPrecursorFields(
      fields: EscalationPrecursorField[],
      now = Date.now()
    ): EarlyWarningStoreState {
      const byId = new Map<string, EscalationPrecursorField>();
      for (const f of state.precursorFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EARLY_WARNING_MAX_PRECURSOR_FIELDS);
      state = { ...state, precursorFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertInstabilityIndicators(
      indicators: StrategicInstabilityIndicator[],
      now = Date.now()
    ): EarlyWarningStoreState {
      const byId = new Map<string, StrategicInstabilityIndicator>();
      for (const i of state.instabilityIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EARLY_WARNING_MAX_INDICATORS);
      state = { ...state, instabilityIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): EarlyWarningStoreState {
      state = {
        preEscalationSignals: [],
        snapshots: [],
        warningPatterns: [],
        precursorFields: [],
        instabilityIndicators: [],
        signature: buildStoreSignature({ preEscalationSignals: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createEarlyWarningStore>>();

export function getEarlyWarningStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createEarlyWarningStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetEarlyWarningStores(): void {
  storesByOrganization.clear();
}

import { stableSignature } from "../intelligence/shared/dedupe";
import {
  ADAPTATION_RECOVERY_MAX_ADAPTATIONS,
  ADAPTATION_RECOVERY_MAX_PATTERNS,
  ADAPTATION_RECOVERY_MAX_RESILIENCE_OBS,
  ADAPTATION_RECOVERY_MAX_SIGNALS,
} from "./adaptationRecoveryGuards";
import type {
  AdaptationRecoveryStoreState,
  OrganizationalAdaptationRecord,
  RecoveryIntelligenceSignal,
  RecoveryStabilityLevel,
  ResilienceEvolutionObservation,
  StrategicRecoveryPattern,
} from "./adaptationRecoveryTypes";

function stabilityRank(level: RecoveryStabilityLevel): number {
  if (level === "highly_resilient") return 5;
  if (level === "resilient") return 4;
  if (level === "adaptive") return 3;
  if (level === "unstable") return 2;
  return 1;
}

function mergeAdaptations(
  existing: OrganizationalAdaptationRecord,
  incoming: OrganizationalAdaptationRecord
): OrganizationalAdaptationRecord {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    recoveryStability:
      stabilityRank(incoming.recoveryStability) > stabilityRank(existing.recoveryStability)
        ? incoming.recoveryStability
        : existing.recoveryStability,
    confidence: Math.max(existing.confidence, incoming.confidence),
    observations: Object.freeze(
      Array.from(new Set([...existing.observations, ...incoming.observations])).slice(0, 6)
    ),
    linkedMemoryIds: Object.freeze(
      Array.from(new Set([...existing.linkedMemoryIds, ...incoming.linkedMemoryIds])).slice(0, 8)
    ),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  adaptations: readonly OrganizationalAdaptationRecord[];
  patterns: readonly StrategicRecoveryPattern[];
}): string {
  return stableSignature([
    "d9-2-3-adaptation-recovery",
    state.adaptations.length,
    state.patterns.length,
    state.adaptations.slice(0, 3).map((a) => a.adaptationId),
  ]);
}

export function createAdaptationRecoveryStore(initial?: AdaptationRecoveryStoreState): {
  getState(): AdaptationRecoveryStoreState;
  upsertAdaptations(
    records: OrganizationalAdaptationRecord[],
    now?: number
  ): AdaptationRecoveryStoreState;
  upsertPatterns(
    patterns: StrategicRecoveryPattern[],
    now?: number
  ): AdaptationRecoveryStoreState;
  upsertSignals(signals: RecoveryIntelligenceSignal[], now?: number): AdaptationRecoveryStoreState;
  upsertResilienceObservations(
    observations: ResilienceEvolutionObservation[],
    now?: number
  ): AdaptationRecoveryStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): AdaptationRecoveryStoreState;
} {
  let state: AdaptationRecoveryStoreState = initial ?? {
    adaptations: [],
    patterns: [],
    signals: [],
    resilienceObservations: [],
    signature: buildStoreSignature({ adaptations: [], patterns: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): AdaptationRecoveryStoreState {
      return {
        ...state,
        adaptations: state.adaptations.map((a) => ({ ...a })),
        patterns: state.patterns.map((p) => ({ ...p })),
        signals: state.signals.map((s) => ({ ...s })),
        resilienceObservations: state.resilienceObservations.map((o) => ({ ...o })),
      };
    },

    upsertAdaptations(
      records: OrganizationalAdaptationRecord[],
      now = Date.now()
    ): AdaptationRecoveryStoreState {
      const byId = new Map<string, OrganizationalAdaptationRecord>();
      for (const a of state.adaptations) byId.set(a.adaptationId, a);
      for (const a of records) {
        const existing = byId.get(a.adaptationId);
        byId.set(a.adaptationId, existing ? mergeAdaptations(existing, a) : { ...a });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, ADAPTATION_RECOVERY_MAX_ADAPTATIONS);
      state = {
        ...state,
        adaptations: Object.freeze(next),
        signature: buildStoreSignature({ adaptations: next, patterns: state.patterns }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertPatterns(
      patterns: StrategicRecoveryPattern[],
      now = Date.now()
    ): AdaptationRecoveryStoreState {
      const byId = new Map<string, StrategicRecoveryPattern>();
      for (const p of state.patterns) byId.set(p.patternId, p);
      for (const p of patterns) {
        const existing = byId.get(p.patternId);
        if (!existing) {
          byId.set(p.patternId, { ...p });
          continue;
        }
        byId.set(p.patternId, {
          ...existing,
          lesson: p.lesson || existing.lesson,
          occurrenceCount: existing.occurrenceCount + 1,
          lastObservedAt: Math.max(existing.lastObservedAt, p.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, ADAPTATION_RECOVERY_MAX_PATTERNS);
      state = {
        ...state,
        patterns: Object.freeze(next),
        signature: buildStoreSignature({ adaptations: state.adaptations, patterns: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSignals(
      signals: RecoveryIntelligenceSignal[],
      now = Date.now()
    ): AdaptationRecoveryStoreState {
      const byId = new Map<string, RecoveryIntelligenceSignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADAPTATION_RECOVERY_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResilienceObservations(
      observations: ResilienceEvolutionObservation[],
      now = Date.now()
    ): AdaptationRecoveryStoreState {
      const byId = new Map<string, ResilienceEvolutionObservation>();
      for (const o of state.resilienceObservations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADAPTATION_RECOVERY_MAX_RESILIENCE_OBS);
      state = { ...state, resilienceObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): AdaptationRecoveryStoreState {
      state = {
        adaptations: [],
        patterns: [],
        signals: [],
        resilienceObservations: [],
        signature: buildStoreSignature({ adaptations: [], patterns: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createAdaptationRecoveryStore>>();

export function getAdaptationRecoveryStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createAdaptationRecoveryStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetAdaptationRecoveryStores(): void {
  storesByOrganization.clear();
}

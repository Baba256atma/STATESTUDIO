import { stableSignature } from "../intelligence/shared/dedupe";
import {
  OPERATIONAL_REPLAY_MAX_EVENTS,
  OPERATIONAL_REPLAY_MAX_FRAMES,
  OPERATIONAL_REPLAY_MAX_SCENARIOS,
  OPERATIONAL_REPLAY_MAX_SEQUENCES,
  OPERATIONAL_REPLAY_MAX_SNAPSHOTS,
} from "./operationalReplayGuards";
import type {
  EnterpriseReplayFrame,
  HistoricalScenarioReconstruction,
  OperationalReplaySequence,
  OperationalReplayStoreState,
  OrganizationalReplaySnapshot,
  StrategicReplayEvent,
} from "./operationalReplayTypes";

function mergeReplays(
  existing: OperationalReplaySequence,
  incoming: OperationalReplaySequence
): OperationalReplaySequence {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    replaySequence: Object.freeze(
      Array.from(new Set([...existing.replaySequence, ...incoming.replaySequence])).slice(0, 8)
    ),
    linkedTimelineIds: Object.freeze(
      Array.from(new Set([...existing.linkedTimelineIds, ...incoming.linkedTimelineIds])).slice(0, 6)
    ),
    linkedCausalChainIds: Object.freeze(
      Array.from(new Set([...existing.linkedCausalChainIds, ...incoming.linkedCausalChainIds])).slice(
        0,
        6
      )
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
  replays: readonly OperationalReplaySequence[];
  scenarios: readonly HistoricalScenarioReconstruction[];
}): string {
  return stableSignature([
    "d9-3-3-operational-replay",
    state.replays.length,
    state.scenarios.length,
    state.replays.slice(0, 3).map((r) => r.replayId),
  ]);
}

export function createOperationalReplayStore(initial?: OperationalReplayStoreState): {
  getState(): OperationalReplayStoreState;
  upsertReplays(
    replays: OperationalReplaySequence[],
    now?: number
  ): OperationalReplayStoreState;
  upsertScenarios(
    scenarios: HistoricalScenarioReconstruction[],
    now?: number
  ): OperationalReplayStoreState;
  upsertFrames(frames: EnterpriseReplayFrame[], now?: number): OperationalReplayStoreState;
  upsertSnapshots(
    snapshots: OrganizationalReplaySnapshot[],
    now?: number
  ): OperationalReplayStoreState;
  upsertStrategicEvents(
    events: StrategicReplayEvent[],
    now?: number
  ): OperationalReplayStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): OperationalReplayStoreState;
} {
  let state: OperationalReplayStoreState = initial ?? {
    replays: [],
    scenarios: [],
    frames: [],
    snapshots: [],
    strategicEvents: [],
    signature: buildStoreSignature({ replays: [], scenarios: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): OperationalReplayStoreState {
      return {
        ...state,
        replays: state.replays.map((r) => ({ ...r })),
        scenarios: state.scenarios.map((s) => ({ ...s })),
        frames: state.frames.map((f) => ({ ...f })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        strategicEvents: state.strategicEvents.map((e) => ({ ...e })),
      };
    },

    upsertReplays(
      replays: OperationalReplaySequence[],
      now = Date.now()
    ): OperationalReplayStoreState {
      const byId = new Map<string, OperationalReplaySequence>();
      for (const r of state.replays) byId.set(r.replayId, r);
      for (const r of replays) {
        const existing = byId.get(r.replayId);
        byId.set(r.replayId, existing ? mergeReplays(existing, r) : { ...r });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, OPERATIONAL_REPLAY_MAX_SEQUENCES);
      state = {
        ...state,
        replays: Object.freeze(next),
        signature: buildStoreSignature({ replays: next, scenarios: state.scenarios }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertScenarios(
      scenarios: HistoricalScenarioReconstruction[],
      now = Date.now()
    ): OperationalReplayStoreState {
      const byId = new Map<string, HistoricalScenarioReconstruction>();
      for (const s of state.scenarios) byId.set(s.scenarioId, s);
      for (const s of scenarios) {
        const existing = byId.get(s.scenarioId);
        if (!existing) {
          byId.set(s.scenarioId, { ...s });
          continue;
        }
        byId.set(s.scenarioId, {
          ...existing,
          narrative: s.narrative || existing.narrative,
          lastObservedAt: Math.max(existing.lastObservedAt, s.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, OPERATIONAL_REPLAY_MAX_SCENARIOS);
      state = {
        ...state,
        scenarios: Object.freeze(next),
        signature: buildStoreSignature({ replays: state.replays, scenarios: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertFrames(frames: EnterpriseReplayFrame[], now = Date.now()): OperationalReplayStoreState {
      const byId = new Map<string, EnterpriseReplayFrame>();
      for (const f of state.frames) byId.set(f.frameId, f);
      for (const f of frames) byId.set(f.frameId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, OPERATIONAL_REPLAY_MAX_FRAMES);
      state = { ...state, frames: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: OrganizationalReplaySnapshot[],
      now = Date.now()
    ): OperationalReplayStoreState {
      const byId = new Map<string, OrganizationalReplaySnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, OPERATIONAL_REPLAY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicEvents(
      events: StrategicReplayEvent[],
      now = Date.now()
    ): OperationalReplayStoreState {
      const byId = new Map<string, StrategicReplayEvent>();
      for (const e of state.strategicEvents) byId.set(e.eventId, e);
      for (const e of events) byId.set(e.eventId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.observedAt - a.observedAt)
        .slice(0, OPERATIONAL_REPLAY_MAX_EVENTS);
      state = { ...state, strategicEvents: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): OperationalReplayStoreState {
      state = {
        replays: [],
        scenarios: [],
        frames: [],
        snapshots: [],
        strategicEvents: [],
        signature: buildStoreSignature({ replays: [], scenarios: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createOperationalReplayStore>>();

export function getOperationalReplayStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createOperationalReplayStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetOperationalReplayStores(): void {
  storesByOrganization.clear();
}

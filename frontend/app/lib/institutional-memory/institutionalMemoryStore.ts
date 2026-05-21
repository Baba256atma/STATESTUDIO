import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_MEMORY_MAX_EVENTS,
  INSTITUTIONAL_MEMORY_MAX_EXPERIENCES,
  INSTITUTIONAL_MEMORY_MAX_RECORDS,
} from "./institutionalMemoryGuards";
import type {
  HistoricalOperationalEvent,
  InstitutionalMemoryRecord,
  InstitutionalMemoryStoreState,
  OrganizationalExperience,
} from "./institutionalMemoryTypes";

function recordKey(record: InstitutionalMemoryRecord): string {
  return record.memoryId;
}

function experienceKey(experience: OrganizationalExperience): string {
  return experience.experienceId;
}

function mergeMemoryRecords(
  existing: InstitutionalMemoryRecord,
  incoming: InstitutionalMemoryRecord
): InstitutionalMemoryRecord {
  return {
    ...existing,
    title: incoming.title || existing.title,
    summary: incoming.summary || existing.summary,
    severity:
      severityRank(incoming.severity) > severityRank(existing.severity)
        ? incoming.severity
        : existing.severity,
    observations: Object.freeze(
      Array.from(new Set([...existing.observations, ...incoming.observations])).slice(0, 8)
    ),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    recurrenceCount: existing.recurrenceCount + (incoming.recurrenceCount || 1),
  };
}

function severityRank(severity: InstitutionalMemoryRecord["severity"]): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function buildStoreSignature(
  records: readonly InstitutionalMemoryRecord[],
  experiences: readonly OrganizationalExperience[]
): string {
  return stableSignature([
    "d9-2-1-institutional-memory",
    records.length,
    experiences.length,
    records.slice(0, 4).map((r) => r.memoryId),
    experiences.slice(0, 2).map((e) => e.experienceId),
  ]);
}

export function createInstitutionalMemoryStore(
  initial?: InstitutionalMemoryStoreState
): {
  getState(): InstitutionalMemoryStoreState;
  upsertRecords(records: InstitutionalMemoryRecord[], now?: number): InstitutionalMemoryStoreState;
  upsertExperiences(experiences: OrganizationalExperience[], now?: number): InstitutionalMemoryStoreState;
  appendEvents(events: HistoricalOperationalEvent[], now?: number): InstitutionalMemoryStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InstitutionalMemoryStoreState;
} {
  let state: InstitutionalMemoryStoreState = initial ?? {
    records: [],
    experiences: [],
    events: [],
    signature: buildStoreSignature([], []),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InstitutionalMemoryStoreState {
      return {
        ...state,
        records: state.records.map((r) => ({ ...r, observations: [...r.observations] })),
        experiences: state.experiences.map((e) => ({ ...e, relatedMemoryIds: [...e.relatedMemoryIds] })),
        events: state.events.map((e) => ({ ...e })),
      };
    },

    upsertRecords(records: InstitutionalMemoryRecord[], now = Date.now()): InstitutionalMemoryStoreState {
      const byId = new Map<string, InstitutionalMemoryRecord>();
      for (const record of state.records) byId.set(recordKey(record), record);
      for (const record of records) {
        const key = recordKey(record);
        const existing = byId.get(key);
        byId.set(key, existing ? mergeMemoryRecords(existing, record) : { ...record });
      }
      const nextRecords = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_MEMORY_MAX_RECORDS);
      state = {
        ...state,
        records: Object.freeze(nextRecords),
        signature: buildStoreSignature(nextRecords, state.experiences),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertExperiences(
      experiences: OrganizationalExperience[],
      now = Date.now()
    ): InstitutionalMemoryStoreState {
      const byId = new Map<string, OrganizationalExperience>();
      for (const experience of state.experiences) byId.set(experienceKey(experience), experience);
      for (const experience of experiences) {
        const key = experienceKey(experience);
        const existing = byId.get(key);
        if (!existing) {
          byId.set(key, { ...experience });
          continue;
        }
        byId.set(key, {
          ...existing,
          summary: experience.summary || existing.summary,
          severity:
            severityRank(experience.severity) > severityRank(existing.severity)
              ? experience.severity
              : existing.severity,
          relatedMemoryIds: Object.freeze(
            Array.from(new Set([...existing.relatedMemoryIds, ...experience.relatedMemoryIds]))
          ),
          lastObservedAt: Math.max(existing.lastObservedAt, experience.lastObservedAt),
          occurrenceCount: existing.occurrenceCount + 1,
        });
      }
      const nextExperiences = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_MEMORY_MAX_EXPERIENCES);
      state = {
        ...state,
        experiences: Object.freeze(nextExperiences),
        signature: buildStoreSignature(state.records, nextExperiences),
        updatedAt: now,
      };
      return this.getState();
    },

    appendEvents(events: HistoricalOperationalEvent[], now = Date.now()): InstitutionalMemoryStoreState {
      const merged = [...state.events, ...events]
        .sort((a, b) => b.observedAt - a.observedAt)
        .slice(0, INSTITUTIONAL_MEMORY_MAX_EVENTS);
      state = {
        ...state,
        events: Object.freeze(merged),
        updatedAt: now,
      };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InstitutionalMemoryStoreState {
      state = {
        records: [],
        experiences: [],
        events: [],
        signature: buildStoreSignature([], []),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createInstitutionalMemoryStore>>();

export function getInstitutionalMemoryStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalMemoryStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalMemoryStores(): void {
  storesByOrganization.clear();
}

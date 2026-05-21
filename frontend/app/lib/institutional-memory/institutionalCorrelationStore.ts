import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_CORRELATION_MAX_CORRELATIONS,
  INSTITUTIONAL_CORRELATION_MAX_LINKS,
  INSTITUTIONAL_CORRELATION_MAX_PATTERNS,
  INSTITUTIONAL_CORRELATION_MAX_SEQUENCES,
} from "./institutionalCorrelationGuards";
import type {
  CorrelatedOperationalSequence,
  InstitutionalCorrelation,
  InstitutionalCorrelationStoreState,
  OrganizationalLearningPattern,
  StrategicExperienceLink,
} from "./institutionalCorrelationTypes";

function buildStoreSignature(state: {
  correlations: readonly InstitutionalCorrelation[];
  patterns: readonly OrganizationalLearningPattern[];
  links: readonly StrategicExperienceLink[];
}): string {
  return stableSignature([
    "d9-2-2-correlation-store",
    state.correlations.length,
    state.patterns.length,
    state.links.length,
    state.correlations.slice(0, 3).map((c) => c.correlationId),
  ]);
}

function mergeCorrelations(
  existing: InstitutionalCorrelation,
  incoming: InstitutionalCorrelation
): InstitutionalCorrelation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    strength:
      strengthRank(incoming.strength) > strengthRank(existing.strength)
        ? incoming.strength
        : existing.strength,
    linkedExperiences: Object.freeze(
      Array.from(new Set([...existing.linkedExperiences, ...incoming.linkedExperiences])).slice(0, 8)
    ),
    observations: Object.freeze(
      Array.from(new Set([...existing.observations, ...incoming.observations])).slice(0, 6)
    ),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function strengthRank(strength: InstitutionalCorrelation["strength"]): number {
  if (strength === "systemic") return 4;
  if (strength === "strong") return 3;
  if (strength === "moderate") return 2;
  return 1;
}

export function createInstitutionalCorrelationStore(
  initial?: InstitutionalCorrelationStoreState
): {
  getState(): InstitutionalCorrelationStoreState;
  upsertCorrelations(
    correlations: InstitutionalCorrelation[],
    now?: number
  ): InstitutionalCorrelationStoreState;
  upsertLinks(links: StrategicExperienceLink[], now?: number): InstitutionalCorrelationStoreState;
  upsertPatterns(
    patterns: OrganizationalLearningPattern[],
    now?: number
  ): InstitutionalCorrelationStoreState;
  upsertSequences(
    sequences: CorrelatedOperationalSequence[],
    now?: number
  ): InstitutionalCorrelationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InstitutionalCorrelationStoreState;
} {
  let state: InstitutionalCorrelationStoreState = initial ?? {
    correlations: [],
    links: [],
    patterns: [],
    sequences: [],
    signature: buildStoreSignature({ correlations: [], patterns: [], links: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InstitutionalCorrelationStoreState {
      return {
        ...state,
        correlations: state.correlations.map((c) => ({ ...c })),
        links: state.links.map((l) => ({ ...l })),
        patterns: state.patterns.map((p) => ({ ...p })),
        sequences: state.sequences.map((s) => ({ ...s })),
      };
    },

    upsertCorrelations(
      correlations: InstitutionalCorrelation[],
      now = Date.now()
    ): InstitutionalCorrelationStoreState {
      const byId = new Map<string, InstitutionalCorrelation>();
      for (const c of state.correlations) byId.set(c.correlationId, c);
      for (const c of correlations) {
        const existing = byId.get(c.correlationId);
        byId.set(c.correlationId, existing ? mergeCorrelations(existing, c) : { ...c });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_CORRELATION_MAX_CORRELATIONS);
      state = {
        ...state,
        correlations: Object.freeze(next),
        signature: buildStoreSignature({ correlations: next, patterns: state.patterns, links: state.links }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertLinks(links: StrategicExperienceLink[], now = Date.now()): InstitutionalCorrelationStoreState {
      const byId = new Map<string, StrategicExperienceLink>();
      for (const l of state.links) byId.set(l.linkId, l);
      for (const l of links) byId.set(l.linkId, l);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_CORRELATION_MAX_LINKS);
      state = {
        ...state,
        links: Object.freeze(next),
        signature: buildStoreSignature({ correlations: state.correlations, patterns: state.patterns, links: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertPatterns(
      patterns: OrganizationalLearningPattern[],
      now = Date.now()
    ): InstitutionalCorrelationStoreState {
      const byId = new Map<string, OrganizationalLearningPattern>();
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
          strength:
            strengthRank(p.strength) > strengthRank(existing.strength) ? p.strength : existing.strength,
          correlationIds: Object.freeze(
            Array.from(new Set([...existing.correlationIds, ...p.correlationIds]))
          ),
          linkedMemoryIds: Object.freeze(
            Array.from(new Set([...existing.linkedMemoryIds, ...p.linkedMemoryIds]))
          ),
          lastObservedAt: Math.max(existing.lastObservedAt, p.lastObservedAt),
          occurrenceCount: existing.occurrenceCount + 1,
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_CORRELATION_MAX_PATTERNS);
      state = {
        ...state,
        patterns: Object.freeze(next),
        signature: buildStoreSignature({ correlations: state.correlations, patterns: next, links: state.links }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSequences(
      sequences: CorrelatedOperationalSequence[],
      now = Date.now()
    ): InstitutionalCorrelationStoreState {
      const byId = new Map<string, CorrelatedOperationalSequence>();
      for (const s of state.sequences) byId.set(s.sequenceId, s);
      for (const s of sequences) byId.set(s.sequenceId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_CORRELATION_MAX_SEQUENCES);
      state = { ...state, sequences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InstitutionalCorrelationStoreState {
      state = {
        correlations: [],
        links: [],
        patterns: [],
        sequences: [],
        signature: buildStoreSignature({ correlations: [], patterns: [], links: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createInstitutionalCorrelationStore>>();

export function getInstitutionalCorrelationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalCorrelationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalCorrelationStores(): void {
  storesByOrganization.clear();
}

import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_CONTINUITY_MAX_ANCHORS,
  INSTITUTIONAL_CONTINUITY_MAX_ARTIFACTS,
  INSTITUTIONAL_CONTINUITY_MAX_RECORDS,
  INSTITUTIONAL_CONTINUITY_MAX_SIGNALS,
  continuityRank,
} from "./institutionalContinuityGuards";
import type {
  ExecutiveWisdomPreservationSignal,
  InstitutionalContinuityStoreState,
  InstitutionalKnowledgeAnchor,
  InstitutionalWisdomArtifact,
  StrategicKnowledgeContinuityRecord,
} from "./institutionalContinuityTypes";

function mergeArtifacts(
  existing: InstitutionalWisdomArtifact,
  incoming: InstitutionalWisdomArtifact
): InstitutionalWisdomArtifact {
  return {
    ...existing,
    title: incoming.title || existing.title,
    summary: incoming.summary || existing.summary,
    continuityLevel:
      continuityRank(incoming.continuityLevel) > continuityRank(existing.continuityLevel)
        ? incoming.continuityLevel
        : existing.continuityLevel,
    confidence: Math.max(existing.confidence, incoming.confidence),
    supportingPatterns: Object.freeze(
      Array.from(new Set([...existing.supportingPatterns, ...incoming.supportingPatterns])).slice(
        0,
        6
      )
    ),
    linkedAnchorIds: Object.freeze(
      Array.from(new Set([...existing.linkedAnchorIds, ...incoming.linkedAnchorIds])).slice(0, 6)
    ),
    lastPreservedAt: Math.max(existing.lastPreservedAt, incoming.lastPreservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  artifacts: readonly InstitutionalWisdomArtifact[];
  knowledgeAnchors: readonly InstitutionalKnowledgeAnchor[];
}): string {
  return stableSignature([
    "d9-2-8-continuity",
    state.artifacts.length,
    state.knowledgeAnchors.length,
    state.artifacts.slice(0, 3).map((a) => a.wisdomArtifactId),
  ]);
}

export function createInstitutionalContinuityStore(initial?: InstitutionalContinuityStoreState): {
  getState(): InstitutionalContinuityStoreState;
  upsertArtifacts(
    artifacts: InstitutionalWisdomArtifact[],
    now?: number
  ): InstitutionalContinuityStoreState;
  upsertContinuityRecords(
    records: StrategicKnowledgeContinuityRecord[],
    now?: number
  ): InstitutionalContinuityStoreState;
  upsertPreservationSignals(
    signals: ExecutiveWisdomPreservationSignal[],
    now?: number
  ): InstitutionalContinuityStoreState;
  upsertKnowledgeAnchors(
    anchors: InstitutionalKnowledgeAnchor[],
    now?: number
  ): InstitutionalContinuityStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InstitutionalContinuityStoreState;
} {
  let state: InstitutionalContinuityStoreState = initial ?? {
    artifacts: [],
    continuityRecords: [],
    preservationSignals: [],
    knowledgeAnchors: [],
    signature: buildStoreSignature({ artifacts: [], knowledgeAnchors: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InstitutionalContinuityStoreState {
      return {
        ...state,
        artifacts: state.artifacts.map((a) => ({ ...a })),
        continuityRecords: state.continuityRecords.map((r) => ({ ...r })),
        preservationSignals: state.preservationSignals.map((s) => ({ ...s })),
        knowledgeAnchors: state.knowledgeAnchors.map((a) => ({ ...a })),
      };
    },

    upsertArtifacts(
      artifacts: InstitutionalWisdomArtifact[],
      now = Date.now()
    ): InstitutionalContinuityStoreState {
      const byId = new Map<string, InstitutionalWisdomArtifact>();
      for (const a of state.artifacts) byId.set(a.wisdomArtifactId, a);
      for (const a of artifacts) {
        const existing = byId.get(a.wisdomArtifactId);
        byId.set(a.wisdomArtifactId, existing ? mergeArtifacts(existing, a) : { ...a });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastPreservedAt - a.lastPreservedAt)
        .slice(0, INSTITUTIONAL_CONTINUITY_MAX_ARTIFACTS);
      state = {
        ...state,
        artifacts: Object.freeze(next),
        signature: buildStoreSignature({ artifacts: next, knowledgeAnchors: state.knowledgeAnchors }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertContinuityRecords(
      records: StrategicKnowledgeContinuityRecord[],
      now = Date.now()
    ): InstitutionalContinuityStoreState {
      const byId = new Map<string, StrategicKnowledgeContinuityRecord>();
      for (const r of state.continuityRecords) byId.set(r.continuityRecordId, r);
      for (const r of records) {
        const existing = byId.get(r.continuityRecordId);
        if (!existing) {
          byId.set(r.continuityRecordId, { ...r });
          continue;
        }
        byId.set(r.continuityRecordId, {
          ...existing,
          lesson: r.lesson || existing.lesson,
          occurrenceCount: existing.occurrenceCount + 1,
          lastPreservedAt: Math.max(existing.lastPreservedAt, r.lastPreservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastPreservedAt - a.lastPreservedAt)
        .slice(0, INSTITUTIONAL_CONTINUITY_MAX_RECORDS);
      state = { ...state, continuityRecords: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPreservationSignals(
      signals: ExecutiveWisdomPreservationSignal[],
      now = Date.now()
    ): InstitutionalContinuityStoreState {
      const byId = new Map<string, ExecutiveWisdomPreservationSignal>();
      for (const s of state.preservationSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_CONTINUITY_MAX_SIGNALS);
      state = { ...state, preservationSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertKnowledgeAnchors(
      anchors: InstitutionalKnowledgeAnchor[],
      now = Date.now()
    ): InstitutionalContinuityStoreState {
      const byId = new Map<string, InstitutionalKnowledgeAnchor>();
      for (const a of state.knowledgeAnchors) byId.set(a.anchorId, a);
      for (const a of anchors) {
        const existing = byId.get(a.anchorId);
        if (!existing) {
          byId.set(a.anchorId, { ...a });
          continue;
        }
        byId.set(a.anchorId, {
          ...existing,
          wisdomSummary: a.wisdomSummary || existing.wisdomSummary,
          lastAnchoredAt: Math.max(existing.lastAnchoredAt, a.lastAnchoredAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastAnchoredAt - a.lastAnchoredAt)
        .slice(0, INSTITUTIONAL_CONTINUITY_MAX_ANCHORS);
      state = {
        ...state,
        knowledgeAnchors: Object.freeze(next),
        signature: buildStoreSignature({ artifacts: state.artifacts, knowledgeAnchors: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InstitutionalContinuityStoreState {
      state = {
        artifacts: [],
        continuityRecords: [],
        preservationSignals: [],
        knowledgeAnchors: [],
        signature: buildStoreSignature({ artifacts: [], knowledgeAnchors: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInstitutionalContinuityStore>
>();

export function getInstitutionalContinuityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalContinuityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalContinuityStores(): void {
  storesByOrganization.clear();
}

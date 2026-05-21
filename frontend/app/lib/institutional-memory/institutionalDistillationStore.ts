import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_DISTILLATION_MAX_ARTIFACTS,
  INSTITUTIONAL_DISTILLATION_MAX_INSIGHTS,
  INSTITUTIONAL_DISTILLATION_MAX_SUMMARIES,
  INSTITUTIONAL_DISTILLATION_MAX_WISDOM,
} from "./institutionalDistillationGuards";
import type {
  DistilledInstitutionalInsight,
  ExecutiveLearningSummary,
  InstitutionalDistillationStoreState,
  OrganizationalWisdomPattern,
  StrategicKnowledgeArtifact,
} from "./institutionalDistillationTypes";

function compressionRank(level: DistilledInstitutionalInsight["compressionLevel"]): number {
  const ranks: Record<DistilledInstitutionalInsight["compressionLevel"], number> = {
    raw: 1,
    summarized: 2,
    condensed: 3,
    distilled: 4,
    strategic_core: 5,
  };
  return ranks[level];
}

function mergeInsights(
  existing: DistilledInstitutionalInsight,
  incoming: DistilledInstitutionalInsight
): DistilledInstitutionalInsight {
  return {
    ...existing,
    title: incoming.title || existing.title,
    summary: incoming.summary || existing.summary,
    compressionLevel:
      compressionRank(incoming.compressionLevel) > compressionRank(existing.compressionLevel)
        ? incoming.compressionLevel
        : existing.compressionLevel,
    confidence: Math.max(existing.confidence, incoming.confidence),
    supportingPatterns: Object.freeze(
      Array.from(new Set([...existing.supportingPatterns, ...incoming.supportingPatterns])).slice(
        0,
        6
      )
    ),
    linkedMemoryIds: Object.freeze(
      Array.from(new Set([...existing.linkedMemoryIds, ...incoming.linkedMemoryIds])).slice(0, 8)
    ),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  insights: readonly DistilledInstitutionalInsight[];
  wisdomPatterns: readonly OrganizationalWisdomPattern[];
}): string {
  return stableSignature([
    "d9-2-5-distillation",
    state.insights.length,
    state.wisdomPatterns.length,
    state.insights.slice(0, 3).map((i) => i.distilledInsightId),
  ]);
}

export function createInstitutionalDistillationStore(
  initial?: InstitutionalDistillationStoreState
): {
  getState(): InstitutionalDistillationStoreState;
  upsertInsights(
    insights: DistilledInstitutionalInsight[],
    now?: number
  ): InstitutionalDistillationStoreState;
  upsertArtifacts(
    artifacts: StrategicKnowledgeArtifact[],
    now?: number
  ): InstitutionalDistillationStoreState;
  upsertSummaries(
    summaries: ExecutiveLearningSummary[],
    now?: number
  ): InstitutionalDistillationStoreState;
  upsertWisdomPatterns(
    patterns: OrganizationalWisdomPattern[],
    now?: number
  ): InstitutionalDistillationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InstitutionalDistillationStoreState;
} {
  let state: InstitutionalDistillationStoreState = initial ?? {
    insights: [],
    artifacts: [],
    summaries: [],
    wisdomPatterns: [],
    signature: buildStoreSignature({ insights: [], wisdomPatterns: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InstitutionalDistillationStoreState {
      return {
        ...state,
        insights: state.insights.map((i) => ({ ...i })),
        artifacts: state.artifacts.map((a) => ({ ...a })),
        summaries: state.summaries.map((s) => ({ ...s })),
        wisdomPatterns: state.wisdomPatterns.map((p) => ({ ...p })),
      };
    },

    upsertInsights(
      insights: DistilledInstitutionalInsight[],
      now = Date.now()
    ): InstitutionalDistillationStoreState {
      const byId = new Map<string, DistilledInstitutionalInsight>();
      for (const i of state.insights) byId.set(i.distilledInsightId, i);
      for (const i of insights) {
        const existing = byId.get(i.distilledInsightId);
        byId.set(i.distilledInsightId, existing ? mergeInsights(existing, i) : { ...i });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_DISTILLATION_MAX_INSIGHTS);
      state = {
        ...state,
        insights: Object.freeze(next),
        signature: buildStoreSignature({ insights: next, wisdomPatterns: state.wisdomPatterns }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertArtifacts(
      artifacts: StrategicKnowledgeArtifact[],
      now = Date.now()
    ): InstitutionalDistillationStoreState {
      const byId = new Map<string, StrategicKnowledgeArtifact>();
      for (const a of state.artifacts) byId.set(a.artifactId, a);
      for (const a of artifacts) {
        const existing = byId.get(a.artifactId);
        if (!existing) {
          byId.set(a.artifactId, { ...a });
          continue;
        }
        byId.set(a.artifactId, {
          ...existing,
          lesson: a.lesson || existing.lesson,
          occurrenceCount: existing.occurrenceCount + 1,
          lastObservedAt: Math.max(existing.lastObservedAt, a.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_DISTILLATION_MAX_ARTIFACTS);
      state = { ...state, artifacts: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSummaries(
      summaries: ExecutiveLearningSummary[],
      now = Date.now()
    ): InstitutionalDistillationStoreState {
      const byId = new Map<string, ExecutiveLearningSummary>();
      for (const s of state.summaries) byId.set(s.summaryId, s);
      for (const s of summaries) byId.set(s.summaryId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_DISTILLATION_MAX_SUMMARIES);
      state = { ...state, summaries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertWisdomPatterns(
      patterns: OrganizationalWisdomPattern[],
      now = Date.now()
    ): InstitutionalDistillationStoreState {
      const byId = new Map<string, OrganizationalWisdomPattern>();
      for (const p of state.wisdomPatterns) byId.set(p.patternId, p);
      for (const p of patterns) {
        const existing = byId.get(p.patternId);
        if (!existing) {
          byId.set(p.patternId, { ...p });
          continue;
        }
        byId.set(p.patternId, {
          ...existing,
          wisdom: p.wisdom || existing.wisdom,
          confidence: Math.max(existing.confidence, p.confidence),
          occurrenceCount: existing.occurrenceCount + 1,
          lastObservedAt: Math.max(existing.lastObservedAt, p.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_DISTILLATION_MAX_WISDOM);
      state = {
        ...state,
        wisdomPatterns: Object.freeze(next),
        signature: buildStoreSignature({ insights: state.insights, wisdomPatterns: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InstitutionalDistillationStoreState {
      state = {
        insights: [],
        artifacts: [],
        summaries: [],
        wisdomPatterns: [],
        signature: buildStoreSignature({ insights: [], wisdomPatterns: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInstitutionalDistillationStore>
>();

export function getInstitutionalDistillationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalDistillationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalDistillationStores(): void {
  storesByOrganization.clear();
}

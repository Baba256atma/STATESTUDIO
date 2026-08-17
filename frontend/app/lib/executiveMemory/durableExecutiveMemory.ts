/** DM:1–6 canonical durable-memory facade over the existing APP-4 authority. */
import { createExecutiveMemoryRecord, type ExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import { createExecutiveMemoryHeader, createExecutiveMemoryBody, createExecutiveMemoryMetadata, createExecutiveMemoryVersion, createExecutiveMemoryBusinessContext } from "./executiveMemoryMetadata.ts";
import { createExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import { createExecutiveMemoryReference, type ExecutiveMemoryReferenceType } from "./executiveMemoryReference.ts";
import { createExecutiveMemoryDecision } from "./executiveMemoryDecision.ts";
import { createExecutiveMemoryOutcome, createExecutiveMemoryLessonLearned } from "./executiveMemoryEvidence.ts";
import { createExecutiveMemory, updateExecutiveMemory, archiveExecutiveMemory, getExecutiveMemories, getExecutiveMemoryById, initializeExecutiveMemoryStorageEngine } from "./executiveMemoryStorageEngine.ts";
import { registerExecutiveMemoryProvider, isExecutiveMemoryRegistered } from "./executiveMemoryPlatform.ts";
import type { ExecutiveMemoryCategory } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";

export const durableExecutiveMemoryIdentity = "DM:1-6/DurableExecutiveMemory" as const;
export const durableExecutiveMemoryVersion = "1.0.0" as const;
export const durableExecutiveMemoryNamespace = "nexora.executive-memory.durable" as const;
export const DURABLE_EXECUTIVE_MEMORY_BOUNDARY = Object.freeze({ storesConversationTranscript: false, storesSessionContext: false, ownsCurrentExecutionTruth: false, proactiveMonitoring: false, externalIntegrations: false, persistenceAuthority: "APP-4/ExecutiveMemoryStorageEngine", retrievalAuthority: "APP-4/ExecutiveMemoryRetrieval", advisorRole: "historical-context-only" });
const DURABLE_CATEGORIES: readonly DurableExecutiveMemoryKind[] = Object.freeze(["goal", "problem", "risk_reference", "scenario", "decision", "decision_rationale", "execution", "outcome", "learning", "business_context"]);

export function initializeDurableExecutiveMemory(timestamp: string) {
  if (!isExecutiveMemoryRegistered("durable-executive-memory")) registerExecutiveMemoryProvider({ providerId: "durable-executive-memory", label: "Durable Executive Memory", version: durableExecutiveMemoryVersion, supportedCategories: DURABLE_CATEGORIES }, timestamp);
  return initializeExecutiveMemoryStorageEngine(timestamp, "local_storage");
}

export type DurableExecutiveMemoryKind = "goal" | "problem" | "risk_reference" | "scenario" | "decision" | "decision_rationale" | "execution" | "outcome" | "learning" | "business_context";
export type DurableExecutiveMemoryWriteInput = {
  readonly id: string; readonly workspaceId: string; readonly kind: DurableExecutiveMemoryKind;
  readonly title: string; readonly summary: string; readonly narrative: string; readonly status: string;
  readonly source: string; readonly owner: string; readonly confidence: number | null;
  readonly createdAt: string; readonly updatedAt: string;
  readonly subjectReferences: readonly { readonly type: ExecutiveMemoryReferenceType; readonly targetId: string; readonly label: string }[];
  readonly provenance: readonly string[]; readonly decision?: { readonly decisionId: string; readonly rationale: string; readonly status: "proposed" | "approved" | "rejected" | "deferred" | "executed" | "archived" };
  readonly outcome?: { readonly outcomeId: string; readonly description: string; readonly achieved: boolean | null; readonly measuredAt: string | null };
  readonly lesson?: { readonly lessonId: string; readonly summary: string; readonly context: string };
  readonly context?: { readonly contextId: string; readonly domain: string; readonly description: string };
};
export function createCanonicalDurableExecutiveMemory(input: DurableExecutiveMemoryWriteInput): ExecutiveMemoryRecord {
  if (input.provenance.length === 0 || input.subjectReferences.length === 0) throw new Error("durable-memory-provenance-and-subject-required");
  const references = input.subjectReferences.map((ref, i) => createExecutiveMemoryReference({ referenceId: `${input.id}:ref:${i}`, referenceType: ref.type, targetId: ref.targetId, label: ref.label, module: input.source, workspaceId: input.workspaceId }));
  const category = input.kind as ExecutiveMemoryCategory;
  const metadata = createExecutiveMemoryMetadata({ memoryId: input.id, workspaceId: input.workspaceId, category, owner: input.owner, sourceModule: input.source, references, customMetadata: { status: input.status, provenance: input.provenance.join("|") } });
  return createExecutiveMemoryRecord({ id: input.id, providerId: "durable-executive-memory", workspaceId: input.workspaceId, category,
    header: createExecutiveMemoryHeader({ title: input.title, summary: input.summary, owner: input.owner, sourceModule: input.source }),
    body: createExecutiveMemoryBody({ narrative: input.narrative, keyPoints: [] }), references, metadata,
    confidence: createExecutiveMemoryConfidence({ confidenceId: `${input.id}:confidence`, score: input.confidence, level: input.confidence == null ? "unknown" : input.confidence >= .8 ? "high" : input.confidence >= .5 ? "medium" : "low", source: input.source, explanation: "Persisted source confidence.", calculationMethod: "source-supplied" }),
    decision: input.decision ? createExecutiveMemoryDecision({ ...input.decision, title: input.title, decidedAt: input.updatedAt, decidedBy: input.owner }) : null,
    outcomes: input.outcome ? [createExecutiveMemoryOutcome({ outcomeId: input.outcome.outcomeId, label: input.title, description: input.outcome.description, achieved: input.outcome.achieved, measuredAt: input.outcome.measuredAt })] : [],
    lessonsLearned: input.lesson ? [createExecutiveMemoryLessonLearned({ ...input.lesson, capturedAt: input.updatedAt })] : [],
    businessContext: input.context ? createExecutiveMemoryBusinessContext({ ...input.context, businessUnit: null, department: null, market: null }) : null,
    createdAt: input.createdAt, updatedAt: input.updatedAt, version: createExecutiveMemoryVersion({ versionId: `${input.id}:v1`, schemaVersion: "1.0.0", contractVersion: "APP-4/2", semanticVersion: "1.0.0", createdAt: input.createdAt }) });
}

export const persistDurableExecutiveMemory = (input: DurableExecutiveMemoryWriteInput) => createExecutiveMemory(createCanonicalDurableExecutiveMemory(input), input.createdAt);
export const updateDurableExecutiveMemory = (id: string, input: { summary?: string; narrative?: string; status?: string }, timestamp: string) => updateExecutiveMemory(id, { header: input.summary ? { summary: input.summary } : undefined, body: input.narrative ? { narrative: input.narrative } : undefined, metadata: input.status ? { customMetadata: { status: input.status } } : undefined }, timestamp);
export const archiveDurableExecutiveMemory = archiveExecutiveMemory;
export function supersedeDurableExecutiveMemory(input: { readonly obsoleteId: string; readonly replacement: DurableExecutiveMemoryWriteInput; readonly timestamp: string }) {
  const obsolete = getExecutiveMemoryById(input.obsoleteId);
  if (!obsolete || obsolete.lifecycle !== "active") return Object.freeze({ success: false, reason: "obsolete-memory-not-active" });
  if (getExecutiveMemoryById(input.replacement.id)) return Object.freeze({ success: false, reason: "replacement-memory-already-exists" });
  const created = createExecutiveMemory(createCanonicalDurableExecutiveMemory(input.replacement), input.timestamp);
  if (!created.success) return Object.freeze({ success: false, reason: created.reason });
  updateExecutiveMemory(input.obsoleteId, { metadata: { customMetadata: { ...obsolete.record.metadata.customMetadata, status: "superseded", supersededBy: input.replacement.id } } }, input.timestamp);
  const archived = archiveExecutiveMemory(input.obsoleteId, input.timestamp);
  return Object.freeze({ success: archived.success, reason: archived.success ? "memory-superseded" : archived.reason });
}

export type DurableExecutiveMemoryRetrievalContext = { readonly workspaceId: string; readonly currentSubjectId: string; readonly relatedSubjectIds?: readonly string[]; readonly limit?: number };
export function retrieveRelevantDurableExecutiveMemory(context: DurableExecutiveMemoryRetrievalContext): readonly ExecutiveMemoryStoredRecord[] {
  const ids = new Set([context.currentSubjectId, ...(context.relatedSubjectIds ?? [])]);
  return Object.freeze(getExecutiveMemories({ workspaceId: context.workspaceId, lifecycle: "active" }).map((stored) => {
    const refs = stored.record.references.map((r) => r.targetId); const direct = refs.includes(context.currentSubjectId);
    const related = refs.filter((id) => ids.has(id)).length; const category = stored.record.category;
    const chainWeight = category === "decision" || category === "decision_rationale" ? 4 : category === "outcome" || category === "learning" ? 3 : category === "scenario" || category === "execution" ? 2 : 1;
    return { stored, score: (direct ? 100 : 0) + related * 10 + chainWeight };
  }).filter((x) => x.score > 1).sort((a, b) => b.score - a.score || b.stored.record.updatedAt.localeCompare(a.stored.record.updatedAt) || a.stored.record.id.localeCompare(b.stored.record.id)).slice(0, Math.min(context.limit ?? 6, 12)).map((x) => x.stored));
}

export type DurableExecutiveAdvisorMemoryContext = { readonly currentFacts: readonly string[]; readonly historicalMemories: readonly { readonly memoryId: string; readonly summary: string; readonly source: string; readonly confidence: number | null; readonly provenance: readonly string[] }[]; readonly conflicts: readonly { readonly memoryIds: readonly string[]; readonly reason: "conflicting-historical-accounts" }[]; readonly boundary: "current-facts-override-history" };
export function buildDurableExecutiveAdvisorMemoryContext(input: DurableExecutiveMemoryRetrievalContext & { readonly currentFacts: readonly string[] }): DurableExecutiveAdvisorMemoryContext {
  const historicalMemories = retrieveRelevantDurableExecutiveMemory(input).map(({ record }) => Object.freeze({ memoryId: record.id, summary: record.header.summary, source: record.header.sourceModule, confidence: record.confidence?.score ?? null, provenance: Object.freeze((record.metadata.customMetadata.provenance ?? "").split("|").filter(Boolean)) }));
  const conflicts = historicalMemories.length > 1 && new Set(historicalMemories.map((m) => m.summary)).size > 1
    ? [Object.freeze({ memoryIds: Object.freeze(historicalMemories.map((m) => m.memoryId)), reason: "conflicting-historical-accounts" as const })]
    : [];
  return Object.freeze({ currentFacts: Object.freeze([...input.currentFacts]), historicalMemories: Object.freeze(historicalMemories), conflicts: Object.freeze(conflicts), boundary: "current-facts-override-history" });
}

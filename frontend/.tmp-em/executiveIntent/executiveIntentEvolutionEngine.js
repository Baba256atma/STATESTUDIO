/**
 * APP-3:9 — Executive Intent Evolution & Lineage Engine.
 * Read-only immutable history analysis — no rewriting or recommendations.
 */
import { EXECUTIVE_INTENT_CONTRACT_VERSION } from "./executiveIntentConstants.ts";
import { createIntentEvolutionDiagnostic, } from "./executiveIntentEvolutionDiagnostics.ts";
import { buildEvolutionEvents, buildEvolutionRevisions, buildEvolutionTimelineFromParts, buildLineageGraph, collectEvolutionRulesApplied, extractExplicitLineageEdges, hasBrokenLineage, hasMultipleParents, resolveActiveIntentId, resolveAncestors as resolveAncestorsFromEdges, resolveDescendants as resolveDescendantsFromEdges, resolveIntentVersionForRecord, resolveMergeHistory as resolveMergeHistoryFromRecords, resolveReplacementHistory, resolveSplitHistory as resolveSplitHistoryFromRecords, resolveSiblingIntentIds, } from "./executiveIntentEvolutionRules.ts";
import { EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION } from "./executiveIntentSemanticTypes.ts";
import { createIntentEvolutionRecord, createIntentEvolutionResult, EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION, } from "./executiveIntentEvolutionTypes.ts";
export const EXECUTIVE_INTENT_EVOLUTION_ENGINE_OWNER = "executive-intent-evolution";
export const EXECUTIVE_INTENT_EVOLUTION_ENGINE_TAGS = Object.freeze([
    "[APP3_9]",
    "[EXECUTIVE_INTENT_EVOLUTION]",
    "[LINEAGE_ENGINE]",
    "[IMMUTABLE_HISTORY]",
    "[READ_ONLY]",
    "[ARCHITECTURE_SAFE]",
    "[BACKWARD_COMPATIBLE]",
]);
export const EXECUTIVE_INTENT_EVOLUTION_ENGINE_RULES = Object.freeze({
    deterministic: true,
    pure: true,
    noSideEffects: true,
    noGlobalState: true,
    noStorage: true,
    noMutation: true,
    noHistoryRewrite: true,
    noRecommendations: true,
    readOnly: true,
});
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
function pushDiagnostic(diagnostics, code, message, timestamp, options = Object.freeze({})) {
    diagnostics.push(createIntentEvolutionDiagnostic(code, message, timestamp, options));
}
function buildIntent(input) {
    const createdAt = input.createdAt ?? "2026-01-01T00:00:00.000Z";
    const updatedAt = input.updatedAt ?? createdAt;
    const metadata = Object.freeze({
        intentId: input.intentId,
        title: input.title,
        summary: input.title,
        description: input.title,
        createdAt,
        updatedAt,
        version: Object.freeze({
            versionId: `version-${input.intentId}`,
            semanticVersion: input.semanticVersion,
            createdAt,
            readOnly: true,
        }),
        owner: "executive-owner",
        workspaceId: input.workspaceId ?? "ws-example-001",
        tags: Object.freeze([]),
        priority: "medium",
        status: input.status ?? "active",
        scope: Object.freeze({
            scope: "enterprise",
            scopeRef: null,
            label: "Enterprise",
            readOnly: true,
        }),
        category: "strategic",
        source: "executive",
        lifecycle: input.lifecycle ?? "activated",
        references: input.references ?? Object.freeze([]),
        assumptions: Object.freeze([]),
        constraints: Object.freeze([]),
        dependencies: Object.freeze([]),
        evidence: Object.freeze([]),
        confidenceReference: null,
        conflictReference: null,
        customMetadata: Object.freeze(input.customMetadata ?? {}),
        readOnly: true,
    });
    return Object.freeze({
        intentId: input.intentId,
        workspaceId: metadata.workspaceId,
        metadata,
        relations: Object.freeze(input.relations ?? []),
        readOnly: true,
        contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
    });
}
function recordFromIntent(intent) {
    return createIntentEvolutionRecord({
        intent,
        semanticModelId: null,
        classificationId: null,
        dependencyResultId: null,
    });
}
export function buildEvolutionExampleSet(exampleId) {
    switch (exampleId) {
        case "simple-revision":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-v2",
                records: Object.freeze([
                    recordFromIntent(buildIntent({
                        intentId: "intent-v1",
                        title: "Increase profit v1",
                        semanticVersion: "1.0.0",
                        lifecycle: "archived",
                        status: "archived",
                    })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-v2",
                        title: "Increase profit v2",
                        semanticVersion: "2.0.0",
                        relations: Object.freeze([
                            Object.freeze({
                                relationId: "rel-sup-1",
                                sourceIntentId: "intent-v2",
                                targetIntentId: "intent-v1",
                                relationType: "supersedes",
                                readOnly: true,
                            }),
                        ]),
                    })),
                ]),
            });
        case "version-chain":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-v3",
                records: Object.freeze([
                    recordFromIntent(buildIntent({ intentId: "intent-v1", title: "Goal v1", semanticVersion: "1.0.0", status: "archived", lifecycle: "archived" })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-v2",
                        title: "Goal v2",
                        semanticVersion: "2.0.0",
                        status: "archived",
                        lifecycle: "archived",
                        relations: Object.freeze([
                            Object.freeze({
                                relationId: "rel-1",
                                sourceIntentId: "intent-v2",
                                targetIntentId: "intent-v1",
                                relationType: "supersedes",
                                readOnly: true,
                            }),
                        ]),
                    })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-v3",
                        title: "Goal v3",
                        semanticVersion: "3.0.0",
                        relations: Object.freeze([
                            Object.freeze({
                                relationId: "rel-2",
                                sourceIntentId: "intent-v3",
                                targetIntentId: "intent-v2",
                                relationType: "supersedes",
                                readOnly: true,
                            }),
                        ]),
                    })),
                ]),
            });
        case "split-strategy":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-split-a",
                records: Object.freeze([
                    recordFromIntent(buildIntent({ intentId: "intent-parent", title: "Unified strategy", semanticVersion: "1.0.0" })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-split-a",
                        title: "Branch A",
                        semanticVersion: "1.1.0",
                        customMetadata: Object.freeze({ "lineage.splitFrom": "intent-parent" }),
                    })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-split-b",
                        title: "Branch B",
                        semanticVersion: "1.2.0",
                        customMetadata: Object.freeze({ "lineage.splitFrom": "intent-parent" }),
                    })),
                ]),
            });
        case "merge-strategy":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-merged",
                records: Object.freeze([
                    recordFromIntent(buildIntent({ intentId: "intent-merge-a", title: "Strategy A", semanticVersion: "1.0.0" })),
                    recordFromIntent(buildIntent({ intentId: "intent-merge-b", title: "Strategy B", semanticVersion: "1.0.0" })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-merged",
                        title: "Merged strategy",
                        semanticVersion: "2.0.0",
                        customMetadata: Object.freeze({
                            "lineage.mergedFrom": "intent-merge-a,intent-merge-b",
                        }),
                    })),
                ]),
            });
        case "replacement":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-replacement",
                records: Object.freeze([
                    recordFromIntent(buildIntent({
                        intentId: "intent-original",
                        title: "Original objective",
                        semanticVersion: "1.0.0",
                        status: "archived",
                        lifecycle: "archived",
                    })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-replacement",
                        title: "Replacement objective",
                        semanticVersion: "1.0.0",
                        customMetadata: Object.freeze({ "lineage.replacedIntentId": "intent-original" }),
                    })),
                ]),
            });
        case "archived-branch":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-archived",
                records: Object.freeze([
                    recordFromIntent(buildIntent({ intentId: "intent-root", title: "Root strategy", semanticVersion: "1.0.0" })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-archived",
                        title: "Archived branch",
                        semanticVersion: "1.1.0",
                        status: "archived",
                        lifecycle: "archived",
                        relations: Object.freeze([
                            Object.freeze({
                                relationId: "rel-arch",
                                sourceIntentId: "intent-root",
                                targetIntentId: "intent-archived",
                                relationType: "parent",
                                readOnly: true,
                            }),
                        ]),
                    })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-active-branch",
                        title: "Active branch",
                        semanticVersion: "1.2.0",
                        relations: Object.freeze([
                            Object.freeze({
                                relationId: "rel-active",
                                sourceIntentId: "intent-root",
                                targetIntentId: "intent-active-branch",
                                relationType: "parent",
                                readOnly: true,
                            }),
                        ]),
                    })),
                ]),
            });
        case "parallel-branches":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-branch-a",
                records: Object.freeze([
                    recordFromIntent(buildIntent({ intentId: "intent-root", title: "Root", semanticVersion: "1.0.0" })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-branch-a",
                        title: "Branch A",
                        semanticVersion: "1.1.0",
                        relations: Object.freeze([
                            Object.freeze({
                                relationId: "rel-a",
                                sourceIntentId: "intent-root",
                                targetIntentId: "intent-branch-a",
                                relationType: "parent",
                                readOnly: true,
                            }),
                        ]),
                    })),
                    recordFromIntent(buildIntent({
                        intentId: "intent-branch-b",
                        title: "Branch B",
                        semanticVersion: "1.1.0",
                        relations: Object.freeze([
                            Object.freeze({
                                relationId: "rel-b",
                                sourceIntentId: "intent-root",
                                targetIntentId: "intent-branch-b",
                                relationType: "parent",
                                readOnly: true,
                            }),
                        ]),
                    })),
                ]),
            });
        case "root-intent":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-root-only",
                records: Object.freeze([
                    recordFromIntent(buildIntent({
                        intentId: "intent-root-only",
                        title: "Standalone root intent",
                        semanticVersion: "1.0.0",
                        lifecycle: "created",
                    })),
                ]),
            });
        case "broken-lineage":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-broken-child",
                records: Object.freeze([
                    recordFromIntent(buildIntent({
                        intentId: "intent-broken-child",
                        title: "Broken child",
                        semanticVersion: "1.0.0",
                        customMetadata: Object.freeze({ "lineage.splitFrom": "intent-missing-parent" }),
                    })),
                ]),
            });
        case "unknown-history":
            return Object.freeze({
                exampleId,
                focusIntentId: "intent-unknown",
                records: Object.freeze([
                    recordFromIntent(buildIntent({
                        intentId: "intent-unknown",
                        title: "Unknown history intent",
                        semanticVersion: "0.0.0",
                        lifecycle: "created",
                        status: "draft",
                    })),
                ]),
            });
        default:
            return null;
    }
}
export function resolveIntentVersion(record, lineage) {
    return resolveIntentVersionForRecord(record, record.intent.intentId === lineage.activeIntentId);
}
export function resolveRootIntent(lineage) {
    return lineage.rootIntentId;
}
export function resolveActiveIntent(records, lineage) {
    return lineage.activeIntentId ?? resolveActiveIntentId(records, [lineage.focusIntentId]);
}
export function buildIntentLineage(request) {
    const edges = extractExplicitLineageEdges(request.records);
    return buildLineageGraph({
        workspaceId: request.workspaceId,
        focusIntentId: request.focusIntentId,
        records: request.records,
        edges,
    });
}
export function buildEvolutionTimeline(request, lineage) {
    const edges = lineage.edges;
    const events = buildEvolutionEvents(request.records, edges, request.focusIntentId, request.timestamp);
    const revisions = buildEvolutionRevisions(events, request.records);
    return buildEvolutionTimelineFromParts({
        focusIntentId: request.focusIntentId,
        events,
        revisions,
    });
}
export function resolveAncestors(focusIntentId, records) {
    const edges = extractExplicitLineageEdges(records);
    return resolveAncestorsFromEdges(focusIntentId, edges);
}
export function resolveDescendants(focusIntentId, records) {
    const edges = extractExplicitLineageEdges(records);
    return resolveDescendantsFromEdges(focusIntentId, edges);
}
export function resolveMergeHistory(records) {
    return resolveMergeHistoryFromRecords(records);
}
export function resolveSplitHistory(records) {
    return resolveSplitHistoryFromRecords(records);
}
export function buildEvolutionSummary(input) {
    return Object.freeze({
        headline: `Lineage for ${input.lineage.focusIntentId} with ${input.timeline.events.length} evolution event(s).`,
        focusIntentId: input.lineage.focusIntentId,
        rootIntentId: input.lineage.rootIntentId,
        activeIntentId: input.lineage.activeIntentId,
        versionCount: input.lineage.versions.length,
        eventCount: input.timeline.events.length,
        ancestorCount: input.lineage.ancestors.length,
        descendantCount: input.lineage.descendants.length,
        readOnly: true,
    });
}
export function resolveEvolutionFlags(input) {
    const hasParent = input.lineage.ancestors.length > 0;
    const hasChildren = input.lineage.descendants.length > 0;
    const hasHistory = hasParent || hasChildren || input.lineage.versions.length > 1;
    const merged = input.merges.some((entry) => entry.targetIntentId === input.focusIntentId);
    const split = input.splits.some((entry) => entry.childIntentIds.includes(input.focusIntentId));
    const superseded = input.lineage.ancestors.some((entry) => entry.relationship === "ancestor");
    const rootIntent = input.lineage.rootIntentId === input.focusIntentId;
    const leafIntent = !hasChildren;
    const activeVersion = input.lineage.activeIntentId === input.focusIntentId;
    return Object.freeze({
        hasHistory,
        hasParent,
        hasChildren,
        merged,
        split,
        superseded,
        rootIntent,
        leafIntent,
        activeVersion,
        futureCompatible: true,
        readOnly: true,
        deterministic: true,
    });
}
export function buildIntentEvolution(request) {
    const diagnostics = [];
    const edges = extractExplicitLineageEdges(request.records);
    const lineage = buildLineageGraph({
        workspaceId: request.workspaceId,
        focusIntentId: request.focusIntentId,
        records: request.records,
        edges,
    });
    const timeline = buildEvolutionTimeline(request, lineage);
    const merges = resolveMergeHistoryFromRecords(request.records);
    const splits = resolveSplitHistoryFromRecords(request.records);
    const replacements = resolveReplacementHistory(request.records, edges);
    const flags = resolveEvolutionFlags({
        lineage,
        merges,
        splits,
        focusIntentId: request.focusIntentId,
    });
    const summary = buildEvolutionSummary({ lineage, timeline });
    const rulesApplied = collectEvolutionRulesApplied(edges, timeline.events);
    if (!flags.hasHistory) {
        pushDiagnostic(diagnostics, "no_evolution", "No explicit evolution history detected.", request.timestamp);
    }
    if (flags.rootIntent) {
        pushDiagnostic(diagnostics, "root_intent", "Focus intent is lineage root.", request.timestamp);
    }
    if (flags.activeVersion) {
        pushDiagnostic(diagnostics, "active_version", "Focus intent is active version.", request.timestamp);
    }
    if (flags.merged) {
        pushDiagnostic(diagnostics, "merged", "Merge history detected.", request.timestamp);
    }
    if (flags.split) {
        pushDiagnostic(diagnostics, "split", "Split history detected.", request.timestamp);
    }
    if (replacements.length > 0) {
        pushDiagnostic(diagnostics, "replaced", "Replacement history detected.", request.timestamp);
    }
    if (timeline.events.some((event) => event.kind === "superseded")) {
        pushDiagnostic(diagnostics, "superseded", "Superseded intent detected.", request.timestamp);
    }
    if (timeline.events.some((event) => event.kind === "versioned")) {
        pushDiagnostic(diagnostics, "new_version", "New version detected in chain.", request.timestamp);
    }
    if (hasMultipleParents(request.focusIntentId, edges)) {
        pushDiagnostic(diagnostics, "multiple_parents", "Multiple parent intents detected.", request.timestamp);
    }
    if (hasBrokenLineage(edges)) {
        pushDiagnostic(diagnostics, "broken_lineage", "Broken lineage reference detected.", request.timestamp);
    }
    if (timeline.events.some((event) => event.kind === "unknown")) {
        pushDiagnostic(diagnostics, "unknown_history", "Unknown evolution history.", request.timestamp);
    }
    if (lineage.descendants.length >= 2 && !flags.merged) {
        pushDiagnostic(diagnostics, "parallel_branch", "Parallel branch lineage detected.", request.timestamp);
    }
    const siblings = resolveSiblingIntentIds(request.focusIntentId, edges);
    if (siblings.length > 0) {
        pushDiagnostic(diagnostics, "parallel_branch", "Parallel sibling branch detected.", request.timestamp);
    }
    if (request.records.some((record) => record.intent.metadata.status === "archived")) {
        pushDiagnostic(diagnostics, "archived_branch", "Archived branch present in lineage.", request.timestamp);
    }
    pushDiagnostic(diagnostics, "evolution_timeline_ready", "Evolution timeline is ready.", request.timestamp);
    let status = "complete";
    if (hasBrokenLineage(edges))
        status = "broken";
    else if (timeline.events.some((event) => event.kind === "unknown"))
        status = "unknown";
    else if (request.records.some((record) => !record.semanticModelId) && request.records.length === 1) {
        status = "partial";
    }
    if (status === "complete" || status === "partial") {
        pushDiagnostic(diagnostics, "lineage_complete", "Lineage analysis complete.", request.timestamp);
        pushDiagnostic(diagnostics, "evolution_detection_success", "Evolution detection completed.", request.timestamp);
    }
    const resultId = deterministicId("evolution-result", `${request.workspaceId}:${request.focusIntentId}:${request.timestamp}`);
    return createIntentEvolutionResult({
        resultId,
        workspaceId: request.workspaceId,
        status,
        focusIntentId: request.focusIntentId,
        lineage,
        timeline,
        merges,
        splits,
        replacements,
        flags,
        diagnostics: Object.freeze([...diagnostics]),
        summary,
        metadata: Object.freeze({
            evolutionEngineVersion: EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION,
            contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
            semanticModelVersion: EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION,
            rulesApplied,
            recordCount: request.records.length,
            readOnly: true,
        }),
        timestamp: request.timestamp,
    });
}
export function validateLineage(result) {
    const issues = [];
    if (result.readOnly !== true)
        issues.push("Evolution result must be read-only.");
    if (result.flags.readOnly !== true)
        issues.push("Evolution flags must be read-only.");
    if (result.lineage.readOnly !== true)
        issues.push("Lineage must be read-only.");
    if (result.metadata.evolutionEngineVersion !== EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION) {
        issues.push("Unexpected evolution engine version.");
    }
    if (result.lineage.focusIntentId !== result.focusIntentId) {
        issues.push("Lineage focus must match result focus.");
    }
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
        readOnly: true,
    });
}
export function buildEvolutionProbe(generatedAt = new Date(0).toISOString()) {
    const exampleSet = buildEvolutionExampleSet("version-chain");
    if (!exampleSet) {
        throw new Error("Evolution probe example unavailable.");
    }
    return buildIntentEvolution(Object.freeze({
        workspaceId: "ws-example-001",
        records: exampleSet.records,
        focusIntentId: exampleSet.focusIntentId,
        timestamp: generatedAt,
        readOnly: true,
    }));
}
export function getExecutiveIntentEvolutionEngineVersionMetadata() {
    return Object.freeze({
        evolutionEngineVersion: EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION,
        owner: EXECUTIVE_INTENT_EVOLUTION_ENGINE_OWNER,
    });
}
export const ExecutiveIntentEvolutionEngine = Object.freeze({
    buildIntentEvolution,
    buildIntentLineage,
    resolveIntentVersion,
    resolveRootIntent,
    resolveActiveIntent,
    resolveAncestors,
    resolveDescendants,
    resolveMergeHistory,
    resolveSplitHistory,
    buildEvolutionTimeline,
    buildEvolutionSummary,
    validateLineage,
    buildEvolutionProbe,
    buildEvolutionExampleSet,
    version: EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION,
    rules: EXECUTIVE_INTENT_EVOLUTION_ENGINE_RULES,
    tags: EXECUTIVE_INTENT_EVOLUTION_ENGINE_TAGS,
});

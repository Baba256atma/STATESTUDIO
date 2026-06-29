/**
 * APP-3:8 — Executive Intent Dependency Engine.
 * Read-only dependency graph analysis — no resolution or scheduling.
 */
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { detectIntentConflicts } from "./executiveIntentConflictEngine.ts";
import { createIntentConflictAnalysisInput } from "./executiveIntentConflictTypes.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { createIntentDependencyDiagnostic, } from "./executiveIntentDependencyDiagnostics.ts";
import { getIntentDependencyCanonicalExample } from "./executiveIntentDependencyExamples.ts";
import { buildDependencyEdges, buildDependencyNodes, collectDependencyRulesApplied, deduplicateDependencies, detectDependencyCycles, detectIndirectDependencies, detectPairDependencies, findConflictPair, highestDependencyStrength, pairDependencyKey, sortDependencies, } from "./executiveIntentDependencyRules.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";
import { EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION } from "./executiveIntentSemanticTypes.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION } from "./executiveIntentClassificationTypes.ts";
import { EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION } from "./executiveIntentConflictTypes.ts";
import { EXECUTIVE_INTENT_STATE_ENGINE_VERSION } from "./executiveIntentStateTypes.ts";
import { createIntentDependencyAnalysisInput, createIntentDependencyResult, EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION, } from "./executiveIntentDependencyTypes.ts";
export const EXECUTIVE_INTENT_DEPENDENCY_ENGINE_OWNER = "executive-intent-dependency";
export const EXECUTIVE_INTENT_DEPENDENCY_ENGINE_TAGS = Object.freeze([
    "[APP3_8]",
    "[EXECUTIVE_INTENT_DEPENDENCY]",
    "[DEPENDENCY_ENGINE]",
    "[DEPENDENCY_GRAPH]",
    "[READ_ONLY]",
    "[ARCHITECTURE_SAFE]",
    "[BACKWARD_COMPATIBLE]",
]);
export const EXECUTIVE_INTENT_DEPENDENCY_ENGINE_RULES = Object.freeze({
    deterministic: true,
    pure: true,
    noSideEffects: true,
    noGlobalState: true,
    noStorage: true,
    noMutation: true,
    noResolution: true,
    noScheduling: true,
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
    diagnostics.push(createIntentDependencyDiagnostic(code, message, timestamp, options));
}
function toBundle(input) {
    return Object.freeze({
        semanticModel: input.semanticModel,
        classification: input.classification,
        state: input.state,
    });
}
export function resolveDependencyCategory(dependency) {
    return dependency.category;
}
export function resolveDependencyStrength(dependency) {
    return dependency.strength;
}
export function resolveDependencyFlags(input) {
    const directional = input.dependencies.filter((entry) => !entry.bidirectional && entry.category !== "parallel");
    const hasDependencies = directional.length > 0;
    const prerequisiteIds = new Set(directional.map((entry) => entry.prerequisiteReference.semanticModelId));
    const dependentIds = new Set(directional.map((entry) => entry.dependentReference.semanticModelId));
    const hasDependents = dependentIds.size > 0;
    const cycles = detectDependencyCycles(input.graph.edges);
    const sharedPrerequisite = input.dependencies.some((entry) => entry.category === "shared_prerequisite" || entry.category === "constraint");
    const independentIntent = input.intentCount >= 2 && !hasDependencies && !sharedPrerequisite;
    const requiresPrerequisite = input.dependencies.some((entry) => ["critical", "strong"].includes(entry.strength) && !entry.bidirectional);
    return Object.freeze({
        hasDependencies,
        hasDependents,
        circularDependency: cycles.length > 0,
        sharedPrerequisite,
        independentIntent,
        requiresPrerequisite,
        futureCompatible: true,
        readOnly: true,
        deterministic: true,
    });
}
export function buildDependencySummary(input) {
    const highestStrength = highestDependencyStrength(input.dependencies);
    const independent = input.dependencies.length === 0;
    const headline = independent
        ? "No executive intent dependencies detected."
        : `${input.dependencies.length} dependency relationship(s) across ${input.graph.nodes.length} intent(s).`;
    return Object.freeze({
        headline,
        dependencyCount: input.dependencies.length,
        edgeCount: input.graph.edges.length,
        nodeCount: input.graph.nodes.length,
        highestStrength,
        independent,
        readOnly: true,
    });
}
export function buildDependencyMatrix(input) {
    const pairs = [];
    const pairIndex = {};
    for (let dependentIndex = 0; dependentIndex < input.intents.length; dependentIndex += 1) {
        for (let prerequisiteIndex = 0; prerequisiteIndex < input.intents.length; prerequisiteIndex += 1) {
            if (dependentIndex === prerequisiteIndex)
                continue;
            const dependent = input.intents[dependentIndex];
            const prerequisite = input.intents[prerequisiteIndex];
            const conflictPair = findConflictPair(input.batchConflictResult, dependent.semanticModel.modelId, prerequisite.semanticModel.modelId);
            const dependencies = detectPairDependencies({
                dependent: toBundle(dependent),
                prerequisite: toBundle(prerequisite),
                conflictPair,
            });
            const key = pairDependencyKey(dependent.semanticModel.modelId, prerequisite.semanticModel.modelId);
            const pairId = deterministicId("dependency-pair", key);
            pairs.push(Object.freeze({
                pairId,
                dependentSemanticModelId: dependent.semanticModel.modelId,
                prerequisiteSemanticModelId: prerequisite.semanticModel.modelId,
                dependencies,
                independent: dependencies.length === 0,
                readOnly: true,
            }));
            pairIndex[dependent.semanticModel.modelId] = [
                ...(pairIndex[dependent.semanticModel.modelId] ?? []),
                pairId,
            ];
        }
    }
    pairs.sort((left, right) => left.pairId.localeCompare(right.pairId));
    const matrixId = deterministicId("dependency-matrix", `${input.workspaceId}:${input.intents.map((entry) => entry.semanticModel.modelId).join("|")}`);
    return Object.freeze({
        pairs: Object.freeze(pairs),
        matrix: Object.freeze({
            matrixId,
            workspaceId: input.workspaceId,
            intentCount: input.intents.length,
            pairs: Object.freeze(pairs),
            pairIndex: Object.freeze(Object.fromEntries(Object.entries(pairIndex).map(([modelId, pairIds]) => [
                modelId,
                Object.freeze([...pairIds].sort()),
            ]))),
            readOnly: true,
        }),
    });
}
export function buildDependencyGraph(input) {
    const bundles = input.intents.map(toBundle);
    const nodes = buildDependencyNodes(bundles);
    const edges = buildDependencyEdges(nodes, input.dependencies);
    const graphId = deterministicId("dependency-graph", `${input.workspaceId}:${nodes.map((node) => node.nodeId).join("|")}`);
    return Object.freeze({
        graphId,
        workspaceId: input.workspaceId,
        nodes,
        edges,
        nodeIndex: Object.freeze(Object.fromEntries(nodes.map((node) => [node.semanticModelId, node.nodeId]))),
        readOnly: true,
    });
}
export function detectIntentDependency(dependent, prerequisite, batchConflictResult = null, timestamp = dependent.semanticModel.timestamp) {
    return detectIntentDependencies(Object.freeze({
        workspaceId: dependent.semanticModel.workspaceId,
        intents: Object.freeze([dependent, prerequisite]),
        batchConflictResult,
        timestamp,
        readOnly: true,
    }));
}
export function detectIntentDependencies(request) {
    const diagnostics = [];
    const timestamp = request.timestamp;
    if (request.intents.length < 2) {
        pushDiagnostic(diagnostics, "dependency_detection_incomplete", "At least two intents are required for dependency detection.", timestamp);
    }
    const batchConflict = request.batchConflictResult ??
        (request.intents.length >= 2
            ? detectIntentConflicts(Object.freeze({
                workspaceId: request.workspaceId,
                intents: request.intents.map((entry) => createIntentConflictAnalysisInput({
                    semanticModel: entry.semanticModel,
                    classification: entry.classification,
                    state: entry.state,
                })),
                timestamp,
                readOnly: true,
            }))
            : null);
    const { pairs, matrix } = buildDependencyMatrix({
        workspaceId: request.workspaceId,
        intents: request.intents,
        batchConflictResult: batchConflict,
        timestamp,
    });
    let dependencies = sortDependencies(deduplicateDependencies(pairs.flatMap((pair) => [...pair.dependencies])));
    const bundles = request.intents.map(toBundle);
    const nodes = buildDependencyNodes(bundles);
    const indirect = detectIndirectDependencies(dependencies, nodes);
    dependencies = sortDependencies(deduplicateDependencies([...dependencies, ...indirect]));
    const graph = buildDependencyGraph({
        workspaceId: request.workspaceId,
        intents: request.intents,
        dependencies,
        timestamp,
    });
    const flags = resolveDependencyFlags({
        dependencies,
        graph,
        intentCount: request.intents.length,
    });
    if (dependencies.length === 0 && request.intents.length >= 2) {
        pushDiagnostic(diagnostics, "no_dependency", "No dependencies detected between intents.", timestamp);
    }
    if (dependencies.length > 1) {
        pushDiagnostic(diagnostics, "multiple_dependencies", `${dependencies.length} dependencies detected.`, timestamp);
    }
    for (const dependency of dependencies) {
        const codeMap = {
            direct: "direct_dependency",
            indirect: "indirect_dependency",
            blocking: "blocking_dependency",
            enabling: "enabling_dependency",
            sequential: "sequential_dependency",
            parallel: "parallel_dependency",
            shared_prerequisite: "shared_prerequisite",
            unknown: "unknown_dependency",
        };
        const code = codeMap[dependency.category] ?? "direct_dependency";
        pushDiagnostic(diagnostics, code, dependency.summary, timestamp, {
            explanation: dependency.explanation,
            metadata: Object.freeze({ dependencyId: dependency.dependencyId, ruleId: dependency.ruleId }),
        });
    }
    if (flags.circularDependency) {
        pushDiagnostic(diagnostics, "circular_dependency", "Circular dependency detected in intent graph.", timestamp);
    }
    if (flags.sharedPrerequisite) {
        pushDiagnostic(diagnostics, "shared_prerequisite", "Shared prerequisite relationship detected.", timestamp);
    }
    const summary = buildDependencySummary({ dependencies, graph });
    const rulesApplied = collectDependencyRulesApplied(dependencies);
    let status = "ready";
    if (dependencies.length === 0 && request.intents.length >= 2)
        status = "independent";
    if (dependencies.some((entry) => entry.category === "unknown"))
        status = "unknown";
    if (request.intents.some((entry) => entry.semanticModel.flags.incompleteObjective)) {
        status = status === "independent" ? "partial" : status;
    }
    pushDiagnostic(diagnostics, "dependency_graph_ready", "Dependency graph is ready.", timestamp);
    pushDiagnostic(diagnostics, "dependency_detection_success", "Dependency detection completed.", timestamp);
    const resultId = deterministicId("dependency-result", `${request.workspaceId}:${graph.graphId}:${timestamp}`);
    return createIntentDependencyResult({
        resultId,
        workspaceId: request.workspaceId,
        status,
        dependencies,
        graph,
        matrix,
        flags,
        diagnostics: Object.freeze([...diagnostics]),
        summary,
        metadata: Object.freeze({
            dependencyEngineVersion: EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION,
            semanticModelVersion: EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION,
            classificationEngineVersion: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION,
            conflictEngineVersion: EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION,
            stateEngineVersion: EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
            rulesApplied,
            intentCount: request.intents.length,
            readOnly: true,
        }),
        timestamp,
    });
}
export function validateDependencyGraph(result) {
    const issues = [];
    if (result.readOnly !== true)
        issues.push("Dependency result must be read-only.");
    if (result.flags.readOnly !== true)
        issues.push("Dependency flags must be read-only.");
    if (result.flags.deterministic !== true)
        issues.push("Dependency detection must be deterministic.");
    if (result.metadata.dependencyEngineVersion !== EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION) {
        issues.push("Unexpected dependency engine version.");
    }
    if (result.graph.nodes.length !== result.metadata.intentCount) {
        issues.push("Graph node count must match intent count.");
    }
    for (const edge of result.graph.edges) {
        const fromExists = result.graph.nodes.some((node) => node.nodeId === edge.fromNodeId);
        const toExists = result.graph.nodes.some((node) => node.nodeId === edge.toNodeId);
        if (!fromExists || !toExists)
            issues.push("Graph edge references unknown node.");
    }
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
        readOnly: true,
    });
}
function buildAnalysisInputFromText(text, workspaceId, owner, languageCode, generatedAt) {
    const extraction = extractExecutiveIntent(Object.freeze({ text, workspaceId, owner, languageCode, generatedAt }));
    const semantic = buildExecutiveIntentSemanticModel(extraction, generatedAt);
    const classification = classifyExecutiveIntent(semantic.model, generatedAt);
    const state = extraction.primaryIntent
        ? resolveExecutiveIntentStateResult(Object.freeze({
            intent: extraction.primaryIntent,
            intentId: extraction.primaryIntent.intentId,
            workspaceId,
            evaluatedAt: generatedAt,
            proposedLifecycleTransition: null,
        }))
        : null;
    return createIntentDependencyAnalysisInput({
        semanticModel: semantic.model,
        classification,
        conflictResult: null,
        state,
    });
}
export function buildDependencyExample(exampleId, workspaceId = "ws-example-001", owner = "executive-owner", generatedAt = new Date(0).toISOString()) {
    const example = getIntentDependencyCanonicalExample(exampleId);
    if (!example)
        return null;
    const dependent = buildAnalysisInputFromText(example.dependentText, workspaceId, owner, example.languageCode, generatedAt);
    const prerequisite = buildAnalysisInputFromText(example.prerequisiteText, workspaceId, owner, example.languageCode, generatedAt);
    return detectIntentDependency(dependent, prerequisite, null, generatedAt);
}
export function buildDependencyProbe(generatedAt = new Date(0).toISOString()) {
    const dependent = buildAnalysisInputFromText("Expand market share by 15% this year.", "ws-example-001", "executive-owner", "en", generatedAt);
    const prerequisite = buildAnalysisInputFromText("Hire 50 engineers for the project by Q3.", "ws-example-001", "executive-owner", "en", generatedAt);
    return detectIntentDependency(dependent, prerequisite, null, generatedAt);
}
export function getExecutiveIntentDependencyEngineVersionMetadata() {
    return Object.freeze({
        dependencyEngineVersion: EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION,
        owner: EXECUTIVE_INTENT_DEPENDENCY_ENGINE_OWNER,
    });
}
export const ExecutiveIntentDependencyEngine = Object.freeze({
    detectIntentDependencies,
    detectIntentDependency,
    buildDependencyGraph,
    buildDependencyMatrix,
    resolveDependencyCategory,
    resolveDependencyStrength,
    resolveDependencyFlags,
    validateDependencyGraph,
    buildDependencySummary,
    buildDependencyExample,
    buildDependencyProbe,
    getExecutiveIntentDependencyEngineVersionMetadata,
    version: EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION,
    rules: EXECUTIVE_INTENT_DEPENDENCY_ENGINE_RULES,
    tags: EXECUTIVE_INTENT_DEPENDENCY_ENGINE_TAGS,
});

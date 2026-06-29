/**
 * APP-3:8 — Executive Intent dependency detection rules.
 * Deterministic relationship analysis — no scheduling or recommendations.
 */
export const EXECUTIVE_INTENT_DEPENDENCY_RULES_VERSION = "APP-3/8-RULES-1";
export const DEPENDENCY_RULE_IDS = Object.freeze([
    "RULE_EXPLICIT_DEPENDS_ON",
    "RULE_EXPLICIT_BLOCKS",
    "RULE_SEQUENTIAL_TIME",
    "RULE_ENABLING_RESOURCE",
    "RULE_COMPLIANCE_BEFORE_RELEASE",
    "RULE_TECHNOLOGY_BEFORE_DEPLOYMENT",
    "RULE_FUNDING_BEFORE_GROWTH",
    "RULE_SHARED_PREREQUISITE",
    "RULE_SHARED_BUSINESS_OBJECT",
    "RULE_BLOCKING_CONFLICT",
    "RULE_STRATEGIC_SEQUENCE",
    "RULE_OPERATIONAL_ENABLEMENT",
    "RULE_PARALLEL_INDEPENDENT",
    "RULE_INDIRECT_CHAIN",
    "RULE_UNKNOWN_DEPENDENCY",
]);
export const DEPENDENCY_STRENGTH_ORDER = Object.freeze([
    "none",
    "weak",
    "moderate",
    "strong",
    "critical",
    "unknown",
]);
export const DEPENDENCY_CATEGORY_ORDER = Object.freeze([
    "direct",
    "blocking",
    "sequential",
    "enabling",
    "compliance",
    "technology",
    "strategic",
    "resource",
    "operational",
    "shared_prerequisite",
    "constraint",
    "indirect",
    "parallel",
    "unknown",
    "custom",
]);
const TIME_HORIZON_RANK = Object.freeze({
    immediate: 0,
    short_term: 1,
    medium_term: 2,
    long_term: 3,
    specific_date: 2,
    specific_period: 2,
    unknown: -1,
});
function normalizeText(value) {
    return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
export function buildDependencyReference(model) {
    return Object.freeze({
        referenceId: deterministicId("dep-ref", model.modelId),
        intentId: model.primaryGoal?.intentId ?? null,
        semanticModelId: model.modelId,
        label: model.summary.headline || model.primaryGoal?.label || model.modelId,
        readOnly: true,
    });
}
function createDependency(input) {
    return Object.freeze({
        dependencyId: deterministicId("dependency", `${input.dependent.semanticModelId}:${input.prerequisite.semanticModelId}:${input.ruleId}`),
        category: input.category,
        strength: input.strength,
        ruleId: input.ruleId,
        summary: input.summary,
        explanation: input.explanation,
        dependentReference: input.dependent,
        prerequisiteReference: input.prerequisite,
        bidirectional: input.bidirectional ?? false,
        readOnly: true,
    });
}
function sharedBusinessObjects(left, right) {
    const leftLabels = new Set(left.businessObjects.map((entry) => normalizeText(entry.label)));
    return right.businessObjects
        .map((entry) => normalizeText(entry.label))
        .filter((label) => label && leftLabels.has(label));
}
function sharedConstraints(left, right) {
    const leftText = left.constraints.map((entry) => normalizeText(entry.explicitText));
    const rightText = right.constraints.map((entry) => normalizeText(entry.explicitText));
    return leftText.some((entry) => rightText.includes(entry) && entry.length > 0);
}
function targetsOverlap(left, right) {
    const leftTarget = normalizeText(left.targetEntity?.entityLabel);
    const rightTarget = normalizeText(right.targetEntity?.entityLabel);
    if (!leftTarget || !rightTarget)
        return false;
    return leftTarget === rightTarget || leftTarget.includes(rightTarget) || rightTarget.includes(leftTarget);
}
function refFromNode(node) {
    return Object.freeze({
        referenceId: deterministicId("dep-ref", node.semanticModelId),
        intentId: node.intentId,
        semanticModelId: node.semanticModelId,
        label: node.label,
        readOnly: true,
    });
}
function goalKeywords(model) {
    return normalizeText([
        model.primaryGoal?.label,
        model.primaryGoal?.rawPhrase,
        model.desiredFutureState?.desiredFutureState,
    ].join(" "));
}
function detectKeywordDependencies(dependent, prerequisite, dependentRef, prerequisiteRef) {
    const results = [];
    const depText = goalKeywords(dependent.semanticModel);
    const preText = goalKeywords(prerequisite.semanticModel);
    const launchLike = depText.includes("launch") || depText.includes("product") || depText.includes("release");
    const prototypeLike = preText.includes("prototype") || preText.includes("build");
    const techLike = preText.includes("technology") ||
        preText.includes("platform") ||
        preText.includes("modernize") ||
        prerequisite.classification?.primaryClass?.classId === "technology" ||
        prerequisite.classification?.primaryClass?.classId === "transformation";
    if (launchLike && prototypeLike) {
        results.push(createDependency({
            dependent: dependentRef,
            prerequisite: prerequisiteRef,
            category: "direct",
            strength: "critical",
            ruleId: "RULE_EXPLICIT_DEPENDS_ON",
            summary: "Launch intent depends on prototype prerequisite.",
            explanation: "Product launch requires completed prototype objective.",
        }));
    }
    if (launchLike && techLike) {
        results.push(createDependency({
            dependent: dependentRef,
            prerequisite: prerequisiteRef,
            category: "technology",
            strength: "strong",
            ruleId: "RULE_TECHNOLOGY_BEFORE_DEPLOYMENT",
            summary: "Product launch depends on technology readiness.",
            explanation: "Technology or platform prerequisite must precede product launch.",
        }));
    }
    const acquisitionLike = depText.includes("acquisition") || depText.includes("acquire");
    const fundingLike = preText.includes("cash") || preText.includes("fund") || preText.includes("profit") || preText.includes("budget");
    if (acquisitionLike && fundingLike) {
        results.push(createDependency({
            dependent: dependentRef,
            prerequisite: prerequisiteRef,
            category: "strategic",
            strength: "strong",
            ruleId: "RULE_FUNDING_BEFORE_GROWTH",
            summary: "Acquisition depends on funding readiness.",
            explanation: "Financial prerequisite must precede acquisition intent.",
        }));
    }
    return results;
}
function resolveExplicitDependencies(dependent, prerequisite, dependentRef, prerequisiteRef) {
    return detectKeywordDependencies(dependent, prerequisite, dependentRef, prerequisiteRef);
}
export function detectPairDependencies(input) {
    if (input.dependent.semanticModel.modelId === input.prerequisite.semanticModel.modelId) {
        return Object.freeze([]);
    }
    const dependencies = [];
    const depRef = buildDependencyReference(input.dependent.semanticModel);
    const preRef = buildDependencyReference(input.prerequisite.semanticModel);
    const dep = input.dependent.semanticModel;
    const pre = input.prerequisite.semanticModel;
    const depClass = input.dependent.classification?.primaryClass?.classId;
    const preClass = input.prerequisite.classification?.primaryClass?.classId;
    dependencies.push(...resolveExplicitDependencies(input.dependent, input.prerequisite, depRef, preRef));
    const depRank = TIME_HORIZON_RANK[dep.timeHorizon.kind];
    const preRank = TIME_HORIZON_RANK[pre.timeHorizon.kind];
    if (depRank >= 0 && preRank >= 0 && preRank < depRank) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "sequential",
            strength: "moderate",
            ruleId: "RULE_SEQUENTIAL_TIME",
            summary: "Prerequisite intent has earlier time horizon.",
            explanation: `${pre.timeHorizon.label} precedes ${dep.timeHorizon.label}.`,
        }));
    }
    if ((preClass === "people" || preClass === "resource" || pre.actionType === "create") &&
        (depClass === "growth" || dep.actionType === "expand")) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "enabling",
            strength: "strong",
            ruleId: "RULE_ENABLING_RESOURCE",
            summary: "Resource or hiring intent enables growth intent.",
            explanation: "Prerequisite builds capacity required by dependent expansion.",
        }));
    }
    if (preClass === "compliance" && (depClass === "innovation" || depClass === "customer" || depClass === "growth")) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "compliance",
            strength: "strong",
            ruleId: "RULE_COMPLIANCE_BEFORE_RELEASE",
            summary: "Compliance must precede release or growth intent.",
            explanation: "Regulatory compliance is prerequisite to downstream launch objectives.",
        }));
    }
    if ((preClass === "technology" || preClass === "transformation") &&
        (dep.actionType === "expand" || dep.actionType === "create" || depClass === "operational")) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "technology",
            strength: "strong",
            ruleId: "RULE_TECHNOLOGY_BEFORE_DEPLOYMENT",
            summary: "Technology migration precedes deployment or expansion.",
            explanation: "Platform modernization is prerequisite to dependent operational rollout.",
        }));
    }
    if (preClass === "financial" && depClass === "growth" && pre.actionType !== "reduce") {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "strategic",
            strength: "moderate",
            ruleId: "RULE_FUNDING_BEFORE_GROWTH",
            summary: "Financial readiness precedes growth intent.",
            explanation: "Funding or cash objectives precede market expansion.",
        }));
    }
    const sharedObjects = sharedBusinessObjects(dep, pre);
    if (dep.businessDimension === "financial" &&
        pre.businessDimension === "financial" &&
        dep.modelId !== pre.modelId) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "shared_prerequisite",
            strength: "weak",
            ruleId: "RULE_SHARED_PREREQUISITE",
            summary: "Shared financial planning prerequisite.",
            explanation: "Both intents operate within the same financial planning context.",
            bidirectional: true,
        }));
    }
    if (sharedObjects.length > 0) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "shared_prerequisite",
            strength: "weak",
            ruleId: "RULE_SHARED_BUSINESS_OBJECT",
            summary: "Shared business object prerequisite.",
            explanation: `Both intents reference shared object: ${sharedObjects[0]}.`,
            bidirectional: true,
        }));
    }
    if (sharedConstraints(dep, pre)) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "constraint",
            strength: "weak",
            ruleId: "RULE_SHARED_PREREQUISITE",
            summary: "Shared constraint prerequisite.",
            explanation: "Both intents share explicit constraints.",
            bidirectional: true,
        }));
    }
    if (input.prerequisite.state?.state.flags.isBlocked && !input.dependent.state?.state.flags.isBlocked) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "blocking",
            strength: "critical",
            ruleId: "RULE_EXPLICIT_BLOCKS",
            summary: "Blocked prerequisite prevents dependent progression.",
            explanation: "Prerequisite intent is in blocked state.",
        }));
    }
    if (input.conflictPair && !input.conflictPair.compatible) {
        const hasCritical = input.conflictPair.conflicts.some((entry) => ["high", "critical"].includes(entry.severity));
        if (hasCritical) {
            dependencies.push(createDependency({
                dependent: depRef,
                prerequisite: preRef,
                category: "blocking",
                strength: "critical",
                ruleId: "RULE_BLOCKING_CONFLICT",
                summary: "Conflict blocks dependent intent progression.",
                explanation: "Unresolved conflict must be addressed before dependent execution.",
            }));
        }
    }
    if (preClass === "operational" &&
        depClass === "operational" &&
        pre.businessDimension === "operations" &&
        dep.businessDimension === "operations") {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "operational",
            strength: "moderate",
            ruleId: "RULE_OPERATIONAL_ENABLEMENT",
            summary: "Operational readiness enables dependent intent.",
            explanation: "Operational efficiency objective enables downstream strategic intent.",
        }));
    }
    if (depClass === preClass &&
        dep.businessDimension === pre.businessDimension &&
        !targetsOverlap(dep, pre) &&
        dep.actionType !== "expand" &&
        pre.actionType !== "create") {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "parallel",
            strength: "weak",
            ruleId: "RULE_PARALLEL_INDEPENDENT",
            summary: "Parallel intents in same dimension without target overlap.",
            explanation: "Intents may proceed in parallel within the same business dimension.",
            bidirectional: true,
        }));
    }
    if ((dep.flags.incompleteObjective || pre.flags.incompleteObjective) &&
        dependencies.length === 0) {
        dependencies.push(createDependency({
            dependent: depRef,
            prerequisite: preRef,
            category: "unknown",
            strength: "unknown",
            ruleId: "RULE_UNKNOWN_DEPENDENCY",
            summary: "Dependency relationship cannot be fully determined.",
            explanation: "Incomplete semantic information prevents definitive dependency analysis.",
        }));
    }
    return sortDependencies(deduplicateDependencies(dependencies));
}
export function deduplicateDependencies(dependencies) {
    const seen = new Set();
    const unique = [];
    for (const entry of dependencies) {
        const key = `${entry.dependentReference.semanticModelId}:${entry.prerequisiteReference.semanticModelId}:${entry.ruleId}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        unique.push(entry);
    }
    return unique;
}
export function sortDependencies(dependencies) {
    return Object.freeze([...dependencies].sort((left, right) => {
        const strengthDiff = DEPENDENCY_STRENGTH_ORDER.indexOf(right.strength) -
            DEPENDENCY_STRENGTH_ORDER.indexOf(left.strength);
        if (strengthDiff !== 0)
            return strengthDiff;
        const categoryDiff = DEPENDENCY_CATEGORY_ORDER.indexOf(left.category) -
            DEPENDENCY_CATEGORY_ORDER.indexOf(right.category);
        if (categoryDiff !== 0)
            return categoryDiff;
        return left.dependencyId.localeCompare(right.dependencyId);
    }));
}
export function resolveDependencyCategory(dependency) {
    return dependency.category;
}
export function resolveDependencyStrength(dependency) {
    return dependency.strength;
}
export function highestDependencyStrength(dependencies) {
    if (dependencies.length === 0)
        return "none";
    return sortDependencies(dependencies)[0].strength;
}
export function collectDependencyRulesApplied(dependencies) {
    return Object.freeze([...new Set(dependencies.map((entry) => entry.ruleId))].sort());
}
export function findConflictPair(batchConflict, leftModelId, rightModelId) {
    if (!batchConflict)
        return null;
    return (batchConflict.matrix.pairs.find((pair) => (pair.leftSemanticModelId === leftModelId && pair.rightSemanticModelId === rightModelId) ||
        (pair.leftSemanticModelId === rightModelId && pair.rightSemanticModelId === leftModelId)) ?? null);
}
export function buildDependencyNodes(bundles) {
    return Object.freeze(bundles
        .map((bundle) => Object.freeze({
        nodeId: deterministicId("dep-node", bundle.semanticModel.modelId),
        semanticModelId: bundle.semanticModel.modelId,
        intentId: bundle.semanticModel.primaryGoal?.intentId ?? null,
        label: bundle.semanticModel.summary.headline || bundle.semanticModel.primaryGoal?.label || bundle.semanticModel.modelId,
        readOnly: true,
    }))
        .sort((left, right) => left.nodeId.localeCompare(right.nodeId)));
}
export function buildDependencyEdges(nodes, dependencies) {
    const nodeByModel = new Map(nodes.map((node) => [node.semanticModelId, node.nodeId]));
    return Object.freeze(dependencies
        .map((dependency) => {
        const fromNodeId = nodeByModel.get(dependency.dependentReference.semanticModelId);
        const toNodeId = nodeByModel.get(dependency.prerequisiteReference.semanticModelId);
        if (!fromNodeId || !toNodeId)
            return null;
        return Object.freeze({
            edgeId: deterministicId("dep-edge", dependency.dependencyId),
            fromNodeId,
            toNodeId,
            dependencyId: dependency.dependencyId,
            category: dependency.category,
            strength: dependency.strength,
            readOnly: true,
        });
    })
        .filter((entry) => entry !== null)
        .sort((left, right) => left.edgeId.localeCompare(right.edgeId)));
}
export function detectDependencyCycles(edges) {
    const adjacency = new Map();
    for (const edge of edges) {
        if (edge.category === "parallel" || edge.category === "shared_prerequisite")
            continue;
        const list = adjacency.get(edge.fromNodeId) ?? [];
        list.push(edge.toNodeId);
        adjacency.set(edge.fromNodeId, list);
    }
    const cycles = [];
    const visiting = new Set();
    const visited = new Set();
    const stack = [];
    function dfs(nodeId) {
        if (visiting.has(nodeId)) {
            const cycleStart = stack.indexOf(nodeId);
            if (cycleStart >= 0) {
                cycles.push([...stack.slice(cycleStart), nodeId]);
            }
            return;
        }
        if (visited.has(nodeId))
            return;
        visiting.add(nodeId);
        stack.push(nodeId);
        for (const next of adjacency.get(nodeId) ?? []) {
            dfs(next);
        }
        stack.pop();
        visiting.delete(nodeId);
        visited.add(nodeId);
    }
    for (const nodeId of [...adjacency.keys()].sort()) {
        dfs(nodeId);
    }
    return Object.freeze(cycles);
}
export function detectIndirectDependencies(dependencies, nodes) {
    const nodeByModel = new Map(nodes.map((node) => [node.semanticModelId, node]));
    const direct = new Map();
    for (const dep of dependencies) {
        if (dep.category === "parallel" || dep.bidirectional)
            continue;
        const set = direct.get(dep.dependentReference.semanticModelId) ?? new Set();
        set.add(dep.prerequisiteReference.semanticModelId);
        direct.set(dep.dependentReference.semanticModelId, set);
    }
    const indirect = [];
    for (const [modelA, prereqsA] of direct.entries()) {
        for (const mid of prereqsA) {
            for (const modelC of direct.get(mid) ?? []) {
                if (modelC === modelA || prereqsA.has(modelC))
                    continue;
                const nodeA = nodeByModel.get(modelA);
                const nodeC = nodeByModel.get(modelC);
                if (!nodeA || !nodeC)
                    continue;
                indirect.push(createDependency({
                    dependent: refFromNode(nodeA),
                    prerequisite: refFromNode(nodeC),
                    category: "indirect",
                    strength: "moderate",
                    ruleId: "RULE_INDIRECT_CHAIN",
                    summary: "Indirect dependency through shared chain.",
                    explanation: `Intent depends on intermediate prerequisite ${mid} before ${modelC}.`,
                }));
            }
        }
    }
    return sortDependencies(deduplicateDependencies(indirect));
}
export function pairDependencyKey(dependentId, prerequisiteId) {
    return `${dependentId}=>${prerequisiteId}`;
}

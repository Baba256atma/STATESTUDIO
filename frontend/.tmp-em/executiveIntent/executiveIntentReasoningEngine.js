/**
 * APP-3:11 — Executive Intent Reasoning Engine.
 * Unified reasoning orchestration — no recommendations or business prediction.
 */
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION } from "./executiveIntentClassificationTypes.ts";
import { buildIntentConfidence, calculateIntentConfidence, } from "./executiveIntentConfidenceEngine.ts";
import { createIntentConfidenceAnalysisInput } from "./executiveIntentConfidenceTypes.ts";
import { EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION } from "./executiveIntentConfidenceTypes.ts";
import { buildConflictExample, } from "./executiveIntentConflictEngine.ts";
import { EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION } from "./executiveIntentConflictTypes.ts";
import { buildDependencyExample, } from "./executiveIntentDependencyEngine.ts";
import { EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION } from "./executiveIntentDependencyTypes.ts";
import { buildEvolutionExampleSet, buildIntentEvolution, } from "./executiveIntentEvolutionEngine.ts";
import { EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION } from "./executiveIntentEvolutionTypes.ts";
import { EXECUTIVE_INTENT_CONTRACT_VERSION } from "./executiveIntentConstants.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { createIntentReasoningDiagnostic, } from "./executiveIntentReasoningDiagnostics.ts";
import { getExecutiveIntentReasoningCanonicalExample } from "./executiveIntentReasoningExamples.ts";
import { buildReadinessAssessment, buildReasoningEvidence, buildReasoningHighlights, buildReasoningIssues, buildReasoningSections, buildReasoningSummary, buildReasoningUnknowns, collectEnginesConsumed, collectReasoningRulesApplied, } from "./executiveIntentReasoningRules.ts";
import { createExecutiveIntentReasoning, createExecutiveIntentReasoningAnalysisInput, EXECUTIVE_INTENT_REASONING_ENGINE_VERSION, } from "./executiveIntentReasoningTypes.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION } from "./executiveIntentSemanticTypes.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";
export const EXECUTIVE_INTENT_REASONING_ENGINE_OWNER = "executive-intent-reasoning";
export const EXECUTIVE_INTENT_REASONING_ENGINE_TAGS = Object.freeze([
    "[APP3_11]",
    "[EXECUTIVE_INTENT_REASONING]",
    "[REASONING_ENGINE]",
    "[UNIFIED_REASONING_MODEL]",
    "[READ_ONLY]",
    "[ARCHITECTURE_SAFE]",
    "[BACKWARD_COMPATIBLE]",
]);
export const EXECUTIVE_INTENT_REASONING_ENGINE_RULES = Object.freeze({
    deterministic: true,
    pure: true,
    noSideEffects: true,
    noGlobalState: true,
    noStorage: true,
    noMutation: true,
    noRecommendations: true,
    noBusinessPrediction: true,
    orchestrationOnly: true,
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
    diagnostics.push(createIntentReasoningDiagnostic(code, message, timestamp, options));
}
function resolveReasoningFlags(input) {
    const coreAvailable = input.sections.filter((section) => section.available &&
        (section.sectionKey === "intent_summary" ||
            section.sectionKey === "semantic_summary" ||
            section.sectionKey === "confidence_summary")).length;
    return Object.freeze({
        reasoningComplete: coreAvailable >= 3 && input.readinessAssessment.state !== "unknown",
        reasoningIncomplete: coreAvailable < 3 || input.readinessAssessment.state === "incomplete",
        hasConflicts: Boolean(input.conflict?.flags.hasConflict),
        hasDependencies: Boolean(input.dependency?.flags.hasDependencies),
        hasEvolutionHistory: Boolean(input.evolution?.flags.hasHistory),
        lowConfidence: Boolean(input.confidence?.flags.lowConfidence),
        multipleUnknowns: input.unknownCount >= 3,
        readyForAssistant: input.readinessAssessment.readyForAssistant,
        readyForDashboard: input.readinessAssessment.readyForDashboard,
        futureCompatible: true,
        readOnly: true,
        deterministic: true,
    });
}
export { buildReasoningSummary, buildReasoningHighlights, buildReasoningIssues, buildReasoningEvidence, buildReasoningUnknowns, buildReadinessAssessment, } from "./executiveIntentReasoningRules.ts";
export function buildExecutiveIntentReasoning(input) {
    const diagnostics = [];
    const sections = buildReasoningSections(input);
    const unknowns = buildReasoningUnknowns(input.semanticModel);
    const unknownCount = unknowns.length;
    const issues = buildReasoningIssues(input);
    const evidence = buildReasoningEvidence(input);
    const highlights = buildReasoningHighlights({
        semanticModel: input.semanticModel,
        conflict: input.conflict,
        dependency: input.dependency,
        evolution: input.evolution,
        confidence: input.confidence,
        unknownCount,
    });
    const readinessAssessment = buildReadinessAssessment({
        extraction: input.extraction,
        state: input.state,
        semanticModel: input.semanticModel,
        confidence: input.confidence,
        issues,
        unknownCount,
    });
    const summary = buildReasoningSummary({
        extraction: input.extraction,
        semanticModel: input.semanticModel,
        classification: input.classification,
        confidence: input.confidence,
        readinessAssessment,
        issues,
        unknownCount,
        highlightCount: highlights.items.length,
    });
    const flags = resolveReasoningFlags({
        sections,
        readinessAssessment,
        conflict: input.conflict,
        dependency: input.dependency,
        evolution: input.evolution,
        confidence: input.confidence,
        unknownCount,
    });
    if (!input.state) {
        pushDiagnostic(diagnostics, "state_unavailable", "State result unavailable.", input.timestamp);
    }
    if (!input.semanticModel) {
        pushDiagnostic(diagnostics, "semantic_unavailable", "Semantic model unavailable.", input.timestamp);
    }
    if (!input.classification) {
        pushDiagnostic(diagnostics, "classification_unavailable", "Classification result unavailable.", input.timestamp);
    }
    if (!input.evolution) {
        pushDiagnostic(diagnostics, "evolution_unavailable", "Evolution analysis not provided.", input.timestamp);
    }
    if (!input.confidence) {
        pushDiagnostic(diagnostics, "confidence_unavailable", "Confidence result unavailable.", input.timestamp);
    }
    if (flags.hasConflicts) {
        pushDiagnostic(diagnostics, "conflict_present", "Conflicts are present in the reasoning model.", input.timestamp);
    }
    if (input.dependency?.flags.circularDependency) {
        pushDiagnostic(diagnostics, "dependency_complex", "Dependency complexity affects reasoning completeness.", input.timestamp);
    }
    if (flags.lowConfidence) {
        pushDiagnostic(diagnostics, "low_confidence", "Understanding confidence is low.", input.timestamp);
    }
    if (flags.multipleUnknowns) {
        pushDiagnostic(diagnostics, "multiple_unknowns", "Multiple unknowns are recorded.", input.timestamp);
    }
    if (flags.reasoningComplete) {
        pushDiagnostic(diagnostics, "reasoning_ready", "Reasoning synthesis is complete.", input.timestamp);
    }
    else {
        pushDiagnostic(diagnostics, "reasoning_incomplete", "Reasoning synthesis is incomplete.", input.timestamp);
    }
    if (flags.readyForAssistant) {
        pushDiagnostic(diagnostics, "ready_for_assistant", "Reasoning model is ready for assistant integration.", input.timestamp);
    }
    if (flags.readyForDashboard) {
        pushDiagnostic(diagnostics, "ready_for_dashboard", "Reasoning model is ready for dashboard integration.", input.timestamp);
    }
    pushDiagnostic(diagnostics, "reasoning_synthesis_success", "Reasoning synthesis completed deterministically.", input.timestamp);
    const metadata = Object.freeze({
        reasoningEngineVersion: EXECUTIVE_INTENT_REASONING_ENGINE_VERSION,
        contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
        extractionEngineVersion: input.extraction?.engineVersion ?? null,
        stateEngineVersion: input.state?.engineVersion ?? null,
        semanticModelVersion: input.semanticModel
            ? EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION
            : null,
        classificationEngineVersion: input.classification
            ? EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION
            : null,
        conflictEngineVersion: input.conflict ? EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION : null,
        dependencyEngineVersion: input.dependency ? EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION : null,
        evolutionEngineVersion: input.evolution ? EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION : null,
        confidenceEngineVersion: input.confidence ? EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION : null,
        rulesApplied: collectReasoningRulesApplied(),
        enginesConsumed: collectEnginesConsumed(input),
        readOnly: true,
    });
    return createExecutiveIntentReasoning({
        reasoningId: deterministicId("executive-intent-reasoning", `${input.workspaceId}:${input.focusIntentId ?? "none"}:${input.timestamp}`),
        workspaceId: input.workspaceId,
        focusIntentId: input.focusIntentId,
        summary,
        sections,
        highlights,
        issues,
        evidence,
        unknowns,
        readinessAssessment,
        flags,
        diagnostics: Object.freeze([...diagnostics]),
        metadata,
        timestamp: input.timestamp,
    });
}
export function validateReasoning(reasoning) {
    const issues = [];
    if (reasoning.readOnly !== true)
        issues.push("Reasoning result must be read-only.");
    if (reasoning.flags.readOnly !== true)
        issues.push("Reasoning flags must be read-only.");
    if (reasoning.flags.deterministic !== true)
        issues.push("Reasoning must be deterministic.");
    if (reasoning.metadata.reasoningEngineVersion !== EXECUTIVE_INTENT_REASONING_ENGINE_VERSION) {
        issues.push("Unexpected reasoning engine version.");
    }
    if (reasoning.sections.length !== 11) {
        issues.push("Reasoning model must include eleven sections.");
    }
    if (reasoning.summary.readinessState !== reasoning.readinessAssessment.state) {
        issues.push("Summary readiness state must match assessment.");
    }
    if (reasoning.summary.unknownCount !== reasoning.unknowns.length) {
        issues.push("Summary unknown count must match unknowns array.");
    }
    if (reasoning.summary.issueCount !== reasoning.issues.length) {
        issues.push("Summary issue count must match issues array.");
    }
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
        readOnly: true,
    });
}
function buildFullPipelineInput(text, workspaceId, owner, languageCode, generatedAt) {
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
    const confidence = calculateIntentConfidence(createIntentConfidenceAnalysisInput({
        workspaceId,
        focusIntentId: extraction.primaryIntent?.intentId ?? null,
        extraction,
        semanticModel: semantic.model,
        classification,
        conflict: null,
        dependency: null,
        evolution: null,
        state,
        timestamp: generatedAt,
    }));
    return createExecutiveIntentReasoningAnalysisInput({
        workspaceId,
        focusIntentId: extraction.primaryIntent?.intentId ?? null,
        extraction,
        state,
        semanticModel: semantic.model,
        classification,
        conflict: null,
        dependency: null,
        evolution: null,
        confidence,
        timestamp: generatedAt,
    });
}
export function buildReasoningExample(exampleId, workspaceId = "ws-example-001", owner = "executive-owner", generatedAt = new Date(0).toISOString()) {
    const example = getExecutiveIntentReasoningCanonicalExample(exampleId);
    if (!example)
        return null;
    const input = buildFullPipelineInput(example.text, workspaceId, owner, "en", generatedAt);
    let conflict = input.conflict;
    if (example.conflictExampleId) {
        const pairConflict = buildConflictExample(example.conflictExampleId, workspaceId, owner, generatedAt);
        if (pairConflict)
            conflict = pairConflict;
    }
    let dependency = input.dependency;
    if (example.dependencyExampleId) {
        const dependencyExample = buildDependencyExample(example.dependencyExampleId, workspaceId, owner, generatedAt);
        if (dependencyExample)
            dependency = dependencyExample;
    }
    let evolution = input.evolution;
    if (example.evolutionExampleId) {
        const evolutionSet = buildEvolutionExampleSet(example.evolutionExampleId);
        if (evolutionSet) {
            evolution = buildIntentEvolution(Object.freeze({
                workspaceId,
                records: evolutionSet.records,
                focusIntentId: evolutionSet.focusIntentId,
                timestamp: generatedAt,
                readOnly: true,
            }));
        }
    }
    const confidence = buildIntentConfidence(createIntentConfidenceAnalysisInput({
        workspaceId: input.workspaceId,
        focusIntentId: input.focusIntentId,
        extraction: input.extraction,
        semanticModel: input.semanticModel,
        classification: input.classification,
        conflict,
        dependency,
        evolution,
        state: input.state,
        timestamp: generatedAt,
    }));
    return buildExecutiveIntentReasoning(createExecutiveIntentReasoningAnalysisInput({
        ...input,
        conflict,
        dependency,
        evolution,
        confidence,
    }));
}
export function buildReasoningProbe(generatedAt = new Date(0).toISOString()) {
    return (buildReasoningExample("simple-executive-objective", "ws-example-001", "executive-owner", generatedAt) ??
        buildExecutiveIntentReasoning(buildFullPipelineInput("Increase company profit by 20% next year.", "ws-example-001", "executive-owner", "en", generatedAt)));
}
export function getExecutiveIntentReasoningEngineVersionMetadata() {
    return Object.freeze({
        reasoningEngineVersion: EXECUTIVE_INTENT_REASONING_ENGINE_VERSION,
        owner: EXECUTIVE_INTENT_REASONING_ENGINE_OWNER,
    });
}
export const ExecutiveIntentReasoningEngine = Object.freeze({
    buildExecutiveIntentReasoning,
    buildReasoningSummary,
    buildReasoningHighlights,
    buildReasoningIssues,
    buildReasoningEvidence,
    buildReasoningUnknowns,
    buildReadinessAssessment,
    validateReasoning,
    buildReasoningExample,
    buildReasoningProbe,
    getExecutiveIntentReasoningEngineVersionMetadata,
    version: EXECUTIVE_INTENT_REASONING_ENGINE_VERSION,
    rules: EXECUTIVE_INTENT_REASONING_ENGINE_RULES,
    tags: EXECUTIVE_INTENT_REASONING_ENGINE_TAGS,
});

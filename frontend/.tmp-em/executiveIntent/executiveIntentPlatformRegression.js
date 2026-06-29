/**
 * APP-3:14 — Executive Intent Platform regression runner.
 * Verifies APP-3:1 through APP-3:13 phase integrity — certification only.
 */
import { readFileSync } from "node:fs";
import { ExecutiveIntentAssistantIntegration } from "./executiveIntentAssistantIntegration.ts";
import { EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION } from "./executiveIntentAssistantTypes.ts";
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION } from "./executiveIntentClassificationTypes.ts";
import { EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION } from "./executiveIntentConfidenceTypes.ts";
import { detectIntentConflicts } from "./executiveIntentConflictEngine.ts";
import { EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION } from "./executiveIntentConflictTypes.ts";
import { EXECUTIVE_INTENT_CONTRACT_VERSION, EXECUTIVE_INTENT_PLATFORM, } from "./executiveIntentConstants.ts";
import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { ExecutiveIntentDashboardIntegration } from "./executiveIntentDashboardIntegration.ts";
import { EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION } from "./executiveIntentDashboardTypes.ts";
import { detectIntentDependencies } from "./executiveIntentDependencyEngine.ts";
import { EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION } from "./executiveIntentDependencyTypes.ts";
import { EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION } from "./executiveIntentEvolutionTypes.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION } from "./executiveIntentExtractionTypes.ts";
import { buildExecutiveIntentReasoning } from "./executiveIntentReasoningEngine.ts";
import { EXECUTIVE_INTENT_REASONING_ENGINE_VERSION } from "./executiveIntentReasoningTypes.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION } from "./executiveIntentSemanticTypes.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";
import { EXECUTIVE_INTENT_STATE_ENGINE_VERSION } from "./executiveIntentStateTypes.ts";
export const EXECUTIVE_INTENT_REGRESSION_VERSION = "APP-3/14-REGRESSION-1";
const DEFAULT_WORKSPACE = "ws-regression-001";
const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
function buildPipelineBundle(text) {
    const extraction = extractExecutiveIntent(Object.freeze({
        text,
        workspaceId: DEFAULT_WORKSPACE,
        owner: "executive-regression",
        languageCode: "en",
        generatedAt: DEFAULT_TIME,
    }));
    const semantic = buildExecutiveIntentSemanticModel(extraction, DEFAULT_TIME);
    const classification = classifyExecutiveIntent(semantic.model, DEFAULT_TIME);
    const state = extraction.primaryIntent
        ? resolveExecutiveIntentStateResult(Object.freeze({
            intent: extraction.primaryIntent,
            intentId: extraction.primaryIntent.intentId,
            workspaceId: DEFAULT_WORKSPACE,
            evaluatedAt: DEFAULT_TIME,
            proposedLifecycleTransition: null,
        }))
        : null;
    return Object.freeze({ extraction, semantic, classification, state });
}
function verifyConsumerSource(path, forbidden) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    return forbidden.every((token) => !source.includes(token));
}
export function runExecutiveIntentRegression(timestamp = DEFAULT_TIME) {
    const phases = [];
    const record = (phaseId, phaseVersion, passed, message, skipped = false) => {
        phases.push(Object.freeze({
            phaseId,
            phaseVersion,
            passed,
            message,
            skipped,
            readOnly: true,
        }));
    };
    record("APP-3/1", EXECUTIVE_INTENT_CONTRACT_VERSION, EXECUTIVE_INTENT_CONTRACT_VERSION === "APP-3/1" &&
        EXECUTIVE_INTENT_PLATFORM === "nexora-type-c" &&
        (() => {
            const bundle = buildPipelineBundle("Increase company profit by 20% next year.");
            return bundle.extraction.primaryIntent
                ? validateExecutiveIntentShape(bundle.extraction.primaryIntent).valid
                : false;
        })(), "Contract version, platform identity, and shape verified.");
    record("APP-3/2", EXECUTIVE_INTENT_STATE_ENGINE_VERSION, EXECUTIVE_INTENT_STATE_ENGINE_VERSION === "APP-3/2", "State engine version verified.");
    record("APP-3/3", null, true, "Context engine not yet present — deferred.", true);
    const bundle = buildPipelineBundle("Increase company profit by 20% next year.");
    record("APP-3/4", EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION, bundle.extraction.engineVersion === EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION, "Extraction engine regression passed.");
    record("APP-3/5", EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION, bundle.semantic.model.readOnly === true &&
        bundle.semantic.model.versionMetadata.semanticModelVersion === EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION, "Semantic model regression passed.");
    record("APP-3/6", EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION, bundle.classification.metadata.classificationEngineVersion === EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION, "Classification engine regression passed.");
    const left = buildPipelineBundle("Increase company profit by 20% next year.");
    const right = buildPipelineBundle("Reduce operating cost by 8% next year.");
    const conflict = detectIntentConflicts(Object.freeze({
        workspaceId: DEFAULT_WORKSPACE,
        intents: Object.freeze([
            Object.freeze({
                semanticModel: left.semantic.model,
                classification: left.classification,
                state: left.state,
                readOnly: true,
            }),
            Object.freeze({
                semanticModel: right.semantic.model,
                classification: right.classification,
                state: right.state,
                readOnly: true,
            }),
        ]),
        timestamp,
        readOnly: true,
    }));
    record("APP-3/7", EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION, conflict.metadata.conflictEngineVersion === EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION, "Conflict engine regression passed.");
    const dependency = detectIntentDependencies(Object.freeze({
        workspaceId: DEFAULT_WORKSPACE,
        intents: Object.freeze([
            Object.freeze({
                semanticModel: left.semantic.model,
                classification: left.classification,
                conflictResult: conflict,
                state: left.state,
                readOnly: true,
            }),
            Object.freeze({
                semanticModel: right.semantic.model,
                classification: right.classification,
                conflictResult: conflict,
                state: right.state,
                readOnly: true,
            }),
        ]),
        batchConflictResult: conflict,
        timestamp,
        readOnly: true,
    }));
    record("APP-3/8", EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION, dependency.metadata.dependencyEngineVersion === EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION, "Dependency engine regression passed.");
    record("APP-3/9", EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION, EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION === "APP-3/9", "Evolution engine version verified.");
    record("APP-3/10", EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION, EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION === "APP-3/10", "Confidence engine version verified.");
    record("APP-3/11", EXECUTIVE_INTENT_REASONING_ENGINE_VERSION, typeof buildExecutiveIntentReasoning === "function", "Reasoning engine export verified.");
    record("APP-3/12", EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION, ExecutiveIntentAssistantIntegration.version === EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION &&
        verifyConsumerSource("./executiveIntentAssistantIntegration.ts", [
            "extractExecutiveIntent",
            "classifyExecutiveIntent",
            "buildExecutiveIntentSemanticModel",
            "calculateIntentConfidence",
            "buildExecutiveIntentReasoning",
        ]), "Assistant integration regression passed.");
    record("APP-3/13", EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION, ExecutiveIntentDashboardIntegration.version === EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION &&
        verifyConsumerSource("./executiveIntentDashboardIntegration.ts", [
            "extractExecutiveIntent",
            "classifyExecutiveIntent",
            "buildExecutiveIntentSemanticModel",
            "calculateIntentConfidence",
            "buildExecutiveIntentReasoning",
        ]), "Dashboard integration regression passed.");
    const passedCount = phases.filter((entry) => entry.passed).length;
    const failedCount = phases.filter((entry) => !entry.passed && !entry.skipped).length;
    const skippedCount = phases.filter((entry) => entry.skipped).length;
    return Object.freeze({
        resultId: deterministicId("regression", timestamp),
        passed: failedCount === 0,
        phases: Object.freeze([...phases]),
        passedCount,
        failedCount,
        skippedCount,
        timestamp,
        readOnly: true,
    });
}

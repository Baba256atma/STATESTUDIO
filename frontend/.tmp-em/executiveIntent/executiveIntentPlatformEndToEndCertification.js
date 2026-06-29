/**
 * APP-3:14 — Executive Intent Platform end-to-end certification.
 * Verifies full pipeline determinism — certification only.
 */
import { buildAssistantIntentResponse } from "./executiveIntentAssistantIntegration.ts";
import { validateAssistantIntentResponse } from "./executiveIntentAssistantIntegration.ts";
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { buildIntentConfidence, validateConfidence } from "./executiveIntentConfidenceEngine.ts";
import { createIntentConfidenceAnalysisInput } from "./executiveIntentConfidenceTypes.ts";
import { detectIntentConflicts } from "./executiveIntentConflictEngine.ts";
import { createIntentConflictAnalysisInput } from "./executiveIntentConflictTypes.ts";
import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { buildDashboardIntentModel, validateDashboardModel } from "./executiveIntentDashboardIntegration.ts";
import { detectIntentDependencies } from "./executiveIntentDependencyEngine.ts";
import { buildIntentEvolution } from "./executiveIntentEvolutionEngine.ts";
import { buildEvolutionExampleSet } from "./executiveIntentEvolutionEngine.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { buildExecutiveIntentReasoning, validateReasoning, } from "./executiveIntentReasoningEngine.ts";
import { createExecutiveIntentReasoningAnalysisInput } from "./executiveIntentReasoningTypes.ts";
import { buildExecutiveIntentSemanticModel, validateSemanticModel } from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";
export const EXECUTIVE_INTENT_E2E_CERTIFICATION_VERSION = "APP-3/14-E2E-1";
const DEFAULT_STATEMENT = "Increase company profit by 20% next year.";
const DEFAULT_WORKSPACE = "ws-platform-cert-001";
const DEFAULT_OWNER = "executive-cert-owner";
const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
function buildPipelineBundle(text, workspaceId, owner, timestamp) {
    const extraction = extractExecutiveIntent(Object.freeze({ text, workspaceId, owner, languageCode: "en", generatedAt: timestamp }));
    const semantic = buildExecutiveIntentSemanticModel(extraction, timestamp);
    const classification = classifyExecutiveIntent(semantic.model, timestamp);
    const state = extraction.primaryIntent
        ? resolveExecutiveIntentStateResult(Object.freeze({
            intent: extraction.primaryIntent,
            intentId: extraction.primaryIntent.intentId,
            workspaceId,
            evaluatedAt: timestamp,
            proposedLifecycleTransition: null,
        }))
        : null;
    return Object.freeze({ extraction, semantic, classification, state });
}
export function runExecutiveIntentEndToEndCertification(input = Object.freeze({})) {
    const statement = input.statement ?? DEFAULT_STATEMENT;
    const workspaceId = input.workspaceId ?? DEFAULT_WORKSPACE;
    const owner = input.owner ?? DEFAULT_OWNER;
    const timestamp = input.timestamp ?? DEFAULT_TIME;
    const stagesPassed = [];
    const stagesFailed = [];
    const issues = [];
    const pass = (stage) => {
        stagesPassed.push(stage);
    };
    const fail = (stage, message) => {
        stagesFailed.push(stage);
        issues.push(`${stage}: ${message}`);
    };
    const leftBundle = buildPipelineBundle(statement, workspaceId, owner, timestamp);
    const rightBundle = buildPipelineBundle("Reduce operating cost by 8% next year.", workspaceId, owner, timestamp);
    const extraction = leftBundle.extraction;
    const semantic = leftBundle.semantic;
    const classification = leftBundle.classification;
    const state = leftBundle.state;
    if (extraction.engineVersion === "APP-3/4" && extraction.readOnly === true)
        pass("extraction");
    else
        fail("extraction", "Extraction engine output invalid.");
    if (!extraction.primaryIntent) {
        fail("contract", "Primary intent missing from extraction.");
    }
    else {
        const contractValidation = validateExecutiveIntentShape(extraction.primaryIntent);
        if (contractValidation.valid)
            pass("contract");
        else
            fail("contract", contractValidation.issues.join("; "));
    }
    const semanticValidation = validateSemanticModel(semantic.model);
    if (semanticValidation.valid && semantic.model.readOnly === true)
        pass("semantic");
    else
        fail("semantic", semanticValidation.issues.join("; ") || "Semantic model invalid.");
    if (classification.readOnly === true && classification.metadata.classificationEngineVersion === "APP-3/6") {
        pass("classification");
    }
    else
        fail("classification", "Classification output invalid.");
    if (state?.engineVersion === "APP-3/2" && state.readOnly === true)
        pass("state");
    else
        fail("state", "State engine output invalid.");
    const conflict = detectIntentConflicts(Object.freeze({
        workspaceId,
        intents: Object.freeze([
            createIntentConflictAnalysisInput({
                semanticModel: leftBundle.semantic.model,
                classification: leftBundle.classification,
                state: leftBundle.state,
            }),
            createIntentConflictAnalysisInput({
                semanticModel: rightBundle.semantic.model,
                classification: rightBundle.classification,
                state: rightBundle.state,
            }),
        ]),
        timestamp,
        readOnly: true,
    }));
    if (conflict.metadata.conflictEngineVersion === "APP-3/7")
        pass("conflict");
    else
        fail("conflict", "Conflict engine output invalid.");
    const dependency = detectIntentDependencies(Object.freeze({
        workspaceId,
        intents: Object.freeze([
            Object.freeze({
                semanticModel: leftBundle.semantic.model,
                classification: leftBundle.classification,
                conflictResult: conflict,
                state: leftBundle.state,
                readOnly: true,
            }),
            Object.freeze({
                semanticModel: rightBundle.semantic.model,
                classification: rightBundle.classification,
                conflictResult: conflict,
                state: rightBundle.state,
                readOnly: true,
            }),
        ]),
        batchConflictResult: conflict,
        timestamp,
        readOnly: true,
    }));
    if (dependency.metadata.dependencyEngineVersion === "APP-3/8")
        pass("dependency");
    else
        fail("dependency", "Dependency engine output invalid.");
    const evolutionSet = buildEvolutionExampleSet("version-chain");
    const evolution = evolutionSet
        ? buildIntentEvolution(Object.freeze({
            workspaceId,
            records: evolutionSet.records,
            focusIntentId: evolutionSet.focusIntentId,
            timestamp,
            readOnly: true,
        }))
        : null;
    if (evolution?.metadata.evolutionEngineVersion === "APP-3/9")
        pass("evolution");
    else
        fail("evolution", "Evolution engine output invalid.");
    const confidence = buildIntentConfidence(createIntentConfidenceAnalysisInput({
        workspaceId,
        focusIntentId: extraction.primaryIntent?.intentId ?? null,
        extraction,
        semanticModel: semantic.model,
        classification,
        conflict,
        dependency,
        evolution,
        state,
        timestamp,
    }));
    if (validateConfidence(confidence).valid)
        pass("confidence");
    else
        fail("confidence", "Confidence validation failed.");
    const reasoning = buildExecutiveIntentReasoning(createExecutiveIntentReasoningAnalysisInput({
        workspaceId,
        focusIntentId: extraction.primaryIntent?.intentId ?? null,
        extraction,
        state,
        semanticModel: semantic.model,
        classification,
        conflict,
        dependency,
        evolution,
        confidence,
        timestamp,
    }));
    if (validateReasoning(reasoning).valid)
        pass("reasoning");
    else
        fail("reasoning", "Reasoning validation failed.");
    const assistant = buildAssistantIntentResponse(reasoning, timestamp);
    if (validateAssistantIntentResponse(assistant).valid && assistant.metadata.reasoningEngineVersion === "APP-3/11") {
        pass("assistant");
    }
    else
        fail("assistant", "Assistant integration output invalid.");
    const dashboard = buildDashboardIntentModel(reasoning, timestamp);
    if (validateDashboardModel(dashboard).valid && dashboard.metadata.reasoningEngineVersion === "APP-3/11") {
        pass("dashboard");
    }
    else
        fail("dashboard", "Dashboard integration output invalid.");
    const firstSnapshot = JSON.stringify({ assistant, dashboard, reasoning });
    const secondAssistant = buildAssistantIntentResponse(reasoning, timestamp);
    const secondDashboard = buildDashboardIntentModel(reasoning, timestamp);
    const secondSnapshot = JSON.stringify({
        assistant: secondAssistant,
        dashboard: secondDashboard,
        reasoning,
    });
    const deterministic = firstSnapshot === secondSnapshot;
    if (!deterministic)
        fail("determinism", "Pipeline outputs are not deterministic.");
    return Object.freeze({
        resultId: deterministicId("e2e-cert", `${statement}:${timestamp}`),
        passed: stagesFailed.length === 0 && deterministic,
        statement,
        stagesPassed: Object.freeze([...stagesPassed]),
        stagesFailed: Object.freeze([...stagesFailed]),
        deterministic,
        issues: Object.freeze([...issues]),
        timestamp,
        readOnly: true,
    });
}

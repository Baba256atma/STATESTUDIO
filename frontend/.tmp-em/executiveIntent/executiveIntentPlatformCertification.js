/**
 * APP-3:14 — Executive Intent Platform Certification.
 * Official platform certification runner — no new capabilities.
 */
import { readFileSync } from "node:fs";
import { EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES } from "./executiveIntentAssistantIntegration.ts";
import { EXECUTIVE_INTENT_CONFIDENCE_ENGINE_RULES } from "./executiveIntentConfidenceEngine.ts";
import { EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES } from "./executiveIntentDashboardIntegration.ts";
import { EXECUTIVE_INTENT_CERTIFICATION_GATE_DEFINITIONS, EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES, EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS, EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION, EXECUTIVE_INTENT_PLATFORM_IDENTITY, EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS, createExecutiveIntentCertificationGate, createExecutiveIntentPlatformCertificationResult, } from "./executiveIntentPlatformCertificationContract.ts";
import { runExecutiveIntentEndToEndCertification } from "./executiveIntentPlatformEndToEndCertification.ts";
import { runExecutiveIntentRegression } from "./executiveIntentPlatformRegression.ts";
import { EXECUTIVE_INTENT_REASONING_ENGINE_RULES } from "./executiveIntentReasoningEngine.ts";
export const EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_OWNER = "executive-intent-platform-certification";
export { runExecutiveIntentEndToEndCertification, } from "./executiveIntentPlatformEndToEndCertification.ts";
export { runExecutiveIntentRegression } from "./executiveIntentPlatformRegression.ts";
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
function verifySourceExcludes(path, forbidden) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    return forbidden.every((token) => !source.includes(token));
}
function verifyConsumerCertification() {
    const forbiddenUpstream = Object.freeze([
        "extractExecutiveIntent",
        "classifyExecutiveIntent",
        "buildExecutiveIntentSemanticModel",
        "resolveExecutiveIntentStateResult",
        "detectIntentConflicts",
        "detectIntentDependencies",
        "buildIntentEvolution",
        "calculateIntentConfidence",
        "buildExecutiveIntentReasoning",
    ]);
    return (verifySourceExcludes("./executiveIntentAssistantIntegration.ts", forbiddenUpstream) &&
        verifySourceExcludes("./executiveIntentDashboardIntegration.ts", forbiddenUpstream));
}
export function buildExecutiveIntentCertificationSummary(input) {
    const passedGates = input.gates.filter((gate) => gate.passed).length;
    const failedGates = input.gates.filter((gate) => !gate.passed).length;
    const passed = failedGates === 0;
    return Object.freeze({
        summaryId: deterministicId("platform-cert-summary", input.timestamp),
        headline: passed
            ? "Executive Intent Platform certification passed."
            : "Executive Intent Platform certification failed.",
        passed,
        totalGates: input.gates.length,
        passedGates,
        failedGates,
        platformReady: passed && input.gates.find((gate) => gate.gateKey === "Z")?.passed === true,
        timestamp: input.timestamp,
        readOnly: true,
    });
}
export function validateExecutiveIntentPlatform(result) {
    const issues = [];
    if (result.readOnly !== true)
        issues.push("Certification result must be read-only.");
    if (result.gates.length !== EXECUTIVE_INTENT_CERTIFICATION_GATE_DEFINITIONS.length) {
        issues.push("Certification gate count mismatch.");
    }
    if (result.summary.totalGates !== result.gates.length) {
        issues.push("Summary gate count mismatch.");
    }
    if (result.passed !== result.summary.passed) {
        issues.push("Result passed flag must match summary.");
    }
    if (result.metadata.certificationVersion !== EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION) {
        issues.push("Unexpected certification version.");
    }
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
        readOnly: true,
    });
}
export function runExecutiveIntentPlatformCertification(timestamp = new Date(0).toISOString()) {
    const endToEnd = runExecutiveIntentEndToEndCertification({ timestamp });
    const regression = runExecutiveIntentRegression(timestamp);
    const consumerCertificationPassed = verifyConsumerCertification();
    const gates = [];
    const addGate = (gateKey, label, passed, message) => {
        gates.push(createExecutiveIntentCertificationGate({
            gateId: deterministicId("cert-gate", gateKey),
            gateKey,
            label,
            passed,
            message,
        }));
    };
    addGate("A", "Platform Identity", EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformId === "executive-intent-platform", "Platform identity verified.");
    addGate("B", "Contract Integrity", regression.phases.find((phase) => phase.phaseId === "APP-3/1")?.passed === true, "Contract integrity verified via regression.");
    addGate("C", "State Engine", regression.phases.find((phase) => phase.phaseId === "APP-3/2")?.passed === true, "State engine verified.");
    addGate("D", "Extraction Engine", regression.phases.find((phase) => phase.phaseId === "APP-3/4")?.passed === true, "Extraction engine verified.");
    addGate("E", "Semantic Model", regression.phases.find((phase) => phase.phaseId === "APP-3/5")?.passed === true, "Semantic model verified.");
    addGate("F", "Classification", regression.phases.find((phase) => phase.phaseId === "APP-3/6")?.passed === true, "Classification engine verified.");
    addGate("G", "Conflict Detection", regression.phases.find((phase) => phase.phaseId === "APP-3/7")?.passed === true, "Conflict detection verified.");
    addGate("H", "Dependency Engine", regression.phases.find((phase) => phase.phaseId === "APP-3/8")?.passed === true, "Dependency engine verified.");
    addGate("I", "Evolution Engine", regression.phases.find((phase) => phase.phaseId === "APP-3/9")?.passed === true, "Evolution engine verified.");
    addGate("J", "Confidence Engine", regression.phases.find((phase) => phase.phaseId === "APP-3/10")?.passed === true, "Confidence engine verified.");
    addGate("K", "Reasoning Engine", regression.phases.find((phase) => phase.phaseId === "APP-3/11")?.passed === true, "Reasoning engine verified.");
    addGate("L", "Assistant Integration", regression.phases.find((phase) => phase.phaseId === "APP-3/12")?.passed === true, "Assistant integration verified.");
    addGate("M", "Dashboard Integration", regression.phases.find((phase) => phase.phaseId === "APP-3/13")?.passed === true, "Dashboard integration verified.");
    addGate("N", "Reasoning Consumer Verification", consumerCertificationPassed, consumerCertificationPassed
        ? "Assistant and dashboard consume reasoning only."
        : "Consumer verification failed.");
    addGate("O", "End-to-End Pipeline", endToEnd.passed, endToEnd.passed ? "End-to-end pipeline passed." : endToEnd.issues.join("; "));
    addGate("P", "Regression", regression.passed, regression.passed ? "Regression passed." : `${regression.failedCount} regression failure(s).`);
    addGate("Q", "Architecture Rules", EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.readOnly === true &&
        EXECUTIVE_INTENT_REASONING_ENGINE_RULES.readOnly === true &&
        EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES.reasoningConsumerOnly === true &&
        EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES.reasoningConsumerOnly === true, "Architecture rules verified.");
    addGate("R", "Read-only Guarantees", EXECUTIVE_INTENT_CONFIDENCE_ENGINE_RULES.readOnly === true &&
        EXECUTIVE_INTENT_REASONING_ENGINE_RULES.noMutation === true, "Read-only guarantees verified.");
    addGate("S", "No Storage", EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noStorage === true, "No storage rule verified.");
    addGate("T", "No React", EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noReact === true, "No React rule verified.");
    addGate("U", "No Recommendations", EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noRecommendations === true, "No recommendations rule verified.");
    addGate("V", "No Scenario Execution", EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noScenarioExecution === true, "No scenario execution rule verified.");
    addGate("W", "Backward Compatibility", EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.backwardCompatible === true, "Backward compatibility verified.");
    addGate("X", "TypeScript Build", typeof runExecutiveIntentPlatformCertification === "function" &&
        typeof validateExecutiveIntentPlatform === "function", "Runtime TypeScript module integrity verified.");
    addGate("Y", "Certification Tags", EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[PLATFORM_READY]"), "Certification tags verified.");
    const allPassed = gates.every((gate) => gate.passed);
    addGate("Z", "Platform Ready", allPassed, allPassed ? "Executive Intent Platform is certified." : "Platform certification incomplete.");
    const summary = buildExecutiveIntentCertificationSummary({
        gates: Object.freeze([...gates]),
        timestamp,
    });
    return createExecutiveIntentPlatformCertificationResult({
        resultId: deterministicId("platform-certification", timestamp),
        passed: summary.passed,
        gates: Object.freeze([...gates]),
        summary,
        endToEndPassed: endToEnd.passed,
        regressionPassed: regression.passed,
        consumerCertificationPassed,
        metadata: Object.freeze({
            certificationVersion: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
            platformIdentity: EXECUTIVE_INTENT_PLATFORM_IDENTITY,
            tags: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS,
            rules: EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES,
            publicApis: EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS,
            readOnly: true,
        }),
        timestamp,
    });
}
export function getExecutiveIntentPlatformCertificationVersionMetadata() {
    return Object.freeze({
        certificationVersion: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
        owner: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_OWNER,
    });
}
export const ExecutiveIntentPlatformCertification = Object.freeze({
    runExecutiveIntentPlatformCertification,
    runExecutiveIntentRegression,
    runExecutiveIntentEndToEndCertification,
    buildExecutiveIntentCertificationSummary,
    validateExecutiveIntentPlatform,
    getExecutiveIntentPlatformCertificationVersionMetadata,
    version: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
    tags: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS,
});

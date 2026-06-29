/**
 * APP-3:12 — Executive Intent assistant canonical examples.
 * Each example references an APP-3:11 reasoning example or scenario.
 */
export const EXECUTIVE_INTENT_ASSISTANT_CANONICAL_EXAMPLES = Object.freeze([
    Object.freeze({
        exampleId: "well-defined-objective",
        label: "Well-defined objective",
        reasoningExampleId: "simple-executive-objective",
        syntheticStatus: null,
        expectedStatus: "needs_clarification",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "low-confidence-objective",
        label: "Low-confidence objective",
        reasoningExampleId: "low-confidence-objective",
        syntheticStatus: null,
        expectedStatus: "incomplete",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "conflict-explanation",
        label: "Conflict explanation",
        reasoningExampleId: "conflict-heavy-objective",
        syntheticStatus: null,
        expectedStatus: "needs_clarification",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "dependency-explanation",
        label: "Dependency explanation",
        reasoningExampleId: "dependency-heavy-objective",
        syntheticStatus: null,
        expectedStatus: "ready",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "unknown-information",
        label: "Unknown information",
        reasoningExampleId: "multiple-unknowns",
        syntheticStatus: null,
        expectedStatus: "incomplete",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "needs-clarification",
        label: "Needs clarification",
        reasoningExampleId: "operational-optimization",
        syntheticStatus: null,
        expectedStatus: "needs_clarification",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "archived-intent",
        label: "Archived intent",
        reasoningExampleId: "simple-executive-objective",
        syntheticStatus: "archived",
        expectedStatus: "archived",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "multiple-intents",
        label: "Multiple intents",
        reasoningExampleId: "financial-growth-initiative",
        syntheticStatus: null,
        expectedStatus: "ready",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "no-intent",
        label: "No intent",
        reasoningExampleId: null,
        syntheticStatus: null,
        expectedStatus: "unknown",
        readOnly: true,
    }),
    Object.freeze({
        exampleId: "ready-intent",
        label: "Ready intent",
        reasoningExampleId: "high-confidence-objective",
        syntheticStatus: "ready",
        expectedStatus: "ready",
        readOnly: true,
    }),
]);
export function getExecutiveIntentAssistantCanonicalExample(exampleId) {
    return (EXECUTIVE_INTENT_ASSISTANT_CANONICAL_EXAMPLES.find((entry) => entry.exampleId === exampleId) ??
        null);
}

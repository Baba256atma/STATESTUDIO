/**
 * APP-3:2 — Executive Intent diagnostics vocabulary.
 * Diagnostic codes only — no business logic or remediation.
 */
export const EXECUTIVE_INTENT_DIAGNOSTICS_VERSION = "APP-3/2";
export const EXECUTIVE_INTENT_DIAGNOSTIC_CODES = Object.freeze([
    "intent_ok",
    "intent_incomplete",
    "intent_blocked",
    "intent_invalid_metadata",
    "intent_invalid_relation",
    "intent_duplicate_dependency",
    "intent_archived",
    "intent_stale",
    "intent_workspace_mismatch",
    "intent_unsupported_version",
    "intent_illegal_lifecycle_transition",
    "intent_missing",
    "intent_read_only_violation",
    "intent_status_lifecycle_mismatch",
]);
export const EXECUTIVE_INTENT_DIAGNOSTIC_DEFINITIONS = Object.freeze([
    Object.freeze({
        code: "intent_ok",
        label: "Intent OK",
        defaultSeverity: "info",
        blockingByDefault: false,
    }),
    Object.freeze({
        code: "intent_incomplete",
        label: "Intent Incomplete",
        defaultSeverity: "warning",
        blockingByDefault: false,
    }),
    Object.freeze({
        code: "intent_blocked",
        label: "Intent Blocked",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_invalid_metadata",
        label: "Invalid Metadata",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_invalid_relation",
        label: "Invalid Relation",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_duplicate_dependency",
        label: "Duplicate Dependency",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_archived",
        label: "Intent Archived",
        defaultSeverity: "info",
        blockingByDefault: false,
    }),
    Object.freeze({
        code: "intent_stale",
        label: "Intent Stale",
        defaultSeverity: "warning",
        blockingByDefault: false,
    }),
    Object.freeze({
        code: "intent_workspace_mismatch",
        label: "Workspace Mismatch",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_unsupported_version",
        label: "Unsupported Version",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_illegal_lifecycle_transition",
        label: "Illegal Lifecycle Transition",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_missing",
        label: "Intent Missing",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_read_only_violation",
        label: "Read-only Violation",
        defaultSeverity: "error",
        blockingByDefault: true,
    }),
    Object.freeze({
        code: "intent_status_lifecycle_mismatch",
        label: "Status Lifecycle Mismatch",
        defaultSeverity: "warning",
        blockingByDefault: false,
    }),
]);
const DEFINITION_BY_CODE = Object.freeze(Object.fromEntries(EXECUTIVE_INTENT_DIAGNOSTIC_DEFINITIONS.map((entry) => [entry.code, entry])));
export function isExecutiveIntentDiagnosticCode(value) {
    return EXECUTIVE_INTENT_DIAGNOSTIC_CODES.includes(value);
}
export function getExecutiveIntentDiagnosticDefinition(code) {
    return DEFINITION_BY_CODE[code];
}
export function createExecutiveIntentDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    const definition = getExecutiveIntentDiagnosticDefinition(code);
    const severity = options.blocking === true ? "error" : definition.defaultSeverity;
    return Object.freeze({
        code,
        severity,
        message,
        explanation: options.explanation ?? definition.label,
        recommendedNextState: options.recommendedNextState ?? null,
        blocking: options.blocking ?? definition.blockingByDefault,
        futureCompatible: true,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}

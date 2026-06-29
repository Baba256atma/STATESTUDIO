/**
 * PHASE-1 / STAGE-ARCH-2 — Stage architecture diagnostics.
 * Lifecycle and boundary events for stage workflow traceability.
 */
import { NEXORA_STAGE_ARCHITECTURE_LOG_PREFIX, STAGE_ARCHITECTURE_SOURCE, } from "./stageArchitectureContract.ts";
const eventLog = [];
const diagnosticLog = [];
function nowIso() {
    return new Date().toISOString();
}
export function recordStageArchitectureEvent(input) {
    const event = Object.freeze({
        type: input.type,
        stageId: input.stageId?.trim() || null,
        lifecycle: input.lifecycle ?? null,
        timestamp: nowIso(),
    });
    eventLog.push(event);
    return event;
}
export function recordStageArchitectureDiagnostic(input) {
    const entry = Object.freeze({
        stageId: input.stageId?.trim() || null,
        event: input.event,
        message: input.message.trim(),
        generatedAt: nowIso(),
    });
    diagnosticLog.push(entry);
    if (process.env.NODE_ENV !== "production") {
        console.debug(NEXORA_STAGE_ARCHITECTURE_LOG_PREFIX, {
            source: STAGE_ARCHITECTURE_SOURCE,
            ...entry,
        });
    }
    return entry;
}
export function getStageArchitectureEvents() {
    return Object.freeze([...eventLog]);
}
export function getStageArchitectureDiagnosticsLog() {
    return Object.freeze([...diagnosticLog]);
}
export function resetStageArchitectureDiagnosticsForTests() {
    eventLog.length = 0;
    diagnosticLog.length = 0;
}
export const StageArchitectureDiagnostics = Object.freeze({
    recordStageArchitectureEvent,
    recordStageArchitectureDiagnostic,
    getStageArchitectureEvents,
    getStageArchitectureDiagnosticsLog,
    resetStageArchitectureDiagnosticsForTests,
});

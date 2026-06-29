/**
 * APP-4:2 — Executive Memory confidence contract.
 * Reusable confidence shape — no scoring engine.
 */
import { EXECUTIVE_MEMORY_CONFIDENCE_LEVEL_KEYS } from "./executiveMemoryRecordConstants.ts";
export function createExecutiveMemoryConfidence(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function isExecutiveMemoryConfidenceLevel(value) {
    return EXECUTIVE_MEMORY_CONFIDENCE_LEVEL_KEYS.includes(value);
}

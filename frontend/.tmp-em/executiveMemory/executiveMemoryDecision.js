/**
 * APP-4:2 — Executive Memory decision contract.
 */
export function createExecutiveMemoryDecision(input) {
    return Object.freeze({ ...input, readOnly: true });
}

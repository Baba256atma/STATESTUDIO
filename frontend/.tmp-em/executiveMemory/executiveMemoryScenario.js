/**
 * APP-4:2 — Executive Memory scenario contract.
 */
export function createExecutiveMemoryScenario(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createExecutiveMemoryIntent(input) {
    return Object.freeze({ ...input, readOnly: true });
}

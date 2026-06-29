/**
 * APP-4:2 — Executive Memory goal contract.
 */
export function createExecutiveMemoryGoal(input) {
    return Object.freeze({ ...input, readOnly: true });
}

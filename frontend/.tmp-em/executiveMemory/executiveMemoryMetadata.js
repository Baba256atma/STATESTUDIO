/**
 * APP-4:2 — Executive Memory metadata, header, body, and version contracts.
 */
import { EXECUTIVE_MEMORY_COMPATIBILITY_FLAGS, } from "./executiveMemoryRecordConstants.ts";
export function createExecutiveMemoryTag(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createExecutiveMemoryVersion(input) {
    return Object.freeze({
        ...input,
        compatibility: input.compatibility ?? EXECUTIVE_MEMORY_COMPATIBILITY_FLAGS,
        readOnly: true,
    });
}
export function createExecutiveMemoryHeader(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createExecutiveMemoryBody(input) {
    return Object.freeze({
        narrative: input.narrative,
        keyPoints: Object.freeze([...(input.keyPoints ?? [])]),
        readOnly: true,
    });
}
export function createExecutiveMemoryBusinessContext(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createExecutiveMemoryMetadata(input) {
    return Object.freeze({
        memoryId: input.memoryId,
        workspaceId: input.workspaceId,
        category: input.category,
        owner: input.owner,
        sourceModule: input.sourceModule,
        tags: Object.freeze([...(input.tags ?? [])]),
        references: Object.freeze([...(input.references ?? [])]),
        customMetadata: Object.freeze({ ...(input.customMetadata ?? {}) }),
        extensionMetadata: Object.freeze({ ...(input.extensionMetadata ?? {}) }),
        readOnly: true,
    });
}

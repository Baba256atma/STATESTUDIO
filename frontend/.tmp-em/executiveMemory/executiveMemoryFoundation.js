/**
 * APP-4:1 — Executive Memory foundation.
 * Platform initialization and state — metadata only.
 */
import { EXECUTIVE_MEMORY_CATEGORY_KEYS, EXECUTIVE_MEMORY_CONTRACT_VERSION } from "./executiveMemoryConstants.ts";
import { getExecutiveMemoryProviders, listExecutiveMemoryProviderIds, } from "./executiveMemoryRegistry.ts";
export const EXECUTIVE_MEMORY_FOUNDATION_VERSION = "APP-4/1";
export const EXECUTIVE_MEMORY_FOUNDATION_OWNER = "executive-memory-foundation";
export const EXECUTIVE_MEMORY_FOUNDATION_TAGS = Object.freeze([
    "[APP4_1]",
    "[EXECUTIVE_MEMORY_FOUNDATION]",
    "[METADATA_ONLY]",
    "[NOT_CHAT_MEMORY]",
    "[ARCHITECTURE_SAFE]",
]);
let platformInitialized = false;
let lastInitializedAt = null;
function createResult(success, reason, data) {
    return Object.freeze({ success, reason, data, readOnly: true });
}
export function resetExecutiveMemoryFoundationForTests() {
    platformInitialized = false;
    lastInitializedAt = null;
}
export function isExecutiveMemoryPlatformInitialized() {
    return platformInitialized;
}
export function getExecutiveMemoryPlatformState(timestamp = new Date(0).toISOString()) {
    return Object.freeze({
        platformId: "executive-memory-platform",
        foundationVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
        contractVersion: EXECUTIVE_MEMORY_CONTRACT_VERSION,
        initialized: platformInitialized,
        providerCount: getExecutiveMemoryProviders().length,
        registeredProviderIds: listExecutiveMemoryProviderIds(),
        supportedCategories: EXECUTIVE_MEMORY_CATEGORY_KEYS,
        timestamp: lastInitializedAt ?? timestamp,
        readOnly: true,
    });
}
export function initializeExecutiveMemoryPlatform(timestamp = new Date(0).toISOString()) {
    platformInitialized = true;
    lastInitializedAt = timestamp;
    const state = getExecutiveMemoryPlatformState(timestamp);
    return createResult(true, "Executive Memory platform initialized.", state);
}
export function getExecutiveMemoryFoundationVersionMetadata() {
    return Object.freeze({
        foundationVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
        contractVersion: EXECUTIVE_MEMORY_CONTRACT_VERSION,
        owner: EXECUTIVE_MEMORY_FOUNDATION_OWNER,
    });
}
export const ExecutiveMemoryFoundation = Object.freeze({
    initializeExecutiveMemoryPlatform,
    getExecutiveMemoryPlatformState,
    isExecutiveMemoryPlatformInitialized,
    getExecutiveMemoryFoundationVersionMetadata,
    resetExecutiveMemoryFoundationForTests,
    version: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
    tags: EXECUTIVE_MEMORY_FOUNDATION_TAGS,
});

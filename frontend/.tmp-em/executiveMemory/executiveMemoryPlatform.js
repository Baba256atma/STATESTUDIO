/**
 * APP-4:1 — Executive Memory Platform.
 * Official foundation entry point — metadata only, no storage or retrieval.
 */
import { ExecutiveMemoryFoundation, getExecutiveMemoryFoundationVersionMetadata, getExecutiveMemoryPlatformState, initializeExecutiveMemoryPlatform, isExecutiveMemoryPlatformInitialized, resetExecutiveMemoryFoundationForTests, } from "./executiveMemoryFoundation.ts";
import { ExecutiveMemoryRegistry, getExecutiveMemoryProvider, getExecutiveMemoryProviders, isExecutiveMemoryRegistered, listExecutiveMemoryProviderIds, registerExecutiveMemoryProvider, resetExecutiveMemoryRegistryForTests, } from "./executiveMemoryRegistry.ts";
import { ExecutiveMemoryContract, EXECUTIVE_MEMORY_IDENTITY, EXECUTIVE_MEMORY_PUBLIC_API_RULES, EXECUTIVE_MEMORY_TAGS, } from "./executiveMemoryContracts.ts";
export { ExecutiveMemoryContract, EXECUTIVE_MEMORY_IDENTITY, EXECUTIVE_MEMORY_PUBLIC_API_RULES, EXECUTIVE_MEMORY_TAGS, };
export { registerExecutiveMemoryProvider, getExecutiveMemoryProvider, getExecutiveMemoryProviders, isExecutiveMemoryRegistered, listExecutiveMemoryProviderIds, initializeExecutiveMemoryPlatform, getExecutiveMemoryPlatformState, isExecutiveMemoryPlatformInitialized, getExecutiveMemoryFoundationVersionMetadata, };
export function resetExecutiveMemoryPlatformForTests() {
    resetExecutiveMemoryRegistryForTests();
    resetExecutiveMemoryFoundationForTests();
}
export const ExecutiveMemoryPlatform = Object.freeze({
    initializeExecutiveMemoryPlatform,
    getExecutiveMemoryPlatformState,
    isExecutiveMemoryPlatformInitialized,
    registerExecutiveMemoryProvider,
    getExecutiveMemoryProvider,
    getExecutiveMemoryProviders,
    isExecutiveMemoryRegistered,
    listExecutiveMemoryProviderIds,
    getExecutiveMemoryFoundationVersionMetadata,
    resetExecutiveMemoryPlatformForTests,
    contract: ExecutiveMemoryContract,
    foundation: ExecutiveMemoryFoundation,
    registry: ExecutiveMemoryRegistry,
    identity: EXECUTIVE_MEMORY_IDENTITY,
    version: EXECUTIVE_MEMORY_IDENTITY.version,
    tags: EXECUTIVE_MEMORY_TAGS,
});

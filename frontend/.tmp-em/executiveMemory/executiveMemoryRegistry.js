/**
 * APP-4:1 — Executive Memory provider registry.
 * Metadata registration only — no storage or retrieval implementation.
 */
import { EXECUTIVE_MEMORY_CATEGORY_KEYS } from "./executiveMemoryConstants.ts";
import { validateExecutiveMemoryProviderRegistration } from "./executiveMemoryValidation.ts";
export const EXECUTIVE_MEMORY_REGISTRY_VERSION = "APP-4/1-REGISTRY-1";
const registry = new Map();
function createResult(success, reason, data) {
    return Object.freeze({ success, reason, data, readOnly: true });
}
function freezeProvider(provider) {
    return Object.freeze({
        ...provider,
        supportedCategories: Object.freeze([...provider.supportedCategories]),
        metadata: Object.freeze({ ...provider.metadata }),
        readOnly: true,
    });
}
export function resetExecutiveMemoryRegistryForTests() {
    registry.clear();
}
export function registerExecutiveMemoryProvider(input, registeredAt = new Date(0).toISOString()) {
    const validation = validateExecutiveMemoryProviderRegistration(input);
    if (!validation.valid) {
        return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
    }
    if (registry.has(input.providerId)) {
        return createResult(false, `Provider already registered: ${input.providerId}.`, null);
    }
    const provider = freezeProvider(Object.freeze({
        providerId: input.providerId,
        label: input.label.trim(),
        version: input.version.trim(),
        supportedCategories: Object.freeze([...input.supportedCategories]),
        metadata: Object.freeze({ ...(input.metadata ?? Object.freeze({})) }),
        registeredAt,
        readOnly: true,
    }));
    registry.set(provider.providerId, provider);
    return createResult(true, "Provider registered.", provider);
}
export function getExecutiveMemoryProvider(providerId) {
    return registry.get(providerId) ?? null;
}
export function getExecutiveMemoryProviders() {
    return Object.freeze([...registry.values()]
        .sort((left, right) => left.providerId.localeCompare(right.providerId))
        .map((entry) => freezeProvider(entry)));
}
export function isExecutiveMemoryRegistered(providerId) {
    return registry.has(providerId);
}
export function listExecutiveMemoryProviderIds() {
    return Object.freeze([...registry.keys()].sort((left, right) => left.localeCompare(right)));
}
export function getExecutiveMemoryRegistryMetadata() {
    return Object.freeze({
        registryVersion: EXECUTIVE_MEMORY_REGISTRY_VERSION,
        providerCount: registry.size,
        supportedCategories: EXECUTIVE_MEMORY_CATEGORY_KEYS,
    });
}
export const ExecutiveMemoryRegistry = Object.freeze({
    registerExecutiveMemoryProvider,
    getExecutiveMemoryProvider,
    getExecutiveMemoryProviders,
    isExecutiveMemoryRegistered,
    listExecutiveMemoryProviderIds,
    getExecutiveMemoryRegistryMetadata,
    resetExecutiveMemoryRegistryForTests,
    version: EXECUTIVE_MEMORY_REGISTRY_VERSION,
});

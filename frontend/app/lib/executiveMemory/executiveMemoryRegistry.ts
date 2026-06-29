/**
 * APP-4:1 — Executive Memory provider registry.
 * Metadata registration only — no storage or retrieval implementation.
 */

import { EXECUTIVE_MEMORY_CATEGORY_KEYS } from "./executiveMemoryConstants.ts";
import type {
  ExecutiveMemoryProvider,
  ExecutiveMemoryProviderId,
  ExecutiveMemoryProviderRegistration,
  ExecutiveMemoryResult,
} from "./executiveMemoryTypes.ts";
import { validateExecutiveMemoryProviderRegistration } from "./executiveMemoryValidation.ts";

export const EXECUTIVE_MEMORY_REGISTRY_VERSION = "APP-4/1-REGISTRY-1" as const;

const registry = new Map<ExecutiveMemoryProviderId, ExecutiveMemoryProvider>();

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveMemoryResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function freezeProvider(provider: ExecutiveMemoryProvider): ExecutiveMemoryProvider {
  return Object.freeze({
    ...provider,
    supportedCategories: Object.freeze([...provider.supportedCategories]),
    metadata: Object.freeze({ ...provider.metadata }),
    readOnly: true as const,
  });
}

export function resetExecutiveMemoryRegistryForTests(): void {
  registry.clear();
}

export function registerExecutiveMemoryProvider(
  input: ExecutiveMemoryProviderRegistration,
  registeredAt: string = new Date(0).toISOString()
): ExecutiveMemoryResult<ExecutiveMemoryProvider> {
  const validation = validateExecutiveMemoryProviderRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (registry.has(input.providerId)) {
    return createResult(false, `Provider already registered: ${input.providerId}.`, null);
  }

  const provider = freezeProvider(
    Object.freeze({
      providerId: input.providerId,
      label: input.label.trim(),
      version: input.version.trim(),
      supportedCategories: Object.freeze([...input.supportedCategories]),
      metadata: Object.freeze({ ...(input.metadata ?? Object.freeze({})) }),
      registeredAt,
      readOnly: true as const,
    })
  );
  registry.set(provider.providerId, provider);
  return createResult(true, "Provider registered.", provider);
}

export function getExecutiveMemoryProvider(
  providerId: ExecutiveMemoryProviderId
): ExecutiveMemoryProvider | null {
  return registry.get(providerId) ?? null;
}

export function getExecutiveMemoryProviders(): readonly ExecutiveMemoryProvider[] {
  return Object.freeze(
    [...registry.values()]
      .sort((left, right) => left.providerId.localeCompare(right.providerId))
      .map((entry) => freezeProvider(entry))
  );
}

export function isExecutiveMemoryRegistered(providerId: ExecutiveMemoryProviderId): boolean {
  return registry.has(providerId);
}

export function listExecutiveMemoryProviderIds(): readonly ExecutiveMemoryProviderId[] {
  return Object.freeze([...registry.keys()].sort((left, right) => left.localeCompare(right)));
}

export function getExecutiveMemoryRegistryMetadata(): Readonly<{
  registryVersion: typeof EXECUTIVE_MEMORY_REGISTRY_VERSION;
  providerCount: number;
  supportedCategories: typeof EXECUTIVE_MEMORY_CATEGORY_KEYS;
}> {
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

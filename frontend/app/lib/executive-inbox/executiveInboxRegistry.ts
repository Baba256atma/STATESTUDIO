/**
 * APP-11:1 — Executive Inbox registry.
 */

import {
  EXECUTIVE_INBOX_CONSUMER_REGISTRY,
  EXECUTIVE_INBOX_DEFAULT_LIMITS,
  EXECUTIVE_INBOX_EXTENSION_REGISTRY,
  EXECUTIVE_INBOX_FUTURE_API_REGISTRY,
  EXECUTIVE_INBOX_FUTURE_ENGINE_REGISTRY,
  EXECUTIVE_INBOX_ITEM_STATUS_KEYS,
  EXECUTIVE_INBOX_SESSION_STATUS_KEYS,
  EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
} from "./executiveInboxConstants.ts";
import type {
  ExecutiveInboxFutureExtensionRegistration,
  ExecutiveInboxItem,
  ExecutiveInboxItemRegistrationInput,
  ExecutiveInboxMetadataExtensionRegistration,
  ExecutiveInboxPlatformResult,
  ExecutiveInboxRegistrySnapshot,
  ExecutiveInboxSession,
  ExecutiveInboxSessionId,
  ExecutiveInboxSessionRegistrationInput,
  ExecutiveInboxSessionStatus,
  ExecutiveInboxSourceType,
} from "./executiveInboxTypes.ts";
import {
  validateExecutiveInboxItemRegistration,
  validateExecutiveInboxSessionRegistration,
  validateMetadataExtensionRegistration,
} from "./executiveInboxValidation.ts";

export const EXECUTIVE_INBOX_REGISTRY_VERSION = "APP-11/1-REGISTRY-1" as const;

const sessionRegistry = new Map<ExecutiveInboxSessionId, ExecutiveInboxSession>();
const itemRegistry = new Map<string, ExecutiveInboxItem>();
const sourceTypeRegistry = new Map<string, { sourceType: ExecutiveInboxSourceType; label: string; description: string }>();
const sessionStatusRegistry = new Map<string, { status: ExecutiveInboxSessionStatus; label: string; description: string }>();
const itemStatusRegistry = new Map<string, { status: string; label: string; description: string }>();
const metadataExtensionRegistry = new Map<string, ExecutiveInboxMetadataExtensionRegistration>();
const futureExtensionRegistry = new Map<string, ExecutiveInboxFutureExtensionRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveInboxPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetExecutiveInboxRegistryForTests(): void {
  sessionRegistry.clear();
  itemRegistry.clear();
  sourceTypeRegistry.clear();
  sessionStatusRegistry.clear();
  itemStatusRegistry.clear();
  metadataExtensionRegistry.clear();
  futureExtensionRegistry.clear();
}

export function registerExecutiveInboxSession(
  input: ExecutiveInboxSessionRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): ExecutiveInboxPlatformResult<ExecutiveInboxSession> {
  const validation = validateExecutiveInboxSessionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (sessionRegistry.has(input.sessionId)) {
    return createResult(false, `Executive inbox session already registered: ${input.sessionId}.`, null);
  }
  if (sessionRegistry.size >= EXECUTIVE_INBOX_DEFAULT_LIMITS.maxRegisteredSessions) {
    return createResult(false, "Executive inbox session registry limit reached.", null);
  }
  const entry = Object.freeze({
    sessionId: input.sessionId,
    workspaceId: input.workspaceId,
    status: "draft" as const,
    label: input.label.trim(),
    description: input.description.trim(),
    sourceTypes: Object.freeze([...input.sourceTypes]),
    metadata: Object.freeze({
      metadataVersion: "APP-11/1",
      owner: "executive-inbox-platform-foundation",
      extensions: Object.freeze({}),
      readOnly: true as const,
    }),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: "APP-11/1" as const,
    readOnly: true as const,
  });
  sessionRegistry.set(entry.sessionId, entry);
  return createResult(true, "Executive inbox session registered.", entry);
}

export function registerExecutiveInboxItem(
  input: ExecutiveInboxItemRegistrationInput,
  registeredAt: string = new Date(0).toISOString()
): ExecutiveInboxPlatformResult<ExecutiveInboxItem> {
  const validation = validateExecutiveInboxItemRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (!sessionRegistry.has(input.sessionId)) {
    return createResult(false, `Executive inbox session not found: ${input.sessionId}.`, null);
  }
  if (itemRegistry.has(input.itemId)) {
    return createResult(false, `Executive inbox item already registered: ${input.itemId}.`, null);
  }
  if (itemRegistry.size >= EXECUTIVE_INBOX_DEFAULT_LIMITS.maxRegisteredItems) {
    return createResult(false, "Executive inbox item registry limit reached.", null);
  }
  const entry = Object.freeze({
    itemId: input.itemId,
    workspaceId: input.workspaceId,
    sessionId: input.sessionId,
    sourceType: input.sourceType,
    sourceReferenceId: input.sourceReferenceId,
    status: "registered" as const,
    label: input.label.trim(),
    description: input.description.trim(),
    metadata: Object.freeze({
      metadataVersion: "APP-11/1",
      owner: "executive-inbox-platform-foundation",
      extensions: Object.freeze({}),
      readOnly: true as const,
    }),
    registeredAt,
    version: "APP-11/1" as const,
    readOnly: true as const,
  });
  itemRegistry.set(entry.itemId, entry);
  return createResult(true, "Executive inbox item registered.", entry);
}

export function registerMetadataExtension(
  input: ExecutiveInboxMetadataExtensionRegistration
): ExecutiveInboxPlatformResult<ExecutiveInboxMetadataExtensionRegistration> {
  const validation = validateMetadataExtensionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (metadataExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Metadata extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  metadataExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Metadata extension registered.", entry);
}

export function registerFutureExtension(
  input: ExecutiveInboxFutureExtensionRegistration
): ExecutiveInboxPlatformResult<ExecutiveInboxFutureExtensionRegistration> {
  if (!input.extensionId.trim() || !input.label.trim() || !input.phaseKey.trim()) {
    return createResult(false, "Future extension registration requires extensionId, label, and phaseKey.", null);
  }
  if (futureExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Future extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  futureExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Future extension registered.", entry);
}

export function seedDefaultExecutiveInboxRegistry(): void {
  if (sourceTypeRegistry.size > 0) {
    return;
  }
  for (const sourceType of EXECUTIVE_INBOX_SOURCE_TYPE_KEYS) {
    sourceTypeRegistry.set(sourceType, {
      sourceType,
      label: sourceType.replace(/_/g, " "),
      description: `Reserved executive inbox source type: ${sourceType}.`,
    });
  }
  for (const status of EXECUTIVE_INBOX_SESSION_STATUS_KEYS) {
    sessionStatusRegistry.set(status, {
      status,
      label: status,
      description: `Executive inbox session status: ${status}.`,
    });
  }
  for (const status of EXECUTIVE_INBOX_ITEM_STATUS_KEYS) {
    itemStatusRegistry.set(status, {
      status,
      label: status,
      description: `Executive inbox item status: ${status}.`,
    });
  }
}

export function listExecutiveInboxSessionIds(): readonly ExecutiveInboxSessionId[] {
  return Object.freeze([...sessionRegistry.keys()]);
}

export function getExecutiveInboxRegistrySnapshot(): ExecutiveInboxRegistrySnapshot {
  return Object.freeze({
    registryVersion: EXECUTIVE_INBOX_REGISTRY_VERSION,
    sessionCount: sessionRegistry.size,
    itemCount: itemRegistry.size,
    sourceTypeCount: sourceTypeRegistry.size,
    sourceProviderCount: EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY.length,
    consumerCount: EXECUTIVE_INBOX_CONSUMER_REGISTRY.length,
    futureEngineCount: EXECUTIVE_INBOX_FUTURE_ENGINE_REGISTRY.length,
    extensionCount: EXECUTIVE_INBOX_EXTENSION_REGISTRY.length,
    readOnly: true as const,
  });
}

export function getExecutiveInboxRegistry(): Readonly<{
  sessions: readonly ExecutiveInboxSession[];
  items: readonly ExecutiveInboxItem[];
  sourceTypes: readonly ExecutiveInboxSourceType[];
  snapshot: ExecutiveInboxRegistrySnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    sessions: Object.freeze([...sessionRegistry.values()]),
    items: Object.freeze([...itemRegistry.values()]),
    sourceTypes: EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
    snapshot: getExecutiveInboxRegistrySnapshot(),
    readOnly: true as const,
  });
}

export const ExecutiveInboxRegistry = Object.freeze({
  resetExecutiveInboxRegistryForTests,
  registerExecutiveInboxSession,
  registerExecutiveInboxItem,
  registerMetadataExtension,
  registerFutureExtension,
  seedDefaultExecutiveInboxRegistry,
  getExecutiveInboxRegistrySnapshot,
  getExecutiveInboxRegistry,
  listExecutiveInboxSessionIds,
});

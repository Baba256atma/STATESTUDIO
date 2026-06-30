/**
 * ASS-1 — Executive Assistant Platform manifest.
 */

import {
  ASS_CAPABILITY_KEYS,
  ASS_CONVERSATION_SCOPE_KEYS,
  ASS_EXTENSION_POINT_KEYS,
  ASS_INTEGRATION_KEYS,
  ASS_PLATFORM_ID,
  ASS_PLATFORM_NAME,
  ASS_PLATFORM_PRINCIPLES,
  ASS_PUBLIC_API_REGISTRY,
  ASS_UPSTREAM_PLATFORM_KEYS,
} from "./executiveAssistantPlatformContracts.ts";

import type { ExecutiveAssistantPlatformManifest } from "./executiveAssistantPlatformTypes.ts";

export function buildExecutiveAssistantPlatformManifestRecord(): ExecutiveAssistantPlatformManifest {
  return Object.freeze({
    manifestId: "executive-assistant-platform-foundation-manifest",
    platformId: ASS_PLATFORM_ID,
    version: "ASS/1",
    title: ASS_PLATFORM_NAME,
    goal: "Canonical Executive Assistant platform identity, boundaries, capability registration, and integration metadata.",
    lifecycle: "build" as const,
    principles: ASS_PLATFORM_PRINCIPLES,
    publicApis: ASS_PUBLIC_API_REGISTRY,
    capabilityKeys: ASS_CAPABILITY_KEYS,
    conversationScopeKeys: ASS_CONVERSATION_SCOPE_KEYS,
    integrationKeys: ASS_INTEGRATION_KEYS,
    extensionPoints: ASS_EXTENSION_POINT_KEYS,
    upstreamPlatforms: ASS_UPSTREAM_PLATFORM_KEYS,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantPlatformManifest(): ExecutiveAssistantPlatformManifest {
  return buildExecutiveAssistantPlatformManifestRecord();
}

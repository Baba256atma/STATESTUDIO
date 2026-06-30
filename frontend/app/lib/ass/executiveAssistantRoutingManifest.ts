/**
 * ASS-4 — Executive Conversation Routing Architecture manifest.
 */

import {
  ASS_ROUTING_PLATFORM_ID,
  ASS_ROUTING_PLATFORM_NAME,
  ASS_ROUTING_REGISTRY_KEYS,
  ASS_ROUTING_VERSION,
} from "./executiveAssistantRoutingContracts.ts";
import type {
  ExecutiveAssistantRoutingManifest,
  ExecutiveAssistantRoutingRegistryBundle,
} from "./executiveAssistantRoutingTypes.ts";
import {
  getDefaultRoutingCompatibility,
  validateExecutiveAssistantRoutingManifestRecord,
  validateExecutiveAssistantRoutingRegistry,
} from "./executiveAssistantRoutingValidation.ts";

export function getExecutiveAssistantRoutingManifest(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingManifest {
  const validation = validateExecutiveAssistantRoutingRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "executive-assistant-routing-manifest",
    platformId: ASS_ROUTING_PLATFORM_ID,
    version: ASS_ROUTING_VERSION,
    title: ASS_ROUTING_PLATFORM_NAME,
    goal: "Declarative routing identity, coordination, scope, intent, target, decision, and confidence metadata architecture.",
    registryKeys: ASS_ROUTING_REGISTRY_KEYS,
    coordinationRouteCount: registry.coordinationRouteCount,
    scopeRoutingCount: registry.scopeRoutingCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultRoutingCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateExecutiveAssistantRoutingManifestRecord(manifest);
  return Object.freeze({
    ...manifest,
    validationResult:
      validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}

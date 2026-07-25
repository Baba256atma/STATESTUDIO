/** ASSISTANT-4:2 — Canonical immutable Registry identity. */
import { AssistantExecutiveGuidanceRegistryConstants } from "./assistantExecutiveGuidanceRegistry.constants.ts";
import type { AssistantExecutiveGuidanceRegistryIdentityMetadata } from "./assistantExecutiveGuidanceRegistry.types.ts";

export const AssistantExecutiveGuidanceRegistryIdentity:
AssistantExecutiveGuidanceRegistryIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidanceRegistryConstants.registryIdentifier,
  name: "Assistant Executive Guidance Registry",
  phaseId: "ASSISTANT-4:2",
  namespace: AssistantExecutiveGuidanceRegistryConstants.namespace,
  version: AssistantExecutiveGuidanceRegistryConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveGuidanceRegistryConstants.status,
  readiness: AssistantExecutiveGuidanceRegistryConstants.readiness,
  sourceFoundation: "ASSISTANT-4:1/ExecutiveGuidanceFoundation",
  metadataOnly: true,
  immutable: true,
});

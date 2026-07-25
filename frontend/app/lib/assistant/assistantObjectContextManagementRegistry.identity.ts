/** ASSISTANT-6:2 — Canonical immutable Registry identity. */
import { AssistantObjectContextManagementRegistryConstants } from "./assistantObjectContextManagementRegistry.constants.ts";
import type { AssistantObjectContextManagementRegistryIdentityMetadata } from "./assistantObjectContextManagementRegistry.types.ts";

export const AssistantObjectContextManagementRegistryIdentity:
AssistantObjectContextManagementRegistryIdentityMetadata = Object.freeze({
  id: AssistantObjectContextManagementRegistryConstants.registryIdentifier,
  name: "Assistant Object & Context Management Registry",
  phaseId: "ASSISTANT-6:2",
  namespace: AssistantObjectContextManagementRegistryConstants.namespace,
  version: AssistantObjectContextManagementRegistryConstants.version,
  layer: "Nexora Assistant",
  status: AssistantObjectContextManagementRegistryConstants.status,
  readiness: AssistantObjectContextManagementRegistryConstants.readiness,
  sourceFoundation: "ASSISTANT-6:1/ObjectContextManagementFoundation",
  metadataOnly: true,
  immutable: true,
});

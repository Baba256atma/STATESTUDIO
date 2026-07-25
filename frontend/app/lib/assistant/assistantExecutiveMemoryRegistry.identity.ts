/** ASSISTANT-2:2 — Canonical immutable Registry identity. */
import { AssistantExecutiveMemoryRegistryConstants } from "./assistantExecutiveMemoryRegistry.constants.ts";
import type { AssistantExecutiveMemoryRegistryIdentityMetadata } from "./assistantExecutiveMemoryRegistry.types.ts";

export const AssistantExecutiveMemoryRegistryIdentity:
AssistantExecutiveMemoryRegistryIdentityMetadata = Object.freeze({
  id: AssistantExecutiveMemoryRegistryConstants.registryIdentifier,
  name: "Assistant Executive Memory Registry",
  phaseId: "ASSISTANT-2:2",
  namespace: AssistantExecutiveMemoryRegistryConstants.namespace,
  version: AssistantExecutiveMemoryRegistryConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveMemoryRegistryConstants.status,
  readiness: AssistantExecutiveMemoryRegistryConstants.readiness,
  sourceFoundation: "ASSISTANT-2:1/ExecutiveMemoryFoundation",
  metadataOnly: true,
  immutable: true,
});

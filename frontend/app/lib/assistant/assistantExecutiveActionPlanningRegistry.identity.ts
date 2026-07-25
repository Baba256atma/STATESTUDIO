/** ASSISTANT-7:2 — Canonical immutable Registry identity. */
import { AssistantExecutiveActionPlanningRegistryConstants } from "./assistantExecutiveActionPlanningRegistry.constants.ts";
import type { AssistantExecutiveActionPlanningRegistryIdentityMetadata } from "./assistantExecutiveActionPlanningRegistry.types.ts";

export const AssistantExecutiveActionPlanningRegistryIdentity:
AssistantExecutiveActionPlanningRegistryIdentityMetadata = Object.freeze({
  id: AssistantExecutiveActionPlanningRegistryConstants.registryIdentifier,
  name: "Assistant Executive Action Planning Registry",
  phaseId: "ASSISTANT-7:2",
  namespace: AssistantExecutiveActionPlanningRegistryConstants.namespace,
  version: AssistantExecutiveActionPlanningRegistryConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveActionPlanningRegistryConstants.status,
  readiness: AssistantExecutiveActionPlanningRegistryConstants.readiness,
  sourceFoundation: "ASSISTANT-7:1/ExecutiveActionPlanningFoundation",
  metadataOnly: true,
  immutable: true,
});

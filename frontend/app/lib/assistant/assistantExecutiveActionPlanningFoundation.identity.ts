/** ASSISTANT-7:1 — Canonical immutable Foundation identity. */
import { AssistantExecutiveActionPlanningFoundationConstants } from "./assistantExecutiveActionPlanningFoundation.constants.ts";
import type { AssistantExecutiveActionPlanningIdentityMetadata } from "./assistantExecutiveActionPlanningFoundation.types.ts";

export const AssistantExecutiveActionPlanningFoundationIdentity:
AssistantExecutiveActionPlanningIdentityMetadata = Object.freeze({
  id: AssistantExecutiveActionPlanningFoundationConstants.canonicalIdentifier,
  name: "Assistant Executive Action Planning Foundation",
  phaseId: AssistantExecutiveActionPlanningFoundationConstants.phaseIdentifier,
  namespace: AssistantExecutiveActionPlanningFoundationConstants.namespace,
  version: AssistantExecutiveActionPlanningFoundationConstants.version,
  layer: "Nexora Assistant",
  status:
    AssistantExecutiveActionPlanningFoundationConstants.foundationStatus,
  readiness: AssistantExecutiveActionPlanningFoundationConstants.readiness,
  sourceObjectContextManagement:
    "ASSISTANT-6:9/ObjectContextManagementPublicIndex",
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-7:3 — Canonical immutable Executive Action Planning Model identity. */
import { AssistantExecutiveActionPlanningModelConstants } from "./assistantExecutiveActionPlanningModel.constants.ts";
import type { AssistantExecutiveActionPlanningModelIdentityMetadata } from "./assistantExecutiveActionPlanningModel.types.ts";

export const AssistantExecutiveActionPlanningModelIdentity:
AssistantExecutiveActionPlanningModelIdentityMetadata = Object.freeze({
  id: AssistantExecutiveActionPlanningModelConstants.modelIdentifier,
  name: "Assistant Executive Action Planning Model",
  phaseId: "ASSISTANT-7:3",
  namespace: AssistantExecutiveActionPlanningModelConstants.namespace,
  version: AssistantExecutiveActionPlanningModelConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveActionPlanningModelConstants.status,
  readiness: AssistantExecutiveActionPlanningModelConstants.readiness,
  sourceRegistry: "ASSISTANT-7:2/ExecutiveActionPlanningRegistry",
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-7:4 — Canonical immutable Validation identity. */
import { AssistantExecutiveActionPlanningValidationConstants } from "./assistantExecutiveActionPlanningValidation.constants.ts";
import type { AssistantExecutiveActionPlanningValidationIdentityMetadata } from "./assistantExecutiveActionPlanningValidation.types.ts";

export const AssistantExecutiveActionPlanningValidationIdentity:
AssistantExecutiveActionPlanningValidationIdentityMetadata = Object.freeze({
  id: AssistantExecutiveActionPlanningValidationConstants
    .validationIdentifier,
  name: "Assistant Executive Action Planning Validation",
  phaseId: "ASSISTANT-7:4",
  namespace: AssistantExecutiveActionPlanningValidationConstants.namespace,
  version: AssistantExecutiveActionPlanningValidationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveActionPlanningValidationConstants.status,
  readiness: AssistantExecutiveActionPlanningValidationConstants.readiness,
  sourceModel: "ASSISTANT-7:3/ExecutiveActionPlanningModel",
  metadataOnly: true,
  immutable: true,
});

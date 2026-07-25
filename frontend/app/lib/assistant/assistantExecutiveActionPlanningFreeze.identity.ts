/** ASSISTANT-7:8 — Canonical immutable Freeze identity. */
import { AssistantExecutiveActionPlanningFreezeConstants } from "./assistantExecutiveActionPlanningFreeze.constants.ts";
import type { AssistantExecutiveActionPlanningFreezeIdentityMetadata } from "./assistantExecutiveActionPlanningFreeze.types.ts";

export const AssistantExecutiveActionPlanningFreezeIdentity:
AssistantExecutiveActionPlanningFreezeIdentityMetadata = Object.freeze({
  id: AssistantExecutiveActionPlanningFreezeConstants.freezeIdentifier,
  name: "Assistant Executive Action Planning Freeze",
  phaseId: "ASSISTANT-7:8",
  namespace: AssistantExecutiveActionPlanningFreezeConstants.namespace,
  version: AssistantExecutiveActionPlanningFreezeConstants.version,
  status: AssistantExecutiveActionPlanningFreezeConstants.status,
  readiness: AssistantExecutiveActionPlanningFreezeConstants.readiness,
  sourceCertification:
    "ASSISTANT-7:7/ExecutiveActionPlanningCertification",
  lockIdentifier:
    AssistantExecutiveActionPlanningFreezeConstants.lockIdentifier,
  metadataOnly: true,
  immutable: true,
});

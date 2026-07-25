/** ASSISTANT-7:7 — Canonical immutable Certification identity. */
import { AssistantExecutiveActionPlanningCertificationConstants } from "./assistantExecutiveActionPlanningCertification.constants.ts";
import type { AssistantExecutiveActionPlanningCertificationIdentityMetadata } from "./assistantExecutiveActionPlanningCertification.types.ts";

export const AssistantExecutiveActionPlanningCertificationIdentity:
AssistantExecutiveActionPlanningCertificationIdentityMetadata =
  Object.freeze({
    id: AssistantExecutiveActionPlanningCertificationConstants
      .certificationIdentifier,
    name: "Assistant Executive Action Planning Certification",
    phaseId: "ASSISTANT-7:7",
    namespace:
      AssistantExecutiveActionPlanningCertificationConstants.namespace,
    version: AssistantExecutiveActionPlanningCertificationConstants.version,
    status: AssistantExecutiveActionPlanningCertificationConstants.status,
    readiness:
      AssistantExecutiveActionPlanningCertificationConstants.readiness,
    sourcePlatform: "ASSISTANT-7:6/ExecutiveActionPlanningPlatform",
    metadataOnly: true,
    immutable: true,
  });

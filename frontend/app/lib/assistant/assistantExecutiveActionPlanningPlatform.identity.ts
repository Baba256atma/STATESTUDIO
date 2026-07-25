/** ASSISTANT-7:6 — Canonical immutable Platform identity. */
import { AssistantExecutiveActionPlanningPlatformConstants } from "./assistantExecutiveActionPlanningPlatform.constants.ts";
import type { AssistantExecutiveActionPlanningPlatformIdentityMetadata } from "./assistantExecutiveActionPlanningPlatform.types.ts";

export const AssistantExecutiveActionPlanningPlatformIdentity:
AssistantExecutiveActionPlanningPlatformIdentityMetadata = Object.freeze({
  id: AssistantExecutiveActionPlanningPlatformConstants.platformIdentifier,
  name: "Assistant Executive Action Planning Platform",
  phaseId: "ASSISTANT-7:6",
  namespace: AssistantExecutiveActionPlanningPlatformConstants.namespace,
  version: AssistantExecutiveActionPlanningPlatformConstants.version,
  status: AssistantExecutiveActionPlanningPlatformConstants.status,
  readiness: AssistantExecutiveActionPlanningPlatformConstants.readiness,
  sourceManifest: "ASSISTANT-7:5/ExecutiveActionPlanningManifest",
  metadataOnly: true,
  immutable: true,
});

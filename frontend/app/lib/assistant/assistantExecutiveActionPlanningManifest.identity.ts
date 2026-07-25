/** ASSISTANT-7:5 — Canonical immutable Manifest identity. */
import { AssistantExecutiveActionPlanningManifestConstants } from "./assistantExecutiveActionPlanningManifest.constants.ts";
import type { AssistantExecutiveActionPlanningManifestIdentityMetadata } from "./assistantExecutiveActionPlanningManifest.types.ts";

export const AssistantExecutiveActionPlanningManifestIdentity:
AssistantExecutiveActionPlanningManifestIdentityMetadata = Object.freeze({
  id: AssistantExecutiveActionPlanningManifestConstants.manifestIdentifier,
  name: "Assistant Executive Action Planning Manifest",
  phaseId: "ASSISTANT-7:5",
  namespace: AssistantExecutiveActionPlanningManifestConstants.namespace,
  version: AssistantExecutiveActionPlanningManifestConstants.version,
  status: AssistantExecutiveActionPlanningManifestConstants.status,
  readiness: AssistantExecutiveActionPlanningManifestConstants.readiness,
  sourceValidation: "ASSISTANT-7:4/ExecutiveActionPlanningValidation",
  metadataOnly: true,
  immutable: true,
});

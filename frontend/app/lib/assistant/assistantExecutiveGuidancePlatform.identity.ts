/** ASSISTANT-4:6 — Canonical immutable Platform identity. */
import { AssistantExecutiveGuidancePlatformConstants } from "./assistantExecutiveGuidancePlatform.constants.ts";
import type { AssistantExecutiveGuidancePlatformIdentityMetadata } from "./assistantExecutiveGuidancePlatform.types.ts";

export const AssistantExecutiveGuidancePlatformIdentity:
AssistantExecutiveGuidancePlatformIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidancePlatformConstants.platformIdentifier,
  name: "Assistant Executive Guidance Platform",
  phaseId: "ASSISTANT-4:6",
  namespace: AssistantExecutiveGuidancePlatformConstants.namespace,
  version: AssistantExecutiveGuidancePlatformConstants.version,
  status: AssistantExecutiveGuidancePlatformConstants.status,
  readiness: AssistantExecutiveGuidancePlatformConstants.readiness,
  sourceManifest: "ASSISTANT-4:5/ExecutiveGuidanceManifest",
  metadataOnly: true,
  immutable: true,
});

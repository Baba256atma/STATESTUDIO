/** ASSISTANT-4:1 — Canonical immutable Foundation identity. */
import { AssistantExecutiveGuidanceFoundationConstants } from "./assistantExecutiveGuidanceFoundation.constants.ts";
import type { AssistantExecutiveGuidanceIdentityMetadata } from "./assistantExecutiveGuidanceFoundation.types.ts";

export const AssistantExecutiveGuidanceFoundationIdentity:
AssistantExecutiveGuidanceIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidanceFoundationConstants.canonicalIdentity,
  name: "Assistant Executive Guidance Foundation",
  phaseId: AssistantExecutiveGuidanceFoundationConstants.phaseIdentifier,
  namespace: AssistantExecutiveGuidanceFoundationConstants.namespace,
  version: AssistantExecutiveGuidanceFoundationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveGuidanceFoundationConstants.foundationStatus,
  readiness: AssistantExecutiveGuidanceFoundationConstants.readiness,
  sourceIntentDialogue:
    "ASSISTANT-3:9/IntentDialogueUnderstandingPublicIndex",
  metadataOnly: true,
  immutable: true,
});

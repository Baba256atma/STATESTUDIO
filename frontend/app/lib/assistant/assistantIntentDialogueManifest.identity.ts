/** ASSISTANT-3:5 — Canonical immutable Manifest identity. */
import { AssistantIntentDialogueManifestConstants } from "./assistantIntentDialogueManifest.constants.ts";
import type { AssistantIntentDialogueManifestIdentityMetadata } from "./assistantIntentDialogueManifest.types.ts";

export const AssistantIntentDialogueManifestIdentity:
AssistantIntentDialogueManifestIdentityMetadata = Object.freeze({
  id: AssistantIntentDialogueManifestConstants.manifestIdentifier,
  name: "Assistant Intent & Dialogue Understanding Manifest",
  phaseId: "ASSISTANT-3:5",
  namespace: AssistantIntentDialogueManifestConstants.namespace,
  version: AssistantIntentDialogueManifestConstants.version,
  status: AssistantIntentDialogueManifestConstants.status,
  readiness: AssistantIntentDialogueManifestConstants.readiness,
  sourceValidation: "ASSISTANT-3:4/IntentDialogueUnderstandingValidation",
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-3:6 — Canonical immutable Platform identity. */
import { AssistantIntentDialoguePlatformConstants } from "./assistantIntentDialoguePlatform.constants.ts";
import type { AssistantIntentDialoguePlatformIdentityMetadata } from "./assistantIntentDialoguePlatform.types.ts";

export const AssistantIntentDialoguePlatformIdentity:
AssistantIntentDialoguePlatformIdentityMetadata = Object.freeze({
  id: AssistantIntentDialoguePlatformConstants.platformIdentifier,
  name: "Assistant Intent & Dialogue Understanding Platform",
  phaseId: "ASSISTANT-3:6",
  namespace: AssistantIntentDialoguePlatformConstants.namespace,
  version: AssistantIntentDialoguePlatformConstants.version,
  status: AssistantIntentDialoguePlatformConstants.status,
  readiness: AssistantIntentDialoguePlatformConstants.readiness,
  sourceManifest: "ASSISTANT-3:5/IntentDialogueUnderstandingManifest",
  metadataOnly: true,
  immutable: true,
});

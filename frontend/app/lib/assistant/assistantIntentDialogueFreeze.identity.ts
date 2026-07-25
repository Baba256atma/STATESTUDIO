/** ASSISTANT-3:8 — Canonical immutable Freeze identity. */
import { AssistantIntentDialogueFreezeConstants } from "./assistantIntentDialogueFreeze.constants.ts";
import type { AssistantIntentDialogueFreezeIdentityMetadata } from "./assistantIntentDialogueFreeze.types.ts";

export const AssistantIntentDialogueFreezeIdentity:
AssistantIntentDialogueFreezeIdentityMetadata = Object.freeze({
  id: AssistantIntentDialogueFreezeConstants.freezeIdentifier,
  name: "Assistant Intent & Dialogue Understanding Freeze",
  phaseId: "ASSISTANT-3:8",
  namespace: AssistantIntentDialogueFreezeConstants.namespace,
  version: AssistantIntentDialogueFreezeConstants.version,
  status: AssistantIntentDialogueFreezeConstants.status,
  readiness: AssistantIntentDialogueFreezeConstants.readiness,
  sourceCertification:
    "ASSISTANT-3:7/IntentDialogueUnderstandingCertification",
  lockIdentifier: AssistantIntentDialogueFreezeConstants.lockIdentifier,
  metadataOnly: true,
  immutable: true,
});

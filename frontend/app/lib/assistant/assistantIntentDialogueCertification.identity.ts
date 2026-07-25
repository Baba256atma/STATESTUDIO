/** ASSISTANT-3:7 — Canonical immutable Certification identity. */
import { AssistantIntentDialogueCertificationConstants } from "./assistantIntentDialogueCertification.constants.ts";
import type { AssistantIntentDialogueCertificationIdentityMetadata } from "./assistantIntentDialogueCertification.types.ts";

export const AssistantIntentDialogueCertificationIdentity:
AssistantIntentDialogueCertificationIdentityMetadata = Object.freeze({
  id: AssistantIntentDialogueCertificationConstants.certificationIdentifier,
  name: "Assistant Intent & Dialogue Understanding Certification",
  phaseId: "ASSISTANT-3:7",
  namespace: AssistantIntentDialogueCertificationConstants.namespace,
  version: AssistantIntentDialogueCertificationConstants.version,
  status: AssistantIntentDialogueCertificationConstants.status,
  readiness: AssistantIntentDialogueCertificationConstants.readiness,
  sourcePlatform: "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform",
  metadataOnly: true,
  immutable: true,
});

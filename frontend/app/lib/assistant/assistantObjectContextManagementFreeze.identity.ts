/** ASSISTANT-6:8 — Canonical immutable Freeze identity. */
import { AssistantObjectContextManagementFreezeConstants } from "./assistantObjectContextManagementFreeze.constants.ts";
import type { AssistantObjectContextManagementFreezeIdentityMetadata } from "./assistantObjectContextManagementFreeze.types.ts";

export const AssistantObjectContextManagementFreezeIdentity:
AssistantObjectContextManagementFreezeIdentityMetadata = Object.freeze({
  id: AssistantObjectContextManagementFreezeConstants.freezeIdentifier,
  name: "Assistant Object & Context Management Freeze",
  phaseId: "ASSISTANT-6:8",
  namespace: AssistantObjectContextManagementFreezeConstants.namespace,
  version: AssistantObjectContextManagementFreezeConstants.version,
  status: AssistantObjectContextManagementFreezeConstants.status,
  readiness: AssistantObjectContextManagementFreezeConstants.readiness,
  sourceCertification:
    "ASSISTANT-6:7/ObjectContextManagementCertification",
  lockIdentifier:
    AssistantObjectContextManagementFreezeConstants.lockIdentifier,
  metadataOnly: true,
  immutable: true,
});

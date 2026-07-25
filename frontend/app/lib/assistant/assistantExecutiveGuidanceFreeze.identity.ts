/** ASSISTANT-4:8 — Canonical immutable Freeze identity. */
import { AssistantExecutiveGuidanceFreezeConstants } from "./assistantExecutiveGuidanceFreeze.constants.ts";
import type { AssistantExecutiveGuidanceFreezeIdentityMetadata } from "./assistantExecutiveGuidanceFreeze.types.ts";

export const AssistantExecutiveGuidanceFreezeIdentity:
AssistantExecutiveGuidanceFreezeIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidanceFreezeConstants.freezeIdentifier,
  name: "Assistant Executive Guidance Freeze",
  phaseId: "ASSISTANT-4:8",
  namespace: AssistantExecutiveGuidanceFreezeConstants.namespace,
  version: AssistantExecutiveGuidanceFreezeConstants.version,
  status: AssistantExecutiveGuidanceFreezeConstants.status,
  readiness: AssistantExecutiveGuidanceFreezeConstants.readiness,
  sourceCertification: "ASSISTANT-4:7/ExecutiveGuidanceCertification",
  lockIdentifier: AssistantExecutiveGuidanceFreezeConstants.lockIdentifier,
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-5:8 — Canonical immutable Freeze identity. */
import { AssistantWorkspaceOrchestrationFreezeConstants } from "./assistantWorkspaceOrchestrationFreeze.constants.ts";
import type { AssistantWorkspaceOrchestrationFreezeIdentityMetadata } from "./assistantWorkspaceOrchestrationFreeze.types.ts";

export const AssistantWorkspaceOrchestrationFreezeIdentity:
AssistantWorkspaceOrchestrationFreezeIdentityMetadata = Object.freeze({
  id: AssistantWorkspaceOrchestrationFreezeConstants.freezeIdentifier,
  name: "Assistant Workspace Orchestration Freeze",
  phaseId: "ASSISTANT-5:8",
  namespace: AssistantWorkspaceOrchestrationFreezeConstants.namespace,
  version: AssistantWorkspaceOrchestrationFreezeConstants.version,
  status: AssistantWorkspaceOrchestrationFreezeConstants.status,
  readiness: AssistantWorkspaceOrchestrationFreezeConstants.readiness,
  sourceCertification: "ASSISTANT-5:7/WorkspaceOrchestrationCertification",
  lockIdentifier: AssistantWorkspaceOrchestrationFreezeConstants.lockIdentifier,
  metadataOnly: true,
  immutable: true,
});

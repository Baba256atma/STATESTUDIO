/** ASSISTANT-5:6 — Canonical immutable Platform identity. */
import { AssistantWorkspaceOrchestrationPlatformConstants } from "./assistantWorkspaceOrchestrationPlatform.constants.ts";
import type { AssistantWorkspaceOrchestrationPlatformIdentityMetadata } from "./assistantWorkspaceOrchestrationPlatform.types.ts";

export const AssistantWorkspaceOrchestrationPlatformIdentity:
AssistantWorkspaceOrchestrationPlatformIdentityMetadata = Object.freeze({
  id: AssistantWorkspaceOrchestrationPlatformConstants.platformIdentifier,
  name: "Assistant Workspace Orchestration Platform",
  phaseId: "ASSISTANT-5:6",
  namespace: AssistantWorkspaceOrchestrationPlatformConstants.namespace,
  version: AssistantWorkspaceOrchestrationPlatformConstants.version,
  status: AssistantWorkspaceOrchestrationPlatformConstants.status,
  readiness: AssistantWorkspaceOrchestrationPlatformConstants.readiness,
  sourceManifest: "ASSISTANT-5:5/WorkspaceOrchestrationManifest",
  metadataOnly: true,
  immutable: true,
});

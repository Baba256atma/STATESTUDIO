/** ASSISTANT-5:5 — Canonical immutable Manifest identity. */
import { AssistantWorkspaceOrchestrationManifestConstants } from "./assistantWorkspaceOrchestrationManifest.constants.ts";
import type { AssistantWorkspaceOrchestrationManifestIdentityMetadata } from "./assistantWorkspaceOrchestrationManifest.types.ts";

export const AssistantWorkspaceOrchestrationManifestIdentity:
AssistantWorkspaceOrchestrationManifestIdentityMetadata = Object.freeze({
  id: AssistantWorkspaceOrchestrationManifestConstants.manifestIdentifier,
  name: "Assistant Workspace Orchestration Manifest",
  phaseId: "ASSISTANT-5:5",
  namespace: AssistantWorkspaceOrchestrationManifestConstants.namespace,
  version: AssistantWorkspaceOrchestrationManifestConstants.version,
  status: AssistantWorkspaceOrchestrationManifestConstants.status,
  readiness: AssistantWorkspaceOrchestrationManifestConstants.readiness,
  sourceValidation: "ASSISTANT-5:4/WorkspaceOrchestrationValidation",
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-5:1 — Canonical immutable Foundation identity. */
import { AssistantWorkspaceOrchestrationFoundationConstants } from "./assistantWorkspaceOrchestrationFoundation.constants.ts";
import type { AssistantWorkspaceOrchestrationIdentityMetadata } from "./assistantWorkspaceOrchestrationFoundation.types.ts";

export const AssistantWorkspaceOrchestrationFoundationIdentity:
AssistantWorkspaceOrchestrationIdentityMetadata = Object.freeze({
  id: AssistantWorkspaceOrchestrationFoundationConstants.canonicalIdentity,
  name: "Assistant Workspace Orchestration Foundation",
  phaseId: AssistantWorkspaceOrchestrationFoundationConstants.phaseIdentifier,
  namespace: AssistantWorkspaceOrchestrationFoundationConstants.namespace,
  version: AssistantWorkspaceOrchestrationFoundationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantWorkspaceOrchestrationFoundationConstants.foundationStatus,
  readiness: AssistantWorkspaceOrchestrationFoundationConstants.readiness,
  sourceExecutiveGuidance: "ASSISTANT-4:9/ExecutiveGuidancePublicIndex",
  metadataOnly: true,
  immutable: true,
});

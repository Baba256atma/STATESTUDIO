/** ASSISTANT-6:1 — Canonical immutable Foundation identity. */
import { AssistantObjectContextManagementFoundationConstants } from "./assistantObjectContextManagementFoundation.constants.ts";
import type { AssistantObjectContextManagementIdentityMetadata } from "./assistantObjectContextManagementFoundation.types.ts";

export const AssistantObjectContextManagementFoundationIdentity:
AssistantObjectContextManagementIdentityMetadata = Object.freeze({
  id: AssistantObjectContextManagementFoundationConstants.canonicalIdentity,
  name: "Assistant Object & Context Management Foundation",
  phaseId: AssistantObjectContextManagementFoundationConstants.phaseIdentifier,
  namespace: AssistantObjectContextManagementFoundationConstants.namespace,
  version: AssistantObjectContextManagementFoundationConstants.version,
  layer: "Nexora Assistant",
  status:
    AssistantObjectContextManagementFoundationConstants.foundationStatus,
  readiness: AssistantObjectContextManagementFoundationConstants.readiness,
  sourceWorkspaceOrchestration:
    "ASSISTANT-5:9/WorkspaceOrchestrationPublicIndex",
  metadataOnly: true,
  immutable: true,
});

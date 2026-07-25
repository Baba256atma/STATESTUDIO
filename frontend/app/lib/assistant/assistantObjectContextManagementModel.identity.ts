/** ASSISTANT-6:3 — Canonical immutable Object & Context Management Model identity. */
import { AssistantObjectContextManagementModelConstants } from "./assistantObjectContextManagementModel.constants.ts";
import type { AssistantObjectContextManagementModelIdentityMetadata } from "./assistantObjectContextManagementModel.types.ts";

export const AssistantObjectContextManagementModelIdentity:
AssistantObjectContextManagementModelIdentityMetadata = Object.freeze({
  id: AssistantObjectContextManagementModelConstants.modelIdentifier,
  name: "Assistant Object & Context Management Model",
  phaseId: "ASSISTANT-6:3",
  namespace: AssistantObjectContextManagementModelConstants.namespace,
  version: AssistantObjectContextManagementModelConstants.version,
  layer: "Nexora Assistant",
  status: AssistantObjectContextManagementModelConstants.status,
  readiness: AssistantObjectContextManagementModelConstants.readiness,
  sourceRegistry: "ASSISTANT-6:2/ObjectContextManagementRegistry",
  metadataOnly: true,
  immutable: true,
});

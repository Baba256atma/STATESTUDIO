/** ASSISTANT-6:6 — Canonical immutable Platform identity. */
import { AssistantObjectContextManagementPlatformConstants } from "./assistantObjectContextManagementPlatform.constants.ts";
import type { AssistantObjectContextManagementPlatformIdentityMetadata } from "./assistantObjectContextManagementPlatform.types.ts";

export const AssistantObjectContextManagementPlatformIdentity:
AssistantObjectContextManagementPlatformIdentityMetadata = Object.freeze({
  id: AssistantObjectContextManagementPlatformConstants.platformIdentifier,
  name: "Assistant Object & Context Management Platform",
  phaseId: "ASSISTANT-6:6",
  namespace: AssistantObjectContextManagementPlatformConstants.namespace,
  version: AssistantObjectContextManagementPlatformConstants.version,
  status: AssistantObjectContextManagementPlatformConstants.status,
  readiness: AssistantObjectContextManagementPlatformConstants.readiness,
  sourceManifest: "ASSISTANT-6:5/ObjectContextManagementManifest",
  metadataOnly: true,
  immutable: true,
});

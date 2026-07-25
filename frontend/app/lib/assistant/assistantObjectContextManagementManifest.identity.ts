/** ASSISTANT-6:5 — Canonical immutable Manifest identity. */
import { AssistantObjectContextManagementManifestConstants } from "./assistantObjectContextManagementManifest.constants.ts";
import type { AssistantObjectContextManagementManifestIdentityMetadata } from "./assistantObjectContextManagementManifest.types.ts";

export const AssistantObjectContextManagementManifestIdentity:
AssistantObjectContextManagementManifestIdentityMetadata = Object.freeze({
  id: AssistantObjectContextManagementManifestConstants.manifestIdentifier,
  name: "Assistant Object & Context Management Manifest",
  phaseId: "ASSISTANT-6:5",
  namespace: AssistantObjectContextManagementManifestConstants.namespace,
  version: AssistantObjectContextManagementManifestConstants.version,
  status: AssistantObjectContextManagementManifestConstants.status,
  readiness: AssistantObjectContextManagementManifestConstants.readiness,
  sourceValidation: "ASSISTANT-6:4/ObjectContextManagementValidation",
  metadataOnly: true,
  immutable: true,
});

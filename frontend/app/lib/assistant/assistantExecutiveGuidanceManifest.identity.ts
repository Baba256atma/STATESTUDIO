/** ASSISTANT-4:5 — Canonical immutable Manifest identity. */
import { AssistantExecutiveGuidanceManifestConstants } from "./assistantExecutiveGuidanceManifest.constants.ts";
import type { AssistantExecutiveGuidanceManifestIdentityMetadata } from "./assistantExecutiveGuidanceManifest.types.ts";

export const AssistantExecutiveGuidanceManifestIdentity:
AssistantExecutiveGuidanceManifestIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidanceManifestConstants.manifestIdentifier,
  name: "Assistant Executive Guidance Manifest",
  phaseId: "ASSISTANT-4:5",
  namespace: AssistantExecutiveGuidanceManifestConstants.namespace,
  version: AssistantExecutiveGuidanceManifestConstants.version,
  status: AssistantExecutiveGuidanceManifestConstants.status,
  readiness: AssistantExecutiveGuidanceManifestConstants.readiness,
  sourceValidation: "ASSISTANT-4:4/ExecutiveGuidanceValidation",
  metadataOnly: true,
  immutable: true,
});

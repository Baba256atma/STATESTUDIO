/** ASSISTANT-2:5 — Canonical immutable Manifest identity. */
import { AssistantExecutiveMemoryManifestConstants } from "./assistantExecutiveMemoryManifest.constants.ts";
import type { AssistantExecutiveMemoryManifestIdentityMetadata } from "./assistantExecutiveMemoryManifest.types.ts";

export const AssistantExecutiveMemoryManifestIdentity:
AssistantExecutiveMemoryManifestIdentityMetadata = Object.freeze({
  id: AssistantExecutiveMemoryManifestConstants.manifestIdentifier,
  name: "Assistant Executive Memory Manifest",
  phaseId: "ASSISTANT-2:5",
  namespace: AssistantExecutiveMemoryManifestConstants.namespace,
  version: AssistantExecutiveMemoryManifestConstants.version,
  status: AssistantExecutiveMemoryManifestConstants.status,
  readiness: AssistantExecutiveMemoryManifestConstants.readiness,
  sourceValidation: "ASSISTANT-2:4/ExecutiveMemoryValidation",
  metadataOnly: true,
  immutable: true,
});

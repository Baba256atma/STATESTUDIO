/** ASSISTANT-2:6 — Canonical immutable Platform identity. */
import { AssistantExecutiveMemoryPlatformConstants } from "./assistantExecutiveMemoryPlatform.constants.ts";
import type { AssistantExecutiveMemoryPlatformIdentityMetadata } from "./assistantExecutiveMemoryPlatform.types.ts";

export const AssistantExecutiveMemoryPlatformIdentity:
AssistantExecutiveMemoryPlatformIdentityMetadata = Object.freeze({
  id: AssistantExecutiveMemoryPlatformConstants.platformIdentifier,
  name: "Assistant Executive Memory Platform",
  phaseId: "ASSISTANT-2:6",
  namespace: AssistantExecutiveMemoryPlatformConstants.namespace,
  version: AssistantExecutiveMemoryPlatformConstants.version,
  status: AssistantExecutiveMemoryPlatformConstants.status,
  readiness: AssistantExecutiveMemoryPlatformConstants.readiness,
  sourceManifest: "ASSISTANT-2:5/ExecutiveMemoryManifest",
  metadataOnly: true,
  immutable: true,
});

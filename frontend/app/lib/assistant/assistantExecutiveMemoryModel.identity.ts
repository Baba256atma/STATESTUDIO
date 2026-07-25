/** ASSISTANT-2:3 — Canonical immutable Executive Memory Model identity. */
import { AssistantExecutiveMemoryModelConstants } from "./assistantExecutiveMemoryModel.constants.ts";
import type { AssistantExecutiveMemoryModelIdentityMetadata } from "./assistantExecutiveMemoryModel.types.ts";

export const AssistantExecutiveMemoryModelIdentity:
AssistantExecutiveMemoryModelIdentityMetadata = Object.freeze({
  id: AssistantExecutiveMemoryModelConstants.modelIdentifier,
  name: "Assistant Executive Memory Model",
  phaseId: "ASSISTANT-2:3",
  namespace: AssistantExecutiveMemoryModelConstants.namespace,
  version: AssistantExecutiveMemoryModelConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveMemoryModelConstants.status,
  readiness: AssistantExecutiveMemoryModelConstants.readiness,
  sourceRegistry: "ASSISTANT-2:2/ExecutiveMemoryRegistry",
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-4:3 — Canonical immutable Executive Guidance Model identity. */
import { AssistantExecutiveGuidanceModelConstants } from "./assistantExecutiveGuidanceModel.constants.ts";
import type { AssistantExecutiveGuidanceModelIdentityMetadata } from "./assistantExecutiveGuidanceModel.types.ts";

export const AssistantExecutiveGuidanceModelIdentity:
AssistantExecutiveGuidanceModelIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidanceModelConstants.modelIdentifier,
  name: "Assistant Executive Guidance Model",
  phaseId: "ASSISTANT-4:3",
  namespace: AssistantExecutiveGuidanceModelConstants.namespace,
  version: AssistantExecutiveGuidanceModelConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveGuidanceModelConstants.status,
  readiness: AssistantExecutiveGuidanceModelConstants.readiness,
  sourceRegistry: "ASSISTANT-4:2/ExecutiveGuidanceRegistry",
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-4:7 — Canonical immutable Certification identity. */
import { AssistantExecutiveGuidanceCertificationConstants } from "./assistantExecutiveGuidanceCertification.constants.ts";
import type { AssistantExecutiveGuidanceCertificationIdentityMetadata } from "./assistantExecutiveGuidanceCertification.types.ts";

export const AssistantExecutiveGuidanceCertificationIdentity:
AssistantExecutiveGuidanceCertificationIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidanceCertificationConstants.certificationIdentifier,
  name: "Assistant Executive Guidance Certification",
  phaseId: "ASSISTANT-4:7",
  namespace: AssistantExecutiveGuidanceCertificationConstants.namespace,
  version: AssistantExecutiveGuidanceCertificationConstants.version,
  status: AssistantExecutiveGuidanceCertificationConstants.status,
  readiness: AssistantExecutiveGuidanceCertificationConstants.readiness,
  sourcePlatform: "ASSISTANT-4:6/ExecutiveGuidancePlatform",
  metadataOnly: true,
  immutable: true,
});

/** ASSISTANT-6:7 — Canonical immutable Certification identity. */
import { AssistantObjectContextManagementCertificationConstants } from "./assistantObjectContextManagementCertification.constants.ts";
import type { AssistantObjectContextManagementCertificationIdentityMetadata } from "./assistantObjectContextManagementCertification.types.ts";

export const AssistantObjectContextManagementCertificationIdentity:
AssistantObjectContextManagementCertificationIdentityMetadata =
  Object.freeze({
    id: AssistantObjectContextManagementCertificationConstants
      .certificationIdentifier,
    name: "Assistant Object & Context Management Certification",
    phaseId: "ASSISTANT-6:7",
    namespace:
      AssistantObjectContextManagementCertificationConstants.namespace,
    version: AssistantObjectContextManagementCertificationConstants.version,
    status: AssistantObjectContextManagementCertificationConstants.status,
    readiness:
      AssistantObjectContextManagementCertificationConstants.readiness,
    sourcePlatform: "ASSISTANT-6:6/ObjectContextManagementPlatform",
    metadataOnly: true,
    immutable: true,
  });

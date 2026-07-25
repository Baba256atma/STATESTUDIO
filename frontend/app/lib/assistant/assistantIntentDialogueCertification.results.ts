/** ASSISTANT-3:7 — Immutable declared Certification result metadata. */
import { AssistantIntentDialogueCertificationConstants } from "./assistantIntentDialogueCertification.constants.ts";
import type { AssistantIntentDialogueCertificationResultMetadata } from "./assistantIntentDialogueCertification.types.ts";

export const AssistantIntentDialogueCertificationResults:
AssistantIntentDialogueCertificationResultMetadata = Object.freeze({
  certificationStatus: "Certified",
  criteriaCount: AssistantIntentDialogueCertificationConstants.criteriaCount,
  gateCount: AssistantIntentDialogueCertificationConstants.gateCount,
  passed: AssistantIntentDialogueCertificationConstants.criteriaCount,
  failed: 0,
  warnings: 0,
  readiness: "ReadyForFreeze",
  freezeEligibility: "Eligible",
  metadataOnly: true,
  immutable: true,
});

/** EX-3:4 immutable Validation metadata, decisions, and contracts. */

import { ExecutiveTimelineExperienceModel } from "./executiveTimelineExperienceModel.ts";
import {
  ExecutiveTimelineExperienceValidationId,
  ExecutiveTimelineExperienceValidationIdentity,
  ExecutiveTimelineExperienceValidationNamespace,
  ExecutiveTimelineExperienceValidationReadiness,
  ExecutiveTimelineExperienceValidationStatus,
  ExecutiveTimelineExperienceValidationVersion,
} from "./executiveTimelineExperienceValidationIdentity.ts";
import {
  ExecutiveTimelineExperienceValidationCategoryCount,
  ExecutiveTimelineExperienceValidationRuleCount,
} from "./executiveTimelineExperienceValidationRules.ts";

export const ExecutiveTimelineExperienceValidationDecisions = Object.freeze([
  Object.freeze({
    decisionId: "EX-3:4/D-19" as const,
    order: 1,
    statement:
      "Validation remains metadata-only and introduces no validation engine." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:4/D-20" as const,
    order: 2,
    statement:
      "Exact ReadyForValidation EX-3:3 Model is the sole upstream dependency." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:4/D-21" as const,
    order: 3,
    statement:
      "Twelve categories and thirty-six rules describe Validation metadata only." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:4/D-22" as const,
    order: 4,
    statement:
      "Evidence references Model, Registry, and Foundation identities read-only." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:4/D-23" as const,
    order: 5,
    statement:
      "ReadyForManifest does not authorize EX-3:5 Manifest implementation." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:4/D-24" as const,
    order: 6,
    statement:
      "Rendering, RTC, persistence, and synchronization runtimes remain prohibited." as const,
  }),
] as const);

export const ExecutiveTimelineExperienceValidationContracts = Object.freeze([
  Object.freeze({
    contractId: "EX-3:4/Contract/Upstream" as const,
    order: 1,
    subject: "Validation consumes only the exact EX-3:3 Model aggregate." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:4/Contract/Rules" as const,
    order: 2,
    subject:
      "Thirty-six rules remain descriptive and non-executable." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:4/Contract/Categories" as const,
    order: 3,
    subject:
      "Twelve categories group Validation rules without engines." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:4/Contract/Evidence" as const,
    order: 4,
    subject: "Evidence remains immutable and read-only." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:4/Contract/Readiness" as const,
    order: 5,
    subject:
      "ReadyForManifest does not authorize Manifest, rendering, or RTC." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:4/Contract/Manifest" as const,
    order: 6,
    subject:
      "Validation manifest publishes safe counts and dependency metadata only." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);

export const ExecutiveTimelineExperienceValidationMetadata = Object.freeze({
  validationIdentity: ExecutiveTimelineExperienceValidationId,
  identity: ExecutiveTimelineExperienceValidationIdentity,
  namespace: ExecutiveTimelineExperienceValidationNamespace,
  version: ExecutiveTimelineExperienceValidationVersion,
  status: ExecutiveTimelineExperienceValidationStatus,
  readiness: ExecutiveTimelineExperienceValidationReadiness,
  ruleCount: ExecutiveTimelineExperienceValidationRuleCount,
  categoryCount: ExecutiveTimelineExperienceValidationCategoryCount,
  upstreamReference: ExecutiveTimelineExperienceModel.identity.id,
  upstreamModel: ExecutiveTimelineExperienceModel,
  upstreamModelIdentity: ExecutiveTimelineExperienceModel.identity.id,
  upstreamModelReadiness: ExecutiveTimelineExperienceModel.readiness,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  decisions: ExecutiveTimelineExperienceValidationDecisions,
  contracts: ExecutiveTimelineExperienceValidationContracts,
  readyForManifestAuthorizesEx35: false as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
});

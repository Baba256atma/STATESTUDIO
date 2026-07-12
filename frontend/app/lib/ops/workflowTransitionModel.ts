import { WorkflowIdentityModel } from "./workflowIdentityModel.ts";
import type { WorkflowTransitionDescriptor } from "./workflowModelTypes.ts";

const metadata = WorkflowIdentityModel.metadata;

export const WorkflowTransitionModel = Object.freeze([
  Object.freeze({
    transitionId: "defined-to-sequenced",
    fromStage: "defined",
    toStage: "sequenced",
    transitionCategory: "Sequential",
    transitionConditionMetadata: Object.freeze([
      "TaskLinksEstablished",
      "StageOrderRecorded",
    ]),
    transitionConfidenceMetadata: Object.freeze([
      "Validated",
      "DeterministicMetadata",
    ]),
    metadata,
  } as const satisfies WorkflowTransitionDescriptor),
  Object.freeze({
    transitionId: "sequenced-to-approved",
    fromStage: "sequenced",
    toStage: "approved",
    transitionCategory: "ApprovalGate",
    transitionConditionMetadata: Object.freeze([
      "ApprovalMetadataDeclared",
      "DependencyReviewCompleted",
    ]),
    transitionConfidenceMetadata: Object.freeze([
      "GovernanceReviewed",
      "MetadataComplete",
    ]),
    metadata,
  } as const satisfies WorkflowTransitionDescriptor),
  Object.freeze({
    transitionId: "approved-to-ready",
    fromStage: "approved",
    toStage: "ready",
    transitionCategory: "Conditional",
    transitionConditionMetadata: Object.freeze([
      "ApprovalsSatisfied",
      "ReadinessSignalsHealthy",
    ]),
    transitionConfidenceMetadata: Object.freeze([
      "ReleaseCompatible",
      "TaskPlatformAligned",
    ]),
    metadata,
  } as const satisfies WorkflowTransitionDescriptor),
  Object.freeze({
    transitionId: "ready-to-cataloged",
    fromStage: "ready",
    toStage: "cataloged",
    transitionCategory: "Parallel",
    transitionConditionMetadata: Object.freeze([
      "PublicationMetadataPrepared",
      "ConsumerSurfaceDeclared",
    ]),
    transitionConfidenceMetadata: Object.freeze([
      "PublicApiStable",
      "ConsumerReady",
    ]),
    metadata,
  } as const satisfies WorkflowTransitionDescriptor),
] as const);

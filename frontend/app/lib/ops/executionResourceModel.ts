import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionResource } from "./executionModelTypes.ts";

export const ExecutionResourceModel = Object.freeze({
  identifier: "execution-resource-model",
  displayName: "Execution Resource Model",
  description: "Canonical metadata model for execution resources.",
  category: "Resource",
  status: "Modeled",
  resourceIdentity: "ExecutiveExecutionResource",
  resourceCategory: "OperationalCapacity",
  capacityMetadata: Object.freeze([
    "AvailableCapacity",
    "ReservedCapacity",
  ]),
  allocationMetadata: Object.freeze([
    "AssignedAllocation",
    "PlannedAllocation",
  ]),
  availabilityMetadata: Object.freeze([
    "AvailabilityWindow",
    "ConstraintWindow",
  ]),
  metadata: Object.freeze({
    phaseId: "OPS-1:3",
    platformId: ExecutionPlatformMetadata.platformId,
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
    registryCapabilityId: "cap-resource-intelligence",
    domainId: "resource-intelligence",
  }),
} as const satisfies ExecutionResource);

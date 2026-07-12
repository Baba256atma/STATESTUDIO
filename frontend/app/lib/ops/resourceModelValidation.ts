import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ResourcePlatformMetadata } from "./resourceMetadataIndex.ts";
import { ResourceAvailabilityModel } from "./resourceAvailabilityModel.ts";
import { ResourceCapabilityModel } from "./resourceCapabilityModel.ts";
import { ResourceCapacityModel } from "./resourceCapacityModel.ts";
import { ResourceCostModel } from "./resourceCostModel.ts";
import { ResourceDependencyModel } from "./resourceDependencyModel.ts";
import { ResourceIdentityModel } from "./resourceIdentityModel.ts";
import { ResourceLinkageModel } from "./resourceLinkageModel.ts";
import { ResourceLocationModel } from "./resourceLocationModel.ts";
import { buildResourceModelManifest } from "./resourceModelManifest.ts";
import { ResourceOwnershipModel } from "./resourceOwnershipModel.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "resource-model-completeness",
      name: "Model Completeness",
      status:
        ResourceIdentityModel.resourceClassification.length === 8 &&
        ResourceLinkageModel.executionReadinessSupport.length === 2
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-identity-metadata-exists",
      name: "Identity Metadata Exists",
      status: ResourceIdentityModel.resourceIdPattern.length > 0 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-capacity-metadata-exists",
      name: "Capacity Metadata Exists",
      status: ResourceCapacityModel.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-availability-metadata-exists",
      name: "Availability Metadata Exists",
      status: ResourceAvailabilityModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-ownership-metadata-exists",
      name: "Ownership Metadata Exists",
      status: ResourceOwnershipModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-cost-metadata-exists",
      name: "Cost Metadata Exists",
      status: ResourceCostModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-capability-metadata-exists",
      name: "Capability Metadata Exists",
      status: ResourceCapabilityModel.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-location-metadata-exists",
      name: "Location Metadata Exists",
      status: ResourceLocationModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-dependency-metadata-exists",
      name: "Dependency Metadata Exists",
      status: ResourceDependencyModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-linkage-metadata-exists",
      name: "Linkage Metadata Exists",
      status:
        ResourceLinkageModel.linkedProjects.length === 2 &&
        ResourceLinkageModel.linkedWorkflows.length === 2 &&
        ResourceLinkageModel.linkedTasks.length === 2
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-builds",
      name: "Manifest Builds",
      status:
        Object.isFrozen(buildResourceModelManifest()) &&
        buildResourceModelManifest().compatibility.compatibilityVersion ===
          ResourcePlatformMetadata.compatibilityVersion
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ResourceIdentityModel) &&
        Object.isFrozen(ResourceCapacityModel) &&
        Object.isFrozen(ResourceAvailabilityModel) &&
        Object.isFrozen(ResourceOwnershipModel) &&
        Object.isFrozen(ResourceCostModel) &&
        Object.isFrozen(ResourceCapabilityModel) &&
        Object.isFrozen(ResourceLocationModel) &&
        Object.isFrozen(ResourceDependencyModel) &&
        Object.isFrozen(ResourceLinkageModel)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-deterministic-output",
      name: "Deterministic Output",
      status:
        JSON.stringify(buildResourceModelManifest()) ===
        JSON.stringify(buildResourceModelManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-ops-2-compatibility",
      name: "OPS-2 Compatibility",
      status: ResourceLinkageModel.metadata.sourceDependencies.includes(
        ExecutiveTaskIntelligencePublicIndexId,
      )
        ? "PASS"
        : "FAIL",
    }),
    Object.freeze({
      id: "resource-ops-3-compatibility",
      name: "OPS-3 Compatibility",
      status: ResourceLinkageModel.metadata.sourceDependencies.includes(
        ExecutiveWorkflowIntelligencePublicIndexId,
      )
        ? "PASS"
        : "FAIL",
    }),
    Object.freeze({
      id: "resource-ops-4-compatibility",
      name: "OPS-4 Compatibility",
      status: ResourceLinkageModel.metadata.sourceDependencies.includes(
        ExecutiveProjectExecutionPublicIndexId,
      )
        ? "PASS"
        : "FAIL",
    }),
  ] as const);

export const validateResourceModel = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

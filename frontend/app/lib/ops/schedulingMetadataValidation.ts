import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligencePublicIndexId } from "./executiveResourceIntelligencePublicIndex.ts";
import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
import {
  SchedulingCapabilityRegistry,
  SchedulingCapabilityRegistryMetadata,
} from "./schedulingCapabilityRegistry.ts";
import {
  SchedulingConsumerRegistry,
  SchedulingConsumerRegistryMetadata,
} from "./schedulingConsumerRegistry.ts";
import {
  SchedulingDependencyRegistry,
  SchedulingDependencyRegistryMetadata,
} from "./schedulingDependencyRegistry.ts";
import {
  SchedulingPlatformMetadata,
  SchedulingSupportedDomains,
} from "./schedulingMetadata.ts";
import { buildSchedulingMetadataManifest } from "./schedulingMetadataManifest.ts";
import {
  SchedulingPublicApiRegistry,
  SchedulingPublicApiRegistryMetadata,
} from "./schedulingPublicApiRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "scheduling-metadata-completeness",
      name: "Metadata Completeness",
      status:
        SchedulingPlatformMetadata.supportedSchedulingDomains.length === 9
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-registry-integrity",
      name: "Registry Integrity",
      status:
        SchedulingCapabilityRegistry.length ===
        SchedulingCapabilityRegistryMetadata.capabilityCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-dependency-consistency",
      name: "Dependency Consistency",
      status:
        SchedulingDependencyRegistry.length ===
          SchedulingDependencyRegistryMetadata.dependencyCount &&
        SchedulingDependencyRegistry.every(
          (entry) => entry.dependencyMode === "MetadataOnly",
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-consumer-registry-integrity",
      name: "Consumer Registry Integrity",
      status:
        SchedulingConsumerRegistry.length ===
        SchedulingConsumerRegistryMetadata.consumerCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-public-api-registry-integrity",
      name: "Public API Registry Integrity",
      status:
        SchedulingPublicApiRegistry.length ===
          SchedulingPublicApiRegistryMetadata.exportedApiCount &&
        SchedulingPublicApiRegistry.length >= 9
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-generation",
      name: "Manifest Generation",
      status:
        Object.isFrozen(buildSchedulingMetadataManifest()) &&
        buildSchedulingMetadataManifest().metadata.supportedSchedulingDomains.length ===
          SchedulingSupportedDomains.length
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ExecutiveSchedulingIntelligenceFoundation) &&
        Object.isFrozen(SchedulingPlatformMetadata) &&
        Object.isFrozen(SchedulingCapabilityRegistry) &&
        Object.isFrozen(SchedulingPublicApiRegistry)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-2-compatibility",
      name: "OPS-2 Compatibility",
      status:
        ExecutiveSchedulingIntelligenceFoundation.identity.dependencySources.includes(
          ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-3-compatibility",
      name: "OPS-3 Compatibility",
      status:
        ExecutiveSchedulingIntelligenceFoundation.identity.dependencySources.includes(
          ExecutiveWorkflowIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-4-compatibility",
      name: "OPS-4 Compatibility",
      status:
        ExecutiveSchedulingIntelligenceFoundation.identity.dependencySources.includes(
          ExecutiveProjectExecutionPublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-5-compatibility",
      name: "OPS-5 Compatibility",
      status:
        ExecutiveSchedulingIntelligenceFoundation.identity.dependencySources.includes(
          ExecutiveResourceIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateSchedulingMetadata = () => {
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

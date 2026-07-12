import { buildExecutionMetadataManifest } from "./executionMetadataManifest.ts";
import {
  ExecutionCapabilityRegistry,
  ExecutionCapabilityRegistryMetadata,
} from "./executionCapabilityRegistry.ts";
import {
  ExecutionConsumerRegistry,
  ExecutionConsumerRegistryMetadata,
} from "./executionConsumerRegistry.ts";
import {
  ExecutionDependencyRegistry,
  ExecutionDependencyRegistryMetadata,
} from "./executionDependencyRegistry.ts";
import {
  ExecutionPlatformMetadata,
  ExecutionSupportedExecutionDomains,
} from "./executionMetadata.ts";
import {
  ExecutionPublicApiRegistry,
  ExecutionPublicApiRegistryMetadata,
} from "./executionPublicApiRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "metadata-completeness",
      name: "Metadata Completeness",
      status:
        ExecutionPlatformMetadata.supportedExecutionDomains.length === 8
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "registry-integrity",
      name: "Registry Integrity",
      status:
        ExecutionCapabilityRegistry.length ===
        ExecutionCapabilityRegistryMetadata.capabilityCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "dependency-consistency",
      name: "Dependency Consistency",
      status:
        ExecutionDependencyRegistry.length ===
          ExecutionDependencyRegistryMetadata.dependencyCount &&
        ExecutionDependencyRegistry.every(
          (entry) => entry.futurePhaseDependencies.length >= 2,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "consumer-registry",
      name: "Consumer Registry",
      status:
        ExecutionConsumerRegistry.length ===
        ExecutionConsumerRegistryMetadata.consumerCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "public-api-registry",
      name: "Public API Registry",
      status:
        ExecutionPublicApiRegistry.length ===
          ExecutionPublicApiRegistryMetadata.exportedApiCount &&
        ExecutionPublicApiRegistry.length >= 9
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "manifest-generation",
      name: "Manifest Generation",
      status:
        Object.isFrozen(buildExecutionMetadataManifest()) &&
        buildExecutionMetadataManifest().metadata.supportedExecutionDomains.length ===
          ExecutionSupportedExecutionDomains.length
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateExecutionMetadata = () => {
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
      deterministic: true,
      immutable: true,
    }),
    metadataOnly: true,
    deterministic: true,
    immutable: true,
  } as const);
};

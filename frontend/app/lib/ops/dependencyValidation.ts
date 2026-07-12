import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import {
  ExecutiveDependencyRegistry,
} from "./dependencyRegistryIndex.ts";
import {
  ExecutiveDependencyModel,
} from "./dependencyModelIndex.ts";
import type {
  DependencyValidationResult,
  DependencyValidationRule,
  DependencyValidationSummary,
} from "./dependencyValidationTypes.ts";

const buildResult = (checks: readonly DependencyValidationRule[]) => {
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  const failedChecks = checks.length - passedChecks;

  return Object.freeze({
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL",
    checks,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies DependencyValidationResult);
};

export const validateDependencyFoundation = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "dependency-foundation-contracts-present",
        name: "Contracts Present",
        description: "Validates dependency foundation contracts are available.",
        category: "Foundation",
        status:
          ExecutiveDependencyIntelligenceFoundation.contracts.all.length === 3
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-foundation-registry-present",
        name: "Registry Present",
        description: "Validates dependency foundation registry is available.",
        category: "Foundation",
        status:
          ExecutiveDependencyIntelligenceFoundation.registry.platformId === "OPS-7:1"
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-foundation-metadata-present",
        name: "Metadata Present",
        description: "Validates dependency foundation metadata is available.",
        category: "Foundation",
        status:
          ExecutiveDependencyIntelligenceFoundation.metadata
            .supportedDependencyCategories.length >= 8
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateDependencyRegistry = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "dependency-registry-entity-complete",
        name: "Entity Registry Complete",
        description: "Validates dependency entity registry completeness.",
        category: "Registry",
        status: ExecutiveDependencyRegistry.entities.length === 5 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-registry-relationship-complete",
        name: "Relationship Registry Complete",
        description: "Validates dependency relationship registry completeness.",
        category: "Registry",
        status:
          ExecutiveDependencyRegistry.relationships.length === 9 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-registry-lifecycle-complete",
        name: "Lifecycle Registry Complete",
        description: "Validates dependency lifecycle registry completeness.",
        category: "Registry",
        status:
          ExecutiveDependencyRegistry.lifecycle.length === 4 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateDependencyModel = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "dependency-model-node-complete",
        name: "Node Model Complete",
        description: "Validates dependency node model completeness.",
        category: "Model",
        status: ExecutiveDependencyModel.nodes.length === 5 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-model-edge-complete",
        name: "Edge Model Complete",
        description: "Validates dependency edge model completeness.",
        category: "Model",
        status: ExecutiveDependencyModel.edges.length === 4 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-model-graph-complete",
        name: "Graph Model Complete",
        description: "Validates dependency graph model completeness.",
        category: "Model",
        status: ExecutiveDependencyModel.graph.length === 1 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-model-impact-complete",
        name: "Impact Model Complete",
        description: "Validates dependency impact model completeness.",
        category: "Model",
        status: ExecutiveDependencyModel.impact.length === 7 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateDependencyPlatform = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "dependency-platform-immutable-exports",
        name: "Immutable Exports",
        description: "Validates immutable dependency exports.",
        category: "Platform",
        status:
          Object.isFrozen(ExecutiveDependencyIntelligenceFoundation) &&
          Object.isFrozen(ExecutiveDependencyRegistry) &&
          Object.isFrozen(ExecutiveDependencyModel)
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-platform-deterministic-metadata",
        name: "Deterministic Metadata",
        description: "Validates deterministic metadata outputs.",
        category: "Platform",
        status:
          ExecutiveDependencyIntelligenceFoundation.deterministic &&
          ExecutiveDependencyRegistry.deterministic &&
          ExecutiveDependencyModel.deterministic
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-platform-readonly-structures",
        name: "Readonly Structures",
        description: "Validates readonly dependency structures.",
        category: "Platform",
        status:
          ExecutiveDependencyRegistry.metadata.readonlyStatus === "Readonly" &&
          ExecutiveDependencyModel.metadata.readonlyStatus === "Readonly"
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-platform-public-api-integrity",
        name: "Public API Integrity",
        description: "Validates public API integrity across dependency layers.",
        category: "Platform",
        status:
          ExecutiveDependencyIntelligenceFoundation.contracts.all.length === 3 &&
          ExecutiveDependencyRegistry.summary.status === "PASS" &&
          ExecutiveDependencyModel.summary.status === "PASS"
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "dependency-platform-metadata-only-compliance",
        name: "Metadata-only Compliance",
        description: "Validates metadata-only compliance across dependency layers.",
        category: "Platform",
        status:
          ExecutiveDependencyIntelligenceFoundation.metadataOnly &&
          ExecutiveDependencyRegistry.metadataOnly &&
          ExecutiveDependencyModel.metadataOnly
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateExecutiveDependencyPlatform = () => {
  const checks = Object.freeze([
    ...validateDependencyFoundation().checks,
    ...validateDependencyRegistry().checks,
    ...validateDependencyModel().checks,
    ...validateDependencyPlatform().checks,
  ] as const);

  return buildResult(checks);
};

export const getDependencyValidationSummary = () =>
  Object.freeze({
    totalChecks: validateExecutiveDependencyPlatform().totalChecks,
    passedChecks: validateExecutiveDependencyPlatform().passedChecks,
    failedChecks: validateExecutiveDependencyPlatform().failedChecks,
    status: validateExecutiveDependencyPlatform().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies DependencyValidationSummary);

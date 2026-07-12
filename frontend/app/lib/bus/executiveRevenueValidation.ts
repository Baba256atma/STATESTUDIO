import {
  ExecutiveRevenueContractNamespace,
  ExecutiveRevenueContracts,
  ExecutiveRevenuePlatformName,
} from "./executiveRevenueContracts.ts";
import {
  ExecutiveRevenueDriverRegistry,
  ExecutiveRevenueForecastRegistry,
  ExecutiveRevenueMetricRegistry,
  ExecutiveRevenueOpportunityRegistry,
  ExecutiveRevenueRegistry,
  ExecutiveRevenueRiskRegistry,
  ExecutiveRevenueSourceRegistry,
  ExecutiveRevenueStreamRegistry,
  ExecutiveRevenueSummaryRegistry,
  ExecutiveRevenueTargetRegistry,
} from "./executiveRevenueRegistry.ts";
import {
  ExecutiveRevenueModel,
  ExecutiveRevenueModelDependencyGraph,
  ExecutiveRevenueModelRelationships,
} from "./executiveRevenueModel.ts";

export const ExecutiveRevenueValidationId = "executive-revenue-validation" as const;

export const ExecutiveRevenueValidationVersion = "1.0.0" as const;

export const ExecutiveRevenueValidationNamespace = `${ExecutiveRevenueContractNamespace}.validation` as const;

export const ExecutiveRevenueValidationDescription =
  "Canonical metadata-only structural completeness validation layer for executive revenue intelligence." as const;

export const ExecutiveRevenueValidationChecklist = Object.freeze([
  "platform identity",
  "registry availability",
  "model availability",
  "source registry",
  "stream registry",
  "metric registry",
  "driver registry",
  "opportunity registry",
  "risk registry",
  "forecast registry",
  "target registry",
  "summary registry",
  "relationship availability",
  "dependency graph availability",
] as const);

function buildValidationEntry(
  id: string,
  name: string,
  description: string,
  valid: boolean,
) {
  return Object.freeze({
    id,
    name,
    description,
    status: valid ? "Passed" : "Failed",
    metadataOnly: true,
    immutable: true,
  });
}

export const ExecutiveRevenueValidationRules = Object.freeze([
  buildValidationEntry(
    "revenue-validation-platform-identity",
    "Platform Identity",
    "Checks that the executive revenue platform identity exists and matches BUS-29.",
    ExecutiveRevenueContracts.platformId === "BUS-29" &&
      ExecutiveRevenueContracts.platformName === ExecutiveRevenuePlatformName,
  ),
  buildValidationEntry(
    "revenue-validation-registry-availability",
    "Registry Availability",
    "Checks that the combined executive revenue registry exists.",
    ExecutiveRevenueRegistry.metadataOnly && ExecutiveRevenueRegistry.immutable,
  ),
  buildValidationEntry(
    "revenue-validation-model-availability",
    "Model Availability",
    "Checks that the executive revenue model exists.",
    ExecutiveRevenueModel.metadataOnly && ExecutiveRevenueModel.immutable,
  ),
  buildValidationEntry(
    "revenue-validation-source-registry",
    "Source Registry",
    "Checks that the revenue source registry contains entries.",
    ExecutiveRevenueSourceRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-stream-registry",
    "Stream Registry",
    "Checks that the revenue stream registry contains entries.",
    ExecutiveRevenueStreamRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-metric-registry",
    "Metric Registry",
    "Checks that the revenue metric registry contains entries.",
    ExecutiveRevenueMetricRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-driver-registry",
    "Driver Registry",
    "Checks that the revenue driver registry contains entries.",
    ExecutiveRevenueDriverRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-opportunity-registry",
    "Opportunity Registry",
    "Checks that the revenue opportunity registry contains entries.",
    ExecutiveRevenueOpportunityRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-risk-registry",
    "Risk Registry",
    "Checks that the revenue risk registry contains entries.",
    ExecutiveRevenueRiskRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-forecast-registry",
    "Forecast Registry",
    "Checks that the revenue forecast registry contains entries.",
    ExecutiveRevenueForecastRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-target-registry",
    "Target Registry",
    "Checks that the revenue target registry contains entries.",
    ExecutiveRevenueTargetRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-summary-registry",
    "Summary Registry",
    "Checks that the revenue summary registry contains entries.",
    ExecutiveRevenueSummaryRegistry.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-relationship-availability",
    "Relationship Availability",
    "Checks that relationship metadata exists for all structural connection groups.",
    ExecutiveRevenueModelRelationships.sourceToStream.length > 0 &&
      ExecutiveRevenueModelRelationships.streamToMetric.length > 0 &&
      ExecutiveRevenueModelRelationships.metricToDriver.length > 0 &&
      ExecutiveRevenueModelRelationships.driverToOpportunity.length > 0 &&
      ExecutiveRevenueModelRelationships.driverToRisk.length > 0 &&
      ExecutiveRevenueModelRelationships.forecastToTarget.length > 0 &&
      ExecutiveRevenueModelRelationships.targetToSummary.length > 0,
  ),
  buildValidationEntry(
    "revenue-validation-dependency-graph",
    "Dependency Graph Availability",
    "Checks that the dependency graph contains nodes and edges.",
    ExecutiveRevenueModelDependencyGraph.nodes.length > 0 &&
      ExecutiveRevenueModelDependencyGraph.edges.length > 0,
  ),
] as const);

export const ExecutiveRevenueValidationMatrix = Object.freeze({
  checks: ExecutiveRevenueValidationChecklist,
  rules: ExecutiveRevenueValidationRules,
  totalChecks: ExecutiveRevenueValidationChecklist.length,
  passedChecks: ExecutiveRevenueValidationRules.filter((rule) => rule.status === "Passed").length,
  failedChecks: ExecutiveRevenueValidationRules.filter((rule) => rule.status === "Failed").length,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueValidationResult = Object.freeze({
  validationId: ExecutiveRevenueValidationId,
  validationVersion: ExecutiveRevenueValidationVersion,
  validationNamespace: ExecutiveRevenueValidationNamespace,
  validationDescription: ExecutiveRevenueValidationDescription,
  structurallyComplete: ExecutiveRevenueValidationMatrix.failedChecks === 0,
  checklist: ExecutiveRevenueValidationChecklist,
  matrix: ExecutiveRevenueValidationMatrix,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueValidationFoundation = Object.freeze({
  ExecutiveRevenueValidationId,
  ExecutiveRevenueValidationVersion,
  ExecutiveRevenueValidationNamespace,
  ExecutiveRevenueValidationDescription,
  ExecutiveRevenueValidationChecklist,
  ExecutiveRevenueValidationRules,
  ExecutiveRevenueValidationMatrix,
  ExecutiveRevenueValidationResult,
  metadataOnly: true,
  immutable: true,
});

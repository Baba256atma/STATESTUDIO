import {
  ExecutiveRevenueContractNamespace,
  ExecutiveRevenueContractVersion,
} from "./executiveRevenueContracts.ts";
import {
  ExecutiveRevenueDriverRegistry,
  ExecutiveRevenueForecastRegistry,
  ExecutiveRevenueMetricRegistry,
  ExecutiveRevenueOpportunityRegistry,
  ExecutiveRevenueRiskRegistry,
  ExecutiveRevenueSourceRegistry,
  ExecutiveRevenueStreamRegistry,
  ExecutiveRevenueSummaryRegistry,
  ExecutiveRevenueTargetRegistry,
} from "./executiveRevenueRegistry.ts";

export const ExecutiveRevenueModelId = "executive-revenue-model" as const;

export const ExecutiveRevenueModelVersion = "1.0.0" as const;

export const ExecutiveRevenueModelNamespace = `${ExecutiveRevenueContractNamespace}.model` as const;

export const ExecutiveRevenueModelDescription =
  "Canonical metadata-only relationship and dependency model for executive revenue intelligence." as const;

export const ExecutiveRevenueModelRelationships = Object.freeze({
  sourceToStream: Object.freeze(
    ExecutiveRevenueStreamRegistry.map((stream) =>
      Object.freeze({
        sourceId: stream.sourceId,
        streamId: stream.streamId,
        relationshipType: "revenue-source-to-stream",
        metadataOnly: true,
        immutable: true,
      }),
    ),
  ),
  streamToMetric: Object.freeze([
    Object.freeze({
      streamId: "revenue-stream-product-recurring",
      metricId: "revenue-metric-total-revenue",
      relationshipType: "revenue-stream-to-metric",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      streamId: "revenue-stream-subscription-annual",
      metricId: "revenue-metric-recurring-revenue",
      relationshipType: "revenue-stream-to-metric",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      streamId: "revenue-stream-consulting-advisory",
      metricId: "revenue-metric-arpc",
      relationshipType: "revenue-stream-to-metric",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      streamId: "revenue-stream-partner-referral",
      metricId: "revenue-metric-expansion-revenue",
      relationshipType: "revenue-stream-to-metric",
      metadataOnly: true,
      immutable: true,
    }),
  ] as const),
  metricToDriver: Object.freeze([
    Object.freeze({
      metricId: "revenue-metric-total-revenue",
      driverId: "revenue-driver-pricing",
      relationshipType: "metric-to-driver",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      metricId: "revenue-metric-recurring-revenue",
      driverId: "revenue-driver-retention",
      relationshipType: "metric-to-driver",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      metricId: "revenue-metric-revenue-growth",
      driverId: "revenue-driver-acquisition",
      relationshipType: "metric-to-driver",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      metricId: "revenue-metric-expansion-revenue",
      driverId: "revenue-driver-upsell",
      relationshipType: "metric-to-driver",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      metricId: "revenue-metric-churn-revenue",
      driverId: "revenue-driver-retention",
      relationshipType: "metric-to-driver",
      metadataOnly: true,
      immutable: true,
    }),
  ] as const),
  driverToOpportunity: Object.freeze([
    Object.freeze({
      driverId: "revenue-driver-market-expansion",
      opportunityId: "revenue-opportunity-enterprise-expansion",
      relationshipType: "driver-to-opportunity",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      driverId: "revenue-driver-pricing",
      opportunityId: "revenue-opportunity-pricing-optimization",
      relationshipType: "driver-to-opportunity",
      metadataOnly: true,
      immutable: true,
    }),
  ] as const),
  driverToRisk: Object.freeze([
    Object.freeze({
      driverId: "revenue-driver-retention",
      riskId: "revenue-risk-churn-acceleration",
      relationshipType: "driver-to-risk",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      driverId: "revenue-driver-pricing",
      riskId: "revenue-risk-margin-pressure",
      relationshipType: "driver-to-risk",
      metadataOnly: true,
      immutable: true,
    }),
  ] as const),
  forecastToTarget: Object.freeze([
    Object.freeze({
      forecastId: "revenue-forecast-quarterly-baseline",
      targetId: "revenue-target-fy2026-q3",
      relationshipType: "forecast-to-target",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      forecastId: "revenue-forecast-rolling-growth",
      targetId: "revenue-target-fy2026-annual",
      relationshipType: "forecast-to-target",
      metadataOnly: true,
      immutable: true,
    }),
  ] as const),
  targetToSummary: Object.freeze([
    Object.freeze({
      targetId: "revenue-target-fy2026-q3",
      summaryId: "revenue-summary-fy2026-q3",
      relationshipType: "target-to-summary",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      targetId: "revenue-target-fy2026-annual",
      summaryId: "revenue-summary-fy2026-q2",
      relationshipType: "target-to-summary",
      metadataOnly: true,
      immutable: true,
    }),
  ] as const),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueModelDependencyGraph = Object.freeze({
  nodes: Object.freeze([
    ...ExecutiveRevenueSourceRegistry.map((source) => source.id),
    ...ExecutiveRevenueStreamRegistry.map((stream) => stream.streamId),
    ...ExecutiveRevenueMetricRegistry.map((metric) => metric.metricId),
    ...ExecutiveRevenueDriverRegistry.map((driver) => driver.driverId),
    ...ExecutiveRevenueOpportunityRegistry.map((opportunity) => opportunity.opportunityId),
    ...ExecutiveRevenueRiskRegistry.map((risk) => risk.riskId),
    ...ExecutiveRevenueForecastRegistry.map((forecast) => forecast.forecastId),
    ...ExecutiveRevenueTargetRegistry.map((target) => target.targetId),
    ...ExecutiveRevenueSummaryRegistry.map((summary) => summary.summaryId),
  ]),
  edges: Object.freeze([
    ...ExecutiveRevenueModelRelationships.sourceToStream.map((entry) =>
      Object.freeze({
        from: entry.sourceId,
        to: entry.streamId,
        dependencyType: "source-stream",
        metadataOnly: true,
        immutable: true,
      }),
    ),
    ...ExecutiveRevenueModelRelationships.streamToMetric.map((entry) =>
      Object.freeze({
        from: entry.streamId,
        to: entry.metricId,
        dependencyType: "stream-metric",
        metadataOnly: true,
        immutable: true,
      }),
    ),
    ...ExecutiveRevenueModelRelationships.metricToDriver.map((entry) =>
      Object.freeze({
        from: entry.metricId,
        to: entry.driverId,
        dependencyType: "metric-driver",
        metadataOnly: true,
        immutable: true,
      }),
    ),
    ...ExecutiveRevenueModelRelationships.driverToOpportunity.map((entry) =>
      Object.freeze({
        from: entry.driverId,
        to: entry.opportunityId,
        dependencyType: "driver-opportunity",
        metadataOnly: true,
        immutable: true,
      }),
    ),
    ...ExecutiveRevenueModelRelationships.driverToRisk.map((entry) =>
      Object.freeze({
        from: entry.driverId,
        to: entry.riskId,
        dependencyType: "driver-risk",
        metadataOnly: true,
        immutable: true,
      }),
    ),
    ...ExecutiveRevenueModelRelationships.forecastToTarget.map((entry) =>
      Object.freeze({
        from: entry.forecastId,
        to: entry.targetId,
        dependencyType: "forecast-target",
        metadataOnly: true,
        immutable: true,
      }),
    ),
    ...ExecutiveRevenueModelRelationships.targetToSummary.map((entry) =>
      Object.freeze({
        from: entry.targetId,
        to: entry.summaryId,
        dependencyType: "target-summary",
        metadataOnly: true,
        immutable: true,
      }),
    ),
  ]),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueModel = Object.freeze({
  modelId: ExecutiveRevenueModelId,
  modelVersion: ExecutiveRevenueModelVersion,
  modelNamespace: ExecutiveRevenueModelNamespace,
  modelDescription: ExecutiveRevenueModelDescription,
  contractVersion: ExecutiveRevenueContractVersion,
  relationships: ExecutiveRevenueModelRelationships,
  dependencyGraph: ExecutiveRevenueModelDependencyGraph,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueModelFoundation = Object.freeze({
  ExecutiveRevenueModelId,
  ExecutiveRevenueModelVersion,
  ExecutiveRevenueModelNamespace,
  ExecutiveRevenueModelDescription,
  ExecutiveRevenueModelRelationships,
  ExecutiveRevenueModelDependencyGraph,
  ExecutiveRevenueModel,
  metadataOnly: true,
  immutable: true,
});

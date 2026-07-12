import {
  ExecutiveBusinessHealthContractDescription,
  ExecutiveBusinessHealthContractId,
  ExecutiveBusinessHealthContractVersion,
  type ExecutiveBusinessHealthCapability,
  type ExecutiveBusinessHealthDimension,
  type ExecutiveBusinessHealthDomainId,
  type ExecutiveBusinessHealthIndicator,
  type ExecutiveBusinessHealthScoreRange,
  type ExecutiveBusinessHealthSeverity,
  type ExecutiveBusinessHealthStatus,
  type ExecutiveBusinessHealthTrend,
} from "./executiveBusinessHealthIndex.ts";

const registryMetadata = Object.freeze({
  contractId: ExecutiveBusinessHealthContractId,
  contractVersion: ExecutiveBusinessHealthContractVersion,
  contractDescription: ExecutiveBusinessHealthContractDescription,
  registryId: "BUS-32:2",
  registryVersion: "1.0.0",
  registryNamespace: "nexora.bus.executive-business-health.registry",
  description: "Canonical metadata-only registry layer for executive business health intelligence.",
  tags: Object.freeze(["business-health", "registry", "metadata-only"]),
  labels: Object.freeze(["bus-32", "foundation"]),
  metadataOnly: true,
  immutable: true,
} as const);

const createMetadata = (tag: string) =>
  Object.freeze({
    contractVersion: ExecutiveBusinessHealthContractVersion,
    tags: Object.freeze(["business-health", tag]),
    labels: Object.freeze(["bus-32", "registry"]),
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessHealthRegistryMetadata = registryMetadata;

export const ExecutiveBusinessHealthDomainRegistry = Object.freeze([
  Object.freeze({
    id: "Executive" as const,
    name: "Executive",
    description: "Top-level executive leadership health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Strategy" as const,
    name: "Strategy",
    description: "Strategic alignment and planning health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Finance" as const,
    name: "Finance",
    description: "Financial stewardship and stability health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Revenue" as const,
    name: "Revenue",
    description: "Revenue performance and resilience health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Portfolio" as const,
    name: "Portfolio",
    description: "Portfolio execution and investment health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Operations" as const,
    name: "Operations",
    description: "Operational delivery and efficiency health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Customer" as const,
    name: "Customer",
    description: "Customer experience and retention health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "People" as const,
    name: "People",
    description: "Workforce capability and engagement health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Resources" as const,
    name: "Resources",
    description: "Resource availability and allocation health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Risk" as const,
    name: "Risk",
    description: "Risk posture and mitigation readiness health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Growth" as const,
    name: "Growth",
    description: "Expansion and long-term growth health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Innovation" as const,
    name: "Innovation",
    description: "Innovation pipeline and learning velocity health domain.",
    metadata: createMetadata("domain"),
  }),
  Object.freeze({
    id: "Governance" as const,
    name: "Governance",
    description: "Governance, controls, and accountability health domain.",
    metadata: createMetadata("domain"),
  }),
] as const);

export const ExecutiveBusinessHealthStatusRegistry = Object.freeze([
  Object.freeze({
    id: "Excellent" as const,
    description: "Represents materially strong business health metadata.",
    metadata: createMetadata("status"),
  }),
  Object.freeze({
    id: "Healthy" as const,
    description: "Represents healthy and well-contained business health metadata.",
    metadata: createMetadata("status"),
  }),
  Object.freeze({
    id: "Stable" as const,
    description: "Represents steady but watchable business health metadata.",
    metadata: createMetadata("status"),
  }),
  Object.freeze({
    id: "Warning" as const,
    description: "Represents business health metadata requiring executive attention.",
    metadata: createMetadata("status"),
  }),
  Object.freeze({
    id: "Critical" as const,
    description: "Represents business health metadata indicating severe concern.",
    metadata: createMetadata("status"),
  }),
] as const);

export const ExecutiveBusinessHealthTrendRegistry = Object.freeze([
  Object.freeze({
    id: "Improving" as const,
    description: "Represents upward directional health metadata.",
    metadata: createMetadata("trend"),
  }),
  Object.freeze({
    id: "Stable" as const,
    description: "Represents unchanged directional health metadata.",
    metadata: createMetadata("trend"),
  }),
  Object.freeze({
    id: "Declining" as const,
    description: "Represents downward directional health metadata.",
    metadata: createMetadata("trend"),
  }),
  Object.freeze({
    id: "Unknown" as const,
    description: "Represents unavailable directional health metadata.",
    metadata: createMetadata("trend"),
  }),
] as const);

export const ExecutiveBusinessHealthSeverityRegistry = Object.freeze([
  Object.freeze({
    id: "None" as const,
    description: "Represents absence of severity metadata.",
    metadata: createMetadata("severity"),
  }),
  Object.freeze({
    id: "Low" as const,
    description: "Represents low executive severity metadata.",
    metadata: createMetadata("severity"),
  }),
  Object.freeze({
    id: "Moderate" as const,
    description: "Represents moderate executive severity metadata.",
    metadata: createMetadata("severity"),
  }),
  Object.freeze({
    id: "High" as const,
    description: "Represents high executive severity metadata.",
    metadata: createMetadata("severity"),
  }),
  Object.freeze({
    id: "Severe" as const,
    description: "Represents severe executive severity metadata.",
    metadata: createMetadata("severity"),
  }),
] as const);

export const ExecutiveBusinessHealthScoreRangeRegistry = Object.freeze([
  Object.freeze({ id: "score-range-excellent", minimum: 90, maximum: 100, metadata: createMetadata("score-range") }),
  Object.freeze({ id: "score-range-healthy", minimum: 75, maximum: 89, metadata: createMetadata("score-range") }),
  Object.freeze({ id: "score-range-stable", minimum: 60, maximum: 74, metadata: createMetadata("score-range") }),
  Object.freeze({ id: "score-range-warning", minimum: 40, maximum: 59, metadata: createMetadata("score-range") }),
  Object.freeze({ id: "score-range-critical", minimum: 0, maximum: 39, metadata: createMetadata("score-range") }),
] as const);

const scoreRangeById = Object.freeze({
  excellent: ExecutiveBusinessHealthScoreRangeRegistry[0],
  healthy: ExecutiveBusinessHealthScoreRangeRegistry[1],
  stable: ExecutiveBusinessHealthScoreRangeRegistry[2],
  warning: ExecutiveBusinessHealthScoreRangeRegistry[3],
  critical: ExecutiveBusinessHealthScoreRangeRegistry[4],
} as const);

const createScoreRange = (range: (typeof scoreRangeById)[keyof typeof scoreRangeById]): ExecutiveBusinessHealthScoreRange =>
  Object.freeze({
    minimum: range.minimum,
    maximum: range.maximum,
  });

export const ExecutiveBusinessHealthIndicatorRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-health-indicator-strategic-clarity",
    name: "Strategic Clarity",
    description: "Metadata contract describing clarity of executive strategic direction.",
    domain: "Strategy" as const,
    weight: 0.1,
    scoreRange: createScoreRange(scoreRangeById.healthy),
    severity: "Low" as const,
    trend: "Stable" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-financial-discipline",
    name: "Financial Discipline",
    description: "Metadata contract describing financial control and stewardship.",
    domain: "Finance" as const,
    weight: 0.12,
    scoreRange: createScoreRange(scoreRangeById.healthy),
    severity: "Moderate" as const,
    trend: "Improving" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-revenue-resilience",
    name: "Revenue Resilience",
    description: "Metadata contract describing continuity and resilience of revenue generation.",
    domain: "Revenue" as const,
    weight: 0.14,
    scoreRange: createScoreRange(scoreRangeById.stable),
    severity: "Moderate" as const,
    trend: "Stable" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-portfolio-alignment",
    name: "Portfolio Alignment",
    description: "Metadata contract describing strategic alignment across portfolio investments.",
    domain: "Portfolio" as const,
    weight: 0.08,
    scoreRange: createScoreRange(scoreRangeById.stable),
    severity: "Low" as const,
    trend: "Improving" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-operational-stability",
    name: "Operational Stability",
    description: "Metadata contract describing continuity and reliability of operations.",
    domain: "Operations" as const,
    weight: 0.1,
    scoreRange: createScoreRange(scoreRangeById.healthy),
    severity: "Low" as const,
    trend: "Stable" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-customer-trust",
    name: "Customer Trust",
    description: "Metadata contract describing customer confidence and satisfaction health.",
    domain: "Customer" as const,
    weight: 0.09,
    scoreRange: createScoreRange(scoreRangeById.healthy),
    severity: "Low" as const,
    trend: "Improving" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-people-capacity",
    name: "People Capacity",
    description: "Metadata contract describing workforce readiness and available capacity.",
    domain: "People" as const,
    weight: 0.08,
    scoreRange: createScoreRange(scoreRangeById.stable),
    severity: "Moderate" as const,
    trend: "Stable" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-resource-coverage",
    name: "Resource Coverage",
    description: "Metadata contract describing adequacy of strategic resources.",
    domain: "Resources" as const,
    weight: 0.07,
    scoreRange: createScoreRange(scoreRangeById.stable),
    severity: "Moderate" as const,
    trend: "Unknown" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-risk-exposure",
    name: "Risk Exposure",
    description: "Metadata contract describing overall executive risk posture.",
    domain: "Risk" as const,
    weight: 0.08,
    scoreRange: createScoreRange(scoreRangeById.warning),
    severity: "High" as const,
    trend: "Declining" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-growth-momentum",
    name: "Growth Momentum",
    description: "Metadata contract describing readiness for sustained growth.",
    domain: "Growth" as const,
    weight: 0.06,
    scoreRange: createScoreRange(scoreRangeById.stable),
    severity: "Moderate" as const,
    trend: "Improving" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-innovation-throughput",
    name: "Innovation Throughput",
    description: "Metadata contract describing innovation capacity and output flow.",
    domain: "Innovation" as const,
    weight: 0.04,
    scoreRange: createScoreRange(scoreRangeById.stable),
    severity: "Low" as const,
    trend: "Stable" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-indicator-governance-discipline",
    name: "Governance Discipline",
    description: "Metadata contract describing governance controls and accountability.",
    domain: "Governance" as const,
    weight: 0.04,
    scoreRange: createScoreRange(scoreRangeById.healthy),
    severity: "Low" as const,
    trend: "Stable" as const,
    metadata: createMetadata("indicator"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveBusinessHealthIndicator[]);

export const ExecutiveBusinessHealthCapabilityRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-health-capability-strategic-direction",
    name: "Strategic Direction",
    description: "Metadata capability for strategic intent and clarity.",
    dimensionId: "executive-business-health-dimension-strategy-finance",
    indicators: Object.freeze([
      ExecutiveBusinessHealthIndicatorRegistry[0],
      ExecutiveBusinessHealthIndicatorRegistry[1],
    ]),
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-capability-commercial-performance",
    name: "Commercial Performance",
    description: "Metadata capability for revenue and portfolio business health.",
    dimensionId: "executive-business-health-dimension-commercial-engine",
    indicators: Object.freeze([
      ExecutiveBusinessHealthIndicatorRegistry[2],
      ExecutiveBusinessHealthIndicatorRegistry[3],
    ]),
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-capability-operating-engine",
    name: "Operating Engine",
    description: "Metadata capability for operations and customer continuity.",
    dimensionId: "executive-business-health-dimension-operating-engine",
    indicators: Object.freeze([
      ExecutiveBusinessHealthIndicatorRegistry[4],
      ExecutiveBusinessHealthIndicatorRegistry[5],
    ]),
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-capability-organizational-readiness",
    name: "Organizational Readiness",
    description: "Metadata capability for people and resource readiness.",
    dimensionId: "executive-business-health-dimension-organizational-readiness",
    indicators: Object.freeze([
      ExecutiveBusinessHealthIndicatorRegistry[6],
      ExecutiveBusinessHealthIndicatorRegistry[7],
    ]),
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-capability-risk-and-control",
    name: "Risk and Control",
    description: "Metadata capability for risk posture and governance discipline.",
    dimensionId: "executive-business-health-dimension-risk-and-governance",
    indicators: Object.freeze([
      ExecutiveBusinessHealthIndicatorRegistry[8],
      ExecutiveBusinessHealthIndicatorRegistry[11],
    ]),
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-capability-future-readiness",
    name: "Future Readiness",
    description: "Metadata capability for growth and innovation health.",
    dimensionId: "executive-business-health-dimension-future-readiness",
    indicators: Object.freeze([
      ExecutiveBusinessHealthIndicatorRegistry[9],
      ExecutiveBusinessHealthIndicatorRegistry[10],
    ]),
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const ExecutiveBusinessHealthDimensionRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-health-dimension-strategy-finance",
    name: "Strategy and Finance",
    description: "Executive health dimension for strategic and financial stewardship.",
    capabilities: Object.freeze([
      ExecutiveBusinessHealthCapabilityRegistry[0],
    ]),
    metadata: createMetadata("dimension"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-dimension-commercial-engine",
    name: "Commercial Engine",
    description: "Executive health dimension for revenue and portfolio performance.",
    capabilities: Object.freeze([
      ExecutiveBusinessHealthCapabilityRegistry[1],
    ]),
    metadata: createMetadata("dimension"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-dimension-operating-engine",
    name: "Operating Engine",
    description: "Executive health dimension for operations and customer reliability.",
    capabilities: Object.freeze([
      ExecutiveBusinessHealthCapabilityRegistry[2],
    ]),
    metadata: createMetadata("dimension"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-dimension-organizational-readiness",
    name: "Organizational Readiness",
    description: "Executive health dimension for people and resources.",
    capabilities: Object.freeze([
      ExecutiveBusinessHealthCapabilityRegistry[3],
    ]),
    metadata: createMetadata("dimension"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-dimension-risk-and-governance",
    name: "Risk and Governance",
    description: "Executive health dimension for governance and risk posture.",
    capabilities: Object.freeze([
      ExecutiveBusinessHealthCapabilityRegistry[4],
    ]),
    metadata: createMetadata("dimension"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-health-dimension-future-readiness",
    name: "Future Readiness",
    description: "Executive health dimension for growth and innovation readiness.",
    capabilities: Object.freeze([
      ExecutiveBusinessHealthCapabilityRegistry[5],
    ]),
    metadata: createMetadata("dimension"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveBusinessHealthDimension[]);

export const ExecutiveBusinessHealthRegistryFoundation = Object.freeze({
  domains: ExecutiveBusinessHealthDomainRegistry,
  dimensions: ExecutiveBusinessHealthDimensionRegistry,
  capabilities: ExecutiveBusinessHealthCapabilityRegistry,
  indicators: ExecutiveBusinessHealthIndicatorRegistry,
  scoreRanges: ExecutiveBusinessHealthScoreRangeRegistry,
  statuses: ExecutiveBusinessHealthStatusRegistry,
  trends: ExecutiveBusinessHealthTrendRegistry,
  severities: ExecutiveBusinessHealthSeverityRegistry,
  metadata: ExecutiveBusinessHealthRegistryMetadata,
  metadataOnly: true,
  immutable: true,
});

export const getExecutiveBusinessHealthDomains = (): typeof ExecutiveBusinessHealthDomainRegistry =>
  ExecutiveBusinessHealthDomainRegistry;

export const getExecutiveBusinessHealthDimensions = (): typeof ExecutiveBusinessHealthDimensionRegistry =>
  ExecutiveBusinessHealthDimensionRegistry;

export const getExecutiveBusinessHealthCapabilities = (): typeof ExecutiveBusinessHealthCapabilityRegistry =>
  ExecutiveBusinessHealthCapabilityRegistry;

export const getExecutiveBusinessHealthIndicators = (): typeof ExecutiveBusinessHealthIndicatorRegistry =>
  ExecutiveBusinessHealthIndicatorRegistry;

export const getExecutiveBusinessHealthIndicatorsByDomain = (
  domainId: ExecutiveBusinessHealthDomainId,
): readonly ExecutiveBusinessHealthIndicator[] =>
  ExecutiveBusinessHealthIndicatorRegistry.filter((indicator) => indicator.domain === domainId);

export const getExecutiveBusinessHealthCapabilitiesByDimension = (
  dimensionId: ExecutiveBusinessHealthDimension["id"],
): readonly ExecutiveBusinessHealthCapability[] =>
  ExecutiveBusinessHealthCapabilityRegistry.filter(
    (capability) => capability.dimensionId === dimensionId,
  );

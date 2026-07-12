import {
  ExecutiveBusinessIntelligenceContractDescription,
  ExecutiveBusinessIntelligenceContractId,
  ExecutiveBusinessIntelligenceContractVersion,
  type ExecutiveBusinessIntelligenceCapability,
  type ExecutiveBusinessIntelligenceDependency,
  type ExecutiveBusinessIntelligenceDomain,
  type ExecutiveBusinessIntelligenceNamespace,
  type ExecutiveBusinessIntelligencePlatformReference,
} from "./executiveBusinessIntelligenceIndex.ts";

const registryMetadata = Object.freeze({
  contractId: ExecutiveBusinessIntelligenceContractId,
  contractVersion: ExecutiveBusinessIntelligenceContractVersion,
  contractDescription: ExecutiveBusinessIntelligenceContractDescription,
  registryId: "BUS-34:2",
  registryVersion: "1.0.0",
  registryNamespace: "nexora.bus.executive-business-intelligence.registry",
  description:
    "Canonical metadata-only registry layer for executive business intelligence.",
  tags: Object.freeze([
    "executive-business-intelligence",
    "registry",
    "metadata-only",
  ]),
  labels: Object.freeze(["bus-34", "foundation"]),
  metadataOnly: true,
  immutable: true,
} as const);

const createMetadata = (tag: string) =>
  Object.freeze({
    contractVersion: ExecutiveBusinessIntelligenceContractVersion,
    tags: Object.freeze(["executive-business-intelligence", tag]),
    labels: Object.freeze(["bus-34", "registry"]),
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessIntelligenceRegistryMetadata = registryMetadata;

export const ExecutiveBusinessIntelligenceDomainRegistry = Object.freeze([
  "Strategy",
  "KPI",
  "Risk",
  "Scenario",
  "Decision",
  "Portfolio",
  "Finance",
  "Revenue",
  "Resource",
  "Business Health",
  "Reporting",
] as const satisfies readonly ExecutiveBusinessIntelligenceDomain[]);

export const ExecutiveBusinessIntelligenceCapabilityRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-intelligence-capability-strategy-integration",
    name: "Strategy Integration",
    description: "Unified metadata capability for executive strategy intelligence.",
    domain: "Strategy" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-kpi-integration",
    name: "KPI Integration",
    description: "Unified metadata capability for KPI intelligence.",
    domain: "KPI" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-risk-integration",
    name: "Risk Integration",
    description: "Unified metadata capability for executive risk intelligence.",
    domain: "Risk" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-scenario-integration",
    name: "Scenario Integration",
    description: "Unified metadata capability for executive scenario intelligence.",
    domain: "Scenario" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-decision-integration",
    name: "Decision Integration",
    description: "Unified metadata capability for executive decision intelligence.",
    domain: "Decision" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-portfolio-integration",
    name: "Portfolio Integration",
    description: "Unified metadata capability for executive portfolio intelligence.",
    domain: "Portfolio" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-finance-integration",
    name: "Finance Integration",
    description: "Unified metadata capability for executive finance intelligence.",
    domain: "Finance" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-revenue-integration",
    name: "Revenue Integration",
    description: "Unified metadata capability for executive revenue intelligence.",
    domain: "Revenue" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-resource-integration",
    name: "Resource Integration",
    description: "Unified metadata capability for executive resource intelligence.",
    domain: "Resource" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-business-health-integration",
    name: "Business Health Integration",
    description:
      "Unified metadata capability for executive business health intelligence.",
    domain: "Business Health" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-capability-reporting-integration",
    name: "Reporting Integration",
    description: "Unified metadata capability for executive reporting intelligence.",
    domain: "Reporting" as const,
    metadata: createMetadata("capability"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveBusinessIntelligenceCapability[]);

export const ExecutiveBusinessIntelligencePlatformRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-platform-strategy",
    name: "Executive Strategy Platform",
    description: "Certified executive strategy platform reference.",
    namespace: "nexora.bus.executive-strategy",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-kpi",
    name: "Executive KPI Platform",
    description: "Certified executive KPI platform reference.",
    namespace: "nexora.bus.executive-kpi",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-risk",
    name: "Executive Risk Platform",
    description: "Certified executive risk platform reference.",
    namespace: "nexora.bus.executive-risk",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-scenario",
    name: "Executive Scenario Platform",
    description: "Certified executive scenario platform reference.",
    namespace: "nexora.bus.executive-scenario",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-decision",
    name: "Executive Decision Platform",
    description: "Certified executive decision platform reference.",
    namespace: "nexora.bus.executive-decision",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-portfolio",
    name: "Executive Portfolio Platform",
    description: "Certified executive portfolio platform reference.",
    namespace: "nexora.bus.executive-portfolio",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-finance",
    name: "Executive Finance Platform",
    description: "Certified executive finance platform reference.",
    namespace: "nexora.bus.executive-finance",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-revenue",
    name: "Executive Revenue Platform",
    description: "Certified executive revenue platform reference.",
    namespace: "nexora.bus.executive-revenue",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-resource",
    name: "Executive Resource Platform",
    description: "Certified executive resource platform reference.",
    namespace: "nexora.bus.executive-resource",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-business-health",
    name: "Executive Business Health Platform",
    description: "Certified executive business health platform reference.",
    namespace: "nexora.bus.executive-business-health",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-platform-reporting",
    name: "Executive Reporting Platform",
    description: "Certified executive reporting platform reference.",
    namespace: "nexora.bus.executive-reporting",
    version: "1.0.0",
    metadata: createMetadata("platform"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveBusinessIntelligencePlatformReference[]);

const platformById = Object.freeze({
  strategy: ExecutiveBusinessIntelligencePlatformRegistry[0],
  kpi: ExecutiveBusinessIntelligencePlatformRegistry[1],
  risk: ExecutiveBusinessIntelligencePlatformRegistry[2],
  scenario: ExecutiveBusinessIntelligencePlatformRegistry[3],
  decision: ExecutiveBusinessIntelligencePlatformRegistry[4],
  portfolio: ExecutiveBusinessIntelligencePlatformRegistry[5],
  finance: ExecutiveBusinessIntelligencePlatformRegistry[6],
  revenue: ExecutiveBusinessIntelligencePlatformRegistry[7],
  resource: ExecutiveBusinessIntelligencePlatformRegistry[8],
  businessHealth: ExecutiveBusinessIntelligencePlatformRegistry[9],
  reporting: ExecutiveBusinessIntelligencePlatformRegistry[10],
} as const);

const domainPlatformMap = Object.freeze({
  Strategy: Object.freeze([platformById.strategy]),
  KPI: Object.freeze([platformById.kpi]),
  Risk: Object.freeze([platformById.risk]),
  Scenario: Object.freeze([platformById.scenario]),
  Decision: Object.freeze([platformById.decision]),
  Portfolio: Object.freeze([platformById.portfolio]),
  Finance: Object.freeze([platformById.finance]),
  Revenue: Object.freeze([platformById.revenue]),
  Resource: Object.freeze([platformById.resource]),
  "Business Health": Object.freeze([platformById.businessHealth]),
  Reporting: Object.freeze([platformById.reporting]),
} as const satisfies Record<
  ExecutiveBusinessIntelligenceDomain,
  readonly ExecutiveBusinessIntelligencePlatformReference[]
>);

export const ExecutiveBusinessIntelligenceNamespaceRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-intelligence-namespace-strategy",
    name: "Strategy Namespace",
    description: "Namespace metadata for certified executive strategy platforms.",
    platforms: domainPlatformMap.Strategy,
    metadata: createMetadata("namespace"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-namespace-performance",
    name: "Performance Namespace",
    description: "Namespace metadata for KPI, finance, revenue, and reporting platforms.",
    platforms: Object.freeze([
      platformById.kpi,
      platformById.finance,
      platformById.revenue,
      platformById.reporting,
    ]),
    metadata: createMetadata("namespace"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-namespace-risk-scenario",
    name: "Risk and Scenario Namespace",
    description: "Namespace metadata for risk, scenario, and decision platforms.",
    platforms: Object.freeze([
      platformById.risk,
      platformById.scenario,
      platformById.decision,
    ]),
    metadata: createMetadata("namespace"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-namespace-execution",
    name: "Execution Namespace",
    description:
      "Namespace metadata for portfolio, resource, and business health platforms.",
    platforms: Object.freeze([
      platformById.portfolio,
      platformById.resource,
      platformById.businessHealth,
    ]),
    metadata: createMetadata("namespace"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveBusinessIntelligenceNamespace[]);

export const ExecutiveBusinessIntelligenceDependencyRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-intelligence-dependency-strategy-to-kpi",
    source: platformById.strategy.id,
    target: platformById.kpi.id,
    relationship: "consumes-public-metadata",
    metadata: createMetadata("dependency"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-dependency-risk-to-scenario",
    source: platformById.risk.id,
    target: platformById.scenario.id,
    relationship: "aligns-public-metadata",
    metadata: createMetadata("dependency"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-dependency-portfolio-to-resource",
    source: platformById.portfolio.id,
    target: platformById.resource.id,
    relationship: "coordinates-public-metadata",
    metadata: createMetadata("dependency"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-dependency-finance-to-revenue",
    source: platformById.finance.id,
    target: platformById.revenue.id,
    relationship: "correlates-public-metadata",
    metadata: createMetadata("dependency"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-business-intelligence-dependency-business-health-to-reporting",
    source: platformById.businessHealth.id,
    target: platformById.reporting.id,
    relationship: "publishes-public-metadata",
    metadata: createMetadata("dependency"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveBusinessIntelligenceDependency[]);

export const ExecutiveBusinessIntelligenceIntegrationRegistry = Object.freeze([
  Object.freeze({
    id: "executive-business-intelligence-integration-core-bus",
    name: "Core BUS Integration",
    description:
      "Metadata-only integration surface unifying certified executive business platforms.",
    domains: ExecutiveBusinessIntelligenceDomainRegistry,
    platformIds: Object.freeze(
      ExecutiveBusinessIntelligencePlatformRegistry.map((platform) => platform.id),
    ),
    dependencyIds: Object.freeze(
      ExecutiveBusinessIntelligenceDependencyRegistry.map((dependency) => dependency.id),
    ),
    metadata: createMetadata("integration"),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const getExecutiveBusinessIntelligenceDomains = () =>
  ExecutiveBusinessIntelligenceDomainRegistry;

export const getExecutiveBusinessIntelligenceCapabilities = () =>
  ExecutiveBusinessIntelligenceCapabilityRegistry;

export const getExecutiveBusinessIntelligencePlatforms = () =>
  ExecutiveBusinessIntelligencePlatformRegistry;

export const getExecutiveBusinessIntelligenceNamespaces = () =>
  ExecutiveBusinessIntelligenceNamespaceRegistry;

export const getExecutiveBusinessIntelligenceDependencies = () =>
  ExecutiveBusinessIntelligenceDependencyRegistry;

export const getExecutiveBusinessIntelligenceCapabilitiesByDomain = (
  domain: ExecutiveBusinessIntelligenceDomain,
) =>
  Object.freeze(
    ExecutiveBusinessIntelligenceCapabilityRegistry.filter(
      (capability) => capability.domain === domain,
    ),
  ) as readonly ExecutiveBusinessIntelligenceCapability[];

export const getExecutiveBusinessIntelligencePlatformsByDomain = (
  domain: ExecutiveBusinessIntelligenceDomain,
) => domainPlatformMap[domain];

export const getExecutiveBusinessIntelligenceDependencyMetadata = () =>
  ExecutiveBusinessIntelligenceDependencyRegistry;

export const ExecutiveBusinessIntelligenceRegistryFoundation = Object.freeze({
  metadata: ExecutiveBusinessIntelligenceRegistryMetadata,
  domains: ExecutiveBusinessIntelligenceDomainRegistry,
  capabilities: ExecutiveBusinessIntelligenceCapabilityRegistry,
  platforms: ExecutiveBusinessIntelligencePlatformRegistry,
  namespaces: ExecutiveBusinessIntelligenceNamespaceRegistry,
  dependencies: ExecutiveBusinessIntelligenceDependencyRegistry,
  integrations: ExecutiveBusinessIntelligenceIntegrationRegistry,
  getExecutiveBusinessIntelligenceDomains,
  getExecutiveBusinessIntelligenceCapabilities,
  getExecutiveBusinessIntelligencePlatforms,
  getExecutiveBusinessIntelligenceNamespaces,
  getExecutiveBusinessIntelligenceDependencies,
  getExecutiveBusinessIntelligenceCapabilitiesByDomain,
  getExecutiveBusinessIntelligencePlatformsByDomain,
  getExecutiveBusinessIntelligenceDependencyMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

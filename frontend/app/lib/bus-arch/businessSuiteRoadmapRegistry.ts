import { BusinessSuiteArchitectureRegistry } from "./businessSuiteArchitectureIndex.ts";
import type {
  BusinessCertificationStage,
  BusinessFutureExpansion,
  BusinessImplementationWave,
  BusinessPlatformPriority,
  BusinessReleaseGroup,
  BusinessRoadmapMetadata,
  BusinessRoadmapMilestone,
} from "./businessSuiteRoadmapTypes.ts";

const PLATFORM_IDS = Object.freeze(BusinessSuiteArchitectureRegistry.platforms.map((platform) => platform.platformId));

export const BUSINESS_ROADMAP_METADATA: BusinessRoadmapMetadata = Object.freeze({
  roadmapId: "BUS-ARCH-5",
  architectureId: "BUS-ARCH",
  roadmapVersion: "1.0.0",
  purpose: "Immutable implementation roadmap for Nexora Business Suite platforms.",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_IMPLEMENTATION_WAVE_REGISTRY: readonly BusinessImplementationWave[] = Object.freeze([
  Object.freeze({
    waveId: "foundation",
    name: "Foundation",
    order: 1,
    description: "Establish Business Suite architectural foundations and certification baselines.",
    targetPlatformIds: Object.freeze([]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    waveId: "core-business-platforms",
    name: "Core Business Platforms",
    order: 2,
    description: "Prioritize strategic, financial, and operational platforms.",
    targetPlatformIds: Object.freeze(["strategy-suite", "finance-suite", "operations-suite", "enterprise-performance-suite"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    waveId: "shared-services",
    name: "Shared Services",
    order: 3,
    description: "Add governance and supply-chain supporting platforms.",
    targetPlatformIds: Object.freeze(["governance-suite", "esg-suite", "procurement-suite", "supply-chain-suite"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    waveId: "cross-platform-integration",
    name: "Cross-Platform Integration",
    order: 4,
    description: "Align commercial and customer-facing platform contracts.",
    targetPlatformIds: Object.freeze(["sales-suite", "marketing-suite", "customer-success-suite"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    waveId: "executive-intelligence",
    name: "Executive Intelligence",
    order: 5,
    description: "Connect executive-facing business platforms to broader intelligence surfaces.",
    targetPlatformIds: Object.freeze(["enterprise-performance-suite", "innovation-suite"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    waveId: "enterprise-expansion",
    name: "Enterprise Expansion",
    order: 6,
    description: "Expand into manufacturing and human capital domains.",
    targetPlatformIds: Object.freeze(["manufacturing-suite", "hr-suite"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    waveId: "ecosystem-extensions",
    name: "Ecosystem Extensions",
    order: 7,
    description: "Open certified extension pathways for future Business Suite growth.",
    targetPlatformIds: Object.freeze(PLATFORM_IDS),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const BUSINESS_ROADMAP_MILESTONE_REGISTRY: readonly BusinessRoadmapMilestone[] = Object.freeze([
  Object.freeze({
    milestoneId: "roadmap-foundation-baseline",
    name: "Architecture Baseline Established",
    implementationWaveId: "foundation",
    targetPlatformIds: Object.freeze([]),
    prerequisites: Object.freeze(["BUS-ARCH-1", "BUS-ARCH-2", "BUS-ARCH-3", "BUS-ARCH-4"]),
    expectedOutputs: Object.freeze(["Architecture registry", "Boundary map", "Dependency map", "API policy"]),
    certificationRequirement: "Architecture phases must validate before platform implementation begins.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    milestoneId: "roadmap-core-platforms-ready",
    name: "Core Platform Contracts Ready",
    implementationWaveId: "core-business-platforms",
    targetPlatformIds: Object.freeze(["strategy-suite", "finance-suite", "operations-suite", "enterprise-performance-suite"]),
    prerequisites: Object.freeze(["roadmap-foundation-baseline"]),
    expectedOutputs: Object.freeze(["Core platform contracts", "Initial certification scaffolds"]),
    certificationRequirement: "Core platforms must reach Designed before downstream consumers integrate.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    milestoneId: "roadmap-shared-services-ready",
    name: "Shared Services Metadata Ready",
    implementationWaveId: "shared-services",
    targetPlatformIds: Object.freeze(["governance-suite", "esg-suite", "procurement-suite", "supply-chain-suite"]),
    prerequisites: Object.freeze(["roadmap-core-platforms-ready"]),
    expectedOutputs: Object.freeze(["Shared governance metadata", "Supply-chain interoperability contracts"]),
    certificationRequirement: "Shared services require validated dependency alignment with core platforms.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    milestoneId: "roadmap-commercial-integration-ready",
    name: "Commercial Integration Contracts Ready",
    implementationWaveId: "cross-platform-integration",
    targetPlatformIds: Object.freeze(["sales-suite", "marketing-suite", "customer-success-suite"]),
    prerequisites: Object.freeze(["roadmap-core-platforms-ready", "roadmap-shared-services-ready"]),
    expectedOutputs: Object.freeze(["Commercial platform contracts", "Consumer compatibility metadata"]),
    certificationRequirement: "Commercial integration requires certified public API policies.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    milestoneId: "roadmap-executive-intelligence-ready",
    name: "Executive Intelligence Connections Ready",
    implementationWaveId: "executive-intelligence",
    targetPlatformIds: Object.freeze(["enterprise-performance-suite", "innovation-suite"]),
    prerequisites: Object.freeze(["roadmap-commercial-integration-ready"]),
    expectedOutputs: Object.freeze(["Executive platform compatibility metadata", "Cross-suite certification path"]),
    certificationRequirement: "Executive intelligence wave requires validated cross-platform dependency metadata.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    milestoneId: "roadmap-enterprise-expansion-ready",
    name: "Enterprise Expansion Contracts Ready",
    implementationWaveId: "enterprise-expansion",
    targetPlatformIds: Object.freeze(["manufacturing-suite", "hr-suite"]),
    prerequisites: Object.freeze(["roadmap-executive-intelligence-ready"]),
    expectedOutputs: Object.freeze(["Expansion platform metadata", "Future domain alignment contracts"]),
    certificationRequirement: "Expansion platforms require backward-compatible API policy adherence.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    milestoneId: "roadmap-ecosystem-extension-ready",
    name: "Ecosystem Extension Policy Ready",
    implementationWaveId: "ecosystem-extensions",
    targetPlatformIds: PLATFORM_IDS,
    prerequisites: Object.freeze(["roadmap-enterprise-expansion-ready"]),
    expectedOutputs: Object.freeze(["Certified extension roadmap", "Future platform registration blueprint"]),
    certificationRequirement: "Extension roadmap requires frozen certification sequence metadata.",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

function priorityForPlatform(platformId: string): BusinessPlatformPriority {
  const critical = new Set(["strategy-suite", "finance-suite", "operations-suite", "enterprise-performance-suite"]);
  const high = new Set(["governance-suite", "sales-suite", "marketing-suite", "supply-chain-suite"]);
  const medium = new Set(["customer-success-suite", "procurement-suite", "hr-suite", "manufacturing-suite"]);
  const optional = new Set(["esg-suite"]);

  let priority: BusinessPlatformPriority["priority"] = "Future";
  if (critical.has(platformId)) priority = "Critical";
  else if (high.has(platformId)) priority = "High";
  else if (medium.has(platformId)) priority = "Medium";
  else if (optional.has(platformId)) priority = "Optional";

  return Object.freeze({
    priorityId: `${platformId}-priority`,
    platformId,
    priority,
    rationale: `${platformId} is prioritized according to the Business Suite roadmap sequence.`,
    metadataOnly: true,
    immutable: true,
  });
}

export const BUSINESS_PLATFORM_PRIORITY_REGISTRY: readonly BusinessPlatformPriority[] = Object.freeze(
  PLATFORM_IDS.map((platformId) => priorityForPlatform(platformId))
);

export const BUSINESS_RELEASE_REGISTRY: readonly BusinessReleaseGroup[] = Object.freeze([
  Object.freeze({
    releaseId: "release-foundation-core",
    includedPlatformIds: Object.freeze(["strategy-suite", "finance-suite", "operations-suite", "enterprise-performance-suite"]),
    dependencyRequirements: Object.freeze(["BUS-ARCH-1", "BUS-ARCH-2", "BUS-ARCH-3", "BUS-ARCH-4"]),
    certificationRequirements: Object.freeze(["Designed", "Validated"]),
    compatibilityRequirements: Object.freeze(["Public API policy compliance", "Boundary compliance"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    releaseId: "release-shared-services",
    includedPlatformIds: Object.freeze(["governance-suite", "esg-suite", "procurement-suite", "supply-chain-suite"]),
    dependencyRequirements: Object.freeze(["release-foundation-core"]),
    certificationRequirements: Object.freeze(["Validated", "Certified"]),
    compatibilityRequirements: Object.freeze(["Dependency map compliance", "Shared service compatibility"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    releaseId: "release-commercial-executive",
    includedPlatformIds: Object.freeze(["sales-suite", "marketing-suite", "customer-success-suite", "innovation-suite"]),
    dependencyRequirements: Object.freeze(["release-shared-services"]),
    certificationRequirements: Object.freeze(["Certified", "Frozen"]),
    compatibilityRequirements: Object.freeze(["API compatibility", "Cross-platform integration readiness"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    releaseId: "release-enterprise-expansion",
    includedPlatformIds: Object.freeze(["manufacturing-suite", "hr-suite", "enterprise-performance-suite"]),
    dependencyRequirements: Object.freeze(["release-commercial-executive"]),
    certificationRequirements: Object.freeze(["Frozen", "Released"]),
    compatibilityRequirements: Object.freeze(["Backward compatibility", "Extension policy readiness"]),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const BUSINESS_CERTIFICATION_REGISTRY: readonly BusinessCertificationStage[] = Object.freeze([
  Object.freeze({ stageId: "planned", stage: "Planned", order: 1, description: "Platform is planned in roadmap metadata.", metadataOnly: true, immutable: true }),
  Object.freeze({ stageId: "designed", stage: "Designed", order: 2, description: "Platform contracts are designed.", metadataOnly: true, immutable: true }),
  Object.freeze({ stageId: "implemented", stage: "Implemented", order: 3, description: "Platform metadata surface is implemented.", metadataOnly: true, immutable: true }),
  Object.freeze({ stageId: "validated", stage: "Validated", order: 4, description: "Platform metadata has passed validation.", metadataOnly: true, immutable: true }),
  Object.freeze({ stageId: "certified", stage: "Certified", order: 5, description: "Platform metadata is certified.", metadataOnly: true, immutable: true }),
  Object.freeze({ stageId: "frozen", stage: "Frozen", order: 6, description: "Platform public surface is frozen.", metadataOnly: true, immutable: true }),
  Object.freeze({ stageId: "released", stage: "Released", order: 7, description: "Platform is released for consumers.", metadataOnly: true, immutable: true }),
] as const);

export const BUSINESS_EXPANSION_REGISTRY: readonly BusinessFutureExpansion[] = Object.freeze([
  Object.freeze({
    expansionId: "expansion-analytics-support",
    name: "Analytics and Support Expansion",
    targetWaveId: "ecosystem-extensions",
    targetPlatformIds: Object.freeze(["enterprise-performance-suite", "customer-success-suite"]),
    prerequisites: Object.freeze(["roadmap-ecosystem-extension-ready"]),
    strategy: "Extend certified metadata for analytics-facing and support-facing consumers.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    expansionId: "expansion-governance-depth",
    name: "Governance Depth Expansion",
    targetWaveId: "enterprise-expansion",
    targetPlatformIds: Object.freeze(["governance-suite", "esg-suite"]),
    prerequisites: Object.freeze(["roadmap-shared-services-ready"]),
    strategy: "Deepen governance-aligned metadata after shared service certification.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    expansionId: "expansion-commercial-ecosystem",
    name: "Commercial Ecosystem Expansion",
    targetWaveId: "cross-platform-integration",
    targetPlatformIds: Object.freeze(["sales-suite", "marketing-suite", "customer-success-suite"]),
    prerequisites: Object.freeze(["roadmap-commercial-integration-ready"]),
    strategy: "Expand commercial platform interoperability through certified extension points.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    expansionId: "expansion-manufacturing-network",
    name: "Manufacturing Network Expansion",
    targetWaveId: "enterprise-expansion",
    targetPlatformIds: Object.freeze(["manufacturing-suite", "supply-chain-suite", "procurement-suite"]),
    prerequisites: Object.freeze(["roadmap-enterprise-expansion-ready"]),
    strategy: "Add future manufacturing network metadata after enterprise expansion certification.",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const BusinessSuiteRoadmapRegistry = Object.freeze({
  metadata: BUSINESS_ROADMAP_METADATA,
  implementationWaveRegistry: BUSINESS_IMPLEMENTATION_WAVE_REGISTRY,
  milestoneRegistry: BUSINESS_ROADMAP_MILESTONE_REGISTRY,
  platformPriorityRegistry: BUSINESS_PLATFORM_PRIORITY_REGISTRY,
  releaseRegistry: BUSINESS_RELEASE_REGISTRY,
  certificationRegistry: BUSINESS_CERTIFICATION_REGISTRY,
  expansionRegistry: BUSINESS_EXPANSION_REGISTRY,
});

import type {
  BusinessArchitectureLayer,
  BusinessArchitectureMetadata,
  BusinessArchitecturePrinciple,
  BusinessArchitectureRule,
  BusinessArchitectureVersion,
  BusinessPlatformCategory,
  BusinessPlatformDefinition,
} from "./businessSuiteArchitectureTypes.ts";

export const BUSINESS_SUITE_ARCHITECTURE_METADATA: BusinessArchitectureMetadata = Object.freeze({
  architectureId: "BUS-ARCH",
  architectureName: "Business Suite Master Architecture",
  purpose: "Immutable architectural blueprint for Nexora Business Suite platforms.",
  certificationState: "Ready for BUS-ARCH-2",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_SUITE_ARCHITECTURE_VERSION: BusinessArchitectureVersion = Object.freeze({
  versionId: "BUS-ARCH-1",
  version: "1.0.0",
  releaseState: "Architecture Foundation",
  deterministic: true,
});

export const BUSINESS_PLATFORM_CATEGORIES: readonly BusinessPlatformCategory[] = Object.freeze([
  "Strategic",
  "Operational",
  "Financial",
  "Commercial",
  "Human Capital",
  "Manufacturing",
  "Supply Chain",
  "Customer",
  "Innovation",
  "Governance",
  "Analytics",
  "Executive",
  "Support",
  "Infrastructure",
  "Future",
] as const);

export const BUSINESS_ARCHITECTURE_LAYERS: readonly BusinessArchitectureLayer[] = Object.freeze([
  Object.freeze({ layerId: "business-suite", layerName: "Business Suite", order: 1, description: "Top-level Business Suite boundary.", metadataOnly: true, immutable: true }),
  Object.freeze({ layerId: "architecture", layerName: "Architecture", order: 2, description: "Architecture definitions and rules.", metadataOnly: true, immutable: true }),
  Object.freeze({ layerId: "platforms", layerName: "Platforms", order: 3, description: "Business platform catalog.", metadataOnly: true, immutable: true }),
  Object.freeze({ layerId: "shared-services", layerName: "Shared Services", order: 4, description: "Shared metadata service contracts.", metadataOnly: true, immutable: true }),
  Object.freeze({ layerId: "cross-platform-contracts", layerName: "Cross Platform Contracts", order: 5, description: "Contracts between Business platforms.", metadataOnly: true, immutable: true }),
  Object.freeze({ layerId: "public-apis", layerName: "Public APIs", order: 6, description: "Stable public API boundaries.", metadataOnly: true, immutable: true }),
  Object.freeze({ layerId: "consumers", layerName: "Consumers", order: 7, description: "Approved Business Suite consumers.", metadataOnly: true, immutable: true }),
  Object.freeze({ layerId: "future-extensions", layerName: "Future Extensions", order: 8, description: "Additive future extension boundary.", metadataOnly: true, immutable: true }),
] as const);

export const BUSINESS_PLATFORM_REGISTRY: readonly BusinessPlatformDefinition[] = Object.freeze([
  Object.freeze({ platformId: "strategy-suite", platformName: "Strategy Suite", category: "Strategic", description: "Future strategic business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "finance-suite", platformName: "Finance Suite", category: "Financial", description: "Future finance business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "sales-suite", platformName: "Sales Suite", category: "Commercial", description: "Future sales business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "marketing-suite", platformName: "Marketing Suite", category: "Commercial", description: "Future marketing business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "operations-suite", platformName: "Operations Suite", category: "Operational", description: "Future operations business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "hr-suite", platformName: "HR Suite", category: "Human Capital", description: "Future human capital business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "procurement-suite", platformName: "Procurement Suite", category: "Supply Chain", description: "Future procurement business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "supply-chain-suite", platformName: "Supply Chain Suite", category: "Supply Chain", description: "Future supply chain business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "manufacturing-suite", platformName: "Manufacturing Suite", category: "Manufacturing", description: "Future manufacturing business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "customer-success-suite", platformName: "Customer Success Suite", category: "Customer", description: "Future customer success business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "innovation-suite", platformName: "Innovation Suite", category: "Innovation", description: "Future innovation business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "esg-suite", platformName: "ESG Suite", category: "Governance", description: "Future ESG business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "governance-suite", platformName: "Governance Suite", category: "Governance", description: "Future governance business platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "enterprise-performance-suite", platformName: "Enterprise Performance Suite", category: "Executive", description: "Future enterprise performance platform.", architectureLayerId: "platforms", futurePlatform: true, metadataOnly: true, immutable: true }),
] as const);

export const BUSINESS_ARCHITECTURE_PRINCIPLES: readonly BusinessArchitecturePrinciple[] = Object.freeze([
  "Metadata First",
  "Platform Independence",
  "Immutable Contracts",
  "Deterministic Outputs",
  "Read-only Dependencies",
  "Public API Consumption",
  "Zero Circular Dependencies",
  "Domain Isolation",
  "Versioned Architecture",
  "Extension Safety",
  "Consumer Safety",
  "Backward Compatibility",
].map((principleName) =>
  Object.freeze({
    principleId: principleName.toLowerCase().replaceAll(" ", "-"),
    principleName,
    description: `${principleName} is required for every Business Suite platform.`,
    required: true,
    metadataOnly: true,
  })
));

export const BUSINESS_ARCHITECTURE_RULES: readonly BusinessArchitectureRule[] = Object.freeze([
  Object.freeze({ ruleId: "must-public-apis", ruleName: "Expose Public APIs", ruleType: "Must", description: "Every Business platform must expose stable public APIs.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-manifest", ruleName: "Publish Manifest", ruleType: "Must", description: "Every Business platform must publish a deterministic manifest.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-registry", ruleName: "Publish Registry", ruleType: "Must", description: "Every Business platform must publish immutable registries.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-validation", ruleName: "Publish Validation", ruleType: "Must", description: "Every Business platform must publish read-only validation.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-compatibility", ruleName: "Publish Compatibility", ruleType: "Must", description: "Every Business platform must publish compatibility metadata.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-certification", ruleName: "Support Certification", ruleType: "Must", description: "Every Business platform must support certification metadata.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-deterministic", ruleName: "Remain Deterministic", ruleType: "Must", description: "Every Business platform must remain deterministic.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-metadata-first", ruleName: "Remain Metadata First", ruleType: "Must", description: "Every Business platform must remain metadata-first.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-not-private-modules", ruleName: "No Private Module Calls", ruleType: "Must Not", description: "Business platforms must not call private modules.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-not-bypass-contracts", ruleName: "No Contract Bypass", ruleType: "Must Not", description: "Business platforms must not bypass contracts.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-not-circular", ruleName: "No Circular Dependencies", ruleType: "Must Not", description: "Business platforms must not create circular dependencies.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-not-upstream-mutation", ruleName: "No Upstream Mutation", ruleType: "Must Not", description: "Business platforms must not modify upstream platforms.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-not-ui", ruleName: "No UI", ruleType: "Must Not", description: "Business architecture must not contain UI.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-not-ai", ruleName: "No AI Logic", ruleType: "Must Not", description: "Business architecture must not contain AI logic.", metadataOnly: true }),
  Object.freeze({ ruleId: "must-not-orchestration", ruleName: "No Runtime Orchestration", ruleType: "Must Not", description: "Business architecture must not contain runtime orchestration.", metadataOnly: true }),
] as const);

export const BUSINESS_NAMING_CONVENTIONS: readonly string[] = Object.freeze([
  "Business platform ids use kebab-case.",
  "Business platform names use Title Case.",
  "Architecture layer ids use kebab-case.",
  "Public APIs are exposed only through index files.",
] as const);

export const BusinessSuiteArchitectureRegistry = Object.freeze({
  metadata: BUSINESS_SUITE_ARCHITECTURE_METADATA,
  version: BUSINESS_SUITE_ARCHITECTURE_VERSION,
  platforms: BUSINESS_PLATFORM_REGISTRY,
  layers: BUSINESS_ARCHITECTURE_LAYERS,
  categories: BUSINESS_PLATFORM_CATEGORIES,
  principles: BUSINESS_ARCHITECTURE_PRINCIPLES,
  rules: BUSINESS_ARCHITECTURE_RULES,
  namingConventions: BUSINESS_NAMING_CONVENTIONS,
});

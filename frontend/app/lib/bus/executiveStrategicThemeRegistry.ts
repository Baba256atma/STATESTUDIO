import {
  EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  type ExecutiveStrategyCategory,
  type ExecutiveStrategyMetadata,
  type ExecutiveStrategyOwner,
} from "./executiveStrategyIndex.ts";
import type { ExecutiveStrategyVersion } from "./executiveStrategyDefinitionIndex.ts";
import type {
  ExecutiveStrategicTheme,
  ExecutiveStrategicThemeDependency,
  ExecutiveStrategicThemeExtensionPolicy,
  ExecutiveStrategicThemeRegistry,
  ExecutiveStrategicThemeRelationship,
} from "./executiveStrategicThemeTypes.ts";

const THEME_CATEGORIES: readonly ExecutiveStrategyCategory[] = Object.freeze([
  "Growth",
  "Operational",
  "Innovation",
  "Transformation",
] as const);

const THEME_OWNERS: readonly ExecutiveStrategyOwner[] = Object.freeze([
  Object.freeze({ ownerId: "strategy-theme-owner", ownerName: "Chief Strategy Officer", ownerRole: "Theme Owner", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "operations-theme-owner", ownerName: "Chief Operating Officer", ownerRole: "Theme Sponsor", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "innovation-theme-owner", ownerName: "Chief Innovation Officer", ownerRole: "Theme Sponsor", metadataOnly: true, immutable: true }),
] as const);

const THEME_VERSIONS: readonly ExecutiveStrategyVersion[] = Object.freeze([
  Object.freeze({ versionId: "theme-version-v1-growth", versionLabel: "Growth Theme Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
  Object.freeze({ versionId: "theme-version-v1-resilience", versionLabel: "Resilience Theme Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
  Object.freeze({ versionId: "theme-version-v1-innovation", versionLabel: "Innovation Theme Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
] as const);

function metadata(metadataId: string): ExecutiveStrategyMetadata {
  return Object.freeze({
    metadataId,
    metadataOnly: true,
    immutable: true,
    namespace: "executive.strategy",
    domainIdentity: "Executive Strategy Domain",
  });
}

export const EXECUTIVE_STRATEGIC_THEMES: readonly ExecutiveStrategicTheme[] = Object.freeze([
  Object.freeze({
    identity: Object.freeze({ themeId: "theme-sustainable-growth", themeKey: "sustainable-growth", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Sustainable Growth", displayName: "Sustainable Growth Theme", metadataOnly: true, immutable: true }),
    description: "Canonical long-term focus area for profitable and sustained growth.",
    purpose: Object.freeze({ purposeId: "purpose-sustainable-growth", purposeStatement: "Organize growth-oriented strategies into a durable executive theme.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-sustainable-growth", scopeStatement: "Enterprise growth, commercial expansion, and financial stewardship.", metadataOnly: true, immutable: true }),
    category: "Growth",
    priority: "Critical",
    status: "Aligned",
    lifecycle: "Approved",
    owner: THEME_OWNERS[0],
    sponsor: THEME_OWNERS[1],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "theme-growth-finance", stakeholderName: "Finance Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "theme-growth-commercial", stakeholderName: "Commercial Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentThemeId: null,
    childThemeIds: Object.freeze(["theme-innovation-engine"]),
    strategyReferenceIds: Object.freeze(["strategy-profitable-growth"]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-financial-health", kpiName: "Executive Financial Health", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-profitable-growth", okrName: "Profitable Growth Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["theme-growth-demand-stability", "theme-growth-governance-alignment"]),
    constraints: Object.freeze(["theme-growth-capital-discipline", "theme-growth-portfolio-balance"]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-growth-volatility", riskName: "Growth volatility risk reference", metadataOnly: true, immutable: true }),
    ]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-growth-theme-clarity", criteriaStatement: "Growth theme stays referenceable for future strategy layers.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-growth-theme-alignment", criteriaStatement: "Growth theme aligns strategy, KPI, and OKR references consistently.", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("theme-sustainable-growth-metadata"),
    version: THEME_VERSIONS[0],
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    identity: Object.freeze({ themeId: "theme-operational-resilience", themeKey: "operational-resilience", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Operational Resilience", displayName: "Operational Resilience Theme", metadataOnly: true, immutable: true }),
    description: "Canonical long-term focus area for resilient operating model outcomes.",
    purpose: Object.freeze({ purposeId: "purpose-operational-resilience-theme", purposeStatement: "Group operational resilience strategies into a coherent executive theme.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-operational-resilience-theme", scopeStatement: "Operations, transformation, and enterprise resilience focus areas.", metadataOnly: true, immutable: true }),
    category: "Operational",
    priority: "High",
    status: "Defined",
    lifecycle: "Approved",
    owner: THEME_OWNERS[1],
    sponsor: THEME_OWNERS[0],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "theme-resilience-ops", stakeholderName: "Operations Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "theme-resilience-risk", stakeholderName: "Risk Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentThemeId: null,
    childThemeIds: Object.freeze([]),
    strategyReferenceIds: Object.freeze(["strategy-operational-resilience"]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-operational-readiness", kpiName: "Executive Operational Readiness", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-operational-excellence", okrName: "Operational Excellence Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["theme-resilience-change-readiness", "theme-resilience-operating-discipline"]),
    constraints: Object.freeze(["theme-resilience-capacity", "theme-resilience-sequencing"]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-resilience-disruption", riskName: "Resilience disruption risk reference", metadataOnly: true, immutable: true }),
    ]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-resilience-theme-clarity", criteriaStatement: "Operational resilience theme remains machine-readable and stable.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-resilience-theme-links", criteriaStatement: "Operational resilience theme preserves correct strategy and KPI references.", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("theme-operational-resilience-metadata"),
    version: THEME_VERSIONS[1],
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    identity: Object.freeze({ themeId: "theme-innovation-engine", themeKey: "innovation-engine", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Innovation Engine", displayName: "Innovation Engine Theme", metadataOnly: true, immutable: true }),
    description: "Canonical child theme for growth-oriented innovation capacity.",
    purpose: Object.freeze({ purposeId: "purpose-innovation-engine", purposeStatement: "Capture innovation as a structured child theme within sustainable growth.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-innovation-engine", scopeStatement: "Innovation enablement, experimentation, and transformation focus areas.", metadataOnly: true, immutable: true }),
    category: "Innovation",
    priority: "Medium",
    status: "Defined",
    lifecycle: "Candidate",
    owner: THEME_OWNERS[2],
    sponsor: THEME_OWNERS[0],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "theme-innovation-product", stakeholderName: "Innovation Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "theme-innovation-ops", stakeholderName: "Transformation Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentThemeId: "theme-sustainable-growth",
    childThemeIds: Object.freeze([]),
    strategyReferenceIds: Object.freeze(["strategy-profitable-growth", "strategy-operational-resilience"]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-financial-health", kpiName: "Executive Financial Health", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
      Object.freeze({ kpiReferenceId: "executive-operational-readiness", kpiName: "Executive Operational Readiness", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-profitable-growth", okrName: "Profitable Growth Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
      Object.freeze({ okrReferenceId: "objective-operational-excellence", okrName: "Operational Excellence Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["theme-innovation-adoption", "theme-innovation-capacity"]),
    constraints: Object.freeze(["theme-innovation-governance", "theme-innovation-bandwidth"]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-innovation-focus", riskName: "Innovation focus risk reference", metadataOnly: true, immutable: true }),
    ]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-innovation-theme-hierarchy", criteriaStatement: "Innovation theme preserves parent-child hierarchy integrity.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-innovation-theme-references", criteriaStatement: "Innovation theme references source strategies and OKRs consistently.", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("theme-innovation-engine-metadata"),
    version: THEME_VERSIONS[2],
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_STRATEGIC_THEME_RELATIONSHIPS: readonly ExecutiveStrategicThemeRelationship[] = Object.freeze([
  Object.freeze({ relationshipId: "strategy-profitable-growth-to-theme-growth", relationshipType: "StrategyToTheme", sourceId: "strategy-profitable-growth", targetId: "theme-sustainable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-growth-to-strategy-profitable-growth", relationshipType: "ThemeToStrategy", sourceId: "theme-sustainable-growth", targetId: "strategy-profitable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "strategy-operational-resilience-to-theme-resilience", relationshipType: "StrategyToTheme", sourceId: "strategy-operational-resilience", targetId: "theme-operational-resilience", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-resilience-to-strategy-operational-resilience", relationshipType: "ThemeToStrategy", sourceId: "theme-operational-resilience", targetId: "strategy-operational-resilience", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-growth-parent-to-innovation-child", relationshipType: "ParentThemeToChildTheme", sourceId: "theme-sustainable-growth", targetId: "theme-innovation-engine", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-growth-to-kpi-financial-health", relationshipType: "ThemeToKpiReference", sourceId: "theme-sustainable-growth", targetId: "executive-financial-health", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-resilience-to-kpi-operational-readiness", relationshipType: "ThemeToKpiReference", sourceId: "theme-operational-resilience", targetId: "executive-operational-readiness", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-growth-to-okr-profitable-growth", relationshipType: "ThemeToOkrReference", sourceId: "theme-sustainable-growth", targetId: "objective-profitable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-resilience-to-okr-operational-excellence", relationshipType: "ThemeToOkrReference", sourceId: "theme-operational-resilience", targetId: "objective-operational-excellence", metadataOnly: true, immutable: true }),
] as const);

export const EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveStrategicThemesPlatform",
  "buildExecutiveStrategicTheme",
  "validateExecutiveStrategicTheme",
  "getExecutiveStrategicThemesManifest",
  "listExecutiveStrategicThemes",
  "listExecutiveStrategicThemesPublicApis",
] as const);

export const EXECUTIVE_STRATEGIC_THEME_DEPENDENCIES: readonly ExecutiveStrategicThemeDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "BUS-17 Executive Strategy Foundation", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "BUS-18 Executive Strategy Definition Platform", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive KPI Platform Freeze", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive OKR Platform Freeze", compatible: true, implementationRequired: false }),
] as const);

export const EXECUTIVE_STRATEGIC_THEME_EXTENSION_POLICY: ExecutiveStrategicThemeExtensionPolicy = Object.freeze({
  policyId: "executive-strategic-theme-extension-policy",
  extensionMode: "additive-only",
  themeMutationAllowed: false,
  runtimeExecutionAllowed: false,
  objectiveManagementAllowed: false,
  initiativeManagementAllowed: false,
  roadmapGenerationAllowed: false,
  businessLogicAllowed: false,
});

export const EXECUTIVE_STRATEGIC_THEME_REGISTRY: ExecutiveStrategicThemeRegistry = Object.freeze({
  platformId: "BUS-19",
  platformName: "Executive Strategic Themes Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-17",
  definitionPlatformId: "BUS-18",
  kpiFreezeDependency: "BUS-12",
  okrFreezeDependency: "BUS-16",
  themes: EXECUTIVE_STRATEGIC_THEMES,
  categories: THEME_CATEGORIES,
  statuses: EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  priorities: EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  lifecycles: EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  owners: THEME_OWNERS,
  versions: THEME_VERSIONS,
  relationships: EXECUTIVE_STRATEGIC_THEME_RELATIONSHIPS,
  publicApis: EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
  extensionPolicy: EXECUTIVE_STRATEGIC_THEME_EXTENSION_POLICY,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveStrategicThemes(): readonly ExecutiveStrategicTheme[] {
  return EXECUTIVE_STRATEGIC_THEMES;
}

export function listExecutiveStrategicThemesPublicApis(): readonly string[] {
  return EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS;
}

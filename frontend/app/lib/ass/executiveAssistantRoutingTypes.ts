/**
 * ASS-4 — Executive Conversation Routing Architecture domain types.
 */

import type {
  ASS_COORDINATION_PLATFORM_KEYS,
  ASS_COORDINATION_ROUTE_KEYS,
  ASS_ROUTE_CATEGORY_KEYS,
  ASS_ROUTE_CONFIDENCE_LEVEL_KEYS,
  ASS_ROUTE_DECISION_PLACEHOLDER_KEYS,
  ASS_ROUTE_INTENT_PLACEHOLDER_KEYS,
  ASS_ROUTE_TARGET_PLACEHOLDER_KEYS,
  ASS_ROUTING_REGISTRY_KEYS,
  ASS_ROUTING_VERSION,
  ASS_SCOPE_ROUTING_KEYS,
  ASS_SCOPE_ROUTING_SCOPE_KEYS,
} from "./executiveAssistantRoutingContracts.ts";

export type ExecutiveAssistantRouteCategoryKey = (typeof ASS_ROUTE_CATEGORY_KEYS)[number];
export type ExecutiveAssistantCoordinationPlatformKey = (typeof ASS_COORDINATION_PLATFORM_KEYS)[number];
export type ExecutiveAssistantCoordinationRouteKey = (typeof ASS_COORDINATION_ROUTE_KEYS)[number];
export type ExecutiveAssistantScopeRoutingKey = (typeof ASS_SCOPE_ROUTING_KEYS)[number];
export type ExecutiveAssistantScopeRoutingScopeKey = (typeof ASS_SCOPE_ROUTING_SCOPE_KEYS)[number];
export type ExecutiveAssistantRouteIntentPlaceholderKey = (typeof ASS_ROUTE_INTENT_PLACEHOLDER_KEYS)[number];
export type ExecutiveAssistantRouteTargetPlaceholderKey = (typeof ASS_ROUTE_TARGET_PLACEHOLDER_KEYS)[number];
export type ExecutiveAssistantRouteDecisionPlaceholderKey = (typeof ASS_ROUTE_DECISION_PLACEHOLDER_KEYS)[number];
export type ExecutiveAssistantRouteConfidenceLevelKey = (typeof ASS_ROUTE_CONFIDENCE_LEVEL_KEYS)[number];
export type ExecutiveAssistantRoutingRegistryKey = (typeof ASS_ROUTING_REGISTRY_KEYS)[number];

export type ExecutiveAssistantRouteDecisionMetadata = Readonly<Record<string, string>>;
export type ExecutiveAssistantRouteConfidenceMetadata = Readonly<Record<string, string>>;

export type ExecutiveAssistantRoutingIdentityRecord = Readonly<{
  routeId: string;
  routeKey: string;
  routeCategory: ExecutiveAssistantRouteCategoryKey;
  contractVersion: typeof ASS_ROUTING_VERSION;
  stateDependency: typeof import("./executiveAssistantRoutingContracts.ts").ASS_ROUTING_DEPENDENCY;
  declarativeOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRouteCategoryRecord = Readonly<{
  categoryId: string;
  categoryKey: ExecutiveAssistantRouteCategoryKey;
  label: string;
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentPlaceholderRecord = Readonly<{
  placeholderId: string;
  placeholderKey: ExecutiveAssistantRouteIntentPlaceholderKey;
  label: string;
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantTargetPlaceholderRecord = Readonly<{
  placeholderId: string;
  placeholderKey: ExecutiveAssistantRouteTargetPlaceholderKey;
  label: string;
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantCoordinationRouteRecord = Readonly<{
  coordinationRouteId: string;
  coordinationRouteKey: ExecutiveAssistantCoordinationRouteKey;
  platformKey: ExecutiveAssistantCoordinationPlatformKey;
  intentPlaceholderKey: ExecutiveAssistantRouteIntentPlaceholderKey;
  targetPlaceholderKey: ExecutiveAssistantRouteTargetPlaceholderKey;
  decisionMetadata: ExecutiveAssistantRouteDecisionMetadata;
  confidenceMetadata: ExecutiveAssistantRouteConfidenceMetadata;
  declarativeOnly: true;
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantScopeRoutingMetadataRecord = Readonly<{
  scopeRoutingId: string;
  scopeRoutingKey: ExecutiveAssistantScopeRoutingKey;
  scopeKey: ExecutiveAssistantScopeRoutingScopeKey;
  routingMetadataRef: string;
  contextRef: string;
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRouteDecisionMetadataRecord = Readonly<{
  decisionMetadataId: string;
  decisionKey: ExecutiveAssistantRouteDecisionPlaceholderKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRouteConfidenceMetadataRecord = Readonly<{
  confidenceMetadataId: string;
  confidenceKey: ExecutiveAssistantRouteConfidenceLevelKey;
  label: string;
  declarativeOnly: true;
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRouteValidationContractRecord = Readonly<{
  validationContractId: string;
  validationKey: string;
  routeCategory: ExecutiveAssistantRouteCategoryKey;
  mandatoryChecks: readonly string[];
  contractVersion: typeof ASS_ROUTING_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRouteBindingRecord = Readonly<{
  bindingId: string;
  routeId: string;
  conversationIdRef: string;
  routeCategory: ExecutiveAssistantRouteCategoryKey;
  coordinationRouteKey: ExecutiveAssistantCoordinationRouteKey | null;
  scopeRoutingKey: ExecutiveAssistantScopeRoutingKey | null;
  decisionKey: ExecutiveAssistantRouteDecisionPlaceholderKey;
  confidenceKey: ExecutiveAssistantRouteConfidenceLevelKey;
  recordedAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRoutingRegistryBundle = Readonly<{
  routingIdentityRegistry: readonly ExecutiveAssistantRoutingIdentityRecord[];
  routingIdentityCount: number;
  routeCategoryRegistry: readonly ExecutiveAssistantRouteCategoryRecord[];
  routeCategoryCount: number;
  intentPlaceholderRegistry: readonly ExecutiveAssistantIntentPlaceholderRecord[];
  intentPlaceholderCount: number;
  targetPlaceholderRegistry: readonly ExecutiveAssistantTargetPlaceholderRecord[];
  targetPlaceholderCount: number;
  coordinationRouteRegistry: readonly ExecutiveAssistantCoordinationRouteRecord[];
  coordinationRouteCount: number;
  scopeRoutingMetadataRegistry: readonly ExecutiveAssistantScopeRoutingMetadataRecord[];
  scopeRoutingCount: number;
  routeDecisionMetadataRegistry: readonly ExecutiveAssistantRouteDecisionMetadataRecord[];
  routeDecisionMetadataCount: number;
  routeConfidenceMetadataRegistry: readonly ExecutiveAssistantRouteConfidenceMetadataRecord[];
  routeConfidenceMetadataCount: number;
  routeValidationContractRegistry: readonly ExecutiveAssistantRouteValidationContractRecord[];
  routeValidationContractCount: number;
  routeBindingRegistry: readonly ExecutiveAssistantRouteBindingRecord[];
  routeBindingCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantRoutingManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantRoutingContracts.ts").ASS_ROUTING_PLATFORM_ID;
  version: typeof ASS_ROUTING_VERSION;
  title: typeof import("./executiveAssistantRoutingContracts.ts").ASS_ROUTING_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  coordinationRouteCount: number;
  scopeRoutingCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantRoutingValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRoutingValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantRoutingValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantRoutingLayerState = Readonly<{
  contractVersion: typeof ASS_ROUTING_VERSION;
  stateDependency: typeof import("./executiveAssistantRoutingContracts.ts").ASS_ROUTING_DEPENDENCY;
  initialized: boolean;
  registry: ExecutiveAssistantRoutingRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRoutingBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: ExecutiveAssistantRoutingLayerState | null;
  readOnly: true;
}>;

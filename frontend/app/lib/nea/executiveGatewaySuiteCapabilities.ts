/**
 * NEA-8:1 — Executive Gateway Suite Capabilities.
 *
 * Suite composition of NEA-1 through NEA-7 Public Indexes and architectural
 * suite capabilities. Public platforms preserved by canonical reference only.
 *
 * Ownership: owned exclusively by NEA-8:1.
 */

import {
  ChannelConnectorPlatformPublicFoundation,
  ChannelConnectorPublicIndexId,
  ChannelConnectorPublicIndexName,
  ChannelConnectorPublicIndexNamespace,
  ChannelConnectorPublicIndexVersion,
  getChannelConnectorPublicApiCount,
} from "./channelConnectorPublicIndex.ts";
import {
  ExecutiveGatewayPlatformPublicFoundation,
  ExecutiveGatewayPublicIndexId,
  ExecutiveGatewayPublicIndexName,
  ExecutiveGatewayPublicIndexNamespace,
  ExecutiveGatewayPublicIndexVersion,
  getExecutiveGatewayPublicApiCount,
} from "./executiveGatewayPublicIndex.ts";
import type {
  ExecutiveGatewaySuiteCapabilityDeclaration,
  ExecutiveGatewaySuiteCapabilityId,
  ExecutiveGatewaySuiteCompositionComponent,
  ExecutiveGatewaySuiteComponentId,
} from "./executiveGatewaySuiteFoundationTypes.ts";
import {
  GatewayRoutingPlatformPublicFoundation,
  GatewayRoutingPublicIndexId,
  GatewayRoutingPublicIndexName,
  GatewayRoutingPublicIndexNamespace,
  GatewayRoutingPublicIndexVersion,
  getGatewayRoutingPublicApiCount,
} from "./gatewayRoutingPublicIndex.ts";
import {
  getIntakeOrchestrationPublicApiCount,
  IntakeOrchestrationPlatformPublicFoundation,
  IntakeOrchestrationPublicIndexId,
  IntakeOrchestrationPublicIndexName,
  IntakeOrchestrationPublicIndexNamespace,
  IntakeOrchestrationPublicIndexVersion,
} from "./intakeOrchestrationPublicIndex.ts";
import {
  getMessageNormalizationPublicApiCount,
  MessageNormalizationPlatformPublicFoundation,
  MessageNormalizationPublicIndexId,
  MessageNormalizationPublicIndexName,
  MessageNormalizationPublicIndexNamespace,
  MessageNormalizationPublicIndexVersion,
} from "./messageNormalizationPublicIndex.ts";
import {
  getSecurityGatewayPublicApiCount,
  SecurityGatewayPlatformPublicFoundation,
  SecurityGatewayPublicIndexId,
  SecurityGatewayPublicIndexName,
  SecurityGatewayPublicIndexNamespace,
  SecurityGatewayPublicIndexVersion,
} from "./securityGatewayPublicIndex.ts";
import {
  getSessionConversationPublicApiCount,
  SessionConversationPlatformPublicFoundation,
  SessionConversationPublicIndexId,
  SessionConversationPublicIndexName,
  SessionConversationPublicIndexNamespace,
  SessionConversationPublicIndexVersion,
} from "./sessionConversationPublicIndex.ts";

const component = (
  componentId: ExecutiveGatewaySuiteComponentId,
  componentName: string,
  stageId: string,
  publicIndexId: string,
  publicIndexVersion: string,
  publicIndexName: string,
  publicIndexNamespace: string,
  publicIndexModule: string,
  publicApiCount: number,
  publicPlatform: unknown,
  order: number,
): ExecutiveGatewaySuiteCompositionComponent =>
  Object.freeze({
    componentId,
    componentName,
    stageId,
    publicIndexId,
    publicIndexVersion,
    publicIndexName,
    publicIndexNamespace,
    publicIndexModule,
    publicApiCount,
    publicPlatform,
    ownership: "Referenced" as const,
    reconstructsUpstream: false as const,
    duplicatesArchitecture: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly seven suite composition components.
 * Public platforms preserved by canonical Public Index reference.
 */
export const ExecutiveGatewaySuiteCompositionComponents: readonly ExecutiveGatewaySuiteCompositionComponent[] =
  Object.freeze([
    component(
      "NEA-1",
      "Executive Gateway",
      "NEA-1:9",
      ExecutiveGatewayPublicIndexId,
      ExecutiveGatewayPublicIndexVersion,
      ExecutiveGatewayPublicIndexName,
      ExecutiveGatewayPublicIndexNamespace,
      "executiveGatewayPublicIndex.ts",
      getExecutiveGatewayPublicApiCount(),
      ExecutiveGatewayPlatformPublicFoundation,
      1,
    ),
    component(
      "NEA-2",
      "Channel Connectors",
      "NEA-2:9",
      ChannelConnectorPublicIndexId,
      ChannelConnectorPublicIndexVersion,
      ChannelConnectorPublicIndexName,
      ChannelConnectorPublicIndexNamespace,
      "channelConnectorPublicIndex.ts",
      getChannelConnectorPublicApiCount(),
      ChannelConnectorPlatformPublicFoundation,
      2,
    ),
    component(
      "NEA-3",
      "Session & Conversation",
      "NEA-3:9",
      SessionConversationPublicIndexId,
      SessionConversationPublicIndexVersion,
      SessionConversationPublicIndexName,
      SessionConversationPublicIndexNamespace,
      "sessionConversationPublicIndex.ts",
      getSessionConversationPublicApiCount(),
      SessionConversationPlatformPublicFoundation,
      3,
    ),
    component(
      "NEA-4",
      "Security Gateway",
      "NEA-4:9",
      SecurityGatewayPublicIndexId,
      SecurityGatewayPublicIndexVersion,
      SecurityGatewayPublicIndexName,
      SecurityGatewayPublicIndexNamespace,
      "securityGatewayPublicIndex.ts",
      getSecurityGatewayPublicApiCount(),
      SecurityGatewayPlatformPublicFoundation,
      4,
    ),
    component(
      "NEA-5",
      "Gateway Routing",
      "NEA-5:9",
      GatewayRoutingPublicIndexId,
      GatewayRoutingPublicIndexVersion,
      GatewayRoutingPublicIndexName,
      GatewayRoutingPublicIndexNamespace,
      "gatewayRoutingPublicIndex.ts",
      getGatewayRoutingPublicApiCount(),
      GatewayRoutingPlatformPublicFoundation,
      5,
    ),
    component(
      "NEA-6",
      "Message Normalization",
      "NEA-6:9",
      MessageNormalizationPublicIndexId,
      MessageNormalizationPublicIndexVersion,
      MessageNormalizationPublicIndexName,
      MessageNormalizationPublicIndexNamespace,
      "messageNormalizationPublicIndex.ts",
      getMessageNormalizationPublicApiCount(),
      MessageNormalizationPlatformPublicFoundation,
      6,
    ),
    component(
      "NEA-7",
      "Intake Orchestration",
      "NEA-7:9",
      IntakeOrchestrationPublicIndexId,
      IntakeOrchestrationPublicIndexVersion,
      IntakeOrchestrationPublicIndexName,
      IntakeOrchestrationPublicIndexNamespace,
      "intakeOrchestrationPublicIndex.ts",
      getIntakeOrchestrationPublicApiCount(),
      IntakeOrchestrationPlatformPublicFoundation,
      7,
    ),
  ]);

/** Canonical immutable suite composition catalog. */
export const ExecutiveGatewaySuiteCompositionCatalog = Object.freeze({
  catalogId: "NEA-8:1/SuiteCompositionCatalog",
  sourcePhase: "NEA-8:1" as const,
  components: ExecutiveGatewaySuiteCompositionComponents,
  componentCount: ExecutiveGatewaySuiteCompositionComponents.length,
  preservesCanonicalReferences: true as const,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Public API inventory derived exclusively from Public Index surfaces. */
export const ExecutiveGatewaySuitePublicApiInventory = Object.freeze({
  inventoryId: "NEA-8:1/Inventory/PublicApis",
  nea1PublicApiCount:
    ExecutiveGatewaySuiteCompositionComponents[0]!.publicApiCount,
  nea2PublicApiCount:
    ExecutiveGatewaySuiteCompositionComponents[1]!.publicApiCount,
  nea3PublicApiCount:
    ExecutiveGatewaySuiteCompositionComponents[2]!.publicApiCount,
  nea4PublicApiCount:
    ExecutiveGatewaySuiteCompositionComponents[3]!.publicApiCount,
  nea5PublicApiCount:
    ExecutiveGatewaySuiteCompositionComponents[4]!.publicApiCount,
  nea6PublicApiCount:
    ExecutiveGatewaySuiteCompositionComponents[5]!.publicApiCount,
  nea7PublicApiCount:
    ExecutiveGatewaySuiteCompositionComponents[6]!.publicApiCount,
  publicApiInventoryTotal: ExecutiveGatewaySuiteCompositionComponents.reduce(
    (total, item) => total + item.publicApiCount,
    0,
  ),
  componentCount: ExecutiveGatewaySuiteCompositionComponents.length,
  sourcedThroughPublicIndexes: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const capability = (
  capabilityId: ExecutiveGatewaySuiteCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): ExecutiveGatewaySuiteCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Architectural suite capabilities — exactly eight. */
export const ExecutiveGatewaySuiteCapabilities: readonly ExecutiveGatewaySuiteCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "GatewaySuiteComposition",
      "Gateway Suite Composition",
      "Declarative composition of released NEA Public Indexes into one suite.",
      1,
    ),
    capability(
      "CanonicalReferenceAggregation",
      "Canonical Reference Aggregation",
      "Aggregate canonical Public Index references without reconstruction.",
      2,
    ),
    capability(
      "PublicPlatformAggregation",
      "Public Platform Aggregation",
      "Expose Public Index platform aggregates by reference only.",
      3,
    ),
    capability(
      "ExecutiveGatewayExposure",
      "Executive Gateway Exposure",
      "Expose Executive Gateway Public Index as the suite entry composition member.",
      4,
    ),
    capability(
      "ConsumerPlatformComposition",
      "Consumer Platform Composition",
      "Declare consumer-facing suite composition without runtime services.",
      5,
    ),
    capability(
      "InventoryAggregation",
      "Inventory Aggregation",
      "Derive suite inventory totals exclusively from Public Index collections.",
      6,
    ),
    capability(
      "ArchitecturePublication",
      "Architecture Publication",
      "Publish suite architectural metadata for Registry and later phases.",
      7,
    ),
    capability(
      "SuiteSummaryDeclaration",
      "Suite Summary Declaration",
      "Declare deterministic suite Foundation summaries without runtime evaluation.",
      8,
    ),
  ]);

/** Canonical immutable suite capability catalog. */
export const ExecutiveGatewaySuiteCapabilityCatalog = Object.freeze({
  catalogId: "NEA-8:1/SuiteCapabilityCatalog",
  sourcePhase: "NEA-8:1" as const,
  capabilities: ExecutiveGatewaySuiteCapabilities,
  capabilityCount: ExecutiveGatewaySuiteCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

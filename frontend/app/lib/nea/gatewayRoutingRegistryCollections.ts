/**
 * NEA-5:2 — Gateway Routing Registry Collections.
 *
 * Canonical immutable registry collections.
 * Foundation destinations, decisions, contexts, contracts, and lifecycle
 * are referenced — not duplicated.
 * Registry-owned vocabularies and route identities are declared here.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:2.
 */

import {
  GatewayRoutingFoundationId,
  GatewayRoutingFoundationPlatform,
} from "./gatewayRoutingFoundation.ts";
import type {
  GatewayRoutingRegistryEntry,
  RouteIdentityDeclaration,
  RoutingPolicyVocabularyId,
  RoutingPriorityId,
  RoutingResultId,
  RoutingStatusId,
  RoutingStrategyId,
} from "./gatewayRoutingRegistryTypes.ts";

const foundation = GatewayRoutingFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-5:1" | "NEA-5:2",
  foundationReference: string | null,
  order: number,
): GatewayRoutingRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Contract registry — Foundation canonical references preserved. */
export const RoutingContractRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze(
    foundation.contracts.contracts.map((item) =>
      entry(
        item.contractId.split("/").at(-1) ?? item.contractId,
        item.contractName,
        item.description,
        "NEA-5:1",
        `${GatewayRoutingFoundationId}/contracts/${item.contractId.split("/").at(-1)}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Destination registry — Foundation canonical references preserved. */
export const RoutingDestinationRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze(
    foundation.destinations.destinations.map((item) =>
      entry(
        item.destinationId,
        item.destinationName,
        item.description,
        "NEA-5:1",
        `${GatewayRoutingFoundationId}/destinations/${item.destinationId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Decision registry — Foundation canonical references preserved. */
export const RoutingDecisionRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze(
    foundation.destinations.decisions.map((item) =>
      entry(
        item.decisionId,
        item.decisionName,
        item.description,
        "NEA-5:1",
        `${GatewayRoutingFoundationId}/decisions/${item.decisionId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Context registry — Foundation canonical references preserved. */
export const RoutingContextRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze(
    foundation.destinations.contextDimensions.map((item) =>
      entry(
        item.dimensionId,
        item.dimensionName,
        item.description,
        "NEA-5:1",
        `${GatewayRoutingFoundationId}/contexts/${item.dimensionId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Lifecycle registry — Foundation canonical references preserved. */
export const RoutingLifecycleRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation routing lifecycle state ${state}.`,
        "NEA-5:1",
        `${GatewayRoutingFoundationId}/lifecycle/${state}`,
        index + 1,
      ),
    ),
  );

const strategy = (
  id: RoutingStrategyId,
  description: string,
  order: number,
): GatewayRoutingRegistryEntry =>
  entry(id, id, description, "NEA-5:2", null, order);

/** Strategy registry — Registry-owned. Declarations only. */
export const RoutingStrategyRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze([
    strategy("Direct", "Direct routing strategy declaration.", 1),
    strategy("Broadcast", "Broadcast routing strategy declaration.", 2),
    strategy("Priority", "Priority routing strategy declaration.", 3),
    strategy("Sequential", "Sequential routing strategy declaration.", 4),
    strategy("Conditional", "Conditional routing strategy declaration.", 5),
    strategy("Failover", "Failover routing strategy declaration.", 6),
    strategy("Deferred", "Deferred routing strategy declaration.", 7),
    strategy("Manual", "Manual routing strategy declaration.", 8),
  ]);

const priority = (
  id: RoutingPriorityId,
  description: string,
  order: number,
): GatewayRoutingRegistryEntry =>
  entry(id, id, description, "NEA-5:2", null, order);

/** Priority registry — Registry-owned. Declarations only. */
export const RoutingPriorityRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze([
    priority("Critical", "Critical routing priority declaration.", 1),
    priority("High", "High routing priority declaration.", 2),
    priority("Normal", "Normal routing priority declaration.", 3),
    priority("Low", "Low routing priority declaration.", 4),
    priority("Deferred", "Deferred routing priority declaration.", 5),
  ]);

const status = (
  id: RoutingStatusId,
  description: string,
  order: number,
): GatewayRoutingRegistryEntry =>
  entry(id, id, description, "NEA-5:2", null, order);

/** Status registry — Registry-owned. Declarations only. */
export const RoutingStatusRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze([
    status("Registered", "Architecture registered routing status.", 1),
    status("Active", "Architecture active routing status.", 2),
    status("Deprecated", "Architecture deprecated routing status.", 3),
    status("Disabled", "Architecture disabled routing status.", 4),
    status("Reserved", "Architecture reserved routing status.", 5),
  ]);

const result = (
  id: RoutingResultId,
  description: string,
  order: number,
): GatewayRoutingRegistryEntry =>
  entry(id, id, description, "NEA-5:2", null, order);

/** Result registry — Registry-owned. Declarations only. */
export const RoutingResultRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze([
    result("Success", "Successful routing result declaration.", 1),
    result("Pending", "Pending routing result declaration.", 2),
    result("Rejected", "Rejected routing result declaration.", 3),
    result("Failed", "Failed routing result declaration.", 4),
    result("Unknown", "Unknown routing result declaration.", 5),
  ]);

const routingPolicy = (
  id: RoutingPolicyVocabularyId,
  label: string,
  description: string,
  order: number,
): GatewayRoutingRegistryEntry =>
  entry(id, label, description, "NEA-5:2", null, order);

/** Routing policy vocabulary registry — declarations only. No policy engine. */
export const RoutingPolicyVocabularyRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze([
    routingPolicy(
      "DestinationRequired",
      "Destination Required",
      "Destination-required architectural policy declaration.",
      1,
    ),
    routingPolicy(
      "PriorityHonored",
      "Priority Honored",
      "Priority-honored architectural policy declaration.",
      2,
    ),
    routingPolicy(
      "FailoverAllowed",
      "Failover Allowed",
      "Failover-allowed architectural policy declaration.",
      3,
    ),
    routingPolicy(
      "CorrelationRequired",
      "Correlation Required",
      "Correlation-required architectural policy declaration.",
      4,
    ),
    routingPolicy(
      "ContextPropagationRequired",
      "Context Propagation Required",
      "Context-propagation-required architectural policy declaration.",
      5,
    ),
    routingPolicy(
      "RejectOnUnknown",
      "Reject On Unknown",
      "Reject-on-unknown architectural policy declaration.",
      6,
    ),
  ]);

const routeIdentity = (
  key: string,
  destination: string,
  decision: string,
  priorityId: RoutingPriorityId,
  statusId: RoutingStatusId,
  order: number,
): RouteIdentityDeclaration =>
  Object.freeze({
    routeId: `NEA-5:2/RouteIdentity/${key}`,
    version: "1.0.0" as const,
    destination,
    decision,
    priority: priorityId,
    status: statusId,
    executesRuntime: false as const,
    routesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Routing identity registry — declarative identities only.
 * No executable routing or consumer invocation.
 */
export const RoutingIdentityRegistry: readonly RouteIdentityDeclaration[] =
  Object.freeze([
    routeIdentity("ExecutiveEngineRoute", "ExecutiveEngine", "Accepted", "Critical", "Registered", 1),
    routeIdentity("DataKnowledgeLayerRoute", "DataKnowledgeLayer", "Accepted", "High", "Registered", 2),
    routeIdentity("AdvisorRoute", "Advisor", "Accepted", "Normal", "Registered", 3),
    routeIdentity("DirectorRoute", "Director", "Accepted", "High", "Registered", 4),
    routeIdentity("EveRoute", "EVE", "Accepted", "Normal", "Registered", 5),
    routeIdentity("OperationsRoute", "Operations", "Accepted", "Normal", "Registered", 6),
    routeIdentity("BusinessPlatformRoute", "BusinessPlatform", "Accepted", "Low", "Registered", 7),
    routeIdentity("InternalServiceRoute", "InternalService", "Accepted", "Normal", "Registered", 8),
    routeIdentity("RejectRoute", "Reject", "Rejected", "Deferred", "Registered", 9),
    routeIdentity("DeadLetterRoute", "DeadLetter", "Failed", "Deferred", "Reserved", 10),
  ]);

/** Aggregate collections object for platform composition. */
export const GatewayRoutingRegistryCollections = Object.freeze({
  collectionsId: "NEA-5:2/RegistryCollections",
  sourcePhase: "NEA-5:2" as const,
  routeIdentities: RoutingIdentityRegistry,
  destinations: RoutingDestinationRegistry,
  decisions: RoutingDecisionRegistry,
  strategies: RoutingStrategyRegistry,
  priorities: RoutingPriorityRegistry,
  statuses: RoutingStatusRegistry,
  results: RoutingResultRegistry,
  contexts: RoutingContextRegistry,
  routingPolicies: RoutingPolicyVocabularyRegistry,
  contracts: RoutingContractRegistry,
  lifecycleEntries: RoutingLifecycleRegistry,
  routeIdentityCount: RoutingIdentityRegistry.length,
  destinationCount: RoutingDestinationRegistry.length,
  decisionCount: RoutingDecisionRegistry.length,
  strategyCount: RoutingStrategyRegistry.length,
  priorityCount: RoutingPriorityRegistry.length,
  statusCount: RoutingStatusRegistry.length,
  resultCount: RoutingResultRegistry.length,
  contextCount: RoutingContextRegistry.length,
  routingPolicyCount: RoutingPolicyVocabularyRegistry.length,
  contractCount: RoutingContractRegistry.length,
  lifecycleEntryCount: RoutingLifecycleRegistry.length,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

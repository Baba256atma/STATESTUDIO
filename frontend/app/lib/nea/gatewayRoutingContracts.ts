/**
 * NEA-5:1 — Gateway Routing Contracts.
 *
 * Immutable contract, destination, decision, and context declarations
 * for Gateway Routing Foundation. Declarations only. No runtime routing.
 *
 * Ownership: owned exclusively by NEA-5:1.
 */

import type {
  GatewayRoutingContextDimensionDeclaration,
  GatewayRoutingContextDimensionId,
  GatewayRoutingContractDeclaration,
  GatewayRoutingDecisionDeclaration,
  GatewayRoutingDecisionId,
  GatewayRoutingDestinationDeclaration,
  GatewayRoutingDestinationId,
} from "./gatewayRoutingFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): GatewayRoutingContractDeclaration =>
  Object.freeze({
    contractId: `NEA-5:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten routing foundation contracts.
 * Order is deterministic and immutable.
 */
export const GatewayRoutingContracts: readonly GatewayRoutingContractDeclaration[] =
  Object.freeze([
    contract(
      "RouteRequest",
      "Route Request",
      "Canonical request fields for a declared gateway routing request — no dispatch.",
      Object.freeze([
        "routeRequestId",
        "requestRef",
        "tenantRef",
        "priority",
        "routesAtRuntime",
      ]),
      1,
    ),
    contract(
      "RouteDecision",
      "Route Decision",
      "Declarative routing decision vocabulary — no decision evaluation runtime.",
      Object.freeze([
        "routeDecisionId",
        "decisionId",
        "decisionName",
        "decisionReason",
        "evaluatesAtRuntime",
      ]),
      2,
    ),
    contract(
      "RouteDestination",
      "Route Destination",
      "Declarative destination vocabulary — no consumer invocation.",
      Object.freeze([
        "routeDestinationId",
        "destinationId",
        "destinationName",
        "destinationKind",
        "routesAtRuntime",
      ]),
      3,
    ),
    contract(
      "RouteContext",
      "Route Context",
      "Declarative routing context dimensions — no context propagation runtime.",
      Object.freeze([
        "routeContextId",
        "tenant",
        "workspace",
        "session",
        "security",
        "propagatesAtRuntime",
      ]),
      4,
    ),
    contract(
      "RouteMetadata",
      "Route Metadata",
      "Immutable routing metadata declarations without runtime state.",
      Object.freeze([
        "metadataId",
        "routeRequestId",
        "correlationId",
        "ownerRef",
        "metadataOnly",
      ]),
      5,
    ),
    contract(
      "RouteResult",
      "Route Result",
      "Declarative routing result vocabulary — no result emission runtime.",
      Object.freeze([
        "routeResultId",
        "decisionId",
        "destinationId",
        "resultStatus",
        "emitsAtRuntime",
      ]),
      6,
    ),
    contract(
      "RoutePolicy",
      "Route Policy",
      "Declarative routing policy metadata — no policy engine execution.",
      Object.freeze([
        "policyId",
        "policyName",
        "policyScope",
        "policyPriority",
        "executesPolicy",
      ]),
      7,
    ),
    contract(
      "RouteLifecycle",
      "Route Lifecycle",
      "Declarative routing lifecycle vocabulary — no state machine runtime.",
      Object.freeze([
        "lifecycleId",
        "lifecycleState",
        "initialState",
        "terminalState",
        "stateMachine",
      ]),
      8,
    ),
    contract(
      "RouteOwnership",
      "Route Ownership",
      "Declarative ownership boundary vocabulary for routing architecture.",
      Object.freeze([
        "ownershipId",
        "owns",
        "doesNotOwn",
        "ownsCount",
        "runtimeBehavior",
      ]),
      9,
    ),
    contract(
      "RouteBoundary",
      "Route Boundary",
      "Declarative prohibited-surface and boundary vocabulary — no enforcement.",
      Object.freeze([
        "boundariesId",
        "consumes",
        "provides",
        "prohibitedSurfaces",
        "runtimeEnforcement",
      ]),
      10,
    ),
  ]);

const destination = (
  destinationId: GatewayRoutingDestinationId,
  destinationName: string,
  description: string,
  order: number,
): GatewayRoutingDestinationDeclaration =>
  Object.freeze({
    destinationId,
    destinationName,
    description,
    routesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical routing destinations — exactly ten. Architecture only. */
export const GatewayRoutingDestinations: readonly GatewayRoutingDestinationDeclaration[] =
  Object.freeze([
    destination(
      "ExecutiveEngine",
      "Executive Engine",
      "Declared destination for Executive Engine consumers — no invocation.",
      1,
    ),
    destination(
      "DataKnowledgeLayer",
      "Data Knowledge Layer",
      "Declared destination for DKL consumers — no DKL invocation.",
      2,
    ),
    destination(
      "Advisor",
      "Advisor",
      "Declared destination for Advisor consumers — no Advisor invocation.",
      3,
    ),
    destination(
      "Director",
      "Director",
      "Declared destination for Director consumers — no Director invocation.",
      4,
    ),
    destination(
      "EVE",
      "EVE",
      "Declared destination for EVE consumers — no EVE invocation.",
      5,
    ),
    destination(
      "Operations",
      "Operations",
      "Declared destination for Operations consumers — no OPS execution.",
      6,
    ),
    destination(
      "BusinessPlatform",
      "Business Platform",
      "Declared destination for Business Platform consumers — no BUS execution.",
      7,
    ),
    destination(
      "InternalService",
      "Internal Service",
      "Declared destination for internal service consumers — no networking.",
      8,
    ),
    destination(
      "Reject",
      "Reject",
      "Declared terminal destination for rejected routes — no rejection runtime.",
      9,
    ),
    destination(
      "DeadLetter",
      "Dead Letter",
      "Declared terminal destination for undeliverable routes — no queue runtime.",
      10,
    ),
  ]);

const decision = (
  decisionId: GatewayRoutingDecisionId,
  decisionName: string,
  description: string,
  order: number,
): GatewayRoutingDecisionDeclaration =>
  Object.freeze({
    decisionId,
    decisionName,
    description,
    evaluatesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical routing decisions — exactly six. Architecture only. */
export const GatewayRoutingDecisions: readonly GatewayRoutingDecisionDeclaration[] =
  Object.freeze([
    decision(
      "Accepted",
      "Accepted",
      "Declarative acceptance decision — no acceptance evaluation runtime.",
      1,
    ),
    decision(
      "Routed",
      "Routed",
      "Declarative routed decision — no dispatch runtime.",
      2,
    ),
    decision(
      "Deferred",
      "Deferred",
      "Declarative deferred decision — no deferral scheduling runtime.",
      3,
    ),
    decision(
      "Rejected",
      "Rejected",
      "Declarative rejected decision — no rejection enforcement runtime.",
      4,
    ),
    decision(
      "Failed",
      "Failed",
      "Declarative failed decision — no failure handling runtime.",
      5,
    ),
    decision(
      "Unknown",
      "Unknown",
      "Declarative unknown decision — no fallback routing runtime.",
      6,
    ),
  ]);

const contextDimension = (
  dimensionId: GatewayRoutingContextDimensionId,
  dimensionName: string,
  description: string,
  order: number,
): GatewayRoutingContextDimensionDeclaration =>
  Object.freeze({
    dimensionId,
    dimensionName,
    description,
    propagatesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical routing context dimensions — exactly eight. Architecture only. */
export const GatewayRoutingContextDimensions: readonly GatewayRoutingContextDimensionDeclaration[] =
  Object.freeze([
    contextDimension(
      "Tenant",
      "Tenant",
      "Declarative tenant context dimension — no tenant resolution runtime.",
      1,
    ),
    contextDimension(
      "Workspace",
      "Workspace",
      "Declarative workspace context dimension — no workspace lookup runtime.",
      2,
    ),
    contextDimension(
      "Session",
      "Session",
      "Declarative session context dimension — no session management runtime.",
      3,
    ),
    contextDimension(
      "Conversation",
      "Conversation",
      "Declarative conversation context dimension — no conversation runtime.",
      4,
    ),
    contextDimension(
      "Security",
      "Security",
      "Declarative security context dimension — no security evaluation runtime.",
      5,
    ),
    contextDimension(
      "Connector",
      "Connector",
      "Declarative connector context dimension — no connector execution.",
      6,
    ),
    contextDimension(
      "Request",
      "Request",
      "Declarative request context dimension — no request processing runtime.",
      7,
    ),
    contextDimension(
      "Priority",
      "Priority",
      "Declarative priority context dimension — no priority scheduling runtime.",
      8,
    ),
  ]);

/** Canonical immutable contract catalog. */
export const GatewayRoutingContractCatalog = Object.freeze({
  catalogId: "NEA-5:1/ContractCatalog",
  sourcePhase: "NEA-5:1" as const,
  contracts: GatewayRoutingContracts,
  contractCount: GatewayRoutingContracts.length,
  destinations: GatewayRoutingDestinations,
  destinationCount: GatewayRoutingDestinations.length,
  decisions: GatewayRoutingDecisions,
  decisionCount: GatewayRoutingDecisions.length,
  contextDimensions: GatewayRoutingContextDimensions,
  contextDimensionCount: GatewayRoutingContextDimensions.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

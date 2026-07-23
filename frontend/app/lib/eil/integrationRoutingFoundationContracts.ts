/**
 * EIL-3:1 — Integration Routing Foundation Contracts.
 *
 * Immutable contract declarations for Integration Routing Foundation surfaces.
 * Declarations only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-3:1.
 */

import type {
  RoutingContract,
  RoutingContractName,
} from "./integrationRoutingFoundationTypes.ts";

const contract = (
  contractName: RoutingContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): RoutingContract =>
  Object.freeze({
    contractId: `EIL-3:1/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten public routing contracts.
 * Order is deterministic and immutable.
 */
export const IntegrationRoutingFoundationContracts: readonly RoutingContract[] =
  Object.freeze([
    contract(
      "RouteContract",
      "Route Contract",
      "Canonical metadata contract binding a route identity to category and path references.",
      Object.freeze([
        "routeId",
        "routeName",
        "categoryRef",
        "pathRef",
        "compatibilityRef",
        "metadataOnly",
      ]),
      1,
    ),
    contract(
      "RouteIdentityContract",
      "Route Identity Contract",
      "Declarative route identity metadata without runtime route resolution.",
      Object.freeze([
        "routeIdentityId",
        "canonicalRouteId",
        "routeName",
        "namespaceRef",
        "runtimeResolved",
      ]),
      2,
    ),
    contract(
      "RoutePathContract",
      "Route Path Contract",
      "Declarative route path metadata without path evaluation or networking.",
      Object.freeze([
        "pathId",
        "pathName",
        "sourceRef",
        "destinationRef",
        "runtimeEvaluated",
      ]),
      3,
    ),
    contract(
      "RoutePolicyContract",
      "Route Policy Contract",
      "Declarative route policy metadata without policy evaluation engines.",
      Object.freeze([
        "policyId",
        "routeRef",
        "policyRuleRef",
        "runtimeEnforced",
      ]),
      4,
    ),
    contract(
      "RouteConditionContract",
      "Route Condition Contract",
      "Declarative route condition metadata without condition evaluation runtime.",
      Object.freeze([
        "conditionId",
        "routeRef",
        "conditionExpressionRef",
        "runtimeEvaluated",
      ]),
      5,
    ),
    contract(
      "RoutePriorityContract",
      "Route Priority Contract",
      "Declarative route priority metadata without priority scheduling runtime.",
      Object.freeze([
        "priorityId",
        "routeRef",
        "priorityOrdinal",
        "runtimeOrdered",
      ]),
      6,
    ),
    contract(
      "RouteCompatibilityContract",
      "Route Compatibility Contract",
      "Declarative compatibility and version-alignment metadata for routes.",
      Object.freeze([
        "compatibilityId",
        "sourceRouteRef",
        "targetRouteRef",
        "compatibilityRule",
        "runtimeValidation",
      ]),
      7,
    ),
    contract(
      "RouteConfigurationContract",
      "Route Configuration Contract",
      "Declarative configuration metadata for routes without configuration engines.",
      Object.freeze([
        "configurationId",
        "routeRef",
        "parameterRefs",
        "runtimeApplied",
      ]),
      8,
    ),
    contract(
      "RouteLifecycleContract",
      "Route Lifecycle Contract",
      "Declarative route lifecycle metadata without lifecycle state machines.",
      Object.freeze([
        "lifecycleId",
        "routeRef",
        "lifecycleState",
        "executesTransitions",
      ]),
      9,
    ),
    contract(
      "RouteMetadataContract",
      "Route Metadata Contract",
      "Declarative route metadata envelope without persistence or inventory engines.",
      Object.freeze([
        "metadataId",
        "routeRef",
        "annotationRefs",
        "runtimeStored",
      ]),
      10,
    ),
  ]);

export const IntegrationRoutingFoundationContractNames = Object.freeze([
  "RouteContract",
  "RouteIdentityContract",
  "RoutePathContract",
  "RoutePolicyContract",
  "RouteConditionContract",
  "RoutePriorityContract",
  "RouteCompatibilityContract",
  "RouteConfigurationContract",
  "RouteLifecycleContract",
  "RouteMetadataContract",
] as const satisfies readonly RoutingContractName[]);

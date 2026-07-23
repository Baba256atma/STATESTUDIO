/**
 * EIL-1:1 — Integration Foundation Contracts.
 *
 * Immutable contract declarations for Integration Foundation surfaces.
 * Declarations only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type {
  IntegrationContractDeclaration,
  IntegrationContractName,
} from "./integrationFoundationTypes.ts";

const contract = (
  contractName: IntegrationContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): IntegrationContractDeclaration =>
  Object.freeze({
    contractId: `EIL-1:1/Contract/${contractName}` as const,
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
 * Exactly ten public integration contracts.
 * Order is deterministic and immutable.
 */
export const IntegrationFoundationContracts: readonly IntegrationContractDeclaration[] =
  Object.freeze([
    contract(
      "IntegrationContract",
      "Integration Contract",
      "Canonical metadata contract binding an integration identity to participating platforms.",
      Object.freeze([
        "integrationId",
        "integrationName",
        "sourcePlatformId",
        "targetPlatformId",
        "contractRefs",
        "compatibilityRef",
        "metadataOnly",
      ]),
      1,
    ),
    contract(
      "PlatformContract",
      "Platform Contract",
      "Declarative identity and role metadata for a coordinated Nexora platform.",
      Object.freeze([
        "platformId",
        "platformName",
        "role",
        "integrationMode",
        "executesBusinessLogic",
      ]),
      2,
    ),
    contract(
      "ConsumerContract",
      "Consumer Contract",
      "Declarative consumer-side integration metadata without request execution.",
      Object.freeze([
        "consumerId",
        "platformId",
        "acceptedContractRefs",
        "dependencyDirection",
        "runtimeDispatch",
      ]),
      3,
    ),
    contract(
      "ProducerContract",
      "Producer Contract",
      "Declarative producer-side integration metadata without payload emission.",
      Object.freeze([
        "producerId",
        "platformId",
        "providedContractRefs",
        "dependencyDirection",
        "runtimeEmission",
      ]),
      4,
    ),
    contract(
      "EventContract",
      "Event Contract",
      "Declarative event coordination shape without queues or messaging runtime.",
      Object.freeze([
        "eventContractId",
        "eventName",
        "producerRef",
        "consumerRefs",
        "correlationRef",
        "transportImplemented",
      ]),
      5,
    ),
    contract(
      "RequestContract",
      "Request Contract",
      "Declarative request shape for cross-platform coordination metadata.",
      Object.freeze([
        "requestContractId",
        "sourcePlatformId",
        "targetPlatformId",
        "capabilityRef",
        "correlationRef",
        "runtimeDispatch",
      ]),
      6,
    ),
    contract(
      "ResponseContract",
      "Response Contract",
      "Declarative response shape for cross-platform coordination metadata.",
      Object.freeze([
        "responseContractId",
        "requestContractId",
        "statusRef",
        "capabilityRef",
        "runtimeExecution",
      ]),
      7,
    ),
    contract(
      "CoordinationContract",
      "Coordination Contract",
      "Declarative executive coordination metadata without orchestration engines.",
      Object.freeze([
        "coordinationId",
        "participantPlatformIds",
        "coordinationKind",
        "boundaryRefs",
        "executesOrchestration",
      ]),
      8,
    ),
    contract(
      "RoutingContract",
      "Routing Contract",
      "Declarative routing path metadata without networking or transport.",
      Object.freeze([
        "routeId",
        "sourcePlatformId",
        "targetPlatformId",
        "routingKind",
        "transportImplemented",
      ]),
      9,
    ),
    contract(
      "CompatibilityContract",
      "Compatibility Contract",
      "Declarative compatibility and version-alignment metadata between platforms.",
      Object.freeze([
        "compatibilityId",
        "sourcePlatformId",
        "targetPlatformId",
        "compatibilityRule",
        "versionAlignment",
        "runtimeValidation",
      ]),
      10,
    ),
  ]);

export const IntegrationFoundationContractNames = Object.freeze([
  "IntegrationContract",
  "PlatformContract",
  "ConsumerContract",
  "ProducerContract",
  "EventContract",
  "RequestContract",
  "ResponseContract",
  "CoordinationContract",
  "RoutingContract",
  "CompatibilityContract",
] as const satisfies readonly IntegrationContractName[]);

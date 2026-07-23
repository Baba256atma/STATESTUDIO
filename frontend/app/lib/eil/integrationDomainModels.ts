/**
 * EIL-1:3 — Integration Domain Models.
 *
 * Immutable architectural domain models derived from Registry references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:3.
 */

import {
  IntegrationRegistryIdentity,
  IntegrationRegistryPlatform,
} from "./integrationRegistry.ts";
import type {
  IntegrationDomainModel,
  IntegrationModelCategory,
  IntegrationRegistryReference,
} from "./integrationModelTypes.ts";

const registry = IntegrationRegistryPlatform;

const registryRef = (
  collection: IntegrationRegistryReference["collection"],
  entryKey: string,
): IntegrationRegistryReference =>
  Object.freeze({
    registryId: IntegrationRegistryIdentity.canonicalId,
    registryNamespace: IntegrationRegistryIdentity.namespace,
    entryPoint: "integrationRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const domainModel = (
  key: string,
  canonicalName: string,
  category: IntegrationModelCategory,
  description: string,
  collection: IntegrationRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationDomainModel =>
  Object.freeze({
    modelId: `EIL-1:3/Model/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    category,
    sourceRegistryReference: registryRef(collection, entryKey),
    ownership: "EIL-1:3" as const,
    lifecycle: "Verified" as const,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen canonical domain model definitions.
 * Registry collections are referenced, never duplicated.
 */
export const IntegrationDomainModels: readonly IntegrationDomainModel[] =
  Object.freeze([
    domainModel(
      "IntegrationModel",
      "Integration Model",
      "IntegrationModel",
      "Root architectural model for the Executive Integration Layer.",
      "collections",
      "collections",
      1,
      Object.freeze(["domain", "root"]),
    ),
    domainModel(
      "IntegrationDomain",
      "Integration Domain",
      "IntegrationDomain",
      "Architectural domain spanning coordinated Nexora platforms.",
      "categories",
      "IntegrationType",
      2,
      Object.freeze(["domain"]),
    ),
    domainModel(
      "IntegrationParticipant",
      "Integration Participant",
      "IntegrationParticipant",
      "Participant role model for producers, consumers, and coordinators.",
      "types",
      "PlatformRole.Producer",
      3,
      Object.freeze(["participant"]),
    ),
    domainModel(
      "IntegrationPlatform",
      "Integration Platform",
      "IntegrationPlatform",
      "Platform identity model referencing Registry platform-role vocabulary.",
      "types",
      "PlatformRole.Both",
      4,
      Object.freeze(["platform"]),
    ),
    domainModel(
      "IntegrationContract",
      "Integration Contract",
      "IntegrationContract",
      "Contract model mapped from Registry contract entries.",
      "contracts",
      registry.contracts[0]!.key,
      5,
      Object.freeze(["contract"]),
    ),
    domainModel(
      "IntegrationCapability",
      "Integration Capability",
      "IntegrationCapability",
      "Capability model mapped from Registry capability entries.",
      "capabilities",
      registry.capabilities[0]!.key,
      6,
      Object.freeze(["capability"]),
    ),
    domainModel(
      "IntegrationResponsibility",
      "Integration Responsibility",
      "IntegrationResponsibility",
      "Responsibility model mapped from Registry responsibility entries.",
      "responsibilities",
      registry.responsibilities[0]!.key,
      7,
      Object.freeze(["responsibility"]),
    ),
    domainModel(
      "IntegrationLifecycle",
      "Integration Lifecycle",
      "IntegrationLifecycle",
      "Lifecycle model mapped from Registry lifecycle coverage.",
      "lifecycleCoverage",
      registry.lifecycleCoverage[0]!.state,
      8,
      Object.freeze(["lifecycle"]),
    ),
    domainModel(
      "IntegrationTopology",
      "Integration Topology",
      "IntegrationTopology",
      "Topology model describing architectural node relationships.",
      "categories",
      "Coordination",
      9,
      Object.freeze(["topology"]),
    ),
    domainModel(
      "IntegrationBoundary",
      "Integration Boundary",
      "IntegrationBoundary",
      "Boundary model preserving platform separation metadata.",
      "categories",
      "Ownership",
      10,
      Object.freeze(["boundary"]),
    ),
    domainModel(
      "IntegrationDependency",
      "Integration Dependency",
      "IntegrationDependency",
      "Dependency-direction model for architectural coupling rules.",
      "categories",
      "Compatibility",
      11,
      Object.freeze(["dependency"]),
    ),
    domainModel(
      "IntegrationRoute",
      "Integration Route",
      "IntegrationRoute",
      "Declarative route model without transport or networking.",
      "categories",
      "Routing",
      12,
      Object.freeze(["route"]),
    ),
    domainModel(
      "IntegrationExchange",
      "Integration Exchange",
      "IntegrationExchange",
      "Request/response exchange model without runtime dispatch.",
      "contracts",
      "RequestContract",
      13,
      Object.freeze(["exchange"]),
    ),
    domainModel(
      "IntegrationContext",
      "Integration Context",
      "IntegrationContext",
      "Shared integration context model for metadata envelopes.",
      "types",
      "ExecutiveIntegration",
      14,
      Object.freeze(["context"]),
    ),
    domainModel(
      "IntegrationOwnership",
      "Integration Ownership",
      "IntegrationOwnership",
      "Ownership model for architectural responsibility boundaries.",
      "categories",
      "Ownership",
      15,
      Object.freeze(["ownership"]),
    ),
    domainModel(
      "IntegrationCompatibility",
      "Integration Compatibility",
      "IntegrationCompatibility",
      "Compatibility model for declarative platform alignment.",
      "categories",
      "Compatibility",
      16,
      Object.freeze(["compatibility"]),
    ),
  ]);

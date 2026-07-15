import { ExecutiveDecisionCapabilityRegistryPlatform } from "./executiveDecisionCapabilityRegistryPlatform.ts";
import { ExecutiveDecisionDomainRegistry } from "./executiveDecisionDomainRegistry.ts";
import {
  ExecutiveDecisionDependencyRegistry,
  ExecutiveDecisionOwnershipRegistry,
  ExecutiveDecisionRegistryBoundaryAlignment,
} from "./executiveDecisionOwnershipDependencyRegistry.ts";
import {
  ExecutiveDecisionLifecycleRegistry,
  ExecutiveDecisionOutputRegistry,
} from "./executiveDecisionOutputLifecycleRegistry.ts";
import {
  ExecutiveDecisionFoundation,
  ExecutiveDecisionCapabilityRegistry as FoundationCapabilityRegistry,
} from "./executiveDecisionPublicApi.ts";
import type {
  ExecutiveDecisionCapabilityRegistryEntry,
  ExecutiveDecisionDomainRegistryEntry,
  ExecutiveDecisionLifecycleRegistryEntry,
  ExecutiveDecisionOutputRegistryEntry,
  ExecutiveDecisionPublicContractRegistryEntry,
  ExecutiveDecisionRegistryMetadata as ExecutiveDecisionRegistryMetadataDescriptor,
  ExecutiveDecisionRegistrySummary,
  ExecutiveDecisionTypeRegistryEntry,
} from "./executiveDecisionRegistryTypes.ts";
import { ExecutiveDecisionTypeRegistry } from "./executiveDecisionTypeRegistry.ts";

const CONTRACT_NAMESPACE = "Nexora.Engine.ExecutiveDecision.Registry.Contract";

const publicContract = (
  key: string,
  name: string,
  description: string,
  originatingPhase: "ENG-7:1" | "ENG-7:2",
  publicSurface: string,
) => Object.freeze({
  id: `eng-7-public-contract-${key}`,
  contractKey: key,
  name,
  description,
  namespace: CONTRACT_NAMESPACE,
  originatingPhase,
  publicSurface,
  owner: "ENG-7",
  status: "Registered",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionPublicContractRegistryEntry);

export const ExecutiveDecisionPublicContractRegistry = Object.freeze([
  publicContract(
    "foundation",
    "ExecutiveDecisionFoundation",
    "Public foundation contract consumed from ENG-7:1 public API.",
    "ENG-7:1",
    "executiveDecisionPublicApi.ts",
  ),
  publicContract(
    "foundation-capabilities",
    "ExecutiveDecisionCapabilityRegistry",
    "Foundation capability registry identifiers consumed through public API.",
    "ENG-7:1",
    "executiveDecisionPublicApi.ts",
  ),
  publicContract(
    "domain-registry",
    "ExecutiveDecisionDomainRegistry",
    "Public domain registry contract for ENG-7:2.",
    "ENG-7:2",
    "executiveDecisionRegistryPlatform.ts",
  ),
  publicContract(
    "type-registry",
    "ExecutiveDecisionTypeRegistry",
    "Public decision-type registry contract for ENG-7:2.",
    "ENG-7:2",
    "executiveDecisionRegistryPlatform.ts",
  ),
  publicContract(
    "capability-registry",
    "ExecutiveDecisionCapabilityRegistryPlatform",
    "Public expanded capability registry contract for ENG-7:2.",
    "ENG-7:2",
    "executiveDecisionRegistryPlatform.ts",
  ),
  publicContract(
    "output-registry",
    "ExecutiveDecisionOutputRegistry",
    "Public output registry contract for ENG-7:2.",
    "ENG-7:2",
    "executiveDecisionRegistryPlatform.ts",
  ),
  publicContract(
    "lifecycle-registry",
    "ExecutiveDecisionLifecycleRegistry",
    "Public lifecycle registry contract for ENG-7:2.",
    "ENG-7:2",
    "executiveDecisionRegistryPlatform.ts",
  ),
] as const);

export const ExecutiveDecisionRegistryMetadata = Object.freeze({
  id: "ENG-7:2",
  name: "Executive Decision Registry Platform",
  namespace: "Nexora.Engine.ExecutiveDecision.Registry",
  version: "1.0.0",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-7",
  previousPhase: "ENG-7:1",
  nextPhase: "ENG-7:3",
  readiness: "ReadyForDecisionModel",
  foundationId: ExecutiveDecisionFoundation.id,
  foundationCapabilityCount: FoundationCapabilityRegistry.length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionRegistryMetadataDescriptor & {
  readonly foundationId: string;
  readonly foundationCapabilityCount: number;
});

const summary = Object.freeze({
  registryId: "ENG-7:2",
  phase: "ENG-7:2",
  namespace: "Nexora.Engine.ExecutiveDecision.Registry",
  owner: "ENG-7",
  domainCount: ExecutiveDecisionDomainRegistry.length,
  typeCount: ExecutiveDecisionTypeRegistry.length,
  capabilityCount: ExecutiveDecisionCapabilityRegistryPlatform.length,
  outputCount: ExecutiveDecisionOutputRegistry.length,
  lifecycleStateCount: ExecutiveDecisionLifecycleRegistry.length,
  ownershipEntryCount: ExecutiveDecisionOwnershipRegistry.length,
  dependencyEntryCount: ExecutiveDecisionDependencyRegistry.length,
  publicContractCount: ExecutiveDecisionPublicContractRegistry.length,
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  ownershipStatus: "OwnershipProtected",
  dependencyStatus: "DependencySafe",
  readiness: "ReadyForDecisionModel",
  nextPhase: "ENG-7:3",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionRegistrySummary);

export const ExecutiveDecisionRegistryPlatform = Object.freeze({
  metadata: ExecutiveDecisionRegistryMetadata,
  domains: ExecutiveDecisionDomainRegistry,
  types: ExecutiveDecisionTypeRegistry,
  capabilities: ExecutiveDecisionCapabilityRegistryPlatform,
  outputs: ExecutiveDecisionOutputRegistry,
  lifecycle: ExecutiveDecisionLifecycleRegistry,
  ownership: ExecutiveDecisionOwnershipRegistry,
  dependencies: ExecutiveDecisionDependencyRegistry,
  publicContracts: ExecutiveDecisionPublicContractRegistry,
  summary,
  boundaryAlignment: ExecutiveDecisionRegistryBoundaryAlignment,
  guarantees: Object.freeze({
    status: "Stable",
    architectureMode: "MetadataOnly",
    immutability: "DeeplyFrozen",
    ownershipStatus: "OwnershipProtected",
    dependencyStatus: "DependencySafe",
    readiness: "ReadyForDecisionModel",
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

const domainIndex = Object.freeze(
  Object.fromEntries(ExecutiveDecisionDomainRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveDecisionDomainRegistryEntry | undefined>
  >,
);
const typeIndex = Object.freeze(
  Object.fromEntries(ExecutiveDecisionTypeRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveDecisionTypeRegistryEntry | undefined>
  >,
);
const capabilityIndex = Object.freeze(
  Object.fromEntries(ExecutiveDecisionCapabilityRegistryPlatform.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveDecisionCapabilityRegistryEntry | undefined>
  >,
);
const outputIndex = Object.freeze(
  Object.fromEntries(ExecutiveDecisionOutputRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveDecisionOutputRegistryEntry | undefined>
  >,
);
const lifecycleIndex = Object.freeze(
  Object.fromEntries(ExecutiveDecisionLifecycleRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveDecisionLifecycleRegistryEntry | undefined>
  >,
);

export const getExecutiveDecisionRegistryPlatform = () => ExecutiveDecisionRegistryPlatform;
export const getExecutiveDecisionRegistryMetadata = () => ExecutiveDecisionRegistryMetadata;
export const getExecutiveDecisionDomainById = (
  id: string,
): ExecutiveDecisionDomainRegistryEntry | undefined => domainIndex[id];
export const getExecutiveDecisionTypeById = (
  id: string,
): ExecutiveDecisionTypeRegistryEntry | undefined => typeIndex[id];
export const getExecutiveDecisionCapabilityById = (
  id: string,
): ExecutiveDecisionCapabilityRegistryEntry | undefined => capabilityIndex[id];
export const getExecutiveDecisionOutputById = (
  id: string,
): ExecutiveDecisionOutputRegistryEntry | undefined => outputIndex[id];
export const getExecutiveDecisionLifecycleStateById = (
  id: string,
): ExecutiveDecisionLifecycleRegistryEntry | undefined => lifecycleIndex[id];
export const getExecutiveDecisionRegistrySummary = () => summary;

export {
  ExecutiveDecisionCapabilityRegistryPlatform,
  ExecutiveDecisionDomainRegistry,
  ExecutiveDecisionLifecycleRegistry,
  ExecutiveDecisionOutputRegistry,
  ExecutiveDecisionTypeRegistry,
};

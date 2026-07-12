import { DependencyIntelligenceContracts } from "./dependencyIntelligenceContracts.ts";
import { DependencyIntelligenceMetadata } from "./dependencyIntelligenceMetadata.ts";
import { DependencyIntelligenceRegistry } from "./dependencyIntelligenceRegistry.ts";
import {
  DependencyIntelligenceTypes,
  type DependencyFoundationDescriptor,
} from "./dependencyIntelligenceTypes.ts";

const foundationDescriptor = Object.freeze({
  namespace: "nexora.ops.dependency-intelligence.foundation",
  contractCount: DependencyIntelligenceContracts.all.length,
  metadataCatalogCount: 7,
  registryStatus: "Complete",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DependencyFoundationDescriptor);

export const ExecutiveDependencyIntelligenceFoundation = Object.freeze({
  contracts: DependencyIntelligenceContracts,
  registry: DependencyIntelligenceRegistry,
  metadata: DependencyIntelligenceMetadata,
  types: DependencyIntelligenceTypes,
  descriptor: foundationDescriptor,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveDependencyFoundation = () =>
  ExecutiveDependencyIntelligenceFoundation;

export const getExecutiveDependencyMetadata = () => DependencyIntelligenceMetadata;

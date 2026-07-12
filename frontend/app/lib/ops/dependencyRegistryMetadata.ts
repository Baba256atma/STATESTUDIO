import {
  DependencyCompatibilityVersion,
  DependencyIntelligenceRegistry,
} from "./dependencyIntelligenceIndex.ts";
import { DependencyEntityRegistry } from "./dependencyEntityRegistry.ts";
import { DependencyLifecycleRegistry } from "./dependencyLifecycleRegistry.ts";
import { DependencyRelationshipRegistry } from "./dependencyRelationshipRegistry.ts";
import type {
  DependencyRegistryDescriptor,
  DependencyRegistrySummary as DependencyRegistrySummaryShape,
} from "./dependencyRegistryTypes.ts";

export const DependencyRegistryMetadata = Object.freeze({
  platformId: DependencyIntelligenceRegistry.platformId,
  registryVersion: DependencyIntelligenceRegistry.version,
  supportedEntityCount: DependencyEntityRegistry.length,
  supportedRelationshipCount: DependencyRelationshipRegistry.length,
  supportedLifecycleCount: DependencyLifecycleRegistry.length,
  compatibilityVersion: DependencyCompatibilityVersion,
  deterministicStatus: "Deterministic",
  readonlyStatus: "Readonly",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DependencyRegistryDescriptor);

export const ExecutiveDependencyRegistrySummary = Object.freeze({
  entityCount: DependencyEntityRegistry.length,
  relationshipCount: DependencyRelationshipRegistry.length,
  lifecycleCount: DependencyLifecycleRegistry.length,
  status: "PASS",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DependencyRegistrySummaryShape);

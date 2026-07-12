import { DependencyEntityRegistry } from "./dependencyEntityRegistry.ts";
import { DependencyLifecycleRegistry } from "./dependencyLifecycleRegistry.ts";
import {
  DependencyRegistryMetadata,
  ExecutiveDependencyRegistrySummary,
} from "./dependencyRegistryMetadata.ts";
import { DependencyRelationshipRegistry } from "./dependencyRelationshipRegistry.ts";

export const ExecutiveDependencyRegistry = Object.freeze({
  entities: DependencyEntityRegistry,
  relationships: DependencyRelationshipRegistry,
  lifecycle: DependencyLifecycleRegistry,
  metadata: DependencyRegistryMetadata,
  summary: ExecutiveDependencyRegistrySummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveDependencyRegistry = () => ExecutiveDependencyRegistry;

export const getDependencyEntityRegistry = () => DependencyEntityRegistry;

export const getDependencyRelationshipRegistry = () =>
  DependencyRelationshipRegistry;

export const getDependencyLifecycleRegistry = () => DependencyLifecycleRegistry;

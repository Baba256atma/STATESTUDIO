export interface ResourceModelIdentity {
  readonly resourceIdPattern: string;
  readonly displayName: string;
  readonly description: string;
  readonly supportedCategories: readonly string[];
  readonly sourcePlatform: string;
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceCapacityDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly unitOfMeasure: string;
  readonly planningMetadata: readonly string[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceAvailabilityDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly availabilityStates: readonly string[];
  readonly availabilityWindowMetadata: readonly string[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceOwnershipDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly ownerTypes: readonly string[];
  readonly accountabilityMetadata: readonly string[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceCostDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly costCategories: readonly string[];
  readonly budgetingMetadata: readonly string[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceCapabilityDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly skillCategories: readonly string[];
  readonly capabilityDescriptors: readonly string[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceLocationDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly locationTypes: readonly string[];
  readonly accessMetadata: readonly string[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceDependencyDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly dependencyTypes: readonly string[];
  readonly downstreamImpactMetadata: readonly string[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceLinkageDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly linkedProjects: readonly string[];
  readonly linkedWorkflows: readonly string[];
  readonly linkedTasks: readonly string[];
  readonly executionReadinessSupport: readonly ResourceExecutionReadinessDescriptor[];
  readonly metadata: ResourceModelMetadata;
}

export interface ResourceExecutionReadinessDescriptor {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly supportedExecutionLevels: readonly string[];
  readonly readinessMetadata: readonly string[];
}

export interface ResourceModelMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly sourceDependencies: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

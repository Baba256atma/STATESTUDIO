import { ExecutiveResourceIntelligenceFoundation } from "./resourceIntelligenceIndex.ts";
import { ResourcePlatformMetadata } from "./resourceMetadataIndex.ts";
import { ResourceAvailabilityModel } from "./resourceAvailabilityModel.ts";
import { ResourceCapabilityModel } from "./resourceCapabilityModel.ts";
import { ResourceCapacityModel } from "./resourceCapacityModel.ts";
import { ResourceCostModel } from "./resourceCostModel.ts";
import { ResourceDependencyModel } from "./resourceDependencyModel.ts";
import { ResourceIdentityModel } from "./resourceIdentityModel.ts";
import { ResourceLinkageModel } from "./resourceLinkageModel.ts";
import { ResourceLocationModel } from "./resourceLocationModel.ts";
import { ResourceOwnershipModel } from "./resourceOwnershipModel.ts";

export const buildResourceModelManifest = () =>
  Object.freeze({
    foundation: ExecutiveResourceIntelligenceFoundation,
    metadata: ResourcePlatformMetadata,
    models: Object.freeze({
      identity: ResourceIdentityModel,
      capacity: ResourceCapacityModel,
      availability: ResourceAvailabilityModel,
      ownership: ResourceOwnershipModel,
      cost: ResourceCostModel,
      capability: ResourceCapabilityModel,
      location: ResourceLocationModel,
      dependency: ResourceDependencyModel,
      linkage: ResourceLinkageModel,
    }),
    compatibility: Object.freeze({
      compatibilityVersion: ResourcePlatformMetadata.compatibilityVersion,
      supportedDomainCount: ResourcePlatformMetadata.supportedResourceDomains.length,
      capacityDescriptorCount: ResourceCapacityModel.length,
      availabilityDescriptorCount: ResourceAvailabilityModel.length,
      ownershipDescriptorCount: ResourceOwnershipModel.length,
      costDescriptorCount: ResourceCostModel.length,
      capabilityDescriptorCount: ResourceCapabilityModel.length,
      locationDescriptorCount: ResourceLocationModel.length,
      dependencyDescriptorCount: ResourceDependencyModel.length,
      executionReadinessDescriptorCount:
        ResourceLinkageModel.executionReadinessSupport.length,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

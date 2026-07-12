import { ResourcePublicApiRegistry } from "./resourceMetadataIndex.ts";
import {
  ResourceAvailabilityModel,
  ResourceCapabilityModel,
  ResourceCapacityModel,
  ResourceCostModel,
  ResourceDependencyModel,
  ResourceIdentityModel,
  ResourceLinkageModel,
  ResourceLocationModel,
  ResourceOwnershipModel,
} from "./resourceModelIndex.ts";
import {
  ResourceIntelligenceIdentity,
  ResourceIntelligencePublicApis,
} from "./resourceIntelligenceIndex.ts";
import type { ResourceValidationEntry } from "./resourceValidationTypes.ts";

const objectModels = Object.freeze([
  ResourceIdentityModel,
  ResourceLinkageModel,
]);

const arrayModels = Object.freeze([
  ResourceCapacityModel,
  ResourceAvailabilityModel,
  ResourceOwnershipModel,
  ResourceCostModel,
  ResourceCapabilityModel,
  ResourceLocationModel,
  ResourceDependencyModel,
]);

export const ResourcePublicApiValidation = Object.freeze([
  Object.freeze({
    id: "resource-public-api-stability",
    name: "Public API Stability",
    description: "Validates stable public API exposure across OPS-5 phases.",
    category: "PublicApi",
    status:
      ResourceIntelligencePublicApis.length === 3 &&
      ResourcePublicApiRegistry.length >= 9
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-public-api-consumer-only",
    name: "Public API Consumer Only",
    description: "Validates public API remains consumer-facing and metadata-only.",
    category: "PublicApi",
    status:
      objectModels.every((model) => model.metadata.metadataOnly) &&
      arrayModels.every(
        (model) => Object.isFrozen(model) && model.every((entry) => entry.metadata.metadataOnly),
      ) &&
      ResourceIntelligenceIdentity.metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-public-api-immutability",
    name: "Public API Immutability",
    description: "Validates immutable public API registry and exported models.",
    category: "Immutability",
    status:
      Object.isFrozen(ResourcePublicApiRegistry) &&
      Object.isFrozen(ResourceIdentityModel) &&
      Object.isFrozen(ResourceCapacityModel) &&
      Object.isFrozen(ResourceAvailabilityModel) &&
      Object.isFrozen(ResourceOwnershipModel) &&
      Object.isFrozen(ResourceCostModel) &&
      Object.isFrozen(ResourceCapabilityModel) &&
      Object.isFrozen(ResourceLocationModel) &&
      Object.isFrozen(ResourceDependencyModel) &&
      Object.isFrozen(ResourceLinkageModel)
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
] as const);

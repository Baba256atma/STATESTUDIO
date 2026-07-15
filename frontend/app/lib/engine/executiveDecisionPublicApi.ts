import { ExecutiveDecisionCapabilityRegistry } from "./executiveDecisionCapabilityRegistry.ts";
import { ExecutiveDecisionDependencyMap } from "./executiveDecisionDependencyMap.ts";
import {
  ExecutiveDecisionFoundation,
  ExecutiveDecisionFoundationMetadata,
} from "./executiveDecisionFoundation.ts";
import { ExecutiveDecisionOwnershipMap } from "./executiveDecisionOwnership.ts";

export {
  ExecutiveDecisionCapabilityRegistry,
  ExecutiveDecisionDependencyMap,
  ExecutiveDecisionFoundation,
  ExecutiveDecisionOwnershipMap,
};

export const getExecutiveDecisionFoundation = () => ExecutiveDecisionFoundation;
export const getExecutiveDecisionMetadata = () => ExecutiveDecisionFoundationMetadata;

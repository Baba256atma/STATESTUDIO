export type {
  ExecutiveStrategyAlignment as ExecutiveStrategyAlignmentContract,
  ExecutiveStrategyAlignmentConstraint,
  ExecutiveStrategyAlignmentContext,
  ExecutiveStrategyAlignmentDependency,
  ExecutiveStrategyAlignmentEvidence,
  ExecutiveStrategyAlignmentExtensionPolicy,
  ExecutiveStrategyAlignmentIdentity,
  ExecutiveStrategyAlignmentManifest,
  ExecutiveStrategyAlignmentName,
  ExecutiveStrategyAlignmentPlatform as ExecutiveStrategyAlignmentPlatformContract,
  ExecutiveStrategyAlignmentPlatformDependency,
  ExecutiveStrategyAlignmentPurpose,
  ExecutiveStrategyAlignmentRegistry,
  ExecutiveStrategyAlignmentRelationship,
  ExecutiveStrategyAlignmentRelationshipType,
  ExecutiveStrategyAlignmentScope,
  ExecutiveStrategyAlignmentStatus,
  ExecutiveStrategyAlignmentType,
  ExecutiveStrategyAlignmentValidation,
} from "./executiveStrategyAlignmentTypes.ts";

export { getExecutiveStrategyAlignmentManifest } from "./executiveStrategyAlignmentManifest.ts";
export {
  EXECUTIVE_STRATEGY_ALIGNMENT_CONSTRAINT_REGISTRY,
  EXECUTIVE_STRATEGY_ALIGNMENT_DEPENDENCIES,
  EXECUTIVE_STRATEGY_ALIGNMENT_DEPENDENCY_REGISTRY,
  EXECUTIVE_STRATEGY_ALIGNMENT_EVIDENCE_REGISTRY,
  EXECUTIVE_STRATEGY_ALIGNMENT_EXTENSION_POLICY,
  EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
  EXECUTIVE_STRATEGY_ALIGNMENT_RELATIONSHIPS,
  EXECUTIVE_STRATEGY_ALIGNMENTS,
  listExecutiveStrategyAlignmentPublicApis,
  listExecutiveStrategyAlignments,
} from "./executiveStrategyAlignmentRegistry.ts";

import { getExecutiveStrategyAlignmentManifest } from "./executiveStrategyAlignmentManifest.ts";
import {
  EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
  listExecutiveStrategyAlignmentPublicApis,
  listExecutiveStrategyAlignments,
} from "./executiveStrategyAlignmentRegistry.ts";
import type {
  ExecutiveStrategyAlignmentPlatform as ExecutiveStrategyAlignmentPlatformType,
  ExecutiveStrategyAlignmentValidation as ExecutiveStrategyAlignmentValidationType,
} from "./executiveStrategyAlignmentTypes.ts";

function buildBuilderValidation(): ExecutiveStrategyAlignmentValidationType {
  const registry = EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY;
  const valid =
    registry.platformId === "BUS-23" &&
    registry.alignments.length > 0 &&
    registry.evidence.length > 0 &&
    registry.constraints.length > 0 &&
    registry.dependencies.length > 0 &&
    registry.relationships.length > 0 &&
    registry.publicApis.length > 0 &&
    registry.metadataOnly &&
    registry.immutable;

  return Object.freeze({
    valid,
    errors: Object.freeze(valid ? [] : ["builder-registry-validation-failed"]),
    warnings: Object.freeze([]),
  });
}

function validateExecutiveStrategyAlignmentFacade(): ExecutiveStrategyAlignmentValidationType {
  return buildBuilderValidation();
}

export function buildExecutiveStrategyAlignment(): ExecutiveStrategyAlignmentPlatformType {
  const manifest = getExecutiveStrategyAlignmentManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
    manifest,
    validation: buildBuilderValidation(),
  });
}

export const ExecutiveStrategyAlignmentPlatform = Object.freeze({
  buildExecutiveStrategyAlignment,
  validateExecutiveStrategyAlignment: validateExecutiveStrategyAlignmentFacade,
  getExecutiveStrategyAlignmentManifest,
  listExecutiveStrategyAlignments,
  listExecutiveStrategyAlignmentPublicApis,
});

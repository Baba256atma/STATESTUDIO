export type {
  ExecutiveStrategicRoadmap as ExecutiveStrategicRoadmapContract,
  ExecutiveStrategicRoadmapDependency,
  ExecutiveStrategicRoadmapExtensionPolicy,
  ExecutiveStrategicRoadmapIdentity,
  ExecutiveStrategicRoadmapManifest,
  ExecutiveStrategicRoadmapMilestone,
  ExecutiveStrategicRoadmapName,
  ExecutiveStrategicRoadmapPhase,
  ExecutiveStrategicRoadmapPlatformDependency,
  ExecutiveStrategicRoadmapPurpose,
  ExecutiveStrategicRoadmapRegistry,
  ExecutiveStrategicRoadmapRelationship,
  ExecutiveStrategicRoadmapRelationshipType,
  ExecutiveStrategicRoadmapScope,
  ExecutiveStrategicRoadmapSequence,
  ExecutiveStrategicRoadmapSuccessCriteria,
  ExecutiveStrategicRoadmapTimeHorizon,
  ExecutiveStrategicRoadmapValidation,
  ExecutiveStrategicRoadmapsPlatform as ExecutiveStrategicRoadmapsPlatformContract,
} from "./executiveStrategicRoadmapTypes.ts";

export { getExecutiveStrategicRoadmapsManifest } from "./executiveStrategicRoadmapManifest.ts";
export {
  EXECUTIVE_STRATEGIC_ROADMAP_DEPENDENCIES,
  EXECUTIVE_STRATEGIC_ROADMAP_EXTENSION_POLICY,
  EXECUTIVE_STRATEGIC_ROADMAP_MILESTONES,
  EXECUTIVE_STRATEGIC_ROADMAP_PHASES,
  EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
  EXECUTIVE_STRATEGIC_ROADMAP_RELATIONSHIPS,
  EXECUTIVE_STRATEGIC_ROADMAPS,
  listExecutiveStrategicRoadmaps,
  listExecutiveStrategicRoadmapsPublicApis,
} from "./executiveStrategicRoadmapRegistry.ts";

import { getExecutiveStrategicRoadmapsManifest } from "./executiveStrategicRoadmapManifest.ts";
import {
  EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
  listExecutiveStrategicRoadmaps,
  listExecutiveStrategicRoadmapsPublicApis,
} from "./executiveStrategicRoadmapRegistry.ts";
import type {
  ExecutiveStrategicRoadmapValidation as ExecutiveStrategicRoadmapValidationType,
  ExecutiveStrategicRoadmapsPlatform as ExecutiveStrategicRoadmapsPlatformType,
} from "./executiveStrategicRoadmapTypes.ts";

function buildBuilderValidation(): ExecutiveStrategicRoadmapValidationType {
  const registry = EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY;
  const valid =
    registry.platformId === "BUS-22" &&
    registry.roadmaps.length > 0 &&
    registry.phases.length > 0 &&
    registry.milestones.length > 0 &&
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

function validateExecutiveStrategicRoadmapFacade(): ExecutiveStrategicRoadmapValidationType {
  return buildBuilderValidation();
}

export function buildExecutiveStrategicRoadmap(): ExecutiveStrategicRoadmapsPlatformType {
  const manifest = getExecutiveStrategicRoadmapsManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
    manifest,
    validation: buildBuilderValidation(),
  });
}

export const ExecutiveStrategicRoadmapsPlatform = Object.freeze({
  buildExecutiveStrategicRoadmap,
  validateExecutiveStrategicRoadmap: validateExecutiveStrategicRoadmapFacade,
  getExecutiveStrategicRoadmapsManifest,
  listExecutiveStrategicRoadmaps,
  listExecutiveStrategicRoadmapsPublicApis,
});

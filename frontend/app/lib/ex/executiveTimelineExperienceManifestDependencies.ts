/** EX-3:5 Manifest dependency summary (Validation sole runtime import). */

import { ExecutiveTimelineExperienceValidation } from "./executiveTimelineExperienceValidation.ts";
import type { ExecutiveTimelineExperienceManifestDependencyRecord } from "./executiveTimelineExperienceManifestTypes.ts";

const validation = ExecutiveTimelineExperienceValidation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

export const ExecutiveTimelineExperienceManifestDependencyChain = Object.freeze([
  "EX-3:5/ExecutiveTimelineExperienceManifest",
  "EX-3:4/ExecutiveTimelineExperienceValidation",
  "EX-3:3/ExecutiveTimelineExperienceModel",
  "EX-3:2/ExecutiveTimelineExperienceRegistry",
  "EX-3:1/ExecutiveTimelineExperienceFoundation",
] as const);

export const ExecutiveTimelineExperienceManifestDependencies = Object.freeze([
  Object.freeze({
    dependencyId: "EX-3:5/Dependency/Validation",
    order: 1,
    upstreamIdentity: validation.identity.id,
    dependencyLevel: 1,
    dependencyStatus: validation.status,
    dependencyVersion: "1.0.0",
    dependencyReadiness: validation.readiness,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    dependencyId: "EX-3:5/Dependency/Model",
    order: 2,
    upstreamIdentity: model.identity.id,
    dependencyLevel: 2,
    dependencyStatus: model.status,
    dependencyVersion: "1.0.0",
    dependencyReadiness: model.readiness,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    dependencyId: "EX-3:5/Dependency/Registry",
    order: 3,
    upstreamIdentity: registry.identity.id,
    dependencyLevel: 3,
    dependencyStatus: registry.status,
    dependencyVersion: "1.0.0",
    dependencyReadiness: registry.readiness,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    dependencyId: "EX-3:5/Dependency/Foundation",
    order: 4,
    upstreamIdentity: foundation.identity.id,
    dependencyLevel: 4,
    dependencyStatus: foundation.status,
    dependencyVersion: "1.0.0",
    dependencyReadiness: foundation.readiness,
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveTimelineExperienceManifestDependencyRecord[]);

export const ExecutiveTimelineExperienceManifestDependencyCount = 4 as const;

export const ExecutiveTimelineExperienceManifestDependencySummary = Object.freeze({
  upstreamIdentity: validation.identity.id,
  dependencyLevel: 1 as const,
  dependencyStatus: validation.status,
  dependencyVersion: "1.0.0" as const,
  dependencyReadiness: validation.readiness,
  dependencyChain: ExecutiveTimelineExperienceManifestDependencyChain,
  dependencies: ExecutiveTimelineExperienceManifestDependencies,
  dependencyCount: ExecutiveTimelineExperienceManifestDependencyCount,
  runtimeDependency: "EX-3:4/ExecutiveTimelineExperienceValidation" as const,
  validationOnly: true as const,
  modelRegistryFoundationReachedThroughValidationOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

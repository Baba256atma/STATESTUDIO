/** EX-3:5 immutable Manifest metadata, decisions, and contracts. */

import { ExecutiveTimelineExperienceValidation } from "./executiveTimelineExperienceValidation.ts";
import {
  ExecutiveTimelineExperienceManifestCapabilityCount,
  ExecutiveTimelineExperienceManifestCapabilities,
} from "./executiveTimelineExperienceManifestCapabilities.ts";
import {
  ExecutiveTimelineExperienceManifestDependencyCount,
  ExecutiveTimelineExperienceManifestDependencySummary,
} from "./executiveTimelineExperienceManifestDependencies.ts";
import {
  ExecutiveTimelineExperienceManifestId,
  ExecutiveTimelineExperienceManifestIdentity,
  ExecutiveTimelineExperienceManifestNamespace,
  ExecutiveTimelineExperienceManifestReadiness,
  ExecutiveTimelineExperienceManifestStatus,
  ExecutiveTimelineExperienceManifestVersion,
} from "./executiveTimelineExperienceManifestIdentity.ts";

export const ExecutiveTimelineExperienceManifestDecisions = Object.freeze([
  Object.freeze({
    decisionId: "EX-3:5/D-25" as const,
    order: 1,
    statement:
      "Manifest remains metadata-only and consolidates upstream Timeline phases." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:5/D-26" as const,
    order: 2,
    statement:
      "Exact ReadyForManifest EX-3:4 Validation is the sole upstream dependency." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:5/D-27" as const,
    order: 3,
    statement:
      "Sixteen capabilities describe Manifest publication surfaces only." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:5/D-28" as const,
    order: 4,
    statement:
      "Foundation, Registry, and Model are reached only through Validation." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:5/D-29" as const,
    order: 5,
    statement:
      "ReadyForPlatform does not authorize EX-3:6 Platform implementation." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:5/D-30" as const,
    order: 6,
    statement:
      "Rendering, RTC, persistence, and synchronization runtimes remain prohibited." as const,
  }),
] as const);

export const ExecutiveTimelineExperienceManifestContracts = Object.freeze([
  Object.freeze({
    contractId: "EX-3:5/Contract/Upstream" as const,
    order: 1,
    subject:
      "Manifest consumes only the exact EX-3:4 Validation aggregate." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:5/Contract/Capabilities" as const,
    order: 2,
    subject:
      "Sixteen capabilities remain descriptive and non-executable." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:5/Contract/Dependencies" as const,
    order: 3,
    subject:
      "Dependency summary publishes the Validation-rooted upstream chain." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:5/Contract/Validation" as const,
    order: 4,
    subject:
      "Validation categories and rules remain descriptive metadata only." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:5/Contract/Readiness" as const,
    order: 5,
    subject:
      "ReadyForPlatform does not authorize Platform, rendering, or RTC." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    contractId: "EX-3:5/Contract/Boundaries" as const,
    order: 6,
    subject:
      "Architectural boundaries prohibit runtime, UI, and provider surfaces." as const,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);

export const ExecutiveTimelineExperienceManifestBoundaries = Object.freeze({
  boundariesId: "EX-3:5/ExecutiveTimelineExperienceManifestBoundaries" as const,
  importsValidationOnlyAtRuntime: true as const,
  directModelImport: false as const,
  directRegistryImport: false as const,
  directFoundationImport: false as const,
  rtcImport: false as const,
  sceneImport: false as const,
  uiImport: false as const,
  providerImport: false as const,
  network: false as const,
  persistence: false as const,
  telemetry: false as const,
  clock: false as const,
  randomness: false as const,
  playbackEngine: false as const,
  rendering: false as const,
  createsEx36: false as const,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  deterministic: true as const,
  failClosed: true as const,
  immutable: true as const,
});

export const ExecutiveTimelineExperienceManifestMetadata = Object.freeze({
  identity: ExecutiveTimelineExperienceManifestIdentity,
  manifestIdentity: ExecutiveTimelineExperienceManifestId,
  namespace: ExecutiveTimelineExperienceManifestNamespace,
  version: ExecutiveTimelineExperienceManifestVersion,
  status: ExecutiveTimelineExperienceManifestStatus,
  readiness: ExecutiveTimelineExperienceManifestReadiness,
  capabilityCount: ExecutiveTimelineExperienceManifestCapabilityCount,
  dependencyCount: ExecutiveTimelineExperienceManifestDependencyCount,
  upstreamReference: ExecutiveTimelineExperienceValidation.identity.id,
  authorizationReference:
    "EX-3:5/ReadyForPlatformDoesNotAuthorizePlatform" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  capabilities: ExecutiveTimelineExperienceManifestCapabilities,
  dependencySummary: ExecutiveTimelineExperienceManifestDependencySummary,
  validation: ExecutiveTimelineExperienceValidation,
  validationSummary: ExecutiveTimelineExperienceValidation.getSummary(),
  boundaries: ExecutiveTimelineExperienceManifestBoundaries,
  decisions: ExecutiveTimelineExperienceManifestDecisions,
  contracts: ExecutiveTimelineExperienceManifestContracts,
  readyForPlatformAuthorizesEx36: false as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
});

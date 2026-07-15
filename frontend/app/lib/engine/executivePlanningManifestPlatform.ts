import { ExecutivePlanningCompatibilityManifest } from "./executivePlanningCompatibilityManifest.ts";
import { ExecutivePlanningComponentManifest } from "./executivePlanningComponentManifest.ts";
import { ExecutivePlanningDependencyManifest } from "./executivePlanningDependencyManifest.ts";
import {
  ExecutivePlanningOwnershipBoundary,
  ExecutivePlanningOwnershipManifest,
} from "./executivePlanningOwnershipManifest.ts";
import { ExecutivePlanningReleaseManifest } from "./executivePlanningReleaseManifest.ts";
import type {
  ExecutivePlanningManifestComponentSection,
  ExecutivePlanningManifestMetadata,
  ExecutivePlanningManifestSummary,
} from "./executivePlanningManifestTypes.ts";

const metadata = Object.freeze({
  platformId: "ENG-5:5",
  name: "Executive Planning Manifest Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.planning.manifest",
  description:
    "Canonical immutable metadata-only manifest consolidating ENG-5:1 Foundation, ENG-5:2 Registry, ENG-5:3 Model, and ENG-5:4 Validation.",
  phase: "ENG-5:5",
  owner: "ENG-5",
  readiness: "ReadyForPlatform",
  status: Object.freeze({
    manifest: "Manifest",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    readyForPlatform: "ReadyForPlatform",
  } as const),
  componentSectionCount: 4,
  dependencyEntryCount: 9,
  ownershipSectionCount: 5,
  compatibilityEntryCount: 6,
  releaseStateCount: 5,
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deterministic: true,
  nextPhase: "ENG-5:6",
} as const satisfies ExecutivePlanningManifestMetadata);

const summary = Object.freeze({
  platformId: "ENG-5:5",
  phase: "ENG-5:5",
  namespace: "nexora.engine.executive.planning.manifest",
  owner: "ENG-5",
  componentSectionCount: 4,
  dependencyEntryCount: 9,
  ownershipSectionCount: 5,
  compatibilityEntryCount: 6,
  releaseStateCount: 5,
  readiness: "ReadyForPlatform",
  nextPhase: "ENG-5:6",
  executionOwner: "OPS",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningManifestSummary);

const inventory = Object.freeze({
  componentSectionCount: ExecutivePlanningComponentManifest.length,
  dependencyEntryCount: ExecutivePlanningDependencyManifest.length,
  ownershipSectionCount: ExecutivePlanningOwnershipManifest.length,
  compatibilityEntryCount: ExecutivePlanningCompatibilityManifest.length,
  releaseStateCount: ExecutivePlanningReleaseManifest.states.length,
  readiness: metadata.readiness,
  executionOwner: ExecutivePlanningOwnershipBoundary.executionOwner,
  nextPhase: "ENG-5:6",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const componentIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningComponentManifest.map((section) => [section.id, section])) as Readonly<
    Record<string, ExecutivePlanningManifestComponentSection | undefined>
  >,
);

export const ExecutivePlanningManifestPlatform = Object.freeze({
  metadata,
  components: ExecutivePlanningComponentManifest,
  dependencies: ExecutivePlanningDependencyManifest,
  ownership: ExecutivePlanningOwnershipManifest,
  compatibility: ExecutivePlanningCompatibilityManifest,
  release: ExecutivePlanningReleaseManifest,
  summary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

export const getExecutivePlanningManifestPlatform = () => ExecutivePlanningManifestPlatform;
export const getExecutivePlanningManifestMetadata = () => metadata;
export const getExecutivePlanningManifestInventory = () => inventory;
export const getExecutivePlanningManifestSummary = () => summary;

export const getExecutivePlanningManifestComponentById = (
  id: string,
): ExecutivePlanningManifestComponentSection | undefined => componentIndex[id];

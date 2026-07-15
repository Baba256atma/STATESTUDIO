import { ExecutivePlanningOwnership } from "./executivePlanningIndex.ts";
import type { ExecutivePlanningManifestOwnershipSection } from "./executivePlanningManifestTypes.ts";

const planningOwns = Object.freeze([
  "planning metadata",
  "planning models",
  "planning registries",
  "planning validation",
  "planning manifests",
] as const);

const planningNeverOwns = Object.freeze([
  "execution runtime",
  "scheduling runtime",
  "workflow runtime",
  "persistence",
  "visualization",
  "Director",
  "Scene",
  "EVE",
  "Advisor",
] as const);

const ownershipSection = (
  key: string,
  section: ExecutivePlanningManifestOwnershipSection["section"],
  description: string,
  owns: readonly string[],
) => Object.freeze({
  id: `eng-5-manifest-ownership-${key}`,
  section,
  owner: "ENG-5",
  description,
  owns: Object.freeze([...owns]),
  neverOwns: planningNeverOwns,
  executionOwner: "OPS",
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningManifestOwnershipSection);

export const ExecutivePlanningOwnershipManifest = Object.freeze([
  ownershipSection(
    "foundation",
    "Foundation",
    "ENG-5 owns planning foundation contracts, capabilities, lifecycle, and metadata.",
    Object.freeze([...ExecutivePlanningOwnership.owns, "planning metadata"]),
  ),
  ownershipSection(
    "registry",
    "Registry",
    "ENG-5 owns planning registries and planning taxonomy vocabulary.",
    Object.freeze(["planning registries", "planning taxonomy", "planning vocabulary"]),
  ),
  ownershipSection(
    "model",
    "Model",
    "ENG-5 owns planning models and planning object structures.",
    Object.freeze(["planning models", "planning object structures", "planning metadata schemas"]),
  ),
  ownershipSection(
    "validation",
    "Validation",
    "ENG-5 owns planning validation metadata and architectural verification rules.",
    Object.freeze(["planning validation", "validation metadata", "architectural verification"]),
  ),
  ownershipSection(
    "manifest",
    "Manifest",
    "ENG-5 owns the architectural manifest and release inventory for Executive Planning.",
    planningOwns,
  ),
] as const);

export const ExecutivePlanningOwnershipBoundary = Object.freeze({
  planningOwns,
  planningNeverOwns,
  executionOwner: "OPS" as const,
  plansExecutionOnly: ExecutivePlanningOwnership.boundary.plansExecutionOnly,
  performsExecution: ExecutivePlanningOwnership.boundary.performsExecution,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

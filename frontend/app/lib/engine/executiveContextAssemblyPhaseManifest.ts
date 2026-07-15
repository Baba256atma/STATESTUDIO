import type { ExecutiveContextManifestPhase } from "./executiveContextAssemblyManifestTypes.ts";

const phase = (
  phaseId: ExecutiveContextManifestPhase["phaseId"],
  name: string,
  description: string,
  publicSurface: string,
  dependencies: readonly string[],
  guarantees: readonly string[],
) => Object.freeze({
  phaseId, name, description, version: "1.0.0", owner: "ENG-4",
  status: "Complete", publicSurface, dependencies, guarantees,
  completionState: "Complete", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextManifestPhase);

export const ExecutiveContextAssemblyPhaseManifest = Object.freeze([
  phase(
    "ENG-4:1",
    "Foundation",
    "Defines immutable foundation contracts, domains, capabilities, lifecycle, boundaries, and metadata.",
    "executiveContextAssemblyFoundation.ts",
    Object.freeze(["ENG-1 Public Index", "ENG-2 Public Index", "ENG-3 Public Index"]),
    Object.freeze(["MetadataOnly", "RuntimeFree", "Immutable", "Deterministic"]),
  ),
  phase(
    "ENG-4:2",
    "Registry",
    "Publishes immutable registries for domains, sources, capabilities, lifecycle, and ownership.",
    "executiveContextAssemblyRegistry.ts",
    Object.freeze(["ENG-4:1"]),
    Object.freeze(["MetadataOnly", "RuntimeFree", "Immutable", "Deterministic", "PublicIndexOnly"]),
  ),
  phase(
    "ENG-4:3",
    "Model",
    "Publishes immutable architectural models for executive context, domains, snapshots, and composition.",
    "executiveContextAssemblyModel.ts",
    Object.freeze(["ENG-4:1", "ENG-4:2"]),
    Object.freeze(["MetadataOnly", "RuntimeFree", "Immutable", "Deterministic", "NoStoredSnapshotData"]),
  ),
  phase(
    "ENG-4:4",
    "Validation",
    "Publishes deterministic architectural validation groups, rules, and gates for ENG-4:1–ENG-4:3.",
    "executiveContextAssemblyValidation.ts",
    Object.freeze(["ENG-4:1", "ENG-4:2", "ENG-4:3"]),
    Object.freeze(["MetadataOnly", "RuntimeFree", "Immutable", "Deterministic", "ReadyForManifest"]),
  ),
] as const);

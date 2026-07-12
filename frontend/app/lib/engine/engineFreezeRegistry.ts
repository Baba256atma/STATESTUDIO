import { ExecutiveEnginePhaseRegistry, ExecutiveEnginePublicSurface } from "./engineManifestIndex.ts";
import { ExecutiveEnginePlatform } from "./enginePlatformIndex.ts";
import { ExecutiveEngineCertificationSummary } from "./engineCertificationIndex.ts";
import type { ExecutiveEngineFrozenArtifactEntry, ExecutiveEnginePhaseLockDescriptor } from "./engineFreezeTypes.ts";

const freezeStatus = ExecutiveEngineCertificationSummary.certificationStatus === "Certified" ? "Frozen" : "Blocked";
const entry = (artifactId: string, name: string, category: ExecutiveEngineFrozenArtifactEntry["category"]) => Object.freeze({
  artifactId, name, category, freezeStatus, lifecycleStatus: "Locked", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineFrozenArtifactEntry);

export const ExecutiveEnginePhaseLockMetadata = Object.freeze({
  artifactId: "ENG-LOCK-001", lockIdentifier: "ENG-1-LOCKED", lockVersion: "1.0.0",
  lockScope: "ENG-1 Foundation",
  lockTimestampMetadata: Object.freeze({ classification: "DeterministicReleaseMetadata", value: "ENG-1:8" }),
  architecturalBaselineVersion: "1.0.0", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEnginePhaseLockDescriptor);

export const ExecutiveEngineFreezeRegistry = Object.freeze({
  artifactId: "ENG-FREEZE-001", freezeStatus,
  frozenArtifacts: Object.freeze([
    ...ExecutiveEnginePhaseRegistry.map((phase, index) => entry(`ENG-FROZEN-PHASE-${String(index + 1).padStart(3, "0")}`, phase.phaseId, "Phase")),
    ...ExecutiveEnginePublicSurface.all.map((surface, index) => entry(`ENG-FROZEN-API-${String(index + 1).padStart(3, "0")}`, surface.exportName, "PublicApi")),
    ...Object.keys(ExecutiveEnginePlatform).map((section, index) => entry(`ENG-FROZEN-SECTION-${String(index + 1).padStart(3, "0")}`, section, "ArchitecturalSection")),
  ]),
  frozenPhases: Object.freeze(ExecutiveEnginePhaseRegistry.map((phase) => phase.phaseId)),
  frozenPublicApis: Object.freeze(ExecutiveEnginePublicSurface.all.map((surface) => surface.exportName)),
  frozenArchitecturalSections: Object.freeze(Object.keys(ExecutiveEnginePlatform)),
  lifecycleMetadata: Object.freeze({ phaseId: "ENG-1:8", status: "Locked", baseline: "ENG-1" }),
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

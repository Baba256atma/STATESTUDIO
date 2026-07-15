import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
import type { ExecutiveContextPlatformCompatibilityEntry } from "./executiveContextAssemblyPlatformTypes.ts";

const entry = (
  id: string,
  subject: string,
  classification: string,
  description: string,
  status: ExecutiveContextPlatformCompatibilityEntry["status"],
) => Object.freeze({
  id, subject, classification, description, status,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextPlatformCompatibilityEntry);

export const ExecutiveContextAssemblyPlatformCompatibility = Object.freeze([
  entry(
    "eng-4-platform-compat-eng-1",
    "ENG-1 Executive Engine Foundation",
    "PublicIndexCompatible",
    "ENG-4 consumes ENG-1 exclusively through the official public index.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-eng-2",
    "ENG-2 Executive Request & Intent",
    "PublicIndexCompatible",
    "ENG-4 consumes ENG-2 exclusively through the official public index.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-eng-3",
    "ENG-3 Executive Intent Resolution",
    "PublicIndexCompatible",
    "ENG-4 consumes ENG-3 exclusively through the official public index.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-foundation",
    "ENG-4:1 Foundation",
    "InternalPhaseCompatible",
    "Platform aggregates ENG-4:1 through its approved public surface.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-registry",
    "ENG-4:2 Registry",
    "InternalPhaseCompatible",
    "Platform aggregates ENG-4:2 through its approved public surface.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-model",
    "ENG-4:3 Model",
    "InternalPhaseCompatible",
    "Platform aggregates ENG-4:3 through its approved public surface.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-validation",
    "ENG-4:4 Validation",
    "InternalPhaseCompatible",
    "Platform aggregates ENG-4:4 through its approved public surface.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-manifest",
    "ENG-4:5 Manifest",
    "InternalPhaseCompatible",
    "Platform aggregates ENG-4:5 through its approved public surface.",
    "Compatible",
  ),
  entry(
    "eng-4-platform-compat-eng-1-model-relocation",
    "ENG-1 generic Executive Context model relocation",
    "ApprovedCompatibility|OwnershipPreserved|PublicSurfaceStable|NoDuplication",
    `ENG-1 generic model (${EngineExecutiveContextModel.id}) remains in engineModelRegistry.ts; ENG-4 owns specialized executiveContextModel.ts (${AssemblyExecutiveContextModel.id}).`,
    "ApprovedCompatibility",
  ),
  entry(
    "eng-4-platform-compat-future-certification",
    "Future ENG-4:7 Certification boundary",
    "FutureBoundaryDeclared",
    "Certification remains a future descriptive boundary; ENG-4:7 is not imported or implemented by this platform phase.",
    "BoundaryDeclared",
  ),
] as const);

export const ExecutiveContextAssemblyPlatformOwnership = Object.freeze([
  Object.freeze({ id: "eng-4-platform-own-architecture", artifact: "Executive Context Assembly architecture", owner: "ENG-4", description: "ENG-4 owns the Context Assembly platform architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-domains", artifact: "Context domains", owner: "ENG-4", description: "ENG-4 owns context domain architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-sources", artifact: "Context sources", owner: "ENG-4", description: "ENG-4 owns context source architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-registries", artifact: "Context registries", owner: "ENG-4", description: "ENG-4 owns context registry architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-models", artifact: "Context models", owner: "ENG-4", description: "ENG-4 owns specialized context model architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-snapshots", artifact: "Context snapshots", owner: "ENG-4", description: "ENG-4 owns context snapshot model architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-compositions", artifact: "Context compositions", owner: "ENG-4", description: "ENG-4 owns context composition model architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-metadata", artifact: "Context metadata", owner: "ENG-4", description: "ENG-4 owns context metadata model architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-validation", artifact: "Context validation", owner: "ENG-4", description: "ENG-4 owns context validation architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-manifest", artifact: "Context manifest", owner: "ENG-4", description: "ENG-4 owns context manifest architecture.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-aggregate", artifact: "ENG-4 platform aggregate", owner: "ENG-4", description: "ENG-4 owns the platform aggregate surface.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-helpers", artifact: "ENG-4 public architectural helpers", owner: "ENG-4", description: "ENG-4 owns approved platform helper APIs.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-specialized-model", artifact: "executiveContextModel.ts", owner: "ENG-4", description: "ENG-4 owns the specialized executiveContextModel.ts surface.", status: "Owned", metadataOnly: true, immutable: true } as const),
  Object.freeze({ id: "eng-4-platform-own-eng-1-registry", artifact: "Executive Engine model registry", owner: "ENG-1", description: "ENG-1 continues to own the generic Executive Engine model registry.", status: "ExternallyOwned", metadataOnly: true, immutable: true } as const),
] as const);

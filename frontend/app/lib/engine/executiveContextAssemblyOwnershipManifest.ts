import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
import type {
  ExecutiveContextManifestCompatibilityEntry,
  ExecutiveContextManifestOwnershipEntry,
} from "./executiveContextAssemblyManifestTypes.ts";

const ownership = (id: string, artifact: string, description: string) => Object.freeze({
  id, artifact, owner: "ENG-4", description, status: "Owned",
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextManifestOwnershipEntry);

export const ExecutiveContextAssemblyOwnershipManifest = Object.freeze([
  ownership("eng-4-own-foundation", "Executive Context Assembly Foundation", "ENG-4 owns the Context Assembly Foundation architecture."),
  ownership("eng-4-own-contracts", "Context Contracts", "ENG-4 owns architectural context contracts."),
  ownership("eng-4-own-domains", "Context Domains", "ENG-4 owns context domain architecture."),
  ownership("eng-4-own-sources", "Context Sources", "ENG-4 owns context source architecture."),
  ownership("eng-4-own-lifecycle", "Context Lifecycle", "ENG-4 owns context lifecycle architecture."),
  ownership("eng-4-own-registries", "Context Registries", "ENG-4 owns context registry architecture."),
  ownership("eng-4-own-models", "Context Models", "ENG-4 owns specialized context model architecture."),
  ownership("eng-4-own-snapshots", "Context Snapshots", "ENG-4 owns context snapshot model architecture."),
  ownership("eng-4-own-compositions", "Context Compositions", "ENG-4 owns context composition model architecture."),
  ownership("eng-4-own-metadata", "Context Metadata", "ENG-4 owns context metadata model architecture."),
  ownership("eng-4-own-validation", "Context Validation", "ENG-4 owns context validation architecture."),
  ownership("eng-4-own-public-apis", "ENG-4 Public Architectural APIs", "ENG-4 owns approved Context Assembly public helper APIs."),
  ownership("eng-4-own-specialized-model-surface", "executiveContextModel.ts", "ENG-4 owns the specialized executiveContextModel.ts surface."),
] as const);

export const ExecutiveContextAssemblyCompatibilityManifest = Object.freeze([
  Object.freeze({
    id: "eng-4-compat-eng-1-context-model-relocation",
    subject: "ENG-1 generic ExecutiveContextModel relocation",
    classification: Object.freeze({
      approvedCompatibility: "ApprovedCompatibility",
      ownershipPreserved: "OwnershipPreserved",
      publicSurfaceStable: "PublicSurfaceStable",
      noDuplication: "NoDuplication",
    } as const),
    description: "ENG-1 generic ExecutiveContextModel relocated into engineModelRegistry.ts remains an approved compatibility declaration; ENG-4 owns specialized executiveContextModel.ts.",
    eng1ModelId: EngineExecutiveContextModel.id,
    eng4ModelId: AssemblyExecutiveContextModel.id,
    relocatedTo: "engineModelRegistry.ts",
    specializedSurface: "executiveContextModel.ts",
    metadataOnly: true, immutable: true,
  } as const satisfies ExecutiveContextManifestCompatibilityEntry),
] as const);

import { ExecutiveContextAssemblyCertification } from "./executiveContextAssemblyCertification.ts";
import type { ExecutiveContextFreezeCompatibilityEntry } from "./executiveContextAssemblyFreezeTypes.ts";

const entry = (
  id: string,
  subject: string,
  classification: string,
  description: string,
  status: ExecutiveContextFreezeCompatibilityEntry["status"],
) => Object.freeze({
  id, subject, classification, description, status,
  lockIdentifier: "ENG-4-LOCKED",
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextFreezeCompatibilityEntry);

const certifiedRelocation = ExecutiveContextAssemblyCertification.compatibility.find(
  ({ id }) => id === "eng-4-cert-compat-eng-1-model-relocation",
)!;

export const ExecutiveContextAssemblyFreezeCompatibility = Object.freeze([
  entry("eng-4-freeze-compat-eng-1", "ENG-1 Executive Engine Foundation", "PublicIndexCompatible", "ENG-4 consumes ENG-1 exclusively through the official public index.", "LockedCompatible"),
  entry("eng-4-freeze-compat-eng-2", "ENG-2 Executive Request & Intent", "PublicIndexCompatible", "ENG-4 consumes ENG-2 exclusively through the official public index.", "LockedCompatible"),
  entry("eng-4-freeze-compat-eng-3", "ENG-3 Executive Intent Resolution", "PublicIndexCompatible", "ENG-4 consumes ENG-3 exclusively through the official public index.", "LockedCompatible"),
  entry("eng-4-freeze-compat-foundation", "ENG-4:1 Foundation", "InternalPhaseLocked", "Frozen lock preserves ENG-4:1 through its approved public surface.", "LockedCompatible"),
  entry("eng-4-freeze-compat-registry", "ENG-4:2 Registry", "InternalPhaseLocked", "Frozen lock preserves ENG-4:2 through its approved public surface.", "LockedCompatible"),
  entry("eng-4-freeze-compat-model", "ENG-4:3 Model", "InternalPhaseLocked", "Frozen lock preserves ENG-4:3 through its approved public surface.", "LockedCompatible"),
  entry("eng-4-freeze-compat-validation", "ENG-4:4 Validation", "InternalPhaseLocked", "Frozen lock preserves ENG-4:4 through its approved public surface.", "LockedCompatible"),
  entry("eng-4-freeze-compat-manifest", "ENG-4:5 Manifest", "InternalPhaseLocked", "Frozen lock preserves ENG-4:5 through its approved public surface.", "LockedCompatible"),
  entry("eng-4-freeze-compat-platform", "ENG-4:6 Platform", "InternalPhaseLocked", "Frozen lock preserves ENG-4:6 through its approved public surface.", "LockedCompatible"),
  entry("eng-4-freeze-compat-certification", "ENG-4:7 Certification", "InternalPhaseLocked", "Frozen lock preserves ENG-4:7 through its approved public surface.", "LockedCompatible"),
  entry(
    "eng-4-freeze-compat-eng-1-model-relocation",
    "ENG-1 generic Executive Context model relocation",
    certifiedRelocation.classification,
    certifiedRelocation.description,
    "ApprovedCompatibility",
  ),
  entry(
    "eng-4-freeze-compat-future-public-index",
    "ENG-4:9 Public Index boundary",
    "FutureBoundaryDeclared",
    "Public Index remains a forward-compatible boundary only; ENG-4:9 is not imported or implemented by freeze.",
    "BoundaryDeclared",
  ),
] as const);

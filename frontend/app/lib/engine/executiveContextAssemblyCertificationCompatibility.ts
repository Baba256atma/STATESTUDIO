import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
import type { ExecutiveContextCertificationCompatibilityEntry } from "./executiveContextAssemblyCertificationTypes.ts";

const entry = (
  id: string,
  subject: string,
  classification: string,
  description: string,
  status: ExecutiveContextCertificationCompatibilityEntry["status"],
) => Object.freeze({
  id, subject, classification, description, status,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextCertificationCompatibilityEntry);

export const ExecutiveContextAssemblyCertificationCompatibility = Object.freeze([
  entry("eng-4-cert-compat-eng-1", "ENG-1 Executive Engine Foundation", "PublicIndexCompatible", "ENG-4 consumes ENG-1 exclusively through the official public index.", "Compatible"),
  entry("eng-4-cert-compat-eng-2", "ENG-2 Executive Request & Intent", "PublicIndexCompatible", "ENG-4 consumes ENG-2 exclusively through the official public index.", "Compatible"),
  entry("eng-4-cert-compat-eng-3", "ENG-3 Executive Intent Resolution", "PublicIndexCompatible", "ENG-4 consumes ENG-3 exclusively through the official public index.", "Compatible"),
  entry("eng-4-cert-compat-foundation", "ENG-4:1 Foundation", "InternalPhaseCompatible", "Certification references ENG-4:1 through its approved public surface.", "Compatible"),
  entry("eng-4-cert-compat-registry", "ENG-4:2 Registry", "InternalPhaseCompatible", "Certification references ENG-4:2 through its approved public surface.", "Compatible"),
  entry("eng-4-cert-compat-model", "ENG-4:3 Model", "InternalPhaseCompatible", "Certification references ENG-4:3 through its approved public surface.", "Compatible"),
  entry("eng-4-cert-compat-validation", "ENG-4:4 Validation", "InternalPhaseCompatible", "Certification references ENG-4:4 through its approved public surface.", "Compatible"),
  entry("eng-4-cert-compat-manifest", "ENG-4:5 Manifest", "InternalPhaseCompatible", "Certification references ENG-4:5 through its approved public surface.", "Compatible"),
  entry("eng-4-cert-compat-platform", "ENG-4:6 Platform", "InternalPhaseCompatible", "Certification references ENG-4:6 through its approved public surface.", "Compatible"),
  entry(
    "eng-4-cert-compat-eng-1-model-relocation",
    "ENG-1 generic Executive Context model relocation",
    "ApprovedCompatibility|OwnershipPreserved|PublicSurfaceStable|NoDuplication",
    `ENG-1 generic model (${EngineExecutiveContextModel.id}) remains in engineModelRegistry.ts; ENG-4 owns specialized executiveContextModel.ts (${AssemblyExecutiveContextModel.id}).`,
    "ApprovedCompatibility",
  ),
  entry(
    "eng-4-cert-compat-future-freeze",
    "ENG-4:8 Freeze boundary",
    "FutureBoundaryDeclared",
    "Freeze remains a forward compatibility boundary only; ENG-4:8 is not imported or implemented by certification.",
    "BoundaryDeclared",
  ),
] as const);

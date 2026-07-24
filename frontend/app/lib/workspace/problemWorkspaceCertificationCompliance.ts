/** WS-6:7 — Dependency and architectural compliance declarations. */
import { ProblemWorkspacePlatform } from "./problemWorkspacePlatform.ts";

export const ProblemWorkspaceCertificationDependencyVerification =
  Object.freeze({
    canonicalChain: ProblemWorkspacePlatform.composition.canonicalDependencyChain,
    platform: ProblemWorkspacePlatform,
    directDependency: "WS-6:6 Problem Workspace Platform",
    downstreamReferences: Object.freeze([]),
    state: "Verified",
    metadataOnly: true,
    immutable: true,
  } as const);

const exclusions = Object.freeze([
  "Runtime",
  "Engine Logic",
  "Director Logic",
  "DKL Logic",
  "EVE Logic",
  "NEA Logic",
  "EIL Logic",
  "SDK Logic",
  "UI Logic",
  "Persistence",
  "Networking",
  "Rendering",
  "Orchestration",
  "Services",
  "Factories",
] as const);

export const ProblemWorkspaceCertificationCompliance = Object.freeze(
  exclusions.map((name, index) =>
    Object.freeze({
      id: `WS-6:7/Compliance/${String(index + 1).padStart(2, "0")}`,
      name: `No ${name}`,
      present: false,
      source: ProblemWorkspacePlatform,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

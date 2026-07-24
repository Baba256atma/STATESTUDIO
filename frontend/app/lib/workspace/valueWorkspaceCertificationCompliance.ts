/** WS-9:7 — Dependency and architectural compliance declarations. */
import { ValueWorkspacePlatform } from "./valueWorkspacePlatform.ts";

export const ValueWorkspaceCertificationDependencyVerification =
  Object.freeze({
    canonicalChain: ValueWorkspacePlatform.composition.canonicalDependencyChain,
    platform: ValueWorkspacePlatform,
    directDependency: "WS-9:6 Value Workspace Platform",
    downstreamReferences: Object.freeze([]),
    state: "Verified",
    metadataOnly: true,
    immutable: true,
  } as const);

const exclusions = Object.freeze([
  "Runtime",
  "Engine Logic",
  "Director Logic",
  "EVE Logic",
  "DKL Logic",
  "NEA Logic",
  "EIL Logic",
  "SDK Logic",
  "UI Logic",
  "Business Value Calculation",
  "ROI Calculation",
  "Financial Analysis",
  "Forecasting",
  "AI Reasoning",
  "Persistence",
  "Networking",
  "Rendering",
  "Services",
  "Factories",
] as const);

export const ValueWorkspaceCertificationCompliance = Object.freeze(
  exclusions.map((name, index) => Object.freeze({
    id: `WS-9:7/Compliance/${String(index + 1).padStart(2, "0")}`,
    name: `No ${name}`,
    present: false,
    source: ValueWorkspacePlatform,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

/** WS-10:7 — Dependency and architectural compliance declarations. */
import { TimelineWorkspacePlatform } from "./timelineWorkspacePlatform.ts";

export const TimelineWorkspaceCertificationDependencyVerification =
  Object.freeze({
    canonicalChain:
      TimelineWorkspacePlatform.composition.canonicalDependencyChain,
    platform: TimelineWorkspacePlatform,
    directDependency: "WS-10:6 Timeline Workspace Platform",
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
  "Timeline Playback",
  "Historical Event Execution",
  "Chronological Processing",
  "Analytics Engine",
  "AI Reasoning",
  "Persistence",
  "Networking",
  "Rendering",
  "Services",
  "Factories",
] as const);

export const TimelineWorkspaceCertificationCompliance = Object.freeze(
  exclusions.map((name, index) => Object.freeze({
    id: `WS-10:7/Compliance/${String(index + 1).padStart(2, "0")}`,
    name: `No ${name}`,
    present: false,
    source: TimelineWorkspacePlatform,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

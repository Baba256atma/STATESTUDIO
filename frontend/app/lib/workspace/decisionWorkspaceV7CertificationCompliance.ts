/** WS-7:7 — Dependency and architectural compliance declarations. */
import { DecisionWorkspaceV7Platform } from "./decisionWorkspaceV7Platform.ts";

export const DecisionWorkspaceV7CertificationDependencyVerification =
  Object.freeze({
    canonicalChain:
      DecisionWorkspaceV7Platform.composition.canonicalDependencyChain,
    platform: DecisionWorkspaceV7Platform,
    directDependency: "WS-7:6 Decision Workspace Platform",
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
  "Persistence",
  "Networking",
  "Rendering",
  "Orchestration",
  "Services",
  "Factories",
] as const);

export const DecisionWorkspaceV7CertificationCompliance = Object.freeze(
  exclusions.map((name, index) =>
    Object.freeze({
      id: `WS-7:7/Compliance/${String(index + 1).padStart(2, "0")}`,
      name: `No ${name}`,
      present: false,
      source: DecisionWorkspaceV7Platform,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

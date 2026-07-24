/** WS-4:6 — Manifest-backed satisfied Platform guarantees. */
import { DecisionWorkspaceManifest } from "./decisionWorkspaceManifest.ts";

const names = Object.freeze([
  "Identity Preservation",
  "Manifest Completeness",
  "Capability Completeness",
  "Decision Type Completeness",
  "Lifecycle Completeness",
  "Contract Completeness",
  "Relationship Completeness",
  "Composition Completeness",
  "Dependency Compliance",
  "Boundary Compliance",
  "Public API Integrity",
  "Certification Readiness",
] as const);

export const DecisionWorkspacePlatformGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:6/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Guarantees ${name.toLowerCase()} through the canonical Manifest.`,
    source: DecisionWorkspaceManifest,
    currentState: "Satisfied",
    readinessImpact: "Required for ReadyForCertification",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

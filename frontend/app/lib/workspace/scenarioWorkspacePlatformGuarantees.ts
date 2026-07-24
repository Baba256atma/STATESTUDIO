/** WS-5:6 — Manifest-backed satisfied Platform guarantees. */
import { ScenarioWorkspaceManifest } from "./scenarioWorkspaceManifest.ts";

const names = Object.freeze([
  "Identity Preservation",
  "Manifest Completeness",
  "Capability Completeness",
  "Scenario Type Completeness",
  "Lifecycle Completeness",
  "Contract Completeness",
  "Relationship Completeness",
  "Composition Completeness",
  "Dependency Compliance",
  "Boundary Compliance",
  "Public API Integrity",
  "Certification Readiness",
] as const);

export const ScenarioWorkspacePlatformGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:6/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Guarantees ${name.toLowerCase()} through the canonical Manifest.`,
    source: ScenarioWorkspaceManifest,
    currentState: "Satisfied",
    readinessImpact: "Required for ReadyForCertification",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

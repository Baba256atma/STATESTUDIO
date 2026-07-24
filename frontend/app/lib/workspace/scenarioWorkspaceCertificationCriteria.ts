/** WS-5:7 — Immutable passing certification criteria. */
import { ScenarioWorkspacePlatform } from "./scenarioWorkspacePlatform.ts";

const names = Object.freeze([
  "Foundation Completeness",
  "Registry Completeness",
  "Model Completeness",
  "Validation Pass",
  "Manifest Completeness",
  "Platform Completeness",
  "Platform Guarantees",
  "Compatibility Compliance",
  "Extension Compliance",
  "Canonical Identity Compliance",
  "Dependency Compliance",
  "Workspace Boundary Compliance",
  "Deterministic Ordering",
  "Immutable Metadata",
  "Public API Integrity",
  "Freeze Readiness",
] as const);

export const ScenarioWorkspaceCertificationCriteria = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:7/Criterion/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Certifies ${name.toLowerCase()} for the Scenario Workspace Platform.`,
    sourcePhase: "WS-5:6",
    source: ScenarioWorkspacePlatform,
    expectedState: "Pass",
    result: "Pass",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

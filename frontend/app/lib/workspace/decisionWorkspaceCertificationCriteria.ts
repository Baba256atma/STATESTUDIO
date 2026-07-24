/** WS-4:7 — Immutable passing certification criteria. */
import { DecisionWorkspacePlatform } from "./decisionWorkspacePlatform.ts";

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

export const DecisionWorkspaceCertificationCriteria = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:7/Criterion/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Certifies ${name.toLowerCase()} for the Decision Workspace Platform.`,
    sourcePhase: "WS-4:6",
    source: DecisionWorkspacePlatform,
    expectedState: "Pass",
    result: "Pass",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

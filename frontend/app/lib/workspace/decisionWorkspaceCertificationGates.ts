/** WS-4:7 — Immutable passing Certification gates. */
import { DecisionWorkspaceCertificationCriteria } from "./decisionWorkspaceCertificationCriteria.ts";
import { DecisionWorkspacePlatform } from "./decisionWorkspacePlatform.ts";

const names = Object.freeze([
  "Foundation Certification",
  "Registry Certification",
  "Model Certification",
  "Validation Certification",
  "Manifest Certification",
  "Platform Certification",
  "Guarantee Certification",
  "Compatibility Certification",
  "Extension Certification",
  "Identity Certification",
  "Dependency Certification",
  "Boundary Certification",
  "Public API Certification",
  "Ordering Certification",
  "Immutability Certification",
  "Freeze Readiness",
] as const);

export const DecisionWorkspaceCertificationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:7/Gate/${String(index + 1).padStart(2, "0")}`,
    name: `${name} Gate`,
    relatedCriterion: DecisionWorkspaceCertificationCriteria[index],
    requiredResult: "Pass",
    result: "Pass",
    failureSeverity: "Critical",
    readinessImpact: "Blocks ReadyForFreeze on failure",
    source: DecisionWorkspacePlatform,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

/** WS-5:7 — Immutable passing Certification gates. */
import { ScenarioWorkspaceCertificationCriteria } from "./scenarioWorkspaceCertificationCriteria.ts";
import { ScenarioWorkspacePlatform } from "./scenarioWorkspacePlatform.ts";

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

export const ScenarioWorkspaceCertificationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:7/Gate/${String(index + 1).padStart(2, "0")}`,
    name: `${name} Gate`,
    relatedCriterion: ScenarioWorkspaceCertificationCriteria[index],
    requiredResult: "Pass",
    result: "Pass",
    failureSeverity: "Critical",
    readinessImpact: "Blocks ReadyForFreeze on failure",
    source: ScenarioWorkspacePlatform,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

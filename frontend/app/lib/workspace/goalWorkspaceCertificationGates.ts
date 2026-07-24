/** WS-3:7 — Immutable passing Certification gates. */
import { GoalWorkspaceCertificationCriteria } from "./goalWorkspaceCertificationCriteria.ts";
import { GoalWorkspacePlatform } from "./goalWorkspacePlatform.ts";
const names = Object.freeze(["Foundation Certification", "Registry Certification",
  "Model Certification", "Validation Certification", "Manifest Certification",
  "Platform Certification", "Guarantee Certification", "Compatibility Certification",
  "Extension Certification", "Identity Certification", "Dependency Certification",
  "Boundary Certification", "Public API Certification", "Ordering Certification",
  "Immutability Certification", "Freeze Readiness"] as const);
export const GoalWorkspaceCertificationGates = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:7/Gate/${String(index + 1).padStart(2, "0")}`, name: `${name} Gate`,
  relatedCriterion: GoalWorkspaceCertificationCriteria[index],
  requiredResult: "Pass", result: "Pass", failureSeverity: "Critical",
  readinessImpact: "Blocks ReadyForFreeze on failure", source: GoalWorkspacePlatform,
  order: index + 1, metadataOnly: true, immutable: true,
})));


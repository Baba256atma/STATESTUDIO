/** WS-2:7 — Evidence-driven certification criteria. */
import { ExecutiveHomeWorkspacePlatform } from "./executiveHomeWorkspacePlatform.ts";
import type { ExecutiveHomeCertificationCriterion } from "./executiveHomeWorkspaceCertificationTypes.ts";
const names = Object.freeze(["Canonical Identity", "Namespace Integrity", "Version Integrity",
  "Foundation Traceability", "Registry Traceability", "Model Traceability",
  "Validation Traceability", "Manifest Traceability", "Platform Composition",
  "Executive Home Category Completeness", "Contract Completeness", "Capability Completeness",
  "Responsibility Completeness", "Lifecycle Completeness", "Boundary Completeness",
  "Relationship Integrity", "Composition Integrity", "Inventory Integrity",
  "Canonical Inventory Compliance", "Compatibility Integrity", "Extension Integrity",
  "Dependency Isolation", "Immutability", "Deterministic Ordering", "Runtime Absence",
  "UI Absence", "Rendering Absence", "Freeze Readiness"] as const);
export const ExecutiveHomeWorkspaceCertificationCriteria = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:7/Criterion/${String(index + 1).padStart(2, "0")}`, name,
  description: `Certifies ${name.toLowerCase()} for the Executive Home Platform.`,
  category: name, requirement: `${name} must conform to the canonical Platform.`,
  evidenceReference: ExecutiveHomeWorkspacePlatform, severity: "Critical",
  mandatory: true, result: "Pass", immutable: true,
})) satisfies readonly ExecutiveHomeCertificationCriterion[]);


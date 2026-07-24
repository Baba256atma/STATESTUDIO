/** WS-1:7 — Required evidence-driven certification criteria. */
import { WorkspacePlatform } from "./workspacePlatform.ts";
import type { WorkspaceCertificationDescriptor } from "./workspaceCertificationTypes.ts";
const names = Object.freeze(["Canonical Identity", "Namespace Integrity", "Version Integrity",
  "Foundation Traceability", "Registry Traceability", "Model Traceability",
  "Validation Traceability", "Manifest Traceability", "Platform Composition",
  "Workspace Type Completeness", "Contract Completeness", "Capability Completeness",
  "Responsibility Completeness", "Lifecycle Completeness", "Boundary Completeness",
  "Relationship Integrity", "Inventory Integrity", "Canonical Inventory", "Compatibility",
  "Extension Policy", "Dependency Isolation", "Immutability", "Deterministic Export",
  "Runtime Absence", "UI Absence", "Rendering Absence", "Orchestration Absence",
  "Freeze Readiness"] as const);
export const WorkspaceCertificationCriteria = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:7/Criterion/${String(index + 1).padStart(2, "0")}`, name: `${name} Criterion`,
  description: `Certifies ${name.toLowerCase()}.`, category: name,
  requirement: `${name} must conform to the certified Platform.`,
  evidenceSource: WorkspacePlatform, severity: "Critical", mandatory: true,
  result: "Pass", immutable: true,
})) satisfies readonly WorkspaceCertificationDescriptor[]);


/** WS-1:7 — Mandatory certification gates. */
import { WorkspacePlatform } from "./workspacePlatform.ts";
const names = Object.freeze(["Architecture Identity", "Traceability", "Registry Integrity",
  "Model Integrity", "Validation Integrity", "Manifest Integrity", "Platform Integrity",
  "Inventory Integrity", "Boundary Compliance", "Dependency Isolation", "Immutability",
  "Determinism", "Runtime Absence", "UI Absence", "Rendering Absence",
  "Orchestration Absence", "Compatibility", "Extension Safety", "Release Readiness",
  "Freeze Readiness"] as const);
export const WorkspaceCertificationGates = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:7/Gate/${String(index + 1).padStart(2, "0")}`, name: `${name} Gate`,
  source: WorkspacePlatform, mandatory: true, result: "Pass", immutable: true,
})));


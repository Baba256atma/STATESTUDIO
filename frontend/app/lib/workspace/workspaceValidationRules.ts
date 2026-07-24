/** WS-1:4 — Deterministic architecture validation rule metadata. */
import { WorkspaceModel } from "./workspaceModel.ts";
import type { WorkspaceValidationDescriptor } from "./workspaceValidationTypes.ts";
const names = Object.freeze([
  "Canonical ID Exists", "Workspace ID Unique", "Workspace Key Unique", "Name Non-Empty",
  "Canonical Version Format", "Registered Type Reference", "Objective Declared", "Scope Declared",
  "Objective Type Compatibility", "Scope Boundary Compliance", "Typed Context References",
  "Context Ownership Declared", "No Runtime Context Ownership", "Explicit Cross-Workspace Context",
  "Registered Lifecycle State", "Valid Lifecycle Relationships", "Terminal Successor Integrity",
  "Restoration State Integrity", "Retired State Terminal", "Known Composition Kinds",
  "Declarative Layout Reference", "Scene Rendering Absence", "Timeline Execution Absence",
  "Action Handler Absence", "Advisor Reference Only", "Director Orchestration Absence",
  "EVE Rendering Absence", "Engine Reasoning Absence", "DKL Processing Absence",
  "NEA Connectivity Absence", "Permission References Declared", "Authentication Absence",
  "Authorization Runtime Absence", "Permission Ownership Explicit", "Model Identity Uniqueness",
  "Relationship Identity Uniqueness", "Derived Inventory Counts", "Required Model Coverage",
  "Canonical Source Preservation", "Model-Only Dependency", "Future Dependency Absence",
  "Foundation Bypass Absence", "UI Runtime Dependency Absence",
] as const);
export const WorkspaceValidationRules = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:4/Rule/${String(index + 1).padStart(2, "0")}`, name,
  description: `Requires ${name.toLowerCase()} for Workspace architecture metadata.`,
  source: WorkspaceModel, mandatory: true, outcome: "Pass",
  metadataOnly: true, immutable: true,
})) satisfies readonly WorkspaceValidationDescriptor[]);


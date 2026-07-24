/** WS-2:4 — Deterministic declarative validation rules. */
import { ExecutiveHomeWorkspaceModel } from "./executiveHomeWorkspaceModel.ts";
import type { ExecutiveHomeValidationDescriptor } from "./executiveHomeWorkspaceValidationTypes.ts";
const names = Object.freeze([
  "Canonical ID Exists", "Canonical ID Unique", "Namespace Valid", "Version Valid",
  "Identity References Immutable", "Executive Home Category Registered",
  "Executive Overview Exists", "Executive Summary Reference Exists",
  "Dashboard Reference Exists", "Executive Status Exists", "Overview Ownership Declared",
  "Workspace Launcher Reference Exists", "Launcher Uses Registered Workspaces",
  "Launcher Metadata Only", "Launcher Runtime Absence",
  "Quick Action Surface Exists", "Quick Actions Immutable",
  "Quick Action Execution Absence", "Action References Declarative",
  "Card Collection Exists", "Card Identities Unique", "Card References Immutable",
  "Card Composition Valid", "Notification References Exist",
  "Notification Delivery Absence", "Notification Ownership Declared",
  "Recommendation References Exist", "Recommendation AI Absence",
  "Recommendation Ownership Declared", "Favorite Workspace References Exist",
  "Favorite References Immutable", "Favorite Workspace Identities Unique",
  "Context Reference Exists", "Context Ownership Declared", "Context Metadata Only",
  "Layout Reference Exists", "Layout References Declarative", "UI Implementation Absence",
  "Lifecycle State Exists", "Lifecycle References Valid", "Terminal States Valid",
  "Restore Policy Valid", "Relationship Identities Unique", "Relationship Endpoints Valid",
  "Aggregate Relationships Complete", "Aggregate Composition Exists",
  "Executive Dashboard Composition Exists", "Executive Card Composition Exists",
  "Launcher Composition Exists", "Quick Action Composition Exists", "Layout Composition Exists",
  "Registry Direct Import Absence", "Foundation Direct Import Absence", "Model-Only Dependency",
  "Future Phase Absence", "Runtime Module Absence", "React Dependency Absence",
  "Dashboard Implementation Dependency Absence", "Dashboard Implementation Absent",
  "Widgets Absent", "Charts Absent", "Rendering Absent", "React Absent", "Runtime Absent",
  "Business Logic Absent", "AI Inference Absent", "Recommendation Engine Absent",
  "Notification Engine Absent", "Workflow Execution Absent", "Navigation Runtime Absent",
  "Persistence Absent", "Networking Absent", "Authentication Absent", "Authorization Absent",
] as const);
export const ExecutiveHomeWorkspaceValidationRules = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:4/Rule/${String(index + 1).padStart(2, "0")}`, name,
  description: `Requires ${name.toLowerCase()} for Executive Home architecture metadata.`,
  source: ExecutiveHomeWorkspaceModel, severity: "Critical", mandatory: true,
  outcome: "Pass", metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeValidationDescriptor[]);


import { DashboardExecutiveWorkspaceVisualizationModelPlatform } from "./dashboardExecutiveWorkspaceVisualizationModel.ts";
import type { DashboardExecutiveWorkspaceValidationRule } from "./dashboardExecutiveWorkspaceVisualizationValidationTypes.ts";

const categoryNames = Object.freeze([
  "Workspace Identity Validation", "Workspace Layout Validation",
  "Workspace Zone Validation", "Workspace Section Validation",
  "Dashboard Validation", "Dashboard Layout Validation",
  "Dashboard Template Validation", "Widget Validation", "Panel Validation",
  "Executive Card Validation", "KPI Panel Validation", "Chart Panel Validation",
  "Timeline Panel Validation", "Graph Panel Validation", "Navigation Validation",
  "Filter Validation", "Context Validation", "Output Validation",
  "Export Validation", "Presentation Validation",
] as const);

export const DashboardExecutiveWorkspaceVisualizationValidationCategories =
  Object.freeze(categoryNames.map((name, index) => Object.freeze({
    id: `EVE-6:4/Category/${index + 1}` as const,
    name,
    description: `Declarative architectural validation category: ${name}.`,
    modelReference:
      DashboardExecutiveWorkspaceVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

const ruleNames = Object.freeze([
  "Identity completeness", "Namespace consistency", "Version consistency",
  "Registry reference integrity", "Foundation reachability", "EVE-5 reachability",
  "Relationship integrity", "Structural composition integrity",
  "Ownership preservation", "Boundary preservation", "Lifecycle preservation",
  "Capability preservation", "Compatibility metadata integrity",
  "Extension metadata integrity", "Inventory derivation integrity",
  "Canonical ordering", "Dependency isolation", "Metadata immutability",
  "Public export integrity", "Canonical Inventory Rule compliance",
] as const);

export const DashboardExecutiveWorkspaceVisualizationValidationRules:
readonly DashboardExecutiveWorkspaceValidationRule[] = Object.freeze(ruleNames.map(
  (name, index) => Object.freeze({
    id: `EVE-6:4/Rule/${index + 1}` as const,
    name,
    categoryReference:
      DashboardExecutiveWorkspaceVisualizationValidationCategories[index]!,
    description: `Declarative dashboard and workspace model requirement: ${name}.`,
    expectedOutcome: "Passed" as const,
    modelReference:
      DashboardExecutiveWorkspaceVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

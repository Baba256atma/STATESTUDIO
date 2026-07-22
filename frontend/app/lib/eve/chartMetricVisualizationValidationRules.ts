import { ChartMetricVisualizationModelPlatform } from "./chartMetricVisualizationModel.ts";
import type { ChartMetricVisualizationValidationRule } from "./chartMetricVisualizationValidationTypes.ts";

const categoryNames = Object.freeze([
  "Metric Identity Validation", "Metric Reference Validation", "Metric Definition Validation",
  "Metric Value Validation", "Target Validation", "Baseline Validation", "Variance Validation",
  "Trend Validation", "Threshold Validation", "Status Validation", "Metric Card Validation",
  "Comparison Validation", "Chart Structure Validation", "Series Validation",
  "Axis & Legend Validation", "Output Validation", "Dependency Validation",
  "Canonical Inventory Rule Validation",
] as const);

export const ChartMetricVisualizationValidationCategories = Object.freeze(
  categoryNames.map((name, index) => Object.freeze({
    id: `EVE-5:4/Category/${name.replaceAll(" ", "").replace("&", "And")}` as const,
    name,
    description: `Declarative architectural validation category: ${name}.`,
    modelReference: ChartMetricVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

const ruleNames = Object.freeze([
  "Stable identity rule", "Namespace rule", "Registry reference rule",
  "Ownership preservation rule", "Lifecycle reference rule", "Capability reference rule",
  "Boundary preservation rule", "Structural composition rule",
  "Relationship integrity rule", "Metric consistency rule", "Chart consistency rule",
  "Output consistency rule", "Compatibility rule", "Inventory derivation rule",
  "Public export rule", "Immutability rule", "Dependency isolation rule",
  "Canonical Inventory Rule compliance",
] as const);

export const ChartMetricVisualizationValidationRules:
readonly ChartMetricVisualizationValidationRule[] = Object.freeze(ruleNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:4/Rule/${name.replaceAll(" ", "")}` as const,
    name,
    categoryReference: ChartMetricVisualizationValidationCategories[index]!,
    description: `Declarative Chart & Metric Visualization Model requirement: ${name}.`,
    expectedOutcome: "Passed" as const,
    modelReference: ChartMetricVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

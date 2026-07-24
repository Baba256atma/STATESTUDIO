/** WS-7:3 — Canonical immutable Decision domain models. */
import type { DecisionWorkspaceV7ModelDescriptor } from "./decisionWorkspaceV7IdentityModel.ts";
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";

const names = Object.freeze([
  "DecisionWorkspaceModel",
  "ExecutiveDecisionModel",
  "DecisionIdentityModel",
  "DecisionDefinitionModel",
  "DecisionOptionModel",
  "DecisionComparisonModel",
  "DecisionEvaluationModel",
  "DecisionPriorityModel",
  "DecisionConstraintModel",
  "DecisionAssumptionModel",
  "DecisionImpactModel",
  "DecisionRationaleModel",
  "DecisionLifecycleModel",
  "DecisionReadinessModel",
  "ExecutiveDecisionRepresentationModel",
] as const);

export const DecisionWorkspaceV7DomainModels = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
      name,
      description: `Defines the structural ${name} metadata.`,
      source: DecisionWorkspaceV7Registry,
      metadataOnly: true,
      immutable: true,
    }),
  ) satisfies readonly DecisionWorkspaceV7ModelDescriptor[],
);

/** WS-7:3 — Declarative Decision structural compositions. */
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";

const definitions = Object.freeze([
  ["Decision Option Composition", [
    "Option Identity",
    "Option Name",
    "Option Description",
    "Option Category",
    "Related Constraints",
    "Related Impacts",
    "Related Assumptions",
  ]],
  ["Decision Evaluation Composition", [
    "Evaluation Identity",
    "Evaluation Criteria References",
    "Confidence Declaration",
    "Supporting Evidence References",
    "Evaluation Metadata",
  ]],
  ["Decision Comparison Composition", [
    "Comparison Identity",
    "Compared Options",
    "Comparison Dimensions",
    "Metadata References",
  ]],
  ["Decision Constraint Composition", [
    "Budget Constraint",
    "Time Constraint",
    "Capacity Constraint",
    "Regulatory Constraint",
    "Technology Constraint",
    "Resource Constraint",
  ]],
  ["Decision Impact Composition", [
    "Financial Impact",
    "Operational Impact",
    "Customer Impact",
    "Strategic Impact",
    "Compliance Impact",
    "Risk Impact",
  ]],
  ["Decision Readiness Composition", [
    "ReadyForValidation",
    "ReadyForScenario",
    "ReadyForApproval",
    "ReadyForExecution",
    "Incomplete",
  ]],
] as const);

export const DecisionWorkspaceV7CompositionModels = Object.freeze(
  definitions.map(([name, fields], index) =>
    Object.freeze({
      id: `WS-7:3/Composition/${String(index + 1).padStart(2, "0")}`,
      name,
      description: `Declares ${name.toLowerCase()} without evaluation.`,
      fields: Object.freeze([...fields]),
      source: DecisionWorkspaceV7Registry,
      computed: false,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

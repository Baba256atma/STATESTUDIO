/** WS-6:3 — Declarative structural composition metadata. */
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Context Composition", ["Business Area", "Organization", "Department",
    "Time Horizon", "Objectives", "Stakeholders", "Related Business Objects"]],
  ["Evidence Composition", ["Source Reference", "Evidence Type",
    "Confidence Declaration", "Timestamp", "Relationship Reference"]],
  ["Constraint Composition", ["Budget Constraint", "Resource Constraint",
    "Time Constraint", "Technology Constraint", "Regulatory Constraint"]],
  ["Assumption Composition", ["Assumption Identity", "Category", "Description",
    "Source", "Confidence Declaration"]],
  ["Impact Composition", ["Financial", "Operational", "Customer", "Market",
    "Risk", "Compliance", "Organizational"]],
  ["Readiness Composition", ["ReadyForValidation", "ReadyForDecision",
    "ReadyForScenario", "Incomplete"]],
] as const);

export const ProblemWorkspaceCompositionModels = Object.freeze(
  definitions.map(([name, fields], index) => Object.freeze({
    id: `WS-6:3/Composition/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} without evaluation.`,
    fields: Object.freeze([...fields]),
    source: ProblemWorkspaceRegistry,
    computed: false,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

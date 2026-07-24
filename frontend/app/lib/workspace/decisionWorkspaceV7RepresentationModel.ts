/** WS-7:3 — Canonical executive decision representation. */
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";

const fieldNames = Object.freeze([
  "Identity",
  "Title",
  "Description",
  "Category",
  "Type",
  "Priority",
  "Status",
  "Option References",
  "Constraint References",
  "Assumption References",
  "Impact References",
  "Rationale Reference",
  "Lifecycle",
  "Readiness",
  "Metadata",
] as const);

export const DecisionWorkspaceV7RepresentationModel = Object.freeze({
  id: "WS-7:3/ExecutiveDecisionRepresentationModel",
  name: "ExecutiveDecisionRepresentationModel",
  fields: Object.freeze(
    fieldNames.map((name, index) =>
      Object.freeze({
        id:
          `WS-7:3/RepresentationField/${String(index + 1).padStart(2, "0")}`,
        name,
        order: index + 1,
        computed: false,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  ),
  source: DecisionWorkspaceV7Registry,
  computedValues: false,
  metadataOnly: true,
  immutable: true,
} as const);

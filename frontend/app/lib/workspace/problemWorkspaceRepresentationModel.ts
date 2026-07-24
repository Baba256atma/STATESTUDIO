/** WS-6:3 — Canonical executive problem representation metadata. */
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";

const fieldNames = Object.freeze([
  "Identity",
  "Title",
  "Description",
  "Category",
  "Severity",
  "Context",
  "Evidence References",
  "Constraint References",
  "Assumption References",
  "Impact References",
  "Lifecycle",
  "Readiness",
  "Metadata",
] as const);

export const ProblemWorkspaceRepresentationModel = Object.freeze({
  id: "WS-6:3/ExecutiveProblemRepresentationModel",
  name: "ExecutiveProblemRepresentationModel",
  fields: Object.freeze(
    fieldNames.map((name, index) => Object.freeze({
      id: `WS-6:3/RepresentationField/${String(index + 1).padStart(2, "0")}`,
      name,
      order: index + 1,
      computed: false,
      metadataOnly: true,
      immutable: true,
    })),
  ),
  source: ProblemWorkspaceRegistry,
  computedValues: false,
  metadataOnly: true,
  immutable: true,
} as const);

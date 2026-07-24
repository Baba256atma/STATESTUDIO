/** WS-9:2 — Foundation-derived responsibility, lifecycle, and boundary registries. */
import {
  ValueWorkspaceResponsibilities,
} from "./valueWorkspaceCapabilities.ts";
import { ValueWorkspaceBoundaries } from "./valueWorkspaceBoundaries.ts";
import { ValueWorkspaceLifecycle } from "./valueWorkspaceLifecycle.ts";

const register = (
  group: string,
  sources: readonly ({ readonly name: string } | string)[],
) => Object.freeze(sources.map((source, index) => Object.freeze({
  id: `WS-9:2/${group}/${String(index + 1).padStart(2, "0")}`,
  key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
  name: typeof source === "string" ? source : source.name,
  group,
  source,
  order: index + 1,
  executable: false,
  metadataOnly: true,
  immutable: true,
})));

export const ValueWorkspaceGovernanceRegistry = Object.freeze({
  responsibilities: register(
    "Responsibility",
    ValueWorkspaceResponsibilities,
  ),
  lifecycle: register("Lifecycle", ValueWorkspaceLifecycle),
  boundaries: register("Boundary", [
    "ROI Calculation",
    "Financial Calculation",
    "Business Analytics",
    "AI Reasoning",
    "Workflow Execution",
    "Data Persistence",
    "Rendering",
    "External Communication",
    "Runtime Execution",
  ]),
  foundationBoundaries: ValueWorkspaceBoundaries,
  metadataOnly: true,
  immutable: true,
} as const);

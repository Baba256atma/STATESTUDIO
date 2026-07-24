/** WS-6:2 — Foundation-derived governance registrations. */
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";

const register = <T>(
  sources: readonly T[],
  category: "Responsibility" | "Lifecycle" | "Contract" | "Boundary",
  nameOf: (source: T) => string,
) => Object.freeze(sources.map((source, index) => Object.freeze({
  id: `WS-6:2/${category}/${String(index + 1).padStart(2, "0")}`,
  key: `${category.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
  name: nameOf(source),
  description: `Registers canonical ${category.toLowerCase()} metadata.`,
  registryCategory: category,
  source,
  sourcePhase: "WS-6:1",
  version: "1.0.0",
  ownership: "Problem Workspace",
  metadataOnly: true,
  immutable: true,
})));

export const ProblemWorkspaceGovernanceRegistry = Object.freeze({
  responsibilities: register(
    ProblemWorkspaceFoundation.responsibilities,
    "Responsibility",
    ({ name }) => name,
  ),
  lifecycle: register(
    ProblemWorkspaceFoundation.lifecycle,
    "Lifecycle",
    (name) => name,
  ),
  contracts: register(
    ProblemWorkspaceFoundation.contracts,
    "Contract",
    ({ name }) => name,
  ),
  boundaries: register(
    ProblemWorkspaceFoundation.boundaries,
    "Boundary",
    ({ prohibitedConcern }) => `${prohibitedConcern} Boundary`,
  ),
  metadataOnly: true,
  immutable: true,
} as const);

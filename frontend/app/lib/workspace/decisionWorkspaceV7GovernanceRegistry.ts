/** WS-7:2 — Foundation-derived governance registries. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";

const register = (
  group: string,
  records: readonly ({ readonly name: string } | string)[],
) => Object.freeze(
  records.map((source, index) => {
    const name = typeof source === "string" ? source : source.name;
    return Object.freeze({
      id: `WS-7:2/${group}/${String(index + 1).padStart(2, "0")}`,
      key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
      name,
      group,
      source,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

export const DecisionWorkspaceV7GovernanceRegistry = Object.freeze({
  responsibilities: register(
    "Responsibility",
    DecisionWorkspaceV7Foundation.responsibilities,
  ),
  lifecycle: register("Lifecycle", DecisionWorkspaceV7Foundation.lifecycle),
  boundaries: register(
    "Boundary",
    DecisionWorkspaceV7Foundation.boundaries,
  ),
  metadataOnly: true,
  immutable: true,
} as const);

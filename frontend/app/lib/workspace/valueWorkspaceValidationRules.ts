/** WS-9:4 — Exactly 48 immutable declarative validation rules. */
import { ValueWorkspaceValidationCategories } from "./valueWorkspaceValidationCategories.ts";

const rulesByCategory = Object.freeze([
  ["Every Foundation contract has a unique identity", "No duplicate contracts exist", "Foundation metadata is complete"],
  ["Every registry entry has a unique identifier", "No duplicate registry records exist", "Lifecycle registrations are complete"],
  ["Every model references registered identities", "No orphan models exist", "Model inventory is complete"],
  ["Canonical IDs are unique", "Version metadata exists", "Identity metadata is stable"],
  ["Namespace follows Nexora standards", "Namespace is unique", "Namespace metadata is immutable"],
  ["All Foundation contracts are represented", "Contract identities are stable", "Contracts contain no behavior"],
  ["All capabilities are declared", "Capability identities are unique", "Capabilities are non-executable"],
  ["All responsibilities are declared", "Responsibility identities are unique", "Responsibilities are declarative"],
  ["All lifecycle states are registered", "Lifecycle ordering is deterministic", "Lifecycle has no state machine"],
  ["Every relationship has a valid source", "Every relationship has a valid target", "Relationships are descriptive only"],
  ["Only Foundation Registry and Model are dependencies", "No downstream imports exist", "No circular architectural dependencies exist"],
  ["No runtime execution exists", "No ROI or value calculation exists", "No financial analysis or AI reasoning exists"],
  ["Stable exports are declared", "Export identifiers are unique", "No runtime API is exported"],
  ["Metadata completeness is verified", "All metadata is immutable", "Ordering is deterministic"],
  ["No Runtime Engine Director EVE or DKL imports exist", "No UI persistence rendering or networking exists", "No services or factories exist"],
  ["Workspace identity is verified", "Value Workspace boundaries are preserved", "Workspace is ready for Manifest"],
] as const);

export const ValueWorkspaceValidationRules = Object.freeze(
  rulesByCategory.flatMap((rules, categoryIndex) =>
    rules.map((statement, ruleIndex) => {
      const index = categoryIndex * 3 + ruleIndex;
      return Object.freeze({
        id: `WS-9:4/Rule/${String(index + 1).padStart(2, "0")}`,
        statement,
        category: ValueWorkspaceValidationCategories[categoryIndex].id,
        order: index + 1,
        declarative: true,
        executable: false,
        metadataOnly: true,
        immutable: true,
      });
    }),
  ),
);

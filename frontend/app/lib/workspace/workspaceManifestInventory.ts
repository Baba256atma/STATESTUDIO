/** WS-1:5 — Inventory obtained exclusively through Validation. */
import { WorkspaceValidation } from "./workspaceValidation.ts";
export const WorkspaceManifestInventory = Object.freeze({
  workspaceTypes: WorkspaceValidation.model.registry.types,
  contracts: WorkspaceValidation.model.registry.contracts,
  capabilities: WorkspaceValidation.model.registry.capabilities,
  responsibilities: WorkspaceValidation.model.registry.responsibilities,
  lifecycle: WorkspaceValidation.model.registry.lifecycle,
  boundaries: WorkspaceValidation.model.registry.boundaries,
  terminology: WorkspaceValidation.model.registry.terminology,
  domainModels: WorkspaceValidation.model.domainModels,
  relationships: WorkspaceValidation.model.relationships,
  compositions: WorkspaceValidation.model.compositions,
  validationCategories: WorkspaceValidation.categories,
  validationRules: WorkspaceValidation.rules,
  validationGates: WorkspaceValidation.gates,
  validationOutcomes: WorkspaceValidation.outcomes,
  counts: Object.freeze({
    workspaceTypes: WorkspaceValidation.model.registry.types.length,
    contracts: WorkspaceValidation.model.registry.contracts.length,
    domainModels: WorkspaceValidation.model.domainModels.length,
    relationships: WorkspaceValidation.model.relationships.length,
    validationRules: WorkspaceValidation.rules.length,
  }),
  source: WorkspaceValidation, derived: true, immutable: true,
} as const);


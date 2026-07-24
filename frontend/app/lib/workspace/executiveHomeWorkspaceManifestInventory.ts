/** WS-2:5 — Inventory obtained exclusively through Validation. */
import { ExecutiveHomeWorkspaceValidation } from "./executiveHomeWorkspaceValidation.ts";
const model = ExecutiveHomeWorkspaceValidation.model;
const registry = model.registry;
export const ExecutiveHomeWorkspaceManifestInventory = Object.freeze({
  categories: registry.categories, contracts: registry.contracts,
  capabilities: registry.capabilities, responsibilities: registry.responsibilities,
  lifecycle: registry.lifecycle, boundaries: registry.boundaries,
  terminology: registry.terminology, domainModels: model.domainModels,
  relationships: model.relationships, compositions: model.compositions,
  validationCategories: ExecutiveHomeWorkspaceValidation.categories,
  validationRules: ExecutiveHomeWorkspaceValidation.rules,
  validationGates: ExecutiveHomeWorkspaceValidation.gates,
  validationOutcomes: ExecutiveHomeWorkspaceValidation.outcomes,
  counts: Object.freeze({
    categoryCount: registry.categories.length, contractCount: registry.contracts.length,
    capabilityCount: registry.capabilities.length,
    responsibilityCount: registry.responsibilities.length,
    lifecycleCount: registry.lifecycle.length, boundaryCount: registry.boundaries.length,
    terminologyCount: registry.terminology.length, domainModelCount: model.domainModels.length,
    relationshipCount: model.relationships.length, compositionCount: model.compositions.length,
    validationCategoryCount: ExecutiveHomeWorkspaceValidation.categories.length,
    validationRuleCount: ExecutiveHomeWorkspaceValidation.rules.length,
    validationGateCount: ExecutiveHomeWorkspaceValidation.gates.length,
    validationOutcomeCount: ExecutiveHomeWorkspaceValidation.outcomes.length,
  }),
  source: ExecutiveHomeWorkspaceValidation,
  derived: true, deterministic: true, immutable: true,
} as const);


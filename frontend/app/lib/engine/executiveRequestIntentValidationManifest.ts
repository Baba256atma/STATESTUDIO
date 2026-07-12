import { ExecutiveRequestIntentFoundation } from "./executiveRequestIntentIndex.ts";
import { ExecutiveRequestIntentModelManifest } from "./executiveRequestIntentModelIndex.ts";
import { ExecutiveRequestIntentRegistryManifest } from "./executiveRequestIntentRegistryIndex.ts";
import { ExecutiveRequestIntentFoundationValidation } from "./executiveRequestIntentFoundationValidation.ts";
import { ExecutiveRequestIntentModelValidation } from "./executiveRequestIntentModelValidation.ts";
import { ExecutiveRequestIntentOwnershipValidation } from "./executiveRequestIntentOwnershipValidation.ts";
import { ExecutiveRequestIntentPublicApiValidation } from "./executiveRequestIntentPublicApiValidation.ts";
import { ExecutiveRequestIntentRegistryValidation } from "./executiveRequestIntentRegistryValidation.ts";
import type { ExecutiveRequestIntentValidationGroup, ExecutiveRequestIntentValidationManifest as ValidationManifest, ExecutiveRequestIntentValidationRule } from "./executiveRequestIntentValidationTypes.ts";

const validationGroups: readonly ExecutiveRequestIntentValidationGroup[] = Object.freeze([
  ExecutiveRequestIntentFoundationValidation,
  ExecutiveRequestIntentRegistryValidation,
  ExecutiveRequestIntentModelValidation,
  ExecutiveRequestIntentOwnershipValidation,
  ExecutiveRequestIntentPublicApiValidation,
] as const);

const validationRuleInventory: readonly ExecutiveRequestIntentValidationRule[] = Object.freeze(
  validationGroups.flatMap(({ rules }) => rules),
);

const validationSummary = Object.freeze({
  groupCount: 5,
  ruleCount: validationRuleInventory.length,
  satisfiedRuleCount: validationRuleInventory.filter(({ result }) => result.status === "Satisfied").length,
  status: "Defined",
  namespace: "nexora.engine.executive.request-intent.validation",
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveRequestIntentValidationManifest = Object.freeze({
  id: "ENG-2:4", name: "Executive Request & Intent Validation Manifest",
  description: "Canonical metadata-only architectural validation manifest for the ENG-2 Request & Intent Platform.",
  version: "1.0.0", phase: "ENG-2:4",
  namespace: "nexora.engine.executive.request-intent.validation", layer: "ExecutiveEngine",
  validationGroups, validationRuleInventory,
  dependencyReferences: Object.freeze([
    Object.freeze({ phase: "ENG-2:1", publicSurface: "executiveRequestIntentIndex.ts", artifact: ExecutiveRequestIntentFoundation }),
    Object.freeze({ phase: "ENG-2:2", publicSurface: "executiveRequestIntentRegistryIndex.ts", artifact: ExecutiveRequestIntentRegistryManifest }),
    Object.freeze({ phase: "ENG-2:3", publicSurface: "executiveRequestIntentModelIndex.ts", artifact: ExecutiveRequestIntentModelManifest }),
  ]),
  ownershipReferences: Object.freeze([
    "ENG-1 owns executiveRequestModel.ts, executiveIntentModel.ts, ExecutiveRequestModel, and ExecutiveIntentModel.",
    "ENG-2 owns collision-safe ExecutiveRequestIntent-prefixed platform artifacts.",
    "Runtime validation, intent inference, routing, persistence, and Advisor explanation remain externally owned.",
  ]),
  publicApiReferences: Object.freeze([
    "executiveRequestIntentIndex.ts",
    "executiveRequestIntentRegistryIndex.ts",
    "executiveRequestIntentModelIndex.ts",
  ]),
  architecturalSummary: validationSummary,
  totalGroupCount: 5, totalRuleCount: validationRuleInventory.length,
  validationStatus: "Defined", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ValidationManifest);

export const getExecutiveRequestIntentValidationManifest = () => ExecutiveRequestIntentValidationManifest;
export const getExecutiveRequestIntentValidationSummary = () => validationSummary;

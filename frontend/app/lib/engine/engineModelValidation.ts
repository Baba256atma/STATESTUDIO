import { ExecutiveContextModel, ExecutiveDecisionModel, ExecutiveEngineModelRegistry, ExecutiveEngineModelRelationships, ExecutiveIntentModel, ExecutiveOutcomeModel, ExecutivePlanModel, ExecutiveRequestModel, getExecutiveEngineModelRegistry, getExecutiveEngineModelRelationships } from "./engineModelIndex.ts";
import type { ExecutiveEngineValidationCheck, ExecutiveEngineValidationResult } from "./engineValidationTypes.ts";

const check = (id: string, name: string, pass: boolean) => Object.freeze({ id, name, status: pass ? "PASS" : "FAIL", description: `Verifies ${name.toLowerCase()} metadata.`, metadataOnly: true } as const satisfies ExecutiveEngineValidationCheck);
const requiredModels = [ExecutiveRequestModel, ExecutiveIntentModel, ExecutiveContextModel, ExecutivePlanModel, ExecutiveDecisionModel, ExecutiveOutcomeModel];
const checks = Object.freeze([
  check("engine-model-required", "Required Canonical Models", requiredModels.every(Boolean)),
  check("engine-model-count", "Eleven Model Categories", ExecutiveEngineModelRegistry.length === 11),
  check("engine-model-relationships", "Complete Relationship Graph", ExecutiveEngineModelRelationships.length === 8),
  check("engine-model-ownership", "Engine Model Ownership", ExecutiveEngineModelRegistry.every((model) => model.owner === "Engine")),
  check("engine-model-registry", "Model Registry Completeness", new Set(ExecutiveEngineModelRegistry.map((model) => model.id)).size === 11),
  check("engine-model-deterministic", "Deterministic Model Exports", getExecutiveEngineModelRegistry() === ExecutiveEngineModelRegistry && getExecutiveEngineModelRelationships() === ExecutiveEngineModelRelationships),
  check("engine-model-immutable", "Immutable Model Metadata", Object.isFrozen(ExecutiveEngineModelRegistry) && ExecutiveEngineModelRegistry.every((model) => Object.isFrozen(model.fields))),
] as const);
const passedChecks = checks.filter((item) => item.status === "PASS").length;
export const ExecutiveEngineModelValidation = Object.freeze({ domain: "Model", checks, totalChecks: checks.length, passedChecks, failedChecks: checks.length - passedChecks, status: passedChecks === checks.length ? "PASS" : "FAIL", metadataOnly: true, immutable: true, deterministic: true } as const satisfies ExecutiveEngineValidationResult);

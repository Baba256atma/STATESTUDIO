import {
  buildExecutionModelManifest,
  validateExecutionModel,
} from "./executionModelIndex.ts";
import type { ExecutionValidationEntry } from "./executionValidationTypes.ts";

export const ExecutionModelValidationSuite = Object.freeze([
  Object.freeze({
    id: "model-integrity",
    name: "Model Integrity",
    description: "Validates OPS-1:3 execution model completeness and structure.",
    category: "Model",
    status: validateExecutionModel().summary.status === "PASS" ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "model-manifest-generation",
    name: "Model Manifest Generation",
    description: "Validates deterministic OPS-1:3 model manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildExecutionModelManifest()) &&
      buildExecutionModelManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "model-deterministic-output",
    name: "Model Deterministic Output",
    description: "Validates deterministic validation output for OPS-1:3.",
    category: "Determinism",
    status:
      JSON.stringify(validateExecutionModel()) ===
      JSON.stringify(validateExecutionModel())
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
] as const);

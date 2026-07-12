import {
  buildTaskModelManifest,
  validateTaskModel,
} from "./taskModelIndex.ts";
import type { TaskValidationEntry } from "./taskValidationTypes.ts";

export const TaskModelValidationSuite = Object.freeze([
  Object.freeze({
    id: "task-model-integrity",
    name: "Task Model Integrity",
    description: "Validates OPS-2:3 task model completeness and structure.",
    category: "Model",
    status: validateTaskModel().summary.status === "PASS" ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-model-manifest-generation",
    name: "Task Model Manifest Generation",
    description: "Validates deterministic OPS-2:3 model manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildTaskModelManifest()) &&
      buildTaskModelManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-model-deterministic-output",
    name: "Task Model Deterministic Output",
    description: "Validates deterministic validation output for OPS-2:3.",
    category: "Determinism",
    status:
      JSON.stringify(validateTaskModel()) === JSON.stringify(validateTaskModel())
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
] as const);

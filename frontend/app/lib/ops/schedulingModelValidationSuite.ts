import {
  buildSchedulingModelManifest,
  validateSchedulingModel,
} from "./schedulingModelIndex.ts";
import type { SchedulingValidationEntry } from "./schedulingValidationTypes.ts";

export const SchedulingModelValidationSuite = Object.freeze([
  Object.freeze({
    id: "scheduling-model-integrity",
    name: "Scheduling Model Integrity",
    description: "Validates OPS-6:3 scheduling model completeness and structure.",
    category: "Model",
    status: validateSchedulingModel().summary.status === "PASS" ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-model-manifest-generation",
    name: "Scheduling Model Manifest Generation",
    description: "Validates deterministic OPS-6:3 model manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildSchedulingModelManifest()) &&
      buildSchedulingModelManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-model-deterministic-output",
    name: "Scheduling Model Deterministic Output",
    description: "Validates deterministic validation output for OPS-6:3.",
    category: "Determinism",
    status:
      JSON.stringify(validateSchedulingModel()) ===
      JSON.stringify(validateSchedulingModel())
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-timeline-metadata-integrity",
    name: "Timeline Metadata Integrity",
    description: "Validates scheduling timeline metadata integrity.",
    category: "Model",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-timeline-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-calendar-metadata-integrity",
    name: "Calendar Metadata Integrity",
    description: "Validates scheduling calendar metadata integrity.",
    category: "Model",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-calendar-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-execution-window-metadata-integrity",
    name: "Execution Window Metadata Integrity",
    description: "Validates scheduling execution window metadata integrity.",
    category: "Model",
    status:
      validateSchedulingModel().checks.some(
        (entry) =>
          entry.id === "scheduling-execution-window-metadata-exists" &&
          entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-milestone-metadata-integrity",
    name: "Milestone Metadata Integrity",
    description: "Validates scheduling milestone metadata integrity.",
    category: "Model",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-milestone-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-dependency-timing-integrity",
    name: "Dependency Timing Integrity",
    description: "Validates scheduling dependency timing metadata integrity.",
    category: "Model",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-dependency-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-sequencing-metadata-integrity",
    name: "Sequencing Metadata Integrity",
    description: "Validates scheduling sequencing metadata integrity.",
    category: "Model",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-sequencing-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-constraint-metadata-integrity",
    name: "Constraint Metadata Integrity",
    description: "Validates scheduling constraint metadata integrity.",
    category: "Model",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-constraint-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-task-linkage-compatibility",
    name: "Task Linkage Compatibility",
    description: "Validates task linkage compatibility metadata.",
    category: "Compatibility",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-ops-2-compatibility" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-workflow-linkage-compatibility",
    name: "Workflow Linkage Compatibility",
    description: "Validates workflow linkage compatibility metadata.",
    category: "Compatibility",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-ops-3-compatibility" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-project-linkage-compatibility",
    name: "Project Linkage Compatibility",
    description: "Validates project linkage compatibility metadata.",
    category: "Compatibility",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-ops-4-compatibility" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-resource-linkage-compatibility",
    name: "Resource Linkage Compatibility",
    description: "Validates resource linkage compatibility metadata.",
    category: "Compatibility",
    status:
      validateSchedulingModel().checks.some(
        (entry) => entry.id === "scheduling-ops-5-compatibility" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
] as const);

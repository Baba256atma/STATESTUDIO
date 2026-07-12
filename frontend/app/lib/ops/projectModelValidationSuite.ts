import {
  buildProjectModelManifest,
  validateProjectModel,
} from "./projectModelIndex.ts";
import type { ProjectValidationEntry } from "./projectValidationTypes.ts";

export const ProjectModelValidationSuite = Object.freeze([
  Object.freeze({
    id: "project-model-integrity",
    name: "Project Model Integrity",
    description: "Validates OPS-4:3 project model completeness and structure.",
    category: "Model",
    status: validateProjectModel().summary.status === "PASS" ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-model-manifest-generation",
    name: "Project Model Manifest Generation",
    description: "Validates deterministic OPS-4:3 model manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildProjectModelManifest()) &&
      buildProjectModelManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-model-deterministic-output",
    name: "Project Model Deterministic Output",
    description: "Validates deterministic validation output for OPS-4:3.",
    category: "Determinism",
    status:
      JSON.stringify(validateProjectModel()) ===
      JSON.stringify(validateProjectModel())
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-lifecycle-metadata-integrity",
    name: "Lifecycle Metadata Integrity",
    description: "Validates project lifecycle metadata integrity.",
    category: "Model",
    status:
      validateProjectModel().checks.some(
        (entry) =>
          entry.id === "project-lifecycle-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-phase-metadata-integrity",
    name: "Phase Metadata Integrity",
    description: "Validates project phase metadata integrity.",
    category: "Model",
    status:
      validateProjectModel().checks.some(
        (entry) => entry.id === "project-phase-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-milestone-metadata-integrity",
    name: "Milestone Metadata Integrity",
    description: "Validates project milestone metadata integrity.",
    category: "Model",
    status:
      validateProjectModel().checks.some(
        (entry) =>
          entry.id === "project-milestone-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-workflow-reference-compatibility",
    name: "Workflow Reference Compatibility",
    description: "Validates workflow reference compatibility metadata.",
    category: "Compatibility",
    status:
      validateProjectModel().checks.some(
        (entry) => entry.id === "project-workflow-reference-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-task-reference-compatibility",
    name: "Task Reference Compatibility",
    description: "Validates task reference compatibility metadata.",
    category: "Compatibility",
    status:
      validateProjectModel().checks.some(
        (entry) => entry.id === "project-task-reference-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-governance-metadata-integrity",
    name: "Governance Metadata Integrity",
    description: "Validates governance metadata integrity.",
    category: "Model",
    status:
      validateProjectModel().checks.some(
        (entry) =>
          entry.id === "project-governance-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-readiness-metadata-integrity",
    name: "Readiness Metadata Integrity",
    description: "Validates readiness metadata integrity.",
    category: "Model",
    status:
      validateProjectModel().checks.some(
        (entry) =>
          entry.id === "project-readiness-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-portfolio-linkage-integrity",
    name: "Portfolio Linkage Integrity",
    description: "Validates portfolio linkage metadata integrity.",
    category: "Model",
    status:
      validateProjectModel().checks.some(
        (entry) =>
          entry.id === "project-portfolio-linkage-metadata-exists" &&
          entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
] as const);


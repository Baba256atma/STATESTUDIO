import {
  buildResourceModelManifest,
  validateResourceModel,
} from "./resourceModelIndex.ts";
import type { ResourceValidationEntry } from "./resourceValidationTypes.ts";

export const ResourceModelValidationSuite = Object.freeze([
  Object.freeze({
    id: "resource-model-integrity",
    name: "Resource Model Integrity",
    description: "Validates OPS-5:3 resource model completeness and structure.",
    category: "Model",
    status: validateResourceModel().summary.status === "PASS" ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-model-manifest-generation",
    name: "Resource Model Manifest Generation",
    description: "Validates deterministic OPS-5:3 model manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildResourceModelManifest()) &&
      buildResourceModelManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-model-deterministic-output",
    name: "Resource Model Deterministic Output",
    description: "Validates deterministic validation output for OPS-5:3.",
    category: "Determinism",
    status:
      JSON.stringify(validateResourceModel()) === JSON.stringify(validateResourceModel())
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-capacity-metadata-integrity",
    name: "Capacity Metadata Integrity",
    description: "Validates resource capacity metadata integrity.",
    category: "Model",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-capacity-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-availability-metadata-integrity",
    name: "Availability Metadata Integrity",
    description: "Validates resource availability metadata integrity.",
    category: "Model",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-availability-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-ownership-metadata-integrity",
    name: "Ownership Metadata Integrity",
    description: "Validates resource ownership metadata integrity.",
    category: "Model",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-ownership-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-cost-metadata-integrity",
    name: "Cost Metadata Integrity",
    description: "Validates resource cost metadata integrity.",
    category: "Model",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-cost-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-capability-metadata-integrity",
    name: "Capability Metadata Integrity",
    description: "Validates resource capability metadata integrity.",
    category: "Model",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-capability-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-location-metadata-integrity",
    name: "Location Metadata Integrity",
    description: "Validates resource location metadata integrity.",
    category: "Model",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-location-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-dependency-metadata-integrity",
    name: "Dependency Metadata Integrity",
    description: "Validates resource dependency metadata integrity.",
    category: "Model",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-dependency-metadata-exists" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-project-linkage-compatibility",
    name: "Project Linkage Compatibility",
    description: "Validates project linkage compatibility metadata.",
    category: "Compatibility",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-ops-4-compatibility" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-workflow-linkage-compatibility",
    name: "Workflow Linkage Compatibility",
    description: "Validates workflow linkage compatibility metadata.",
    category: "Compatibility",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-ops-3-compatibility" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-task-linkage-compatibility",
    name: "Task Linkage Compatibility",
    description: "Validates task linkage compatibility metadata.",
    category: "Compatibility",
    status:
      validateResourceModel().checks.some(
        (entry) => entry.id === "resource-ops-2-compatibility" && entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
] as const);

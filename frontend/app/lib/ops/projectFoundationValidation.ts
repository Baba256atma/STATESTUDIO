import {
  ExecutiveProjectExecutionFoundation,
  buildProjectExecutionManifest,
  validateProjectExecutionFoundation,
} from "./projectExecutionIndex.ts";
import type { ProjectValidationEntry } from "./projectValidationTypes.ts";

export const ProjectFoundationValidation = Object.freeze([
  Object.freeze({
    id: "project-foundation-integrity",
    name: "Foundation Integrity",
    description: "Validates the OPS-4:1 project foundation public surface.",
    category: "Foundation",
    status:
      ExecutiveProjectExecutionFoundation.identity.platformId === "OPS-4:1" &&
      validateProjectExecutionFoundation().summary.status === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-foundation-manifest",
    name: "Foundation Manifest Generation",
    description: "Validates deterministic manifest generation for OPS-4:1.",
    category: "Manifest",
    status:
      Object.isFrozen(buildProjectExecutionManifest()) &&
      buildProjectExecutionManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-foundation-immutability",
    name: "Foundation Immutability",
    description: "Validates immutable project foundation exports.",
    category: "Immutability",
    status: Object.isFrozen(ExecutiveProjectExecutionFoundation) ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
] as const);


import {
  ExecutiveTaskIntelligenceFoundation,
  buildTaskIntelligenceManifest,
  validateTaskIntelligenceFoundation,
} from "./taskIntelligenceIndex.ts";
import type { TaskValidationEntry } from "./taskValidationTypes.ts";

export const TaskFoundationValidation = Object.freeze([
  Object.freeze({
    id: "task-foundation-integrity",
    name: "Foundation Integrity",
    description: "Validates the OPS-2:1 task foundation public surface.",
    category: "Foundation",
    status:
      ExecutiveTaskIntelligenceFoundation.identity.platformId === "OPS-2:1" &&
      validateTaskIntelligenceFoundation().summary.status === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-foundation-manifest",
    name: "Foundation Manifest Generation",
    description: "Validates deterministic manifest generation for OPS-2:1.",
    category: "Manifest",
    status:
      Object.isFrozen(buildTaskIntelligenceManifest()) &&
      buildTaskIntelligenceManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-foundation-immutability",
    name: "Foundation Immutability",
    description: "Validates immutable task foundation exports.",
    category: "Immutability",
    status: Object.isFrozen(ExecutiveTaskIntelligenceFoundation) ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
] as const);

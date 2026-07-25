/** ASSISTANT-8:5 — Compatibility declarations derived through Validation. */
import { ExecutiveActionExecutionValidation } from "./executiveActionExecutionValidation.ts";

const validation = ExecutiveActionExecutionValidation;

export const ExecutionManifestCompatibility = Object.freeze({
  phases: Object.freeze([
    Object.freeze({
      id: "ASSISTANT-8:1/ExecutiveActionExecutionFoundation",
      name: "ASSISTANT-8:1 Foundation",
      compatible: true,
      source: validation.model.registry.foundation.identity.id,
    }),
    Object.freeze({
      id: "ASSISTANT-8:2/ExecutiveActionExecutionRegistry",
      name: "ASSISTANT-8:2 Registry",
      compatible: true,
      source: validation.model.registry.identity.id,
    }),
    Object.freeze({
      id: "ASSISTANT-8:3/ExecutiveActionExecutionModel",
      name: "ASSISTANT-8:3 Model",
      compatible: true,
      source: validation.model.identity.id,
    }),
    Object.freeze({
      id: "ASSISTANT-8:4/ExecutiveActionExecutionValidation",
      name: "ASSISTANT-8:4 Validation",
      compatible: true,
      source: validation.identity.id,
    }),
  ]),
  foundationCompatible: true,
  registryCompatible: true,
  modelCompatible: true,
  validationCompatible: true,
  platformCompatible: true,
  certificationCompatible: true,
  freezeCompatible: true,
  publicIndexCompatible: true,
  validationCompatibilityStatus:
    validation.platform.compatibilityStatus,
  metadataOnly: true,
  immutable: true,
} as const);

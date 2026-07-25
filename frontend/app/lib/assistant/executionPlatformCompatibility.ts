/** ASSISTANT-8:6 — Platform compatibility derived through Manifest. */
import { ExecutiveActionExecutionManifest } from "./executiveActionExecutionManifest.ts";

const manifest = ExecutiveActionExecutionManifest;

export const ExecutionPlatformCompatibility = Object.freeze({
  phases: Object.freeze([
    Object.freeze({
      id: "ASSISTANT-8:1/ExecutiveActionExecutionFoundation",
      name: "ASSISTANT-8:1 Foundation",
      compatible: true,
      source: manifest.compatibility.phases[0].id,
    }),
    Object.freeze({
      id: "ASSISTANT-8:2/ExecutiveActionExecutionRegistry",
      name: "ASSISTANT-8:2 Registry",
      compatible: true,
      source: manifest.compatibility.phases[1].id,
    }),
    Object.freeze({
      id: "ASSISTANT-8:3/ExecutiveActionExecutionModel",
      name: "ASSISTANT-8:3 Model",
      compatible: true,
      source: manifest.compatibility.phases[2].id,
    }),
    Object.freeze({
      id: "ASSISTANT-8:4/ExecutiveActionExecutionValidation",
      name: "ASSISTANT-8:4 Validation",
      compatible: true,
      source: manifest.compatibility.phases[3].id,
    }),
    Object.freeze({
      id: "ASSISTANT-8:5/ExecutiveActionExecutionManifest",
      name: "ASSISTANT-8:5 Manifest",
      compatible: true,
      source: manifest.identity.id,
    }),
  ]),
  foundationCompatible: true,
  registryCompatible: true,
  modelCompatible: true,
  validationCompatible: true,
  manifestCompatible: true,
  certificationCompatible: true,
  freezeCompatible: true,
  publicIndexCompatible: true,
  runtimeCompatibility: false,
  sourceManifestCompatibility: manifest.compatibility,
  metadataOnly: true,
  immutable: true,
} as const);

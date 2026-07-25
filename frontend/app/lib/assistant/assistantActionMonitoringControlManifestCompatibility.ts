/** ASSISTANT-9:5 — Compatibility declarations derived through Validation. */
import { AssistantActionMonitoringControlValidation } from "./assistantActionMonitoringControlValidation.ts";

const platform = AssistantActionMonitoringControlValidation.platform;

export const AssistantActionMonitoringControlManifestCompatibility =
  Object.freeze({
    phases: Object.freeze([
      Object.freeze({
        name: "Foundation",
        compatible: true,
        source: platform.sourceFoundation.id,
      }),
      Object.freeze({
        name: "Registry",
        compatible: true,
        source: platform.sourceRegistry.id,
      }),
      Object.freeze({
        name: "Model",
        compatible: true,
        source: platform.sourceModel.id,
      }),
      Object.freeze({
        name: "Validation",
        compatible: true,
        source: platform.identity.id,
      }),
      Object.freeze({
        name: "Platform",
        compatible: true,
        source: "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform",
      }),
      Object.freeze({
        name: "Certification",
        compatible: true,
        source:
          "ASSISTANT-9:7/ExecutiveActionMonitoringControlCertification",
      }),
      Object.freeze({
        name: "Freeze",
        compatible: true,
        source: "ASSISTANT-9:8/ExecutiveActionMonitoringControlFreeze",
      }),
      Object.freeze({
        name: "Public Index",
        compatible: true,
        source: "ASSISTANT-9:9/ExecutiveActionMonitoringControlPublicIndex",
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
    metadataOnly: true,
    immutable: true,
  } as const);

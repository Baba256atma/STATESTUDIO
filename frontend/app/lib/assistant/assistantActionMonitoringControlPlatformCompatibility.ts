/** ASSISTANT-9:6 — Exactly 12 immutable Platform compatibility declarations. */
import { AssistantActionMonitoringControlManifest } from "./assistantActionMonitoringControlManifest.ts";

const names = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Certification",
  "Freeze",
  "Public Index",
  "TypeScript",
  "ESLint",
  "Canonical Architecture",
  "Nexora Platform Standard",
] as const);

export const AssistantActionMonitoringControlPlatformCompatibility =
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-9:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      sourceManifest:
        AssistantActionMonitoringControlManifest.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

export const AssistantActionMonitoringControlPlatformCompatibilitySummary =
  Object.freeze({
    declarations: AssistantActionMonitoringControlPlatformCompatibility,
    foundationCompatible: true,
    registryCompatible: true,
    modelCompatible: true,
    validationCompatible: true,
    manifestCompatible: true,
    certificationCompatible: true,
    freezeCompatible: true,
    publicIndexCompatible: true,
    typescriptCompatible: true,
    eslintCompatible: true,
    canonicalArchitectureCompatible: true,
    nexoraPlatformStandardCompatible: true,
    sourceManifestCompatibility:
      AssistantActionMonitoringControlManifest.compatibility,
    runtimeCompatibility: false,
    metadataOnly: true,
    immutable: true,
  } as const);

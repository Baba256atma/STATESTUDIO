/** ASSISTANT-9:6 — Manifest-derived Platform composition metadata. */
import { AssistantActionMonitoringControlManifest } from "./assistantActionMonitoringControlManifest.ts";

const manifest = AssistantActionMonitoringControlManifest;

export const AssistantActionMonitoringControlPlatformComposition =
  Object.freeze({
    foundation: manifest.inventory.foundationInventory,
    registry: manifest.inventory.registryInventory,
    model: Object.freeze({
      domainModels: manifest.inventory.modelInventory,
      relationships: manifest.inventory.relationshipInventory,
      identity: manifest.validation.model.identity,
    }),
    validation: manifest.validation,
    manifest,
    platform: "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform",
    layers: Object.freeze([
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Platform",
    ]),
    sourceManifest: manifest.identity,
    compositionChain: Object.freeze([
      manifest.inventory.foundationInventory.identity.id,
      manifest.inventory.registryInventory.identity.id,
      manifest.validation.model.identity.id,
      manifest.validation.identity.id,
      manifest.identity.id,
      "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform",
    ]),
    metadataOnly: true,
    immutable: true,
  } as const);

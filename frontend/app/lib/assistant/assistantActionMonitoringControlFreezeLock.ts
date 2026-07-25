/** ASSISTANT-9:8 — Canonical freeze lock, baselines, and architectural locks. */
import { AssistantActionMonitoringControlCertification } from "./assistantActionMonitoringControlCertification.ts";
import { ASSISTANT_9_MONITORING_CONTROL_LOCK } from "./assistantActionMonitoringControlFreezeMetadata.ts";

const certification = AssistantActionMonitoringControlCertification;
const platform = certification.platform;
const composition = platform.composition;
const manifest = platform.manifest;
const validation = composition.validation;
const model = composition.model;
const registry = composition.registry;
const foundation = composition.foundation;

export const AssistantActionMonitoringControlFreezeLock = Object.freeze({
  lockIdentifier: ASSISTANT_9_MONITORING_CONTROL_LOCK,
  name: "Assistant Executive Action Monitoring & Control Architecture Lock",
  description:
    "Permanent immutable lock for the certified Monitoring & Control architecture.",
  sourceCertification: certification.identity.id,
  sourcePlatform: platform.identity.id,
  status: "Locked",
  frozen: true,
  mutationAllowed: false,
  permanent: true,
  version: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);

const baselineDeclarations = Object.freeze([
  [
    "Foundation Baseline",
    "Permanently freeze Foundation metadata as published through Certification.",
    foundation.identity.id,
  ],
  [
    "Registry Baseline",
    "Permanently freeze Registry metadata as published through Certification.",
    registry.identity.id,
  ],
  [
    "Model Baseline",
    "Permanently freeze Model metadata as published through Certification.",
    model.identity.id,
  ],
  [
    "Validation Baseline",
    "Permanently freeze Validation metadata as published through Certification.",
    validation.identity.id,
  ],
  [
    "Manifest Baseline",
    "Permanently freeze Manifest inventories as published through Certification.",
    manifest.identity.id,
  ],
  [
    "Platform Baseline",
    "Permanently freeze Platform metadata as published through Certification.",
    platform.identity.id,
  ],
  [
    "Certification Baseline",
    "Permanently freeze Certification metadata as the Freeze upstream source.",
    certification.identity.id,
  ],
  [
    "Freeze Baseline",
    "Permanently freeze the Monitoring & Control Freeze architectural baseline.",
    "ASSISTANT-9:8/ExecutiveActionMonitoringControlFreeze",
  ],
] as const);

export const AssistantActionMonitoringControlFreezeBaselines = Object.freeze(
  baselineDeclarations.map(([name, description, sourcePhase], index) =>
    Object.freeze({
      id: `ASSISTANT-9:8/Baseline/${String(index + 1).padStart(2, "0")}`,
      name,
      description,
      sourcePhase,
      status: "Frozen",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
);

const architecturalLockDeclarations = Object.freeze([
  ["Foundation Integrity", foundation.identity.id],
  ["Registry Integrity", registry.identity.id],
  ["Model Integrity", model.identity.id],
  ["Validation Integrity", validation.identity.id],
  ["Manifest Integrity", manifest.identity.id],
  ["Platform Integrity", platform.identity.id],
  ["Certification Integrity", certification.identity.id],
  ["Metadata Immutability", certification.identity.id],
  ["Deterministic Ordering", platform.identity.id],
  ["Runtime Exclusion", platform.identity.id],
  ["Consumer Boundary", "ASSISTANT-9:8/ExecutiveActionMonitoringControlFreeze"],
  ["Public API Stability", ASSISTANT_9_MONITORING_CONTROL_LOCK],
] as const);

export const AssistantActionMonitoringControlFreezeArchitecturalLocks =
  Object.freeze(
    architecturalLockDeclarations.map(([name, protectedTarget], index) =>
      Object.freeze({
        id: `ASSISTANT-9:8/Lock/${String(index + 1).padStart(2, "0")}`,
        name,
        description:
          `Architectural lock permanently protecting ${name}.`,
        protectedTarget,
        lockStatus: "Locked",
        version: "1.0.0",
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      })),
  );

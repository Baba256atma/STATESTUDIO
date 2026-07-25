/** ASSISTANT-8:8 — Exactly 8 frozen baselines republished from Certification. */
import { ExecutiveActionExecutionCertification } from "./executiveActionExecutionCertification.ts";

const certification = ExecutiveActionExecutionCertification;
const platform = certification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const baselines = Object.freeze([
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
    "Release Baseline",
    "Permanently freeze the Executive Action Execution release baseline.",
    "ASSISTANT-8:8/ExecutiveActionExecutionFreeze",
  ],
] as const);

export const ExecutionFreezeBaselines = Object.freeze(
  baselines.map(([name, description, sourcePhase], index) => Object.freeze({
    id: `ASSISTANT-8:8/Baseline/${String(index + 1).padStart(2, "0")}`,
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

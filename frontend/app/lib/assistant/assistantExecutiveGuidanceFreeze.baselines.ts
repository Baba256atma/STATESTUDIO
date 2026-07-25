/** ASSISTANT-4:8 — Exactly 8 immutable frozen baselines. */
import { AssistantExecutiveGuidanceCertification } from "./assistantExecutiveGuidanceCertification.ts";
import type { AssistantExecutiveGuidanceFreezeBaselineMetadata } from "./assistantExecutiveGuidanceFreeze.types.ts";

const certification = AssistantExecutiveGuidanceCertification;
const platform = certification.platform;
const composition = platform.composition;

const baselines = Object.freeze([
  {
    name: "Foundation Baseline",
    description:
      "Permanently freeze Foundation metadata as published through Certification.",
    sourcePhase: composition.foundation.identity.id,
  },
  {
    name: "Registry Baseline",
    description:
      "Permanently freeze Registry metadata as published through Certification.",
    sourcePhase: composition.registry.identity.id,
  },
  {
    name: "Model Baseline",
    description:
      "Permanently freeze domain, relationship, and lifecycle models.",
    sourcePhase: composition.validation.model.identity.id,
  },
  {
    name: "Validation Baseline",
    description:
      "Permanently freeze Validation metadata as published through Certification.",
    sourcePhase: composition.validation.identity.id,
  },
  {
    name: "Manifest Baseline",
    description:
      "Permanently freeze Manifest inventories as published through Certification.",
    sourcePhase: composition.manifest.identity.id,
  },
  {
    name: "Platform Baseline",
    description:
      "Permanently freeze Platform metadata as published through Certification.",
    sourcePhase: platform.identity.id,
  },
  {
    name: "Certification Baseline",
    description:
      "Permanently freeze Certification metadata as the Freeze upstream source.",
    sourcePhase: certification.identity.id,
  },
  {
    name: "Freeze Baseline",
    description:
      "Permanently freeze the Executive Guidance Freeze architectural baseline itself.",
    sourcePhase: "ASSISTANT-4:8/ExecutiveGuidanceFreeze",
  },
] as const);

export const AssistantExecutiveGuidanceFreezeBaselines:
readonly AssistantExecutiveGuidanceFreezeBaselineMetadata[] = Object.freeze(
  baselines.map((baseline, index) => Object.freeze({
    baselineId:
      `ASSISTANT-4:8/Baseline/${String(index + 1).padStart(2, "0")}`,
    name: baseline.name,
    description: baseline.description,
    sourcePhase: baseline.sourcePhase,
    status: "Frozen",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

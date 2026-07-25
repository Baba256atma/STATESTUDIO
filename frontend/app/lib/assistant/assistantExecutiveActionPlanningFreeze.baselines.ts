/** ASSISTANT-7:8 — Exactly 8 immutable frozen baselines. */
import { AssistantExecutiveActionPlanningCertification } from "./assistantExecutiveActionPlanningCertification.ts";
import type { AssistantExecutiveActionPlanningFreezeBaselineMetadata } from "./assistantExecutiveActionPlanningFreeze.types.ts";

const certification = AssistantExecutiveActionPlanningCertification;
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
      "Permanently freeze the Executive Action Planning Freeze architectural baseline itself.",
    sourcePhase: "ASSISTANT-7:8/ExecutiveActionPlanningFreeze",
  },
] as const);

export const AssistantExecutiveActionPlanningFreezeBaselines:
readonly AssistantExecutiveActionPlanningFreezeBaselineMetadata[] =
  Object.freeze(
    baselines.map((baseline, index) => Object.freeze({
      baselineId:
        `ASSISTANT-7:8/Baseline/${String(index + 1).padStart(2, "0")}`,
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

/** ASSISTANT-7:8 — Exactly 8 immutable Freeze compatibility declarations. */
import { AssistantExecutiveActionPlanningCertification } from "./assistantExecutiveActionPlanningCertification.ts";
import type { AssistantExecutiveActionPlanningFreezeCompatibilityMetadata } from "./assistantExecutiveActionPlanningFreeze.types.ts";

const names = Object.freeze([
  "Foundation Compatible",
  "Registry Compatible",
  "Model Compatible",
  "Validation Compatible",
  "Manifest Compatible",
  "Platform Compatible",
  "Certification Compatible",
  "Public Index Compatible",
] as const);

export const AssistantExecutiveActionPlanningFreezeCompatibility:
readonly AssistantExecutiveActionPlanningFreezeCompatibilityMetadata[] =
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-7:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      sourceCertification:
        AssistantExecutiveActionPlanningCertification.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

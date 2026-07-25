/** ASSISTANT-7:6 — Exactly 12 immutable compatibility declarations. */
import { AssistantExecutiveActionPlanningManifest } from "./assistantExecutiveActionPlanningManifest.ts";
import type { AssistantExecutiveActionPlanningPlatformDeclaration } from "./assistantExecutiveActionPlanningPlatform.types.ts";

const names = Object.freeze([
  "Foundation Compatible",
  "Registry Compatible",
  "Model Compatible",
  "Validation Compatible",
  "Manifest Compatible",
  "Certification Compatible",
  "Freeze Compatible",
  "Public Index Compatible",
  "TypeScript Compatible",
  "ESLint Compatible",
  "Metadata Compatible",
  "Consumer Compatible",
] as const);

export const AssistantExecutiveActionPlanningPlatformCompatibility:
readonly AssistantExecutiveActionPlanningPlatformDeclaration[] =
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id:
        `ASSISTANT-7:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      sourceManifest: AssistantExecutiveActionPlanningManifest.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

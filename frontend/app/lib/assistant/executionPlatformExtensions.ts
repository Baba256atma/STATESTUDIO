/** ASSISTANT-8:6 — Exactly 12 immutable Platform extension declarations. */
import { ExecutiveActionExecutionManifest } from "./executiveActionExecutionManifest.ts";

const names = Object.freeze([
  "Execution Types",
  "Execution States",
  "Progress Types",
  "Exception Types",
  "Feedback Types",
  "Health Indicators",
  "Checkpoint Types",
  "Summary Types",
  "Policy Extensions",
  "Metadata Extensions",
  "Relationship Extensions",
  "Future Platform Extensions",
] as const);

export const ExecutionPlatformExtensions = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-8:6/Extension/${String(index + 1).padStart(2, "0")}`,
    name,
    description:
      `Declarative extension point metadata for ${name}.`,
    sourceManifest: ExecutiveActionExecutionManifest.identity.id,
    order: index + 1,
    executable: false,
    runtimeExtension: false,
    metadataOnly: true,
    immutable: true,
  })),
);

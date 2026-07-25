/** ASSISTANT-8:8 — Exactly 8 immutable frozen extension declarations. */
import { ExecutiveActionExecutionCertification } from "./executiveActionExecutionCertification.ts";

const names = Object.freeze([
  "Execution Extension",
  "Progress Extension",
  "State Extension",
  "Health Extension",
  "Feedback Extension",
  "Exception Extension",
  "Metadata Extension",
  "Future Compatibility Extension",
] as const);

export const ExecutionFreezeExtensions = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-8:8/Extension/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Frozen extension declaration metadata for ${name}.`,
    sourceCertification:
      ExecutiveActionExecutionCertification.identity.id,
    order: index + 1,
    executable: false,
    runtimeExtension: false,
    metadataOnly: true,
    immutable: true,
  })),
);

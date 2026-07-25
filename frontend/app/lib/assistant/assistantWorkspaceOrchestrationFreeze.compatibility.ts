/** ASSISTANT-5:8 — Exactly 8 immutable Freeze compatibility declarations. */
import { AssistantWorkspaceOrchestrationCertification } from "./assistantWorkspaceOrchestrationCertification.ts";
import type { AssistantWorkspaceOrchestrationFreezeCompatibilityMetadata } from "./assistantWorkspaceOrchestrationFreeze.types.ts";

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

export const AssistantWorkspaceOrchestrationFreezeCompatibility:
readonly AssistantWorkspaceOrchestrationFreezeCompatibilityMetadata[] =
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-5:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      sourceCertification:
        AssistantWorkspaceOrchestrationCertification.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

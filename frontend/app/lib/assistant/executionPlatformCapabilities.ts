/** ASSISTANT-8:6 — Immutable Platform capability declarations. */
import { ExecutiveActionExecutionManifest } from "./executiveActionExecutionManifest.ts";

const declarations = Object.freeze([
  [
    "Executive Action Execution",
    "Publish Executive Action execution capability metadata from the Manifest.",
  ],
  [
    "Execution Progress Tracking",
    "Publish execution progress tracking capability metadata from the Manifest.",
  ],
  [
    "Execution State Management",
    "Publish execution state management capability metadata from the Manifest.",
  ],
  [
    "Execution Health Visibility",
    "Publish execution health visibility capability metadata from the Manifest.",
  ],
  [
    "Execution Feedback Management",
    "Publish execution feedback management capability metadata from the Manifest.",
  ],
  [
    "Execution Exception Representation",
    "Publish execution exception representation capability metadata from the Manifest.",
  ],
  [
    "Execution Checkpoint Representation",
    "Publish execution checkpoint representation capability metadata from the Manifest.",
  ],
  [
    "Execution Summary Publication",
    "Publish execution summary publication capability metadata from the Manifest.",
  ],
  [
    "Execution Timeline Representation",
    "Publish execution timeline representation capability metadata from the Manifest.",
  ],
  [
    "Platform Metadata Publication",
    "Publish Platform metadata for Certification consumers.",
  ],
] as const);

export const ExecutionPlatformCapabilities = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-8:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    sourceManifest: ExecutiveActionExecutionManifest.identity.id,
    order: index + 1,
    implemented: false,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

/** ASSISTANT-7:6 — Exactly 12 immutable Platform capabilities. */
import { AssistantExecutiveActionPlanningManifest } from "./assistantExecutiveActionPlanningManifest.ts";
import type { AssistantExecutiveActionPlanningPlatformCapabilityMetadata } from "./assistantExecutiveActionPlanningPlatform.types.ts";

const declarations = Object.freeze([
  {
    name: "Foundation Composition",
    description: "Compose Foundation metadata published through the Manifest.",
    category: "Composition",
    architecturalResponsibility: "Foundation Composition",
  },
  {
    name: "Registry Composition",
    description: "Compose Registry vocabulary published through the Manifest.",
    category: "Composition",
    architecturalResponsibility: "Registry Composition",
  },
  {
    name: "Model Composition",
    description: "Compose domain model structures published through the Manifest.",
    category: "Composition",
    architecturalResponsibility: "Model Composition",
  },
  {
    name: "Validation Composition",
    description: "Compose Validation results published through the Manifest.",
    category: "Composition",
    architecturalResponsibility: "Validation Composition",
  },
  {
    name: "Manifest Publication",
    description: "Publish Manifest inventories as Platform source metadata.",
    category: "Publication",
    architecturalResponsibility: "Manifest Publication",
  },
  {
    name: "Metadata Publication",
    description: "Publish immutable Platform metadata for Certification.",
    category: "Publication",
    architecturalResponsibility: "Metadata Publication",
  },
  {
    name: "Consumer Integration",
    description: "Declare consumer-safe Platform metadata integration.",
    category: "Consumer",
    architecturalResponsibility: "Consumer Integration",
  },
  {
    name: "Compatibility Declaration",
    description: "Declare Platform compatibility metadata.",
    category: "Compatibility",
    architecturalResponsibility: "Compatibility Declaration",
  },
  {
    name: "Platform Identity",
    description: "Publish stable Platform canonical identity metadata.",
    category: "Identity",
    architecturalResponsibility: "Platform Identity",
  },
  {
    name: "Executive Action Planning Composition",
    description:
      "Compose the complete Executive Action Planning architecture.",
    category: "Composition",
    architecturalResponsibility: "Executive Action Planning Composition",
  },
  {
    name: "Readiness Publication",
    description: "Publish ReadyForCertification readiness metadata.",
    category: "Readiness",
    architecturalResponsibility: "Readiness Publication",
  },
  {
    name: "Public Platform Exposure",
    description: "Expose the immutable public Platform metadata surface.",
    category: "Publication",
    architecturalResponsibility: "Public Platform Exposure",
  },
] as const);

export const AssistantExecutiveActionPlanningPlatformCapabilities:
readonly AssistantExecutiveActionPlanningPlatformCapabilityMetadata[] =
  Object.freeze(
    declarations.map((declaration, index) => Object.freeze({
      id: `ASSISTANT-7:6/Capability/${String(index + 1).padStart(2, "0")}`,
      name: declaration.name,
      description: declaration.description,
      category: declaration.category,
      architecturalResponsibility: declaration.architecturalResponsibility,
      sourceManifest: AssistantExecutiveActionPlanningManifest.identity.id,
      version: "1.0.0",
      status: "Published",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

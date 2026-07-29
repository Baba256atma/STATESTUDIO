/**
 * EX-1:5 — Executive Stage Manifest Capabilities.
 *
 * Initial Stage capabilities. Describe architectural responsibilities only.
 *
 * Ownership: owned exclusively by EX-1:5.
 */

/** Capability declaration. */
export interface ExecutiveStageManifestCapability {
  readonly capabilityId: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly describesResponsibility: true;
  readonly implemented: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const capability = (
  name: string,
  description: string,
  order: number,
): ExecutiveStageManifestCapability =>
  Object.freeze({
    capabilityId: `EX-1:5/Capability/${String(order).padStart(2, "0")}`,
    name,
    description,
    order,
    describesResponsibility: true as const,
    implemented: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight Stage capabilities. */
export const ExecutiveStageManifestCapabilities = Object.freeze([
  capability(
    "Stage Composition",
    "Responsibility to compose the Executive Stage structure.",
    1,
  ),
  capability(
    "Layer Management",
    "Responsibility to manage canonical Stage layers.",
    2,
  ),
  capability(
    "Object Projection",
    "Responsibility to project Runtime objects onto the Stage.",
    3,
  ),
  capability(
    "Focus Projection",
    "Responsibility to project executive focus onto the Stage.",
    4,
  ),
  capability(
    "Relationship Projection",
    "Responsibility to project visual relationships onto the Stage.",
    5,
  ),
  capability(
    "Interaction Surface",
    "Responsibility to define Stage interaction surface boundaries.",
    6,
  ),
  capability(
    "Viewport Management",
    "Responsibility to manage the visible Stage viewport.",
    7,
  ),
  capability(
    "Overlay Management",
    "Responsibility to manage non-business Stage overlays.",
    8,
  ),
] as const);

export const ExecutiveStageManifestCapabilityNames = Object.freeze([
  "Stage Composition",
  "Layer Management",
  "Object Projection",
  "Focus Projection",
  "Relationship Projection",
  "Interaction Surface",
  "Viewport Management",
  "Overlay Management",
] as const);

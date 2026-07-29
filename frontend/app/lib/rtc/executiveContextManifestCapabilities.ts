/**
 * RTC-1:5 — Executive Context Manifest Capabilities.
 *
 * Initial Runtime capabilities. Describe responsibilities, not implementation.
 *
 * Ownership: owned exclusively by RTC-1:5.
 */

/** Capability declaration. */
export interface ExecutiveContextManifestCapability {
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
): ExecutiveContextManifestCapability =>
  Object.freeze({
    capabilityId: `RTC-1:5/Capability/${String(order).padStart(2, "0")}`,
    name,
    description,
    order,
    describesResponsibility: true as const,
    implemented: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight Runtime capabilities. */
export const ExecutiveContextManifestCapabilities = Object.freeze([
  capability(
    "Context Creation",
    "Responsibility to create Executive Context identities.",
    1,
  ),
  capability(
    "Context Identity",
    "Responsibility to preserve immutable context identity.",
    2,
  ),
  capability(
    "Context Registration",
    "Responsibility to register runtime identities.",
    3,
  ),
  capability(
    "Context Modeling",
    "Responsibility to define the Executive Context data model.",
    4,
  ),
  capability(
    "Context Validation",
    "Responsibility to declare validation policies for context consistency.",
    5,
  ),
  capability(
    "Snapshot Definition",
    "Responsibility to define reproducible context snapshots.",
    6,
  ),
  capability(
    "Lifecycle Definition",
    "Responsibility to define formal context lifecycle vocabulary.",
    7,
  ),
  capability(
    "Runtime Metadata",
    "Responsibility to publish structured runtime metadata.",
    8,
  ),
] as const);

export const ExecutiveContextManifestCapabilityNames = Object.freeze([
  "Context Creation",
  "Context Identity",
  "Context Registration",
  "Context Modeling",
  "Context Validation",
  "Snapshot Definition",
  "Lifecycle Definition",
  "Runtime Metadata",
] as const);

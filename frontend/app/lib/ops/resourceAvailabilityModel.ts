import type { ResourceAvailabilityDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:1", "OPS-5:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceAvailabilityModel = Object.freeze([
  Object.freeze({
    id: "resource-availability-operational",
    name: "Operational Availability",
    description: "Availability metadata describing actively available resources.",
    availabilityStates: Object.freeze(["Available", "Reserved", "Conditional"]),
    availabilityWindowMetadata: Object.freeze([
      "calendar-window",
      "reservation-policy",
      "availability-confidence",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-availability-contingent",
    name: "Contingent Availability",
    description: "Availability metadata describing resources with dependency-based access.",
    availabilityStates: Object.freeze(["Conditional", "Reserved", "Unavailable"]),
    availabilityWindowMetadata: Object.freeze([
      "approval-window",
      "dependency-gate",
      "substitution-eligibility",
    ]),
    metadata,
  }),
] as const satisfies readonly ResourceAvailabilityDescriptor[]);

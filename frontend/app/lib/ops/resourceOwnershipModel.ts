import type { ResourceOwnershipDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:1", "OPS-5:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceOwnershipModel = Object.freeze([
  Object.freeze({
    id: "resource-ownership-accountable",
    name: "Accountable Ownership",
    description: "Ownership metadata for accountable operational resource stewardship.",
    ownerTypes: Object.freeze(["Individual", "Team", "Department"]),
    accountabilityMetadata: Object.freeze([
      "owner-reference",
      "approval-authority",
      "escalation-contact",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-ownership-external",
    name: "External Ownership",
    description: "Ownership metadata for vendors, partners, and service providers.",
    ownerTypes: Object.freeze(["Vendor", "Partner", "Service Provider"]),
    accountabilityMetadata: Object.freeze([
      "contract-reference",
      "service-owner",
      "support-contact",
    ]),
    metadata,
  }),
] as const satisfies readonly ResourceOwnershipDescriptor[]);

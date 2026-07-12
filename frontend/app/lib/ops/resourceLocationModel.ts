import type { ResourceLocationDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:1", "OPS-5:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceLocationModel = Object.freeze([
  Object.freeze({
    id: "resource-location-physical",
    name: "Physical Location Metadata",
    description: "Location metadata for facilities, workspaces, equipment, and inventory.",
    locationTypes: Object.freeze(["Facility", "Workspace", "Warehouse", "Field Site"]),
    accessMetadata: Object.freeze([
      "access-window",
      "security-zone",
      "onsite-requirement",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-location-digital",
    name: "Digital Location Metadata",
    description: "Location metadata for cloud, software, database, and API resources.",
    locationTypes: Object.freeze(["Cloud Region", "Environment", "Tenant", "Endpoint"]),
    accessMetadata: Object.freeze([
      "network-boundary",
      "credential-scope",
      "service-region",
    ]),
    metadata,
  }),
] as const satisfies readonly ResourceLocationDescriptor[]);

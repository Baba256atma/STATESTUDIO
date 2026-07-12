import { ResourceIntelligencePlatformId } from "./resourceIntelligenceIndex.ts";
import { ResourcePlatformMetadata, ResourceSupportedDomains } from "./resourceMetadataIndex.ts";
import type { ResourceModelIdentity } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: ResourcePlatformMetadata.platformId,
  platformVersion: ResourcePlatformMetadata.platformVersion,
  compatibilityVersion: ResourcePlatformMetadata.compatibilityVersion,
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:9",
    "OPS-5:1",
    "OPS-5:2",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceIdentityModel = Object.freeze({
  resourceIdPattern: "ops-resource-{category}-{descriptor}",
  displayName: "Executive Resource Intelligence Model",
  description:
    "Canonical metadata-only resource identity and classification model for executive operations.",
  supportedCategories: Object.freeze(
    ResourceSupportedDomains.map((domain) => domain.name),
  ),
  sourcePlatform: ResourceIntelligencePlatformId,
  resourceClassification: Object.freeze([
    "Human Resource",
    "Team Resource",
    "AI Agent Resource",
    "Software Resource",
    "Hardware Resource",
    "Financial Resource",
    "Facility Resource",
    "Vendor Resource",
  ]),
  metadata,
} as const satisfies ResourceModelIdentity & {
  readonly resourceClassification: readonly string[];
});

import { ExecutiveRequestIntentCertificationCompatibility } from "./executiveRequestIntentCertificationCompatibility.ts";
import { ExecutiveRequestIntentCertificationManifest } from "./executiveRequestIntentCertificationManifest.ts";
import { ExecutiveRequestIntentCertificationRegistry } from "./executiveRequestIntentCertificationRegistry.ts";
import type { ExecutiveRequestIntentCertification } from "./executiveRequestIntentCertificationTypes.ts";

export const ExecutiveRequestIntentPlatformCertification = Object.freeze({
  registry: ExecutiveRequestIntentCertificationRegistry,
  compatibility: ExecutiveRequestIntentCertificationCompatibility,
  manifest: ExecutiveRequestIntentCertificationManifest,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveRequestIntentCertification);

export const getExecutiveRequestIntentPlatformCertification = () => ExecutiveRequestIntentPlatformCertification;

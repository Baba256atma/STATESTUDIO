/**
 * NEX-2:8 — Eight immutable extension policy declarations.
 */

import { ProductRoadmapCertification } from "./productRoadmapCertification.ts";

export const ProductRoadmapFreezeExtensionPolicy = Object.freeze([
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/PreserveMetadata", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[0], rule: "Frozen metadata shall not be modified.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/ExtendVersions", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[1], rule: "Future versions shall extend frozen artifacts.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/StableContracts", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[2], rule: "Public contracts remain stable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/BackwardCompatibility", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[3], rule: "Backward compatibility shall be preserved.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/ImmutableIdentity", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[4], rule: "Canonical identity remains immutable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/StableApiRegistry", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[5], rule: "Public API Registry remains stable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/MetadataIntegrity", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[6], rule: "Metadata integrity shall be preserved.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/ExtensionPolicy/NonExecutable", subject: ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects[7], rule: "Freeze is non-executable.", metadataOnly: true, immutable: true }),
] as const);

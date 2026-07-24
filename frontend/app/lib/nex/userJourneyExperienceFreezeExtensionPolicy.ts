/**
 * NEX-4:8 — Exactly eight immutable extension policy declarations.
 */

import { UserJourneyExperienceCertification } from "./userJourneyExperienceCertification.ts";

const Subjects = UserJourneyExperienceCertification.freezeSeedMetadata.extensionPolicySubjects;

export const UserJourneyExperienceFreezeExtensionPolicy = Object.freeze([
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/PreserveMetadata", subject: Subjects[0], rule: "Frozen metadata shall not be modified.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/ExtendVersions", subject: Subjects[1], rule: "Future versions shall extend frozen artifacts.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/StableContracts", subject: Subjects[2], rule: "Public contracts remain stable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/BackwardCompatibility", subject: Subjects[3], rule: "Backward compatibility shall be preserved.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/ImmutableIdentity", subject: Subjects[4], rule: "Canonical identity remains immutable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/StableApiRegistry", subject: Subjects[5], rule: "Public API Registry remains stable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/MetadataIntegrity", subject: Subjects[6], rule: "Metadata integrity shall be preserved.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/ExtensionPolicy/NonExecutable", subject: Subjects[7], rule: "Freeze remains non-executable.", metadataOnly: true, immutable: true }),
] as const);

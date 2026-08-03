/** EX-3:6 Platform capability and consumer bindings. */

import { ExecutiveTimelineExperienceManifest } from "./executiveTimelineExperienceManifest.ts";
import type {
  ExecutiveTimelineExperiencePlatformCapabilityBinding,
  ExecutiveTimelineExperiencePlatformConsumerBinding,
} from "./executiveTimelineExperiencePlatformTypes.ts";

export const ExecutiveTimelineExperiencePlatformCapabilityBindings =
  Object.freeze(
    ExecutiveTimelineExperienceManifest.capabilities.map((capability, index) =>
      Object.freeze({
        bindingId: `EX-3:6/Binding/${capability.name}`,
        order: index + 1,
        manifestCapabilityId: capability.capabilityId,
        manifestCapabilityName: capability.name,
        bindingKind: "CapabilityBinding",
        exactManifestReferenceRequired: true,
        descriptiveOnly: true,
        executable: false,
        metadataOnly: true,
        immutable: true,
      } satisfies ExecutiveTimelineExperiencePlatformCapabilityBinding)
    ),
  );

export const ExecutiveTimelineExperiencePlatformCapabilityBindingCount =
  16 as const;

export const ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding =
  Object.freeze({
    consumerBindingId: "EX-3:6/ConsumerBinding",
    supportedConsumers: Object.freeze([
      "EX-3:6/AuthorizedMetadataConsumer",
      "EX-3:7/CertificationMetadataConsumer",
    ] as const),
    unsupportedConsumers: Object.freeze([
      "RuntimePlaybackConsumer",
      "RtcIntegrationConsumer",
      "UiRenderingConsumer",
      "ProviderExecutionConsumer",
      "PersistenceConsumer",
    ] as const),
    requiredReadiness: "ReadyForCertification",
    prohibitedImports: Object.freeze([
      "executiveTimelineExperienceValidation.ts",
      "executiveTimelineExperienceModel.ts",
      "executiveTimelineExperienceRegistry.ts",
      "executiveTimelineExperienceFoundation.ts",
      "rtc",
      "scene",
      "react",
      "next",
    ] as const),
    publicReleaseState: "NotReleased",
    metadataOnly: true,
    immutable: true,
  } as const satisfies ExecutiveTimelineExperiencePlatformConsumerBinding);

export const ExecutiveTimelineExperiencePlatformCapabilitySummary =
  Object.freeze({
    capabilityBindingCount:
      ExecutiveTimelineExperiencePlatformCapabilityBindingCount,
    bindings: ExecutiveTimelineExperiencePlatformCapabilityBindings,
    manifestCapabilityCount:
      ExecutiveTimelineExperienceManifest.capabilityCount,
    exactManifestMapping: true as const,
    derivedCapabilities: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

import { DirectorCertification } from "./directorCertification.ts";
import type { DirectorFreezeCompatibilityEntry } from "./directorFreezeTypes.ts";

const certifiedReferences = Object.freeze(Object.fromEntries(
  DirectorCertification.compatibility.map((entry) => [entry.name, entry.platformReference]),
));

const compatibility = (
  name: string,
  certificationReference: string,
  deterministicOrder: number,
): DirectorFreezeCompatibilityEntry => Object.freeze({
  id: `DIRECTOR-1:8/Compatibility/${name}`,
  name,
  certificationReference,
  compatible: true,
  deterministicOrder,
  derivedFromCertification: true,
  metadataOnly: true,
  immutable: true,
});

const certificationId = DirectorCertification.metadata.certificationId;

export const DirectorFreezeCompatibility = Object.freeze([
  compatibility("CertificationCompatibility", certificationId, 1),
  compatibility("PlatformCompatibility", certifiedReferences.PlatformCompatibility ?? certificationId, 2),
  compatibility("ManifestCompatibility", certifiedReferences.ManifestCompatibility ?? certificationId, 3),
  compatibility("ValidationCompatibility", certifiedReferences.ValidationCompatibility ?? certificationId, 4),
  compatibility("RegistryCompatibility", certifiedReferences.RegistryCompatibility ?? certificationId, 5),
  compatibility("FoundationCompatibility", certifiedReferences.FoundationCompatibility ?? certificationId, 6),
  compatibility("PublicIndexCompatibility", certificationId, 7),
  compatibility("ForwardCompatibility", certifiedReferences.ForwardCompatibility ?? certificationId, 8),
]);


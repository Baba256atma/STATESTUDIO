import { DirectorValidationRegistry } from "./directorValidation.ts";
import type { DirectorManifestCompatibilityEntry } from "./directorManifestTypes.ts";

const model = DirectorValidationRegistry.validatedModel;
const registry = model.registry;
const foundation = registry.foundation;

const compatibility = (
  name: string,
  version: string,
  canonicalReference: string,
  deterministicOrder: number,
): DirectorManifestCompatibilityEntry => Object.freeze({
  id: `DIRECTOR-1:5/Compatibility/${name}`,
  name,
  version,
  compatible: true,
  canonicalReference,
  deterministicOrder,
  metadataOnly: true,
  immutable: true,
});

export const DirectorManifestCompatibility = Object.freeze([
  compatibility("PlatformVersion", model.identity.version, model.identity.id, 1),
  compatibility("ManifestVersion", "1.0.0", "DIRECTOR-1:5/DirectorManifest", 2),
  compatibility("ValidationCompatibility", "1.0.0", DirectorValidationRegistry.registryId, 3),
  compatibility("RegistryCompatibility", registry.identity.version, registry.identity.id, 4),
  compatibility("FoundationCompatibility", foundation.identity.version, foundation.identity.id, 5),
  compatibility("FuturePlatformReadiness", "1.0.0", "DIRECTOR-1:6/DirectorPlatform", 6),
]);


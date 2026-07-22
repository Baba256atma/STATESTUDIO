import { DirectorValidationRegistry } from "./directorValidation.ts";
import type { DirectorManifestReadinessEntry } from "./directorManifestTypes.ts";

const model = DirectorValidationRegistry.validatedModel;

const readiness = (
  name: string,
  evidenceReference: string,
  deterministicOrder: number,
): DirectorManifestReadinessEntry => Object.freeze({
  id: `DIRECTOR-1:5/Readiness/${name}`,
  name,
  ready: true,
  evidenceReference,
  deterministicOrder,
  metadataOnly: true,
  immutable: true,
});

export const DirectorManifestReadiness = Object.freeze([
  readiness("ReadyForPlatform", DirectorValidationRegistry.readiness, 1),
  readiness("ValidationComplete", DirectorValidationRegistry.registryId, 2),
  readiness("RegistryComplete", model.registry.identity.id, 3),
  readiness("FoundationComplete", model.registry.foundation.identity.id, 4),
  readiness("ModelComplete", model.identity.id, 5),
]);


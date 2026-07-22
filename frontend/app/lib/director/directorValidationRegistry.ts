import { DirectorModel } from "./directorModel.ts";
import { DirectorValidationCategories } from "./directorValidationCategories.ts";
import { DirectorValidationPolicies } from "./directorValidationPolicies.ts";
import { DirectorValidationRules } from "./directorValidationRules.ts";

export const DirectorValidationRegistry = Object.freeze({
  registryId: "DIRECTOR-1:4/ValidationRegistry",
  modelReference: DirectorModel.identity.id,
  validatedModel: DirectorModel,
  categories: DirectorValidationCategories,
  rules: DirectorValidationRules,
  policies: DirectorValidationPolicies,
  readiness: "ReadyForManifest",
  dependency: Object.freeze({
    modelOnly: true,
    directPreviousPhaseModule: "directorModel.ts",
    importsFutureDirectorPhases: false,
    importsEve: false,
    importsExecutiveEngineInternals: false,
    importsUi: false,
    importsRenderingSystems: false,
  }),
  runtimeValidator: false,
  execution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

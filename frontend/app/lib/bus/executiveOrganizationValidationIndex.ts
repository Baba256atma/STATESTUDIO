export * from "./executiveOrganizationValidation.ts";
export type * from "./executiveOrganizationValidationTypes.ts";

import * as validation from "./executiveOrganizationValidation.ts";

export const ExecutiveOrganizationValidationPublicFoundation = Object.freeze({
  validation: Object.freeze({ ...validation }),
  metadataOnly: true,
  immutable: true,
});

export * from "./executiveResourceValidation.ts";
export type * from "./executiveResourceValidationTypes.ts";

import * as validation from "./executiveResourceValidation.ts";

export const ExecutiveResourceValidationPublicFoundation = Object.freeze({
  validation: Object.freeze({ ...validation }),
  metadataOnly: true,
  immutable: true,
});

export * from "./executiveOrganizationModel.ts";
export type * from "./executiveOrganizationModelTypes.ts";

import * as model from "./executiveOrganizationModel.ts";

export const ExecutiveOrganizationModelPublicFoundation = Object.freeze({
  model: Object.freeze({ ...model }),
  metadataOnly: true,
  immutable: true,
});

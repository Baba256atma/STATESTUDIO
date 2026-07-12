export * from "./executiveResourceModel.ts";
export type * from "./executiveResourceModelTypes.ts";

import * as model from "./executiveResourceModel.ts";

export const ExecutiveResourceModelPublicFoundation = Object.freeze({
  model: Object.freeze({ ...model }),
  metadataOnly: true,
  immutable: true,
});

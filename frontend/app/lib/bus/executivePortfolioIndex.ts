export * from "./executivePortfolioContracts.ts";
export * from "./executivePortfolioRegistry.ts";
export * from "./executivePortfolioModel.ts";
export * from "./executivePortfolioValidation.ts";
export * from "./executivePortfolioPlatform.ts";
export * from "./executivePortfolioCertification.ts";
export * from "./executivePortfolioFreeze.ts";
export {
  buildExecutivePortfolioManifest,
  getExecutivePortfolioManifestSummary,
  isExecutivePortfolioManifestValid,
} from "./executivePortfolioManifest.ts";
export type {
  ExecutivePortfolioManifestSummary,
} from "./executivePortfolioManifest.ts";

import * as contracts from "./executivePortfolioContracts.ts";
import * as registry from "./executivePortfolioRegistry.ts";
import * as model from "./executivePortfolioModel.ts";
import * as validation from "./executivePortfolioValidation.ts";
import * as manifest from "./executivePortfolioManifest.ts";
import * as platform from "./executivePortfolioPlatform.ts";
import * as certification from "./executivePortfolioCertification.ts";
import * as freeze from "./executivePortfolioFreeze.ts";

export const ExecutivePortfolioPlatformFoundation = Object.freeze({
  contracts: Object.freeze(contracts),
  registry: Object.freeze(registry),
  model: Object.freeze(model),
  validation: Object.freeze(validation),
  manifest: Object.freeze(manifest),
  platform: Object.freeze(platform),
  certification: Object.freeze(certification),
  freeze: Object.freeze(freeze),
  metadataOnly: true,
  immutable: true,
});

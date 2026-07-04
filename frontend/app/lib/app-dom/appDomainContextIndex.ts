export type {
  AppDomainContext,
  AppDomainContextManifest,
  AppDomainContextResult,
  AppDomainContextSelection,
  AppDomainContextSnapshot,
  AppDomainContextValidation,
  AppDomainSelectionCriteria,
  AppDomainSelectionMode,
  AppDomainSelectionScope,
} from "./appDomainContextTypes.ts";
export {
  clearDomainSelection,
  createDomainContext,
  getActiveDomainContext,
  listSelectedDomains,
  selectDomainContext,
  selectDomains,
  validateDomainContext,
} from "./appDomainContextSelection.ts";
export {
  buildAppDomainContextManifest,
  validateAppDomainContextManifest,
} from "./appDomainContextManifest.ts";

import {
  clearDomainSelection,
  createDomainContext,
  getActiveDomainContext,
  listSelectedDomains,
  selectDomainContext,
  selectDomains,
  validateDomainContext,
} from "./appDomainContextSelection.ts";
import {
  buildAppDomainContextManifest,
  validateAppDomainContextManifest,
} from "./appDomainContextManifest.ts";

export const AppDomainContextLayer = Object.freeze({
  createDomainContext,
  selectDomainContext,
  selectDomains,
  getActiveDomainContext,
  listSelectedDomains,
  clearDomainSelection,
  validateDomainContext,
  buildAppDomainContextManifest,
  validateAppDomainContextManifest,
});

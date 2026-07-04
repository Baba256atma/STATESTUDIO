export type {
  ExecutiveKpiReport,
  ExecutiveKpiReportAudience,
  ExecutiveKpiReportSection,
  ExecutiveKpiReportType,
  ExecutiveKpiReportingCadence,
  ExecutiveKpiReportingFormat,
  ExecutiveKpiReportingLifecycleState,
  ExecutiveKpiReportingManifest,
  ExecutiveKpiReportingMetadata,
  ExecutiveKpiReportingPlatform as ExecutiveKpiReportingPlatformContract,
  ExecutiveKpiReportingRegistry,
  ExecutiveKpiReportingValidation,
} from "./executiveKpiReportingTypes.ts";

export { getExecutiveKpiReportingManifest } from "./executiveKpiReportingManifest.ts";
export {
  EXECUTIVE_KPI_REPORTING_CADENCES,
  EXECUTIVE_KPI_REPORTING_FORMATS,
  EXECUTIVE_KPI_REPORTING_LIFECYCLE_STATES,
  EXECUTIVE_KPI_REPORTING_PUBLIC_APIS,
  EXECUTIVE_KPI_REPORTING_REGISTRY,
  EXECUTIVE_KPI_REPORTS,
  EXECUTIVE_KPI_REPORT_AUDIENCES,
  EXECUTIVE_KPI_REPORT_SECTIONS,
  EXECUTIVE_KPI_REPORT_TYPES,
  listExecutiveKpiReportAudiences,
  listExecutiveKpiReportSections,
  listExecutiveKpiReportTypes,
  listExecutiveKpiReportingCadences,
  listExecutiveKpiReportingFormats,
  listExecutiveKpiReportingLifecycleStates,
  listExecutiveKpiReports,
} from "./executiveKpiReportingRegistry.ts";
export { validateExecutiveKpiReporting } from "./executiveKpiReportingValidation.ts";

import { getExecutiveKpiReportingManifest } from "./executiveKpiReportingManifest.ts";
import {
  EXECUTIVE_KPI_REPORTING_REGISTRY,
  listExecutiveKpiReportAudiences,
  listExecutiveKpiReportSections,
  listExecutiveKpiReportTypes,
  listExecutiveKpiReportingCadences,
  listExecutiveKpiReportingFormats,
  listExecutiveKpiReportingLifecycleStates,
  listExecutiveKpiReports,
} from "./executiveKpiReportingRegistry.ts";
import { validateExecutiveKpiReporting } from "./executiveKpiReportingValidation.ts";
import type { ExecutiveKpiReportingPlatform as ExecutiveKpiReportingPlatformType } from "./executiveKpiReportingTypes.ts";

export function getExecutiveKpiReportingPlatform(): ExecutiveKpiReportingPlatformType {
  const manifest = getExecutiveKpiReportingManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_REPORTING_REGISTRY,
    manifest,
    validation: validateExecutiveKpiReporting(EXECUTIVE_KPI_REPORTING_REGISTRY, manifest),
  });
}

export const ExecutiveKpiReportingPlatform = Object.freeze({
  getExecutiveKpiReportingPlatform,
  getExecutiveKpiReportingManifest,
  validateExecutiveKpiReporting,
  listExecutiveKpiReports,
  listExecutiveKpiReportTypes,
  listExecutiveKpiReportSections,
  listExecutiveKpiReportAudiences,
  listExecutiveKpiReportingCadences,
  listExecutiveKpiReportingFormats,
  listExecutiveKpiReportingLifecycleStates,
});

import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import {
  EXECUTIVE_KPI_REPORTING_REGISTRY,
  ExecutiveKpiReportingPlatform,
  getExecutiveKpiReportingManifest,
  getExecutiveKpiReportingPlatform,
  listExecutiveKpiReportAudiences,
  listExecutiveKpiReportSections,
  listExecutiveKpiReportTypes,
  listExecutiveKpiReportingCadences,
  listExecutiveKpiReportingFormats,
  listExecutiveKpiReportingLifecycleStates,
  listExecutiveKpiReports,
  validateExecutiveKpiReporting,
} from "./executiveKpiReportingPlatform.ts";
import type { ExecutiveKpiReportType, ExecutiveKpiReportingRegistry } from "./executiveKpiReportingTypes.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

test("consumes BUS-1 through BUS-9 public APIs", () => {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const strategicAlignments = getExecutiveKpiStrategicAlignmentPlatform();
  const businessImpacts = getExecutiveKpiBusinessImpactPlatform();
  const manifest = getExecutiveKpiReportingManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(definitions.validation.valid, true);
  assert.equal(sourceMappings.validation.valid, true);
  assert.equal(targets.validation.valid, true);
  assert.equal(governance.validation.valid, true);
  assert.equal(scorecards.validation.valid, true);
  assert.equal(insights.validation.valid, true);
  assert.equal(strategicAlignments.validation.valid, true);
  assert.equal(businessImpacts.validation.valid, true);
  assert.equal(manifest.businessImpactsAvailable, true);
});

test("publishes reporting registry integrity", () => {
  const registry = EXECUTIVE_KPI_REPORTING_REGISTRY;

  assert.equal(registry.platformId, "BUS-10");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.sourceMappingPlatformId, "BUS-3");
  assert.equal(registry.targetPlatformId, "BUS-4");
  assert.equal(registry.governancePlatformId, "BUS-5");
  assert.equal(registry.scorecardPlatformId, "BUS-6");
  assert.equal(registry.insightPlatformId, "BUS-7");
  assert.equal(registry.strategicAlignmentPlatformId, "BUS-8");
  assert.equal(registry.businessImpactPlatformId, "BUS-9");
  assert.equal(registry.reports.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes report type registry", () => {
  assert.equal(listExecutiveKpiReportTypes().length, 10);
  assert.equal(listExecutiveKpiReportTypes().includes("Executive Summary"), true);
});

test("publishes section registry", () => {
  assert.equal(listExecutiveKpiReportSections().length, 10);
  assert.equal(listExecutiveKpiReportSections().includes("Business Impact"), true);
});

test("publishes audience registry", () => {
  assert.equal(listExecutiveKpiReportAudiences().length, 9);
  assert.equal(listExecutiveKpiReportAudiences().includes("Board"), true);
});

test("publishes cadence registry", () => {
  assert.deepEqual(listExecutiveKpiReportingCadences(), ["Daily", "Weekly", "Monthly", "Quarterly", "Annual", "On Demand", "Event Based"]);
});

test("publishes format registry", () => {
  assert.equal(listExecutiveKpiReportingFormats().includes("PDF"), true);
  assert.equal(listExecutiveKpiReportingFormats().includes("Narrative Brief"), true);
});

test("publishes lifecycle registry", () => {
  assert.deepEqual(listExecutiveKpiReportingLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiReportingManifest();
  const second = getExecutiveKpiReportingManifest();

  assert.equal(first.platformId, "BUS-10");
  assert.equal(first.reportCount, 2);
  assert.equal(first.certificationStatus, "Reporting Metadata Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiReporting();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate report ids", () => {
  const duplicateRegistry: ExecutiveKpiReportingRegistry = Object.freeze({
    ...EXECUTIVE_KPI_REPORTING_REGISTRY,
    reports: Object.freeze([
      EXECUTIVE_KPI_REPORTING_REGISTRY.reports[0],
      EXECUTIVE_KPI_REPORTING_REGISTRY.reports[0],
    ]),
  });
  const validation = validateExecutiveKpiReporting(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-report-id:executive-financial-health-summary-report"), true);
});

test("detects invalid KPI, scorecard, and governance references", () => {
  const invalidRegistry: ExecutiveKpiReportingRegistry = Object.freeze({
    ...EXECUTIVE_KPI_REPORTING_REGISTRY,
    reports: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_REPORTING_REGISTRY.reports[0],
        relatedKpiIds: Object.freeze(["missing-kpi"] as const),
        relatedScorecardIds: Object.freeze(["missing-scorecard"] as const),
        governanceReferenceId: "missing-governance",
      }),
    ]),
  });
  const validation = validateExecutiveKpiReporting(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:executive-financial-health-summary-report:missing-kpi"), true);
  assert.equal(validation.errors.includes("invalid-scorecard-reference:executive-financial-health-summary-report:missing-scorecard"), true);
  assert.equal(validation.errors.includes("invalid-governance-reference:executive-financial-health-summary-report"), true);
});

test("detects invalid report type", () => {
  const invalidRegistry: ExecutiveKpiReportingRegistry = Object.freeze({
    ...EXECUTIVE_KPI_REPORTING_REGISTRY,
    reports: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_REPORTING_REGISTRY.reports[0],
        reportType: "Invalid" as ExecutiveKpiReportType,
      }),
    ]),
  });
  const validation = validateExecutiveKpiReporting(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-report-type:executive-financial-health-summary-report"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiReportingPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiReportingPlatform.getExecutiveKpiReportingPlatform, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.getExecutiveKpiReportingManifest, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.validateExecutiveKpiReporting, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.listExecutiveKpiReports, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.listExecutiveKpiReportTypes, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.listExecutiveKpiReportSections, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.listExecutiveKpiReportAudiences, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.listExecutiveKpiReportingCadences, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.listExecutiveKpiReportingFormats, "function");
  assert.equal(typeof ExecutiveKpiReportingPlatform.listExecutiveKpiReportingLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiReportingPlatform), true);
});

test("publishes immutable reporting contracts", () => {
  const reports = listExecutiveKpiReports();

  assert.equal(reports.every((report) => report.metadataOnly && report.immutable), true);
  assert.equal(Object.isFrozen(reports), true);
});

test("contains no runtime behavior metadata", () => {
  const registry = EXECUTIVE_KPI_REPORTING_REGISTRY;

  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("render")), false);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("generate")), false);
});

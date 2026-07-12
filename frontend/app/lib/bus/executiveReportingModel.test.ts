import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportingCanonicalModel,
  ExecutiveReportingModelDescription,
  ExecutiveReportingModelFoundation,
  ExecutiveReportingModelId,
  ExecutiveReportingModelMetadata,
  ExecutiveReportingModelName,
  ExecutiveReportingModelVersion,
  buildExecutiveReportingModel,
  getExecutiveReportingModelAudiences,
  getExecutiveReportingModelCategories,
  getExecutiveReportingModelDefinitions,
  getExecutiveReportingModelProfiles,
  getExecutiveReportingModelSummary,
  getExecutiveReportingModelTemplates,
} from "./executiveReportingModelIndex.ts";

test("canonical model builds from registry metadata", () => {
  const built = buildExecutiveReportingModel();
  assert.equal(ExecutiveReportingModelId, "BUS-33:3");
  assert.equal(ExecutiveReportingModelVersion, "1.0.0");
  assert.equal(
    ExecutiveReportingModelName,
    "Executive Reporting Intelligence Model",
  );
  assert.equal(
    ExecutiveReportingModelDescription,
    "Canonical metadata-only model layer for executive reporting intelligence.",
  );
  assert.equal(built.profile.id, "executive-reporting-profile-canonical");
  assert.equal(Object.isFrozen(built), true);
});

test("every template references valid sections and every definition references a valid template", () => {
  const sectionIds = new Set(
    ExecutiveReportingCanonicalModel.sections.map((section) => section.id),
  );
  const templateIds = new Set(
    ExecutiveReportingCanonicalModel.templates.map((template) => template.id),
  );

  for (const template of ExecutiveReportingCanonicalModel.templates) {
    for (const section of template.sections) {
      assert.equal(sectionIds.has(section.id), true);
    }
  }

  for (const definition of ExecutiveReportingCanonicalModel.definitions) {
    assert.equal(templateIds.has(definition.template.id), true);
  }
});

test("every profile references valid reports and templates", () => {
  const reportIds = new Set<string>(
    ExecutiveReportingCanonicalModel.definitions.map((definition) => definition.id),
  );
  const templateIds = new Set<string>(
    ExecutiveReportingCanonicalModel.templates.map((template) => template.id),
  );

  for (const profile of getExecutiveReportingModelProfiles()) {
    for (const report of profile.reports) {
      assert.equal(reportIds.has(report.id), true);
    }
    for (const template of profile.templates) {
      assert.equal(templateIds.has(template.id), true);
    }
  }
});

test("audience-to-template and category-to-report mappings are valid", () => {
  const financeAudience = ExecutiveReportingCanonicalModel.relationships.audienceToTemplate.find(
    (relationship) => relationship.audience === "Finance",
  );
  const financeCategory = ExecutiveReportingCanonicalModel.relationships.categoryToReport.find(
    (relationship) => relationship.category === "Finance",
  );

  assert.equal(financeAudience?.templateIds.length, 1);
  assert.equal(financeAudience?.templateIds[0], "executive-report-template-finance-monthly-pack");
  assert.equal(financeCategory?.reportIds.length, 2);
});

test("model metadata is immutable and helper APIs are deterministic", () => {
  assert.equal(ExecutiveReportingModelMetadata.registryMetadata.registryId, "BUS-33:2");
  assert.equal(Object.isFrozen(ExecutiveReportingModelMetadata), true);
  assert.equal(getExecutiveReportingModelCategories(), ExecutiveReportingCanonicalModel.categories);
  assert.equal(getExecutiveReportingModelAudiences(), ExecutiveReportingCanonicalModel.audiences);
  assert.equal(getExecutiveReportingModelTemplates(), ExecutiveReportingCanonicalModel.templates);
  assert.equal(
    getExecutiveReportingModelDefinitions(),
    ExecutiveReportingCanonicalModel.definitions,
  );
  assert.equal(getExecutiveReportingModelProfiles(), ExecutiveReportingCanonicalModel.profiles);
  assert.equal(ExecutiveReportingModelFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveReportingModelFoundation), true);
});

test("public exports are correct and no runtime behavior exists", () => {
  const summary = getExecutiveReportingModelSummary();
  assert.equal(summary.profileId, "executive-reporting-profile-canonical");
  assert.equal(summary.templateCount, 4);
  assert.equal(summary.definitionCount, 4);
  assert.equal(summary.relationshipCount, 28);
});

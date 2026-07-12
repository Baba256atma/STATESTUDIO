import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportAudienceRegistry,
  ExecutiveReportCategoryRegistry,
  ExecutiveReportDefinitionRegistry,
  ExecutiveReportFormatRegistry,
  ExecutiveReportPriorityRegistry,
  ExecutiveReportSectionRegistry,
  ExecutiveReportStatusRegistry,
  ExecutiveReportTemplateRegistry,
  ExecutiveReportingProfileRegistry,
  ExecutiveReportingRegistryFoundation,
  ExecutiveReportingRegistryMetadata,
  getExecutiveReportAudiences,
  getExecutiveReportCategories,
  getExecutiveReportDefinitions,
  getExecutiveReportDefinitionsByCategory,
  getExecutiveReportFormats,
  getExecutiveReportPriorities,
  getExecutiveReportSections,
  getExecutiveReportStatuses,
  getExecutiveReportTemplates,
  getExecutiveReportTemplatesByAudience,
  getExecutiveReportingProfiles,
} from "./executiveReportingRegistryIndex.ts";

test("all registries build successfully and remain immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveReportCategoryRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportAudienceRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportPriorityRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportStatusRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportFormatRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportSectionRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportTemplateRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportDefinitionRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveReportingProfileRegistry), true);
});

test("registries preserve deterministic ordering", () => {
  assert.equal(ExecutiveReportCategoryRegistry[0], "Executive Summary");
  assert.equal(ExecutiveReportCategoryRegistry[14], "Governance");
  assert.equal(ExecutiveReportAudienceRegistry[0], "CEO");
  assert.equal(ExecutiveReportFormatRegistry[0], "Dashboard");
});

test("every template references valid sections and audience mappings stay valid", () => {
  const sectionIds = new Set(ExecutiveReportSectionRegistry.map((section) => section.id));
  for (const template of ExecutiveReportTemplateRegistry) {
    for (const section of template.sections) {
      assert.equal(sectionIds.has(section.id), true);
    }
  }

  const financeTemplates = getExecutiveReportTemplatesByAudience("Finance");
  assert.equal(financeTemplates.length, 1);
  assert.equal(financeTemplates[0].name, "Finance Monthly Pack");
});

test("every report definition references a valid category", () => {
  const categories = new Set(ExecutiveReportCategoryRegistry);
  for (const definition of ExecutiveReportDefinitionRegistry) {
    for (const section of definition.template.sections) {
      assert.equal(categories.has(section.category), true);
    }
  }

  const financeDefinitions = getExecutiveReportDefinitionsByCategory("Finance");
  assert.equal(financeDefinitions.length, 2);
});

test("helper APIs return readonly metadata and public exports remain narrow", () => {
  assert.equal(getExecutiveReportCategories(), ExecutiveReportCategoryRegistry);
  assert.equal(getExecutiveReportAudiences(), ExecutiveReportAudienceRegistry);
  assert.equal(getExecutiveReportPriorities(), ExecutiveReportPriorityRegistry);
  assert.equal(getExecutiveReportStatuses(), ExecutiveReportStatusRegistry);
  assert.equal(getExecutiveReportFormats(), ExecutiveReportFormatRegistry);
  assert.equal(getExecutiveReportSections(), ExecutiveReportSectionRegistry);
  assert.equal(getExecutiveReportTemplates(), ExecutiveReportTemplateRegistry);
  assert.equal(getExecutiveReportDefinitions(), ExecutiveReportDefinitionRegistry);
  assert.equal(getExecutiveReportingProfiles(), ExecutiveReportingProfileRegistry);
  assert.equal(ExecutiveReportingRegistryFoundation.metadataOnly, true);
  assert.equal(ExecutiveReportingRegistryMetadata.metadataOnly, true);
});

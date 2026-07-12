import {
  ExecutiveReportingContractDescription,
  ExecutiveReportingContractId,
  ExecutiveReportingContractName,
  ExecutiveReportingContractVersion,
  type ExecutiveReportAudience,
  type ExecutiveReportCategory,
  type ExecutiveReportDefinition,
  type ExecutiveReportTemplate,
  type ExecutiveReportingContract,
  type ExecutiveReportingProfile,
  type ExecutiveReportingSummary,
} from "./executiveReportingIndex.ts";
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
  ExecutiveReportingRegistryMetadata,
  getExecutiveReportDefinitionsByCategory,
  getExecutiveReportTemplatesByAudience,
} from "./executiveReportingRegistryIndex.ts";

const createMetadata = (tag: string) =>
  Object.freeze({
    contractVersion: ExecutiveReportingContractVersion,
    tags: Object.freeze(["executive-reporting", tag]),
    labels: Object.freeze(["bus-33", "model"]),
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveReportingModelId = "BUS-33:3" as const;

export const ExecutiveReportingModelVersion = "1.0.0" as const;

export const ExecutiveReportingModelName =
  "Executive Reporting Intelligence Model" as const;

export const ExecutiveReportingModelDescription =
  "Canonical metadata-only model layer for executive reporting intelligence." as const;

export const ExecutiveReportingModelMetadata = Object.freeze({
  modelId: ExecutiveReportingModelId,
  modelVersion: ExecutiveReportingModelVersion,
  modelName: ExecutiveReportingModelName,
  modelDescription: ExecutiveReportingModelDescription,
  modelNamespace: "nexora.bus.executive-reporting.model",
  modelDependencies: Object.freeze([
    "BUS-33:1 Executive Reporting Intelligence Contracts",
    "BUS-33:2 Executive Reporting Registry",
  ]),
  modelConsumers: Object.freeze([
    "BUS-33:4 Validation",
    "BUS-33:5 Manifest",
    "BUS-33:6 Platform",
  ]),
  registryMetadata: ExecutiveReportingRegistryMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

const buildProfile = (): ExecutiveReportingProfile =>
  Object.freeze({
    id: "executive-reporting-profile-canonical",
    name: "Executive Reporting Canonical Profile",
    description:
      "Complete metadata-only executive reporting profile assembled from registry components.",
    reports: ExecutiveReportDefinitionRegistry,
    templates: ExecutiveReportTemplateRegistry,
    metadata: createMetadata("profile"),
    metadataOnly: true,
    immutable: true,
  });

const buildSummary = (): ExecutiveReportingSummary =>
  Object.freeze({
    profileId: "executive-reporting-profile-canonical",
    description:
      "Executive reporting summary metadata spanning all canonical report definitions.",
    reports: Object.freeze(
      ExecutiveReportDefinitionRegistry.map((definition) => definition.id),
    ) as readonly ExecutiveReportDefinition["id"][],
    metadata: createMetadata("summary"),
    metadataOnly: true,
    immutable: true,
  });

const buildContract = (): ExecutiveReportingContract =>
  Object.freeze({
    profile: buildProfile(),
    summary: buildSummary(),
    metadataOnly: true,
    immutable: true,
  });

const templateSectionRelationships = Object.freeze(
  ExecutiveReportTemplateRegistry.map((template) =>
    Object.freeze({
      templateId: template.id,
      sectionIds: Object.freeze(template.sections.map((section) => section.id)),
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

const audienceTemplateRelationships = Object.freeze(
  ExecutiveReportAudienceRegistry.map((audience) =>
    Object.freeze({
      audience,
      templateIds: Object.freeze(
        getExecutiveReportTemplatesByAudience(audience).map((template) => template.id),
      ),
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

const categoryReportRelationships = Object.freeze(
  ExecutiveReportCategoryRegistry.map((category) =>
    Object.freeze({
      category,
      reportIds: Object.freeze(
        getExecutiveReportDefinitionsByCategory(category).map((definition) => definition.id),
      ),
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const buildExecutiveReportingModel = () =>
  Object.freeze({
    contractId: ExecutiveReportingContractId,
    contractVersion: ExecutiveReportingContractVersion,
    contractName: ExecutiveReportingContractName,
    contractDescription: ExecutiveReportingContractDescription,
    profile: buildContract().profile,
    summary: buildContract().summary,
    categories: ExecutiveReportCategoryRegistry,
    audiences: ExecutiveReportAudienceRegistry,
    priorities: ExecutiveReportPriorityRegistry,
    statuses: ExecutiveReportStatusRegistry,
    formats: ExecutiveReportFormatRegistry,
    sections: ExecutiveReportSectionRegistry,
    templates: ExecutiveReportTemplateRegistry,
    definitions: ExecutiveReportDefinitionRegistry,
    profiles: ExecutiveReportingProfileRegistry,
    relationships: Object.freeze({
      templateToSection: templateSectionRelationships,
      audienceToTemplate: audienceTemplateRelationships,
      categoryToReport: categoryReportRelationships,
      metadataOnly: true,
      immutable: true,
    }),
    metadata: ExecutiveReportingModelMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveReportingCanonicalModel = buildExecutiveReportingModel();

export const getExecutiveReportingModelSummary = () =>
  Object.freeze({
    profileId: ExecutiveReportingCanonicalModel.profile.id,
    templateCount: ExecutiveReportingCanonicalModel.templates.length,
    definitionCount: ExecutiveReportingCanonicalModel.definitions.length,
    relationshipCount:
      ExecutiveReportingCanonicalModel.relationships.templateToSection.length +
      ExecutiveReportingCanonicalModel.relationships.audienceToTemplate.length +
      ExecutiveReportingCanonicalModel.relationships.categoryToReport.length,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveReportingModelCategories = () =>
  ExecutiveReportingCanonicalModel.categories;

export const getExecutiveReportingModelAudiences = () =>
  ExecutiveReportingCanonicalModel.audiences;

export const getExecutiveReportingModelTemplates = (): readonly ExecutiveReportTemplate[] =>
  ExecutiveReportingCanonicalModel.templates;

export const getExecutiveReportingModelDefinitions = (): readonly ExecutiveReportDefinition[] =>
  ExecutiveReportingCanonicalModel.definitions;

export const getExecutiveReportingModelProfiles = (): readonly ExecutiveReportingProfile[] =>
  ExecutiveReportingCanonicalModel.profiles;

export const ExecutiveReportingModelFoundation = Object.freeze({
  metadata: ExecutiveReportingModelMetadata,
  canonicalModel: ExecutiveReportingCanonicalModel,
  buildExecutiveReportingModel,
  getExecutiveReportingModelSummary,
  getExecutiveReportingModelCategories,
  getExecutiveReportingModelAudiences,
  getExecutiveReportingModelTemplates,
  getExecutiveReportingModelDefinitions,
  getExecutiveReportingModelProfiles,
  metadataOnly: true,
  immutable: true,
});

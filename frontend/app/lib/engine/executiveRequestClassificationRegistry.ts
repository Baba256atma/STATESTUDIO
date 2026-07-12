import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const classification = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-classification-${key}`, groupId: "classification", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveRequestClassificationRegistry = Object.freeze([
  classification("business", "Business", "Business classification dimension."),
  classification("operations", "Operations", "Operations classification dimension."),
  classification("strategy", "Strategy", "Strategy classification dimension."),
  classification("finance", "Finance", "Finance classification dimension."),
  classification("revenue", "Revenue", "Revenue classification dimension."),
  classification("organization", "Organization", "Organization classification dimension."),
  classification("resource", "Resource", "Resource classification dimension."),
  classification("kpi", "KPI", "KPI classification dimension."),
  classification("risk", "Risk", "Risk classification dimension."),
  classification("executive", "Executive", "Executive classification dimension."),
] as const);

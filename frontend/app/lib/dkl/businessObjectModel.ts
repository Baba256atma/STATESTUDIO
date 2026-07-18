/**
 * DKL-1:3 — Data Knowledge Foundation Model.
 *
 * Immutable metadata model describing organizational business entity types.
 * These are model definitions only — no business objects are created,
 * instantiated, or executed here. Metadata only — no runtime behavior.
 */

import type {
  BusinessObjectModelDescriptor,
  BusinessObjectTypeDescriptor,
  BusinessObjectTypeKey,
} from "./dataKnowledgeFoundationModelTypes.ts";

const businessType = (
  typeKey: BusinessObjectTypeKey,
  name: string,
  description: string
): BusinessObjectTypeDescriptor =>
  Object.freeze({
    id: `dkl-business-object-${typeKey}`,
    typeKey,
    name,
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies BusinessObjectTypeDescriptor);

export const BusinessObjectModel = Object.freeze({
  id: "dkl-model-business-object",
  name: "Business Object Model",
  kind: "business-object",
  types: Object.freeze([
    businessType("customer", "Customer", "Model definition for a customer business entity."),
    businessType("employee", "Employee", "Model definition for an employee business entity."),
    businessType("product", "Product", "Model definition for a product business entity."),
    businessType("project", "Project", "Model definition for a project business entity."),
    businessType("supplier", "Supplier", "Model definition for a supplier business entity."),
    businessType("department", "Department", "Model definition for a department business entity."),
    businessType("contract", "Contract", "Model definition for a contract business entity."),
    businessType("asset", "Asset", "Model definition for an asset business entity."),
  ]),
  metadataOnly: true,
  immutable: true,
} as const satisfies BusinessObjectModelDescriptor);

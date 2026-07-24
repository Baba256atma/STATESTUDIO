/** WS-9:3 — Immutable Value Workspace domain model declarations. */
import { ValueWorkspaceRegistry } from "./valueWorkspaceRegistry.ts";

const names = Object.freeze([
  "ValueWorkspaceModel",
  "ExecutiveValueModel",
  "ValueIdentityModel",
  "BusinessValueModel",
  "ValueDimensionModel",
  "ValueOutcomeModel",
  "ValueEvidenceModel",
  "ValueImpactModel",
  "ValueMeasurementModel",
  "ReturnOnInvestmentModel",
  "ExecutiveValueSummaryModel",
  "ValueLifecycleModel",
  "ValueReadinessModel",
  "ExecutiveValueRepresentationModel",
  "ValueBoundaryModel",
] as const);

export const ValueWorkspaceDomainModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
    name,
    kind: "Domain Model",
    source: ValueWorkspaceRegistry.identity.id,
    order: index + 1,
    calculated: false,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

/**
 * Phase 6:4 — Stakeholder Registry.
 * Generic organizational framework — not organization-specific definitions.
 */

export const STAKEHOLDER_REGISTRY_VERSION = "6.4.0";

export type StakeholderGroupId =
  | "executive_team"
  | "operations"
  | "finance"
  | "pmo"
  | "customers"
  | "partners"
  | "leadership";

export type StakeholderCategory =
  | "internal"
  | "external"
  | "executive"
  | "operational";

export type StakeholderRole =
  | "decision_owner"
  | "execution_owner"
  | "advisory_participant"
  | "impacted_party";

export type StakeholderInfluenceLevel = "low" | "moderate" | "high" | "critical";

export type StakeholderGroupEntry = Readonly<{
  id: StakeholderGroupId;
  label: string;
  category: StakeholderCategory;
  role: StakeholderRole;
  defaultInfluence: StakeholderInfluenceLevel;
  summary: string;
}>;

export const STAKEHOLDER_GROUP_REGISTRY: Readonly<Record<StakeholderGroupId, StakeholderGroupEntry>> =
  Object.freeze({
    executive_team: Object.freeze({
      id: "executive_team",
      label: "Executive Team",
      category: "executive",
      role: "decision_owner",
      defaultInfluence: "critical",
      summary: "Executive decision authority and strategic accountability",
    }),
    operations: Object.freeze({
      id: "operations",
      label: "Operations",
      category: "operational",
      role: "execution_owner",
      defaultInfluence: "high",
      summary: "Operational execution and service delivery stakeholders",
    }),
    finance: Object.freeze({
      id: "finance",
      label: "Finance",
      category: "internal",
      role: "advisory_participant",
      defaultInfluence: "high",
      summary: "Financial impact and resource allocation stakeholders",
    }),
    pmo: Object.freeze({
      id: "pmo",
      label: "PMO",
      category: "internal",
      role: "advisory_participant",
      defaultInfluence: "moderate",
      summary: "Program and portfolio coordination stakeholders",
    }),
    customers: Object.freeze({
      id: "customers",
      label: "Customers",
      category: "external",
      role: "impacted_party",
      defaultInfluence: "high",
      summary: "External customer impact and experience stakeholders",
    }),
    partners: Object.freeze({
      id: "partners",
      label: "Partners",
      category: "external",
      role: "impacted_party",
      defaultInfluence: "moderate",
      summary: "Partner ecosystem and collaboration stakeholders",
    }),
    leadership: Object.freeze({
      id: "leadership",
      label: "Leadership",
      category: "executive",
      role: "decision_owner",
      defaultInfluence: "critical",
      summary: "Institutional leadership and governance stakeholders",
    }),
  });

export function listStakeholderGroups(): readonly StakeholderGroupEntry[] {
  return Object.freeze(Object.values(STAKEHOLDER_GROUP_REGISTRY));
}

export function getStakeholderGroup(id: StakeholderGroupId): StakeholderGroupEntry {
  return STAKEHOLDER_GROUP_REGISTRY[id];
}

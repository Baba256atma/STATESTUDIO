import type { ExecutiveObjectLayoutRole } from "./normalizeExecutiveObjectLayout";

export type ExecutiveLayoutTemplateId =
  | "supply_chain"
  | "project_pmo"
  | "financial"
  | "generic_executive";

export type ExecutiveLayoutObjectRoleProfile = {
  id: string;
  role: ExecutiveObjectLayoutRole;
  label: string;
  tokens: string[];
};

export type ResolveExecutiveLayoutTemplateInput = {
  domainId?: string | null;
  objectRoles: ExecutiveLayoutObjectRoleProfile[];
  objectCount: number;
  scenePurpose?: string | null;
};

export type ResolveExecutiveLayoutTemplateResult = {
  templateId: ExecutiveLayoutTemplateId;
  domainId: string | null;
  reason: string;
};

export type ExecutiveLayoutTemplateSlot = {
  position: [number, number, number];
  keywords: string[];
  role?: ExecutiveObjectLayoutRole;
  lane?: string;
};

import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes";
import type { SceneRelationship } from "../modeling/relationshipRuntime";
import { toNexoraRelationshipType } from "../modeling/relationshipRuntime";
import { readSceneRelationships } from "../relationships/relationshipRuntime";
import type { NexoraRelationship } from "../relationships/relationshipTypes";
import { readPropagationPaths, type PropagationPath } from "../propagation/propagationAuthoringRuntime";
import {
  captureActiveScenarioSnapshot,
  ensureScenarioWorkspaceInScene,
} from "../scenario/scenarioAuthoringRuntime";

export type DomainTemplate = {
  id: string;
  name: string;
  description: string;
  domainId: string;
  version: string;
  category: "supply_chain" | "pmo" | "finance" | "operations" | "risk" | "custom";
  objects: SceneObject[];
  relationships: SceneRelationship[];
  propagationPaths: PropagationPath[];
};

export type DomainTemplatePreview = {
  template: DomainTemplate;
  objectCount: number;
  relationshipCount: number;
  propagationPathCount: number;
};

export type DomainTemplateApplyMode = "load" | "import";

export type DomainTemplateApplyResult = {
  success: boolean;
  nextScene?: SceneJson;
  template?: DomainTemplate;
  createdObjectIds?: string[];
  createdRelationshipIds?: string[];
  createdPropagationPathIds?: string[];
  errors?: string[];
};

const CUSTOM_TEMPLATE_STORAGE_KEY = "nexora.executive.domain-templates.custom.v1";
const TEMPLATE_RUNTIME_VERSION = "1.0";
const templateRegistry = new Map<string, DomainTemplate>();
const templateLogKeys = new Set<string>();

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function logTemplateRuntime(
  tag: string,
  template: Pick<DomainTemplate, "id" | "name" | "domainId">,
  counts: { objectCount: number; relationshipCount: number }
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${tag}:${template.id}:${counts.objectCount}:${counts.relationshipCount}`;
  if (templateLogKeys.has(key)) return;
  templateLogKeys.add(key);
  console.log(tag, {
    templateId: template.id,
    templateName: template.name,
    domainId: template.domainId,
    objectCount: counts.objectCount,
    relationshipCount: counts.relationshipCount,
  });
}

function object(
  id: string,
  label: string,
  category: string,
  position: Vector3Tuple,
  description: string,
  importance = 60,
  riskLevel = 25
): SceneObject {
  return {
    id,
    label,
    name: label,
    type: category.toLowerCase().includes("risk") ? "risk" : "box",
    category,
    role: category.toLowerCase(),
    position,
    pos: position,
    importance,
    riskLevel,
    status: riskLevel >= 70 ? "Warning" : "Healthy",
    description,
    semantic: {
      category,
      display_label: label,
      business_meaning: description,
      tags: [category, label],
    },
    meta: {
      source: "domain_template",
      category,
    },
  };
}

function relationship(
  id: string,
  sourceObjectId: string,
  targetObjectId: string,
  relationshipType: SceneRelationship["relationshipType"],
  label?: string,
  strength = 0.65
): SceneRelationship {
  return {
    id,
    sourceObjectId,
    targetObjectId,
    relationshipType,
    label,
    strength,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

function path(
  id: string,
  sourceObjectId: string,
  targetObjectId: string,
  propagationType: PropagationPath["propagationType"],
  strength: number,
  notes?: string,
  delayHours = 0
): PropagationPath {
  return {
    id,
    sourceObjectId,
    targetObjectId,
    propagationType,
    strength,
    delayHours,
    notes,
    createdAt: "2026-01-01T00:00:00.000Z",
    modifiedAt: "2026-01-01T00:00:00.000Z",
  };
}

function registerTemplate(template: DomainTemplate): void {
  templateRegistry.set(template.id, Object.freeze(cloneValue(template)) as DomainTemplate);
}

function registerBuiltInTemplates(): void {
  registerTemplate({
    id: "domain_supply_chain_foundation",
    name: "Supply Chain Template",
    description: "Supplier, factory, inventory, distribution, customer, and market system with starter dependencies.",
    domainId: "supply_chain",
    version: TEMPLATE_RUNTIME_VERSION,
    category: "supply_chain",
    objects: [
      object("supplier", "Supplier", "Supplier", [-5, 0, -1], "External supply source", 80, 35),
      object("factory", "Factory", "Facility", [-3, 0, 0.8], "Production capacity center", 78, 30),
      object("inventory", "Inventory", "Inventory", [-0.8, 0, -0.4], "Stock buffer and service-level control", 72, 40),
      object("distribution", "Distribution", "Distribution", [1.5, 0, 0.8], "Logistics and delivery network", 66, 32),
      object("customer", "Customer", "Customer", [3.7, 0, -0.6], "Demand recipient", 68, 22),
      object("market", "Market", "Market", [5.2, 0, 0.9], "Demand and revenue environment", 75, 28),
    ],
    relationships: [
      relationship("rel_supplier_factory", "supplier", "factory", "flow", "Supplies"),
      relationship("rel_factory_inventory", "factory", "inventory", "dependency", "Produces"),
      relationship("rel_inventory_distribution", "inventory", "distribution", "flow", "Ships"),
      relationship("rel_distribution_customer", "distribution", "customer", "flow", "Delivers"),
      relationship("rel_customer_market", "customer", "market", "information", "Demand Signal"),
    ],
    propagationPaths: [
      path("impact_supplier_inventory", "supplier", "inventory", "risk", 70, "Supplier delay can reduce available inventory.", 24),
      path("impact_inventory_market", "inventory", "market", "operational", 55, "Inventory shortage can affect market service level.", 12),
    ],
  });

  registerTemplate({
    id: "domain_pmo_foundation",
    name: "PMO Template",
    description: "Program, project, milestone, team, resource, risk, and stakeholder model for portfolio governance.",
    domainId: "pmo",
    version: TEMPLATE_RUNTIME_VERSION,
    category: "pmo",
    objects: [
      object("program", "Program", "Program", [-4, 0, 0], "Portfolio-level executive program", 78, 24),
      object("project", "Project", "Project", [-2.4, 0, 1.2], "Delivery initiative", 74, 32),
      object("milestone", "Milestone", "Milestone", [-0.7, 0, -0.5], "Critical delivery point", 68, 28),
      object("team", "Team", "Team", [1, 0, 1.1], "Delivery team", 62, 22),
      object("resource", "Resource", "Resource", [2.6, 0, -0.5], "Capacity and funding input", 70, 30),
      object("risk", "Risk", "Risk", [4, 0, 1], "Execution risk", 80, 72),
      object("stakeholder", "Stakeholder", "Stakeholder", [0.5, 0, -2], "Executive sponsor or impacted stakeholder", 66, 18),
    ],
    relationships: [
      relationship("rel_program_project", "program", "project", "ownership", "Governs"),
      relationship("rel_project_milestone", "project", "milestone", "dependency", "Commits"),
      relationship("rel_team_project", "team", "project", "resource", "Delivers"),
      relationship("rel_resource_team", "resource", "team", "resource", "Funds"),
      relationship("rel_risk_project", "risk", "project", "risk", "Threatens"),
      relationship("rel_stakeholder_program", "stakeholder", "program", "information", "Steers"),
    ],
    propagationPaths: [
      path("impact_risk_milestone", "risk", "milestone", "risk", 75, "Project risk can delay milestone delivery.", 72),
      path("impact_resource_project", "resource", "project", "resource", 62, "Resource constraints influence project delivery.", 24),
    ],
  });

  registerTemplate({
    id: "domain_finance_foundation",
    name: "Finance Template",
    description: "Revenue, expense, cash flow, budget, investment, risk, and department influence model.",
    domainId: "finance",
    version: TEMPLATE_RUNTIME_VERSION,
    category: "finance",
    objects: [
      object("revenue", "Revenue", "Revenue", [-4.8, 0, -0.8], "Top-line performance", 82, 20),
      object("expense", "Expense", "Expense", [-3, 0, 1], "Cost structure", 74, 35),
      object("cash_flow", "Cash Flow", "Cash Flow", [-1, 0, -0.2], "Liquidity movement", 86, 28),
      object("budget", "Budget", "Budget", [1, 0, 1], "Planning constraint", 76, 22),
      object("investment", "Investment", "Investment", [2.8, 0, -0.5], "Capital allocation", 72, 34),
      object("risk", "Risk", "Risk", [4.4, 0, 1], "Financial exposure", 78, 68),
      object("department", "Department", "Department", [0.2, 0, -2], "Operating budget owner", 64, 18),
    ],
    relationships: [
      relationship("rel_revenue_cash", "revenue", "cash_flow", "flow", "Contributes"),
      relationship("rel_expense_cash", "expense", "cash_flow", "dependency", "Consumes"),
      relationship("rel_budget_investment", "budget", "investment", "resource", "Funds"),
      relationship("rel_investment_revenue", "investment", "revenue", "dependency", "Enables"),
      relationship("rel_risk_cash", "risk", "cash_flow", "risk", "Pressures"),
      relationship("rel_department_budget", "department", "budget", "ownership", "Owns"),
    ],
    propagationPaths: [
      path("impact_expense_cash", "expense", "cash_flow", "financial", 68, "Expense growth can pressure cash flow.", 0),
      path("impact_risk_investment", "risk", "investment", "risk", 58, "Risk exposure can constrain investment appetite.", 24),
    ],
  });

  registerTemplate({
    id: "domain_operations_foundation",
    name: "Operations Template",
    description: "Operations center, process, machine, team, inventory, demand, and risk dependency model.",
    domainId: "operations",
    version: TEMPLATE_RUNTIME_VERSION,
    category: "operations",
    objects: [
      object("operations_center", "Operations Center", "Operations Center", [-4.2, 0, 0], "Operational control hub", 82, 18),
      object("process", "Process", "Process", [-2.2, 0, 1.1], "Core operating process", 74, 26),
      object("machine", "Machine", "Machine", [-0.4, 0, -0.6], "Production or service asset", 70, 42),
      object("team", "Team", "Team", [1.4, 0, 1], "Operating team", 66, 24),
      object("inventory", "Inventory", "Inventory", [3, 0, -0.5], "Operational buffer", 68, 32),
      object("customer_demand", "Customer Demand", "Demand", [4.7, 0, 1], "Demand pressure", 72, 30),
      object("risk", "Risk", "Risk", [0.6, 0, -2.1], "Operational disruption source", 78, 70),
    ],
    relationships: [
      relationship("rel_center_process", "operations_center", "process", "ownership", "Coordinates"),
      relationship("rel_process_machine", "process", "machine", "dependency", "Depends"),
      relationship("rel_team_process", "team", "process", "resource", "Operates"),
      relationship("rel_machine_inventory", "machine", "inventory", "flow", "Produces"),
      relationship("rel_inventory_demand", "inventory", "customer_demand", "dependency", "Serves"),
      relationship("rel_risk_process", "risk", "process", "risk", "Disrupts"),
    ],
    propagationPaths: [
      path("impact_machine_inventory", "machine", "inventory", "operational", 65, "Machine downtime can reduce inventory availability.", 8),
      path("impact_risk_demand", "risk", "customer_demand", "risk", 50, "Operational disruption can affect demand fulfillment.", 24),
    ],
  });

  registerTemplate({
    id: "domain_enterprise_risk_foundation",
    name: "Enterprise Risk Template",
    description: "Strategic, operational, financial, supplier, compliance risk, and business unit model.",
    domainId: "risk",
    version: TEMPLATE_RUNTIME_VERSION,
    category: "risk",
    objects: [
      object("strategic_risk", "Strategic Risk", "Risk", [-4, 0, -0.8], "Strategic exposure", 85, 78),
      object("operational_risk", "Operational Risk", "Risk", [-2.3, 0, 1], "Operational exposure", 80, 72),
      object("financial_risk", "Financial Risk", "Risk", [-0.4, 0, -0.4], "Financial exposure", 82, 76),
      object("supplier_risk", "Supplier Risk", "Risk", [1.6, 0, 1], "External supplier exposure", 78, 70),
      object("compliance_risk", "Compliance Risk", "Risk", [3.4, 0, -0.6], "Regulatory exposure", 76, 68),
      object("business_unit", "Business Unit", "Business Unit", [5, 0, 0.9], "Impacted operating unit", 74, 36),
    ],
    relationships: [
      relationship("rel_strategic_business", "strategic_risk", "business_unit", "risk", "Impacts"),
      relationship("rel_operational_business", "operational_risk", "business_unit", "risk", "Disrupts"),
      relationship("rel_financial_business", "financial_risk", "business_unit", "risk", "Pressures"),
      relationship("rel_supplier_operational", "supplier_risk", "operational_risk", "dependency", "Amplifies"),
      relationship("rel_compliance_strategic", "compliance_risk", "strategic_risk", "risk", "Escalates"),
    ],
    propagationPaths: [
      path("impact_supplier_operational", "supplier_risk", "operational_risk", "risk", 78, "Supplier risk can intensify operational risk.", 24),
      path("impact_operational_business", "operational_risk", "business_unit", "operational", 72, "Operational risk can impair the business unit.", 12),
      path("impact_financial_business", "financial_risk", "business_unit", "financial", 66, "Financial risk can constrain business unit choices.", 0),
    ],
  });
}

registerBuiltInTemplates();

function readCustomTemplates(): DomainTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_TEMPLATE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as DomainTemplate[]) : [];
  } catch {
    return [];
  }
}

function writeCustomTemplates(templates: DomainTemplate[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CUSTOM_TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  } catch {
    // local template persistence is best-effort
  }
}

export function listDomainTemplates(): DomainTemplate[] {
  return [...Array.from(templateRegistry.values()).map(cloneValue), ...readCustomTemplates()];
}

export function getDomainTemplate(templateId: string): DomainTemplate | null {
  const id = templateId.trim();
  return listDomainTemplates().find((template) => template.id === id) ?? null;
}

export function listDomainTemplatesByCategory(category: DomainTemplate["category"] | "all"): DomainTemplate[] {
  const templates = listDomainTemplates();
  return category === "all" ? templates : templates.filter((template) => template.category === category);
}

export function buildDomainTemplatePreview(templateId: string): DomainTemplatePreview | null {
  const template = getDomainTemplate(templateId);
  if (!template) return null;
  return {
    template,
    objectCount: template.objects.length,
    relationshipCount: template.relationships.length,
    propagationPathCount: template.propagationPaths.length,
  };
}

function remapTemplate(template: DomainTemplate): {
  objects: SceneObject[];
  relationships: NexoraRelationship[];
  propagationPaths: PropagationPath[];
  createdObjectIds: string[];
  createdRelationshipIds: string[];
  createdPropagationPathIds: string[];
} {
  const suffix = Date.now().toString(36);
  const now = new Date().toISOString();
  const idMap = new Map<string, string>();
  const createdObjectIds: string[] = [];
  const objects = template.objects.map((entry) => {
    const nextId = `tpl_${template.id}_${entry.id}_${suffix}`.replace(/[^a-zA-Z0-9_:-]/g, "_");
    idMap.set(entry.id, nextId);
    createdObjectIds.push(nextId);
    return {
      ...cloneValue(entry),
      id: nextId,
      meta: {
        ...(entry.meta as Record<string, unknown> | undefined),
        source: "domain_template",
        templateId: template.id,
        templateName: template.name,
        domainId: template.domainId,
        generatedAt: now,
      },
    };
  });
  const relationships = template.relationships
    .map((entry): NexoraRelationship | null => {
      const sourceId = idMap.get(entry.sourceObjectId);
      const targetId = idMap.get(entry.targetObjectId);
      if (!sourceId || !targetId) return null;
      const id = `rel_${template.id}_${entry.id}_${suffix}`.replace(/[^a-zA-Z0-9_:-]/g, "_");
      return {
        id,
        sourceId,
        targetId,
        type: toNexoraRelationshipType(entry.relationshipType),
        direction: "uni",
        metadata: {
          source: "domain_template",
          templateId: template.id,
          label: entry.label,
          strength: entry.strength,
        },
        createdAt: now,
      };
    })
    .filter((entry): entry is NexoraRelationship => entry != null);
  const propagationPaths = template.propagationPaths
    .map((entry): PropagationPath | null => {
      const sourceObjectId = idMap.get(entry.sourceObjectId);
      const targetObjectId = idMap.get(entry.targetObjectId);
      if (!sourceObjectId || !targetObjectId) return null;
      return {
        ...cloneValue(entry),
        id: `path_${template.id}_${entry.id}_${suffix}`.replace(/[^a-zA-Z0-9_:-]/g, "_"),
        sourceObjectId,
        targetObjectId,
        createdAt: now,
        modifiedAt: now,
      };
    })
    .filter((entry): entry is PropagationPath => entry != null);

  return {
    objects,
    relationships,
    propagationPaths,
    createdObjectIds,
    createdRelationshipIds: relationships.map((entry) => entry.id),
    createdPropagationPathIds: propagationPaths.map((entry) => entry.id),
  };
}

export function applyDomainTemplateToScene(input: {
  currentScene: unknown;
  templateId: string;
  mode: DomainTemplateApplyMode;
}): DomainTemplateApplyResult {
  if (!isSceneJson(input.currentScene)) return { success: false, errors: ["invalid_scene"] };
  const template = getDomainTemplate(input.templateId);
  if (!template) return { success: false, errors: ["template_not_found"] };
  const generated = remapTemplate(template);
  const existingObjects = Array.isArray(input.currentScene.scene.objects) ? input.currentScene.scene.objects : [];
  const existingRelationships = readSceneRelationships(input.currentScene);
  const existingPropagationPaths = readPropagationPaths(input.currentScene);
  const objects = input.mode === "import" ? [...existingObjects, ...generated.objects] : generated.objects;
  const relationships =
    input.mode === "import" ? [...existingRelationships, ...generated.relationships] : generated.relationships;
  const propagationPaths =
    input.mode === "import" ? [...existingPropagationPaths, ...generated.propagationPaths] : generated.propagationPaths;
  const now = new Date().toISOString();
  const sceneWithTemplate: SceneJson = {
    ...input.currentScene,
    meta: {
      ...(input.currentScene.meta ?? {}),
      activeDomainTemplate: {
        id: template.id,
        name: template.name,
        domainId: template.domainId,
        version: template.version,
        mode: input.mode,
        appliedAt: now,
      },
      systemBlueprint: {
        templateId: template.id,
        templateName: template.name,
        generatedAt: now,
        version: template.version,
        source: "template",
        objectCount: generated.createdObjectIds.length,
        relationshipCount: generated.createdRelationshipIds.length,
      },
      lastDomainTemplateAppliedAt: now,
    },
    scene: {
      ...input.currentScene.scene,
      objects,
      relationships,
      propagationPaths,
    },
  };
  const nextScene =
    input.mode === "load"
      ? ensureScenarioWorkspaceInScene({
          ...sceneWithTemplate,
          scene: {
            ...sceneWithTemplate.scene,
            scenarios: undefined,
          },
        })
      : captureActiveScenarioSnapshot(ensureScenarioWorkspaceInScene(sceneWithTemplate));

  logTemplateRuntime(input.mode === "import" ? "[Nexora][TemplateImported]" : "[Nexora][TemplateLoaded]", template, {
    objectCount: generated.createdObjectIds.length,
    relationshipCount: generated.createdRelationshipIds.length,
  });

  return {
    success: true,
    nextScene,
    template,
    createdObjectIds: generated.createdObjectIds,
    createdRelationshipIds: generated.createdRelationshipIds,
    createdPropagationPathIds: generated.createdPropagationPathIds,
  };
}

export function saveSceneAsDomainTemplate(input: {
  sceneJson: unknown;
  name: string;
  description?: string;
}): DomainTemplateApplyResult {
  if (!isSceneJson(input.sceneJson)) return { success: false, errors: ["invalid_scene"] };
  const name = input.name.trim();
  if (!name) return { success: false, errors: ["missing_template_name"] };
  const template: DomainTemplate = {
    id: `custom_${Date.now().toString(36)}`,
    name,
    description: input.description?.trim() || "Custom executive workspace template.",
    domainId: "custom",
    version: TEMPLATE_RUNTIME_VERSION,
    category: "custom",
    objects: cloneValue(Array.isArray(input.sceneJson.scene.objects) ? input.sceneJson.scene.objects : []),
    relationships: readSceneRelationships(input.sceneJson).map((entry) => ({
      id: entry.id,
      sourceObjectId: entry.sourceId,
      targetObjectId: entry.targetId,
      relationshipType:
        entry.type === "risk" || entry.type === "blocks"
          ? "risk"
          : entry.type === "supports"
            ? "resource"
            : entry.type === "owns" || entry.type === "reports_to"
              ? "ownership"
              : entry.type === "supplies" || entry.type === "flow"
                ? "flow"
                : entry.type === "influences"
                  ? "information"
                  : "dependency",
      label: typeof entry.metadata?.label === "string" ? entry.metadata.label : entry.type,
      strength: typeof entry.metadata?.strength === "number" ? entry.metadata.strength : undefined,
      createdAt: entry.createdAt,
    })),
    propagationPaths: readPropagationPaths(input.sceneJson),
  };
  const custom = readCustomTemplates().filter((entry) => entry.id !== template.id);
  writeCustomTemplates([template, ...custom].slice(0, 20));
  logTemplateRuntime("[Nexora][TemplateCreated]", template, {
    objectCount: template.objects.length,
    relationshipCount: template.relationships.length,
  });
  logTemplateRuntime("[Nexora][TemplateSaved]", template, {
    objectCount: template.objects.length,
    relationshipCount: template.relationships.length,
  });
  return { success: true, template };
}

export function resetDomainTemplateRuntimeForTests(): void {
  templateRegistry.clear();
  templateLogKeys.clear();
  registerBuiltInTemplates();
}

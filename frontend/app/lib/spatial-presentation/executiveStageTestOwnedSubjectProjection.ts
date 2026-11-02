/**
 * NPA-T STAGE-TEST-OWNED-SUBJECT-PROJECTION:1
 * In-memory test subjects for Stage composition. Not a product catalog.
 * Production shells must not import this module. It does not read or write
 * storage, and it does not register a Manager Workspace.
 */

import type { NexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import type {
  NexoraMVPStageObjectFixture,
  NexoraMVPStageRelationshipFixture,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";

export const executiveStageTestOwnedSubjectProjectionIdentity =
  "NPA-T STAGE-TEST-OWNED-SUBJECT-PROJECTION:1" as const;

export const STAGE_TEST_WORKSPACE_ALPHA = "ws-test-alpha" as const;
export const STAGE_TEST_WORKSPACE_BETA = "ws-test-beta" as const;

export type StageTestOwnedScenario =
  | "workspace-a"
  | "workspace-b"
  | "no-center"
  | "foreign-company";

type StageTestSubjectRole =
  | "center"
  | "related"
  | "unrelated"
  | "foreign"
  | "denied"
  | "undisclosed"
  | "unresolved";

type StageTestOwnedSubject = Readonly<{
  id: string;
  label: string;
  objectKind: string;
  managerWorkspaceId?: string;
  presentationAuthorized: boolean;
  disclosed: boolean;
  role: StageTestSubjectRole;
  workspaceScope: typeof STAGE_TEST_WORKSPACE_ALPHA | typeof STAGE_TEST_WORKSPACE_BETA;
}>;

export const STAGE_TEST_OWNED_SUBJECTS: readonly StageTestOwnedSubject[] = Object.freeze([
  subject("company-alpha", "Company Alpha", "company", STAGE_TEST_WORKSPACE_ALPHA, "center"),
  subject("test-capacity-alpha", "Capacity", "object", STAGE_TEST_WORKSPACE_ALPHA, "related"),
  subject("test-budget-alpha", "Budget", "object", STAGE_TEST_WORKSPACE_ALPHA, "related"),
  subject("test-inventory-alpha", "Inventory", "object", STAGE_TEST_WORKSPACE_ALPHA, "related"),
  subject("test-risk-alpha", "Risk", "object", STAGE_TEST_WORKSPACE_ALPHA, "related"),
  subject("test-unrelated-alpha", "Unrelated", "object", STAGE_TEST_WORKSPACE_ALPHA, "unrelated"),
  subject("test-denied-alpha", "Denied", "object", STAGE_TEST_WORKSPACE_ALPHA, "denied", {
    presentationAuthorized: false,
  }),
  subject("test-undisclosed-alpha", "Undisclosed", "object", STAGE_TEST_WORKSPACE_ALPHA, "undisclosed", {
    disclosed: false,
  }),
  subject("test-unresolved-alpha", "Unresolved", "object", STAGE_TEST_WORKSPACE_ALPHA, "unresolved", {
    managerWorkspaceId: undefined,
  }),
  subject("company-beta", "Company Beta", "company", STAGE_TEST_WORKSPACE_BETA, "center"),
  subject("test-delivery-beta", "Delivery", "object", STAGE_TEST_WORKSPACE_BETA, "related"),
  subject("test-quality-beta", "Quality", "object", STAGE_TEST_WORKSPACE_BETA, "related"),
  subject("test-foreign-beta", "Foreign", "object", STAGE_TEST_WORKSPACE_BETA, "foreign"),
]);

export const STAGE_TEST_OWNED_RELATIONSHIPS: readonly NexoraMVPStageRelationshipFixture[] = Object.freeze([
  link("company-alpha", "test-capacity-alpha"),
  link("company-alpha", "test-budget-alpha"),
  link("company-alpha", "test-inventory-alpha"),
  link("company-alpha", "test-risk-alpha"),
  link("company-beta", "test-delivery-beta"),
  link("company-beta", "test-quality-beta"),
]);

function subject(
  id: string,
  label: string,
  objectKind: string,
  workspaceScope: StageTestOwnedSubject["workspaceScope"],
  role: StageTestSubjectRole,
  overrides: Partial<Pick<StageTestOwnedSubject, "presentationAuthorized" | "disclosed" | "managerWorkspaceId">> = {},
): StageTestOwnedSubject {
  return Object.freeze({
    id,
    label,
    objectKind,
    managerWorkspaceId: workspaceScope,
    presentationAuthorized: true,
    disclosed: true,
    role,
    workspaceScope,
    ...overrides,
  });
}

function link(sourceId: string, targetId: string): NexoraMVPStageRelationshipFixture {
  return Object.freeze({
    id: `rel-${sourceId}-${targetId}`,
    sourceId,
    targetId,
  });
}

function scenarioWorkspace(scenario: StageTestOwnedScenario): string | null {
  if (scenario === "workspace-b") return STAGE_TEST_WORKSPACE_BETA;
  if (scenario === "no-center" || scenario === "foreign-company" || scenario === "workspace-a") {
    return STAGE_TEST_WORKSPACE_ALPHA;
  }
  return null;
}

function copyFixture(record: StageTestOwnedSubject): NexoraMVPStageObjectFixture {
  return Object.freeze({
    id: record.id,
    label: record.label,
    kind: "object" as const,
    objectKind: record.objectKind,
    ...(record.managerWorkspaceId != null
      ? { managerWorkspaceId: record.managerWorkspaceId }
      : {}),
    presentationAuthorized: record.presentationAuthorized,
    disclosed: record.disclosed,
    authoritativePrimary: record.role === "center",
    position: [2, 1, 0] as const,
    status: "stable" as const,
    attention: "normal" as const,
  }) as unknown as NexoraMVPStageObjectFixture;
}

/**
 * Copy the test dataset for one workspace scenario.
 * Foreign, denied, undisclosed, unresolved, and unrelated records stay in the
 * source dataset and are omitted from the returned catalog.
 */
export function materializeStageTestOwnedSubjects(): readonly NexoraMVPStageObjectFixture[] {
  return Object.freeze(STAGE_TEST_OWNED_SUBJECTS.map(copyFixture));
}

export function projectTestOwnedStageCatalog(
  scenario: StageTestOwnedScenario,
): NexoraMVPObjectInteractionCatalog {
  const workspaceId = scenarioWorkspace(scenario);
  const records = STAGE_TEST_OWNED_SUBJECTS.filter((record) => {
    if (record.role !== "center" && record.role !== "related") return false;
    if (record.presentationAuthorized === false || record.disclosed === false) return false;
    if (record.managerWorkspaceId == null) return false;
    if (scenario === "no-center") return record.role === "related" && record.workspaceScope === workspaceId;
    if (scenario === "foreign-company") return false;
    return record.workspaceScope === workspaceId;
  });
  const ids = new Set(records.map((record) => record.id));
  return Object.freeze({
    objects: Object.freeze(records.map(copyFixture)),
    relationships: Object.freeze(
      STAGE_TEST_OWNED_RELATIONSHIPS.filter(
        (relationship) => ids.has(relationship.sourceId) && ids.has(relationship.targetId),
      ).map((relationship) => Object.freeze({ ...relationship })),
    ),
    contextSubjects: Object.freeze([]),
    contextLinks: Object.freeze([]),
  });
}

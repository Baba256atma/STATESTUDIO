/**
 * NPA-T ORG:2 — production workspace-region integration contract.
 *
 * The regions are presentation seams over existing Nexora authorities. They
 * do not store, resolve, rank, compose, or mutate business state.
 */

export const sceneOrgRegionContractIdentity =
  "NPA-T ORG:2/SceneArchitectureExistingAuthorityIntegration" as const;

export const SCENE_ORG_REGION_IDS = Object.freeze([
  "left-management",
  "center-stage",
  "right-context",
  "detail-workspace",
] as const);

export type SceneOrgRegionId = (typeof SCENE_ORG_REGION_IDS)[number];

export type SceneOrgCanonicalReferenceKind =
  | "object"
  | "collection"
  | "data-object"
  | "data-source"
  | "decision"
  | "execution";

/** Identity-only handoff. Business state remains with its canonical owner. */
export type SceneOrgCanonicalReference = Readonly<{
  canonicalId: string;
  kind: SceneOrgCanonicalReferenceKind;
  owner: string;
}>;

export type SceneOrgRegionContract = Readonly<{
  id: SceneOrgRegionId;
  purpose: string;
  consumes: readonly string[];
  neverOwns: readonly string[];
  presentationOnly: true;
  reservationOnly: boolean;
}>;

const COMMON_PROHIBITED_OWNERSHIP = Object.freeze([
  "manager-workflow",
  "advisor",
  "director",
  "stage",
  "theatre-composition",
  "nmi",
  "queue-attention",
  "object-catalog",
  "data-reality",
  "csv-ingestion",
  "conversation-referent",
  "decision",
  "execution",
] as const);

export const SCENE_ORG_REGION_CONTRACTS: Readonly<
  Record<SceneOrgRegionId, SceneOrgRegionContract>
> = Object.freeze({
  "left-management": Object.freeze({
    id: "left-management",
    purpose: "Where am I, and what needs my attention?",
    consumes: Object.freeze([
      "NMI:1-8",
      "STAGE-PROD Queue/Attention",
      "canonical management references",
    ]),
    neverOwns: COMMON_PROHIBITED_OWNERSHIP,
    presentationOnly: true,
    reservationOnly: false,
  }),
  "center-stage": Object.freeze({
    id: "center-stage",
    purpose: "What management situation am I working on now?",
    consumes: Object.freeze([
      "DIR:1 presentation intent",
      "DTH/DTH-EXP composition",
      "NEX-MVP/STAGE-PROD interaction and rendering",
      "canonical Objects/evidence/context",
    ]),
    neverOwns: COMMON_PROHIBITED_OWNERSHIP,
    presentationOnly: true,
    reservationOnly: false,
  }),
  "right-context": Object.freeze({
    id: "right-context",
    purpose: "Help me understand and act on what I am currently viewing.",
    consumes: Object.freeze([
      "canonical Stage focus/selection",
      "CC:5/NCA/NXA/ECA/MO referent context",
      "existing Advisor and evidence projections",
    ]),
    neverOwns: COMMON_PROHIBITED_OWNERSHIP,
    presentationOnly: true,
    reservationOnly: false,
  }),
  "detail-workspace": Object.freeze({
    id: "detail-workspace",
    purpose: "Perform deeper work without transferring truth from canonical authorities.",
    consumes: Object.freeze([
      "canonical Object/source/context identity",
      "RDI/Data Reality/Gate",
      "RDI:2 CSV lifecycle",
      "existing connection/configuration authorities",
    ]),
    neverOwns: COMMON_PROHIBITED_OWNERSHIP,
    presentationOnly: true,
    reservationOnly: true,
  }),
});

export const SCENE_ORG_AUTHORITY_REGION_MATRIX = Object.freeze([
  Object.freeze({ authority: "NMI", left: "projection/navigation", stage: "context input", right: "contextual reference", detail: "optional reference", owner: "NMI:1-8" }),
  Object.freeze({ authority: "Attention/Queue", left: "projection", stage: "possible scene input", right: "contextual reference", detail: "none", owner: "STAGE-PROD Queue" }),
  Object.freeze({ authority: "DIR:1", left: "none", stage: "presentation intent", right: "contextual output", detail: "none", owner: "DIR:1" }),
  Object.freeze({ authority: "DTH/DTH-EXP", left: "none", stage: "scene composition", right: "scene context", detail: "none", owner: "DTH/DTH-EXP" }),
  Object.freeze({ authority: "Stage", left: "navigation target", stage: "authoritative interaction", right: "focus/selection context", detail: "launch identity", owner: "NEX-MVP/STAGE-PROD" }),
  Object.freeze({ authority: "Advisor", left: "none", stage: "existing runtime actions", right: "primary surface", detail: "existing assistance only", owner: "CC:5/NCA/NXA/ECA/MO" }),
  Object.freeze({ authority: "Objects", left: "references", stage: "actors/cards", right: "selected-object context", detail: "canonical identity", owner: "canonical MO/Object catalog" }),
  Object.freeze({ authority: "Data Reality", left: "status/reference", stage: "evidence projection", right: "contextual evidence", detail: "deep data/provenance", owner: "RDI/Data Reality/Gate" }),
  Object.freeze({ authority: "CSV", left: "no permanent file list", stage: "meaningful projection only", right: "contextual reference", detail: "deep CSV work", owner: "RDI:2 CSV lifecycle" }),
  Object.freeze({ authority: "Decision/Execution", left: "navigation/status", stage: "actors/state", right: "context/actions", detail: "identity if justified", owner: "CC:10/CC:11" }),
]);

export const SCENE_ORG_DUPLICATE_AUTHORITY_GUARD = Object.freeze({
  createsManagerWorkflow: false,
  createsAdvisor: false,
  createsDirector: false,
  createsStage: false,
  createsTheatreComposer: false,
  createsNmi: false,
  createsQueueOrAttention: false,
  createsObjectCatalogOrStore: false,
  createsDataReality: false,
  createsCsvIngestion: false,
  createsConversationOrReferentSystem: false,
  createsDecisionAuthority: false,
  createsExecutionAuthority: false,
  ownsBusinessTruth: false,
  storesCanonicalObjects: false,
});

export function createSceneOrgCanonicalReference(input: {
  readonly canonicalId: string;
  readonly kind: SceneOrgCanonicalReferenceKind;
  readonly owner: string;
}): SceneOrgCanonicalReference {
  const canonicalId = input.canonicalId.trim();
  if (canonicalId.length === 0) {
    throw new Error("ORG:2 region handoffs require a canonical identity.");
  }
  return Object.freeze({
    canonicalId,
    kind: input.kind,
    owner: input.owner,
  });
}


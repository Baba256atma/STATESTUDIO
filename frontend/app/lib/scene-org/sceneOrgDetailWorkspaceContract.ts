import type { SceneOrgCanonicalReference } from "./sceneOrgRegionContract";

/** NPA-T ORG:6 — presentation contract over existing deep-detail authorities. */
export const sceneOrgDetailWorkspaceContractIdentity =
  "NPA-T ORG:6/DetailWorkspace" as const;

export const SCENE_ORG_DETAIL_CAPABILITIES = Object.freeze([
  "DATA",
  "CONNECTIONS",
  "CONFIGURATION",
] as const);

export type SceneOrgDetailCapability =
  (typeof SCENE_ORG_DETAIL_CAPABILITIES)[number];

export type SceneOrgDetailWorkspaceProjection = Readonly<{
  open: boolean;
  contextKey: string;
  target: SceneOrgCanonicalReference | null;
  availableCapabilities: readonly SceneOrgDetailCapability[];
  safeUnavailableCapabilities: readonly SceneOrgDetailCapability[];
  source: "canonical-reference";
}>;

export function projectSceneOrgDetailWorkspace(input: {
  readonly open: boolean;
  readonly target: SceneOrgCanonicalReference | null;
  readonly connectionsAvailable: boolean;
  readonly configurationAvailable: boolean;
}): SceneOrgDetailWorkspaceProjection {
  const availableCapabilities: SceneOrgDetailCapability[] = ["DATA"];
  if (input.connectionsAvailable) availableCapabilities.push("CONNECTIONS");
  if (input.configurationAvailable) availableCapabilities.push("CONFIGURATION");
  const unavailable = SCENE_ORG_DETAIL_CAPABILITIES.filter(
    (candidate) => !availableCapabilities.includes(candidate),
  );
  return Object.freeze({
    open: input.open && input.target != null,
    contextKey: input.target
      ? `${input.target.kind}:${input.target.canonicalId}`
      : "none",
    target: input.target,
    availableCapabilities: Object.freeze(availableCapabilities),
    safeUnavailableCapabilities: Object.freeze(unavailable),
    source: "canonical-reference",
  });
}

export function preserveSceneOrgDetailExitContext<T>(context: T): T {
  return context;
}

export const SCENE_ORG_DETAIL_AUTHORITY_GUARD = Object.freeze({
  reusesDataExplorer: true,
  reusesRdiDataReality: true,
  reusesGate: true,
  reusesCsvLifecycle: true,
  reusesConnectionAuthorities: true,
  createsDataReality: false,
  createsGate: false,
  createsCsvPipeline: false,
  createsObjectStore: false,
  createsManagerWorkflow: false,
  copiesBusinessState: false,
  addsAdvisorCommands: false,
});

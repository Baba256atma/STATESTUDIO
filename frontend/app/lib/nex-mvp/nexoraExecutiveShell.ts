/**
 * NEX-MVP:2 — Nexora Executive Shell (composition identity & binding).
 *
 * Application-level shell contract for the visible Executive Decision
 * Environment. Consumes NEX-MVP:1 as the sole immediate application
 * foundation. React composition lives beside the executive route.
 *
 * NEX-MVP:2 does not implement Three.js Stage, Dial geometry, or
 * runtime intelligence engines.
 */

import {
  createNexoraMVPApplication,
  getNexoraMVPApplicationIdentity,
  getNexoraMVPPrimarySurface,
  getNexoraMVPWorkspaceOrder,
  nexoraMVPApplicationFoundationIdentity,
  type NexoraMVPApplicationSnapshot,
  type NexoraMVPPresentationState,
  type NexoraMVPSceneEnvironmentIntent,
  type NexoraMVPSurface,
  type NexoraMVPWorkspaceKind,
  NEXORA_MVP_WORKSPACE_REGISTRY,
  getNexoraMVPSceneEnvironmentIntent,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraExecutiveShellIdentity =
  "NEX-MVP:2/NexoraExecutiveShell" as const;

export const nexoraExecutiveShellVersion = "1.2.0" as const;

export const nexoraExecutiveShellNamespace =
  "nexora.mvp.executive-shell" as const;

export const nexoraExecutiveShellPhase = "ExecutiveShell" as const;

export const nexoraExecutiveShellArchitecturalRole =
  "MVPExecutiveExperienceShell" as const;

export const nexoraExecutiveShellUpstreamIdentity =
  nexoraMVPApplicationFoundationIdentity;

export const nexoraExecutiveShellUpstreamImportPath =
  "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation" as const;

export const nexoraExecutiveShellReadiness =
  "ReadyFor3DExecutiveStage" as const;

export const nexoraExecutiveShellCanonicalRoute = "/executive" as const;

export type NexoraExecutiveShellIdentity = {
  readonly id: typeof nexoraExecutiveShellIdentity;
  readonly version: typeof nexoraExecutiveShellVersion;
  readonly namespace: typeof nexoraExecutiveShellNamespace;
  readonly phase: typeof nexoraExecutiveShellPhase;
  readonly architecturalRole: typeof nexoraExecutiveShellArchitecturalRole;
};

const NEXORA_EXECUTIVE_SHELL_IDENTITY: NexoraExecutiveShellIdentity =
  Object.freeze({
    id: nexoraExecutiveShellIdentity,
    version: nexoraExecutiveShellVersion,
    namespace: nexoraExecutiveShellNamespace,
    phase: nexoraExecutiveShellPhase,
    architecturalRole: nexoraExecutiveShellArchitecturalRole,
  });

export function getNexoraExecutiveShellIdentity(): NexoraExecutiveShellIdentity {
  return NEXORA_EXECUTIVE_SHELL_IDENTITY;
}

// ─── Boundary ───────────────────────────────────────────────────────────────

export const NEXORA_EXECUTIVE_SHELL_BOUNDARY = Object.freeze({
  nexMvpAuthority: "Nexora-MVP-Executive-Shell" as const,
  architecturalRole: nexoraExecutiveShellArchitecturalRole,
  soleImmediateDependency: nexoraExecutiveShellUpstreamIdentity,
  upstreamImportPath: nexoraExecutiveShellUpstreamImportPath,
  consumesMvpFoundationOnly: true as const,
  bypassesFoundationIntoNexCi: false as const,
  bypassesNexCiIntoRex: false as const,
  introducesThreeJsStage: false as const,
  introducesReactThreeFiber: false as const,
  introducesWorkspaceDialGeometry: false as const,
  ownsRuntimeOrchestration: false as const,
  canonicalRoute: nexoraExecutiveShellCanonicalRoute,
});

// ─── Shell surface mounts (map to NEX-MVP:1 surfaces) ───────────────────────

export const NEXORA_EXECUTIVE_SHELL_MOUNTS = Object.freeze([
  "context-bar",
  "left-nav",
  "explorer-drawer",
  "stage",
  "stage-mount",
  "workspace-dial-mount",
  "advisor-insight",
  "timeline-dock",
  "status-bar",
  "floating-panel",
] as const);

export type NexoraExecutiveShellMount =
  (typeof NEXORA_EXECUTIVE_SHELL_MOUNTS)[number];

// ─── Application snapshot binding ───────────────────────────────────────────

export type NexoraExecutiveShellApplicationState = {
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly activeSurface: NexoraMVPSurface;
  readonly selectedSubject: NexoraMVPApplicationSnapshot["selectedSubject"];
  readonly focusedSubject: NexoraMVPApplicationSnapshot["focusedSubject"];
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
};

export function createInitialNexoraExecutiveShellApplicationState(): NexoraExecutiveShellApplicationState {
  const snapshot = createNexoraMVPApplication().snapshot;
  return Object.freeze({
    workspace: snapshot.workspace.kind,
    presentationState: snapshot.presentationState,
    activeSurface: snapshot.activeSurface,
    selectedSubject: snapshot.selectedSubject,
    focusedSubject: snapshot.focusedSubject,
    environmentIntent: snapshot.environmentIntent,
  });
}

export function deriveNexoraExecutiveShellApplicationState(
  workspace: NexoraMVPWorkspaceKind,
  presentationState: NexoraMVPPresentationState = "minimum",
): NexoraExecutiveShellApplicationState {
  return Object.freeze({
    workspace,
    presentationState,
    activeSurface: getNexoraMVPPrimarySurface(),
    selectedSubject: null,
    focusedSubject: null,
    environmentIntent: getNexoraMVPSceneEnvironmentIntent(workspace),
  });
}

export function getNexoraExecutiveShellWorkspaceOptions(): readonly {
  readonly kind: NexoraMVPWorkspaceKind;
  readonly label: string;
  readonly order: number;
}[] {
  return Object.freeze(
    NEXORA_MVP_WORKSPACE_REGISTRY.map((entry) =>
      Object.freeze({
        kind: entry.kind,
        label: entry.label,
        order: entry.order,
      }),
    ),
  );
}

// ─── Verification ───────────────────────────────────────────────────────────

export interface NexoraExecutiveShellVerification {
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly foundationDependencyValid: boolean;
  readonly primarySurfaceIsStage: boolean;
  readonly workspaceOrderValid: boolean;
  readonly initialStateValid: boolean;
  readonly mountsComplete: boolean;
  readonly noThreeJsStageClaim: boolean;
}

export function verifyNexoraExecutiveShell(options?: {
  readonly forceFailure?: boolean;
}): NexoraExecutiveShellVerification {
  const identity = getNexoraExecutiveShellIdentity();
  const foundation = getNexoraMVPApplicationIdentity();
  const initial = createInitialNexoraExecutiveShellApplicationState();
  const order = getNexoraMVPWorkspaceOrder();

  const identityValid =
    identity.id === "NEX-MVP:2/NexoraExecutiveShell" &&
    identity.version === "1.2.0" &&
    identity.namespace === "nexora.mvp.executive-shell" &&
    identity.phase === "ExecutiveShell" &&
    identity.architecturalRole === "MVPExecutiveExperienceShell";

  const foundationDependencyValid =
    nexoraExecutiveShellUpstreamIdentity ===
      "NEX-MVP:1/NexoraMVPApplicationFoundation" &&
    foundation.id === nexoraExecutiveShellUpstreamIdentity &&
    NEXORA_EXECUTIVE_SHELL_BOUNDARY.consumesMvpFoundationOnly === true &&
    NEXORA_EXECUTIVE_SHELL_BOUNDARY.bypassesFoundationIntoNexCi === false;

  const primarySurfaceIsStage = getNexoraMVPPrimarySurface() === "stage";

  const workspaceOrderValid =
    order.length === 5 &&
    order[0] === "overview" &&
    order[1] === "problem" &&
    order[2] === "scenario" &&
    order[3] === "decision" &&
    order[4] === "execution";

  const initialStateValid =
    initial.workspace === "overview" &&
    initial.presentationState === "minimum" &&
    initial.activeSurface === "stage" &&
    initial.selectedSubject === null &&
    initial.focusedSubject === null &&
    initial.environmentIntent === "neutral";

  const mountsComplete =
    NEXORA_EXECUTIVE_SHELL_MOUNTS.length === 10 &&
    new Set(NEXORA_EXECUTIVE_SHELL_MOUNTS).size === 10;

  const noThreeJsStageClaim =
    NEXORA_EXECUTIVE_SHELL_BOUNDARY.introducesThreeJsStage === false &&
    NEXORA_EXECUTIVE_SHELL_BOUNDARY.introducesReactThreeFiber === false &&
    NEXORA_EXECUTIVE_SHELL_BOUNDARY.introducesWorkspaceDialGeometry === false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    foundationDependencyValid &&
    primarySurfaceIsStage &&
    workspaceOrderValid &&
    initialStateValid &&
    mountsComplete &&
    noThreeJsStageClaim;

  return Object.freeze({
    ok,
    identityValid,
    foundationDependencyValid,
    primarySurfaceIsStage,
    workspaceOrderValid,
    initialStateValid,
    mountsComplete,
    noThreeJsStageClaim,
  });
}

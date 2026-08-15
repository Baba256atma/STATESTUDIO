/**
 * SP:4.3B — Executive True-2D Stage Authority.
 *
 * Product law:
 *   2D decides WHERE. 3D decides HOW IT LOOKS.
 *
 * Layout authority is Executive2DPosition {x,y} only.
 * R3F receives a constant render-plane Z — never topology depth.
 */

export const executiveTrue2DStageAuthorityIdentity =
  "SP:4.3B/ExecutiveTrue2DStageAuthority" as const;

export const executiveTrue2DStageAuthorityVersion = "4.3.2" as const;

export const executiveTrue2DStageAuthorityNamespace =
  "nexora.spatial-presentation.executive-true-2d-stage" as const;

export const executiveTrue2DStageAuthorityPhase =
  "ExecutiveTrue2DStageAuthority" as const;

export const executiveTrue2DStageAuthorityArchitecturalRole =
  "PresentationOnlyExecutiveTrue2DStageAuthority" as const;

export type ExecutiveTrue2DStageAuthorityIdentity = {
  readonly id: typeof executiveTrue2DStageAuthorityIdentity;
  readonly version: typeof executiveTrue2DStageAuthorityVersion;
  readonly namespace: typeof executiveTrue2DStageAuthorityNamespace;
  readonly phase: typeof executiveTrue2DStageAuthorityPhase;
  readonly architecturalRole: typeof executiveTrue2DStageAuthorityArchitecturalRole;
};

const IDENTITY: ExecutiveTrue2DStageAuthorityIdentity = Object.freeze({
  id: executiveTrue2DStageAuthorityIdentity,
  version: executiveTrue2DStageAuthorityVersion,
  namespace: executiveTrue2DStageAuthorityNamespace,
  phase: executiveTrue2DStageAuthorityPhase,
  architecturalRole: executiveTrue2DStageAuthorityArchitecturalRole,
});

export function getExecutiveTrue2DStageAuthorityIdentity(): ExecutiveTrue2DStageAuthorityIdentity {
  return IDENTITY;
}

export const EXECUTIVE_TRUE_2D_STAGE_BOUNDARY = Object.freeze({
  architecturalRole: executiveTrue2DStageAuthorityArchitecturalRole,
  layoutAuthority: "2d" as const,
  renderAuthority: "3d" as const,
  depthRolePositionEffect: 0 as const,
  zParticipatesInTopology: false as const,
  zParticipatesInCollision: false as const,
  zParticipatesInFocus: false as const,
  zCollisionEscapeForbidden: true as const,
  legacyXyzActiveAuthority: false as const,
  freeOrbit: false as const,
  cameraIsTopology: false as const,
});

/**
 * Architecture law — locked for SP:4.4+.
 */
export const EXECUTIVE_TRUE_2D_STAGE_LAW = Object.freeze({
  statement: "The Stage is 2D. The network is 2D. The objects are 3D.",
  layoutPositionShape: "{x,y}" as const,
  forbiddenLayoutPositionShape: "{x,y,z}" as const,
});

/**
 * Constant renderer-boundary depth for every Stage node anchor.
 * Not topology information — all anchors share this plane.
 */
export const EXECUTIVE_RENDER_PLANE_Z = 0 as const;

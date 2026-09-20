/**
 * NPA-T STAGE-PROD:1 — Live Stage Foundation identity.
 *
 * Production integration over the existing NEX-MVP Stage host.
 * Does not replace STAGE-PROD:1 Queue, NEX-MVP:3/4, DIR:1, DTH, DTH-EXP, or NMI.
 */

export const stageProdLiveFoundationIdentity =
  "NPA-T STAGE-PROD:1/LiveStageFoundation" as const;
export const stageProdLiveFoundationVersion = "1.0.0" as const;
export const stageProdLiveFoundationNamespace =
  "nexora.stage-prod.live-stage-foundation" as const;
export const stageProdLiveFoundationPhase = "STAGE-PROD:1" as const;
export const stageProdLiveFoundationArchitecturalRole =
  "LiveStageFoundationProjectionContract" as const;

export const stageProdLiveFoundationHostIdentity =
  "NEX-MVP:3/Nexora3DExecutiveStage" as const;
export const stageProdLiveFoundationMountName = "NexoraStageMount" as const;
export const stageProdLiveFoundationRoute = "/executive" as const;

export type StageProdLiveFoundationIdentity = {
  readonly id: typeof stageProdLiveFoundationIdentity;
  readonly version: typeof stageProdLiveFoundationVersion;
  readonly namespace: typeof stageProdLiveFoundationNamespace;
  readonly phase: typeof stageProdLiveFoundationPhase;
  readonly architecturalRole: typeof stageProdLiveFoundationArchitecturalRole;
};

const IDENTITY: StageProdLiveFoundationIdentity = Object.freeze({
  id: stageProdLiveFoundationIdentity,
  version: stageProdLiveFoundationVersion,
  namespace: stageProdLiveFoundationNamespace,
  phase: stageProdLiveFoundationPhase,
  architecturalRole: stageProdLiveFoundationArchitecturalRole,
});

export function getStageProdLiveFoundationIdentity(): StageProdLiveFoundationIdentity {
  return IDENTITY;
}

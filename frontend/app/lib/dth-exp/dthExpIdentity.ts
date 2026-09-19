/**
 * NPA-T DTH-EXP:1 — Theatre Foundation identity.
 *
 * Read/projection layer over existing Nexora authorities.
 * Does not own Stage, Director, Objects, Evidence, VAI, Decision, Execution, Outcome, or Learning.
 */

export const dthExpFoundationIdentity = "NPA-T DTH-EXP:1/TheatreFoundation" as const;
export const dthExpFoundationVersion = "1.0.0" as const;
export const dthExpFoundationNamespace = "nexora.dth-exp.theatre-foundation" as const;
export const dthExpFoundationPhase = "DTH-EXP:1" as const;
export const dthExpFoundationArchitecturalRole = "TheatreFoundationProjectionContract" as const;

export type DthExpFoundationIdentity = {
  readonly id: typeof dthExpFoundationIdentity;
  readonly version: typeof dthExpFoundationVersion;
  readonly namespace: typeof dthExpFoundationNamespace;
  readonly phase: typeof dthExpFoundationPhase;
  readonly architecturalRole: typeof dthExpFoundationArchitecturalRole;
};

const IDENTITY: DthExpFoundationIdentity = Object.freeze({
  id: dthExpFoundationIdentity,
  version: dthExpFoundationVersion,
  namespace: dthExpFoundationNamespace,
  phase: dthExpFoundationPhase,
  architecturalRole: dthExpFoundationArchitecturalRole,
});

export function getDthExpFoundationIdentity(): DthExpFoundationIdentity {
  return IDENTITY;
}

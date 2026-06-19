/**
 * W:1 — War Room Operational Layer certification contract.
 */

export const W1_WAR_ROOM_OPERATIONAL_CERTIFICATION_TAG = "[W1_WAR_ROOM_OPERATIONAL_CERTIFICATION]" as const;

export const W1_CERTIFIED_TAG = "[W1_CERTIFIED]" as const;

export const WAR_ROOM_OPERATIONAL_COMPLETE_TAG = "[WAR_ROOM_OPERATIONAL_COMPLETE]" as const;

export const W1_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[W1_CERTIFICATION_COMPLETE]" as const;

export const W1_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  W1_CERTIFIED_TAG,
  WAR_ROOM_OPERATIONAL_COMPLETE_TAG,
] as const);

export type WarRoomOperationalCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N";

export type WarRoomOperationalCertificationGate = Readonly<{
  id: WarRoomOperationalCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type WarRoomOperationalCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type WarRoomOperationalCertificationResult = Readonly<{
  tag: typeof W1_WAR_ROOM_OPERATIONAL_CERTIFICATION_TAG;
  version: "1.0.0";
  certified: boolean;
  diagnostics: readonly [typeof W1_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly WarRoomOperationalCertificationGate[];
  freezeTags: typeof W1_CERTIFICATION_FREEZE_TAGS;
}>;

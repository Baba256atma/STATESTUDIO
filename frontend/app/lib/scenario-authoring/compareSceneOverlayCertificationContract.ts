/**
 * C:2 — Compare Scene Overlay certification contract.
 */

export const C2_COMPARE_SCENE_OVERLAY_CERTIFICATION_TAG = "[C2_COMPARE_SCENE_OVERLAY_CERTIFICATION]" as const;

export const C2_CERTIFIED_TAG = "[C2_CERTIFIED]" as const;

export const COMPARE_SCENE_OVERLAY_COMPLETE_TAG = "[COMPARE_SCENE_OVERLAY_COMPLETE]" as const;

export const C2_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[C2_CERTIFICATION_COMPLETE]" as const;

export const C2_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  C2_CERTIFIED_TAG,
  COMPARE_SCENE_OVERLAY_COMPLETE_TAG,
] as const);

export type CompareSceneOverlayCertificationGateId =
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
  | "M";

export type CompareSceneOverlayCertificationGate = Readonly<{
  id: CompareSceneOverlayCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type CompareSceneOverlayCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type CompareSceneOverlayCertificationResult = Readonly<{
  tag: typeof C2_COMPARE_SCENE_OVERLAY_CERTIFICATION_TAG;
  version: "1.0.0";
  certified: boolean;
  diagnostics: readonly [typeof C2_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly CompareSceneOverlayCertificationGate[];
  freezeTags: typeof C2_CERTIFICATION_FREEZE_TAGS;
}>;

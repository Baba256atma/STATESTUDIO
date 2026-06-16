/**
 * DS:2:6 — Data Source Object Auto Creation certification contract.
 */

export const DS_2_6_OBJECT_AUTO_CREATION_CERTIFICATION_TAG =
  "[DS:2:6_OBJECT_AUTO_CREATION_CERTIFICATION]" as const;

export const DS2_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  "[DS2_CERTIFIED]",
  "[DATA_OBJECT_PIPELINE_COMPLETE]",
] as const);

export type DataSourceObjectAutoCreationCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J";

export type DataSourceObjectAutoCreationCertificationGate = Readonly<{
  id: DataSourceObjectAutoCreationCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type DataSourceObjectAutoCreationCertificationResult = Readonly<{
  tag: typeof DS_2_6_OBJECT_AUTO_CREATION_CERTIFICATION_TAG;
  version: "2.6.0";
  certified: boolean;
  gates: readonly DataSourceObjectAutoCreationCertificationGate[];
  freezeTags: typeof DS2_CERTIFICATION_FREEZE_TAGS;
}>;

/**
 * NXA:6-PREP — diagnosis record. Classifies a conversational defect.
 * Does not execute a Fix and does not own executive truth.
 */

export const nxaConversationDiagnosisIdentity =
  "NXA:6-PREP/ConversationDiagnosis" as const;

export const NXA_DIAGNOSIS_VERDICTS = Object.freeze([
  "REPRODUCED",
  "NOT_REPRODUCED",
  "ENVIRONMENT_BLOCKED",
  "INTERMITTENT",
  "EXPECTED_BEHAVIOR",
  "INSUFFICIENT_EVIDENCE",
] as const);

export type NxaDiagnosisVerdict = (typeof NXA_DIAGNOSIS_VERDICTS)[number];

export const NXA_FAILURE_CLASSES = Object.freeze([
  "deterministic",
  "intermittent",
  "environmental",
  "not_reproduced",
] as const);

export type NxaConversationDiagnosisRecord = Readonly<{
  identity: typeof nxaConversationDiagnosisIdentity;
  defectId: string;
  utteranceSequence: readonly string[];
  setup: string;
  currentFocus: string | null;
  activeCollection: string | null;
  journeyOrDialogue: string | null;
  refreshOrRestoration: string | null;
  expected: string;
  actual: string;
  firstDivergentLayer: string | null;
  authoritativeOwner: string | null;
  neighboringBehaviors: readonly string[];
  focusedReproductionCommand: string;
  failureClass: (typeof NXA_FAILURE_CLASSES)[number] | null;
  evidenceRequiredBeforeFix: readonly string[];
  verdict: NxaDiagnosisVerdict;
  fixAuthorized: false;
}>;

export function createConversationDiagnosis(
  input: Omit<NxaConversationDiagnosisRecord, "identity" | "fixAuthorized">,
): NxaConversationDiagnosisRecord {
  return Object.freeze({
    ...input,
    identity: nxaConversationDiagnosisIdentity,
    neighboringBehaviors: Object.freeze([...input.neighboringBehaviors]),
    utteranceSequence: Object.freeze([...input.utteranceSequence]),
    evidenceRequiredBeforeFix: Object.freeze([...input.evidenceRequiredBeforeFix]),
    fixAuthorized: false,
  });
}

export function mayBeginConversationalFix(
  record: NxaConversationDiagnosisRecord,
): boolean {
  return (
    record.verdict === "REPRODUCED" &&
    Boolean(record.firstDivergentLayer) &&
    Boolean(record.authoritativeOwner)
  );
}

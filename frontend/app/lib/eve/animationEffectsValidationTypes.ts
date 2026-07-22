export type AnimationEffectsValidationSeverity =
  | "Information" | "Advisory" | "Warning" | "Minor" | "Major" | "Critical";

export type AnimationEffectsValidationOutcome =
  | "Passed" | "PassedWithNotes" | "ReviewRequired" | "Deferred" | "Blocked"
  | "NotApplicable";

export interface AnimationEffectsValidationRule {
  readonly id: `EVE-7:4/Rule/${string}`;
  readonly name: string;
  readonly categoryReference: unknown;
  readonly description: string;
  readonly expectedOutcome: "Passed";
  readonly modelReference: "EVE-7:3/AnimationEffectsModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsValidationGate {
  readonly id: `EVE-7:4/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type IdentitySessionValidationCode =
  | "invalid_session_metadata"
  | "invalid_session_context"
  | "invalid_lifecycle"
  | "invalid_subject_identity"
  | "invalid_session_identity"
  | "invalid_scope"
  | "invalid_snapshot"
  | "invalid_timestamp";

export type IdentitySessionValidationIssue = Readonly<{
  code: IdentitySessionValidationCode;
  field: string;
  message: string;
  severity: "error";
}>;

export type IdentitySessionValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentitySessionValidationIssue[];
}>;

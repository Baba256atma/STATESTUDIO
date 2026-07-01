export type IdentityAuditValidationCode =
  | "invalid_audit_event"
  | "invalid_audit_action"
  | "invalid_lifecycle"
  | "invalid_actor"
  | "invalid_target"
  | "invalid_scope"
  | "invalid_session_reference"
  | "duplicate_audit_event"
  | "invalid_timestamp";

export type IdentityAuditValidationIssue = Readonly<{
  code: IdentityAuditValidationCode;
  field: string;
  message: string;
  severity: "error";
}>;

export type IdentityAuditValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentityAuditValidationIssue[];
}>;

export type IdentityAuthorizationValidationCode =
  | "invalid_request"
  | "missing_identity"
  | "missing_scope"
  | "invalid_action"
  | "invalid_resource"
  | "inactive_role"
  | "inactive_permission"
  | "duplicate_permission"
  | "invalid_decision";

export type IdentityAuthorizationValidationIssue = Readonly<{
  code: IdentityAuthorizationValidationCode;
  field: string;
  message: string;
  severity: "error";
}>;

export type IdentityAuthorizationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentityAuthorizationValidationIssue[];
}>;

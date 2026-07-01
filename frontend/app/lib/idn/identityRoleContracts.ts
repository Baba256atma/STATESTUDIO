export type IdentityRoleValidationCode =
  | "invalid_role_definition"
  | "invalid_role_assignment"
  | "missing_subject_identity"
  | "missing_scope_identity"
  | "invalid_scope_level"
  | "duplicate_role_assignment"
  | "illegal_role_scope"
  | "invalid_lifecycle_state"
  | "broken_scope_reference";

export type IdentityRoleValidationIssue = Readonly<{
  code: IdentityRoleValidationCode;
  field: string;
  message: string;
  severity: "error";
}>;

export type IdentityRoleValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentityRoleValidationIssue[];
}>;

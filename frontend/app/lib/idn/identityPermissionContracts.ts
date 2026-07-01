export type IdentityPermissionValidationCode =
  | "invalid_permission_definition"
  | "invalid_permission_assignment"
  | "invalid_action"
  | "invalid_resource"
  | "missing_subject"
  | "invalid_subject_type"
  | "invalid_scope"
  | "duplicate_assignment"
  | "invalid_lifecycle"
  | "broken_role_reference"
  | "broken_identity_reference";

export type IdentityPermissionValidationIssue = Readonly<{
  code: IdentityPermissionValidationCode;
  field: string;
  message: string;
  severity: "error";
}>;

export type IdentityPermissionValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentityPermissionValidationIssue[];
}>;

export type IdentityScopeValidationCode =
  | "missing_owner"
  | "invalid_parent"
  | "invalid_scope_level"
  | "illegal_containment"
  | "circular_ownership"
  | "broken_ancestry"
  | "duplicate_ownership"
  | "scope_path_inconsistent"
  | "orphaned_identity"
  | "invalid_cross_tenant"
  | "invalid_identity";

export type IdentityScopeValidationIssue = Readonly<{
  code: IdentityScopeValidationCode;
  field: string;
  message: string;
  severity: "error";
}>;

export type IdentityScopeValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentityScopeValidationIssue[];
}>;

export type IdentityScopeGraphValidation = IdentityScopeValidationResult;

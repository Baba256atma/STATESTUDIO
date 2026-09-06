# BCA:5 manager-context precedence

1. **Manager-confirmed roles** (`managerConfirmedRoles`) win over title maps. Multiple entries are all kept.
2. **Exact canonical titles** on BCA:1 `managerContext.roleLabel` or `rawTitles` map only when confirmation is absent.
3. **Ambiguous exact titles** (`delivery manager`) stay AMBIGUOUS / UNKNOWN family.
4. **Unknown** is valid. Goal labels may still select operational concepts. Role is not fabricated.
5. **Conversation concern** adds `decisionContextAreas` (e.g. PROJECT/SCHEDULE). It does not replace `roleFamily`.
6. **Conversation interest** (e.g. “show me gross margin”) never infers FINANCE/CFO when role is unknown.
7. **Hybrid BCA:1 kind** adds BUSINESS and PROJECT areas without merging concept aspects.
8. **Session never outranks durable role.** `durableRoleUnchangedBySession` is always true; there is no profile writer.

Source isolation: only source refs from the supplied context, role records, and relevant concepts are copied. Unrelated manager/company source-context ids do not leak.

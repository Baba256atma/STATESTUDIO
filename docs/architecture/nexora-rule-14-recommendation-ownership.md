# Nexora Rule #14 — Recommendation Ownership Contract

**Status:** REQUIRED — constitutional runtime governance  
**Version:** 1.0  
**Freeze tag:** `[NEXORA_RULE_14_ACTIVE]`  
**Runtime guard:** `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]`

**Authority:** `docs/nexora-constitution.md` — Rule #14

**Scope:** Permanent separation of recommendation, approval, and commitment ownership across Scenario, War Room, Advisory, and Governance domains. No workspace may violate this boundary.

---

## 1. Purpose

Executive decision systems fail when War Room issues recommendations, Advisory commits actions, or Governance bypasses approval workflow. Rule #14 makes **recommendation ownership** explicit, testable, and certifiable.

**War Room owns commitment. Advisory owns recommendation. Governance owns approval.**

---

## 2. Domain Ownership Mandates

### Scenario — Possibility

**Answers:** What could happen?

**MAY NOT:**

- Issue recommendations
- Approve decisions
- Commit actions

---

### War Room — Commitment

**Answers:** What are we going to do?

**MAY:**

- Select strategy
- Create action plans
- Track execution status
- Monitor active decisions

**MAY NOT:**

- Issue recommendations
- Approve decisions

---

### Advisory — Recommendation

**Answers:** What do I recommend?

**MAY:**

- Generate recommendations
- Rank alternatives
- Suggest guidance
- Evaluate tradeoffs

**MAY NOT:**

- Approve decisions
- Commit actions

---

### Governance — Approval

**Answers:** Is this approved?

**MAY:**

- Approve decisions
- Reject decisions
- Escalate approval
- Record approval status

**MAY NOT:**

- Issue recommendations
- Commit actions

---

## 3. Runtime Enforcement

### Guard modules

| Item | Location |
|------|----------|
| Contract | `frontend/app/lib/ui/mrpWorkspace/governance/nexoraRule14RecommendationOwnershipContract.ts` |
| Runtime | `frontend/app/lib/ui/mrpWorkspace/governance/nexoraRule14RecommendationOwnershipRuntime.ts` |
| Tests | `frontend/app/lib/ui/mrpWorkspace/nexoraRule14RecommendationOwnership.test.ts` |

### Primary APIs

| Function | Role |
|----------|------|
| `guardNexoraRule14RecommendationOwnership()` | Block forbidden recommendation/approval/commitment violations |
| `guardAdvisoryRecommendationAction()` | Advisory recommendation allow guard |
| `guardGovernanceApprovalAction()` | Governance approval allow guard |
| `guardWarRoomRecommendationOwnershipAction()` | War Room commitment allow + recommendation/approval block |
| `guardWorkspaceRecommendationOwnershipViolation()` | Certified workspace violation guard |
| `verifyNexoraRule14CertificationCompliance()` | Certification gate per actor |
| `traceNexoraRule14ActiveOnce()` | Active freeze trace |

### Validation must block

| Violation | Blocked behavior |
|-----------|------------------|
| Non-Advisory recommendation | Any workspace or Governance issuing recommendations |
| Non-Governance approval | Any workspace, Advisory, or War Room approving decisions |
| Non-War Room commitment | Any workspace, Advisory, or Governance committing actions |

**Brake trace:** `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]`  
**Active trace:** `[NEXORA_RULE_14_ACTIVE]`

---

## 4. Certification Requirement

All workspace, Advisory, and Governance certifications must verify `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]`.

```typescript
import { verifyNexoraRule14CertificationCompliance } from "./governance/nexoraRule14RecommendationOwnershipRuntime.ts";

const result = verifyNexoraRule14CertificationCompliance("advisory");
// result.compliant must be true before certification PASS
```

Include Rule #14 attestation in certification reports:

```markdown
| Rule #14 Recommendation Ownership | **PASS** — `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]` verified |
```

---

## 5. Relationship to Rules #11–#13

| Rule | Focus |
|------|-------|
| **Rule #11** | Executive decision domain boundaries (past / futures / action) |
| **Rule #12** | MRP intelligence authority vs Assistant conversation |
| **Rule #13** | Commitment ownership (history / possibility / commitment) |
| **Rule #14** | Recommendation ownership (recommendation / approval / commitment separation) |

All four rules are required for constitutional compliance.

---

## 6. Freeze Activation

```text
[NEXORA_RULE_14_ACTIVE]
[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]
```

**Effective immediately:**

- War Room owns commitment
- Advisory owns recommendation
- Governance owns approval
- No workspace may violate this boundary

Structural recommendation ownership changes require explicit constitutional amendment.

---

## 7. Related Documents

| Document | Role |
|----------|------|
| `docs/nexora-constitution.md` | Rule #14 constitutional authority |
| `docs/architecture/nexora-rule-11-executive-decision-boundary.md` | Executive workspace decision boundaries |
| `docs/architecture/nexora-rule-12-intelligence-ownership.md` | Intelligence vs conversation ownership |
| `docs/architecture/nexora-rule-13-commitment-ownership.md` | Commitment ownership |
| `docs/architecture/constitutional-compliance.md` | Certification enforcement |
| `docs/ai-context/nexora-core-rules.md` | AI agent enforcement layer |

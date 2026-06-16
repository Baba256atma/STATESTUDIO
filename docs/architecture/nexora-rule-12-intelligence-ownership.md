# Nexora Rule #12 — Intelligence Ownership Contract

**Status:** REQUIRED — constitutional runtime governance  
**Version:** 1.0  
**Freeze tag:** `[NEXORA_RULE_12_ACTIVE]`  
**Runtime guard:** `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]`

**Authority:** `docs/nexora-constitution.md` — Rule #12

**Scope:** Permanent separation between Executive Intelligence (MRP certified workspaces) and Executive Conversation (Assistant). Enforced for all current and future Assistant behavior and certifications.

---

## 1. Purpose

Nexora is an Executive Decision Intelligence System. Intelligence must originate from **certified MRP workspaces**. Conversation must originate from the **Assistant**.

Collapsing these roles causes constitutional failure: the Assistant invents scores, overrides workspace conclusions, bypasses simulation, and becomes an unauthorized decision authority.

Rule #12 makes the separation explicit, testable, and certifiable.

**MRP owns intelligence. Assistant owns conversation.**

---

## 2. Intelligence Ownership (MRP)

MRP is the authoritative source of executive intelligence.

### Certified intelligence workspaces

| Workspace | Decision question |
|-----------|-------------------|
| Executive Summary | What is happening? |
| Operational | How is it operating? |
| Risk | What can go wrong? |
| Timeline | What happened before? |
| Scenario | What could happen next? |
| War Room | What should we do now? |
| Future certified workspaces | Certified workspace signal |

Workspace intelligence is **authoritative**. The Assistant consumes it — never replaces it.

---

## 3. Assistant Ownership (Conversation)

The Assistant is responsible for executive conversation — not intelligence authority.

**Assistant owns:**

- Executive explanations
- Executive discussion
- Executive guidance
- Executive questioning
- Executive learning support
- Executive clarification

**Assistant answers:**

- Explain this.
- Why?
- How?
- What does this mean?
- What should I review?

The Assistant **translates** certified workspace intelligence into human language.

---

## 4. Assistant Authority Limits

### Assistant MAY

| Action | Description |
|--------|-------------|
| Read workspace intelligence | Consume certified workspace outputs |
| Explain workspace intelligence | Translate intelligence into executive language |
| Summarize workspace intelligence | Condense without altering authority |
| Compare workspace intelligence | Discuss differences across certified sources |
| Discuss workspace intelligence | Support executive learning and review |

### Assistant MAY NOT

| Violation | Description |
|-----------|-------------|
| Replace workspace intelligence | Present Assistant output as authoritative intelligence |
| Invent workspace intelligence | Generate scores, forecasts, or conclusions without workspace grounding |
| Override workspace intelligence | Contradict or supersede certified workspace outputs |
| Execute workspace decisions | Commit or execute actions owned by War Room |
| Act as decision authority | Become an independent decision engine |

---

## 5. Runtime Flow

```text
Executive Workspace
        ↓
Certified Intelligence
        ↓
Assistant Reads
        ↓
Assistant Explains
        ↓
Executive Understands
```

**Assistant never bypasses workspace intelligence.**

---

## 6. Runtime Enforcement

### Guard modules

| Item | Location |
|------|----------|
| Contract | `frontend/app/lib/ui/mrpWorkspace/governance/nexoraRule12IntelligenceOwnershipContract.ts` |
| Runtime | `frontend/app/lib/ui/mrpWorkspace/governance/nexoraRule12IntelligenceOwnershipRuntime.ts` |
| Assistant boundary | `frontend/app/lib/assistant/assistantRule12BoundaryRuntime.ts` |
| Tests | `frontend/app/lib/ui/mrpWorkspace/nexoraRule12IntelligenceOwnership.test.ts` · `frontend/app/lib/assistant/assistantRule12Boundary.test.ts` |

### Primary APIs

| Function | Role |
|----------|------|
| `guardNexoraRule12IntelligenceOwnership()` | Block forbidden Assistant intelligence violations |
| `guardAssistantIntelligenceAction()` | Allow grounded read/explain/summarize/compare/discuss actions |
| `guardAssistantForbiddenIntelligenceAction()` | Assistant-specific blocked action mapping |
| `verifyNexoraRule12CertificationCompliance()` | Certification gate for Assistant phases |
| `traceNexoraRule12ActiveOnce()` | Active freeze trace |

### Validation must block

| Failure | Blocked behavior |
|---------|------------------|
| Unsupported risk scores | Assistant generating risk intelligence without Risk workspace grounding |
| Unsupported scenario forecasts | Assistant generating futures without Scenario workspace grounding |
| Override workspace conclusions | Assistant superseding certified workspace outputs |
| Decision authority | Assistant executing decisions or acting as independent authority |
| Intelligence bypass | Assistant explaining without workspace grounding |

**Brake trace:** `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]`  
**Active trace:** `[NEXORA_RULE_12_ACTIVE]`

---

## 7. Certification Requirement

All future **Assistant certifications** must verify compliance with `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]`.

Certification **fails** if Assistant owns intelligence or bypasses certified workspace authority.

### Certification check

```typescript
import { verifyNexoraRule12CertificationCompliance } from "./governance/nexoraRule12IntelligenceOwnershipRuntime.ts";

const result = verifyNexoraRule12CertificationCompliance();
// result.compliant must be true before Assistant certification PASS
```

Include Rule #12 attestation in every Assistant certification report:

```markdown
| Rule #12 Intelligence Ownership | **PASS** — `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]` verified |
```

Reference: `docs/architecture/constitutional-compliance.md`

---

## 8. Integration Rules

While `[NEXORA_RULE_12_ACTIVE]` is active:

1. **Do** generate intelligence inside certified MRP workspaces only.
2. **Do** require workspace grounding before Assistant explains, summarizes, compares, or discusses intelligence.
3. **Do** call `guardAssistantIntelligenceAction()` before Assistant intelligence-facing actions.
4. **Do** call `guardAssistantForbiddenIntelligenceAction()` before any Assistant output that could invent or override intelligence.
5. **Do not** allow Assistant to generate unsupported risk scores or scenario forecasts.
6. **Do not** allow Assistant to override workspace conclusions or execute workspace decisions.
7. **Do not** treat Assistant conversation output as authoritative intelligence.

---

## 9. Relationship to Rule #11

| Rule | Separation |
|------|------------|
| **Rule #11** | Timeline / Scenario / War Room **decision domain** boundaries |
| **Rule #12** | MRP workspace **intelligence authority** vs Assistant **conversation** |

Rule #11 governs what each executive workspace may decide. Rule #12 governs who may **own** intelligence versus who may **explain** it. Rule #13 governs who may **own commitment** across Timeline, Scenario, and War Room.

Rules #11, #12, and #13 are required for constitutional compliance.

---

## 10. Freeze Activation

```text
[NEXORA_RULE_12_ACTIVE]
[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]
```

**Effective immediately:**

- MRP owns intelligence
- Assistant owns conversation
- Assistant consumes intelligence — never owns it

Structural ownership changes require explicit constitutional amendment — not local Assistant exceptions.

---

## 11. Related Documents

| Document | Role |
|----------|------|
| `docs/nexora-constitution.md` | Rule #12 constitutional authority |
| `docs/architecture/constitutional-compliance.md` | Certification enforcement |
| `docs/architecture/nexora-rule-11-executive-decision-boundary.md` | Executive workspace decision boundaries |
| `docs/architecture/nexora-rule-13-commitment-ownership.md` | History / possibility / commitment ownership |
| `docs/scenario-workspace-certification-report.md` | Scenario workspace intelligence certification |
| `docs/ai-context/nexora-core-rules.md` | AI agent enforcement layer |

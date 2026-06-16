# Nexora Rule #11 — Executive Decision Boundary Contract

**Status:** REQUIRED — constitutional runtime governance  
**Version:** 1.0  
**Freeze tag:** `[NEXORA_RULE_11_ACTIVE]`  
**Runtime guard:** `[NEXORA_RULE_11_BOUNDARY]`

**Authority:** `docs/nexora-constitution.md` — Rule #11

**Scope:** Permanent architectural boundary between Timeline Workspace, Scenario Workspace, and War Room Workspace. Enforced for all current and future MRP workspaces.

---

## 1. Purpose

Nexora separates **understanding the past**, **exploring possible futures**, and **committing to action** into three executive workspaces. Collapsing these domains causes constitutional failure: history gets rewritten, simulations commit decisions, and action surfaces predict without evidence.

Rule #11 makes the boundary explicit, testable, and certifiable.

---

## 2. Workspace Mandates

### Timeline Workspace — Past

Timeline explains the past.

**Responsible for:**

- Historical events
- Historical object state changes
- Historical decisions
- Historical risk events
- Historical operational trends
- Historical scenario outcomes

**MUST NOT:**

- Predict future outcomes
- Generate alternative futures
- Recommend actions
- Commit decisions

**Decision question:** What happened?

---

### Scenario Workspace — Possible Futures

Scenario explores possible futures.

**Responsible for:**

- Alternative futures
- Future simulations
- Decision comparison
- Impact forecasting
- Risk forecasting
- Outcome probability analysis

**MUST NOT:**

- Rewrite historical records
- Modify timeline history
- Execute decisions
- Commit actions

**Decision question:** What could happen?

---

### War Room Workspace — Action

War Room commits to action.

**Responsible for:**

- Decision execution
- Strategy selection
- Operational response plans
- Action tracking
- Executive command surfaces
- Monitoring active decisions

**MUST NOT:**

- Alter historical records
- Rewrite timeline events
- Simulate futures without Scenario ownership

**Decision question:** What should we do now?

---

## 3. Workspace Ownership Matrix

| Capability | Timeline | Scenario | War Room |
|------------|----------|----------|----------|
| Historical Analysis | **OWNER** | FORBIDDEN | FORBIDDEN |
| Future Simulation | FORBIDDEN | **OWNER** | CONSUMER |
| Decision Execution | FORBIDDEN | FORBIDDEN | **OWNER** |
| Risk Forecast | FORBIDDEN | **OWNER** | CONSUMER |
| Historical Trend Analysis | **OWNER** | READ ONLY | READ ONLY |
| Active Strategy Tracking | FORBIDDEN | READ ONLY | **OWNER** |

---

## 4. Runtime Enforcement

### Guard module

| Item | Location |
|------|----------|
| Contract | `frontend/app/lib/ui/mrpWorkspace/governance/nexoraRule11BoundaryContract.ts` |
| Runtime | `frontend/app/lib/ui/mrpWorkspace/governance/nexoraRule11BoundaryRuntime.ts` |
| Tests | `frontend/app/lib/ui/mrpWorkspace/nexoraRule11Boundary.test.ts` |

### Primary APIs

| Function | Role |
|----------|------|
| `guardNexoraRule11Boundary()` | Block forbidden cross-domain actions |
| `guardExecutiveWorkspacePanelRender()` | Block Timeline rendering Scenario/War Room panels |
| `guardExecutiveWorkspaceCapability()` | Enforce ownership matrix by capability + intent |
| `verifyNexoraRule11CertificationCompliance()` | Certification gate for MRP workspace phases |

### Validation must block

| Violation | Blocked action |
|-----------|----------------|
| Timeline → Scenario panel | Timeline rendering Scenario panels |
| Timeline → War Room panel | Timeline rendering War Room panels |
| Scenario decision commit | Scenario executing decisions |
| Scenario history write | Scenario modifying historical records |
| War Room history write | War Room modifying Timeline history |
| War Room simulation own | War Room owning simulation generation |

**Brake trace:** `[NEXORA_RULE_11_BOUNDARY]`  
**Active trace:** `[NEXORA_RULE_11_ACTIVE]`

---

## 5. Certification Requirement

All future MRP workspace certifications must verify compliance with `[NEXORA_RULE_11_BOUNDARY]`.

Certification **fails** if any workspace crosses its ownership boundary.

### Certification check

```typescript
import { verifyNexoraRule11CertificationCompliance } from "./governance/nexoraRule11BoundaryRuntime.ts";

const result = verifyNexoraRule11CertificationCompliance("timeline");
// result.compliant must be true before certification PASS
```

Include Rule #11 attestation in every workspace certification report:

```markdown
| Rule #11 Executive Decision Boundary | **PASS** — `[NEXORA_RULE_11_BOUNDARY]` verified |
```

Reference: `docs/architecture/constitutional-compliance.md`

---

## 6. Integration Rules

While `[NEXORA_RULE_11_ACTIVE]` is active:

1. **Do** route past intelligence through Timeline workspace only.
2. **Do** route simulation and forecasting through Scenario workspace only.
3. **Do** route decision execution and active strategy through War Room workspace only.
4. **Do** call `guardNexoraRule11Boundary()` before any cross-domain panel render or capability action.
5. **Do not** embed Scenario or War Room panels inside Timeline workspace hosts.
6. **Do not** allow War Room to generate simulations without Scenario ownership.
7. **Do not** allow Scenario or War Room to mutate timeline history.

---

## 7. Freeze Activation

```text
[NEXORA_RULE_11_ACTIVE]
[NEXORA_RULE_11_BOUNDARY]
```

**Effective immediately:**

- Timeline = Past
- Scenario = Possible Futures
- War Room = Action

Structural boundary changes require explicit constitutional amendment — not local workspace exceptions.

---

## 8. Related Documents

| Document | Role |
|----------|------|
| `docs/nexora-constitution.md` | Rule #11 constitutional authority |
| `docs/architecture/constitutional-compliance.md` | Certification enforcement |
| `docs/timeline-workspace-certification-report.md` | Timeline Rule #11 attestation |
| `docs/risk-workspace-certification-report.md` | Risk workspace (outside Rule #11 triad) |
| `docs/ai-context/nexora-core-rules.md` | AI agent enforcement layer |
| `docs/architecture/nexora-rule-12-intelligence-ownership.md` | MRP intelligence vs Assistant conversation ownership |
| `docs/architecture/nexora-rule-13-commitment-ownership.md` | History / possibility / commitment ownership |

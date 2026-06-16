# Constitutional Compliance

**Status:** Enforcement and review governance.

**Authority:** Subordinate to and derived from `docs/nexora-constitution.md`.

**Scope:** Development workflow integration, compliance evaluation, and phase-gate review for all Nexora work.

This document defines how the Nexora Constitution is enforced in practice. It applies to feature design, architecture changes, UI work, engine development, topology integration, and AI behavior.

**Related documents:**

- `docs/nexora-constitution.md` — foundational product authority
- `docs/ai-context/nexora-core-rules.md` — AI agent enforcement layer (Cursor/Codex)

---

## 1. Purpose

The Constitution defines what Nexora is and what it must never become. This document defines **how compliance is verified** before work merges or ships.

Every contributor—human or AI-assisted—must evaluate proposed work against the Constitution. Compliance is not optional documentation; it is a release gate.

---

## 2. Constitutional Compliance Checklist

Every future feature, phase, or significant change must answer the following questions **before** implementation begins and **again** before merge or release.

### Primary Checklist

| # | Question | Pass Criteria |
|---|----------|---------------|
| 1 | **Does it support executive decision making?** | Feature is tied to a concrete decision question (*What is at risk? What should we prioritize? What happens if we act?*). It helps managers understand, simulate, or decide—not merely observe. |
| 2 | **Does it respect Scene First architecture?** | The Scene remains the primary interface. Situational awareness flows through object behavior and visual state. Scene, MRP, and Assistant roles are not collapsed. |
| 3 | **Does it respect Object-Centric navigation?** | Executive path flows from object selection and situational context—not from menu hierarchies, tab forests, or hidden routes. |
| 4 | **Does it preserve Context visibility?** | Panel Name, Active Mode, Selected Object Context, and Return Navigation remain visible and synchronized across Scene, MRP, and Assistant. |
| 5 | **Does it reduce or increase executive cognitive load?** | Cognitive load is reduced or held neutral. Any increase requires explicit constitutional review and approval. |
| 6 | **Does it support Simulation Before Recommendation?** | Simulated futures and system analysis precede recommendations. AI and Assistant outputs are grounded in Nexora-generated intelligence. |

### Secondary Checklist

Apply these alongside the primary checklist for full compliance:

| Area | Question | Pass Criteria |
|------|----------|---------------|
| MRP | Does MRP remain Dashboard + Assistant only? | No new tabs, no navigation maze, no settings hub behavior. |
| Objects | Are all Scene objects informational? | No decorative objects without situational meaning. |
| Insights | Are insights actionable? | No dead dashboards; every insight connects to action, simulation, or analysis. |
| Narrative | Is the screen coherent? | One screen, one story; no competing narratives on a single view. |
| Assistant | Does Assistant explain rather than replace? | Assistant discusses analysis and simulation—it does not substitute for them. |

### Checklist Outcomes

| Result | Action |
|--------|--------|
| All primary questions **Yes** | Proceed with implementation; re-verify at merge gate. |
| Any primary question **No** | Redesign or reject. Do not implement. |
| Any primary question **Unclear** | Resolve in design review before coding. |
| Cognitive load **Increase** | Escalate to Constitutional Review Process (Section 5). |

---

## 3. Constitutional Violation Examples

The examples below illustrate common violations. They are intended for design review, code review, and AI agent guardrails.

### Example 1: Adding 15 Tabs to MRP

| Field | Detail |
|-------|--------|
| **Violation** | Expanding MRP with numerous tabs (Reports, Alerts, Settings, Users, etc.) |
| **Rules broken** | MRP contains only Dashboard + Assistant; Never overwhelm the executive; Navigate by objects, not menus |
| **Why it fails** | MRP becomes a navigation maze. Executives lose situational focus and context visibility. |
| **Compliant alternative** | Route contexts through Left Nav and Dashboard Context. Keep MRP to Dashboard (Insight) and Assistant. |

### Example 2: Turning Objects into Decorative Graphics

| Field | Detail |
|-------|--------|
| **Violation** | Scene objects added for visual polish without encoding risk, status, priority, or relationships |
| **Rules broken** | Objects are information; Scene is the primary interface |
| **Why it fails** | Scene ceases to communicate situational intelligence. Objects become wallpaper. |
| **Compliant alternative** | Bind object behavior and visual state to operational data and executive signals. |

### Example 3: Showing Charts Without Actionable Outcomes

| Field | Detail |
|-------|--------|
| **Violation** | Dashboard or MRP surfaces KPIs and charts with no simulate, act, or discuss path |
| **Rules broken** | No dead dashboards; Every view answers a decision question |
| **Why it fails** | Executives receive data without decision support. Insights terminate in display. |
| **Compliant alternative** | Link every chart to a decision action—simulate, select related objects, open grounded Assistant discussion, or route to a scenario workspace. |

### Example 4: Hiding Selected Object Context

| Field | Detail |
|-------|--------|
| **Violation** | Selection cleared on navigation, object context omitted from MRP/Assistant, or scope not visible to the executive |
| **Rules broken** | Context is king; Object-Centric navigation |
| **Why it fails** | Executives lose track of what they are analyzing. Cross-panel coherence breaks down. |
| **Compliant alternative** | Persist and display selected object context across Scene, MRP, and Assistant until explicitly changed. |

### Example 5: Replacing Simulation with Direct AI Recommendations

| Field | Detail |
|-------|--------|
| **Violation** | Assistant or UI recommends actions without presenting simulated futures or Nexora analysis first |
| **Rules broken** | Simulation before recommendation; Assistant does not replace analysis |
| **Why it fails** | Recommendations appear authoritative without evidence. AI bypasses the decision intelligence pipeline. |
| **Compliant alternative** | Generate simulation and analysis first; Assistant explains outputs and supports decision discussion. |

---

## 4. Protected Architecture (DO NOT BREAK)

The following protections apply to all development—including AI-assisted changes. See `docs/ai-context/nexora-core-rules.md` for agent-specific enforcement.

| Protection | Requirement |
|------------|-------------|
| **Dashboard + Assistant architecture** | MRP contains only Dashboard (Insight) and Assistant. No tab expansion without constitutional amendment. |
| **Scene First architecture** | Scene is the primary interface. Scene shows; MRP explains; Assistant discusses. |
| **Object-Centric navigation** | Executive path flows from objects, not menus or tab hierarchies. |
| **Context visibility** | Panel Name, Active Mode, Selected Object Context, and Return Navigation always preserved. |
| **Simulation Before Recommendation** | Futures and analysis precede recommendations. No direct AI shortcuts. |
| **Executive simplicity** | Cognitive load managed actively. One screen, one story. Never overwhelm. |
| **Executive Decision Boundary (Rule #11)** | Timeline = past. Scenario = possible futures. War Room = action. Cross-domain ownership violations blocked by `[NEXORA_RULE_11_BOUNDARY]`. |
| **Intelligence Ownership (Rule #12)** | MRP owns intelligence. Assistant owns conversation. Assistant must consume certified workspace intelligence — never replace, invent, or override it. Enforced by `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]`. |
| **Commitment Ownership (Rule #13)** | Timeline owns history. Scenario owns possibility. War Room owns commitment. Cross-workspace commitment violations blocked by `[NEXORA_RULE_13_COMMITMENT_OWNERSHIP]`. |
| **Recommendation Ownership (Rule #14)** | War Room owns commitment. Advisory owns recommendation. Governance owns approval. Cross-domain recommendation, approval, and commitment violations blocked by `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]`. |

Any change that breaks a protected area requires Constitutional Review (Section 5)—not a local workaround.

---

## 5. Constitutional Review Process

Every major phase must be reviewed against the Constitution **before merge or release**. This process is mandatory, not advisory.

### 5.1 When Review Is Required

Constitutional review is required for:

- New features or workspaces touching Scene, MRP, or Assistant
- Navigation, routing, or panel architecture changes
- AI/Assistant behavior or recommendation flows
- Simulation engine or decision-support pipeline changes
- Topology or Scene integration work
- Any change that increases information density or UI surface area
- Phase completion reports and certification milestones

Constitutional review is **recommended** for bug fixes that touch protected architecture (Section 4).

### 5.2 Review Stages

```text
Design → Checklist → Implementation → Pre-Merge Review → Release Gate
```

| Stage | Activity | Owner |
|-------|----------|-------|
| **Design** | Complete Constitutional Compliance Checklist (Section 2). Document decision question, context impact, and cognitive load assessment. | Feature owner |
| **Checklist gate** | Primary checklist must pass before implementation starts. Block on **No** or **Unclear**. | Feature owner + reviewer |
| **Implementation** | Respect DO NOT BREAK protections. AI agents follow `docs/ai-context/nexora-core-rules.md`. | Implementer |
| **Pre-merge review** | Re-run primary checklist against actual diff. Compare against Violation Examples (Section 3). | Reviewer |
| **Release gate** | Confirm no constitutional regressions in phase scope. Attach compliance attestation to phase report. | Phase owner |

### 5.3 Review Deliverables

For each major phase, produce a brief compliance attestation:

```markdown
## Constitutional Compliance Attestation

**Phase:** [phase name / PR reference]
**Reviewer:** [name or role]
**Date:** [YYYY-MM-DD]

### Checklist Results
- [ ] Executive decision making supported
- [ ] Scene First architecture respected
- [ ] Object-Centric navigation respected
- [ ] Context visibility preserved
- [ ] Cognitive load reduced or neutral
- [ ] Simulation Before Recommendation supported

### Violation Scan
- [ ] No MRP tab expansion
- [ ] No decorative-only objects
- [ ] No dead dashboards
- [ ] No hidden object context
- [ ] No direct AI recommendations bypassing simulation

### Outcome
- [ ] Approved for merge/release
- [ ] Redesign required
- [ ] Constitutional amendment required
```

### 5.4 Escalation Paths

| Situation | Action |
|-----------|--------|
| Checklist failure at design | Redesign before implementation. |
| Protected architecture conflict | Stop work. Escalate to architecture review. |
| Legitimate need to violate a rule | Formal constitutional amendment to `docs/nexora-constitution.md`—not a code exception. |
| AI agent proposes non-compliant change | Reject proposal. Refer agent to `docs/ai-context/nexora-core-rules.md`. |

### 5.5 Integration with Phase Reports

Existing phase certification reports (e.g. `docs/nexora-phase*-certification-report.md`) must include a Constitutional Compliance Attestation section before the phase is considered complete.

**Rule #11 gate (required for Timeline, Scenario, and War Room certifications):**

Every MRP workspace certification for Timeline, Scenario, or War Room must verify `[NEXORA_RULE_11_BOUNDARY]` compliance via `verifyNexoraRule11CertificationCompliance()`. Certification **fails** if any workspace crosses its ownership boundary. Reference: `docs/architecture/nexora-rule-11-executive-decision-boundary.md`.

**Rule #12 gate (required for all Assistant certifications):**

Every Assistant certification must verify `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]` compliance via `verifyNexoraRule12CertificationCompliance()`. Certification **fails** if Assistant owns intelligence, bypasses certified workspace authority, or acts as a decision authority. Reference: `docs/architecture/nexora-rule-12-intelligence-ownership.md`.

**Rule #13 gate (required for Timeline, Scenario, and War Room certifications):**

Every MRP workspace certification for Timeline, Scenario, or War Room must verify `[NEXORA_RULE_13_COMMITMENT_OWNERSHIP]` compliance via `verifyNexoraRule13CertificationCompliance()`. Certification **fails** if any workspace violates commitment ownership. Reference: `docs/architecture/nexora-rule-13-commitment-ownership.md`.

**Rule #14 gate (required for all workspace, Advisory, and Governance certifications):**

Every certification touching recommendation, approval, or commitment flows must verify `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]` compliance via `verifyNexoraRule14CertificationCompliance()`. Certification **fails** if any actor violates recommendation ownership. Reference: `docs/architecture/nexora-rule-14-recommendation-ownership.md`.

---

## 6. Workflow Integration Summary

| Workflow Step | Constitutional Action |
|---------------|----------------------|
| Feature proposal | Run primary checklist (Section 2) |
| AI-assisted coding | Load and obey `docs/ai-context/nexora-core-rules.md` |
| Code review | Scan against Violation Examples (Section 3) and DO NOT BREAK (Section 4) |
| Phase completion | Complete Constitutional Review Process (Section 5) |
| Architecture change | Verify against `docs/nexora-constitution.md`; amend Constitution if rules must change |

---

## 7. Final Statement

The Nexora Constitution is the highest-level product authority. This compliance document ensures that authority is operational—not archival.

**No feature, phase, or release ships without constitutional evaluation.**

When in doubt, prefer executive clarity, object-centric flow, context preservation, and simulation-grounded decisions over speed, density, or convenience.

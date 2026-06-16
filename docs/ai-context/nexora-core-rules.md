# Nexora Core Rules

**Status:** AI enforcement layer.

**Authority:** Subordinate to and derived from `docs/nexora-constitution.md`.

**Audience:** Cursor, Codex, and all AI-assisted development agents working in this repository.

This document integrates the Nexora Constitution into the development workflow. When generating code, proposing architecture, or modifying UI, agents must treat these rules as binding constraints—not suggestions.

---

## Constitutional Authority Chain

1. `docs/nexora-constitution.md` — highest product authority
2. `docs/architecture/constitutional-compliance.md` — review process and compliance governance
3. `docs/ai-context/nexora-core-rules.md` — this document (agent enforcement layer)
4. Frozen architecture contracts (e.g. `docs/nexora-canonical-panel-architecture.md`, `docs/nexora-routing-governance.md`)

If a proposed change conflicts with the Constitution, stop and redesign. Do not implement by exception.

---

## DO NOT BREAK

The following are non-negotiable. Agents must not introduce changes that violate any item in this section.

### DO NOT BREAK: Dashboard + Assistant Architecture

- MRP contains **only** Dashboard (Insight) and Assistant.
- Do not add MRP tabs, hidden MRP routes, or secondary panel shells inside MRP.
- Do not turn MRP into a navigation maze, settings hub, or multi-purpose app shell.
- Preserve MRP context: Panel Name, Active Mode, Selected Object Context, Return Navigation.

### DO NOT BREAK: Scene First Architecture

- The Scene is the **primary interface**, not a backdrop.
- Scene shows the situation. MRP explains. Assistant discusses.
- Do not demote the Scene in favor of 2D dashboards, full-screen charts, or menu-driven workflows.
- Do not move primary situational awareness out of object behavior and visual state.

### DO NOT BREAK: Object-Centric Navigation

- Managers navigate by **objects**, not menus.
- Do not replace object selection flows with deep menu hierarchies or tab forests.
- Object actions and context must flow from Scene selection—not from disconnected navigation trees.

### DO NOT BREAK: Context Visibility

- Context is king. Selected object, active mode, and workspace state must remain visible and synchronized across Scene, MRP, and Assistant.
- Do not hide, reset, or silently drop selected object context during navigation or panel transitions.
- Do not create flows where the executive loses track of where they are or what they selected.

### DO NOT BREAK: Simulation Before Recommendation

- Show simulated futures before recommending actions.
- Do not bypass Nexora analysis/simulation layers with direct AI recommendations.
- The Assistant explains analysis—it does not replace it or invent conclusions without system grounding.

### DO NOT BREAK: Executive Simplicity

- Never overwhelm the executive.
- One screen, one story.
- Do not add density, noise, or competing narratives without explicit constitutional review.
- Every view must answer a decision question. No dead dashboards.

### DO NOT BREAK: Executive Decision Boundary (Rule #11)

- Timeline explains the past. Scenario explores possible futures. War Room commits to action.
- Do not render Scenario or War Room panels inside Timeline workspace hosts.
- Do not allow Timeline to predict futures, recommend actions, or commit decisions.
- Do not allow Scenario to execute decisions or modify timeline history.
- Do not allow War Room to rewrite timeline events or own simulation generation.
- Call `guardNexoraRule11Boundary()` before cross-domain workspace actions. Certification must verify `[NEXORA_RULE_11_BOUNDARY]`.
- Reference: `docs/architecture/nexora-rule-11-executive-decision-boundary.md`

### DO NOT BREAK: Intelligence Ownership (Rule #12)

- MRP owns intelligence. Assistant owns conversation. The Assistant is not the intelligence authority.
- Certified workspaces (Executive Summary, Operational, Risk, Timeline, Scenario, War Room) are the authoritative intelligence sources.
- Assistant may read, explain, summarize, compare, and discuss workspace intelligence — only when grounded in certified workspace outputs.
- Assistant must not replace, invent, or override workspace intelligence.
- Assistant must not generate unsupported risk scores or scenario forecasts.
- Assistant must not execute workspace decisions or act as an independent decision authority.
- Call `guardAssistantIntelligenceAction()` and `guardAssistantForbiddenIntelligenceAction()` before Assistant intelligence-facing behavior. Assistant certifications must verify `[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]`.
- Reference: `docs/architecture/nexora-rule-12-intelligence-ownership.md`

### DO NOT BREAK: Commitment Ownership (Rule #13)

- Timeline owns history. Scenario owns possibility. War Room owns commitment.
- Timeline answers: What happened? Scenario answers: What could happen? War Room answers: What are we going to do?
- Timeline and Scenario must not execute actions or commit decisions.
- War Room may select strategy, create action plans, track execution status, and monitor active decisions.
- War Room must not rewrite history, generate simulations, or own forecasting logic.
- Call `guardNexoraRule13CommitmentOwnership()` before cross-workspace commitment actions. Workspace certifications must verify `[NEXORA_RULE_13_COMMITMENT_OWNERSHIP]`.
- Reference: `docs/architecture/nexora-rule-13-commitment-ownership.md`

### DO NOT BREAK: Recommendation Ownership (Rule #14)

- War Room owns commitment. Advisory owns recommendation. Governance owns approval.
- Scenario answers: What could happen? War Room answers: What are we going to do? Advisory answers: What do I recommend? Governance answers: Is this approved?
- War Room must not issue recommendations or approve decisions.
- Advisory must not approve decisions or commit actions.
- Governance must not issue recommendations or commit actions.
- No certified workspace may issue recommendations, approve decisions, or commit actions outside its ownership domain.
- Call `guardNexoraRule14RecommendationOwnership()` before cross-domain recommendation, approval, or commitment actions. Certifications must verify `[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]`.
- Reference: `docs/architecture/nexora-rule-14-recommendation-ownership.md`

---

## Constitutional Compliance Checklist

Before proposing or implementing any feature, answer every question below. If any answer is **No** or **Unclear**, the feature must be redesigned or rejected.

| # | Question | Required Answer |
|---|----------|-----------------|
| 1 | Does it support executive decision making? | **Yes** — tied to a concrete decision question |
| 2 | Does it respect Scene First architecture? | **Yes** — Scene remains primary; roles are not collapsed |
| 3 | Does it respect Object-Centric navigation? | **Yes** — objects, not menus, drive the executive path |
| 4 | Does it preserve Context visibility? | **Yes** — selection, mode, and return path remain intact |
| 5 | Does it reduce or increase executive cognitive load? | **Reduce or neutral** — never increase without review |
| 6 | Does it support Simulation Before Recommendation? | **Yes** — futures before recommendations |

### Extended Agent Checks

Apply these in addition to the checklist above:

- **Objects are information** — no decorative Scene objects without informational purpose.
- **No dead dashboards** — insights connect to action, simulation, or deeper analysis.
- **Role separation** — Scene shows, MRP explains, Assistant discusses; do not merge responsibilities.
- **Intelligence ownership** — MRP workspaces own intelligence; Assistant explains grounded intelligence only (Rule #12).
- **MRP tab discipline** — only `dashboard` and `assistant`; no new tab types without constitutional amendment.

---

## Constitutional Violation Examples

These are explicit anti-patterns. Do not implement or suggest them.

### Violation: Adding 15 Tabs to MRP

**Breaks:** Dashboard + Assistant architecture, Executive simplicity, Object-Centric navigation.

**Wrong:** Expanding MRP with tabs for Settings, Reports, Alerts, Users, Analytics, etc.

**Correct:** Route executive contexts through Left Nav and Dashboard Context. Keep MRP to Dashboard + Assistant only.

---

### Violation: Turning Objects into Decorative Graphics

**Breaks:** Objects are information, Scene First architecture.

**Wrong:** Adding visually rich Scene elements that do not encode risk, opportunity, priority, relationships, or operational status.

**Correct:** Every object carries meaning through behavior and visual state tied to real situational data.

---

### Violation: Showing Charts Without Actionable Outcomes

**Breaks:** No dead dashboards, executive decision making, Simulation Before Recommendation.

**Wrong:** Rendering KPI charts or trend lines with no path to simulate, act, or discuss.

**Correct:** Connect every insight to a next step—simulate a scenario, select an object, open Assistant with grounded context, or route to a decision action.

---

### Violation: Hiding Selected Object Context

**Breaks:** Context visibility, Object-Centric navigation.

**Wrong:** Clearing selection on panel switch, omitting selected object from MRP/Assistant, or navigating without showing what is in scope.

**Correct:** Selected object context persists and is visible across Scene, MRP, and Assistant until the executive explicitly changes it.

---

### Violation: Replacing Simulation with Direct AI Recommendations

**Breaks:** Simulation Before Recommendation, Assistant constitutional principles.

**Wrong:** Assistant or UI surfaces that say "You should do X" without showing simulated outcomes or Nexora-generated analysis first.

**Correct:** Present simulation output and system analysis; Assistant explains and supports discussion of those outputs.

---

## Agent Workflow Requirements

When working on Nexora:

1. **Read** `docs/nexora-constitution.md` for any feature touching Scene, MRP, Assistant, navigation, or executive UX.
2. **Run** the Constitutional Compliance Checklist before writing code.
3. **Compare** proposals against the Violation Examples above.
4. **Respect** the DO NOT BREAK section in every diff.
5. **Escalate** constitutional conflicts to a human review per `docs/architecture/constitutional-compliance.md`—do not ship workarounds.

---

## Quick Reference: Constitutional Rules 1–14

| Rule | Principle |
|------|-----------|
| #1 | Scene shows. MRP explains. Assistant discusses. |
| #2 | Objects are information, not decoration. |
| #3 | Navigate by objects, not menus. |
| #4 | Every view answers a decision question. |
| #5 | No dead dashboards—insights connect to actions. |
| #6 | One screen. One story. |
| #7 | Context is king. |
| #8 | Simulation before recommendation. |
| #9 | The Scene is the primary interface. |
| #10 | Never overwhelm the executive. |
| #11 | Timeline = past. Scenario = futures. War Room = action. |
| #12 | MRP owns intelligence. Assistant owns conversation. |
| #13 | Timeline = history. Scenario = possibility. War Room = commitment. |
| #14 | War Room = commitment. Advisory = recommendation. Governance = approval. |

---

**Nexora is an Executive Decision Intelligence System. Agents must preserve that identity in every change.**

# Nexora Panel System

## 1. Core Rule

- Right Panel = Intent / Navigation / Lightweight Guidance.
- Center Component Panel = Execution / Heavy Interaction / Processing.
- Scene = Visual system state.
- Bottom Command Dock = input / trigger.

Do not let one surface take over another surface's job.

## 2. Panel Families

SCN:
- Scene
- Objects
- Focus

SIM:
- War Room
- Timeline
- Advice

RSK:
- Explanation
- Conflict
- Risk Flow

Keep these families stable. Switching within a family should feel like changing intent, not launching execution.

## 3. Button Types

Command buttons:
- Stay inside the right panel family.
- Switch panel/view.
- Stay lightweight.

Examples:
- Scene
- Objects
- Focus
- War Room
- Timeline
- Advice
- Explanation
- Conflict
- Risk Flow

Processing buttons:
- Always open the Center Component Panel.
- Never render heavy execution in the Right Panel.

Examples:
- Simulate mitigation
- Compare options
- Open full timeline
- Run scenario
- Trace propagation
- Execute replay

## 4. Right Panel Rules

- Keep content compact.
- Put summary and local intent first.
- Do not render heavy execution.
- Do not render large timeline, simulation, compare, replay, or scenario bodies.
- Prefer lightweight previews, reasons, and pivots.
- May include a tiny Help Panel at the end.
- Help Panel must be last, calm, and limited to 1-2 next steps.

## 5. Center Component Rules

Use the Center Component Panel for:
- Full timeline view.
- Simulation.
- Compare.
- Replay.
- Heavy analysis.
- Multi-step workflows.
- Interactive execution surfaces.

Center execution may require heavier data. Right panel view selection should not.

## 6. Architectural Anti-Patterns

Avoid:
- Rendering execution in the Right Panel.
- Opening a panel that requires data before that data exists.
- Mixing intent and execution in one component.
- Multiple authorities writing panel state.
- Fallback panels that hide the real routing problem.
- Large compare/timeline/simulation payloads in the right rail.
- Ad hoc state writes that bypass the panel controller.

## 7. Implementation Reminder

When editing `HomeScreen.tsx`, `RightPanelHost.tsx`, panel controller, or panel router files, preserve the ownership split:

- Right Panel chooses intent.
- Center Component executes work.
- Scene shows state.
- Bottom Dock triggers input.

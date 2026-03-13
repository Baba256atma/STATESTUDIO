# Nexora MVP Launch Checklist

This checklist reflects the real current Nexora MVP scope in the codebase as of March 12, 2026.

Launch framing:
- One shared Nexora core engine
- Multiple domain experiences
- Launch domains: Business, DevOps, Finance
- Preview domains remain available, but are not part of the primary MVP promise

Current shipping recommendation:
- Ready to launch as a controlled MVP
- Recommended before launch: one short frontend cleanup pass and one final demo rehearsal pass

## 1. Product Entry

- `[Ready]` App opens into domain selection before entering the workspace.
- `[Ready]` The selected domain is persisted in local storage for the current user session.
- `[Ready]` The user can change domains without changing the shared core engine path.
- `[Ready]` The product entry copy explains that domains change the experience layer, not the engine.

## 2. Domain Selection

- `[Ready]` Business, DevOps, and Finance are visibly marked as launch domains.
- `[Ready]` General and Strategy are visibly marked as preview domains.
- `[Ready]` Each selectable domain shows a description, prompt examples, and a default demo identifier.
- `[Ready]` Domain selection is registration-driven, not hardcoded as separate app flows.

## 3. Shared Core Engine Stability

- `[Ready]` The app still runs on one shared core engine across all domains.
- `[Ready]` Scene rendering, object language, loop behavior, fragility/risk flow, and executive surfaces remain shared.
- `[Ready]` Domain packs configure prompts, demos, panels, and framing without forking core logic.
- `[Ready]` The current product still follows the same `/chat`-driven shared backend path.

## 4. Business Domain

- `[Ready]` Business is a real domain pack, not a generic fallback.
- `[Ready]` Business opens with a business-relevant starter demo.
- `[Ready]` Business prompt examples use operational and business-fragility language.
- `[Ready]` Business cockpit emphasis points toward fragility, operations, KPIs, and action.
- `[Ready]` Business executive framing reads like an operational and strategic brief.

## 5. DevOps Domain

- `[Ready]` DevOps is a real domain pack, not a relabeled business demo.
- `[Ready]` DevOps opens with a service-dependency and reliability demo.
- `[Ready]` DevOps prompt examples use service, latency, queue, worker, and resilience language.
- `[Ready]` DevOps cockpit emphasis points toward dependencies, failure propagation, reliability KPIs, and resilience action.
- `[Ready]` DevOps executive framing reads like an operational brief for engineering leadership.

## 6. Finance Domain

- `[Ready]` Finance is a real domain pack, not a generic fallback.
- `[Ready]` Finance opens with a market-fragility and liquidity-stress demo.
- `[Ready]` Finance prompt examples use liquidity, leverage, volatility, exposure, and credit language.
- `[Ready]` Finance cockpit emphasis points toward exposure, liquidity, fragility, and action.
- `[Ready]` Finance executive framing reads like a risk-focused financial brief.

## 7. Prompt Flow

- `[Ready]` Domain-aware prompt examples appear inside the workspace.
- `[Ready]` Prompt guidance explains the intended flow: prompt to pressure to risk/fragility to executive response.
- `[Ready]` Demo prompt chips are short and readable enough for live demo use.
- `[Ready]` The launch domains have clear first-prompt suggestions.

## 8. Scene and Interaction Stability

- `[Ready]` Launch domains load a readable starter scene.
- `[Ready]` Domain demos use domain-specific starter focus objects rather than one shared business focus path.
- `[Ready]` Scene selection and focus behavior remain intact through the shared UI path.
- `[Ready]` Loading a starter demo remains a simple, deterministic interaction.

## 9. Risk, Fragility, and KPI Visibility

- `[Ready]` Fragility and risk outputs are part of the current MVP response shape.
- `[Ready]` Domain demos include visible fragility, risk propagation, object selection, and strategic advice data.
- `[Ready]` KPI and risk emphasis are visible in the launch-domain experience.
- `[Ready]` The MVP clearly shows that Nexora is more than a static scene viewer.

## 10. Executive Summary and Decision Story

- `[Ready]` Executive framing is domain-aware.
- `[Ready]` The workspace helper text makes the executive brief part of the expected flow.
- `[Ready]` The shared executive and narrative path remains available across launch domains.
- `[Ready]` The product story is understandable: what changed, why it matters, and what to do next.

## 11. Frontend Stability

- `[Needs Fix]` The repo still carries a known `HomeScreen.tsx` warning backlog. This is not currently a launch blocker, but it should be reduced soon after launch or during a final cleanup pass.
- `[Ready]` No product-entry or domain-selection regression is visible in the current launch flow.
- `[Ready]` Domain-aware wiring is already connected to demo loading, prompt guidance, panel emphasis, and framing.

## 12. Backend Stability

- `[Ready]` `/chat` remains the shared MVP entrypoint.
- `[Ready]` Backend response packaging still includes the core fields the frontend depends on, including `scene_json`, `fragility`, and `risk_propagation`.
- `[Ready]` Optional backend subsystems are guarded so they do not break the main MVP chat path.
- `[Optional Before Launch]` Deeper backend cleanup and future service decomposition can wait until after launch.

## 13. Demo Readiness

- `[Ready]` The product has three real launch-domain demos: Business, DevOps, Finance.
- `[Ready]` The domain-selection screen already sets expectations for launch vs preview domains.
- `[Needs Fix]` The team should run one final demo rehearsal pass across all three launch domains to confirm prompt pacing, wording, and visual clarity in a live presentation setting.
- `[Ready]` Preview domains can stay visible if they are explicitly presented as preview experiences.

## 14. Launch Readiness

- `[Ready]` Nexora now matches the intended MVP shape: one shared core engine with multiple domain experiences.
- `[Ready]` The launch scope is disciplined around Business, DevOps, and Finance.
- `[Ready]` The product is coherent enough for an MVP demo and controlled release conversation.
- `[Needs Fix]` Before external launch, confirm the team is aligned on preview-domain messaging and the exact launch demo script.

## 15. Post-Launch Boundary

- `[Post-Launch]` Promote Strategy into a fully launched domain pack.
- `[Post-Launch]` Decide whether General remains a preview shell or becomes a polished launch surface.
- `[Post-Launch]` Expand multi-source connectors beyond the current normalized scanner architecture.
- `[Post-Launch]` Expand autonomous exploration surfaces beyond the current deterministic MVP path.
- `[Post-Launch]` Add richer replay, reporting, and export surfaces.
- `[Post-Launch]` Reduce the broader frontend warning backlog.

## Must-Have Before Launch

- Domain selection works before workspace entry.
- Business, DevOps, and Finance load as real domain experiences.
- Each launch domain loads a domain-aware starter demo.
- Prompt submission preserves the shared prompt-to-scene flow.
- Risk, fragility, and KPI outputs remain visible and understandable.
- Executive summary / decision-story surfaces remain readable.
- `/chat` compatibility remains intact.
- No critical runtime crash is present in the core MVP path.

## Strongly Recommended Before Launch

- Run one full demo rehearsal pass across Business, DevOps, and Finance.
- Reduce the most distracting `HomeScreen.tsx` warnings or explicitly accept them as post-launch technical debt.
- Confirm preview-domain messaging in the release narrative so Strategy and General are not oversold.

## Can Wait Until After Launch

- More domains beyond Business, DevOps, and Finance.
- Deeper multi-source ingestion connectors.
- Richer replay and reporting UI.
- Broader backend modularization beyond current MVP-safe alignment.
- More advanced autonomous exploration surfaces.

## MVP Gap Summary

Biggest remaining launch blockers:
- No hard code-level blocker was found in the core MVP path.
- The main remaining risk is presentation and release control, not missing core launch architecture.

Biggest product coherence gaps:
- Preview domains must continue to be described as preview in demos and release messaging.
- The product should keep centering the prompt to scene to fragility to executive brief loop in every live walkthrough.

Biggest demo risks:
- A weak live demo script could undersell the value even though the domain-aware product flow is already in place.
- The existing `HomeScreen.tsx` warning backlog can create unnecessary confidence drag for the team, even if it is not currently a runtime blocker.

What should absolutely be fixed before launch:
- Finalize the launch demo script across Business, DevOps, and Finance.
- Confirm release messaging around launch domains vs preview domains.

What can wait until after launch:
- More domains
- Richer scanner connectors
- Heavier replay/reporting polish
- Deeper backend cleanup

## Launch Decision

Recommendation:
- Ready to launch as a controlled MVP

Condition:
- Treat Business, DevOps, and Finance as the launch promise
- Keep General and Strategy positioned as preview experiences
- Run one final demo rehearsal pass before external launch

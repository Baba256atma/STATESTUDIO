# Root cause

MRA-3-RECERT-2-001 is a **targeted investigation / attention-ranking subject-fidelity** failure, not a general referent-resolver redesign.

After Demand Surge is established, `explain it` and `tell me more about it` stay on Demand Surge because they are not CC:1 FOCUS navigation.

`investigate it` matched `investigate <target>` as FOCUS with a deictic token. Live then applied recommendation/attention overlay (`isSafeActionNavigation` plus `recommendedPaths[0]` / Advisor attention) and answered Margin Pressure while Stage still represented Demand Surge.

Attention intelligence remained legitimate for selection questions (`What should I investigate?`). It was incorrectly promoted into referential authority for a deictic investigation of an already valid subject.

Fix the FOCUS vs knowledge-follow-up boundary and stop recommendation overlay from owning targeted deictic investigation. Do not suppress attention ranking globally.

After those subject-resolution repairs, the resumed live proof exposed one later divergence: `routeExecutiveManagerLane` returned the generic Scenario `advisor` lane before reaching the targeted-deictic explanation branch. That preserved the pre-composed attention-grounded advisor response even though the resolved subject, investigation subject, and Stage subject were already Demand Surge. Moving the existing canonical predicate ahead of the generic Scenario branch closed the first remaining divergent layer without adding an authority.

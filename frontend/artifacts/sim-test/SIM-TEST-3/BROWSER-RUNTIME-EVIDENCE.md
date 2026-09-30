# Browser runtime evidence

Production server: `http://127.0.0.1:3001/executive/watch` after `next build`. An already-running dev server on port 3000 returned an error page and was left untouched.

1. `/executive/watch` loaded. Title: Nexora · Watch a Business or Project.
2. Four scenario cards rendered, including Manufacturing Under Capacity Pressure.
3. Selecting that card showed Start simulation. Start opened the workspace at Beginning.
4. Next moment advanced the timeline: Simulation starts → Operational data is visible → Simulated Manager asks Nexora → Nexora responds. Progress reached Management Response.
5. Visible data appeared: orders_received 125, requested_quantity 125, CAP_AV 85, produced_quantity 85, inventory_quantity 420, machine_status stopped.
6. Conversation showed two Manager turns and two Nexora replies, including “What data do we have?” and “Show me the problems and the supporting data.”
7. The Stage panel stayed on screen. It read “Context is forming on the real Stage” / overview. No focused object was shown, which matches this playback’s unresolved subject. The panel did not crash.
8. Data / Files opened the existing CSV inspector. ERP, Production, Inventory, and Maintenance were at v3. ERP history: tick 0 (v1), tick 7 (v2), tick 21 (v3). Ingestion state: INGESTION_COMPLETED. Provenance: verified.
9. No Next.js error overlay appeared, and the journey controls stayed usable.

MLEVEL is not drawn as L1/L2/L3 in the current WATCH workspace. It was not added.

This playback is the certified RMS:8 manufacturing watch, not a second conversation engine. The 21-turn SIM-TEST:3 manufacturing journey is the harness run in `JOURNEY-REPORT.md`.

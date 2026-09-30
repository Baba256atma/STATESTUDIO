# Browser runtime evidence

Production server: `http://127.0.0.1:3001/executive/watch` (existing `next start`).

1. `/executive/watch` loaded Northstar Manufacturing. Visible data: orders_received 125, CAP_AV 85, inventory 420, machine_status stopped. CSV inspector ERP/Production/Inventory/Maintenance v1.
2. Prior Take Control conversation already showed Capacity investigation, Delivery switch, return to Capacity, and “a Decision is still required” without presenting a committed Decision card.
3. “Show me the alternatives for the capacity problem.” → “I don't see that Problem. Current Problems are Capacity Gap, Margin Pressure.” Scenario discussion ≠ Decision.
4. “Let's go with option B.” → “Which option do you want to commit to?” UI did not show an Approved Decision.
5. “Start it.” → “Not yet. We need an approved decision before execution can start.” UI did not claim Execution started or Outcome success.
6. WATCH Stage remained “Context is forming on the real Stage / overview.” No false lifecycle success overlay.

MLEVEL L1/L2/L3 is not drawn in the WATCH workspace. Canonical lifecycle IDs are the harness observations, not playback chrome.

No visual redesign. No false committed Decision/Execution/Outcome presented.

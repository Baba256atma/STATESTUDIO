# Focused tests

Final focused FIX3 suite: **16/16 PASS**.

The last affected regression batch was **77/77 PASS**, covering FIX3, conversational control, Manager–Object, explain quality, natural collection language, and workspace navigation. Earlier combined historical fidelity proof was **101/101 PASS** across RECERT-FIX1, RECERT-FIX2, FINAL-FIX1-FIX1, FINAL:6.2/6.3, composition, and NCA comparison behavior.

No tests were skipped, weakened, or removed. One earlier investigation test was updated because its old expectation—letting an older Delivery investigation remain primary after explicit Capacity focus—directly contradicted the FIX3 ownership contract; it now verifies that Delivery remains supporting-only while Capacity becomes primary.

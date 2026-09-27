# NPA-T OVS:3-RECERT — Live Isometric Theatre Runtime

Certification only. No OVS:4. No production repair.

**Verdict: NPA-T OVS:3 — CERTIFIED**

## Runtime

Existing `node` listener on `:3000`. URL `http://127.0.0.1:3000/executive?ovs1=1`. One Playwright Chrome pass plus one Overview stale-clear recovery after the object-list Overview control was not visible.

## Live Risk path observed

Investigate Risk → `REVIEW_FOCAL_OBJECT` → focused/selected `obj-risk` → Advisor `obj-risk` → `data-ovs-3-enabled="true"` `data-ovs-3-family="NEXO_RISK"` `data-ovs-3-scene="available"` `data-ovs-3-structures="1"` `data-ovs-3-data="isometric-2_5d"`.

Overview after: `ORIENT_TO_STAGE`, OVS:3 disabled, structures 0, focus none. Risk spatial scene cleared.

## Screenshots

- `recert-overview-before.png`
- `recert-risk-spatial.png`
- `recert-overview-after.png`
- `recert-report.json`
- `recert-overview-recovery.json`

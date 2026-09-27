# OVS:2 bounded runtime

- Server: existing Next on `http://127.0.0.1:3000` (HTTP 200). No new `next dev`.
- Route: `/executive?ovs1=1`
- Browser: Playwright `channel: "chrome"` headless, viewport 1440×900.
- Pass 1 (`live-cert.mjs`, ~10s): overview, Revenue/stable, Capacity/watch. Failed clicking `obj-risk` while still on the Capacity scene (control not in list).
- Pass 2 (one recovery, `live-cert-recovery.mjs`, ~7s): Advisor **Investigate Risk** → `obj-risk`; canvas hover; Budget/unresolved; NMI open/map/close.

Authoritative live signals collected from `[data-canonical-id][data-status]`:

| status | visual | attention | example ids |
| --- | --- | --- | --- |
| stable | normal | normal | obj-revenue |
| watch | attention | important | obj-capacity, obj-customer, obj-delivery, obj-inventory |
| unresolved | unresolved | normal | obj-budget, obj-risk, obj-demand |

No live `status=risk`, `visual=critical`, or `attention=critical`. No executing/completed fields.

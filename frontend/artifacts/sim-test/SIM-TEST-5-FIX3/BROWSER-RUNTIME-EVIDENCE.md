# Browser runtime evidence

Route: `http://127.0.0.1:3002/executive/watch` (existing `next start`). TAKE_CONTROL is a certified RMS capability.

## Send proof

- Take Control opened (`rms-take-control-active`). Data/Files showed Manufacturing ERP/Production/Inventory/Maintenance v1.
- Accessibility `fill` + Send did **not** update React `draft`; `onClick` no-ops when `!draft.trim()` then the box can look cleared. That is why FIX2 reported composer-cleared-without-turn.
- After native textarea setter + `input`/`change` events, `rms-human-send` click posted turns. Conversation included:

  - You / Tell me more about the capacity issue. → Nexora Investigate Capacity…
  - You / What is happening? → Nexora Capacity is 12% above the intended target band…

Browser send: **PASS** (customer Send button; React-controlled textarea requires input events).  
Browser response: **PASS** (Nexora reply appeared).  
Browser lifecycle (options → Decision → Execution chrome): **not** fully driven in this bounded session; harness remains canonical for Decision/Execution IDs.

Do not treat inspector CSV list as Advisor evidence. Live Watch “no accepted source for Capacity” on one turn is session-state, not the isolated SIM-TEST harness T4 Manufacturing Production.csv PASS.

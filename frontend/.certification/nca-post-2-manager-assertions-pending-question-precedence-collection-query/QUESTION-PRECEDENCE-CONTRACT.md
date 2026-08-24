# Question precedence contract

Pending Nexora questions carry `askedAtTurn`, `source` (NCA3 / NCA5 / NEX_EXP / CC / MO / OTHER), `status` (ACTIVE / SUSPENDED / ANSWERED / EXPIRED / SUPERSEDED), and `questionPurpose`.

Answer target order:

1. Most recent explicit unanswered Nexora question that is ACTIVE and purpose-compatible  
2. Active-thread pending question  
3. Suspended-thread pending question only if that thread is explicitly resumed  
4. Older pending context  

A new explicit question suspends or supersedes an older unrelated question. The older thread is not discarded if it remains valid.

Short answers (`yes`, `no`, `maybe`, `sure`, `not now`, `20%`, `the second one`) bind using latest valid question + expected information + purpose + active thread. Polar yes/no is compatible with YES_NO_PERMISSION, YES_NO_CONFIRMATION, BOOLEAN_BUSINESS_FACT, REVIEW_OFFER, NAVIGATION_CHOICE. It is not treated as business evidence for a REVIEW_OFFER.

Expired questions are not answerable. Ordinary greetings suspend leftover pending instead of creating a select-subject expectation.


# 🔍 Nexora Self-Check Prompt

Review your own patch before finalizing.

Check:

1. Did I break panel routing?
2. Did I introduce a new state path?
3. Did I cause potential panel flicker?
4. Did I weaken data contracts?
5. Did I hide the bug instead of fixing root cause?

If any answer is YES:
- revise the patch

Return:
- risks
- whether patch
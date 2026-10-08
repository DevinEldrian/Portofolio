# KISEKI Shared Agent Protocol

Bos speaks to Agent Z ONLY. Every agent must read GitHub Issue #1 and the latest PM [Z] directives before beginning a session.

Role split:
- Agent Z: coordinator, accepted milestone ordering, Bos-facing status summaries, no autonomous production approval.
- Agent X1: Arashiyama and future-world geographic art/UX documentation, visual reviews. Reports to Agent Z in Issue #1.
- Agent XO: implementation in feature branch and draft PR, browser/build evidence. Reports to Agent Z in Issue #1.
- Agent T1: independent QA and security test evidence with PASS/FAIL/BLOCKED. Reports to Agent Z in Issue #1.

Use [X1] STATUS, [XO] STATUS, [T1] STATUS for reports and [Z] DISPATCH to=ROLE for tasks. Automated [AUTO:Z] comments are summaries and proposals, NOT human sign-off and not the original ChatGPT agent identities.

NO direct production deployment or merge into main without Bos' explicit approval. The repo must have branch protection and deployment approval configured by Bos; instructions alone are not technical enforcement.

P0: one full, recognizable Kyoto Arashiyama vertical slice. Specific NPCs, narrative CV hotspots, atmospheric Kyoto weather and visible tram board-interior-exit sequence before Tokyo/Shibuya/Akihabara.

# KISEKI — Autonomous P0 Coding Runner (proposed)

**Status:** Draft workflow, not authorized to merge into `main` or deploy production.

## Who reports to whom

Bos sends instructions **only to Agent Z**. Agent Z keeps source-of-truth decisions in GitHub Issue #1. Each Codex coding cycle runs as separate AI workers, not the existing X1/XO/T1 chat tabs.

- **X1:** read-only design acceptance brief based on existing authentic Arashiyama design handoff.
- **XO:** an actual sandboxed coding agent edits `src/`, `tests/`, `docs/` within a fresh checkout; creates *one* focused feature increment per cycle.
- **T1:** separate runner tests the diff and builds; publishes only passing changes to `feat/xo-autonomous-p0`. A separate read-only QA agent audits functionality/code security but **does not claim real browser/visual QA**.
- **Z:** GitHub Issue #1 receives run links, code commit SHAs, and review notes for escalation.

## First-run status and activation

**Required:** a new, budget-limited API key from the OpenAI Platform stored as GitHub Actions repository secret named `OPENAI_API_KEY` (never posted into chat or GitHub comments). Without this secret, the workflow's X1 step reports BLOCKED and does not run paid AI jobs.

**Event behavior:** The runner workflow has a `push` trigger on its own isolated branch `feat/z-autonomous-build-runner`, which permits a harmless dry-run without touching `main`. Its periodic `schedule` runs every 4 hours, but GitHub only supports schedule and manual dispatch when the workflow is already on the repository's **default branch**. This PR **must remain draft** until Bos approves activation and the production deployment risks below have been mitigated.

**Production guardrail, mandatory before activation:** Currently `main` is unprotected and Vercel auto-deploys it. Bos must configure GitHub main branch protection / rulesets requiring a PR + required checks + owner approval, and disable or protect Vercel production auto-deployment for any workflow-only merge. Publishing this workflow to main itself may trigger Vercel; do not merge without Bos confirmation.

## Execution safety

1. Codex Action uses `permission-profile: :workspace` for XO and `:read-only` for X1/T1, with `safety-strategy: drop-sudo`. GitHub checkout in model jobs has `persist-credentials: false` and only `contents: read`.
2. The Codex worker is not given write credentials. Its only output is a `src/tests/docs` patch, transferred as an artifact. A separate ephemeral GitHub runner with **no OPENAI_API_KEY** checks allowed paths, runs unit tests and build, and has narrowly scoped permission to push a commit to the isolated developer branch.
3. The model cannot change `.github/`, `scripts/`, `package.json`, lockfiles or deployment configuration as part of its patch. Feature-branch commits may create a Vercel **preview**, but no main merge, production deployment, or auto-merge is implemented.
4. Automated CI passing does NOT mean graphical WebGL interaction, animation, FPS, camera or mobile accessibility is verified. X1 visual benchmark and T1 **manual browser QA** remain hard acceptance gates for any release. Never expose private bank/customer details, unapproved personal CV data, secrets or unlicensed copyrighted media.
5. The workflow has a per-job timeout, per-cycle patch limit (200 KB) and cost impacts for OpenAI API tokens and GitHub Actions. The cron is **best effort**, not nonstop execution; it continues creating improvements while enabled and a valid key/budget remain available, not magically until a subjective definition of complete.

## Milestones

M1 W/camera stability and HTML recovery → M2 connected Randen/shops/Katsura/Togetsukyo/bamboo and CV hotspots → M3 humans/NPCs/weather/train boarding+interior+exit → M4 X1 visual evidence, T1 browser regression, Agent Z stakeholder demo → explicit Bos approval. Tokyo Shibuya and Akihabara remain P1.

## Evidence and next approval

- Isolated AI source branch: https://github.com/DevinEldrian/Portofolio/tree/feat/xo-autonomous-p0
- PM Mission Control: https://github.com/DevinEldrian/Portofolio/issues/1
- The first full test must show an actual new commit from a successful worker run, not just YAML or a check mark.
- **No production deployment or merge to main without Bos' explicit approval.**

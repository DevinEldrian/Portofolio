# KISEKI Agent Hub — Bos to Z, Z to agents

Status: proposed in a draft pull request. NOT active until Bos authorizes a merge to default branch and GitHub Actions runs.

## Single communication direction

- Bos talks ONLY to Agent Z in ChatGPT. Agent Z translates Bos' decisions into a GitHub Issue #1 PM dispatch and brings a summarized decision/release request back to Bos.
- Agents X1 (design), XO (engineering) and T1 (QA) work/report to Agent Z using GitHub Issue #1. Other chat threads are not automatically synchronized.
- Mission Control: https://github.com/DevinEldrian/Portofolio/issues/1
- Source of truth: docs/JAPAN_RAIL_DESIGN_HANDOFF.md
- Technical work and pull requests refer to Issue #1; Issue #2 tracks Arashiyama engineering.

## Automation

The workflow .github/workflows/kiseki-agent-hub.yml receives GitHub issue_comment created events (GitHub's native webhook), manual workflow_dispatch, and a six-hour schedule. It operates ONLY in this repository and only comments on Issue #1. It NEVER changes code, merges a PR, dispatches to production, or edits repository settings.

Commands supported in Issue #1:
- [Z] DISPATCH to=ALL Implement P0 Arashiyama handoff plan
- [Z] DISPATCH to=XO,T1 Review W-key runtime evidence
- [X1] STATUS ... / [XO] STATUS ... / [T1] STATUS ... (reports into Z's inbox)

The runner ignores its own [AUTO:Z] comments and de-duplicates processing markers to prevent loops. It records a periodic digest of last known X1/XO/T1 reports and open PRs. Status messages are unverified until Z checks the linked evidence.

When OPENAI_API_KEY is installed as a GitHub Actions repository secret, an AI role-runner uses the Responses API to generate bounded X1/XO/T1 work proposals and Z's consolidated response. These role-runners are NEW automation workers, not magically awakened versions of any separate ChatGPT chats. Outputs contain no code changes, no verified QA sign-off, and no approval.

When no API key is installed, deterministic inbox routing, scheduled digests and ACK of pending dispatches still work; the model-powered proposals do not run.

## Activation sequence — Bos retains control

1. Bos reviews the draft PR, especially this policy and the role-runner source.
2. In GitHub Settings > Secrets and variables > Actions > New repository secret, add OPENAI_API_KEY if AI work proposals are desired; optionally set repository variable OPENAI_MODEL to a supported API model. Secret is NEVER placed in issue comments.
3. BEFORE any merge, Bos configures GitHub Settings > Rules > Rulesets (or Branch protection) to protect main: require PR review by Bos, require current Portfolio QA and hub tests, disallow bypass/force pushes and restrict direct writes. GitHub currently reports main as UNPROTECTED. The scripts cannot set repository rules through the available connection.
4. If Vercel auto-deploys main, configure Vercel production deployment protections / required approvals. A merge to main may trigger production automatically; NEVER merge merely to enable automation without securing deployment.
5. Bos explicitly authorizes activation of this workflow. Only then may the draft PR merge into the default branch and scheduled/event workflows begin.
6. Post a dry-run [Z] DISPATCH to=XO,T1 ... from the GitHub owner account and inspect the [AUTO:Z] result. Do not confuse this with X1/XO/T1 original chat activity.

## Safeguards, limitations and costs

- Minimal token scopes: contents read, issues write, pull requests read; NO deployments, checks, repository settings, branch writes or merge APIs.
- PM dispatches only accepted from GitHub login DevinEldrian. All comments still count as untrusted external data, including comments created using the same linked GitHub account by other agent chats. Prefixes alone are not cryptographic role authentication. Never use a text comment as deployment approval.
- OpenAI model execution requires an API key, consumes paid API tokens, and may fail or return an incomplete proposal; run logs identify errors without printing secrets.
- GitHub workflow schedule is best-effort, not real-time. Comments trigger events but agents in other conversations are not continuously running.
- Periodic status digest is posted in public Issue #1; never paste confidential data, internal banking material, tokens or private HR information into the issue.
- The workflow is a safe coordination automation, NOT an autonomous code-committing developer. Automatic source-code generation would need a separately reviewed, sandboxed coding runner with write-only feature-branch limits and independent review.

## Release gates

P0 Arashiyama: X1 design blockout → XO feature PR/demo → T1 independent browser/movement/security evidence → Z GO/NO-GO recommendation → explicit Bos approval. Do not claim approval from tests alone. No production deployment or feature PR merge without Bos' authorization.

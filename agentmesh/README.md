# Using this repo from AgentMesh

`fetch_build_context.py` gives an agent real data instead of letting it guess. It downloads one build's files from this repo and returns a compact summary of about 10–15 KB. Raw crash files can be over 1 MB, which is too much for an AI step.

## What it returns (`build_context`)

| Key | Contents |
|---|---|
| `build` | the build record from `ci/builds.json` |
| `commits` | every commit in the build: author, message, changed files, diff (cut at 3,000 characters) |
| `crashes` | total crashes, crash rate overall and per device family, and up to 8 clusters. Each cluster has a signature, count, `new`/`known` status, devices, OS, levels, a sample stack and breadcrumbs, and the matching tickets. |
| `perf` | p95 frame time and load time against the median of the previous 10 builds; per-area frame time and memory; per-device frame time; `hot_path` |
| `metrics_up_more_than_10pct` | a quick hint (`frametime`, `memory`, `load`). Noise can trip it; the agent decides what is significant. |
| `related_tickets` | past tickets created **before** this build (the time rule): perf tickets of a type that went up, then crash tickets on the same file as a new cluster |

## Run it on your laptop

```sh
python3 agentmesh/fetch_build_context.py 1038
```

## Wire it into the Agent Builder

1. **State:** add `build_id` (string, Req) and `build_context` (dict).
2. **First step:** add a **Custom code** step named `fetch_build_context`. Paste the file's contents; the entry point is `run(state)`, which returns `{"build_context": {...}}`. Map `build_context` to the state field of the same name. The exact Custom code settings are in AgentMesh manual 2 (Pro Code); check them there.
3. **AI steps:** in each prompt, pass `{{ state.build_context | toon_encode }}` (smaller for the AI to read) or `{{ state.build_context | json }}`. Insert placeholders from the **Insert** list: a misspelled field silently becomes blank.
4. **Test** with `{"build_id": "1038"}`. Don't use `{}`, which gives the agents no data, so they make answers up.

## Known limits

- The Builder must be able to reach `raw.githubusercontent.com` from the VPN. If it can't, upload the files to the **Knowledge** panel or ask the platform team for a REST connector.
- Uses only the Python standard library (`urllib`, `json`, `statistics`, `concurrent.futures`).
- Authors are context only. Never use them to rank commits.

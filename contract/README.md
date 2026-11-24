# GAIA data contract (v0.2)

Synthetic data only. Everything in this repo is generated with a fixed seed, so every run gives the same data, commit IDs included.

**Changed from v0.1:** there is one repo with all builds instead of one repo per test case. Data files are JSON, not JSONL. Field names are listed below.

## Where the data lives

Raw URL base: `https://raw.githubusercontent.com/Magzensar/gaia-mock-game-repo/main/<path>`

| Path | Schema | Main consumer |
|---|---|---|
| this repo, tags `build-1000` … `build-1052` | git | VCS server, bisect sandbox |
| `ci/builds.json` (array) | `contract/schemas/build.schema.json` | mock CI |
| `ci/builds/<build_id>.json` | `contract/schemas/build_commits.schema.json` | `list_commits`, `get_diff` |
| `telemetry/perf/<build_id>.json` | `contract/schemas/telemetry.schema.json` | baselines, change-point detection |
| `telemetry/crashes/<build_id>.json` (array) | `contract/schemas/crash.schema.json` | clustering, crash server |
| `tickets/past_tickets.json` (array) | `contract/schemas/past_ticket.schema.json` | RAG, de-duplication |

There's one example record of each in `contract/samples/`.

## Key field changes from v0.1

- **Build:**
  - `build_id` is `"1038"`, not `"b0012"`.
  - `platform` is `android`; `web` is added in Round 2.
  - `ci_status` is `success` or `failed`.
- **Crash:**
  - `exception` replaces `exception_type`.
  - New fields: `app_version`, `level` (`area-0` … `area-7`, null on early builds), `breadcrumbs` (last player actions), `source: "mock"`, and an optional `column` on each stack frame.
- **Telemetry:** one object per build instead of one per session:
  - p50, p95 and p99 for frame time and load time
  - `levels` per area, with `hitch_count`
  - `by_device_family`
  - `hot_path`
- **Past ticket:** new fields `resolved_at`, `fix_commit`, `fix_build_id`, `duplicate_of`, `source`. New types `balance`, `art` and `ui`, and a new status `duplicate`.

## Rules for every consumer

1. **Time rule:** when you investigate build N, use only builds up to N and tickets created before build N's `created_at`. Later builds and tickets did not exist yet.
2. Only accept records with `"source": "mock"`.
3. Authors are context only and are never used in scoring.
4. Regression baseline: the last 10 clean builds, per level and platform.
5. Crash rate = crashes / `sessions`. The rate per device family uses `by_device_family[f].sessions`. Play thresholds: 1.09% overall, 8% per device.

## Replay (run_repro / run_benchmark)

At any build from `build-1011` on, run `node tools/replay.js --query "?seed=42&autoplay=1&invincible=1" --frames 6000 [--device <family>]`. It runs the game headless and prints `EAD_REPLAY {...}` with the first uncaught error. Repro options:

| Option | Effect |
|---|---|
| `start_area=<id>` | start play in that area |
| `drop_item=<2\|3\|4>` | drop that item above the player every 3 s |
| `--device` | applies the GPU profile for that device family |

Frame-time checks need a browser benchmark: `docs/index.html?seed=42&autoplay=1&frames=3000` prints `EAD_BENCH {...}`.

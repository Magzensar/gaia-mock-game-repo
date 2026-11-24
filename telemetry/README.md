# Synthetic CI, crash and telemetry data (mock, for GAIA)

Everything here is synthetic and labelled `"source": "mock"`. It is not real player data.

Base URL (no token needed): `https://raw.githubusercontent.com/Magzensar/gaia-mock-game-repo/main/`

| File | What it holds |
| --- | --- |
| `ci/builds.json` | Every CI build: id, git tag, commit, parent build, version, time |
| `ci/builds/<build_id>.json` | The commits in that build, with changed files and full diffs |
| `telemetry/crashes/<build_id>.json` | Crash reports received for that build |
| `telemetry/perf/<build_id>.json` | Performance telemetry for that build (per level and per device family) |
| `tickets/past_tickets.json` | Past Jira-style tickets: title, stack signature, root cause, fix commit (see `tickets/README.md`) |

**Time rule:** when you look at build N, use only data from build N and earlier
(`created_at` in `ci/builds.json`) and only tickets whose `created_at` is earlier than build N's
`created_at`. Later builds and tickets did not exist yet at that point.

Every build is also a git tag (`build-1000` ... `build-1052`), so
`https://github.com/Magzensar/gaia-mock-game-repo/compare/build-1037...build-1038` shows the same diff.
Prefer the raw JSON files: the GitHub API allows only 60 unauthenticated requests per hour.

## Crash report (one object per crash)

| Field | Valid example | Error example (reject it) |
| --- | --- | --- |
| crash_id | `"c-1038-00042"` | missing |
| build_id | `"1038"` | `""` (missing build) |
| app_version | `"v3.7.0"` | missing |
| platform | `"android"` | missing |
| device_family | `"mali-g52"` | missing |
| os_version | `"Android 13"` | missing |
| exception | `"TypeError"` | missing |
| message | `"Cannot read properties of undefined (reading 'name')"` | missing |
| stack | `[{"function":"EAD.loop","file":"docs/js/game.js","line":312,"column":44}]` | `[]` (no stack, so PARTIAL) |
| level | `"area-7"` | not a known area; `null` is allowed for builds before area tracking (v3.2.0) |
| breadcrumbs | `["game_start","area_enter:0","item:2"]` | `[]` is allowed for builds before breadcrumbs existed |
| session_id | `"s-1038-9f2c41aa"` | missing |
| ts | `"2026-11-03T20:41:07+05:30"` | not ISO 8601 |
| source | `"mock"` | `"simulated"` (reject, PARTIAL) |

Stack `file` and `line` point at real lines in this repo at that build's tag.

## Perf telemetry (one object per build)

| Field | Valid example | Error example (reject it) |
| --- | --- | --- |
| build_id | `"1017"` | missing |
| platform | `"android"` | missing |
| sessions | `61234` | `0` |
| frame_time_ms | list of numbers, `[9.8, 11.2, ...]` | `[]` (no samples, so PARTIAL) |
| frame_time_ms_p50 / p95 / p99 | `10.4` / `14.9` / `31.2` | negative |
| load_time_ms | list of numbers (time to first playable frame), `[812.0, 798.5, ...]` | `[-5.0]` (negative value, reject the sample) |
| load_time_ms_p50 / p95 | `845.2` / `1290.4` | negative |
| levels | `{"area-0": {"frame_time_ms": [...], "frame_time_ms_p95": 14.2, "frames_sampled": 300, "hitch_count": 2, "hitch_pct": 0.67, "memory_mb_peak": [...], "memory_mb_peak_p95": 121.4}, ...}` | missing |
| by_device_family | `{"mali-g52": {"tier": "low", "sessions": 11021, "frame_time_ms_p95": 13.9, "memory_mb_peak_p95": 104.2}}` | missing |
| hot_path | `{"frame_time_ms": {"file": "docs/js/game.js", "function": "EAD.loop", "self_time_pct": 31.0}, "memory_mb": {...}, "load_time_ms": {...}}` | missing (no hot path to compare) |
| source | `"mock"` | `"simulated"` (reject, PARTIAL) |

`frame_time_ms` is CPU+GPU work per frame. The game runs at 30 FPS, so a frame over 33.3 ms is a hitch.
`hitch_count` is the number of hitches among the `frames_sampled` frames of that level.
Crash rate for a build = crashes / `sessions`; per device family = crashes on that family /
`by_device_family[family].sessions`.
Baseline for regressions: the last 10 clean builds.

## Rule for every consumer

Only accept records with `"source": "mock"`. Anything else means the data did not come from this repo.

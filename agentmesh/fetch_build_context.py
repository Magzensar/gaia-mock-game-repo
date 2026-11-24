"""Fetch one build's evidence from the GAIA mock game repo and summarise it for an AI step.

For an AgentMesh "Custom code" step (custom_python), or any Python 3.9+ runtime.
Standard library only. It reads the public raw GitHub files described in contract/README.md
and returns a compact dict (a few KB) instead of megabytes of raw crash reports.

    from fetch_build_context import run
    run({"build_id": "1038"})        # -> {"build_context": {...}}

Time rule: only builds up to the requested one and tickets created before it are used.
"""
import json
import statistics
import urllib.request
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor

BASE_URL = "https://raw.githubusercontent.com/Magzensar/gaia-mock-game-repo/main"
BASELINE_BUILDS = 10
MAX_DIFF_CHARS = 3000
MAX_CLUSTERS = 8
MAX_TICKETS = 8
REGRESSION_PCT = 10.0  # only used to pick related perf tickets; the agent makes the real call


def _get(path, base_url):
    with urllib.request.urlopen(f"{base_url}/{path}", timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _signature(crash):
    top = crash["stack"][:2]
    return "|".join([crash["exception"]] + [f"{f['file']}:{f['function']}" for f in top])


def _sig_head(sig):
    """Exception plus top frame, e.g. 'TypeError|docs/js/game.js:EAD.loop'."""
    parts = (sig or "").split("|")
    return "|".join(parts[:2]) if len(parts) > 1 else None


def _clusters(crashes, prev_signatures, tickets_before):
    groups = defaultdict(list)
    for c in crashes:
        groups[_signature(c)].append(c)
    out = []
    for sig, items in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        head = _sig_head(sig)
        known_tickets = [t["ticket_id"] for t in tickets_before if _sig_head(t.get("stack_signature")) == head]
        sample = items[0]
        out.append({
            "signature": sig,
            "count": len(items),
            "status": "known" if (sig in prev_signatures or known_tickets) else "new",
            "seen_in_previous_build": sig in prev_signatures,
            "matching_tickets": known_tickets[:3],
            "message": sample["message"],
            "device_families": dict(Counter(c["device_family"] for c in items).most_common()),
            "os_versions": dict(Counter(c["os_version"] for c in items).most_common(4)),
            "levels": dict(Counter(c["level"] for c in items).most_common(4)),
            "sample_stack": sample["stack"],
            "sample_breadcrumbs": sample["breadcrumbs"],
            "sample_crash_ids": [c["crash_id"] for c in items[:3]],
        })
    return out[:MAX_CLUSTERS]


def _perf(perf, baseline):
    def med(values):
        return round(statistics.median(values), 2) if values else None

    def row(cur, base):
        return {"current": cur, "baseline_median": base,
                "change_pct": round(100 * (cur - base) / base, 1) if base else None}

    out = {
        "frame_time_ms_p95": row(perf["frame_time_ms_p95"], med([p["frame_time_ms_p95"] for p in baseline])),
        "load_time_ms_p95": row(perf["load_time_ms_p95"],
                                med([p["load_time_ms_p95"] for p in baseline if "load_time_ms_p95" in p])),
        "levels": {},
        "by_device_family": {},
        "hot_path": perf["hot_path"],
    }
    for lv, v in perf["levels"].items():
        out["levels"][lv] = {
            "frame_time_ms_p95": row(v["frame_time_ms_p95"],
                                     med([p["levels"][lv]["frame_time_ms_p95"] for p in baseline])),
            "memory_mb_peak_p95": row(v["memory_mb_peak_p95"],
                                      med([p["levels"][lv]["memory_mb_peak_p95"] for p in baseline])),
            "hitch_count": v.get("hitch_count"),
        }
    for fam, v in perf["by_device_family"].items():
        out["by_device_family"][fam] = {
            "tier": v["tier"], "sessions": v["sessions"],
            "frame_time_ms_p95": row(v["frame_time_ms_p95"],
                                     med([p["by_device_family"][fam]["frame_time_ms_p95"]
                                          for p in baseline if fam in p["by_device_family"]])),
        }
    return out


def fetch_build_context(build_id, base_url=BASE_URL):
    build_id = str(build_id)
    builds = _get("ci/builds.json", base_url)
    ids = [b["build_id"] for b in builds]
    if build_id not in ids:
        raise ValueError(f"unknown build_id {build_id}; valid: {ids[0]}..{ids[-1]}")
    idx = ids.index(build_id)
    build = builds[idx]
    prev_id = build["parent_build_id"]

    base_ids = ids[max(0, idx - BASELINE_BUILDS):idx]
    paths = [f"ci/builds/{build_id}.json", f"telemetry/crashes/{build_id}.json",
             f"telemetry/perf/{build_id}.json", "tickets/past_tickets.json"]
    paths += [f"telemetry/crashes/{prev_id}.json"] if prev_id else []
    paths += [f"telemetry/perf/{b}.json" for b in base_ids]
    with ThreadPoolExecutor(max_workers=8) as pool:
        got = dict(zip(paths, pool.map(lambda p: _get(p, base_url), paths)))
    commits = got[paths[0]]["commits"]
    crashes, perf, tickets = got[paths[1]], got[paths[2]], got[paths[3]]
    prev_crashes = got[f"telemetry/crashes/{prev_id}.json"] if prev_id else []
    baseline = [got[f"telemetry/perf/{b}.json"] for b in base_ids]

    tickets_before = [t for t in tickets if t["created_at"] < build["created_at"]]

    sessions = perf["sessions"]
    prev_signatures = {_signature(c) for c in prev_crashes}
    clusters = _clusters(crashes, prev_signatures, tickets_before)
    perf_summary = _perf(perf, baseline)

    def regressed(metric):
        if metric == "memory_mb_peak_p95":  # leaks show per area, so look at each area
            rows = [lv[metric] for lv in perf_summary["levels"].values()]
        else:  # frame time and load time: overall figure only (per-area values are noisy)
            rows = [perf_summary[metric]]
        return any((r["change_pct"] or 0) > REGRESSION_PCT for r in rows)

    perf_types = [t for t, m in (("frametime", "frame_time_ms_p95"), ("memory", "memory_mb_peak_p95"),
                                 ("load", "load_time_ms_p95")) if regressed(m)]
    new_files = {c["sample_stack"][0]["file"] for c in clusters if c["status"] == "new"}
    newest_first = sorted(tickets_before, key=lambda t: t["created_at"], reverse=True)
    related = [t for t in newest_first if t["type"] in perf_types]
    related += [t for t in newest_first if t["type"] == "crash" and t["status"] != "duplicate"
                and (_sig_head(t.get("stack_signature")) or "|:").split("|")[1].split(":")[0] in new_files]

    by_device = Counter(c["device_family"] for c in crashes)
    dev_sessions = {f: v["sessions"] for f, v in perf["by_device_family"].items()}
    return {
        "build": build,
        "previous_build_id": prev_id,
        "commits": [{
            "sha": c["sha"], "author": c["author"], "date": c["date"],
            "message": c["message"].split("\n")[0], "files": c["files"],
            "diff": c["diff"][:MAX_DIFF_CHARS] + ("\n...(truncated)" if len(c["diff"]) > MAX_DIFF_CHARS else ""),
        } for c in commits],
        "crashes": {
            "total": len(crashes),
            "previous_build_total": len(prev_crashes),
            "sessions": sessions,
            "crash_rate": round(len(crashes) / sessions, 4),
            "crash_rate_by_device_family": {
                f: round(by_device.get(f, 0) / n, 4) for f, n in dev_sessions.items() if n},
            "clusters": clusters,
        },
        "perf": perf_summary,
        "metrics_up_more_than_10pct": perf_types,
        "baseline_builds": [p["build_id"] for p in baseline],
        "related_tickets": [{k: t[k] for k in ("ticket_id", "title", "type", "status", "stack_signature",
                                               "root_cause", "fix_summary", "created_at", "duplicate_of")}
                            for t in related[:MAX_TICKETS]],
        "notes": [
            "Authors are context only; never use them to rank commits.",
            "Baseline = median of the previous builds listed in baseline_builds (they may include faulty builds).",
            "related_tickets: perf tickets of a type that went up, then crash tickets on the same file as a new cluster, newest first. Known clusters list their own matching_tickets.",
            "Play thresholds: 1.09% crash rate overall, 8% per device family.",
        ],
        "source": "mock",
    }


def run(state):
    """AgentMesh Custom code entry point: reads state['build_id'], returns {'build_context': {...}}."""
    return {"build_context": fetch_build_context(state["build_id"])}


if __name__ == "__main__":
    import sys
    print(json.dumps(run({"build_id": sys.argv[1] if len(sys.argv) > 1 else "1038"}), indent=2))
